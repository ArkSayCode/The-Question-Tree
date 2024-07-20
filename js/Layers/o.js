addLayer("o", {
    name: "Ω Questions", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Ω", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["i", "t","p"],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color() {return getUndulatingColor(5)},
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Ω Questions", // Name of prestige currency
    baseResource: "thoughts", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "o", description: "O: Reset for Ω Questions.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Ω": {
            buttonStyle() {return  {'color': getUndulatingColor(5)}},
            shouldNotify: true,
            content:
                ["main-display",
                "prestige-button", ["blank",20],
                "upgrades", ],
            glowColor: "blue",

        },
    },

    layerShown(){return (player["i"].unlocked && player["p"].unlocked && player["t"].unlocked) || player[this.layer].unlocked}
})

