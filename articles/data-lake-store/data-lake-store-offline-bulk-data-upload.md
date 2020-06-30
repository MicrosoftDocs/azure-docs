---
title: Upload large data set to Azure Data Lake Storage Gen1 - offline methods
description: Use the Import/Export service to copy data from Azure Blob storage to Azure Data Lake Storage Gen1

author: twooley
ms.service: data-lake-store
ms.topic: how-to
ms.date: 05/29/2018
ms.author: twooley

---
# Use the Azure Import/Export service for offline copy of data to Data Lake Storage Gen1

In this article, you'll learn how to copy huge data sets (>200 GB) into Data Lake Storage Gen1 by using offline copy methods, like the [Azure Import/Export service](../storage/common/storage-import-export-service.md). Specifically, the file used as an example in this article is 339,420,860,416 bytes, or about 319 GB on disk. Let's call this file 319GB.tsv.

The Azure Import/Export service helps you to transfer large amounts of data more securely to Azure Blob storage by shipping hard disk drives to an Azure datacenter.

## Prerequisites

Before you begin, you must have the following:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **An Azure storage account**.
* **An Azure Data Lake Storage Gen1 account**. For instructions on how to create one, see [Get started with Azure Data Lake Storage Gen1](data-lake-store-get-started-portal.md).

## Prepare the data

Before using the Import/Export service, break the data file to be transferred **into copies that are less than 200 GB** in size. The import tool does not work with files greater than 200 GB. In this article, we split the file into chunks of 100 GB each. You can do this by using [Cygwin](https://cygwin.com/install.html). Cygwin supports Linux commands. In this case, use the following command:

    split -b 100m 319GB.tsv

The split operation creates files with the following names.

    319GB.tsv-part-aa

    319GB.tsv-part-ab

    319GB.tsv-part-ac

    319GB.tsv-part-ad

## Get disks ready with data

Follow the instructions in [Using the Azure Import/Export service](../storage/common/storage-import-export-service.md) (under the **Prepare your drives** section) to prepare your hard drives. Here's the overall sequence:

1. Procure a hard disk that meets the requirement to be used for the Azure Import/Export service.
2. Identify an Azure storage account where the data will be copied after it is shipped to the Azure datacenter.
3. Use the [Azure Import/Export Tool](https://go.microsoft.com/fwlink/?LinkID=301900&clcid=0x409), a command-line utility. Here's a sample snippet that shows how to use the tool.

    ```
    WAImportExport PrepImport /sk:<StorageAccountKey> /t: <TargetDriveLetter> /format /encrypt /logdir:e:\myexportimportjob\logdir /j:e:\myexportimportjob\journal1.jrn /id:myexportimportjob /srcdir:F:\demo\ExImContainer /dstdir:importcontainer/vf1/
    ```
    See [Using the Azure Import/Export service](../storage/common/storage-import-export-service.md) for more sample snippets.
4. The preceding command creates a journal file at the specified location. Use this journal file to create an import job from the [Azure portal](https://portal.azure.com).

## Create an import job

You can now create an import job by using the instructions in [Using the Azure Import/Export service](../storage/common/storage-import-export-service.md) (under the **Create the Import job** section). For this import job, with other details, also provide the journal file created while preparing the disk drives.

## Physically ship the disks

You can now physically ship the disks to an Azure datacenter. There, the data is copied over to the Azure Storage blobs you provided while creating the import job. Also, while creating the job, if you opted to provide the tracking information later, you can now go back to your import job and update the tracking number.

## Copy data from blobs to Data Lake Storage Gen1

After the status of the import job shows that it's completed, you can verify whether the data is available in the Azure Storage blobs you had specified. You can then use a variety of methods to move that data from the blobs to Azure Data Lake Storage Gen1. For all the available options for uploading data, see [Ingesting data into Data Lake Storage Gen1](data-lake-store-data-scenarios.md#ingest-data-into-data-lake-storage-gen1).

In this section, we provide you with the JSON definitions that you can use to create an Azure Data Factory pipeline for copying data. You can use these JSON definitions from the [Azure portal](../data-factory/tutorial-copy-data-portal.md) or [Visual Studio](../data-factory/tutorial-copy-data-dot-net.md).

### Source linked service (Azure Storage blob)

```JSON
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
```

### Target linked service (Data Lake Storage Gen1)

```JSON
{
    "name": "AzureDataLakeStorageGen1LinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "description": "",
        "typeProperties": {
            "authorization": "<Click 'Authorize' to allow this data factory and the activities it runs to access this Data Lake Storage Gen1 account with your access rights>",
            "dataLakeStoreUri": "https://<adlsg1_account_name>.azuredatalakestore.net/webhdfs/v1",
            "sessionId": "<OAuth session id from the OAuth authorization session. Each session id is unique and may only be used once>"
        }
    }
}
```

### Input data set

```JSON
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
```

### Output data set

```JSON
{
"name": "OutputDataSet",
"properties": {
  "published": false,
  "type": "AzureDataLakeStore",
  "linkedServiceName": "AzureDataLakeStorageGen1LinkedService",
  "typeProperties": {
    "folderPath": "/importeddatafeb8job/"
    },
  "availability": {
    "frequency": "Hour",
    "interval": 1
    }
  }
}
```

### Pipeline (copy activity)

```JSON
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
```

For more information, see [Move data from Azure Storage blob to Azure Data Lake Storage Gen1 using Azure Data Factory](../data-factory/connector-azure-data-lake-store.md).

## Reconstruct the data files in Data Lake Storage Gen1

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

We started with a file that was 319 GB, and broke it down into files of smaller size so that it could be transferred by using the Azure Import/Export service. Now that the data is in Azure Data Lake Storage Gen1, we can reconstruct the file to its original size. You can use the following Azure PowerShell cmdlets to do so.

```PowerShell
# Login to our account
Connect-AzAccount

# List your subscriptions
Get-AzSubscription

# Switch to the subscription you want to work with
Set-AzContext -SubscriptionId
Register-AzResourceProvider -ProviderNamespace "Microsoft.DataLakeStore"

# Join  the files
Join-AzDataLakeStoreItem -AccountName "<adlsg1_account_name" -Paths "/importeddatafeb8job/319GB.tsv-part-aa","/importeddatafeb8job/319GB.tsv-part-ab", "/importeddatafeb8job/319GB.tsv-part-ac", "/importeddatafeb8job/319GB.tsv-part-ad" -Destination "/importeddatafeb8job/MergedFile.csv"
```

## Next steps

* [Secure data in Data Lake Storage Gen1](data-lake-store-secure-data.md)
* [Use Azure Data Lake Analytics with Data Lake Storage Gen1](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
* [Use Azure HDInsight with Data Lake Storage Gen1](data-lake-store-hdinsight-hadoop-use-portal.md)
