import { Header } from "@/components/Header";
import { CircleCard } from "@/components/CircleCard";
import { Button } from "@/components/ui/button";
import { Plus, Shield, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-community.jpg";

const Index = () => {
  const sampleCircles = [
    {
      name: "Close Friends",
      description: "Share life updates with your inner circle",
      members: 8,
      isPrivate: true,
      lastActivity: "2 hours ago"
    },
    {
      name: "Book Club Confidential",
      description: "Discuss books without judgment",
      members: 15,
      isPrivate: true,
      lastActivity: "1 day ago"
    },
    {
      name: "Family Secrets",
      description: "Private family discussions and updates",
      members: 12,
      isPrivate: true,
      lastActivity: "3 hours ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-medium">
                <Shield className="w-5 h-5" />
                <span>Fully Homomorphic Encryption</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your secrets stay
                <span className="block text-transparent bg-gradient-primary bg-clip-text">
                  truly private
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Create intimate friend circles where your conversations are protected by cutting-edge encryption. Share freely, knowing your privacy is absolute.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Link to="/create-circle">
                <Button className="bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-warm rounded-2xl px-8 py-3 text-lg font-medium text-primary-foreground">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Circle
                </Button>
              </Link>
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-2xl px-8 py-3 text-lg font-medium transition-all duration-300">
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-secondary" />
                <span className="text-sm text-muted-foreground">End-to-end encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                <span className="text-sm text-muted-foreground">Invite-only circles</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 animate-gentle-bounce"></div>
            <img 
              src={heroImage} 
              alt="Cozy community of friends sharing private moments"
              className="relative rounded-3xl shadow-warm w-full h-auto"
            />
          </div>
        </div>
      </section>
      
      {/* Circles Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Your Private Circles</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join exclusive communities where every message is protected by FHE encryption
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sampleCircles.map((circle, index) => (
            <CircleCard key={index} {...circle} />
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/create-circle">
            <Button className="bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-soft rounded-2xl px-8 py-3 text-primary-foreground font-medium">
              <Plus className="w-5 h-5 mr-2" />
              Create New Circle
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
