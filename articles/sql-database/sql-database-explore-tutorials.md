---		
title: Explore Azure SQL Database Tutorials | Microsoft Docs		
description: Learn about SQL Database features and capabilities		
keywords: ''		
services: sql-database		
documentationcenter: ''		
author: CarlRabeler		
manager: jhubbard		
editor: ''		
		
ms.assetid: 04c0fd7f-d260-4e43-a4f0-41cdcd5e3786		
ms.service: sql-database		
ms.custom: overview		
ms.devlang: NA		
ms.topic: article		
ms.tgt_pltfrm: NA		
ms.workload: data-management		
ms.date: 02/08/2017		
ms.author: carlrab		
		
---
 
# Explore Azure SQL Database tutorials
The links in the following tables take you to an overview of each listed feature area and a simple step-by-start tutorial for each area. 

## Create servers, databases and server-level firewall rules
In the following tutorials, you create servers, databases, and server-level firewall rules - and learn to connect and query servers and databases.

| Tutorial | Description |
| --- | --- | 
| [Your first Azure SQL database](sql-database-get-started.md) | When you finish this quick start tutorial, you have a sample database and a blank database running in an Azure resource group and attached to a logical server. You also have two server-level firewall rules configured to enable the server-level principal to log in to the server from two specified IP addresses. Finally, you learn know how to query a database in the Azure portal and to connect and query using SQL Server Management Studio. |
| [Provision and access an Azure SQL database using PowerShell](sql-database-get-started-powershell.md) | When you finish this tutorial, you have a sample database and a blank database running in an Azure resource group and attached to a logical server. You also have a server-level firewall rule configured to enable the server-level principal to log in to the server from a specified IP address (or IP address range). |
| [Use C# to create a SQL database with the SQL Database Library for .NET](sql-database-get-started-csharp.md)| In this tutorial, you use the C# to create a SQL Database server, firewall rule, and SQL database. You also create an Active Directory (AD) application and the service principal needed to authenticate the C# app. |
|  | |

## Backups, long-term retention, and database recovery
In the following tutorials, you learn about using [database backups](sql-database-automated-backups.md), [long-term backup retention](sql-database-long-term-retention.md), and [database recovery using backups](sql-database-recovery-using-backups.md).

| Tutorial | Description |
| --- | --- | 
| [Back up and restore using the Azure portal](sql-database-get-started-backup-recovery-portal.md) | In this tutorial, you learn how to use the Azure portal to view backups, recover to a point in time, configure long-term backup retention, and recover from a backup in the Azure Recovery Services vault
| [Back up and restore using PowerShell](sql-database-get-started-backup-recovery-powershell.md) | In this tutorial, you learn how to use PowerShell to view backups, recover to a point in time, configure long-term backup retention, and recover from a backup in the Azure Recovery Services vault
|  | |

## Sharded databases
In the following tutorials, you learn how to [Scale out databases with the shard map manager](sql-database-elastic-scale-shard-map-management.md).

| Tutorial | Description |
| --- | --- | 
| [Create a sharded application](sql-database-elastic-scale-get-started.md) |In this tutorial, you learn how to use the capabilities of elastic database tools using a simple sharded application. |
| [Deploy a split-merge service](sql-database-elastic-scale-configure-deploy-split-and-merge.md) |In this tutorial, you learn how to move data between sharded databases. |
|  | |

## Elastic database jobs
In the following tutorials, you learn about using [elastic database jobs](sql-database-elastic-jobs-overview.md).

| Tutorial | Description |
| --- | --- | 
| [Get started with Azure SQL Database elastic jobs](sql-database-elastic-jobs-getting-started.md) |In this tutorial, you learn how to create and manage jobs that manage a group of related databases. |
|  | |

## Elastic queries
In the following tutorials, you learn about running [elastic queries](sql-database-elastic-query-overview.md).

| Tutorial | Description |
| --- | --- | 
| [Create elastic queries)](sql-database-elastic-query-getting-started-vertical.md) | In this tutorial, you learn how to run T-SQL queries that span multiple databases using a single connection point |
| [Report across scaled-out cloud databases](sql-database-elastic-query-getting-started.md) |In this tutorial, you learn how to create reports from all databases in a horizontally partitioned (sharded) database |
| [Query across cloud databases with different schemas](sql-database-elastic-query-vertical-partitioning.md) | In this tutorial, you learn how to run T-SQL queries that span multiple databases with different schemas |
| [Reporting across scaled-out cloud databases](sql-database-elastic-query-horizontal-partitioning.md) |In this tutorial, you learn to create reports that span all databases in a sharded database. |
|  | |

