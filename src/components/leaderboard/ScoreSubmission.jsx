import React, { useState } from "react";
import { useLeaderboard } from "../../hooks/useLeaderboard";

const ScoreSubmission = ({ score, onClose, onSubmitSuccess }) => {
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { submitScore } = useLeaderboard();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      setError("Please enter a nickname");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const result = await submitScore(nickname.trim(), score);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to submit score");
      }

      setSuccess(true);
      
      if (onSubmitSuccess) {
        onSubmitSuccess(nickname.trim(), score);
      }
      
      // Wait a moment before closing
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error submitting score:", err);
      setError(err.message || "Failed to submit score. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{
        backgroundColor: "rgba(22, 163, 74, 0.2)",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        border: "1px solid #22c55e"
      }}>
        <h2 style={{ color: "#4ade80", marginBottom: "16px" }}>Score Submitted!</h2>
        <p>Your score of <span style={{ fontWeight: "bold", color: "#f59e0b" }}>{score}</span> has been submitted as <span style={{ fontWeight: "bold" }}>{nickname}</span>.</p>
        <p style={{ marginBottom: "20px" }}>The leaderboard will be updated shortly.</p>
        <button 
          onClick={onClose}
          style={{
            padding: "8px 16px",
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      borderRadius: "8px",
      padding: "24px",
      border: "1px solid #38bdf8",
      boxShadow: "0 0 20px rgba(56, 189, 248, 0.2)",
      width: "100%",
      maxWidth: "400px",
      margin: "0 auto"
    }}>
      <h2 style={{ color: "#38bdf8", marginBottom: "16px", textAlign: "center" }}>Submit Your Score: {score}</h2>
      
      {error && (
        <p style={{ 
          color: "#ef4444", 
          backgroundColor: "rgba(239, 68, 68, 0.1)", 
          padding: "10px", 
          borderRadius: "4px", 
          marginBottom: "16px" 
        }}>
          {error}
        </p>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label 
            htmlFor="nickname" 
            style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold" 
            }}
          >
            Nickname:
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            maxLength={15}
            disabled={submitting}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #38bdf8",
              backgroundColor: "rgba(56, 189, 248, 0.1)",
              color: "white",
              outline: "none"
            }}
          />
        </div>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          gap: "12px" 
        }}>
          <button 
            type="submit" 
            disabled={submitting}
            style={{
              flex: "1",
              padding: "10px",
              backgroundColor: submitting ? "#6b7280" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: "bold"
            }}
          >
            {submitting ? "Submitting..." : "Submit Score"}
          </button>
          
          <button 
            type="button" 
            onClick={onClose} 
            disabled={submitting}
            style={{
              flex: "1",
              padding: "10px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: "bold"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScoreSubmission;
