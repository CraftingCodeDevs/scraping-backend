const { request } = require('express');
const bcryptjs = require('bcryptjs');

const { User } = require('../../database/mongo/index');

const get = async (req = request) => {
    const { limit = 50, from = 0 } = req.query;
    const filter = { status: true };

    const [total, usuarios] = await Promise.all([
        User.countDocuments(filter),
        User.find(filter)
            .sort({ $natural: -1 })
            .skip(Number(from))
            .limit(Number(limit))
            .populate('role', 'name')
            .populate('company')
    ]);

    return {
        total,
        usuarios
    };
};

const getOne = async (req = request) => {
    const { id } = req.params;

    const user = await User.findById(id)
        .populate('role', 'name')
        .populate('company');

    return user;
};

const post = async (req = request) => {
    const { body } = req;

    const user = new User(body);

    if (body.password) {
        user.password = bcryptjs.hashSync(body.password, 8);
    }

    await user.save();

    return user;
}

const put = async (req = request) => {
    const { id } = req.params;
    const { status, ...body } = req.body;

    if (body.password) {
        body.password = bcryptjs.hashSync(body.password, 8);
    }

    const user = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    return user;
}

const remove = async (req = request) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { status: false }, { new: true });

    return user;
}

module.exports = {
    get,
    getOne,
    post,
    put,
    remove
};