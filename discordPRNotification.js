const { Client, GatewayIntentBits } = require('discord.js');

const discordToken = process.env.DISCORD_TOKEN;
const discordChannelId = '1175239195749535786';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(discordToken);

client.on('ready', () => {
  const channel = client.channels.cache.get(discordChannelId);
  if (channel) {
    const prNumber = process.env.GITHUB_EVENT_NUMBER;
    const prUrl = process.env.GITHUB_SERVER_URL + '/' + process.env.GITHUB_REPOSITORY + '/pull/' + prNumber;
    const prTitle = process.env.GITHUB_EVENT_PULL_REQUEST_TITLE;
    const prUser = process.env.GITHUB_EVENT_PULL_REQUEST_USER_LOGIN;
    const sourceBranch = process.env.GITHUB_EVENT_PULL_REQUEST_HEAD_REF;
    const targetBranch = process.env.GITHUB_EVENT_PULL_REQUEST_BASE_REF;

    const message = `New pull request submitted: ${prUrl} by ${prUser}. Source branch: ${sourceBranch}, target branch: ${targetBranch}`;
    channel.send(message);
  }

  client.destroy();
});
