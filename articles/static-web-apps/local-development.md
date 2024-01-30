---
title: Set up local development for Azure Static Web Apps
description: Learn to set you your local development environment for Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 08/09/2022
ms.author: cshoe
ms.custom:
---

# Set up local development for Azure Static Web Apps

When published to the cloud, an Azure Static Web Apps site links together many services that work together as if they're the same application. These services include:

- The static web app
- Azure Functions API
- Authentication and authorization services
- Routing and configuration services

These services must communicate with each other, and Azure Static Web Apps handles this integration for you in the cloud.

Running locally, however, these services aren't automatically tied together.

To provide a similar experience as to what you get in Azure, the [Azure Static Web Apps CLI](https://github.com/Azure/static-web-apps-cli) provides the following services:

- A local static site server
- A proxy to the front-end framework development server
- A proxy to your API endpoints - available through Azure Functions Core Tools
- A mock authentication and authorization server
- Local routes and configuration settings enforcement

> [!NOTE]
> Often sites built with a front-end framework require a proxy configuration setting to correctly handle requests under the `api` route. When using the Azure Static Web Apps CLI the proxy location value is `/api`, and without the CLI the value is `http://localhost:7071/api`.

## How it works

The following chart shows how requests are handled locally.

:::image type="content" source="media/local-development/cli-conceptual.png" alt-text="Azure Static Web App CLI request and response flow":::

> [!IMPORTANT]
> Go to `http://localhost:4280` to access the application served by the CLI.

- **Requests** made to port `4280` are forwarded to the appropriate server depending on the type of request.

- **Static content** requests, such as HTML or CSS,  are either handled by the internal CLI static content server, or by the front-end framework server for debugging.

- **Authentication and authorization** requests are handled by an emulator, which provides a fake identity profile to your app.

- **Functions Core Tools runtime**<sup>1</sup> handles requests to the site's API.

- **Responses** from all services are returned to the browser as if they were all a single application.

The following article details the steps for running a node-based application, but the process is the same for any language or environment. Once you start the UI and the Azure Functions API apps independently, then start the Static Web Apps CLI and point it to the running apps using the following command:

```console
swa start http://localhost:<DEV-SERVER-PORT-NUMBER> --api-location http://localhost:7071
```

Optionally, if you use the `swa init` command, the Static Web Apps CLI looks at your application code and build a _swa-cli.config.json_ configuration file for the CLI. When you use the _swa-cli.config.json_ file, you can run `swa start` to launch your application locally.

<sup>1</sup> The Azure Functions Core Tools are automatically installed by the CLI if they aren't already on your system.

## Prerequisites

- **Existing Azure Static Web Apps site**: If you don't have one, begin with the [vanilla-api](https://github.com/staticwebdev/vanilla-api/generate?return_to=/staticwebdev/vanilla-api/generate) starter app.
- **[Node.js](https://nodejs.org) with npm**: Run the [Node.js LTS](https://nodejs.org) version, which includes access to [npm](https://www.npmjs.com/).
- **[Visual Studio Code](https://code.visualstudio.com/)**: Used for debugging the API application, but not required for the CLI.

## Get started

Open a terminal to the root folder of your existing Azure Static Web Apps site.

1. Install the CLI.

    ```console
    npm install -D @azure/static-web-apps-cli
    ```

    > [!TIP]
    > If you want to install the SWA CLI globally, use `-g` in place of `-D`. It is highly recommended, however, to install SWA as a development dependency.

1. Build your app if required by your application.

    Run `npm run build`, or the equivalent command for your project.

1. Initialize the repository for the CLI.

    ```console
    swa init
    ```

    Answer the questions posed by the CLI to verify your configuration settings are correct.

1. Start the CLI.

    ```console
    swa start
    ```

1. Go to `http://localhost:4280` to view the app in the browser.

### Other ways to start the CLI

| Description | Command | Comments |
|--|--|--|
| Serve a specific folder | `swa start ./<OUTPUT_FOLDER_NAME>` | Replace `<OUTPUT_FOLDER_NAME>` with the name of your output folder. |
| Use a running framework development server | `swa start http://localhost:3000` | This command works when you have an instance of your application running under port `3000`. Update the port number if your configuration is different. |
| Start a Functions app in a folder | `swa start ./<OUTPUT_FOLDER_NAME> --api-location ./api` | Replace `<OUTPUT_FOLDER_NAME>` with the name of your output folder. This command expects your application's API to have files in the _api_ folder. Update this value if your configuration is different. |
| Use a running Functions app | `swa start ./<OUTPUT_FOLDER_NAME> --api-location http://localhost:7071` | Replace `<OUTPUT_FOLDER_NAME>` with the name of your output folder. This command expects your Azure Functions application to be available through port `7071`. Update the port number if your configuration is different. |

## Authorization and authentication emulation

The Static Web Apps CLI emulates the [security flow](./authentication-authorization.md) implemented in Azure. When a user logs in, you can define a fake identity profile returned to the app.

For instance, when you try to go to `/.auth/login/github`, a page is returned that allows you to define an identity profile.

> [!NOTE]
> The emulator works with any security provider, not just GitHub.

:::image type="content" source="media/local-development/auth-emulator.png" alt-text="Local authentication and authorization emulator":::

The emulator provides a page allowing you to provide the following [client principal](./user-information.md#client-principal-data) values:

| Value | Description |
| --- | --- |
| **Username** | The account name associated with the security provider. This value appears as the `userDetails` property in the client principal and is autogenerated if you don't provide a value. |
| **User ID** | Value autogenerated by the CLI.  |
| **Roles** | A list of role names, where each name is on a new line.  |
| **Claims** | A list of [user claims](user-information.md#client-principal-data), where each name is on a new line.  |

Once logged in:

- You can use the `/.auth/me` endpoint, or a function endpoint to retrieve the user's [client principal](./user-information.md).

- Navigating to `/.auth/logout` clears the client principal and logs out the mock user.

## Debugging

There are two debugging contexts in a static web app. The first is for the static content site, and the second is for API functions. Local debugging is possible by allowing the Static Web Apps CLI to use development servers for one or both of these contexts.

The following steps show you a common scenario that uses development servers for both debugging contexts.

1. Start the static site development server. This command is specific to the front-end framework you're using, but often comes in the form of commands like `npm run build`, `npm start`, or `npm run dev`.

1. Open the API application folder in Visual Studio Code and start a debugging session.

1. Start the Static Web Apps CLI using the following command.

    ```console
    swa start http://localhost:<DEV-SERVER-PORT-NUMBER> --appDevserverUrl http://localhost:7071
    ```

    Replace `<DEV_SERVER_PORT_NUMBER>` with the development server's port number.

The following screenshots show the terminals for a typical debugging scenario:

The static content site is running via `npm run dev`.

:::image type="content" source="media/local-development/run-dev-static-server.png" alt-text="Static site development server":::

The Azure Functions API application is running a debug session in Visual Studio Code.

:::image type="content" source="media/local-development/visual-studio-code-debugging.png" alt-text="Visual Studio Code API debugging":::

The Static Web Apps CLI is launched using both development servers.

:::image type="content" source="media/local-development/static-web-apps-cli-terminal.png" alt-text="Azure Static Web Apps CLI terminal":::

Now requests that go through port `4280` are routed to either the static content development server, or the API debugging session.

For more information on different debugging scenarios, with guidance on how to customize ports and server addresses, see the [Azure Static Web Apps CLI repository](https://github.com/Azure/static-web-apps-cli).

### Sample debugging configuration

Visual Studio Code uses a file to enable debugging sessions in the editor. If Visual Studio Code doesn't generate a *launch.json* file for you, you can place the following configuration in *.vscode/launch.json*.

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach to Node Functions",
            "type": "node",
            "request": "attach",
            "port": 9229,
            "preLaunchTask": "func: host start"
        }
    ]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Configure your application](configuration.md)
