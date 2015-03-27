<properties 
	pageTitle="Set up a virtual machine or a SQL Sever virtual machine in Azure for Data Science" 
	description="Set up a Data Science Virtual Machinee" 
	metaKeywords="" 
	services="machine-learning" 
	solutions="" 
	documentationCenter="" 
	authors="msolhab" 
	manager="jacob.spoelstra" 
	editor="cgronlun"  />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/17/2015" 
	ms.author="mohabib;xibingao;bradsev" />

# Set up a virtual machine or a SQL Server virtual machine in Azure for Data Science

Several types of Azure virtual machines can be provisioned and configured to be used as part of a cloud-based data science environment. The decision about which flavor of virtual machine to use depends on the type and quantity of data to be modeled with machine learning, and the target destination for that data in the cloud. For guidance on the questions to consider when making this decision, see [Plan Your Azure Machine Learning Data Science Environment](machine-learning-data-science-plan-your-environment.md). The two scenarios covered here include the cas

Instructions are provided that describe how to set up an Azure VM and an Azure VM with SQL Service as IPython Notebook servers. The virtual machine runs on Windows and is configured with supporting tools such as Azure Storage Explorer and AzCopy, as well as other packages that are useful for data science projects. Azure Storage Explorer and AzCopy, for example, provide convenient ways to upload data to Azure storage from your local machine or to download it to your local machine from storage. Two sets of instructions are provided:

* [Set up an Azure virtual machine for data science](machine-learning-data-science-setup-virtual-machine.md) shows how to provision an Azure virtual machine with IPython Notebook and other tools used to do data science for cases in which a form of Azure storage other than SQL can be used to store the data. 

* [Set up an Azure SQL Server virtual machine for data science](machine-learning-data-science-setup-sql-server-virtual-machine.md) shows how to provision an Azure SQL Server virtual machine with IPython Notebook and other tools used to do data science for cases in which a SQL database to store data.

Once provisioned and configured, these virtual machine are ready for use as IPython Notebook servers for the exploration and processing of data, and for other tasks in conjunction with Azure Machine Learning and the Cloud Data Science Process. This process can include steps that move data into HDInsight, that process and sample it there in preparation for learning from the data with Azure Machine Learning.

* For information on how to move data into HDInsight from Azure blob storage, see [Create and load data into Hive tables from Azure blob storage](machine-learning-data-science-hive-tables.md).
* For information on processing data in HDInsight with Hive queries, see [Submit Hive Queries to HDInsight Hadoop clusters in the Cloud Data Science Process](machine-learning-data-science-hive-queries.md).
* For information on sampling data in HDInsight, see [Sample data in Azure HDInsight Hive tables](machine-learning-data-science-sample-data-hive.md).


> [AZURE.NOTE] Azure Virtual Machines are priced as **pay only for what you use**. To ensure that you are not being billed when not using your virtual machine, it has to be in the **Stopped (Deallocated)** state from the [Azure Management Portal](http://manage.windowsazure.com/). For step-by-step instructions or how to deallocate you virtual machine, see  [Shutdown and deallocate virtual machine when not in use](machine-learning-data-science-setup-virtual-machine.md#shutdown) 



