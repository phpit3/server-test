var express = require('express');

const router = express.Router();

const NAME = ['Mage', 'Reptile'];

router.post('/message', async (req, res) => {
    try {
        res.send('message abcabc: 123123');
        __emmit.emit("message", { id: "server", message: "sssasasadas" });
    } catch (error) {
        res.send(error).status(200);
    }
});

router.post('/join', async (req, res) => {
    try {
        __room.currentCount++;
        
        if (__room.currentCount > 2) {
            return res.status(200).json({});
        }

        const dataPlayer = {
            name: 'Player_' + __room.currentCount,
            characters: [
                {
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                },
                {
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                },
                {
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                },
                {
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                },
                {
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                }
            ],
        }

        const otherPlayer = __room.player[0];

        __room.player.push(dataPlayer);

        __emmit.emit("join", dataPlayer);

        return res.status(200).json(otherPlayer);
    } catch (error) {
        return res.send(error).status(200);
    }
})

module.exports = router;
