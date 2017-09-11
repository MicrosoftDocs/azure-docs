---
title: Copy data to/from Azure Blob Storage using Data Factory | Microsoft Docs
description: 'Learn how to copy data from supported source data stores to Azure Blob Storage (or) from Blob Storage to supported sink data stores using Data Factory.'
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.topic: article
ms.date: 08/30/2017
ms.author: jingwang

---
# Copy data to or from Azure Blob Storage by using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-azure-blob-storage-connector.md)
> * [Version 2 - Preview](connector-azure-blob-storage.md)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data to and from Azure Blob Storage. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Azure Blog Storage connnector in V1](v1/data-factory-azure-blob-storage-connector.md).


## Supported scenarios

You can copy data from any supported source data store to Azure Blob Storage, or copy data from Azure Blob Storage to any supported sink data store. For a list of data stores that are supported as sources/ or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md) table.

Specifically, this Azure Blob connector supports:

- Copying blobs to/from both general-purpose Azure Storage accounts and Hot/Cool Blob storage. 
- Copying blobs using both **account key** and **Service SAS** (Shared Access Signature) authentications.
- Copying blobs **from block, append, or page blobs**, and copying data **to only block blobs**. Azure Premium Storage is not supported as a sink because it is backed by page blobs.
- Copying blobs as-is, or parsing/generating blobs with the [supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md).

## Get started
You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity. 

The following sections provide details about properties that are used to define Data Factory entities specific to Azure Blob Storage.

## Linked service properties

### Using account key

You can create an Azure Storage linked service by using the account key, which provides the data factory with global access to the Azure Storage. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzureStorage** |Yes |
| connectionString | Specify information needed to connect to Azure storage for the connectionString property. Mark this field as a SecureString. |Yes |

**Example:**

```json
{
    "name": "AzureStorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": {
                "type": "SecureString",
                "value": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
        }
    }
}
```

### Using Service SAS authentication

You can also create an Azure Storage linked service by using a Shared Access Signature (SAS), which provides the data factory with restricted/time-bound access to all/specific resources (blob/container) in the storage.

A Shared Access Signature (SAS) provides delegated access to resources in your storage account. Using SAS, you can grant a client limited permissions to objects in your storage account for a specified period of time, without having to share your account access keys. The SAS is a URI that encompasses in its query parameters all the information necessary for authenticated access to a storage resource. To access storage resources with the SAS, the client only needs to pass in the SAS to the appropriate constructor or method. For detailed information about SAS, see [Shared Access Signatures: Understanding the SAS Model](../storage/common/storage-dotnet-shared-access-signature-part-1.md).

