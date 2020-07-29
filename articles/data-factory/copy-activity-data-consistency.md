---
title: Data consistency verification in copy activity 
description: 'Learn about how to enable data consistency verification in copy activity in Azure Data Factory.'
services: data-factory
documentationcenter: ''
author: dearandyxu
manager: 
ms.reviewer: 

ms.service: data-factory
ms.workload: data-services


ms.topic: conceptual
ms.date: 3/27/2020
ms.author: yexu

---
#  Data consistency verification in copy activity (Preview)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

When you move data from source to destination store, Azure Data Factory copy activity provides an option for you to do additional data consistency verification to ensure the data is not only successfully copied from source to destination store, but also verified to be consistent between source and destination store. Once inconsistent data have been found during the data movement, you can either abort the copy activity or continue to copy the rest by enabling fault tolerance setting to skip inconsistent data. You can get the skipped object names by enabling session log setting in copy activity. 

> [!IMPORTANT]
> This feature is currently in preview with the following limitations we are actively working on:
>- Data consistency verification is available only on binary files copying between file-based stores with 'PreserveHierarchy' behavior in copy activity. For copying tabular data, data consistency verification is not available in copy activity yet.
>- When you enable session log setting in copy activity to log the inconsistent files being skipped, the completeness of log file can not be 100% guaranteed if copy activity failed.
>- The session log contains inconsistent files only, where the successfully copied files are not logged so far.

## Supported data stores

### Source data stores

-   [Azure Blob storage](connector-azure-blob-storage.md)
-   [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md)
-   [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md)
-   [Azure File Storage](connector-azure-file-storage.md)
-   [Amazon S3](connector-amazon-simple-storage-service.md)
-   [File System](connector-file-system.md)
-   [HDFS](connector-hdfs.md)

### Destination data stores

-   [Azure Blob storage](connector-azure-blob-storage.md)
-   [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md)
-   [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md)
-   [Azure File Storage](connector-azure-file-storage.md)
-   [File System](connector-file-system.md)


## Configuration
The following example provides a JSON definition to enable data consistency verification in Copy Activity: 

