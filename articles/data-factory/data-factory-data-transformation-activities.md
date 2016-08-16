<properties 
	pageTitle="Data Transformation: Process & transform data | Microsoft Azure" 
	description="Learn about data transformation in Azure Data Factory. Transform and process data in Azure HDInsight cluster or an Azure Batch." 
	keywords="data transformation, process data, transform data, transformation activity"
	services="data-factory" 
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/27/2016" 
	ms.author="spelluru"/>

# Learn about transforming and analyzing data in Azure Data Factory
This article explains data transformation activities in Azure Data Factory so you'll know how ADF transforms and processes your raw data into predictions and insights. The transformation activity executes in a computing environment such as Azure HDInsight cluster or an Azure Batch. Links to some articles that show how to use specific transformation activities are included, too.
 
Azure Data Factory supports the following transformation activities that can be added to [pipelines](data-factory-create-pipelines.md) either individually or chained with another activity.

Data transformation activity |  Compute environment 
:----------------------- | :--------------------
[Hive](data-factory-hive-activity.md) | HDInsight [Hadoop] 
[Pig](data-factory-pig-activity.md) | HDInsight [Hadoop]  
[MapReduce](data-factory-map-reduce.md) | HDInsight [Hadoop]  
[Hadoop Streaming](data-factory-hadoop-streaming-activity.md) | HDInsight [Hadoop]
[Machine Learning activites: Batch Execution and Update Resource](data-factory-azure-ml-batch-execution-activity.md) | Azure VM 
[Stored Procedure](data-factory-stored-proc-activity.md) | Azure SQL, Azure SQL Data Warehouse, or SQL Server |
[Data Lake Analytics U-SQL](data-factory-usql-activity.md) | Azure Data Lake Analytics 
[DotNet](data-factory-use-custom-activities.md) | HDInsight [Hadoop] or Azure Batch
   
> [AZURE.NOTE] 
> You can use MapReduce activity to run Spark programs on your HDInsight Spark cluster. See [Invoke Spark programs from Azure Data Factory](data-factory-spark.md) for details.
> You can create a custom activity to run R scripts on your HDInsight cluster with R installed. See [Run R Script using Azure Data Factory](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/RunRScriptUsingADFSample). 
 

You need to create a linked service for the compute environment and then use the linked service when defining a transformation activity. There are two types of compute environments supported by Data Factory. 

1. **On-Demand**:  In this case, the computing environment is fully managed by Data Factory. It is automatically created by the Data Factory service before a job is submitted to process data and removed when the job is completed. Users can configure and control granular settings of the on-demand compute environment for job execution, cluster management, and bootstrapping actions. 
2. **Bring Your Own**: In this case, you can register your own computing environment (for example HDInsight cluster) as a linked service in Data Factory. The computing environment is managed by you and the Data Factory service uses it to execute the activities. 

See [Compute Linked Services](data-factory-compute-linked-services.md) article to learn about compute linked services supported by Data Factory. 
