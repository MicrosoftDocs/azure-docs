---
title: 'Tutorial: Get started with Azure Synapse Analytics' 
description: In this tutorial you'll learn the basic steps to set up and use Azure Synapse Analytics.
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.topic: quickstart
ms.date: 05/19/2020 
---

# Tutorial: Get Started with Azure Synapse Analytics

This document guides you through all the basic steps needed to set up and use Azure Synapse Analytics.

## Prepare a storage account

1. Open the [Azure portal](https://portal.azure.com).
1. Create a new storage account that has the following settings:
    |Tab|Setting | Suggested value | Description |
    |---|---|---|---|
    |Basics|**Storage account name**| You can give it any name.|In this document, we'll refer to it as **contosolake**.|
    |Basics|**Account kind**|Must be set to **StorageV2**.||
    |Basics|**Location**|Choose any location.| We recommend your Azure Synapse Analytics workspace and Azure Data Lake Storage Gen2 account be in the same region.|
    |Advanced|**Data Lake Storage Gen2**|**Enabled**| Azure Synapse only works with storage accounts where this setting is enabled.|
    |||||

1. After you create the storage account, select **Access control (IAM)** in the left navigation. Then assign the following roles or ensure they are already assigned.

    1. * Assign yourself to the **Owner** role on the storage account
    1. * Assign yourself to the **Storage Blob Data Owner** role on the storage account

1. From the left navigation, select **Containers**, and then create a container. You can give it any name. Accept the default **Public access level**. In this document, we'll call the container **users**.
1. Select **Create**.

In the following step, you will configure your Synapse workspace to use this storage account as its "primary" storage account and the container to store workspace data. The workspace will store data in Apache Spark tables and Spark application logs in this account under a folder called **/synapse/workspacename**.

## Create a Synapse workspace

1. Open the [Azure portal](https://portal.azure.com), and at the top search for **Synapse**.
1. In the search results, under **Services**, select **Azure Synapse Analytics (workspaces preview)**.
1. Select **Add** to create a workspace using these settings:

    |Tab|Setting | Suggested value | Description |
    |---|---|---|---|
    |Basics|**Workspace name**|You can call it anything.| In this document, we will use **myworkspace**|
    |Basics|**Region**|Match the region of the storage account|

1. Under **Select Data Lake Storage Gen 2**, select the account and container you previously created.
    > [!NOTE]
    > We refer to the storage account chosen here as the "primary" storage account of the Azure Synapse workspace. This account stores data in Apache Spark tables. It also stores logs created when Spark pools are created or Spark applications run.

1. Select **Review + create** > **Create**.
1. Wait a few minutes while Azure Synapse Analytics creates your workspace.

## Verify the Azure Synapse workspace MSI has access to the storage account

Azure Synapse workspace MSI might already have access to the storage account. Confirm access or follow these steps if necessary:

1. Open the [Azure portal](https://portal.azure.com) and the primary storage account for your workspace.
1. Select **Access control (IAM)** from the left navigation.
1. Confirm or assign the following roles:

  >[!Note]
  >The workspace name and the workspace identity have the same name. In this document, we'll use **myworkspace** for these roles.

    1. For the **Storage Blob Data Contributor** role on the storage account, assign **myworkspace** as the workspace identity. 
    1. Assign **myworkspaced** as the workspace name.

1. Select **Save**.

## Open Synapse Studio

After your Azure Synapse workspace is created, choose one of two ways to open Synapse Studio:

* Go to the [Azure portal](https://portal.azure.com). At the top of the **Overview** section select **Launch Synapse Studio**.
* Go to https://web.azuresynapse.net and sign in to your workspace.

## Create a SQL pool

1. In Synapse Studio, on the left side navigation, select **Manage** > **SQL pools**.

1. Select **New** and enter these settings:

    |Setting | Suggested value | 
    |---|---|---|
    |**SQL pool name**| **SQLDB1**|
    |**Performance level**|**DW100C**|
    |||

1. Select **Review + create** > **Create**. Your SQL pool will be ready in a few minutes.

Your SQL pool is associated with a SQL pool database that's also called **SQLDB1**. A SQL pool consumes billable resources as long as it's active. You can pause the pool later to reduce costs.

## Create an Apache Spark pool

1. In Synapse Studio, on the left side select **Manage** > **Apache Spark pools**.
1. Select **New** and enter these settings:

    |Setting | Suggested value | 
    |---|---|---|
    |**Apache Spark pool name**|**Spark1**
    |**Node size**| **Small**|
    |**Number of nodes**| Set the minimum to 3 and the maximum to 3|

1. Select **Review + create** > **Create**. Your Apache Spark pool will be ready in a few seconds.

> [!NOTE]
> Despite the name, an Apache Spark pool is not like a SQL pool. It's just some basic metadata that you use to inform the Azure Synapse workspace how to interact with Spark.

Because it's metadata, Spark pools can't be started or stopped.

When you perform Spark activity in Azure Synapse, you specify a Spark pool to use. The pool informs Azure Synapse how many Spark resources to use. You pay only for the resources that are used. When you actively stop using the pool, the resources automatically time out and are recycled.

> [!NOTE]
> Spark databases are independently created from Spark pools. A workspace always has a Spark database called **default**. You can create additional Spark databases.

## The SQL on-demand pool

Every workspace comes with a pre-built pool called **SQL on-demand**. This pool can't be deleted. The SQL on-demand pool allows you to work with SQL without having to create or think about managing a Synapse SQL pool. Unlike the other kinds of pools, billing for SQL on-demand is based on the amount of data scanned to run the query, not the number of resources used to execute the query.

* SQL on-demand also has its own SQL on-demand databases that exist independently from any SQL on-demand pool.
* A workspace always has exactly one SQL on-demand pool named **SQL on-demand**.

## Load the NYC Taxi Sample data into the SQLDB1 database

1. In Synapse Studio, in the top-most blue menu, select the **?** icon.
1. Select **Getting started** > **Getting started hub**.
1. In the card labeled **Query sample data**, select the SQL pool named **SQLDB1**.
1. Select **Query data**. A "Loading sample data" notification briefly appears. A light-blue notification bar near the top of Synapse Studio indicates that data is being loaded into SQLDB1.
1. Wait until the notification bar turns green, and then dismiss it.

## Explore the NYC taxi data in the SQL Pool

1. In Synapse Studio, go to the **Data** hub.
1. Go to **SQLDB1** > **Tables**. You'll see several tables are loaded.
1. Right-click on the **dbo.Trip** table and select **New SQL Script** > **Select TOP 100 Rows**.
1. Wait while a new SQL script is created and runs.
1. Notice that at the top of the SQL script **Connect to** is automatically set to the SQL pool called **SQLDB1**.
1. Replace the text of the SQL script with this code, and then run it.

    ```sql
    SELECT PassengerCount,
          SUM(TripDistanceMiles) as SumTripDistance,
          AVG(TripDistanceMiles) as AvgTripDistance
    FROM  dbo.Trip
    WHERE TripDistanceMiles > 0 AND PassengerCount > 0
    GROUP BY PassengerCount
    ORDER BY PassengerCount
    ```

1. In the SQL script result window, change the **View** to **Chart** to see a visualization of the results as a line chart.

## Load the NYC Taxi Sample data into the Spark nyctaxi database

We have data available in a table in **SQLDB1**. Load it into a Spark database named **nyctaxi** following these steps:

1. In Synapse Studio, go to the **Develop** hub.
1. Select **+** > **Notebook**.
1. At the top of the notebook, set the **Attach to** value to **Spark1**.
1. Select **Add code** to add a notebook code cell, and then paste the following text:

    ```scala
    %%spark
    spark.sql("CREATE DATABASE IF NOT EXISTS nyctaxi")
    val df = spark.read.sqlanalytics("SQLDB1.dbo.Trip") 
    df.write.mode("overwrite").saveAsTable("nyctaxi.trip")
    ```

1. Go to the **Data** hub, right-click **Databases**, and then select **Refresh**. You should see these databases:

    - **SQLDB** (SQL pool)
    - **nyctaxi** (Spark)

## Analyze the NYC Taxi data by using Spark and notebooks

1. Return to your notebook.
1. To create a new code cell, enter the following text:

   ```py
   %%pyspark
   df = spark.sql("SELECT * FROM nyctaxi.trip") 
   display(df)
   ```

1. Run the cell to show the NYC taxi data we loaded into the **nyctaxi** Spark database.
1. Run the following code to perform the same analysis we did earlier with the SQL pool **SQLDB1**. This code saves the results of the analysis into a table called **nyctaxi.passengercountstats** and visualizes the results.

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

## Customize data visualization data by using Spark and notebooks

By using notebooks, you can control how to render charts. The following code shows a simple example using the popular libraries **matplotlib** and **seaborn**. It renders the same kind of line chart as the previous SQL queries.

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

Earlier we copied data from SQL pool table **SQLDB1.dbo.Trip** into Spark table **nyctaxi.trip**. Then, using
Spark, we aggregated the data into the Spark table **nyctaxi.passengercountstats**. Now we will copy the data
from **nyctaxi.passengercountstats** into a SQL pool table called **SQLDB1.dbo.PassengerCountStats**.

Run the following cell in your notebook. It copies the aggregated Spark table back into the SQL pool table.

```scala
%%spark
val df = spark.sql("SELECT * FROM nyctaxi.passengercountstats")
df.write.sqlanalytics("SQLDB1.dbo.PassengerCountStats", Constants.INTERNAL )
```

## Analyze NYC taxi data in Spark databases using SQL on-demand

Tables in Spark databases are automatically visible, and they can be queried by SQL on-demand.

1. In Synapse Studio, go to the **Develop** hub and create a new SQL script.
1. Set **Connect to** to **SQL on-demand**.
1. Paste the following text into the script and run the script.

    ```sql
    SELECT *
    FROM nyctaxi.dbo.passengercountstats
    ```

    > [!NOTE]
    > The first time you run a query that uses SQL on-demand, it takes about 10 seconds for SQL on-demand to gather SQL resources needed to run your queries. Subsequent queries will be much faster.
  
## Orchestrate activities with pipelines

You can orchestrate a wide variety of tasks in Azure Synapse.

1. In Synapse Studio, go to the **Orchestrate** hub.
1. Select **+** > **Pipeline** to create a new pipeline.
1. Go to the **Develop** hub and find the notebook you previously created.
1. Drag that notebook into the pipeline.
1. In the pipeline, select **Add trigger** > **New/edit**.
1. In **Choose trigger** select **New**, and then in recurrence set the trigger to run every one hour.
1. Select **OK**.
1. Select **Publish All**. The the pipeline will run every hour.
1. To make the pipeline run now, without waiting for the next hour, select **Add trigger** > **New/edit**.

## Working with data in a storage account

So far, we've covered scenarios were data resides in databases in the workspace. Now we'll show you how to work with files in storage accounts. In this scenario, we'll use the primary storage account of the workspace and container that we specified when creating the workspace.

* The name of the storage account: **contosolake**
* The name of the container in the storage account: **users**

### Creating CSV and Parquet files in your Storage account

Run the following code in a notebook. It creates a CSV file and a parquet file in the storage account.

```py
%%pyspark
df = spark.sql("SELECT * FROM nyctaxi.passengercountstats")
df = df.repartition(1) # This ensure we'll get a single file during write()
df.write.mode("overwrite").csv("/NYCTaxi/PassengerCountStats.csv")
df.write.mode("overwrite").parquet("/NYCTaxi/PassengerCountStats.parquet")
```

### Analyzing data in a storage account

1. In Synapse Studio, go to the **Data** hub.
1. Select **Linked**.
1. Go to **Storage accounts** > **myworkspace (Primary - contosolake)**.
1. Select **users (Primary)"**.
1. Locate the folder called **NYCTaxi**. Inside are two folders called **PassengerCountStats.csv** and **PassengerCountStats.parquet**.
1. In the **PassengerCountStats.parquet** folder, right-click the parquet file inside, and then select **new notebook**. This action creates a notebook that has a cell like this:

    ```py
    %%pyspark
    data_path = spark.read.load('abfss://users@contosolake.dfs.core.windows.net/NYCTaxi/PassengerCountStats.parquet/part-00000-1f251a58-d8ac-4972-9215-8d528d490690-c000.snappy.parquet', format='parquet')
    data_path.show(100)
    ```

1. Run the cell.
1. Right-click the parquet file inside, and then select **New SQL script** > **SELECT TOP 100 rows** to create a SQL script like this:

    ```sql
    SELECT TOP 100 *
    FROM OPENROWSET(
        BULK 'https://contosolake.dfs.core.windows.net/users/NYCTaxi/PassengerCountStats.parquet/part-00000-1f251a58-d8ac-4972-9215-8d528d490690-c000.snappy.parquet',
        FORMAT='PARQUET'
    ) AS [r];
    ```

     In the script, the **Attach to** field is set to **SQL on-demand**.

1. Run the script.

## Visualize data with Power BI

From the NYC taxi data, we created aggregated datasets in two tables:
- **nyctaxi.passengercountstats**
- **SQLDB1.dbo.PassengerCountStats**

You can link a Power BI workspace to your Azure Synapse workspace. This allows you to easily get data into your Power BI workspace and you can edit your Power BI reports directly in your Azure Synapse workspace.

### Create a Power BI workspace

1. Sign in to [powerbi.microsoft.com](https://powerbi.microsoft.com/).
1. Create a new Power BI workspace called **NYCTaxiWorkspace1**.

### Link your Azure Synapse workspace to your new Power BI workspace

1. In Synapse Studio, go to **Manage** > **Linked Services**.
1. Select **New** > **Connect to Power BI**, and then set these fields:

    |Setting | Suggested value | 
    |---|---|
    |**Name**|**NYCTaxiWorkspace1**|
    |**Workspace name**|**NYCTaxiWorkspace1**|

1. Select **Create**.

### Create a Power BI dataset that uses data in your Azure Synapse workspace

1. In Synapse Studio, go to the **Develop** > **Power BI**.
1. Go to **NYCTaxiWorkspace1** > **Power BI datasets** and select **New Power BI dataset**.
1. Hover over the **SQLDB1** database and select **Download .pbids file**.
1. Open the downloaded **.pbids** file to launch Power BI desktop and automatically connect it to **SQLDB1** in your Azure Synapse workspace.
1. If you see a dialog appear called **SQL server database**:
    1. Select **Microsoft account**.
    1. Select **Sign in** and sign in to your account.
    1. Select **Connect**.
1. After the **Navigator** dialog opens, check the **PassengerCountStats** table and select **Load**.
1. After the **Connection settings** dialog appears, select **DirectQuery** > **OK**.
1. Select the **Report** button on the left.
1. Add **Line chart** to your report.
    1. Drag the **PassengerCount** column to **Visualizations** > **Axis**.
    1. Drag the **SumTripDistance** and **AvgTripDistance** columns to **Visualizations** > **Values**.
1. In the **Home** tab, select **Publish**.
1. Select **Save** to save your changes.
1. Select **PassengerAnalysis.pbix** > **Save** to choose a file name.
1. To **Select a destination**, Select **NYCTaxiWorkspace1** > **Select**.
1. Wait for publishing to finish.

### Configure authentication for your dataset

1. Open [powerbi.microsoft.com](https://powerbi.microsoft.com/) and **Sign in**.
1. At the left, under **Workspaces** select the **NYCTaxiWorkspace1** workspace.
1. Inside that workspace, find a dataset called **Passenger Analysis** and a report called **Passenger Analysis**.
1. Hover over the **PassengerAnalysis** dataset, select the ellipsis (...) button and select **Settings**.
1. In **Data source credentials**, set the **Authentication method** to **OAuth2**, and then select **Sign in**.

### Edit a report in Synapse Studio

1. Go back to Synapse Studio and select **Close and refresh**.
1. Go to the **Develop** hub.
1. Hover over **Power BI** and select the refresh the **Power BI reports** node.
1. In **Power BI** find:
    - Under **NYCTaxiWorkspace1** > **Power BI datasets**, a new dataset called **PassengerAnalysis**.
    - Under **NYCTaxiWorkspace1** > **Power BI reports**, a new report called **PassengerAnalysis**.
1. Select the **PassengerAnalysis** report.
1. The report opens and you can edit it directly within Synapse Studio.

## Monitor activities

1. In Synapse Studio, go to the monitor hub.
1. View the history of all the activities taking place in the workspace and which ones are active now.
1. Explore the **Pipeline runs**, **Apache Spark applications**, and **SQL requests** to see what you've already done in the workspace.

## Next steps

Learn more about [Azure Synapse Analytics Preview](overview-what-is.md)

