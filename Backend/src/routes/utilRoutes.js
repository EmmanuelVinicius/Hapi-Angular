const BaseRoutes = require('./base/baseRoute');
const Joi = require('joi')
const { join } = require('path')

const failAction = (request, headers, erro) => {
    throw erro;
}
const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown();

class UtilRoutes extends BaseRoutes {

    coverage() {
        return {
            path: '/coverage/{param*}',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Mostra a cobertura do código',
                notes: 'Exibe como o código está coberto com Istanbul',
                validate: {
                    failAction,
                    headers,
                },
                handler: {
                    directory: {
                        path: join(__dirname, '../../coverage'),
                        redirectToSlash: true,
                        index: true
                    }
                }
            }
        }

    }
}
module.exports = UtilRoutes