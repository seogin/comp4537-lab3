// modules/utils.js
const fs = require('fs/promises');

class Utils {
  // ---- Part B ----
  static getDate() {
    return new Date().toString();
  }

  // (optional safety for reflecting user input later)
  static escapeHTML(s = "") {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  // ---- Part C helpers ----
  static async appendLine(filePath, text) {
    // creates the file if it doesn't exist; always adds a newline
    await fs.appendFile(filePath, text + "\n", "utf8");
  }

  static async readText(filePath) {
    return fs.readFile(filePath, "utf8");
  }
}

module.exports = Utils;
