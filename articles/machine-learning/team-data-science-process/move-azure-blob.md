---
title: Move Data to and from Azure Blob storage - Team Data Science Process
description: Move Data to and from Azure Blob storage using Azure Storage Explorer, AzCopy, Python, and SSIS.
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
# Move data to and from Azure Blob storage

The Team Data Science Process requires that data be ingested or loaded into a variety of different storage environments to be processed or analyzed in the most appropriate way in each stage of the process.

## Different technologies for moving data

The following articles describe how to move data to and from Azure Blob storage using different technologies.

* [Azure Storage-Explorer](move-data-to-azure-blob-using-azure-storage-explorer.md)
* [AzCopy](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10)
* [Python](move-data-to-azure-blob-using-python.md)
* [SSIS](move-data-to-azure-blob-using-ssis.md)

Which method is best for you depends on your scenario. The [Scenarios for advanced analytics in Azure Machine Learning](plan-sample-scenarios.md) article helps you determine the resources you need for a variety of data science workflows used in the advanced analytics process.

> [!NOTE]
> For a complete introduction to Azure blob storage, refer to [Azure Blob Basics](../../storage/blobs/storage-dotnet-how-to-use-blobs.md) and to [Azure Blob Service](https://msdn.microsoft.com/library/azure/dd179376.aspx).
> 
> 

## Using Azure Data Factory

As an alternative, you can use [Azure Data Factory](https://azure.microsoft.com/services/data-factory/) to: 

* create and schedule a pipeline that downloads data from Azure blob storage, 
* pass it to a published Azure Machine Learning web service, 
* receive the predictive analytics results, and 
* upload the results to storage. 

For more information, see [Create predictive pipelines using Azure Data Factory and Azure Machine Learning](../../data-factory/transform-data-using-machine-learning.md).

## Prerequisites
This article assumes that you have an Azure subscription, a storage account, and the corresponding storage key for that account. Before uploading/downloading data, you must know your Azure Storage account name and account key.

* To set up an Azure subscription, see [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/).
* For instructions on creating a storage account and for getting account and key information, see [About Azure Storage accounts](../../storage/common/storage-create-storage-account.md).

