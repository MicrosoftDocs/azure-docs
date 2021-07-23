---
title: Session log in copy activity 
description: 'Learn about how to enable session log in copy activity in Azure Data Factory.'
author: dearandyxu
ms.service: data-factory
ms.topic: conceptual
ms.date: 11/11/2020
ms.author: yexu
---
#  Session log in copy activity

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

You can log your copied file names in copy activity, which can help you to further ensure the data is not only successfully copied from source to destination store, but also consistent between source and destination store by reviewing the copied files in copy activity session logs.  

When you enable fault tolerance setting in copy activity to skip faulty data, the skipped files and skipped rows can also be logged.  You can get more details from [fault tolerance in copy activity](copy-activity-fault-tolerance.md). 

Given you have the opportunity to get all the file names copied by ADF copy activity via enabling session log, it will be helpful for you in the following scenarios:
-   After you use ADF copy activities to copy the files from one storage to another, you see some files are shown up in destination store which should not. You can scan the copy activity session logs to see which copy activity actually copied those files and when to copy those files. By those, you can easily find the root cause and fix your configurations in ADF.   
-   After you use ADF copy activities to copy the files from one storage to another, you feel the files copied to the destination are not the same as the ones from the source store. You can scan the copy activity session logs to get the timestamp of copy jobs as well as the metadata of files when ADF copy activities read them from the source store.  By those, you can know if those files had been updated by other applications on source store after being copied by ADF.  


## Configuration
The following example provides a JSON definition to enable session log in Copy Activity: 

```json
"typeProperties": {
    "source": {
        "type": "BinarySource",
        "storeSettings": {
            "type": "AzureDataLakeStoreReadSettings",
            "recursive": true
        },
        "formatSettings": {
            "type": "BinaryReadSettings"
        }
    },
    "sink": {
        "type": "BinarySink",
        "storeSettings": {
            "type": "AzureBlobFSWriteSettings"
        }
    },                    
    "skipErrorFile": {
        "fileForbidden": true,
        "dataInconsistency": true
    },
    "validateDataConsistency": true,
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
enableCopyActivityLog | When set it to true, you will have the opportunity to log copied files, skipped files or skipped rows.  | True<br/>False (default) | No
logLevel | "Info" will log all the copied files, skipped files and skipped rows. "Warning" will log skipped files and skipped rows only.  | Info<br/>Warning (default) | No
enableReliableLogging | When it is true, copy activity in reliable mode will flush logs immediately once each file is copied to the destination.  When you are copying huge amounts of files with reliable logging mode enabled in copy activity, you should expect the copy throughput would be impacted, since double write operations are required for each file copying. One request is to the destination store and another request is to the log storage store.  Copy activity in best effort mode will flush logs with batch of records within a period of time, where the copy throughput will be much less impacted. The completeness and timeliness of logging is not guaranteed in this mode since there are a few possibilities that the last batch of log events has not been flushed to the log file when copy activity failed. At this moment, you will see a few files copied to the destination are not logged.  | True<br/>False (default) | No
logLocationSettings | A group of properties that can be used to specify the location to store the session logs. | | No
linkedServiceName | The linked service of [Azure Blob Storage](connector-azure-blob-storage.md#linked-service-properties) or [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#linked-service-properties) to store the session log files. | The names of an `AzureBlobStorage` or `AzureBlobFS` types linked service, which refers to the instance that you use to store the log files. | No
path | The path of the log files. | Specify the path that you want to store the log files. If you do not provide a path, the service creates a container for you. | No


## Monitoring

### Output from copy activity
After the copy activity runs completely, you can see the path of log files from the output of each copy activity run. You can find the log files from the path: `https://[your-blob-account].blob.core.windows.net/[logFilePath]/copyactivity-logs/[copy-activity-name]/[copy-activity-run-id]/[auto-generated-GUID].txt`.  The log files generated have the .txt extension and their data is in CSV format.

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

> [!NOTE]
> When the `enableCopyActivityLog` property is set to `Enabled`, the log file names are system generated.

### The schema of the log file

The following is the schema of a log file.

