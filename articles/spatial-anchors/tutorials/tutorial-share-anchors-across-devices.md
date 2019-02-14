---
title: Tutorial - Share Azure Spatial Anchors across devices, using the Unity sample app | Microsoft Docs
description: In this tutorial, you learn how to share Spatial Anchors across other devices, using the Unity sample app.
author: ramonarguelles
manager: vicenterivera
services: azure-spatial-anchors

ms.author: rgarcia
ms.date: 1/29/2019
ms.topic: tutorial
ms.service: azure-spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
#Customer intent: As a Mixed Reality developer, I want to learn how to share Azure Spatial Anchors I create across other devices, using the Unity sample app.
---
# Tutorial: Share Azure Spatial Anchors across devices, using the Unity sample app

This tutorial covers how to share [Azure Spatial Anchors](../overview.md) that you have created across other devices. Azure Spatial Anchors is a cross-platform developer service that allows you to create Mixed Reality experiences using objects that persist their location across devices over time. When you're finished, you'll have an app that can be deployed to two or more devices. Azure Spatial Anchors created by one instance can be shared to the others.

You'll learn how to:

> [!div class="checklist"]
> * Deploy an ASP.NET Core Web App in Azure that can be used to share anchors, storing them in memory for a duration of time.
> * Configure the AzureSpatialAnchorsLocalSharedDemo scene within the Unity Sample from our Quickstarts to take advantage of the Sharing Anchors Web App.
> * Deploy and run to one or more devices.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [Share Anchors Sample Prerequisites](../../../includes/spatial-anchors-share-sample-prereqs.md)]

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Deploy your Sharing Anchors Service

Open Visual Studio, and open the project at the `Sharing\SharingServiceSample` folder.

[!INCLUDE [Publish Azure](../../../includes/spatial-anchors-publish-azure.md)]

[!INCLUDE [Run Share Anchors Sample](../../../includes/spatial-anchors-run-share-sample.md)]

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]

## Next steps

In this tutorial, you've deployed an ASP.NET Core Web App in Azure, and then configured and deployed a Unity App. You created Spatial Anchors with the app, and shared them with other devices by using your ASP.NET Core Web App. To learn more about how to improve your ASP.NET Core Web App so that it uses Cosmos DB to store your shared Spatial Anchors, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Use Cosmos DB to Store Anchors](./tutorial-use-cosmos-db-to-store-anchors.md)
