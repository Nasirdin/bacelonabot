const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();
const { readFile, writeFile, unLink } = require("fs").promises;

const rFile = (thePathToTheFile) => {
  return readFile(thePathToTheFile, { encoding: "utf8" }).then((text) => JSON.parse(text));
};

const wFile = () => {
  writeFile(`${__dirname}/user.json`, JSON.stringify(users), { encoding: "utf8" });
  return false;
};

const readPartnerJsonFile = async () => {
  const rfff = await rFile(`${__dirname}/json/partners.json`);
  return rfff;
};

const COMMANDS = [
  {
    command: "program",
    description: "Show conference program",
  },
  //   {
  //     command: "map",
  //     description: "Show map of premises",
  //   },
  //   {
  //     command: "speakers",
  //     description: "List of speakers",
  //   },
  {
    command: "partners",
    description: "List of partners",
  },
  //   {
  //     command: "ask",
  //     description: "FAQ",
  //   },
  //   {
  //     command: "now",
  //     description: "Current events",
  //   },
  {
    command: "addpartner",
    description: "Add partner",
  },
  {
    command: "addprogram",
    description: "Add program",
  },
  {
    command: "addspeaker",
    description: "Add speaker",
  },
  //   {
  //     command: "editpartner",
  //     description: "Add partner",
  //   },
  //   {
  //     command: "editprogram",
  //     description: "Add program",
  //   },
  //   {
  //     command: "editspeaker",
  //     description: "Add speaker",
  //   },
  // {
  //   command: "networking",
  //   description: "Хочу нетворкать",
  // },
  {
    command: "help",
    description: "Show help/main menu",
  },
];

module.exports = COMMANDS;

const getHelp = () => {
  let helpText = `*Here's how I can help:*\n`;
  helpText += COMMANDS.map((command) => `*/${command.command}* ${command.description}`).join(`\n`);
  return helpText;
};

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.telegram.setMyCommands(COMMANDS);

bot.start((ctx) =>
  ctx.replyWithMarkdown(
    `Hi👋 \n\n\
I'm a chatbot *Barcelona IT Conf* and I'm here to help you spend time on \
conferences with benefit and pleasure.\n\n\
I will help you keep track of the schedule, find out information about speakers and partners,\
receive notifications from the organizers and ask them questions. \n\n\
Use the convenient menu to quickly find the information you need👇\n\n` + getHelp()
  )
);

bot.command("partners", async (ctx) => {
  try {
    const partners_array = await readPartnerJsonFile();
    partners_array.map((e) => {
      ctx.replyWithHTML(`<b>${e.name}</b>
  ${e.title}
  ${!e.description ? e.subtitle : e.description}
  ${e.url}`);
    });
  } catch (error) {
    console.error(error);
  }
});

bot.command("addpartner", (ctx) => {
    try {
      ctx.replyWithHTML(``)
    } catch (error) {
      console.error(error)
    }
  });

bot.help((ctx) =>
  ctx.reply(
    `Hi, ${ctx.message.from.username}.\nHere's how I can help:\n\n/program - conference program\n/stop - stop\n/help - Show help/main menu`
  )
);
bot.command("help", (ctx) => {
  return ctx.replyWithMarkdown(getHelp());
});


bot.launch();

module.exports.handler = async function (event, context) {
  const message = JSON.parse(event.body);
  await bot.handleUpdate(message);
  return {
    statusCode: 200,
    body: "",
  };
};

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
