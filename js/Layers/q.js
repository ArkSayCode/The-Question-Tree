addLayer("q", {
    name: "Questions", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "?", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "purple",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Questions", // Name of prestige currency
    baseResource: "thoughts", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.6, // Prestige currency exponent
    upgrades: {
        11: {
            title: "what?",
            description: "double?",
            cost: new Decimal(1),
            unlocked() { return player[this.layer].unlocked },
        },
        12: {
            title: "where?",
            description: "the more you ask the more you think",
            cost: new Decimal(2),
            unlocked() { return (hasUpgrade(this.layer, 11))},
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect   
        },
        13: {
            title: "when?",
            description: "the more you think the more you ask",
            cost: new Decimal(10),
            unlocked() { return (hasUpgrade(this.layer, 12))},
            effect() {
                let eff = player.points.add(1).pow(0.2)
                softcap(eff,3,0.5)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        21: {
            title: "who?",
            description: "the more you think the more you think",
            cost: new Decimal(25),
            unlocked() { return (hasUpgrade(this.layer, 13))},
            effect() {
                return player.points.add(1).pow(0.25)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        22: {
            title: "why?",
            description: "bought upgrades increase thoughts",
            cost: new Decimal(100),
            unlocked() { return (hasUpgrade(this.layer, 21))},
            effect() {
                return new Decimal(1.5).pow(player.q.upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        31: {
            title: "how?",
            description: "unlocks a new subtab",
            cost: new Decimal(1000),
            unlocked() { return (hasUpgrade(this.layer, 22))},
        },
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('q', 13)) mult = mult.times(upgradeEffect('q', 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "q", description: "Q: Reset for Questions?", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "main tab": {
            buttonStyle() {return  {'color': 'purple'}},
            shouldNotify: true,
            content:
                ["main-display",
                "prestige-button", "resource-display",
                ["blank", "5px"], "h-line", "upgrades"],
            glowColor: "blue",

        },
        "answers": {
            prestigeNotify: true,
            style() {return  {'background-color': '#222222'}},
            buttonStyle() {return {'border-color': 'orange'}},
//            unlocked() {return (hasUpgrade(player.q, 31))},
            content:[ 
                "buyables", "blank",
                ["row", [
                    ["column", [
                        ["prestige-button", "", {'width': '150px', 'height': '80px'}],
                        ["prestige-button", "", {'width': '100px', 'height': '150px'}],
                    ]], 
                ], {'width': '600px', 'height': '350px', 'background-color': 'green', 'border-style': 'solid'}],
                "blank",],
        },
        
    },

    doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
        makeParticles(questionMark,12) 
        if(layers[resettingLayer].row > this.row) layerDataReset(this.layer, ["points"])
    },

    layerShown(){return true}
})

const questionMark = {
    image: "",
    spread: 360/12,
    gravity: 0,
    time: 5,
    speed: 10,
    text: function() { return "<h1 style='color:purple'> ?"},
    offset: -300,
    fadeInTime: 2,
}