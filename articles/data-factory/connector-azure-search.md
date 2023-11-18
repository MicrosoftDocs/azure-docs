---
title: Copy data to Search index
description: Learn about how to push or copy data to an Azure search index using the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/13/2023
---

# Copy data to an Azure Cognitive Search index using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data into Azure Cognitive Search index. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

This Azure Cognitive Search connector is supported for the following capabilities:

| Supported capabilities|IR | Managed private endpoint|
|---------| --------| --------|
|[Copy activity](copy-activity-overview.md) (-/sink)|&#9312; &#9313;|✓ |

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

You can copy data from any supported source data store into search index. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Azure Search using UI

Use the following steps to create a linked service to Azure Search in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for Search and select the Azure Search connector.

   :::image type="content" source="media/connector-azure-search/azure-search-connector.png" alt-text="Select the Azure Search connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-azure-search/configure-azure-search-linked-service.png" alt-text="Configure a linked service to Azure Search.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Azure Cognitive Search connector.

## Linked service properties

The following properties are supported for Azure Cognitive Search linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzureSearch** | Yes |
| url | URL for the search service. | Yes |
| key | Admin key for the search service. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Azure Integration Runtime or Self-hosted Integration Runtime (if your data store is located in private network). If not specified, it uses the default Azure Integration Runtime. |No |

> [!IMPORTANT]
> When copying data from a cloud data store into search index, in Azure Cognitive Search linked service, you need to refer an Azure Integration Runtime with explicit region in connactVia. Set the region as the one where your search service resides. Learn more from [Azure Integration Runtime](concepts-integration-runtime.md#azure-integration-runtime).

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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Azure Cognitive Search dataset.

To copy data into Azure Cognitive Search, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **AzureSearchIndex** | Yes |
| indexName | Name of the search index. The service does not create the index. The index must exist in Azure Cognitive Search. | Yes |

**Example:**

```json
{
    "name": "AzureSearchIndexDataset",
    "properties": {
        "type": "AzureSearchIndex",
        "typeProperties" : {
            "indexName": "products"
        },
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Azure Cognitive Search linked service name>",
            "type": "LinkedServiceReference"
        }
   }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Azure Cognitive Search source.

### Azure Cognitive Search as sink

To copy data into Azure Cognitive Search, set the source type in the copy activity to **AzureSearchIndexSink**. The following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **AzureSearchIndexSink** | Yes |
| writeBehavior | Specifies whether to merge or replace when a document already exists in the index. See the [WriteBehavior property](#writebehavior-property).<br/><br/>Allowed values are: **Merge** (default), and **Upload**. | No |
| writeBatchSize | Uploads data into the search index when the buffer size reaches writeBatchSize. See the [WriteBatchSize property](#writebatchsize-property) for details.<br/><br/>Allowed values are: integer 1 to 1,000; default is 1000. | No |
| maxConcurrentConnections |The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No |

### WriteBehavior property

AzureSearchSink upserts when writing data. In other words, when writing a document, if the document key already exists in the search index, Azure Cognitive Search updates the existing document rather than throwing a conflict exception.

The AzureSearchSink provides the following two upsert behaviors (by using AzureSearch SDK):

- **Merge**: combine all the columns in the new document with the existing one. For columns with null value in the new document, the value in the existing one is preserved.
- **Upload**: The new document replaces the existing one. For columns not specified in the new document, the value is set to null whether there is a non-null value in the existing document or not.

The default behavior is **Merge**.

### WriteBatchSize Property

Azure Cognitive Search service supports writing documents as a batch. A batch can contain 1 to 1,000 Actions. An action handles one document to perform the upload/merge operation.

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
                "referenceName": "<Azure Cognitive Search output dataset name>",
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

## Data type support

The following table specifies whether an Azure Cognitive Search data type is supported or not.

| Azure Cognitive Search data type | Supported in Azure Cognitive Search Sink |
| ---------------------- | ------------------------------ |
| String | Y |
| Int32 | Y |
| Int64 | Y |
| Double | Y |
| Boolean | Y |
| DataTimeOffset | Y |
| String Array | N |
| GeographyPoint | N |

Currently other data types e.g. ComplexType are not supported. For a full list of Azure Cognitive Search supported data types, see [Supported data types (Azure Cognitive Search)](/rest/api/searchservice/supported-data-types).

## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).