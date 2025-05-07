---
title: Transform data
titleSuffix: Azure Data Factory & Azure Synapse
description: Transform data or process data in Azure Data Factory or Azure Synapse Analytics using Hadoop, ML Studio (classic), or Azure Data Lake Analytics.
ms.subservice: data-flows
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.custom: synapse
ms.date: 02/13/2025
---

# Transform data in Azure Data Factory and Azure Synapse Analytics

> [!div class="op_single_selector"]
> * [Mapping data flow](data-flow-create.md)
> * [Hive](transform-data-using-hadoop-hive.md)  
> * [Pig](transform-data-using-hadoop-pig.md)  
> * [MapReduce](transform-data-using-hadoop-map-reduce.md)  
> * [HDInsight Streaming](transform-data-using-hadoop-streaming.md)
> * [HDInsight Spark](transform-data-using-spark.md)
> * [ML Studio (classic)](transform-data-using-machine-learning.md) 
> * [Stored Procedure](transform-data-using-stored-procedure.md)
> * [Data Lake Analytics U-SQL](transform-data-using-data-lake-analytics.md)
> * [Azure Synapse notebook](../synapse-analytics/synapse-notebook-activity.md)
> * [Databricks notebook](transform-data-databricks-notebook.md)
> * [Databricks Jar](transform-data-databricks-jar.md)
> * [Databricks Python](transform-data-databricks-python.md)
> * [.NET custom](transform-data-using-dotnet-custom-activity.md)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[ML Studio (classic) retirement](~/reusable-content/ce-skilling/azure/includes/machine-learning-studio-classic-deprecation.md)] 

## Overview
This article explains data transformation activities in Azure Data Factory and Synapse pipelines that you can use to transform and process your raw data into predictions and insights at scale. A transformation activity executes in a computing environment such as Azure Databricks or Azure HDInsight. It provides links to articles with detailed information on each transformation activity.

The service supports the following data transformation activities that can be added to [pipelines](concepts-pipelines-activities.md) either individually or chained with another activity.

## Transform natively in Azure Data Factory and Azure Synapse Analytics with data flows

### Mapping data flows

Mapping data flows are visually designed data transformations in Azure Data Factory and Azure Synapse. Data flows allow data engineers to develop graphical data transformation logic without writing code. The resulting data flows are executed as activities within pipelines that use scaled-out Spark clusters. Data flow activities can be operationalized via existing scheduling, control, flow, and monitoring capabilities within the service. For more information, see [mapping data flows](concepts-data-flow-overview.md).

### Data wrangling

Power Query in Azure Data Factory enables cloud-scale data wrangling, which allows you to do code-free data preparation at cloud scale iteratively. Data wrangling integrates with [Power Query Online](/power-query/) and makes Power Query M functions available for data wrangling at cloud scale via spark execution. For more information, see [data wrangling in Azure Data Factory](wrangling-overview.md).

> [!NOTE]
> Power Query is currently only supported in Azure Data Factory, and not in Azure Synapse.  For a list of specific features supported in each service, see [Available features in Azure Data Factory & Azure Synapse Analytics pipelines](../synapse-analytics/data-integration/concepts-data-factory-differences.md).

## External transformations

Optionally, you can hand-code transformations and manage the external compute environment yourself.

### HDInsight Hive activity
The HDInsight Hive activity in a pipeline executes Hive queries on your own or on-demand Windows/Linux-based HDInsight cluster. See [Hive activity](transform-data-using-hadoop-hive.md) article for details about this activity. 

### HDInsight Pig activity
The HDInsight Pig activity in a pipeline executes Pig queries on your own or on-demand Windows/Linux-based HDInsight cluster. See [Pig activity](transform-data-using-hadoop-pig.md) article for details about this activity. 

### HDInsight MapReduce activity
The HDInsight MapReduce activity in a pipeline executes MapReduce programs on your own or on-demand Windows/Linux-based HDInsight cluster. See [MapReduce activity](transform-data-using-hadoop-map-reduce.md) article for details about this activity.

### HDInsight Streaming activity
The HDInsight Streaming activity in a pipeline executes Hadoop Streaming programs on your own or on-demand Windows/Linux-based HDInsight cluster. See [HDInsight Streaming activity](transform-data-using-hadoop-streaming.md) for details about this activity.

