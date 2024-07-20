addLayer("t", {
    name: "Theories", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["a","e"],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "green",
    requires: new Decimal(1e250), // Can be a function that takes requirement increases into account
    resource: "Theories", // Name of prestige currency
    baseResource: "Enigmas", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    base: new Decimal(7),
    exponent: new Decimal(2.5),
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
        {key: "t", description: "T: Reset for Theories.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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

    layerShown(){return player["p"].unlocked || player[this.layer].unlocked}
})

