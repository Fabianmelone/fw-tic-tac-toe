document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    const gameFields = document.querySelectorAll<HTMLButtonElement>('.game-field');
    const resetButton = document.querySelector<HTMLButtonElement>('#reset-button');
    const resultMessage = document.querySelector<HTMLParagraphElement>('.result-text');
    const playerDisplay = document.querySelector<HTMLSpanElement>('#game-player');



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

    if (!loadGameState()) {
        const randomPlayer = players[ Math.floor ( Math.random() * players.length )];
        body?.classList.add(randomPlayer);
        updateCurrentPlayer();
    }

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

            saveGameState();
            updateCurrentPlayer();

            //check for a win after every move
            if (checkWin(currentPlayer)) {
                resultMessage!.style.display = 'block';
                resultMessage!.textContent =`Player ${currentPlayer.toUpperCase()} won!`;
                setTimeout(resetGame, 2000);
                //after testing I found out that it was showing a draw even if somebody won
                return;
            }

            if (checkDraw()) {
                resultMessage!.style.display = 'block';
                resultMessage!.textContent = 'Draw!';
                setTimeout(resetGame, 2000);
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


    function checkDraw(): boolean {
        for (let gameField of gameFields) {
            if (!gameField.getAttribute('data-player')) {
                // if any field is empty, not a draw
                return false; 
            }
        }
        // in this case all fields are filled, so its a draw
        return true; 
    }
    


    function updateCurrentPlayer() {
        if(body?.classList.contains('player-o')) {
            playerDisplay!.textContent = 'O';
        } else {
            playerDisplay!.textContent = 'X';
        }
    }


    //this is the local storage current save of the gamestate
    function saveGameState() {
        const state: any = {
            fields: Array.from(gameFields).map((field) => ({
                //get an array of objects that save the current field id, the player with its current attribute and if the field is disabled or not
                id: field.id,
                player: field.getAttribute('data-player'),
                disabled: field.disabled
            })),
            //check also the current body class
            currentPlayer: body?.classList.contains('player-o') ? 'player-o' : 'player-x',
            // also save the resultmessage, to have all the components of the current game state saved
            resultMessage:resultMessage!.style.display === 'block' ? resultMessage!.textContent : null
        };
        localStorage.setItem('tic-tac-toe', JSON.stringify(state));
    }


    //load game on the state where it got left off
    function loadGameState() {
        const savedState = localStorage.getItem('tic-tac-toe');
        // if no saved game state return
        if (!savedState) {return}; 

        // parse the current game state
        const state = JSON.parse(savedState);

        // for each field fill out the data player attributes that were filled out before again and set the gameField to disabled
        state.fields.forEach((field: { id: string; player: string | null; disabled: boolean}) => {
            const gameField = document.getElementById(field.id) as HTMLButtonElement;
            if (field.player) {
                gameField.setAttribute('data-player', field.player);
                gameField.disabled = field.disabled;
            }
        });

        //remove both body classes and add the current playerstate
        body?.classList.remove('player-o', 'player-x');
        body?.classList.add(state.currentPlayer);
        //also update the player on the page
        updateCurrentPlayer();


        //if there is a resultmessage to show, also display it
        if (state.resultMessage) {
            resultMessage!.style.display = 'block';
            resultMessage!.textContent = state.resultMessage;
        }
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
        resultMessage!.style.display = 'none';
        //reset the current gamestorage in the localstorage as well
        localStorage.removeItem('tic-tac-toe');
    }

    resetButton?.addEventListener('click', () => {
        resetGame();
    })
});