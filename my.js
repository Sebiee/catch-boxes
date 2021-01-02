var basketActive = false;
var pcts;

AFRAME.registerComponent('collect', {
    dependencies: ["aabb-collider"],
    init: function () {
      console.log(this.el.components);
    },

    //TODO ar trebui să calculez distanța obiectelor în 3D.

    tick: function() {
        if(basketActive && this.el.components["aabb-collider"]["intersectedEls"].length > 0) {
            let basketCenter = this.el.components["aabb-collider"]["boxCenter"];
            for (let i = 0; i < this.el.components["aabb-collider"]["intersectedEls"].length; i++) {
                const apple = this.el.components["aabb-collider"]["intersectedEls"][i];
                if(apple.getAttribute('collected') === "true") {
                    continue;
                }
                let appleCenter = apple.object3D.boundingBoxCenter;
                if(appleCenter.y < (basketCenter.y - 0.5) ) {
                    // console.log(apple.id, "collected")
                    apple.setAttribute("collected", "true");
                    apple.components["animation__fall"].animation.restart();
                    pcts.setAttribute("text",
                        "value: " + String(Number(pcts.components["text"].attrValue.value) + 1)  + "; color: #FFF");
                }
            }
            // restore animation somehow
            // console.log(this.el.id, "collided with",
            // this.el.components["aabb-collider"]["intersectedEls"].map(x => x.id)[0],
            // "at [1]", this.el.components["aabb-collider"]["boxCenter"], "and [2]",
            // this.el.components["aabb-collider"]["intersectedEls"][0].object3D.boundingBoxCenter)
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const basket = document.getElementById('catchPattern');
    // const hiddenBox = document.getElementById('js-hidden-box');
    basket.addEventListener('hitstart', (event) => {
        // let intersectedIDs = [];
        // event.intersectedEls.forEach(element => {
        //     intersectedIDs.push(element.getAttribute("id"));
        // });
        // console.log("Collision with: " + intersectedIDs);
        // console.log(event)
        // hiddenBox.emit('reveal')
    });

    
    var basketMarker = document.getElementById('basketMarker');
    basketMarker.addEventListener("markerFound", (event) => {
        console.log("Basket found!");
        basketActive = true;
    });
    basketMarker.addEventListener("markerLost", (event) => {
        console.log("Basket lost!");
        basketActive = false;
    });
    console.log(basketMarker);



    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    const mainScene = document.getElementById('mainScene');

    const mainApple = document.getElementById('mainApple');

    pcts = document.getElementById('pcts');

    var apples = [mainApple];

    var score = 0;
    //random x: i + (0 ... 0.5)
    //random y: 4 ... 7
    //random z: -7 ... -9

    for (let i = -3; i < 4; i++) {
        let tmpApple = mainApple.cloneNode(true);
        tmpApple.setAttribute("id", "apple" + String(i + 3));
        tmpApple.setAttribute("collected", "false");
        let random_x = i + getRandomArbitrary(0, 0.5);
        let random_y = getRandomArbitrary(4.0, 7.0);
        let random_z = getRandomArbitrary(-7.0, -9.0);
        let tmpStartPosition = random_x + " " + random_y + " " + random_z;
        let tmpEndPosition = random_x + " -3 " + random_z;

        let random_duration = 1000 * getRandomArbitrary(2, 5);

        tmpApple.addEventListener('hitstart', (event) => {
            // let intersectedIDs = [];
            // event.intersectedEls.forEach(element => {
            //     intersectedIDs.push(element.getAttribute("id"));
            // });
            // console.log("Collision with: " + intersectedIDs);
            event.target.setAttribute("collected", "false");
            // if(basketActive) {
            //     let appleCenter = event.target.components["aabb-collider"]["boxCenter"];
            //     let basketCenter = event.target.components["aabb-collider"]["intersectedEls"][0].object3D.boundingBoxCenter;


            //     console.log(event.target.id, "collided with",
            //     event.target.components["aabb-collider"]["intersectedEls"].map(x => x.id)[0],
            //     "at [1]", event.target.components["aabb-collider"]["boxCenter"], "and [2]",
            //     event.target.components["aabb-collider"]["intersectedEls"][0].object3D.boundingBoxCenter)
            //     // console.log(event.target.components["aabb-collider"]["intersectedEls"][0]);
            //     // console.log(event);

            //     if(appleCenter.y > basketCenter.y) {
            //         // event.target.components["animation__fall"].beginAnimation();
            //         pcts.setAttribute("text",
            //             "value: " + String(Number(pcts.components["text"].attrValue.value) + 1)  + "; color: #FFF");
            //     }
            // }
            // hiddenBox.emit('reveal')
        });

        tmpApple.setAttribute("position", tmpStartPosition);
        tmpApple.setAttribute("animation__fall",
         "property: position; to: " + tmpEndPosition + "; dur: " +
         random_duration + "; easing: linear; loop: true")
        mainScene.appendChild(tmpApple);
        apples.push(tmpApple);
    }

    // mainScene.appendChild(apples);
    // mainScene.append(apples);

    // box.addEventListener('collideEnd', () => {
    //   console.log("Element has finished collision");
    // })
    // const plane = document.getElementById('js-plane');
    // plane.addEventListener('click', () => {
    //     box.emit('move');
    // })
})