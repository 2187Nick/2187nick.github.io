import React from 'react';
import ReactDOM from 'react-dom';
import ReactFlow, { MiniMap, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const aboutMeNode = {
  id: '1',
  type: 'input',
  data: { label: 'About Me' },
  position: { x: 250, y: 0 },
};

const projectNodes = [
  {
    id: '2',
    data: { label: 'Project 1' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Project 2' },
    position: { x: 400, y: 100 },
  },
];

const initialNodes = [aboutMeNode, ...projectNodes];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
];

const AboutMe = () => (
  <div>
    <h1>About Me</h1>
    <p>This is the about me section.</p>
  </div>
);

const MyProjects = () => (
  <div>
    <h2>My Projects</h2>
    <ReactFlow
      elements={[...initialNodes, ...initialEdges]}
      style={{ width: '100%', height: '500px' }}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  </div>
);

const App = () => (
  <div>
    <AboutMe />
    <MyProjects />
  </div>
);

ReactDOM.render(<App />, document.getElementById('react-root'));
