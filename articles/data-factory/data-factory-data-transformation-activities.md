<properties 
	pageTitle="Azure Data Factory - Data Transformation Activities" 
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
Transformation activities in Azure Data Factory transform and process your raw data into predictions and insights. The transformation activity executes in a computing environment such as Azure HDInsight cluster or an Azure Batch. We support the following two types of compute linked service configurations:

1.	**On-Demand:**  In this case, the computing environment is fully managed by Data Factory. It is automatically created by the Data Factory service before a job is submitted to process data and removed when the job is completed. Users can configure and control granular settings of the on-demand compute environment for job execution, cluster management, and bootstrapping actions. 
2.	**Bring Your Own:** In this case, you can register your own computing environment (for example HDInsight cluster) as a linked service in Data Factory. The computing environment is managed by you and the Data Factory service uses it to execute the activities. 

Azure Data Factory supports the following transformation activities that can be added to [pipelines](data-factory-create-pipelines.md) either individually or chained with another activity.

Transformation activity |  Compute linked service | Compute linked service configuration
----------------------- | ----------------------- | ------------------------------------
[Hive](data-factory-hive-activity.md) | HDInsight [Hadoop] | [On-demand](https://msdn.microsoft.com/library/mt185733.aspx) and [Bring Your Own](https://msdn.microsoft.com/library/mt185697.aspx)
[Pig](data-factory-pig-activity.md) | HDInsight [Hadoop]  | [On-demand](https://msdn.microsoft.com/library/mt185733.aspx) and [Bring Your Own](https://msdn.microsoft.com/library/mt185697.aspx)
[MapReduce](data-factory-map-reduce.md) | HDInsight [Hadoop] | [On-demand](https://msdn.microsoft.com/library/mt185733.aspx) and [Bring Your Own](https://msdn.microsoft.com/library/mt185697.aspx) 
[Hadoop Streaming](https://msdn.microsoft.com/library/mt185698.aspx) | HDInsight [Hadoop] | [On-demand](https://msdn.microsoft.com/library/mt185733.aspx) and [Bring Your Own](https://msdn.microsoft.com/library/mt185697.aspx)
[DotNet](data-factory-use-custom-activities.md) | HDInsight [Hadoop]  | [On-demand](https://msdn.microsoft.com/library/mt185733.aspx) and [Bring Your Own](https://msdn.microsoft.com/library/mt185697.aspx) 
[DotNet](data-factory-use-custom-activities.md#AzureBatch) | Azure Batch | [Bring Your Own](https://msdn.microsoft.com/library/mt185713.aspx) 
[Machine Learning Batch Scoring](data-factory-create-predictive-pipelines.md) | Azure VM | [On-demand](https://msdn.microsoft.com/library/mt185726.aspx)
[Stored Procedure](https://msdn.microsoft.com/library/mt185717.aspx) | Azure SQL | [Bring Your Own](https://msdn.microsoft.com/library/mt185705.aspx)



