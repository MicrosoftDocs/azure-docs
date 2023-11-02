---
title: Integrate - Create a chat app using Azure Web PubSub and deploy to Azure Static Web Apps
description: A tutorial about how to use Azure Web PubSub service and Azure Static Web Apps to build a serverless chat application.
author: JialinXin
ms.author: jixin
ms.service: azure-web-pubsub
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 05/16/2022
---

# Tutorial: Create a serverless chat app with Azure Web PubSub service and Azure Static Web Apps

Azure Web PubSub helps you build real-time messaging web applications using WebSocket. Azure Static Web Apps helps you build and deploy full-stack web apps automatically to Azure from a code repository. In this tutorial, you learn how to use Web PubSub and Static Web Apps together to build a real-time chat room application.  

More specifically,  you learn how to:

> [!div class="checklist"]
> * Build a serverless chat app
> * Work with Web PubSub function input and output bindings
> * Work with Static Web Apps

## Overview

:::image type="content" source="media/tutorial-serverless-static-web-app/tutorial-serverless-static-web-app.png" alt-text="Diagram showing how Azure Web PubSub works with Azure Static Web Apps." border="false":::

GitHub or Azure Repos provide source control for Static Web Apps. Azure monitors the repo branch you select, and every time there's a code change to the source repo a new build of your web app is automatically run and deployed to Azure. Continuous delivery is provided by GitHub Actions and Azure Pipelines. Static Web Apps detects the new build and presents it to the endpoint user. 

The sample chat room application provided with this tutorial has the following workflow.

