addLayer("q", {
    name: "Questions", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "?", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["a", "e"],
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "purple",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Question Points", // Name of prestige currency
    baseResource: "thoughts", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.6, // Prestige currency exponent
    upgrades: {
        11: {
            title: "what?",
            description: "double your thought gain",
            cost: new Decimal(1),
            unlocked() { return player[this.layer].unlocked },

        },
        12: {
            title: "where?",
            description: "the more you ask the more you think",
            cost: new Decimal(2),
            unlocked() { return (hasUpgrade(this.layer, 11))},

            effect() {
                let eff = player[this.layer].points.add(1).log(2).pow(1.5).add(1)
                
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect   
        },
        13: {
            title: "when?",
            description: "the more you think the more you ask",
            cost: new Decimal(10),
            unlocked() { return (hasUpgrade(this.layer, 12))},

            effect() {
                let eff = player.points.max(1).pow(0.15)
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
                return player.points.max(1).pow(0.25)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        22: {
            title: "why?",
            description: "bought upgrades increase thoughts",
            cost: new Decimal(100),
            unlocked() { return (hasUpgrade(this.layer, 21))},

            effect() {
                return Decimal.pow(1.4, player.q.upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        23: {
            title: "how?",
            description: "the more you ask the more you ask",
            cost: new Decimal(1000),
            unlocked() { return (hasUpgrade(this.layer, 22))},

            effect() {
                let eff = player[this.layer].points.add(1).log(10).pow(0.5).add(1)
                
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('q', 13)) mult = mult.times(upgradeEffect('q', 13))
        mult = mult.div(tmp.a.effect.questionNerf)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "q", description: "Q: Reset for Question Points?", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Questions": {
            buttonStyle() {return  {'color': 'purple'}},
            shouldNotify: true,
            content:
                ["main-display",
                "prestige-button", ["blank",20],
                "upgrades", ],
            glowColor: "blue",

        },
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) return;

        let keep = [];
        if (hasMilestone("e", 0) && resettingLayer == "e" && !inChallenge("a", 22)) keep.push("upgrades");

        layerDataReset(this.layer, keep);
    },

    layerShown(){return true}
})

