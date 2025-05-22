import React, { useState, useEffect } from "react";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import ScoreSubmission from "./ScoreSubmission";
import LeaderboardComponent from "./LeaderboardComponent";

const GameOverModal = ({ score, onRestart, onClose, isWin }) => {
  const [showSubmission, setShowSubmission] = useState(false);
  const { isHighScore, fetchLeaderboard } = useLeaderboard();
  const [isHighEnough, setIsHighEnough] = useState(false);
  
  useEffect(() => {

    console.log("Now try and fetch leaderboard data");
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
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          padding: '2rem',
          borderRadius: '8px',
          border: '5px solid #ff3800',
          boxShadow: '0 0 30px rgba(255, 56, 0, 0.8)',
          width: '90%',
          maxWidth: '500px'
        }}>
          <ScoreSubmission 
            score={score}
            onClose={() => setShowSubmission(false)}
            onSubmitSuccess={handleSubmitSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        padding: '2rem',
        borderRadius: '8px',
        border: '5px solid #ff3800',
        boxShadow: '0 0 30px rgba(255, 56, 0, 0.8)',
        color: 'white',
        width: '90%',
        maxWidth: '500px',
        textAlign: 'center'
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
    </div>
  );
};

export default GameOverModal;
