/** essa classe trata errors internos, que não serão passados apra o usuario */

export class InternalError extends Error {
    constructor(
        public message: string,
        protected code: number = 500,
        protected description?: string
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor); // caso ocorra o erro, essa classe não é mostrada. Mas a partir de onde o erro acontece.
    }
}
