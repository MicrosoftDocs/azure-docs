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
# Delete VNet after deleting Azure SQL Database managed instance

This article provides guidelines to manually delete VNet after deleting the last Azure SQL Database managed instance in the same VNet.

Once the last managed instance is deleted using the same VNet, the virtual cluster containing managed instances will be kept for the next 12 hours. The virtual cluster is kept alive by design to enable faster creation of managed instances in the same VNet. In this period, the VNet is locked from being deleted and can't be reused.

Deleting the virtual cluster used by the VNet will release this network resource for further usage. Manual deletion of the virtual cluster is achieved through Azure portal or [virtual cluster API](https://docs.microsoft.com/rest/api/sql/virtualclusters). The virtual cluster should not contain any managed instance for the deletion to be successful.

## Delete virtual cluster from Azure portal

To delete virtual cluster using Azure portal, search for virtual cluster resources using the built-in search.

![Search for virtual cluster.](./media/sql-database-managed-instance-delete-virtual-cluster/virtual-clusters-search.png)

Once you locate the virtual cluster you wish to delete, select this resource and select the Delete option. Confirm your selection.

![Delete virtual cluster.](./media/sql-database-managed-instance-delete-virtual-cluster/virtual-clusters-delete.png)

[!NOTE] To be able to delete a virtual cluster, it must not contain any managed instances.

Confirmation that the virtual cluster was deleted is provided in the Azure portal notifications. Successful deletion of the virtual cluster releases the VNet for further reuse.

## Delete virtual cluster using API

To delete a virtual cluster through API use the URI parameters specified in (delete virtual cluster documentation](https://docs.microsoft.com/rest/api/sql/virtualclusters/delete).

## Next steps

- For an overview, see [What is a Managed Instance?](sql-database-managed-instance.md).
- Learn about [connectivity architecture in Managed Instance](sql-database-managed-instance-connectivity-architecture.md).
- Learn how to [modify an existing virtual network for Managed Instance](sql-database-managed-instance-configure-vnet-subnet.md).
- For a tutorial that shows how to create a virtual network, create a Managed Instance, and restore a database from a database backup, see [Create an Azure SQL Database Managed Instance](sql-database-managed-instance-get-started.md).
- For DNS issues, see [Configuring a custom DNS](sql-database-managed-instance-custom-dns.md).
