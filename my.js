
//This will be true if the basket is detected
//It is set in the #basketMarker.event("markerFound"/"markerLost")
var basketActive = false;

//Global variable to memorise the points obtained by the user
var pcts;

//Function that returns true if the value is between [(reference - tolerance) (reference+tolerance)]
function valueBetween(value, reference, tolerance) {
    if(value >= reference - tolerance && value <= reference + tolerance) {
        return true;
    }
    return false;
}

/**We register a new component named collect.
  - We do this in order to have acces to the tick function of the component.
    This function is called at each frame randering and in it we will make the collision-detection more accurate.
    This is needed so the visual effect of catching an apple is more realistic.
**/
AFRAME.registerComponent('collect', {
    //We added the aabb-collider as a dependency, as that component must be loaded first,
    //because in this component we use stuff from `aabb-collider`.
    dependencies: ["aabb-collider"],

    init: function () {
      console.log(this.el.components);
    },

    tick: function() {
        
        //If the basket is detected on the screen and there is any collision
        if(basketActive && this.el.components["aabb-collider"]["intersectedEls"].length > 0) {

            let basketCenter = this.el.components["aabb-collider"]["boxCenter"];

            //We loop through all the objects that collide with our basket.
            for (let i = 0; i < this.el.components["aabb-collider"]["intersectedEls"].length; i++) {

                const apple = this.el.components["aabb-collider"]["intersectedEls"][i];
                if(apple.getAttribute('collected') === "true") {
                    continue;
                }
                let appleCenter = apple.object3D.boundingBoxCenter;

                //Only collect the apple if it is visually inside the basket
                if(appleCenter.y < (basketCenter.y - 0.5) &&
                    valueBetween(appleCenter.x, basketCenter.x, 0.75) &&
                    valueBetween(appleCenter.z, basketCenter.z, 0.75)) {
                    // console.log(apple.id, "collected")
                    apple.setAttribute("collected", "true");
                    apple.components["animation__fall"].animation.restart();
                    pcts.setAttribute("text",
                        "value: " + String(Number(pcts.components["text"].attrValue.value) + 1)  + "; color: #FFF");
                }

            }
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {

    //Set the basketActive variable accordingly
    var basketMarker = document.getElementById('basketMarker');
    basketMarker.addEventListener("markerFound", (event) => {
        console.log("Basket found!");
        basketActive = true;
    });
    basketMarker.addEventListener("markerLost", (event) => {
        console.log("Basket lost!");
        basketActive = false;
    });

    //Get a random number
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    const mainScene = document.getElementById('mainScene');

    //All the apples will be cloned from this
    const mainApple = document.getElementById('mainApple');

    pcts = document.getElementById('pcts');

    var apples = [mainApple];

    var score = 0;
    //random x: i + (0 ... 0.5)
    const min_x = -0.5;
    const max_x = 0.5;

    //random y: 4 ... 7
    const min_y = 4.0;
    const max_y = 7.0;

    //random z: -9 ... -6
    const min_z = -9.0;
    const max_z = -6.0;

    for (let i = -3; i < 4; i++) {
        //We generate random-positioned apples
        let tmpApple = mainApple.cloneNode(true);
        tmpApple.setAttribute("id", "apple" + String(i + 3));

        //We set the `collected` attribute to false.
        //It will become true when the apple is collected
        tmpApple.setAttribute("collected", "false");

        let random_x = i + getRandomArbitrary(min_x, max_x);
        let random_y = getRandomArbitrary(min_y, max_y);
        let random_z = getRandomArbitrary(min_z, max_z);

        let tmpStartPosition = random_x + " " + random_y + " " + random_z;
        let tmpEndPosition = random_x + " -4 " + random_z;

        let random_duration = 1000 * getRandomArbitrary(2, 5);

        tmpApple.addEventListener('hitstart', (event) => {

            //We set the collected attribute of the apple to false when the collision starts.
            //The actual collection of the apple will be realised later
            event.target.setAttribute("collected", "false");
        });

        tmpApple.setAttribute("position", tmpStartPosition);
        tmpApple.setAttribute("animation__fall",
         "property: position; to: " + tmpEndPosition + "; dur: " +
         random_duration + "; easing: linear; loop: true")

         
        mainScene.appendChild(tmpApple);
        apples.push(tmpApple);
    }
})