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

        if (__room.currentCount > 2) {
            return res.status(200).json({});
        }

        const playerData = {
            name: 'player' + __room.currentCount,
            characters: genChampions(),
        }
        
        playerData.characters.forEach(p => {
            p.endHp = p.startHp;
            p.endMana = 0;
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

        __room.player = __room.player.map(player => {
            if (player.name === rolePlay) {
                player.characters.forEach(e => {
                    const newValue = characters.find(c => c._id === e._id);
                    if (newValue) {
                        e = newValue;
                    }
                });
            }
            return player;
        });

        __room.turnPlay = __room.turnPlay.map(turn => {
            if (turn.owner === rolePlay) {
                const newValue = characters.find(c => c._id === turn._id);
                if (newValue) {
                    turn = newValue;
                }
            }
            return turn;
        });

        __room.readyTurn.push(rolePlay);

        if (__room.readyTurn.length >= 2 &&
            __room.readyTurn.includes("player1") &&
            __room.readyTurn.includes("player2")
        ) {
            // console.log(__room.turnPlay);
            let index = 0;

            const updateDataTurn = __room.turnPlay.map(turn => {
                if (turn.targetId.length > 0) {
                    switch (turn.action) {
                        case "mana":

                            break;
    
                        case "skill":
                            if (turn.skill === "ca_sau") {
                                turn.target.forEach(e => {
                                    e.endHp = e.endHp - 150 > 0 ? e.endHp - 150 : 0;
                                });
                                turn.endMana -= 150;
                            }
                            break;
                        
                        case "defense":
                            break;
    
                        case "attack":
                            // Cc : BE => check sau do no co trong target ko va mau endHP bao nhieu

                            // hurt
                            turn.target[0].endHp = turn.target[0].endHp < 50 ? 0 : turn.target[0].endHp - 50;

                            // attack
                            turn.endMana += 50;

                            for (let i = index + 1; i < __room.turnPlay.length; i++) {
                                // object => attack : only exists in hurt <target>
                                if (__room.turnPlay[i].targetId.includes(turn._id)) {
                                    for (let j = 0; j < __room.turnPlay[i].target.length; j++) {
                                        if (__room.turnPlay[i].target[j]._id === turn._id) {
                                            __room.turnPlay[i].target[j].endMana = turn.endMana;
                                        }
                                    }
                                }
                                // object => hurt : exists in attack <author> or hurt <target>
                                if (__room.turnPlay[i]._id === turn.target[0]._id) {
                                    __room.turnPlay[i].endHp = turn.target[0].endHp;
                                }

                                if (__room.turnPlay[i].targetId.includes(turn.target[0]._id)) {
                                    for (let j = 0; j < __room.turnPlay[i].target.length; j++) {
                                        if (__room.turnPlay[i].target[j]._id === turn.target[0]._id) {
                                            __room.turnPlay[i].target[j].endHp = turn.target[0].endHp;
                                        }
                                    }
                                }
                            }
                            break;
                    
                        default:
                            break;
                    }
                }
    
                index++;
                return turn;
            });

            __emmit.emit("start_combat", { turn: __room.currentTurn, turnPlay: updateDataTurn });
            console.log('updateDataTurn: ', updateDataTurn);
            return res.status(200).json({ turn: __room.currentTurn, turnPlay: updateDataTurn });
        } else {
            __emmit.emit("ready_combat", { rolePlay });

            return res.status(200).json({ turn: __room.currentTurn, turnPlay: [] });
        }
    } catch (error) {
        console.log(error);
        return res.send(error).status(200);
    }
});

function getChampFromPlayerData(champId) {
    const champs = __room.player[0].characters.concat(__room.player[1].characters);
    return champs.find(champ => champ._id === champId);
}

function genChampions() {
    let data = [];

    for (let i = 0; i < 5; i++) {
        data.push({
            _id: RnId(),
            name: NAME[Math.floor(Math.random() * 2)],
            speed: Math.floor(Math.random() * (500 - 200) + 200),
            startHp: Math.floor(Math.random() * (1000 - 500) + 500),
            startMana: Math.floor(Math.random() * (600 - 300) + 300),
            typeAttack: TYPE_ATTACK[Math.floor(Math.random() * 2)],
            owner: 'player' + __room.currentCount,
            order: i,
        });
    }

    return data;
}

module.exports = router;
