---
title: 'Azure Synapse Studio notebooks'
description: This tutorial provides an overview on how to create a PowerBI dashboard using Apache Spark and a Serverless SQL pool.
services: synapse-analytics
author: midesa
ms.author: midesa 
ms.reviewer: jrasnick 
ms.service: synapse-analytics
ms.subservice: spark
ms.topic: tutorial
ms.date: 11/16/2020
---

# Tutorial: Create a PowerBI report using Apache Spark and Azure Synapse Analytics

Often times, organizations need to process large volumes of data before serving to key business stakeholders. In this tutorial, you will learn how to leverage the integrated experiences in Azure Synapse Analytics to process data using Apache Spark and later serve the data to end-users through Power BI and Serverless SQL.

# Before you begin
- [Create an Azure Synapse workspace and associated storage account](./quickstart-create-workspace)
- [Create a Power BI Professional or Premium workspace](https://docs.microsoft.com/power-bi/service-create-the-new-workspaces)
- [Link to a Power BI workspace](./quickstart-power-bi)
  
# Download and prepare the data
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
   
# Query data using Serverless SQL pools
Azure Synapse Analytics allows the different workspace computational engines to share databases and tables between its serverless Apache Spark pools (preview) and serverless SQL pool (preview). This is powered through the Synapse [shared metadata management](./metadata/overview.md) capability. As a result, the Spark created databases and their parquet-backed tables become visible in the workspace serverless SQL pool.

To query your Apache Spark table using your serverless SQL pool:
   1. Once you have saved your Apache Spark table, switch over to the **data** tab by s![Data Tab](../articles/synapse-analytics/spark/media/apache-spark-power-bdata-tab.png)


# Connect to Power BI
Next, we will connect our serverless SQL pool to our Power BI workspace. For more details on how to create a dataset from PowerBi, visit this documentation:

>[!Note]
> Before you begin, you will need to set up a linked service to your [Power BI workspace](./quickstart-power-bi) and download the [Power BI desktop](https://docs.microsoft.com/power-bi/service-create-the-new-workspaces).  

1.  Navigate to PowerBI and click + New Dataset. Then, connect to the SQL server database. You will need to select Microsoft account and then Connect. 
2. Add Line chart to your report
   1. Drag PassengerCount column to Visualizations Axis
   2. Drag Sum Trip Distance and Avg Trip distance columns
3. On the Home tab, select Publish and Save changes. Choose a file name and choose the NYCTaxi Workspace.

# Generate PowerBI report
1. Navigate to Develop Tab and scroll to PowerBI
2. Switch to Power BI reports and select the report that you just created
3. Add a new graph