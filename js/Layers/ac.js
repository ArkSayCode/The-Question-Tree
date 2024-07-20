
// A side layer with achievements, with no prestige
addLayer("ac", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "achievements", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    type: "none",
    achievementPopups: true,
    achievements: {
        11: {
            name: "ask your first",
            done() {return hasUpgrade("q", 11)},
            tooltip: "Buy the first question upgrade - No reward",
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)},
        },
        12: {
            name: "the 5w 1h",
            done() {return hasUpgrade("q", 23)},
            tooltip: "Get all six question upgrades - No reward",
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)},
        },
        13: {
            name: "ohhh",
            done() {return player["a"].unlocked},
            tooltip: "unlock answers - No reward",
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)},
        },
        14: {
            name: "was that so challenging?",
            done() {return hasChallenge("a", 11)},
            tooltip: 'finish "1 step forward 2 steps back" - No reward',
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)},
        },
        15: {
            name: "that was challenging",
            done() {return hasChallenge("a", 12)},
            tooltip: 'finish "1 step forward googol steps back" - No reward',
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)},
        },
        16: {
            name: "what is this",
            done() {return player["e"].unlocked},
            tooltip: 'unlock enigmas - No reward',
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)},
        },
        21: {
            name: "Too Many!!!",
            done() {return hasMilestone("e",3)},
            tooltip: 'Unlock all enigma buyables - No reward',
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)},
        },
        22: {
            name: "Smart",
            done() {return player["i"].unlocked},
            tooltip: 'Unlock intellegence - No reward',
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)},
        },
    },
    tabFormat: {
        "Achievements": {
            buttonStyle() {return  {'color': 'Yellow'}},
            shouldNotify: true,
            content:
                ["main-display",
                "prestige-button",
                "achievements",],
            glowColor: "blue",
        },
    },

})