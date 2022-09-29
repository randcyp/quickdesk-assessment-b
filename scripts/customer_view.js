function updateCounterDisplay() {
    // Updates the status pane
    firebase.database().ref(`now_serving/value`)
        .on("value", snapshot => {
            document.getElementById(`now_serving`)
                .innerHTML = `Now Serving: ${snapshot.val()}`;
        });
    firebase.database().ref(`last_number/value`)
        .on("value", snapshot => {
            document.getElementById(`last_number`)
                .innerHTML = `Last Number: ${snapshot.val()}`;
        });

    // Updates each counter pane
    for (let i = 1; i <= 4; i++) {
        // Update the "Current Number" field
        firebase.database().ref(`counter${i}serving/value`)
            .on("value", snapshot => {
                let now_serving = snapshot.val();

                document.getElementById(`curr_num${i}`)
                    .innerHTML = `Current Number: ${now_serving}`;
            });

        // Update the status icons
        firebase.database().ref(`counter${i}status/value`)
            .on("value", snapshot => {
                let status = snapshot.val();
                let icon_id = `counter${i}_status"`;
                let card_id = `counter${i}`;

                switch (status) {
                    case ONLINE:
                        document.getElementById(icon_id).classList
                            .replace("status-busy","status-online");
                        document.getElementById(icon_id).classList
                            .replace("status-offline","status-online");
                        document.getElementById(card_id).classList
                            .remove("counter-offline");
                        break;
                    case BUSY:
                        document.getElementById(icon_id).classList
                            .replace("status-online","status-busy");
                        document.getElementById(icon_id).classList
                            .replace("status-offline","status-busy");
                        document.getElementById(card_id).classList
                            .remove("counter-offline");
                        break;
                    case OFFLINE:
                        document.getElementById(icon_id).classList
                            .replace("status-online","status-offline");
                        document.getElementById(icon_id).classList
                            .replace("status-busy","status-offline");
                        document.getElementById(card_id).classList
                            .add("counter-offline");
                        break;
                    default:
                        console.log(`Status invalid: ${status}`);
                        break;
                }
            });
    }
}

function takeNumber() {
    // Get newest number, increment it by 1
    const dbRef = firebase.database().ref();
    dbRef.child(`last_number/value`).get().then((snapshot) => {
        let newest_number = snapshot.val();
        alert(`Your number is: ${newest_number}`);

        firebase.database().ref("last_number").set({
            value: newest_number + 1
        });
    }).catch((error) => {
        console.error(error);
    });
}