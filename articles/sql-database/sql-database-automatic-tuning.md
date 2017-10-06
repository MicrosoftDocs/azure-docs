---
title: Azure SQL Database - automatic tuning | Microsoft Docs
description: Azure SQL Database analyzes SQL query and automatically adapts to user workload.
services: sql-database
documentationcenter: ''
author: jovanpop-msft
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: monitor & tune
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/19/2017
ms.author: jovanpop

---
# Automatic tuning in Azure SQL Database

Azure SQL Database is a fully managed data service that monitors the queries that are executed on the database and automatically improves performance of the database workload. Azure SQL Database has a built-in [Automatic tuning](https://docs.microsoft.com/sql/relational-databases/automatic-tuning/automatic-tuning) intelligence mechanism that can automatically tune and improve performance of your queries by dynamically adapting the database to your workload. Automatic tuning in Azure SQL Database might be one of the most important features that you can enable on Azure SQL Database to optimize performance of your queries.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure-in-the-Enterprise/Enabling-Azure-SQL-Database-Auto-Tuning-at-Scale-for-Microsoft-IT/player]
>

## Automatic tuning options

[Automatic tuning](https://docs.microsoft.com/sql/relational-databases/automatic-tuning/automatic-tuning) options available in Azure SQL Database are:
 1. **CREATE INDEX** that identifies the indexes that may improve performance of your workload, creates the indexes, and verifies that they improve performance of the queries.
 2. **DROP INDEX** that identifies redundant and duplicate indexes, and indexes that were not used in the long period of time.
 3. **PLAN REGRESSION CORRECTION** that identifies SQL queries that are using execution plan that are slower than previous good plan, and uses the last known good plan instead of the regressed plan.

Azure SQL Database identifies **CREATE INDEX**, **DROP INDEX**, and **PLAN REGRESSION CORRECTION** recommendations that can optimize your database and shows them in Azure portal. Find more information about identification of indexes that should be changed at [Find index recommendations in Azure portal](sql-database-advisor-portal.md). You can either manually apply recommendations using the portal or you can let Azure SQL Database to automatically apply recommendations, monitor workload after the change, and verify that the recommendation improved the performance of your workload.

Automatic tuning options can be independently turned on or off per database, or they can be configured on logical server and applied on every database that inherits settings from the server. Configuring [Automatic tuning](https://docs.microsoft.com/sql/relational-databases/automatic-tuning/automatic-tuning) options on the server and inheriting settings on the databases in the server is recommended method for configuring automatic tuning because it simplifies management of automatic tuning options on a large number of databases.

See this article for the steps to [enable automatic tuning](sql-database-automatic-tuning-enable.md) using the Azure portal.

## Next steps

- To enable automatic tuning in Azure SQL Database and let automatic tuning feature fully manage your workload, see [Enable automatic tuning](sql-database-automatic-tuning-enable.md).
- To use manual tuning, you can review [Tuning recommendations in Azure portal](sql-database-advisor-portal.md) and manually apply the ones that improve performance of your queries.
- Read more about built-in intelligence that tunes the [Azure SQL Database](https://azure.microsoft.com/blog/artificial-intelligence-tunes-azure-sql-databases/).
- Read more about [Automatic tuning](https://docs.microsoft.com/sql/relational-databases/automatic-tuning/automatic-tuning) in Azure SQL Database and SQL Server 2017.
