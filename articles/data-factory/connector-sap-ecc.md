---
title: Copy data from SAP ECC using Azure Data Factory | Microsoft Docs
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
ms.date: 04/26/2018
ms.author: jingwang

---
# Copy data from SAP ECC using Azure Data Factory

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from SAP ECC (SAP Enterprise Central Component). It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

You can copy data from SAP ECC to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this SAP ECC connector supports:

- Copying data from SAP ECC on SAP NetWeaver version 7.0 and above. 
- Copying data from any objects exposed by SAP ECC OData services (e.g. SAP Table/Views, BAPI, Data Extractors, etc.), or data/IDOCs sent to SAP PI that can be received as OData via relative Adapters.
- Copying data using basic authentication.

>[!TIP]
>To copy data from SAP ECC via SAP table/view, you can use [SAP Table](connector-sap-table.md) connector which is more performant and scalable.

## Prerequisites

Generally, SAP ECC exposes entities via OData services through SAP Gateway. To use this SAP ECC connector, you need to:

- **Set up SAP Gateway**. For servers with SAP NetWeaver version higher than 7.4, the SAP Gateway is already installed. Otherwise, you need to install imbedded Gateway or Gateway hub before exposing SAP ECC data through OData services. Learn how to set up SAP Gateway from [installation guide](https://help.sap.com/saphelp_gateway20sp12/helpdata/en/c3/424a2657aa4cf58df949578a56ba80/frameset.htm).

- **Activate and configure SAP OData service**. You can activate the OData Services through TCODE SICF in seconds. You can also configure which objects needs to be exposed. Here is a sample [step-by-step guidance](https://blogs.sap.com/2012/10/26/step-by-step-guide-to-build-an-odata-service-based-on-rfcs-part-1/).

## Getting started

You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

The following sections provide details about properties that are used to define Data Factory entities specific to SAP ECC connector.

## Linked service properties

The following properties are supported for SAP ECC linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **SapEcc** | Yes |
| url | The url of the SAP ECC OData service. |	Yes |
| username | The username used to connect to the SAP ECC. |	No |
| password | The plaintext password used to connect to the SAP ECC. | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Self-hosted Integration Runtime or Azure Integration Runtime (if your data store is publicly accessible). If not specified, it uses the default Azure Integration Runtime. |No |

**Example:**

```json
{
    "name": "SapECCLinkedService",
    "properties": {
        "type": "SapEcc",
        "typeProperties": {
            "url": "<SAP ECC OData url e.g. http://eccsvrname:8000/sap/opu/odata/sap/zgw100_dd02l_so_srv/>",
            "username": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            }
        }
    },
    "connectVia": {
        "referenceName": "<name of Integration Runtime>",
        "type": "IntegrationRuntimeReference"
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by SAP ECC dataset.

To copy data from SAP ECC, set the type property of the dataset to **SapEccResource**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| path | Path of the SAP ECC OData entity. | Yes |

**Example**

```json
{
    "name": "SapEccDataset",
    "properties": {
        "type": "SapEccResource",
        "typeProperties": {
            "path": "<entity path e.g. dd04tentitySet>"
        },
        "linkedServiceName": {
            "referenceName": "<SAP ECC linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by SAP ECC source.

### SAP ECC as source

To copy data from SAP ECC, set the source type in the copy activity to **SapEccSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **SapEccSource** | Yes |
| query | OData query options to filter data. Example: "$select=Name,Description&$top=10".<br/><br/>SAP ECC connector copies data from the combined URL: (url specified in linked service)/(path specified in dataset)?(query specified in copy activity source). Refer to [OData URL components](https://www.odata.org/documentation/odata-version-3-0/url-conventions/). | No |

**Example:**

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

## Data type mapping for SAP ECC

When copying data from SAP ECC, the following mappings are used from OData data types for SAP ECC data to Azure Data Factory interim data types. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

| OData data type | Data factory interim data type |
|:--- |:--- |
| Edm.Binary | String |
| Edm.Boolean | Bool |
| Edm.Byte | String |
| Edm.DateTime | DateTime |
| Edm.Decimal | Decimal |
| Edm.Double | Double |
| Edm.Single | Single |
| Edm.Guid | String |
| Edm.Int16 | Int16 |
| Edm.Int32 | Int32 |
| Edm.Int64 | Int64 |
| Edm.SByte | Int16 |
| Edm.String | String |
| Edm.Time | TimeSpan |
| Edm.DateTimeOffset | DateTimeOffset |

> [!NOTE]
> Complex data types are not supported now.

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
