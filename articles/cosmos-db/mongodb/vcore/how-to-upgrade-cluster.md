---
title: Upgrade a cluster
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Steps to upgrade Azure Cosmos DB for MongoDB vCore cluster from a lower version to latest version.
author: suvishodcitus
ms.author: suvishod
ms.reviewer: gahllevy
ms.service: azure-cosmos-db
ms.subservice: mongodb-vcore
ms.custom:
ms.topic: how-to
ms.date: 07/22/2024
---

# Upgrade a cluster in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb-vcore.md)]

Azure Cosmos DB for MongoDB vCore provide customers with a convenient self-service option to upgrade to the latest MongoDB version. This feature ensures a seamless upgrade path with just a click, allowing businesses to continue their operations without interruption.


## Prerequisites

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md).


## Upgrade a cluster

Here are the detailed steps to upgrade a cluster to latest version:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Go to the **Overview** blade of your Azure Cosmos DB for MongoDB vCore cluster and click the **Upgrade** button as illustrated below.

   :::image type="content" source="media/how-to-scale-cluster/upgrade-overview-page.png" alt-text="Screenshot of the overview page.":::

   > [!NOTE]
   > The upgrade button will stay disabled if you're already using the latest version.

3. A new window will appear on the right, allowing you to choose the MongoDB version you wish to upgrade to. Select the appropriate version and submit the upgrade request.

   :::image type="content" source="media/how-to-scale-cluster/upgrade-side-window.png" alt-text="Screenshot of server upgrade page.":::

## Next steps

In this guide, we'll learn more about point in time restore(PITR) on Azure Cosmos DB for MongoDB vCore.

> [!div class="nextstepaction"]
> [Restore cluster](how-to-restore-cluster.md)
