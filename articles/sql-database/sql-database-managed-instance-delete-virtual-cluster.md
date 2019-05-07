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

In this article, you will learn about the methods of deleting VNet after deleting Azure SQL Database managed instance.

Once the last managed instance is deleted using the same VNet, the virtual cluster containing managed instances will be kept for the next 12 hours until being purged. The virtual cluster is kept alive by design to enable faster creation of managed instance in the same VNet. However, keeping the virtual cluster for this period will lock the VNet from being deleted which might present and issue if you would like to release this network resource for further use.

To immediately delete the VNet used by the virtual cluster you will need to manually delete the virtual cluster through Azure portal or using the available [API](https://docs.microsoft.com/rest/api/sql/virtualclusters). To be able to delete a virtual cluster it must not contain any managed instances, that is all managed instances using the same VNet need to be deleted prior to deleting the virtual cluster. Upon manual deletion of the virtual cluster, VNet resource will be released for deletion and reuse.

## Delete virtual cluster from Azure portal

To delete virtual cluster using Azure portal, search for virtual cluster resources using the built-in search.

![Search for virtual cluster.](./media/sql-database-managed-instance-delete-virtual-cluster/virtual-clusters-search.png)

Once you locate the virtual cluster you wish to delete, select this resource and select the Delete option. Confirm your selection.

![Delete virtual cluster.](./media/sql-database-managed-instance-delete-virtual-cluster/virtual-clusters-delete.png)

[!NOTE] To be able to delete a virtual cluster it must not contain any managed instances, that is all managed instances using the same VNet need to be deleted prior to deleting the virtual cluster.

Confirmation that the virtual cluster is deleted will be provided in the Azure portal notifications. This will delete the virtual cluster and the VNet network resource will be releases for deletion and further reuse.

## Delete virtual cluster using API

To delete virtual cluster using API, initiate the API call with the URI parameters specified in (delete virtual cluster documentation]( https://docs.microsoft.com/rest/api/sql/virtualclusters/delete).

## Next steps

- For an overview, see [What is a Managed Instance?](sql-database-managed-instance.md).
- Learn about [connectivity architecture in Managed Instance](sql-database-managed-instance-connectivity-architecture.md).
- Learn how to [modify an existing virtual network for Managed Instance](sql-database-managed-instance-configure-vnet-subnet.md).
- For a tutorial that shows how to create a virtual network, create a Managed Instance, and restore a database from a database backup, see [Create an Azure SQL Database Managed Instance](sql-database-managed-instance-get-started.md).
- For DNS issues, see [Configuring a custom DNS](sql-database-managed-instance-custom-dns.md).