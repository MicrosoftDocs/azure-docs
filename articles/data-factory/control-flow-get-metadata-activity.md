---
title: Get Metadata activity in Azure Data Factory 
description: Learn how to use the Get Metadata activity in a Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: shwang
ms.reviewer: 

ms.assetid: 1c46ed69-4049-44ec-9b46-e90e964a4a8e
ms.service: data-factory
ms.workload: data-services


ms.topic: conceptual
ms.date: 04/15/2020
ms.author: jingwang

---
# Get Metadata activity in Azure Data Factory
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

You can use the Get Metadata activity to retrieve the metadata of any data in Azure Data Factory. You can use this activity in the following scenarios:

- Validate the metadata of any data.
- Trigger a pipeline when data is ready/available.

The following functionality is available in the control flow:

- You can use the output from the Get Metadata activity in conditional expressions to perform validation.
- You can trigger a pipeline when a condition is satisfied via Do Until looping.

## Capabilities

The Get Metadata activity takes a dataset as an input and returns metadata information as output. Currently, the following connectors and corresponding retrievable metadata are supported. The maximum size of returned metadata is 2 MB.

>[!NOTE]
>If you run the Get Metadata activity on a self-hosted integration runtime, the latest capabilities are supported on version 3.6 or later.

### Supported connectors

**File storage**

| Connector/Metadata | itemName<br>(file/folder) | itemType<br>(file/folder) | size<br>(file) | created<br>(file/folder) | lastModified<br>(file/folder) |childItems<br>(folder) |contentMD5<br>(file) | structure<br/>(file) | columnCount<br>(file) | exists<br>(file/folder) |
|:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |
| [Amazon S3](connector-amazon-simple-storage-service.md) | √/√ | √/√ | √ | x/x | √/√* | √ | x | √ | √ | √/√* |
| [Google Cloud Storage](connector-google-cloud-storage.md) | √/√ | √/√ | √ | x/x | √/√* | √ | x | √ | √ | √/√* |
| [Azure Blob storage](connector-azure-blob-storage.md) | √/√ | √/√ | √ | x/x | √/√* | √ | √ | √ | √ | √/√ |
| [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md) | √/√ | √/√ | √ | x/x | √/√ | √ | x | √ | √ | √/√ |
| [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md) | √/√ | √/√ | √ | x/x | √/√ | √ | x | √ | √ | √/√ |
| [Azure Files](connector-azure-file-storage.md) | √/√ | √/√ | √ | √/√ | √/√ | √ | x | √ | √ | √/√ |
| [File system](connector-file-system.md) | √/√ | √/√ | √ | √/√ | √/√ | √ | x | √ | √ | √/√ |
| [SFTP](connector-sftp.md) | √/√ | √/√ | √ | x/x | √/√ | √ | x | √ | √ | √/√ |
| [FTP](connector-ftp.md) | √/√ | √/√ | √ | x/x	| x/x | √ | x | √ | √ | √/√ |

- When using Get Metadata activity against a folder, make sure you have LIST/EXECUTE permission to the given folder.
- For Amazon S3 and Google Cloud Storage, `lastModified` applies to the bucket and the key but not to the virtual folder, and `exists` applies to the bucket and the key but not to the prefix or virtual folder.
- For Azure Blob storage, `lastModified` applies to the container and the blob but not to the virtual folder.
- `lastModified` filter currently applies to filter child items but not the specified folder/file itself.
- Wildcard filter on folders/files is not supported for Get Metadata activity.

**Relational database**

| Connector/Metadata | structure | columnCount | exists |
|:--- |:--- |:--- |:--- |
| [Azure SQL Database](connector-azure-sql-database.md) | √ | √ | √ |
| [Azure SQL Managed Instance](../azure-sql/managed-instance/sql-managed-instance-paas-overview.md) | √ | √ | √ |
| [Azure SQL Data Warehouse](connector-azure-sql-data-warehouse.md) | √ | √ | √ |
| [SQL Server](connector-sql-server.md) | √ | √ | √ |

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
| structure | Data structure of the file or relational database table. Returned value is a list of column names and column types. |
| columnCount | Number of columns in the file or relational table. |
| exists| Whether a file, folder, or table exists. Note that if `exists` is specified in the Get Metadata field list, the activity won't fail even if the file, folder, or table doesn't exist. Instead, `exists: false` is returned in the output. |

>[!TIP]
>When you want to validate that a file, folder, or table exists, specify `exists` in the Get Metadata activity field list. You can then check the `exists: true/false` result in the activity output. If `exists` isn't specified in the field list, the Get Metadata activity will fail if the object isn't found.

>[!NOTE]
>When you get metadata from file stores and configure `modifiedDatetimeStart` or `modifiedDatetimeEnd`, the `childItems` in output will include only files in the given path that have a last modified time within the specified range. In won’t include items in subfolders.

## Syntax

**Get Metadata activity**

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

**Dataset**

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

Currently, the Get Metadata activity can return the following types of metadata information:

Property | Description | Required
-------- | ----------- | --------
fieldList | The types of metadata information required. For details on supported metadata, see the [Metadata options](#metadata-options) section of this article. | Yes 
dataset | The reference dataset whose metadata is to be retrieved by the Get Metadata activity. See the [Capabilities](#capabilities) section for information on supported connectors. Refer to the specific connector topics for dataset syntax details. | Yes
formatSettings | Apply when using format type dataset. | No
storeSettings | Apply when using format type dataset. | No

## Sample output

The Get Metadata results are shown in the activity output. Following are two samples showing extensive metadata options. To use the results in a subsequent activity, use this pattern: `@{activity('MyGetMetadataActivity').output.itemName}`.

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
Learn about other control flow activities supported by Data Factory:

- [Execute Pipeline activity](control-flow-execute-pipeline-activity.md)
- [ForEach activity](control-flow-for-each-activity.md)
- [Lookup activity](control-flow-lookup-activity.md)
- [Web activity](control-flow-web-activity.md)
