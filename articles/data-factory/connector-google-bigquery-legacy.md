---
title: Copy data from Google BigQuery V1
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from Google BigQuery V1 to supported sink data stores by using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
ms.author: jianleishen
author: jianleishen
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 01/26/2025
---

# Copy data from Google BigQuery V1 using Azure Data Factory or Synapse Analytics 
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data from Google BigQuery. It builds on the [Copy Activity overview](copy-activity-overview.md) article that presents a general overview of the copy activity.

> [!IMPORTANT]
> The [Google BigQuery V2 connector](connector-google-bigquery.md) provides improved native Google BigQuery support. If you are using the [Google BigQuery V1 connector](connector-google-bigquery-legacy.md) in your solution, please [upgrade your Google BigQuery connector](connector-google-bigquery.md#upgrade-the-google-bigquery-linked-service) as V1 is at [End of Support stage](connector-deprecation-plan.md). Refer to this [section](connector-google-bigquery.md#differences-between-google-bigquery-and-google-bigquery-legacy) for details on the difference between V2 and V1.

## Supported capabilities

This Google BigQuery connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

The service provides a built-in driver to enable connectivity. Therefore, you don't need to manually install a driver to use this connector.

The connector supports the Windows versions in this [article](create-self-hosted-integration-runtime.md#prerequisites).

>[!NOTE]
>This Google BigQuery connector is built on top of the BigQuery APIs. Be aware that BigQuery limits the maximum rate of incoming requests and enforces appropriate quotas on a per-project basis, refer to [Quotas & Limits - API requests](https://cloud.google.com/bigquery/quotas#api_requests). Make sure you do not trigger too many concurrent requests to the account.

## Prerequisites

To use this connector, you need the following minimum permissions of Google BigQuery:
- bigquery.connections.*
- bigquery.datasets.*
- bigquery.jobs.*
- bigquery.readsessions.*
- bigquery.routines.*
- bigquery.tables.*

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Google BigQuery using UI

Use the following steps to create a linked service to Google BigQuery in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Google and select the Google BigQuery connector.

    :::image type="content" source="media/connector-google-bigquery-legacy/google-bigquery-legacy-connector.png" alt-text="Screenshot of the Google BigQuery connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-google-bigquery-legacy/configure-google-bigquery-legacy-linked-service.png" alt-text="Screenshot of linked service configuration for Google BigQuery.":::

## Connector configuration details

The following sections provide details about properties that are used to define entities specific to the Google BigQuery connector.

## Linked service properties

The following properties are supported for the Google BigQuery linked service.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **GoogleBigQuery**. | Yes |
| project | The project ID of the default BigQuery project to query against.  | Yes |
| additionalProjects | A comma-separated list of project IDs of public BigQuery projects to access.  | No |
| requestGoogleDriveScope | Whether to request access to Google Drive. Allowing Google Drive access enables support for federated tables that combine BigQuery data with data from Google Drive. The default value is **false**.  | No |
| authenticationType | The OAuth 2.0 authentication mechanism used for authentication. ServiceAuthentication can be used only on Self-hosted Integration Runtime. <br/>Allowed values are **UserAuthentication** and **ServiceAuthentication**. Refer to sections below this table on more properties and JSON samples for those authentication types respectively. | Yes |

### Using user authentication

Set "authenticationType" property to **UserAuthentication**, and specify the following properties along with generic properties described in the previous section:

| Property | Description | Required |
|:--- |:--- |:--- |
| clientId | ID of the application used to generate the refresh token. | Yes |
| clientSecret | Secret of the application used to generate the refresh token. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| refreshToken | The refresh token obtained from Google used to authorize access to BigQuery. Learn how to get one from [Obtaining OAuth 2.0 access tokens](https://developers.google.com/identity/protocols/OAuth2WebServer#obtainingaccesstokens) and [this community blog](https://jpd.ms/getting-your-bigquery-refresh-token-for-azure-datafactory-f884ff815a59). Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |

The minimum scope required to obtain an OAuth 2.0 refresh token is `https://www.googleapis.com/auth/bigquery.readonly`. If you plan to run a query that might return large results, other scope might be required. For more information, refer to this [article](https://cloud.google.com/bigquery/docs/writing-results#large-results). 

**Example:**

```json
{
    "name": "GoogleBigQueryLinkedService",
    "properties": {
        "type": "GoogleBigQuery",
        "typeProperties": {
            "project" : "<project ID>",
            "additionalProjects" : "<additional project IDs>",
            "requestGoogleDriveScope" : true,
            "authenticationType" : "UserAuthentication",
            "clientId": "<id of the application used to generate the refresh token>",
            "clientSecret": {
                "type": "SecureString",
                "value":"<secret of the application used to generate the refresh token>"
            },
            "refreshToken": {
                "type": "SecureString",
                "value": "<refresh token>"
            }
        }
    }
}
```

### Using service authentication

Set "authenticationType" property to **ServiceAuthentication**, and specify the following properties along with generic properties described in the previous section. This authentication type can be used only on Self-hosted Integration Runtime.

| Property | Description | Required |
|:--- |:--- |:--- |
| email | The service account email ID that is used for ServiceAuthentication. It can be used only on Self-hosted Integration Runtime.  | No |
| keyFilePath | The full path to the `.json` key file that is used to authenticate the service account email address. | Yes |
| trustedCertPath | The full path of the .pem file that contains trusted CA certificates used to verify the server when you connect over TLS. This property can be set only when you use TLS on Self-hosted Integration Runtime. The default value is the cacerts.pem file installed with the integration runtime.  | No |
| useSystemTrustStore | Specifies whether to use a CA certificate from the system trust store or from a specified .pem file. The default value is **false**.  | No |

> [!NOTE]
> The connector no longer supports P12 key files. If you rely on service accounts, you are recommended to use JSON key files instead. The P12CustomPwd property used for supporting the P12 key file was also deprecated. For more information, see this [article](https://cloud.google.com/sdk/docs/release-notes). 

**Example:**

```json
{
    "name": "GoogleBigQueryLinkedService",
    "properties": {
        "type": "GoogleBigQuery",
        "typeProperties": {
            "project" : "<project id>",
            "requestGoogleDriveScope" : true,
            "authenticationType" : "ServiceAuthentication",
            "email": "<email>",
            "keyFilePath": "<.json key path on the IR machine>"
        },
        "connectVia": {
            "referenceName": "<name of Self-hosted Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Google BigQuery dataset.

To copy data from Google BigQuery, set the type property of the dataset to **GoogleBigQueryObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **GoogleBigQueryObject** | Yes |
| dataset | Name of the Google BigQuery dataset. |No (if "query" in activity source is specified)  |
| table | Name of the table. |No (if "query" in activity source is specified)  |
| tableName | Name of the table. This property is supported for backward compatibility. For new workload, use `dataset` and `table`. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "GoogleBigQueryDataset",
    "properties": {
        "type": "GoogleBigQueryObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<GoogleBigQuery linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Google BigQuery source type.

### GoogleBigQuerySource as a source type

To copy data from Google BigQuery, set the source type in the copy activity to **GoogleBigQuerySource**. The following properties are supported in the copy activity **source** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **GoogleBigQuerySource**. | Yes |
| query | Use the custom SQL query to read data. An example is `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromGoogleBigQuery",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<GoogleBigQuery input dataset name>",
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
                "type": "GoogleBigQuerySource",
                "query": "SELECT * FROM MyTable"
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

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
