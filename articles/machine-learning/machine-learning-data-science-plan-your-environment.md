<properties 
	pageTitle="Plan a Machine Learning advanced analytics environment | Microsoft Azure" 
	description="Plan your advanced analytics environment by considering key questions." 
	services="machine-learning" 
	solutions="" 
	documentationCenter="" 
	authors="msolhab"
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/22/2015" 
	ms.author="mohabib;bradsev" /> 


# Plan your Azure Machine Learning advanced analytics environment

What scenario matches your analytics problem when you are getting ready to set up an environment to do advanced analytics with Azure Machine Learning?  The choices you make regarding the resources that are needed are based on the type, size, and source location of your data and the target destination for this data. This article discusses those questions that will help you identify your scenario.

Once you have identified the relevant scenario, the Advanced Analytics Process and Technology (ADAPT) workflow that is presented in the [Learning Path: Build advanced analytics solutions in Azure](machine-learning-data-science-how-to-create-machine-learning-service.md).
steps your through a series of tasks, from obtaining a dataset through the creation and publishing of a model as an Azure web service that applications can consume.

This topic also enumerates some of the resources and tools that are used by this advanced analytics process.

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

## Answer these questions
Answer these questions to determine what scenario you are working with before you create your advanced analytics environment.

1. **Where is your data located?** (This location is referred to as the ***data source***.) For example:
	- The data is publicly available at an HTTP address.
	- The data resides in a local/network file location.
	- The data is in a SQL Server database.
	- The data is stored in an Azure storage container
2. **How is your data formatted?** For example:
    - Comma-separated or tab-separated files, uncompressed.
    - Comma-separated or tab-separated files, compressed.
	- Compressed or uncompressed Azure blobs.
	- SQL Server tables.
3. **How large is your data?**
    - Small: Less than 2GB
    - Medium: Greater than 2GB and less than 10GB
	- Large: Greater than 10GB
	- Very large: 100s of GBs
4. **How familiar are you with the data?**
    - Do you need to explore the data to discover its schema, variable distributions, missing values, etcetera? 
	- Does the data require pre-processing or cleaning before it can be transformed into a tabular representation? 
5. **Do you plan (or are you able) to move all of the data to Azure storage?**
    - Yes, planning to copy the whole dataset to the cloud for processing.
	- No, only a subset of the data will be copied to Azure.
6. **What is your preferred Azure cloud destination?** For example:
	- Move data to Azure storage blobs.
	- Store data in mountable Azure virtual hard disks.
	- Load data to an SQL Server database on an Azure Virtual Machine.
	- Map data to Azure HDInsight Hive tables.

## What is your scenario?
Once you have answered the questions in the previous section, you are ready to determine which scenario best fits your case. The sample scenarios are outlined in [Scenarios for advanced analytics in Azure Machine Learning](../machine-learning-data-science-plan-sample-scenarios.md).

## Advanced analytics resources in Azure
Depending on your scenario, you might need some of the following tools and resources.

1.  Azure Tools: 
	* 	[Azure PowerShell SDK](../install-configure-powershell.md), 
	* 	[Azure Storage Explorer](http://azurestorageexplorer.codeplex.com/)
	* 	[AzCopy](../storage-use-azcopy.md)
2.  Azure Virtual Machines running SQL Server
3.  Azure HDInsight (Hadoop)
4.  Azure Virtual Networks for on-prem to Azure file sharing
5.  Azure Data Factory for scheduled data movement






 