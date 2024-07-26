addLayer("i", {
    name: "Intellegence", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["a","e"],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
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

    layerShown(){return player["t"].unlocked || player[this.layer].unlocked}
})

