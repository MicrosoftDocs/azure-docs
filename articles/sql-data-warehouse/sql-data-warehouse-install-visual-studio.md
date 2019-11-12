---
title: Install Visual Studio 2019 
description: Install Visual Studio and SQL Server Development Tools (SSDT) for Azure SQL Data Warehouse
services: sql-data-warehouse
ms.custom: vs-azure
ms.workload: azure-vs
author: kevinvngo
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: development
ms.date: 11/06/2019
ms.author: kevin
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---

# Getting started with Visual Studio 2019 for SQL Data Warehouse
Visual Studio **2019** SQL Server Data Tools (SSDT) is a single tool allowing you to do the following:

- Connect, query, and develop applications for SQL Data Warehouse 
- Leverage an object explorer to visually explore all objects in your data model including tables, views, stored procedures, and etc.
- Generate T-SQL data definition language (DDL) scripts for your objects
- Develop your data warehouse using a state-based approach with SSDT Database Projects
- Integrate your database project with source control systems such as Git with Azure Repos
- Set up continuous integration and deployment pipelines with automation servers such as Azure DevOps

## Install Visual Studio 2019
See [Download Visual Studio 2019][] to download and install Visual Studio **16.3 and above**. During install, select the data storage and processing workload. Standalone SSDT installation is no longer required in Visual Studio 2019.

## Next steps
Now that you have the latest version of SSDT, you're ready to [connect][connect] to your SQL Data Warehouse.

<!--Anchors-->

<!--Image references-->

<!--Articles-->
[connect]: ./sql-data-warehouse-query-visual-studio.md

<!--Other-->
[Download Visual Studio 2019]: https://visualstudio.microsoft.com/downloads/
[Installing Visual Studio]: https://msdn.microsoft.com/library/e2h7fzkw.aspx
[SSDT Download]: https://msdn.microsoft.com/library/mt204009.aspx
[UserVoice]: https://feedback.azure.com/forums/307516-sql-data-warehouse/suggestions/13313247-database-project-from-visual-studio-to-support-azu
