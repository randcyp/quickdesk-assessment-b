listenForUpdates();
function listenForUpdates() {

}

function updateCounterDisplay() {
    // Updates each counter pane
    for (let i = 1; i <= 4; i++) {
        // Update the "Current Number" field
        firebase.database().ref(`counter${i}serving/value`)
            .on("value", snapshot => {
                document.getElementById(`curr_num${i}`)
                    .innerHTML = `Current Number: ${snapshot.val()}`;
            });

        // Populate the Go Online / Go Offline buttons
        firebase.database().ref(`counter${i}status/value`)
            .on("value", snapshot => {
                // Reset the options
                document.getElementById(`counter${i}`)
                    .innerHTML = "";

                // Then populate it
                let status = snapshot.val();

                switch (status) {
                    case ONLINE:
                    case BUSY:
                        makeDisableButton(i);
                        break;
                    case OFFLINE:
                        makeEnableButton(i)
                        break;
                    default:
                        console.error(`Status invalid: ${status}`);
                        break;
                }

                makeCompleteCurrentButton(i);
                makeCallNextButton(i);
            });


    }
}

function makeEnableButton(counterID) {
    const element = `<div class="mdl-card__actions mdl-card--border">
    <a id="setOnline${counterID}" onclick=setOnline(this) 
    class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
      Go Online
    </a>
  </div>`;

    document.getElementById(`counter${counterID}`).innerHTML += element;
}

function makeDisableButton(counterID) {
    const element = `<div class="mdl-card__actions mdl-card--border">
    <a id="setOffline${counterID}" onclick=setOffline(this) 
    class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
      Go Offline
    </a>
  </div>`;

    document.getElementById(`counter${counterID}`).innerHTML += element;
}

function makeCompleteCurrentButton(counterID) {
    const element = `<div class="mdl-card__actions mdl-card--border">
    <a id="completeCurrent${counterID}" onclick="completeCurrent(this)" 
    class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
      Complete Current
    </a>
  </div>`;

    document.getElementById(`counter${counterID}`).innerHTML += element;
}

function makeCallNextButton(counterID) {
    const element = `<div class="mdl-card__actions mdl-card--border">
    <a id="callNext${counterID}" onclick="callNext(this)" 
    class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
      Call Next
    </a>
  </div>`;

    document.getElementById(`counter${counterID}`).innerHTML += element;
}

function setOnline(element) {
    let counterID = element.id.replace("setOnline", "");
    let statusID = `counter${counterID}status`;
    let servingID = `counter${counterID}serving`;

    // Set the counter's status to online
    firebase.database().ref(statusID).set({
        value: ONLINE
    });

    // Set the serving number to "None"
    firebase.database().ref(servingID).set({
        value: "None"
    });
}

function setOffline(element) {
    let counterID = element.id.replace("setOffline", "");
    let statusID = `counter${counterID}status`;
    let servingID = `counter${counterID}serving`;

    // Set the counter's status to offline
    firebase.database().ref(statusID).set({
        value: OFFLINE
    });

    // Set counter${i}serving to "Offline"
    firebase.database().ref(servingID).set({
        value: "Offline"
    })
}

function completeCurrent(element) {
    let counterID = element.id.replace("completeCurrent", "");

    firebase.database().ref(`counter${counterID}status/value`)
        .get().then(snapshot => {
            let status = snapshot.val();

            if (status !== BUSY) {
                alert("Error: Counter is not serving");
            } else {
                firebase.database().ref(`counter${counterID}serving`).set({
                    value: "None"
                });

                firebase.database().ref(`counter${counterID}status`).set({
                    value: ONLINE
                });
            }
        });
}

function callNext(element) {
    let counterID = element.id.replace("callNext", "");

    firebase.database().ref(`last_number/value`)
        .get()
        .then(x => {
            let last_number = x.val();

            firebase.database().ref(`now_serving/value`)
                .get()
                .then(y => {
                    let now_serving = y.val();

                    firebase.database().ref(`counter${counterID}status/value`)
                        .get().then(z => {
                        let status = z.val();

                        if (status === BUSY) {
                            alert("Error: Counter is busy");
                        } else if (status === OFFLINE) {
                            alert("Error: Counter is disabled");
                        } else if (last_number === now_serving) {
                            alert("No tickets in the waiting queue");
                        } else {
                            firebase.database().ref(`counter${counterID}serving`).set({
                                value: now_serving + 1
                            });

                            firebase.database().ref(`now_serving`).set({
                                value: now_serving + 1
                            });

                            firebase.database().ref(`counter${counterID}status`).set({
                                value: BUSY
                            });
                        }
                    });
                });
        });


}