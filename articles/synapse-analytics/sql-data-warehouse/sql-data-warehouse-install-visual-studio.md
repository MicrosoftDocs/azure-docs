---
title: Install Visual Studio 2019
description: Install Visual Studio and SQL Server Development Tools (SSDT) for Synapse SQL
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 05/11/2020
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom:
  - vs-azure
  - azure-synapse
---

# Getting started with Visual Studio 2019

Visual Studio **2019** SQL Server Data Tools (SSDT) is a single tool allowing you to do the following:

- Connect, query, and develop applications
- Leverage an object explorer to visually explore all objects in your data model including tables, views, stored procedures, and etc.
- Generate T-SQL data definition language (DDL) scripts for your objects
- Develop your data warehouse using a state-based approach with SSDT Database Projects
- Integrate your database project with source control systems such as Git with Azure Repos
- Set up continuous integration and deployment pipelines with automation servers such as Azure DevOps

## Install Visual Studio 2019

See [Download Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) to download and install Visual Studio **16.3 and above**. During install, select the data storage and processing workload. Standalone SSDT installation is no longer required in Visual Studio 2019.

## Unsupported features in SSDT

There are times when feature releases for Synapse SQL may not include support for SSDT. The following features are currently unsupported:


- [Workload management](sql-data-warehouse-workload-management.md) - workload groups and classifiers
- [Row-level security](/sql/relational-databases/security/row-level-security?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) (including table-valued functions)
  - Submit a [support ticket or vote](https://feedback.azure.com/d365community/idea/a9192b4c-0b25-ec11-b6e6-000d3a4f07b8) to get the feature supported.
  - Submit a [support ticket or vote](https://feedback.azure.com/d365community/idea/ab192b4c-0b25-ec11-b6e6-000d3a4f07b8) to get the feature supported.
- Certain T-SQL features, such as:
   - *WITHIN GROUP* clause in the [STRING_AGG](/sql/t-sql/functions/string-agg-transact-sql) string function.

## Next steps

Now that you have the latest version of SSDT, you're ready to [connect](sql-data-warehouse-query-visual-studio.md) to your SQL pool.
