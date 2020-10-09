---
title: 'Tutorial: Get started analyze data with serverles SQL' 
description: In this tutorial, you'll learn how to analyze data with SQL on-demand using data located in Spark databases.
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.topic: tutorial
ms.date: 07/20/2020 
---

# Analyze data with SQL on-demand

In this tutorial, you'll learn how to analyze data with serverless SQL using an on-demand SQL pool using data located in Spark databases. 

## Analyze NYC Taxi data in blob storage using SQL on-demand pool

1. In the **Data** hub under **Linked**, right-click on **Azure Blob Storage > Sample Datasets > nyc_tlc_yellow** and select **SELECT TOP 100 rows**
1. This will create a new SQL script with the following code:

    ```
    SELECT
        TOP 100 *
    FROM
        OPENROWSET(
            BULK     'https://azureopendatastorage.blob.core.windows.net/nyctlc/yellow/puYear=*/puMonth=*/*.parquet',
            FORMAT = 'parquet'
        ) AS [result];
    ```
1. Click **Run**

## Analyze NYC Taxi data in Spark databases using SQL on-demand

Tables in Spark databases are automatically visible, and they can be queried by SQL on-demand.

1. In Synapse Studio, go to the **Develop** hub and create a new SQL script.
1. Set **Connect to** to **SQL on-demand**.
1. Paste the following text into the script and run the script.

    ```sql
    SELECT *
    FROM nyctaxi.dbo.passengercountstats
    ```

    > [!NOTE]
    > The first time you run a query that uses SQL on-demand, it takes about 10 seconds for SQL on-demand to gather the SQL resources needed to run your queries. Subsequent queries will be much faster.
  


## Next steps

> [!div class="nextstepaction"]
> [Analyze data in Storage](get-started-analyze-storage.md)
