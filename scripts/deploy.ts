import { ethers } from "hardhat";

async function main() {
  console.log("Deploying CozyCircleShield contract...");

  // Get the contract factory
  const CozyCircleShield = await ethers.getContractFactory("CozyCircleShield");

  // Deploy the contract with a verifier address (you can change this to your verifier address)
  const verifierAddress = "0x742d35Cc6634C5532C69bE16d4a7B5"; // Replace with actual verifier address
  const cozyCircleShield = await CozyCircleShield.deploy(verifierAddress);

  await cozyCircleShield.waitForDeployment();

  const contractAddress = await cozyCircleShield.getAddress();
  console.log("CozyCircleShield deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    verifierAddress,
    network: "sepolia",
    deployedAt: new Date().toISOString(),
  };

  console.log("Deployment info:", deploymentInfo);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
