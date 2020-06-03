const Mongoose = require('mongoose');

const vehicleSchema = new Mongoose.Schema({
    placa: {
        type: String,
        required:true,
    },
    chassi: {
        type: String,
        required:true
    },
    renavam: {
        type: Number,
        required:true
    },
    modelo: {
        type: String,
        required:true
    },
    marca: {
        type: String,
        required:true
    },
    ano: {
        type: Number,
        required: true
    }
});
module.exports = Mongoose.model('vehicle', vehicleSchema);
