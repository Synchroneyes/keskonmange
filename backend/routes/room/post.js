const uuid = require('uuid')
module.exports = (db) => (req, res) => {
    const data = req.body;

    if (!data || !data.name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const user = {
        id: uuid.v4(),
        name: data.name || 'Anonymous',
    }

    const room = {
        id: data.roomId || uuid.v4(),
        users : [user],
        createdAt: new Date().toISOString(),
        createdBy: user
    }

    db.users.push(user);
    db.rooms.push(room);

    res.json({ message: room });
};
