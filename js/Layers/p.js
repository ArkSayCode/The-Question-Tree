addLayer("m", {
    name: "Mysteries", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["a","e"],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "hot pink",
    requires: new Decimal(1e100), // Can be a function that takes requirement increases into account
    resource: "Mysteries", // Name of prestige currency
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
        {key: "p", description: "P: Reset for Philosophy.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Mysteries": {
            buttonStyle() {return  {'color': 'hot pink'}},
            shouldNotify: true,
            content:
                ["main-display",
                "prestige-button", ["blank",20],
                "upgrades", ],
            glowColor: "blue",

        },
    },

    layerShown(){return player["t"].unlocked || player[this.layer].unlocked}
})

