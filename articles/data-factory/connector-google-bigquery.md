---
title: Copy data from Google BigQuery by using Azure Data Factory 
description: Learn how to copy data from Google BigQuery to supported sink data stores by using a copy activity in a data factory pipeline.
services: data-factory
documentationcenter: ''
ms.author: jingwang
author: linda33wj
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 09/04/2019
---

# Copy data from Google BigQuery by using Azure Data Factory
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory to copy data from Google BigQuery. It builds on the [Copy Activity overview](copy-activity-overview.md) article that presents a general overview of the copy activity.

## Supported capabilities

This Google BigQuery connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with [supported source/sink matrix](copy-activity-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)

You can copy data from Google BigQuery to any supported sink data store. For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Data Factory provides a built-in driver to enable connectivity. Therefore, you don't need to manually install a driver to use this connector.

>[!NOTE]
>This Google BigQuery connector is built on top of the BigQuery APIs. Be aware that BigQuery limits the maximum rate of incoming requests and enforces appropriate quotas on a per-project basis, refer to [Quotas & Limits - API requests](https://cloud.google.com/bigquery/quotas#api_requests). Make sure you do not trigger too many concurrent requests to the account.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to the Google BigQuery connector.

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
| clientId | ID of the application used to generate the refresh token. | No |
| clientSecret | Secret of the application used to generate the refresh token. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| refreshToken | The refresh token obtained from Google used to authorize access to BigQuery. Learn how to get one from [Obtaining OAuth 2.0 access tokens](https://developers.google.com/identity/protocols/OAuth2WebServer#obtainingaccesstokens) and [this community blog](https://jpd.ms/getting-your-bigquery-refresh-token-for-azure-datafactory-f884ff815a59). Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |

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
| keyFilePath | The full path to the .p12 key file that is used to authenticate the service account email address. | No |
| trustedCertPath | The full path of the .pem file that contains trusted CA certificates used to verify the server when you connect over TLS. This property can be set only when you use TLS on Self-hosted Integration Runtime. The default value is the cacerts.pem file installed with the integration runtime.  | No |
| useSystemTrustStore | Specifies whether to use a CA certificate from the system trust store or from a specified .pem file. The default value is **false**.  | No |

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
            "keyFilePath": "<.p12 key path on the IR machine>"
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

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Data Factory, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
