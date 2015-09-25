<properties 
	pageTitle="Overview: management tools for SQL Database" 
	description="Compares tools and options for managing Azure SQL Database" 
	services="sql-database" 
	documentationCenter="" 
	authors="TigerMint" 
	manager="" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/15/2015" 
	ms.author="vinsonyu"/>

# Overview: management tools for SQL Database

This topic explores and compares tools and options for managing SQL Databases so you can pick the right tool for the job, your business, and you. Choosing the right tool depends on how many databases you manage, the task, and how often a task is performed.



## Azure Portal


The [Azure Portal](http://portal.azure.com) is a web-based management portal where you can create, update, and delete Azure SQL Databases and logical servers and monitor database resources. This tool is great is if you're just getting started with Azure, managing a small number of databases, or need to quickly do something. 

For more in-depth information about using the portal see [Manage SQL Databases using the Azure portal](sql-database-manage-portal.md).

## SQL Server Management Studio and SQL Server Data Tools in Visual Studio


SQL Server Management Studio (SSMS) and SQL Server Data Tools (SSDT) in Visual Studio are client tools that run on your computer and allow you to connect to, manage, and develop your database in the cloud. If you're an application developer familiar with Visual Studio or other integrated development environments (IDEs), try using SSDT in Visual Studio. If you need advanced SQL capabilities that are not already capable in SSDT such as managing SQL Server Databases in hybrid environments, use SSMS.

For more information on managing your Azure SQL Databases with SSMS and SSDT, [Manage SQL Databases using SSMS](sql-database-manage-azure-ssms.md)


## Command line tools

You can use command line tools such as PowerShell to manage Azure SQL Databases and automate Azure resource deployments. Microsoft Recommends this tool for managing a large number of Azure SQL Database and deploying resource changes in a production environment. 

For more information on managing your Azure SQL Databases with command line tools, [click here](sql-database-command-line-tools.md)
 