---
title: Copy data from SAP HANA using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from SAP HANA to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/30/2017
ms.author: jingwang

---
# Copy data from SAP HANA using Azure Data Factory

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from an SAP HANA database. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported scenarios

You can copy data from SAP HANA database to any supported sink data store. For a list of data stores supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this SAP HANA connector supports:

- Copying data from any version of SAP HANA database.
- Copying data from **HANA information models** (such as Analytic and Calculation views) and **Row/Column tables** using SQL queries.
- Copying data using **Basic** or **Windows** authentication.

## Prerequisites

To use this SAP HANA connector, you need to:

- Set up a self-hosted Integration Runtime. See [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md) article for details.
- Install the SAP HANA ODBC driver on the Integration Runtime machine. You can download the SAP HANA ODBC driver from the [SAP Software Download Center](https://support.sap.com/swdc). Search with the keyword **SAP HANA CLIENT for Windows**.

## Getting started
You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

The following sections provide details about properties that are used to define Data Factory entities specific to SAP HANA connector.

## Linked service properties

The following properties are supported for SAP HANA linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **SapHana** | Yes |
| server | Name of the server on which the SAP HANA instance resides. If your server is using a customized port, specify `server:port`. | Yes |
| authenticationType | Type of authentication used to connect to the SAP HANA database.<br/>Allowed values are: **Basic**, and **Windows** | Yes |
| username | Name of the user who has access to the SAP server. | Yes |
| password | Password for the user. | Yes |

**Example:**

```json
{
    "name": "SapHanaLinkedService",
    "properties": {
        "type": "SapHana",
        "typeProperties": {
            "server": "<server>:<port (optional)>",
            "authenticationType": "Basic",
            "username": "<username>",
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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by SAP HANA dataset.

To copy data from SAP HANA, set the type property of the dataset to **RelationalTable**. While there are no type-specific properties supported for the SAP HANA dataset of type RelationalTable.

**Example:**

```json
{
    "name": "SAPHANADataset",
    "properties":
    {
        "type": "RelationalTable",
        "linkedServiceName": {
            "referenceName": "<SAP HANA linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {}
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by SAP HANA source.

### SAP HANA as source

To copy data from SAP HANA, set the source type in the copy activity to **RelationalSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **RelationalSource** | Yes |
| query | Specifies the SQL query to read data from the SAP HANA instance. | Yes |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSAPHANA",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SAP HANA input dataset name>",
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
                "type": "RelationalSource",
                "query": "<SQL query for SAP HANA>"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Data type mapping for SAP HANA

When copying data from SAP HANA, the following mappings are used from SAP HANA data types to Azure Data Factory interim data types. See [Schema and data type mappings](copy-activity-map-columns.md) to learn about how copy activity maps the source schema and data type to the sink.

| SAP HANA data type | Data factory interim data type |
|:--- |:--- |
| ALPHANUM | String |
| BIGINT | Int64 |
| BLOB | Byte[] |
| BOOLEAN | Byte |
| CLOB | Byte[] |
| DATE | DateTime |
| DECIMAL | Decimal |
| DOUBLE | Single |
| INT | Int32 |
| NVARCHAR | String |
| REAL | Single |
| SECONDDATE | DateTime |
| SMALLINT | Int16 |
| TIME | TimeSpan |
| TIMESTAMP | DateTime |
| TINYINT | Byte |
| VARCHAR | String |

## Known limitations

There are a few known limitations when copying data from SAP HANA:

- NVARCHAR strings are truncated to maximum length of 4000 Unicode characters
- SMALLDECIMAL is not supported
- VARBINARY is not supported
- Valid Dates are between 1899/12/30 and 9999/12/31


## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).