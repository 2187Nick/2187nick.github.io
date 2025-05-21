import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import startSound from "./assets/Mario 1 - Mario Riff.mp3";
import shoot from "./assets/fireball.mp3";
import explosion from "./assets/Break_Brick.mp3";
import gameWin from "./assets/game-win.mp3";
import gameOver from "./assets/die.mp3";
import GameOverModal from "./components/leaderboard/GameOverModal";

const Button = ({ style = {}, children, ...rest }) => (
  <button
    {...rest}
    style={{ 
      padding: "8px 12px", 
      borderRadius: "4px", 
      backgroundColor: "#404040", 
      border: "none",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background-color 0.2s, transform 0.2s",
      ...style
    }}
    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#525252"; }}
    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#404040"; }}
    onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.95)"; }}
    onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.95)"; }}
    onTouchEnd={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
  >
    {children}
  </button>
);

/* ------------------------------ constants ------------------------------ */
const SOUNDS = {
  shoot: shoot,
  explosion: explosion,
  gameStart: startSound,
  gameOver: gameOver,
  gameWin: gameWin,
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
  const margin = 200; // same offset you use in initGame
  const invaderWidth = 40;
  const totalWidth = margin + cols * spacingX + invaderWidth;
  const zoom = isMobile ? 0.99 : 0.95;
  return {
    isMobile,
    width: isMobile ? (window.innerWidth + 500) : Math.max(window.innerWidth, totalWidth),
    height: isMobile ? 500 : 800,
    playerY: isMobile ? 1000 : 800,
    zoom,
    totalWidth,

    invaderSpacingX: spacingX,
    invaderSpacingY: isMobile ? 80 : 140,
  };
};

const dimensions = getGameDimensions();
const { width, height, playerY, zoom, totalWidth, invaderSpacingX, invaderSpacingY } = dimensions;
const WIDTH = width;
const HEIGHT = height;
const PLAYER_Y = playerY;
const INV_COLS = window.innerWidth < 768 ? 4 : 10; // Less columns on mobile
const INV_ROWS = window.innerWidth < 768 ? 5 : 3; // More rows on mobile
const INV_SPACING_X = invaderSpacingX;
const INV_SPACING_Y = invaderSpacingY;
const TICK_MS = window.innerWidth < 768 ? 120 : 120; // Slower on mobile
const BULLET_STEP = 20;
const INV_STEP = window.innerWidth < 768 ? 10 : 10; // Slower invader movement on mobile
const INV_DROP = window.innerWidth < 768 ? 10 : 20; // Slower drop on mobile

