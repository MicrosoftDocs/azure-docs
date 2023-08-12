---
title: Get Metadata activity
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to use the Get Metadata activity in an Azure Data Factory or Azure Synapse Analytics pipeline.
author: jianleishen
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 08/10/2023
ms.author: jianleishen
---

# Get Metadata activity in Azure Data Factory or Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

You can use the Get Metadata activity to retrieve the metadata of any data in Azure Data Factory or a Synapse pipeline. You can use the output from the Get Metadata activity in conditional expressions to perform validation, or consume the metadata in subsequent activities.

## Create a Get Metadata activity with UI

To use a Get Metadata activity in a pipeline, complete the following steps:

1. Search for _Get Metadata_ in the pipeline Activities pane, and drag a Fail activity to the pipeline canvas.
1. Select the new Get Metadata activity on the canvas if it is not already selected, and its  **Settings** tab, to edit its details.
1. Choose a dataset, or create a new one with the New button.  Then you can specify filter options and add columns from the available metadata for the dataset.

   :::image type="content" source="media/control-flow-get-metadata-activity/get-metadata-activity.png" alt-text="Shows the UI for a Get Metadata activity.":::

1. Use the output of the activity as an input to another activity, like a Switch activity in this example.  You can reference the output of the Metadata Activity anywhere dynamic content is supported in the other activity.

   :::image type="content" source="media/control-flow-get-metadata-activity/using-metadata-in-another-activity.png" alt-text="Shows the pipeline with a Switch activity added to handle the output of the Get Metadata activity.":::

1. In the dynamic content editor, select the Get Metadata activity output to reference it in the other activity.

   :::image type="content" source="media/control-flow-get-metadata-activity/dynamic-content-editor-using-metadata.png" alt-text="Shows the dynamic content editor with the output of the Get Metadata activity as the dynamic content.":::

## Supported capabilities

The Get Metadata activity takes a dataset as an input and returns metadata information as output. Currently, the following connectors and the corresponding retrievable metadata are supported. The maximum size of returned metadata is **4 MB**.

### Supported connectors

**File storage**

| Connector/Metadata | itemName<br>(file/folder) | itemType<br>(file/folder) | size<br>(file) | created<br>(file/folder) | lastModified<sup>1</sup><br>(file/folder) |childItems<br>(folder) |contentMD5<br>(file) | structure<sup>2</sup><br/>(file) | columnCount<sup>2</sup><br>(file) | exists<sup>3</sup><br>(file/folder) |
|:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |:--- |
| [Amazon S3](connector-amazon-simple-storage-service.md) | √/√ | √/√ | √ | x/x | √/√ | √ | x | √ | √ | √/√ |
| [Amazon S3 Compatible Storage](connector-amazon-s3-compatible-storage.md) | √/√ | √/√ | √ | x/x | √/√ | √ | x | √ | √ | √/√ |
| [Google Cloud Storage](connector-google-cloud-storage.md) | √/√ | √/√ | √ | x/x | √/√ | √ | x | √ | √ | √/√ |
| [Oracle Cloud Storage](connector-oracle-cloud-storage.md) | √/√ | √/√ | √ | x/x | √/√ | √ | x | √ | √ | √/√ |
| [Azure Blob storage](connector-azure-blob-storage.md) | √/√ | √/√ | √ | x/x | √/√ | √ | √ | √ | √ | √/√ |
| [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md) | √/√ | √/√ | √ | x/x | √/√ | √ | x | √ | √ | √/√ |
| [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md) | √/√ | √/√ | √ | x/x | √/√ | √ | √ | √ | √ | √/√ |
| [Azure Files](connector-azure-file-storage.md) | √/√ | √/√ | √ | √/√ | √/√ | √ | x | √ | √ | √/√ |
| [File system](connector-file-system.md) | √/√ | √/√ | √ | √/√ | √/√ | √ | x | √ | √ | √/√ |
| [SFTP](connector-sftp.md) | √/√ | √/√ | √ | x/x | √/√ | √ | x | √ | √ | √/√ |
| [FTP](connector-ftp.md) | √/√ | √/√ | √ | x/x	| x/x | √ | x | √ | √ | √/√ |

