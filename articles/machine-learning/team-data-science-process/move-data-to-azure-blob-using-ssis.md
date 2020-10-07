---
title: Move Blob storage data with SSIS connectors - Team Data Science Process
description: Learn how to move Data to or from Azure Blob Storage using SQL Server Integration Services Feature Pack for Azure.
services: machine-learning
author: marktab
manager: marktab
editor: marktab
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 01/10/2020
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---
# Move data to or from Azure Blob Storage using SSIS connectors
The [SQL Server Integration Services Feature Pack for Azure](https://msdn.microsoft.com/library/mt146770.aspx) provides components to connect to Azure, transfer data between Azure and on-premises data sources, and process data stored in Azure.

[!INCLUDE [blob-storage-tool-selector](../../../includes/machine-learning-blob-storage-tool-selector.md)]

Once customers have moved on-premises data into the cloud, they can access their data from any Azure service to leverage the full power of the suite of Azure technologies. The data may be subsequently used, for example, in Azure Machine Learning or on an HDInsight cluster.

Examples for using these Azure resources are in the [SQL](sql-walkthrough.md) and [HDInsight](hive-walkthrough.md) walkthroughs.

For a discussion of canonical scenarios that use SSIS to accomplish business needs common in hybrid data integration scenarios, see [Doing more with SQL Server Integration Services Feature Pack for Azure](https://techcommunity.microsoft.com/t5/sql-server-integration-services/doing-more-with-sql-server-integration-services-feature-pack-for/ba-p/388238) blog.

> [!NOTE]
> For a complete introduction to Azure blob storage, refer to [Azure Blob Basics](../../storage/blobs/storage-dotnet-how-to-use-blobs.md) and to [Azure Blob Service](https://msdn.microsoft.com/library/azure/dd179376.aspx).
> 
> 

## Prerequisites
To perform the tasks described in this article, you must have an Azure subscription and an Azure Storage account set up. You need the Azure Storage account name and account key to upload or download data.

* To set up an **Azure subscription**, see [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/).
* For instructions on creating a **storage account** and for getting account and key information, see [About Azure Storage accounts](../../storage/common/storage-create-storage-account.md).

To use the **SSIS connectors**, you must download:

* **SQL Server 2014 or 2016 Standard (or above)**: Install includes SQL Server Integration Services.
* **Microsoft SQL Server 2014 or 2016 Integration Services Feature Pack for Azure**: These connectors can be downloaded, respectively, from the [SQL Server 2014 Integration Services](https://www.microsoft.com/download/details.aspx?id=47366) and [SQL Server 2016 Integration Services](https://www.microsoft.com/download/details.aspx?id=49492) pages.

> [!NOTE]
> SSIS is installed with SQL Server, but is not included in the Express version. For information on what applications are included in various editions of SQL Server, see [SQL Server Editions](https://www.microsoft.com/en-us/server-cloud/products/sql-server-editions/)
> 
> 

For training materials on SSIS, see [Hands On Training for SSIS](https://www.microsoft.com/sql-server/training-certification)

For information on how to get up-and-running using SISS to build simple extraction, transformation, and load (ETL) packages, see [SSIS Tutorial: Creating a Simple ETL Package](https://msdn.microsoft.com/library/ms169917.aspx).

## Download NYC Taxi dataset
The example described here use a publicly available dataset -- the [NYC Taxi Trips](https://www.andresmh.com/nyctaxitrips/) dataset. The dataset consists of about 173 million taxi rides in NYC in the year 2013. There are two types of data: trip details data and fare data. As there is a file for each month, we have 24 files, each of which is about 2 GB uncompressed.

## Upload data to Azure blob storage
To move data using the SSIS feature pack from on-premises to Azure blob storage, we use an instance of the [**Azure Blob Upload Task**](https://msdn.microsoft.com/library/mt146776.aspx), shown here:

![configure-data-science-vm](./media/move-data-to-azure-blob-using-ssis/ssis-azure-blob-upload-task.png)

The parameters that the task uses are described here:

| Field | Description |
| --- | --- |
| **AzureStorageConnection** |Specifies an existing Azure Storage Connection Manager or creates a new one that refers to an Azure Storage account that points to where the blob files are hosted. |
| **BlobContainer** |Specifies the name of the blob container that holds the uploaded files as blobs. |
| **BlobDirectory** |Specifies the blob directory where the uploaded file is stored as a block blob. The blob directory is a virtual hierarchical structure. If the blob already exists, it ia replaced. |
| **LocalDirectory** |Specifies the local directory that contains the files to be uploaded. |
| **FileName** |Specifies a name filter to select files with the specified name pattern. For example, MySheet\*.xls\* includes files such as MySheet001.xls and MySheetABC.xlsx |
| **TimeRangeFrom/TimeRangeTo** |Specifies a time range filter. Files modified after *TimeRangeFrom* and before *TimeRangeTo* are included. |

> [!NOTE]
> The **AzureStorageConnection** credentials need to be correct and the **BlobContainer** must exist before the transfer is attempted.
> 
> 

## Download data from Azure blob storage
To download data from Azure blob storage to on-premises storage with SSIS, use an instance of the [Azure Blob Download Task](https://msdn.microsoft.com/library/mt146779.aspx).

## More advanced SSIS-Azure scenarios
The SSIS feature pack allows for more complex flows to be handled by packaging tasks together. For example, the blob data could feed directly into an HDInsight cluster, whose output could be downloaded back to a blob and then to on-premises storage. SSIS can run Hive and Pig jobs on an HDInsight cluster using additional SSIS connectors:

* To run a Hive script on an Azure HDInsight cluster with SSIS, use [Azure HDInsight Hive Task](https://msdn.microsoft.com/library/mt146771.aspx).
* To run a Pig script on an Azure HDInsight cluster with SSIS, use [Azure HDInsight Pig Task](https://msdn.microsoft.com/library/mt146781.aspx).