1. When a user signs in to the app, the Azure Functions `login` API is triggered to generate a Web PubSub service client connection URL.
1. When the client initializes the connection request to Web PubSub, the service sends a system `connect` event that triggers the Functions `connect` API to authenticate the user.
1. When a client sends a message to Azure Web PubSub service, the service responds with a user `message` event and the Functions `message` API is triggered to broadcast, the message to all the connected clients.
1. The Functions `validate` API is triggered periodically for [CloudEvents Abuse Protection](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#4-abuse-protection) when the events in Azure Web PubSub are configured with predefined parameter `{event}`, that is, https://$STATIC_WEB_APP/api/{event}.

> [!NOTE]
> The Functions APIs `connect` and `message` are triggered when Azure Web PubSub service is configured with these two events.

## Prerequisites

* A [GitHub](https://github.com/) account.
* An [Azure](https://portal.azure.com/) account. If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
* [Azure CLI](/cli/azure/install-azure-cli) (version 2.29.0 or higher) or [Azure Cloud Shell](../cloud-shell/quickstart.md) to manage Azure resources.

## Create a Web PubSub resource

1. Sign in to the Azure CLI by using the following command.

    ```azurecli-interactive
    az login
    ```

1. Create a resource group.

    ```azurecli-interactive
    az group create \
      --name my-awps-swa-group \
      --location "eastus2"
    ```

1. Create a Web PubSub resource.

    ```azurecli-interactive
    az webpubsub create \
      --name my-awps-swa \
      --resource-group my-awps-swa-group \
      --location "eastus2" \
      --sku Free_F1
    ```

1. Get and hold the access key for later use.

    ```azurecli-interactive
    az webpubsub key show \
      --name my-awps-swa \
      --resource-group my-awps-swa-group
    ```

    ```azurecli-interactive
    AWPS_ACCESS_KEY=<YOUR_AWPS_ACCESS_KEY>
    ```

    Replace the placeholder `<YOUR_AWPS_ACCESS_KEY>` with the value for `primaryConnectionString` from the previous step.

## Create a repository

This article uses a GitHub template repository to make it easy for you to get started. The template features a starter app that you deploy to Azure Static Web Apps.

1. Go to [https://github.com/Azure/awps-swa-sample/generate](https://github.com/login?return_to=/Azure/awps-swa-sample/generate) to create a new repo for this tutorial.
1. Select yourself as **Owner** and name your repository **my-awps-swa-app**.
1. You can create a **Public** or **Private** repo according to your preference. Both work for the tutorial.
1. Select **Create repository from template**.

## Create a static web app

Now that the repository is created, you can create a static web app from the Azure CLI.

1. Create a variable to hold your GitHub user name.

    ```azurecli-interactive
    GITHUB_USER_NAME=<YOUR_GITHUB_USER_NAME>
    ```

    Replace the placeholder `<YOUR_GITHUB_USER_NAME>` with your GitHub user name.

1. Create a new static web app from your repository. When you run this command, the CLI starts a GitHub interactive sign-in. Follow the message to complete authorization.

    ```azurecli-interactive
    az staticwebapp create \
        --name my-awps-swa-app \
        --resource-group my-awps-swa-group \
        --source https://github.com/$GITHUB_USER_NAME/my-awps-swa-app \
        --location "eastus2" \
        --branch main \
        --app-location "src" \
        --api-location "api" \
        --login-with-github
    ```

    > [!IMPORTANT]
    > The URL passed to the `--source` parameter must not include the `.git` suffix.

1. Go to **https://github.com/login/device**.

1. Enter the user code as displayed your console's message.

1. Select **Continue**.

1. Select **Authorize AzureAppServiceCLI**.

1. Configure the static web app settings.

    ```azurecli-interactive
    az staticwebapp appsettings set \
      -n my-awps-swa-app \
      --setting-names WebPubSubConnectionString=$AWPS_ACCESS_KEY WebPubSubHub=sample_swa
    ```

## View the website

There are two aspects to deploying a static app: The first creates the underlying Azure resources that make up your app. The second is a GitHub Actions workflow that builds and publishes your application.

Before you can navigate to your new static site, the deployment build must first finish running.

1. Return to your console window and run the following command to list the URLs associated with your app.

    ```azurecli-interactive
    az staticwebapp show \
      --name  my-awps-swa-app \
      --query "repositoryUrl"
    ```

    The output of this command returns the URL to your GitHub repository.

1. Copy the **repository URL** and paste it into the browser.

1. Select the **Actions** tab.

    At this point, Azure is creating the resources to support your static web app. Wait until the icon next to the running workflow turns into a check mark with green background ✅. This operation may take a few minutes to complete.

    Once the success icon appears, the workflow is complete and you can return to your console window.

1. Run the following command to query for your website's URL.

    ```azurecli-interactive
    az staticwebapp show \
      --name my-awps-swa-app \
      --query "defaultHostname"
    ```

    Hold the url to set in the Web PubSub event handler.

    ```azurecli-interactive
    STATIC_WEB_APP=<YOUR_STATIC_WEB_APP>
    ```

## Configure the Web PubSub event handler

You're very close to complete. The last step is to configure Web PubSub so that client requests are transferred to your function APIs.

1. Run the following command to configure Web PubSub service events. It maps functions under the `api` folder in your repo to the Web PubSub event handler.

    ```azurecli-interactive
    az webpubsub hub create \
      -n "my-awps-swa" \
      -g "my-awps-swa-group" \
      --hub-name "sample_swa" \
      --event-handler url-template=https://$STATIC_WEB_APP/api/{event} user-event-pattern="*" system-event="connect"
    ```

Now you're ready to play with your website **<YOUR_STATIC_WEB_APP>**. Copy it to browser and select **Continue** to start chatting with your friends.

## Clean up resources

If you're not going to continue to use this application, you can delete the resource group and the static web app by running the following command.

```azurecli-interactive
az group delete --name my-awps-swa-group
```

## Next steps

In this quickstart, you learned how to develop and deploy a serverless chat application. Now, you can start building your own application.

> [!div class="nextstepaction"]
> [Have fun with playable demos](https://azure.github.io/azure-webpubsub/)

> [!div class="nextstepaction"]
> [Azure Web PubSub bindings for Azure Functions](reference-functions-bindings.md)


