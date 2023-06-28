---
title: Copy data from SAP Business Warehouse via Open Hub
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from SAP Business Warehouse (BW) via Open Hub to supported sink data stores by using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
author: jianleishen
ms.author: ulrichchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 10/25/2022
---

# Copy data from SAP Business Warehouse via Open Hub using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data from an SAP Business Warehouse (BW) via Open Hub. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

>[!TIP]
>To learn about overall support for the SAP data integration scenario, see [SAP data integration whitepaper](https://github.com/Azure/Azure-DataFactory/blob/master/whitepaper/SAP%20Data%20Integration%20using%20Azure%20Data%20Factory.pdf) with detailed introduction on each SAP connector, comparison and guidance.

## Supported capabilities

This SAP Business Warehouse Open Hub connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

 For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this SAP Business Warehouse Open Hub connector supports:

- SAP Business Warehouse **version 7.01 or higher (in a recent SAP Support Package Stack released after the year 2015)**. SAP BW/4HANA is not supported by this connector.
- Copying data via Open Hub Destination local table, which underneath can be DSO, InfoCube, MultiProvider, DataSource, etc.
- Copying data using basic authentication.
- Connecting to an SAP application server or SAP message server.
- Retrieving data via RFC.

## SAP BW Open Hub Integration 

[SAP BW Open Hub Service](https://wiki.scn.sap.com/wiki/display/BI/Overview+of+Open+Hub+Service) is an efficient way to extract data from SAP BW. The following diagram shows one of the typical flows customers have in their SAP system, in which case data flows from SAP ECC -> PSA -> DSO -> Cube.

SAP BW Open Hub Destination (OHD) defines the target to which the SAP data is relayed. Any objects supported by SAP Data Transfer Process (DTP) can be used as open hub data sources, for example, DSO, InfoCube, DataSource, etc. Open Hub Destination type - where the relayed data is stored - can be database tables (local or remote) and flat files. This SAP BW Open Hub connector support copying data from OHD local table in BW. In case you are using other types, you can directly connect to the database or file system using other connectors.

:::image type="content" source="./media/connector-sap-business-warehouse-open-hub/sap-bw-open-hub.png" alt-text="SAP BW Open Hub":::

## Delta extraction flow

The SAP BW Open Hub Connector offers two optional properties: `excludeLastRequest` and `baseRequestId` which can be used to handle delta load from Open Hub. 

- **excludeLastRequestId**: Whether to exclude the records of the last request. Default value is true. 
- **baseRequestId**: The ID of request for delta loading. Once it is set, only data with requestId larger than the value of this property will be retrieved. 

Overall, the extraction from SAP InfoProviders consists of two steps: 

1. **SAP BW Data Transfer Process (DTP)** 
   This step copies the data from an SAP BW InfoProvider to an SAP BW Open Hub table 

1. **Data copy**
   In this step, the Open Hub table is read by the connector 

:::image type="content" source="media/connector-sap-business-warehouse-open-hub/delta-extraction-flow.png" alt-text="Delta extraction flow":::

In the first step, a DTP is executed. Each execution creates a new SAP request ID. The request ID is stored in the Open Hub table and is then used by the connector to identify the delta. The two steps run asynchronously: the DTP is triggered by SAP, and the data copy is triggered through the service. 

By default, the service is not reading the latest delta from the Open Hub table (option "exclude last request" is true). Hereby, the data in the service is not 100% up to date with the data in the Open Hub table (the last delta is missing). In return, this procedure ensures that no rows get lost caused by the asynchronous extraction. It works fine even when the service is reading the Open Hub table while the DTP is still writing into the same table. 

You typically store the max copied request ID in the last run by the service in a staging data store (such as Azure Blob in above diagram). Therefore, the same request is not read a second time by the service in the subsequent run. Meanwhile, note the data is not automatically deleted from the Open Hub table.

For proper delta handling, it is not allowed to have request IDs from different DTPs in the same Open Hub table. Therefore, you must not create more than one DTP for each Open Hub Destination (OHD). When needing Full and Delta extraction from the same InfoProvider, you should create two OHDs for the same InfoProvider. 

## Prerequisites

To use this SAP Business Warehouse Open Hub connector, you need to:

- Set up a Self-hosted Integration Runtime with version 3.13 or above. See [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md) article for details.

- Download the **64-bit [SAP .NET Connector 3.0](https://support.sap.com/en/product/connectors/msnet.html)** from SAP's website, and install it on the Self-hosted IR machine. When installing, in the optional setup steps window, make sure you select the **Install Assemblies to GAC** option as shown in the following image. 

    :::image type="content" source="./media/connector-sap-business-warehouse-open-hub/install-sap-dotnet-connector.png" alt-text="Install SAP .NET Connector":::

- SAP user being used in the BW connector needs to have following permissions: 

    - Authorization for RFC and SAP BW. 
    - Permissions to the “Execute” Activity of Authorization Object “S_SDSAUTH”.

- Create SAP Open Hub Destination type as **Database Table** with "Technical Key" option checked.  It is also recommended to leave the Deleting Data from Table as unchecked although it is not required. Use the DTP (directly execute or integrate into existing process chain) to land data from source object (such as cube) you have chosen to the open hub destination table.

## Getting started

> [!TIP]
>
> For a walkthrough of using SAP BW Open Hub connector, see [Load data from SAP Business Warehouse (BW)](load-sap-bw-data.md).

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define entities specific to SAP Business Warehouse Open Hub connector.

## Linked service properties

The following properties are supported for SAP Business Warehouse Open Hub linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **SapOpenHub** | Yes |
| server | Name of the server on which the SAP BW instance resides. | Yes |
| systemNumber | System number of the SAP BW system.<br/>Allowed value: two-digit decimal number represented as a string. | Yes |
| messageServer | The host name of the SAP message server.<br/>Use to connect to an SAP message server. | No |
| messageServerService | The service name or port number of the message server.<br/>Use to connect to an SAP message server. | No |
| systemId | The ID of the SAP system where the table is located.<br/>Use to connect to an SAP message server. | No |
| logonGroup | The logon group for the SAP system.<br/>Use to connect to an SAP message server. | No |
| clientId | Client ID of the client in the SAP W system.<br/>Allowed value: three-digit decimal number represented as a string. | Yes |
| language | Language that the SAP system uses. | No (default value is **EN**)|
| userName | Name of the user who has access to the SAP server. | Yes |
| password | Password for the user. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. A Self-hosted Integration Runtime is required as mentioned in [Prerequisites](#prerequisites). |Yes |

**Example:**

```json
{
    "name": "SapBwOpenHubLinkedService",
    "properties": {
        "type": "SapOpenHub",
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

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the SAP BW Open Hub dataset.

To copy data from and to SAP BW Open Hub, set the type property of the dataset to **SapOpenHubTable**. The following properties are supported.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **SapOpenHubTable**.  | Yes |
| openHubDestinationName | The name of the Open Hub Destination to copy data from. | Yes |

If you were setting `excludeLastRequest` and `baseRequestId` in dataset, it is still supported as-is, while you are suggested to use the new model in activity source going forward.

**Example:**

```json
{
    "name": "SAPBWOpenHubDataset",
    "properties": {
        "type": "SapOpenHubTable",
        "typeProperties": {
            "openHubDestinationName": "<open hub destination name>"
        },
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<SAP BW Open Hub linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by SAP BW Open Hub source.

### SAP BW Open Hub as source

To copy data from SAP BW Open Hub, the following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the copy activity source must be set to **SapOpenHubSource**. | Yes |
| excludeLastRequest | Whether to exclude the records of the last request. | No (default is **true**) |
| baseRequestId | The ID of request for delta loading. Once it is set, only data with requestId **larger than** the value of this property will be retrieved.  | No |
| customRfcReadTableFunctionModule | A custom RFC function module that can be used to read data from an SAP table. <br/> You can use a custom RFC function module to define how the data is retrieved from your SAP system and returned to the service. The custom function module must have an interface implemented (import, export, tables) that's similar to `/SAPDS/RFC_READ_TABLE2`, which is the default interface used by the service. | No |
| sapDataColumnDelimiter | The single character that is used as delimiter passed to SAP RFC to split the output data. | No |

>[!TIP]
>If your Open Hub table only contains the data generated by single request ID, for example, you always do full load and overwrite the existing data in the table, or you only run the DTP once for test, remember to uncheck the "excludeLastRequest" option in order to copy the data out.

To speed up the data loading, you can set [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) on the copy activity to load data from SAP BW Open Hub in parallel. For example, if you set `parallelCopies` to four, the service concurrently executes four RFC calls, and each RFC call retrieves a portion of data from your SAP BW Open Hub table partitioned by the DTP request ID and package ID. This applies when the number of unique DTP request ID + package ID is bigger than the value of `parallelCopies`. When copying data into file-based data store, it's also recommanded to write to a folder as multiple files (only specify folder name), in which case the performance is better than writing to a single file.

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSAPBWOpenHub",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SAP BW Open Hub input dataset name>",
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
                "type": "SapOpenHubSource",
                "excludeLastRequest": true
            },
            "sink": {
                "type": "<sink type>"
            },
            "parallelCopies": 4
        }
    }
]
```

## Data type mapping for SAP BW Open Hub

When copying data from SAP BW Open Hub, the following mappings are used from SAP BW data types to interim data types used internally within the service. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

| SAP ABAP Type | Interim service data type |
|:--- |:--- |
| C (String) | String |
| I (integer) | Int32 |
| F (Float) | Double |
| D (Date) | String |
| T (Time) | String |
| P (BCD Packed, Currency, Decimal, Qty) | Decimal |
| N (Numc) | String |
| X (Binary and Raw) | String |

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Troubleshooting tips

**Symptoms:** If you are running SAP BW on HANA and observe only subset of data is copied over using copy activity (1 million rows), the possible cause is that you enable "SAP HANA Execution" option in your DTP, in which case the service can only retrieve the first batch of data.

**Resolution:** Disable "SAP HANA Execution" option in DTP, reprocess the data, then try executing the copy activity again.

## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
