const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();
const fs = require('fs')
const ranks = require('../ranks.json')
const { getUserRank, getUserId, setRank} = require('../files/roblox');

let data = new SlashCommandBuilder()
    .setName("setrank")
    .setDescription("Rank a player")
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);
data.addStringOption(option =>
    option.setName("name")
		.setRequired(true)
        .setDescription("The player their full username"))
data.addStringOption(option => 
	option.setName("rank")
		.setRequired(true)
		.setDescription("The new rank for the player"))
ranks.forEach(rank =>{
    data.options[1].addChoices(rank);
	
})


module.exports = {
	data,
		
	async execute(interaction) {
		const username = interaction.options.getString('name')
		const rank = interaction.options.getString('rank')

		const userid = await getUserId(username)
		if (!userid) {await interaction.reply({embeds: [{description: "**User does not exist!**",color: 16711680}]}); return}

		const oldrank = await getUserRank(userid, process.env.GROUP_ID)
		if (!oldrank) {await interaction.reply({embeds: [{description: "**Could not find user in group**",color: 16711680}]}); return}
		if (rank == oldrank.roleId) {await interaction.reply({embeds: [{description: "**User is already in this rank!**",color: 16711680}]}); return}
		const oldrankName = oldrank['roleName']

		const rankChange = await setRank(userid, process.env.GROUP_ID, rank)
		if (!rankChange) {await interaction.reply({embeds: [{description: "**Something went wrong!**",color: 16711680}]}); return}

		const newrank = await getUserRank(userid, process.env.GROUP_ID)
		const newrankname = newrank['roleName']
		await interaction.reply({embeds: [{title: `Updated rank for **${username}**`,color: 2752256,fields: [{name: "Old rank",value: oldrankName,inline: true},{name: "New rank",value: newrankname,inline: true}],footer: {text: interaction.user.tag,icon_url: interaction.user.displayAvatarURL()}}]});
	},
};