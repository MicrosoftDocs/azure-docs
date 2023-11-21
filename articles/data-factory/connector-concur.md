---
title: Copy data from Concur (Preview) 
description: Learn how to copy data from Concur to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/20/2023
ms.author: jianleishen
---
# Copy data from Concur using Azure Data Factory or Synapse Analytics(Preview)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from Concur. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!IMPORTANT]
> This connector is currently in preview. You can try it out and give us feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

## Supported capabilities

This Concur connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

> [!NOTE]
> Partner account is currently not supported.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Concur using UI

Use the following steps to create a linked service to Concur in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Concur and select the Concur connector.

   :::image type="content" source="media/connector-concur/concur-connector.png" alt-text="Screenshot of the Concur connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-concur/configure-concur-linked-service.png" alt-text="Screenshot of linked service configuration for Concur.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Concur connector.

## Linked service properties

The following properties are supported for Concur linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Concur** | Yes |
| connectionProperties | A group of properties that defines how to connect to Concur. | Yes |
| ***Under `connectionProperties`:*** | | |
| authenticationType | Allowed values are `OAuth_2.0_Bearer` and `OAuth_2.0` (legacy). The OAuth 2.0 authentication option works with the old Concur API which was deprecated since Feb 2017. | Yes |
| host | The endpoint of the Concur server, e.g. `implementation.concursolutions.com`.  | Yes |
| baseUrl | The base URL of your Concur's authorization URL. | Yes for `OAuth_2.0_Bearer` authentication |
| clientId | Application client ID supplied by Concur App Management.  | Yes |
| clientSecret | The client secret corresponding to the client ID. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes for `OAuth_2.0_Bearer` authentication |
| username | The user name that you use to access Concur service. | Yes |
| password | The password corresponding to the user name that you provided in the username field. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| useEncryptedEndpoints | Specifies whether the data source endpoints are encrypted using HTTPS. The default value is true.  | No |
| useHostVerification | Specifies whether to require the host name in the server's certificate to match the host name of the server when connecting over TLS. The default value is true.  | No |
| usePeerVerification | Specifies whether to verify the identity of the server when connecting over TLS. The default value is true.  | No |

**Example:**

```json
{ 
    "name": "ConcurLinkedService", 
    "properties": {
        "type": "Concur",
        "typeProperties": {
            "connectionProperties": {
                "host":"<host e.g. implementation.concursolutions.com>",
                "baseUrl": "<base URL for authorization e.g. us-impl.api.concursolutions.com>",
                "authenticationType": "OAuth_2.0_Bearer",
                "clientId": "<client id>",
                "clientSecret": {
                    "type": "SecureString",
                    "value": "<client secret>"
                },
                "username": "fakeUserName",
                "password": {
                    "type": "SecureString",
                    "value": "<password>"
                },
                "useEncryptedEndpoints": true,
                "useHostVerification": true,
                "usePeerVerification": true
            }
        }
    }
} 
```

**Example (legacy):**

Note the following is a legacy linked service model without `connectionProperties` and using `OAuth_2.0` authentication.

```json
{
    "name": "ConcurLinkedService",
    "properties": {
        "type": "Concur",
        "typeProperties": {
            "clientId" : "<clientId>",
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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Concur dataset.

To copy data from Concur, set the type property of the dataset to **ConcurObject**. There is no additional type-specific property in this type of dataset. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **ConcurObject** | Yes |
| tableName | Name of the table. | No (if "query" in activity source is specified) |


**Example**

```json
{
    "name": "ConcurDataset",
    "properties": {
        "type": "ConcurObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Concur linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Concur source.

### ConcurSource as source

To copy data from Concur, set the source type in the copy activity to **ConcurSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **ConcurSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM Opportunities where Id = xxx "`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromConcur",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Concur input dataset name>",
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
                "type": "ConcurSource",
                "query": "SELECT * FROM Opportunities where Id = xxx"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
