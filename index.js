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
