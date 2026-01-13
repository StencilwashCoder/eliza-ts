# ELIZA

A TypeScript implementation of the classic ELIZA chatbot, the pioneering natural language processing program created by Joseph Weizenbaum at MIT in 1966.

## Installation

```bash
npm install eliza-ts
```

## Usage

```typescript
import { Eliza } from 'eliza-ts';

const eliza = new Eliza();

// Get the opening message
console.log(eliza.getInitialMessage());
// "How do you do. Please tell me your problem."

// Have a conversation
console.log(eliza.respond("I am feeling sad today"));
// "I am sorry to hear that you are sad."

console.log(eliza.respond("My mother doesn't understand me"));
// "Tell me more about your family."

console.log(eliza.respond("goodbye"));
// "Goodbye. Thank you for talking to me."

// Check if conversation ended
if (eliza.isFinished()) {
  console.log("Session ended");
}
```

## API

### `new Eliza(options?)`

Create a new ELIZA instance.

**Options:**
- `script?: string` - Custom script text (uses default psychotherapist if not provided)
- `debug?: boolean` - Enable debug logging of pattern matching

### `eliza.getInitialMessage(): string`

Get the opening greeting message.

### `eliza.respond(input: string): string`

Process user input and return ELIZA's response.

### `eliza.isFinished(): boolean`

Check if the conversation has ended (user said a quit word like "goodbye").

### `eliza.getFinalMessage(): string`

Get the closing message.

### `eliza.loadScript(script: string): void`

Load a new script, resetting conversation state.

### `eliza.reset(): void`

Reset conversation state (memory, finished flag) without changing the script.

## Custom Scripts

You can create custom ELIZA personalities by writing your own scripts:

```typescript
import { Eliza } from 'eliza-ts';

const customScript = `
initial: Welcome! How can I help you today?
final: Thanks for chatting!
quit: bye
quit: exit

pre: dont don't
post: your my

key: hello
  decomp: *
    reasmb: Hi there! What's on your mind?

key: xnone
  decomp: *
    reasmb: Tell me more.
    reasmb: I see. Go on.
`;

const eliza = new Eliza({ script: customScript });
```

### Script Format

- `initial:` - Opening message
- `final:` - Closing message
- `quit:` - Words that end the conversation
- `pre:` - Pre-processing substitutions (before matching)
- `post:` - Post-processing substitutions (for captured text)
- `synon:` - Synonym groups
- `key:` - Keywords with optional rank
- `decomp:` - Decomposition patterns (use `$` prefix to save to memory)
- `reasmb:` - Reassembly responses (use `(n)` for captured groups, `goto` for redirection)

## About ELIZA

ELIZA was one of the first programs to attempt natural language processing. Created by Joseph Weizenbaum at MIT's Artificial Intelligence Laboratory, it was designed to demonstrate the superficiality of communication between humans and machines.

The most famous ELIZA script is DOCTOR, which simulates a Rogerian psychotherapist by reflecting the user's statements back as questions. Despite its simplicity, many users became emotionally attached to ELIZA, leading Weizenbaum to later express concern about the ease with which humans anthropomorphize computer programs.

## Acknowledgements

This implementation stands on the shoulders of giants:

### Original ELIZA
**Joseph Weizenbaum** (1966)
MIT Artificial Intelligence Laboratory
*"ELIZA—A Computer Program For the Study of Natural Language Communication Between Man and Machine"*
Communications of the ACM, Volume 9, Issue 1, January 1966

### Java Implementation
**Charles Hayden**
http://www.chayden.net/eliza/Eliza.html

A faithful Java port of the original ELIZA algorithm that served as the direct basis for this TypeScript version.

### Processing Library
**Andres Colubri** (codeanticode)
https://github.com/codeanticode/eliza

Adapted Charles Hayden's Java implementation as a Processing library, making ELIZA accessible to the creative coding community.

### This TypeScript Port
Based on codeanticode/eliza, modernized for the TypeScript/Node.js ecosystem while preserving the original algorithm and script format.

## License

MIT License

This implementation follows the tradition of open sharing established by the previous implementations. The original ELIZA algorithm and the classic psychotherapist script are in the public domain.

## Historical Note

ELIZA was named after Eliza Doolittle, the character from George Bernard Shaw's play *Pygmalion*, who was taught to speak with an upper-class accent. Similarly, ELIZA could be "taught" to converse in different ways by loading different scripts.

The DOCTOR script included in this implementation is the original script that made ELIZA famous, demonstrating how simple pattern matching could create the illusion of understanding.
