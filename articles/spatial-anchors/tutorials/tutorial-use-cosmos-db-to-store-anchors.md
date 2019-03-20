---
title: Tutorial - Sharing across sessions and devices with Azure Spatial Anchors and an Azure Cosmos DB back-end | Microsoft Docs
description: In this tutorial, you learn how to share Azure Spatial Anchor identifiers between Android/iOS devices in Unity with a back-end service and Azure Cosmos DB.
author: ramonarguelles
manager: vicenterivera
services: azure-spatial-anchors

ms.author: rgarcia
ms.date: 02/24/2019
ms.topic: tutorial
ms.service: azure-spatial-anchors
---
# Tutorial: Sharing across sessions and devices with Azure Spatial Anchors and an Azure Cosmos DB back-end

This tutorial will show you how to use [Azure Spatial Anchors](../overview.md) to:

1. Create anchors in one session and then locate them in another session on the same or different device. For example, on a different day.
2. Create anchors that can be located by multiple devices in the same place at the same time.

![Persistence](./media/persistence.gif)

[Azure Spatial Anchors](../overview.md) is a cross-platform developer service that allows you to create mixed reality experiences using objects that persist their location across devices over time. When you're finished, you'll have an app that can be deployed to two or more devices. Azure Spatial Anchors created by one instance will share their identifiers to the others using Cosmos DB.

You'll learn how to:

> [!div class="checklist"]
> * Deploy an ASP.NET Core Web App in Azure that can be used to share anchors, storing them in Cosmos DB.
> * Configure the AzureSpatialAnchorsLocalSharedDemo scene within the Unity Sample from our Quickstarts to take advantage of the Sharing Anchors Web App.
> * Deploy and run to one or more devices.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [Share Anchors Sample Prerequisites](../../../includes/spatial-anchors-share-sample-prereqs.md)]

It's worth noticing that, although you'll be using Unity and Azure Cosmos DB in this Tutorial, it is only to show an example on how to share Azure Spatial Anchor identifiers across other devices. You can use other languages and back-end technologies to achieve the same goal. Also, the ASP.NET Core Web App used in this Tutorial has a dependency on .NET Core 2.2 SDK. It runs fine on regular Azure Web Apps (for Windows), but will currently not work on Azure Web Apps for Linux.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Create a database account

[!INCLUDE [cosmos-db-create-dbaccount-table](../../../includes/cosmos-db-create-dbaccount-table.md)]

Take note of the `Connection String` as it will be used later on.

## Open the sample project in Unity

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

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

## Next steps

In this tutorial, you've used Azure Cosmos DB to share anchor identifiers across devices. To learn more about the Azure Spatial Anchors library, continue to our guide on how to create and locate anchors.

> [!div class="nextstepaction"]
> [Create and locate anchors using Azure Spatial Anchors](../create-locate-anchors-overview.md)
