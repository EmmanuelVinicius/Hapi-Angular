
class PesquisaHelper {
    static parametros(params) {
        let query = {};
//placa, chassi, renavam, modelo, marca, ano
        if (params.placa) {
            query = {
                ...query,
                placa: { $regex: `.*${params.placa}*.` },
            }
        }
        if (params.chassi) {
            query = {
                ...query,
                chassi: { $regex: `.*${params.chassi}*.` },
            }
        }
        if (params.renavam) {
            query = {
                ...query,
                renavam: { $regex: `.*${params.renavam}*.` },
            }
        }                
        if (params.modelo) {
            query = {
                ...query,
                modelo: { $regex: `.*${params.modelo}*.` },
            }
        }
        if (params.marca) {
            query = {
                ...query,
                marca: { $regex: `.*${params.marca}*.` },
            }
        }        
        if (params.ano) {
            query = {
                ...query,
                ano: { $regex: `.*${params.ano}*.` },
            }
        }
        return query;
    }
}

module.exports = PesquisaHelper;