---
title: "Tutorial: Prepare data to perform clustering in R"
titleSuffix: Azure SQL Database Machine Learning Services (preview)
description: In part one of this three-part tutorial series, you'll prepare the data from an Azure SQL database to perform clustering in R with Azure SQL Database Machine Learning Services (preview).
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

# Tutorial: Prepare data to perform clustering in R with Azure SQL Database Machine Learning Services (preview)

In part one of this three-part tutorial series, you'll prepare the data from an Azure SQL database to perform clustering in R with Azure SQL Database Machine Learning Services (preview).

*Clustering* can be explained as organizing data into groups where members of a group are similar in some way.
You'll use the **K-Means** algorithm to perform the clustering of customers in a dataset of product purchases and returns. By clustering customers, you can focus your marketing efforts more effectively by targeting specific groups.
K-Means clustering is an *unsupervised learning* algorithm that looks for patterns in data based on similarities.

In this article, you'll learn how to:

> [!div class="checklist"]
> * Import a sample database into an Azure SQL database
> * Separate customers along different dimensions
> * Load the data from the Azure SQL database into a data frame using R

In [part two](sql-database-tutorial-clustering-model-build.md), you'll learn how to create and train a K-Means clustering model.

In [part three](sql-database-tutorial-clustering-model-deploy.md), you'll learn how to create a stored procedure in an Azure SQL database that can perform clustering based on new data.

[!INCLUDE[ml-preview-note](../../includes/sql-database-ml-preview-note.md)]

## Prerequisites

* Azure subscription - If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/) before you begin.

* Azure SQL Database Server with Machine Learning Services enabled - During the public preview, Microsoft will onboard you and enable machine learning for your existing or new databases. Follow the steps in [Sign up for the preview](sql-database-machine-learning-services-overview.md#signup).

* RevoScaleR package - See [RevoScaleR](https://docs.microsoft.com/sql/advanced-analytics/r/ref-r-revoscaler?view=sql-server-2017#versions-and-platforms) for options to install this package locally.

* R IDE - This tutorial uses [RStudio Desktop](https://www.rstudio.com/products/rstudio/download/).

* SQL query tool - This tutorial assumes you're using [Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/what-is) or [SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/sql-server-management-studio-ssms) (SSMS).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Import the sample database

The sample dataset used in this tutorial has been saved to a **.bacpac** database backup file for you to download and use. This dataset is derived from the [tpcx-bb](http://www.tpc.org/tpcx-bb/default.asp) dataset provided by the [Transaction Processing Performance Council (TPC)](http://www.tpc.org/default.asp).

1. Download the file [tpcxbb_1gb.bacpac](https://sqlchoice.blob.core.windows.net/sqlchoice/static/tpcxbb_1gb.bacpac).

1. Follow the directions in [Import a BACPAC file to create an Azure SQL database](https://docs.microsoft.com/azure/sql-database/sql-database-import), using these details:

   * Import from the **tpcxbb_1gb.bacpac** file you downloaded
   * During the public preview, choose the **Gen5/vCore** configuration for the new database
   * Name the new database "tpcxbb_1gb"

## Separate customers

Create a new RScript file in RStudio and run the following script.
In the SQL query, you're separating customers along the following dimensions:

* **orderRatio** = return order ratio (total number of orders partially or fully returned versus the total number of orders)
* **itemsRatio** = return item ratio (total number of items returned versus the number of items purchased)
* **monetaryRatio** = return amount ratio (total monetary amount of items returned versus the amount purchased)
* **frequency** = return frequency

In the **paste** function, replace **Server**, **UID**, and **PWD** with your own connection information.

```r
# Define the connection string to connect to the tpcxbb_1gb database
connStr <- paste("Driver=SQL Server",
               "; Server=", "<Azure SQL Database Server>",
               "; Database=tpcxbb_1gb",
               "; UID=", "<user>",
               "; PWD=", "<password>",
                  sep = "");


#Define the query to select data from SQL Server
input_query <- "
SELECT ss_customer_sk AS customer
    ,round(CASE 
            WHEN (
                       (orders_count = 0)
                    OR (returns_count IS NULL)
                    OR (orders_count IS NULL)
                    OR ((returns_count / orders_count) IS NULL)
                    )
                THEN 0.0
            ELSE (cast(returns_count AS NCHAR(10)) / orders_count)
            END, 7) AS orderRatio
    ,round(CASE 
            WHEN (
                     (orders_items = 0)
                  OR (returns_items IS NULL)
                  OR (orders_items IS NULL)
                  OR ((returns_items / orders_items) IS NULL)
                 )
            THEN 0.0
            ELSE (cast(returns_items AS NCHAR(10)) / orders_items)
            END, 7) AS itemsRatio
    ,round(CASE 
            WHEN (
                     (orders_money = 0)
                  OR (returns_money IS NULL)
                  OR (orders_money IS NULL)
                  OR ((returns_money / orders_money) IS NULL)
                 )
            THEN 0.0
            ELSE (cast(returns_money AS NCHAR(10)) / orders_money)
            END, 7) AS monetaryRatio
    ,round(CASE 
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
"
```

## Load the data into a data frame

Now use the following script to return the results from the query to an R data frame using the **rxSqlServerData** function.
As part of the process, you'll define the type for the selected columns (using colClasses) to make sure that the types are correctly transferred to R.

```r
# Query SQL Server using input_query and get the results back
# to data frame customer_returns
# Define the types for selected columns (using colClasses),
# to make sure that the types are correctly transferred to R
customer_returns <- rxSqlServerData(
                     sqlQuery=input_query,
                     colClasses=c(customer ="numeric",
                                  orderRatio="numeric",
                                  itemsRatio="numeric",
                                  monetaryRatio="numeric",
                                  frequency="numeric" ),
                     connectionString=connStr);

# Transform the data from an input dataset to an output dataset
customer_data <- rxDataStep(customer_returns);

# Take a look at the data just loaded from SQL Server
head(customer_data, n = 5);
```

You should see results similar to the following.

```results
  customer orderRatio itemsRatio monetaryRatio frequency
1    29727          0          0      0.000000         0
2    26429          0          0      0.041979         1
3    60053          0          0      0.065762         3
4    97643          0          0      0.037034         3
5    32549          0          0      0.031281         4
```

## Clean up resources

***If you're not going to continue with this tutorial***, delete the tpcxbb_1gb database from your Azure SQL Database server.

From the Azure portal, follow these steps:

1. From the left-hand menu in the Azure portal, select **All resources** or **SQL databases**.
1. In the **Filter by name...** field, enter **tpcxbb_1gb**, and select your subscription.
1. Select your **tpcxbb_1gb** database.
1. On the **Overview** page, select **Delete**.

## Next steps

In part one of this tutorial series, you completed these steps:

* Import a sample database into an Azure SQL database
* Separate customers along different dimensions
* Load the data from the Azure SQL database into a data frame using R

To create a machine learning model that uses this customer data, follow part two of this tutorial series:

> [!div class="nextstepaction"]
> [Tutorial: Create a predictive model in R with Azure SQL Database Machine Learning Services (preview)](sql-database-tutorial-clustering-model-build.md)
