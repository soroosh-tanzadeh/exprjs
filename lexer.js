class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

class Lexer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.currentChar = this.input[this.position];
    }

    advance() {
        this.position++;
        this.currentChar = this.position < this.input.length ? this.input[this.position] : null;
    }

    skipWhitespace() {
        while (this.currentChar !== null && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    number() {
        let result = '';
        while (this.currentChar !== null && /\d/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return new Token('NUMBER', parseFloat(result));
    }

    string() {
        let result = '';
        this.advance();
        while (this.currentChar !== null && this.currentChar !== '"') {
            result += this.currentChar;
            this.advance();
        }
        this.advance();
        return new Token('STRING', result);
    }

    identifier() {
        let result = '';
        while (this.currentChar !== null && /[a-zA-Z_]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }

        // Check for keywords or boolean literals
        if (result === 'true' || result === 'false') {
            return new Token('BOOLEAN', result === 'true');
        }
        if (result === 'null') {
            return new Token('NULL', null);
        }

        if (result == 'in') {
            return new Token('IN', 'in')
        }

        return new Token('IDENTIFIER', result);
    }

    nextToken() {
        while (this.currentChar !== null) {
            if (/\s/.test(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }

            if (/\d/.test(this.currentChar)) {
                return this.number();
            }

            if (this.currentChar === '"') {
                return this.string();
            }

            if (/[a-zA-Z_]/.test(this.currentChar)) {
                return this.identifier();
            }

            // Handle multi-character operators
            if (this.currentChar === '=' && this.input[this.position + 1] === '=') {
                this.advance();
                this.advance();
                return new Token('EQ', '==');
            }

            if (this.currentChar === '!' && this.input[this.position + 1] === '=') {
                this.advance();
                this.advance();
                return new Token('NEQ', '!=');
            }

            if (this.currentChar === '>' && this.input[this.position + 1] === '=') {
                this.advance();
                this.advance();
                return new Token('GTE', '>=');
            }

            if (this.currentChar === '<' && this.input[this.position + 1] === '=') {
                this.advance();
                this.advance();
                return new Token('LTE', '<=');
            }

            if (this.currentChar === '&' && this.input[this.position + 1] === '&') {
                this.advance();
                this.advance();
                return new Token('AND', '&&');
            }

            if (this.currentChar === '|' && this.input[this.position + 1] === '|') {
                this.advance();
                this.advance();
                return new Token('OR', '||');
            }

            // Single-character tokens
            const singleCharTokens = {
                '+': 'PLUS',
                '-': 'MINUS',
                '*': 'MULTIPLY',
                '/': 'DIVIDE',
                '%': 'MODULO',
                '>': 'GT',
                '<': 'LT',
                '!': 'NOT',
                '(': 'LPAREN',
                ')': 'RPAREN',
                '[': 'LBRACKET',
                ']': 'RBRACKET',
                '.': 'DOT',
                ',': 'COMMA',
            };

            if (singleCharTokens[this.currentChar]) {
                const tokenType = singleCharTokens[this.currentChar];
                const tokenValue = this.currentChar;
                this.advance();
                return new Token(tokenType, tokenValue);
            }

            throw new Error(`Unexpected character: ${this.currentChar}`);
        }

        return new Token('EOF', null);
    }
}

export default Lexer