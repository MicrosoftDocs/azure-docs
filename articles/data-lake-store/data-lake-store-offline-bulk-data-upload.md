<properties
   pageTitle="Upload large amounts of data into Data Lake Store using offline methods| Microsoft Azure"
   description="Use AdlCopy tool to copy data from Azure Storage Blobs to Data Lake Store"
   services="data-lake-store"
   documentationCenter=""
   authors="nitinme"
   manager="jhubbard"
   editor="cgronlun"/>

<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="10/07/2016"
   ms.author="nitinme"/>

# Use Azure Import-Export Service for offline copy of data to Data Lake Store

In this article, you will learn about how to copy huge datasets (>200GB) into an Azure Data Lake Store using offline copy methods, like [Azure Import/Export Service](../storage/storage-import-export-service.md). Specifically, The file used as an example in this article is 339,420,860,416 bytes i.e. about 319GB on disk. Let's call this file 319GB.tsv.

Azure Import/Export Service allows you to securely transfer large amounts of data to Azure blob storage by shipping hard disk drives to an Azure data center.

## Prerequisites

Before you begin this article, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- **Azure Storage account**.

- **Azure Data Lake Analytics account (optional)** - See [Get started with Azure Data Lake Analytics](../data-lake-analytics/data-lake-analytics-get-started-portal.md) for instructions on how to create a Data Lake Store account.


## Preparing the data

