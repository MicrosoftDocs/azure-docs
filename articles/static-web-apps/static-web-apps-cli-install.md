---
title: Install Azure Static Web Apps CLI
description: Learn how to install Azure Static Web Apps CLI
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 02/05/2024
ms.author: cshoe
---

# Install the Static Web Apps CLI (SWA CLI)

You have different options available to install the Azure Static Web Apps CLI. The Azure Static Web Apps CLI requires that you have [Node.js](https://nodejs.org/) installed locally. By default, Node.js comes with the Node Package Manager (npm), though you may opt to use other package managers such as [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/).

| Resource | Command |
|---|---|
| [`npm`](https://docs.npmjs.com/cli/v6/commands/npm-install) | `npm install -g @azure/static-web-apps-cli` |
| [`yarn`](https://classic.yarnpkg.com/lang/en/docs/cli/install/) | `yarn add @azure/static-web-apps-cli` |
| [`pnpm`](https://pnpm.io/cli/install) | `pnpm install -g @azure/static-web-apps-cli` |

> [!NOTE]
> SWA CLI only supports Node versions 16 and below.

## Validate install

Installing the package makes the `swa` command available on your machine. You can verify the installation is successful by requesting the CLI version.

```bash
swa --version
# When installed, the version number is printed out
```

## Usage

To begin using the CLI, you can run the `swa` command alone and follow the interactive prompts.

The SWA CLI interactive prompts help guide you through the different options important as you develop your web app.

Run the `swa` command to begin setting up your application.

```bash
swa
```

The `swa` command generates a configuration file, builds your project, and gives you the option to deploy to Azure.

For details on all the SWA CLI commands, see the [CLI reference](static-web-apps-cli.yml).

## Using npx

You can run any Static Web Apps CLI commands directly using npx. For example:

```bash
npx @azure/static-web-apps-cli --version
```

Alternatively, you can start the emulator via the `start` command:

```bash
npx @azure/static-web-apps-cli start
```

## Next steps

> [!div class="nextstepaction"]
> [Start the emulator](static-web-apps-cli-emulator.md)
