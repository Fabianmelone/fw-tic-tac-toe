document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    const gameFields = document.querySelectorAll<HTMLButtonElement>('.game-field');



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
            if (body?.classList.contains('player-o')) {
                gameField.setAttribute("data-player", 'o');
                body?.classList.remove('player-o');
                body?.classList.add('player-x');
                // if player one is playing add attribute o to the button and change to player x
            } else {
                gameField.setAttribute("data-player", 'x'); 
                body?.classList.remove('player-x');
                body?.classList.add('player-o');
                //same thing just the other way around
            }
            gameField.disabled = true;
            //disable button, once field is marked
        })
    })

});