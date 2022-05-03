---
title: 'Tutorial: Deploy Web Application Connected to Azure Storage Blob with Service Connector'
description: Create a web app connected to Azure Storage Blob with Service Connector.
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: tutorial
ms.date: 10/28/2021
ms.custom: ignite-fall-2021, devx-track-azurecli 
ms.devlang: azurecli
---

# Tutorial: Deploy Web Application Connected to Azure Storage Blob with Service Connector

Learn how to access Azure Storage for a web app (not a signed-in user) running on Azure App Service by using managed identities. In this tutorial, you use the Azure CLI to complete the following tasks:

> [!div class="checklist"]
> * Set up your initial environment with the Azure CLI
> * Create a storage account and an Azure Blob Storage container.
> * Deploy code to Azure App Service and connect to storage with managed identity using Service Connector

## 1. Set up your initial environment

1. Have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
2. Install the <a href="/cli/azure/install-azure-cli" target="_blank">Azure CLI</a> 2.30.0 or higher, with which you run commands in any shell to provision and configure Azure resources.


Check that your Azure CLI version is 2.30.0 or higher:

```Azure CLI
az --version
```

If you need to upgrade, try the `az upgrade` command (requires version 2.11+) or see <a href="/cli/azure/install-azure-cli" target="_blank">Install the Azure CLI</a>.

Then sign in to Azure through the CLI:

```Azure CLI
az login
```

This command opens a browser to gather your credentials. When the command finishes, it shows JSON output containing information about your subscriptions.

Once signed in, you can run Azure commands with the Azure CLI to work with resources in your subscription.

## 2. Clone or download the sample app

Clone the sample repository:
```Bash
git clone https://github.com/Azure-Samples/serviceconnector-webapp-storageblob-dotnet.git
```

and go to the root folder of repository:
```Bash
cd serviceconnector-webapp-storageblob-dotnet
```

## 3. Create the App Service app

In the terminal, make sure you're in the *WebAppStorageMISample* repository folder that contains the app code.

Create an App Service app (the host process) with the [`az webapp up`](/cli/azure/webapp#az-webapp-up) command:

```Azure CLI
az webapp up --name <app-name> --sku B1 --location eastus --resource-group ServiceConnector-tutorial-rg
```

- For the `--location` argument, make sure you use the location that [Service Connector supports](concept-region-support.md).
- **Replace** *\<app-name>* with a unique name across all Azure (the server endpoint is `https://<app-name>.azurewebsites.net`). Allowed characters for *\<app-name>* are `A`-`Z`, `0`-`9`, and `-`. A good pattern is to use a combination of your company name and an app identifier.

## 4. Create a storage account and Blob Storage container

In the terminal, run the following command to create general-purpose v2 storage account and Blob Storage container. **Replace** *\<storage-name>* with a unique name. The container name must be lowercase, must start with a letter or number, and can include only letters, numbers, and the dash (-) character.

```Azure CLI
az storage account create --name <storage-name> --resource-group ServiceConnector-tutorial-rg --sku Standard_RAGRS --https-only
```


## 5. Connect App Service app to Blob Storage container with managed identity

In the terminal, run the following command to connect your web app to blob storage with managed identity.

```Azure CLI
az webapp connection create storage-blob -g ServiceConnector-tutorial-rg -n <app-name> --tg ServiceConnector-tutorial-rg --account <storage-name> --system-identity
```

- **Replace** *\<app-name>* with your web app name you used in step 3.
- **Replace** *\<storage-name>* with your storage app name you used in step 4.

> [!NOTE]
> If you see the error message "The subscription is not registered to use Microsoft.ServiceLinker", please run `az provider register -n Microsoft.ServiceLinker` to register the Service Connector resource provider and run the connection command again. 

## 6. Run sample code

In the terminal, run the following command to open the sample application in your browser. Replace *\<app-name>* with your web app name you used in step 3.

```Azure CLI
az webapp browse --name <app-name> 
```

The sample code is a web application. Each time you refresh the index page, it will create or update a blob with the text `Hello Service Connector! Current is {UTC Time Now}` to the storage container and read back to show it in the index page.

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
