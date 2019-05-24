---
title: "Tutorial: Deploy a clutering model in R"
titleSuffix: Azure SQL Database Machine Learning Services (preview)
description: In part three of this three-part tutorial series, you'll deploy a clustering model in R with Azure SQL Database Machine Learning Services (preview).
services: sql-database
ms.service: sql-database
ms.subservice: machine-learning
ms.custom:
ms.devlang: r
ms.topic: tutorial
author: garyericson
ms.author: garye
ms.reviewer: davidph
manager: cgronlun
ms.date: 05/17/2019
---

# Tutorial: Deploy a clutering model in R with Azure SQL Database Machine Learning Services (preview)

In part three of this three-part tutorial series, you'll deploy a clustering model in R with Azure SQL Database Machine Learning Services (preview).

You'll create a stored procedure with an embedded R script that performs clustering. Because your model executes in the Azure SQL database, it can easily be trained against data stored in the database.

In this article, you'll learn how to:

> [!div class="checklist"]
> * Create a stored procedure that generates the model

In [part one](sql-database-tutorial-clustering-model-prepare-data.md), you learned how to prepare the data from an Azure SQL database to perform clustering in R.

In [part two](sql-database-tutorial-clustering-model-build.md), you learned how to build a K-Means model to perform clustering.

[!INCLUDE[ml-preview-note](../../includes/sql-database-ml-preview-note.md)]

## Prerequisites

* Part three of this tutorial series assumes you have completed [**part one**](sql-database-tutorial-clustering-model-prepare-data.md) and [**part two**](sql-database-tutorial-clustering-model-build-compare.md).

## Create a stored procedure that generates the model

Run the following T-SQL script to create the stored procedure.

```sql
USE [tpcxbb_1gb]
DROP PROC IF EXISTS generate_customer_return_clusters;
GO
CREATE procedure [dbo].[generate_customer_return_clusters]
AS
/*
  This procedure uses R to classify customers into different groups based on their
  purchase & return history.
*/
BEGIN
	DECLARE @duration FLOAT
	, @instance_name NVARCHAR(100) = @@SERVERNAME
	, @database_name NVARCHAR(128) = db_name()
-- Input query to generate the purchase history & return metrics
	, @input_query NVARCHAR(MAX) = N'
SELECT ss_customer_sk AS customer,
    round(CASE 
            WHEN (
                    (orders_count = 0)
                    OR (returns_count IS NULL)
                    OR (orders_count IS NULL)
                    OR ((returns_count / orders_count) IS NULL)
                    )
                THEN 0.0
            ELSE (cast(returns_count AS NCHAR(10)) / orders_count)
            END, 7) AS orderRatio,
    round(CASE 
            WHEN (
                    (orders_items = 0)
                    OR (returns_items IS NULL)
                    OR (orders_items IS NULL)
                    OR ((returns_items / orders_items) IS NULL)
                    )
                THEN 0.0
            ELSE (cast(returns_items AS NCHAR(10)) / orders_items)
            END, 7) AS itemsRatio,
    round(CASE 
            WHEN (
                    (orders_money = 0)
                    OR (returns_money IS NULL)
                    OR (orders_money IS NULL)
                    OR ((returns_money / orders_money) IS NULL)
                    )
                THEN 0.0
            ELSE (cast(returns_money AS NCHAR(10)) / orders_money)
            END, 7) AS monetaryRatio,
    round(CASE 
            WHEN (returns_count IS NULL)
                THEN 0.0
            ELSE returns_count
            END, 0) AS frequency
FROM (
    SELECT ss_customer_sk,
        -- return order ratio
        COUNT(DISTINCT (ss_ticket_number)) AS orders_count,
        -- return ss_item_sk ratio
        COUNT(ss_item_sk) AS orders_items,
        -- return monetary amount ratio
        SUM(ss_net_paid) AS orders_money
    FROM store_sales s
    GROUP BY ss_customer_sk
    ) orders
LEFT OUTER JOIN (
    SELECT sr_customer_sk,
        -- return order ratio
        count(DISTINCT (sr_ticket_number)) AS returns_count,
        -- return ss_item_sk ratio
        COUNT(sr_item_sk) AS returns_items,
        -- return monetary amount ratio
        SUM(sr_return_amt) AS returns_money
    FROM store_returns
    GROUP BY sr_customer_sk
    ) returned ON ss_customer_sk = sr_customer_sk
 '
EXECUTE sp_execute_external_script
      @language = N'R'
    , @script = N'
# Define the connection string
connStr <- paste("Driver=SQL Server; Server=", instance_name,
               "; Database=", database_name,
               "; Trusted_Connection=true; ",
                  sep="" );

# Input customer data that needs to be classified. This is the result we get from our query
customer_returns <- RxSqlServerData(sqlQuery = input_query,
                     colClasses = c(customer = "numeric", orderRatio = "numeric", itemsRatio = "numeric", monetaryRatio = "numeric", frequency = "numeric"),
                     connectionString = connStr);

# Output table to hold the customer cluster mappings
return_cluster = RxSqlServerData(table = "customer_return_clusters", connectionString = connStr);

# set.seed for random number generator for predictability
set.seed(10);

# generate clusters using rxKmeans and output clusters to a table called "customer_return_clusters".
clust <- rxKmeans( ~ orderRatio + itemsRatio + monetaryRatio + frequency,
                   customer_returns,
                   numClusters = 4,
                   outFile = return_cluster,
                   outColName = "cluster",
                   writeModelVars = TRUE ,
                   extraVarsToWrite = c("customer"),
                   overwrite = TRUE);
'
    , @input_data_1 = N''
    , @params = N'@instance_name nvarchar(100), @database_name nvarchar(128), @input_query nvarchar(max), @duration float OUTPUT'
    , @instance_name = @instance_name
    , @database_name = @database_name
    , @input_query = @input_query
    , @duration = @duration OUTPUT;
END;

GO
```

You have now created a stored procedure that contains the R script for clustering.

## Next steps

In part three of this tutorial series, you completed this step:

* Create a stored procedure that generates the model

To learn more about using R in Azure SQL Database Machine Learning Services (preview), see:

* [Tutorial: Prepare data to train a predictive model in R with Azure SQL Database Machine Learning Services (preview)](sql-database-tutorial-predictive-model-prepare-data.md)
* [Write advanced R functions in Azure SQL Database using Machine Learning Services (preview)](sql-database-machine-learning-services-functions.md)
* [Work with R and SQL data in Azure SQL Database Machine Learning Services (preview)](sql-database-machine-learning-services-data-issues.md)
* [Add an R package to Azure SQL Database Machine Learning Services (preview)](sql-database-machine-learning-services-add-r-packages.md)
