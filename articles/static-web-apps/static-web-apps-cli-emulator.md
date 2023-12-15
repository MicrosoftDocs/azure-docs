---
title: Emulator Azure Static Web Apps CLI
description: Emulator Azure Static Web Apps CLI
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 12/15/2023
ms.author: cshoe
---

# Start the Static Web Apps CLI emulator

Static Web Apps is a cloud-based platform that hosts and runs your web apps. When you run your app locally, you need special tools to help you approximate how your app would run in the cloud.

The Static Web Apps CLI (SWA CLI) includes an emulator that mimics how your app would run on Azure, but instead exclusively on your machine.

The `swa start` command launches the emulator with default settings. By default, the emulator uses port `4280`.

For more information about individual commands, see the [CLI reference](/azure/static-web-apps/static-web-apps-cli#swa-start).

| Serve from... | Command | Notes |
|---|---|---|
| Current folder | `swa start` | By default, the CLI starts and serves static content (HTML, image, script, and CSS files) from the current working directory. |
| Specific folder | `swa start ./my-dist` | You can override the behavior to start the emulator with a different static assets folder.  |

## Use development server

As you develop your app's front-end, you might want to use the framework's default development server. Using a framework's server allows you to take advantage of benefits like live reload and hot module replacement (HMR).

For example, Angular developers often use `ng serve` or `npm start` to run the development server.

You can set up the Static Web Apps SWA CLI to capture requests to the dev server, which gives you the benefits of both your framework's CLI while simultaneously working with Static Web Apps CLI.

There are two steps to using a framework's dev server along with the SWA CLI:

1. Start your framework's local dev server as usual. Make sure to note the URL (including the port) used by the framework.

1. Start the SWA CLI in a new terminal, passing in the dev server URL.

```bash
swa start <DEV_SERVER_URL>
```

> [!NOTE]
> Make sure to replace the `<DEV_SERVER_URL>` placeholder with your own value.

### Launch dev server

You can simplify your workflow further by having the SWA CLI launch the dev server for you.

You can pass a custom command to the `--run` parameter to the `swa start` command.

```bash
swa start <DEV_SERVER_URL> --run <DEV_SERVER_LAUNCH_COMMAND>
```

Here's some examples of starting the emulator with a few different frameworks:

| Framework | Command |
|---|---|
| React | `swa start http://localhost:3000 --run "npm start"` |
| Blazor | `swa start http://localhost:5000 --run "dotnet watch run"` |
| Jekyll | `swa start http://localhost:4000 --run "jekyll serve"` |

You can also use the `--run` parameter if you want to run a custom script as you launch the dev server.

```bash
swa start http://localhost:4200 --run "./startup.sh"
```

Using the above command, you can access the application with the emulated services from `http://localhost:4280`

## Default dev server ports

The following table lists some default ports used by popular frameworks.

| Tool | Port | Command |
|--|--|--|
| [Angular](https://angular.io/cli) | 4200 | `swa start http://localhost:4200` |
| [Blazor WebAssembly](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor) | 5000 | `swa start http://localhost:5000` |
| [Gatsby](https://www.gatsbyjs.com/docs/gatsby-cli/) | 8000 | `swa start http://localhost:8000` |
| [Hugo](https://gohugo.io/commands/hugo_server/) | 1313 | `swa start http://localhost:1313` |
| [Next.js](https://nextjs.org/) | 3000 | `swa start http://localhost:3000` |
| [React (Create React App)](https://reactjs.org/docs/create-a-new-react-app.html) | 3000 | `swa start http://localhost:3000` |
| [Svelte (sirv-cli)](https://github.com/lukeed/sirv/tree/master/packages/sirv-cli/) | 5000 | `swa start http://localhost:5000` |
| [Vue](https://cli.vuejs.org/) | 8080 | `swa start http://localhost:8080` |
| [Vite-based frameworks](https://vitejs.dev/) | 5173 | `swa start http://localhost:5173` |

## Next steps

> [!div class="nextstepaction"]
> [Start the API server](static-web-apps-cli-emulator.md)
