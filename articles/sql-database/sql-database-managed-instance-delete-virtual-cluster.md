---
title: Delete VNet after deleting Azure SQL Database managed instance | Microsoft Docs
description: Learn how to delete VNet after deleting Azure SQL Database managed instance. 
services: sql-database
ms.service: sql-database
ms.subservice: management
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: danimir
ms.author: danil
ms.reviewer: douglas, carlrab, sstein
manager: craigg
ms.date: 05/07/2019
---
# Delete subnet after deleting Azure SQL Database managed instance

This article provides guidelines on how to manually delete subnet after deleting the last Azure SQL Database managed instance residing in it.

The [virtual cluster](sql-database-managed-instance-connectivity-architecture.md#virtual-cluster-connectivity-architecture) that has contained the deleted managed instance will be kept for 12 hours from the instance deletion. The virtual cluster is kept alive by design to enable faster creation of managed instances in the same subnet. Keeping an empty virtual cluster is free of charge. During this period, the subnet associated with the virtual cluster can't be deleted.

Immediate release of the subnet used by an empty virtual cluster is possible through manual deletion of the virtual cluster. Deletion of the virtual cluster can be achieved through Azure portal or virtual clusters API.

> [!NOTE]
> The virtual cluster should contain no managed instances for the deletion to be successful.

## Delete virtual cluster from Azure portal

To delete a virtual cluster using Azure portal, search for the virtual cluster resources using the built-in search.

![Search for virtual cluster.](./media/sql-database-managed-instance-delete-virtual-cluster/virtual-clusters-search.png)

Once you locate the virtual cluster you want to delete, select this resource and select the Delete option. You will be prompted to confirm the virtual cluster deletion.

![Delete virtual cluster.](./media/sql-database-managed-instance-delete-virtual-cluster/virtual-clusters-delete.png)

Confirmation that the virtual cluster was deleted is provided in Azure portal notifications. Successful deletion of the virtual cluster immediately releases the subnet for further reuse.

## Delete virtual cluster using API

To delete a virtual cluster through API use the URI parameters specified in the [virtual clusters delete method](https://docs.microsoft.com/rest/api/sql/virtualclusters/delete).

## Next steps

- For an overview, see [What is a Managed Instance?](sql-database-managed-instance.md).
- Learn about [connectivity architecture in Managed Instance](sql-database-managed-instance-connectivity-architecture.md).
- Learn how to [modify an existing virtual network for Managed Instance](sql-database-managed-instance-configure-vnet-subnet.md).
- For a tutorial that shows how to create a virtual network, create a Managed Instance, and restore a database from a database backup, see [Create an Azure SQL Database Managed Instance](sql-database-managed-instance-get-started.md).
- For DNS issues, see [Configuring a custom DNS](sql-database-managed-instance-custom-dns.md).
