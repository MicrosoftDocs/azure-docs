---
title: 'Tutorial: Share anchors with Azure Cosmos DB'
description: In this tutorial, you learn how to share Azure Spatial Anchors identifiers across Android/iOS devices in Unity with a back-end service and Azure Cosmos DB.
author: pamistel
manager: MehranAzimi-msft
services: azure-spatial-anchors

ms.author: pamistel
ms.date: 11/20/2020
ms.topic: tutorial
ms.service: azure-spatial-anchors
ms.custom: ignite-2022
---
# Tutorial: Sharing Azure Spatial Anchors across sessions and devices with an Azure Cosmos DB back end

This tutorial is a continuation of [sharing Azure Spatial Anchors across sessions and devices.](../../../articles/spatial-anchors/tutorials/tutorial-share-anchors-across-devices.md) It will guide you through the process of adding a few more capabilities to make Azure Cosmos DB serve as the back-end storage while sharing Azure spatial anchors across sessions and devices.

![GIF illustrating object persistence](./media/persistence.gif)

It's worth noting that, though you'll be using Unity and Azure Cosmos DB in this tutorial, it's just to give you an example of how to share Spatial Anchors identifiers across devices. You can user other languages and back-end technologies to achieve the same goal.

## Create a database account

Add an Azure Cosmos DB database to the resource group you created earlier.

[!INCLUDE [cosmos-db-create-dbaccount-table](../../cosmos-db/includes/cosmos-db-create-dbaccount-table.md)]

Copy the `Connection String` because you'll need it.

## Make minor changes to the SharingService files

In **Solution Explorer**, open `SharingService\Startup.cs`.

Locate `#define INMEMORY_DEMO` at the top of the file and comment that line out. Save the file.

In **Solution Explorer**, open `SharingService\appsettings.json`.

Locate the `StorageConnectionString` property, and set the value to be the same as the `Connection String` value that you copied in the [create a database account step](#create-a-database-account). Save the file.

You can publish the Sharing Service again and run the sample app.

## Next steps

In this tutorial, you've used Azure Cosmos DB to share anchor identifiers across devices. To learn more about how to use Azure Spatial Anchors in a new Unity HoloLens app, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Starting a new Unity HoloLens app](./tutorial-new-unity-hololens-app.md)
