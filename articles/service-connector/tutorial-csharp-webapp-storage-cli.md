---
title: 'Tutorial: Deploy a web application connected to Azure Blob Storage with Service Connector'
description: Create a web app connected to Azure Blob Storage with Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: tutorial
ms.date: 05/03/2022
ms.devlang: azurecli
ms.custom: event-tier1-build-2022
---

# Tutorial: Deploy a web application connected to Azure Blob Storage with Service Connector

Learn how to access Azure Blob Storage for a web app (not a signed-in user) running on Azure App Service by using managed identities. In this tutorial, you'll use the Azure CLI to complete the following tasks:

> [!div class="checklist"]
> * Set up your initial environment with the Azure CLI
> * Create a storage account and an Azure Blob Storage container.
> * Deploy code to Azure App Service and connect to storage with managed identity using Service Connector

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- The <a href="/cli/azure/install-azure-cli" target="_blank">Azure CLI</a> 2.30.0 or higher. You'll use it to run commands in any shell to provision and configure Azure resources.

## Set up your initial environment
1. Check that your Azure CLI version is 2.30.0 or higher:

    ```azurecli
    az --version
    ```
    If you need to upgrade, try the `az upgrade` command (requires version 2.11+) or see <a href="/cli/azure/install-azure-cli" target="_blank">Install the Azure CLI</a>.

1. Sign in to Azure using the CLI:

    ```azurecli
    az login
    ```
    This command opens a browser to gather your credentials. When the command finishes, it shows a JSON output containing information about your subscriptions.

    Once signed in, you can run Azure commands with the Azure CLI to work with resources in your subscription.

## Clone or download the sample app

1. Clone the sample repository:
    ```Bash
    git clone https://github.com/Azure-Samples/serviceconnector-webapp-storageblob-dotnet.git
    ```

1. Go to the repository's root folder:
    ```Bash
    cd serviceconnector-webapp-storageblob-dotnet
    ```

## Create the App Service app

1. In the terminal, make sure you're in the *WebAppStorageMISample* repository folder that contains the app code.

1. Create an App Service app (the host process) with the [`az webapp up`](/cli/azure/webapp#az-webapp-up) command below.
   
   ```azurecli
    az webapp up --name <app-name> --sku B1 --location eastus --resource-group ServiceConnector-tutorial-rg
    ```

    Replace the following placeholder texts with your own data:

    - For the *`--location`* argument, make sure to use a [region supported by Service Connector](concept-region-support.md). 
    - Replace *`<app-name>`* with a unique name across all Azure (the server endpoint is `https://<app-name>.azurewebsites.net`). Allowed characters for *`<app-name>`* are `A`-`Z`, `0`-`9`, and `-`. A good pattern is to use a combination of your company name and an app identifier.

## Create a storage account and a Blob Storage container

In the terminal, run the following command to create a general purpose v2 storage account and a Blob Storage container. 

```azurecli
az storage account create --name <storage-name> --resource-group ServiceConnector-tutorial-rg --sku Standard_RAGRS --https-only
```
Replace *`<storage-name>`* with a unique name. The name of the container must be in lowercase, start with a letter or a number, and can include only letters, numbers, and the dash (-) character.


## Connect an App Service app to a Blob Storage container with a managed identity

In the terminal, run the following command to connect your web app to blob storage with a managed identity.

```azurecli
az webapp connection create storage-blob -g ServiceConnector-tutorial-rg -n <app-name> --tg ServiceConnector-tutorial-rg --account <storage-name> --system-identity
```

  Replace the following placeholder texts with your own data:
- Replace *`<app-name>`* with your web app name you used in step 3.
- Replace *`<storage-name>`* with your storage app name you used in step 4.

> [!NOTE]
> If you see the error message "The subscription is not registered to use Microsoft.ServiceLinker", please run `az provider register -n Microsoft.ServiceLinker` to register the Service Connector resource provider and run the connection command again. 

## Run sample code

In the terminal, run the following command to open the sample application in your browser. Replace *`<app-name>`* with the web app name you used earlier.

```Azure CLI
az webapp browse --name <app-name> 
```

The sample code is a web application. Each time you refresh the index page, the application creates or updates a blob with the text `Hello Service Connector! Current is {UTC Time Now}` to the storage container and reads back to show it in the index page.

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
