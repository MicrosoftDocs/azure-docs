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

> CHANGE TEXT BELOW

For this tutorial series, imagine you own a retail business and you want to group your customers based on characteristics they share. This information will help you target your marketing efforts at specific customers rather than treating all customers the same.

This tutorial is **part one of a three-part tutorial series**.

In part one, you'll learn how to:

> [!div class="checklist"]
> * Import a sample database into an Azure SQL database
> * Load the data from the Azure SQL database into a data frame using R
> * Prepare the data by identifying some columns as categorical

In [part two](sql-database-tutorial-predictive-model-build-compare.md), you'll learn how to create and train multiple models, and then choose the most accurate one.

In [part three](sql-database-tutorial-predictive-model-deploy.md), you'll learn how to store the model in a database, and then create a stored procedure that can make predictions based on new data.

[!INCLUDE[ml-preview-note](../../includes/sql-database-ml-preview-note.md)]

## Prerequisites

> PASTING CODE HERE TEMPORARILY

```r
#Connection string to connect to SQL Server. Don't forget to replace MyServer with the name of your SQL Server instance
connStr <- paste("Driver=SQL Server;Server=", " MyServer", ";Database=" , "tpcxbb_1gb" , ";Trusted_Connection=true;" , sep="" );

#The query that we are using to select data from SQL Server
input_query <- "
SELECT
  ss_customer_sk AS customer,
  round(CASE WHEN ((orders_count = 0) OR (returns_count IS NULL) OR (orders_count IS NULL) OR ((returns_count / orders_count) IS NULL) ) THEN 0.0 ELSE (cast(returns_count as nchar(10)) / orders_count) END, 7) AS orderRatio,
  round(CASE WHEN ((orders_items = 0) OR(returns_items IS NULL) OR (orders_items IS NULL) OR ((returns_items / orders_items) IS NULL) ) THEN 0.0 ELSE (cast(returns_items as nchar(10)) / orders_items) END, 7) AS itemsRatio,
  round(CASE WHEN ((orders_money = 0) OR (returns_money IS NULL) OR (orders_money IS NULL) OR ((returns_money / orders_money) IS NULL) ) THEN 0.0 ELSE (cast(returns_money as nchar(10)) / orders_money) END, 7) AS monetaryRatio,
  round(CASE WHEN ( returns_count IS NULL                                                                        ) THEN 0.0 ELSE  returns_count                 END, 0) AS frequency
  --cast(round(cast(CASE WHEN (returns_count IS NULL) THEN 0.0 ELSE  returns_count END as double)) as integer) AS frequency
FROM
  (
    SELECT
      ss_customer_sk,
      -- return order ratio
      COUNT(distinct(ss_ticket_number)) AS orders_count,
      -- return ss_item_sk ratio
      COUNT(ss_item_sk) AS orders_items,
      -- return monetary amount ratio
      SUM( ss_net_paid ) AS orders_money
    FROM store_sales s
    GROUP BY ss_customer_sk
  ) orders
  LEFT OUTER JOIN
  (
    SELECT
      sr_customer_sk,
      -- return order ratio
      count(distinct(sr_ticket_number)) as returns_count,
      -- return ss_item_sk ratio
      COUNT(sr_item_sk) as returns_items,
      -- return monetary amount ratio
      SUM( sr_return_amt ) AS returns_money
    FROM store_returns
    GROUP BY sr_customer_sk
  ) returned ON ss_customer_sk=sr_customer_sk
"
```