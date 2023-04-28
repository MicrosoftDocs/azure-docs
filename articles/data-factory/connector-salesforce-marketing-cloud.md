---
title: Copy data from Salesforce Marketing Cloud
description: Learn how to copy data from Salesforce Marketing Cloud to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 11/01/2022
---

# Copy data from Salesforce Marketing Cloud using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in Azure Data Factory or Synapse Analytics pipelines to copy data from Salesforce Marketing Cloud. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

This Salesforce Marketing Cloud connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

The Salesforce Marketing Cloud connector supports OAuth 2 authentication, and it supports both legacy and enhanced package types. The connector is built on top of the [Salesforce Marketing Cloud REST API](https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/index-api.htm).

>[!NOTE]
>This connector doesn't support retrieving views, custom objects or custom data extensions.

## Getting started

You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

## Create a linked service to Salesforce Marketing Cloud using UI

Use the following steps to create a linked service to Salesforce Marketing Cloud in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for Salesforce and select the Salesforce Marketing Cloud connector.

   :::image type="content" source="media/connector-salesforce-marketing-cloud/salesforce-marketing-cloud-connector.png" alt-text="Select the Salesforce Marketing Cloud connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-salesforce-marketing-cloud/configure-salesforce-marketing-cloud-linked-service.png" alt-text="Configure a linked service to Salesforce Marketing Cloud.":::
   
>[!NOTE]
> The API integration scope on the Salesforce Marketing Cloud must be set to Hub | Campaign | Read in order for the connector to succeed.

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Salesforce Marketing Cloud connector.

## Linked service properties

The following properties are supported for Salesforce Marketing Cloud linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **SalesforceMarketingCloud** | Yes |
| connectionProperties | A group of properties that defines how to connect to Salesforce Marketing Cloud. | Yes |
| ***Under `connectionProperties`:*** | | |
| authenticationType | Specifies the authentication method to use. Allowed values are `Enhanced sts OAuth 2.0` or `OAuth_2.0`.<br><br>Salesforce Marketing Cloud legacy package only supports `OAuth_2.0`, while enhanced package needs `Enhanced sts OAuth 2.0`. <br>Since August 1, 2019, Salesforce Marketing Cloud has removed the ability to create legacy packages. All new packages are enhanced packages. | Yes |
| host | For enhanced package, the host should be your [subdomain](https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/your-subdomain-tenant-specific-endpoints.htm) which is represented by a 28-character string starting with the letters "mc", e.g. `mc563885gzs27c5t9-63k636ttgm`. <br>For legacy package, specify `www.exacttargetapis.com`. | Yes |
| clientId | The client ID associated with the Salesforce Marketing Cloud application.  | Yes |
| clientSecret | The client secret associated with the Salesforce Marketing Cloud application. You can choose to mark this field as a SecureString to store it securely in the service, or store the secret in Azure Key Vault and let the service copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | Yes |
| useEncryptedEndpoints | Specifies whether the data source endpoints are encrypted using HTTPS. The default value is true.  | No |
| useHostVerification | Specifies whether to require the host name in the server's certificate to match the host name of the server when connecting over TLS. The default value is true.  | No |
| usePeerVerification | Specifies whether to verify the identity of the server when connecting over TLS. The default value is true.  | No |

**Example: using enhanced STS OAuth 2 authentication for enhanced package** 

```json
{
    "name": "SalesforceMarketingCloudLinkedService",
    "properties": {
        "type": "SalesforceMarketingCloud",
        "typeProperties": {
            "connectionProperties": {
                "host": "<subdomain e.g. mc563885gzs27c5t9-63k636ttgm>",
                "authenticationType": "Enhanced sts OAuth 2.0",
                "clientId": "<clientId>",
                "clientSecret": {
                     "type": "SecureString",
                     "value": "<clientSecret>"
            	},
                "useEncryptedEndpoints": true,
                "useHostVerification": true,
                "usePeerVerification": true
            }
        }
    }
}

```

**Example: using OAuth 2 authentication for legacy package** 

```json
{
    "name": "SalesforceMarketingCloudLinkedService",
    "properties": {
        "type": "SalesforceMarketingCloud",
        "typeProperties": {
            "connectionProperties": {
                "host": "www.exacttargetapis.com",
                "authenticationType": "OAuth_2.0",
                "clientId": "<clientId>",
                "clientSecret": {
                     "type": "SecureString",
                     "value": "<clientSecret>"
            	},
                "useEncryptedEndpoints": true,
                "useHostVerification": true,
                "usePeerVerification": true
            }
        }
    }
}

```

If you were using Salesforce Marketing Cloud linked service with the following payload, it is still supported as-is, while you are suggested to use the new one going forward which adds enhanced package support.

```json
{
    "name": "SalesforceMarketingCloudLinkedService",
    "properties": {
        "type": "SalesforceMarketingCloud",
        "typeProperties": {
            "clientId": "<clientId>",
            "clientSecret": {
                 "type": "SecureString",
                 "value": "<clientSecret>"
            },
            "useEncryptedEndpoints": true,
            "useHostVerification": true,
            "usePeerVerification": true
        }
    }
}

```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Salesforce Marketing Cloud dataset.

To copy data from Salesforce Marketing Cloud, set the type property of the dataset to **SalesforceMarketingCloudObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **SalesforceMarketingCloudObject** | Yes |
| tableName | Name of the table. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "SalesforceMarketingCloudDataset",
    "properties": {
        "type": "SalesforceMarketingCloudObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<SalesforceMarketingCloud linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Salesforce Marketing Cloud source.

### Salesforce Marketing Cloud as source

To copy data from Salesforce Marketing Cloud, set the source type in the copy activity to **SalesforceMarketingCloudSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **SalesforceMarketingCloudSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSalesforceMarketingCloud",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SalesforceMarketingCloud input dataset name>",
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
                "type": "SalesforceMarketingCloudSource",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

>[!Note]
> Contacts table is not supported.

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
