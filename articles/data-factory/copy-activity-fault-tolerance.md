---
title: Fault tolerance of copy activity in Azure Data Factory 
description: 'Learn about how to add fault tolerance to copy activity in Azure Data Factory by skipping the incompatible data.'
services: data-factory
documentationcenter: ''
author: dearandyxu
manager: 
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services


ms.topic: conceptual
ms.date: 10/26/2018
ms.author: yexu

---
#  Fault tolerance of copy activity in Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-copy-activity-fault-tolerance.md)
> * [Current version](copy-activity-fault-tolerance.md)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

When you copy data from source to destination store, Azure Data Factory copy activity provides certain level of fault tolerances to prevent interruption from failures in the middle of data movement. For example, you are copying millions of rows from source to destination store, where a primary key has been created in the destination database, but source database does not have any primary keys defined. When you happen to copy duplicated rows from source to the destination, you will hit the PK violation failure on the destination database. At this moment, copy activity offers you two ways to handle such errors: 
- You can abort the copy activity once any failure is encountered. 
- You can continue to copy the rest by enabling fault tolerance to skip the incompatible data. For example, skip the duplicated row in this case. In addition, you can log the skipped data by enabling session log within copy activity. 

## Copying binary files 

ADF supports the following fault tolerance scenarios when copying binary files. You can choose to abort the copy activity or continue to copy the rest in the following scenarios:

1. The files to be copied by ADF are being deleted by other applications at the same time.
2. Some particular folders or files do not allow ADF to access because ACLs of those files or folders require higher permission level than the connection information configured in ADF.
3. One or more files are not verified to be consistent between source and destination store if you enable data consistency verification setting in ADF.

### Configuration 
When you copy binary files between storage stores, you can enable fault tolerance as followings: 

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
    "skipErrorFile": { 
        "fileMissing": true, 
        "fileForbidden": true, 
        "dataInconsistency": true 
    }, 
    "validateDataConsistency": true, 
    "logStorageSettings": { 
        "linkedServiceName": { 
            "referenceName": "ADLSGen2", 
            "type": "LinkedServiceReference" 
            }, 
        "path": "sessionlog/" 
     } 
} 
```
Property | Description | Allowed values | Required
-------- | ----------- | -------------- | -------- 
skipErrorFile | A group of properties to specify the types of failures you want to skip during the data movement. | | No
fileMissing | One of the key-value pairs within skipErrorFile property bag to determine if you want to skip files, which are being deleted by other applications when ADF is copying in the meanwhile. <br/> -True: you want to copy the rest by skipping the files being deleted by other applications. <br/> - False: you want to abort the copy activity once any files are being deleted from source store in the middle of data movement. <br/>Be aware this property is set to true as default. | True(default) <br/>False | No
fileForbidden | One of the key-value pairs within skipErrorFile property bag to determine if you want to skip the particular files, when the ACLs of those files or folders require higher permission level than the connection configured in ADF. <br/> -True: you want to copy the rest by skipping the files. <br/> - False: you want to abort the copy activity once getting the permission issue on folders or files. | True <br/>False(default) | No
dataInconsistency | One of the key-value pairs within skipErrorFile property bag to determine if you want to skip the inconsistent data between source and destination store. <br/> -True: you want to copy the rest by skipping inconsistent data. <br/> - False: you want to abort the copy activity once inconsistent data found. <br/>Be aware this property is only valid when you set validateDataConsistency as True. | True <br/>False(default) | No
logStorageSettings  | A group of properties that can be specified when you want to log the skipped object names. | &nbsp; | No
linkedServiceName | The linked service of [Azure Blob Storage](connector-azure-blob-storage.md#linked-service-properties) or [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#linked-service-properties) to store the session log files. | The names of an `AzureBlobStorage` or `AzureBlobFS` type linked service, which refers to the instance that you use to store the log file. | No
path | The path of the log files. | Specify the path that you use to store the log files. If you do not provide a path, the service creates a container for you. | No

### Monitoring 

#### Output from copy activity
You can get the number of files being read, written, and skipped via the output of each copy activity run. 

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

#### Session log from copy activity

If you configure to log the skipped file names, you can find the log file from this path: `https://[your-blob-account].blob.core.windows.net/[path-if-configured]/copyactivity-logs/[copy-activity-name]/[copy-activity-run-id]/[auto-generated-GUID].csv`. 

The log files have to be the csv files. The schema of the log file is as following:

Column | Description 
-------- | -----------  
Timestamp | The timestamp when ADF skips the file.
Level | The log level of this item. It will be in 'Warning' level for the item showing file skipping.
OperationName | ADF copy activity operational behavior on each file. It will be 'FileSkip' to specify the file to be skipped.
OperationItem | The file names to be skipped.
Message | More information to illustrate why the file being skipped.

