# Vercel Deployment Guide for Cozy Circle Shield

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Prepare your environment variables

## Step-by-Step Deployment Process

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project" or "Import Project"
3. Connect your GitHub account if not already connected
4. Find and select the `liamT86/cozy-circle-shield` repository

### Step 2: Configure Project Settings

1. **Project Name**: `cozy-circle-shield` (or your preferred name)
2. **Framework Preset**: Select "Vite"
3. **Root Directory**: Leave as default (./)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### Step 3: Environment Variables Configuration

**IMPORTANT**: You must add environment variables in the Vercel dashboard, NOT in the vercel.json file.

1. Go to your project dashboard in Vercel
2. Click "Settings" → "Environment Variables"
3. Add the following variables one by one:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_WALLETCONNECT_PROJECT_ID` | `your_walletconnect_project_id` | Production, Preview, Development |
| `VITE_CONTRACT_ADDRESS` | `your_deployed_contract_address` | Production, Preview, Development |
| `VITE_VERIFIER_ADDRESS` | `your_verifier_address` | Production, Preview, Development |
| `VITE_NETWORK` | `sepolia` | Production, Preview, Development |
| `VITE_RPC_URL` | `https://sepolia.gateway.tenderly.co` | Production, Preview, Development |

**How to get WalletConnect Project ID:**
1. Visit [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up/Login with your account
3. Click "Create Project"
4. Enter project name: "Cozy Circle Shield"
5. Copy the Project ID and use it as the value for `VITE_WALLETCONNECT_PROJECT_ID`

**Important Notes:**
- Make sure to add variables to ALL environments (Production, Preview, Development)
- Do NOT add environment variables to vercel.json file
- After adding variables, you need to redeploy your project

### Step 4: Advanced Configuration

1. **Node.js Version**: Set to `18.x` or `20.x`
2. **Build Settings**: 
   - Enable "Automatically expose System Environment Variables"
   - Set "Functions Region" to your preferred region

### Step 5: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-5 minutes)
3. Your app will be available at the provided Vercel URL

### Step 6: Custom Domain (Optional)

1. Go to your project dashboard in Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed by Vercel

## Post-Deployment Checklist

### ✅ Verify Deployment

1. **Frontend Access**: Visit your Vercel URL and ensure the app loads
2. **Wallet Connection**: Test wallet connection functionality
3. **Contract Interaction**: Verify contract interactions work
4. **Responsive Design**: Test on different screen sizes

### ✅ Environment Variables Verification

Ensure all environment variables are properly set:
- [ ] `VITE_WALLETCONNECT_PROJECT_ID` is set
- [ ] `VITE_CONTRACT_ADDRESS` is set
- [ ] `VITE_VERIFIER_ADDRESS` is set
- [ ] `VITE_NETWORK` is set to `sepolia`
- [ ] `VITE_RPC_URL` is set

### ✅ Security Considerations

1. **Environment Variables**: Never commit sensitive data to the repository
2. **API Keys**: Keep your WalletConnect Project ID secure
3. **Contract Addresses**: Verify contract addresses are correct

## Troubleshooting

### Common Issues

1. **Environment Variable "VITE_WALLETCONNECT_PROJECT_ID" references Secret error**:
   - **Solution**: Remove environment variables from vercel.json file
   - Add them directly in Vercel dashboard: Settings → Environment Variables
   - Redeploy your project after adding variables

2. **Function Runtimes must have a valid version error**:
   - **Solution**: Remove functions configuration from vercel.json
   - This project is a static Vite app and doesn't need serverless functions
   - The error occurs when vercel.json includes unnecessary function configurations

3. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are properly installed
   - Check for TypeScript errors

4. **Environment Variables Not Working**:
   - Ensure variables start with `VITE_` prefix
   - Redeploy after adding new environment variables
   - Check variable names for typos
   - Make sure variables are added to ALL environments (Production, Preview, Development)

5. **Wallet Connection Issues**:
   - Verify WalletConnect Project ID is correct
   - Check network configuration
   - Ensure contract addresses are valid

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [WalletConnect Documentation](https://docs.walletconnect.com)
- [Wagmi Documentation](https://wagmi.sh)

## Deployment URLs

After successful deployment, your app will be available at:
- **Production URL**: `https://cozy-circle-shield.vercel.app` (or your custom domain)
- **Preview URLs**: Generated for each pull request

## Monitoring and Analytics

1. **Vercel Analytics**: Enable in project settings for performance monitoring
2. **Error Tracking**: Monitor deployment logs for any issues
3. **Performance**: Use Vercel's built-in performance monitoring

## Updates and Maintenance

1. **Automatic Deployments**: Vercel automatically deploys on every push to main branch
2. **Preview Deployments**: Each pull request gets a preview deployment
3. **Rollbacks**: Easy rollback to previous deployments through Vercel dashboard

---

**Note**: This deployment guide assumes you have already deployed your smart contracts to the Sepolia testnet. If not, please deploy the contracts first using the provided Hardhat scripts.
