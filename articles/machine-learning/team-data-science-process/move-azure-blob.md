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

The Team Data Science Process requires that data be ingested or loaded into various different storage environments to be processed or analyzed in the most appropriate way in each stage of the process.

## Different technologies for moving data

The following articles describe how to move data to and from Azure Blob storage using different technologies.

* [Azure Storage-Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md)
  * Storage Explorer is a free tool from Microsoft that allows you to work with Azure Storage data on Windows, macOS, and Linux.
  * If you are using VM that was set up with the scripts provided by Data Science Virtual machines in Azure, then Azure Storage Explorer is already installed on the VM.
* [AzCopy](../../storage/common/storage-use-azcopy-v10.md)
  * AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. 
* [Python SDK](../../storage/blobs/storage-quickstart-blobs-python.md)
  * Use the Azure Blob Storage client library for Python to move blobs.
* [SQL Server Integration Services (SSIS) Feature Pack for Azure](/sql/integration-services/azure-feature-pack-for-integration-services-ssis)
  * SSIS provides components to connect to Azure, transfer data between Azure and on-premises data sources, and process data stored in Azure. For a discussion of canonical scenarios that use SSIS to accomplish business needs common in hybrid data integration scenarios, see [Doing more with SQL Server Integration Services Feature Pack for Azure blog](https://techcommunity.microsoft.com/t5/sql-server-integration-services/doing-more-with-sql-server-integration-services-feature-pack-for/ba-p/388238).
  * For training materials on SSIS, see [Hands On Training for SSIS](https://www.microsoft.com/sql-server/training-certification).
  * For information on how to get up-and-running using SISS to build simple extraction, transformation, and load (ETL) packages, see [SSIS Tutorial: Creating a Simple ETL Package](/sql/integration-services/ssis-how-to-create-an-etl-package).

Which method is best for you depends on your scenario. The [Scenarios for advanced analytics in Azure Machine Learning](plan-sample-scenarios.md) article helps you determine the resources you need for various data science workflows used in an advanced analytics process.

> [!NOTE]
> For a complete introduction to Azure blob storage, refer to [Azure Blob Basics](../../storage/blobs/storage-quickstart-blobs-dotnet.md) and to [Azure Blob Service](/rest/api/storageservices/Blob-Service-Concepts).
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
* For instructions on creating a storage account and for getting account and key information, see [About Azure Storage accounts](../../storage/common/storage-account-create.md).