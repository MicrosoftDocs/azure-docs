---
title: Copy data from an SAP table
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from an SAP table to supported sink data stores by using a copy activity in an Azure Data Factory or Azure Synapse Analytics pipeline.
author: jianleishen
ms.author: ulrichchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 10/20/2023
---

# Copy data from an SAP table using Azure Data Factory or Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the copy activity in Azure Data Factory and Azure Synapse Analytics pipelines to copy data from an SAP table. For more information, see [Copy activity overview](copy-activity-overview.md).

>[!TIP]
>To learn the overall support on SAP data integration scenario, see [SAP data integration using Azure Data Factory whitepaper](https://github.com/Azure/Azure-DataFactory/blob/master/whitepaper/SAP%20Data%20Integration%20using%20Azure%20Data%20Factory.pdf) with detailed introduction on each SAP connector, comparsion and guidance.

## Supported capabilities

This SAP table connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of the data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this SAP table connector supports:

- Copying data from an SAP table in:

  - SAP ERP Central Component (SAP ECC) version 7.01 or later (in a recent SAP Support Package Stack released after 2015).
  - SAP Business Warehouse (SAP BW) version 7.01 or later (in a recent SAP Support Package Stack released after 2015).
  - SAP S/4HANA.
  - Other products in SAP Business Suite version 7.01 or later (in a recent SAP Support Package Stack released after 2015).

- Copying data from both an SAP transparent table, a pooled table, a clustered table, and a view.
- Copying data by using basic authentication or Secure Network Communications (SNC), if SNC is configured.
- Connecting to an SAP application server or SAP message server.
- Retrieving data via default or custom RFC.

The version 7.01 or later refers to SAP NetWeaver version instead of SAP ECC version. For example, SAP ECC 6.0 EHP 7 in general has NetWeaver version >=7.4. In case you are unsure about your environment, here are the steps to confirm the version from your SAP system:

1. Use SAP GUI to connect to the SAP System. 
2. Go to **System** -> **Status**. 
3. Check the release of the SAP_BASIS, ensure it is equal to or larger than 701.  
      :::image type="content" source="./media/connector-sap-table/sap-basis.png" alt-text="Check SAP_BASIS":::

## Prerequisites

To use this SAP table connector, you need to:

- Set up a self-hosted integration runtime (version 3.17 or later). For more information, see [Create and configure a self-hosted integration runtime](create-self-hosted-integration-runtime.md).

- Download the 64-bit [SAP Connector for Microsoft .NET 3.0](https://support.sap.com/en/product/connectors/msnet.html) from SAP's website, and install it on the self-hosted integration runtime machine. During installation, make sure you select the **Install Assemblies to GAC** option in the **Optional setup steps** window.

  :::image type="content" source="./media/connector-sap-business-warehouse-open-hub/install-sap-dotnet-connector.png" alt-text="Install SAP Connector for .NET":::

- The SAP user who's being used in the SAP table connector must have the following permissions:

  - Authorization for using Remote Function Call (RFC) destinations.
  - Permissions to the Execute activity of the S_SDSAUTH authorization object. You can refer to SAP Note 460089 on the majority authorization objects. Certain RFCs are required by the underlying NCo connector, for example RFC_FUNCTION_SEARCH. 

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to an SAP table using UI

Use the following steps to create a linked service to an SAP table in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for SAP and select the SAP table connector.

    :::image type="content" source="media/connector-sap-table/sap-table-connector.png" alt-text="Screenshot of the SAP table connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-sap-table/configure-sap-table-linked-service.png" alt-text="Screenshot of configuration for an SAP table linked service.":::

## Connector configuration details

The following sections provide details about properties that are used to define the entities specific to the SAP table connector.

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
| `password` | The password for the user. Mark this field with the `SecureString` type to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| `sncMode` | The SNC activation indicator to access the SAP server where the table is located.<br/>Use if you want to use SNC to connect to the SAP server.<br/>Allowed values are `0` (off, the default) or `1` (on). | No |
| `sncMyName` | The initiator's SNC name to access the SAP server where the table is located.<br/>Applies when `sncMode` is on. | No |
| `sncPartnerName` | The communication partner's SNC name to access the SAP server where the table is located.<br/>Applies when `sncMode` is on. | No |
| `sncLibraryPath` | The external security product's library to access the SAP server where the table is located.<br/>Applies when `sncMode` is on. | No |
| `sncQop` | The SNC Quality of Protection level to apply.<br/>Applies when `sncMode` is On. <br/>Allowed values are `1` (Authentication), `2` (Integrity), `3` (Privacy), `8` (Default), `9` (Maximum). | No |
| `connectVia` | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. A self-hosted integration runtime is required, as mentioned earlier in [Prerequisites](#prerequisites). |Yes |

### Example 1: Connect to an SAP application server

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
        "typeProperties": {
            "tableName": "<SAP table name>"
        },
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<SAP table linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of the sections and properties for defining activities, see [Pipelines](concepts-pipelines-activities.md). The following section provides a list of the properties supported by the SAP table source.

### SAP table as source

To copy data from an SAP table, the following properties are supported:

| Property                         | Description                                                  | Required |
| :------------------------------- | :----------------------------------------------------------- | :------- |
| `type`                             | The `type` property must be set to `SapTableSource`.         | Yes      |
| `rowCount`                         | The number of rows to be retrieved.                              | No       |
| `rfcTableFields`                 | The fields (columns) to copy from the SAP table. For example, `column0, column1`. | No       |
| `rfcTableOptions`                | The options to filter the rows in an SAP table. For example, `COLUMN0 EQ 'SOMEVALUE'`. See also the SAP query operator table later in this article. | No       |
| `customRfcReadTableFunctionModule` | A custom RFC function module that can be used to read data from an SAP table.<br>You can use a custom RFC function module to define how the data is retrieved from your SAP system and returned to the service. The custom function module must have an interface implemented (import, export, tables) that's similar to `/SAPDS/RFC_READ_TABLE2`, which is the default interface used by the service.| No       |
| `partitionOption`                  | The partition mechanism to read from an SAP table. The supported options include: <ul><li>`None`</li><li>`PartitionOnInt` (normal integer or integer values with zero padding on the left, such as `0000012345`)</li><li>`PartitionOnCalendarYear` (4 digits in the format "YYYY")</li><li>`PartitionOnCalendarMonth` (6 digits in the format "YYYYMM")</li><li>`PartitionOnCalendarDate` (8 digits in the format "YYYYMMDD")</li><li>`PartitionOntime` (6 digits in the format "HHMMSS", such as `235959`)</li></ul> | No       |
| `partitionColumnName`              | The name of the column used to partition the data.                | No       |
| `partitionUpperBound`              | The maximum value of the column specified in `partitionColumnName` that will be used to continue with partitioning. | No       |
| `partitionLowerBound`              | The minimum value of the column specified in `partitionColumnName` that will be used to continue with partitioning. (Note: `partitionLowerBound` cannot be "0" when partition option is `PartitionOnInt`) | No       |
| `maxPartitionsNumber`              | The maximum number of partitions to split the data into. The default value is 1.    | No       |
| `sapDataColumnDelimiter` | The single character that is used as delimiter passed to SAP RFC to split the output data. | No |

>[!TIP]
>If your SAP table has a large volume of data, such as several billion rows, use `partitionOption` and `partitionSetting` to split the data into smaller partitions. In this case, the data is read per partition, and each data partition is retrieved from your SAP server via a single RFC call.<br/>
<br/>
>Taking `partitionOption` as `partitionOnInt` as an example, the number of rows in each partition is calculated with this formula: (total rows falling between `partitionUpperBound` and `partitionLowerBound`)/`maxPartitionsNumber`.<br/>
<br/>
>To load data partitions in parallel to speed up copy, the parallel degree is controlled by the [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. For example, if you set `parallelCopies` to four, the service concurrently generates and runs four queries based on your specified partition option and settings, and each query retrieves a portion of data from your SAP table. We strongly recommend making `maxPartitionsNumber` a multiple of the value of the `parallelCopies` property. When copying data into file-based data store, it's also recommanded to write to a folder as multiple files (only specify folder name), in which case the performance is better than writing to a single file.


>[!TIP]
> The `BASXML` is enabled by default for this SAP Table connector within the service.

In `rfcTableOptions`, you can use the following common SAP query operators to filter the rows:

| Operator | Description |
| :------- | :------- |
| `EQ` | Equal to |
| `NE` | Not equal to |
| `LT` | Less than |
| `LE` | Less than or equal to |
| `GT` | Greater than |
| `GE` | Greater than or equal to |
| `IN` | As in `TABCLASS IN ('TRANSP', 'INTTAB')` |
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
            },
            "parallelCopies": 4
        }
    }
]
```

## Join SAP tables

Currently SAP Table connector only supports one single table with the default function module. To get the joined data of multiple tables, you can leverage the [customRfcReadTableFunctionModule](#copy-activity-properties) property in the SAP Table connector following steps below:

- [Write a custom function module](#create-custom-function-module), which can take a query as OPTIONS and apply your own logic to retrieve the data.
- For the "Custom function module", enter the name of your custom function module.
- For the "RFC table options", specify the table join statement to feed into your function module as OPTIONS, such as "`<TABLE1>` INNER JOIN `<TABLE2>` ON COLUMN0".

Below is an example:

:::image type="content" source="./media/connector-sap-table/sap-table-join.png" alt-text="Sap Table Join"::: 

>[!TIP]
>You can also consider having the joined data aggregated in the VIEW, which is supported by SAP Table connector.
>You can also try to extract related tables to get onboard onto Azure (e.g. Azure Storage, Azure SQL Database), then use Data Flow to proceed with further join or filter.

## Create custom function module

For SAP table, currently we support [customRfcReadTableFunctionModule](#copy-activity-properties) property in the copy source, which allows you to leverage your own logic and process data.

As a quick guidance, here are some requirements to get started with the "Custom function module":

- Definition:

    :::image type="content" source="./media/connector-sap-table/custom-function-module-definition.png" alt-text="Definition"::: 

- Export data into one of the tables below:

    :::image type="content" source="./media/connector-sap-table/export-table-1.png" alt-text="Export table 1"::: 

    :::image type="content" source="./media/connector-sap-table/export-table-2.png" alt-text="Export table 2":::
 
Below are illustrations of how SAP table connector works with custom function module:

1. Build connection with SAP server via SAP NCO.

1. Invoke "Custom function module" with the parameters set as below:

    - QUERY_TABLE: the table name you set in the SAP Table dataset; 
    - Delimiter: the delimiter you set in the SAP Table Source; 
    - ROWCOUNT/Option/Fields: the Rowcount/Aggregated Option/Fields you set in the Table source.

1. Get the result and parse the data in below ways:

    1. Parse the value in the Fields table to get the schemas.

        :::image type="content" source="./media/connector-sap-table/parse-values.png" alt-text="Parse values in Fields":::

    1. Get the values of the output table to see which table contains these values.

        :::image type="content" source="./media/connector-sap-table/get-values.png" alt-text="Get values in output table":::

    1. Get the values in the OUT_TABLE, parse the data and then write it into the sink.

## Data type mappings for an SAP table

When you're copying data from an SAP table, the following mappings are used from the SAP table data types to interim data types used within the service. To learn how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| SAP ABAP Type | Service interim data type |
|:--- |:--- |
| `C` (String) | `String` |
| `I` (Integer) | `Int32` |
| `F` (Float) | `Double` |
| `D` (Date) | `String` |
| `T` (Time) | `String` |
| `P` (BCD Packed, Currency, Decimal, Qty) | `Decimal` |
| `N` (Numeric) | `String` |
| `X` (Binary and Raw) | `String` |

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).


## Next steps

For a list of the data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
