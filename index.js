require("dotenv").config();

//configure for discord
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

//configure for openai
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	organization: process.env.OPENAI_ORG,
	apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

//check for message from user on discord
client.on("messageCreate", async function (message) {
	try {
		if (message.author.bot) return;

		await message.channel.sendTyping();
		const gptAns = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: `ChatGpt is a friendly Chatbot. \n\
                ChatGpt :  Hello , How are you ? \n\ 
                ${message.author.username} : ${message.content}\n\
                ChatGpt :`,
			max_tokens: 1500,
			stop: ["Sujan:", "Bot:"],
		});

		message.reply(`${gptAns.data.choices[0].text}`);
		console.log(gptAns.data.choices[0].text);
		return;
	} catch (err) {
		console.log(err.message);
	}
});

//connect the bot to ther server
client.login(process.env.DISCORD_TOKEN);
console.log("Bot is online on discord");
