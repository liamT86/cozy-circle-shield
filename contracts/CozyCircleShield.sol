// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CozyCircleShield {
    
    struct Circle {
        uint256 circleId;
        uint256 memberCount;
        uint256 messageCount;
        bool isPrivate;
        bool isActive;
        string name;
        string description;
        address creator;
        uint256 createdAt;
        uint256 lastActivity;
    }
    
    struct Message {
        uint256 messageId;
        uint256 circleId;
        uint256 senderId;
        bool isEncrypted;
        string contentHash; // IPFS hash for encrypted content
        address sender;
        uint256 timestamp;
    }
    
    struct Member {
        uint256 memberId;
        uint256 circleId;
        uint256 reputation;
        bool isActive;
        bool isModerator;
        address memberAddress;
        uint256 joinedAt;
    }
    
    struct Invitation {
        uint256 invitationId;
        uint256 circleId;
        bool isUsed;
        address inviter;
        address invitee;
        uint256 createdAt;
        uint256 expiresAt;
    }
    
    mapping(uint256 => Circle) public circles;
    mapping(uint256 => Message) public messages;
    mapping(uint256 => Member) public members;
    mapping(uint256 => Invitation) public invitations;
    mapping(address => uint256) public userReputation;
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
    event ReputationUpdated(address indexed user, uint256 reputation);
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
            circleId: circleId,
            memberCount: 1, // Creator is first member
            messageCount: 0,
            isPrivate: _isPrivate,
            isActive: true,
            name: _name,
            description: _description,
            creator: msg.sender,
            createdAt: block.timestamp,
            lastActivity: block.timestamp
        });
        
        // Add creator as first member
        uint256 memberId = memberCounter++;
        members[memberId] = Member({
            memberId: memberId,
            circleId: circleId,
            reputation: 100, // Initial reputation
            isActive: true,
            isModerator: true, // Creator is moderator
            memberAddress: msg.sender,
            joinedAt: block.timestamp
        });
        
        userCircles[msg.sender].push(circleId);
        
        emit CircleCreated(circleId, msg.sender, _name);
        return circleId;
    }
    
    function sendMessage(
        uint256 circleId,
        string memory contentHash
    ) public returns (uint256) {
        require(circles[circleId].creator != address(0), "Circle does not exist");
        require(circles[circleId].isActive, "Circle is not active");
        require(isMember(circleId, msg.sender), "Only members can send messages");
        
        uint256 messageId = messageCounter++;
        
        messages[messageId] = Message({
            messageId: messageId,
            circleId: circleId,
            senderId: 0, // Will be determined from member mapping
            isEncrypted: true,
            contentHash: contentHash,
            sender: msg.sender,
            timestamp: block.timestamp
        });
        
        // Update circle message count
        circles[circleId].messageCount++;
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
            invitationId: invitationId,
            circleId: circleId,
            isUsed: false,
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
        require(!invitations[invitationId].isUsed, "Invitation already used");
        
        uint256 circleId = invitations[invitationId].circleId;
        
        // Add member to circle
        uint256 memberId = memberCounter++;
        members[memberId] = Member({
            memberId: memberId,
            circleId: circleId,
            reputation: 50, // Initial reputation for new members
            isActive: true,
            isModerator: false,
            memberAddress: msg.sender,
            joinedAt: block.timestamp
        });
        
        // Update circle member count
        circles[circleId].memberCount++;
        circles[circleId].lastActivity = block.timestamp;
        
        // Mark invitation as used
        invitations[invitationId].isUsed = true;
        
        userCircles[msg.sender].push(circleId);
        
        emit MemberJoined(circleId, msg.sender);
    }
    
    function updateReputation(address user, uint256 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        userReputation[user] = reputation;
        emit ReputationUpdated(user, reputation);
    }
    
    function deactivateCircle(uint256 circleId) public {
        require(circles[circleId].creator == msg.sender, "Only creator can deactivate circle");
        require(circles[circleId].isActive, "Circle is already inactive");
        
        circles[circleId].isActive = false;
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
        uint256 memberCount,
        uint256 messageCount,
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
            circle.memberCount,
            circle.messageCount,
            circle.isPrivate,
            circle.isActive,
            circle.creator,
            circle.createdAt,
            circle.lastActivity
        );
    }
    
    function getMessageInfo(uint256 messageId) public view returns (
        uint256 circleId,
        uint256 senderId,
        bool isEncrypted,
        string memory contentHash,
        address sender,
        uint256 timestamp
    ) {
        Message storage message = messages[messageId];
        return (
            message.circleId,
            message.senderId,
            message.isEncrypted,
            message.contentHash,
            message.sender,
            message.timestamp
        );
    }
    
    function getUserReputation(address user) public view returns (uint256) {
        return userReputation[user];
    }
    
    function getUserCircles(address user) public view returns (uint256[] memory) {
        return userCircles[user];
    }
    
    function getUserMessages(address user) public view returns (uint256[] memory) {
        return userMessages[user];
    }
}