import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Lock, Users, Send, Heart, MessageCircle, Share } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CircleDetail = () => {
  const { circleId } = useParams();
  const { toast } = useToast();
  const [newUpdate, setNewUpdate] = useState("");
  const [isMember, setIsMember] = useState(false);

  // Mock data - would come from API/database
  const circleData = {
    name: "Close Friends",
    description: "Share life updates with your inner circle",
    members: 8,
    isPrivate: true,
    posts: [
      {
        id: 1,
        author: "Sarah Chen",
        avatar: "",
        content: "Just got promoted at work! Can't believe this is happening 🎉",
        timestamp: "2 hours ago",
        likes: 5,
        comments: 2
      },
      {
        id: 2,
        author: "Mike Johnson",
        avatar: "",
        content: "Had the most amazing weekend trip. Sometimes you need to disconnect and just breathe.",
        timestamp: "1 day ago",
        likes: 8,
        comments: 4
      },
      {
        id: 3,
        author: "Emma Rodriguez",
        avatar: "",
        content: "Struggling with some personal stuff lately. Grateful to have this safe space to share.",
        timestamp: "2 days ago",
        likes: 12,
        comments: 6
      }
    ]
  };

  const handleJoinCircle = () => {
    setIsMember(true);
    toast({
      title: "Welcome to the circle!",
      description: "You can now share updates and see encrypted content."
    });
  };

  const handlePostUpdate = () => {
    if (!newUpdate.trim()) {
      toast({
        title: "Please write something",
        description: "Your life update cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Update shared!",
      description: "Your encrypted life update has been posted to the circle."
    });
    setNewUpdate("");
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Circle Header */}
        <Card className="bg-gradient-card border-border/50 rounded-3xl shadow-soft mb-6">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-soft">
                  <MessageCircle className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{circleData.name}</h1>
                  <p className="text-muted-foreground">{circleData.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{circleData.members} members</span>
                    </div>
                    {circleData.isPrivate && (
                      <Badge className="bg-primary-soft text-primary border-0">
                        <Lock className="w-3 h-3 mr-1" />
                        FHE Protected
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {!isMember ? (
                <Button 
                  onClick={handleJoinCircle}
                  className="bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-warm rounded-2xl px-6 text-primary-foreground"
                >
                  Join Circle
                </Button>
              ) : (
                <Badge variant="secondary" className="px-4 py-2">Member</Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Post Life Update */}
        {isMember && (
          <Card className="bg-gradient-card border-border/50 rounded-3xl shadow-soft mb-6">
            <CardHeader>
              <h2 className="font-semibold text-foreground">Share a Life Update</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's happening in your life? Share openly with your circle..."
                value={newUpdate}
                onChange={(e) => setNewUpdate(e.target.value)}
                className="rounded-2xl border-border/50 min-h-[120px]"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Encrypted and visible only to circle members
                </p>
                <Button 
                  onClick={handlePostUpdate}
                  className="bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-soft rounded-2xl px-6 text-primary-foreground"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Share Update
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Life Updates Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Life Updates</h2>
          
          {!isMember ? (
            <Card className="bg-gradient-card border-border/50 rounded-3xl shadow-soft">
              <CardContent className="p-8 text-center">
                <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Join to See Updates</h3>
                <p className="text-muted-foreground mb-4">
                  This circle's life updates are encrypted and only visible to members.
                </p>
                <Button 
                  onClick={handleJoinCircle}
                  className="bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-warm rounded-2xl px-8 text-primary-foreground"
                >
                  Join Circle Now
                </Button>
              </CardContent>
            </Card>
          ) : (
            circleData.posts.map((post) => (
              <Card key={post.id} className="bg-gradient-card border-border/50 rounded-3xl shadow-soft hover:shadow-warm transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">{post.author}</h4>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                      </div>
                      
                      <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>
                      
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                          <Share className="w-4 h-4" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CircleDetail;