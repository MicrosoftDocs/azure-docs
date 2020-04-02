---
title: Install Visual Studio 2019 
description: Install Visual Studio and SQL Server Development Tools (SSDT) for Synapse SQL
services: synapse-analytics
ms.custom: vs-azure, azure-synapse
ms.workload: azure-vs
author: kevinvngo
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: 
ms.date: 02/04/2020
ms.author: kevin
ms.reviewer: igorstan
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
See [Download Visual Studio 2019][] to download and install Visual Studio **16.3 and above**. During install, select the data storage and processing workload. Standalone SSDT installation is no longer required in Visual Studio 2019.

## Unsupported features in SSDT

There are times when feature releases for Synapse SQL may not include support for SSDT. The following features are currently unsupported:

- [Materialized views](https://docs.microsoft.com/sql/t-sql/statements/create-materialized-view-as-select-transact-sql?view=azure-sqldw-latest) (in progress)
- [Ordered Clustered Columnstore Indexes](https://docs.microsoft.com/sql/t-sql/statements/create-columnstore-index-transact-sql?view=azure-sqldw-latest#examples--and-) (in progress)
- [COPY statement](https://docs.microsoft.com/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest) (in progress)
- [Workload management](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-workload-management) - workload groups and classifiers (in progress)
- [Row-level security](https://docs.microsoft.com/sql/relational-databases/security/row-level-security?view=sql-server-ver15)
  - Submit a support ticket or vote [here](https://feedback.azure.com/forums/307516-sql-data-warehouse/suggestions/39040057-ssdt-row-level-security) to get the feature supported.
- [Dynamic data masking](https://docs.microsoft.com/sql/relational-databases/security/dynamic-data-masking?toc=%2Fazure%2Fsql-data-warehouse%2Ftoc.json&view=sql-server-2017#defining-a-dynamic-data-mask)
  - Submit a support ticket or vote [here](https://feedback.azure.com/forums/307516-sql-data-warehouse/suggestions/39040048-ssdt-support-dynamic-data-masking) to get the feature supported. 
- [PREDICT](https://docs.microsoft.com/sql/t-sql/queries/predict-transact-sql?view=sql-server-ver15&viewFallbackFrom=azure-sqldw-latest) function 
- [Tables with constraints](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-table-constraints#table-constraints) are not supported. For these table objects, set the build action to "None".

## Next steps

Now that you have the latest version of SSDT, you're ready to [connect](sql-data-warehouse-query-visual-studio.md) to your SQL pool.




<!--Other-->

[Download Visual Studio 2019]: https://visualstudio.microsoft.com/downloads/
[Installing Visual Studio]: https://msdn.microsoft.com/library/e2h7fzkw.aspx
[SSDT Download]: https://msdn.microsoft.com/library/mt204009.aspx
[UserVoice]: https://feedback.azure.com/forums/307516-sql-data-warehouse/suggestions/13313247-database-project-from-visual-studio-to-support-azu
