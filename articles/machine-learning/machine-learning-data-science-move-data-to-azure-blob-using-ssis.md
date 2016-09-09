<properties
	pageTitle="Move Data to or from Azure Blob Storage using SSIS connectors | Microsoft Azure"
	description="Move Data to or from Azure Blob Storage using SSIS connectors."
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
	ms.date="06/14/2016"
	ms.author="bradsev" />

# Move Data to or from Azure Blob Storage using SSIS connectors

The [SQL Server Integration Services Feature Pack for Azure](https://msdn.microsoft.com/library/mt146770.aspx) provides components to connect to Azure, transfer data between Azure and on-premises data sources, and process data stored in Azure.

Guidance on technologies used to move data to and/or from Azure Blob storage are linked here:

[AZURE.INCLUDE [blob-storage-tool-selector](../../includes/machine-learning-blob-storage-tool-selector.md)]


Once customers have moved on-premises data into the cloud, they can access it from any Azure service to leverage the full power of the suite of Azure technologies. It may be used, for example, in Azure Machine Learning or on an HDInsight cluster.

This will typically be the first step for the [SQL](machine-learning-data-science-process-sql-walkthrough.md) and [HDInsight](machine-learning-data-science-process-hive-walkthrough.md) walkthroughs.

For a discussion of canonical scenarios that use SSIS to accomplish business needs common in hybrid data integration scenarios, see [Doing more with SQL Server Integration Services Feature Pack for Azure](http://blogs.msdn.com/b/ssis/archive/2015/06/25/doing-more-with-sql-server-integration-services-feature-pack-for-azure.aspx) blog.

> [AZURE.NOTE] For a complete introduction to Azure blob storage, please refer to [Azure Blob Basics](../storage/storage-dotnet-how-to-use-blobs.md) and  [Azure Blob Service](https://msdn.microsoft.com/library/azure/dd179376.aspx).

## Prerequisites

To perform the tasks described in this article, you must have an Azure subscription and an Azure storage account  set up. You must know your Azure storage account name and account key in order to upload or download data.

- To set up an **Azure subscription**, see [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/).
- For instructions on creating a **storage account** and for getting account and key information, see [About Azure storage accounts](../storage/storage-create-storage-account.md).


To use the **SSIS connectors** you must download:

- **SQL Server 2014 or 2016 Standard (or above)**: Install includes includes SQL Server Integration Services.
- **Microsoft SQL Server 2014 or 2016 Integration Services Feature Pack for Azure**: These can be downloaded, respectively, from the [SQL Server 2014 Integration Services](http://www.microsoft.com/download/details.aspx?id=47366) and [SQL Server 2016 Integration Services](https://www.microsoft.com/download/details.aspx?id=49492) pages.

> [AZURE.NOTE] SSIS is installed with SQL Server, but is not included in the Express version. For information on what applications are included in various editions of SQL Server, see [SQL Server Editions](http://www.microsoft.com/en-us/server-cloud/products/sql-server-editions/)

For training materials on SSIS, see [Hands On Training for SSIS](http://www.microsoft.com/download/details.aspx?id=20766)

For information on how to get up-and-running using SISS to build simple extraction, transformation, and load (ETL) packages, see [SSIS Tutorial: Creating a Simple ETL Package](https://msdn.microsoft.com/library/ms169917.aspx).

## Download NYC Taxi dataset  
The example described here use a publicly available dataset -- the [NYC Taxi Trips](http://www.andresmh.com/nyctaxitrips/) dataset. The dataset consists of about 173 million taxi rides in NYC in the year 2013. There are two types of data : trip details data and fare data. As there is a file for each month, we have 24 files in all, each of which is approximately 2GB uncompressed.


## Upload data to Azure blob storage
To move data using the SSIS feature pack from on-premises to Azure blob storage, we use an instance of the [**Azure Blob Upload Task**](https://msdn.microsoft.com/library/mt146776.aspx), shown below:

![configure-data-science-vm](./media/machine-learning-data-science-move-data-to-azure-blob-using-ssis/ssis-azure-blob-upload-task.png)


The parameters that the task uses are described here:


Field|Description|
----------------------|----------------|
**AzureStorageConnection**|Specifies an existing Azure Storage Connection Manager or creates a new one that refers to an Azure storage account that points to where the blob files are hosted.|
**BlobContainer**|Specifies the name of the blob container that will hold the uploaded files as blobs.|
**BlobDirectory**|Specifies the blob directory where the uploaded file will be stored as a block blob. The blob directory is a virtual hierarchical structure. If the blob already exists, it will be replaced.|
**LocalDirectory**|Specifies the local directory that contains the files to be uploaded.|
**FileName**|Specifies a name filter to select files with the specified name pattern. For example, MySheet\*.xls\* includes files such as MySheet001.xls and MySheetABC.xlsx|
**TimeRangeFrom/TimeRangeTo**|Specifies a time range filter. Files modified after *TimeRangeFrom* and before *TimeRangeTo* will be included.|


> [AZURE.NOTE] The **AzureStorageConnection** credentials need to be correct and the **BlobContainer** must exist before the transfer is attempted.

## Download data from Azure blob storage

To download data from Azure blob storage to on-premise storage with SSIS, use an instance of the [Azure Blob Upload Task](https://msdn.microsoft.com/library/mt146779.aspx).

##More advanced SSIS-Azure scenarios
We note here that the SSIS feature pack allows for more complex flows to be handled by packaging tasks together. For example, the blob data could feed directly into an HDInsight cluster whose output could be downloaded back to a blob and then to an on-premises storage. SSIS can run Hive and Pig jobs on an HDInsight cluster using additional SSIS connectors:

- To run a Hive script on an Azure HDInsight cluster with SSIS, use [Azure HDInsight Hive Task](https://msdn.microsoft.com/library/mt146771.aspx).
- To run a Pig script on an Azure HDInsight cluster with SSIS, use [Azure HDInsight Pig Task](https://msdn.microsoft.com/library/mt146781.aspx).
