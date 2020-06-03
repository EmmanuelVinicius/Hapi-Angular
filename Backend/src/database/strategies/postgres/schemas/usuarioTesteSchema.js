const Sequelize = require('sequelize');

const UsuarioTesteSchema = {
    name: 'usuarios_teste',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        userrole: {
            type: Sequelize.STRING,
            required: true
        },
        nome: {
            type: Sequelize.STRING,
            required: true
        },
        sobrenome: {
            type: Sequelize.STRING,
            required: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            required: true
        },
        senha: {
            type: Sequelize.STRING,
            required: true
        }
    },
    options: {
        tableName: 'usuarios_teste',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = UsuarioTesteSchema;