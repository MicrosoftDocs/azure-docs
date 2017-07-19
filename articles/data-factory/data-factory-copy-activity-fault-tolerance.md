---
title: Copy Activity Fault Tolerance | Microsoft Docs
description: 'Learn about the fault tolerance during data movement by skipping the compatible rows in Copy Activity'
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: monicar

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/19/2017
ms.author: jingwang

---
# Copy Activity Fault Tolerance - Skip Incompatible Rows

With [Copy Activity](data-factory-data-movement-activities.md), you have different options to deal with incompatible rows when copying data between source and sink data stores. You can choose to either abort and fail the copy activity upon encountering the first incompatibility data (default behavior), or continue copying all the data by skipping those incompatible rows. Additionally, you also have the option to log the incompatible rows in Azure Blob so you can examine the cause for failure, fix the data on the data source and retry.

## Supported scenarios
Currently, copy activity supports detecting, skipping and logging the following incompatible situation during copy:

1. **Data type incompatibility between source and sink native types**

    Example: to copy from CSV file in Azure Blob to Azure SQL Database, and the schema defined in Azure SQL Database has three columns all in *INT* type. Then the rows with numeric data (for example `123,456,789`) in source CSV file will be copied successfully, while the rows containing non-numeric value (for example `123,456,abc`) will be skipped as incompatible rows.

2. **Number of columns mismatch between data source and sink**

    Example: to copy from CSV file in Azure Blob to Azure SQL Database, and the schema defined in SQL Azure has six columns. Then the rows containing six columns in source CSV file will be copied successfully, while the rows with other number of columns will be skipped as incompatible rows.

3. **Primary key violation when writing to relational database**

    Example: to copy from SQL Server to Azure SQL Database, there is a Primary Key defined in sink Azure SQL Database, but no such a Primary Key defined in source SQL Server. The duplicated rows which can exist in source are not allowed when writing into sink. Copy activity will only copy the first row into sink and skip the second or more rows with duplicated primary key value from source to sink.

## Configuration
The following is an example on how to configure skipping the incompatible rows during copy:

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
        "linkedServiceName": "BlobStorage",
        "path": "redirectcontainer/erroroutput"
    }
}
```

| Property | Description | Allow Value | Required |
| --- | --- | --- | --- |
| enableSkipIncompatibleRow | Enable skipping incompatible rows during copy or not. | True<br/>False (default) | No |
| redirectIncompatibleRowSettings | A group of properties that can be specified when you want to log the incompatible rows. | &nbsp; | No |
| linkedServiceName | The linked service of Azure Storage to store the log which contains all the rows being skipped. | Specify the name of an [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service) or [AzureStorageSas](data-factory-azure-blob-connector.md#azure-storage-sas-linked-service) linked service, which refers to the instance of Storage that you use to store log file. | No |
| path | The path of log file that contains all the rows being skipped. | Specify the Blob storage path that you want to log the incompatible data. If you do not provide a path, the service will create a container for you. | No |

## Monitoring
After copy activity run completes, you can see the number of rows being skipped in the monitoring section as follows:

![Skip incompatible rows monitoring](./media/data-factory-copy-activity-fault-tolerance/skip-incompatible-rows-monitoring.png)

If you configure to log the incompatible rows, to figure out what have been skipped and what is the root cause of incompatibility, you can find the log file at this path: `https://[your-blob-account].blob.core.windows.net/[path-if-configured]/[copy-activity-run-id]/[auto-generated-GUID].csv`.

Both the original data and the corresponding error will be logged in the file. An example of the log file content is as follows:
```
data1	data2	data3	UserErrorInvalidDataValue	Column 'Prop_2' contains an invalid value 'data3'. Cannot convert 'data3' to type 'DateTime'.
data4	data5	data6 	Violation of PRIMARY KEY constraint 'PK_tblintstrdatetimewithpk'. Cannot insert duplicate key in object 'dbo.tblintstrdatetimewithpk'. The duplicate key value is (data4).
```

## Next Steps
To learn more on Azure Data Factory Copy Activity, see [Move data by using Copy Activity](data-factory-data-movement-activities.md).