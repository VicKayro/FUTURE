import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Prediction {
  id: string;
  question: string;
  file_name?: string;
  file_content?: string;
  prediction_result?: any;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const usePredictions = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setPredictions([]);
      setLoading(false);
      return;
    }

    const fetchPredictions = async () => {
      try {
        const { data, error } = await supabase
          .from('predictions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching predictions:', error);
          return;
        }

        setPredictions(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();

    // Set up real-time subscription
    const subscription = supabase
      .channel('predictions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'predictions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setPredictions(prev => 
              prev.map(p => 
                p.id === payload.new.id 
                  ? { ...p, ...payload.new }
                  : p
              )
            );
          } else if (payload.eventType === 'INSERT') {
            setPredictions(prev => [payload.new as Prediction, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    predictions,
    loading,
  };
};