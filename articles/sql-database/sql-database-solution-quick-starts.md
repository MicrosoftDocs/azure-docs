<properties
   pageTitle="Azure SQL Database Solution Quick Starts | Microsoft Azure"
   description="Learn about Azure SQL Database Solutions"
   services="sql-database"
   documentationCenter=""
   authors="carlrabeler"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="sqldb-quickstart"
   ms.date="06/01/2016"
   ms.author="carlrab"/>

# Explore Azure SQL Database Solution Quick Starts

This article contains an overview of the Azure SQL Database Solution Quick Starts. These Quick Starts demonstrate the use of SQL Database in complete solution based on real world scenarios. For simple step-by-step tutorials demonstrating the use of a particular Azure SQL Database feature, see [Explore Azure SQL Database Tutorials](sql-database-explore-tutorials.md).

## Collect and monitor resource usage data across multiple pools

This Solution Quick Start provides a solution for collecting and monitoring Azure SQL Database resource usage accross multiple pools in a subscription. When you have a large number of databases in a subscription, it is cumbersome to monitor each elastic pool separately. To solve this, you can combine SQL database PowerShell cmdlets and T-SQL queries to collect resource usage data from multiple pools and their databases for monitoring and analysis of resource usage. 

[Manage Mulitiple Elastic Pools in SQL Database Using PowerShell and Power BI](https://github.com/Microsoft/sql-server-samples/tree/master/samples/manage/azure-sql-db-elastic-pools) in the GitHub SQL Server samples repository provides a set of powershell scripts and T-SQL queries along with documentation on what it does and how to use it.

## Get started using Elastic Pools in a SaaS scenario

This Solution Quick Start provides a solution for a Softwware-as-a-Solution (SaaS) scenario that leverages Elastic Pools to provide a cost-effective, scalable database back-end of a SaaS application. In this solution, you will walk-though the implementation of a web app that lets you visualize the load created on an Elastic Pool by a load generator using a custom dashboard that supplements the Azure Portal.

[Saas-scenario-with-elastic-pools](https://github.com/Microsoft/sql-server-samples/tree/master/samples/manage/azure-sql-db-elastic-pools) in the GitHub SQL Server samples repository provides a load generator and monitoring web app along with the documentation on what it does and how to use it.

## Next Steps

[Explore Azure SQL Database Tutorials](sql-database-explore-tutorials.md)