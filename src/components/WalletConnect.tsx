import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card } from "@/components/ui/card";

export const WalletConnect = () => {
  return (
    <Card className="p-2 bg-gradient-card shadow-card border-border/50">
      <ConnectButton 
        chainStatus="icon"
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
        showBalance={{
          smallScreen: false,
          largeScreen: true,
        }}
      />
    </Card>
  );
};