The example of a log file is as following: 
```
Timestamp,Level,OperationName,OperationItem,Message 
2020-03-24 05:35:41.0209942,Warning,FileSkip,"bigfile.csv","File is skipped after read 322961408 bytes: ErrorCode=UserErrorSourceBlobNotExist,'Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,Message=The required Blob is missing. ContainerName: https://transferserviceonebox.blob.core.windows.net/skipfaultyfile, path: bigfile.csv.,Source=Microsoft.DataTransfer.ClientLibrary,'." 
2020-03-24 05:38:41.2595989,Warning,FileSkip,"3_nopermission.txt","File is skipped after read 0 bytes: ErrorCode=AdlsGen2OperationFailed,'Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,Message=ADLS Gen2 operation failed for: Operation returned an invalid status code 'Forbidden'. Account: 'adlsgen2perfsource'. FileSystem: 'skipfaultyfilesforbidden'. Path: '3_nopermission.txt'. ErrorCode: 'AuthorizationPermissionMismatch'. Message: 'This request is not authorized to perform this operation using this permission.'. RequestId: '35089f5d-101f-008c-489e-01cce4000000'..,Source=Microsoft.DataTransfer.ClientLibrary,''Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,Message=Operation returned an invalid status code 'Forbidden',Source=,''Type=Microsoft.Azure.Storage.Data.Models.ErrorSchemaException,Message='Type=Microsoft.Azure.Storage.Data.Models.ErrorSchemaException,Message=Operation returned an invalid status code 'Forbidden',Source=Microsoft.DataTransfer.ClientLibrary,',Source=Microsoft.DataTransfer.ClientLibrary,'." 
```
From the log above, you can see bigfile.csv has been skipped due to another application deleted this file when ADF was copying it. And 3_nopermission.txt has been skipped because ADF is not allowed to access it due to permission issue.


## Copying tabular data 

### Supported scenarios
Copy activity supports three scenarios for detecting, skipping, and logging incompatible tabular data:

- **Incompatibility between the source data type and the sink native type**. 

    For example: Copy data from a CSV file in Blob storage to a SQL database with a schema definition that contains three INT type columns. The CSV file rows that contain numeric data, such as 123,456,789 are copied successfully to the sink store. However, the rows that contain non-numeric values, such as 123,456, abc are detected as incompatible and are skipped.

- **Mismatch in the number of columns between the source and the sink**.

    For example: Copy data from a CSV file in Blob storage to a SQL database with a schema definition that contains six columns. The CSV file rows that contain six columns are copied successfully to the sink store. The CSV file rows that contain more than six columns are detected as incompatible and are skipped.

- **Primary key violation when writing to SQL Server/Azure SQL Database/Azure Cosmos DB**.

    For example: Copy data from a SQL server to a SQL database. A primary key is defined in the sink SQL database, but no such primary key is defined in the source SQL server. The duplicated rows that exist in the source cannot be copied to the sink. Copy activity copies only the first row of the source data into the sink. The subsequent source rows that contain the duplicated primary key value are detected as incompatible and are skipped.

>[!NOTE]
>- For loading data into SQL Data Warehouse using PolyBase, configure PolyBase's native fault tolerance settings by specifying reject policies via "[polyBaseSettings](connector-azure-sql-data-warehouse.md#azure-sql-data-warehouse-as-sink)" in copy activity. You can still enable redirecting PolyBase incompatible rows to Blob or ADLS as normal as shown below.
>- This feature doesn't apply when copy activity is configured to invoke [Amazon Redshift Unload](connector-amazon-redshift.md#use-unload-to-copy-data-from-amazon-redshift).
>- This feature doesn't apply when copy activity is configured to invoke a [stored procedure from a SQL sink](https://docs.microsoft.com/azure/data-factory/connector-azure-sql-database#invoke-a-stored-procedure-from-a-sql-sink).

### Configuration
The following example provides a JSON definition to configure skipping the incompatible rows in copy activity:

