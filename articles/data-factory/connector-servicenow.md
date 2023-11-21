---
title: Copy data from ServiceNow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from ServiceNow to supported sink data stores by using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 10/20/2023
---

# Copy data from ServiceNow using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data from ServiceNow. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

This ServiceNow connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

The service provides a built-in driver to enable connectivity.  Therefore you don't need to manually install any driver using this connector.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to ServiceNow using UI

Use the following steps to create a linked service to ServiceNow in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for ServiceNow and select the ServiceNow connector.

    :::image type="content" source="media/connector-servicenow/servicenow-connector.png" alt-text="Select the ServiceNow connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-servicenow/configure-servicenow-linked-service.png" alt-text="Configure a linked service to ServiceNow.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to ServiceNow connector.

## Linked service properties

The following properties are supported for ServiceNow linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **ServiceNow** | Yes |
| endpoint | The endpoint of the ServiceNow server (`http://<instance>.service-now.com`).  | Yes |
| authenticationType | The authentication type to use. <br/>Allowed values are: **Basic**, **OAuth2** | Yes |
| username | The user name used to connect to the ServiceNow server for Basic and OAuth2 authentication.  | Yes |
| password | The password corresponding to the user name for Basic and OAuth2 authentication. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| clientId | The client ID for OAuth2 authentication.  | No |
| clientSecret | The client secret for OAuth2 authentication. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| useEncryptedEndpoints | Specifies whether the data source endpoints are encrypted using HTTPS. The default value is true.  | No |
| useHostVerification | Specifies whether to require the host name in the server's certificate to match the host name of the server when connecting over TLS. The default value is true.  | No |
| usePeerVerification | Specifies whether to verify the identity of the server when connecting over TLS. The default value is true.  | No |

**Example:**

```json
{
    "name": "ServiceNowLinkedService",
    "properties": {
        "type": "ServiceNow",
        "typeProperties": {
            "endpoint" : "http://<instance>.service-now.com",
            "authenticationType" : "Basic",
            "username" : "<username>",
            "password": {
                 "type": "SecureString",
                 "value": "<password>"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by ServiceNow dataset.

To copy data from ServiceNow, set the type property of the dataset to **ServiceNowObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **ServiceNowObject** | Yes |
| tableName | Name of the table. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "ServiceNowDataset",
    "properties": {
        "type": "ServiceNowObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<ServiceNow linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by ServiceNow source.

### ServiceNow as source

To copy data from ServiceNow, set the source type in the copy activity to **ServiceNowSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **ServiceNowSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM Actual.alm_asset"`. | No (if "tableName" in dataset is specified) |

Note the following when specifying the schema and column for ServiceNow in query, and **refer to [Performance tips](#performance-tips) on copy performance implication**.

- **Schema:** specify the schema as `Actual` or `Display` in the ServiceNow query, which you can look at it as the parameter of `sysparm_display_value` as true or false when calling [ServiceNow REST APIs](https://developer.servicenow.com/app.do#!/rest_api_doc?v=jakarta&id=r_AggregateAPI-GET). 
- **Column:** the column name for actual value under `Actual` schema is `[column name]_value`, while for display value under `Display` schema is `[column name]_display_value`. Note the column name need map to the schema being used in the query.

**Sample query:**
`SELECT col_value FROM Actual.alm_asset`
OR 
`SELECT col_display_value FROM Display.alm_asset`

**Example:**

```json
"activities":[
    {
        "name": "CopyFromServiceNow",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<ServiceNow input dataset name>",
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
                "type": "ServiceNowSource",
                "query": "SELECT * FROM Actual.alm_asset"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```
## Performance tips

### Schema to use

ServiceNow has 2 different schemas, one is **"Actual"** which returns actual data, the other is **"Display"** which returns the display values of data. 

If you have a filter in your query, use "Actual" schema which has better copy performance. When querying against "Actual" schema, ServiceNow natively support filter when fetching the data to only return the filtered resultset, whereas when querying "Display" schema, ADF retrieve all the data and apply filter internally.

### Index

ServiceNow table index can help improve query performance, refer to [Create a table index](https://docs.servicenow.com/bundle/quebec-platform-administration/page/administer/table-administration/task/t_CreateCustomIndex.html).

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).


## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
