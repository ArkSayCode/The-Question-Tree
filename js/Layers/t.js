addLayer("t", {
    name: "Theories", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["a","e"],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        theories: new Decimal(0),
        progress: new Decimal(0),
        requiredP: new Decimal(10),
        scale: new Decimal(10),
    }},
    color: "green",
    requires: new Decimal(1e250), // Can be a function that takes requirement increases into account
    resource: "Theory Points", // Name of prestige currency
    baseResource: "Enigmas", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    base: new Decimal(7),
    exponent: new Decimal(2.5),
    roundUpCost: true,
    canBuyMax: false,
    type: "static",
    effect() {
        eff = {
        progressGain: (Decimal.pow(5, player[this.layer].points).sub(4).max(0)),
        answerCost: Decimal.pow(10, player.t.theoriesP),
        EgenBoost: Decimal.pow(10, player.t.theoriesP),
        }
        return eff    
    },
    effectDescription() { // Optional text to describe the effects
        eff = this.effect();
        return "which are producing "+format(eff.progressGain)+" progress per second"
    },
    bars: {
        theoryBar: {
            direction: RIGHT,
            width: 200,
            height: 50,
            progress() { return player.t.progress.div(player.t.requiredP) },
            display() { return "Currently: "+format(player.t.progress)+" / "+format(player.t.requiredP) },
            fillStyle: {'background-color' : "green"},
            baseStyle: {'background-color' : "#696969"},
            textStyle: {
                'color': 'lime',
                'text-shadow': '0px 0px 2px #FFFFFF'
            },
        },
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "t", description: "T: Reset for Theory Points.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Theories": {
            buttonStyle() {return  {'color': 'green'}},
            shouldNotify: true,
            content:
                ["main-display",
                "prestige-button", ["blank",20],
                "upgrades", ],
            glowColor: "blue",

        },
    },

    update(diff) {
        let progressMult = new Decimal(1)
        player.t.progress = player.t.progress.add(tmp.t.effect.progressGain.mul(diff).mul(progressMult))
        if (tmp.t.bars.theoryBar.progress.gte(1)){
            player.t.theories.add(1)
            player.t.progress = new Decimal(0)
            player.t.requiredP = player.t.requiredP.mul(10)
        }
    },

    layerShown(){return player["e"].unlocked || player[this.layer].unlocked}
})

