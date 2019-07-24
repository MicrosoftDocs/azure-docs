---
title: Quickstart - Azure SQL Database managed instance | Microsoft Docs
description: 'Learn how to quickly get started with Azure SQL Database - managed instance'
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein, carlr
manager: craigg
ms.date: 07/11/2019
---
# Getting started with Azure SQL Database managed instance

The [managed instance](sql-database-managed-instance-index.yml) deployment option creates a database with near 100% compatibility with the latest SQL Server on-premises (Enterprise Edition) database engine, providing a native [virtual network (VNet)](../virtual-network/virtual-networks-overview.md) implementation that addresses common security concerns, and a [business model](https://azure.microsoft.com/pricing/details/sql-database/) favorable for on-premises SQL Server customers. In this article, you will learn how to quickly configure and create a managed instance and migrate your databases.

## Quickstart overview

The following quickstarts enable you to quickly create a managed instance, configure a virtual machine or point to site VPN connection for client application, and restore a database to your new managed instance using a `.bak` file.

### Configure environment

As a first step, you would need to create your first Managed Instance with the network environment where it will be placed, and enable connection from the computer or virtual machine where you are executing queries to Managed Instance. You can use the following guides:

- [Create a managed instance using the Azure portal](sql-database-managed-instance-get-started.md). In the Azure portal, you configure the necessary parameters (username/password, number of cores, and max storage amount), and automatically create the Azure network environment without the need to know about networking details and infrastructure requirements. You just make sure that you have a [subscription type](sql-database-managed-instance-resource-limits.md#supported-subscription-types) that is currently allowed to create a managed instance. If you have your own network that you want to use or you want to customize the network, see [configure an existing virtual network for Azure SQL Database managed instance](sql-database-managed-instance-configure-vnet-subnet.md) or [create a virtual network for Azure SQL Database managed instance](sql-database-managed-instance-create-vnet-subnet.md).
- A managed instance is created in own VNet with no public endpoint. For client application access, you can either **create a VM in the same VNet (different subnet)** or **create a point-to-site VPN connection to the VNet from your client computer** using one of these quickstarts:
  - Enable [public endpoint](sql-database-managed-instance-public-endpoint-configure.md) on your Managed Instance in order to access your data directly from your environment.
  - Create [Azure Virtual Machine in the managed instance VNet](sql-database-managed-instance-configure-vm.md) for client application connectivity, including SQL Server Management Studio.
  - Set up [point-to-site VPN connection to your managed instance](sql-database-managed-instance-configure-p2s.md) from your client computer on which you have SQL Server Management Studio and other client connectivity applications. This is other of two options for connectivity to your managed instance and to its VNet.

  > [!NOTE]
  > You can also use express route or site-to-site connection from your local network, but these approaches are out of the scope of these quickstarts.

As an alternative to manual creation of Managed Instance, you can use [PowerShell](scripts/sql-database-create-configure-managed-instance-powershell.md), [PowerShell with Resource Manager template](scripts/sql-managed-instance-create-powershell-azure-resource-manager-template.md), or [Azure CLI](https://docs.microsoft.com/cli/azure/sql/mi#az-sql-mi-create) to script and automate this process.

### Migrate your databases

After you create a managed instance and configure access, you can start migrating your databases from SQL Server on-premises or Azure VMs. Migration fails if you have some unsupported features in the source database that you want to migrate. To avoid failures and check compatibility, you can install [Data Migration Assistant (DMA)](https://www.microsoft.com/download/details.aspx?id=53595) that analyzes your databases on SQL Server and finds any issue that could block migration to a managed instance, such as existence of [FileStream](https://docs.microsoft.com/sql/relational-databases/blob/filestream-sql-server) or multiple log files. If you resolve these issues, your databases are ready to migrate to managed instance. [Database Experimentation Assistant](https://blogs.msdn.microsoft.com/datamigration/2018/08/06/release-database-experimentation-assistant-dea-v2-6/) is another useful tool that can record your workload on SQL Server and replay it on a managed instance so you can determine are there going to be any performance issues if you migrate to a managed instance.

Once you are sure that you can migrate your database to a managed instance, you can use the native SQL Server restore capabilities to restore a database into a managed instance from a `.bak` file. You can use this method to migrate databases from SQL Server database engine installed on-premises or Azure VM. For a quickstart, see [Restore from backup to a managed instance](sql-database-managed-instance-get-started-restore.md). In this quickstart, you restore from a `.bak` file stored in Azure Blob storage using the `RESTORE` Transact-SQL command.

> [!TIP]
> To use the `BACKUP` Transact-SQL command to create a backup of your database in Azure Blob storage, see [SQL Server backup to URL](https://docs.microsoft.com/sql/relational-databases/backup-restore/sql-server-backup-to-url).

These quickstarts enable you to quickly create, configure, and restore database backup to a managed instance. In some scenarios, you would need to customize or automate deployment of managed instances and the required networking environment. These scenarios will be described below.

## Customize network environment

Although the VNet/subnet can be automatically configured when the instance is created using [the Azure portal](sql-database-managed-instance-get-started.md), it might be good to create it before you start creating Managed Instances because you can configure the parameters of VNet and subnet. The easiest way to create and configure the network environment is to use [Azure Resource deployment](sql-database-managed-instance-create-vnet-subnet.md) template that will create and configure you network and subnet where the instance will be placed. You just need to press the Azure Resource Manager deploy button and populate the form with parameters.

As an alternative, you can use [PowerShell script](https://www.powershellmagazine.com/20../../configuring-azure-environment-to-set-up-azure-sql-database-managed-instance-preview/) to automate creation of the network.

As an alternative, you can also use this [PowerShell script](https://www.powershellmagazine.com/2018/07/23/configuring-azure-environment-to-set-up-azure-sql-database-managed-instance-preview/) to automate creation of the network.

If you already have a VNet and subnet where you would like to deploy your managed instance, you need to make sure that your VNet and subnet satisfy the [networking requirements](sql-database-managed-instance-connectivity-architecture.md#network-requirements). Use this [PowerShell script to verify that your subnet is properly configured](sql-database-managed-instance-configure-vnet-subnet.md). This script validates your network and report any issues, and it tells you what should be changed and then offers to make the necessary changes in your VNet/subnet. Run this script if you don't want to configure your VNet/subnet manually. You can also run it after any major reconfiguration of your network infrastructure. If you want to create and configure your own network, read [connectivity architecture](sql-database-managed-instance-connectivity-architecture.md) and this [ultimate guide for creating and configuring a managed instance environment](https://medium.com/azure-sqldb-managed-instance/the-ultimate-guide-for-creating-and-configuring-azure-sql-managed-instance-environment-91ff58c0be01).

## Migrate to a managed instance

Articles in these quickstarts enable you to quickly set up a managed instance and move your databases using the native `RESTORE` capability. This is a good starting point if you want to complete quick proof-of concepts and verify that your solution can work on Managed Instance. 

However, in order to migrate your production database or even dev/test databases that you want to use for some performance test, you would need to consider using some additional techniques, such as:
- Performance testing - You should measure baseline performance on your source SQL Server instance and compare them with the performance on the destination Managed Instance where you have migrated the database. Learn more about the [best practices for performance comparison](https://techcommunity.microsoft.com/t5/Azure-SQL-Database/The-best-practices-for-performance-comparison-between-Azure-SQL/ba-p/683210).
- Online migration - With the native `RESTORE` described in this article, you have to wait for the databases to be restored (and copied to Azure Blob storage if not already stored there). This causes some downtime of your application especially for larger databases. To move your production database, use the [Data Migration service (DMS)](https://docs.microsoft.com/azure/dms/tutorial-sql-server-to-managed-instance?toc=/azure/sql-database/toc.json) to migrate your database with the minimal downtime. DMS accomplishes this by incrementally pushing the changes made in your source database to the managed instance database being restored. This way, you can quickly switch your application from source to target database with the minimal downtime.

Learn more about the [recommended migration process](sql-database-managed-instance-migrate.md).

## Next steps

- Find a [high-level list of supported features in managed instance here](sql-database-features.md) and [details and known issues here](sql-database-managed-instance-transact-sql-information.md).
- Learn about [technical characteristics of managed instance](sql-database-managed-instance-resource-limits.md#instance-level-resource-limits).
- Find more advanced how-to's in [how to use a managed instance in Azure SQL Database](sql-database-howto-managed-instance.md).
- [Identify the right Azure SQL Database/Managed Instance SKU for your on-premises database](/sql/dma/dma-sku-recommend-sql-db/).
