<properties 
	pageTitle="Plan your Azure Machine Learning Data Science environment | Azure" 
	description="Plan Your Cloud Data Science Environment" 
	metaKeywords="" 
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
	ms.date="03/24/2015" 
	ms.author="mohabib;bradsev" /> 


# Plan your Azure Machine Learning Data Science environment

You need to make certain decisions when you set up an Azure Machine Learning data science environment. The choices you make will be based on the type, size, and source location of your data and the target destination for this data in the cloud. The Cloud Data Science Process is an end-to-end series of tasks that take you from the original data in some source through the creation and publishing of a model as an Azure web service for consumption in applications.

The Cloud Data Science Process workflow is presented in the **[Data Science Process map](machine-learning-data-science-how-to-create-machine-learning-service.md)**. To learn more about the individual steps in the Data Science Process, click the relevant items in the map.

This article discusses the questions to consider when setting up your Cloud Data Science environment, enumerates resources and tools that are useful for this process, and provides guidance on how to use the Cloud Data Science Process map.

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

## Questions to Consider

Before you begin creating your Cloud Data Science environment, consider the following questions.

1. **Where is your data located?** (This location is referred to as the ***data source***.) For example:
	- The data is publicly available at an HTTP address.
	- The data resides in a local/network file location.
	- The data is in a SQL Server database.
	- The data is stored in an Azure storage container.
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
5. **Do you plan (or are you able) to move all of the data to Azure?**
    - Yes, planning to copy the whole dataset to the cloud for processing.
	- No, only a subset of the data will be copied to Azure.
6. **What is your preferred Azure cloud destination?** For example:
	- Move data to Azure storage blobs.
	- Store data in mountable Azure virtual hard disks.
	- Load data to an SQL Server database on an Azure Virtual Machine.
	- Map data to Azure HDInsight Hive tables.

## Cloud Data Science Resources in Azure

Depending on your scenario, you might also need the following:

1.  Azure Tools: [Azure PowerShell SDK](install-configure-powershell.md), [Azure Storage Explorer](http://azurestorageexplorer.codeplex.com/), [AzCopy](storage-use-azcopy.md), and others
2.  Azure Virtual Machines running SQL Server
3.  Azure HDInsight (Hadoop)
4.  Azure Virtual Networks for on-prem to Azure file sharing
5.  Azure Data Factory for scheduled data movement


## How to Use the Cloud Data Science Process Map

The [Cloud Data Science Process map](machine-learning-data-science-how-to-create-machine-learning-service.md) presents a variety of data science exercises. The map shows the core steps involved in a typical data science workflow. Not all steps are required in every data science exercise. Also, the process is iterative in nature and the sequence of steps may vary in a given exercise. Your answers to the questions above will help you decide the steps that are relevant to your case when they are needed in the process and the conditions under which iterations of the steps are required.

For sample scenarios based on original data size, data source location, and target repository in Azure, see [Cloud Data Science Process in Azure Machine Learning](machine-learning-data-science-plan-sample-scenarios.md).


