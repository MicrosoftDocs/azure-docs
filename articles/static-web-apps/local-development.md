---
title: Set up local development for Azure Static Web Apps
description: Learn to set you your local development environment for Azure Static Web Apps
services: static-web-apps
author: burkeholland
ms.service: static-web-apps
ms.topic: how-to
ms.date: 05/08/2020
ms.author: buhollan
---

# Set up local development for Azure Static Web Apps Preview

An Azure Static Web Apps instance is made up of two different types of applications. The first is a web app for your static content. Web apps are often created with front-end frameworks and libraries or with static site generators. The second aspect is the API, which is an Azure Functions app that provides a rich back-end development environment.

When running in the cloud, Azure Static Web Apps seamlessly maps requests to the `api` route from the web app to the Azure Functions app without requiring CORS configuration. Locally, you need to configure your application to mimic this behavior.

This article demonstrates recommended best-practices for local development, including the following concepts:

- Set up the web app for static content
- Configuring the Azure Functions app for your application's API
- Debugging and running the application
- Best-practices for your app's file and folder structure

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code
- [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for Visual Studio Code
  - Necessary only if you're not using a front-end JavaScript framework or static site generator's CLI

## Run projects locally

Running an Azure Static Web App locally involves three processes, depending on whether or not your project contains an API.

- Running a local web server
- Running the API
- Connecting the web project to the API

Depending on how a website is built, a local web server may or may not be required to run the application in the browser. When using front-end JavaScript frameworks and static site generators, this functionality is built in to their respective CLIs (Command Line Interfaces). The following links point to the CLI reference for a selection of frameworks, libraries, and generators.

### JavaScript frameworks and libraries

- [Angular CLI](https://angular.io/cli)
- [Vue CLI](https://cli.vuejs.org/guide/creating-a-project.html)
- [React CLI](https://create-react-app.dev/)

### Static site generators

- [Gatsby CLI](https://www.gatsbyjs.org/docs/gatsby-cli/)
- [Hugo](https://gohugo.io/getting-started/quick-start/)
- [Jekyll](https://jekyllrb.com/docs/usage/)

If you're using a CLI tool to serve your site, you can skip to the [Running the API](#run-api-locally) section.

### Running a local web server with Live Server

The Live Server extension for Visual Studio Code provides a local development web server that serves static content.

#### Create a repository

1. Make sure you are logged in to GitHub and, navigate to [https://github.com/staticwebdev/vanilla-api/generate](https://github.com/staticwebdev/vanilla-api/generate) and create a new GitHub project named **vanilla-api**, using this template.

    :::image type="content" source="media/local-development/vanilla-api.png" alt-text="GitHub new repo window":::

1. Open Visual Studio Code.

1. Press **F1** to open the Command Palette.

1. Type **clone** in the search box and select **Git: Clone**.

    :::image type="content" source="media/local-development/command-palette-git-clone.png" alt-text="git clone option in Visual Studio Code":::

1. Enter the following value for **Repository URL**.

   ```http
   git@github.com:<YOUR_GITHUB_ACCOUNT>/vanilla-api.git
   ```

1. Select a folder location for the new project.

1. When prompted to open the cloned repository, select **Open**.

    :::image type="content" source="media/local-development/open-new-window.png" alt-text="Open in new window":::

Visual Studio Code opens the cloned project in the editor.

### Run the website locally with Live Server

1. Press **F1** to open the Command Palette.

1. Type **Live Server** in the search box and select **Live Server: Open with Live Server**

    A browser tab opens to display the application.

    :::image type="content" source="media/local-development/vanilla-api-site.png" alt-text="Simple static site running in the browser":::

    This application makes an HTTP request to the `api/message` endpoint. Right now, that request is failing because the API portion of this application needs to be started.

### Run API locally

Azure Static Web Apps APIs are powered by Azure Functions. See [Add an API to Azure Static Web Apps with Azure Functions](add-api.md) for details regarding adding an API to an Azure Static Web Apps project.

As part of the API creation process, a launch configuration is created for Visual Studio Code. This configuration is located in the _.vscode_ folder. This folder contains all of the required settings for building and running the API locally.

1. In Visual Studio Code, press **F5** to start the API.

1. A new terminal instance opens showing the output from the API build process.

    :::image type="content" source="media/local-development/terminal-api-debug.png" alt-text="API running in Visual Studio Code terminal":::

   The status bar in Visual Studio Code is now orange. This color indicates that the API is now running and the debugger is attached.

1. Next, press **Ctrl/Cmd** and click on the URL in the terminal to open a browser window that calls the API.

    :::image type="content" source="media/local-development/hello-from-api-endpoint.png" alt-text="Browser display result of API call":::

### Debugging the API

1. Open the _api/GetMessage/index.js_ file in Visual Studio Code.

1. Click in the left-hand margin on line 2 to set a breakpoint. A red dot appears which indicates the breakpoint is set.

    :::image type="content" source="media/local-development/breakpoint-set.png" alt-text="Breakpoint in Visual Studio Code":::

1. In the browser, refresh the page running at <http://127.0.0.1:7071/api/message>.

1. The breakpoint is hit in Visual Studio Code and program execution is paused.

   :::image type="content" source="media/local-development/breakpoint-hit.png" alt-text="Breakpoint hit in Visual Studio Code":::

   A complete [debugging experience is available in Visual Studio Code](https://code.visualstudio.com/Docs/editor/debugging) for your API.

1. Press the **Continue** button in the debug bar to continue execution.

    :::image type="content" source="media/local-development/continue-button.png" alt-text="Continue button in Visual Studio Code":::

### Calling the API from the application

When deployed, Azure Static Web Apps automatically maps these requests to the endpoints in the _api_ folder. This mapping ensures that requests from the application to the API look like the following example.

```javascript
let response = await fetch("/api/message");
```

Depending on whether or not your application is built with a JavaScript framework CLI, there are two ways to configure the path to the `api` route when running your application locally.

- Environment configuration files (recommended for JavaScript frameworks and libraries)
- Local proxy

### Environment configuration files

If you are building your app with front-end frameworks that have a CLI, you should use environment configuration files. Each framework or library has a different way of handling these environment configuration files. It's common to have a configuration file for development that is used when your application is running locally, and one for production that is used when your application is running in production. The CLI for the JavaScript framework or static site generator that you are using will automatically know to use the development file locally and the production file when your app is built by Azure Static Web Apps.

In the development configuration file, you can specify the path to the API, which points to the local location of `http:127.0.0.1:7071` where the API for your site is running locally.

```
API=http:127.0.0.1:7071/api
```

In the production configuration file, specify the path to the API as `api`. This way your application will call the api via "yoursite.com/api" when running in production.

```
API=api
```

These configuration values can be referenced as Node environment variables in the web app's JavaScript.

```js
let response = await fetch(`${process.env.API}/message`);
```

When the CLI is used to run your site in development mode or to build the site for production, the `process.env.API` value is replaced with the value from the appropriate configuration file.

For more information on configuring environment files for front-end JavaScript frameworks and libraries, see these articles:

- [Angular Environment Variables](https://angular.io/guide/build#configuring-application-environments)
- [React - Adding Custom Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Vue - Modes and Environment Variables](https://cli.vuejs.org/guide/mode-and-env.html)

[!INCLUDE [static-web-apps-local-proxy](../../includes/static-web-apps-local-proxy.md)]

##### Restart Live Server

1. Press **F1** to open the Command Palette in Visual Studio Code.

1. Type **Live Server** and select **Live Server: Stop Live Server**.

    :::image type="content" source="media/local-development/stop-live-server.png" alt-text="Stop Live Server command in Visual Studio command palette":::

1. Press **F1** to open the Command Palette.

1. Type **Live Server** and select **Live Server: Open with Live Server**.

1. Refresh the application running at `http://locahost:3000`. The browser now displays the message returned from the API.

    :::image type="content" source="media/local-development/hello-from-api.png" alt-text="Hello from API displayed in the browser":::

## Next steps

> [!div class="nextstepaction"]
> [Configure app settings](application-settings.md)
