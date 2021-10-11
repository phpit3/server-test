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
                    health: Math.floor(Math.random() * (1000 - 500) + 500),
                    mana: Math.floor(Math.random() * (600 - 300) + 300),
                    owner: 'player' + __room.currentCount,
                },
                {
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                    health: Math.floor(Math.random() * (1000 - 500) + 500),
                    mana: Math.floor(Math.random() * (600 - 300) + 300),
                    owner: 'player' + __room.currentCount,
                },
                {
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                    health: Math.floor(Math.random() * (1000 - 500) + 500),
                    mana: Math.floor(Math.random() * (600 - 300) + 300),
                    owner: 'player' + __room.currentCount,
                },
                {
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                    health: Math.floor(Math.random() * (1000 - 500) + 500),
                    mana: Math.floor(Math.random() * (600 - 300) + 300),
                    owner: 'player' + __room.currentCount,
                },
                {
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                    health: Math.floor(Math.random() * (1000 - 500) + 500),
                    mana: Math.floor(Math.random() * (600 - 300) + 300),
                    owner: 'player' + __room.currentCount,
                }
            ],
        }

        const otherPlayer = __room.player[0];

        __room.player.push(dataPlayer);

        __emmit.emit("join", dataPlayer);

        if (__room.player.length >= 2) {
            const turnPlay = __room.player[0].characters.concat(__room.player[1].characters);
            
            turnPlay.sort((a, b) => b.speed - a.speed);

            __room.turnPlay = turnPlay;
            __emmit.emit("list_turn_game", { turnPlay, turn: __room.currentTurn });
            __emmit.emit("start_combat", true);
        }

        return res.status(200).json({ rolePlay: 'player' + __room.currentCount });
    } catch (error) {
        return res.send(error).status(200);
    }
})

module.exports = router;
