import { MultiGraph } from "graphology";

/**
 * Creates the root node of the graph
 * @param {MultiGraph} graph
 * @param {string} label
 * @param {number} size
 * @param {string} color
 */
export function createRootNode(graph, label, size, color) {
  graph.addNode("quality-root", {
    label,
    size,
    x: 0,
    y: 0,
    color,
  });
}

/**
 * Creates a node element
 * @param {MultiGraph} graph
 * @param {{id: string, label: string, size: number, color: string, qualityType: string, page: string}[]} nodes
 */
export function createNodes(graph, nodes) {
  nodes.forEach((node) =>
    graph.addNode(node.id, {
      label: node.label,
      size: node.size,
      color: node.color,
      qualityType: node.type,
      page: node.page,
    }),
  );
}

/**
 * Creates an edge between two node IDs
 * @param {MultiGraph} graph
 * @param {{source: string, target: string}[]} edges
 */
export function createEdges(graph, edges) {
  edges.forEach((edge) => graph.addEdge(edge.source, edge.target));
}

/**
 * Determines the default color of a node, based on its quality type
 * @param {MultiGraph} graph
 * @param {string} node
 */
export function getDefaultNodeColor(graph, node) {
  switch (graph.getNodeAttribute(node, "qualityType")) {
    case "property":
      return "green";
    case "quality":
      return "blue";
    default:
      return "orange";
  }
}
