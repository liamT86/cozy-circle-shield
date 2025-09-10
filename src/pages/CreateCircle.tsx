import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Users, Lock, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCreateCircle } from "@/hooks/useContract";
import { useAccount } from "wagmi";

const CreateCircle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { createCircle, isLoading } = useCreateCircle();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: true,
    maxMembers: 50
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a circle.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Please fill all fields",
        description: "Circle name and description are required.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await createCircle({
        args: [formData.name, formData.description, formData.isPrivate],
      });

      if (result) {
        toast({
          title: "Circle Created Successfully!",
          description: `"${formData.name}" is now live and encrypted with FHE protection.`
        });

        // Navigate to the new circle
        setTimeout(() => {
          navigate(`/circle/${formData.name.toLowerCase().replace(/\s+/g, '-')}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating circle:", error);
      toast({
        title: "Error Creating Circle",
        description: "There was an error creating your circle. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Create Your Private Circle</h1>
            <p className="text-muted-foreground">Start an encrypted community for your closest friends</p>
          </div>

          <Card className="bg-gradient-card border-border/50 rounded-3xl shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Circle Details
              </CardTitle>
              <CardDescription>
                All conversations will be protected with Fully Homomorphic Encryption
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Circle Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Close Friends, Family Circle"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-2xl border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What's this circle about? Share the vibe..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="rounded-2xl border-border/50 min-h-[100px]"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-primary-soft/20">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />
                        <Label htmlFor="private">FHE Encryption</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enable maximum privacy protection
                      </p>
                    </div>
                    <Switch
                      id="private"
                      checked={formData.isPrivate}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxMembers" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Maximum Members
                    </Label>
                    <Input
                      id="maxMembers"
                      type="number"
                      min="2"
                      max="100"
                      value={formData.maxMembers}
                      onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                      className="rounded-2xl border-border/50"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading || !isConnected}
                  className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-warm rounded-2xl py-3 text-lg font-medium text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Circle...
                    </>
                  ) : (
                    "Create Circle"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateCircle;