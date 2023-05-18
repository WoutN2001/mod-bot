const express = require('express')
const bodyParser = require('body-parser');
const crypto = require("crypto");
const app = express()
const port = 3000

const queue = {}

const interactions = {}

const addCommand = (interaction, command) => {
    const id = crypto.randomBytes(16).toString("hex");
    queue[id] = command
    interactions[id] = interaction
    setTimeout(function() {
        if (queue[id]) {
            if (queue[id]['method'] == 'kick') {
                interactions[id].editReply({content: '❌', embeds: [{description: `**Failed to kick ${queue[id]['name']} from game.**\nMake sure the player is currently ingame`, color: 16711680}]})
                delete(interactions[id])
                delete(queue[id])
            } else {
                interactions[id].editReply({content: '... 🤔', embeds: [{description: `**Attempting to ${queue[id]['method']} ${queue[id]['name']} from game...**\nThis is taking longer than usual, if no one is in the game this command will execute as soon as someone joins!`, color: 16753920}]})
            }
        }
    }, 10000);
}

const startServer = async () => {
    app.get('/queue', (req, res) => {
        res.send(queue)
    })
      
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.raw());

    app.post('*', (req, res) => {
        if (req.body.method == "done") {
            let commandId = req.body.commandId
            if (queue[commandId]) {
                if (interactions[commandId]) {
                    
                    interactions[commandId].editReply({content: 'Done!', embeds: [{description: `**Succesfully performed ${queue[commandId]['method']} on ${queue[commandId]['name']} !**`,color: 4062976}]})
                }
                delete(queue[commandId])
                setTimeout(function() {
                    delete(interactions[commandId])
                }, 3000);
            }
            res.sendStatus(200)
        }
    })
}

module.exports = {
    startServer,
    addCommand
}