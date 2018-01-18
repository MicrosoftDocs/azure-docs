---
title: Copy data from Google BigQuery by using Azure Data Factory (beta) | Microsoft Docs
description: Learn how to copy data from Google BigQuery to supported sink data stores by using a Copy activity in a data factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/05/2018
ms.author: jingwang

---
# Copy data from Google BigQuery by using Azure Data Factory (beta)

This article outlines how to use the Copy activity in Azure Data Factory to copy data from Google BigQuery. It builds on the [Copy activity overview](copy-activity-overview.md) article that presents a general overview of the Copy activity.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you use version 1 of the Data Factory service, which is generally available, see [Copy activity in version 1](v1/data-factory-data-movement-activities.md).

> [!IMPORTANT]
> This connector is currently in beta. You can try it out and give us feedback. Do not use it in production environments.

## Supported capabilities

You can copy data from Google BigQuery to any supported sink data store. For a list of data stores that are supported as sources or sinks by the Copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

 Data Factory provides a built-in driver to enable connectivity. Therefore, you don't need to manually install a driver to use this connector.

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
| requestGoogleDriveScope | Whether to request access to Google Drive. Allowing Google Drive access enables support for federated tables that combine BigQuery data with data from Google Drive. The default value is false.  | No |
| authenticationType | The OAuth 2.0 authentication mechanism used for authentication. ServiceAuthentication can be used only on Self-hosted Integration Runtime. <br/>Allowed values are **ServiceAuthentication** and **UserAuthentication**. | Yes |
| refreshToken | The refresh token obtained from Google used to authorize access to BigQuery for UserAuthentication. You can mark this field as SecureString to store it securely in Data Factory. You also can store the password in Azure Key Vault and let the Copy activity pull from there when you perform data copy. To learn more, see [Store credentials in Key Vault](store-credentials-in-key-vault.md). | No |
| email | The service account email ID that is used for ServiceAuthentication. It can be used only on Self-hosted Integration Runtime.  | No |
| keyFilePath | The full path to the .p12 key file that is used to authenticate the service account email address. It can be used only on Self-hosted Integration Runtime.  | No |
| trustedCertPath | The full path of the .pem file that contains trusted CA certificates used to verify the server when you connect over SSL. This property can be set only when you use SSL on Self-hosted Integration Runtime. The default value is the cacerts.pem file installed with the integration runtime.  | No |
| useSystemTrustStore | Specifies whether to use a CA certificate from the system trust store or from a specified PEM file. The default value is false.  | No |

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
            "refreshToken": {
                 "type": "SecureString",
                 "value": "<refresh token>"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Google BigQuery dataset.

To copy data from Google BigQuery, set the type property of the dataset to **GoogleBigQueryObject**. There is no additional type-specific property in this type of dataset.

**Example**

```json
{
    "name": "GoogleBigQueryDataset",
    "properties": {
        "type": "GoogleBigQueryObject",
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

To copy data from Google BigQuery, set the source type in the Copy activity to **GoogleBigQuerySource**. The following properties are supported in the Copy activity source section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the Copy activity source must be set to **GoogleBigQuerySource**. | Yes |
| query | Use the custom SQL query to read data. An example is `"SELECT * FROM MyTable"`. | Yes |

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

## Next steps
For a list of data stores supported as sources and sinks by the Copy activity in Data Factory, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
