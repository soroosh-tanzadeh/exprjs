class ValueNode {
    Getvalue() {
        return this.value
    }
}

class NumberNode extends ValueNode {
    constructor(value) {
        super()
        this.value = value;
    }
}

class ArrayNode extends ValueNode {
    constructor(elements) {
        super()
        this.elements = elements;
    }
}

class StringNode extends ValueNode {
    constructor(value) {
        super()
        this.value = value;
    }
}

class BooleanNode extends ValueNode {
    constructor(value) {
        super()
        this.value = value;
    }
}

class NullNode extends ValueNode {
    constructor() {
        super()
        this.value = null;
    }
}

class IdentifierNode {
    constructor(name) {
        this.name = name;
    }
}

class InOperatorNode {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
}

class BinaryOperationNode {
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}

class UnaryOperationNode {
    constructor(operator, right) {
        this.operator = operator;
        this.right = right;
    }
}

class ObjectAccessNode {
    constructor(object, property) {
        this.object = object;
        this.property = property;
    }
}

class BracketAccessNode {
    constructor(object, property) {
        this.object = object;
        this.property = property;
    }
}

class FunctionCallNode {
    constructor(callee, args) {
        this.callee = callee;
        this.args = args;
    }
}

class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.nextToken();
    }

    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.nextToken();
        } else {
            throw new Error(`Unexpected token: ${this.currentToken.type}, expected: ${tokenType}`);
        }
    }

    factor() {
        const token = this.currentToken;

        if (token.type === 'NUMBER') {
            this.eat('NUMBER');
            return new NumberNode(token.value);
        }

        if (token.type === 'STRING') {
            this.eat('STRING');
            return new StringNode(token.value);
        }

        if (token.type === 'BOOLEAN') {
            this.eat('BOOLEAN');
            return new BooleanNode(token.value);
        }

        if (token.type === 'NULL') {
            this.eat('NULL');
            return new NullNode();
        }

        if (token.type === 'IDENTIFIER') {
            this.eat('IDENTIFIER');
            let node = new IdentifierNode(token.value);

            // Handle object access and function calls
            while (
                this.currentToken.type === 'DOT' ||
                this.currentToken.type === 'LBRACKET' ||
                this.currentToken.type === 'LPAREN'
            ) {
                if (this.currentToken.type === 'DOT') {
                    this.eat('DOT');
                    const property = this.currentToken.value;
                    this.eat('IDENTIFIER');
                    node = new ObjectAccessNode(node, property);
                } else if (this.currentToken.type === 'LBRACKET') {
                    this.eat('LBRACKET');
                    const property = this.expression();
                    this.eat('RBRACKET');
                    node = new BracketAccessNode(node, property);
                } else if (this.currentToken.type === 'LPAREN') {
                    this.eat('LPAREN');
                    const args = [];
                    while (this.currentToken.type !== 'RPAREN') {
                        args.push(this.expression());
                        if (this.currentToken.type === 'COMMA') {
                            this.eat('COMMA');
                        }
                    }
                    this.eat('RPAREN');
                    node = new FunctionCallNode(node, args);
                }
            }

            return node;
        }

        if (token.type === 'LPAREN') {
            this.eat('LPAREN');
            const expression = this.expression();
            this.eat('RPAREN');
            return expression;
        }

        if (token.type === 'LBRACKET') {
            this.eat('LBRACKET');
            const elements = [];
            while (this.currentToken.type !== 'RBRACKET') {
                elements.push(this.expression());
                if (this.currentToken.type === 'COMMA') {
                    this.eat('COMMA');
                }
            }
            this.eat('RBRACKET');
            return new ArrayNode(elements);
        }

        if (token.type === 'NOT') {
            this.eat('NOT');
            return new UnaryOperationNode('!', this.factor());
        }

        if (token.type === 'IN') {
            this.eat('IN');
            if (!(this.factor() instanceof ArrayNode)) {
                throw new Error(`Unexpected token: ${token.type} after "in" operator`);
            }
            return new InOperatorNode(this.expression(), this.factor());
        }

        if (token.type == "EOF") {
            return
        }

        throw new Error(`Unexpected token: ${token.type}`);
    }

    term() {
        let node = this.factor();

        while (
            this.currentToken.type === 'MULTIPLY' ||
            this.currentToken.type === 'DIVIDE' ||
            this.currentToken.type === 'MODULO'
        ) {
            const token = this.currentToken;
            if (token.type === 'MULTIPLY') {
                this.eat('MULTIPLY');
            } else if (token.type === 'DIVIDE') {
                this.eat('DIVIDE');
            } else if (token.type === 'MODULO') {
                this.eat('MODULO');
            }

            node = new BinaryOperationNode(node, token.value, this.factor());
        }

        return node;
    }

    expression() {
        let node = this.term();

        while (
            this.currentToken.type === 'PLUS' ||
            this.currentToken.type === 'MINUS' ||
            this.currentToken.type === 'GT' ||
            this.currentToken.type === 'LT' ||
            this.currentToken.type === 'GTE' ||
            this.currentToken.type === 'LTE' ||
            this.currentToken.type === 'EQ' ||
            this.currentToken.type === 'NEQ' ||
            this.currentToken.type === 'AND' ||
            this.currentToken.type === 'OR' ||
            this.currentToken.type === "IN"
        ) {
            const token = this.currentToken;
            if (token.type === 'PLUS') {
                this.eat('PLUS');
            } else if (token.type === 'MINUS') {
                this.eat('MINUS');
            } else if (token.type === 'GT') {
                this.eat('GT');
            } else if (token.type === 'LT') {
                this.eat('LT');
            } else if (token.type === 'GTE') {
                this.eat('GTE');
            } else if (token.type === 'LTE') {
                this.eat('LTE');
            } else if (token.type === 'EQ') {
                this.eat('EQ');
            } else if (token.type === 'NEQ') {
                this.eat('NEQ');
            } else if (token.type === 'AND') {
                this.eat('AND');
            } else if (token.type === 'OR') {
                this.eat('OR');
            } else if (token.type === "IN") {
                this.eat("IN")
                console.log(this.currentToken)
                const right = this.term();
                node = new InOperatorNode(node, right);
            }

            if (token.type !== 'IN') {
                node = new BinaryOperationNode(node, token.value, this.term());
            }

        }

        return node;
    }

    parse() {
        return this.expression();
    }
}

export default Parser
export {
    ArrayNode,
    ValueNode,
    BooleanNode, BracketAccessNode, ObjectAccessNode, BinaryOperationNode, FunctionCallNode, IdentifierNode, NullNode, NumberNode, StringNode, UnaryOperationNode, InOperatorNode
}