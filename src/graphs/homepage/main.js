import { MultiGraph } from "graphology";
import { circular } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { Sigma } from "sigma";

import { ROOT_EDGES } from "../data/edges";
import { PROPERTY_NODES } from "../data/nodes";
import { registerGraphEvents } from "../events";
import { createEdges, createNodes, createRootNode } from "../utils";

// Create Graph and its elements
const graph = new MultiGraph();
graph.setAttribute("name", "home");
graph.setAttribute("qualityType", "tiny");

createRootNode(graph, "Quality", 25, "orange");
createNodes(graph, PROPERTY_NODES);
createEdges(graph, ROOT_EDGES);

// Assign position and layout
circular.assign(graph);
const settings = forceAtlas2.inferSettings(graph);
forceAtlas2.assign(graph, { settings: settings, iterations: 500 });

// Render graph
const renderer = new Sigma(
  graph,
  document.getElementById("q-graph-container"),
  {
    allowInvalidContainer: true,
    autoRescale: true,
    autoCenter: true,
  },
);

// Register custom interactions
registerGraphEvents(graph, renderer);
