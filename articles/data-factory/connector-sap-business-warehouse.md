---
title: Copy data from SAP BW
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from SAP Business Warehouse to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
author: jianleishen
ms.author: ulrichchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 10/25/2022
---

# Copy data from SAP Business Warehouse using Azure Data Factory or Synapse Analytics
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-sap-business-warehouse-connector.md)
> * [Current version](connector-sap-business-warehouse.md)
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data from an SAP Business Warehouse (BW). It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

>[!TIP]
>To learn the service's overall support on SAP data integration scenario, see [SAP data integration using Azure Data Factory whitepaper](https://github.com/Azure/Azure-DataFactory/blob/master/whitepaper/SAP%20Data%20Integration%20using%20Azure%20Data%20Factory.pdf) with detailed introduction on each SAP connector, comparison and guidance.

## Supported capabilities

This SAP Business Warehouse connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this SAP Business Warehouse connector supports:

- SAP Business Warehouse **version 7.x**.
- Copying data from **InfoCubes and QueryCubes** (including BEx queries) using MDX queries.
- Copying data using basic authentication.

>[!NOTE]
>The SAP Business Warehouse connector does not currently support parameters with MDX.  If filtering with MDX parameters is required you can consider using the alternative [SAP Open Hub connector](connector-sap-business-warehouse-open-hub.md) instead.

## Prerequisites

To use this SAP Business Warehouse connector, you need to:

- Set up a Self-hosted Integration Runtime. See [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md) article for details.
- Install the **SAP NetWeaver library** on the Integration Runtime machine. You can get the SAP Netweaver library from your SAP administrator, or directly from the [SAP Software Download Center](https://support.sap.com/swdc). Search for the **SAP Note #1025361** to get the download location for the most recent version. Make sure that you pick the **64-bit** SAP NetWeaver library which matches your Integration Runtime installation. Then install all files included in the SAP NetWeaver RFC SDK according to the SAP Note. The SAP NetWeaver library is also included in the SAP Client Tools installation.

>[!TIP]
>To troubleshoot connectivity issue to SAP BW, make sure:
>- All dependency libraries extracted from the NetWeaver RFC SDK are in place in the %windir%\system32 folder. Usually it has icudt34.dll, icuin34.dll, icuuc34.dll, libicudecnumber.dll, librfc32.dll, libsapucum.dll, sapcrypto.dll, sapcryto_old.dll, sapnwrfc.dll.
>- The needed ports used to connect to SAP Server are enabled on the Self-hosted IR machine, which usually are port 3300 and 3201.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to SAP BW using UI

Use the following steps to create a linked service to SAP BW in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for SAP and select the SAP BW via MDX connector.

    :::image type="content" source="media/connector-sap-business-warehouse/sap-business-warehouse-connector.png" alt-text="Select the SAP BW via MDX connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-sap-business-warehouse/configure-sap-business-warehouse-linked-service.png" alt-text="Configure a linked service to SAP BW.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to SAP Business Warehouse connector.

## Linked service properties

The following properties are supported for SAP Business Warehouse (BW) linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **SapBw** | Yes |
| server | Name of the server on which the SAP BW instance resides. | Yes |
| systemNumber | System number of the SAP BW system.<br/>Allowed value: two-digit decimal number represented as a string. | Yes |
| clientId | Client ID of the client in the SAP W system.<br/>Allowed value: three-digit decimal number represented as a string. | Yes |
| userName | Name of the user who has access to the SAP server. | Yes |
| password | Password for the user. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. A Self-hosted Integration Runtime is required as mentioned in [Prerequisites](#prerequisites). |Yes |

**Example:**

```json
{
    "name": "SapBwLinkedService",
    "properties": {
        "type": "SapBw",
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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by SAP BW dataset.

To copy data from SAP BW, set the type property of the dataset to **SapBwCube**. While there are no type-specific properties supported for the SAP BW dataset of type RelationalTable.

**Example:**

```json
{
    "name": "SAPBWDataset",
    "properties": {
        "type": "SapBwCube",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<SAP BW linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

If you were using `RelationalTable` typed dataset, it is still supported as-is, while you are suggested to use the new one going forward.

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by SAP BW source.

### SAP BW as source

To copy data from SAP BW, the following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **SapBwSource** | Yes |
| query | Specifies the MDX query to read data from the SAP BW instance. | Yes |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSAPBW",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SAP BW input dataset name>",
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
                "type": "SapBwSource",
                "query": "<MDX query for SAP BW>"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

If you were using `RelationalSource` typed source, it is still supported as-is, while you are suggested to use the new one going forward.

## Data type mapping for SAP BW

When copying data from SAP BW, the following mappings are used from SAP BW data types to interim data types used internally within the service. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

| SAP BW data type | Interim service data type |
|:--- |:--- |
| ACCP | Int |
| CHAR | String |
| CLNT | String |
| CURR | Decimal |
| CUKY | String |
| DEC | Decimal |
| FLTP | Double |
| INT1 | Byte |
| INT2 | Int16 |
| INT4 | Int |
| LANG | String |
| LCHR | String |
| LRAW | Byte[] |
| PREC | Int16 |
| QUAN | Decimal |
| RAW | Byte[] |
| RAWSTRING | Byte[] |
| STRING | String |
| UNIT | String |
| DATS | String |
| NUMC | String |
| TIMS | String |


## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).


## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
