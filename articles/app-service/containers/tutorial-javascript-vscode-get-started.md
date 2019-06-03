---
title: Azure App Service on Linux with Visual Studio Code - get started
description: Node.js Deployment to Azure App Services with Visual Studio Code
author: KarlErickson
ms.author: karler
ms.date: 05/17/2019
ms.topic: quickstart
ms.service: app-service
ms.devlang: javascript
---
# Deploy to Azure using Docker

This quickstart shows you how to containerize an existing Node.js application using [Docker](https://www.docker.com/), then use Visual Studio Code to push the app image to a Docker registry and deploy it to [Azure Web App for Containers](https://azure.microsoft.com/en-us/services/app-service/containers/).

## Prerequisites

If you don't have an Azure account, [sign up today](https://azure.microsoft.com/en-us/free/?utm_source=campaign&utm_campaign=vscode-tutorial-docker-extension&mktingSource=vscode-tutorial-docker-extension) for a free account with $200 in Azure credits to try out any combination of services.

You need [Visual Studio Code](https://code.visualstudio.com/) installed along with [Node.js and npm](https://nodejs.org/en/download) and [Docker](https://www.docker.com/community-edition).

## Install the Docker and Azure App Service extensions

The Docker extension is used to simplify the management of local Docker images and commands and to deploy built app images to Azure.

> <a class="tutorial-install-extension-btn" href="vscode:extension/PeterJausovec.vscode-docker">Install the Docker extension</a>

The Azure App Service extension is used to create, manage, and deploy Linux Web Apps on the Azure PaaS.

> <a class="tutorial-install-extension-btn" href="vscode:extension/ms-azuretools.vscode-azureappservice">Install the Azure App Service extension</a>

## Sign in

Once the extensions are installed, log into your Azure account - in the Activity Bar, click on the Azure logo to show the **AZURE APP SERVICE** explorer. Click **Sign in to Azure...** and follow the instructions.

![sign in to Azure](./media/tutorial-javascript-vscode/sign-in.png)

## Prerequisite Check

Before we continue, ensure that you have all the prerequisites installed and configured.

In VS Code, you should see your Azure email address in the Status Bar and your subscription in the **AZURE APP SERVICE** explorer.

Verify that you have Docker installed and running.

```bash
docker --version
Docker Version 17.12.0-ce, build c97c6d6
```

## Next steps

> [!div class="nextstepaction"]
> [I've installed the Docker and Azure App Service extensions](./tutorial-javascript-vscode-create-registry.md)
> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-docker-extension&step=getting-started)
