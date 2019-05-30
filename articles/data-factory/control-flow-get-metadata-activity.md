---
title: Get metadata activity in Azure Data Factory | Microsoft Docs
description: Learn how you can use the GetMetadata Activity in a Data Factory pipeline.
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
ms.date: 03/11/2019
ms.author: jingwang

---
# Get metadata activity in Azure Data Factory

GetMetadata activity can be used to retrieve **metadata** of any data in Azure Data Factory. This activity can be used in the following scenarios:

- Validate the metadata information of any data
- Trigger a pipeline when data is ready/ available

The following functionality is available in the control flow:

- The output from GetMetadata Activity can be used in conditional expressions to perform validation.
- A pipeline can be triggered when condition is satisfied via Do-Until looping

## Supported capabilities

The GetMetadata Activity takes a dataset as a required input, and outputs metadata information available as activity output. Currently, the following connectors with corresponding retrievable metadata are supported, and the maximum supported metadata size is up to **1MB**.

>[!NOTE]
>If you run GetMetadata activity on a Self-hosted Integration Runtime, the latest capability is supported on version 3.6 or above. 

### Supported connectors

**File storage:**

| Connector/Metadata | itemName<br>(file/folder) | itemType<br>(file/folder) | size<br>(file) | created<br>(file/folder) | lastModified<br>(file/folder) |childItems<br>(folder) |contentMD5<br>(file) | structure<br/>(file) | columnCount<br>(file) | exists<br>(file/folder) |
|:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |
| Amazon S3 | √/√ | √/√ | √ | x/x | √/√* | √ | x | √ | √ | √/√* |
| Google Cloud Storage | √/√ | √/√ | √ | x/x | √/√* | √ | x | √ | √ | √/√* |
| Azure Blob | √/√ | √/√ | √ | x/x | √/√* | √ | √ | √ | √ | √/√ |
| Azure Data Lake Storage Gen1 | √/√ | √/√ | √ | x/x | √/√ | √ | x | √ | √ | √/√ |
| Azure Data Lake Storage Gen2 | √/√ | √/√ | √ | x/x | √/√ | √ | x | √ | √ | √/√ |
| Azure File Storage | √/√ | √/√ | √ | √/√ | √/√ | √ | x | √ | √ | √/√ |
| File System | √/√ | √/√ | √ | √/√ | √/√ | √ | x | √ | √ | √/√ |
| SFTP | √/√ | √/√ | √ | x/x | √/√ | √ | x | √ | √ | √/√ |
| FTP | √/√ | √/√ | √ | x/x	| √/√ | √ | x | √ | √ | √/√ |

- For Amazon S3 and Google Sloud Storage, the `lastModified` applies to bucket and key but not virtual folder; ; and the `exists` applies to bucket and key but not prefix or virtual folder.
- For Azure Blob, the `lastModified` applies to container and blob but not virtual folder.

**Relational database:**

| Connector/Metadata | structure | columnCount | exists |
|:--- |:--- |:--- |:--- |
| Azure SQL Database | √ | √ | √ |
| Azure SQL Database Managed Instance | √ | √ | √ |
| Azure SQL Data Warehouse | √ | √ | √ |
| SQL Server | √ | √ | √ |

### Metadata options

The following metadata types can be specified in the GetMetadata activity field list to retrieve:

| Metadata type | Description |
|:--- |:--- |
| itemName | Name of the file or folder. |
| itemType | Type of the file or folder. Output value is `File` or `Folder`. |
| size | Size of the file in byte. Applicable to file only. |
| created | Created datetime of the file or folder. |
| lastModified | Last modified datetime of the file or folder. |
| childItems | List of sub-folders and files inside the given folder. Applicable to folder only. Output value is a list of name and type of each child item. |
| contentMD5 | MD5 of the file. Applicable to file only. |
| structure | Data structure inside the file or relational database table. Output value is a list of column name and column type. |
| columnCount | Number of columns inside the file or relational table. |
| exists| Whether a file/folder/table exists or not. Note if "exists" is specified in the GetaMetadata field list, the activity won't fail even when the item (file/folder/table) doesn't exists; instead, it returns `exists: false` in the output. |

>[!TIP]
>When you want to validate if a file/folder/table exists or not, specify `exists` in the GetMetadata activity field list, then you can check the `exists: true/false` result from the activity output. If `exists` is not configured in the field list, the GetMetadata activity will fail when the object is not found.

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
