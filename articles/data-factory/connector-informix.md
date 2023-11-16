---
title: Copy data from and to IBM Informix
description: Learn how to copy data from and to IBM Informix using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/20/2023
ms.author: jianleishen
---

# Copy data from and to IBM Informix using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from an IBM Informix data store. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

This Informix connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.


## Prerequisites

To use this Informix connector, you need to:

- Set up a Self-hosted Integration Runtime. See [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md) article for details.
- Download the 64-bit Client SDK for Informix to create an ODBC connection for the data store on the Integration Runtime machine. For SDK download and setup, refer this [article](https://www.ibm.com/support/pages/informix-client-software-development-kit-client-sdk-and-informix-connect-system-requirements) for details, or contact IBM support team for driver installation guidance.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Informix using UI

Use the following steps to create a linked service to Informix in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Informix and select the Informix connector.

   :::image type="content" source="media/connector-informix/informix-connector.png" alt-text="Screenshot of the Informix connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-informix/configure-informix-linked-service.png" alt-text="Screenshot of linked service configuration for Informix.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Informix connector.

## Linked service properties

The following properties are supported for Informix linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Informix** | Yes |
| connectionString | The ODBC connection string excluding the credential portion. You can specify the connection string or use the system DSN (Data Source Name) you set up on the Integration Runtime machine (you need still specify the credential portion in linked service accordingly). <br> You can also put a password in Azure Key Vault and pull the `password` configuration out of the connection string. Refer to [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) with more details.| Yes |
| authenticationType | Type of authentication used to connect to the Informix data store.<br/>Allowed values are: **Basic** and **Anonymous**. | Yes |
| userName | Specify user name if you are using Basic authentication. | No |
| password | Specify password for the user account you specified for the userName. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| credential | The access credential portion of the connection string specified in driver-specific property-value format. Mark this field as a SecureString. | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. A Self-hosted Integration Runtime is required as mentioned in [Prerequisites](#prerequisites). |Yes |

**Example:**

```json
{
    "name": "InformixLinkedService",
    "properties": {
        "type": "Informix",
        "typeProperties": {
            "connectionString": "<Informix connection string or DSN>",
            "authenticationType": "Basic",
            "userName": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Informix dataset.

To copy data from Informix, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **InformixTable** | Yes |
| tableName | Name of the table in the Informix. | No for source (if "query" in activity source is specified);<br/>Yes for sink |

**Example**

```json
{
    "name": "InformixDataset",
    "properties": {
        "type": "InformixTable",
        "linkedServiceName": {
            "referenceName": "<Informix linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "<table name>"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Informix source.

### Informix as source

To copy data from Informix, the following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **InformixSource** | Yes |
| query | Use the custom query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromInformix",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Informix input dataset name>",
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
                "type": "InformixSource",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

### Informix as sink

To copy data to Informix, the following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to: **InformixSink** | Yes |
| writeBatchTimeout |Wait time for the batch insert operation to complete before it times out.<br/>Allowed values are: timespan. Example: "00:30:00" (30 minutes). |No |
| writeBatchSize |Inserts data into the SQL table when the buffer size reaches writeBatchSize.<br/>Allowed values are: integer (number of rows). |No (default is 0 - auto detected) |
| preCopyScript |Specify a SQL query for Copy Activity to execute before writing data into data store in each run. You can use this property to clean up the pre-loaded data. |No |
| maxConcurrentConnections |The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No |

**Example:**

```json
"activities":[
    {
        "name": "CopyToInformix",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Informix output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "InformixSink"
            }
        }
    }
]
```

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).


## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
