# ExprJS

ExprJS is a super-simple JavaScript library designed to demonstrate the fundamentals of expression validation. It's not efficient, and the code is really messy, don't rely on it

---

## **1. Lexical Structure**

The lexer tokenizes the input into the following types of tokens:

- **Numbers**: Sequences of digits, optionally including a decimal point (e.g., `42`, `3.14`).
- **Strings**: Enclosed in double quotes (e.g., `"hello"`).
- **Identifiers**: Sequences of letters, underscores, or digits (starting with a letter or underscore), used for variable names (e.g., `x`, `my_var`).
- **Keywords**:
  - `true`, `false`: Boolean literals.
  - `null`: Represents a null value.
  - `in`: Operator for checking if a value exists in an array.
- **Operators**:
  - Arithmetic: `+`, `-`, `*`, `/`, `%`.
  - Comparison: `==`, `!=`, `>`, `<`, `>=`, `<=`.
  - Logical: `&&`, `||`, `!`.
  - Membership: `in`.
- **Punctuation**:
  - Parentheses: `(`, `)`.
  - Brackets: `[`, `]`.
  - Dot: `.` (for object access).
  - Comma: `,` (for separating arguments or array elements).
- **Whitespace**: Spaces, tabs, and newlines are ignored.

---

## Example Usage

```js
import Lexer from "./lexer.js";
import Parser from "./parser.js";
import Evaluator from "./evaluator.js";

const input = '(scheme in ["HTTPS"]) && (country in ["IRAN"])';
const lexer = new Lexer(input);
const parser = new Parser(lexer);
const ast = parser.parse();

const evaluator = new Evaluator(ast, {
    "scheme": "HTTPS",
    "country": "IRAN"
})

console.log(JSON.stringify(ast, null, 2));
console.log(evaluator.evaluate())
```