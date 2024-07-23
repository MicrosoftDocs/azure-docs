---
title: Copy data from Google BigQuery
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from Google BigQuery to supported sink data stores by using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 05/22/2024
---

# Copy data from Google BigQuery using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data from Google BigQuery. It builds on the [Copy Activity overview](copy-activity-overview.md) article that presents a general overview of the copy activity.

>[!IMPORTANT]
>The new Google BigQuery connector provides improved native Google BigQuery support. If you are using the legacy Google BigQuery connector in your solution, please [upgrade your Google BigQuery connector](#upgrade-the-google-bigquery-linked-service) before **October 31, 2024**. Refer to this [section](#differences-between-google-bigquery-and-google-bigquery-legacy) for details on the difference between the legacy and latest version. 

## Supported capabilities

This Google BigQuery connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

The service provides a built-in driver to enable connectivity. Therefore, you don't need to manually install a driver to use this connector.

>[!NOTE]
>This Google BigQuery connector is built on top of the BigQuery APIs. Be aware that BigQuery limits the maximum rate of incoming requests and enforces appropriate quotas on a per-project basis, refer to [Quotas & Limits - API requests](https://cloud.google.com/bigquery/quotas#api_requests). Make sure you do not trigger too many concurrent requests to the account.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Google BigQuery using UI

Use the following steps to create a linked service to Google BigQuery in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Google BigQuery and select the connector.

    :::image type="content" source="media/connector-google-bigquery/google-bigquery-connector.png" alt-text="Screenshot of the Google BigQuery connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-google-bigquery/configure-google-bigquery-linked-service.png" alt-text="Screenshot of linked service configuration for Google BigQuery.":::

## Connector configuration details

The following sections provide details about properties that are used to define entities specific to the Google BigQuery connector.

## Linked service properties

The following properties are supported for the Google BigQuery linked service.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **GoogleBigQueryV2**. | Yes |
| projectId | The project ID of the default BigQuery project to query against.  | Yes |
| authenticationType | The OAuth 2.0 authentication mechanism used for authentication.</br>Allowed values are **UserAuthentication** and **ServiceAuthentication**. Refer to sections below this table on more properties and JSON samples for those authentication types respectively. | Yes |

### Using user authentication

Set "authenticationType" property to **UserAuthentication**, and specify the following properties along with generic properties described in the previous section:

| Property | Description | Required |
|:--- |:--- |:--- |
| clientId | ID of the application used to generate the refresh token. | Yes |
| clientSecret | Secret of the application used to generate the refresh token. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| refreshToken | The refresh token obtained from Google used to authorize access to BigQuery. Learn how to get one from [Obtaining OAuth 2.0 access tokens](https://developers.google.com/identity/protocols/OAuth2WebServer#obtainingaccesstokens) and [this community blog](https://jpd.ms/getting-your-bigquery-refresh-token-for-azure-datafactory-f884ff815a59). Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |

**Example:**

```json
{
    "name": "GoogleBigQueryLinkedService",
    "properties": {
        "type": "GoogleBigQueryV2",
        "typeProperties": {
            "projectId" : "<project ID>",
            "authenticationType" : "UserAuthentication",
            "clientId": "<client ID>",
            "clientSecret": {
                "type": "SecureString",
                "value":"<client secret>"
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

Set "authenticationType" property to **ServiceAuthentication**, and specify the following properties along with generic properties described in the previous section.

| Property | Description | Required |
|:--- |:--- |:--- |
| keyFileContent | The key file in JSON format that is used to authenticate the service account. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |


**Example:**

```json
{
    "name": "GoogleBigQueryLinkedService",
    "properties": {
        "type": "GoogleBigQueryV2",
        "typeProperties": {
            "projectId": "<project ID>",
            "authenticationType": "ServiceAuthentication",
            "keyFileContent": {
                "type": "SecureString",
                "value": "<key file JSON string>"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Google BigQuery dataset.

To copy data from Google BigQuery, set the type property of the dataset to **GoogleBigQueryV2Object**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **GoogleBigQueryV2Object** | Yes |
| dataset | Name of the Google BigQuery dataset. |No (if "query" in activity source is specified)  |
| table | Name of the table. |No (if "query" in activity source is specified)  |

**Example**

```json
{
    "name": "GoogleBigQueryDataset",
    "properties": {
        "type": "GoogleBigQueryV2Object",
        "linkedServiceName": {
            "referenceName": "<Google BigQuery linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [],
        "typeProperties": {
            "dataset": "<dataset name>",
            "table": "<table name>"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Google BigQuery source type.

### GoogleBigQuerySource as a source type

To copy data from Google BigQuery, set the source type in the copy activity to **GoogleBigQueryV2Source**. The following properties are supported in the copy activity **source** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **GoogleBigQueryV2Source**. | Yes |
| query | Use the custom SQL query to read data. An example is `"SELECT * FROM MyTable"`. For more information, go to [Query syntax](https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax). | No (if "dataset" and "table" in dataset are specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromGoogleBigQuery",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Google BigQuery input dataset name>",
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
                "type": "GoogleBigQueryV2Source",
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

## Upgrade the Google BigQuery linked service

To upgrade the Google BigQuery linked service, create a new Google BigQuery linked service and configure it by referring to [Linked service properties](#linked-service-properties).

## Differences between Google BigQuery and Google BigQuery (legacy)

The Google BigQuery connector offers new functionalities and is compatible with most features of Google BigQuery (legacy) connector. The table below shows the feature differences between Google BigQuery and Google BigQuery (legacy).

| Google BigQuery  | Google BigQuery (legacy) | 
| :----------- | :------- |
| Service authentication is supported by the Azure integration runtime and the self-hosted integration runtime.<br>The properties trustedCertPath, useSystemTrustStore, email and keyFilePath are not supported as they are available on the self-hosted integration runtime only. | Service authentication is only supported by the self-hosted integration runtime. <br>Support trustedCertPath, useSystemTrustStore, email and keyFilePath properties. | 
| The following mappings are used from Google BigQuery data types to interim data types used by the service internally. <br><br>Numeric -> Decimal<br>Timestamp -> DateTimeOffset<br>Datetime -> DatetimeOffset | The following mappings are used from Google BigQuery data types to interim data types used by the service internally. <br><br>Numeric -> String<br>Timestamp -> DateTime<br>Datetime -> DateTime | 
| requestGoogleDriveScope is not supported. You need additionally apply the permission in Google BigQuery service by referring to [Choose Google Drive API scopes](https://developers.google.com/drive/api/guides/api-specific-auth) and [Query Drive data](https://cloud.google.com/bigquery/docs/query-drive-data). | Support requestGoogleDriveScope. | 
| additionalProjects is not supported. As an alternative, [query a public dataset with the Google Cloud console](https://cloud.google.com/bigquery/docs/quickstarts/query-public-dataset-console). | Support additionalProjects. | 

## Related content

For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
