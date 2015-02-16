<properties title="Plan Your Cloud Data Science Environment" pageTitle="Plan Your Cloud Data Science Environment | Azure" description="Plan Your Cloud Data Science Environment" metaKeywords="" services="data-science-process" solutions="" documentationCenter="" authors="msolhab" manager="paulettm" editor="" videoId="" scriptId="" />

<tags ms.service="data-science-process" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="02/19/2015" ms.author="msolhab,garye" /> 


Plan Your Azure Machine Learning Data Science Environment
========================================

This topic prepares you to set up an environment to conduct Data
Science Azure Machine Learning. You will also learn how to chose from options based on
the data source locations and your target destination in the cloud. You can repeat the set up process to support additional users
and scenarios. Use the Cloud Data Science environment for conducting end-to-end data science exercises, from the original data source through creating and publishing a machine
learned model as an Azure web service for consumption in applications.
This article discusses different scenarios and options available, and
serves as an introduction to the Cloud Data Science Process flow
presented in the DS Process map. To learn more about any step in the DS
Process, click the relevant item in the DS Process map.

Before You Begin
----------------

Before you begin creating your Cloud Data Science environment, consider the following questions.

1. **Where is your data located? We’ll refer to this location as the *data source***. For example:

	- The data is publicly available at an HTTP address.
	- The data resides in a local/network file location.
	- The data is in a SQL Server database.
	- The data is stored in an Azure storage container.
<br><br>
2. **What is the format of your data?** For example:

    - Comma-separated or tab-separated files, uncompressed.
    - Comma-separated or tab-separated files, compressed.
	- Compressed or uncompressed Azure blobs.
	- SQL Server tables.
<br><br>
3. **How large is your data?**

    - Small: Less than 2GB
    - Medium: Greater than 2GB and less than 10GB
	- Large: Greater than 10GB
	- Very large: 100s of GBs
<br><br>
4. **How familiar are you with the data?**

    - Do you need to explore the data to discover its schema, variable distributions, missing values, etc.? 
	- Does the data require pre-processing and/or cleaning before it can be transformed into a tabular representation? 
<br><br>
5. **Do you plan (or are you able) to move the whole data to Azure?**

    - Yes, planning to copy the whole data to the cloud for processing.
	- No, only a subset of the data will be copied to Azure.
<br><br>
6. **What is your preferred Azure cloud destination?** For example:

	- Move data to Azure storage blobs.
	- Store data in mountable Azure virtual hard disks.
	- Load data to an SQL Server database in Azure.
	- Map data to Azure HDInsight Hive tables.

Cloud Data Science Resources in Azure
-------------------------------------

To get started using Azure Machine Learning, you need the following: 

1.  Get an Azure subscription.
2.  Create an Azure storage account.
3.  Create an Azure Machine Learning workspace.

Depending on your scenario, you might also need the following:

1.  Azure Tools: Azure PowerShell SDK, Azure Storage Explorer, AzCopy, and others
2.  Azure Virtual Machines running SQL Server
3.  Azure HDInsight (Hadoop)
4.  Azure Virtual Networks for on-prem to Azure file sharing
5.  Azure Data Factory for scheduled data movement

How to Use the Cloud Data Science Process Map
---------------------------------------------

The Azure Machine Learning Data Science Process map guides you through a variety of
data science exercises. Since the Data Science
process is iterative in nature, the process map presents the core steps
involved in a typical flow, however, not all steps shown
are required in every data science exercise, and the
sequence/iteration of steps will likely vary in a given exercise. Use
the answers collected in the *Before You Begin* section to guide you
through the applicable steps, where to perform each, and how to iterate
as needed.

The following are a few examples of Cloud Data Science scenarios according to original data size, data source location, and target repository in Azure.

- [Scenario \#1: Small to medium tabular dataset in a local files](./machine-learning-data-science-plan-sample-scenarios#smalllocal)
- [Scenario \#2: Small to medium dataset in a local files, requiring processing](./machine-learning-data-science-plan-sample-scenarios#smalllocalprocess)
- [Scenario \#3: Large dataset in a local files, target Azure blobs](./machine-learning-data-science-plan-sample-scenarios#largelocal)
- [Scenario \#4: Small to medium dataset in a local files, target SQL Server in Azure VM](./machine-learning-data-science-plan-sample-scenarios#smalllocaltodb)
- [Scenario \#5: Large dataset in a local files, target SQL Server in Azure VM](./machine-learning-data-science-plan-sample-scenarios#largelocaltodb)
- [Scenario \#6: Large dataset in a SQL Server database on-prem, target SQL Server in Azure VM](./machine-learning-data-science-plan-sample-scenarios#largedbtodb)

Sample Data Scenarios
---------------------

The following diagram summarizes some data scenarios and examples of Cloud Data Science Process flows. Note that data processing, exploration, feature engineering, and sampling may take place in one or more environments -- at the source, intermediate, and/or target environment – and may proceed iteratively as needed. Not that the diagram does
not cover all data sources, targets, methods, and cloud resources possible.

![Sample DS process walkthrough scenarios][8]

[1]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-small-in-aml.png
[2]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-local-with-processing.png
[3]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-local-large.png
[4]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-local-to-db.png
[5]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-large-to-db.png
[6]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-db-to-db.png
[7]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-attach-db.png
[8]: ./media/machine-learning-data-science-plan-your-environment/dsp-plan-sample-scenarios.png

