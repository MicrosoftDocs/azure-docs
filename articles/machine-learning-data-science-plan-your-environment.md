<properties 
	pageTitle="Plan Your Cloud Data Science Environment | Azure" 
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
	ms.date="02/19/2015" 
	ms.author="mohabib, sidneyh" /> 


# Plan Your Azure Machine Learning Data Science Environment

To set up an environment, choose options based on the data source locations and your target destination in the cloud. For example, determine the size of the data, where it exists, and its format. Repeat the set up process to support additional users and scenarios. Conduct end-to-end data science exercises, starting with the original data source through creation and publishing of a model as an Azure web service for consumption in applications.

This article discusses different scenarios and options available, and serves as an introduction to the Cloud Data Science Process flow presented in the **[Data Science Process map](machine-learning-data-science-how-to-create-machine-learning-service.md)**. To learn more about any step in the Data Science Process, click the relevant item in the [map](machine-learning-data-science-how-to-create-machine-learning-service.md).

## Questions to Consider

Before you begin creating your Cloud Data Science environment, consider the following questions.

1. **Where is your data located? We’ll refer to this location as the *data source***. For example:
	- The data is publicly available at an HTTP address.
	- The data resides in a local/network file location.
	- The data is in a SQL Server database.
	- The data is stored in an Azure storage container.

2. **What is the format of your data?** For example:
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

5. **Do you plan (or are you able) to move the whole data to Azure?**

    - Yes, planning to copy the whole data to the cloud for processing.
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

How to Use the Cloud Data Science Process Map
---------------------------------------------

The Azure Machine Learning Data Science Process [map](machine-learning-data-science-how-to-create-machine-learning-service.md) presents a variety of
data science exercises. Since the process is iterative in nature, it shows the core steps involved in a typical flow, however, not all steps are required in every data science exercise, and the sequence of steps vary in a given exercise. Your answers to the questions above guide you through the steps—where to perform each, and how to iterate as needed.

Here are example variations based on original data size, data source location, and target repository in Azure.

- [Scenario \#1: Small to medium tabular dataset in local files](http://azure.microsoft.com/documentation/articles/machine-learning-data-science-plan-sample-scenarios#smalllocal)
- [Scenario \#2: Small to medium dataset in local files requiring processing](http://azure.microsoft.com/documentation/articles/machine-learning-data-science-plan-sample-scenarios#smalllocalprocess)
- [Scenario \#3: Large dataset in local files that target Azure blobs](http://azure.microsoft.com/documentation/articles/machine-learning-data-science-plan-sample-scenarios#largelocal)
- [Scenario \#4: Small to medium dataset in local files that target SQL Server on Azure VMs](http://azure.microsoft.com/documentation/articles/machine-learning-data-science-plan-sample-scenarios#smalllocaltodb)
- [Scenario \#5: Large dataset in local files that target SQL Server on Azure VMs](http://azure.microsoft.com/documentation/articles/machine-learning-data-science-plan-sample-scenarios#largelocaltodb)
- [Scenario \#6: Large dataset in a SQL Server database running on-premises that targets SQL Server running on Azure VMs](http://azure.microsoft.com/documentation/articles/machine-learning-data-science-plan-sample-scenarios#largedbtodb)

Sample Data Scenarios
---------------------

This diagram summarizes some scenarios and examples of process flows. Note that  processing, exploration, feature engineering, and sampling take place in one or more environments: at the source, intermediate, and/or target environments, and may iterate as needed. The diagram does not cover all data sources, targets, methods, and cloud resources possible.

![Sample DS process walkthrough scenarios][8]

### Azure Data Science in Action Example

For an end-to-end walkthrough example of the Azure Data Science Process using a public dataset, see [Azure Data Science Process in Action](machine-learning-data-science-process-sql-walkthrough.md).

[1]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-small-in-aml.png
[2]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-local-with-processing.png
[3]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-local-large.png
[4]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-local-to-db.png
[5]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-large-to-db.png
[6]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-db-to-db.png
[7]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-attach-db.png
[8]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-sample-scenarios.png

