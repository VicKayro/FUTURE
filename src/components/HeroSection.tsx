import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Eye, Users } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const HeroSection = () => {
  const [email, setEmail] = useState("");

  const handleJoinBeta = async () => {
    if (!email.includes('@')) return;
    
    try {
      const { error } = await supabase
        .from('beta_signups')
        .insert({ email });
      
      if (error) {
        console.error('Error signing up for beta:', error);
        return;
      }
      
      setEmail("");
      console.log("Successfully signed up for beta:", email);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-hero animate-gradient opacity-20" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-primary rounded-full opacity-10 animate-float" />
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-accent rounded-full opacity-15 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-6">
        {/* Main Title */}
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary shadow-glow animate-pulse-glow mb-6">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-hero bg-clip-text text-transparent animate-gradient">
              Prédisez
            </span>
            <br />
            <span className="text-foreground">n'importe quoi.</span>
            <br />
            <span className="text-accent">Simplement.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            L'assistant prédictif universel qui démocratise la data science. 
            Déposez vos données, posez votre question, obtenez votre réponse.
          </p>
        </div>

        {/* Beta Signup */}
        <Card className="max-w-md mx-auto bg-gradient-card border-border/50 shadow-elegant">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Rejoignez la bêta</h3>
                <p className="text-sm text-muted-foreground">
                  Soyez parmi les premiers à découvrir le futur de la prédiction
                </p>
              </div>
              
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
                <Button 
                  onClick={handleJoinBeta}
                  disabled={!email.includes('@')}
                  className="bg-gradient-primary hover:shadow-glow transition-smooth disabled:opacity-50 px-6"
                >
                  <Zap className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            {
              icon: Eye,
              title: "Transparent",
              description: "Voyez comment vos prédictions sont calculées, étape par étape"
            },
            {
              icon: Zap,
              title: "Instantané", 
              description: "Résultats en moins de 60 secondes, quelle que soit la complexité"
            },
            {
              icon: Users,
              title: "Accessible",
              description: "Aucune connaissance technique requise, juste votre curiosité"
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-gradient-card border-border/30 hover:border-primary/30 hover:shadow-glow transition-smooth group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-smooth">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};