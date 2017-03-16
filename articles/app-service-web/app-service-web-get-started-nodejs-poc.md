---
title: Quickstart for Node.js in Azure Web App | Microsoft Docs
description: Deploy your first Node.js Hello World in App Service Web App in minutes. 
services: app-service\web
documentationcenter: ''
author: syntaxc4
manager: erikre
editor: ''

ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 03/15/2017
ms.author: cfowler
---

# Quickstart for Node.js in Azure Web App

This quickstart shows you how to create a Web App application that displays a short message.

## Before you begin

Before running this sample, install the following prerequisites locally:

1. [Download and install git](https://git-scm.com/)
1. [Download and install Node.js and NPM](https://nodejs.org/)
1. Download, install and initialize the [Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

This quickstart demonstrates a simple Node.js application.

## Download the Hello World app

We've created a simple Hello World app for Node.js so you can quickly get a feel for deploying an app to Web App. Follow these steps from a command line to download the Hello World to your local machine.

Download the sample app and navigate into the app directory:

1. Clone the Hello World sample app repository to your local machine:

    ```cli
    git clone https://github.com/Azure-Samples/nodejs-docs-hello-world
    ```

    Alternatively, you can [download the sample](https://github.com/Azure-Samples/nodejs-docs-hello-world/archive/master.zip) as a zip file and extract it.

1. Change to the directory that contains the sample code:

    ```cli
    cd nodejs-docs-hello-world
    ```

## Run Hello World on your local machine

1. Run the start script.

    ```cli
    npm start
    ```

1. In your web browser, enter the following address:

   ```cli
   http://localhost:1337
   ```

You can see the **Hello World** message from the sample app displayed in the page.

In your terminal window, press **Ctrl+C** to exit the web server.

## Deploy and run Hello World on Web App

To deploy your app to Web App:

1. Create a resource group:

    ```azurecli
    az group create --location westeurope --name myResourceGroup
    ```

1. Create an app service plan in Standard tier:

    ```azurecli
    az appservice plan create --name <app_name> --resource-group myResourceGroup --sku S1 --is-linux
    ```
1. Create a Web App:

    ```azurecli
    az appservice web create --name <app_name> --resource-group myResourceGroup --plan <app_name>
    ```

1. Configure the web app for Node.js `6.9.3`:

    ```azurecli
    az appservice web config update --node-version 6.9.3 --startup-file index.js --name <app_name> --resource-group myResourceGroup
    ```

1. Set the account-level deployment credentials:

    ```azurecli
    az appservice web deployment user set --user-name <username> --password <password>
    ```

1. Configure local Git and copy the deployment url:

    ```azurecli
    az appservice web source-control config-local-git --name <app_name> --resource-group myResourceGroup --query url --output tsv
    ```

1. Add an Azure remote to your local Git repository:

    ```cli
    git remote add azure <paste-previous-command-output-here>
    ```

1. Push your code:

    ```azurecli
    git push azure master
    ```

1. Browse to the deployed web app:

    ```azurecli
    az appservice web browse --name <app_name> --resource-group myResourceGroup
    ```

This time, the page that displays the Hello World message is delivered by a web server running on App Service Web App.

**Congratulations!** You've deployed your first Node.js app to App Service Web App.

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Next steps

Explore pre-created [Web Apps CLI scripts](app-service-cli-samples.md).
