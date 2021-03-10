---
title: Set up local development for Azure Static Web Apps
description: Learn to set you your local development environment for Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 03/08/2021
ms.author: cshoe
ms.custom: devx-track-js
---

# Set up local development for Azure Static Web Apps Preview

When published to the cloud, an Azure Static Web Apps site has many services that work together as if they're the same application. These services include:

- Static web app
- Authentication and authorization services
- Azure Functions API

Running locally, however, these services aren't automatically tied together.

To provide the same integrated local experience, the [Azure Static Web Apps CLI](https://github.com/Azure/static-web-apps-cli) provides direct access your Azure Functions API, and a mock authentication and authorization server.

The following chart shows how requests are handled locally.

:::image type="content" source="media/local-development/cli-conceptual.png" alt-text="Azure Static Web App CLI request and response flow":::

> [!IMPORTANT]
> Navigate to [http://localhost:4280](http://localhost:4280) to access the application served by the CLI.

1. **Requests** made against port `4280` are forwarded to the appropriate server depending on the type of request.

2. **Static content** requests are either handled by the internal CLI static content server, or by the front-end framework server for debugging.

3. **Authentication and authorization** requests are handled by an emulator, which provides a fake identity profile to your app.

4. **Functions Core Tools runtime** handles requests to the site's API.

5. **Responses** from all servers are returned to the browser as if they were all a single application.

## Prerequisites

- **[Visual Studio Code](https://code.visualstudio.com/)**: Used to debug the API application.
- **Existing Azure Static Web Apps site**: If you don't have one, begin with the [vanilla-api](https://github.com/staticwebdev/vanilla-api/generate?return_to=/staticwebdev/vanilla-api/generate) starter.
- **[Node.js](https://nodejs.org) with npm**: Run the [Node.js LTS](https://nodejs.org) version, which includes access [npm](https://www.npmjs.com/).
  - _Required_ even if you're developing Blazor apps.

## Get started

Open a terminal to the root folder of your existing Azure Static Web Apps site.

1. Install the CLI.

    `npm install -g @azure/static-web-apps-cli`

1. Start the CLI.

    `swa start`

1. Navigate to [http://localhost:4280](http://localhost:4280) to view the app in the browser.

## Authorization and authentication emulation

The Static Web Apps CLI emulates the security flow implemented in Azure. When a user logs in, you can define a fake identity profile returned to the app.

For instance, when you try to navigate to `/.auth/login/github`, a page is returned that allows you to define an identity profile.

> [!NOTE]
> The emulator works with any security provider, not just GitHub.

:::image type="content" source="media/local-development/auth-emulator.png" alt-text="Local authentication and authorization emulator":::

This page gives you the chance to provide an account username, user ID, and a list of roles.

After logging in, you can use the `/.auth/me` endpoint to retrieve the user's [client principal](./user-information.md).

## Debugging

Debugging is possible by allowing the Static Web Apps CLI to use dev servers for static content and the API.

  `swa start http://localhost:<FRONT-END-SERVER-PORT-NUMBER> http://localhost:7170`

| Part of application | Description | How to run |
| --- | --- | --- |
| *Front-end static site and, or single page application (SPA)* | Many front-end frameworks and libraries have their own CLI that launch development servers.| Start the development server in its own terminal window. |
| *Azure Functions API* | Open API application in Visual Studio Code. For instance if your API application is in an _api_ folder, open this folder in Visual Studio. | Open the API app in Visual Studio Code, and start debugging. |

With the front-end application launched, and a Visual Studio Code debugging session started for the API, you can run `swa start` and provide the running servers to debug.

`swa start http://localhost:<FRONT-END-SERVER-PORT-NUMBER> http://localhost:7170`

The following screenshots show the terminals for a typical debugging scenario.

:::image type="content" source="media/local-development/visual-studio-code-debugging.png" alt-text="Visual Studio Code API debugging":::

:::image type="content" source="media/local-development/run-dev-static-server.png" alt-text="Static site development server":::

:::image type="content" source="media/local-development/static-web-apps-cli-terminal.png" alt-text="Azure Static Web Apps CLI terminal":::

## Next steps

> [!div class="nextstepaction"]
> [Configure your application](configuration.md)
