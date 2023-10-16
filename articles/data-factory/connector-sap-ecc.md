---
title: Copy data from SAP ECC
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from SAP ECC to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
author: jianleishen
ms.author: ulrichchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 10/25/2022
---

# Copy data from SAP ECC using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the copy activity in Azure Data Factory to copy data from SAP Enterprise Central Component (ECC). For more information, see [Copy activity overview](copy-activity-overview.md).

>[!TIP]
>To learn the overall support on SAP data integration scenario, see [SAP data integration using Azure Data Factory whitepaper](https://github.com/Azure/Azure-DataFactory/blob/master/whitepaper/SAP%20Data%20Integration%20using%20Azure%20Data%20Factory.pdf) with detailed introduction on each SAP connector, comparison and guidance.

## Supported capabilities

This SAP ECC connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For a list of data stores that are supported as sources or sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

Specifically, this SAP ECC connector supports:

- Copying data from SAP ECC on SAP NetWeaver version 7.0 and later.
- Copying data from any objects exposed by SAP ECC OData services, such as:

  - SAP tables or views.
  - Business Application Programming Interface [BAPI] objects.
  - Data extractors.
  - Data or intermediate documents (IDOCs) sent to SAP Process Integration (PI) that can be received as OData via relative adapters.

- Copying data by using basic authentication.

The version 7.0 or later refers to SAP NetWeaver version instead of SAP ECC version. For example, SAP ECC 6.0 EHP 7 in general has NetWeaver version >=7.4. In case you are unsure about your environment, here are the steps to confirm the version from your SAP system:

1. Use SAP GUI to connect to the SAP System. 
2. Go to **System** -> **Status**. 
3. Check the release of the SAP_BASIS, ensure it is equal to or larger than 701.  
      :::image type="content" source="./media/connector-sap-table/sap-basis.png" alt-text="Check SAP_BASIS":::

>[!TIP]
>To copy data from SAP ECC via an SAP table or view, use the [SAP table](connector-sap-table.md) connector, which is faster and more scalable.

## Prerequisites

To use this SAP ECC connector, you need to expose the SAP ECC entities via OData services through SAP Gateway. More specifically:

- **Set up SAP Gateway**. For servers with SAP NetWeaver versions later than 7.4, SAP Gateway is already installed. For earlier versions, you must install the embedded SAP Gateway or the SAP Gateway hub system before exposing SAP ECC data through OData services. To set up SAP Gateway, see the [installation guide](https://help.sap.com/saphelp_gateway20sp12/helpdata/en/c3/424a2657aa4cf58df949578a56ba80/frameset.htm).

- **Activate and configure the SAP OData service**. You can activate the OData service through TCODE SICF in seconds. You can also configure which objects need to be exposed. For more information, see the [step-by-step guidance](https://blogs.sap.com/2012/10/26/step-by-step-guide-to-build-an-odata-service-based-on-rfcs-part-1/).

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to SAP ECC using UI

Use the following steps to create a linked service to SAP ECC in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for SAP and select the SAP ECC connector.

    :::image type="content" source="media/connector-sap-ecc/sap-ecc-connector.png" alt-text="Screenshot of the SAP ECC connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-sap-ecc/configure-sap-ecc-linked-service.png" alt-text="Screenshot of linked service configuration for SAP ECC.":::

## Connector configuration details

The following sections provide details about properties that are used to define the entities specific to the SAP ECC connector.

## Linked service properties

The following properties are supported for the SAP ECC linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| `type` | The `type` property must be set to `SapEcc`. | Yes |
| `url` | The URL of the SAP ECC OData service. | Yes |
| `username` | The username used to connect to SAP ECC. | No |
| `password` | The plaintext password used to connect to SAP ECC. | No |
| `connectVia` | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If you don't specify a runtime, the default Azure integration runtime is used. | No |

### Example

```json
{
    "name": "SapECCLinkedService",
    "properties": {
        "type": "SapEcc",
        "typeProperties": {
            "url": "<SAP ECC OData URL, e.g., http://eccsvrname:8000/sap/opu/odata/sap/zgw100_dd02l_so_srv/>",
            "username": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            }
        }
    },
    "connectVia": {
        "referenceName": "<name of integration runtime>",
        "type": "IntegrationRuntimeReference"
    }
}
```

## Dataset properties

For a full list of the sections and properties available for defining datasets, see [Datasets](concepts-datasets-linked-services.md). The following section provides a list of the properties supported by the SAP ECC dataset.

To copy data from SAP ECC, set the `type` property of the dataset to `SapEccResource`.

The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| `path` | Path of the SAP ECC OData entity. | Yes |

### Example

```json
{
    "name": "SapEccDataset",
    "properties": {
        "type": "SapEccResource",
        "typeProperties": {
            "path": "<entity path, e.g., dd04tentitySet>"
        },
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<SAP ECC linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of the sections and properties available for defining activities, see [Pipelines](concepts-pipelines-activities.md). The following section provides a list of the properties supported by the SAP ECC source.

### SAP ECC as a source

To copy data from SAP ECC, set the `type` property in the `source` section of the copy activity to `SapEccSource`.

The following properties are supported in the copy activity's `source` section:

| Property | Description | Required |
|:--- |:--- |:--- |
| `type` | The `type` property of the copy activity's `source` section must be set to `SapEccSource`. | Yes |
| `query` | The OData query options to filter the data. For example:<br/><br/>`"$select=Name,Description&$top=10"`<br/><br/>The SAP ECC connector copies data from the combined URL:<br/><br/>`<URL specified in the linked service>/<path specified in the dataset>?<query specified in the copy activity's source section>`<br/><br/>For more information, see [OData URL components](https://www.odata.org/documentation/odata-version-3-0/url-conventions/). | No |
| `sapDataColumnDelimiter` | The single character that is used as delimiter passed to SAP RFC to split the output data. | No |
| `httpRequestTimeout` | The timeout (the **TimeSpan** value) for the HTTP request to get a response. This value is the timeout to get a response, not the timeout to read response data. If not specified, the default value is **00:30:00** (30 minutes). | No |

### Example

```json
"activities":[
    {
        "name": "CopyFromSAPECC",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SAP ECC input dataset name>",
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
                "type": "SapEccSource",
                "query": "$top=10"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Data type mappings for SAP ECC

When you're copying data from SAP ECC, the following mappings are used from OData data types for SAP ECC data to interim data types the service uses internally. To learn how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| OData data type | Interim service data type |
|:--- |:--- |
| `Edm.Binary` | `String` |
| `Edm.Boolean` | `Bool` |
| `Edm.Byte` | `String` |
| `Edm.DateTime` | `DateTime` |
| `Edm.Decimal` | `Decimal` |
| `Edm.Double` | `Double` |
| `Edm.Single` | `Single` |
| `Edm.Guid` | `String` |
| `Edm.Int16` | `Int16` |
| `Edm.Int32` | `Int32` |
| `Edm.Int64` | `Int64` |
| `Edm.SByte` | `Int16` |
| `Edm.String` | `String` |
| `Edm.Time` | `TimeSpan` |
| `Edm.DateTimeOffset` | `DateTimeOffset` |

> [!NOTE]
> Complex data types aren't currently supported.

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Next steps

For a list of the data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
