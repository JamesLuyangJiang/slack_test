const { Client, GatewayIntentBits } = require('discord.js');
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit();
const discordToken = process.env.DISCORD_TOKEN;
const discordChannelId = '1175239195749535786';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(discordToken);

client.on('ready', async () => {
  const channel = client.channels.cache.get(discordChannelId);
  if (channel) {
    const prNumber = process.env.GITHUB_EVENT_NUMBER;
    const { data: pullRequest } = await octokit.pulls.get({
      owner: process.env.GITHUB_REPOSITORY_OWNER,
      repo: process.env.GITHUB_REPOSITORY,
      pull_number: prNumber,
    });

    const prUrl = pullRequest.html_url;
    const prTitle = pullRequest.title;
    const prUser = pullRequest.user.login;
    const sourceBranch = pullRequest.head.ref;
    const targetBranch = pullRequest.base.ref;

    const message = `New pull request submitted: ${prUrl} by ${prUser}. Source branch: ${sourceBranch}, target branch: ${targetBranch}`;
    channel.send(message);
  }

  client.destroy();
});
