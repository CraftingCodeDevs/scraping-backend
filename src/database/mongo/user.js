
const {Schema, model} = require('mongoose');

const userSchema = Schema({
    name: {
        type: String,
        require: [true, 'Name is required']
    },
    email: {
        type: String,
        require: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'Password is required'],
    },
    img: {
        type: String,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'role',
        required: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company',
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    phone: {
        type: String,
    }
});

userSchema.methods.toJSON = function() {
    //sacar __v, password del objeto y dejar las propiedades restantes
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('User', userSchema);