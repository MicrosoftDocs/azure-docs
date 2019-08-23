---
title: 'Transform data using Azure Data Factory | Microsoft Docs'
description: Learn how to transform data or process data in Azure Data Factory using Hadoop, Machine Learning, or Azure Data Lake Analytics.
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 07/31/2018
author: nabhishek
ms.author: abnarain
manager: craigg
---
# Transform data in Azure Data Factory
> [!div class="op_single_selector"]
> * [Hive](transform-data-using-hadoop-hive.md)  
> * [Pig](transform-data-using-hadoop-pig.md)  
> * [MapReduce](transform-data-using-hadoop-map-reduce.md)  
> * [HDInsight Streaming](transform-data-using-hadoop-streaming.md)
> * [HDInsight Spark](transform-data-using-spark.md)
> * [Machine Learning](transform-data-using-machine-learning.md) 
> * [Stored Procedure](transform-data-using-stored-procedure.md)
> * [Data Lake Analytics U-SQL](transform-data-using-data-lake-analytics.md)
> * [Databricks notebook](transform-data-databricks-notebook.md)
> * [Databricks Jar](transform-data-databricks-jar.md)
> * [Databricks Python](transform-data-databricks-python.md)
> * [.NET custom](transform-data-using-dotnet-custom-activity.md)

## Overview
This article explains data transformation activities in Azure Data Factory that you can use to transform and processes your raw data into predictions and insights. A transformation activity executes in a computing environment such as Azure HDInsight cluster or an Azure Batch. It provides links to articles with detailed information on each transformation activity.

Data Factory supports the following data transformation activities that can be added to [pipelines](concepts-pipelines-activities.md) either individually or chained with another activity.

## HDInsight Hive activity
The HDInsight Hive activity in a Data Factory pipeline executes Hive queries on your own or on-demand Windows/Linux-based HDInsight cluster. See [Hive activity](transform-data-using-hadoop-hive.md) article for details about this activity. 

## HDInsight Pig activity
The HDInsight Pig activity in a Data Factory pipeline executes Pig queries on your own or on-demand Windows/Linux-based HDInsight cluster. See [Pig activity](transform-data-using-hadoop-pig.md) article for details about this activity. 

## HDInsight MapReduce activity
The HDInsight MapReduce activity in a Data Factory pipeline executes MapReduce programs on your own or on-demand Windows/Linux-based HDInsight cluster. See [MapReduce activity](transform-data-using-hadoop-map-reduce.md) article for details about this activity.

## HDInsight Streaming activity
The HDInsight Streaming activity in a Data Factory pipeline executes Hadoop Streaming programs on your own or on-demand Windows/Linux-based HDInsight cluster. See [HDInsight Streaming activity](transform-data-using-hadoop-streaming.md) for details about this activity.

## HDInsight Spark activity
The HDInsight Spark activity in a Data Factory pipeline executes Spark programs on your own HDInsight cluster. For details, see [Invoke Spark programs from Azure Data Factory](transform-data-using-spark.md). 

## Machine Learning activities
Azure Data Factory enables you to easily create pipelines that use a published Azure Machine Learning web service for predictive analytics. Using the [Batch Execution activity](transform-data-using-machine-learning.md) in an Azure Data Factory pipeline, you can invoke a Machine Learning web service to make predictions on the data in batch.

Over time, the predictive models in the Machine Learning scoring experiments need to be retrained using new input datasets. After you are done with retraining, you want to update the scoring web service with the retrained Machine Learning model. You can use the [Update Resource activity](update-machine-learning-models.md) to update the web service with the newly trained model.  

See [Use Machine Learning activities](transform-data-using-machine-learning.md) for details about these Machine Learning activities. 

## Stored procedure activity
You can use the SQL Server Stored Procedure activity in a Data Factory pipeline to invoke a stored procedure in one of the following data stores: Azure SQL Database, Azure SQL Data Warehouse, SQL Server Database in your enterprise or an Azure VM. See [Stored Procedure activity](transform-data-using-stored-procedure.md) article for details.  

## Data Lake Analytics U-SQL activity
Data Lake Analytics U-SQL activity runs a U-SQL script on an Azure Data Lake Analytics cluster. See [Data Analytics U-SQL activity](transform-data-using-data-lake-analytics.md) article for details. 

## Databricks Notebook activity

The Azure Databricks Notebook Activity in a Data Factory pipeline runs a Databricks notebook in your Azure Databricks workspace.Azure Databricks is a managed platform for running Apache Spark. See [Transform data by running a Databricks notebook](transform-data-databricks-notebook.md).

## Databricks Jar activity

The Azure Databricks Jar Activity in a Data Factory pipeline runs a Spark Jar in your Azure Databricks cluster. Azure Databricks is a managed platform for running Apache Spark. See [Transform data by running a Jar activity in Azure Databricks](transform-data-databricks-jar.md).

## Databricks Python activity

The Azure Databricks Python Activity in a Data Factory pipeline runs a Python file in your Azure Databricks cluster. Azure Databricks is a managed platform for running Apache Spark. See [Transform data by running a Python activity in Azure Databricks](transform-data-databricks-python.md).

## Custom activity
If you need to transform data in a way that is not supported by Data Factory, you can create a custom activity with your own data processing logic and use the activity in the pipeline. You can configure the custom .NET activity to run using either an Azure Batch service or an Azure HDInsight cluster. See [Use custom activities](transform-data-using-dotnet-custom-activity.md) article for details. 

You can create a custom activity to run R scripts on your HDInsight cluster with R installed. See [Run R Script using Azure Data Factory](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/RunRScriptUsingADFSample). 

## Compute environments
You create a linked service for the compute environment and then use the linked service when defining a transformation activity. There are two types of compute environments supported by Data Factory. 

- **On-Demand**:  In this case, the computing environment is fully managed by Data Factory. It is automatically created by the Data Factory service before a job is submitted to process data and removed when the job is completed. You can configure and control granular settings of the on-demand compute environment for job execution, cluster management, and bootstrapping actions. 
- **Bring Your Own**: In this case, you can register your own computing environment (for example HDInsight cluster) as a linked service in Data Factory. The computing environment is managed by you and the Data Factory service uses it to execute the activities. 

See [Compute Linked Services](compute-linked-services.md) article to learn about compute services supported by Data Factory. 

## Next steps
See the following tutorial for an example of using a transformation activity: [Tutorial: transform data using Spark](tutorial-transform-data-spark-powershell.md)
