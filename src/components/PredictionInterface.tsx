import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Sparkles, Brain, TrendingUp } from "lucide-react";

const examples = [
  "Vais-je avoir assez d'argent pour mes vacances ?",
  "Mes ventes vont-elles augmenter le mois prochain ?",
  "Mes dépenses perso vont-elles exploser encore ce mois-ci ?"
];

export const PredictionInterface = () => {
  const [question, setQuestion] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here
    console.log("Files dropped:", e.dataTransfer.files);
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
  };

  const handlePredict = () => {
    console.log("Predicting:", question);
    // Handle prediction logic here
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Main Question Input */}
      <Card className="bg-gradient-card border-border/50 shadow-elegant">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary shadow-glow animate-pulse-glow">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Posez votre question
              </h2>
              <p className="text-muted-foreground">
                Décrivez ce que vous voulez prédire ou déposez vos données
              </p>
            </div>

            <div className="space-y-4">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Mes ventes vont-elles augmenter le mois prochain ?"
                className="h-14 text-lg bg-background/50 border-border/50 focus:border-primary/50 transition-smooth"
              />

              {/* File Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-lg p-8 text-center transition-smooth cursor-pointer
                  ${isDragging 
                    ? 'border-primary bg-primary/5 shadow-glow' 
                    : 'border-border/50 hover:border-primary/30 hover:bg-background/30'
                  }
                `}
              >
                <div className="flex flex-col items-center space-y-3">
                  <Upload className={`w-8 h-8 transition-smooth ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="space-y-1">
                    <p className="font-medium">Déposez vos fichiers ici</p>
                    <p className="text-sm text-muted-foreground">
                      Excel, CSV, PDF, PowerPoint, ou TXT
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handlePredict}
                disabled={!question.trim()}
                className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:shadow-glow transition-smooth disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Prédire
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Questions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-muted-foreground">
          Ou essayez ces exemples
        </h3>
        <div className="grid gap-3">
          {examples.map((example, index) => (
            <Card 
              key={index}
              className="cursor-pointer group hover:shadow-glow transition-smooth bg-gradient-card border-border/30 hover:border-primary/30"
              onClick={() => handleExampleClick(example)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-smooth">
                    <TrendingUp className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-sm font-medium group-hover:text-primary transition-smooth">
                    {example}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};