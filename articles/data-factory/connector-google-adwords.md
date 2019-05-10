---
title: Copy data from Google AdWords using Azure Data Factory (Preview) | Microsoft Docs
description: Learn how to copy data from Google AdWords to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 12/07/2018
ms.author: jingwang

---
# Copy data from Google AdWords using Azure Data Factory (Preview)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from Google AdWords. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!IMPORTANT]
> This connector is currently in preview. You can try it out and provide feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

## Supported capabilities

You can copy data from Google AdWords to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Azure Data Factory provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to Google AdWords connector.

## Linked service properties

The following properties are supported for Google AdWords linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **GoogleAdWords** | Yes |
| clientCustomerID | The Client customer ID of the AdWords account that you want to fetch report data for.  | Yes |
| developerToken | The developer token associated with the manager account that you use to grant access to the AdWords API.  You can choose to mark this field as a SecureString to store it securely in ADF, or store password in Azure Key Vault and let ADF copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | Yes |
| authenticationType | The OAuth 2.0 authentication mechanism used for authentication. ServiceAuthentication can only be used on self-hosted IR. <br/>Allowed values are: **ServiceAuthentication**, **UserAuthentication** | Yes |
| refreshToken | The refresh token obtained from Google for authorizing access to AdWords for UserAuthentication. You can choose to mark this field as a SecureString to store it securely in ADF, or store password in Azure Key Vault and let ADF copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | No |
| clientId | The client id of the google application used to acquire the refresh token. You can choose to mark this field as a SecureString to store it securely in ADF, or store password in Azure Key Vault and let ADF copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | No |
| clientSecret | The client secret of the google application used to acquire the refresh token. You can choose to mark this field as a SecureString to store it securely in ADF, or store password in Azure Key Vault and let ADF copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | No |
| email | The service account email ID that is used for ServiceAuthentication and can only be used on self-hosted IR.  | No |
| keyFilePath | The full path to the .p12 key file that is used to authenticate the service account email address and can only be used on self-hosted IR.  | No |
| trustedCertPath | The full path of the .pem file containing trusted CA certificates for verifying the server when connecting over SSL. This property can only be set when using SSL on self-hosted IR. The default value is the cacerts.pem file installed with the IR.  | No |
| useSystemTrustStore | Specifies whether to use a CA certificate from the system trust store or from a specified PEM file. The default value is false.  | No |

**Example:**

```json
{
    "name": "GoogleAdWordsLinkedService",
    "properties": {
        "type": "GoogleAdWords",
        "typeProperties": {
            "clientCustomerID" : "<clientCustomerID>",
            "developerToken": {
                "type": "SecureString",
                "value": "<developerToken>"
            },
            "authenticationType" : "ServiceAuthentication",
            "refreshToken": {
                "type": "SecureString",
                "value": "<refreshToken>"
            },
            "clientId": {
                "type": "SecureString",
                "value": "<clientId>"
            },
            "clientSecret": {
                "type": "SecureString",
                "value": "<clientSecret>"
            },
            "email" : "<email>",
            "keyFilePath" : "<keyFilePath>",
            "trustedCertPath" : "<trustedCertPath>",
            "useSystemTrustStore" : true,
        }
    }
}

```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Google AdWords dataset.

To copy data from Google AdWords, set the type property of the dataset to **GoogleAdWordsObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **GoogleAdWordsObject** | Yes |
| tableName | Name of the table. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "GoogleAdWordsDataset",
    "properties": {
        "type": "GoogleAdWordsObject",
        "linkedServiceName": {
            "referenceName": "<GoogleAdWords linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {}
    }
}

```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Google AdWords source.

### Google AdWords as source

To copy data from Google AdWords, set the source type in the copy activity to **GoogleAdWordsSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **GoogleAdWordsSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromGoogleAdWords",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<GoogleAdWords input dataset name>",
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
                "type": "GoogleAdWordsSource",
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
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
