const DECISION_THRESHOLD = 75;
    let isAnimation = false;
    let pullDeltaX = 0; //distance que la card se esta arrastrando

    function startDrag(event) {
        if (isAnimation) return;

        //get the first article element
        const actualCard = event.target.closest('article');
        if(!actualCard) return;

        //get initial position of mouse or finger
        const startX = event.pageX ?? event.touches[0].pageX;

        //listen the mouse and touch movements
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        document.addEventListener('touchmove', onMove, { passive: true });
        document.addEventListener('touchend', onEnd, { passive: true });

        function onMove(event) {
            //current position on mouse or finger
            const currentX = event.pageX ?? event.touches[0].pageX;

            //the distance between the initial and current position
            pullDeltaX = currentX - startX;

            // no hay distancia recorrida
            if (pullDeltaX === 0) return;

            // change the flag to indicate we are animating
            isAnimation = true;

            //calculate the rotation of te card using the distance
            const deg = pullDeltaX / 10;

            //apply the transformation of the card
            actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;

            //change the cursor to grabbing
            actualCard.style.cursor = 'grabbing';

            //change opacity of the choice info
            const opacity = Math.abs(pullDeltaX) / 100;
            const isRight = pullDeltaX > 0;

            const choiceEl = isRight
            ? actualCard.querySelector('.choice.like')
            : actualCard.querySelector('.choice.nope');
            
            choiceEl.style.opacity = opacity;
    
        };

        function onEnd(event) {

            //remove the event listener
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);

            document.removeEventListener('touchmove', onMove)
            document.removeEventListener('touchend', onEnd)

            //saber si el usuario tomo una decision
            const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

            if (decisionMade) {
                const goRight = pullDeltaX >= 0;
                const goleft = !goRight;

                //add class acording to the decision
                actualCard.classList.add(goRight ? 'go-right' : 'go-left')
                actualCard.addEventListener('transitionend', () => {
                    actualCard.remove()
                });
            } else {
                actualCard.classList.add('reset');
                actualCard.classList.remove('go-right', 'go-left');
                actualCard.querySelectorAll('.choice').forEach(el => {el.style.opacity = 0});
            }

            //reset the variables
            actualCard.addEventListener('transitionend', () => {
                actualCard.removeAttribute('style');
                actualCard.classList.remove('reset');

                pullDeltaX = 0;
                isAnimation = false;
            });

        };
    }

    document.addEventListener('mousedown', startDrag)
    document.addEventListener('touchstart', startDrag, { passive: true });