/* ---------------------------------------------------------------------- */
export default function SpaceInvaders() {
  const [nodes, setNodes] = useNodesState([]);
  const [invaders, setInvaders] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [playerX, setPlayerX] = useState(WIDTH / 2 - 20);
  const [dir, setDir] = useState(1);
  const [active, setActive] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const lastShotRef = useRef(0);
  const SHOOT_COOLDOWN = window.innerWidth < 768 ? 200 : 100; // still throttle to avoid audio spam

  /* ------------------------------ shooting ------------------------------ */
  const playSound = useCallback((soundName) => {
    const sound = soundsRef.current[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((e) => console.log("Sound play error:", e));
    }
  }, []);

  const handleShoot = useCallback(() => {
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
          border: "none",
        },
      },
    ]);
    playSound("shoot");
  }, [active, playerX, playSound, SHOOT_COOLDOWN]);

  /* ------------------------------ sounds ------------------------------ */
  const soundsRef = useRef({});
  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      soundsRef.current[key] = loadSound(url);
    });
  }, []);

  /* -------------------------------- helpers ---------------------------- */
  const makePlayer = useCallback(
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
        border: "none",
      },
    }),
    []
  );

  /* --------------------------------- init ----------------------------- */
  const initGame = () => {
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
            border: "none",
          },
        });
      }
    }
    setInvaders(inv);
    setBullets([]);
    setPlayerX(WIDTH / 2 - 20);
    setDir(1);
    setScore(0);
    setActive(true);
    setGameOver(false);
    setGameWon(false);
    playSound("gameStart");
  };

  /* ------------------------------ controls ----------------------------- */
  useEffect(() => {
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

  /* ------------------------------ game loop --------------------------- */
  useEffect(() => {
    if (!active) return;

    const loop = setInterval(() => {
      /* Move bullets */
      const movedBullets = bullets
        .map((b) => ({ ...b, position: { x: b.position.x, y: b.position.y - BULLET_STEP } }))
        .filter((b) => b.position.y > -30);
      setBullets(movedBullets);

      /* Move invaders */
      const edgeHit = invaders.some(
        (n) => n.position.x + dir * INV_STEP < 10 || n.position.x + dir * INV_STEP > WIDTH - 50
      );
      const newDir = edgeHit ? dir * -1 : dir;
      const movedInvaders = invaders.map((n) => ({
        ...n,
        position: {
          x: n.position.x + newDir * INV_STEP,
          y: n.position.y + (edgeHit ? INV_DROP : 0),
        },
      }));
      setDir(newDir);

      /* Collision detection */
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
        setScore((s) => s + hitCount * 100);
        playSound("explosion");
      }

      setInvaders(remainingInvaders);

      /* Remove bullets that hit */
      const survivingBullets = movedBullets.filter((b) => {
        return !remainingInvaders.some((inv) => {
          const withinX = b.position.x >= inv.position.x && b.position.x <= inv.position.x + 40;
          const withinY = b.position.y >= inv.position.y && b.position.y <= inv.position.y + 40;
          return withinX && withinY;
        });
      });
      setBullets(survivingBullets);

      /* Win / lose checks */
      if (remainingInvaders.some((n) => n.position.y >= PLAYER_Y - 20)) {
        // Game over sequence
        console.log("Game Over! Final score:", score);
        setActive(false);
        setGameOver(true);
        setFinalScore(score);
        
        // Make sure we see the modal by forcing a focus
        setTimeout(() => {
          console.log("Showing Game Over modal with score:", score);
          document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
        }, 100);
        
        playSound("gameOver");
      }
      if (remainingInvaders.length === 0) {
        // Game won sequence
        console.log("Game Won! Final score:", score);
        setActive(false);
        setGameWon(true);
        setFinalScore(score);
        
        // Make sure we see the modal by forcing a focus
        setTimeout(() => {
          console.log("Showing Game Won modal with score:", score);
          document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
        }, 100);
        
        playSound("gameWin");
      }
    }, TICK_MS);

    return () => clearInterval(loop);
  }, [active, bullets, invaders, dir, playSound, score]);

  /* ----------------------------- reflect nodes ------------------------ */
  const playerNode = useMemo(() => makePlayer(playerX), [makePlayer, playerX]);
  useEffect(() => {
    setNodes([playerNode, ...invaders, ...bullets]);
  }, [playerNode, invaders, bullets, setNodes]);

  /* ------------------------------- render ----------------------------- */
  return (
    <div style={{ 
      height: "100vh", 
      width: "100%", 
      display: "flex", 
      flexDirection: "column", 
      color: "white", 
      overflow: "hidden", 
      backgroundColor: "#000000"
    }}>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          textAlign: "center",
          backgroundColor: "#0f172a",
          padding: "12px 0",
          borderBottom: "2px solid #38bdf8",
          boxShadow: "0 4px 12px rgba(56, 189, 248, 0.4)",
          fontFamily: "'Press Start 2P', monospace, system-ui"
        }}
      >
        <h1 style={{
          margin: 0,
          fontSize: window.innerWidth < 768 ? "24px" : "32px",
          background: "linear-gradient(to right, #38bdf8, #818cf8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          letterSpacing: "2px"
        }}>
          SPACE INVADERS
        </h1>
      </motion.div>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          padding: "16px",
          display: "flex",
          gap: "16px",
          alignItems: "center",
          backgroundColor: "#000000",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          zIndex: 10,
          borderBottom: "1px solid rgb(51, 51, 51)"
        }}
      >
        <Button type="button" onClick={(e) => { e.preventDefault(); initGame(); }}>
          {active ? "Restart" : "Start"}
        </Button>
        
        <span style={{ marginLeft: "auto", fontSize: "14px", fontWeight: "600", color: "green" }}>Score: {score}</span>
      </motion.div>

      <div style={{ flex: 1, position: "relative", width: "100%", backgroundColor: "#000000" }}>
        
        <div style={{ width: "100vw", height: "80vh", background: "#000000" }}>
          
          <ReactFlow
            nodes={nodes}
            edges={[]}
            panOnDrag={false}
            zoomOnScroll={false}
            panOnScroll={false}
            minZoom={window.innerWidth < 768 ? 0.4 : 0.2}
            maxZoom={1}
            defaultViewport={{
              x: 0,
              y: 0,
              zoom: Math.min(window.innerWidth / totalWidth, zoom),
            }}
          >
            <Background gap={40} size={1.5} color="#333333" variant="lines" style={{ opacity: 0.4 }} />
          </ReactFlow>
        </div>
      </div>

      {active && window.innerWidth < 768 && (
        <div style={{
          height: "128px", 
          backgroundColor: "#000000", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          borderTop: "1px solid rgb(51, 51, 51)"
        }}>
          <div style={{
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            width: "100%",
            maxWidth: "340px"
          }}>
            <button
              onTouchStart={() => setPlayerX((x) => Math.max(10, x - 20))}
              onTouchEnd={(e) => e.preventDefault()}
              style={{ 
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
              }}
            >
              ←
            </button>
            <button
              onPointerDown={handleShoot}
              onTouchStart={handleShoot}
              style={{ 
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
              }}
            >
              🔥
            </button>
            <button
              onTouchStart={() => setPlayerX((x) => Math.min(WIDTH - 50, x + 20))}
              onTouchEnd={(e) => e.preventDefault()}
              style={{ 
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
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
      
      {/* Game Over Modal */}
      {(gameOver || gameWon) && !active && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999 }}>
          <GameOverModal 
            score={finalScore} 
            isWin={gameWon} 
            onRestart={() => {
              initGame();
            }}
            onClose={() => {
              setGameOver(false);
              setGameWon(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
