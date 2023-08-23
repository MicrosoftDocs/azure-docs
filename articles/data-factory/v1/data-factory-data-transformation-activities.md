---
title: 'Data Transformation: Process & transform data '
description: Learn how to transform data or process data in Azure Data Factory using Hadoop, ML Studio (classic), or Azure Data Lake Analytics.
author: dcstwh
ms.author: weetok
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: v1
ms.custom: devx-track-dotnet
ms.topic: conceptual
ms.date: 04/12/2023
---

# Transform data in Azure Data Factory version 1

[!INCLUDE[ML Studio (classic) retirement](../../../includes/machine-learning-studio-classic-deprecation.md)] 

> [!div class="op_single_selector"]
> * [Hive](data-factory-hive-activity.md)  
> * [Pig](data-factory-pig-activity.md)  
> * [MapReduce](data-factory-map-reduce.md)  
> * [Hadoop Streaming](data-factory-hadoop-streaming-activity.md)
> * [ML Studio (classic)](data-factory-azure-ml-batch-execution-activity.md) 
> * [Stored Procedure](data-factory-stored-proc-activity.md)
> * [Data Lake Analytics U-SQL](data-factory-usql-activity.md)
> * [.NET custom](data-factory-use-custom-activities.md)

## Overview
> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [data transformation activities in Data Factory](../transform-data.md).

This article explains data transformation activities in Azure Data Factory that you can use to transform and processes your raw data into predictions and insights. A transformation activity executes in a computing environment such as Azure HDInsight cluster or an Azure Batch. It provides links to articles with detailed information on each transformation activity.

Data Factory supports the following data transformation activities that can be added to [pipelines](data-factory-create-pipelines.md) either individually or chained with another activity.

> [!NOTE]
> For a walkthrough with step-by-step instructions, see [Create a pipeline with Hive transformation](data-factory-build-your-first-pipeline.md) article.  
> 
> 

## HDInsight Hive activity
The HDInsight Hive activity in a Data Factory pipeline executes Hive queries on your own or on-demand Windows/Linux-based HDInsight cluster. See [Hive Activity](data-factory-hive-activity.md) article for details about this activity. 

## HDInsight Pig activity
The HDInsight Pig activity in a Data Factory pipeline executes Pig queries on your own or on-demand Windows/Linux-based HDInsight cluster. See [Pig Activity](data-factory-pig-activity.md) article for details about this activity. 

## HDInsight MapReduce activity
The HDInsight MapReduce activity in a Data Factory pipeline executes MapReduce programs on your own or on-demand Windows/Linux-based HDInsight cluster. See [MapReduce Activity](data-factory-map-reduce.md) article for details about this activity.

## HDInsight Streaming activity
The HDInsight Streaming Activity in a Data Factory pipeline executes Hadoop Streaming programs on your own or on-demand Windows/Linux-based HDInsight cluster. See [HDInsight Streaming activity](data-factory-hadoop-streaming-activity.md) for details about this activity.

## HDInsight Spark Activity
The HDInsight Spark activity in a Data Factory pipeline executes Spark programs on your own HDInsight cluster. For details, see [Invoke Spark programs from Azure Data Factory](data-factory-spark.md). 

## ML Studio (classic) activities

[!INCLUDE[ML Studio (classic) retirement](../../../includes/machine-learning-studio-classic-deprecation.md)] 

Azure Data Factory enables you to easily create pipelines that use a published ML Studio (classic) web service for predictive analytics. Using the [Batch Execution Activity](data-factory-azure-ml-batch-execution-activity.md#invoking-a-web-service-using-batch-execution-activity) in an Azure Data Factory pipeline, you can invoke a Studio (classic) web service to make predictions on the data in batch.

Over time, the predictive models in the Studio (classic) scoring experiments need to be retrained using new input datasets. After you are done with retraining, you want to update the scoring web service with the retrained machine learning model. You can use the [Update Resource Activity](data-factory-azure-ml-batch-execution-activity.md#updating-models-using-update-resource-activity) to update the web service with the newly trained model.  

See [Use ML Studio (classic) activities](data-factory-azure-ml-batch-execution-activity.md) for details about these Studio (classic) activities. 

## Stored procedure activity
You can use the SQL Server Stored Procedure activity in a Data Factory pipeline to invoke a stored procedure in one of the following data stores: Azure SQL Database, Azure Synapse Analytics, SQL Server Database in your enterprise or an Azure VM. See [Stored Procedure Activity](data-factory-stored-proc-activity.md) article for details.  

## Data Lake Analytics U-SQL activity
Data Lake Analytics U-SQL Activity runs a U-SQL script on an Azure Data Lake Analytics cluster. See [Data Analytics U-SQL Activity](data-factory-usql-activity.md) article for details. 

## .NET custom activity
If you need to transform data in a way that is not supported by Data Factory, you can create a custom activity with your own data processing logic and use the activity in the pipeline. You can configure the custom .NET activity to run using either an Azure Batch service or an Azure HDInsight cluster. See [Use custom activities](data-factory-use-custom-activities.md) article for details. 

You can create a custom activity to run R scripts on your HDInsight cluster with R installed. See [Run R Script using Azure Data Factory](https://github.com/Azure/Azure-DataFactory/tree/master/SamplesV1/RunRScriptUsingADFSample). 

## Compute environments
You create a linked service for the compute environment and then use the linked service when defining a transformation activity. There are two types of compute environments supported by Data Factory. 

1. **On-Demand**:  In this case, the computing environment is fully managed by Data Factory. It is automatically created by the Data Factory service before a job is submitted to process data and removed when the job is completed. You can configure and control granular settings of the on-demand compute environment for job execution, cluster management, and bootstrapping actions. 
2. **Bring Your Own**: In this case, you can register your own computing environment (for example HDInsight cluster) as a linked service in Data Factory. The computing environment is managed by you and the Data Factory service uses it to execute the activities. 

See [Compute Linked Services](data-factory-compute-linked-services.md) article to learn about compute services supported by Data Factory. 

## Summary
Azure Data Factory supports the following data transformation activities and the compute environments for the activities. The transformation activities can be added to pipelines either individually or chained with another activity.

| Data transformation activity | Compute environment |
|:--- |:--- |
| [Hive](data-factory-hive-activity.md) |HDInsight [Hadoop] |
| [Pig](data-factory-pig-activity.md) |HDInsight [Hadoop] |
| [MapReduce](data-factory-map-reduce.md) |HDInsight [Hadoop] |
| [Hadoop Streaming](data-factory-hadoop-streaming-activity.md) |HDInsight [Hadoop] |
| [ML Studio (classic) activities: Batch Execution and Update Resource](data-factory-azure-ml-batch-execution-activity.md) |Azure VM |
| [Stored Procedure](data-factory-stored-proc-activity.md) |Azure SQL, Azure Synapse Analytics, or SQL Server |
| [Data Lake Analytics U-SQL](data-factory-usql-activity.md) |Azure Data Lake Analytics |
| [DotNet](data-factory-use-custom-activities.md) |HDInsight [Hadoop] or Azure Batch |
