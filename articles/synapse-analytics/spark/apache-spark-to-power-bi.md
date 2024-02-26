---
title: 'Azure Synapse Studio notebooks'
description: This tutorial provides an overview on how to create a Power BI dashboard using Apache Spark and a Serverless SQL pool.
author: midesa
ms.author: midesa 
ms.reviewer: sngun 
ms.service: synapse-analytics
ms.subservice: spark
ms.topic: tutorial
ms.date: 11/16/2020
---

# Tutorial: Create a Power BI report using Apache Spark and Azure Synapse Analytics

Organizations often need to process large volumes of data before serving to key business stakeholders. In this tutorial, you will learn how to leverage the integrated experiences in Azure Synapse Analytics to process data using Apache Spark and later serve the data to end-users through Power BI and Serverless SQL.

## Before you begin
- [Azure Synapse Analytics workspace](../quickstart-create-workspace.md) with an ADLS Gen2 storage account configured as the default storage. 
- Power BI workspace and Power BI Desktop to visualize data. For details, see [create a Power BI workspace](/power-bi/service-create-the-new-workspaces) and [install Power BI desktop](https://powerbi.microsoft.com/downloads/)
- Linked service to connect your Azure Synapse Analytics and Power BI workspaces. For details, see [link to a Power BI workspace](../quickstart-power-bi.md)
- Serverless Apache Spark pool in your Synapse Analytics workspace. For details, see [create a serverless Apache Spark pool](../quickstart-create-apache-spark-pool-studio.md)
  
## Download and prepare the data
In this example, you will use Apache Spark to perform some analysis on taxi trip tip data from New York. The data is available through [Azure Open Datasets](https://azure.microsoft.com/services/open-datasets/catalog/nyc-taxi-limousine-commission-yellow-taxi-trip-records/). This subset of the dataset contains information about yellow taxi trips, including information about each trip, the start and end time and locations, the cost, and other interesting attributes.

1. Run the following lines to create a Spark dataframe by pasting the code into a new cell. This retrieves the data via the Open Datasets API. Pulling all of this data generates about 1.5 billion rows. The following code example uses start_date and end_date to apply a filter that returns a single month of data.
   
   ```python
    from azureml.opendatasets import NycTlcYellow
    from dateutil import parser
    from datetime import datetime

    end_date = parser.parse('2018-06-06')
    start_date = parser.parse('2018-05-01')
    nyc_tlc = NycTlcYellow(start_date=start_date, end_date=end_date)
    filtered_df = nyc_tlc.to_spark_dataframe()
   ```
2. Using Apache Spark SQL, we will create a database called NycTlcTutorial. We will use this database to store the results of our data processing.
   ```python
   %%pyspark
    spark.sql("CREATE DATABASE IF NOT EXISTS NycTlcTutorial")
   ```
3. Next, we will use Spark dataframe operations to process the data. In the following code, we perform the following transformations:
   1. The removal of columns which are not needed.
   2. The removal of outliers/incorrect values through filtering.
   3. The creation of new features like ```tripTimeSecs``` and ```tipped``` for additional analysis.
    ```python
    from pyspark.sql.functions import unix_timestamp, date_format, col, when

    taxi_df = filtered_df.select('totalAmount', 'fareAmount', 'tipAmount', 'paymentType', 'rateCodeId', 'passengerCount'\
                                    , 'tripDistance', 'tpepPickupDateTime', 'tpepDropoffDateTime'\
                                    , date_format('tpepPickupDateTime', 'hh').alias('pickupHour')\
                                    , date_format('tpepPickupDateTime', 'EEEE').alias('weekdayString')\
                                    , (unix_timestamp(col('tpepDropoffDateTime')) - unix_timestamp(col('tpepPickupDateTime'))).alias('tripTimeSecs')\
                                    , (when(col('tipAmount') > 0, 1).otherwise(0)).alias('tipped')
                                    )\
                            .filter((filtered_df.passengerCount > 0) & (filtered_df.passengerCount < 8)\
                                    & (filtered_df.tipAmount >= 0) & (filtered_df.tipAmount <= 25)\
                                    & (filtered_df.fareAmount >= 1) & (filtered_df.fareAmount <= 250)\
                                    & (filtered_df.tipAmount < filtered_df.fareAmount)\
                                    & (filtered_df.tripDistance > 0) & (filtered_df.tripDistance <= 100)\
                                    & (filtered_df.rateCodeId <= 5)
                                    & (filtered_df.paymentType.isin({"1", "2"})))
    ```
4. Finally, we will save our dataframe using the Apache Spark ```saveAsTable``` method. This will allow you to later query and connect to the same table using serverless SQL pools.
  ```python
     taxi_df.write.mode("overwrite").saveAsTable("NycTlcTutorial.nyctaxi")
  ```
   
## Query data using serverless SQL pools
Azure Synapse Analytics allows the different workspace computational engines to share databases and tables between its serverless Apache Spark pools and serverless SQL pool. This is powered through the Synapse [shared metadata management](../metadata/overview.md) capability. As a result, the Spark created databases and their parquet-backed tables become visible in the workspace serverless SQL pool.

To query your Apache Spark table using your serverless SQL pool:
   1. Once you have saved your Apache Spark table, switch over to the **data** tab.
   
   2. Under **Workspaces**, find the Apache Spark table that you just created and select **New SQL script** and then **Select TOP 100 rows**. 
      
      :::image type="content" source="../spark/media/apache-spark-power-bi/query-spark-table-with-sql.png" alt-text="SQL Query." border="true":::

   3. You can continue to refine your query or even visualize your results using the SQL charting options.

## Connect to Power BI
Next, we will connect our serverless SQL pool to our Power BI workspace. Once you have connected your workspace, you will be able to create Power BI reports both directly from Azure Synapse Analytics as well as from Power BI desktop.

>[!Note]
> Before you begin, you will need to set up a linked service to your [Power BI workspace](../quickstart-power-bi.md) and download the [Power BI desktop](/power-bi/service-create-the-new-workspaces).  

To connect our serverless SQL pool to our Power BI workspace:

1.  Navigate to the **Power BI datasets** tab and select the option to **+ New Dataset**. From the prompt, download the .pbids file from the SQL Analytics database you would like to use as a data source. 
   :::image type="content" source="../spark/media/apache-spark-power-bi/power-bi-datasets.png" alt-text="Power BI datasets." border="true":::

2.  Open the file with Power BI Desktop to create a dataset. Once you open the file, connect to the SQL server database using the **Microsoft account** and **Import** option. 
   

## Create a Power BI report
1. From Power BI desktop, you can now add a **key influencers** chart to your report.
   
   1. Drag the average *tipAmount* column to **Analyze** axis.
   
   2. Drag the **weekdayString**, average **tripDistance**, and average **tripTimeSecs** columns to the **Explain by** axis. 
   
   :::image type="content" source="../spark/media/apache-spark-power-bi/power-bi-desktop.png" alt-text="Power BI Desktop." border="true":::

2. On the Power BI desktop Home tab, select **Publish** and **Save** changes. Enter a file name and save this report to the *NycTaxiTutorial Workspace*.
   
3. In addition, you can also create Power BI visualizations from within your Azure Synapse Analytics workspace. To do this, navigate to the **Develop** tab in your Azure Synapse workspace and open the Power BI tab. From here, you can select your report and continue building additional visualizations. 
   
   :::image type="content" source="../spark/media/apache-spark-power-bi/power-bi-synapse.png" alt-text="Azure Synapse Analytics Workspace." border="true":::

For more details on how to create a dataset through serverless SQL and connect to Power BI, you can visit this tutorial on [connecting to Power BI desktop](../../synapse-analytics/sql/tutorial-connect-power-bi-desktop.md)

## Next steps
You can continue to learn more about data visualization capabilities in Azure Synapse Analytics by visiting the following documents and tutorials:
   - [Visualize data with serverless Apache Spark pools](../spark/apache-spark-data-visualization-tutorial.md)
   - [Overview of data visualization with Apache Spark pools](../spark/apache-spark-data-visualization.md)