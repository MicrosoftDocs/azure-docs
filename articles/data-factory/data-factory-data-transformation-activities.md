<properties 
	pageTitle="Data Transformation Activities | Microsoft Azure" 
	description="Learn how you can use the Azure Data Factory service to transform and analyze data." 
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
	ms.date="07/26/2015" 
	ms.author="spelluru"/>

# Transform and analyze using Azure Data Factory

## Overview
Transformation activities in Azure Data Factory transform and process your raw data into predictions and insights. The transformation activity executes in a computing environment such as Azure HDInsight cluster or an Azure Batch. Azure Data Factory supports the following transformation activities that can be added to [pipelines](data-factory-create-pipelines.md) either individually or chained with another activity.


Transformation activity |  Compute environment 
----------------------- | --------------------
[Hive](data-factory-hive-activity.md) | HDInsight [Hadoop] 
[Pig](data-factory-pig-activity.md) | HDInsight [Hadoop]  
[MapReduce](data-factory-map-reduce.md) | HDInsight [Hadoop]  
[Hadoop Streaming](https://msdn.microsoft.com/library/mt185698.aspx) | HDInsight [Hadoop]
[Machine Learning Batch Execution](data-factory-azure-ml-batch-execution-activity.md) | Azure VM 
[Stored Procedure](data-factory-stored-proc-activity.md) | Azure SQL | 
[DotNet](data-factory-use-custom-activities.md) | HDInsight [Hadoop] or Azure Batch    

You need to create a linked service for the compute environment and then use the linked service when defining a transformation activity. There are two types of compute environments supported by Data Factory. 

1. **On-Demand**:  In this case, the computing environment is fully managed by Data Factory. It is automatically created by the Data Factory service before a job is submitted to process data and removed when the job is completed. Users can configure and control granular settings of the on-demand compute environment for job execution, cluster management, and bootstrapping actions. 
2. **Bring Your Own**: In this case, you can register your own computing environment (for example HDInsight cluster) as a linked service in Data Factory. The computing environment is managed by you and the Data Factory service uses it to execute the activities. 

See [Compute Linked Services](data-factory-compute-linked-services.md) article to learn about compute linked services supported by Data Factory. 

## Send Feedback
We would really appreciate your feedback on this article. Please take a few minutes to submit your feedback via [email](mailto:adfdocfeedback@microsoft.com?subject=data-factory-data-transformation-activities.md). 