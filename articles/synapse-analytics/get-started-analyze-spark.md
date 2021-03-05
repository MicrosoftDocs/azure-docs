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
ms.date: 12/31/2020
---

# Analyze with Apache Spark

In this tutorial, you'll learn the basic steps to load and analyze data with Apache Spark for Azure Synapse.

## Analyze NYC Taxi data in blob storage using Spark

1. In the **Data** hub, click the **+** button to **Add a new resource**, then click >> **Browse gallery**. 
1. Find **NYC Taxi & Limousine Commission - yellow taxi trip records** and click on it. 
1. On the bottom of the page press **Continue**, then **Add dataset**. 
1. After a moment, in **Data** hub under **Linked**, right-click on **Azure Blob Storage >> Sample Datasets >> nyc_tlc_yellow** and select **New notebook**, then **Load to Data Frame**.
1. This will create a new Notebook with the following code:
    ```

    from azureml.opendatasets import NycTlcYellow

    data = NycTlcYellow()
    df = data.to_spark_dataframe()
    # Display 10 rows
    display(df.limit(10))
    ```
1. In the notebook, in the **Attach to** menu, choose the **Spark1** serverless Spark pool that we created earlier.
1. Select **Run** on the cell
1. If you just want to see the schema of the dataframe run a cell with the following code:
    ```

    df.printSchema()
    ```

## Load the NYC Taxi data into the Spark nyctaxi database

Data is available in a table in **SQLPOOL1**. Load it into a Spark database named **nyctaxi**.

1. In Synapse Studio, go to the **Develop** hub.
1. Select **+** > **Notebook**.
1. On the top of the notebook, set the **Attach to** value to **Spark1**.
1. In the new notebook's first code cell, and then enter the following code:


    ```scala
    %%spark
    spark.sql("CREATE DATABASE IF NOT EXISTS nyctaxi")
    val df = spark.read.sqlanalytics("SQLPOOL1.dbo.Trip") 
    df.write.mode("overwrite").saveAsTable("nyctaxi.trip")
    ```


1. Run the script. It may take 2-3 minutes.
1. On the **Data** hub, in the **Workspace** tab, right-click **Databases**, and then select **Refresh**. You should now see the database **nyctaxi (Spark)** in the list.


## Analyze the NYC Taxi data using Spark and notebooks

1. Return to your notebook.
1. Create a new code cell and enter the following code. 


   ```py
   %%pyspark
   df = spark.sql("SELECT * FROM nyctaxi.trip") 
   display(df)
   ```

1. Run the cell to show the NYC Taxi data we loaded into the **nyctaxi** Spark database.
1. Create a new code cell and enter the following code. Then run the cell to do the same analysis that we did earlier with the dedicated SQL pool **SQLPOOL1**. This code saves and displays the results of the analysis into a table called **nyctaxi.passengercountstats**.


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

Earlier we copied data from the dedicated SQL pool table **SQLPOOL1.dbo.Trip** into the Spark table **nyctaxi.trip**. Then you aggregated the data into the Spark table **nyctaxi.passengercountstats**. Now you'll copy the data from **nyctaxi.passengercountstats** into a dedicated SQL pool table called **SQLPOOL1.dbo.PassengerCountStats**.

1. Create a new code cell and enter the following code. Run the cell in your notebook. It copies the aggregated Spark table back into the dedicated SQL pool table.

```scala
%%spark
val df = spark.sql("SELECT * FROM nyctaxi.passengercountstats")
df.write.sqlanalytics("SQLPOOL1.dbo.PassengerCountStats", Constants.INTERNAL )
```

## Next steps

> [!div class="nextstepaction"]
> [Analyze data with serverless SQL pool](get-started-analyze-sql-on-demand.md)
