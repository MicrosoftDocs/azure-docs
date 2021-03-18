---
title: 'Tutorial: Get started analyze data with serverless SQL pool' 
description: In this tutorial, you'll learn how to analyze data with a serverless SQL pool using data located in Spark databases.
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.subservice: sql
ms.topic: tutorial
ms.date: 12/31/2020
---

# Analyze data with serverless SQL pool in Azure Synapse Analytics

In this tutorial, you'll learn how to analyze data with serverless SQL pool using data located in Spark databases. 

## Analyze NYC Taxi data in blob storage using serverless SQL pool

1. In Synapse Studio go to the **Develop** hub
2. Create a new SQL script.
4. Paste the following code into the script.

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

## Next steps

> [!div class="nextstepaction"]
> [Analyze data with a serverless Spark pool](get-started-analyze-spark.md)
