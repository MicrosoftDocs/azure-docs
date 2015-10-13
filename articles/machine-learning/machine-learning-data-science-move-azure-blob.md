<properties 
	pageTitle="Move Data to and from Azure Blob Storage | Microsoft Azure" 
	description="Move Data to and from Azure Blob Storage" 
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
	ms.date="10/12/2015" 
	ms.author="bradsev;sunliangms;sachouks;mohabib" />

# Move Data to and from Azure Blob Storage

[AZURE.INCLUDE [cap-ingest-data-selector](../../includes/cap-ingest-data-selector.md)]

## Introduction

[AZURE.INCLUDE [blob-storage-tool-selector](../../includes/machine-learning-blob-storage-tool-selector.md)]

This topic describes three methods to move data to and from Azure Blob storage:

- Using Azure Storage Explorer
- Using AzCopy Command line utility
- Using Azure SDK in Python

Which method is best for you will depend on your scenario. The [Scenarios for the Advanced Analytics Process and Technology (ADAPT) in Azure Machine Learning](../machine-learning-data-science-plan-sample-scenarios.md) article helps you determine the resources you need for a variety of data science workflows used in the advanced analytics process.

> [AZURE.NOTE] For a complete introduction to Azure blob storage, please refer to [Azure Blob Basics](../storage-dotnet-how-to-use-blobs.md) and  [Azure Blob Service](https://msdn.microsoft.com/library/azure/dd179376.aspx). 

> [AZURE.TIP] As an alternative, you can use [Azure Data Factory](https://azure.microsoft.com/en-us/services/data-factory/) to create and schedule a pipeline that will download data from Azure blob storage, pass it to a published Azure Machine Learning web service, receive the predictive analytics results, and upload the results to storage. For more information, see [Create predictive pipelines using Azure Data Factory and Azure Machine Learning](../data-factory/data-factory-create-predictive-pipelines.md).

## Prerequisites

This document assumes that you have an Azure subscription, a storage account and the corresponding storage key for that account. Before uploading/downloading data, you must know your Azure storage account name and account key. 

- To set up an Azure subscription, see [Free one-month trial](https://azure.microsoft.com/en-us/pricing/free-trial/).
- For instructions on creating a storage account and for getting account and key information, see [About Azure storage accounts](../storage-create-storage-account.md).




 