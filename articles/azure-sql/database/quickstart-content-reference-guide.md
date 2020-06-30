---
title: Single database quickstart content reference
description: 'Find a content reference of all the quickstarts that will help you quickly get started with single databases in Azure SQL Database.'
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: quickstart
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: carlr
ms.date: 07/29/2019
---
# Getting started with single databases in Azure SQL Database
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

[A single database](../index.yml) is fully managed platform as a service (PaaS) database as a service (DbaaS) that is ideal storage engine for the modern cloud-born applications. In this section, you'll learn how to quickly configure and create a single database in Azure SQL Database.

## Quickstart overview

In this section, you'll see an overview of available articles that can help you to quickly get started with single databases. The following quickstarts enable you to quickly create a single database, configure a server-level firewall rule, and then import a database into the new single database using a `.bacpac` file:

- [Create a single database using the Azure portal](single-database-create-quickstart.md).
- After creating the database, you would need to [secure your database by configuring firewall rules](firewall-create-server-level-portal-quickstart.md).
- If you have an existing database on SQL Server that you want to migrate to Azure SQL Database, you should install [Data Migration Assistant (DMA)](https://www.microsoft.com/download/details.aspx?id=53595) that will analyze your databases on SQL Server and find any issue that could block migration. If you don't find any issue, you can export your database as `.bacpac` file and [import it using the Azure portal or SqlPackage](database-import.md).


## Automating management operations

You can use PowerShell or the Azure CLI to create, configure, and scale your database.

- [Create and configure a single database using PowerShell](scripts/create-and-configure-database-powershell.md) or [Azure CLI](scripts/create-and-configure-database-cli.md)
- [Update your single database and scale resources using PowerShell](scripts/monitor-and-scale-database-powershell.md) or [Azure CLI](scripts/monitor-and-scale-database-cli.md)

## Migrating to a single database with minimal downtime

These quickstarts enable you to quickly create or import your database to Azure using a `.bacpac` file. However, `.bacpac` and `.dacpac` files are designed to quickly move databases across different versions of SQL Server and within Azure SQL, or to implement continuous integration in your DevOps pipeline. However, this method is not designed for migration of your production databases with minimal downtime, because you would need to stop adding new data, wait for the export of the source database to a `.bacpac` file to complete, and then wait for the import into Azure SQL Database to complete. All of this waiting results in downtime of your application, especially for large databases. To move your production database, you need a better way to migrate that guarantees minimal downtime of migration. For this, use the [Data Migration Service (DMS)](https://docs.microsoft.com/azure/dms/tutorial-sql-server-to-azure-sql?toc=/azure/sql-database/toc.json) to migrate your database with the minimal downtime. DMS accomplishes this by incrementally pushing the changes made in your source database to the single database being restored. This way, you can quickly switch your application from source to target database with the minimal downtime.

## Hands-on learning modules

The following Microsoft Learn modules help you learn for free about Azure SQL Database.

- [Provision a database in SQL Database to store application data](https://docs.microsoft.com/learn/modules/provision-azure-sql-db/)
- [Develop and configure an ASP.NET application that queries a database in Azure SQL Database](https://docs.microsoft.com/learn/modules/develop-app-that-queries-azure-sql/)
- [Secure your database in Azure SQL Database](https://docs.microsoft.com/learn/modules/secure-your-azure-sql-database/)

## Next steps

- Find a [high-level list of supported features in Azure SQL Database](features-comparison.md).
- Learn how to make your [database more secure](secure-database-tutorial.md).
- Find more advanced how-to's in [how to use a single database in Azure SQL Database](how-to-content-reference-guide.md).
- Find more sample scripts written in [PowerShell](powershell-script-content-guide.md) and [the Azure CLI](az-cli-script-samples-content-guide.md).
- Learn more about the [management API](single-database-manage.md) that you can use to configure your databases.
- [Identify the right Azure SQL Database or Azure SQL Managed Instance SKU for your on-premises database](/sql/dma/dma-sku-recommend-sql-db/).
