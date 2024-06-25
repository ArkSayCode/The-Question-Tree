addLayer("q", {
    name: "Questions", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "?", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["a"],
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
            onPurchase() { makeParticles(questionMark, 12) },
        },
        12: {
            title: "where?",
            description: "the more you ask the more you think",
            cost: new Decimal(2),
            unlocked() { return (hasUpgrade(this.layer, 11))},
            onPurchase() { makeParticles(questionMark, 12) },
            effect() {
                let eff = player[this.layer].points.add(1).log(2).add(1)
                
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect   
        },
        13: {
            title: "when?",
            description: "the more you think the more you ask",
            cost: new Decimal(10),
            unlocked() { return (hasUpgrade(this.layer, 12))},
            onPurchase() { makeParticles(questionMark, 12) },
            effect() {
                let eff = player.points.add(1).pow(0.15)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        21: {
            title: "who?",
            description: "the more you think the more you think",
            cost: new Decimal(25),
            unlocked() { return (hasUpgrade(this.layer, 13))},
            onPurchase() { makeParticles(questionMark, 12) },
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
            onPurchase() { makeParticles(questionMark, 12) },
            effect() {
                return new Decimal(1.4).pow(player.q.upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        31: {
            title: "how?",
            description: "unlocks a new layer",
            cost: new Decimal(1000),
            unlocked() { return (hasUpgrade(this.layer, 22))},
            onPurchase() { makeParticles(questionMark, 12) },
        },
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('q', 13)) mult = mult.times(upgradeEffect('q', 13))
        let aeff = tmp.a.effect.questionNerf
        if (inChallenge("a", 11)) aeff = Decimal.pow(aeff,2)
        mult = mult.mul(Decimal.pow(aeff,-1))
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
        "Questions": {
            buttonStyle() {return  {'color': 'purple'}},
            shouldNotify: true,
            content:
                ["main-display",
                "prestige-button", "resource-display",
                ["blank", "5px"], "h-line", "upgrades"],
            glowColor: "blue",

        },
    },

    

    layerShown(){return true}
})

const questionMark = {
    image: "",
    spread: 360/12,
    gravity: 0,
    time: 2,
    speed: 10,
    text: function() { return "<h1 style='color:purple'> ?"},
    offset: 0,
    fadeInTime: 2,
}