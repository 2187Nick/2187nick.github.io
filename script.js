import React from 'https://unpkg.com/react@18/umd/react.production.min.js';
import ReactDOM from 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
import ReactFlow, { MiniMap, Controls, Background } from 'https://unpkg.com/react-flow-renderer@10.0.0/dist/react-flow-renderer.min.js';

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

const AboutMe = () => {
  return React.createElement('div', null, [
    React.createElement('h1', null, 'About Me'),
    React.createElement('p', null, 'This is the about me section.')
  ]);
};

const MyProjects = () => {
  return React.createElement('div', null, [
    React.createElement('h2', null, 'My Projects'),
    React.createElement(ReactFlow, {
      nodes: initialNodes,
      edges: initialEdges,
      style: { width: '100%', height: '500px' }
    }, [
      React.createElement(MiniMap, null),
      React.createElement(Controls, null),
      React.createElement(Background, null)
    ])
  ]);
};

const App = () => {
  return React.createElement('div', null, [
    React.createElement(AboutMe, null),
    React.createElement(MyProjects, null)
  ]);
};

const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(React.createElement(App, null));
