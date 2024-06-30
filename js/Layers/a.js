addLayer("a", {
    name: "Answers", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "!", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "yellow",
    requires: new Decimal(2500), // Can be a function that takes requirement increases into account
    resource: "Answers", // Name of prestige currency
    baseResource: "Questions", // Name of resource prestige is based on
    baseAmount() {return player.q.points}, // Get the current amount of baseResource
    base: new Decimal(5),
    exponent: new Decimal(2),
    roundUpCost: true,
    canBuyMax: false,
    type: "static",
    effect() {
        eff = {
        thoughtBoost: (Decimal.pow(5, player[this.layer].points)),
        questionNerf: (Decimal.pow(1.5, player[this.layer].points)),
        }
        if (inChallenge("a", 11)) eff.questionNerf = Decimal.pow(eff.questionNerf,2)
        if (hasChallenge("a", 11)) eff.thoughtBoost = Decimal.pow(eff.thoughtBoost,2)
        return eff    
    },
    effectDescription() { // Optional text to describe the effects
        eff = this.effect();
        return "which are boosting thoughts by "+format(eff.thoughtBoost)+"x but decreasing questions by "+format(eff.questionNerf)+"x"
    },
    milestones: {
        0: {
            requirementDescription: "2 Answers",
            effectDescription: "Unlock a challenge",
            done() { return player[this.layer].points.gte(2) }
        },
    },
    challenges: {
        11: {
            name: `1 step forward<br>2 steps back`,
            challengeDescription: "do a row 2 reset | Answer's question nerf is squared",
            goalDescription: "get 12,500 questions",
            rewardDescription: "Answer's thought buff is squared",
            unlocked() {return hasMilestone(this.layer, 0)},
            canComplete: function() {return player["q"].points.gte(12500)},
            onEnter() {doReset("a")},
        },
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for Answer!", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Answers": {
            buttonStyle() {return  {'color': 'yellow'}},
            shouldNotify: true,
            content:
                ["main-display",
                "prestige-button", ["blank",20],
                "milestones", "challenges"],
            glowColor: "blue",

        },
    },

    layerShown(){return player["q"].unlocked || player[this.layer].unlocked}
})