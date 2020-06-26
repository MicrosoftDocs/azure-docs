---
title: Move an Azure Database for MySQL server to another Azure region using the Azure portal.
description: Move an Azure Database for MySQL server from one Azure region to another by using a read replica and the Azure portal.
author: ajlam
ms.service: mysql
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 06/26/2020
ms.author: andrela
---

# Move an Azure Database for MySQL server to another region by using the Azure portal

There are various scenarios for moving an existing Azure Database for MySQL server from one region to another. For example, you might want to move a production server to another region as part of your disaster recovery planning.

You can use an Azure Database for MySQL [read replica](concepts-read-replicas.md) to complete the move to another region. You can do this by creating a read replica in the destination region and then stopping replication to the read replica server, allowing it to become a standalone server that can accept both read and write traffic. 

## Prerequisites

- Make sure that your Azure Database for MySQL source server is in the Azure region that you want to move from.

- Verify that your Azure subscription allows you to create MySQL servers in the target region. To enable the required quota, contact support.

- Make sure that your subscription has enough resources to support the addition of MySQL servers for this process. For more information, see [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#networking-limits).

## Prepare for the move
In this section, you create a read replica server in the target region using the Azure portal. You then stop replication to the replica server. 

To create a read replica using the Azure portal, do the following:


1. Sign into the [Azure portal](https://portal.azure.com/).
1. Select the existing Azure Database for MySQL server that you want to use as the source server. This action opens the **Overview** page.
1. Select **Replication** from the menu, under **SETTINGS**.
1. Select **Add Replica**.
1. Enter a name for the replica server.
1. Select the location for the replica server. The default location is the same as the master server's. Verify that you have selected the target location where you want the replica to be deployed.
1. Select **OK** to confirm creation of the replica. Creating a read replica make take several minutes.

To stop replication to the replica, do the following: 

1. Once the replica has been created, locate your source server Azure Database for MySQL server. 
1. Select **Replication** from the menu, under **SETTINGS**.
1. Select the replica server.
1. Select **Stop replication**.
1. Confirm you want to stop replication by clicking **OK**.

## Clean up source server

You may want to delete the source Azure Database for MySQL server. To do so:
1. Select the Azure Database for MySQL server source server.
1. In the **Overview** window select **Delete**.
1. Select **Delete**.


## Next steps

In this tutorial, you moved an Azure Database for MySQL server from one region to another by using the Azure portal and then cleaned up the unneeded source resources. 

- Learn more about [read replicas](concepts-read-replicas.md)
- Learn more about [business continuity](concepts-business-continuity.md) options