<sup>1</sup> Metadata `lastModified`:
- For Amazon S3, Amazon S3 Compatible Storage, Google Cloud Storage and Oracle Cloud Storage, `lastModified` applies to the bucket and the key but not to the virtual folder, and `exists` applies to the bucket and the key but not to the prefix or virtual folder. 
- For Azure Blob storage, `lastModified` applies to the container and the blob but not to the virtual folder.

<sup>2</sup> Metadata `structure` and `columnCount` are not supported when getting metadata from Binary, JSON, or XML files.

<sup>3</sup> Metadata `exists`: For Amazon S3, Amazon S3 Compatible Storage, Google Cloud Storage and Oracle Cloud Storage, `exists` applies to the bucket and the key but not to the prefix or virtual folder.

Note the following:

- When using Get Metadata activity against a folder, make sure you have LIST/EXECUTE permission to the given folder.
- Wildcard filter on folders/files is not supported for Get Metadata activity.
- `modifiedDatetimeStart` and `modifiedDatetimeEnd` filter set on connector:

    - These two properties are used to filter the child items when getting metadata from a folder. It does not apply when getting metadata from a file.
    - When such filter is used, the `childItems` in output includes only the files that are modified within the specified range but not folders.
    - To apply such filter, GetMetadata activity will enumerate all the files in the specified folder and check the modified time. Avoid pointing to a folder with a large number of files even if the expected qualified file count is small. 

**Relational database**

| Connector/Metadata | structure | columnCount | exists |
|:--- |:--- |:--- |:--- |
| [Amazon RDS for SQL Server](connector-amazon-rds-for-sql-server.md) | √ | √ | √ |
| [Azure SQL Database](connector-azure-sql-database.md) | √ | √ | √ |
| [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview) | √ | √ | √ |
| [Azure Synapse Analytics](connector-azure-sql-data-warehouse.md) | √ | √ | √ |
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
| exists| Whether a file, folder, or table exists. If `exists` is specified in the Get Metadata field list, the activity won't fail even if the file, folder, or table doesn't exist. Instead, `exists: false` is returned in the output. |

> [!TIP]
> When you want to validate that a file, folder, or table exists, specify `exists` in the Get Metadata activity field list. You can then check the `exists: true/false` result in the activity output. If `exists` isn't specified in the field list, the Get Metadata activity will fail if the object isn't found.

> [!NOTE]
> When you get metadata from file stores and configure `modifiedDatetimeStart` or `modifiedDatetimeEnd`, the `childItems` in the output includes only files in the specified path that have a last modified time within the specified range. Items in subfolders are not included.

> [!NOTE]
> For the **Structure** field list to provide the actual data structure for delimited text and Excel format datasets, you must enable the `First Row as Header` property, which is supported only for these data sources.

## Syntax

**Get Metadata activity**

```json
{
    "name":"MyActivity",
    "type":"GetMetadata",
    "dependsOn":[

    ],
    "policy":{
        "timeout":"7.00:00:00",
        "retry":0,
        "retryIntervalInSeconds":30,
        "secureOutput":false,
        "secureInput":false
    },
    "userProperties":[

    ],
    "typeProperties":{
        "dataset":{
            "referenceName":"MyDataset",
            "type":"DatasetReference"
        },
        "fieldList":[
            "size",
            "lastModified",
            "structure"
        ],
        "storeSettings":{
            "type":"AzureBlobStorageReadSettings"
        },
        "formatSettings":{
            "type":"JsonReadSettings"
        }
    }
}
```

**Dataset**

```json
{
    "name":"MyDataset",
    "properties":{
        "linkedServiceName":{
            "referenceName":"AzureStorageLinkedService",
            "type":"LinkedServiceReference"
        },
        "annotations":[

        ],
        "type":"Json",
        "typeProperties":{
            "location":{
                "type":"AzureBlobStorageLocation",
                "fileName":"file.json",
                "folderPath":"folder",
                "container":"container"
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
dataset | The reference dataset whose metadata is to be retrieved by the Get Metadata activity. See the [Capabilities](#supported-capabilities) section for information on supported connectors. Refer to the specific connector topics for dataset syntax details. | Yes
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
Learn about other supported control flow activities:

- [Execute Pipeline activity](control-flow-execute-pipeline-activity.md)
- [ForEach activity](control-flow-for-each-activity.md)
- [Lookup activity](control-flow-lookup-activity.md)
- [Web activity](control-flow-web-activity.md)
