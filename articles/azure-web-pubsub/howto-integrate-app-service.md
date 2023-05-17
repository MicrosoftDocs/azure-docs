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
> To keep this how-to guide focused, all connecting clients are added to the same `draw` group and is allowed to send messages to the group. Azure Web PubSub offers APIs for managing client connections at a granular level.

:::row:::
    :::column span="2":::
        4. The backend application is notified by Azure Web PubSub that a client has connected and it handles the `onConnected` event by calling the `sendToAll` provided by Azure Web PubSub
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/logo/web-pubsub-logo-large.png" alt-text="Azure Web PubsSub logo" lightbox="./media/logo/web-pubsub-logo-large.png":::
    :::column-end:::
:::row-end:::


## Prerequisites

* A [GitHub](https://github.com/) account.
* An [Azure](https://portal.azure.com/) account. If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
* [Azure CLI](/cli/azure/install-azure-cli) (version 2.29.0 or higher) or [Azure Cloud Shell](../cloud-shell/quickstart.md) to manage Azure resources.



