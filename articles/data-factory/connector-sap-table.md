---
title: Copy data from an SAP table by using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from an SAP table to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 07/09/2018
ms.author: jingwang

---
# Copy data from an SAP table by using Azure Data Factory

This article outlines how to use the copy activity in Azure Data Factory to copy data from an SAP table. For more information, see [Copy activity overview](copy-activity-overview.md).

## Supported capabilities

You can copy data from an SAP table to any supported sink data store. For a list of the data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this SAP table connector supports:

- Copying data from an SAP table in:

  - SAP ERP Central Component (SAP ECC) version 7.01 or later (in a recent SAP Support Package Stack released after 2015).
  - SAP Business Warehouse (SAP BW) version 7.01 or later.
  - SAP S/4HANA.
  - Other products in SAP Business Suite version 7.01 or later.

- Copying data from both an SAP transparent table, a pooled table, a clustered table, and a view.
- Copying data by using basic authentication or Secure Network Communications (SNC), if SNC is configured.
- Connecting to an SAP application server or SAP message server.

## Prerequisites

To use this SAP table connector, you need to:

- Set up a self-hosted integration runtime (version 3.17 or later). For more information, see [Create and configure a self-hosted integration runtime](create-self-hosted-integration-runtime.md).

- Download the 64-bit [SAP Connector for Microsoft .NET 3.0](https://support.sap.com/en/product/connectors/msnet.html) from SAP's website, and install it on the self-hosted integration runtime machine. During installation, make sure you select the **Install Assemblies to GAC** option in the **Optional setup steps** window.

  ![Install SAP Connector for .NET](./media/connector-sap-business-warehouse-open-hub/install-sap-dotnet-connector.png)

- The SAP user who's being used in the Data Factory SAP table connector must have the following permissions:

  - Authorization for using Remote Function Call (RFC) destinations.
  - Permissions to the Execute activity of the S_SDSAUTH authorization object.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define the Data Factory entities specific to the SAP table connector.

## Linked service properties

The following properties are supported for the SAP BW Open Hub linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| `type` | The `type` property must be set to `SapTable`. | Yes |
| `server` | The name of the server on which the SAP instance is located.<br/>Use to connect to an SAP application server. | No |
| `systemNumber` | The system number of the SAP system.<br/>Use to connect to an SAP application server.<br/>Allowed value: A two-digit decimal number represented as a string. | No |
| `messageServer` | The host name of the SAP message server.<br/>Use to connect to an SAP message server. | No |
| `messageServerService` | The service name or port number of the message server.<br/>Use to connect to an SAP message server. | No |
| `systemId` | The ID of the SAP system where the table is located.<br/>Use to connect to an SAP message server. | No |
| `logonGroup` | The logon group for the SAP system.<br/>Use to connect to an SAP message server. | No |
| `clientId` | The ID of the client in the SAP system.<br/>Allowed value: A three-digit decimal number represented as a string. | Yes |
| `language` | The language that the SAP system uses.<br/>Default value is `EN`.| No |
| `userName` | The name of the user who has access to the SAP server. | Yes |
| `password` | The password for the user. Mark this field with the `SecureString` type to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| `sncMode` | The SNC activation indicator to access the SAP server where the table is located.<br/>Use if you want to use SNC to connect to the SAP server.<br/>Allowed values are `0` (off, the default) or `1` (on). | No |
| `sncMyName` | The initiator's SNC name to access the SAP server where the table is located.<br/>Applies when `sncMode` is on. | No |
| `sncPartnerName` | The communication partner's SNC name to access the SAP server where the table is located.<br/>Applies when `sncMode` is on. | No |
| `sncLibraryPath` | The external security product's library to access the SAP server where the table is located.<br/>Applies when `sncMode` is on. | No |
| `sncQop` | The SNC Quality of Protection level to apply.<br/>Applies when `sncMode` is On. <br/>Allowed values are `1` (Authentication), `2` (Integrity), `3` (Privacy), `8` (Default), `9` (Maximum). | No |
| `connectVia` | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. A self-hosted integration runtime is required, as mentioned earlier in [Prerequisites](#prerequisites). |Yes |

**Example 1: Connect to an SAP application server**

```json
{
    "name": "SapTableLinkedService",
    "properties": {
        "type": "SapTable",
        "typeProperties": {
            "server": "<server name>",
            "systemNumber": "<system number>",
            "clientId": "<client ID>",
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

### Example 2: Connect to an SAP message server

```json
{
    "name": "SapTableLinkedService",
    "properties": {
        "type": "SapTable",
        "typeProperties": {
            "messageServer": "<message server name>",
            "messageServerService": "<service name or port>",
            "systemId": "<system ID>",
            "logonGroup": "<logon group>",
            "clientId": "<client ID>",
            "userName": "<SAP user>",
            "password": {
                "type": "SecureString",
                "value": "<Password for SAP user>"
            }
        },
        "connectVia": {
            "referenceName": "<name of integration runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Example 3: Connect by using SNC

```json
{
    "name": "SapTableLinkedService",
    "properties": {
        "type": "SapTable",
        "typeProperties": {
            "server": "<server name>",
            "systemNumber": "<system number>",
            "clientId": "<client ID>",
            "userName": "<SAP user>",
            "password": {
                "type": "SecureString",
                "value": "<Password for SAP user>"
            },
            "sncMode": 1,
            "sncMyName": "<SNC myname>",
            "sncPartnerName": "<SNC partner name>",
            "sncLibraryPath": "<SNC library path>",
            "sncQop": "8"
        },
        "connectVia": {
            "referenceName": "<name of integration runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of the sections and properties for defining datasets, see [Datasets](concepts-datasets-linked-services.md). The following section provides a list of the properties supported by the SAP table dataset.

To copy data from and to the SAP BW Open Hub linked service, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| `type` | The `type` property must be set to `SapTableResource`. | Yes |
| `tableName` | The name of the SAP table to copy data from. | Yes |

### Example

```json
{
    "name": "SAPTableDataset",
    "properties": {
        "type": "SapTableResource",
        "linkedServiceName": {
            "referenceName": "<SAP table linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "<SAP table name>"
        }
    }
}
```

## Copy activity properties

For a full list of the sections and properties for defining activities, see [Pipelines](concepts-pipelines-activities.md). The following section provides a list of the properties supported by the SAP table source.

### SAP table as a source

To copy data from an SAP table, the following properties are supported:

| Property                         | Description                                                  | Required |
| :------------------------------- | :----------------------------------------------------------- | :------- |
| `type`                             | The `type` property must be set to `SapTableSource`.         | Yes      |
| `rowCount`                         | The number of rows to be retrieved.                              | No       |
| `rfcTableFields`                   | The fields (columns) to copy from the SAP table. For example, `column0, column1`. | No       |
| `rfcTableOptions`                  | The options to filter the rows in an SAP table. For example, `COLUMN0 EQ 'SOMEVALUE'`. See also the SAP query operator table later in this article. | No       |
| `customRfcReadTableFunctionModule` | A custom RFC function module that can be used to read data from an SAP table.<br>You can use a custom RFC function module to define how the data is retrieved from your SAP system and returned to Data Factory. The custom function module must have an interface implemented (import, export, tables) that's similar to `/SAPDS/RFC_READ_TABLE2`, which is the default interface used by Data Factory. | No       |
| `partitionOption`                  | The partition mechanism to read from an SAP table. The supported options include: <ul><li>`None`</li><li>`PartitionOnInt` (normal integer or integer values with zero padding on the left, such as `0000012345`)</li><li>`PartitionOnCalendarYear` (4 digits in the format "YYYY")</li><li>`PartitionOnCalendarMonth` (6 digits in the format "YYYYMM")</li><li>`PartitionOnCalendarDate` (8 digits in the format "YYYYMMDD")</li></ul> | No       |
| `partitionColumnName`              | The name of the column used to partition the data.                | No       |
| `partitionUpperBound`              | The maximum value of the column specified in `partitionColumnName` that will be used to continue with partitioning. | No       |
| `partitionLowerBound`              | The minimum value of the column specified in `partitionColumnName` that will be used to continue with partitioning. | No       |
| `maxPartitionsNumber`              | The maximum number of partitions to split the data into.     | No       |

>[!TIP]
>If your SAP table has a large volume of data, such as several billion rows, use `partitionOption` and `partitionSetting` to split the data into smaller partitions. In this case, the data is read per partition, and each data partition is retrieved from your SAP server via a single RFC call.<br/>
<br/>
>Taking `partitionOption` as `partitionOnInt` as an example, the number of rows in each partition is calculated with this formula: (total rows falling between `partitionUpperBound` and `partitionLowerBound`)/`maxPartitionsNumber`.<br/>
<br/>
>To run partitions in parallel to speed up copying, we strongly recommend making `maxPartitionsNumber` a multiple of the value of the `parallelCopies` property. For more information, see [Parallel copy](copy-activity-performance.md#parallel-copy).

In `rfcTableOptions`, you can use the following common SAP query operators to filter the rows:

| Operator | Description |
| :------- | :------- |
| `EQ` | Equal to |
| `NE` | Not equal to |
| `LT` | Less than |
| `LE` | Less than or equal to |
| `GT` | Greater than |
| `GE` | Greater than or equal to |
| `LIKE` | As in `LIKE 'Emma%'` |

### Example

```json
"activities":[
    {
        "name": "CopyFromSAPTable",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SAP table input dataset name>",
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
                     "partitionColumnName": "<partition column name>",
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

## Data type mappings for an SAP table

When you're copying data from an SAP table, the following mappings are used from the SAP table data types to the Azure Data Factory interim data types. To learn how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| SAP ABAP Type | Data Factory interim data type |
|:--- |:--- |
| `C` (String) | `String` |
| `I` (Integer) | `Int32` |
| `F` (Float) | `Double` |
| `D` (Date) | `String` |
| `T` (Time) | `String` |
| `P` (BCD Packed, Currency, Decimal, Qty) | `Decimal` |
| `N` (Numeric) | `String` |
| `X` (Binary and Raw) | `String` |

## Next steps

For a list of the data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
