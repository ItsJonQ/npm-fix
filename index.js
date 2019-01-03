const fs = require("fs");
const path = require("path");
const execa = require("execa");
const chalk = require("chalk");
const Listr = require("listr");
const isOnline = require("is-online");

async function execPrestart() {
  console.log("📦 ", "", chalk.bold("NPM Fix"));
  console.log("");

  console.log("🔍 ", "Analyzing...");
  console.log("");

  const { stdout: npmVersion } = await execa("npm", ["-v"]);
  const { stdout: npmWhoAmI } = await execa("npm", ["whoami"]);
  const { stdout: pwd } = await execa("pwd");

  const pkgLockPath = path.resolve(pwd, "package-lock.json");
  const nodeModulesPath = path.resolve(pwd, "node_modules");

  console.log(chalk.bold("Project details"));
  console.log(chalk.gray("--------------------------------------------"));
  console.log("npm   ", "version  ", npmVersion.replace("v", ""));
  console.log("npm   ", "user     ", npmWhoAmI);
  console.log(chalk.gray("--------------------------------------------"));
  console.log("");

  console.log("💪 ", "Fixing...");
  console.log("");

  const tasks = new Listr([
    {
      title: `${chalk.grey("[1/4]")} 🔌  Checking connection...`,
      task: (ctx, task) => {
        return isOnline({ timeout: 2500 }).then(online => {
          ctx.isOnline = online;
        });
      }
    },
    {
      title: `${chalk.grey("[2/4]")} 🔓  Removing package-lock.json...`,
      task: (ctx, task) => {
        offlineSkip(ctx, task);
        if (fs.existsSync(pkgLockPath)) {
          fs.unlinkSync(pkgLockPath);
        }
        return Promise.resolve();
      }
    },
    {
      title: `${chalk.grey("[3/4]")} 📦  Removing node_modules...`,
      task: (ctx, task) => {
        offlineSkip(ctx, task);
        if (fs.existsSync(nodeModulesPath)) {
          return execa("rm", ["-rf", "node_modules"]);
        } else {
          return Promise.resolve();
        }
      }
    },
    {
      title: `${chalk.grey("[4/4]")} 🚚  Fetching packages...`,
      task: (ctx, task) => {
        if (!ctx.isOnline) {
          task.skip(
            "Looks like you're offline. We can't fetch dependencies from the Internet 😔."
          );
        }

        return execa("npm", ["install"]);
      }
    }
  ]);

  tasks
    .run()
    .then(() => {
      console.log("");
      console.log(chalk.green("Success!"));
      console.log("");
      console.log("✨ ", "Have fun developing!");
      console.log("");
    })
    .catch(err => {
      console.log("");
      console.log(chalk.red("Error!"));
      console.error(err);
      console.log("");
    });
}

function offlineSkip(ctx, task) {
  if (!ctx.isOnline) {
    task.skip(
      "Looks like you're offline. We can't fetch dependencies from the Internet 😔."
    );
  }
}

function Fix() {
  return execPrestart();
}

function sync(cb) {
  new Fix().then(cb).catch(cb);
}

function fix() {
  return new Fix();
}

fix.sync = sync;

module.exports = fix;
