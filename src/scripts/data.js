import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

/**
 * @typedef {Object} FrontmatterData
 * @property {string} title - The page title
 * @property {string} tags - Space-separated string, listing system properties
 * @property {string} related - Comma-separated string, listing qualities
 * @property {string} permalink - The link to the page
 * @property {string} [stakeholder] - Comma-separated string, listing stakeholders needing this requirement
 */

/**
 * @typedef {Object} Q42Node
 * @property {string} id - Node ID
 * @property {string} label - Node display name
 * @property {number} size - Node size
 * @property {string} color - Node color
 * @property {string} qualityType - Node quality type
 * @property {string} page - Link to documentation
 */

/**
 * @typedef {Object} Q42Edge
 * @property {string} source - Edge source
 * @property {string} target - Edge target
 */

const projectRoot = process.cwd();
const qualitiesDir = path.join(projectRoot, "qualities");
const requirementsDir = path.join(projectRoot, "requirements");
const assetsDir = path.join(projectRoot, "assets");

let [qualityFiles, requirementFiles] = await Promise.all([
  getFilePaths(qualitiesDir),
  getFilePaths(requirementsDir),
]);

qualityFiles = qualityFiles.filter((f) => !f.includes("_files-must-have-identical-dates"));
requirementFiles = requirementFiles.filter((f) => !f.includes("_req-template-simple"));

const [qualityData, requirementsData] = await Promise.all([
  parseFrontmatter(qualityFiles),
  parseFrontmatter(requirementFiles),
]);

/** @type {Map<string, Q42Node>} */
const propertyNodes = new Map();

/** @type {Set<Q42Node>} */
const nodes = new Set();

/** @type {Set<Q42Edge>} */
const edges = new Set();

createGraphData(qualityData);
createGraphData(requirementsData, true);

const propertyNodesJson = JSON.stringify(Array.from(propertyNodes.values()), null, 2);
const nodesJson = JSON.stringify(Array.from(nodes), null, 2);
const edgesJson = JSON.stringify(Array.from(edges), null, 2);

await Promise.all([
  writeJsonToFile(propertyNodesJson, "property-nodes.json"),
  writeJsonToFile(nodesJson, "nodes.json"),
  writeJsonToFile(edgesJson, "edges.json"),
]);

/**
 * Write JSON to assets
 * @param {string} jsonString
 * @param {string} filename
 */
async function writeJsonToFile(jsonString, filename) {
  const outputPath = path.join(assetsDir, "data", filename);

  try {
    await fs.writeFile(outputPath, jsonString, "utf8");
    console.log(`File written successfully to ${outputPath}`);
  } catch (error) {
    console.error(`Error writing file: ${error}`);
  }
}

/**
 * Create and write a JSON file that represents all types of quality nodes
 * @param {FrontmatterData[]} frontmatterData
 */
function createGraphData(frontmatterData, isRequirements = false) {
  for (const data of frontmatterData) {
    const id = data.permalink.split("/").pop();
    const tags = data.tags ? data.tags.split(" ").map((t) => t.trim()) : [];
    const relatedIds = data.related ? data.related.split(",").map((r) => r.trim()) : [];

    for (const tag of tags) {
      // TODO: check if we want to connect requirements to system properties
      if (!isRequirements) {
        edges.add({ source: id, target: tag });
      }

      if (!propertyNodes.has(tag)) {
        propertyNodes.set(tag, {
          id: tag,
          label: tag.charAt(0).toUpperCase() + tag.slice(1),
          size: 15,
          color: "green",
          qualityType: "property",
          page: `/tag-${tag}`,
        });
      }
    }

    for (const relatedId of relatedIds) {
      edges.add({ source: id, target: relatedId });
    }

    nodes.add({
      id,
      label: data.title,
      size: 15,
      color: isRequirements ? "yellow" : "blue",
      qualityType: isRequirements ? "requirement" : "quality",
      page: data.permalink,
    });
  }
}

/**
 * Parses the frontmatter data for a given Markdown file
 * @param {string[]} filePaths - Array of file paths
 * @returns {Promise<Object[]>} - Array of frontmatter objects
 */
async function parseFrontmatter(filePaths) {
  return await Promise.all(
    filePaths.map(async (filePath) => {
      const content = await fs.readFile(filePath, "utf-8");
      const { data } = matter(content);
      return { ...data };
    }),
  );
}

/**
 * Recursively retrieves all markdown files for a given directory
 * @param {string} dir - The directory to search
 * @returns {Promise<string[]>} Array of markdown file paths
 */
async function getFilePaths(dir) {
  const result = [];
  const files = await fs.readdir(dir);

  const promises = files.map(async (file) => {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      const nestedFiles = await getFilePaths(filePath);
      result.push(...nestedFiles);
    } else if (filePath.endsWith(".md")) {
      result.push(filePath);
    }
  });

  await Promise.all(promises);
  return result;
}
