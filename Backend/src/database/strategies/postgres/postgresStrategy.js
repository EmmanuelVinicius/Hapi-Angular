const ICrud = require('./../interfaces/ICrud');
const Sequelize = require('sequelize');


class Postgres extends ICrud {
    constructor(connection, schema) {
        super();
        this._connection = connection;
        this._schema = schema;
    }
    static async connect() {
        const connection = new Sequelize(process.env.POSTGRES_URL, {
                operatorsAliases: false,
                logging: false,
                quoteIdentifiers: false,
                ssl: process.env.SSL_DB,
                dialectOptions: {
                    ssl: process.env.SSL_DB
                }
            });
        return connection;
    }
    static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name, schema.schema, schema.options
        );
        await model.sync();
        return model;
    }
    async isConected() {
        try {
            await this._connection.authenticate();
            return true;
        } catch (error) {
            console.error('Erro de conexão', error);
            return false;
        }
    }
    async create(item) {
        const { dataValues } = await this._schema.create(item);
        return dataValues;
    }
    async read(query = {}) {
        const result = this._schema.findAll({
            where: query,
            raw: true
        });
        return result;
    }
    update(id, newItem, upsert = false) {
        const fn = upsert ? 'upsert' : 'update';
        return this._schema[fn](newItem, { where: { id } });
    }
    delete(id) {
        const query = id ? { id } : { };
        return this._schema.destroy({where: query});
    }
}

module.exports = Postgres;
