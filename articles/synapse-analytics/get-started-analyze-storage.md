---
title: 'Tutorial: Get started analyze data in Storage accounts' 
description: In this tutorial, you'll learn how to analyze data located in a storage account.
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.topic: tutorial
ms.date: 07/20/2020 
---

# Analyze data in a storage account

In this tutorial, you'll learn how to analyze data located in a storage account.

## Overview

So far, we've covered scenarios where data resides in databases in the workspace. Now we'll show you how to work with files in storage accounts. In this scenario, we'll use the primary storage account of the workspace and container that we specified when creating the workspace.

* The name of the storage account: **contosolake**
* The name of the container in the storage account: **users**

### Create CSV and Parquet files in your storage account

Run the following code in a notebook. It creates a CSV file and a parquet file in the storage account.

```py
%%pyspark
df = spark.sql("SELECT * FROM nyctaxi.passengercountstats")
df = df.repartition(1) # This ensure we'll get a single file during write()
df.write.mode("overwrite").csv("/NYCTaxi/PassengerCountStats.csv")
df.write.mode("overwrite").parquet("/NYCTaxi/PassengerCountStats.parquet")
```

### Analyze data in a storage account

1. In Synapse Studio, go to the **Data** hub, and then select **Linked**.
1. Go to **Storage accounts** > **myworkspace (Primary - contosolake)**.
1. Select **users (Primary)**. You should see the **NYCTaxi** folder. Inside you should see two folders called **PassengerCountStats.csv** and **PassengerCountStats.parquet**.
1. Open the **PassengerCountStats.parquet** folder. Inside, you'll see a parquet file with a name like `part-00000-2638e00c-0790-496b-a523-578da9a15019-c000.snappy.parquet`.
1. Right-click **.parquet**, and then select **new notebook**. It creates a notebook that has a cell like this:

    ```py
    %%pyspark
    data_path = spark.read.load('abfss://users@contosolake.dfs.core.windows.net/NYCTaxi/PassengerCountStats.parquet/part-00000-1f251a58-d8ac-4972-9215-8d528d490690-c000.snappy.parquet', format='parquet')
    data_path.show(100)
    ```

1. Run the cell.
1. Right-click the parquet file inside, and then select **New SQL script** > **SELECT TOP 100 rows**. It creates a SQL script like this:

    ```sql
    SELECT TOP 100 *
    FROM OPENROWSET(
        BULK 'https://contosolake.dfs.core.windows.net/users/NYCTaxi/PassengerCountStats.parquet/part-00000-1f251a58-d8ac-4972-9215-8d528d490690-c000.snappy.parquet',
        FORMAT='PARQUET'
    ) AS [r];
    ```

    In the script window, the **Connect to** field is set to **SQL on-demand**.

1. Run the script.



## Next steps

> [!div class="nextstepaction"]
> [Orchestrate activities with pipelines](get-started-pipelines.md)
