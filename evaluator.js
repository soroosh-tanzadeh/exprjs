import {
    BooleanNode, BracketAccessNode, ObjectAccessNode, BinaryOperationNode,
    FunctionCallNode, IdentifierNode, NullNode, NumberNode, StringNode, InOperatorNode, UnaryOperationNode, ArrayNode,
    ValueNode
} from "./parser.js";
class Evaluator {
    constructor(ast, context = {}) {
        this.ast = ast;
        this.context = context; // Context for variables and functions
    }

    evaluate(node = this.ast) {
        if (node instanceof NumberNode || node instanceof StringNode || node instanceof BooleanNode || node instanceof NullNode) {
            return node.value;
        }

        if (node instanceof IdentifierNode) {
            return this.context[node.name];
        }

        if (node instanceof BinaryOperationNode) {
            const left = this.evaluate(node.left);
            const right = this.evaluate(node.right);

            switch (node.operator) {
                case '+': return left + right;
                case '-': return left - right;
                case '*': return left * right;
                case '/': return left / right;
                case '%': return left % right;
                case '==': return left === right;
                case '!=': return left !== right;
                case '>': return left > right;
                case '<': return left < right;
                case '>=': return left >= right;
                case '<=': return left <= right;
                case '&&': return left && right;
                case '||': return left || right;
                default: throw new Error(`Unknown operator: ${node.operator}`);
            }
        }

        if (node instanceof UnaryOperationNode) {
            const right = this.evaluate(node.right);

            switch (node.operator) {
                case '!': return !right;
                case '-': return -right;
                default: throw new Error(`Unknown operator: ${node.operator}`);
            }
        }

        if (node instanceof ObjectAccessNode) {
            const object = this.evaluate(node.object);
            return object[node.property];
        }

        if (node instanceof BracketAccessNode) {
            const object = this.evaluate(node.object);
            const property = this.evaluate(node.property);
            return object[property];
        }

        if (node instanceof FunctionCallNode) {
            const callee = this.evaluate(node.callee);
            const args = node.args.map(arg => this.evaluate(arg));

            if (typeof callee !== 'function') {
                throw new Error(`${node.callee.name} is not a function`);
            }

            return callee(...args);
        }

        if (node instanceof InOperatorNode) {
            let checkArray = []
            let value = null

            if (node.right instanceof ArrayNode) {
                checkArray = node.right.elements
            } else if (node.right instanceof IdentifierNode) {
                if (Array.isArray(this.context[node.right.name])) {
                    checkArray = this.context[node.right.name]
                } else {
                    throw new Error(`${node.right.name} is not a array`);
                }
            } else {
                throw new Error(`${node.right.name} is not a array`);
            }

            for (let i = 0; i < checkArray.length; i++) {
                const element = checkArray[i];
                if (element instanceof ValueNode) {
                    checkArray[i] = element.Getvalue()
                } else if (element instanceof IdentifierNode) {
                    checkArray[i] = this.context[element.name]
                } else {
                    throw new Error(`${element} is not a valid type`);
                }
            }

            if (node.left instanceof ValueNode) {
                value = node.left.Getvalue()
            } else if (node.left instanceof IdentifierNode) {
                value = this.context[node.left.name]
            } else {
                throw new Error(`${node.left} is not a valid type`);
            }

            return checkArray.filter((item) => item == value).length > 0
        }

        throw new Error(`Unknown node type: ${node.constructor.name}`);
    }
}

export default Evaluator