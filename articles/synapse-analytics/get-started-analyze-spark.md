---
title: 'Tutorial: Get started analyze with Spark' 
description: In this tutorial, you'll learn to analyze data with Apache Spark
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

## Analyze NYC Taxi data in blob storage  using Spark

In this tutorial, you'll learn the basic steps to load and analyze data with Apache Spark for Azure Synapse.

1. In the **Data** hub, click on **Add a new resource**(plus button above **Linked**) >> **Browse Samples**. Find **NYC Taxi & Limousine Commission - yellow taxi trip records** and click on it. On the bottom of the page press **Continue** and after that **Add dataset**. Now in **Data** hub under **Linked** select right-click on **Azure Blob Storage >> Sample Datasets >> nyc_tlc_yellow** and select **New notebook**
1. This will create a new Notebook with the following code:
    ```
    from azureml.opendatasets import NycTlcYellow

    data = NycTlcYellow()
    data_df = data.to_spark_dataframe()
    display(data_df.limit(10))
    ```
1. In the notebook choose a spark pool in the **Attach to** menu
1. Click **Run** on the cell

## Load the NYC Taxi data into the Spark nyctaxi database

We have data available in a table in **SQLDB1**. Load it into a Spark database named **nyctaxi**.

1. In Synapse Studio, go to the **Develop** hub.
1. Select **+** > **Notebook**.
1. On the top of the notebook, set the **Attach to** value to **Spark1**.
1. Select **Add code** to add a notebook code cell, and then paste the following text:

    ```scala
    %%spark
    spark.sql("CREATE DATABASE IF NOT EXISTS nyctaxi")
    val df = spark.read.sqlanalytics("SQLDB1.dbo.Trip") 
    df.write.mode("overwrite").saveAsTable("nyctaxi.trip")
    ```

1. Go to the **Data** hub, right-click **Databases**, and then select **Refresh**. You should see these databases:

    - **SQLDB1** (SQL pool)
    - **nyctaxi** (Spark)

## Analyze the NYC Taxi data using Spark and notebooks

1. Return to your notebook.
1. Create a new code cell and enter the following text. Then run the cell to show the NYC Taxi data we loaded into the **nyctaxi** Spark database.

   ```py
   %%pyspark
   df = spark.sql("SELECT * FROM nyctaxi.trip") 
   display(df)
   ```

1. Run the following code to do the same analysis that we did earlier with the SQL pool **SQLDB1**. This code saves the results of the analysis into a table called **nyctaxi.passengercountstats** and visualizes the results.

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

## Customize data visualization with Spark and notebooks

You can control how charts render by using notebooks. The following code shows a simple example. It uses the popular libraries **matplotlib** and **seaborn**. The code renders the same kind of line chart as the SQL queries we ran earlier.

```py
%%pyspark
import matplotlib.pyplot
import seaborn

seaborn.set(style = "whitegrid")
df = spark.sql("SELECT * FROM nyctaxi.passengercountstats")
df = df.toPandas()
seaborn.lineplot(x="PassengerCount", y="SumTripDistance" , data = df)
seaborn.lineplot(x="PassengerCount", y="AvgTripDistance" , data = df)
matplotlib.pyplot.show()
```



## Load data from a Spark table into a SQL pool table

Earlier we copied data from the SQL pool table **SQLDB1.dbo.Trip** into the Spark table **nyctaxi.trip**. Then, using
Spark, we aggregated the data into the Spark table **nyctaxi.passengercountstats**. Now we'll copy the data
from **nyctaxi.passengercountstats** into a SQL pool table called **SQLDB1.dbo.PassengerCountStats**.

Run the following cell in your notebook. It copies the aggregated Spark table back into the SQL pool table.

```scala
%%spark
val df = spark.sql("SELECT * FROM nyctaxi.passengercountstats")
df.write.sqlanalytics("SQLDB1.dbo.PassengerCountStats", Constants.INTERNAL )
```

## Next steps

> [!div class="nextstepaction"]
> [Analyze data with SQL on-demand](get-started-analyze-sql-on-demand.md)


