const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addCommand } = require('../files/server')

let data = new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a player from the game")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);
data.addStringOption(option =>
    option.setName("name")
        .setRequired(true)
        .setDescription("The player their full username"))

module.exports = {
    data,

    async execute(interaction) {
        const username = interaction.options.getString('name')
        interaction.reply({embeds: [{description: `**Attempting to unban ${username} from game...**`,color: 16753920}]})
        const command = {name: username, method: 'unban'}
        addCommand(interaction, command)
    }
}