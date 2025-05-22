import { r as reactExports, j as jsxRuntimeExports, u as useNodesState, m as motion, i as index, B as Background, c as clientExports } from "./proxy-Q7kh5bO0.js";
const startSound = "" + new URL("Mario 1 - Mario Riff-DIBFaSI-.mp3", import.meta.url).href;
const shoot = "" + new URL("fireball-Bu_16San.mp3", import.meta.url).href;
const explosion = "" + new URL("Break_Brick-CyosectS.mp3", import.meta.url).href;
const gameWin = "" + new URL("game-win-sm_HM3fJ.mp3", import.meta.url).href;
const gameOver = "" + new URL("die-ofaorudv.mp3", import.meta.url).href;
const useLeaderboard = () => {
  const [scores, setScores] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const fetchLeaderboard = async () => {
    try {
      console.log("Fetching leaderboard data...");
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
  reactExports.useEffect(() => {
    fetchLeaderboard();
  }, []);
  const isHighScore = (newScore) => {
    console.log("Checking if score is high enough:", newScore, "Current scores:", scores);
    if (newScore <= 0) {
      console.log("Score is 0 or negative, not high enough");
      return false;
    }
    if (scores.length < 3) {
      console.log("Less than 3 scores in leaderboard, score is high enough");
      return true;
    }
    const lowestScore = Math.min(...scores.map((s) => s.score));
    console.log("Lowest score in leaderboard:", lowestScore);
    return newScore > lowestScore;
  };
  const submitScore = async (nickname, score) => {
    try {
      const apiUrl = "https://falling-thunder-fd3b.nick-80f.workers.dev/";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nickname,
          score
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit score");
      }
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
const ScoreSubmission = ({ score, onClose, onSubmitSuccess }) => {
  const [nickname, setNickname] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(false);
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
      setTimeout(() => {
        onClose();
      }, 2e3);
    } catch (err) {
      console.error("Error submitting score:", err);
      setError(err.message || "Failed to submit score. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  if (success) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      backgroundColor: "rgba(22, 163, 74, 0.2)",
      borderRadius: "8px",
      padding: "20px",
      textAlign: "center",
      border: "1px solid #22c55e"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { color: "#4ade80", marginBottom: "16px" }, children: "Score Submitted!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Your score of ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: "bold", color: "#f59e0b" }, children: score }),
        " has been submitted as ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: "bold" }, children: nickname }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { marginBottom: "20px" }, children: "The leaderboard will be updated shortly." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          style: {
            padding: "8px 16px",
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          },
          children: "Close"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: "8px",
    padding: "24px",
    border: "1px solid #38bdf8",
    boxShadow: "0 0 20px rgba(56, 189, 248, 0.2)",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { style: { color: "#38bdf8", marginBottom: "16px", textAlign: "center" }, children: [
      "Submit Your Score: ",
      score
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
      color: "#ef4444",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      padding: "10px",
      borderRadius: "4px",
      marginBottom: "16px"
    }, children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "nickname",
            style: {
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold"
            },
            children: "Nickname:"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            id: "nickname",
            value: nickname,
            onChange: (e) => setNickname(e.target.value),
            placeholder: "Enter your nickname",
            maxLength: 15,
            disabled: submitting,
            style: {
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #38bdf8",
              backgroundColor: "rgba(56, 189, 248, 0.1)",
              color: "white",
              outline: "none"
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        gap: "12px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: submitting,
            style: {
              flex: "1",
              padding: "10px",
              backgroundColor: submitting ? "#6b7280" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: "bold"
            },
            children: submitting ? "Submitting..." : "Submit Score"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            disabled: submitting,
            style: {
              flex: "1",
              padding: "10px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: "bold"
            },
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] });
};
const LeaderboardComponent = () => {
  const { scores, loading, error } = useLeaderboard();
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leaderboard", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "🏆 High Scores" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Loading scores..." })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leaderboard", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "🏆 High Scores" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "error", children: error })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leaderboard", style: { textAlign: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { color: "#38bdf8", marginBottom: "12px" }, children: "🏆 High Scores" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "8px",
      color: "white"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { borderBottom: "2px solid #38bdf8" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { padding: "8px", textAlign: "center" }, children: "Rank" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { padding: "8px", textAlign: "left" }, children: "Player" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { padding: "8px", textAlign: "right" }, children: "Score" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        scores.map((entry, index2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            style: {
              backgroundColor: index2 % 2 === 0 ? "rgba(56, 189, 248, 0.1)" : "transparent",
              borderBottom: "1px solid rgba(56, 189, 248, 0.3)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "8px", textAlign: "center" }, children: index2 === 0 ? "🥇" : index2 === 1 ? "🥈" : index2 === 2 ? "🥉" : index2 + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "8px", textAlign: "left", fontWeight: "bold" }, children: entry.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "8px", textAlign: "right", color: "#f59e0b" }, children: entry.score })
            ]
          },
          index2
        )),
        scores.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: "3", style: { padding: "16px", textAlign: "center" }, children: "No scores yet. Be the first!" }) })
      ] })
    ] })
  ] });
};
const GameOverModal = ({ score, onRestart, onClose, isWin }) => {
  const [showSubmission, setShowSubmission] = reactExports.useState(false);
  const { isHighScore, fetchLeaderboard } = useLeaderboard();
  const [isHighEnough, setIsHighEnough] = reactExports.useState(false);
  reactExports.useEffect(() => {
    console.log("Now try and fetch leaderboard data");
    fetchLeaderboard().then(() => {
      const highEnough = isHighScore(score);
      console.log("GameOverModal rendered - Score:", score, "IsWin:", isWin, "High enough:", highEnough);
      setIsHighEnough(highEnough);
    });
  }, [score, isHighScore, fetchLeaderboard]);
  const handleSubmitSuccess = async () => {
    console.log("Score submitted successfully, refreshing leaderboard");
    await fetchLeaderboard();
    setIsHighEnough(false);
  };
  if (showSubmission) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      backgroundColor: "rgba(0, 0, 0, 0.95)",
      padding: "2rem",
      borderRadius: "8px",
      border: "5px solid #ff3800",
      boxShadow: "0 0 30px rgba(255, 56, 0, 0.8)",
      width: "90%",
      maxWidth: "500px"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScoreSubmission,
      {
        score,
        onClose: () => setShowSubmission(false),
        onSubmitSuccess: handleSubmitSuccess
      }
    ) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    padding: "2rem",
    borderRadius: "8px",
    border: "5px solid #ff3800",
    boxShadow: "0 0 30px rgba(255, 56, 0, 0.8)",
    color: "white",
    width: "90%",
    maxWidth: "500px",
    textAlign: "center"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: {
      color: isWin ? "#4ade80" : "#ef4444",
      fontSize: "24px",
      marginBottom: "16px"
    }, children: isWin ? "You Win!" : "Game Over" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: {
      fontSize: "20px",
      marginBottom: "24px"
    }, children: [
      "Your Score: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#f59e0b", fontWeight: "bold" }, children: score })
    ] }),
    isHighEnough && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      marginBottom: "24px",
      padding: "12px",
      backgroundColor: "rgba(79, 70, 229, 0.2)",
      borderRadius: "6px",
      border: "1px solid #6366f1"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { marginBottom: "12px", color: "#c4b5fd" }, children: "🏆 Congratulations! You got a high score!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setShowSubmission(true),
          style: {
            padding: "8px 16px",
            backgroundColor: "#6366f1",
            border: "none",
            borderRadius: "4px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          },
          children: "Submit Score"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "24px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LeaderboardComponent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", gap: "12px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onRestart,
          style: {
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            border: "none",
            borderRadius: "4px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          },
          children: "Play Again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          style: {
            padding: "10px 20px",
            backgroundColor: "#6b7280",
            border: "none",
            borderRadius: "4px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          },
          children: "Close"
        }
      )
    ] })
  ] }) });
};
const Button = ({ style = {}, children, ...rest }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "button",
  {
    ...rest,
    style: {
      padding: "8px 12px",
      borderRadius: "4px",
      backgroundColor: "#404040",
      border: "none",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background-color 0.2s, transform 0.2s",
      ...style
    },
    onMouseOver: (e) => {
      e.currentTarget.style.backgroundColor = "#525252";
    },
    onMouseOut: (e) => {
      e.currentTarget.style.backgroundColor = "#404040";
    },
    onMouseDown: (e) => {
      e.currentTarget.style.transform = "scale(0.95)";
    },
    onMouseUp: (e) => {
      e.currentTarget.style.transform = "scale(1)";
    },
    onTouchStart: (e) => {
      e.currentTarget.style.transform = "scale(0.95)";
    },
    onTouchEnd: (e) => {
      e.currentTarget.style.transform = "scale(1)";
    },
    children
  }
);
const SOUNDS = {
  shoot,
  explosion,
  gameStart: startSound,
  gameOver,
  gameWin
};
const loadSound = (url) => {
  const audio = new Audio(url);
  audio.load();
  return audio;
};
const getGameDimensions = () => {
  const isMobile = window.innerWidth < 768;
  const spacingX = isMobile ? 160 : 160;
  const cols = 10;
  const margin = 200;
  const invaderWidth = 40;
  const totalWidth2 = margin + cols * spacingX + invaderWidth;
  const zoom2 = isMobile ? 0.99 : 0.95;
  return {
    isMobile,
    width: isMobile ? window.innerWidth + 500 : Math.max(window.innerWidth, totalWidth2),
    height: isMobile ? 500 : 800,
    playerY: isMobile ? 1e3 : 800,
    zoom: zoom2,
    totalWidth: totalWidth2,
    invaderSpacingX: spacingX,
    invaderSpacingY: isMobile ? 80 : 140
  };
};
const dimensions = getGameDimensions();
const { width, playerY, zoom, totalWidth, invaderSpacingX, invaderSpacingY } = dimensions;
const WIDTH = width;
const PLAYER_Y = playerY;
const INV_COLS = window.innerWidth < 768 ? 4 : 10;
const INV_ROWS = window.innerWidth < 768 ? 5 : 3;
const INV_SPACING_X = invaderSpacingX;
const INV_SPACING_Y = invaderSpacingY;
const TICK_MS = window.innerWidth < 768 ? 120 : 120;
const BULLET_STEP = 20;
const INV_STEP = window.innerWidth < 768 ? 10 : 10;
const INV_DROP = window.innerWidth < 768 ? 10 : 20;
function SpaceInvaders() {
  const [nodes, setNodes] = useNodesState([]);
  const [invaders, setInvaders] = reactExports.useState([]);
  const [bullets, setBullets] = reactExports.useState([]);
  const [playerX, setPlayerX] = reactExports.useState(WIDTH / 2 - 20);
  const [dir, setDir] = reactExports.useState(1);
  const [active, setActive] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const scoreRef = reactExports.useRef(0);
  const bulletsRef = reactExports.useRef([]);
  const invadersRef = reactExports.useRef([]);
  const dirRef = reactExports.useRef(1);
  const [gameOver2, setGameOver] = reactExports.useState(false);
  const [gameWon, setGameWon] = reactExports.useState(false);
  const [finalScore, setFinalScore] = reactExports.useState(1e3);
  const [forceUpdate, setForceUpdate] = reactExports.useState(0);
  const forceRender = reactExports.useCallback(() => {
    setForceUpdate((prev) => prev + 1);
    console.log("Forcing re-render");
  }, []);
  const lastShotRef = reactExports.useRef(0);
  const SHOOT_COOLDOWN = window.innerWidth < 768 ? 200 : 100;
  const playSound = reactExports.useCallback((soundName) => {
    const sound = soundsRef.current[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((e) => console.log("Sound play error:", e));
    }
  }, []);
  const handleShoot = reactExports.useCallback(() => {
    if (!active) return;
    const now = Date.now();
    if (now - lastShotRef.current < SHOOT_COOLDOWN) return;
    lastShotRef.current = now;
    setBullets((bs) => [
      ...bs,
      {
        id: `b-${now}`,
        position: { x: playerX + 14, y: PLAYER_Y - 24 },
        draggable: false,
        data: { label: "🔺" },
        style: {
          background: "#facc15",
          width: 12,
          height: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 12,
          border: "none"
        }
      }
    ]);
    playSound("shoot");
  }, [active, playerX, playSound, SHOOT_COOLDOWN]);
  const soundsRef = reactExports.useRef({});
  reactExports.useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      soundsRef.current[key] = loadSound(url);
    });
  }, []);
  const makePlayer = reactExports.useCallback(
    (x) => ({
      id: "player",
      position: { x, y: PLAYER_Y },
      draggable: false,
      data: { label: "🚀" },
      style: {
        background: "#0369a1",
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 22,
        color: "white",
        border: "none"
      }
    }),
    []
  );
  const initGame = () => {
    console.log("=== INIT GAME CALLED ===");
    const inv = [];
    let id = 0;
    for (let r = 0; r < INV_ROWS; r++) {
      for (let c = 0; c < INV_COLS; c++) {
        inv.push({
          id: `inv-${id++}`,
          position: { x: 200 + c * INV_SPACING_X, y: 150 + r * INV_SPACING_Y },
          draggable: false,
          data: { label: "👾" },
          style: {
            background: "#b91c1c",
            width: 40,
            height: 40,
            borderRadius: 8,
            fontSize: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            border: "none"
          }
        });
      }
    }
    console.log("Setting game state...");
    setInvaders(inv);
    setBullets([]);
    setPlayerX(WIDTH / 2 - 20);
    setDir(1);
    setScore(0);
    setActive(true);
    setGameOver(false);
    setGameWon(false);
    setFinalScore(0);
    console.log("Game initialized successfully!");
    console.log(`New state will be: gameOver=false, gameWon=false, active=true`);
    window.gameDebug = true;
    playSound("gameStart");
  };
  reactExports.useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setPlayerX((x) => Math.max(10, x - 20));
      else if (e.key === "ArrowRight") setPlayerX((x) => Math.min(WIDTH - 50, x + 20));
      else if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        handleShoot();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, handleShoot]);
  reactExports.useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  reactExports.useEffect(() => {
    bulletsRef.current = bullets;
  }, [bullets]);
  reactExports.useEffect(() => {
    invadersRef.current = invaders;
  }, [invaders]);
  reactExports.useEffect(() => {
    dirRef.current = dir;
  }, [dir]);
  reactExports.useEffect(() => {
    console.log("Game loop useEffect initiated");
    if (!active) return;
    const loop = setInterval(() => {
      console.log("Game loop tick");
      const currentBullets = bulletsRef.current;
      const currentInvaders = invadersRef.current;
      const currentDir = dirRef.current;
      const movedBullets = currentBullets.map((b) => ({ ...b, position: { x: b.position.x, y: b.position.y - BULLET_STEP } })).filter((b) => b.position.y > -30);
      const edgeHit = currentInvaders.some(
        (n) => n.position.x + currentDir * INV_STEP < 10 || n.position.x + currentDir * INV_STEP > WIDTH - 50
      );
      const newDir = edgeHit ? currentDir * -1 : currentDir;
      const movedInvaders = currentInvaders.map((n) => ({
        ...n,
        position: {
          x: n.position.x + newDir * INV_STEP,
          y: n.position.y + (edgeHit ? INV_DROP : 0)
        }
      }));
      const remainingInvaders = [];
      let hitCount = 0;
      movedInvaders.forEach((inv) => {
        const hit = movedBullets.some((b) => {
          const withinX = b.position.x >= inv.position.x && b.position.x <= inv.position.x + 40;
          const withinY = b.position.y >= inv.position.y && b.position.y <= inv.position.y + 40;
          return withinX && withinY;
        });
        if (!hit) remainingInvaders.push(inv);
        else hitCount += 1;
      });
      if (hitCount) {
        setScore((s) => {
          const newScore = s + hitCount * 100;
          scoreRef.current = newScore;
          return newScore;
        });
        playSound("explosion");
      }
      const survivingBullets = movedBullets.filter((b) => {
        return !remainingInvaders.some((inv) => {
          const withinX = b.position.x >= inv.position.x && b.position.x <= inv.position.x + 40;
          const withinY = b.position.y >= inv.position.y && b.position.y <= inv.position.y + 40;
          return withinX && withinY;
        });
      });
      setBullets(survivingBullets);
      setInvaders(remainingInvaders);
      setDir(newDir);
      if (remainingInvaders.some((n) => n.position.y >= PLAYER_Y - 20)) {
        const final = scoreRef.current;
        setActive(false);
        setGameOver(true);
        setFinalScore(final);
        setTimeout(() => {
          document.body.style.overflow = "hidden";
          forceRender();
        }, 100);
        playSound("gameOver");
      }
      if (remainingInvaders.length === 0) {
        const final = scoreRef.current;
        setActive(false);
        setGameWon(true);
        setFinalScore(final);
        setTimeout(() => {
          document.body.style.overflow = "hidden";
          forceRender();
        }, 100);
        playSound("gameWin");
      }
    }, TICK_MS);
    return () => clearInterval(loop);
  }, [active, playSound, forceRender, invaders]);
  const playerNode = reactExports.useMemo(() => makePlayer(playerX), [makePlayer, playerX]);
  reactExports.useEffect(() => {
    setNodes([playerNode, ...invaders, ...bullets]);
  }, [playerNode, invaders, bullets, setNodes]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      height: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      color: "white",
      overflow: "visible",
      // Allow modal to overflow
      backgroundColor: "#000000"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { y: -50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          style: {
            textAlign: "center",
            backgroundColor: "#0f172a",
            padding: "12px 0",
            borderBottom: "2px solid #38bdf8",
            boxShadow: "0 4px 12px rgba(56, 189, 248, 0.4)",
            fontFamily: "'Press Start 2P', monospace, system-ui"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
            margin: 0,
            fontSize: window.innerWidth < 768 ? "24px" : "32px",
            background: "linear-gradient(to right, #38bdf8, #818cf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            letterSpacing: "2px"
          }, children: "SPACE INVADERS" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { y: -50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          style: {
            padding: "16px",
            display: "flex",
            gap: "16px",
            alignItems: "center",
            backgroundColor: "#000000",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
            borderBottom: "1px solid rgb(51, 51, 51)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: (e) => {
              e.preventDefault();
              initGame();
            }, children: active ? "Restart" : "Start" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { marginLeft: "auto", fontSize: "14px", fontWeight: "600", color: "green" }, children: [
              "Score: ",
              score
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, position: "relative", width: "100%", backgroundColor: "#000000" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100vw", height: "80vh", background: "#000000" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        index,
        {
          nodes,
          edges: [],
          panOnDrag: false,
          zoomOnScroll: false,
          panOnScroll: false,
          minZoom: window.innerWidth < 768 ? 0.4 : 0.2,
          maxZoom: 1,
          defaultViewport: {
            x: 0,
            y: 0,
            zoom: Math.min(window.innerWidth / totalWidth, zoom)
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Background, { gap: 40, size: 1.5, color: "#333333", variant: "lines", style: { opacity: 0.4 } })
        }
      ) }) }),
      active && window.innerWidth < 768 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        height: "128px",
        backgroundColor: "#000000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderTop: "1px solid rgb(51, 51, 51)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        maxWidth: "340px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onTouchStart: () => setPlayerX((x) => Math.max(10, x - 20)),
            onTouchEnd: (e) => e.preventDefault(),
            style: {
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "28px",
              border: "none",
              padding: 0,
              touchAction: "manipulation"
            },
            children: "←"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onPointerDown: handleShoot,
            onTouchStart: handleShoot,
            style: {
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "28px",
              border: "none",
              padding: 0,
              touchAction: "manipulation"
            },
            children: "🔥"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onTouchStart: () => setPlayerX((x) => Math.min(WIDTH - 50, x + 20)),
            onTouchEnd: (e) => e.preventDefault(),
            style: {
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "28px",
              border: "none",
              padding: 0,
              touchAction: "manipulation"
            },
            children: "→"
          }
        )
      ] }) })
    ] }),
    (gameOver2 || gameWon) && /* @__PURE__ */ jsxRuntimeExports.jsx(
      GameOverModal,
      {
        score: finalScore,
        isWin: gameWon,
        onRestart: () => {
          document.body.style.overflow = "auto";
          initGame();
        },
        onClose: () => {
          document.body.style.overflow = "auto";
          setActive(false);
          setGameOver(false);
          setGameWon(false);
        }
      }
    )
  ] });
}
clientExports.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SpaceInvaders, {}) })
);
//# sourceMappingURL=space_invader-C-4FP-M6.js.map