```json
"typeProperties": { 
    "source": { 
        "type": "AzureSqlSource" 
    }, 
    "sink": { 
        "type": "AzureSqlSink" 
    }, 
    "enableSkipIncompatibleRow": true, 
    "logStorageSettings": { 
    "linkedServiceName": { 
        "referenceName": "ADLSGen2", 
        "type": "LinkedServiceReference" 
        }, 
    "path": "sessionlog/" 
    } 
}, 
```

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | -------- 
enableSkipIncompatibleRow | Specifies whether to skip incompatible rows during copy or not. | True<br/>False (default) | No
logStorageSettings | A group of properties that can be specified when you want to log the incompatible rows. | &nbsp; | No
linkedServiceName | The linked service of [Azure Blob Storage](connector-azure-blob-storage.md#linked-service-properties) or [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#linked-service-properties) to store the log that contains the skipped rows. | The names of an `AzureBlobStorage` or `AzureBlobFS` type linked service, which refers to the instance that you use to store the log file. | No
path | The path of the log files that contains the skipped rows. | Specify the path that you want to use to log the incompatible data. If you do not provide a path, the service creates a container for you. | No

### Monitor skipped rows
After the copy activity run completes, you can see the number of skipped rows in the output of the copy activity:

```json
"output": {
            "dataRead": 95,
            "dataWritten": 186,
            "rowsCopied": 9,
            "rowsSkipped": 2,
            "copyDuration": 16,
            "throughput": 0.01,
            "logPath": "https://myblobstorage.blob.core.windows.net//myfolder/a84bf8d4-233f-4216-8cb5-45962831cd1b/",
            "errors": []
        },

```

If you configure to log the incompatible rows, you can find the log file from this path: `https://[your-blob-account].blob.core.windows.net/[path-if-configured]/copyactivity-logs/[copy-activity-name]/[copy-activity-run-id]/[auto-generated-GUID].csv`. 

The log files will be the csv files. The schema of the log file is as following:

Column | Description 
-------- | -----------  
Timestamp | The timestamp when ADF skips the incompatible rows
Level | The log level of this item. It will be in 'Warning' level if this item shows the skipped rows
OperationName | ADF copy activity operational behavior on each row. It will be 'TabularRowSkip' to specify that the particular incompatible row has been skipped
OperationItem | The skipped rows from the source data store.
Message | More information to illustrate why the incompatibility of this particular row.


An example of the log file content is as follows:

```
Timestamp, Level, OperationName, OperationItem, Message
2020-02-26 06:22:32.2586581, Warning, TabularRowSkip, """data1"", ""data2"", ""data3""," "Column 'Prop_2' contains an invalid value 'data3'. Cannot convert 'data3' to type 'DateTime'." 
2020-02-26 06:22:33.2586351, Warning, TabularRowSkip, """data4"", ""data5"", ""data6"",", "Violation of PRIMARY KEY constraint 'PK_tblintstrdatetimewithpk'. Cannot insert duplicate key in object 'dbo.tblintstrdatetimewithpk'. The duplicate key value is (data4)." 
```

From the sample log file above, you can see one row "data1, data2, data3" has been skipped due to type conversion issue from source to destination store. Another row "data4, data5, data6" has been skipped due to PK violation issue from source to destination store. 


## Copying tabular data (legacy):

The following is the legacy way to enable fault tolerance for copying tabular data only. If you are creating new pipeline or activity, you are encouraged to start from [here](#copying-tabular-data) instead.

### Configuration
The following example provides a JSON definition to configure skipping the incompatible rows in copy activity:

```json
"typeProperties": {
    "source": {
        "type": "BlobSource"
    },
    "sink": {
        "type": "SqlSink",
    },
    "enableSkipIncompatibleRow": true,
    "redirectIncompatibleRowSettings": {
         "linkedServiceName": {
              "referenceName": "<Azure Storage or Data Lake Store linked service>",
              "type": "LinkedServiceReference"
            },
            "path": "redirectcontainer/erroroutput"
     }
}
```

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | -------- 
enableSkipIncompatibleRow | Specifies whether to skip incompatible rows during copy or not. | True<br/>False (default) | No
redirectIncompatibleRowSettings | A group of properties that can be specified when you want to log the incompatible rows. | &nbsp; | No
linkedServiceName | The linked service of [Azure Storage](connector-azure-blob-storage.md#linked-service-properties) or [Azure Data Lake Store](connector-azure-data-lake-store.md#linked-service-properties) to store the log that contains the skipped rows. | The names of an `AzureStorage` or `AzureDataLakeStore` type linked service, which refers to the instance that you want to use to store the log file. | No
path | The path of the log file that contains the skipped rows. | Specify the path that you want to use to log the incompatible data. If you do not provide a path, the service creates a container for you. | No

### Monitor skipped rows
After the copy activity run completes, you can see the number of skipped rows in the output of the copy activity:

```json
"output": {
            "dataRead": 95,
            "dataWritten": 186,
            "rowsCopied": 9,
            "rowsSkipped": 2,
            "copyDuration": 16,
            "throughput": 0.01,
            "redirectRowPath": "https://myblobstorage.blob.core.windows.net//myfolder/a84bf8d4-233f-4216-8cb5-45962831cd1b/",
            "errors": []
        },

```
If you configure to log the incompatible rows, you can find the log file at this path: `https://[your-blob-account].blob.core.windows.net/[path-if-configured]/[copy-activity-run-id]/[auto-generated-GUID].csv`. 

The log files can only be the csv files. The original data being skipped will be logged with comma as column delimiter if needed. We add two more columns "ErrorCode" and "ErrorMessage" in additional to the original source data in log file, where you can see the root cause of the incompatibility. The ErrorCode and ErrorMessage will be quoted by double quotes. 

An example of the log file content is as follows:

```
data1, data2, data3, "UserErrorInvalidDataValue", "Column 'Prop_2' contains an invalid value 'data3'. Cannot convert 'data3' to type 'DateTime'."
data4, data5, data6, "2627", "Violation of PRIMARY KEY constraint 'PK_tblintstrdatetimewithpk'. Cannot insert duplicate key in object 'dbo.tblintstrdatetimewithpk'. The duplicate key value is (data4)."
```

## Next steps
See the other copy activity articles:

- [Copy activity overview](copy-activity-overview.md)
- [Copy activity performance](copy-activity-performance.md)