> [!IMPORTANT]
> Azure Data Factory now only supports **Service SAS** but not Account SAS. See [Types of Shared Access Signatures](../storage/common/storage-dotnet-shared-access-signature-part-1.md#types-of-shared-access-signatures) for details about these two types and how to construct. The SAS URL generated from Azure portal or Storage Explorer is an Account SAS, which is not supported.
>

To use Service SAS authentication, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzureStorage** |Yes |
| sasUri | Specify Shared Access Signature URI to the Azure Storage resources such as blob, container, or table. Mark this field as a SecureString. |Yes |

**Example:**

```json
{
    "name": "AzureStorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "sasUri": {
                "type": "SecureString",
                "value": "<SAS URI of the Azure Storage resource>"
            }
        }
    }
}
```

When creating an **SAS URI**, considering the following points:

- Set appropriate read/write **permissions** on objects based on how the linked service (read, write, read/write) is used in your data factory.
- Set **Expiry time** appropriately. Make sure that the access to Azure Storage objects does not expire within the active period of the pipeline.
- Uri should be created at the right container/blob or Table level based on the need. A SAS Uri to an Azure blob allows the Data Factory service to access that particular blob. A SAS Uri to an Azure blob container allows the Data Factory service to iterate through blobs in that container. If you need to provide access more/fewer objects later, or update the SAS URI, remember to update the linked service with the new URI.

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Azure Blob dataset.

To copy data to/from Azure Blob, set the type property of the dataset to **AzureBlob**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **AzureBlob** |Yes |
| folderPath | Path to the container and folder in the blob storage. Example: myblobcontainer/myblobfolder/ |Yes |
| fileName | Specify the name of the blob in the **folderPath** if you want to copy to/from a specific blob. If you do not specify any value for this property, the dataset points to all blobs in the folder.<br/><br/>When fileName is not specified for an output dataset and **preserveHierarchy** is not specified in activity sink, copy activity automatically generates the blob name with the following format: `Data.[activity run id GUID].[GUID if FlattenHierarchy].[format if configured].[compression if configured]`. For example: `Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt.gz`. |No |
| format | If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions.<br/><br/>If you want to parse or generate files with a specific format, the following file format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](supported-file-formats-and-compression-codecs.md#text-format), [Json Format](supported-file-formats-and-compression-codecs.md#json-format), [Avro Format](supported-file-formats-and-compression-codecs.md#avro-format), [Orc Format](supported-file-formats-and-compression-codecs.md#orc-format), and [Parquet Format](supported-file-formats-and-compression-codecs.md#parquet-format) sections. |No (only for binary copy scenario) |
| compression | Specify the type and level of compression for the data. For more information, see [Supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md#compression-support).<br/>Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**.<br/>Supported levels are: **Optimal** and **Fastest**. |No |

**Example:**

```json
{
    "name": "AzureBlobDataset",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": {
            "referenceName": "<Azure Storage linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "folderPath": "mycontainer/myfolder",
            "fileName": "myfile.csv.gz",
            "format": {
                "type": "TextFormat",
                "columnDelimiter": ",",
                "rowDelimiter": "\n"
            },
            "compression": {
                "type": "GZip",
                "level": "Optimal"
            }
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Azure Blob source and sink.

### Azure Blob as source

To copy data from Azure Blob, set the source type in the copy activity to **BlobSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **BlobSource** |Yes |
| recursive | Indicates whether the data is read recursively from the sub folders or only from the specified folder.<br/>Allowed values are: **true** (default), **false** | No |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromBlob",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Azure Blob input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "BlobSource",
                "recursive": true
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

### Azure Blob as sink

To copy data to Azure Blob, set the sink type in the copy activity to **BlobSink**. The following properties are supported in the **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to: **BlobSink** |Yes |
| copyBehavior | Defines the copy behavior when the source is files from file-based data store.<br/><br/>Allowed values are:<br/><b>- PreserveHierarchy (default)</b>: preserves the file hierarchy in the target folder. The relative path of source file to source folder is identical to the relative path of target file to target folder.<br/><b>- FlattenHierarchy</b>: all files from the source folder are in the first level of target folder. The target files have auto generated name. <br/><b>- MergeFiles</b>: merges all files from the source folder to one file. If the File/Blob Name is specified, the merged file name would be the specified name; otherwise, would be auto-generated file name. | No |

**Example:**

```json
"activities":[
    {
        "name": "CopyToBlob",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Azure Blob output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "BlobSink",
                "copyBehavior": "PreserveHierarchy"
            }
        }
    }
]
```

### recursive and copyBehavior examples

This section describes the resulting behavior of the Copy operation for different combinations of recursive and copyBehavior values.

| recursive | copyBehavior | Source folder structure | Resulting target |
|:--- |:--- |:--- |:--- |
| true |preserveHierarchy | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target folder Folder1 is created with the same structure as the source:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5. |
| true |flattenHierarchy | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File5 |
| true |mergeFiles | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 + File3 + File4 + File 5 contents are merged into one file with auto-generated file name |
| false |preserveHierarchy | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target folder Folder1 is created with the following structure<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/><br/>Subfolder1 with File3, File4, and File5 are not picked up. |
| false |flattenHierarchy | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target folder Folder1 is created with the following structure<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File2<br/><br/>Subfolder1 with File3, File4, and File5 are not picked up. |
| false |mergeFiles | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target folder Folder1 is created with the following structure<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 contents are merged into one file with auto-generated file name. auto-generated name for File1<br/><br/>Subfolder1 with File3, File4, and File5 are not picked up. |

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).