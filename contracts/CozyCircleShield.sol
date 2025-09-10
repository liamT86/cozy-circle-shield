// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract CozyCircleShield is SepoliaConfig {
    using FHE for *;
    
    struct Circle {
        euint32 circleId;
        euint32 memberCount;
        euint32 messageCount;
        ebool isPrivate;
        ebool isActive;
        string name;
        string description;
        address creator;
        uint256 createdAt;
        uint256 lastActivity;
    }
    
    struct Message {
        euint32 messageId;
        euint32 circleId;
        euint32 senderId;
        ebool isEncrypted;
        string contentHash; // IPFS hash for encrypted content
        address sender;
        uint256 timestamp;
    }
    
    struct Member {
        euint32 memberId;
        euint32 circleId;
        euint32 reputation;
        ebool isActive;
        ebool isModerator;
        address memberAddress;
        uint256 joinedAt;
    }
    
    struct Invitation {
        euint32 invitationId;
        euint32 circleId;
        ebool isUsed;
        address inviter;
        address invitee;
        uint256 createdAt;
        uint256 expiresAt;
    }
    
    mapping(uint256 => Circle) public circles;
    mapping(uint256 => Message) public messages;
    mapping(uint256 => Member) public members;
    mapping(uint256 => Invitation) public invitations;
    mapping(address => euint32) public userReputation;
    mapping(address => uint256[]) public userCircles;
    mapping(address => uint256[]) public userMessages;
    
    uint256 public circleCounter;
    uint256 public messageCounter;
    uint256 public memberCounter;
    uint256 public invitationCounter;
    
    address public owner;
    address public verifier;
    
    event CircleCreated(uint256 indexed circleId, address indexed creator, string name);
    event MemberJoined(uint256 indexed circleId, address indexed member);
    event MessageSent(uint256 indexed messageId, uint256 indexed circleId, address indexed sender);
    event InvitationCreated(uint256 indexed invitationId, uint256 indexed circleId, address indexed inviter, address invitee);
    event ReputationUpdated(address indexed user, uint32 reputation);
    event CircleDeactivated(uint256 indexed circleId);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createCircle(
        string memory _name,
        string memory _description,
        bool _isPrivate
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Circle name cannot be empty");
        require(bytes(_description).length > 0, "Circle description cannot be empty");
        
        uint256 circleId = circleCounter++;
        
        circles[circleId] = Circle({
            circleId: FHE.asEuint32(0), // Will be set properly later
            memberCount: FHE.asEuint32(1), // Creator is first member
            messageCount: FHE.asEuint32(0),
            isPrivate: FHE.asEbool(_isPrivate),
            isActive: FHE.asEbool(true),
            name: _name,
            description: _description,
            creator: msg.sender,
            createdAt: block.timestamp,
            lastActivity: block.timestamp
        });
        
        // Add creator as first member
        uint256 memberId = memberCounter++;
        members[memberId] = Member({
            memberId: FHE.asEuint32(0), // Will be set properly later
            circleId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            reputation: FHE.asEuint32(100), // Initial reputation
            isActive: FHE.asEbool(true),
            isModerator: FHE.asEbool(true), // Creator is moderator
            memberAddress: msg.sender,
            joinedAt: block.timestamp
        });
        
        userCircles[msg.sender].push(circleId);
        
        emit CircleCreated(circleId, msg.sender, _name);
        return circleId;
    }
    
    function sendMessage(
        uint256 circleId,
        string memory contentHash,
        externalEuint32 encryptedContent,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(circles[circleId].creator != address(0), "Circle does not exist");
        require(circles[circleId].isActive, "Circle is not active");
        require(isMember(circleId, msg.sender), "Only members can send messages");
        
        uint256 messageId = messageCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalContent = FHE.fromExternal(encryptedContent, inputProof);
        
        messages[messageId] = Message({
            messageId: FHE.asEuint32(0), // Will be set properly later
            circleId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            senderId: FHE.asEuint32(0), // Will be determined from member mapping
            isEncrypted: FHE.asEbool(true),
            contentHash: contentHash,
            sender: msg.sender,
            timestamp: block.timestamp
        });
        
        // Update circle message count
        circles[circleId].messageCount = FHE.add(circles[circleId].messageCount, FHE.asEuint32(1));
        circles[circleId].lastActivity = block.timestamp;
        
        userMessages[msg.sender].push(messageId);
        
        emit MessageSent(messageId, circleId, msg.sender);
        return messageId;
    }
    
    function createInvitation(
        uint256 circleId,
        address invitee
    ) public returns (uint256) {
        require(circles[circleId].creator != address(0), "Circle does not exist");
        require(isMember(circleId, msg.sender), "Only members can create invitations");
        require(invitee != address(0), "Invalid invitee address");
        require(!isMember(circleId, invitee), "User is already a member");
        
        uint256 invitationId = invitationCounter++;
        
        invitations[invitationId] = Invitation({
            invitationId: FHE.asEuint32(0), // Will be set properly later
            circleId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            isUsed: FHE.asEbool(false),
            inviter: msg.sender,
            invitee: invitee,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + 7 days // Invitation expires in 7 days
        });
        
        emit InvitationCreated(invitationId, circleId, msg.sender, invitee);
        return invitationId;
    }
    
    function acceptInvitation(uint256 invitationId) public {
        require(invitations[invitationId].invitee == msg.sender, "Not authorized to accept this invitation");
        require(block.timestamp <= invitations[invitationId].expiresAt, "Invitation has expired");
        require(!FHE.decrypt(invitations[invitationId].isUsed), "Invitation already used");
        
        uint256 circleId = uint256(FHE.decrypt(invitations[invitationId].circleId));
        
        // Add member to circle
        uint256 memberId = memberCounter++;
        members[memberId] = Member({
            memberId: FHE.asEuint32(0), // Will be set properly later
            circleId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            reputation: FHE.asEuint32(50), // Initial reputation for new members
            isActive: FHE.asEbool(true),
            isModerator: FHE.asEbool(false),
            memberAddress: msg.sender,
            joinedAt: block.timestamp
        });
        
        // Update circle member count
        circles[circleId].memberCount = FHE.add(circles[circleId].memberCount, FHE.asEuint32(1));
        circles[circleId].lastActivity = block.timestamp;
        
        // Mark invitation as used
        invitations[invitationId].isUsed = FHE.asEbool(true);
        
        userCircles[msg.sender].push(circleId);
        
        emit MemberJoined(circleId, msg.sender);
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        userReputation[user] = reputation;
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function deactivateCircle(uint256 circleId) public {
        require(circles[circleId].creator == msg.sender, "Only creator can deactivate circle");
        require(circles[circleId].isActive, "Circle is already inactive");
        
        circles[circleId].isActive = FHE.asEbool(false);
        emit CircleDeactivated(circleId);
    }
    
    function isMember(uint256 circleId, address user) public view returns (bool) {
        uint256[] memory userCircleList = userCircles[user];
        for (uint256 i = 0; i < userCircleList.length; i++) {
            if (userCircleList[i] == circleId) {
                return true;
            }
        }
        return false;
    }
    
    function getCircleInfo(uint256 circleId) public view returns (
        string memory name,
        string memory description,
        uint8 memberCount,
        uint8 messageCount,
        bool isPrivate,
        bool isActive,
        address creator,
        uint256 createdAt,
        uint256 lastActivity
    ) {
        Circle storage circle = circles[circleId];
        return (
            circle.name,
            circle.description,
            0, // FHE.decrypt(circle.memberCount) - will be decrypted off-chain
            0, // FHE.decrypt(circle.messageCount) - will be decrypted off-chain
            FHE.decrypt(circle.isPrivate),
            FHE.decrypt(circle.isActive),
            circle.creator,
            circle.createdAt,
            circle.lastActivity
        );
    }
    
    function getMessageInfo(uint256 messageId) public view returns (
        uint8 circleId,
        uint8 senderId,
        bool isEncrypted,
        string memory contentHash,
        address sender,
        uint256 timestamp
    ) {
        Message storage message = messages[messageId];
        return (
            0, // FHE.decrypt(message.circleId) - will be decrypted off-chain
            0, // FHE.decrypt(message.senderId) - will be decrypted off-chain
            FHE.decrypt(message.isEncrypted),
            message.contentHash,
            message.sender,
            message.timestamp
        );
    }
    
    function getUserReputation(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(userReputation[user]) - will be decrypted off-chain
    }
    
    function getUserCircles(address user) public view returns (uint256[] memory) {
        return userCircles[user];
    }
    
    function getUserMessages(address user) public view returns (uint256[] memory) {
        return userMessages[user];
    }
}
