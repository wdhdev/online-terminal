#!/usr/bin/env node

import express from "express";
const app = express();

import chalk from "chalk";
import cors from "cors";
import { execaSync } from "execa";
import open from "open";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const password = argv.password || "H3lloW0rld!";
const port = argv.port || 3640;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/", express.static(__dirname + "/public"));

app.post("/api/execute", async (req, res) => {
    if(!req.body.password) return res.status(401).json({ "message": "No password was specified.", "code": "NO_PASSWORD" });
    if(req.body.password !== password) return res.status(401).json({ "message": "The password specified is incorrect.", "code": "INCORRECT_PASSWORD" });
    if(!req.body.command) return res.status(400).json({ "message": "No command was specified.", "code": "NO_COMMAND" });

    console.log(`\n${chalk.gray(os.userInfo().username + "@" + os.hostname())} ${chalk.blue("$")} ${req.body.command}`);

    let output;

    try {
        output = execaSync(req.body.command);

        console.log(output.stdout || output.stderr);

        res.status(200).json({
            "message": "The command ran successfully.",
            "code": "COMMAND_SUCCESS",
            "output": output.stdout || output.stderr
        })
    } catch(err) {
        console.log(err.message);

        res.status(500).json({
            "message": "The command did not run successfully.",
            "code": "COMMAND_FAILURE",
            "output": err.message
        })
    }
})

app.listen(port, () => {
    console.log(
        chalk.bgGray(" SERVER "),
        chalk.greenBright("Listening on Port:"),
        chalk.blue(chalk.underline(port))
    )

    console.log(
        chalk.bgGray(" DASHBOARD "),
        chalk.blue(chalk.underline(`http://localhost${port === 80 ? "" : `:${port}`}`))
    )

    console.log(
        chalk.bgGray(" PASSWORD "),
        chalk.yellow(password)
    )

    open(`http://localhost${port === 80 ? "" : `:${port}`}`);
})