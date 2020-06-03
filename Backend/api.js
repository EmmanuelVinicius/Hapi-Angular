const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert')

const env = process.env.NODE_ENV || "dev"
ok(env === "production" || env === "dev", "Invalid ENV. English papa")

const configPath = join(__dirname, './config', `.env.${env}`)
config({ path: configPath })

const Hapi = require('hapi');
const MongoDb = require('./src/database/strategies/mongodb/mongodbStrategy');
const Context = require('./src/database/strategies/base/contextStrategy');
const VehicleSchema = require('./src/database/strategies/mongodb/schemas/vehicleSchema');

const Postgres = require('./src/database/strategies/postgres/postgresStrategy');
const UsuarioSchema = require('./src/database/strategies/postgres/schemas/usuarioSchema');

const VehicleRoute = require('./src/routes/vehicleRoutes');
const AuthRoute = require('./src/routes/authRoutes');
const UtilRoute = require('./src/routes/utilRoutes')

const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
const HapiAuthJwt2 = require('hapi-auth-jwt2');


const JWT_SECRET = process.env.JWT_SECRET;
const app = new Hapi.Server({ port: process.env.PORT })


function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDb.connect();
    const context = new Context(new MongoDb(connection, VehicleSchema));

    const connectionPostgres = await Postgres.connect();
    const usuarioModel = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
    const contextPostgres = new Context(new Postgres(connectionPostgres, usuarioModel))

    const swaggerOptions = {
        info: {
            title: 'API CRUD de Vehicle',
            version: 'v1.0'
        },
        lang: 'pt'
    }
    await app.register([
        HapiAuthJwt2,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        options: {
            expiresIn: 900000
        },
        validate: async (dados, request) => {
            const [result] = await contextPostgres.read({
                email: dados.email
            });

            if (!result) return {
                isValid: true
            }
        }
    })
    app.auth.default('jwt')
    app.route([
        ...mapRoutes(new VehicleRoute(context), VehicleRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods()),
        ...mapRoutes(new UtilRoute(), UtilRoute.methods())
    ]);

    await app.start();
    return app;
}

module.exports = main();
