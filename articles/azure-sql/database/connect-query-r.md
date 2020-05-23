---
title: Use R with Azure SQL Database Machine Learning Services (preview) to query a database 
titleSuffix: Azure SQL Database Machine Learning Services (preview)
description: This article shows you how to use an R script with Azure SQL Database Machine Learning Services to connect to a database in Azure SQL Database and query it using Transact-SQL statements.
services: sql-database
ms.service: sql-database
ms.subservice: machine-learning
ms.custom: sqldbrb=2 
ms.devlang: python
ms.topic: quickstart
author: garyericson
ms.author: garye
ms.reviewer: davidph, carlrab
manager: cgronlun
ms.date: 05/29/2019
ROBOTS: NOINDEX
---

# Quickstart: Use R with Azure SQL Database Machine Learning Services (preview) to query a database 

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

In this quickstart, you use R with Azure SQL Database Machine Learning Services to connect to a database in Azure SQL Database and use T-SQL statements to query data.

[!INCLUDE[ml-preview-note](../../../includes/sql-database-ml-preview-note.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An [Azure SQL Database](single-database-create-quickstart.md)
- [Machine Learning Services](machine-learning-services-overview.md) with R enabled.
- [SQL Server Management Studio](/sql/ssms/sql-server-management-studio-ssms) (SSMS)

> [!IMPORTANT]
> The scripts in this article are written to use the **Adventure Works** database.

Machine Learning Services with R is a feature of Azure SQL Database used for executing in-database R scripts. For more information, see the [R Project](https://www.r-project.org/).

## Get the SQL Server connection information

Get the connection information you need to connect to the database in Azure SQL Database. You'll need the fully qualified server name or host name, database name, and login information for the upcoming procedures.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Navigate to the **SQL Databases**  or **SQL Managed Instances** page.

3. On the **Overview** page, review the fully qualified server name next to **Server name** for a database in Azure SQL Database or the fully qualified server name next to **Host** for a managed instance in Azure SQL Managed Instance. To copy the server name or host name, hover over it and select the **Copy** icon.

## Create code to query your database

1. Open **SQL Server Management Studio** and connect to your database.

   If you need help connecting, see [Quickstart: Use SQL Server Management Studio to connect and query a database in Azure SQL Database](connect-query-ssms.md).

1. Pass the complete R script to the [sp_execute_external_script](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql) stored procedure.

   The script is passed through the `@script` argument. Everything inside the `@script` argument must be valid R code.
   
   >[!IMPORTANT]
   >The code in this example uses the sample AdventureWorksLT data, which you can choose as source when creating your database. If your database has different data, use tables from your own database in the SELECT query. 

    ```sql
    EXECUTE sp_execute_external_script
    @language = N'R'
    , @script = N'OutputDataSet <- InputDataSet;'
    , @input_data_1 = N'SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid'
    ```

   > [!NOTE]
   > If you get any errors, it might be because the public preview of Machine Learning Services (with R) is not enabled for your database. See [Prerequisites](#prerequisites) above.

## Run the code

1. Execute the [sp_execute_external_script](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql) stored procedure.

1. Verify that the top 20 Category/Product rows are returned in the **Messages** window.

## Next steps

- [Design your first database in Azure SQL Database](design-first-database-tutorial.md)
- [Azure SQL Database Machine Learning Services (with R)](machine-learning-services-overview.md)
- [Create and run simple R scripts in Azure SQL Database Machine Learning Services (preview)](r-script-create-quickstart.md)
- [Write advanced R functions in Azure SQL Database using Machine Learning Services (preview)](machine-learning-services-functions.md)
