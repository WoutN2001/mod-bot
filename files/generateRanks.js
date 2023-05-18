require('dotenv').config();
const groupId = process.env.GROUP_ID
const maxRank = process.env.MAX_RANK
const superagent = require('superagent');
const fs = require('fs');

const generateRanks = async () => {
    superagent('GET', `https://groups.roblox.com/v1/groups/${groupId}/roles`)
    .set('user-agent', 'woot')
    .then(resp => {
        if (!resp || !resp.body) return resolve()
        const ranksData = resp.body.roles
        var ranks = []
        for (rank in ranksData) {
            if (ranksData[rank]['rank'] <= maxRank) {
                ranks.push({name: ranksData[rank]['name'], value: ranksData[rank]['id'].toString(), rank: ranksData[rank]['rank']})
            }
        }
        let data = JSON.stringify(ranks)
        fs.writeFileSync('ranks.json', data)
    })
    .catch((error) => {
        fail(error)
        resolve()
    })
}

module.exports = {
    generateRanks
}