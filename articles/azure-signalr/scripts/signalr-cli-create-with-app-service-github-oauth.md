---
title: Create web app using SignalR Service and GitHub authentication
description: Azure CLI Script Sample - Create a web app that uses SignalR Service and GitHub authentication
author: vicancy
ms.service: signalr
ms.devlang: azurecli
ms.topic: sample
ms.date: 03/30/2022
ms.author: lianwei
ms.custom: mvc, devx-track-azurecli
---

# Create a web app that uses SignalR Service and GitHub authentication

This sample script creates a new Azure SignalR Service resource, which is used to push real-time content updates to clients. This script also adds a new Web App and App Service plan to host your ASP.NET Core Web App that uses the SignalR Service. The web app is configured with app settings to connect to the new SignalR service resource, and authenticate with [GitHub authentication](https://developer.github.com/v3/guides/basics-of-authentication/). The web app is also configured to use a local git repository deployment source.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Sample scripts

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Create the SignalR service with an App service

:::code language="azurecli" source="~/azure_cli_scripts/azure-signalr/create-signalr-with-app-service/create-signalr-with-app-service.sh" id="FullScript":::

### Enable GitHub authentication and Git deployment for web app

1. Update the values in the following script for the desired deployment username and its passwor

   ```azurecli
   deploymentUser=<Replace with your desired username>
   deploymentUserPassword=<Replace with your desired password>
   ```

2. Update the values in the following script based on your GitHub OAuth App registration.

   ```azurecli
   GitHubClientId=<Replace with your GitHub OAuth app Client ID>
   GitHubClientSecret=<Replace with your GitHub OAuth app Client Secret>
   ```

3. Add app settings to use with GitHub authentication

   ```Azure CLI
   az webapp config appsettings set --name $webApp --resource-group $resourceGroup --settings "GitHubClientSecret=$GitHubClientSecret" 
   ```

4. Update the webapp with the desired deployment user name and password

   ```Azure CLI
   az webapp deployment user set --user-name $deploymentUser --password $deploymentUserPassword
   ```

5. Configure Git deployment and return the deployment URL.

   ```Azure CLI
   az webapp deployment source config-local-git --name $webAppName --resource-group $resourceGroupName --query [url] -o tsv
   ```

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

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
