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
    requires: new Decimal(25000000), // Can be a function that takes requirement increases into account
    resource: "Enigmas", // Name of prestige currency
    baseResource: "Questions", // Name of resource prestige is based on
    baseAmount() {return player.q.points}, // Get the current amount of baseResource
    exponent: new Decimal(0.4),
    type: "normal",
    effect(){ return {
        thoughtBoost: player.e.EPoints.add(1).log(5).pow(1.2).add(1),
    }},
    milestones: {
        0: {
            requirementDescription: "Buy 10 Enigma Generators",
            effectDescription: "Keep question upgrades on all resets",
            done() { return getBuyableAmount("e", 11).gte(10) }
        },
        1: {
            requirementDescription: "Buy 1 Enigma Generators 3.0",
            effectDescription: "Get 10% of Question gain per second",
            done() { return getBuyableAmount("e", 13).gte(1) },
            unlocked() { return hasMilestone(this.layer,0) },
        },
        2: {
            requirementDescription: "Buy 4 Enigma Generators 3.0",
            effectDescription: "Unlock another row of Enigma Generators",
            done() { return getBuyableAmount("e", 13).gte(4) },
            unlocked() { return hasMilestone(this.layer,1) },
        },
        3: {
            requirementDescription: "Buy 4 Enigma Generators 3.0^2",
            effectDescription: "Unlock yet another row of Enigma Generators",
            done() { return getBuyableAmount("e", 23).gte(4) },
            unlocked() { return hasMilestone(this.layer,2) },
        },
    },
    buyables: {
        11: {
            cost(x) { return Decimal.pow(4,Decimal.pow(x.div(10).floor().add(1),0.8).sub(1)).floor() },
            title() {
                return format(player.e.generatorTotals[0], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Enigma Generators"
            },
            display() {
                return "<br>which are producing " + format(tmp[this.layer].buyables[this.id].effect) + " Enigma Points per second.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigmas"
            },
            effect(x) {
                let eff = player.e.generatorTotals[0].mul(Decimal.pow(2,x.div(10).floor()))
                eff = eff.mul(tmp["e"].buyables[21].effect)
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
                return "<br>which are producing " + format(tmp[this.layer].buyables[this.id].effect) + " Enigma Generators per second.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigma Generators"
            },
            effect(x) {
                let eff = player.e.generatorTotals[1].mul(Decimal.pow(2,x.div(10).floor())).add(1)
                eff = eff.mul(tmp["e"].buyables[22].effect.boost)
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
            cost(x) { return Decimal.pow(5,x.add(1)).mul(2) },
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
                return format(player.e.generatorTotals[2], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Enigma Generators^2"
            },
            display() {
                return "<br>which are giving a " + format(tmp[this.layer].buyables[this.id].effect) + "x boost to Enigma Generators effect.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigma Generators"
            },
            effect(x) {
                let eff = player.e.generatorTotals[2].pow(0.75).mul(Decimal.pow(2,x.div(10).floor())).add(1)
                eff.mul(tmp["e"].buyables[31].effect.boost)
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
                return "<br>which are producing " + format(tmp[this.layer].buyables[this.id].effect.gen) + " Enigma Generators 2.0^2 per second.\n\
                    and are giving a " + format(tmp[this.layer].buyables[this.id].effect.boost) + "x boost to Enigma Generators 2.0 effect.\n\
                    <br>Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigma Generators^2"
            },
            effect(x) {
                let gen = player.e.generatorTotals[3].mul(Decimal.pow(2,x.div(10).floor())).add(1)
                gen.mul(tmp["e"].buyables[32].effect.boost)
                let boost = player.e.generatorTotals[3].pow(0.75).mul(Decimal.pow(2,x.div(10).floor())).add(1)
                boost.mul(tmp["e"].buyables[32].effect.boost)
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
            cost(x) { return Decimal.pow(5,x.add(1)).mul(2) },
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
                gen.mul(tmp["e"].buyables[33].effect.boost)
                let boost = getBuyableAmount(this.layer, this.id).mul(2).pow(0.8)
                boost.mul(tmp["e"].buyables[33].effect.boost)
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
                return format(player.e.generatorTotals[4], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Enigma Generators^3"
            },
            display() {
                return "<br>which are giving a " + format(tmp[this.layer].buyables[this.id].effect) + "x boost to Enigma Generators^2 effect.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigma Generators^2"
            },
            effect(x) {
                return player.e.generatorTotals[4].pow(0.75).mul(Decimal.pow(2,x.div(10).floor())).add(1)
            },
            canAfford() { return player.e.generatorTotals[3].gte(this.cost()) },
            buy() {
                player.e.generatorTotals[3] = player.e.generatorTotals[3].sub(this.cost())
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
                return "<br>which are producing " + format(tmp[this.layer].buyables[this.id].effect.gen) + " Enigma Generators^3 per second.\n\
                    and are giving a " + format(tmp[this.layer].buyables[this.id].effect.boost) + "x boost to Enigma Generators 2.0^2 effect.\n\
                    <br>Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigma Generators^3"
            },
            effect(x) {
                return {
                    gen: player.e.generatorTotals[5].mul(Decimal.pow(2,x.div(10).floor())).add(1),
                    boost: player.e.generatorTotals[5].pow(0.75).mul(Decimal.pow(2,x.div(10).floor())).add(1)
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
            cost(x) { return Decimal.pow(5,x.add(1)).mul(2) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Enigma Generators 3.0^3"
            },
            display() {
                return "<br>which are producing " + format(tmp[this.layer].buyables[this.id].effect.gen) + " Enigma Generators 2.0^3 per second.\n\
                    and are giving a " + format(tmp[this.layer].buyables[this.id].effect.boost) + "x boost to Enigma Generators 3.0^2 effect.\n\
                    <br>Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Enigma Generators 2.0^3"
            },
            effect(x) {
                return {
                    gen: getBuyableAmount(this.layer, this.id).pow(1.2),
                    boost: getBuyableAmount(this.layer, this.id).mul(2).pow(0.8),
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
        "Enigma": {
            buttonStyle() {return  {'color': 'blue'}},
            shouldNotify: true,
            content:
                ["main-display",
                "prestige-button", ["blank",20], ["display-text", function() {
                return 'You have ' + colorText("h3", "blue",format(player.e.EPoints)) + ' Enigma Points,<h5>which boost thoughts gain by '+format(tmp.e.effect.thoughtBoost)+'x</h5>'}],
                ["blank",20], "milestones", 
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
        player.e.generatorTotals[0] = player.e.generatorTotals[0].add(tmp.e.buyables[12].effect.mul(diff))
        player.e.generatorTotals[1] = player.e.generatorTotals[1].add(tmp.e.buyables[13].effect.mul(diff))
        player.e.generatorTotals[2] = player.e.generatorTotals[2].add(tmp.e.buyables[22].effect.gen.mul(diff))
        player.e.generatorTotals[3] = player.e.generatorTotals[3].add(tmp.e.buyables[23].effect.gen.mul(diff))
        player.e.generatorTotals[4] = player.e.generatorTotals[4].add(tmp.e.buyables[32].effect.gen.mul(diff).mul(mult))
        player.e.generatorTotals[5] = player.e.generatorTotals[5].add(tmp.e.buyables[33].effect.gen.mul(diff).mul(mult))

        if (hasMilestone(this.layer, 1)) {
            let mult = new Decimal(0.1)
            addPoints("q", tmp.q.resetGain.mul(diff).mul(mult))
        }
    },

    layerShown(){return player["a"].unlocked || player[this.layer].unlocked}
})