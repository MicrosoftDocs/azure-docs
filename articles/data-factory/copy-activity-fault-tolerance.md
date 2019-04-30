---
title: Fault tolerance of copy activity in Azure Data Factory | Microsoft Docs
description: 'Learn about how to add fault tolerance to copy activity in Azure Data Factory by skipping the incompatible rows.'
services: data-factory
documentationcenter: ''
author: dearandyxu
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 10/26/2018
ms.author: yexu

---
#  Fault tolerance of copy activity in Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-copy-activity-fault-tolerance.md)
> * [Current version](copy-activity-fault-tolerance.md)

The copy activity in Azure Data Factory offers you two ways to handle incompatible rows when copying data between source and sink data stores:

- You can abort and fail the copy activity when incompatible data is encountered (default behavior).
- You can continue to copy all of the data by adding fault tolerance and skipping incompatible data rows. In addition, you can log the incompatible rows in Azure Blob storage or Azure Data Lake Store. You can then examine the log to learn the cause for the failure, fix the data on the data source, and retry the copy activity.

## Supported scenarios
Copy Activity supports three scenarios for detecting, skipping, and logging incompatible data:

- **Incompatibility between the source data type and the sink native type**. 

    For example: Copy data from a CSV file in Blob storage to a SQL database with a schema definition that contains three INT type columns. The CSV file rows that contain numeric data, such as 123,456,789 are copied successfully to the sink store. However, the rows that contain non-numeric values, such as 123,456, abc are detected as incompatible and are skipped.

- **Mismatch in the number of columns between the source and the sink**.

    For example: Copy data from a CSV file in Blob storage to a SQL database with a schema definition that contains six columns. The CSV file rows that contain six columns are copied successfully to the sink store. The CSV file rows that contain more or fewer than six columns are detected as incompatible and are skipped.

- **Primary key violation when writing to SQL Server/Azure SQL Database/Azure Cosmos DB**.

    For example: Copy data from a SQL server to a SQL database. A primary key is defined in the sink SQL database, but no such primary key is defined in the source SQL server. The duplicated rows that exist in the source cannot be copied to the sink. Copy Activity copies only the first row of the source data into the sink. The subsequent source rows that contain the duplicated primary key value are detected as incompatible and are skipped.

>[!NOTE]
>- For loading data into SQL Data Warehouse using PolyBase, configure PolyBase's native fault tolerance settings by specifying reject policies via "[polyBaseSettings](connector-azure-sql-data-warehouse.md#azure-sql-data-warehouse-as-sink)" in copy activity. You can still enable redirecting PolyBase incompatible rows to Blob or ADLS as normal as shown below.
>- This feature doesn't apply when copy activity is configured to invoke [Amazon Redshift Unload](connector-amazon-redshift.md#use-unload-to-copy-data-from-amazon-redshift).


## Configuration
The following example provides a JSON definition to configure skipping the incompatible rows in Copy Activity:

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
linkedServiceName | The linked service of [Azure Storage](connector-azure-blob-storage.md#linked-service-properties) or [Azure Data Lake Store](connector-azure-data-lake-store.md#linked-service-properties) to store the log that contains the skipped rows. | The name of an `AzureStorage` or `AzureDataLakeStore` type linked service, which refers to the instance that you want to use to store the log file. | No
path | The path of the log file that contains the skipped rows. | Specify the path that you want to use to log the incompatible data. If you do not provide a path, the service creates a container for you. | No

## Monitor skipped rows
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
See the other Copy Activity articles:

- [Copy activity overview](copy-activity-overview.md)
- [Copy activity performance](copy-activity-performance.md)


