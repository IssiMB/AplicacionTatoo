import { readFileSync } from 'node:fs';

const filePath = 'App.tsx';
const expectedFirstLine = "import { useMemo, useState } from 'react';";
const firstLine = readFileSync(filePath, 'utf8').split(/\r?\n/, 1)[0];

if (firstLine !== expectedFirstLine) {
  console.error(`Error: ${filePath} debe empezar exactamente con:`);
  console.error(expectedFirstLine);
  console.error('\nPrimera línea actual:');
  console.error(firstLine || '(vacía)');
  process.exit(1);
}

console.log(`${filePath} empieza correctamente con: ${expectedFirstLine}`);
