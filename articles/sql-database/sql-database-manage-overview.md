<properties
	pageTitle="Overview: management tools for SQL Database"
	description="Compares tools and options for managing Azure SQL Database"
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/19/2016"
	ms.author="sstein"/>

# Overview: management tools for SQL Database

This topic explores and compares tools and options for managing Azure SQL databases so you can pick the right tool for the job, your business, and you. Choosing the right tool depends on how many databases you manage, the task, and how often a task is performed.

## Azure portal

The [Azure portal](https://portal.azure.com) is a web-based application where you can create, update, and delete databases and logical servers and monitor database activity. This tool is great if you're just getting started with Azure, managing a small number of databases, or need to do something quickly.

For more in-depth information about using the portal see [Manage SQL Databases using the Azure Classic Portal](sql-database-manage-portal.md).

## SQL Server Management Studio and SQL Server Data Tools in Visual Studio

SQL Server Management Studio (SSMS) and SQL Server Data Tools (SSDT) in Visual Studio are client tools that run on your computer and allow you to connect to, manage, and develop your database in the cloud. If you're an application developer familiar with Visual Studio or other integrated development environments (IDEs), [try using SSDT in Visual Studio](https://msdn.microsoft.com/library/mt204009.aspx). Many database administrators are familiar with SSMS, which can be used with Azure SQL databases. [Download the latest version of SSMS](https://msdn.microsoft.com/library/mt238290) and always use the latest release when working with Azure SQL Database. For more information on managing your Azure SQL Databases with SSMS, see [Manage SQL Databases using SSMS](sql-database-manage-azure-ssms.md).

> [AZURE.IMPORTANT] You must use the latest version of SQL Server Management Studio and SQL Server Data Tools for Visual Studio to remain synchronized with updates to Microsoft Azure and SQL Database. Older versions of these tools will not work successfully with SQL Database.

## Command line tools

You can use command line tools such as PowerShell to manage databases and elastic database pools, and to automate Azure resource deployments. Microsoft recommends this tool for managing a large number of databases and automating deployment and resource changes in a production environment.

For more information on managing your Azure SQL Databases with command line tools, [Manage SQL Database with PowerShell](sql-database-command-line-tools.md)

## Elastic Database tools
Use the elastic database tools to perform actions such as 

* Executing a T-SQL script against a set of databases using an [elastic job](sql-database-elastic-jobs-overview.md)
* Moving multi-tenant model databases to a single-tenant model with the [split-merge tool](sql-database-elastic-scale-overview-split-and-merge.md)
* Managing databases in a single-tenant model or a multi-tenant model using the [elastic scale client library](sql-database-elastic-database-client-library.md).
 
