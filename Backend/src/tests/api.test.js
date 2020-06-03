const assert = require('assert');
const api = require('./../../api');


const MOCK_VEHICLE_CADASTRAR = {
    placa: 'HGL2566',
    chassi: '9BG116GW04C400001',
    renavam: 82105010612,
    modelo: 'Clio Dynamique 1.6 16V 110cv 3p',
    marca: 'Renault',
    ano: '2004'
};
let MOCK_ID = {};
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjYsImlhdCI6MTU5MTA1MjIwNX0.iNS1_uNWn58KyHnrLfEi9MtINC85yE-NogHAOx4blHg';
const headers = {
    authorization: TOKEN
};


describe('Suite de Testes da API', function () {
    this.beforeAll(async () => {
        this.timeout(20000)
        app = await api;
        const result = await app.inject({
            method: 'POST',
            url: '/vehicle',
            headers,
            payload: JSON.stringify(MOCK_VEHICLE_CADASTRAR)
        });

        const id = JSON.parse(result.payload);
        MOCK_ID = id._id;
    });

    it('Lista a partir da /vehicle', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/vehicle?skip=0&limit=10'
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepStrictEqual(statusCode, 200);
        assert.ok(Array.isArray(dados));
    });
    it('Lista de /vehicle com limit correto', async () => {
        const TAMANHO_LIMITE = 3;
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/vehicle?skip=0&limit=${TAMANHO_LIMITE}`
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepStrictEqual(statusCode, 200);
        assert.ok(dados.length === TAMANHO_LIMITE)
    });
    it('Lista de /vehicle com paginação e dá erro de limit', async () => {
        const TAMANHO_LIMITE = 'ASFE';
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/vehicle?skip=0&limit=${TAMANHO_LIMITE}`
        });
        const statusCode = result.statusCode;

        assert.ok(statusCode !== 200);
    })
    it('Filtra de /vehicle', async () => {
        const TAMANHO_LIMITE = 1000;
        const MARCA = MOCK_VEHICLE_CADASTRAR.marca
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/vehicle?skip=0&limit=${TAMANHO_LIMITE}&marca=${MARCA}`
        });
        const [{ marca }] = JSON.parse(result.payload)
        const statusCode = result.statusCode;

        assert.deepStrictEqual(statusCode, 200);
        assert.ok(marca === MARCA)
    });
    it('Listar apenas uma pessoa', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/vehicle/${MOCK_ID}`
        })
        
        const { _id } = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.ok(statusCode === 200)
        assert.deepStrictEqual(_id, MOCK_ID);
    });
    it('Não lista apenas uma de /vehicle/:id', async () => {
        const FAKE = '5c6b04973c32352ecc6cfd24';
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/vehicle/${FAKE}`
        });

        const statusCode = result.statusCode;

        assert.ok(statusCode === 200)
        assert.ok(!result.payload)
    });
    it('Cadastra em /vehicle', async () => {
        const result = await app.inject({
            method: 'POST',
            headers,
            url: `/vehicle`,
            payload: MOCK_VEHICLE_CADASTRAR
        });

        const statusCode = result.statusCode;
        const { message, _id } = JSON.parse(result.payload)

        assert.ok(statusCode === 200);
        assert.notDeepStrictEqual(_id, undefined)
        assert.deepStrictEqual(message, 'Cadastrado com sucesso')
    })
    it('Atualiza item de /vehicle/:id', async () => {
        const expected = {
            ano: 2011
        }
        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/vehicle/${MOCK_ID}`,
            payload: JSON.stringify(expected)

        });
        
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.deepStrictEqual(dados.message, 'Atualizado com sucesso')
    });
    it('Não atualiza item de /vehicle/:id e dá erro de ID', async () => {
        const expected = {
            ano: 2011
        }
        const FAKE = '5c6b04973c32352ecc6cfd24';
        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/vehicle/${FAKE}`,
            payload: JSON.stringify(expected)

        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.ok(statusCode !== 200);
        assert.deepStrictEqual(dados.message, 'Houve um erro')
    });
    it('Remove de /vehicle/:id', async () => {
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/vehicle/${MOCK_ID}`
        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.deepStrictEqual(dados.message, 'Removido com sucesso');

    });
    it('Não remove de /vehicle/:id e dá erro de ID', async () => {
        const FAKE = '5c6b04973c32352ecc6cfd24';
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/vehicle/${FAKE}`
        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.ok(statusCode !== 200);
        assert.deepStrictEqual(dados.message, 'Houve um erro');

    })
});

