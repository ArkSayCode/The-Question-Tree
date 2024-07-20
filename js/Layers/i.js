addLayer("i", {
    name: "Intellegence", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["a","e"],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        ideas: new Decimal(0),
        ideaP: new Decimal(0),
        requiredIP: new Decimal(10),
    }},
    color: "orange",
    requires: new Decimal(9), // Can be a function that takes requirement increases into account
    resource: "Intellegence", // Name of prestige currency
    baseResource: "Answers", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    base: new Decimal(2),
    exponent: new Decimal(1.5),
    roundUpCost: true,
    canBuyMax: false,
    type: "static",
    effect() {
        eff = {
        ideaGain: (Decimal.pow(5, player[this.layer].points).sub(4).max(0)),
        answerCost: Decimal.pow(10, player.i.ideas),
        }
        return eff    
    },
    effectDescription() { // Optional text to describe the effects
        eff = this.effect();
        return "which are producing "+format(eff.ideaGain)+" idea points per second"
    },
    bars: {
        ideabar: {
            direction: RIGHT,
            width: 200,
            height: 50,
            progress() { return player.i.ideaP.div(player.i.requiredIP) },
            display() { return "Currently: "+format(player.i.ideaP)+"/"+format(player.i.requiredIP) },
            fillStyle: {'background-color' : "orange"},
            baseStyle: {'background-color' : "#696969"},
            textStyle: {
                'color': 'blue',
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
        {key: "i", description: "I: Reset for Intellegence.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Intellegence": {
            buttonStyle() {return  {'color': 'orange'}},
            shouldNotify: true,
            content:
                ["main-display",
                "prestige-button", ["blank",20],
                ["display-text", function() {
                return 'You have ' + colorText("h3", "orange",format(player.i.ideas)) + ' Ideas,<h5>which decrease Answer cost by '+format(tmp.i.effect.answerCost)+'x</h5>'}],
                ["blank",20],["bar", "ideabar"]],
            glowColor: "blue",

        },
    },

    update(diff) {
        let ipMult = new Decimal(1)
        player.i.ideaP = player.i.ideaP.add(tmp.i.effect.ideaGain.mul(diff).mul(ipMult))
        if (tmp.i.bars.ideabar.progress.gte(1)){
            player.i.ideas.add(1)
            player.i.ideaP = new Decimal(0)
            player.i.requiredIP = player.i.requiredIP.mul(10)
        }
    },

    layerShown(){return player["e"].unlocked || player[this.layer].unlocked}
})

