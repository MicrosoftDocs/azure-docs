---
title: Use the model data collection feature in Azure Machine Learning Workbench | Microsoft Docs
description: This article talks about how to use the model data collection feature in Azure Machine Learning Workbench 
services: machine-learning
author: aashishb
ms.author: aashishb
manager: hjerez
ms.reviewer: jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 09/12/2017

ROBOTS: NOINDEX
---

# Collect model data by using data collection

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)]

You can use the model data collection feature in Azure Machine Learning to archive model inputs and predictions from a web service.

## Install the data collection package
You can install the data collection library natively on Linux and Windows.

### Windows
On Windows, install the data collector module by using the following command:

    pip install azureml.datacollector

### Linux
On Linux, install the libxml++ library first. Run the following command, which must be issued under sudo:

    sudo apt-get install libxml++2.6-2v5

Then run the following command:

    pip install azureml.datacollector

## Set environment variables

Model data collection depends on two environment variables. AML_MODEL_DC_STORAGE_ENABLED must be set to **true** (all lowercase) and AML_MODEL_DC_STORAGE must be set to the connection string for the Azure Storage account where you want to store the data.

These environment variables are already set for you when the web service is running on a cluster in Azure. When running locally you have to set them yourself. If you are using Docker, use the -e parameter of the docker run command to pass environment variables.

## Collect data

To use model data collection, make the following changes to your scoring file:

1. Add the following code at the top of the file:
   
    ```python
    from azureml.datacollector import ModelDataCollector
    ```

1. Add the following lines of code to the `init()` function:
    
    ```python
    global inputs_dc, prediction_dc
    inputs_dc = ModelDataCollector('model.pkl',identifier="inputs")
    prediction_dc = ModelDataCollector('model.pkl', identifier="prediction")
    ```

1. Add the following lines of code to the `run(input_df)` function:
    
    ```python
    global inputs_dc, prediction_dc
    inputs_dc.collect(input_df)
    prediction_dc.collect(pred)
    ```

    Make sure that the variables `input_df` and `pred` (prediction value from `model.predict()`) are initialized before you call the `collect()` function on them.

1. Use the `az ml service create realtime` command with the `--collect-model-data true` switch to create a real-time web service. This step makes sure that the model data is collected when the service is run.

     ```batch
    c:\temp\myIris> az ml service create realtime -f iris_score.py --model-file model.pkl -s service_schema.json -n irisapp -r python --collect-model-data true 
    ```
    
1. To test the data collection, run the `az ml service run realtime` command:

    ```
    C:\Temp\myIris> az ml service run realtime -i irisapp -d "ADD YOUR INPUT DATA HERE!!" 
    ``` 
    
## View the collected data
To view the collected data in blob storage:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **All Services**.
1. In the search box, type **Storage accounts** and select the Enter key.
1. From the **Storage accounts** search blade, select the **Storage account** resource. To determine your storage account, use the following steps:

    a. Go to Azure Machine Learning Workbench, select the project you're working on, and open a command prompt from the **File** menu.
    
    b. Enter `az ml env show -v` and check the *storage_account* value. This is the name of your storage account.

1. Select **Containers** on the resource blade menu, and then the container called **modeldata**. To see data start propagating to the storage account, you might need to wait up to 10 minutes after the first web service request. Data flows into blobs with the following container path:

    `/modeldata/<subscription_id>/<resource_group_name>/<model_management_account_name>/<webservice_name>/<model_id>-<model_name>-<model_version>/<identifier>/<year>/<month>/<day>/data.csv`

Data can be consumed from Azure blobs in a variety of ways, through both Microsoft software and open-source tools. Here are some examples:
- Azure Machine Learning Workbench: Open the .csv file in Azure Machine Learning Workbench by adding the .csv file as a data source.
- Excel: Open the daily .csv files as a spreadsheet.
- [Power BI](https://powerbi.microsoft.com/documentation/powerbi-azure-and-power-bi/): Create charts with data pulled from .csv data in blobs.
- [Spark](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-overview): Create a data frame with a large portion of .csv data.
    ```python
    var df = spark.read.format("com.databricks.spark.csv").option("inferSchema","true").option("header","true").load("wasb://modeldata@<storageaccount>.blob.core.windows.net/<subscription_id>/<resource_group_name>/<model_management_account_name>/<webservice_name>/<model_id>-<model_name>-<model_version>/<identifier>/<year>/<month>/<date>/*")
    ```
- [Hive](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-linux-tutorial-get-started): Load .csv data into a Hive table and perform SQL queries directly against the blob.

