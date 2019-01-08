---
title: Copy data from Sybase using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from Sybase to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 02/07/2018
ms.author: jingwang

---
# Copy data from Sybase using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-onprem-sybase-connector.md)
> * [Current version](connector-sybase.md)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from a Sybase database. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

You can copy data from Sybase database to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Sybase connector supports:

- SAP Sybase SQL Anywhere (ASA) **version 16 and above**; IQ and ASE are not supported.
- Copying data using **Basic** or **Windows** authentication.

## Prerequisites

To use this Sybase connector, you need to:

- Set up a Self-hosted Integration Runtime. See [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md) article for details.
- Install the [data provider for Sybase iAnywhere.Data.SQLAnywhere](https://go.microsoft.com/fwlink/?linkid=324846) 16 or above on the Integration Runtime machine.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to Sybase connector.

## Linked service properties

The following properties are supported for Sybase linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Sybase** | Yes |
| server | Name of the Sybase server. |Yes |
| database | Name of the Sybase database. |Yes |
| authenticationType | Type of authentication used to connect to the Sybase database.<br/>Allowed values are: **Basic**, and **Windows**. |Yes |
| username | Specify user name to connect to the Sybase database. |Yes |
| password | Specify password for the user account you specified for the username. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. A Self-hosted Integration Runtime is required as mentioned in [Prerequisites](#prerequisites). |Yes |

**Example:**

```json
{
    "name": "SybaseLinkedService",
    "properties": {
        "type": "Sybase",
        "typeProperties": {
            "server": "<server>",
            "database": "<database>",
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

For a full list of sections and properties available for defining datasets, see the datasets article. This section provides a list of properties supported by Sybase dataset.

To copy data from Sybase, set the type property of the dataset to **RelationalTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **RelationalTable** | Yes |
| tableName | Name of the table in the Sybase database. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "SybaseDataset",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": {
            "referenceName": "<Sybase linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {}
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Sybase source.

### Sybase as source

To copy data from Sybase, set the source type in the copy activity to **RelationalSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **RelationalSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSybase",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Sybase input dataset name>",
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
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Data type mapping for Sybase

When copying data from Sybase, the following mappings are used from Sybase data types to Azure Data Factory interim data types. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

Sybase supports T-SQL types. For a mapping table from SQL types to Azure Data Factory interim data types, see [Azure SQL Database Connector - data type mapping](connector-azure-sql-database.md#data-type-mapping-for-azure-sql-database) section.


## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
