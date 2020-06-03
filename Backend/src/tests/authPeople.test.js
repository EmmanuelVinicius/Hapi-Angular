const assert = require('assert');
const api = require('../../api')
const Context = require('../database/strategies/base/contextStrategy')
const Postgres = require('../database/strategies/postgres/postgresStrategy');
const UsuarioSchema = require('../database/strategies/postgres/schemas/usuarioSchema')

const MOCK_USUARIO_DEFAULT = {
    userrole: 'admin',
    name: 'Emmanuel',
    sobrenome: 'Vinicius',
    email: 'emmanuel@infosistemas.com.br',
    senha: 'Salame@2019'
};
const MOCK_USER_DB = {
    email: MOCK_USUARIO_DEFAULT.email,
    senha: '$2b$04$k4MbWSbWd.ks8DjZFwmekOsHM46wR8Ft3I4JIgZMXMRHCMe5MO2rW'
}
describe('Suite de testes de autenticação', function () {
    this.beforeAll(async () => {
        app = await api;
        const connectionPostgres = await Postgres.connect()
        const usuarioModel = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
        const contextPostgres = new Context(new Postgres(connectionPostgres, usuarioModel))
        const result = await contextPostgres.update(null, MOCK_USER_DB, true)
        
    });
    it('Obtém um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                email: MOCK_USUARIO_DEFAULT.email,
                password: MOCK_USUARIO_DEFAULT.senha
            }
        });


        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepStrictEqual(statusCode, 200);
        assert.ok(dados.token.length > 10);
    });
    it('Retorna não autorizado com o login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                email: 'emailfalso@falsidade.com',
                password: '1234567'
            }
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepStrictEqual(statusCode, 401);
        assert.ok(dados.error === "Unauthorized");
    });
})