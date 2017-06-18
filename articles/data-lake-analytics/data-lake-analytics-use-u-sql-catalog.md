---
title: Introduce Azure Data Lake Analytics U-SQL catalog | Microsoft Docs
description: Introduce Azure Data Lake Analytics U-SQL catalog
services: data-lake-analytics
documentationcenter: ''
author: edmacauley
manager: jhubbard
editor: cgronlun

ms.assetid: 55fef96f-e941-4d09-af5e-dd7c88c502b2
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 12/05/2016
ms.author: edmaca

---
# Use Azure Data Lake Analytics (U-SQL) catalog
The U-SQL catalog is used to structure data and code so they can be shared by U-SQL scripts. The catalog enables the highest performance possible with data in Azure Data Lake.

Each Azure Data Lake Analytics account has exactly one U-SQL Catalog associated with it. You cannot delete the U-SQL Catalog. Currently U-SQL Catalogs cannot be shared between Data Lake Store accounts.

Each U-SQL Catalog contains a database called **Master**. The Master Database cannot be deleted.  Each U-SQL Catalog can contain more additional databases.

U-SQL database contains:

* Assemblies – share .NET code among U-SQL scripts.
* Table-values functions – share U-SQL code among U-SQL scripts.
* Tables – share data among U-SQL scripts.
* Schemas - share table schemas among U-SQL scripts.

## Manage catalogs
Each Azure Data Lake Analytics account has a default Azure Data Lake Store account associated with it. This Data Lake Store account is referred as the default Data Lake Store account. U-SQL catalog is stored in the default Data Lake Store account under the /catalog folder. Do not delete any files in the /catalog folder.

### Use Azure portal
See [Manage Data Lake Analytics using portal](data-lake-analytics-manage-use-portal.md#manage-data-lake-analytics-accounts)

### Use Data Lake Tools for Visual Studio.
You can use Data Lake Tools for Visual Studio to manage the catalog.  For more information about the tools, see [Using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).

**To manage the catalog**

1. Open Visual Studio, and connect to azure. For the instructions, see [Connect to Azure](data-lake-analytics-data-lake-tools-get-started.md#connect-to-an-azure-data-lake-analytics-account).
2. Open **Server Explorer** by press **CTRL+ALT+S**.
3. From **Server Explorer**, expand **Azure**, expand **Data Lake Analytics**, expand your Data Lake Analytics account, expand **Databases**, and then expand **master**.

    - To add a new Database, right-click **Database**, and then click **Create Database**.
    - To add a new assembly, right-click **Assemblies**, and then click **Register Assembly**.
    - To add a new schema, right-click **Schemas**, and then click **Create Schema**.
    - To add a new table, right-click **Tables**, and then click **Create Table**.
    - To add a new table-valued function, see [Develop U-SQL user-defined operators for Data Lake Analytics jobs](data-lake-analytics-u-sql-develop-user-defined-operators.md).


![Browse U-SQL Visual Studio catalogs](./media/data-lake-analytics-use-u-sql-catalog/data-lake-analytics-browse-catalogs.png)

## Nest steps
  * [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md)
  * [Use U-SQL window functions for Azure Data Lake Analytics jobs](data-lake-analytics-use-window-functions.md)
  * [Develop U-SQL user-defined operators for Data Lake Analytics jobs](data-lake-analytics-u-sql-develop-user-defined-operators.md)
