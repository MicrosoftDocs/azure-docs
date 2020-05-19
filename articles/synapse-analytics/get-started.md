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

## Find and prepare an ADLSGEN2 account for use with Azure Synapse
* Open the Azure Portal
* Create a new Storage account
* Key settings for the ADLSGEN2 account in the **Basics** tab
    * **Storage account name** - you can give it any name. In this document we'll refer to it as `contosolake`
    * **Account kind** - must be set to `StorageV2`
    * **Location** - you can pick any location but its recommended your Synapse workspace and ADLSGEN2 account are in the same region
* Key settings for the ADLSGEN2 account in the **Advanced** tab
    * **Data Lake Storage Gen2** - set to `Enabled`
* One the sotrage account is created, perform these steps
    * Ensure that you are assigned to the Owner role on the storage account
    * Assign yourself to the Azure Blob Storage Owner role on the Storage Account
    * Create a container. You can give it any name. In this document we will use the name 'users`
  
## Create a Synapse workspace
* Open the Azure portal and at the top search for `Synapse`
* In the search results, under **Services** click **Azure Synapse Analytics (workspaces preview)**
* Click **+ Add**
* In the **Basics** tab enter this information
    * **Workspace name** - you can call it anything. In this document we will use `myworkspace`
    * **Region** - match the region you chose for the storage account
    * Under **Select Data Lake Storage Gen 2** select the account and container you prevpoiusly creates
* Click **Review + create**
* Click **Create**
* Your workspace will be ready in a few minutes

## Launch Synapse Studio
Once your workspace is created, you can use Synapse Studio with it one of two ways:
* Open your Synapse workspace in the [Azure portal](https://portal.azure.com) and at the top of the Overview section click
* Go to https://web.azuresynapse.net and login to your workspace

## Create a SQL pool

* In Synapse Studio, on the left side click **Manage > SQL pools**
* Click **+New**
* For **SQL pool name** enter `SQLDB1`
* For **Performance level** use `DW100C`
* Click **Review+create**
* Click **Create**
* Your pool will be ready in a few minutes

## Create a Spark pool

* In Synapse Studio, on the left side click **Manage > Apache Sparke pools**
* Click **+New**
* For **Apache Spark pool name** enter `Spark1`
* For **Node size** select `Small`
* For **Number of nodes** set the minimum to 3 and the maximum to 3
* Click **Review+create**
* Click **Create**
* Your Spark pool will be ready in a few seconds

## Load the NYC Taxi Sample data into your SQL pool

* In Synapse Studio, it the topmost blue meny, click on the **?** icon.
* Select **Getting started > Getting started hub**
* In the card labelled **Query sample data** select the SQL pool `SQLDB1`
* Click **Query data**
* You will see a notification saying "Loading sample data". 
* NYXC taxi data tables are being loaded into SQLDB1 and this takes only a few minutes. Wait until it finishes.

## Explore the NYC taxi data in the SQL Pool

* In Synapse Studio, navigate to the **Data** hub
* Navigate to **SQLDB1 > Tables > dbo.Trip**
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
* In the SQL scripts, result window select **Chart** to see a visualization of the results as a line chart

## Load the NYC data into a Spark Database

* In Synapse Studio, navigate to the **Develop hub"
* Click **+** and select **Notebook**
* At the top of the notebook, set the **Attach to** value to `Spark1`
* At the top of the notebook, set the **Language** to `Spark (Scala)`
* Click **Add code** to a notebook code cell and paste the text below:
    ```
    spark.sql("CREATE DATABASE nyctaxi")
    val df = spark.read.sqlanalytics("SQLDB1.dbo.Trip") 
    df.write.saveAsTable("nyctaxi.trip")
    ```
 * Navigate to the Data hub, right-click on Databases and select **Refresh**
 * Now you should see a Spark DB called nyxtaxi and inside that DB a table called trip
 
 ## Analyze the NYC Taxi data using Spark and notebooks
 * Return to your notebook
 * Create a new code cell and run this text
   ```
   %%pyspark
   df = spark.sql("SELECT * FROM nyctaxi.trip") 
   df.show(10)
   ```
 * To show this in a nicer format run this code
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
 
## Visualize data with Spark and notebooks

With spark notebooks you can control exactly how render charts. The following
code shows a simple example using the popular libraries matplotlib and seaborn.

    ```
    %%pyspark
    import matplotlib.pyplot as plt
    import seaborn as sns
    import pandas as pd

    sns.set(style = "whitegrid")

    df = spark.sql("SELECT * FROM nyctaxi.passengercountstats")
    df = df.toPandas()
    sns.barplot(x="PassengerCount", y="SumTripDistance", data = df)
    plt.show()
    ```
## Load data from a Spark table into a SQL Pool table

    ```
    %%spark
    val df = spark.sql("SELECT * FROM nyctaxi.passengercountstats")
    df.write.sqlanalytics("SQLDB1.dbo.PassengerCountStats", Constants.INTERNAL )
    ```

## Analytze NYC taxi data in Spark databases using SQL-on demand 

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

## Monitor activites

* In Synapse Studio, Navigate to the monitor hub.
* In this location you can see a history of all the activites taking place in the workspace and which ones are active now.
* Explore the **Pipeline runs**, **Apache Spark applications**, and **SQL requests** and you can see what you've already done in the workspace.




## Visualize data with Power BI

Your data can now be easily analyzed and visualized in Power BI. Synapse offers a unique integration which allows you to link a Power BI workspace to you Synapse workspace. Before starting, frist follow the steps in this [quickstart](quickstart-power-bi.md) to link your Power BI workspace.

* In Synapse Studio, navigate to the **Data** hub
* Expand the **Power BI** node and example any linked PowerBI workspace.
* Inside you'll see any PowerBI datasets and reports in the PowerBI workspace

### Create a PowerBI dataset

To create a PowerBI dataset requires you to use PowerBI desktop.
* Download and install PowerBI Desktop if needed
* Once PowerBI Desktop is isntalled
* Under your linked PowerBI workspace, click on** Power BI datasets* and select **+ New  Power BI dataset**
* Hover over the SQLDB1 database and select **Download .pbids file**
* Open the downlaod pbids file. This will launch Power BI desktop and automatically connect it to SQLDB1
* Check the **Trip** table and click **Load**
* A **Connection settings** message will appear, sleect DirectQuery and click **OK**
* NOTE: If you are more familiar with PowerBI you can click on the **Model** button on the left and model the relationships between tables. This tutorial will skip this to make the tutorial smaller.
* Click on the **Report** button on the left
* In **Visualizations**, click **Clustered Column chart**. This will cause a new table to appear in the report
* Drag the **PasssengerCount** column to **Visualizations > Legend**
* Drag the **TotalAmount** column to **Visualizations > Values**
* In the Home tab, click **Publish** and save it with this name `taxi.pbix` publish it to your PowerBI workspace
* Once publishiing is finished switch back to Synapse Studio and click **Close and refresh**.
* Under **Power BI datasets**, Now you should see a new dataset called **taxi**.
* Refresh **Power BI reports** and yous should see a the report you previously created called **taxi**
* Right click on the report and select **Open**. 
* Now you can edit the report directly within Synapse Studio

