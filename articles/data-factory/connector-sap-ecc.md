---
title: Copy data from SAP ECC by using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from SAP ECC to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 07/02/2019
ms.author: jingwang

---
# Copy data from SAP ECC by using Azure Data Factory

This article outlines how to use the copy activity in Azure Data Factory to copy data from SAP Enterprise Central Component (ECC). For more information, see [Copy activity overview](copy-activity-overview.md).

## Supported capabilities

You can copy data from SAP ECC to any supported sink data store. For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this SAP ECC connector supports:

- Copying data from SAP ECC on SAP NetWeaver version 7.0 and later.
- Copying data from any objects exposed by SAP ECC OData services, such as:

  - SAP tables or views.
  - Business Application Programming Interface [BAPI] objects.
  - Data extractors.
  - Data or intermediate documents (IDOCs) sent to SAP Process Integration (PI) that can be received as OData via relative adapters.

- Copying data by using basic authentication.

>[!TIP]
>To copy data from SAP ECC via an SAP table or view, use the [SAP table](connector-sap-table.md) connector, which is faster and more scalable.

## Prerequisites

Generally, SAP ECC exposes entities via OData services through SAP Gateway. To use this SAP ECC connector, you need to:

- **Set up SAP Gateway**. For servers with SAP NetWeaver versions later than 7.4, SAP Gateway is already installed. For earlier versions, you must install the embedded SAP Gateway or the SAP Gateway hub system before exposing SAP ECC data through OData services. To set up SAP Gateway, see the [installation guide](https://help.sap.com/saphelp_gateway20sp12/helpdata/en/c3/424a2657aa4cf58df949578a56ba80/frameset.htm).

- **Activate and configure the SAP OData service**. You can activate the OData service through TCODE SICF in seconds. You can also configure which objects need to be exposed. For more information, see the [step-by-step guidance](https://blogs.sap.com/2012/10/26/step-by-step-guide-to-build-an-odata-service-based-on-rfcs-part-1/).

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define the Data Factory entities specific to the SAP ECC connector.

## Linked service properties

The following properties are supported for the SAP ECC linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| `type` | The `type` property must be set to `SapEcc`. | Yes |
| `url` | The URL of the SAP ECC OData service. | Yes |
| `username` | The username used to connect to SAP ECC. | No |
| `password` | The plaintext password used to connect to SAP ECC. | No |
| `connectVia` | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use a self-hosted integration runtime or the Azure integration runtime (if your data store is publicly accessible). If you don't specify a runtime, `connectVia` uses the default Azure integration runtime. | No |

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

When you're copying data from SAP ECC, the following mappings are used from OData data types for SAP ECC data to Azure Data Factory interim data types. To learn how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| OData data type | Data Factory interim data type |
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

## Next steps

For a list of the data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
