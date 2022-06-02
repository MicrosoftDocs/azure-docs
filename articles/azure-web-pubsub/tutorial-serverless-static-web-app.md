---
title: Tutorial - Create a serverless chat app using Azure Web PubSub service and Azure Static Web Apps
description: A tutorial for how to use Azure Web PubSub service and Azure Static Web Apps to build a serverless chat application.
author: JialinXin
ms.author: jixin
ms.service: azure-web-pubsub
ms.topic: tutorial
ms.date: 06/01/2022
---

# Tutorial: Create a serverless chat app using Azure Web PubSub service and Azure Static Web Apps

The Azure Web PubSub service helps you build real-time messaging web applications using WebSockets. And with Azure Static Web Apps, you can automatically build and deploy full stack web apps to Azure from a code repository conveniently. In this tutorial, you learn how to use Azure Web PubSub service and Azure Static Web Apps to build a serverless real-time messaging application under chat room scenario.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Build a serverless chat app
> * Work with Web PubSub function input and output bindings
> * Work with Static Web Apps

## Overview

:::image type="content" source="media/tutorial-serverless-static-web-app/tutorial-serverless-static-web-app.png" alt-text="Diagram showing Azure Web PubSub work with Static Web App." border="false":::

* GitHub along with DevOps provide source control and continuous delivery. So whenever there's code change to the source repo, Azure DevOps pipeline will soon apply it to Azure Static Web App and present to endpoint user.
* When a new user is login, Functions `login` API will be triggered and generate Azure Web PubSub service client connection url.
* When client init the connection request to Azure Web PubSub service, service will send a system `connect` event and Functions `connect` API will be triggered to auth the user.
* When client send message to Azure Web PubSub service, service will send a user `message` event and Functions `message` API will be triggered and broadcast the message to all the connected clients.
* Functions `validate` API will be triggered periodically for [CloudEvents Abuse Protection](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#4-abuse-protection) purpose, when the events in Azure Web PubSub are configured with predefined parameter `{event}`, that is, https://$STATIC_WEB_APP/api/{event}.

> [!NOTE]
> Functions APIs `connect` and `message` will be triggered when Azure Web PubSub service is configured with these 2 events.

## Prerequisites

* [GitHub](https://github.com/) account
* [Azure](https://portal.azure.com/) account
* [Azure CLI](/cli/azure) (version 2.29.0 or higher) or [Azure Cloud Shell](../cloud-shell/quickstart.md) to manage Azure resources

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
    Replace the placeholder `<YOUR_AWPS_ACCESS_KEY>` from previous result `primaryConnectionString`.

## Create a repository

This article uses a GitHub template repository to make it easy for you to get started. The template features a starter app used to deploy using Azure Static Web Apps.

1. Navigate to the following template to create a new repository under your repo:
    1. [https://github.com/Azure/awps-swa-sample/generate](https://github.com/login?return_to=/Azure/awps-swa-sample/generate)
1. Name your repository **my-awps-swa-app**

Select **`Create repository from template`**.

## Create a static web app

Now that the repository is created, you can create a static web app from the Azure CLI.

1. Create a variable to hold your GitHub user name.

    ```azurecli-interactive
    GITHUB_USER_NAME=<YOUR_GITHUB_USER_NAME>
    ```

    Replace the placeholder `<YOUR_GITHUB_USER_NAME>` with your GitHub user name.

1. Create a new static web app from your repository. As you execute this command, the CLI starts GitHub interactive login experience. Following the message to complete authorization.

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

1. Navigate to **https://github.com/login/device**.

1. Enter the user code as displayed your console's message.

1. Select the **Continue** button.

1. Select the **Authorize AzureAppServiceCLI** button.

1. Configure the static web app settings.

    ```azurecli-interactive
    az staticwebapp appsettings set \
      -n my-awps-swa-app \
      --setting-names WebPubSubConnectionString=$AWPS_ACCESS_KEY WebPubSubHub=sample_swa
    ```

## View the website

There are two aspects to deploying a static app. The first operation creates the underlying Azure resources that make up your app. The second is a GitHub Actions workflow that builds and publishes your application.

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

    Once the success icon appears, the workflow is complete and you can return back to your console window.

2. Run the following command to query for your website's URL.

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

Now you're very close to complete. The last step is to configure Web PubSub transfer client requests to your function APIs. 

1. Run command to configure Web PubSub service events. It's mapping to some functions under the `api` folder in your repo.

    ```azurecli-interactive
    az webpubsub hub create \
      -n "my-awps-swa" \
      -g "my-awps-swa-group" \
      --hub-name "sample_swa" \
      --event-handler url-template=https://$STATIC_WEB_APP/api/{event} user-event-pattern="*" \
      --event-handler url-template=https://$STATIC_WEB_APP/api/{event} system-event="connect"
    ```

Now you're ready to play with your website **<YOUR_STATIC_WEB_APP>**. Copy it to browser and click continue to start chatting with your friends.

## Clean up resources

If you're not going to continue to use this application, you can delete the resource group and the static web app by running the following command.

```azurecli-interactive
az group delete --name my-awps-swa-group
```

## Next steps

In this quickstart, you learned how to run a serverless chat application. Now, you could start to build your own application. 

> [!div class="nextstepaction"]
> [Tutorial: Client streaming using subprotocol](tutorial-subprotocol.md)

> [!div class="nextstepaction"]
> [Azure Web PubSub bindings for Azure Functions](reference-functions-bindings.md)

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://github.com/Azure/azure-webpubsub/tree/main/samples)
