export class ApiToken {
    constructor(token) {
      this.token = token;
    }
  }

  export class ClasificacionGet {
    constructor(name, puntuacion) {
        this.data = {
            name: name,
            puntuacion: puntuacion
        };
    }
}

export class ClasificacionPost {
    constructor(api_token, name, puntuacion) {
        this.api_token = api_token;
        this.name = name;
        this.puntuacion = puntuacion;
        this.success = "Classification added successfully";
    }

    getSuccess() {
        return this.success;
    }
}

export class PostsGet {
    constructor(title, content) {
        this.data = {
            title: title,
            content: content
        }
    }
}

export class CommentsGet {
    constructor(name, content) {
        this.data = {
            name: name,
            content: content
        }
    }
}

export class CommentsPost {
    constructor(api_token, name, content) {
        this.api_token = api_token;
        this.name = name;
        this.content = content;
        this.success = "Comments added successfully";
    }

    getSuccess() {
        return this.success;
    }
}

export class ContactPost {
    constructor(api_token, nombre, email, asunto, mensaje) {
        this.api_token = api_token;
        this.nombre = nombre;
        this.email = email;
        this.asunto = asunto;
        this.mensaje = mensaje;
        this.success = "Message added successfully";
    }

    getSuccess() {
        return this.success;
    }
}