```json
"typeProperties": { 
"source": { 
        "type": "BinarySource", 
        "storeSettings": { 
            "type": "AzureDataLakeStoreReadSettings", 
            "recursive": true 
        } 
    }, 
    "sink": { 
        "type": "BinarySink", 
        "storeSettings": { 
            "type": "AzureDataLakeStoreWriteSettings" 
        } 
}, 
    "validateDataConsistency": true, 
    "skipErrorFile": { 
        "dataInconsistency": true 
    }, 
    "logStorageSettings": { 
        "linkedServiceName": { 
            "referenceName": "ADLSGen2_storage", 
            "type": "LinkedServiceReference" 
        }, 
        "path": "/sessionlog/" 
} 
} 
```

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | -------- 
validateDataConsistency | If you set true for this property, copy activity will check file size, lastModifiedDate, and MD5 checksum for each object copied from source to destination store to ensure the data consistency between source and destination store. Be aware the copy performance will be affected by enabling this option.  | True<br/>False (default) | No
dataInconsistency | One of the key-value pairs within skipErrorFile property bag to determine if you want to skip the inconsistent data.<br/> -True: you want to copy the rest by skipping inconsistent data.<br/> - False: you want to abort the copy activity once inconsistent data found.<br/>Be aware this property is only valid when you set validateDataConsistency as True.  | True<br/>False (default) | No
logStorageSettings | A group of properties that can be specified to enable session log to log skipped objects. | | No
linkedServiceName | The linked service of [Azure Blob Storage](connector-azure-blob-storage.md#linked-service-properties) or [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#linked-service-properties) to store the session log files. | The names of an `AzureBlobStorage` or `AzureBlobFS` types linked service, which refers to the instance that you use to store the log files. | No
path | The path of the log files. | Specify the path that you want to store the log files. If you do not provide a path, the service creates a container for you. | No

>[!NOTE]
>- Data consistency is not supported in staging copy scenario. 
>- When copying files from, or to Azure Blob or Azure Data Lake Storage Gen2, ADF does block level MD5 checksum verification leveraging [Azure Blob API](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions?view=azure-dotnet-legacy) and [Azure Data Lake Storage Gen2 API](https://docs.microsoft.com/rest/api/storageservices/datalakestoragegen2/path/update#request-headers). If ContentMD5 on files exist on Azure Blob or Azure Data Lake Storage Gen2 as data sources, ADF does file level MD5 checksum verification after reading the files as well. After copying files to Azure Blob or Azure Data Lake Storage Gen2 as data destination, ADF writes ContentMD5 to Azure Blob or Azure Data Lake Storage Gen2 which can be further consumed by downstream applications for data consistency verification.
>- ADF does file size verification when copying files between any storage stores.

## Monitoring

### Output from copy activity
After the copy activity runs completely, you can see the result of data consistency verification from the output of each copy activity run:

```json
"output": {
            "dataRead": 695,
            "dataWritten": 186,
            "filesRead": 3,  
            "filesWritten": 1, 
            "filesSkipped": 2, 
            "throughput": 297,
            "logPath": "https://myblobstorage.blob.core.windows.net//myfolder/a84bf8d4-233f-4216-8cb5-45962831cd1b/",
			"dataConsistencyVerification": 
           { 
                "VerificationResult": "Verified", 
                "InconsistentData": "Skipped" 
           } 
        }

```
You can see the details of data consistency verification from "dataConsistencyVerification property".

Value of **VerificationResult**: 
-   **Verified**:  Your copied data has been verified to be consistent between source and destination store. 
-   **NotVerified**: Your copied data has not been verified to be consistent because you have not enabled the validateDataConsistency in copy activity. 
-   **Unsupported**: Your copied data has not been verified to be consistent because data consistency verification is not supported for this particular copy pair. 

Value of **InconsistentData**: 
-   **Found**: ADF copy activity has found inconsistent data. 
-   **Skipped**: ADF copy activity has found and skipped inconsistent data. 
-   **None**: ADF copy activity has not found any inconsistent data. It can be either because your data has been verified to be consistent between source and destination store or because you disabled validateDataConsistency in copy activity. 

### Session log from copy activity

If you configure to log the inconsistent file, you can find the log file from this path: `https://[your-blob-account].blob.core.windows.net/[path-if-configured]/copyactivity-logs/[copy-activity-name]/[copy-activity-run-id]/[auto-generated-GUID].csv`.  The log files will be the csv files. 

The schema of a log file is as following:

Column | Description 
-------- | -----------  
Timestamp | The timestamp when ADF skips the inconsistent files.
Level | The log level of this item. It will be in 'Warning' level for the item showing file skipping.
OperationName | ADF copy activity operational behavior on each file. It will be 'FileSkip' to specify the file to be skipped.
OperationItem | The file name to be skipped.
Message | More information to illustrate why files being skipped.

The example of a log file is as following: 
```
Timestamp, Level, OperationName, OperationItem, Message
2020-02-26 06:22:56.3190846, Warning, FileSkip, "sample1.csv", "File is skipped after read 548000000 bytes: ErrorCode=DataConsistencySourceDataChanged,'Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,Message=Source file 'sample1.csv' is changed by other clients during the copy activity run.,Source=,'." 
```
From the log file above, you can see sample1.csv has been skipped because it failed to be verified to be consistent between source and destination store. You can get more details about why sample1.csv becomes inconsistent is because it was being changed by other applications when ADF copy activity is copying at the same time. 



## Next steps
See the other Copy Activity articles:

- [Copy activity overview](copy-activity-overview.md)
- [Copy activity fault tolerance](copy-activity-fault-tolerance.md)


