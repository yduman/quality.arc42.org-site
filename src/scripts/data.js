import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const qualitiesDir = path.join(projectRoot, "qualities");
const requirementsDir = path.join(projectRoot, "requirements");

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

console.log(qualityData.length);
console.log(requirementsData.length);

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
