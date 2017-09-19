---
title: How to use Model Management Data Collection feature in Azure Machine Learning Workbench | Microsoft Docs
description: This document talks about how to use Model Management Data Collection feature in Azure Machine Learning Workbench 
services: machine-learning
author: aashishb
ms.author: aashishb
manager: neerajkh
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 09/12/2017
---

# How to collect model data using data collection

The model data collection feature allows you to archive model inputs and predictions from a machine learning web service. This document talks about the following aspects of model data collection:

- How to install data collection package
- How to use data collection
- How to view and consume the collected data

## How to install the data collection package
The data collection library can be installed natively on Linux and Windows.

### Windows
On Windows, the data collector module can be installed with the following command:

    pip install azureml.datacollector

### Linux
On Linux, the libxml++ library must be installed first. Run the following command, which must be issued under sudo:

    sudo apt-get install libxml++2.6-2v5

Then issue the following command:

    pip install azureml.datacollector
## How to use data collection

In order to use model data collection, you need to make the following changes to your scoring file:

1. Add the following code at the top of the file
   
    ```python
    from azureml.datacollector import ModelDataCollector
    ```

2. Add the following lines of code to the `init()` function,
    
    ```python
    global inputs_dc, prediction_dc
    inputs_dc = ModelDataCollector('model.pkl',identifier="inputs")
    prediction_dc = ModelDataCollector('model.pkl', identifier="prediction")
    ```

3. Add the following lines of code to the `run(input_df)` function,
    
    ```python
    global inputs_dc, prediction_dc
    inputs_dc.collect(input_df)
    prediction_dc.collect(pred)
    ```

    Make sure that variables `input_df` and `pred` (prediction value from `model.predict()`) are initialized before you call `collect()` function on them.

4. Use `az ml service create realtime` command with the `--collect-model-data true` switch to create a realtime web service. This makes sure that the model data gets collected when the service is being run.

     ```batch
    c:\temp\myIris> az ml service create realtime -f iris_score.py --model-file model.pkl -s service_schema.json -n irisapp -r python --collect-model-data true 
    ```
    
5. To test the data collection, execute the `az ml service run realtime`,

    ```
    C:\Temp\myIris> az ml service run realtime -i irisapp -d "ADD YOUR INPUT DATA HERE!!" 
    ``` 
    
## How to view and consume the collected data
To view the collected data in blob storage:

1. Sign into the [Azure portal](https://portal.azure.com).
2. Click **More Services**.
3. In the search box, type `Storage accounts` and press **Enter**
4. From the **Storage accounts** search blade, select the **Storage account** resource. In order to determine your storage account, use the following steps,

    a. Go to Azure ML Workbench, select the project you're working on, and open command-line prompt from **File** menu
    
    b. Type `az ml env show -v` and check the *storage_account* value. This is the name of your storage account

5. Click on **Containers** in the resource blade menu, then the container called **modeldata**. You may need to wait up to 10 minutes after the first web service request in order to see data start propagating to the storage account. Data flows into blobs with the following container path:

    `/modeldata/<subscription_id>/<resource_group_name>/<model_management_account_name>/<webservice_name>/<model_id>-<model_name>-<model_version>/<identifier>/<year>/<month>/<day>/data.csv`

Data can be consumed from Azure blobs in a variety of ways using both Microsoft software and open source tools. Here are some examples:
 - Azure ML Workbench - open the csv file in Azure ML Workbench by adding csv file as a data source
 - Excel - open the daily csv files as a spreadsheet
 - [Power BI](https://powerbi.microsoft.com/en-us/documentation/powerbi-azure-and-power-bi/) - create charts with data pulled from csv data in blobs
 - [Spark](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-overview) - create a dataframe with a large portion of csv data
    ```python
    var df = spark.read.format("com.databricks.spark.csv").option("inferSchema","true").option("header","true").load("wasb://modeldata@<storageaccount>.blob.core.windows.net/<subscription_id>/<resource_group_name>/<model_management_account_name>/<webservice_name>/<model_id>-<model_name>-<model_version>/<identifier>/<year>/<month>/<date>/*")
    ```
- [Hive](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-linux-tutorial-get-started) - load csv data into a hive table and perform SQL queries directly against blob

