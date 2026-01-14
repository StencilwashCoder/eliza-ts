#!/usr/bin/env node
import { Eliza } from './dist/index.js';
import * as readline from 'readline';

const eliza = new Eliza();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n' + eliza.getInitialMessage() + '\n');

function prompt() {
  rl.question('You: ', (input) => {
    if (!input.trim()) {
      prompt();
      return;
    }

    const response = eliza.respond(input);
    console.log(`ELIZA: ${response}\n`);

    if (eliza.isFinished()) {
      rl.close();
      process.exit(0);
    }

    prompt();
  });
}

prompt();
