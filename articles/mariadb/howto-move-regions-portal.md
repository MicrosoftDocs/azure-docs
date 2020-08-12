---
title: Move Azure regions - Azure portal - Azure Database for MariaDB
description: Move an Azure Database for MariaDB server from one Azure region to another using a read replica and the Azure portal.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 06/29/2020
#As an Azure service administrator, I want to move my service resources to another Azure region
---

# Move an Azure Database for MariaDB server to another region by using the Azure portal

There are various scenarios for moving an existing Azure Database for MariaDB server from one region to another. For example, you might want to move a production server to another region as part of your disaster recovery planning.

You can use an Azure Database for MariaDB [cross-region read replica](concepts-read-replicas.md#cross-region-replication) to complete the move to another region. To do so, first create a read replica in the target region. Next, stop replication to the read replica server to make it a standalone server that accepts both read and write traffic. 

> [!NOTE]
> This article focuses on moving your server to a different region. If you want to move your server to a different resource group or subscription, refer to the [move](https://docs.microsoft.com/azure/azure-resource-manager/management/move-resource-group-and-subscription) article. 

## Prerequisites

- The read replica feature is only available for Azure Database for MariaDB servers in the General Purpose or Memory Optimized pricing tiers. Ensure the source server is in one of these pricing tiers.

- Make sure that your Azure Database for MariaDB source server is in the Azure region that you want to move from.

## Prepare to move

To create a cross-region read replica server in the target region using the Azure portal, use the following steps:

1. Sign into the [Azure portal](https://portal.azure.com/).
1. Select the existing Azure Database for MariaDB server that you want to use as the source server. This action opens the **Overview** page.
1. Select **Replication** from the menu, under **SETTINGS**.
1. Select **Add Replica**.
1. Enter a name for the replica server.
1. Select the location for the replica server. The default location is the same as the master server's. Verify that you've selected the target location where you want the replica to be deployed.
1. Select **OK** to confirm creation of the replica. During replica creation, data is copied from the source server to the replica. Create time may last several minutes or more, in proportion to the size of the source server.

>[!NOTE]
> When you create a replica, it doesn't inherit the VNet service endpoints of the master server. These rules must be set up independently for the replica.

## Move

> [!IMPORTANT]
> The standalone server can't be made into a replica again.
> Before you stop replication on a read replica, ensure the replica has all the data that you require.

Stopping replication to the replica server, causes it to become a standalone server. To stop replication to the replica from the Azure portal, use the following steps:

1. Once the replica has been created, locate and select your Azure Database for MariaDB source server. 
1. Select **Replication** from the menu, under **SETTINGS**.
1. Select the replica server.
1. Select **Stop replication**.
1. Confirm you want to stop replication by clicking **OK**.

## Clean up source server

You may want to delete the source Azure Database for MariaDB server. To do so, use the following steps:

1. Once the replica has been created, locate and select your Azure Database for MariaDB source server.
1. In the **Overview** window, select **Delete**.
1. Type in the name of the source server to confirm you want to delete.
1. Select **Delete**.

## Next steps

In this tutorial, you moved an Azure Database for MariaDB server from one region to another by using the Azure portal and then cleaned up the unneeded source resources. 

- Learn more about [read replicas](concepts-read-replicas.md)
- Learn more about [managing read replicas in the Azure portal](howto-read-replicas-portal.md)
- Learn more about [business continuity](concepts-business-continuity.md) options
