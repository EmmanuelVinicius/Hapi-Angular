const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('boom');
const Jwt = require('jsonwebtoken');
const PasswordHelper = require('./../helpers/passwordHelper');

const failAction = (request, headers, erro) => {
    throw erro;
}

class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super();
        this._secret = secret;
        this._db = db;
    }
    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                cors: true,
                auth: false,
                tags: ['api'],
                description: 'Obter o token de acesso',
                notes: 'Pega o token de login com usuario e senha',
                validate: {
                    failAction,
                    payload: {
                        email: Joi.string().email().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                const result = await request.payload;
                const [usuario] = await this._db.read({ email: result.email, });

                if (!usuario) return Boom.unauthorized('O usuário não existe');

                const match = await PasswordHelper.comparePassword(result.password, usuario.senha);
                if (!match) return Boom.unauthorized('Senha incorreta');

                const token = Jwt.sign({
                    user: result.usuario,
                    id: usuario.id
                }, this._secret);

                return { token };
            }
        }
    }
}

module.exports = AuthRoutes;