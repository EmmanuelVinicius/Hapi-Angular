const ICrud = require('../interfaces/ICrud');
const Mongoose = require('mongoose');

const STATUS = {
    0: 'Desconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando',
};

class MongoDB extends ICrud {
    constructor(connection, schema) {
        super();
        this._schema = schema;
        this._connection = connection;
    }
    async isConected() {
        const state = STATUS[this._connection.readyState];
        if (state === 'Conectado') return state;

        if (state !== 'Conectando') return state;
        await new Promise(resolve => setTimeout(resolve, 1000));

        return STATUS[this._connection.readyState];
    }

    static connect() {
        Mongoose.connect(process.env.MONGODB_URL,
            { useNewUrlParser: true }, function (error) {
                if (!error) return;
                console.error("Erro de conexão", error);
            });

        const connection = Mongoose.connection;
        return connection;
    }

    create(item) {
        return this._schema.create(item);
    }
    read(query, skip = 0, limit = 10) {
        const result = query.id ? this._schema.findById(query.id) :
            this._schema.find(query).skip(skip).limit(limit);
        return result;
    }
    update(_id, item) {
        return this._schema.updateOne({ _id }, { $set: item });
    }
    delete(_id) {
        return this._schema.deleteOne({ _id });
    }
}

module.exports = MongoDB;