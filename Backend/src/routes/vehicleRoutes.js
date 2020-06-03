const BaseRoute = require('./base/baseRoute');
const PesquisaHelper = require('../helpers/pesquisaHelper');

const Joi = require('joi');
const Boom = require('boom');

const failAction = (request, headers, erro) => {
    throw Boom.internal();
}
const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown();


class VehicleRoutes extends BaseRoute {
    constructor(db) {
        super();
        this._db = db;
    }

    list() {
        return {
            path: '/vehicle',
            method: 'GET',
            config: {
                auth: false,
                cors: true,
                tags: ['api'],
                description: 'Lista todos os veículos',
                notes: 'É possível paginar e filtrar por placa, chassi, renavam, modelo, marca, ano',
                validate: {
                    failAction,
                    // headers,
                    query: {
                        placa: Joi.string().min(7).max(7),
                        chassi: Joi.string().min(17).max(17),
                        renavam: Joi.number().integer(),
                        modelo: Joi.string().min(3).max(64),
                        marca: Joi.string().min(3).max(64),
                        ano: Joi.number().integer().min(1886).max(new Date().getFullYear()),
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(1000),
                    },
                },

                handler: (request, headers) => {
                    try {
                        const searchParams = request.query;
                        const query = PesquisaHelper.parametros(searchParams);

                        return this._db.read(query, searchParams.skip, searchParams.limit);
                    } catch (error) {
                        return Boom.internal();

                    }
                }
            }
        }
    }

    listOne() {
        return {
            path: '/vehicle/{id}',
            method: 'GET',
            config: {
                auth: false,
                cors: true,
                tags: ['api'],
                description: 'Lista apenas um veículo',
                notes: 'Busca o veiculo somente pelo id especifico',
                validate: {
                    failAction,
                    // headers,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const id = request.params
                    
                    return await this._db.read(id);
                } catch (error) {
                    return Boom.internal();
                }
            }
        }
    }

    create() {
        return {
            path: '/vehicle',
            method: 'POST',
            config: {
                auth: false,
                cors: true,
                tags: ['api'],
                description: 'Cadastra novo veículo',
                notes: 'Cadastro por placa, chassi, renavam, modelo, marca, ano',
                validate: {
                    failAction,
                    // headers,
                    payload: {
                        placa: Joi.string().max(7).required(),
                        chassi: Joi.string().min(17).max(17).required(),
                        renavam: Joi.number().integer().required(),
                        modelo: Joi.string().min(3).max(64).required(),
                        marca: Joi.string().min(3).max(64).required(),
                        ano: Joi.number().integer().min(1886).max(new Date().getFullYear()).required(),
                    }
                }
            },
            handler: async (request) => {
                try {
                    const dados = request.payload;
                    const result = await this._db.create(dados)
                    return {
                        message: 'Cadastrado com sucesso',
                        _id: result._id
                    }
                } catch (error) {
                    return Boom.internal();
                }
            }
        }
    }
    update() {
        return {
            path: '/vehicle/{id}',
            method: 'PATCH',
            config: {
                auth: false,
                cors: true,
                tags: ['api'],
                description: 'Atualiza um registro',
                notes: 'É possível atualizar um veículo pelo ID',
                validate: {
                    failAction,
                    // headers,
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        placa: Joi.string().max(7),
                        chassi: Joi.string().min(17).max(17),
                        renavam: Joi.number().integer(),
                        modelo: Joi.string().min(3).max(64),
                        marca: Joi.string().min(3).max(64),
                        ano: Joi.number().integer().min(1886).max(new Date().getFullYear()),
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params;
                    const { payload } = request;
                    const dadosString = JSON.stringify(payload);

                    const dados = JSON.parse(dadosString);
                    const result = await this._db.update(id, dados);
                    if (result.nModified !== 1) return Boom.preconditionFailed('Houve um erro');
                    return {
                        message: 'Atualizado com sucesso'
                    }
                } catch (error) {
                    return Boom.internal();
                }
            }
        }
    }
    delete() {
        return {
            path: '/vehicle/{id}',
            method: 'DELETE',
            config: {
                auth: false,
                cors: true,
                tags: ['api'],
                description: 'Apaga um registro',
                notes: 'Deleta um registro pelo ID',
                validate: {
                    failAction,
                    // headers,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params;
                    const result = await this._db.delete(id);

                    if (result.n !== 1) return Boom.preconditionFailed('Houve um erro');
                    return { message: 'Removido com sucesso' }
                } catch (error) {
                    return Boom.internal();
                }
            }
        }
    }
}

module.exports = VehicleRoutes;