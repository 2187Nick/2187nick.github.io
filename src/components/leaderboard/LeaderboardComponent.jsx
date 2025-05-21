import React from "react";
import { useLeaderboard } from "../../hooks/useLeaderboard";

const LeaderboardComponent = () => {
  const { scores, loading, error, fetchLeaderboard } = useLeaderboard();

  if (loading) {
    return (
      <div className="leaderboard">
        <h2>🏆 High Scores</h2>
        <p>Loading scores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard">
        <h2>🏆 High Scores</h2>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="leaderboard" style={{ textAlign: "center" }}>
      <h2 style={{ color: "#38bdf8", marginBottom: "12px" }}>🏆 High Scores</h2>
      <table style={{ 
        width: "100%", 
        borderCollapse: "collapse", 
        marginTop: "8px",
        color: "white"
      }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #38bdf8" }}>
            <th style={{ padding: "8px", textAlign: "center" }}>Rank</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Player</th>
            <th style={{ padding: "8px", textAlign: "right" }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry, index) => (
            <tr 
              key={index} 
              style={{ 
                backgroundColor: index % 2 === 0 ? "rgba(56, 189, 248, 0.1)" : "transparent",
                borderBottom: "1px solid rgba(56, 189, 248, 0.3)"
              }}
            >
              <td style={{ padding: "8px", textAlign: "center" }}>
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
              </td>
              <td style={{ padding: "8px", textAlign: "left", fontWeight: "bold" }}>{entry.name}</td>
              <td style={{ padding: "8px", textAlign: "right", color: "#f59e0b" }}>{entry.score}</td>
            </tr>
          ))}
          {scores.length === 0 && (
            <tr>
              <td colSpan="3" style={{ padding: "16px", textAlign: "center" }}>
                No scores yet. Be the first!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardComponent;
