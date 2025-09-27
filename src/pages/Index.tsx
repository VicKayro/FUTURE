import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { PredictionInterface } from "@/components/PredictionInterface";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

const Index = () => {
  const [showPredictionInterface, setShowPredictionInterface] = useState(false);

  const handleAccessBeta = () => {
    setShowPredictionInterface(true);
  };

  const handleBackToHero = () => {
    setShowPredictionInterface(false);
  };

  if (showPredictionInterface) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                FUTURE
              </span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToHero}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="text-foreground">Bienvenue dans </span>
              <span className="bg-gradient-primary bg-clip-text text-transparent">FUTURE</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Votre assistant prédictif est prêt. Posez votre question ou déposez vos données pour commencer.
            </p>
          </div>

          <PredictionInterface />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      {/* Demo Access Button - For development purposes */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleAccessBeta}
          className="bg-gradient-accent text-accent-foreground hover:shadow-accent-glow transition-smooth font-semibold"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Accéder à la Bêta
        </Button>
      </div>
    </div>
  );
};

export default Index;