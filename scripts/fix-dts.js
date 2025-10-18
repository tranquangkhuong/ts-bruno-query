#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix export statements in a file
function fixExports(filePath) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace type exports with regular exports for TypeScript 2.0 compatibility
    content = content.replace(
      /export\s*{\s*([^}]+)\s*};/g,
      (match, exports) => {
        // Remove 'type ' keywords from export statement
        const cleanedExports = exports.replace(/\btype\s+/g, '');
        return `export { ${cleanedExports} };`;
      }
    );

    // Write the fixed content back
    fs.writeFileSync(filePath, content, 'utf8');

    return true;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Paths to the generated .d.ts files
const dtsPath = path.join(__dirname, '..', 'dist', 'index.d.ts');
const dMtsPath = path.join(__dirname, '..', 'dist', 'index.d.mts');

let success = true;

// Fix .d.ts file
if (fs.existsSync(dtsPath)) {
  if (fixExports(dtsPath)) {
    console.log('✅ Fixed .d.ts file for TypeScript 2.0 compatibility');
  } else {
    success = false;
  }
} else {
  console.log('⚠️  .d.ts file not found, skipping...');
}

// Fix .d.mts file
if (fs.existsSync(dMtsPath)) {
  if (fixExports(dMtsPath)) {
    console.log('✅ Fixed .d.mts file for TypeScript 2.0 compatibility');
  } else {
    success = false;
  }
} else {
  console.log('⚠️  .d.mts file not found, skipping...');
}

if (!success) {
  process.exit(1);
}
