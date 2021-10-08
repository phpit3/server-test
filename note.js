export const room_game = {
    _id: 'roomId',
    name: 'roomName',
    max: 2,
    currentCount: 0,
    currentTurn: 1,
    turnPlay: 0, // '0 || 1 || 2'
    players: []
}

/* join: send _id user.
- hien tai: gen random + check if currentCount >= max => can't
- vao setting lay 5 con tuong cua da chon moi khi ra tran
- => player of players: 
{
    _id: random1,
    name: namePlayer1,
    dna: [
        { name: 'A1', health: 200, skill: {}, target: {}, hurt: {} },
        { name: 'B1', health: 310, skill: {}, target: {}, hurt: {} },
        ...
    ],
}

{
    _id: random2,
    name: namePlayer2,
    dna: [
        { name: 'A2', health: 250, skill: {}, target: {}, hurt: {} },
        { name: 'B2', health: 240, skill: {}, target: {}, hurt: {} },
        ...
    ],
}


*/