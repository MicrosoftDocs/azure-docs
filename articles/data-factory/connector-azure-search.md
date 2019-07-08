---
title: Copy data to Search index by using Azure Data Factory | Microsoft Docs
description: 'Learn about how to push or copy data to an Azure search index by using the Copy Activity in an Azure Data Factory pipeline.'
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 05/24/2018
ms.author: jingwang
---

# Copy data to an Azure Search index using Azure Data Factory

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-azure-search-connector.md)
> * [Current version](connector-azure-search.md)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data into Azure Search index. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

You can copy data from any supported source data store into Azure Search index. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to Azure Search connector.

## Linked service properties

The following properties are supported for Azure Search linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzureSearch** | Yes |
| url | URL for the Azure Search service. | Yes |
| key | Admin key for the Azure Search service. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Azure Integration Runtime or Self-hosted Integration Runtime (if your data store is located in private network). If not specified, it uses the default Azure Integration Runtime. |No |

> [!IMPORTANT]
> When copying data from a cloud data store into Azure Search index, in Azure Search linked service, you need to refer an Azure Integration Runtime with explicit region in connactVia. Set the region as the one your Azure Search resides. Learn more from [Azure Integration Runtime](concepts-integration-runtime.md#azure-integration-runtime).

**Example:**

```json
{
    "name": "AzureSearchLinkedService",
    "properties": {
        "type": "AzureSearch",
        "typeProperties": {
            "url": "https://<service>.search.windows.net",
            "key": {
                "type": "SecureString",
                "value": "<AdminKey>"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the datasets article. This section provides a list of properties supported by Azure Search dataset.

To copy data into Azure Search, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **AzureSearchIndex** | Yes |
| indexName | Name of the Azure Search index. Data Factory does not create the index. The index must exist in Azure Search. | Yes |

**Example:**

```json
{
    "name": "AzureSearchIndexDataset",
    "properties": {
        "type": "AzureSearchIndex",
        "linkedServiceName": {
            "referenceName": "<Azure Search linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties" : {
            "indexName": "products"
        }
   }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Azure Search source.

### Azure Search as sink

To copy data into Azure Search, set the source type in the copy activity to **AzureSearchIndexSink**. The following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **AzureSearchIndexSink** | Yes |
| writeBehavior | Specifies whether to merge or replace when a document already exists in the index. See the [WriteBehavior property](#writebehavior-property).<br/><br/>Allowed values are: **Merge** (default), and **Upload**. | No |
| writeBatchSize | Uploads data into the Azure Search index when the buffer size reaches writeBatchSize. See the [WriteBatchSize property](#writebatchsize-property) for details.<br/><br/>Allowed values are: integer 1 to 1,000; default is 1000. | No |

### WriteBehavior property

AzureSearchSink upserts when writing data. In other words, when writing a document, if the document key already exists in the Azure Search index, Azure Search updates the existing document rather than throwing a conflict exception.

The AzureSearchSink provides the following two upsert behaviors (by using AzureSearch SDK):

- **Merge**: combine all the columns in the new document with the existing one. For columns with null value in the new document, the value in the existing one is preserved.
- **Upload**: The new document replaces the existing one. For columns not specified in the new document, the value is set to null whether there is a non-null value in the existing document or not.

The default behavior is **Merge**.

### WriteBatchSize Property

Azure Search service supports writing documents as a batch. A batch can contain 1 to 1,000 Actions. An action handles one document to perform the upload/merge operation.

**Example:**

```json
"activities":[
    {
        "name": "CopyToAzureSearch",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Azure Search output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "AzureSearchIndexSink",
                "writeBehavior": "Merge"
            }
        }
    }
]
```

### Data type support

The following table specifies whether an Azure Search data type is supported or not.

| Azure Search data type | Supported in Azure Search Sink |
| ---------------------- | ------------------------------ |
| String | Y |
| Int32 | Y |
| Int64 | Y |
| Double | Y |
| Boolean | Y |
| DataTimeOffset | Y |
| String Array | N |
| GeographyPoint | N |

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).
