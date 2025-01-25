import { UndirectedGraph } from "graphology";
import { Sigma } from "sigma";
import { circular } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";

import { PROPERTY_NODES, QUALITY_NODES } from "./data/nodes";
import { ROOT_EDGES } from "./data/edges";

const graph = new UndirectedGraph();

graph.addNode("quality-root", { label: "Quality", size: 20, x: 0, y: 0, color: "orange" });
createPropertyNodes();
createEdges();

circular.assign(graph);
const settings = forceAtlas2.inferSettings(graph);
forceAtlas2.assign(graph, { settings, iterations: 500 });

new Sigma(graph, document.getElementById("q-graph-container"), {
  allowInvalidContainer: true,
  autoRescale: true,
  autoCenter: true,
});

function createPropertyNodes() {
  PROPERTY_NODES.forEach((node, idx) => {
    graph.addNode(node.id, { label: node.label, size: 15, color: "green", x: idx + 1, y: idx + 1 });
  });
}

function createEdges() {
  ROOT_EDGES.forEach((edge) => {
    graph.addEdge(edge.source, edge.target);
  });
}
