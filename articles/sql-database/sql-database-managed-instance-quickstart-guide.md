---
title: Quickstart - Azure SQL Database Managed Instance | Microsoft Docs
description: 'Learn how to quickly get started with Azure SQL Database - Managed Instance'
services: sql-database
ms.service: sql-database
ms.subservice: 
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: carlr
manager: craigg
ms.date: 01/25/2019
---
# Getting started with Azure SQL Database Managed Instance

[Azure SQL Database Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-index) is fully managed PaaS version of SQL Server hosted in Azure cloud and placed in your own VNet with the private IP address. In this section, you will learn how to quickly configure and create Managed Instance and migrate your databases.

## Quickstart overview

In this section, you will see an overview of available articles that can help you to quickly get started with Managed Instances. The easiest way to create your first Managed Instance is to use [the Azure portal](sql-database-managed-instance-get-started.md) where you can configure necessary parameters and automatically create Azure network environment without need to know about networking details and infrastructure requirements. Just make sure that you have a [subscription type](sql-database-managed-instance-resource-limits.md#supported-subscription-types) that is allowed to create the instance.

If you have your own network that you want to use or you want to customize the network, see how to [configure network environment](#configure-network-environment) for Managed Instance.

When you create your Managed Instance, you would need to connect to the instance using one of the following approaches:
* Create [Azure Virtual Machine](sql-database-managed-instance-configure-vm.md) with installed SQL Server Management Studio and other apps that can be used to access your Managed Instance in a subnet within the same VNet where your Managed Instance is placed. VM cannot be in the same subnet with your Managed Instances.
* Set up [Point-to-site connection](sql-database-managed-instance-configure-p2s.md) on your computer that will enable you to join your computer to the VNet where Managed Instance is placed and use Managed Instance as any other SQL Server in your network.

As an alternative, you could use express route or site-to-site connection from your local network, but these approaches are out of the scope of these quickstarts.

When you create a Managed Instance and configure access, you can start migrating your database. You should install [Data Migration Assistant (DMA)](https://www.microsoft.com/download/details.aspx?id=53595) that will analyze your databases on SQL Server and find any issue that could block migration to Managed Instance such as existence of FileStream or multiple log files. If you resolve these issues, your databases are ready to go to Managed Instance. [Database Experimentation Assistant](https://blogs.msdn.microsoft.com/datamigration/2018/08/06/release-database-experimentation-assistant-dea-v2-6/) is another useful tool that can record your workload on SQL Server and replay it on Managed Instance so you can determine are there going to be any performance issues if you migrate to Managed Instance.

Once you are sure that you can migrate your database to Managed Instance, you can use [Native RESTORE](sql-database-managed-instance-get-started-restore.md) functionality that enables you to create a backup of your database using Transact-SQL command, upload it to an Azure blob storage and RESTORE database from the blob storage using Transact-SQL command.

These quickstarts enable you to quickly configure, create, and put databases on your Managed Instances. In some scenarios, you would need to customize or automate deployment of Managed Instance and the required networking environment. These scenarios will be described below.

## Customizing network environment

Although the VNet/subnet can be automatically configured when the instance is created using [the Azure portal](sql-database-managed-instance-get-started.md), it might be good to create it before you start creating Managed Instances because you can configure the parameters of VNet and subnet. The easiest way to create and configure the network environment is to use [Azure Resource deployment](sql-database-managed-instance-create-vnet-subnet.md) template that will create and configure you network and subnet where the instance will be placed. You just need to press the Azure Resource Manager deploy button and populate the form with parameters. As an alternative, you can use [PowerShell script](https://www.powershellmagazine.com/2018/07/23/configuring-azure-environment-to-set-up-azure-sql-database-managed-instance-preview/) to automate creation of the network.

If you already have a VNet and subnet where you would like to deploy your Managed Instance, you would need to make sure that your VNet and subnet satisfy [networking requirements](sql-database-managed-instance-connectivity-architecture.md#network-requirements). You should use this [PowerShell script to verify that your subnet is properly configured](sql-database-managed-instance-configure-vnet-subnet.md). This script will not just validate your network and report the issues – it will tell you what should be changed and also offer you to make the necessary changes in your VNet/subnet. Run this script if you don't want to configure your VNet/subnet manually, and also you should run it after any major reconfiguration of your network infrastructure. If you want to create and configure your own network read [Managed Instance documentation](sql-database-managed-instance-connectivity-architecture.md) and [this guide](https://medium.com/azure-sqldb-managed-instance/the-ultimate-guide-for-creating-and-configuring-azure-sql-managed-instance-environment-91ff58c0be01).

## Automating creation of Managed Instance

 If you have not created the network environment as described in the previous step, the Azure portal can do it for you – the only drawback is the fact that it will configure it with some default parameters that you cannot change later. As an alternative you can use [PowerShell](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2018/06/27/quick-start-script-create-azure-sql-managed-instance-using-powershell/), [PowerShell with Resource Manager template](scripts/sql-managed-instance-create-powershell-azure-resource-manager-template.md), or [Azure CLI](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2018/11/14/create-azure-sql-managed-instance-using-azure-cli/).

## Migrating to Managed Instance with minimal downtime

Articles in these quickstarts enable you to quickly set up Managed Instance and move your databases. However, with the native restore you would need to wait for the databases to be restored, which would cause some downtime of your application especially if the database is bigger. If you are moving your production database, you would probably need a better way to migrate that will guarantee minimal downtime of migration. [Data Migration service](https://docs.microsoft.com/azure/dms/tutorial-sql-server-to-managed-instance?toc=/azure/sql-database/toc.json) is a migration service that can migrate your database with the minimal downtime by incrementally pushing the changes made in your source database to a database that your are restoring to the Managed Instance. This way, you can quickly switch your application from source to target database with the minimal downtime.

## Next steps

* Find a [high-level list of supported features in Managed Instance here](sql-database-features.md) and [details and known issues here](sql-database-managed-instance-transact-sql-information.md). 
* Learn about [technical characteristics of Managed Instance](sql-database-managed-instance-resource-limits.md#instance-level-resource-limits). 
* Find more advanced tutorials in [how to section](sql-database-howto-managed-instance.md). 