---
title: Getting started content reference
titleSuffix: Azure SQL Managed Instance 
description: "A reference for content that helps you get started with Azure SQL Managed Instance. "
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: quickstart
author: davidtrigano
ms.author: datrigan
ms.reviewer: vanto
ms.date: 07/11/2019
---
# Getting started with Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

[Azure SQL Managed Instance](sql-managed-instance-paas-overview.md) creates a database with near 100% compatibility with the latest SQL Server (Enterprise Edition) database engine, providing a native [virtual network (VNet)](../../virtual-network/virtual-networks-overview.md) implementation that addresses common security concerns, and a [business model](https://azure.microsoft.com/pricing/details/sql-database/) favorable for existing SQL Server customers.

In this article, you will find references to content that teach you how to quickly configure and create a SQL Managed Instance and migrate your databases.

## Quickstart overview

The following quickstarts enable you to quickly create a SQL Managed Instance, configure a virtual machine or point to site VPN connection for client application, and restore a database to your new SQL Managed Instance using a `.bak` file.

### Configure environment

As a first step, you would need to create your first SQL Managed Instance with the network environment where it will be placed, and enable connection from the computer or virtual machine where you are executing queries to SQL Managed Instance. You can use the following guides:

- [Create a SQL Managed Instance using the Azure portal](instance-create-quickstart.md). In the Azure portal, you configure the necessary parameters (username/password, number of cores, and max storage amount), and automatically create the Azure network environment without the need to know about networking details and infrastructure requirements. You just make sure that you have a [subscription type](resource-limits.md#supported-subscription-types) that is currently allowed to create a SQL Managed Instance. If you have your own network that you want to use or you want to customize the network, see [configure an existing virtual network for Azure SQL Managed Instance](vnet-existing-add-subnet.md) or [create a virtual network for Azure SQL Managed Instance](virtual-network-subnet-create-arm-template.md).
- A SQL Managed Instance is created in its own VNet with no public endpoint. For client application access, you can either **create a VM in the same VNet (different subnet)** or **create a point-to-site VPN connection to the VNet from your client computer** using one of these quickstarts:
  - Enable [public endpoint](public-endpoint-configure.md) on your SQL Managed Instance in order to access your data directly from your environment.
  - Create [Azure Virtual Machine in the SQL Managed Instance VNet](connect-vm-instance-configure.md) for client application connectivity, including SQL Server Management Studio.
  - Set up [point-to-site VPN connection to your SQL Managed Instance](point-to-site-p2s-configure.md) from your client computer on which you have SQL Server Management Studio and other client connectivity applications. This is other of two options for connectivity to your SQL Managed Instance and to its VNet.

  > [!NOTE]
  > - You can also use express route or site-to-site connection from your local network, but these approaches are out of the scope of these quickstarts.
  > - If you change retention period from 0 (unlimited retention) to any other value, please note that retention will only apply to logs written after retention value was changed (logs written during the period when retention was set to unlimited are preserved, even after retention is enabled).

As an alternative to manual creation of SQL Managed Instance, you can use [PowerShell](scripts/create-configure-managed-instance-powershell.md), [PowerShell with Resource Manager template](scripts/create-powershell-azure-resource-manager-template.md), or [Azure CLI](https://docs.microsoft.com/cli/azure/sql/mi#az-sql-mi-create) to script and automate this process.

### Migrate your databases

After you create a SQL Managed Instance and configure access, you can start migrating your SQL Server databases. Migration can fail if you have some unsupported features in the source database that you want to migrate. To avoid failures and check compatibility, you can use [Data Migration Assistant (DMA)](https://www.microsoft.com/download/details.aspx?id=53595) to analyze your databases on SQL Server and find any issue that could block migration to a SQL Managed Instance, such as existence of [FileStream](https://docs.microsoft.com/sql/relational-databases/blob/filestream-sql-server) or multiple log files. If you resolve these issues, your databases are ready to migrate to SQL Managed Instance. [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview) is another useful tool that can record your workload on SQL Server and replay it on a SQL Managed Instance so you can determine are there going to be any performance issues if you migrate to a SQL Managed Instance.

Once you are sure that you can migrate your database to a SQL Managed Instance, you can use the native SQL Server restore capabilities to restore a database into a SQL Managed Instance from a `.bak` file. You can use this method to migrate databases from SQL Server database engine installed on-premises or Azure Virtual Machines. For a quickstart, see [Restore from backup to a SQL Managed Instance](restore-sample-database-quickstart.md). In this quickstart, you restore from a `.bak` file stored in Azure Blob storage using the `RESTORE` Transact-SQL command.

> [!TIP]
> To use the `BACKUP` Transact-SQL command to create a backup of your database in Azure Blob storage, see [SQL Server backup to URL](https://docs.microsoft.com/sql/relational-databases/backup-restore/sql-server-backup-to-url).

These quickstarts enable you to quickly create, configure, and restore database backup to a SQL Managed Instance. In some scenarios, you would need to customize or automate deployment of SQL Managed Instance and the required networking environment. These scenarios will be described below.

## Customize network environment

Although the VNet/subnet can be automatically configured when the instance is [created using the Azure portal](instance-create-quickstart.md), it might be good to create it before you start creating instances in SQL Managed Instance because you can configure the parameters of VNet and subnet. The easiest way to create and configure the network environment is to use the [Azure Resource deployment](virtual-network-subnet-create-arm-template.md) template that creates and configures your network and subnet where the instance will be placed. You just need to press the Azure Resource Manager deploy button and populate the form with parameters.

As an alternative, you can also use this [PowerShell script](https://www.powershellmagazine.com/2018/07/23/configuring-azure-environment-to-set-up-azure-sql-database-managed-instance-preview/) to automate creation of the network.

If you already have a VNet and subnet where you would like to deploy your SQL Managed Instance, you need to make sure that your VNet and subnet satisfy the [networking requirements](connectivity-architecture-overview.md#network-requirements). Use this [PowerShell script to verify that your subnet is properly configured](vnet-existing-add-subnet.md). This script validates your network and reports any issues, telling you what should be changed and then offers to make the necessary changes in your VNet/subnet. Run this script if you don't want to configure your VNet/subnet manually. You can also run it after any major reconfiguration of your network infrastructure. If you want to create and configure your own network, read [connectivity architecture](connectivity-architecture-overview.md) and this [ultimate guide for creating and configuring a SQL Managed Instance environment](https://medium.com/azure-sqldb-managed-instance/the-ultimate-guide-for-creating-and-configuring-azure-sql-managed-instance-environment-91ff58c0be01).

## Migrate to a SQL Managed Instance

The previously-mentioned quickstarts enable you to quickly set up a SQL Managed Instance and move your databases using the native `RESTORE` capability. This is a good starting point if you want to complete quick proof-of concepts and verify that your solution can work on Managed Instance.

However, in order to migrate your production database or even dev/test databases that you want to use for some performance test, you would need to consider using some additional techniques, such as:

- Performance testing - You should measure baseline performance metrics on your source SQL Server instance and compare them with the performance metrics on the destination SQL Managed Instance where you have migrated the database. Learn more about the [best practices for performance comparison](https://techcommunity.microsoft.com/t5/Azure-SQL-Database/The-best-practices-for-performance-comparison-between-Azure-SQL/ba-p/683210).
- Online migration - With the native `RESTORE` described in this article, you have to wait for the databases to be restored (and copied to Azure Blob storage if not already stored there). This causes some downtime of your application especially for larger databases. To move your production database, use the [Data Migration service (DMS)](https://docs.microsoft.com/azure/dms/tutorial-sql-server-to-managed-instance?toc=/azure/sql-database/toc.json) to migrate your database with the minimal downtime. DMS accomplishes this by incrementally pushing the changes made in your source database to the SQL Managed Instance database being restored. This way, you can quickly switch your application from source to target database with minimal downtime.

Learn more about the [recommended migration process](migrate-to-instance-from-sql-server.md).

## Next steps

- Find a [high-level list of supported features in SQL Managed Instance here](../database/features-comparison.md) and [details and known issues here](transact-sql-tsql-differences-sql-server.md).
- Learn about [technical characteristics of SQL Managed Instance](resource-limits.md#service-tier-characteristics).
- Find more advanced how-to's in [how to use a SQL Managed Instance](how-to-content-reference-guide.md).
- [Identify the right Azure SQL Managed Instance SKU for your on-premises database](/sql/dma/dma-sku-recommend-sql-db/).
