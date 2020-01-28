---
title: Use R with Machine Learning Services to query a database (preview)
titleSuffix: Azure SQL Database Machine Learning Services (preview)
description: This article shows you how to use an R script with Azure SQL Database Machine Learning Services to connect to an Azure SQL database and query it using Transact-SQL statements.
services: sql-database
ms.service: sql-database
ms.subservice: machine-learning
ms.custom: 
ms.devlang: python
ms.topic: quickstart
author: garyericson
ms.author: garye
ms.reviewer: davidph, carlrab
manager: cgronlun
ms.date: 05/29/2019
---
# Quickstart: Use R with Machine Learning Services to query an Azure SQL database (preview)

In this quickstart, you use R with Machine Learning Services to connect to an Azure SQL database and use T-SQL statements to query data.

[!INCLUDE[ml-preview-note](../../includes/sql-database-ml-preview-note.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An [Azure SQL database](sql-database-single-database-get-started.md)
- [Machine Learning Services](sql-database-machine-learning-services-overview.md) with R enabled. [Sign up for the preview](sql-database-machine-learning-services-overview.md#signup).
- [SQL Server Management Studio](/sql/ssms/sql-server-management-studio-ssms) (SSMS)

> [!IMPORTANT]
> The scripts in this article are written to use the **Adventure Works** database.

> [!NOTE]
> During the public preview, Microsoft will onboard you and enable machine learning for your existing or new database, however the managed instance deployment option is currently not supported.

Machine Learning Services with R is a feature of Azure SQL database used for executing in-database R scripts. For more information, see the [R Project](https://www.r-project.org/).

## Get SQL server connection information

Get the connection information you need to connect to the Azure SQL database. You'll need the fully qualified server name or host name, database name, and login information for the upcoming procedures.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Navigate to the **SQL databases**  or **SQL managed instances** page.

3. On the **Overview** page, review the fully qualified server name next to **Server name** for a single database or the fully qualified server name next to **Host** for a managed instance. To copy the server name or host name, hover over it and select the **Copy** icon.

## Create code to query your SQL database

1. Open **SQL Server Management Studio** and connect to your SQL database.

   If you need help connecting, see [Quickstart: Use SQL Server Management Studio to connect and query an Azure SQL database](sql-database-connect-query-ssms.md).

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
   > If you get any errors, it might be because the public preview of Machine Learning Services (with R) is not enabled for your SQL database. See [Prerequisites](#prerequisites) above.

## Run the code

1. Execute the [sp_execute_external_script](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql) stored procedure.

1. Verify that the top 20 Category/Product rows are returned in the **Messages** window.

## Next steps

- [Design your first Azure SQL database](sql-database-design-first-database.md)
- [Azure SQL Database Machine Learning Services (with R)](sql-database-machine-learning-services-overview.md)
- [Create and run simple R scripts in Azure SQL Database Machine Learning Services (preview)](sql-database-quickstart-r-create-script.md)
- [Write advanced R functions in Azure SQL Database using Machine Learning Services (preview)](sql-database-machine-learning-services-functions.md)
