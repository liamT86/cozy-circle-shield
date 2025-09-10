import { Shield, Users } from "lucide-react";
import { WalletConnect } from "./WalletConnect";

export const Header = () => {
  return (
    <header className="w-full bg-gradient-soft border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-primary shadow-card">
            <Shield className="w-5 h-5 text-primary-foreground" />
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">FHE Protected Community</h1>
            <p className="text-sm text-muted-foreground">Confidential Friend Circles</p>
          </div>
        </div>
        
        <WalletConnect />
      </div>
    </header>
  );
};