---
title: Tutorial - Use Cosmos DB to Store Azure Spatial Anchors | Microsoft Docs
description: In this tutorial, you learn how to use CosmosDB to store your Spatial Anchors.
author: ramonarguelles
manager: vicenterivera
services: azure-spatial-anchors

ms.author: rgarcia
ms.date: 1/30/2019
ms.topic: tutorial
ms.service: azure-spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
#Customer intent: As a Mixed Reality developer, I want to learn how to use Cosmos DB to store Spatial Anchors to be able to share them across other devices.
---
# Tutorial: Use Cosmos DB to Store Anchors

[Spatial Anchors](../overview.md) is a cross-platform developer service that allows you to create Mixed Reality experiences
using objects that persist their location across devices over time. This tutorial shows how to use an Azure Cosmos DB to store anchors to be shared across other devices. When you're finished, you'll have an app that can be deployed to two or more devices. Spatial Anchors created by one instance can be shared to the others using Cosmos DB.

You'll learn how to:

> [!div class="checklist"]
> * Deploy an ASP.NET Core Web App in Azure that can be used to share anchors, storing them in Cosmos DB.
> * Configure the AzureSpatialAnchorsLocalSharedDemo scene within the Unity Sample from our Quickstarts to take advantage of the Sharing Anchors Web App.
> * Deploy and run to one or more devices.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [Share Anchors Sample Prerequisites](../../../includes/spatial-anchors-share-sample-prereqs.md)]

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Create a database account

[!INCLUDE [cosmos-db-create-dbaccount-table](../../../includes/cosmos-db-create-dbaccount-table.md)]

Take note of the `Connection String` as it will be used later on.

## Deploy your Sharing Anchors Service

Open Visual Studio, and open the project at the `Sharing\SharingServiceSample` folder.

### Configure the service so that it uses your Cosmos DB

In the **Solution Explorer**, open `SharingService\Startup.cs`.

Locate the `#define INMEMORY_DEMO` line at the top of the file and comment it out. Save the file.

In the **Solution Explorer**, open `SharingService\appsettings.json`.

Locate the `StorageConnectionString` property, and set the value to be the `Connection String` that you took note of in the [create a database account step](#create-a-database-account). Save the file.

[!INCLUDE [Publish Azure](../../../includes/spatial-anchors-publish-azure.md)]

[!INCLUDE [Run Share Anchors Sample](../../../includes/spatial-anchors-run-share-sample.md)]

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]
