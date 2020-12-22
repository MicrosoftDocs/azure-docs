---
title: 'Quickstart: Get started analyzing with Spark' 
description: In this tutorial, you'll learn to analyze data with Apache Spark.
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.subservice: spark
ms.topic: tutorial
ms.date: 07/20/2020 
---

# Analyze with Apache Spark

In this tutorial, you'll learn the basic steps to load and analyze data with Apache Spark for Azure Synapse.

## Analyze NYC Taxi data in blob storage using Spark

1. In the **Data** hub, select **Add a new resource** (plus button above **Linked**) > **Browse gallery**.
1. Select **NYC Taxi & Limousine Commission - yellow taxi trip records**.
1. On the bottom of the page, select **Continue** > **Add dataset**.
1. In the **Data** hub under **Linked**, right-click **Azure Blob Storage**, and then select **Sample Datasets** > **nyc_tlc_yellow**.
1. Select **New notebook** to create a new notebook with the following code:

    ```py
    from azureml.opendatasets import NycTlcYellow

    data = NycTlcYellow()
    data_df = data.to_spark_dataframe()
    display(data_df.limit(10))
    ```

1. In the **Attach to** menu in the notebook, choose a serverless Spark pool.
1. Select **Run** on the cell.
1. If you want to see only the schema of the dataframe, run a cell with the following code:

    ```py
    data_df.printSchema()
    ```

## Load the NYC Taxi data into the Spark nyctaxi database

Data is available in a table in **SQLPOOL1**. Load it into a Spark database named **nyctaxi**.

1. In Synapse Studio, go to the **Develop** hub.
1. Select **+** > **Notebook**.
1. On the top of the notebook, set the **Attach to** value to **Spark1**.
1. Select **Add code** to add a notebook code cell, and then enter the following text:

    ```scala
    %%spark
    spark.sql("CREATE DATABASE IF NOT EXISTS nyctaxi")
    val df = spark.read.sqlanalytics("SQLPOOL1.dbo.Trip") 
    df.write.mode("overwrite").saveAsTable("nyctaxi.trip")
    ```

1. On the **Data** hub, right-click **Databases**, and then select **Refresh**. You should see these databases:

    - **SQLPOOL1 (SQL)**
    - **nyctaxi (Spark)**

## Analyze the NYC Taxi data using Spark and notebooks

1. Return to your notebook.
1. Create a new code cell and enter the following text.

   ```py
   %%pyspark
   df = spark.sql("SELECT * FROM nyctaxi.trip") 
   display(df)
   ```

1. Run the cell to show the NYC Taxi data you loaded into the **nyctaxi** Spark database.
1. Run the following code to do the same analysis that you did earlier with the dedicated SQL pool **SQLPOOL1**. This code saves and displays the results of the analysis into a table named **nyctaxi.passengercountstats**.

   ```py
   %%pyspark
   df = spark.sql("""
      SELECT PassengerCount,
          SUM(TripDistanceMiles) as SumTripDistance,
          AVG(TripDistanceMiles) as AvgTripDistance
      FROM nyctaxi.trip
      WHERE TripDistanceMiles > 0 AND PassengerCount > 0
      GROUP BY PassengerCount
      ORDER BY PassengerCount
   """) 
   display(df)
   df.write.saveAsTable("nyctaxi.passengercountstats")
   ```

1. In the cell results, select **Chart** to see the data visualized.

## Load data from a Spark table into a dedicated SQL pool table

Earlier you copied data from the dedicated SQL pool table **SQLPOOL1.dbo.Trip** into the Spark table **nyctaxi.trip**. Then you aggregated the data into the Spark table **nyctaxi.passengercountstats**. Now you'll copy the data from **nyctaxi.passengercountstats** into a dedicated SQL pool table named **SQLPOOL1.dbo.PassengerCountStats**.

Run the following cell in your notebook. It copies the aggregated Spark table back into the dedicated SQL pool table.

```scala
%%spark
val df = spark.sql("SELECT * FROM nyctaxi.passengercountstats")
df.write.sqlanalytics("SQLPOOL1.dbo.PassengerCountStats", Constants.INTERNAL )
```

## Next steps

> [!div class="nextstepaction"]
> [Analyze data with serverless SQL pool](get-started-analyze-sql-on-demand.md)
