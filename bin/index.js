#!/usr/bin/env node
import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { exec } from "child_process";

const main = () => {
  console.log(chalk.blue("########## Node CLI ##########"));

  const argv = yargs(hideBin(process.argv))
    .command("disk", "check current disk space and usage")
    .parse();

  if (process.argv.length <= 2) {
    console.log(chalk.red("No arguments provided."));
    return;
  }
  if (argv._.includes("free")) {
    const command =
      process.platform === "win32" ? "wmic logicaldisk get deviceid, size, freespace" : "df -h";
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (process.platform === "win32") {
        const lines = stdout.split("\n").filter((line) => line.trim() !== "");
        lines.forEach((line, index) => {
          if (index !== 0) {
            // Skip the header line
            const [disk, size, free] = line.trim().split(/\s+/);
            console.log(`Disk: ${disk}, Size: ${size}, Free space: ${free}`);
          }
        });
      } else {
        console.log(`Disk space details: ${stdout}`);
      }
    });
  }

  console.log(chalk.blue("########## Node CLI ##########"));
};

main();
