var express = require('express');

const router = express.Router();

const NAME = ['Mage', 'Reptile'];

const RnId = () => String(parseInt(Date.now() * Math.random()));

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

        const playerData = {
            name: 'player' + __room.currentCount,
            characters: [
                {
                    _id: RnId(),
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                    health: Math.floor(Math.random() * (1000 - 500) + 500),
                    mana: Math.floor(Math.random() * (600 - 300) + 300),
                    owner: 'player' + __room.currentCount,
                    order: 0,
                },
                {
                    _id: RnId(),
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                    health: Math.floor(Math.random() * (1000 - 500) + 500),
                    mana: Math.floor(Math.random() * (600 - 300) + 300),
                    owner: 'player' + __room.currentCount,
                    order: 1,
                },
                {
                    _id: RnId(),
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                    health: Math.floor(Math.random() * (1000 - 500) + 500),
                    mana: Math.floor(Math.random() * (600 - 300) + 300),
                    owner: 'player' + __room.currentCount,
                    order: 2,
                },
                {
                    _id: RnId(),
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                    health: Math.floor(Math.random() * (1000 - 500) + 500),
                    mana: Math.floor(Math.random() * (600 - 300) + 300),
                    owner: 'player' + __room.currentCount,
                    order: 3,
                },
                {
                    _id: RnId(),
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                    health: Math.floor(Math.random() * (1000 - 500) + 500),
                    mana: Math.floor(Math.random() * (600 - 300) + 300),
                    owner: 'player' + __room.currentCount,
                    order: 4,
                }
            ],
        }

        const otherPlayer = __room.player[0];

        __room.player.push(playerData);

        __emmit.emit("join", playerData);

        if (__room.player.length >= 2) {
            const turnPlay = __room.player[0].characters.concat(__room.player[1].characters);
            
            turnPlay.sort((a, b) => b.speed - a.speed);

            __room.turnPlay = turnPlay;
            __emmit.emit("list_turn_game", { turnPlay, turn: __room.currentTurn });
        }

        return res.status(200).json({ rolePlay: 'player' + __room.currentCount, playerData });
    } catch (error) {
        return res.send(error).status(200);
    }
});

router.post('/ready', async (req, res) => {
    try {
        const { rolePlay, characters } = req.body;

        __room.player.forEach(player => {
            if (player.name === rolePlay) {
                player.characters = characters;
            }
        });

        __room.turnPlay.forEach(turn => {
            if (turn.owner === rolePlay) {
                const character = characters.find(ch => ch._id === turn._id);

                if (character) {
                    turn.target = character.target;
                    turn.action = character.action;
                    turn.order = character.order;

                    switch (character.action) {
                        case "mana":
                            
                            break;

                        case "skill":
                            break;
                        
                        case "defense":
                            break;

                        case "attack":
                            break;
                    
                        default:
                            break;
                    }
                }
            }
        });

        __room.readyTurn.push(rolePlay);

        if (__room.readyTurn.length >= 2 &&
            __room.readyTurn.includes("player1") &&
            __room.readyTurn.includes("player2")
        ) {
            __emmit.emit("start_combat", true);

            return res.status(200).json({ resultOneTurn: turnPlay });
        } else {
            __emmit.emit("ready_combat", { rolePlay });

            return res.status(200).json({ success: true });
        }
    } catch (error) {
        return res.send(error).status(200);
    }
});

module.exports = router;
