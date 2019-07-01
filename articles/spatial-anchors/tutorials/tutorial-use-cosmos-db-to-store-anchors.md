---
title: Tutorial - Share Azure Spatial Anchors across sessions and devices with an Azure Cosmos DB back end | Microsoft Docs
description: In this tutorial, you learn how to share Azure Spatial Anchors identifiers across Android/iOS devices in Unity with a back-end service and Azure Cosmos DB.
author: ramonarguelles
manager: vicenterivera
services: azure-spatial-anchors

ms.author: rgarcia
ms.date: 02/24/2019
ms.topic: tutorial
ms.service: azure-spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
#Customer intent: As a mixed reality developer, I want to learn how to share Azure Spatial Anchors identifiers among devices in Unity with a back-end service and Azure Cosmos DB.
---
# Tutorial: Share Azure Spatial Anchors across sessions and devices with an Azure Cosmos DB back end

In this tutorial, you'll learn how to use [Azure Spatial Anchors](../overview.md) to create anchors during one session and then locate them during another session, on the same device or on a different one. For example, the second session might be on a different day. These same anchors could also be located by multiple devices in the same place and at the same time.

![GIF illustrating object persistence](./media/persistence.gif)

[Azure Spatial Anchors](../overview.md) is a cross-platform developer service that you can use to create mixed reality experiences with objects that persist their location across devices over time. When you're finished, you'll have an app that can be deployed to two or more devices. Spatial anchors created by one instance will share their identifiers with the others by using Azure Cosmos DB.

You'll learn how to:

> [!div class="checklist"]
> * Deploy an ASP.NET Core web app in Azure that can be used to share anchors, storing them in Azure Cosmos DB.
> * Configure the AzureSpatialAnchorsLocalSharedDemo scene in the Unity sample from the Azure quickstarts to take advantage of the Sharing Anchors Web App.
> * Deploy an app to one or more devices and run it.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [Share Anchors Sample Prerequisites](../../../includes/spatial-anchors-share-sample-prereqs.md)]

It's worth noting that, though you'll be using Unity and Azure Cosmos DB in this tutorial, it's just to give you an example of how to share Spatial Anchors identifiers across devices. You can user other languages and back-end technologies to achieve the same goal. Also, the ASP.NET Core web app used in this tutorial requires the .NET Core 2.2 SDK. It runs fine on Web Apps for Windows, but it won't currently run on Web Apps for Linux.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Create a database account

[!INCLUDE [cosmos-db-create-dbaccount-table](../../../includes/cosmos-db-create-dbaccount-table.md)]

Copy the `Connection String` because you'll need it.

## Download the Unity sample project

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

## Deploy the sharing anchors service

Open Visual Studio, and the open the project in the `Sharing\SharingServiceSample` folder.

### Configure the service to use your Azure Cosmos DB database

In **Solution Explorer**, open `SharingService\Startup.cs`.

Locate `#define INMEMORY_DEMO` at the top of the file and comment that line out. Save the file.

In **Solution Explorer**, open `SharingService\appsettings.json`.

Locate the `StorageConnectionString` property, and set the value to be the same as the `Connection String` value that you copied in the [create a database account step](#create-a-database-account). Save the file.

[!INCLUDE [Publish Azure](../../../includes/spatial-anchors-publish-azure.md)]

[!INCLUDE [Run Share Anchors Sample](../../../includes/spatial-anchors-run-share-sample.md)]

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]

## Next steps

In this tutorial, you've used Azure Cosmos DB to share anchor identifiers across devices. To learn more about how to use Azure Spatial Anchors in a new Unity HoloLens app, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Starting a new Android app](./tutorial-new-unity-hololens-app.md)