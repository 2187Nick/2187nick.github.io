import React, { useState, useEffect } from "react";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import ScoreSubmission from "./ScoreSubmission";
import LeaderboardComponent from "./LeaderboardComponent";

const GameOverModal = ({ score, onRestart, onClose, isWin }) => {
  const [showSubmission, setShowSubmission] = useState(false);
  const { isHighScore, fetchLeaderboard } = useLeaderboard();
  const [isHighEnough, setIsHighEnough] = useState(false);
  
  useEffect(() => {
    // Refresh leaderboard data when modal opens
    fetchLeaderboard().then(() => {
      // After refreshing, check if the score is high enough
      const highEnough = isHighScore(score);
      console.log("GameOverModal rendered - Score:", score, "IsWin:", isWin, "High enough:", highEnough);
      setIsHighEnough(highEnough);
    });
  }, [score, isHighScore, fetchLeaderboard]);

  const handleSubmitSuccess = async () => {
    console.log("Score submitted successfully, refreshing leaderboard");
    // Refresh leaderboard data after successful submission
    await fetchLeaderboard();
    setIsHighEnough(false); // Hide the submission button after submitting
  };

  if (showSubmission) {
    return (
      <div className="game-over-modal">
        <ScoreSubmission 
          score={score} 
          onClose={() => setShowSubmission(false)} 
          onSubmitSuccess={handleSubmitSuccess}
        />
      </div>
    );
  }

  console.log("Rendering GameOverModal with score:", score, "isWin:", isWin);
  
  return (
    <div className="game-over-modal" style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      padding: "20px",
      borderRadius: "8px",
      border: "2px solid #38bdf8",
      boxShadow: "0 0 20px rgba(56, 189, 248, 0.5)",
      color: "white",
      width: "90%",
      maxWidth: "500px",
      maxHeight: "80vh",
      overflow: "auto",
      zIndex: 10000,
      textAlign: "center"
    }}>
      <h2 style={{ 
        color: isWin ? "#4ade80" : "#ef4444", 
        fontSize: "24px",
        marginBottom: "16px" 
      }}>
        {isWin ? "You Win!" : "Game Over"}
      </h2>
      
      <p style={{ 
        fontSize: "20px", 
        marginBottom: "24px" 
      }}>
        Your Score: <span style={{ color: "#f59e0b", fontWeight: "bold" }}>{score}</span>
      </p>
      
      {isHighEnough && (
        <div style={{ 
          marginBottom: "24px",
          padding: "12px",
          backgroundColor: "rgba(79, 70, 229, 0.2)",
          borderRadius: "6px",
          border: "1px solid #6366f1"
        }}>
          <p style={{ marginBottom: "12px", color: "#c4b5fd" }}>
            🏆 Congratulations! You got a high score!
          </p>
          <button 
            onClick={() => setShowSubmission(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6366f1",
              border: "none",
              borderRadius: "4px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Submit Score
          </button>
        </div>
      )}
      
      <div style={{ marginBottom: "24px" }}>
        <LeaderboardComponent />
      </div>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
        <button 
          onClick={onRestart}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            border: "none",
            borderRadius: "4px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Play Again
        </button>
        <button 
          onClick={onClose}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6b7280",
            border: "none",
            borderRadius: "4px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
