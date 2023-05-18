const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const ranks = require('../ranks.json');
const { getUserRank, getUserId, setRank} = require('../files/roblox');

let data = new SlashCommandBuilder()
    .setName("promote")
    .setDescription("Rank a player one rank up")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);
data.addStringOption(option =>
    option.setName("name")
        .setRequired(true)
        .setDescription("The player their full username"))

module.exports = {
    data,

    async execute(interaction) {
        const username = interaction.options.getString('name')

        const userid = await getUserId(username)
        if (!userid) {await interaction.reply({embeds: [{description: "**User does not exist!**",color: 16711680}]}); return}

        const oldrankData = await getUserRank(userid, process.env.GROUP_ID)
		if (!oldrankData) {await interaction.reply({embeds: [{description: "**Could not find user in group**",color: 16711680}]}); return}
		const oldrankName = oldrankData['roleName']
        const oldrank = oldrankData['rank']

        let newRank = ranks[ranks.findIndex(x => x['rank'] == oldrank) + 1]
        const newRankName = newRank['name']
        const newRankId = newRank['value']

        const rankChange = setRank(userid, process.env.GROUP_ID, newRankId)
        if (!rankChange) {await interaction.reply({embeds: [{description: "**Something went wrong!**",color: 16711680}]}); return}

        const updatedRank = await getUserRank(userid, process.env.GROUP_ID)
        const updatedRankName = updatedRank['roleName']
        await interaction.reply({embeds: [{title: `Promoted **${username}**`,color: 2752256,fields: [{name: "Old rank",value: oldrankName,inline: true},{name: "New rank",value: newRankName,inline: true}],footer: {text: interaction.user.tag,icon_url: interaction.user.displayAvatarURL()}}]});
    }
}