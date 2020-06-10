---
title: 'Tutorial: Getting started with Azure Synapse Analytics' 
description: Steps by steps to quickly understand basic concepts in Azure Synapse
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.topic: quickstart
ms.date: 05/19/2020 
---

# Getting Started with Azure Synapse Analytics

This document guides you through all the basic steps needed to setup and use Azure Synapse Analytics.

## Prepare a storage account for use with a Synapse workspace

* Open the [Azure portal](https://portal.azure.com)
* Create a new storage account with the following settings:

    |Tab|Setting | Suggested value | Description |
    |---|---|---|---|
    |Basics|**Storage account name**| You can give it any name.|In this document, we'll refer to it as `contosolake`.|
    |Basics|**Account kind**|Must be set to `StorageV2`||
    |Basics|**Location**|You can pick any location| We recommend your Synapse workspace and Azure Data Lake Storage (ADLS) Gen2 account are in the same region.|
    |Advanced|**Data Lake Storage Gen2**|`Enabled`| Azure Synapse only works with storage accounts where this setting is enabled.|

1. Once the storage account is created, select **Access control (IAM)** from the left navigation. Then assign the following roles or ensure they are already assigned. 

    a. * Assign yourself to the **Owner** role on the storage account
    b. * Assign yourself to the **Storage Blob Data Owner** role on the Storage Account

1. From the left navigation, select **Containers** and create a container. You can give it any name. Accept the default **Public access level**. In this document, we will call the container `users`. Select **Create**. 

In the following step, you will configure your Synapse workspace to use this storage account as its "primary" storage account and the container to store workspace data. The workspace will store data in Apache Spark tables and Spark application logs in this account under a folder called `/synapse/workspacename`.

## Create a Synapse workspace

* Open the [Azure portal](https://portal.azure.com) and at the top search for `Synapse`.
* In the search results under **Services**, select **Azure Synapse Analytics (workspaces preview)**
* Select **+ Add** to create a workspace using these settings

    |Tab|Setting | Suggested value | Description |
    |---|---|---|---|
    |Basics|**Workspace name**|You can call it anything.| In this document, we will use `myworkspace`|
    |Basics|**Region**|Match the region of the storage account|

1. Under **Select Data Lake Storage Gen 2**, select the account and container you previously created.

1. Select **Review + create**. Select **Create**. Your workspace will be ready in a few minutes.

## Verify the Synapse workspace MSI has access to the storage account

This may have already been done for you. In any case, you should verify.

1. Open the [Azure portal](https://portal.azure.com) and open the primary storage account chosen for your workspace.
1. Select **Access control (IAM)** from the left navigation. Then assign the following roles or ensure they are already assigned. 
    a. Assign the workspace identity to the **Storage Blob Data Contributor** role on the storage account. The workspace identity has the same name as the workspace. In this document, the workspace name is `myworkspace` so the workspace identity is `myworkspaced`
1. Select **Save**.
    
## Launch Synapse Studio

Once your Synapse workspace is created, you have two ways to open Synapse Studio:
* Open your Synapse workspace in the [Azure portal](https://portal.azure.com) and at the top of the **Overview** section select **Launch Synapse Studio**
* Directly go to https://web.azuresynapse.net and sign in to your workspace.

## Create a SQL pool

1. In Synapse Studio, on the left side navigation, select **Manage > SQL pools**
1. Select **+New** and enter these settings:

    |Setting | Suggested value | 
    |---|---|
    |**SQL pool name**| `SQLDB1`|
    |**Performance level**|`DW100C`|

1. Select **Review+create** and then select **Create**.
1. Your SQL pool will be ready in a few minutes. When your SQL pool is created, it will be associated with a SQL pool database also called **SQLDB1**.

A SQL pool consumes billable resources as long as it is active. You can pause the pool later to reduce costs.

## Create an Apache Spark pool

1. In Synapse Studio, on the left side select **Manage > Apache Spark pools**
1. Select **+New** and enter these settings:

    |Setting | Suggested value | 
    |---|---|
    |**Apache Spark pool name**|`Spark1`
    |**Node size**| `Small`|
    |**Number of nodes**| Set the minimum to 3 and the maximum to 3|

1. Select **Review+create** and then select **Create**.
1. Your Apache Spark pool will be ready in a few seconds.

> [!NOTE]
> Despite the name, an Apache Spark pool is not like a SQL pool. It's just some basic metadata that you use to inform the Synapse workspace how to interact with Spark. 

Because they are metadata, Spark pools cannot be started or stopped. 

When you do any Spark activity in Synapse, you specify a Spark pool to use. The pool informs Synapse how many Spark resources to use. You pay only for the resources thar are used. When you actively stop using the pool, the resources will automatically time out and be recycled.

> [!NOTE]
> Spark databases are independently created from Spark pools. A workspace always has a Spark database called **default** and you can create additional Spark databases.

## The SQL on-demand pool

Every workspace comes with a pre-built and undeleteable pool called **SQL on-demand**. The SQL on-demand pool allows you to work with SQL without having to create or think about managing a Synapse SQL pool. Unlike the other kinds of pools, billing for SQL on-demand is based on the amount of data scanned to run the query - and not the number of resources used to execute the query.

* SQL on-demand also has its own SQL on-demand databases that exist independently from any SQL on-demand pool.
* Currently a workspace always has exactly one SQL on-demand pool named **SQL on-demand**.

## Load the NYC Taxi Sample data into the SQLDB1 database

1. In Synapse Studio, in the top-most blue menu, select the **?** icon.
1. Select **Getting started > Getting started hub**
1. In the card labeled **Query sample data**, select the SQL pool named `SQLDB1`
1. Select **Query data**. You will see a notification saying "Loading sample data" that will appear and then disappear.
1. You'll see a light-blue notification bar near the top of Synapse Studio indicating that data is being loaded into SQLDB1. Wait until it turns green then dismiss it.

## Explore the NYC taxi data in the SQL Pool

1. In Synapse Studio, navigate to the **Data** hub
1. Navigate to **SQLDB1 > Tables**. You'll see several tables have been loaded.
1. Right-click on the **dbo.Trip** table and select **New SQL Script > Select TOP 100 Rows**
1. A new SQL script will be created and automatically run.
1. Notice that at the top of the SQL script **Connect to** is automatically set to the SQL pool called `SQLDB1`.
1. Replace the text of the SQL script with this code and run it.

    ```sql
    SELECT PassengerCount,
          SUM(TripDistanceMiles) as SumTripDistance,
          AVG(TripDistanceMiles) as AvgTripDistance
    FROM  dbo.Trip
    WHERE TripDistanceMiles > 0 AND PassengerCount > 0
    GROUP BY PassengerCount
    ORDER BY PassengerCount
    ```

1. This query shows how the total trip distances and average trip distance relate to the number of passengers
1. In the SQL script result window, change the **View** to **Chart** to see a visualization of the results as a line chart

## Load the NYC Taxi Sample data into the Spark nyctaxi database

We have data available in a table in `SQLDB1`. Now we load it into a Spark database named `nyctaxi`.

1. In Synapse Studio, navigate to the **Develop** hub
1. Select **+** and select **Notebook**
1. At the top of the notebook, set the **Attach to** value to `Spark1`
1. Select **Add code** to add a notebook code cell and paste the text below:

    ```scala
    %%spark
    spark.sql("CREATE DATABASE IF NOT EXISTS nyctaxi")
    val df = spark.read.sqlanalytics("SQLDB1.dbo.Trip") 
    df.write.mode("overwrite").saveAsTable("nyctaxi.trip")
    ```

1. Navigate to the **Data** hub, right-click on **Databases** and select **Refresh**.
1. Now you should see these databases:
    - SQLDB1 (SQL pool)
    - nyctaxi (Spark)
      
## Analyze the NYC Taxi data using Spark and notebooks

1. Return to your notebook
1. Create a new code cell, enter the text below, and run the cell to example the NYC taxi data we loaded into the `nyctaxi` Spark database.

   ```py
   %%pyspark
   df = spark.sql("SELECT * FROM nyctaxi.trip") 
   display(df)
   ```

1. Run the following code to perform the same analysis we did earlier with the SQL pool `SQLDB1`. This code also saves the results of the analysis into a table called `nyctaxi.passengercountstats` and visualizes the results.

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

1. In the cell results, select **Chart** to see the data visualized
 
## Customize data visualization data with Spark and notebooks

With notebooks, you can control how render charts. The following code shows a simple example using the popular libraries `matplotlib` and `seaborn`. It will render the same kind of line chart you saw when running the SQL queries earlier.

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

Earlier we copied data from a SQL pool table `SQLDB1.dbo.Trip` into a Spark table `nyctaxi.trip`. Then, using
Spark, we aggregated the data into the Spark table `nyctaxi.passengercountstats`. Now we will copy the data 
from `nyctaxi.passengercountstats` into a SQL pool table called `SQLDB1.dbo.PassengerCountStats`. 

Run the cell below in your notebook. It will copy the aggregated Spark table back into
the SQL pool table.

```scala
%%spark
val df = spark.sql("SELECT * FROM nyctaxi.passengercountstats")
df.write.sqlanalytics("SQLDB1.dbo.PassengerCountStats", Constants.INTERNAL )
```

## Analyze NYC taxi data in Spark databases using SQL on-demand 

Tables in Spark databases are automatically visible and queryable by SQL on-demand.

1. In Synapse Studio, navigate to the **Develop** hub and create a new SQL script
1. Set **Connect to** to **SQL on-demand** 
1. Paste the following text into the script and run the script.

    ```sql
    SELECT *
    FROM nyctaxi.dbo.passengercountstats
    ```
    > [!NOTE]
    > The first time you run a query that uses SQL on-demand, it will take about 10 seconds for SQL on-demand to gather SQL resources needed to run your queries. Subsequent queries will not require this time and be much faster.
  
## Orchestrate activities with pipelines

You can orchestrate a wide variety of tasks in Azure Synapse. In this section, you'll see how easy it is.

1. In Synapse Studio, navigate to the **Orchestrate** hub.
1. Select **+** then select **Pipeline**. A new pipeline will be created.
1. Navigate to the Develop hub and find the notebook you previously created.
1. Drag that notebook into the pipeline.
1. In the pipeline, select **Add trigger > New/edit**.
1. In **Choose trigger** select **New**, and then in recurrence set the trigger to run every 1 hour.
1. Select **OK**.
1. Select **Publish All** and the pipeline will run every hour.
1. If you want to make the pipeline run now without waiting for the next hour, select **Add trigger > New/edit**.

## Working with data in a storage account

So far, we've covered scenarios were data resided in databases in the workspace. Now we'll show how to work with files in storage accounts. In this scenario, we'll use the primary storage account of the workspace and container we specified when creating the workspace.

* The name of the storage account: `contosolake`
* The name of the container in the storage account: `users`

### Creating CSV and Parquet files in your storage account

Run the following code in a notebook. It creates a CSV file and a parquet file in the storage account

```py
%%pyspark
df = spark.sql("SELECT * FROM nyctaxi.passengercountstats")
df = df.repartition(1) # This ensure we'll get a single file during write()
df.write.mode("overwrite").csv("/NYCTaxi/PassengerCountStats.csv")
df.write.mode("overwrite").parquet("/NYCTaxi/PassengerCountStats.parquet")
```

### Analyzing data in a storage account

1. In Synapse Studio, navigate to the **Data** hub
1. Select **Linked**
1. Navigate to **Storage accounts > myworkspace (Primary - contosolake)**
1. Select **users (Primary)"**
1. You should see a folder called `NYCTaxi`. Inside you should see two folders `PassengerCountStats.csv` and `PassengerCountStats.parquet`.
1. Navigate into the `PassengerCountStats.parquet` folder.
1. Right-click on the `.parquet` file inside, and select **new notebook**, it will create a notebook with a cell like this:

    ```py
    %%pyspark
    data_path = spark.read.load('abfss://users@contosolake.dfs.core.windows.net/NYCTaxi/PassengerCountStats.parquet/part-00000-1f251a58-d8ac-4972-9215-8d528d490690-c000.snappy.parquet', format='parquet')
    data_path.show(100)
    ```

1. Run the cell.
1. Right-click on the parquet file inside, and select **New SQL script > SELECT TOP 100 rows**, it will create a SQL script like this:

    ```sql
    SELECT TOP 100 *
    FROM OPENROWSET(
        BULK 'https://contosolake.dfs.core.windows.net/users/NYCTaxi/PassengerCountStats.parquet/part-00000-1f251a58-d8ac-4972-9215-8d528d490690-c000.snappy.parquet',
        FORMAT='PARQUET'
    ) AS [r];
    ```
    
1. In the script, the **Attach to** field will be set to **SQL on-demand**.
1. Run the script.

## Visualize data with Power BI

From the NYX taxi data, we created aggregated datasets in two tables:
* `nyctaxi.passengercountstats`
* `SQLDB1.dbo.PassengerCountStats`

You can link a Power BI workspace to your Synapse workspace. This allows you to easily get data into your Power BI workspace and you can edit your Power BI reports directly in your Synapse workspace.

### Create a Power BI Workspace

1. Sign into [powerbi.microsoft.com](https://powerbi.microsoft.com/).
1. Create a new Power BI workspace called `NYCTaxiWorkspace1`.

### Link your Synapse Workspace to your new Power BI workspace

1. In Synapse Studio, navigate to the **Manage > Linked Services**.
1. Select **+ New** and select **Connect to Power BI** and set these fields:

    |Setting | Suggested value | 
    |---|---|
    |**Name**|`NYCTaxiWorkspace1`|
    |**Workspace name**|`NYCTaxiWorkspace1`|
        
1. Select **Create**.

### Create a Power BI dataset that uses data in your Synapse workspace

1. In Synapse Studio, navigate to the **Develop > Power BI**.
1. Navigate to **NYCTaxiWorkspace1 > Power BI datasets** and select **New Power BI dataset**.
1. Hover over the `SQLDB1` database and select **Download .pbids file**.
1. Open the downloaded `.pbids` file. 
1. This will launch Power BI desktop and automatically connect it to `SQLDB1` in your synapse workspace.
1. If you see a dialog appear called **SQL server database**:
    a. Select **Microsoft account**. 
    b. Select **Sign in** and sign in.
    c. Select **Connect**.
1. The **Navigator** dialog will open. When it does, check the **PassengerCountStats** table and select **Load**.
1. A **Connection settings** dialog will appear. Select **DirectQuery** and select **OK**
1. Select the **Report** button on the left.
1. Add **Line chart** to your report.
    a. Drag the **PasssengerCount** column to **Visualizations > Axis**
    b. Drag the **SumTripDistance** and **AvgTripDistance** columns to **Visualizations > Values**.
1. In the **Home** tab, select **Publish**.
1. It will ask you if you want to save your changes. Select **Save**.
1. It will ask you to pick a filename. Choose `PassengerAnalysis.pbix` and select **Save**.
1. It will ask you to **Select a destination** select `NYCTaxiWorkspace1` and select **Select**.
1. Wait for publishing to finish.

### Configure authentication for your dataset

1. Open [powerbi.microsoft.com](https://powerbi.microsoft.com/) and **Sign in**
1. At the left, under **Workspaces** select the `NYCTaxiWorkspace1` workspace.
1. Inside that workspace you should see a dataset called `Passenger Analysis` and a report called `Passenger Analysis`.
1. Hover over the `PassengerAnalysis` dataset and select the icon with the three dots and select **Settings**.
1. In **Data source credentials**, set the **Authentication method** to **OAuth2** and select **Sign in**.

### Edit a report in Synapse Studio

1. Go back to Synapse Studio and select **Close and refresh** 
1. Navigate to the **Develop** hub 
1. Hover over **Power BI** and click on the refresh the **Power BI reports** node.
1. Now under the **Power BI** you should see:
    a. * Under **NYCTaxiWorkspace1 > Power BI datasets**, a new dataset called **PassengerAnalysis**.
    b. * Under **NYCTaxiWorkspace1 > Power BI reports**, a new report called **PassengerAnalysis**.
1. Select the **PassengerAnalysis** report. 
1. The report will open and now you can edit the report directly within Synapse Studio.

## Monitor activities

1. In Synapse Studio, navigate to the monitor hub.
1. In this location, you can see a history of all the activities taking place in the workspace and which ones are active now.
1. Explore the **Pipeline runs**, **Apache Spark applications**, and **SQL requests** and you can see what you've already done in the workspace.

## Next steps

Learn more about [Azure Synapse Analytics (preview)](overview-what-is.md)

