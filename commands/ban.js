const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addCommand } = require('../files/server')

let data = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a player from the game")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);
data.addStringOption(option =>
    option.setName("name")
        .setRequired(true)
        .setDescription("The player their full username"))
data.addStringOption(option => 
    option.setName("reason")
        .setDescription("The reason for banning this player"))

module.exports = {
    data,

    async execute(interaction) {
        var reason = interaction.options.getString('reason')
        if (!reason || reason.length < 2) {
            reason = "No reason provided"
        }
        const username = interaction.options.getString('name')
        interaction.reply({embeds: [{description: `**Attempting to ban ${username} from game...**`,color: 16753920}]})
        const command = {name: username, method: 'ban', reason}
        addCommand(interaction, command)
    }
}