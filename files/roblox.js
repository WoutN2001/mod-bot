const superagent = require('superagent');
require('dotenv').config();
const cookie = process.env.ROBLOX_COOKIE
var csrf = 'blahblah'

const agent = superagent.agent();

const setCookie = () => agent.set('cookie',`.ROBLOSECURITY=${cookie};`)
setCookie()

// Get a rank it's id and name 
const getRankId = async (groupId, rank) => new Promise (resolve => {
    superagent('GET', `https://groups.roblox.com/v1/groups/${groupId}/roles`)
    .set('user-agent', 'woot')
    .then(resp => {
        if (!resp || !resp.body) return resolve()
        const ranksData = resp.body.roles
        const rankStats = ranksData.find((rankStats) => rankStats.rank == rank)
        if (rankStats && rankStats.id && rankStats.name) {
            const rankId = rankStats.id
            const rankName = rankStats.name
    
            resolve({
                rankId: rankId,
                rankName: rankName
            })
        } else {
            resolve()
        }
    })
    .catch((error) => {
        fail(error)
        resolve()
    })
})

// Get user their rank in a group
const getUserRank = async (userId, groupId) => new Promise (resolve => {
    superagent('GET', `https://groups.roblox.com/v2/users/${userId}/groups/roles`)
    .set('user-agent', 'woot')
    .then(resp => {
        if (!resp || !resp.body) return resolve()
        const ranksData = resp.body.data
        const group = ranksData.find((group) => group.group.id == groupId);
        if (group && group.role && group.role.id) {
          const roleId = group.role.id;
          const roleName = group.role.name;
          const rank = group.role.rank;
        
          resolve({
            roleId: roleId,
            roleName: roleName,
            rank: rank
          })
        } else {
            resolve()
        }
    })
    .catch((error) => {
        resolve()
    })
})

// Get user their userid from their player name
const getUserId = async (userName) => new Promise(resolve => {
    superagent('POST', `https://users.roblox.com/v1/usernames/users`)
        .set('x-csrf-token', csrf)
        .send({
            usernames: [userName],
            excludeBannedUsers: true
        })
        .then(resp => {
            if (!resp || !resp.body) return resolve()
            
            const id = resp.body.data[0].id
            resolve(id)
        })
        .catch((error)  => {
            resolve()
        })
})

const setRank = async (userId, groupId, rankId) => new Promise(resolve => {
    agent.patch(`https://groups.roblox.com/v1/groups/${groupId}/users/${userId}`)
    .set('x-csrf-token', csrf)
    .send({
        roleId: rankId
    })
    .then(() => {
        resolve(true)
    })
    .catch(async error => {
        newCsrf = error.response.headers['x-csrf-token'];
        if (newCsrf) {
            csrf = newCsrf
            resolve(await setRank(userId, groupId, rankId))
        }

    })
})

module.exports = {
    setRank,
    getUserId,
    getUserRank,
    getRankId
}


