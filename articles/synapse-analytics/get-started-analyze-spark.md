---
title: 'Quickstart: Get started analyzing with Spark' 
description: In this tutorial, you'll learn to analyze data with Apache Spark.
author: saveenr
ms.author: saveenr
ms.reviewer: sngun
ms.service: synapse-analytics
ms.subservice: spark
ms.topic: tutorial
ms.date: 11/18/2022
---

# Analyze with Apache Spark

In this tutorial, you'll learn the basic steps to load and analyze data with Apache Spark for Azure Synapse.

## Create a serverless Apache Spark pool

1. In Synapse Studio, on the left-side pane, select **Manage** > **Apache Spark pools**.
1. Select **New** 
1. For **Apache Spark pool name** enter **Spark1**.
1. For **Node size** enter **Small**.
1. For **Number of nodes** Set the minimum to 3 and the maximum to 3
1. Select **Review + create** > **Create**. Your Apache Spark pool will be ready in a few seconds.

## Understanding serverless Apache Spark pools

A serverless Spark pool is a way of indicating how a user wants to work with Spark. When you start using a pool, a Spark session is created if needed. The pool controls how many Spark resources will be used by that session and how long the session will last before it automatically pauses. You pay for spark resources used during that session and not for the pool itself. This way a Spark pool lets you use Apache Spark without managing clusters. This is similar to how a serverless SQL pool works.

## Analyze NYC Taxi data with a Spark pool

> [!NOTE]
> Make sure you have [placed the sample data in the primary storage account](get-started-create-workspace.md#place-sample-data-into-the-primary-storage-account).

1. In Synapse Studio, go to the **Develop** hub.
1. Create a new notebook.
1. Create a new code cell and paste the following code in that cell:

    ```py
    %%pyspark
    df = spark.read.load('abfss://users@contosolake.dfs.core.windows.net/NYCTripSmall.parquet', format='parquet')
    display(df.limit(10))
    ```

1. Modify the load URI, so it references the sample file in your storage account according to the [abfss URI scheme](../storage/blobs/data-lake-storage-introduction-abfs-uri.md).
1. In the notebook, in the **Attach to** menu, choose the **Spark1** serverless Spark pool that we created earlier.
1. Select **Run** on the cell. Synapse will start a new Spark session to run this cell if needed. If a new Spark session is needed, initially it will take about 2 to 5 minutes to be created. Once a session is created, the execution of the cell will take about 2 seconds.
1. If you just want to see the schema of the dataframe run a cell with the following code:

    ```py
    %%pyspark
    df.printSchema()
    ```

## Load the NYC Taxi data into the Spark nyctaxi database

Data is available via the dataframe named **df**. Load it into a Spark database named **nyctaxi**.

1. Add a new code cell to the notebook, and then enter the following code:

    ```py
    %%pyspark
    spark.sql("CREATE DATABASE IF NOT EXISTS nyctaxi")
    df.write.mode("overwrite").saveAsTable("nyctaxi.trip")
    ```
## Analyze the NYC Taxi data using Spark and notebooks

1. Create a new code cell and enter the following code. 

   ```py
   %%pyspark
   df = spark.sql("SELECT * FROM nyctaxi.trip") 
   display(df)
   ```

1. Run the cell to show the NYC Taxi data we loaded into the **nyctaxi** Spark database.
1. Create a new code cell and enter the following code. We'll analyze this data and save the results into a table called **nyctaxi.passengercountstats**.

   ```py
   %%pyspark
   df = spark.sql("""
      SELECT passenger_count,
          SUM(trip_distance) as SumTripDistance,
          AVG(trip_distance) as AvgTripDistance
      FROM nyctaxi.trip
      WHERE trip_distance > 0 AND passenger_count > 0
      GROUP BY passenger_count
      ORDER BY passenger_count
   """) 
   display(df)
   df.write.saveAsTable("nyctaxi.passengercountstats")
   ```

1. In the cell results, select **Chart** to see the data visualized.

## Next steps

> [!div class="nextstepaction"]
> [Analyze data with dedicated SQL pool](get-started-analyze-sql-pool.md)
