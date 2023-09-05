---
title: Integrate - Build a real-time collaborative whiteboard using Web PubSub for Socket.IO and deploy it to Azure App Service
description: A how-to guide about how to use Web PubSub for Socket.IO to enable real-time collaboration on a digital whiteboard and deploy as a Web App using Azure App Service
keywords: Socket.IO, Socket.IO on Azure, webapp Socket.IO, Socket.IO integration
author: zackliu
ms.author: chenyl
ms.service: azure-web-pubsub
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 09/5/2023
---
# How-to: build a real-time collaborative whiteboard using Web PubSub for Socket.IO and deploy it to Azure App Service

A new class of applications is reimagining what modern work could be. While [Microsoft Word](https://www.microsoft.com/microsoft-365/word) brings editors together, [Figma](https://www.figma.com) gathers up designers on the same creative endeavor. This class of applications builds on a user experience that makes us feel connected with our remote collaborators. From a technical point of view, user's activities need to be synchronized across users' screens at a low latency.

## Overview
In this how-to guide, we take a cloud-native approach and use Azure services to build a real-time collaborative whiteboard and we deploy the project as a Web App to Azure App Service. The whiteboard app is accessible in the browser and allows anyone can draw on the same canvas.

### Architecture

|Azure service name    | Purpose           | Benefits         | 
|----------------------|-------------------|------------------|
|[Azure App Service](https://learn.microsoft.com/azure/app-service/)  | Provides the hosting environment for the backend application, which is built with [Express](https://expressjs.com/) | Fully managed environment for application backends, with no need to worry about infrastructure where the code runs 
|[Web PubSub for Socket.IO](./socketio-overview.md) | Provides low-latency, bi-directional data exchange channel between the backend application and clients | Drastically reduces server load by freeing server from managing Socket.IO clients and scales to 100 K concurrent client connections with just one resource

:::image type="content" source="./media/howto-integrate-app-service/architecture.jpg" alt-text="Architecture diagram of the collaborative whiteboard app.":::

## Prerequisites
You can find detailed explanation of the [data flow](#data-flow) at the end of this how-to guide as we're going to focus on building and deploying the whiteboard app first.
 
In order to follow the step-by-step guide, you need
> [!div class="checklist"]
> * An [Azure](https://portal.azure.com/) account. If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
> * [Azure CLI](/cli/azure/install-azure-cli) (version 2.39.0 or higher) or [Azure Cloud Shell](../cloud-shell/quickstart.md) to manage Azure resources.

## Create Azure resources using Azure CLI
### 1. Sign in
1. Sign in to Azure CLI by running the following command.
    ```azurecli-interactive
    az login
    ```

1. Create a resource group on Azure.
    ```azurecli-interactive
    az group create \
      --location "westus" \  
      --name "whiteboard-group"
    ```

### 2. Create a Web App resource
1. Create a free App Service plan.
    ```azurecli-interactive
    az appservice plan create \ 
      --resource-group "whiteboard-group" \ 
      --name "demo" \ 
      --sku FREE
      --is-linux
    ```

1. Create a Web App resource 
    ```azurecli-interactive
    az webapp create \
      --resource-group "whiteboard-group" \
      --name "whiteboard-app" \ 
      --plan "demo" \
      --runtime "NODE:18-lts"
    ```

### 3. Create a Web PubSub for Socket.IO
1. Create a Web PubSub resource.
    ```azurecli-interactive
    az webpubsub create \
      --name "whiteboard-app" \
      --resource-group "whiteboard-group" \
      --kind SocketIO
      --sku Premium_P1
    ```

1. Show and store the value of `primaryConnectionString` somewhere for later use.
    ```azurecli-interactive
    az webpubsub key show \
      --name "whiteboard-app" \
      --resource-group "whiteboard-group"
    ```
---

