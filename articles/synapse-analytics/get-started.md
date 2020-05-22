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

This tutorial will guide you through all the basic steps needed to setup and use Azure Synapse Analytics.

## Prepare a storage account for use with a Synapse workspace

* Open the [Azure portal](https://portal.azure.com)
* Create a new storage account with the following settings:
    * In the **Basics** tab

    |Setting | Suggested value | Description |
    |---|---|---|
    |**Storage account name**| You can give it any name.|In this document, we'll refer to it as `contosolake`.
    |**Account kind**|Must be set to `StorageV2`||
    |**Location**|You can pick any location| We recommend your Synapse workspace and Azure Data Lake Storage (ADLS) Gen2 account are in the same region.|
    ||||

    * In the **Advanced** tab

    |Setting | Suggested value | Description |
    |---|---|---|
    |**Data Lake Storage Gen2**|`Enabled`| Azure Synapse only works with storage accounts where this setting is enabled.|
    ||||

* Once the storage account is created, make these role assignments or ensure they are already assigned. While in the storage account, select **Access control (IAM)** from the left navigation.
    * Assign yourself to the **Owner** role on the storage account
    * Assign yourself to the **Storage Blob Data Owner** role on the Storage Account
* From the left navigation, select **Containers** and create a container. You can give it any name. Accept the default **Public access level**. In this document, we will call the container `users`. Select **Create**. 

## Create a Synapse workspace

* Open the [Azure portal](https://portal.azure.com) and at the top search for `Synapse`.
* In the search results under **Services**, select **Azure Synapse Analytics (workspaces preview)**
* Select **+ Add**
* **Basics** tab:

    |Setting | Suggested value | Description |
    |---|---|---|
    |**Workspace name**|You can call it anything.| In this document, we will use `myworkspace`
    |**Region**|Match the region of the storage account||
    |||

* Under **Select Data Lake Storage Gen 2** select the account and container you previously created

> [!NOTE]
> The storage account chosen here will be referred to as the "primary" storage account of the Synapse workspace

* Select **Review + create**. Select **Create**. Your workspace will be ready in a few minutes.

## Verify the Synapse workspace MSI has access to the storage account

This may have already been done for you. In any case, you should verify.

* Open the [Azure portal](https://portal.azure.com) open the primary storage account chosen for your workspace.
* Ensure that the following assignment exists or create it if it doesn't
    * Storage Blob Data Contributor role on the storage account to your workspace.
    * To assign this role to the workspace select the Storage Blob Data Contributor role, leave the default **Assign access to** and in the **Select** box type the name of your workspace. Select **Save**.
    
## Launch Synapse Studio

Once your Synapse workspace is created, you have two ways to open Synapse Studio:
* Open your Synapse workspace in the [Azure portal](https://portal.azure.com) and at the top of the **Overview** section select **Launch Synapse Studio**
* Directly go to https://web.azuresynapse.net and login to your workspace.

## Create a SQL pool

* In Synapse Studio, on the left side navigate to **Manage > SQL pools**
* NOTE: All Synapse workspaces come with a pre-created pool called **SQL on-demand**.
* Select **+New** and enter these settings:

    |Setting | Suggested value | 
    |---|---|---|
    |**SQL pool name**| `SQLDB1`|
    |**Performance level**|`DW100C`|
* Select **Review+create** and then select **Create**.
* Your pool will be ready in a few minutes.

> [!NOTE]
> A Synapse SQL pool corresponds to what used to be called an "Azure SQL Data Warehouse"

* A SQL pool consumes billable resources as long as it's running. So, you can pause the pool when needed to reduce costs.
* When your SQL pool is created, it will be associated with a SQL pool database also called **SQLDB1**.

## Create an Apache Spark pool for Azure Synapse Analytics

* In Synapse Studio, on the left side select **Manage > Apache Spark pools**
* Select **+New** and enter these settings:

    |Setting | Suggested value | 
    |---|---|---|
    |**Apache Spark pool name**|`Spark1`
    |**Node size**| `Small`|
    |**Number of nodes**| Set the minimum to 3 and the maximum to 3|
    |||

* Select **Review+create** and then select **Create**.
* Your Apache Spark pool will be ready in a few seconds.

> [!NOTE]
> Despite the name, an Apache Spark pool is not like a SQL pool. It's just some basic metadata that you use to inform the Synapse workspace how to interact with Spark. 

* Because they are metadata Spark pools cannot be started or stopped. 
* When you do any Spark activity in Synapse, you specify a Spark pool to use. The pool informs Synapse how many Spark resources to use. You pay only for the resources thar are used. When you actively stop using the pool the resources will automatically time out and be recycled.
> [!NOTE]
> Spark databases are independently created from Spark pools. A workspace always has a Spark DB called **default** and you can create additional Spark databases.

## SQL on-demand pools

SQL on-demand is a special kind of SQL pool that is always available with a Synapse workspace. It allows you to work with SQL without having to create or think about managing a Synapse SQL pool.

> [!NOTE]
> Unlike the other kinds of pools, billing for SQL on-demand is based on the amount of data scanned to run the query - and not the number of resources used to execute the query.

* SQL on-demand also has its own kind of SQL on-demand databases that exist independently from any SQL on-demand pool.
* Currently a workspace always has exactly one SQL on-demand pool named **SQL on-demand**.

## Load the NYC Taxi Sample data into the SQLDB1 database

* In Synapse Studio, in the top-most blue menu, select the **?** icon.
* Select **Getting started > Getting started hub**
* In the card labeled **Query sample data** select the SQL pool named `SQLDB1`
* Select **Query data**. You will see a notification saying "Loading sample data" which will appear and then disappear.
* You'll see a light-blue notification bar near the top of Synapse Studio indicating that data is being loaded into SQLDB1. Wait until it turns green then dismiss it.

## Explore the NYC taxi data in the SQL Pool

* In Synapse Studio, navigate to the **Data** hub
* Navigate to **SQLDB1 > Tables**. You'll see several tables have been loaded.
* Right-click on the **dbo.Trip** table and select **New SQL Script > Select TOP 100 Rows**
* A new SQL script will be created and automatically run.
* Notice that at the top of the SQL script **Connect to** is automatically set to the SQL pool called SQLDB1.
* Replace the text of the SQL script with this code and run it.

    ```sql
    SELECT PassengerCount,
          SUM(TripDistanceMiles) as SumTripDistance,
          AVG(TripDistanceMiles) as AvgTripDistance
    FROM  dbo.Trip
    WHERE TripDistanceMiles > 0 AND PassengerCount > 0
    GROUP BY PassengerCount
    ORDER BY PassengerCount
    ```

* This query shows how the total trip distances and average trip distance relate to the number of passengers
* In the SQL script result window change the **View** to **Chart** to see a visualization of the results as a line chart

## Create a Spark database and load the NYC taxi data into it

We have data available in a SQL pool database. Now we load it into a Spark database.

* In Synapse Studio, navigate to the **Develop hub"
* Select **+** and select **Notebook**
* At the top of the notebook, set the **Attach to** value to `Spark1`
* Select **Add code** to add a notebook code cell and paste the text below:

    ```scala
    %%spark
    spark.sql("CREATE DATABASE IF NOT EXISTS nyctaxi")
    val df = spark.read.sqlanalytics("SQLDB1.dbo.Trip") 
    df.write.mode("overwrite").saveAsTable("nyctaxi.trip")
    ```

 * Navigate to the Data hub, right-click on databases and select **Refresh**
 * Now you should see these databases:
     * SQLDB (SQL pool)
     * nyctaxi (Spark)
      
 ## Analyze the NYC Taxi data using Spark and notebooks

 * Return to your notebook
 * Create a new code cell, enter the text below, and run the cell

   ```py
   %%pyspark
   df = spark.sql("SELECT * FROM nyctaxi.trip") 
   display(df)
   ```

 * Run this code to perform the same analysis we did earlier with the SQL pool

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

 * In the cell results, select **Chart** to see the data visualized
 
## Customize data visualization data with Spark and notebooks

With spark notebooks you can control exactly how render charts. The following
code shows a simple example using the popular libraries matplotlib and sea-born. It will 
render the same chart you saw when running the SQL queries earlier.

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

Earlier we copied data from a SQL pool database into a Spark DB. Using
Spark, we aggregated the data into the nyctaxi.passengercountstats. 
Now run the cell below in a notebook and it will copy the aggregated table back into
the SQL pool database.

```scala
%%spark
val df = spark.sql("SELECT * FROM nyctaxi.passengercountstats")
df.write.sqlanalytics("SQLDB1.dbo.PassengerCountStats", Constants.INTERNAL )
```

## Analyze NYC taxi data in Spark databases using SQL-on demand 

* Tables in Spark databases are automatically visible and queryable by SQL on-demand
* In Synapse Studio navigate to the Develop hub and create a new SQL script
* Set **Connect to** to **SQL on-demand** 
* Paste the following text into the script:

    ```sql
    SELECT *
    FROM nyctaxi.dbo.passengercountstats
    ```

* Select **Run**
* NOTE: THe first time you run this it will take about 10 seconds for SQL on-demand to gather SQL resources needed to run your queries. Subsequent queries will not require this time.
  
## Use pipelines to orchestrate activities

You can orchestrate a wide variety of tasks in Azure Synapse. In this section, you'll see how easy it is.

* In Synapse Studio, navigate to the Orchestrate hub.
* Select **+** then select **Pipeline**. A new pipeline will be created.
* Navigate to the Develop hub and find any of the notebooks you previously created.
* Drag that notebook into the pipeline.
* In the pipeline select **Add trigger > New/edit**.
* In **Choose trigger** select **New**, and then in recurrence set the trigger to run every 1 hour.
* Select **OK**.
* Select **Publish All** and the pipeline will run every hour.
* If you want to make the pipeline run now without waiting for the next hour select **Add trigger > New/edit**.

## Working with data in a storage account

So far, we've covered scenarios were data resided in databases. Now we'll show how Azure Synapse can analyze simple files in a storage account. In this scenario we'll use the storage account and container that we linked the workspace to.

The name of the storage account: contosolake
The name of the container in the storage account: users

### Creating CSV and Parquet files in your Storage account

Run the the following code in a notebook. It creates a CSV and parquet data in the storage account

```py
%%pyspark
df = spark.sql("SELECT * FROM nyctaxi.passengercountstats")
df = df.repartition(1) # This ensure we'll get a single file during write()
df.write.mode("overwrite").csv("/NYCTaxi/PassengerCountStats.csv")
df.write.mode("overwrite").parquet("/NYCTaxi/PassengerCountStats.parquet")
```

### Analyzing data in a storage account

* In Synapse Studio, navigate to the **Data** hub
* Select **Linked**
* Navigate to **Storage accounts > workspacename (Primary - contosolake)**
* Select **users (Primary)"**
* You should see a folder called `NYCTaxi'. Inside you should see two folders 'PassengerCountStats.csv' and 'PassengerCountStats.parquet'.
* Navigate into the `PassengerCountStats.parquet' folder.
* Right-click on the parquet file inside, and select new notebook, it will create a notebook with a cell like this:

    ```py
    %%pyspark
    data_path = spark.read.load('abfss://users@contosolake.dfs.core.windows.net/NYCTaxi/PassengerCountStats.parquet/part-00000-1f251a58-d8ac-4972-9215-8d528d490690-c000.snappy.parquet', format='parquet')
    data_path.show(100)
    ```

* Run the cell to analyze the parquet file with spark.
* Right-click on the parquet file inside, and select New **SQL script > SELECT TOP 100 rows**, it will create a notebook with a cell like this:

    ```py
    SELECT TOP 100 *
    FROM OPENROWSET(
        BULK 'https://contosolake.dfs.core.windows.net/users/NYCTaxi/PassengerCountStats.parquet/part-00000-1f251a58-d8ac-4972-9215-8d528d490690-c000.snappy.parquet',
        FORMAT='PARQUET'
    ) AS [r];
    ```
    
* The script will be attached to **SQL on-demand** run the script. Notice that it infers the schema from the parquet file.

## Visualize data with Power BI

Your data can now be easily analyzed and visualized in Power BI. Synapse offers a unique integration which allows you to link a Power BI workspace to you Synapse workspace. Before starting, first follow the steps in this [quickstart](quickstart-power-bi.md) to link your Power BI workspace.

### Create a Power BI Workspace and link it to your Synapse Workspace

* Log into [powerbi.microsoft.com](https://powerbi.microsoft.com/).
* Create a new Power BI workspace called `NYCTaxiWorkspace1`.
* In Synapse Studio, navigate to the **Manage > Linked Services**.
* Select **+ New** and select **Connect to Power BI** and set these fields:

    |Setting | Suggested value | 
    |---|---|---|
    |**Name**|`NYCTaxiWorkspace1`|
    |**Workspace name**|`NYCTaxiWorkspace1`|
    |||
    
* Select **Create**.

### Create a Power BI dataset that uses data in your Synapse workspace

* In Synapse Studio, navigate to the **Develop > Power BI**.
* Navigate to **NYCTaxiWorkspace1 > Power BI datasets** and select **New Power BI dataset**.
* Hover over the SQLDB1 database and select **Download .pbids file**.
* Open the downloaded `.pbids` file. This will launch Power BI desktop and automatically connect it to SQLDB1 in your synapse workspace.
* If you see a dialog appear called **SQL server database**:
    * Select **Microsoft account**. 
    * Select **Sign in** and log in.
    * Select **Connect**.
* The **Navigator** dialog will open. When it does check the **PassengerCountStats** table and select **Load**.
* A **Connection settings** dialog will appear. Select **DirectQuery** and select **OK**
* Select the **Report** button on the left.
* Add **Line chart** to your report.
    * Drag the **PasssengerCount** column to **Visualizations > Axis**
    * Drag the **SumTripDistance** and **AvgTripDistance** columns to **Visualizations > Values**.
* In the **Home** tab, select **Publish**.
* It will ask you if you want to save your changes. Select **Save**.
* It will ask you to pick a filename. Choose `PassengerAnalysis.pbix` and select **Save**.
* It will ask you to **Select a destination** select `NYCTaxiWorkspace1` and select **Select**.
* Wait for publishing to finish.

### Configure authentication for your dataset

* Open [powerbi.microsoft.com](https://powerbi.microsoft.com/) and **Sign in**
* At the left, under **Workspaces** select the the `NYCTaxiWorkspace1` workspace that you published to.
* Inside that workspace you should see a dataset called `Passenger Analysis` and a report called `Passenger Analysis`.
* Hover over the `PassengerAnalysis` dataset and select the icon with the three dots and select **Settings**.
* In **Data source credentials** set the Authentication method to **OAuth2** and select **Sign in**.

### Edit a report report in Synapse Studio

* Go back to Synapse Studio and select **Close and refresh** now you should see:
    * Under **Power BI datasets**, a new dataset called **PassengerAnalysis**.
    * Under **Power BI datasets**, a new report called **PassengerAnalysis**.
* CLick on the **PassengerAnalysis** report. 
    * It won't show anything because you still need to configure authentication for the dataset.
* In SynapseStudio, navigate to **Develop > Power BI > Your workspace name > Power BI reports**.
* Close any windows showing the Power BI report.
* Refresh the **Power BI reports** node.
* Select the report and now you can edit the report directly within Synapse Studio.

## Monitor activities

* In Synapse Studio, Navigate to the monitor hub.
* In this location you can see a history of all the activities taking place in the workspace and which ones are active now.
* Explore the **Pipeline runs**, **Apache Spark applications**, and **SQL requests** and you can see what you've already done in the workspace.

## Next steps

Learn more about [Azure Synapse Analytics (preview)](overview-what-is.md)

