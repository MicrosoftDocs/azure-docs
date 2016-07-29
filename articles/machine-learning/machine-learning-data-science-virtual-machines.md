<properties
	pageTitle="Data Science Virtual machines in Azure | Microsoft Azure"
	description="Set up a Data Science Virtual Machine"
	services="machine-learning"
	documentationCenter=""
	authors="bradsev"
	manager="paulettm" 
	editor="cgronlun"  />

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/14/2016"
	ms.author="xibingao;bradsev" />

# Data Science Virtual machines in Azure

Instructions are provided here that describe how to set up an Azure VM and an Azure VM with SQL Service as IPython Notebook servers. The Windows virtual machine is configured with supporting tools such as IPython Notebook, Azure Storage Explorer and AzCopy, as well as other utilities that are useful for data science projects. Azure Storage Explorer and AzCopy, for example, provide convenient ways to upload data to Azure storage from your local machine or to download it to your local machine from storage. 

This menu links to topics that describe how to set up the various data science environments used by the Team Data Science Process (TDSP).

[AZURE.INCLUDE [data-science-environment-setup](../../includes/cap-setup-environments.md)]

Several types of Azure virtual machines can be provisioned and configured to be used as part of a cloud-based data science environment. The decision about which flavor of virtual machine to use depends on the type and quantity of data to be modeled with machine learning, and the target destination for that data in the cloud. 

* For guidance on the questions to consider when making this decision, see [Plan Your Azure Machine Learning Data Science Environment](machine-learning-data-science-plan-your-environment.md). 
* For a catalog of some of the scenarios you might encounter when doing advanced analytics, see [Scenarios for the Advanced Analytics Process and Technology in Azure Machine Learning](machine-learning-data-science-plan-sample-scenarios.md)

Two sets of instructions are provided:

* [Set up an Azure virtual machine as an IPython Notebook server for advanced analytics](machine-learning-data-science-setup-virtual-machine.md) shows how to provision an Azure virtual machine with IPython Notebook and other tools used to do data science for cases in which a form of Azure storage other than SQL can be used to store the data.

* [Set up an Azure SQL Server virtual machine as an IPython Notebook server for advanced analytics](machine-learning-data-science-setup-sql-server-virtual-machine.md) shows how to provision an Azure SQL Server virtual machine with IPython Notebook and other tools used to do data science for cases in which a SQL database can be used to store  the data.

Once provisioned and configured, these virtual machines are ready for use as IPython Notebook servers for the exploration and processing of data, and for other tasks needed in conjunction with Azure Machine Learning and the Team Data Science Process (TDSP). The next steps in the data science process are mapped in the [TDSP learning path](https://azure.microsoft.com/documentation/learning-paths/cortana-analytics-process/) and may include steps that move data into SQL Server or HDInsight, process and sample it there in preparation for learning from the data with Azure Machine Learning.


> [AZURE.NOTE] Azure Virtual Machines are priced as **pay only for what you use**. To ensure that you are not being billed when not using your virtual machine, it has to be in the **Stopped (Deallocated)** state from the [Azure Classic Portal](http://manage.windowsazure.com/). For step-by-step instructions or how to deallocate you virtual machine, see  [Shutdown and deallocate virtual machine when not in use](machine-learning-data-science-setup-virtual-machine.md#shutdown)
 