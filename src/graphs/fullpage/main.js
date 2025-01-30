import { MultiGraph } from "graphology";
import { circular } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { Sigma } from "sigma";

import { ALL_TINY_EDGES } from "../data/edges";
import { ALL_TINY_NODES } from "../data/nodes";
import { registerGraphEvents } from "../events";
import { createEdges, createNodes, createRootNode } from "../utils";

// Create Graph and its elements
const graph = new MultiGraph();
graph.setAttribute("name", "fullpage");
graph.setAttribute("qualityType", "tiny");

createRootNode(graph, "Quality", 25, "orange");
createNodes(graph, ALL_TINY_NODES);
createEdges(graph, ALL_TINY_EDGES);

// Assign position and layout
circular.assign(graph);
const settings = forceAtlas2.inferSettings(graph);
forceAtlas2.assign(graph, { settings: settings, iterations: 500 });

// Render graph
const renderer = new Sigma(
  graph,
  document.getElementById("full-q-graph-container"),
  {
    allowInvalidContainer: true,
    autoRescale: true,
    autoCenter: true,
  },
);

// Register custom interactions
registerGraphEvents(graph, renderer);
