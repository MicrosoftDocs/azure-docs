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

## Create a serverless Apache Spark pool

1. In Synapse Studio, on the left-side pane, select **Manage** > **Apache Spark pools**.
1. Select **New** 
1. For **Apache Spark pool name** enter **Spark1**.
1. For **Node size** enter **Small**.
1. For **Number of nodes** Set the minimum to 3 and the maximum to 3
1. Select **Review + create** > **Create**. Your Apache Spark pool will be ready in a few seconds.

The Spark pool tells Azure Synapse how many Spark resources to use. You only pay for the resources that you use. When you actively stop using the pool, the resources automatically time out and are recycled.

## Analyze NYC Taxi data in blob storage using Spark

1. In Synapse Studio go to the **Develop** hub
2. Create a newnNotebook with the default language set to **PySpark (Python)**.
3. Create a new code cell and paste the following code into that cell.
    ```
    from azureml.opendatasets import NycTlcYellow

    data = NycTlcYellow()
    df = data.to_spark_dataframe()
    # Display 10 rows
    display(df.limit(10))
    ```
1. In the notebook, in the **Attach to** menu, choose the **Spark1** serverless Spark pool that we created earlier.
1. Select **Run** on the cell. Synapse will start a new Spark session to run this cell if needed. If a new Spark session is needed, intially it will take about two seconds to be created. 
1. If you just want to see the schema of the dataframe run a cell with the following code:
    ```

    df.printSchema()
    ```

## Load the NYC Taxi data into the Spark nyctaxi database

Data is available via the dataframe named **data**. Load it into a Spark database named **nyctaxi**.

1. Add a new to the notebbook, and then enter the following code:

    ```py
    data.write.mode("overwrite").saveAsTable("nyctaxi.trip")
    ```




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
> [Analyze data with dedicated SQL pool](get-started-analyze-sql-pool.md)
