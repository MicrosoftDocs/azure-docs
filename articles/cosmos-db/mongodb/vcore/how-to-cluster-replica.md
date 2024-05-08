---
title: Enable and work with cross-region replication
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Enable and disable cross-region replication, promote cluster replica in another region for disaser recovery (DR), and use the same connection strings in your application after promotion on Azure Cosmos DB for MongoDB vCore cluster.
author: niklarin
ms.author: nlarin
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
ms.date: 05/07/2024
---

# Scaling and configuring Your Azure Cosmos DB for MongoDB vCore cluster

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

> [!IMPORTANT]
> Cross-region replication in Azure Cosmos DB for MongoDB vCore is currently in preview.
> This preview version is provided without a service level agreement (SLA), and it's not recommended
> for production workloads. Certain features might not be supported or might have constrained
> capabilities.

Azure Cosmos DB for MongoDB vCore allows continuous data streaming to a replica cluster in another Azure region. That capability provides cross-region disaster recovery (DR) protection and read scalability across the regions. This document serves as a quick guide for developers who want to learn how to manage cross-region replication for their clusters.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).

## Enable cross-region replication
> [!NOTE]
> Cross-region replication is currently in preview. You should enable preview features 
> on Azure Cosmos DB for MongoDB vCore cluster at creation time to have access to 
> cross-region replication and other preview features.

1. Follow the steps to [create a new Azure Cosmos DB for MongoDB vCore cluster](./quickstart-portal.md#create-a-cluster).
1. On the **Basics** tab, select **Enable preview features** flag.
1. Once cluster is created, on the cluster sidebar, under **Settings**, select **Global distribution**.
1. Select **Add replica** and select a region for cluster replica to be created in.
1. Verify your selection and select **Save** to confirm your selection.

## Promote a replica
To [promote a cluster replica](./cross-region-replication.md#replica-cluster-promotion) to a read-write cluster, follow these steps:

1. Select the cluster replica you would like to promote in the portal.
1. On the cluster sidebar, under **Settings**, select **Global distribution**.
1. On the **Global distribution** page, select **Promote**. 
1. On the **Promote \<cluster name>** screen, double check the cluster replica's name, read the warning text, and select **Promote**.

After the cluster replica is promoted, it becomes a readable and writable cluster.

## Check cluster replication role and replication region
To check replication role of a cluster, follow these steps:
1. Select an existing Azure Cosmos DB for MongoDB vCore cluster.
1. Select **Overview** page.
1. Check **Read region** (on the primary cluster) or **Write region** (on the replica cluster) value.

If **Read region** value is *Not enabled*, this cluster has cross-region replication disabled.

## Disable cross-region replication
To disable cross-region replication, follow these steps:

1. Select the Azure Cosmos DB for MongoDB vCore *replica* cluster.
1. Select **Overview** blade.
1. [Confirm that it's a replica cluster](#check-cluster-replication-role-and-replication-region).
1. In the Azure portal, on the **Overview** page for the replica cluster, select **Delete**.
1. On the **Delete \<replica name>** screen, read the warning text, and enter cluster's name in the **Confirm the account name** field.
1. Select **Delete** to confirm deletion of the replica.

## Connect to replica
You can connect to the cluster replica by using read-only connection string, as you would on a regular read-write cluster. Follow these steps to get [the read-write connection string for the primary and read-only connection string for the cluster replica](./cross-region-replication.md#read-operations-on-cluster-replicas-and-connection-strings):

1. Select the primary cluster or its cluster replica in the portal.
1. On the cluster sidebar, under **Settings**, select **Connection strings**.
1. Copy the read-write connection string for connections to the primary cluster.
1. Copy the read-only connection string for connections to the cluster replica.

Connection strings are preserved after [the cluster replica promotion](./cross-region-replication.md#replica-cluster-promotion).

## Next steps

- [Learn more about cross-region replication in Azure Cosmos DB for MongoDB vCore](./cross-region-replication.md)
- [Learn about reliability in Azure Cosmos DB for MongoDB vCore](../../../reliability/reliability-cosmos-mongodb.md)
