---
title: Azure Functions with Visual Studio Code - get started
description: Try Azure Functions for free with Visual Studio Code
author: KarlErickson
ms.author: karler
ms.date: 05/17/2019
ms.topic: quickstart
ms.service: azure-functions
ms.devlang: javascript
---
# Deploy to Azure using Azure Functions

This tutorial walks you through creating and deploying a JavaScript Azure Functions application using the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions). Create a new app, add functions, and deploy in a matter of minutes from Visual Studio Code.

## Prerequisites

If you don't have an Azure account, [sign up today](https://azure.microsoft.com/en-us/free/?utm_source=campaign&utm_campaign=vscode-tutorial-docker-extension&mktingSource=vscode-tutorial-docker-extension) for a free account with $200 in Azure credits to try out any combination of services.

You need [Visual Studio Code](https://code.visualstudio.com/) installed along with [Node.js and npm](https://nodejs.org/en/download), the Node.js package manager.

To enable local debugging, you need to install the [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing).

**On macOS**, install using [Homebrew](https://brew.sh/).

```bash
brew tap azure/functions
brew install azure-functions-core-tools
```

**On Windows**, install using [npm](https://npmjs.com).

```console
npm install -g azure-functions-core-tools
```

**On Linux**, follow the instructions in the Azure Functions Core Tools [GitHub repository](https://github.com/Azure/azure-functions-core-tools#linux).

## Install the extension

The Azure Functions extension is used to create, manage, and deploy Functions Apps on Azure.

> [!div class="nextstepaction"]
> <a href="vscode:extension/ms-azuretools.vscode-azurefunctions">Install the Azure Functions extension</a>

## Prerequisite check

Before we continue, ensure that you have all the prerequisites installed and configured.

In VS Code, you should see your Azure email address in the Status Bar and your subscription in the **AZURE FUNCTIONS** explorer.

Verify that you have the Azure Functions tools installed by opening a terminal (or PowerShell/Command Prompt) and running `func`. The output will display the following image followed by additional information, such as version numbers.

```
                  %%%%%%
                 %%%%%%
            @   %%%%%%    @
          @@   %%%%%%      @@
       @@@    %%%%%%%%%%%    @@@
     @@      %%%%%%%%%%        @@
       @@         %%%%       @@
         @@      %%%       @@
           @@    %%      @@
                %%
                %
```

## Next steps

> [!div class="nextstepaction"]
> [I've installed the Azure Functions extension](./tutorial-javascript-vscode-create-app.md)
> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-functions&step=getting-started)
