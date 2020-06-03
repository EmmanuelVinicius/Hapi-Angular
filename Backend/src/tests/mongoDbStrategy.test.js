const assert = require('assert')
const Mongodb = require('./../database/strategies/mongodb/mongodbStrategy')
const vehicleSchema = require('./../database/strategies/mongodb/schemas/vehicleSchema')

const Context = require('./../database/strategies/base/contextStrategy')



let context = {}

const MOCK_VEHICLE_CADASTRAR = {
    placa: 'HBP1234',
    chassi: '9BG188GW04C448001',
    renavam: 42897150266,
    modelo: 'Carajas/ Tocantis/ Xavante/ Vip',
    marca: 'Gurgel',
    ano: '1985'
};
const MOCK_VEHICLE_ATUALIZAR = {
    placa: 'GRA7998',
    chassi: '9BG116GW08B865087',
    renavam: 71232765145,
    modelo: 'Excel GLS',
    marca: 'Hyundai',
    ano: '1992'
};
let MOCK_VEHICLE_ID = '';
describe('Suite de testes do MongoDb Strategy', function () {
    this.timeout(20000)
    this.beforeAll(async () => {
        const connection = Mongodb.connect();
        context = new Context(new Mongodb(connection, vehicleSchema));
        
        const base = await context.create(MOCK_VEHICLE_ATUALIZAR);
        MOCK_VEHICLE_ID = base._id;
    })
    it('Verifica conexao do mongodb', async () => {
        const result = await context.isConected()

        assert.ok(result === 'Conectado' || result === 'Conectando')
    })
    it('Cadastra um vehicle no mongodb', async () => {
        const { name } = await context.create(MOCK_VEHICLE_CADASTRAR);

        assert.deepStrictEqual(name, MOCK_VEHICLE_CADASTRAR.name)
    })
    it('Lista companies do mongodb', async () => {
        const [{ name }] = await context.read({ name: MOCK_VEHICLE_ATUALIZAR.name });

        assert.deepStrictEqual(name, MOCK_VEHICLE_ATUALIZAR.name)
    })
    it('Atualiza um vehicle do mongodb', async () => {
        const result = await context.update(MOCK_VEHICLE_ID, {
            ano: 2011
        });

        assert.deepStrictEqual(result.nModified, 1);
    })
    it('Deleta um vehicle do mongodb', async () => {
        const result = await context.delete(MOCK_VEHICLE_ID);

        assert.deepStrictEqual(result.n, 1);
    })
})