## Database authentication and authorization
In the following tutorials, you learn about [creating and managing logins and users](sql-database-manage-logins.md).

| Tutorial | Description |
| --- | --- | --- |
| [SQL authentication and authorization](sql-database-control-access-sql-authentication-get-started.md) | In this tutorial, you learn about creating logins and users using SQL Server authentication, and adding them to roles as well as granting them permissions |
| [Azure AD authentication and authorization](sql-database-control-access-aad-authentication-get-started.md) | In this tutorial, you learn about creating logins and users using Azure Active Directory authentication |
|  | |

## Secure and protect data
In the following tutorials, you learn about [securing Azure SQL Database data](sql-database-security-overview.md).

| Tutorial | Description |
| --- | --- | 
| [Secure sensitive data using Always Encrypted ](sql-database-always-encrypted-azure-key-vault.md) |In this tutorial, you use the Always Encrypted wizard to secure sensitive data in an Azure SQL database. |
|  | |

## Develop
In the following tutorials, you learn about application and database development.

| Tutorial | Description |
| --- | --- | 
| [Create a report using Excel](sql-database-connect-excel.md) |In this tutorial, you learn how to connect Excel to a SQL database in the cloud so you can import data and create tables and charts based on values in the database. |
| [Build an app using SQL Server](https://www.microsoft.com/sql-server/developer-get-started/) |In this tutorial, you learn how to build an application using SQL Server |
| [Temporal tables](sql-database-temporal-tables.md) | In this tutorial, you learn about temporal tables.
| [Use entity framework with elastic tools](sql-database-elastic-scale-use-entity-framework-applications-visual-studio.md) |In this tutorial, you learn the changes in an Entity Framework application that are needed to integrate with the Elastic Database tools. |
| [Adopt in-memory OLTP](sql-database-in-memory-oltp-migration.md) | In this tutorial, you learn how to use [in-memory OLTP](sql-database-in-memory.md) to improve the performance of transaction processing. |
| [Code First to a New Database](https://msdn.microsoft.com/data/jj193542.aspx) | In this tutorial, you learn about code first development.
| [Tailspin Surveys sample application](https://github.com/Azure-Samples/guidance-identity-management-for-multitenant-apps/blob/master/docs/running-the-app.md) | IN this tutorial, you work with the Tailspon Surveys sample application. |
| [Contoso Clinic demo application](https://github.com/Microsoft/azure-sql-security-sample) | In this tutorial, you work with the Contoso Clinic demo application. |
|  | |

## Data sync
In this tutorial, you learn about [Data Sync](http://download.microsoft.com/download/4/E/3/4E394315-A4CB-4C59-9696-B25215A19CEF/SQL_Data_Sync_Preview.pdf).

| Tutorial | Description |
| --- | --- | 
| [Getting Started with Azure SQL Data Sync (Preview)](sql-database-get-started-sql-data-sync.md) |In this tutorial, you learn the fundamentals of Azure SQL Data Sync using the Azure Classic Portal. |
|  | |

## Monitor and tune
In the following tutorials, you learn about monitoring and tuning.
| Tutorial | Description |
| --- | --- | 
| [Elastic Pool telemetry using PowerShell](https://github.com/Microsoft/sql-server-samples/tree/master/samples/manage/azure-sql-db-elastic-pools)| In this tutorial, you learn about collecting elastic pool telemetry using PowerShell. |
| [Elastic Pool custom dashboard for SaaS](https://github.com/Microsoft/sql-server-samples/tree/master/samples/manage/azure-sql-db-elastic-pools-custom-dashboard) | In this tutorial, you learn about creating a custom dashboard for monitoring elastic pools. |
| [Capture extended event to event file target](sql-database-xevent-code-event-file.md)| In this tutorial, you learn to capture extended events to an event target file.|
| [Capture extended event to ring buffer target](sql-database-xevent-code-ring-buffer.md)| In this tutorial, you learn to capture extended events to an code ring buffer.|
|  | |


