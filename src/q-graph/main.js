import { MultiGraph } from "graphology";
import { circular } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { Sigma } from "sigma";

import { ROOT_EDGES } from "./data/edges";
import { PROPERTY_NODES } from "./data/nodes";
import { registerGraphEvents } from "./events";
import { createEdges, createNodes, createRootNode } from "./utils";

// TODO: split different graphs into files in order to add the script tag in their appropriate page (needs also esbuild tweak)
// Create Graph and its elements
console.log(">>", window.location.pathname);
const graph = new MultiGraph({name: "home", qualityType: "tiny"});
graph.setAttribute("name", "home")
graph.setAttribute("qualityType", "tiny")

createRootNode(graph, "Quality", 25, "orange")
createNodes(graph, PROPERTY_NODES);
createEdges(graph, ROOT_EDGES);

// Assign position and layout
circular.assign(graph);
const settings = forceAtlas2.inferSettings(graph);
forceAtlas2.assign(graph, { settings: settings, iterations: 500 });

// Render graph

let renderer;

if (window.location.pathname === "/") {
  renderer = new Sigma(
    graph,
    document.getElementById("q-graph-container"),
    {
      allowInvalidContainer: true,
      autoRescale: true,
      autoCenter: true,
    },
  );
} else if (window.location.pathname === "/full-quality-graph") {
  // TODO(yduman): Check why this is not working
  if (renderer !== undefined) {
    renderer.kill()
  }

  renderer = new Sigma(
    graph,
    document.getElementById("full-q-graph-container"),
    {
      allowInvalidContainer: true,
      autoRescale: true,
      autoCenter: true,
    },
  );
}

// Register custom interactions
registerGraphEvents(graph, renderer);