import { MultiGraph } from "graphology";
import { Sigma } from "sigma";

/**
 * Registers all event handlers for a given graph
 * @param {MultiGraph} graph
 * @param {Sigma} renderer
 */
export function registerGraphEvents(graph, renderer) {
  const graphName = graph.getAttribute("name");

  renderer.on("doubleClickNode", (event) => {
    if (event.node !== "quality-root") {
      window.location.href = `${graph.getNodeAttribute(event.node, "page")}`;
    }
  });

  if (graphName === "home") {
    renderer.on("clickStage", () => {
      window.location.href = "/full-quality-graph";
    });
  }
}
