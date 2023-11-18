const { Client } = require('discord.js');

const discordToken = process.env.DISCORD_TOKEN;
const discordChannelId = '1175239195749535786';

const client = new Client();
client.login(discordToken);

client.on('ready', () => {
  const channel = client.channels.cache.get(discordChannelId);
  if (channel) {
    const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
    const branchName = process.env.GITHUB_REF.split('/').pop();
    const repositoryName = process.env.GITHUB_REPOSITORY;
    const pusherName = process.env.GITHUB_ACTOR;

    const message = `${pusherName} has just pushed to the repository ${repositoryName}, in branch ${branchName}, commit SHA: ${commitHash}`;
    channel.send(message);
  }

  client.destroy();
});
