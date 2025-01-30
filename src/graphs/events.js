import { MultiGraph } from "graphology";
import { Sigma } from "sigma";
import { DEFAULT_SETTINGS } from "sigma/settings";
import { getDefaultNodeColor } from "./utils";

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

  if (graphName !== "home") {
    renderer.on("enterNode", (event) => {
      const hoveredNode = event.node;

      graph.forEachEdge((edgeId, _, sourceNode, targetNode) => {
        const isRelated =
          sourceNode === hoveredNode || targetNode === hoveredNode;
        graph.updateEdgeAttribute(edgeId, "color", () =>
          isRelated ? "red" : "#E0E0E0",
        );
      });

      graph.forEachNode((node) => {
        const isConnected =
          graph.hasEdge(hoveredNode, node) || graph.hasEdge(node, hoveredNode);
        graph.updateNodeAttribute(node, "color", () =>
          isConnected ? graph.getNodeAttribute(node, "color") : "#CCCCCC",
        );
      });
    });

    renderer.on("leaveNode", () => {
      graph.forEachEdge((edgeId) => {
        graph.updateEdgeAttribute(
          edgeId,
          "color",
          () => DEFAULT_SETTINGS.defaultEdgeColor,
        );
      });

      graph.forEachNode((node) => {
        graph.updateNodeAttribute(node, "color", () =>
          getDefaultNodeColor(graph, node),
        );
      });
    });
  }
}
