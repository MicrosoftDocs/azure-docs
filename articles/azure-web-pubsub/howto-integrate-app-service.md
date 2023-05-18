---
title: Integrate - build a real-time collaborative whiteboard using Azure Web PubSub and deploy it to Azure App Service
description: A how-to guide about how to use Azure Web PubSub to enable real-time collaboration on a digital whiteboard and deploy as a Web App using Azure App Service
author: KevinGuo
ms.author: kevinguo-ed
ms.service: azure-web-pubsub
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 05/17/2023
---

# How-to: build a real-time collaborative whiteboard using Azure Web PubSub and deploy it to Azure App Service

A new class of applications are re-imagining what modern work could be. While [Microsoft Word](https://www.microsoft.com/en-ww/microsoft-365/word) brings editors together, [Figma](https://www.figma.com) gathers up designers on the same creative endeavor. This class of applications builds on a user experience that makes us feel connected with our remote collaborators. From a technical point of view, user's activities need to be synchronized across users' screens at a low latency.

## Overview
In this how-to guide, we will take a cloud-native approach and leverage Azure services to build a real-time collaborative whiteboard and we will deploy the project as a Web App to Azure App Service. 


"GIF Missing - Finished project | Mobile and Browser"

### Architecture

|Azure service name | Purpose | Benefit   | 
|-------------------|-------------------|------------------|
|[Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/)  | Provides the hosting environment for backend application | Fully managed, with no need to worry about infrastructure where the code runs
|[Azure Web PubSub](https://learn.microsoft.com/en-us/azure/azure-web-pubsub/overview) | Provides low-latency, bi-directional data exchange channel between the backend application and clients | Frees server from managing persistent WebSocket connections and scales to 100K concurrent client connections with just one resource

"Image Missing - Architecture diagram Missing"

### Data flow
:::row:::
    :::column span="2":::
        1. The client, built with [Vue](https://vuejs.org/), makes an HTTP request for a Client Access Token to an endpoint `/negotiate`. The backend application is an [Express app](https://expressjs.com/) and hosted as a Web App using Azure App Service. {...Code link missing}
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/logo/web-pubsub-logo-large.png" alt-text="Azure Web PubsSub logo" lightbox="./media/logo/web-pubsub-logo-large.png":::
    :::column-end:::
:::row-end:::

:::row:::
    :::column span="2":::
        2. When the backend application successfully returns the Client Access Token to the connecting client, the client uses it to establish a WebSocket connection with Azure Web PubSub.  {...Code link missing}
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/logo/web-pubsub-logo-large.png" alt-text="Azure Web PubsSub logo" lightbox="./media/logo/web-pubsub-logo-large.png":::
    :::column-end:::
:::row-end:::

:::row:::
    :::column span="2":::
        3. If the handshake with Azure Web PubSub is successful, the client will be added to a group named `draw`, effectively subscribing to messages published to this group. Also, the client is given the permission to send messages to the `draw` group. {...Code link missing}
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/logo/web-pubsub-logo-large.png" alt-text="Azure Web PubsSub logo" lightbox="./media/logo/web-pubsub-logo-large.png":::
    :::column-end:::
:::row-end:::
> [!NOTE]
> To keep this how-to guide focused, all connecting clients are added to the same group named `draw` and is given the permission to send messages to this group. To manage client connections at a granular level, see the full references of the APIs provided by Azure Web PubSub. {...missing link}

:::row:::
    :::column span="2":::
        4. The backend application is notified by Azure Web PubSub that a client has connected and it handles the `onConnected` event by calling the `sendToAll()`, with a payload of the latest number of connected clients.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/logo/web-pubsub-logo-large.png" alt-text="Azure Web PubsSub logo" lightbox="./media/logo/web-pubsub-logo-large.png":::
    :::column-end:::
:::row-end:::
> [!NOTE]
> It is important to note that if there are a large number of online users in the `draw` group, with **a single** network call from the backend application, all the online users will be notified that a new user has just joined. This drastically reduces the complexity and load of the backend application.

:::row:::
    :::column span="2":::
        5. As soon as a client establishes a persistent connection with Web PubSub, it makes an HTTP request to the backend application to fetch the latest shape and background data at `/diagram`. This demonstrates how an HTTP service hosted on App Service can be combined with Web PubSub, App Service being a scalable and highly available HTTP service and Web PubSub taking care of real-time communication.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/logo/web-pubsub-logo-large.png" alt-text="Azure Web PubsSub logo" lightbox="./media/logo/web-pubsub-logo-large.png":::
    :::column-end:::
:::row-end:::

:::row:::
    :::column span="2":::
        6. Now that the clients and backend application have two ways to exchange data. One is the conventional HTTP request-response cycle and the other is the persistent, bi-directional channel through Web PubSub. The drawing activities *(editing vector shapes)*, which originate from one user and need to be immediately broadcasted to all users, is managed by the backend application and delivered through Web PubSub. {code missing}
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/logo/web-pubsub-logo-large.png" alt-text="Azure Web PubsSub logo" lightbox="./media/logo/web-pubsub-logo-large.png":::
    :::column-end:::
:::row-end:::

5. As soon as a client establishes a persistent connection with Web PubSub, it makes an HTTP request to the backend application to fetch the latest shape and background data at `/diagram`. This demonstrates how an HTTP service hosted on App Service can be combined with Web PubSub, App Service being a scalable and highly available HTTP service and Web PubSub taking care of real-time communication.


## Prerequisites
Now that we have understood the data flow and the respective responsibilities of App Service and Web PubSub, let us get practical. In order to follow the step-by-step guide, you will need

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
      --name whiteboard-app-group \
      --location "eastus2"
    ```

1. Create a Web PubSub resource.

    ```azurecli-interactive
    az webpubsub create \
      --name whiteboard \
      --resource-group whiteboard-app-group \
      --location "eastus2" \
      --sku Free_F1
    ```

1. Show and store the access key somewhere for later use.

    ```azurecli-interactive
    az webpubsub key show \
      --name whiteboard \
      --resource-group whiteboard-app-group
    ```

## Get the application code


## Create a Web App resource


## Configure upstream server to handle events coming from Web PubSub


## Deploy the application to App Service

## View the whiteboard app in a broswer


## Clean up resources
Although the application uses only the free tiers of both services, it is best practice to delete resources if you no longer need them. You can delete the resource group along with the resources in it using following command,

```azurecli-interactive
az group delete --name whiteboard-app-group
```

## Next steps
plug demo site


