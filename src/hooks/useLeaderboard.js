import { useState, useEffect } from "react";

export const useLeaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://raw.githubusercontent.com/2187Nick/2187Nick.github.io/main/leaderboard/scores.json",
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }

      const data = await response.json();
      setScores(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const isHighScore = (newScore) => {
    console.log("Checking if score is high enough:", newScore, "Current scores:", scores);
    
    // Always treat 0 or negative scores as not high enough
    if (newScore <= 0) {
      console.log("Score is 0 or negative, not high enough");
      return false;
    }
    
    // Check if the score is higher than any of the current top 3
    if (scores.length < 3) {
      console.log("Less than 3 scores in leaderboard, score is high enough");
      return true;
    }
    
    // If we have 3 scores, check if the new score is higher than the lowest score
    const lowestScore = Math.min(...scores.map(s => s.score));
    console.log("Lowest score in leaderboard:", lowestScore);
    return newScore > lowestScore;
  };

  const submitScore = async (nickname, score) => {
    try {
      // DEPLOYMENT INSTRUCTIONS:
      // 1. Deploy the Cloudflare Worker from api/worker.js
      // 2. Replace the placeholder URL below with your deployed worker URL
      const apiUrl = "https://falling-thunder-fd3b.nick-80f.workers.dev/";
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname,
          score,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit score");
      }

      // After successful submission, refresh the leaderboard
      await fetchLeaderboard();
      
      return { success: true };
    } catch (err) {
      console.error("Error submitting score:", err);
      return { 
        success: false, 
        error: err.message || "Failed to submit score. Please try again."
      };
    }
  };

  return { 
    scores, 
    loading, 
    error, 
    fetchLeaderboard,
    isHighScore,
    submitScore
  };
};
