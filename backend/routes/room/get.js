module.exports = (db) => (req, res) => {
    const data = req.body;

    if (!data || !data.id) {
        return res.status(400).json({ error: 'Room ID is required' });
    }
    const roomId = data.id;
    const room = db.rooms.find(r => r.id === roomId);

    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ message: room });
};
