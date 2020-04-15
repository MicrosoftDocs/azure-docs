---
title: Copy data from Microsoft Access sources
description: Learn how to copy data from Microsoft Access sources to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
ms.author: jingwang
author: linda33wj
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 08/27/2019
---

# Copy data from and to Microsoft Access data stores using Azure Data Factory
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from a Microsoft Access data store. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

This Microsoft Access connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with [supported source/sink matrix](copy-activity-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)

You can copy data from Microsoft Access source to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

## Prerequisites

To use this Microsoft Access connector, you need to:

- Set up a Self-hosted Integration Runtime. See [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md) article for details.
- Install the Microsoft Access ODBC driver for the data store on the Integration Runtime machine.

>[!NOTE]
>Microsoft Access 2016 version of ODBC driver doesn't work with this connector. Use driver version 2013 or 2010 instead.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to Microsoft Access connector.

## Linked service properties

The following properties are supported for Microsoft Access linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **MicrosoftAccess** | Yes |
| connectionString | The ODBC connection string excluding the credential portion. You can specify the connection string or use the system DSN (Data Source Name) you set up on the Integration Runtime machine (you need still specify the credential portion in linked service accordingly).<br> You can also put a password in Azure Key Vault and pull the `password` configuration out of the connection string. Refer to [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) with more details.| Yes |
| authenticationType | Type of authentication used to connect to the Microsoft Access data store.<br/>Allowed values are: **Basic** and **Anonymous**. | Yes |
| userName | Specify user name if you are using Basic authentication. | No |
| password | Specify password for the user account you specified for the userName. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| credential | The access credential portion of the connection string specified in driver-specific property-value format. Mark this field as a SecureString. | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. A Self-hosted Integration Runtime is required as mentioned in [Prerequisites](#prerequisites). |Yes |

**Example:**

```json
{
    "name": "MicrosoftAccessLinkedService",
    "properties": {
        "type": "Microsoft Access",
        "typeProperties": {
            "connectionString": "Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=<path to your DB file e.g. C:\\mydatabase.accdb>;",
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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Microsoft Access dataset.

To copy data from Microsoft Access, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **MicrosoftAccessTable** | Yes |
| tableName | Name of the table in the Microsoft Access. | No for source (if "query" in activity source is specified);<br/>Yes for sink |

**Example**

```json
{
    "name": "MicrosoftAccessDataset",
    "properties": {
        "type": "MicrosoftAccessTable",
        "linkedServiceName": {
            "referenceName": "<Microsoft Access linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "<table name>"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Microsoft Access source.

### Microsoft Access as source

To copy data from Microsoft Access-compatible data store, the following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **MicrosoftAccessSource** | Yes |
| query | Use the custom query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromMicrosoftAccess",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Microsoft Access input dataset name>",
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
                "type": "MicrosoftAccessSource",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