Before using the Import/Export Service, we must break the data file to be transferred **into copies that are less than 200GB** in size. This is because the import tool does not work with files greater than 200GB. To comply with this, in this tutorial we split the file into chunks of 100,000,000,000 bytes each. You can do this easily using [Cygwin](https://cygwin.com/install.html). Cygwin supports Linux command which allows the users to do this easily. For our case, we use the following command.

    split -b 100m 319GB.tsv

The Split operation creates files with the names below.

    319GB.tsv-part-aa

    319GB.tsv-part-ab

    319GB.tsv-part-ac

    319GB.tsv-part-ad

## Get disks ready with data

Follow the instructions at [Using Azure Import/Export Service](../storage/storage-import-export-service.md) (under the **Prepare your drives** section) to prepare your hard drives. Here's the overall flow on how to prepare the drive.

1. Procure a hard disk that meets the requirement to be used for Auzre Import/Export Service.

2. Identify an Azure Storage account where the data will be copied once it si shipped to the Azure data center.

3. Use the [Azure Import/Export Tool](http://go.microsoft.com/fwlink/?LinkID=301900&clcid=0x409), a command line utility. Here's a sample snippet on how to use the tool.

    ````
    WAImportExport PrepImport /sk:<StorageAccountKey> /t: <TargetDriveLetter> /format /encrypt /logdir:e:\myexportimportjob\logdir /j:e:\myexportimportjob\journal1.jrn /id:myexportimportjob /srcdir:F:\demo\ExImContainer /dstdir:importcontainer/vf1/
    ````
    See [Using Azure Import/Export Service](../storage/storage-import-export-service.md) for more sample snippets on how to use the **Azure Import/Export Tool**.

4. The above command creates a journal file at the specified location. You will use this journal file to create an import job from the [Azure Classic Portal](https://manage.windowsazure.com).

## Create an import job

You can now create an import job using the instructions at [Using Azure Import/Export Service](../storage/storage-import-export-service.md) (under the **Create the Import job** section). For this import job, with other details, also provide the journal file created while preparing the disk drives.

## Physically ship the disks

You can now physically ship the disks to an Azure data center where the data is copied over to the Azure Storage Blobs you provided while creating the import job. Also, while creating the job, if you opted to provide the tracking information later, you can now go back to your import job and updated the tracking number.

## Copy data from Azure Storage Blobs to Azure Data Lake Store

Once the status of the import job shows completed, you can verify whether the data is available in the Azure Storage Blobs you had specified. You can then use a variety of methods to move that data from the Azure Storage Blobs to Azure Data Lake Store. For all the available options for uploading data, see [Ingesting data into Data Lake Store](data-lake-store-data-scenarios.md#ingest-data-into-data-lake-store).

In this section, we provide you with the JSON definitions that you can use to create an Azure Data Factory pipeline for copying data. You can use these JSON definitions from the [Azure portal](../data-factory/data-factory-copy-activity-tutorial-using-azure-portal.md) or [Visual Studio](../data-factory/data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](../data-factory/data-factory-copy-activity-tutorial-using-powershell.md).

### Source Linked Service (Azure Storage Blob)

````
{
	"name": "AzureStorageLinkedService",
	"properties": {
		"type": "AzureStorage",
		"description": "",
		"typeProperties": {
			"connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
		}
	}
}
````

### Target Linked Service (Azure Data Lake Store)

````
{
	"name": "AzureDataLakeStoreLinkedService",
	"properties": {
		"type": "AzureDataLakeStore",
		"description": "",
		"typeProperties": {
			"authorization": "<Click 'Authorize' to allow this data factory and the activities it runs to access this Data Lake Store with your access rights>",
			"dataLakeStoreUri": "https://<adls_account_name>.azuredatalakestore.net/webhdfs/v1",
			"sessionId": "<OAuth session id from the OAuth authorization session. Each session id is unique and may only be used once>"
		}
	}
}
````
### Input Data Set
````
{
	"name": "InputDataSet",
	"properties": {
		"published": false,
		"type": "AzureBlob",
		"linkedServiceName": "AzureStorageLinkedService",
		"typeProperties": {
			"folderPath": "importcontainer/vf1/"
		},
		"availability": {
			"frequency": "Hour",
			"interval": 1
		},
		"external": true,
		"policy": {}
	}
}
````
### Output Data Set
````
{
"name": "OutputDataSet",
"properties": {
  "published": false,
  "type": "AzureDataLakeStore",
  "linkedServiceName": "AzureDataLakeStoreLinkedService",
  "typeProperties": {
    "folderPath": "/importeddatafeb8job/"
    },
  "availability": {
    "frequency": "Hour",
    "interval": 1
    }
  }
}
````
### Pipeline (copy activity)
````
{
	"name": "CopyImportedData",
	"properties": {
		"description": "Pipeline with copy activity",
		"activities": [
			{
				"type": "Copy",
				"typeProperties": {
					"source": {
						"type": "BlobSource"
					},
					"sink": {
						"type": "AzureDataLakeStoreSink",
						"copyBehavior": "PreserveHierarchy",
						"writeBatchSize": 0,
						"writeBatchTimeout": "00:00:00"
					}
				},
				"inputs": [
					{
						"name": "InputDataSet"
					}
				],
				"outputs": [
					{
						"name": "OutputDataSet"
					}
				],
				"policy": {
					"timeout": "01:00:00",
					"concurrency": 1
				},
				"scheduler": {
					"frequency": "Hour",
					"interval": 1
				},
				"name": "AzureBlobtoDataLake",
				"description": "Copy Activity"
			}
		],
		"start": "2016-02-08T22:00:00Z",
		"end": "2016-02-08T23:00:00Z",
		"isPaused": false,
		"pipelineMode": "Scheduled"
	}
}
````
For more information on how to use Azure Data Factory to move data from Azure Storage Blob and Azure Data Lake Store, see [Move data from Azure Storage Blob to Azure Data Lake Store using Azure Data Factory](../data-factory/data-factory-azure-datalake-connector.md#sample-copy-data-from-azure-blob-to-azure-data-lake-store).

## Reconstruct the data files in Azure Data Lake Store

We started with a file that was 319GB in size and broke it down into files of smaller size so that it can be transferred using the Azure Import/Export Service. Now that the data is in Azure Data Lake Store, we can reconstrcut the file to its original size. You can use the following Azure PowerShell cmldts to do so.

````
# Login to our account
Login-AzureRmAccount

# List your subscriptions
Get-AzureRmSubscription

# Switch to the subscription you want to work with
Set-AzureRmContext –SubscriptionId
Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.DataLakeStore"

# Join  the files
Join-AzureRmDataLakeStoreItem -AccountName "<adls_account_name" -Paths "/importeddatafeb8job/319GB.tsv-part-aa","/importeddatafeb8job/319GB.tsv-part-ab", "/importeddatafeb8job/319GB.tsv-part-ac", "/importeddatafeb8job/319GB.tsv-part-ad" -Destination "/importeddatafeb8job/MergedFile.csv”
````

## Next steps

- [Secure data in Data Lake Store](data-lake-store-secure-data.md)
- [Use Azure Data Lake Analytics with Data Lake Store](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
- [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)
