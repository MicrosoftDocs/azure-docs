---
title: Copy data from Xero using Azure Data Factory 
titleSuffix: Azure Data Factory& Azure Synapse
description: Learn how to copy data from Xero to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
author: jianleishen
ms.service: data-factory
ms.custom: synapse
ms.topic: conceptual
ms.date: 01/26/2021
ms.author: jianleishen
---
# Copy data from Xero using Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from Xero. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

This Xero connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with [supported source/sink matrix](copy-activity-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)

You can copy data from Xero to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Xero connector supports:

- OAuth 2.0 and OAuth 1.0 authentication. For OAuth 1.0, the connector supports Xero [private application](https://developer.xero.com/documentation/getting-started/getting-started-guide) but not public application.
- All Xero tables (API endpoints) except "Reports".

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to Xero connector.

## Linked service properties

The following properties are supported for Xero linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Xero** | Yes |
| connectionProperties | A group of properties that defines how to connect to Xero. | Yes |
| ***Under `connectionProperties`:*** | | |
| host | The endpoint of the Xero server (`api.xero.com`).  | Yes |
| authenticationType | Allowed values are `OAuth_2.0` and `OAuth_1.0`. | Yes |
| consumerKey | For OAuth 2.0, specify the **client ID** for your Xero application.<br>For OAuth 1.0, specify the consumer key associated with the Xero application.<br>Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| privateKey | For OAuth 2.0, specify the **client secret** for your Xero application.<br>For OAuth 1.0, specify the private key from the .pem file that was generated for your Xero private application, see [Create a public/private key pair](https://developer.xero.com/documentation/auth-and-limits/create-publicprivate-key). Note to **generate the privatekey.pem with numbits of 512** using `openssl genrsa -out privatekey.pem 512`, 1024 is not supported. Include all the text from the .pem file including the Unix line endings(\n), see sample below.<br/><br>Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| tenantId | The tenant ID associated with your Xero application. Applicable for OAuth 2.0 authentication.<br>Learn how to get the tenant ID from [Check the tenants you're authorized to access section](https://developer.xero.com/documentation/oauth2/auth-flow). | Yes for OAuth 2.0 authentication |
| refreshToken | Applicable for OAuth 2.0 authentication.<br/>The OAuth 2.0 refresh token is associated with the Xero application and used to refresh the access token; the access token expires after 30 minutes. Learn about how the Xero authorization flow works and how to get the refresh token from [this article](https://developer.xero.com/documentation/oauth2/auth-flow). To get a refresh token, you must request the [offline_access scope](https://developer.xero.com/documentation/oauth2/scopes). <br/>**Know limitation**: Note Xero resets the refresh token after it's used for access token refresh. For operationalized workload, before each copy activity run, you need to set a valid refresh token for ADF to use.<br/>Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes for OAuth 2.0 authentication |
| useEncryptedEndpoints | Specifies whether the data source endpoints are encrypted using HTTPS. The default value is true.  | No |
| useHostVerification | Specifies whether the host name is required in the server's certificate to match the host name of the server when connecting over TLS. The default value is true.  | No |
| usePeerVerification | Specifies whether to verify the identity of the server when connecting over TLS. The default value is true.  | No |

**Example: OAuth 2.0 authentication**

```json
{
    "name": "XeroLinkedService",
    "properties": {
        "type": "Xero",
        "typeProperties": {
            "connectionProperties": { 
                "host": "api.xero.com",
                "authenticationType":"OAuth_2.0", 
                "consumerKey": {
                    "type": "SecureString",
                    "value": "<client ID>"
                },
                "privateKey": {
                    "type": "SecureString",
                    "value": "<client secret>"
                },
                "tenantId": "<tenant ID>", 
                "refreshToken": {
                    "type": "SecureString",
                    "value": "<refresh token>"
                }, 
                "useEncryptedEndpoints": true, 
                "useHostVerification": true, 
                "usePeerVerification": true
            }            
        }
    }
}
```

**Example: OAuth 1.0 authentication**

```json
{
    "name": "XeroLinkedService",
    "properties": {
        "type": "Xero",
        "typeProperties": {
            "connectionProperties": {
                "host": "api.xero.com", 
                "authenticationType":"OAuth_1.0", 
                "consumerKey": {
                    "type": "SecureString",
                    "value": "<consumer key>"
                },
                "privateKey": {
                    "type": "SecureString",
                    "value": "<private key>"
                }, 
                "useEncryptedEndpoints": true,
                "useHostVerification": true,
                "usePeerVerification": true
            }
        }
    }
}
```

**Sample private key value:**

Include all the text from the .pem file including the Unix line endings(\n).

```
"-----BEGIN RSA PRIVATE KEY-----\nMII***************************************************P\nbu****************************************************s\nU/****************************************************B\nA*****************************************************W\njH****************************************************e\nsx*****************************************************l\nq******************************************************X\nh*****************************************************i\nd*****************************************************s\nA*****************************************************dsfb\nN*****************************************************M\np*****************************************************Ly\nK*****************************************************Y=\n-----END RSA PRIVATE KEY-----"
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Xero dataset.

To copy data from Xero, set the type property of the dataset to **XeroObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **XeroObject** | Yes |
| tableName | Name of the table. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "XeroDataset",
    "properties": {
        "type": "XeroObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Xero linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Xero source.

### Xero as source

To copy data from Xero, set the source type in the copy activity to **XeroSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **XeroSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM Contacts"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromXero",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Xero input dataset name>",
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
                "type": "XeroSource",
                "query": "SELECT * FROM Contacts"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

Note the following when specifying the Xero query:

- Tables with complex items will be split to multiple tables. For example, Bank transactions has a complex data structure "LineItems", so data of bank transaction is mapped to table `Bank_Transaction` and `Bank_Transaction_Line_Items`, with `Bank_Transaction_ID` as foreign key to link them together.

- Xero data is available through two schemas: `Minimal` (default) and `Complete`. The Complete schema contains prerequisite call tables which require additional data (e.g. ID column) before making the desired query.

The following tables have the same information in the Minimal and Complete schema. To reduce the number of API calls, use Minimal schema (default).

- Bank_Transactions
- Contact_Groups 
- Contacts 
- Contacts_Sales_Tracking_Categories 
- Contacts_Phones 
- Contacts_Addresses 
- Contacts_Purchases_Tracking_Categories 
- Credit_Notes 
- Credit_Notes_Allocations 
- Expense_Claims 
- Expense_Claim_Validation_Errors
- Invoices 
- Invoices_Credit_Notes
- Invoices_ Prepayments 
- Invoices_Overpayments 
- Manual_Journals 
- Overpayments 
- Overpayments_Allocations 
- Prepayments 
- Prepayments_Allocations 
- Receipts 
- Receipt_Validation_Errors 
- Tracking_Categories

The following tables can only be queried with complete schema:

- Complete.Bank_Transaction_Line_Items 
- Complete.Bank_Transaction_Line_Item_Tracking 
- Complete.Contact_Group_Contacts 
- Complete.Contacts_Contact_ Persons 
- Complete.Credit_Note_Line_Items 
- Complete.Credit_Notes_Line_Items_Tracking 
- Complete.Expense_Claim_ Payments 
- Complete.Expense_Claim_Receipts 
- Complete.Invoice_Line_Items 
- Complete.Invoices_Line_Items_Tracking
- Complete.Manual_Journal_Lines 
- Complete.Manual_Journal_Line_Tracking 
- Complete.Overpayment_Line_Items 
- Complete.Overpayment_Line_Items_Tracking 
- Complete.Prepayment_Line_Items 
- Complete.Prepayment_Line_Item_Tracking 
- Complete.Receipt_Line_Items 
- Complete.Receipt_Line_Item_Tracking 
- Complete.Tracking_Category_Options

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).


## Next steps
For a list of supported data stores by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