### HDInsight Spark activity
The HDInsight Spark activity in a pipeline executes Spark programs on your own HDInsight cluster. For details, see [Invoke Spark programs with Azure Data Factory or Azure Synapse Analytics](transform-data-using-spark.md). 

### ML Studio (classic) activities

[!INCLUDE[ML Studio (classic) retirement](~/reusable-content/ce-skilling/azure/includes/machine-learning-studio-classic-deprecation.md)] 

The service enables you to easily create pipelines that use a published ML Studio (classic) web service for predictive analytics. Using the [Batch Execution activity](transform-data-using-machine-learning.md) in a pipeline, you can invoke a Studio (classic) web service to make predictions on the data in batch.

Over time, the predictive models in the Studio (classic) scoring experiments need to be retrained using new input datasets. After you are done with retraining, you want to update the scoring web service with the retrained machine learning model. You can use the [Update Resource activity](update-machine-learning-models.md) to update the web service with the newly trained model.  

See [Use ML Studio (classic) activities](transform-data-using-machine-learning.md) for details about these Studio (classic) activities. 

### Stored procedure activity
You can use the SQL Server Stored Procedure activity in a Data Factory pipeline to invoke a stored procedure in one of the following data stores: Azure SQL Database, Azure Synapse Analytics, SQL Server Database in your enterprise or an Azure VM. See [Stored Procedure activity](transform-data-using-stored-procedure.md) article for details.  

### Data Lake Analytics U-SQL activity
Data Lake Analytics U-SQL activity runs a U-SQL script on an Azure Data Lake Analytics cluster. See [Data Analytics U-SQL activity](transform-data-using-data-lake-analytics.md) article for details. 

### Azure Synapse Notebook activity 

The Azure Synapse Notebook Activity in a Synapse pipeline runs a Synapse notebook in your Azure Synapse workspace. See [Transform data by running an Azure Synapse notebook](../synapse-analytics/synapse-notebook-activity.md).

### Databricks Notebook activity

The Azure Databricks Notebook Activity in a pipeline runs a Databricks notebook in your Azure Databricks workspace. Azure Databricks is a managed platform for running Apache Spark. See [Transform data by running a Databricks notebook](transform-data-databricks-notebook.md).

### Databricks Jar activity

The Azure Databricks Jar Activity in a pipeline runs a Spark Jar in your Azure Databricks cluster. Azure Databricks is a managed platform for running Apache Spark. See [Transform data by running a Jar activity in Azure Databricks](transform-data-databricks-jar.md).

### Databricks Python activity

The Azure Databricks Python Activity in a pipeline runs a Python file in your Azure Databricks cluster. Azure Databricks is a managed platform for running Apache Spark. See [Transform data by running a Python activity in Azure Databricks](transform-data-databricks-python.md).

### Custom activity
If you need to transform data in a way that is not supported by Data Factory, you can create a custom activity with your own data processing logic and use the activity in the pipeline. You can configure the custom .NET activity to run using either an Azure Batch service or an Azure HDInsight cluster. See [Use custom activities](transform-data-using-dotnet-custom-activity.md) article for details. 

You can create a custom activity to run R scripts on your HDInsight cluster with R installed. See [Run R Script using Azure Data Factory and Synapse pipelines](https://github.com/Azure/Azure-DataFactory/tree/master/SamplesV1/RunRScriptUsingADFSample). 

### Compute environments
You create a linked service for the compute environment and then use the linked service when defining a transformation activity. There are two supported types of compute environments. 

- **On-Demand**:  In this case, the computing environment is fully managed by the service. It is automatically created by the service before a job is submitted to process data and removed when the job is completed. You can configure and control granular settings of the on-demand compute environment for job execution, cluster management, and bootstrapping actions. 
- **Bring Your Own**: In this case, you can register your own computing environment (for example HDInsight cluster) as a linked service. The computing environment is managed by you and the service uses it to execute the activities. 

See [Compute Linked Services](compute-linked-services.md) article to learn about supported compute services. 

## Related content
See the following tutorial for an example of using a transformation activity: [Tutorial: transform data using Spark](tutorial-transform-data-spark-powershell.md)