Column | Description 
-------- | -----------  
Timestamp | The timestamp when ADF reads, writes, or skips the object.
Level | The log level of this item. It can be 'Warning' or "Info".
OperationName | ADF copy activity operational behavior on each object. It can be 'FileRead',' FileWrite', 'FileSkip', or 'TabularRowSkip'.
OperationItem | The file names or skipped rows.
Message | More information to show if the file has been read from source store, or written to the destination store. It can also be why the file or rows has being skipped.

The following is an example of a log file. 
```
Timestamp, Level, OperationName, OperationItem, Message
2020-10-19 08:39:13.6688152,Info,FileRead,"sample1.csv","Start to read file: {""Path"":""sample1.csv"",""ItemType"":""File"",""Size"":104857620,""LastModified"":""2020-10-19T08:22:31Z"",""ETag"":""\""0x8D874081F80C01A\"""",""ContentMD5"":""dGKVP8BVIy6AoTtKnt+aYQ=="",""ObjectName"":null}"
2020-10-19 08:39:56.3190846, Warning, FileSkip, "sample1.csv", "File is skipped after read 548000000 bytes: ErrorCode=DataConsistencySourceDataChanged,'Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,Message=Source file 'sample1.csv' is changed by other clients during the copy activity run.,Source=,'." 
2020-10-19 08:40:13.6688152,Info,FileRead,"sample2.csv","Start to read file: {""Path"":""sample2.csv"",""ItemType"":""File"",""Size"":104857620,""LastModified"":""2020-10-19T08:22:31Z"",""ETag"":""\""0x8D874081F80C01A\"""",""ContentMD5"":""dGKVP8BVIy6AoTtKnt+aYQ=="",""ObjectName"":null}"
2020-10-19 08:40:13.9003981,Info,FileWrite,"sample2.csv","Start to write file from source file: sample2.csv."
2020-10-19 08:45:17.6508407,Info,FileRead,"sample2.csv","Complete reading file successfully. "
2020-10-19 08:45:28.7390083,Info,FileWrite,"sample2.csv","Complete writing file from source file: sample2.csv. File is successfully copied."
```
From the log file above, you can see sample1.csv has been skipped because it failed to be verified to be consistent between source and destination store. You can get more details about why sample1.csv becomes inconsistent is because it was being changed by other applications when ADF copy activity is copying at the same time. You can also see sample2.csv has been successfully copied from source to destination store.

You can use multiple analysis engines to further analyze the log files.  There are a few examples below to use SQL query to analyze the log file by importing csv log file to SQL database where the table name can be SessionLogDemo.  

-   Give me the copied file list. 
```sql
select OperationItem from SessionLogDemo where Message like '%File is successfully copied%'
```

-   Give me the file list copied within a particular time range. 
```sql
select OperationItem from SessionLogDemo where TIMESTAMP >= '<start time>' and TIMESTAMP <= '<end time>' and Message like '%File is successfully copied%'
```

-   Give me a particular file with its copied time and metadata. 
```sql
select * from SessionLogDemo where OperationItem='<file name>'
```

-   Give me a list of files with their metadata copied within a time range. 
```sql
select * from SessionLogDemo where OperationName='FileRead' and Message like 'Start to read%' and OperationItem in (select OperationItem from SessionLogDemo where TIMESTAMP >= '<start time>' and TIMESTAMP <= '<end time>' and Message like '%File is successfully copied%')
```

-   Give me the skipped file list. 
```sql
select OperationItem from SessionLogDemo where OperationName='FileSkip'
```

-   Give me the reason why a particular file skipped. 
```sql
select TIMESTAMP, OperationItem, Message from SessionLogDemo where OperationName='FileSkip'
```

-   Give me the list of files skipped due to the same reason: "blob file does not exist". 
```sql
select TIMESTAMP, OperationItem, Message from SessionLogDemo where OperationName='FileSkip' and Message like '%UserErrorSourceBlobNotExist%'
```

-   Give me the file name that requires the longest time to copy.
```sql
select top 1 OperationItem, CopyDuration=DATEDIFF(SECOND, min(TIMESTAMP), max(TIMESTAMP)) from SessionLogDemo group by OperationItem order by CopyDuration desc
```


## Next steps
See the other Copy Activity articles:

- [Copy activity overview](copy-activity-overview.md)
- [Copy activity fault tolerance](copy-activity-fault-tolerance.md)
- [Copy activity data consistency](copy-activity-data-consistency.md)
