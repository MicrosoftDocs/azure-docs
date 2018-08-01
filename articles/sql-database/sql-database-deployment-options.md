---
title: Azure SQL Database deployment options | Microsoft Docs
description: Learn about Azure SQL Database deployment options - single databases or elastic pools on a logical server or a managed instance.
services: sql-database
author: CarlRabeler
manager: craigg
ms.service: sql-database
ms.custom: DBs & servers
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: carlrab
---

# What are the Azure SQL Database deployment options

Azure SQL Database provides the following deployment options for an Azure SQL database:
- As a single database on a logical server
- As a pooled databse in an elastic pool on a logical server
- As a single database in a physical server, also known as a managed instance

The following illustration shows these deployment options:

![deployment-options](./media/sql-database-technnical-overview/deployment-options.png) 



## Deployment options for databases on a logical server

On a logical server, you can create:

- A single database created within an [Azure resource group](../azure-resource-manager/resource-group-overview.md) with a [combined set of compute and storage resources](sql-database-service-tiers-dtu.md) or an [independent scale of compute and storage resources](sql-database-service-tiers-vcore.md). An Azure SQL database is associated with an Azure SQL Database logical server, which is created within a specific Azure region.
- A database created as part of a [pool of databases](sql-database-elastic-pool.md) within an [Azure resource group](../azure-resource-manager/resource-group-overview.md) with a [combined set of compute and storage resources (DTU-based)](sql-database-service-tiers-dtu.md) or an [independent scale of compute and storage resources (vCore-based)](sql-database-service-tiers-vcore.md) that are shared among all of the databases in the pool. An Azure SQL database is associated with an Azure SQL Database logical server, which is created within a specific Azure region.

> [!IMPORTANT]
> SQL Database Managed Instance, currently in public preview, is an [instance of a SQL server](sql-database-managed-instance.md) (a Managed Instance) created within an [Azure resource group](../azure-resource-manager/resource-group-overview.md) with a defined set of compute and storage resources for all databases on that server instance. A managed instance contains both system and user databases. Managed Instance is designed to enable database lift-and-shift to a fully managed PaaS, without redesigning the application. Managed Instance provides high compatibility with the on-premises SQL Server programming model and supports the large majority of SQL Server features and accompanying tools and services. For more information, see [SQL Database Managed Instance](sql-database-managed-instance.md). The remainder of this article does not apply to Managed Instance.

## What is a managed instance

[Azure SQL Database Managed Instance](sql-database-managed-instance.md) (preview) is a new capability of Azure SQL Database, providing near 100% compatibility with SQL Server on-premises (Enterprise Edition), providing a native [virtual network (VNet)](../virtual-network/virtual-networks-overview.md) implementation that addresses common security concerns, and a [business model](https://azure.microsoft.com/pricing/details/sql-database/) favorable for on-premises SQL Server customers. Managed Instance allows existing SQL Server customers to lift and shift their on-premises applications to the cloud with minimal application and database changes. At the same time, Managed Instance preserves all PaaS capabilities (automatic patching and version updates, backup, high-availability), that drastically reduces management overhead and TCO.

On the Managed Instance, all databases within the instance are located on the same SQL Server instance under the hood, just like on an on-premises SQL Server instance. This guarantees that all instance-scoped functionality will work the same way, such as global temp tables, cross-database queries, SQL Agent, etc. This database placement is kept through automatic failovers, and all server level objects, such as logins or SQL Agent logins, are properly replicated.

# Next steps

- To create a single database in the Azure portal, see [Create an Azure SQL database in the Azure portal](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-get-started-portal).
- To learn about elastic pools, see [Elastic pools help you manage and scale multiple Azure SQL databases](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-elastic-pool.md).
- To learn about Managed instances (preview), see [Azure SQL Database Managed Instance](sql-database-managed-instance.md).