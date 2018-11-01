---
title: Copy data from OData sources by using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from OData sources to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/22/2018
ms.author: jingwang

---
# Copy data from an OData source by using Azure Data Factory

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-odata-connector.md)
> * [Current version](connector-odata.md)

This article outlines how to use Copy Activity in Azure Data Factory to copy data from an OData source. The article builds on [Copy Activity in Azure Data Factory](copy-activity-overview.md), which presents a general overview of Copy Activity.

## Supported capabilities

You can copy data from an OData source to any supported sink data store. For a list of data stores that Copy Activity supports as sources and sinks, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).

Specifically, this OData connector supports:

- OData version 3.0 and 4.0.
- Copying data by using one of the following authentications: **Anonymous**, **Basic**, or **Windows**.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties you can use to define Data Factory entities that are specific to an OData connector.

## Linked service properties

The following properties are supported for an OData linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property must be set to **OData**. |Yes |
| url | The root URL of the OData service. |Yes |
| authenticationType | The type of authentication used to connect to the OData source. Allowed values are **Anonymous**, **Basic**, and **Windows**. OAuth isn't supported. | Yes |
| userName | Specify **userName** if you use Basic or Windows authentication. | No |
| password | Specify **password** for the user account you specified for **userName**. Mark this field as a **SecureString** type to store it securely in Data Factory. You also can [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to use to connect to the data store. You can choose Azure Integration Runtime or a self-hosted Integration Runtime (if your data store is located in a private network). If not specified, the default Azure Integration Runtime is used. |No |

**Example 1: Using Anonymous authentication**

```json
{
    "name": "ODataLinkedService",
    "properties": {
        "type": "OData",
        "typeProperties": {
            "url": "http://services.odata.org/OData/OData.svc",
            "authenticationType": "Anonymous"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example 2: Using Basic authentication**

```json
{
    "name": "ODataLinkedService",
    "properties": {
        "type": "OData",
        "typeProperties": {
            "url": "<endpoint of OData source>",
            "authenticationType": "Basic",
            "userName": "<user name>",
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

**Example 3: Using Windows authentication**

```json
{
    "name": "ODataLinkedService",
    "properties": {
        "type": "OData",
        "typeProperties": {
            "url": "<endpoint of on-premises OData source>",
            "authenticationType": "Windows",
            "userName": "<domain>\\<user>",
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

This section provides a list of properties that the OData dataset supports.

For a full list of sections and properties that are available for defining datasets, see [Datasets and linked services](concepts-datasets-linked-services.md). 

To copy data from OData, set the **type** property of the dataset to **ODataResource**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the dataset must be set to **ODataResource**. | Yes |
| path | The path to the OData resource. | Yes |

**Example**

```json
{
    "name": "ODataDataset",
    "properties":
    {
        "type": "ODataResource",
        "linkedServiceName": {
            "referenceName": "<OData linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties":
        {
            "path": "Products"
        }
    }
}
```

## Copy Activity properties

This section provides a list of properties that the OData source supports.

For a full list of sections and properties that are available for defining activities, see [Pipelines](concepts-pipelines-activities.md). 

### OData as source

To copy data from OData, set the **source** type in Copy Activity to **RelationalSource**. The following properties are supported in the Copy Activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the Copy Activity source must be set to **RelationalSource**. | Yes |
| query | OData query options for filtering data. Example: `"?$select=Name,Description&$top=5"`.<br/><br/>**Note**: The OData connector copies data from the combined URL: `[URL specified in linked service]/[path specified in dataset][query specified in copy activity source]`. For more information, see [OData URL components](http://www.odata.org/documentation/odata-version-3-0/url-conventions/). | No |

**Example**

```json
"activities":[
    {
        "name": "CopyFromOData",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<OData input dataset name>",
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
                "query": "?$select=Name,Description&$top=5"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Data type mapping for OData

When you copy data from OData, the following mappings are used between OData data types and Azure Data Factory interim data types. To learn how Copy Activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| OData data type | Data Factory interim data type |
|:--- |:--- |
| Edm.Binary | Byte[] |
| Edm.Boolean | Bool |
| Edm.Byte | Byte[] |
| Edm.DateTime | DateTime |
| Edm.Decimal | Decimal |
| Edm.Double | Double |
| Edm.Single | Single |
| Edm.Guid | Guid |
| Edm.Int16 | Int16 |
| Edm.Int32 | Int32 |
| Edm.Int64 | Int64 |
| Edm.SByte | Int16 |
| Edm.String | String |
| Edm.Time | TimeSpan |
| Edm.DateTimeOffset | DateTimeOffset |

> [!NOTE]
> OData complex data types (such as **Object**) aren't supported.


## Next steps

For a list of data stores that Copy Activity supports as sources and sinks in Azure Data Factory, see [Supported data stores and formats](copy-activity-overview.md##supported-data-stores-and-formats).