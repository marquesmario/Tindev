const Dev = require('../models/Dev');

module.exports = {
    async store(req, res) {

        const { user } = req.headers;
        const { devId } = req.params;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        console.log(targetDev);

        if (!targetDev) {
            return res.status(400).json({ error: "Dev Não Existe"});
        }

        if(targetDev.dislikes.includes(loggedDev._id)){
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if(loggedSocket){
                req.io.to(loggedSocket).emit('unmatch', targetDev);
            }

            if(targetSocket){
                req.io.to(targetSocket).emit('unmatch', loggedDev);
            }
        }

        loggedDev.dislikes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev);
    }
}