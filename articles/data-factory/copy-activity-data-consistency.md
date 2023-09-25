---
title: Data consistency verification in copy activity 
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about how to enable data consistency verification in a copy activity in Azure Data Factory and Synapse Analytics pipelines.
author: dearandyxu
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 02/08/2023
ms.author: yexu
---
#  Data consistency verification in copy activity

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

When you move data from source to destination store, the copy activity provides an option for you to do further data consistency verification to ensure the data is not only successfully copied from source to destination store, but also verified to be consistent between source and destination store. Once inconsistent files have been found during the data movement, you can either abort the copy activity or continue to copy the rest by enabling fault tolerance setting to skip inconsistent files. You can get the skipped file names by enabling session log setting in copy activity. You can refer to [session log in copy activity](copy-activity-log.md) for more details.

## Supported data stores and scenarios

-   Data consistency verification is supported by all the connectors except FTP, SFTP, HTTP, Snowflake, Office 365 and Azure Databricks Delta Lake. 
-   Data consistency verification isn't supported in staging copy scenario.
-   When copying binary files, data consistency verification is only available when 'PreserveHierarchy' behavior is set in copy activity.
-   When copying multiple binary files in single copy activity with data consistency verification enabled, you have an option to either abort the copy activity or continue to copy the rest by enabling fault tolerance setting to skip inconsistent files. 
-   When copying a table in single copy activity with data consistency verification enabled, copy activity fails if the number of rows read from the source is different from the number of rows copied to the destination plus the number of incompatible rows that were skipped.


## Configuration
The following example provides a JSON definition to enable data consistency verification in Copy Activity: 

```json
{
  "name":"CopyActivityDataConsistency",
  "type":"Copy",
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
    "logSettings": {
        "enableCopyActivityLog": true,
        "copyActivityLogSettings": {
            "logLevel": "Warning",
            "enableReliableLogging": false
        },
        "logLocationSettings": {
            "linkedServiceName": {
               "referenceName": "ADLSGen2",
               "type": "LinkedServiceReference"
            },
            "path": "sessionlog/"
        }
    }
} 
```

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | -------- 
validateDataConsistency | If you set true for this property, when copying binary files, copy activity will check file size, lastModifiedDate, and MD5 checksum for each binary file copied from source to destination store to ensure the data consistency between source and destination store. When copying tabular data, copy activity will check the total row count after job completes, ensuring the total number of rows read from the source is same as the number of rows copied to the destination plus the number of incompatible rows that were skipped. Be aware the copy performance is affected by enabling this option.  | True<br/>False (default) | No
dataInconsistency | One of the key-value pairs within skipErrorFile property bag to determine if you want to skip the inconsistent files. <br/> -True: you want to copy the rest by skipping inconsistent files.<br/> - False: you want to abort the copy activity once inconsistent file found.<br/>Be aware this property is only valid when you are copying binary files and set validateDataConsistency as True.  | True<br/>False (default) | No
logSettings | A group of properties that can be specified to enable session log to log skipped files. | | No
linkedServiceName | The linked service of [Azure Blob Storage](connector-azure-blob-storage.md#linked-service-properties) or [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#linked-service-properties) to store the session log files. | The names of an `AzureBlobStorage` or `AzureBlobFS` types linked service, which refers to the instance that you use to store the log files. | No
path | The path of the log files. | Specify the path that you want to store the log files. If you do not provide a path, the service creates a container for you. | No

>[!NOTE]
>- When copying binary files from or to Azure Blob or Azure Data Lake Storage Gen2, the service does block level MD5 checksum verification leveraging [Azure Blob API](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions?view=azure-dotnet-legacy&preserve-view=true) and [Azure Data Lake Storage Gen2 API](/rest/api/storageservices/datalakestoragegen2/path/update#request-headers). If ContentMD5 on files exist on Azure Blob or Azure Data Lake Storage Gen2 as data sources, the service does file level MD5 checksum verification after reading the files as well. After copying files to Azure Blob or Azure Data Lake Storage Gen2 as data destination, the service writes ContentMD5 to Azure Blob or Azure Data Lake Storage Gen2 which can be further consumed by downstream applications for data consistency verification.
>- The service does file size verification when copying binary files between any storage stores.

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
            "logFilePath": "myfolder/a84bf8d4-233f-4216-8cb5-45962831cd1b/",
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
-   **NotVerified**: Your copied data hasn't been verified to be consistent because you haven't enabled the validateDataConsistency in copy activity. 
-   **Unsupported**: Your copied data hasn't been verified to be consistent because data consistency verification isn't supported for this particular copy pair. 

Value of **InconsistentData**: 
-   **Found**: The copy activity has found inconsistent data. 
-   **Skipped**: The copy activity has found and skipped inconsistent data. 
-   **None**: The copy activity hasn't found any inconsistent data. It can be either because your data has been verified to be consistent between source and destination store or because you disabled validateDataConsistency in copy activity. 

### Session log from copy activity

If you configure to log the inconsistent file, you can find the log file from this path: `https://[your-blob-account].blob.core.windows.net/[path-if-configured]/copyactivity-logs/[copy-activity-name]/[copy-activity-run-id]/[auto-generated-GUID].csv`.  The log files are the csv files. 

The schema of a log file is as following:

Column | Description 
-------- | -----------  
Timestamp | The timestamp when the service skips the inconsistent files.
Level | The log level of this item. It is in 'Warning' level for the item showing file skipping.
OperationName | The copy activity operational behavior on each file. It is 'FileSkip' to specify the file to be skipped.
OperationItem | The file name to be skipped.
Message | More information to illustrate why files being skipped.

The example of a log file is as following: 
```
Timestamp, Level, OperationName, OperationItem, Message
2020-02-26 06:22:56.3190846, Warning, FileSkip, "sample1.csv", "File is skipped after read 548000000 bytes: ErrorCode=DataConsistencySourceDataChanged,'Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,Message=Source file 'sample1.csv' is changed by other clients during the copy activity run.,Source=,'." 
```
From the log file above, you can see sample1.csv has been skipped because it failed to be verified to be consistent between source and destination store. You can get more details about why sample1.csv becomes inconsistent is because it was being changed by other applications when the copy activity is copying at the same time. 



## Next steps
See the other Copy Activity articles:

- [Copy activity overview](copy-activity-overview.md)
- [Copy activity fault tolerance](copy-activity-fault-tolerance.md)
