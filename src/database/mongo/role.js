const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    name: {
        type: String,
        require: [true, 'El rol es obligatorio']
    }
})
module.exports = model('role', RoleSchema);