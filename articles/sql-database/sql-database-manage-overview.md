---
title: 'Tools to manage & develop with Azure SQL Database | Microsoft Docs'
description: Introduces the management and development tools and options for Azure SQL Database
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 37767380-975f-4dee-a28d-80bc2036dda3
ms.service: sql-database
ms.custom: DBs & servers
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/03/2017
ms.author: carlrab

---
# Overview: Tools to manage & develop with Azure SQL Database
This topic introduces the tools for managing and developing with Azure SQL databases.

> [!IMPORTANT]
> This documentation set includes QuickStarts, Sample, and How-to guides showing you how to management and develop with Azure SQL Database using the tools introduced in the following paragraphs. Use the left-hand navigation pane and filter box to find specific content for the Azure portal, PowerShell, and T-SQL.
>

## Azure portal
The [Azure portal](https://portal.azure.com) is a web-based application where you can create, update, and delete databases and logical servers and monitor database activity. This tool is great if you're just getting started with Azure, managing a few databases, or need to do something quickly.

## SQL Server Management Studio and Transact-SQL
SQL Server Management Studio (SSMS) is a client tool that runs on your computer for managing your database in the cloud using Transact-SQL. Many database administrators are familiar with SSMS, which can be used with Azure SQL databases. [Download the latest version of SSMS](https://msdn.microsoft.com/library/mt238290) and always use the latest release when working with Azure SQL Database. 

> [!IMPORTANT]
> Always use the latest version of [SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290).
>  

## SQL Server Data Tools in Visual Studio
SQL Server Data Tools (SSDT) is a client tool that runs on your computer for developing your database in the cloud. If you're an application developer familiar with Visual Studio or other integrated development environments (IDEs), [try using SSDT in Visual Studio](https://msdn.microsoft.com/library/mt204009.aspx).  

> [!IMPORTANT]
> Always use the latest version of [SQL Server Data Tools](https://msdn.microsoft.com/library/mt204009.aspx) to remain synchronized with updates to Microsoft Azure and SQL Database.
>  
## PowerShell
You can use PowerShell to manage databases and elastic pools, and to automate Azure resource deployments. Microsoft recommends this tool for managing a large number of databases and automating deployment and resource changes in a production environment.

## Elastic Database tools
Use the elastic database tools to perform actions such as 

* Executing a T-SQL script against a set of databases using an [elastic job](sql-database-elastic-jobs-overview.md)
* Moving multi-tenant model databases to a single-tenant model with the [split-merge tool](sql-database-elastic-scale-overview-split-and-merge.md)
* Managing databases in a single-tenant model or a multi-tenant model using the [elastic scale client library](sql-database-elastic-database-client-library.md).

## Additional resources
* [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/)
* [Azure Automation](https://azure.microsoft.com/documentation/services/automation/)
* [Azure Scheduler](https://azure.microsoft.com/documentation/services/scheduler/)

