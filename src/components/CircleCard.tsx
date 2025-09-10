import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Lock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface CircleCardProps {
  name: string;
  description: string;
  members: number;
  isPrivate: boolean;
  lastActivity: string;
}

export const CircleCard = ({ name, description, members, isPrivate, lastActivity }: CircleCardProps) => {
  return (
    <Card className="p-6 bg-gradient-card hover:shadow-warm transition-all duration-300 border-border/50 rounded-3xl group hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-soft">
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {isPrivate && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary-soft">
            <Lock className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">FHE</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{members} members</span>
          </div>
          <span>•</span>
          <span>{lastActivity}</span>
        </div>
      </div>
      
      <Link to={`/circle/${name.toLowerCase().replace(/\s+/g, '-')}`}>
        <Button className="w-full bg-background text-foreground border border-border/50 hover:bg-muted hover:shadow-soft transition-all duration-300 rounded-2xl">
          Join Circle
        </Button>
      </Link>
    </Card>
  );
};