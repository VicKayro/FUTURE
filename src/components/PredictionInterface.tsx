import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Sparkles, Brain, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const examples = [
  "Vais-je avoir assez d'argent pour mes vacances ?",
  "Mes ventes vont-elles augmenter le mois prochain ?",
  "Mes dépenses perso vont-elles exploser encore ce mois-ci ?"
];

export const PredictionInterface = () => {
  const [question, setQuestion] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

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
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/pdf',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];
      
      if (allowedTypes.includes(file.type) || file.name.endsWith('.csv')) {
        setUploadedFile(file);
        toast({
          title: "Fichier ajouté",
          description: `${file.name} prêt pour l'analyse`,
        });
      } else {
        toast({
          title: "Format non supporté",
          description: "Veuillez utiliser Excel, CSV, PDF, PowerPoint ou TXT",
          variant: "destructive",
        });
      }
    }
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
  };

  const handlePredict = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour faire une prédiction",
        variant: "destructive",
      });
      return;
    }

    if (!question.trim()) return;

    setIsLoading(true);
    
    try {
      let fileContent = null;
      let fileName = null;
      
      // Handle file upload if present
      if (uploadedFile) {
        const fileBuffer = await uploadedFile.arrayBuffer();
        const fileText = new TextDecoder().decode(fileBuffer);
        fileContent = fileText;
        fileName = uploadedFile.name;
        
        // Upload file to storage
        const filePath = `${user.id}/${Date.now()}-${uploadedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('prediction-files')
          .upload(filePath, uploadedFile);
          
        if (uploadError) {
          console.error('File upload error:', uploadError);
        }
      }

      // Create prediction record
      const { data: prediction, error: insertError } = await supabase
        .from('predictions')
        .insert({
          user_id: user.id,
          question: question.trim(),
          file_name: fileName,
          file_content: fileContent,
          status: 'processing'
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Call edge function to process the prediction
      const { error: functionError } = await supabase.functions.invoke('process-prediction', {
        body: {
          predictionId: prediction.id,
          question: question.trim(),
          fileContent,
          fileName
        }
      });

      if (functionError) {
        throw functionError;
      }

      toast({
        title: "Prédiction lancée !",
        description: "Votre analyse est en cours, elle sera prête dans quelques instants.",
      });

      // Reset form
      setQuestion("");
      setUploadedFile(null);
      
    } catch (error: any) {
      console.error('Prediction error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de lancer la prédiction. Réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                  <p className="font-medium">
                    {uploadedFile ? `Fichier: ${uploadedFile.name}` : "Déposez vos fichiers ici"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Excel, CSV, PDF, PowerPoint, ou TXT
                  </p>
                </div>
              </div>
              </div>

              <Button 
                onClick={handlePredict}
                disabled={!question.trim() || isLoading}
                className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:shadow-glow transition-smooth disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Analyse en cours...' : 'Prédire'}
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