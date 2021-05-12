---
title: Add an API to Azure Static Web Apps with Azure Functions
description: Get started with Azure Static Web Apps by adding a Serverless API to your static web app using Azure Functions.
services: static-web-apps
author: manekinekko
ms.service: static-web-apps
ms.topic:  how-to
ms.date: 05/11/2021
ms.author: wachegha
ms.custom: devx-track-js
---

# Add an API to Azure Static Web Apps Preview with Azure Functions

You can add serverless APIs to Azure Static Web Apps via integration with Azure Functions. This article demonstrates how to add and deploy an API to an Azure Static Web Apps site.

## Prerequisites

- Azure account with an active subscription.
  - If you don't have an account, you can [create one for free](https://azure.microsoft.com/free).
- [Visual Studio Code](https://code.visualstudio.com/)
- [Azure Static Web Apps extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) for Visual Studio Code
- [Node.js](https://nodejs.org/download/)
- [Azure Functions Core Tools](../azure-functions/functions-run-local.md#install-the-azure-functions-core-tools) to run the API app locally
- [Azure Static Web Apps CLI](https://www.npmjs.com/package/@azure/static-web-apps-cli) to run the frontend and API app together locally

## Create the static web app

Before adding an API, create and deploy a frontend application to Azure Static Web Apps. Use an existing app that you have deployed or create one by following the [Building your first static site with Azure Static Web Apps](getting-started.md) quickstart.

In VS Code, open the root of the repository containing your app. It should contain the source for your frontend app and the Static Web Apps GitHub workflow in `.github/workflows`.

## Create the API

You create an Azure Functions projects for your static web app's API. By default, the Static Web Apps VS Code extension creates the project in a folder named `api` at the root of your repository.

1. Press <kbd>F1</kbd> to open the Command Palette.

1. Select **Azure Static Web Apps: Create HTTP Function...**.
    > [!NOTE]
    > If you're prompted to install the Azure Functions extension, install it and re-run this command.

1. When prompted, enter the following values:

    | Prompt | Value | Description |
    | --- | --- | --- |
    | Select a language | JavaScript | |
    | Provide a function name | message | |

    An Azure Functions project is generated with an HTTP triggered function. Your app now has a project structure similar to the following example.

    ```files
    ├── .github
    │   ├── workflows
    │   │   ├── azure-static-web-apps-<default-hostname>.yml
    ├── api
    │   ├── GetMessage
    │   │   ├── function.json
    │   │   ├── index.js
    │   ├── host.json
    │   ├── local.settings.json
    │   ├── package.json
    ├── (folders and files from your static web app)
    ```

    1. Next, you'll change the `message` function to return a message to the frontend. Update the function in _api/message/index.js_ with the following code.

        ```javascript
        module.exports = async function (context, req) {
            context.res = {
                body: {
                text: "Hello from the API"
                }
            };
        };
        ```

## Update the frontend app to call the API

Because the function you created is called `message`, it will be accessible at `/api/message`. Update your frontend app to call this API. If you used the quickstarts to create the app, use the following instructions to apply the updates.

Update the content of the _index.html_ file with the following code to fetch the text from the API function and display it on the screen:

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>Vanilla JavaScript App</title>
</head>

<body>
    <main>
    <h1>Vanilla JavaScript App</h1>
    <p>Loading content from the API: <b id="name">...</b></p>
    </main>

    <script>
    (async function() {
        let { text } = await( await fetch(`/api/message`)).json();
        document.querySelector('#name').textContent = text;
    }())
    </script>
</body>

</html>
```

## Run the frontend and API locally

To run your frontend app and API together locally, Azure Static Web Apps provides a CLI that emulates the cloud environment. The CLI leverages the Azure Functions Core Tools to run the API.

### Install command line tools

Ensure you have the command line tools installed.

1. Install Azure Static Web Apps CLI.
    ```bash
    npm install -g @azure/static-web-apps-cli
    ```

1. Install Azure Functions Core Tools V3.
    ```bash
    npm install -g azure-functions-core-tools@3
    ```

### Start the Static Web Apps emulator

Test the frontend app and API together by starting an emulator using the Static Web Apps CLI. The emulator serves your frontend's build output from a folder. If your app uses a framework, such as React, build the app to generate the output before running the emulator.

1. In root of your repository, start the emulator using the Static Web Apps CLI's `start` command. Pass the API folder in the `--api` argument.
    ```bash
    swa start --api api
    ```

1. When the emulator is started, access your app at `http://localhost:4280/`. The page calls the API and displays its output, `Hello from the API`.

1. To stop the emulator, type <kbd>Ctrl-C</kbd>.

## Add API location to workflow

Before you can deploy your app to Azure, update your repository's GitHub Actions workflow with the correct location of your API folder.

1. Open your workflow at _.github/workflows/azure-static-web-apps-\<default-host-name>.yml_.

1. Update the `Azure/static-web-apps-deploy` action's `api_location` property to `api` and save the file.

## Deploy changes to Static Web Apps

To publish changes to your static web app in Azure, commit and push your code to the remote GitHub repository.

1. Press <kbd>F1</kbd> to open the Command Palette.

1. Select the **Git: Commit All** command.

1. When prompted for a commit message, enter `add API` to commit all changes to your local Git repository.

1. Press <kbd>F1</kbd> to open the Command Palette.

1. Select the **Git: push** command.

    Your changes are pushed to the remote repository in GitHub, triggering the Static Web Apps GitHub Actions workflow to build and deploy your app.

1. Open your repository in GitHub to monitor the status of your workflow run.

1. When the workflow run is complete, visit your static web app to view your changes.

## Next steps

> [!div class="nextstepaction"]
> [Configure app settings](./application-settings.md)
