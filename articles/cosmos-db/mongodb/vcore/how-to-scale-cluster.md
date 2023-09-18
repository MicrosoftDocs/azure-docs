---
title: Scale or configure a cluster
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Scale an Azure Cosmos DB for MongoDB vCore cluster by changing the tier and disk size or change the configuration by enabling high availability.
author: gahl-levy
ms.author: gahllevy
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
ms.date: 08/28/2023
---

# Scaling and configuring Your Azure Cosmos DB for MongoDB vCore cluster

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Azure Cosmos DB for MongoDB vCore provides seamless scalability and high availability. This document serves as a quick guide for developers who want to learn how to scale and configure their clusters. When changes are made, they're performed live to the cluster without downtime.

## Prerequisites

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md).

## Navigate to the scale section

To change the configuration of your cluster, use the **Scale** section of the Azure Cosmos DB for MongoDB vCore cluster page in the Azure portal. The portal includes real-time costs for these changes.

> [!TIP]
> For this guide, we recommend using the resource group name ``msdocs-cosmos-howto-rg``.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the existing Azure Cosmos DB for MongoDB vCore cluster page.

1. From the Azure Cosmos DB for MongoDB vCore cluster page, select the **Scale** navigation menu option.

   :::image type="content" source="media/how-to-scale-cluster/select-scale-option.png" lightbox="media/how-to-scale-cluster/select-scale-option.png" alt-text="Screenshot of the Scale option on the page for an Azure Cosmos DB for MongoDB vCore cluster.":::

## Change the cluster tier

The cluster tier you select influences the amount of vCores and RAM assigned to your cluster. You can change the cluster tier to suit your needs at any time without downtime. For example, you can increase from **M50** to **M60** or decrease **M50** to **M40** using the Azure portal.

1. To change the cluster tier, select the new tier from the drop-down menu.

   :::image type="content" source="media/how-to-scale-cluster/configure-tier.png" alt-text="Screenshot of the cluster tier option in the Scale page of a cluster.":::

    > [!NOTE]
    > This change is performed live to the cluster without downtime.

1. Select **Save** to persist your change.

## Increase disk size

You can increase the storage size to give your database more room to grow. For example, you can increase the storage from **128 GB** to **256 GB**.

1. To increase the storage size, select the new size from the drop-down menu.

   :::image type="content" source="media/how-to-scale-cluster/configure-storage.png" alt-text="Screenshot of the storage per node option in the Scale page of a cluster.":::

    > [!NOTE]
    > This change is performed live to the cluster without downtime. Also, storage size can only be increased, not decreased.

1. Select **Save** to persist your change.

## Enable or disable high availability

You can enable or disable high availability (HA) to suit your needs. HA avoids database downtime by maintaining replica nodes of every primary node in a cluster. If a primary node goes down, incoming connections are automatically redirected to its replica node, ensuring that there's minimal downtime.

1. To enable or disable HA, toggle the checkbox option.

   :::image type="content" source="media/how-to-scale-cluster/configure-high-availability.png" alt-text="Screenshot of the high availability checkbox in the Scale page of a cluster.":::

1. Select **Save** to persist your change.

## Next steps

In this guide, we've shown that scaling and configuring your Cosmos DB for MongoDB vCore cluster in the Azure portal is a straightforward process. The Azure portal includes the ability to adjust the cluster tier, increase storage size, and enable or disable high availability without any downtime.

> [!div class="nextstepaction"]
> [Restore a Azure Cosmos DB for MongoDB vCore cluster](how-to-restore-cluster.md)
