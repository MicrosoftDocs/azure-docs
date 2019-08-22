---
title: Get Metadata activity in Azure Data Factory | Microsoft Docs
description: Learn how to use the Get Metadata activity in a Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: 

ms.assetid: 1c46ed69-4049-44ec-9b46-e90e964a4a8e
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 08/12/2019
ms.author: jingwang

---
# Get Metadata activity in Azure Data Factory

You can use the Get Metadata activity to retrieve the metadata of any data in Azure Data Factory. You can use this activity in the following scenarios:

- Validate the metadata of any data.
- Trigger a pipeline when data is ready/available.

The following functionality is available in the control flow:

- You can use the output from the Get Metadata activity in conditional expressions to perform validation.
- You can trigger a pipeline when a condition is satisfied via Do-Until looping.

## Capabilities

The Get Metadata activity takes a dataset as an input and returns metadata information available as activity output. Currently, the following connectors and corresponding retrievable metadata are supported. The maximum size of returned metadata is 1 MB.

>[!NOTE]
>If you run the Get Metadata activity on a self-hosted integration runtime, the latest capabilities are supported on version 3.6 or later.

### Supported connectors

**File storage**

| Connector/Metadata | itemName<br>(file/folder) | itemType<br>(file/folder) | size<br>(file) | created<br>(file/folder) | lastModified<br>(file/folder) |childItems<br>(folder) |contentMD5<br>(file) | structure<br/>(file) | columnCount<br>(file) | exists<br>(file/folder) |
|:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |
| [Amazon S3](connector-amazon-simple-storage-service.md) | Yes/Yes | Yes/Yes | Yes | No/No | Yes/Yes* | Yes | No | Yes | Yes | Yes/Yes* |
| [Google Cloud Storage](connector-google-cloud-storage.md) | Yes/Yes | Yes/Yes | Yes | No/No | Yes/Yes* | Yes | No | Yes | Yes | Yes/Yes* |
| [Azure Blob storage](connector-azure-blob-storage.md) | Yes/Yes | Yes/Yes | Yes | No/No | Yes/Yes* | Yes | Yes | Yes | Yes | Yes/Yes |
| [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md) | Yes/Yes | Yes/Yes | Yes | No/No | Yes/Yes | Yes | No | Yes | Yes | Yes/Yes |
| [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md) | Yes/Yes | Yes/Yes | Yes | No/No | Yes/Yes | Yes | No | Yes | Yes | Yes/Yes |
| [Azure Files](connector-azure-file-storage.md) | Yes/Yes | Yes/Yes | Yes | Yes/Yes | Yes/Yes | Yes | No | Yes | Yes | Yes/Yes |
| [File system](connector-file-system.md) | Yes/Yes | Yes/Yes | Yes | Yes/Yes | Yes/Yes | Yes | No | Yes | Yes | Yes/Yes |
| [SFTP](connector-sftp.md) | Yes/Yes | Yes/Yes | Yes | No/No | Yes/Yes | Yes | No | Yes | Yes | Yes/Yes |
| [FTP](connector-ftp.md) | Yes/Yes | Yes/Yes | Yes | No/No	| Yes/Yes | Yes | No | Yes | Yes | Yes/Yes |

- For Amazon S3 and Google Cloud Storage, `lastModified` applies to the bucket and the key but not to the virtual folder, and `exists` applies to the bucket and the key but not to the prefix or virtual folder.
- For Azure Blob storage, `lastModified` applies to the container and the blob but not to the virtual folder.

**Relational database**

| Connector/Metadata | structure | columnCount | exists |
|:--- |:--- |:--- |:--- |
| [Azure SQL Database](connector-azure-sql-database.md) | Yes | Yes | Yes |
| [Azure SQL Database managed instance](connector-azure-sql-database-managed-instance.md) | Yes | Yes | Yes |
| [Azure SQL Data Warehouse](connector-azure-sql-data-warehouse.md) | Yes | Yes | Yes |
| [SQL Server](connector-sql-server.md) | Yes | Yes | Yes |

