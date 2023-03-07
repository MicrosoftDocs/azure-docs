---
title: Scale or configure a cluster
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Scale an Azure Cosmos DB for MongoDB vCore cluster by changing the tier and disk size or change the configuration by enabling high availability.
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
author: gahl-levy
ms.author: gahllevy
ms.reviewer: nayakshweta
ms.date: 02/07/2023
---

# Scaling and configuring Your Azure Cosmos DB for MongoDB vCore cluster

Azure Cosmos DB for MongoDB vCore provides seamless scalability and high availability. This document serves as a quick guide for developers who want to learn how to scale and configure their clusters. When changes are made, they're performed live to the cluster without downtime.

## Azure portal

To change the configuration of your cluster, go to the Scale section in the Azure Cosmos DB for MongoDB vCore portal. The Azure portal includes real-time costs for these changes.

### Change the Cluster Tier

You can change the cluster tier (vCore, RAM) up or down to suit your needs. For example, you can go from M50 to M60 or M50 to M40. To change the cluster tier, select the new tier from the drop-down menu and select Save. The change is performed live to the cluster without downtime.

### Increase Disk Size

You can increase the storage size to give your database more room to grow. For example, you can increase the storage from 128 GB to 256 GB. It's important to note that storage size can only be increased, not decreased. To increase the storage size, select the new size from the drop-down menu and select Save. The change is performed live to the cluster without downtime.

### Enable or Disable High Availability

You can enable or disable high availability (HA) to suit your needs. HA avoids database downtime by maintaining replica nodes of every primary node in a cluster. If a primary node goes down, incoming connections are automatically redirected to its replica node, ensuring that there's minimal downtime. To enable or disable HA, toggle the switch in the Scale section of the portal.

## Next steps

In this guide, we've shown that scaling and configuring your Cosmos DB for MongoDB vCore cluster in the Azure portal is a straightforward process. The Azure portal includes the ability to adjust the cluster tier, increase storage size, and enable or disable high availability without any downtime.

> [!div class="nextstepaction"]
> [Restore a Azure Cosmos DB for MongoDB vCore cluster](how-to-restore-cluster.md)
