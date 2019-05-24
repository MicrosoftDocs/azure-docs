---
title: Copy data from SAP Table using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from SAP Table to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
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
# Copy data from SAP Table using Azure Data Factory

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from an SAP Table. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

You can copy data from SAP Table to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this SAP Table connector supports:

- SAP Table in any product belong to SAP Business Suite with version 7.01 or higher (in a recent SAP Support Package Stack released after the year 2015) or S/4HANA.
- Copying data from both SAP Transparent Table and View.
- Copying data using basic authentication or SNC if SNC is configured.
- Connecting to Application Server or Message Server.

## Prerequisites

To use this SAP Table connector, you need to:

- Set up a Self-hosted Integration Runtime with version 3.17 or above. See [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md) article for details.

- Download the **64-bit [SAP .NET Connector 3.0](https://support.sap.com/en/product/connectors/msnet.html)** from SAP's website, and install it on the Self-hosted IR machine. When installing, in the optional setup steps window, make sure you select the **Install Assemblies to GAC** option. 

- SAP user being used in the Data Factory SAP Table connector needs to have following permissions: 

    - Authorization for RFC. 
    - Permissions to the “Execute” Activity of Authorization Object “S_SDSAUTH”.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to SAP Table connector.

## Linked service properties

The following properties are supported for SAP Business Warehouse Open Hub linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **SapTable | Yes |
| server | Name of the server on which the SAP instance resides. | No |
| systemNumber | System number of the SAP system.<br/>Allowed value: two-digit decimal number represented as a string. | No |
| messageServer | The hostname of the SAP Message Server. Applicable if you want to connect to SAP Message Server. | No |
| messageServerService | The service name or port number of the Message Server. Applicable if you want to connect to SAP Message Server. | No |
| systemId | SystemID of the SAP system where the table is located. | No |
| logonGroup | The Logon Group for the SAP System. | No |
| clientId | Client ID of the client in the SAP system.<br/>Allowed value: three-digit decimal number represented as a string. | Yes |
| language | Language that the SAP system uses. | No (default value is **EN**)|
| userName | Name of the user who has access to the SAP server. | Yes |
| password | Password for the user. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| sncMode | SNC activation indicator to access the SAP server where the table is located. Applicable if you want to connect to SNC. <br/>Allowed values are: **0 (off)** or **1 (on)**. | No |
| sncMyName | Initiator's SNC name to access the SAP server where the table is located. Applicable when `sncMode` is On. | No |
| sncPartnerName | Communication partner's SNC name to access the SAP server where the table is located. Applicable when `sncMode` is On. | No |
| sncLibraryPath | External security product's library to access the SAP server where the table is located. Applicable when `sncMode` is On. | No |
| sncQop | SNC Quality of Protection. Applicable when `sncMode` is On. <br/>Allowed value are: 1 (Authentication), 2 (Integrity), 3 (Privacy), 8 (Default), 9 (Maximum). | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. A Self-hosted Integration Runtime is required as mentioned in [Prerequisites](#prerequisites). |Yes |

**Example 1: connecting to the SAP Application Server**

```json
{
    "name": "SapTableLinkedService",
    "properties": {
        "type": "SapTable",
        "typeProperties": {
            "server": "<server name>",
            "systemNumber": "<system number>",
            "clientId": "<client id>",
            "userName": "<SAP user>",
            "password": {
                "type": "SecureString",
                "value": "<Password for SAP user>"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example 2: connecting to the SAP Message Server**

```json
{
    "name": "SapTableLinkedService",
    "properties": {
        "type": "SapTable",
        "typeProperties": {
            "messageServer": "<message server name>",
            "messageServerService": "<service name or port>",
            "systemId": "<system id>",
            "logonGroup": "<logon group>",
            "clientId": "<client id>",
            "userName": "<SAP user>",
            "password": {
                "type": "SecureString",
                "value": "<Password for SAP user>"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example 3: connecting using SNC**

```json
{
    "name": "SapTableLinkedService",
    "properties": {
        "type": "SapTable",
        "typeProperties": {
            "server": "<server name>",
            "systemNumber": "<system number>",
            "clientId": "<client id>",
            "userName": "<SAP user>",
            "password": {
                "type": "SecureString",
                "value": "<Password for SAP user>"
            },
            "sncMode": 1,
            "sncMyName": "snc myname",
            "sncPartnerName": "snc partner name",
            "sncLibraryPath": "snc library path",
            "sncQop": "8"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Salesforce dataset.

To copy data from and to SAP BW Open Hub, the following properties are supported.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **SapTableResource**. | Yes |
| tableName | The name of the SAP Table to copy data from. | Yes |

**Example:**

```json
{
    "name": "SAPTableDataset",
    "properties": {
        "type": "SapTableResource",
        "linkedServiceName": {
            "referenceName": "<SAP Table linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "<SAP table name>"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by SAP Table source.

### SAP Table as source

To copy data from SAP Table, the following properties are supported.

| Property                         | Description                                                  | Required |
| :------------------------------- | :----------------------------------------------------------- | :------- |
| type                             | The type property must be set to **SapTableResource**.       | Yes      |
| rowCount                         | Number of rows to be retrieved.                              | No       |
| rfcTableFields                   | Fields of the SAP table that will be retrieved. For example, column0, column1. | No       |
| rfcTableOptions                  | Options for the filtering of the SAP Table. For example, COLUMN0 EQ SOME VALUE. | No       |
| customRfcReadTableFunctionModule | Custom RFC function module that will be used to read data from SAP Table. | No       |
| partitionOption                  | The partition mechanism that will be used for SAP table read in parallel. Current support options include: None, PartitionOnInt(normal integer or Integer values with zero padding on the left, such as 0000012345), PartitionOnCalendarYear (4 digits in format YYYY), PartitionOnCalendarMonth(6 digits in format YYYYMM), PartitionOnCalendarDate(8 digits in format YYYYMMDD) | No       |
| partitionColumnName              | The name of the column that will be used for proceeding partitioning. | No       |
| partitionUpperBound              | The maximum value of column specified in partitionColumnName that will be used for proceeding partitioning. | No       |
| partitionLowerBound              | The minimum value of column specified in partitionColumnName that will be used for proceeding partitioning. | No       |
| maxPartitionsNumber              | The maximum value of partitions to split the data into. | No       |

>[!TIP]
>If your SAP table only large volume of data such as several billions, please use the partitionOption and partitionSetting to split the data into small partitions that will be read by partitions with each of the partition data can be retrieved by your server via one single RFC call.  Take partitionOnInt as example, the number of each partition will be calculated via (total rows falling between partitionUpperBound and partitionLowerBound)/maxPartitionsNumber.  If you would like to run in parallel,  it is strongly recommended to keep maxPartitionsNumber as a multiple of the value of parallelCopies.

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSAPTable",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SAP Table input dataset name>",
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
                "type": "SapTableSource",
                "partitionOption": "PartitionOnInt",
                "partitionSettings": {
                     "partitionColumnName": "columnname",
                     "partitionUpperBound": "2000",
                     "partitionLowerBound": "1",
                     "maxPartitionsNumber": 500
                 }
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Data type mapping for SAP Table

When copying data from SAP Table, the following mappings are used from SAP Table data types to Azure Data Factory interim data types. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

| SAP ABAP Type | Data factory interim data type |
|:--- |:--- |
| C (String) | String |
| I (Integer) | Int32 |
| F (Float) | Double |
| D (Date) | String |
| T (Time) | String |
| P (BCD Packed, Currency, Decimal, Qty) | Decimal |
| N (Numeric) | String |
| X (Binary and Raw) | String |

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
