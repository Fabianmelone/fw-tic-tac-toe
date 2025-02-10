document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    const gameFields = document.querySelectorAll<HTMLButtonElement>('.game-field');


    const win = [
        // rows
        ['one', 'two', 'three'],
        ['four', 'five', 'six'],
        ['seven', 'eight', 'nine'],

        //columns
        ['one', 'four', 'seven'],
        ['two', 'five', 'eight'],
        ['three', 'six', 'nine'],

        //diagonal
        ['one', 'five', 'nine'],
        ['three', 'five', 'seven'],
    ]





    const players: string[] = ['player-o', 'player-x'];
    const randomPlayer = players[ Math.floor ( Math.random() * players.length )];
    body?.classList.add(randomPlayer);
    //add random class to the body, either the first or second player


    gameFields.forEach((gameField) => {
        gameField.addEventListener('click', () => {

            if (gameField.getAttribute('data-player')) {
                return;
                // if field is occopied stop function
            }

            //current player
            const currentPlayer = body?.classList.contains('player-o') ? 'o' : 'x';
            gameField.setAttribute('data-player', currentPlayer);
            gameField.disabled = true;
            //disable button, once field is marked

            if (currentPlayer === 'o') {
                body?.classList.remove('player-o');
                body?.classList.add('player-x');
                // if player one is playing add attribute o to the button and change to player x
            } else {
                body?.classList.remove('player-x');
                body?.classList.add('player-o');
                //same thing just the other way around
            }

            //check for a win after every move
            if (checkWin(currentPlayer)) {
                console.log(`Player ${currentPlayer.toUpperCase()} won!`);
                resetGame();
            }
            
        })
    });

    // check for the win of each player
    function checkWin(player:string): boolean {
        for (let combination of win) {
            let matches = 0;

            for (let id of combination) {
                const field = document.getElementById(id);
                if (field?.getAttribute('data-player') === player) {
                    matches++;
                }
            }

            if (matches === 3) {
                return true;
            }
        }
        //return false in all other cases
        return false;
    }

    
    //reset the game again
    function resetGame() {
        gameFields.forEach((gameField) => {
            gameField.removeAttribute('data-player');
            gameField.disabled = false;
        });
        //remove the body class
        body?.classList.remove('player-o', 'player-x');
        //make random player start again
        body?.classList.add(players[Math.floor(Math.random() * players.length)]);
    }


});