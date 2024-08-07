addLayer("e", {
    name: "Enigmas", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        EPoints: new Decimal(0),
        generatorTotals: [
            new Decimal(0),//11
            new Decimal(0),//12
            new Decimal(0),//21
            new Decimal(0),//22
            new Decimal(0),//31
            new Decimal(0),//32
        ]
    }},
    color: "blue",
    requires: new Decimal(2.5e8), // Can be a function that takes requirement increases into account
    resource: "Enigmas", // Name of prestige currency
    baseResource: "Questions", // Name of resource prestige is based on
    baseAmount() {return player.q.points}, // Get the current amount of baseResource
    exponent: new Decimal(0.4),
    type: "normal",
    effect(){
        let thoughtBoost = player.e.EPoints.add(1).log(3).pow(1.5).add(1)
        if (hasUpgrade('e', 21)) thoughtBoost = thoughtBoost.mul(upgradeEffect('e', 21))
        return {
            thoughtBoost,
        }
    },
    milestones: {
        0: {
            requirementDescription: "Buy 10 Enigma Generators",
            effectDescription: "Keep question upgrades on enigma resets",
            done() { return getBuyableAmount("e", 11).gte(10) }
        },
        1: {
            requirementDescription: "Buy 1 Enigma Generators 3.0",
            effectDescription: "Get 10% of Question gain per second",
            done() { return getBuyableAmount("e", 13).gte(1) },
            unlocked() { return hasMilestone(this.layer,0) },
        },
        2: {
            requirementDescription: "Buy 3 Enigma Generators 3.0",
            effectDescription: "Unlock a row of Enigma Generators",
            done() { return getBuyableAmount("e", 13).gte(3) },
            unlocked() { return hasMilestone(this.layer,1) },
        },
        3: {
            requirementDescription: "Buy 3 Enigma Generators 3.0^2",
            effectDescription: "Unlock another row of Enigma Generators",
            done() { return getBuyableAmount("e", 23).gte(3) },
            unlocked() { return hasMilestone(this.layer,2) },
        },
        4: {
            requirementDescription: "Buy 3 Enigma Generators 3.0^3",
            effectDescription: "Unlock Upgrades",
            done() { return getBuyableAmount("e", 33).gte(3) },
            unlocked() { return hasMilestone(this.layer,3) },
        },
    },
    buyables: {
        11: {
            cost(x) { return Decimal.pow(4,Decimal.pow(x.div(10).floor().add(1),0.8).sub(1)).floor() },
            title() {
                return format(player.e.generatorTotals[0], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Enigma Generators 1.0"
            },
            display() {
                return "<br>which are producing " + format(tmp[this.layer].buyables[this.id].effect) + " Enigma Points per second.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigmas"
            },
            effect(x) {
                let eff = player.e.generatorTotals[0].mul(Decimal.pow(2,x.div(10).floor()))
                eff = eff.mul(tmp["e"].buyables[21].effect)
                if (hasUpgrade('e', 11)) eff = eff.mul(upgradeEffect('e', 11))
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.e.generatorTotals[0] = player.e.generatorTotals[0].add(1)
            },
        },
        12: {
            cost(x) { return Decimal.pow(10,x.div(10).floor().mul(5).add(1)) },
            title() {
                return format(player.e.generatorTotals[1], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Enigma Generators 2.0"
            },
            display() {
                return "<br>which are producing " + format(tmp[this.layer].buyables[this.id].effect) + " Enigma Generators 1.0 per second.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigma Generators 1.0"
            },
            effect(x) {
                let eff = player.e.generatorTotals[1].mul(Decimal.pow(2,x.div(10).floor()))
                eff = eff.mul(tmp["e"].buyables[22].effect.boost)
                if (hasUpgrade('e', 11)) eff = eff.mul(upgradeEffect('e', 11))
                return eff
            },
            canAfford() { return player.e.generatorTotals[0].gte(this.cost()) },
            buy() {
                player.e.generatorTotals[0] = player.e.generatorTotals[0].sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.e.generatorTotals[1] = player.e.generatorTotals[1].add(1)
            },
        },
        13: {
            cost(x) { 
                let cost = Decimal.pow(5,x.add(1)).mul(2)
                if (hasChallenge("a", 21)) cost = cost.div(10)
                return cost
            },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Enigma Generators 3.0"
            },
            display() {
                return "<br>which are producing " + format(tmp[this.layer].buyables[this.id].effect) + " Enigma Generators 2.0 per second.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigma Generators 2.0"
            },
            effect(x) {
                let eff = getBuyableAmount(this.layer, this.id).pow(1.5)
                eff = eff.mul(tmp["e"].buyables[23].effect.boost)
                if (hasUpgrade('e', 11)) eff = eff.mul(upgradeEffect('e', 11))
                return eff
            },
            canAfford() { return player.e.generatorTotals[1].gte(this.cost()) },
            buy() {
                player.e.generatorTotals[1] = player.e.generatorTotals[1].sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        21: {
            cost(x) { return Decimal.pow(25,x.div(10).floor().mul(4).add(1)) },
            title() {
                return format(player.e.generatorTotals[2], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Enigma Generators 1.0^2"
            },
            display() {
                return "<br>which are giving a " + format(tmp[this.layer].buyables[this.id].effect) + "x boost to Enigma Generators 1.0 effect.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigma Generators 1.0"
            },
            effect(x) {
                let eff = player.e.generatorTotals[2].pow(0.75).mul(Decimal.pow(2,x.div(10).floor())).add(1)
                eff = eff.mul(tmp["e"].buyables[31].effect)
                if (hasUpgrade('e', 11)) eff = eff.mul(upgradeEffect('e', 11))
                return eff
            },
            canAfford() { return player.e.generatorTotals[0].gte(this.cost()) },
            buy() {
                player.e.generatorTotals[0] = player.e.generatorTotals[0].sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.e.generatorTotals[2] = player.e.generatorTotals[2].add(1)
            },
            unlocked() {
                return hasMilestone(this.layer,2)
            },
        },
        22: {
            cost(x) { return Decimal.pow(10,x.div(10).floor().mul(5).add(1)) },
            title() {
                return format(player.e.generatorTotals[3], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Enigma Generators 2.0^2"
            },
            display() {
                return "<br>which are producing " + format(tmp[this.layer].buyables[this.id].effect.gen) + " Enigma Generators 1.0^2 per second.\n\
                    and are giving a " + format(tmp[this.layer].buyables[this.id].effect.boost) + "x boost to Enigma Generators 2.0 effect.\n\
                    <br>Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigma Generators 1.0^2"
            },
            effect(x) {
                let gen = player.e.generatorTotals[3].mul(Decimal.pow(2,x.div(10).floor()))
                gen = gen.mul(tmp["e"].buyables[32].effect.boost)
                if (hasUpgrade('e', 11)) gen = gen.mul(upgradeEffect('e', 11))
                let boost = player.e.generatorTotals[3].pow(0.75).mul(Decimal.pow(2,x.div(10).floor())).add(1)
                boost = boost.mul(tmp["e"].buyables[32].effect.boost)
                if (hasUpgrade('e', 11)) boost = boost.mul(upgradeEffect('e', 11))
                return {
                    gen,
                    boost 
                }
            },
            canAfford() { return player.e.generatorTotals[2].gte(this.cost()) },
            buy() {
                player.e.generatorTotals[2] = player.e.generatorTotals[2].sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.e.generatorTotals[3] = player.e.generatorTotals[3].add(1)
            },
            unlocked() {
                return hasMilestone(this.layer,2)
            },
        },
        23: {
            cost(x) { 
                let cost = Decimal.pow(5,x.add(1)).mul(2)
                if (hasChallenge("a", 21)) cost = cost.div(10)
                return cost 
            },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Enigma Generators 3.0^2"
            },
            display() {
                return "<br>which are producing " + format(tmp[this.layer].buyables[this.id].effect.gen) + " Enigma Generators 2.0^2 per second.\n\
                    and are giving a " + format(tmp[this.layer].buyables[this.id].effect.boost) + "x boost to Enigma Generators 3.0 effect.\n\
                    <br>Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigma Generators 2.0^2"
            },
            effect(x) {
                let gen = getBuyableAmount(this.layer, this.id).pow(1.2)
                gen = gen.mul(tmp["e"].buyables[33].effect.boost)
                if (hasUpgrade('e', 11)) gen = gen.mul(upgradeEffect('e', 11))
                let boost = getBuyableAmount(this.layer, this.id).mul(2).pow(0.8).add(1)
                boost = boost.mul(tmp["e"].buyables[33].effect.boost)
                if (hasUpgrade('e', 11)) boost = boost.mul(upgradeEffect('e', 11))
                return {
                    gen,
                    boost,
                }
            },
            canAfford() { return player.e.generatorTotals[3].gte(this.cost()) },
            buy() {
                player.e.generatorTotals[3] = player.e.generatorTotals[3].sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasMilestone(this.layer,2)
            },
            
        },
        31: {
            cost(x) { return Decimal.pow(25,x.div(10).floor().mul(4).add(1)) },
            title() {
                return format(player.e.generatorTotals[4], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Enigma Generators 1.0^3"
            },
            display() {
                return "<br>which are giving a " + format(tmp[this.layer].buyables[this.id].effect) + "x boost to Enigma Generators 1.0^2 effect.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigma Generators 1.0^2"
            },
            effect(x) {
                let eff = player.e.generatorTotals[4].pow(0.75).mul(Decimal.pow(2,x.div(10).floor())).add(1)
                if (hasUpgrade('e', 11)) eff = eff.mul(upgradeEffect('e', 11))
                return eff
            },
            canAfford() { return player.e.generatorTotals[2].gte(this.cost()) },
            buy() {
                player.e.generatorTotals[2] = player.e.generatorTotals[2].sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.e.generatorTotals[4] = player.e.generatorTotals[4].add(1)
            },
            unlocked() {
                return hasMilestone(this.layer,3)
            },
        },
        32: {
            cost(x) { return Decimal.pow(10,x.div(10).floor().mul(5).add(1)) },
            title() {
                return format(player.e.generatorTotals[5], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Enigma Generators 2.0^3"
            },
            display() {
                return "<br>which are producing " + format(tmp[this.layer].buyables[this.id].effect.gen) + " Enigma Generators 1.0^3 per second.\n\
                    and are giving a " + format(tmp[this.layer].buyables[this.id].effect.boost) + "x boost to Enigma Generators 2.0^2 effect.\n\
                    <br>Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigma Generators 1.0^3"
            },
            effect(x) {
                let gen = player.e.generatorTotals[5].mul(Decimal.pow(2,x.div(10).floor()))
                if (hasUpgrade('e', 11)) gen = gen.mul(upgradeEffect('e', 11))
                let boost = player.e.generatorTotals[5].pow(0.75).mul(Decimal.pow(2,x.div(10).floor())).add(1)
                if (hasUpgrade('e', 11)) boost = boost.mul(upgradeEffect('e', 11))
                return {
                    gen,
                    boost,
                }
            },
            canAfford() { return player.e.generatorTotals[4].gte(this.cost()) },
            buy() {
                player.e.generatorTotals[4] = player.e.generatorTotals[4].sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.e.generatorTotals[5] = player.e.generatorTotals[5].add(1)
            },
            unlocked() {
                return hasMilestone(this.layer,3)
            },
        },
        33: {
            cost(x) { 
                let cost = Decimal.pow(5,x.add(1)).mul(2)
                if (hasChallenge("a", 21)) cost = cost.div(10)
                return cost
            },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Enigma Generators 3.0^3"
            },
            display() {
                return "<br>which are producing " + format(tmp[this.layer].buyables[this.id].effect.gen) + " Enigma Generators 2.0^3 per second.\n\
                    and are giving a " + format(tmp[this.layer].buyables[this.id].effect.boost) + "x boost to Enigma Generators 3.0^2 effect.\n\
                    <br>Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigma Generators 2.0^3"
            },
            effect(x) {
                let gen = getBuyableAmount(this.layer, this.id).pow(1.2)
                if (hasUpgrade('e', 11)) gen = gen.mul(upgradeEffect('e', 11))
                let boost = getBuyableAmount(this.layer, this.id).mul(2).pow(0.8).add(1)
                if (hasUpgrade('e', 11)) boost = boost.mul(upgradeEffect('e', 11))
                return {
                    gen,
                    boost,
                }
            },
            canAfford() { return player.e.generatorTotals[5].gte(this.cost()) },
            buy() {
                player.e.generatorTotals[5] = player.e.generatorTotals[5].sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasMilestone(this.layer,3)
            },
            
        },
    },
    upgrades: {
        11: {
            title: "Better Gens",
            description: "Enigma Gens are better based on Enigma points",
            cost: new Decimal(100),
            unlocked() { return hasMilestone(this.layer,4)},
            effect() {
                let eff = player.e.EPoints.max(1).log(10).pow(0.40).add(1)
                if (hasUpgrade('e', 12)) eff = eff.mul(upgradeEffect('e', 12))
                if (hasChallenge('a', 22)) eff = eff.mul(player.a.points)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect  
        },
        12: {
            title: "Better Gens 2.0",
            description: "Better Gens is better based on Enigmas",
            cost: new Decimal(250),
            unlocked() { return hasUpgrade(this.layer,11)},
            effect() {
                let eff = player[this.layer].points.pow(0.75).add(1)
                if (hasUpgrade('e', 13)) eff = eff.mul(upgradeEffect('e', 13))
                if (hasChallenge('a', 22)) eff = eff.mul(player.a.points)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect  
        },
        13: {
            title: "Better Gens 3.0",
            description: "Better Gens 2.0 is better based on Answers",
            cost: new Decimal(500),
            unlocked() { return hasUpgrade(this.layer,12)},
            effect() {
                let eff = player.a.points.pow(1.5).add(1)
                if (hasUpgrade('e', 14)) eff = eff.mul(upgradeEffect('e', 14))
                if (hasChallenge('a', 22)) eff = eff.mul(player.a.points)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect  
        },
        14: {
            title: "Better Gens 4.0",
            description: "Better Gens 3.0 is better based on Questions",
            cost: new Decimal(750),
            unlocked() { return hasUpgrade(this.layer,13)},
            effect() {
                let eff = player.q.points.pow(1.5).max(1).log(10).add(1)
                if (hasChallenge('a', 22)) eff = eff.mul(player.a.points)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect  
        },
        21: {
            title: "Better Enigma Points",
            description: "Enigma Points are better based on Enigmas",
            cost: new Decimal("1e125"),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Enigma points",
            currencyInternalName: "EPoints",
            unlocked() { return hasUpgrade(this.layer,14)},
            effect() {
                let eff = player[this.layer].points.pow(1.5).max(1).log(10).add(1)
                if (hasUpgrade('e', 22)) eff = eff.mul(upgradeEffect('e', 22))
                if (hasChallenge('a', 22)) eff = eff.mul(player.a.points)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect  
        },
        22: {
            title: "Better Enigma Points 2.0",
            description: "Better Enigma Points is better based on Answers",
            cost: new Decimal(5000),
            unlocked() { return hasUpgrade(this.layer,21)},
            effect() {
                let eff = player.a.points.pow(1.25).add(1)
                if (hasUpgrade('e', 23)) eff = eff.mul(upgradeEffect('e', 23))
                if (hasChallenge('a', 22)) eff = eff.mul(player.a.points)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect  
        },
        23: {
            title: "Better Enigma Points 3.0",
            description: "Better Enigma Points is better based on Questions",
            cost: new Decimal(10000),
            unlocked() { return hasUpgrade(this.layer,22)},
            effect() {
                let eff = player.q.points.pow(0.2).max(1).log(2).add(1)
                if (hasUpgrade('e', 24)) eff = eff.mul(upgradeEffect('e', 24 ))
                if (hasChallenge('a', 22)) eff = eff.mul(player.a.points)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect  
        },
        24: {
            title: "Better Enigma Points 4.0",
            description: "Better Enigma Points is better based on Thoughts",
            cost: new Decimal(25000),
            unlocked() { return hasUpgrade(this.layer,23)},
            effect() {
                let eff = player.points.pow(0.25).max(1).log(2).add(1)
                if (hasChallenge('a', 22)) eff = eff.mul(player.a.points)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect  
        },
        31: {
            title: "Cheaper Answers",
            description: "Answers are cheaper based on answers",
            cost: new Decimal(100000),
            unlocked() { return hasUpgrade(this.layer,24)},
            effect() {
                let eff = Decimal.pow(2, player.a.points.pow(2))
                if (hasChallenge('a', 22)) eff = eff.mul(player.a.points)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect  
        },
    },
    directMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: Reset for Enigmas.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Upgrades": {
            buttonStyle() {return  {'color': 'blue'}},
            shouldNotify: true,
            content:
                ["main-display",
                "prestige-button", ["blank",20], ["display-text", function() {
                return 'You have ' + colorText("h3", "blue",format(player.e.EPoints)) + ' Enigma Points,<h5>which boost thoughts gain by '+format(tmp.e.effect.thoughtBoost)+'x</h5>'}],
                ["blank",20], "milestones", "upgrades"
                ],
            glowColor: "blue",
        },
        "Buyables": {
            buttonStyle() {return  {'color': 'blue'}},
            shouldNotify: true,
            content:
                ["main-display",
                "prestige-button", ["blank",20], ["display-text", function() {
                return 'You have ' + colorText("h3", "blue",format(player.e.EPoints)) + ' Enigma Points,<h5>which boost thoughts gain by '+format(tmp.e.effect.thoughtBoost)+'x</h5>'}],
                ["blank",20],
                ["row", [["buyable", 11], ["buyable", 12], ["buyable", 13]]],
                ["row", [["buyable", 21], ["buyable", 22], ["buyable", 23]]],
                ["row", [["buyable", 31], ["buyable", 32], ["buyable", 33]]], 
                ],
            glowColor: "blue",
        },
    },
    
    update(diff) {
        let Emult = new Decimal(1)
        player.e.EPoints = player.e.EPoints.add(buyableEffect(this.layer,11).mul(diff).mul(Emult))
        let mult = new Decimal(1)
        player.e.generatorTotals[0] = player.e.generatorTotals[0].add(tmp.e.buyables[12].effect.mul(diff).mul(mult))
        player.e.generatorTotals[1] = player.e.generatorTotals[1].add(tmp.e.buyables[13].effect.mul(diff).mul(mult))
        player.e.generatorTotals[2] = player.e.generatorTotals[2].add(tmp.e.buyables[22].effect.gen.mul(diff).mul(mult))
        player.e.generatorTotals[3] = player.e.generatorTotals[3].add(tmp.e.buyables[23].effect.gen.mul(diff).mul(mult))
        player.e.generatorTotals[4] = player.e.generatorTotals[4].add(tmp.e.buyables[32].effect.gen.mul(diff).mul(mult))
        player.e.generatorTotals[5] = player.e.generatorTotals[5].add(tmp.e.buyables[33].effect.gen.mul(diff).mul(mult))

        if (hasMilestone(this.layer, 1) && !inChallenge("a", 22)) {
            let mult = new Decimal(0.1)
            addPoints("q", tmp.q.resetGain.mul(diff).mul(mult))
        }
    },

    layerShown(){return (player["a"].unlocked || player[this.layer].unlocked) && !inChallenge("a", 22)}
})