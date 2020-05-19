---
title: Getting started with Azure Synapse Analytics 
description: Steps by steps to quickly understand basic concepts in Azure Synapse
services: synapse-analytics
author: saveenr
ms.author: jrasnick
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.topic: quickstart
ms.date: 05/19/2020 
---

# Getting Started with Azure Synapse Analytics
This tutorial guides your all the basic steps needed to use Azure Synapse Analytics.

## Prepare a storage account for use with a Synapse workspace
* Open the [Azure Portal](https://portal.azure.com)
* Create a new Storage account
* Key settings in the **Basics** tab
    * **Storage account name** - you can give it any name. In this document we'll refer to it as `contosolake`
    * **Account kind** - must be set to `StorageV2`
    * **Location** - you can pick any location but its recommended your Synapse workspace and ADLSGEN2 account are in the same region
* Key settings in the **Advanced** tab
    * **Data Lake Storage Gen2** - set to `Enabled`. Azure Synapse only works with storage accounts where this setting is enabled.
* Once the storage account is created, perform these steps:
    * Ensure that you are assigned to the **Owner** role on the storage account
    * Assign yourself to the **Azure Blob Storage Owner** role on the Storage Account
    * Create a container. You can give it any name. In this document we will use the name 'users`
* Click **Review + create**. Click **Create**. 
    
## Create a Synapse workspace
* Open the [Azure Portal](https://portal.azure.com) and at the top search for `Synapse`.
* In the search results, under **Services** click **Azure Synapse Analytics (workspaces preview)**
* Click **+ Add**
Key settings in the **Basics** tab enter
    * **Workspace name** - you can call it anything. In this document we will use `myworkspace`
    * **Region** - match the region you chose for the storage account
    * Under **Select Data Lake Storage Gen 2** select the account and container you prevpoiusly creates
* Click **Review + create**. Click **Create**. Your workspace will be ready in a few minutes

## Launch Synapse Studio
Once your Synapse workspace is created, you have two ways to open Synapse Studio:
* Open your Synapse workspace in the [Azure portal](https://portal.azure.com) and at the top of the **Overview** section click **Launch Synapse Studio**
* Directly go to https://web.azuresynapse.net and login to your workspace.

## Create a SQL pool
* In Synapse Studio, on the left side navigate to **Manage > SQL pools**
* NOTE: All Synapse workspaces come with a pre-created pool called **SQL on-demand**.
* Click **+New** and enter these settings:
    * For **SQL pool name** enter `SQLDB1`
    * For **Performance level** use `DW100C`
* Click **Review+create** and then click **Create**
* Your pool will be ready in a few minutes

NOTE:
* A Synapse SQL pool corresponds to what used to be called an "Azure SQL Data Warehouse"
* A SQL pool consumes billable resources as long as it's runing. So, you can pause the pool when needed to reduce costs
* When your SQL pool is created it will be associated with a SQL pool database also called **SQLDB1**.

## Create a Apache Spark pool

* In Synapse Studio, on the left side click **Manage > Apache Spark pools**
* Click **+New** and enter these settings:
    * For **Apache Spark pool name** enter `Spark1`
    * For **Node size** select `Small`
    * For **Number of nodes** set the minimum to 3 and the maximum to 3
* Click **Review+create** and then click **Create**
* Your Spark pool will be ready in a few seconds

NOTE:
* Despite the name, a spark pool is not like a SQL pool. It's just some some basic metadata that you use to inform
  the Synapse workspace how to interact with Spark. 
* Because they are metadata Spark pools cannot be started or stopped. 
* When you do any Spark activity in Synapse, you specify a spark pool to use. The pool informs SYnapse how many Spark resources to use. You pay only for the resources thar are used. When you actively stop using the pool the reources will automatically time-out and be recycled.
* NOTE: Spark Databases are independently created from Spark pools. A workspace always has a Spark DB caleld **default** and you can create additional Spark databases.

## SQL on-demand pools
SQL on-demand is a special kind of SQL pool that is alwways available with a Synapse workspace. It allows you to work with SQL without having to create or think avout managing a Synapse SQL pool.

NOTE:
* Unlike the other kinds of pools, billing for SQL on-demand is based on the amount of data scanned to run the query - and not the number of resources used to execute the query.
* SQL on-demand also has its own kind of SQL on-demand databases that exist independently from any SQL on-demand pool
* Currently a workspace always has exactly one SQL on-demand pool named **SQL on-demand**.

## Load the NYC Taxi Sample data into the SQLDB1 database

* In Synapse Studio, in the top-most blue menu, click on the **?** icon.
* Select **Getting started > Getting started hub**
* In the card labelled **Query sample data** select the SQL pool named `SQLDB1`
* Click **Query data**. You will see a notification saying "Loading sample data" which will appear an then disappear.
* You'll see alight-blue  notification bar near the top of Synapse studio indicating that data is being loaded into SQLDB1. Wait until it turns green then dismiss it.

## Explore the NYC taxi data in the SQL Pool

* In Synapse Studio, navigate to the **Data** hub
* Navigate to **SQLDB1 > Tables**. You'll see several tables have been loaded.
* Right-click on the **dbo.Trip** table and select **New SQL Script > Select TOP 100 Rows**
* A new SQL script will be created and automaticall run
* Notice that at the top of the SQL script **Connect to** is automatically set to the SQL pool called SQLDB1
* Replace the text of the SQL script with this code and run it.
    ```
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

## Create a Spark Ddatabase adnd load the NYC taxi data into it
We have data available in a SQL pool DB. Now we load it into a Spark database.

* In Synapse Studio, navigate to the **Develop hub"
* Click **+** and select **Notebook**
* At the top of the notebook, set the **Attach to** value to `Spark1`
* Click **Add code** to add a notebook code cell and paste the text below:
    ```
    %% spark
    spark.sql("CREATE DATABASE IF NOT EXISTS nyctaxi")
    val df = spark.read.sqlanalytics("SQLDB1.dbo.Trip") 
    df.write.mode("overwrite").saveAsTable("nyctaxi.trip")
    ```
 * Navigate to the Data hub, right-click on Databases and select **Refresh**
 * Now you should see these databases:
     * SQLDB (SQL pool)
     * nyctaxi (Spark)
      
 ## Analyze the NYC Taxi data using Spark and notebooks
 * Return to your notebook
 * Create a new code cell, enter the text below, adn run the cell
   ```
   %%pyspark
   df = spark.sql("SELECT * FROM nyctaxi.trip") 
   display(df)
   ```
 * Run this code to perform the same analysis we did earlier with the SQL pool
   ```
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
 * In the cell results, click on **Chart** to see the data visualized
 
## Customize data visualization data with Spark and notebooks

With spark notebooks you can control exactly how render charts. The following
code shows a simple example using the popular libraries matplotlib and seaborn.

    ```
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

## Load data from a Spark table into a SQL Pool table

    ```
    %%spark
    val df = spark.sql("SELECT * FROM nyctaxi.passengercountstats")
    df.write.sqlanalytics("SQLDB1.dbo.PassengerCountStats", Constants.INTERNAL )
    ```

## Analyze NYC taxi data in Spark databases using SQL-on demand 

* Tables in Spark databases are automatically visible and queryable by SQL on-demand
* In Synapse Studio navigate to the Develop hub and create a new SQL script
* Set **Connect to** to **SQL on-demand** 
* Paste the following text into the script
    ```
    SELECT *
    FROM nyctaxi.dbo.passengercountstats
    ```
* Click **Run**
* NOTE: THe first time you run this it will take about 10 seconds for SQL on-demand to gather SQL resources needed to run
  your queries. Every subsequent query will not require this time.
  
  
## Use pipeline to orchestrate activities

You can orchestrate a wide variety of tasks in Azure Synapse. In this section, you'll see how easy it is.

* In Synapse Studio, navigate to the Orchestrate bug
* Click **+** then select **Pipeline**. A new pipeline will be created,
* Navigate to the Develop hub and find any  of the notebooks you previously created
* Drag that notebook into the pipeline
* In the pipeline click **Add trigger > New/edit**
* In** Choose trigger** click **New**, and then in Recurrence set the trigger to run every 1 hour.
* Click **OK**
* Click **Publish All** and the pipeline will run every hour
* If you want to make the pipeline run now without waiting for the next hour click **Add trigger > New/edit**


## Visualize data with Power BI

Your data can now be easily analyzed and visualized in Power BI. Synapse offers a unique integration which allows you to link a Power BI workspace to you Synapse workspace. Before starting, frist follow the steps in this [quickstart](quickstart-power-bi.md) to link your Power BI workspace.

### Create a PowerBI Workspace and link it to your Synapse Workspace
* Log into powerbi.microsoft.com
* Create a new PowerBI workspace called `NYXTaxiWorkspace1`
* In Synapse Studio, navigate to the **Manage > Linked Services**
* Click **+ New** and click **Connect to PowerBI** and set these fields:
    * Set **Name** to `NYXTaxiWorkspace1`
    * Set **Workspace name** to `NYXTaxiWorkspace1`
* Click **Create**

### Create a PowerBI dataset that uses data in your Synapse workspace
* In Synapse Studio, navigate to the **Develop > Power BI **
* Navigate to **NYXTaxiWorkspace1 > Power BI datasets** and click **New Power BI dataset**
* Hover over the SQLDB1 database and select **Download .pbids file**
* Open the downloaded `.pbids` file. This will launch Power BI desktop and automatically connect it to SQLDB1 in your synapse workspace.
* If you see a dialog appear called **SQL server database**:
    * Select **Microsoft account** 
    * Click **Sign in** and log in
    * Click **Connect**
* The **Navigator** dialog will open. When it does check the **PassengerCountStats** table and click **Load**
* A **Connection settings** dialog will appear. Select **DirectQuery** and click **OK**
* Click on the **Report** button on the left
* Add **Line chart** to your report
    * Drag the **PasssengerCount** column to **Visualizations > Axis**
    * Drag the **SumTripDistance** and **AvgTripDistance** columns to **Visualizations > Values**
* In the **Home** tab, click **Publish**
* It will ask you if you want to save your changes. Click **Save**.
* It will ask you to pick a filename. Choose `PassengerAnalysis.pbix` and click **Save**
* It will ask you to **Select a destination** select `NYXTaxiWorkspace1` and click **Select**
* Wait for publishing to finish

### Configure authentitication for your dataset
* Open https://powerbi.microsoft.com and **Sign in**
* At the left, under **Workspaces** select the the `NYXTaxiWorkspace1` workspace that you published to
* Inside that workspace you should see a dataset called `Passenger Analysis` and a report called `Passenger Analysis` and
* Hover over the `PassengerAnalysis` dataset and click the icon with the three dots and select **Settings**
* In **Data source credentials** set the Authentication method to **OAuth2** and click **Sign in**

### Edit a report report in Synapse Studio
* Go back to  Synapse Studio and click **Close and refresh** now you shold see
    * Under **Power BI datasets**, a new dataset called **PassengerAnalysis**.
    * Under **Power BI datasets**, a new report called **PassengerAnalysis**.
* CLick on the **PassengerAnalysis** report. 
    * It won't show anything because you still need to configure authentication for the dataset
* In SynapseStudio, navigate to **Develop > PowerBI > Your workspace name > Power BI reports**
* Close any windows showing the PowerBI report
* Refresh the **Power BI reports** node
* Click on the report and now you can edit the report directly within Synapse Studio

## Monitor activites

* In Synapse Studio, Navigate to the monitor hub.
* In this location you can see a history of all the activites taking place in the workspace and which ones are active now.
* Explore the **Pipeline runs**, **Apache Spark applications**, and **SQL requests** and you can see what you've already done in the workspace.



