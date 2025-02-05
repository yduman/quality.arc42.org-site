import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log(__dirname);
const projectRoot = process.cwd();
const qualitiesDir = path.join(projectRoot, "qualities");
const requirementsDir = path.join(projectRoot, "requirements");

const qualitiesFiles = getFilePaths(qualitiesDir).filter(
  (filePath) => !filePath.includes("_files-must-have-identical-dates"),
);
const requirementFiles = getFilePaths(requirementsDir).filter(
  (filePath) => !filePath.includes("_req-template-simple"),
);

const qualityData = parseFrontmatter(qualitiesFiles);
const requirementsData = parseFrontmatter(requirementFiles);

console.log(qualityData.length);
console.log(requirementsData.length);

/**
 * Parses the frontmatter data for a given Markdown file
 * @param {string[]} filePaths - Array of file paths
 */
function parseFrontmatter(filePaths) {
  return filePaths.map((filePath) => {
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);

    return {
      ...data,
    };
  });
}

/**
 * Recursively retrieves all markdown files for a given directory
 * @param {string} dir - The directory to search
 * @returns {string[]} Array of markdown file paths
 */
function getFilePaths(dir) {
  let result = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      result = result.concat(getFilePaths(filePath));
    } else if (filePath.endsWith(".md")) {
      result.push(filePath);
    }
  });

  return result;
}
