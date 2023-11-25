const { Client, GatewayIntentBits } = require('discord.js');
const { context } = require('@actions/github');

const discordToken = process.env.DISCORD_TOKEN;
const discordChannelId = '1175239195749535786';

const userIdToMention = '753009249780498523';

const isPRClosed = context.payload.action === 'closed';
const closeUser = isPRClosed ? context.payload.sender.login : '';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(discordToken);

client.on('ready', async () => {
  const channel = client.channels.cache.get(discordChannelId);
  if (channel && context.payload.pull_request) {
    const pullRequest = context.payload.pull_request;

    const prUrl = pullRequest.html_url;
    const prTitle = pullRequest.title;
    const prUser = pullRequest.user.login;
    const sourceBranch = pullRequest.head.ref;
    const targetBranch = pullRequest.base.ref;

    const mentionedUser = `<@${userIdToMention}>`;

    let message = ''
    if (isPRClosed) {
      message = `Pull request closed by ${closeUser}: ${prUrl}. Source branch: ${sourceBranch}, target branch: ${targetBranch}`;
    } else {
      message = `${mentionedUser} New pull request submitted: ${prUrl} by ${prUser}. Source branch: ${sourceBranch}, target branch: ${targetBranch}`;
    }
    channel.send(message);
  }

  client.destroy();
});
