import { c as useNodesState, r as reactExports, j as jsxRuntimeExports, m as motion, d as index, B as Background, R as ReactDOM, f as React, g as ReactFlowProvider } from "./proxy-B2eiEogY.js";
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
const GRID_SIZE = 20;
const CELL_SIZE = 30;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};
function SnakeGame() {
  const [nodes, setNodes] = useNodesState([]);
  const [snake, setSnake] = reactExports.useState(INITIAL_SNAKE);
  const [direction, setDirection] = reactExports.useState(DIRECTIONS.RIGHT);
  const [food, setFood] = reactExports.useState({ x: 15, y: 10 });
  const [isGameOver, setIsGameOver] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(
    parseInt(localStorage.getItem("snakeHighScore")) || 0
  );
  const [gameActive, setGameActive] = reactExports.useState(false);
  const generateFood = reactExports.useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);
  const handleGameOver = reactExports.useCallback(() => {
    setIsGameOver(true);
    setGameActive(false);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("snakeHighScore", score.toString());
    }
  }, [score, highScore]);
  const resetGame = reactExports.useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(DIRECTIONS.RIGHT);
    setFood(generateFood());
    setScore(0);
    setIsGameOver(false);
    setGameActive(true);
  }, [generateFood]);
  const moveSnake = reactExports.useCallback(() => {
    if (!gameActive || isGameOver) return;
    setSnake((currentSnake) => {
      const newHead = {
        x: (currentSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (currentSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE
      };
      if (currentSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver();
        return currentSnake;
      }
      const newSnake = [newHead, ...currentSnake];
      console.log("Old Head:", currentSnake[0]);
      console.log("New Head:", newHead);
      console.log("Food Position:", food);
      const headOnFood = newHead.x === food.x && newHead.y === food.y;
      console.log("Is head on food?", headOnFood);
      if (headOnFood) {
        setScore((s) => s + 1);
        setFood(generateFood());
        console.log("Snake is GROWING.");
      } else {
        newSnake.pop();
        console.log("Snake is MOVING (not growing).");
      }
      return newSnake;
    });
  }, [direction, food, gameActive, isGameOver, generateFood, handleGameOver]);
  reactExports.useEffect(() => {
    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);
  reactExports.useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameActive) return;
      const keyHandlers = {
        ArrowUp: () => setDirection((current) => current === DIRECTIONS.DOWN ? current : DIRECTIONS.UP),
        ArrowDown: () => setDirection((current) => current === DIRECTIONS.UP ? current : DIRECTIONS.DOWN),
        ArrowLeft: () => setDirection((current) => current === DIRECTIONS.RIGHT ? current : DIRECTIONS.LEFT),
        ArrowRight: () => setDirection((current) => current === DIRECTIONS.LEFT ? current : DIRECTIONS.RIGHT)
      };
      if (keyHandlers[e.key]) {
        e.preventDefault();
        keyHandlers[e.key]();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameActive]);
  reactExports.useEffect(() => {
    const snakeNodes = snake.map((segment, index2) => ({
      id: `snake-${index2}`,
      position: { x: segment.x * CELL_SIZE, y: segment.y * CELL_SIZE },
      type: "default",
      data: { label: "" },
      style: {
        width: CELL_SIZE - 2,
        height: CELL_SIZE - 2,
        backgroundColor: index2 === 0 ? "#4CAF50" : "#388E3C",
        border: "none",
        borderRadius: "4px"
      }
    }));
    const foodNode = {
      id: "food",
      position: { x: food.x * CELL_SIZE, y: food.y * CELL_SIZE },
      type: "default",
      data: { label: "🍎" },
      style: {
        width: CELL_SIZE - 2,
        height: CELL_SIZE - 2,
        backgroundColor: "transparent",
        border: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px"
      }
    };
    setNodes([...snakeNodes, foodNode]);
  }, [snake, food, setNodes]);
  const viewport = reactExports.useMemo(() => ({
    x: 0,
    y: 0,
    zoom: 0.8
  }), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#000000",
    color: "white"
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
          borderBottom: "2px solid #4CAF50",
          boxShadow: "0 4px 12px rgba(76, 175, 80, 0.4)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
          margin: 0,
          fontSize: window.innerWidth < 768 ? "24px" : "32px",
          background: "linear-gradient(to right, #4CAF50, #81c784)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }, children: "SNAKE GAME" })
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
          borderBottom: "1px solid #333"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: resetGame, children: gameActive ? "Restart" : "Start Game" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { marginLeft: "auto", fontSize: "14px", color: "#4CAF50" }, children: [
            "Score: ",
            score,
            " | High Score: ",
            highScore
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, position: "relative" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      index,
      {
        nodes,
        edges: [],
        nodesDraggable: false,
        nodesConnectable: false,
        nodesFocusable: false,
        panOnDrag: false,
        zoomOnScroll: false,
        panOnScroll: false,
        defaultViewport: viewport,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Background, { gap: CELL_SIZE, size: 1, color: "#333333" })
      }
    ) }),
    gameActive && window.innerWidth < 768 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      padding: "20px",
      backgroundColor: "#000000",
      borderTop: "1px solid #333"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "10px",
      maxWidth: "300px",
      margin: "0 auto"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setDirection(DIRECTIONS.UP),
          style: {
            gridColumn: "2",
            padding: "15px",
            backgroundColor: "#4CAF50",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "20px"
          },
          children: "⬆️"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setDirection(DIRECTIONS.LEFT),
          style: {
            gridColumn: "1",
            gridRow: "2",
            padding: "15px",
            backgroundColor: "#4CAF50",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "20px"
          },
          children: "⬅️"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setDirection(DIRECTIONS.RIGHT),
          style: {
            gridColumn: "3",
            gridRow: "2",
            padding: "15px",
            backgroundColor: "#4CAF50",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "20px"
          },
          children: "➡️"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setDirection(DIRECTIONS.DOWN),
          style: {
            gridColumn: "2",
            gridRow: "3",
            padding: "15px",
            backgroundColor: "#4CAF50",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "20px"
          },
          children: "⬇️"
        }
      )
    ] }) })
  ] });
}
ReactDOM.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReactFlowProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SnakeGame, {}) }) })
);
//# sourceMappingURL=snake-C7TjdNYs.js.map
