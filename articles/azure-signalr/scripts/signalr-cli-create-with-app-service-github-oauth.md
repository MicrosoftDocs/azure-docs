---
title: Azure CLI Script Sample - Create a web app that uses SignalR Service and GitHub authentication
description: Azure CLI Script Sample - Create a web app that uses SignalR Service and GitHub authentication
author: sffamily
ms.service: signalr
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/22/2018
ms.author: zhshang
ms.custom: mvc
---

# Create a web app that uses SignalR Service and GitHub authentication

This sample script creates a new Azure SignalR Service resource, which is used to push real-time content updates to clients. This script also adds a new Web App and App Service plan to host your ASP.NET Core Web App that uses the SignalR Service. The web app is configured with app settings to connect to the new SignalR service resource, and authenticate with [GitHub authentication](https://developer.github.com/v3/guides/basics-of-authentication/). The web app is also configured to use a local git repository deployment source.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 

## Sample script

This script uses the *signalr* extension for the Azure CLI. Execute the following command to install the *signalr* extension for the Azure CLI before using this sample script:

```azurecli-interactive
az extension add -n signalr
```

[!code-azurecli-interactive[main](../../../cli_scripts/azure-signalr/create-signalr-with-app-service-github-oauth/create-signalr-with-app-service-github-oauth.sh "Create a new SignalR Service and Web App configured to use SignalR, GitHub OAuth, and local Git repository deployment source.")]

Make a note of the actual name generated for the new resource group. It will be shown in the output. You will use that resource group name when you want to delete all group resources.

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

Each command in the table links to command specific documentation. This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az signalr create](/cli/azure/signalr#az-signalr-create) | Creates an Azure SignalR Service resource. |
| [az signalr key list](/cli/azure/signalr/key#az-signalr-key-list) | List the keys, which will be used by your application when pushing real-time content updates with SignalR. |
| [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create) | Creates an Azure App Service Plan for hosting web apps. |
| [az webapp create](/cli/azure/webapp#az-webapp-create) | Creates an Azure Web app using the App Service hosting plan. |
| [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) | Adds new app settings for the web app. These app settings are used to store the SignalR connection string and GitHub OAuth app secrets. |
| [az webapp deployment user set](/cli/azure/webapp/deployment/user#az-webapp-deployment-user-set) | Update deployment credentials. |
| [az webapp deployment source config-local-git](/cli/azure/webapp/deployment/source#az-webapp-deployment-source-config-local-git) | Get a URL for a git repository endpoint to clone and push to for web app deployment. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure SignalR Service CLI script samples can be found in the [Azure SignalR Service documentation](../signalr-reference-cli.md).