### Metadata options

You can specify the following metadata types in the Get Metadata activity field list to retrieve the corresponding information:

| Metadata type | Description |
|:--- |:--- |
| itemName | Name of the file or folder. |
| itemType | Type of the file or folder. Returned value is `File` or `Folder`. |
| size | Size of the file, in bytes. Applicable only to files. |
| created | Created datetime of the file or folder. |
| lastModified | Last modified datetime of the file or folder. |
| childItems | List of subfolders and files in the given folder. Applicable only to folders. Returned value is a list of the name and type of each child item. |
| contentMD5 | MD5 of the file. Applicable only to files. |
| structure | Data structure inside the file or relational database table. Output value is a list of column name and column type. |
| columnCount | Number of columns inside the file or relational table. |
| exists| Whether a file/folder/table exists or not. Note if "exists" is specified in the GetaMetadata field list, the activity won't fail even when the item (file/folder/table) doesn't exists; instead, it returns `exists: false` in the output. |

>[!TIP]
>When you want to validate if a file/folder/table exists or not, specify `exists` in the GetMetadata activity field list, then you can check the `exists: true/false` result from the activity output. If `exists` is not configured in the field list, the GetMetadata activity will fail when the object is not found.

>[!NOTE]
>When you get metadata from file stores and configure `modifiedDatetimeStart` and/or `modifiedDatetimeEnd`, the `childItems` in output only returns files under the given path with last modified time between the range, but no sub-folders.

## Syntax

**GetMetadata activity:**

```json
{
	"name": "MyActivity",
	"type": "GetMetadata",
	"typeProperties": {
		"fieldList" : ["size", "lastModified", "structure"],
		"dataset": {
			"referenceName": "MyDataset",
			"type": "DatasetReference"
		}
	}
}
```

**Dataset:**

```json
{
	"name": "MyDataset",
	"properties": {
	"type": "AzureBlob",
		"linkedService": {
			"referenceName": "StorageLinkedService",
			"type": "LinkedServiceReference"
		},
		"typeProperties": {
			"folderPath":"container/folder",
			"filename": "file.json",
			"format":{
				"type":"JsonFormat"
			}
		}
	}
}
```

## Type properties

Currently GetMetadata activity can fetch the following types of metadata information.

Property | Description | Required
-------- | ----------- | --------
fieldList | Lists the types of metadata information required. See details in [Metadata options](#metadata-options) section on supported metadata. | Yes 
dataset | The reference dataset whose metadata activity is to be retrieved by the GetMetadata Activity. See [Supported capabilities](#supported-capabilities) section on supported connectors, and refer to connector topic on dataset syntax details. | Yes
formatSettings | Apply when using format type dataset. | No
storeSettings | Apply when using format type dataset. | No

## Sample output

The GetMetadata result is shown in activity output. Below are two samples with exhaustive metadata options selected in field list as reference. To use the result in subsequent activity, use the pattern of `@{activity('MyGetMetadataActivity').output.itemName}`.

### Get a file's metadata

```json
{
  "exists": true,
  "itemName": "test.csv",
  "itemType": "File",
  "size": 104857600,
  "lastModified": "2017-02-23T06:17:09Z",
  "created": "2017-02-23T06:17:09Z",
  "contentMD5": "cMauY+Kz5zDm3eWa9VpoyQ==",
  "structure": [
    {
        "name": "id",
        "type": "Int64"
    },
    {
        "name": "name",
        "type": "String"
    }
  ],
  "columnCount": 2
}
```

### Get a folder's metadata

```json
{
  "exists": true,
  "itemName": "testFolder",
  "itemType": "Folder",
  "lastModified": "2017-02-23T06:17:09Z",
  "created": "2017-02-23T06:17:09Z",
  "childItems": [
    {
      "name": "test.avro",
      "type": "File"
    },
    {
      "name": "folder hello",
      "type": "Folder"
    }
  ]
}
```

## Next steps
See other control flow activities supported by Data Factory: 

- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)
