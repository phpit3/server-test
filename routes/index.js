var express = require('express');

const router = express.Router();

const NAME = ['Mage', 'Reptile'];
const TYPE_ATTACK = ['long', 'short'];

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
        console.log(__room);
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
                    startHp: Math.floor(Math.random() * (1000 - 500) + 500),
                    startMana: Math.floor(Math.random() * (600 - 300) + 300),
                    typeAttack: TYPE_ATTACK[Math.floor(Math.random() * 2)],
                    owner: 'player' + __room.currentCount,
                    order: 0,
                },
                {
                    _id: RnId(),
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                    startHp: Math.floor(Math.random() * (1000 - 500) + 500),
                    startMana: Math.floor(Math.random() * (600 - 300) + 300),
                    typeAttack: TYPE_ATTACK[Math.floor(Math.random() * 2)],
                    owner: 'player' + __room.currentCount,
                    order: 1,
                },
                {
                    _id: RnId(),
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                    startHp: Math.floor(Math.random() * (1000 - 500) + 500),
                    startMana: Math.floor(Math.random() * (600 - 300) + 300),
                    typeAttack: TYPE_ATTACK[Math.floor(Math.random() * 2)],
                    owner: 'player' + __room.currentCount,
                    order: 2,
                },
                {
                    _id: RnId(),
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                    startHp: Math.floor(Math.random() * (1000 - 500) + 500),
                    startMana: Math.floor(Math.random() * (600 - 300) + 300),
                    typeAttack: TYPE_ATTACK[Math.floor(Math.random() * 2)],
                    owner: 'player' + __room.currentCount,
                    order: 3,
                },
                {
                    _id: RnId(),
                    name: NAME[Math.floor(Math.random() * 2)],
                    speed: Math.floor(Math.random() * (500 - 200) + 200),
                    startHp: Math.floor(Math.random() * (1000 - 500) + 500),
                    startMana: Math.floor(Math.random() * (600 - 300) + 300),
                    typeAttack: TYPE_ATTACK[Math.floor(Math.random() * 2)],
                    owner: 'player' + __room.currentCount,
                    order: 4,
                }
            ],
        }
        
        playerData.characters.forEach(p => {
            p.endHp = p.startHp;
            p.endMana = p.startMana;
        });

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

router.post('/attack', async (req, res) => {
    try {
        const { rolePlay, characters } = req.body;

        __room.player.forEach(player => {
            if (player.name === rolePlay) {
                player.characters.forEach(e => {
                    const newValue = characters.find(c => c._id === e._id);
                    if (newValue) {
                        e = newValue;
                    }
                });
            }
        });

        __room.turnPlay.forEach(turn => {
            if (turn.owner === rolePlay) {
                const character = characters.find(ch => ch._id === turn._id);

                if (character) {
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
                            const target = characters.find(c => c._id === character.targetId);
                            if (target) {
                                target.endHp = target.endHp - 50 > 0 ? target.endHp - 50 : 0;
                                turn.target = target;
                            }
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
            __emmit.emit("start_combat", { turn: __room.currentTurn, turnPlay: __room.turnPlay });

            return res.status(200).json({ turn: __room.currentTurn, turnPlay: __room.turnPlay });
        } else {
            __emmit.emit("ready_combat", { rolePlay });

            return res.status(200).json({ turn: __room.currentTurn, turnPlay: [] });
        }
    } catch (error) {
        return res.send(error).status(200);
    }
});

module.exports = router;
