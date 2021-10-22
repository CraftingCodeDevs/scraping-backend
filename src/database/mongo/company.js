
const {Schema, model} = require('mongoose');

const companySchema = Schema({
    name: {
        type: String,
        require: [true, 'Name is required']
    },
    email: {
        type: String,
        require: [true, 'Email is required'],
        unique: true
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    }
});

companySchema.methods.toJSON = function() {
    //sacar __v, password del objeto y dejar las propiedades restantes
    const {__v, ...company} = this.toObject();
    company.uid = _id;
    return company;
}

module.exports = model('company', companySchema);