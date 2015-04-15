<properties 
	pageTitle="Overview" 
	description="Tool management Overview" 
	services="sql-database" 
	documentationCenter="" 
	authors="stevestein" 
	manager="" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/13/2015" 
	ms.author="sstein"/>

# Overview Management Tools

This topic explores and compares the different tools, and options for managing Azure SQL Databases, and pick the right tool for the job, your business, and you.There are many ways to manage an Azure SQL Database and choosing the right management tool will depending on how many database are managed, how often a task is performed and what tasks are being run.



## Azure Portal


The Azure Portal is a web-based management portal for managing your Azure Resources. You can create, update and delete Azure SQL Databases and Azure SQL Database Servers as well as monitor Azure SQL Database Resources. Microsoft recommends this tool for getting started with Azure, managing a small number of Azure SQL Databases and one time configurations. 

The Azure Portal is accessible through any internet browser at [Management Portal](https://portal.azure.com/). For more information on managing Azure SQL Databases with the Azure Portal [click here](sql-database-manage-portal.md).

## SQL Server Management Studio and SQL Server Visual Studio


SQL Server Management Studio(SSMS) and SQL Server Data Tools(SSDT) in Visual Studio are client tools that allow you to connect to, manage and develop your database. 

For database development, use SSDT.
For users seeking advanced SQL capabilities that are not already capable in SSDT such as managing SQL Server Databases in hybrid environments, use SSMS.

For more information on managing your Azure SQL Databases with SSMS/SSDT, [click here](sql-database-manage-azure-ssms.md)


## Command Line Tools

 You can use command line tools to manage Azure SQL Databases and automate Azure resource deployments. Microsoft Recommends this tool for managing a large number of Azure SQL Database and deploying resource changes in a production environment. 

For more information on managing your Azure SQL Databases with command line tools, [click here](sql-database-command-line-tools.md)