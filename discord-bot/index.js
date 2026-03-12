require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const {
  DISCORD_TOKEN,
  DISCORD_GUILD_ID,
  API_KEY,
  PORT = 3001
} = process.env;

if (!DISCORD_TOKEN || !DISCORD_GUILD_ID || !API_KEY) {
  console.error('Faltam variáveis de ambiente obrigatórias. Veja .env.example');
  process.exit(1);
}

const app = express();
app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

function checkApiKey(req, res, next) {
  const key = req.header('x-api-key');
  if (key !== API_KEY) return res.status(401).json({ error: 'Não autorizado' });
  next();
}

app.get('/health', (_, res) => {
  res.json({ ok: true, bot: client.user?.tag || null });
});

// body esperado: { userId: "123", voiceChannelId: "456" }
app.post('/move-user', checkApiKey, async (req, res) => {
  try {
    const { userId, voiceChannelId } = req.body;

    if (!userId || !voiceChannelId) {
      return res.status(400).json({ error: 'userId e voiceChannelId são obrigatórios' });
    }

    const guild = await client.guilds.fetch(DISCORD_GUILD_ID);
    const member = await guild.members.fetch(userId);

    if (!member.voice.channelId) {
      return res.status(409).json({ error: 'Usuário não está em um canal de voz' });
    }

    const channel = await guild.channels.fetch(voiceChannelId);
    if (!channel || !channel.isVoiceBased()) {
      return res.status(400).json({ error: 'voiceChannelId inválido (não é canal de voz)' });
    }

    await member.voice.setChannel(channel);

    return res.json({
      ok: true,
      moved: {
        userId,
        to: voiceChannelId
      }
    });
  } catch (err) {
    console.error('Erro ao mover usuário:', err);
    return res.status(500).json({ error: 'Falha ao mover usuário' });
  }
});

client.once('ready', async () => {
  console.log(`Bot online: ${client.user.tag}`);

  try {
    const guild = await client.guilds.fetch(DISCORD_GUILD_ID);
    const me = await guild.members.fetchMe();
    const perms = me.permissions;

    const missing = [
      PermissionsBitField.Flags.MoveMembers,
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.Connect
    ].filter((perm) => !perms.has(perm));

    if (missing.length) {
      console.warn('Atenção: permissões faltando para mover membros:', missing.map(String));
    }
  } catch (e) {
    console.warn('Não foi possível validar permissões no startup:', e.message);
  }
});

client.login(DISCORD_TOKEN);

app.listen(PORT, () => {
  console.log(`API do bot ouvindo na porta ${PORT}`);
});
