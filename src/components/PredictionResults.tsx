import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Eye } from "lucide-react";

interface PredictionData {
  confidence: number;
  result: string;
  trend: "up" | "down" | "stable";
  insights: string[];
  chart_data: Array<{ month: string; value: number }>;
}

interface PredictionResultsProps {
  prediction: PredictionData;
  question: string;
}

export const PredictionResults = ({ prediction, question }: PredictionResultsProps) => {
  const getTrendIcon = () => {
    switch (prediction.trend) {
      case "up":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "down":
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getTrendColor = () => {
    switch (prediction.trend) {
      case "up":
        return "bg-green-500";
      case "down":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Résultat de votre prédiction</CardTitle>
            <div className="flex items-center space-x-2">
              {getTrendIcon()}
              <Badge variant="secondary" className={`${getTrendColor()} text-white`}>
                {prediction.trend === "up" ? "Hausse" : prediction.trend === "down" ? "Baisse" : "Stable"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Question posée:</p>
              <p className="font-medium italic">"{question}"</p>
            </div>
            
            <div>
              <p className="text-lg font-semibold text-primary">{prediction.result}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Niveau de confiance</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(prediction.confidence * 100)}%
                </span>
              </div>
              <Progress value={prediction.confidence * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Évolution prévue</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {prediction.chart_data.map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div
                  className="bg-gradient-primary rounded-t-sm min-h-[20px] w-full transition-all duration-1000 ease-out"
                  style={{
                    height: `${(item.value / Math.max(...prediction.chart_data.map(d => d.value))) * 200}px`,
                    animationDelay: `${index * 0.1}s`
                  }}
                />
                <span className="text-xs text-muted-foreground">{item.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Insights & Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {prediction.insights.map((insight, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{insight}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};