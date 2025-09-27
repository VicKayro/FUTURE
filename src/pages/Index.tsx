import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { PredictionInterface } from "@/components/PredictionInterface";
import { PredictionResults } from "@/components/PredictionResults";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, User, LogOut, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePredictions } from "@/hooks/usePredictions";

const Index = () => {
  const [showPredictionInterface, setShowPredictionInterface] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);
  const { user, loading: authLoading, signOut } = useAuth();
  const { predictions, loading: predictionsLoading } = usePredictions();

  const handleAccessBeta = () => {
    if (!user) {
      setAuthMode('signin');
      setShowAuthModal(true);
      return;
    }
    setShowPredictionInterface(true);
  };

  const handleBackToHero = () => {
    setShowPredictionInterface(false);
    setSelectedPrediction(null);
  };

  const handleSignUpClick = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };
  
  const handleSignInClick = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowPredictionInterface(false);
    setSelectedPrediction(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-primary animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (showPredictionInterface) {
    if (selectedPrediction) {
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
              
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedPrediction(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux prédictions
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </header>

          {/* Results */}
          <main className="container mx-auto px-6 py-12">
            <PredictionResults 
              prediction={selectedPrediction.prediction_result} 
              question={selectedPrediction.question}
            />
          </main>
        </div>
      );
    }

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
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToHero}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Accueil
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Prediction Interface */}
            <div className="lg:col-span-2">
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
            </div>

            {/* Predictions History */}
            <div className="space-y-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Vos prédictions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {predictionsLoading ? (
                    <p className="text-sm text-muted-foreground">Chargement...</p>
                  ) : predictions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucune prédiction pour le moment. Commencez par poser une question !
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {predictions.slice(0, 5).map((prediction) => (
                        <div 
                          key={prediction.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            prediction.status === 'completed' 
                              ? 'border-primary/30 hover:border-primary/50 hover:bg-primary/5' 
                              : 'border-border/30'
                          }`}
                          onClick={() => {
                            if (prediction.status === 'completed' && prediction.prediction_result) {
                              setSelectedPrediction(prediction);
                            }
                          }}
                        >
                          <p className="text-sm font-medium line-clamp-2 mb-2">
                            {prediction.question}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              prediction.status === 'completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : prediction.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {prediction.status === 'completed' ? 'Terminé' : 
                               prediction.status === 'processing' ? 'En cours' : 'Échec'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(prediction.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      {/* Auth & Access Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
        {user ? (
          <Button
            onClick={handleAccessBeta}
            className="bg-gradient-accent text-accent-foreground hover:shadow-accent-glow transition-smooth font-semibold"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Accéder à FUTURE
          </Button>
        ) : (
          <>
            <Button
              onClick={handleSignInClick}
              variant="outline"
              className="bg-background/80 backdrop-blur border-border/50 hover:bg-background"
            >
              <User className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
            <Button
              onClick={handleSignUpClick}
              className="bg-gradient-accent text-accent-foreground hover:shadow-accent-glow transition-smooth font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Créer un compte
            </Button>
          </>
        )}
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        mode={authMode}
      />
    </div>
  );
};

export default Index;