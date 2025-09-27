import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PredictionRequest {
  predictionId: string;
  question: string;
  fileContent?: string;
  fileName?: string;
}

const generateMockPrediction = (question: string, fileContent?: string) => {
  // Simple mock prediction logic based on question content
  const isFinancial = /argent|€|finances|budget|coût/i.test(question);
  const isSales = /vente|vendre|chiffre|business/i.test(question);
  const isPersonal = /perso|personnel|vie|vacances/i.test(question);

  let prediction = {
    confidence: Math.random() * 0.4 + 0.6, // 60-100%
    result: "",
    trend: "stable" as "up" | "down" | "stable",
    insights: [] as string[],
    chart_data: [] as any[]
  };

  if (isFinancial) {
    prediction.result = Math.random() > 0.5 ? "Oui, vous devriez avoir suffisamment d'argent" : "Attention, budget serré prévu";
    prediction.trend = Math.random() > 0.3 ? "up" : "down";
    prediction.insights = [
      "Basé sur vos données historiques",
      "Considérez une épargne de précaution",
      "Surveillez vos dépenses variables"
    ];
    prediction.chart_data = Array.from({length: 6}, (_, i) => ({
      month: `M${i+1}`,
      value: Math.floor(Math.random() * 1000) + 500
    }));
  } else if (isSales) {
    prediction.result = Math.random() > 0.4 ? "Croissance positive attendue" : "Stagnation probable";
    prediction.trend = Math.random() > 0.5 ? "up" : "stable";
    prediction.insights = [
      "Tendance saisonnière détectée",
      "Amélioration possible avec marketing ciblé",
      "Concurrence en hausse"
    ];
    prediction.chart_data = Array.from({length: 6}, (_, i) => ({
      month: `M${i+1}`,
      value: Math.floor(Math.random() * 5000) + 2000
    }));
  } else {
    prediction.result = "Prédiction positive dans l'ensemble";
    prediction.trend = "up";
    prediction.insights = [
      "Évolution favorable prévue",
      "Facteurs externes à surveiller",
      "Recommandations personnalisées disponibles"
    ];
    prediction.chart_data = Array.from({length: 6}, (_, i) => ({
      month: `M${i+1}`,
      value: Math.floor(Math.random() * 100) + 50
    }));
  }

  return prediction;
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: user } = await supabaseClient.auth.getUser(token)
    if (!user.user) {
      throw new Error('Unauthorized')
    }

    const { predictionId, question, fileContent, fileName }: PredictionRequest = await req.json()

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

    // Generate mock prediction
    const predictionResult = generateMockPrediction(question, fileContent)

    // Update prediction in database
    const { error } = await supabaseClient
      .from('predictions')
      .update({
        prediction_result: predictionResult,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', predictionId)
      .eq('user_id', user.user.id)

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, result: predictionResult }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error processing prediction:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})