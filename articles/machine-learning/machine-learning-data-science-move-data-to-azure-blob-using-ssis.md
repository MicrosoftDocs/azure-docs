<properties 
	pageTitle="Move Data to Azure Blob Storage using SSIS connectors | Microsoft Azure" 
	description="Move Data to Azure Blob Storage using SSIS connectors." 
	services="machine-learning,storage" 
	documentationCenter="" 
	authors="bradsev" 
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/27/2015" 
	ms.author="bradsev" />

# Move Data to Azure Blob Storage using SSIS connectors

Guidance on technologies used to move data to and/or from Azure Blob storage are linked here:

[AZURE.INCLUDE [blob-storage-tool-selector](../../includes/machine-learning-blob-storage-tool-selector.md)]

## Introduction

This article shows how to use the [SQL Server Integration Services Feature Pack for Azure](https://msdn.microsoft.com/en-US/library/mt146770.aspx) to transfer large amounts of data from on-premises to an Azure blob. 

Once customers have moved on-premises data into the cloud, they can access it from any Azure service to leverage the full power of the suite of Azure technologies. It may be used, for example, in Azure Machine Learning or on an HDInsight cluster. This will typically be the first step for our [SQL](https://azure.microsoft.com/en-us/documentation/articles/machine-learning-data-science-process-sql-walkthrough/) and [HDInsight](https://azure.microsoft.com/en-us/documentation/articles/machine-learning-data-science-process-hive-walkthrough/) walkthroughs.

For a discussion of canonical scenarios that use SSIS to accomplish business needs common in hybrid data integration scenarios, see [Doing more with SQL Server Integration Services Feature Pack for Azure](http://blogs.msdn.com/b/ssis/archive/2015/06/25/doing-more-with-sql-server-integration-services-feature-pack-for-azure.aspx) blog.

> [AZURE.NOTE] For a complete introduction to Azure blob storage, please refer to [Azure Blob Basics](../storage-dotnet-how-to-use-blobs.md) and  [Azure Blob Service](https://msdn.microsoft.com/library/azure/dd179376.aspx). 

## Prerequisites

This document assumes that you have an Azure subscription, a storage account and the corresponding storage key for that account. Before uploading/downloading data, you must know your Azure storage account name and account key. 

- To set up an **Azure subscription**, see [Free one-month trial](https://azure.microsoft.com/en-us/pricing/free-trial/).
- For instructions on creating a **storage account** and for getting account and key information, see [About Azure storage accounts](../storage-create-storage-account.md).


You need to install [Visual Studio 2013](https://www.visualstudio.com/products/free-developer-offers-vs.aspx?slcid=0x409) or later.


To use the **SSIS connector** you must download:

- **SQL Server 2014 Express**: This can be downloaded from [](http://www.microsoft.com/en-us/download/details.aspx?id=42299). Choose the version appropriate for your machine.
- **SQL Server Integration Service**: To download this, please see [](https://msdn.microsoft.com/en-us/library/ms141026.aspx).

For information on how to get up-and-running using SISS to build simple extraction, transformation, and load (ETL) packages, see [SSIS Tutorial: Creating a Simple ETL Package](https://msdn.microsoft.com/en-us/library/ms169917.aspx).

## Dataset  
For this experiment, we worked with the NYC taxi dataset, which is publicly available for download. The dataset consists of about 173 million taxi rides in NYC in the year 2013. There are two types of data : trip details data and fare data. As there is a file for each month, we have 24 files in all, each of which is approximately 2GB uncompressed. In our case, these data reside in local uncompressed files on the desktop.

## Data transfer : 
To move data using the SSI feature pack from on-premises to Azure blob storage, we use an instance of the **Azure Blob Upload Task**, shown below:

![configure-data-science-vm](./media/machine-learning-data-science-move-data-to-azure-blob-using-ssis/ssis-azure-blob-upload-task.png)


The parameters that the task uses are described here:


Field|Description|
----------------------|----------------|
**AzureStorageConnection**|Specifie an existing Azure Storage Connection Manager or creates a new one that refers to an Azure storage account that points to where the blob files are hosted.|
**BlobContainer**|Specifies the name of the blob container that will hold the uploaded files as blobs.|
**BlobDirectory**|Specifies the blob directory where the uploaded file will be stored as a block blob. The blob directory is a virtual hierarchical structure. If the blob already exists, it will be replaced.|
**LocalDirectory**|Specifies the local directory that contains the files to be uploaded.|
**FileName**|Specifies a name filter to select files with the specified name pattern. For example, MySheet\*.xls\* includes files such as MySheet001.xls and MySheetABC.xlsx|
**TimeRangeFrom/TimeRangeTo**|Specifies a time range filter. Files modified after *TimeRangeFrom* and before *TimeRangeTo* will be included.|


> [AZURE.NOTE] The **AzureStorageConnection** credentials need to be correct and the **BlobContainer** must exist before the transfer is attempted.
 

##More advanced scenarios
We note here that the SSIS feature pack allows for more complex flows to be handled. For example, the blob data could feed directly into an HDInsight cluster whose output could be downloaded back to a blob, and then to an on-premises storage.
