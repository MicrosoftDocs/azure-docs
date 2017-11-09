---
title: Copy data from/to Salesforce by using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from Salesforce to supported sink data stores (OR) from supported source data stores to Salesforce by using a copy activity in an Azure Data Factory pipeline.
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
ms.date: 11/09/2017
ms.author: jingwang

---
# Copy data from Salesforce using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-salesforce-connector.md)
> * [Version 2 - Preview](connector-salesforce.md)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from and to Salesforce. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Salesforce connector in V1](v1/data-factory-salesforce-connector.md).

## Supported capabilities

You can copy data from Salesforce to any supported sink data store, or or copy data from any supported source data store to Salesforce. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Salesforce connector supports:

- The following editions of Salesforce: **Developer Edition, Professional Edition, Enterprise Edition, or Unlimited Edition**.
- Copying data from/to Salesforce **production, sandbox and custom domain**.

## Prerequisites

* API permission must be enabled in Salesforce. See [How do I enable API access in Salesforce by permission set?](https://www.data2crm.com/migration/faqs/enable-api-access-salesforce-permission-set/)

## Salesforce request limits

Salesforce has limits for both total API requests and concurrent API requests. Note the following points:

- If the number of concurrent requests exceeds the limit, throttling occurs and you see random failures.
- If the total number of requests exceeds the limit, the Salesforce account is blocked for 24 hours.

You might also receive the “REQUEST_LIMIT_EXCEEDED“ error in both scenarios. See the "API Request Limits" section in the [Salesforce Developer Limits](http://resources.docs.salesforce.com/200/20/en-us/sfdc/pdf/salesforce_app_limits_cheatsheet.pdf) article for details.

## Getting started
You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

The following sections provide details about properties that are used to define Data Factory entities specific to Salesforce connector.

## Linked service properties

The following properties are supported for Salesforce linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to: **Salesforce**. |Yes |
| environmentUrl | Specify the URL of Salesforce instance. <br> - Default is `"https://login.salesforce.com"`. <br> - To copy data from sandbox, specify `"https://test.salesforce.com"`. <br> - To copy data from custom domain, specify, for example, `"https://[domain].my.salesforce.com"`. |No |
| username |Specify a user name for the user account. |Yes |
| password |Specify a password for the user account.<br/>You can choose to mark this field as a SecureString to store in ADF, or store it in Azure Key Vault and let ADF copy acitivty pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). |Yes |
| securityToken |Specify a security token for the user account. See [Get security token](https://help.salesforce.com/apex/HTViewHelpDoc?id=user_security_token.htm) for instructions on how to reset/get a security token. To learn about security tokens in general, see [Security and the API](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_concepts_security.htm).<br/>You can choose to mark this field as a SecureString to store in ADF, or store it in Azure Key Vault and let ADF copy acitivty pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). |Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. If not specified, it uses the default Azure Integration Runtime. | No for source, Yes for sink |

>[!IMPORTANT]
>To copy to Salesforce, explicitly [create an Azure IR](create-azure-integration-runtime.md#create-azure-ir) with a location near your Salesforce, and associate in the linked service as the following example.

**Example: storing credential in ADF**

```json
{
    "name": "SalesforceLinkedService",
    "properties": {
        "type": "Salesforce",
        "typeProperties": {
            "username": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            },
            "securityToken": {
                "type": "SecureString",
                "value": "<security token>"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example: storing credential in Azure Key Vault**

```json
{
    "name": "SalesforceLinkedService",
    "properties": {
        "type": "Salesforce",
        "typeProperties": {
            "username": "<username>",
            "password": {
                "type": "AzureKeyVaultSecret",
                "secretName": "<secret name of password in AKV>",
                "store":{
                    "referenceName": "<Azure Key Vault linked service>",
                    "type": "LinkedServiceReference"
                }
            },
            "securityToken": {
                "type": "AzureKeyVaultSecret",
                "secretName": "<secret name of security token in AKV>",
                "store":{
                    "referenceName": "<Azure Key Vault linked service>",
                    "type": "LinkedServiceReference"
                }
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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Salesforce dataset.

To copy data from/to Salesforce, set the type property of the dataset to **SalesforceObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **SalesforceObject**  | Yes |
| objectApiName | The Salesforce  object name to retrieve data from. | No for source, Yes for sink |

> [!IMPORTANT]
> The "__c" part of the API Name is needed for any custom object.

![Data Factory - Salesforce connection - API name](media/copy-data-from-salesforce/data-factory-salesforce-api-name.png)

**Example:**

```json
{
    "name": "SalesforceDataset",
    "properties": {
        "type": "SalesforceObject",
        "linkedServiceName": {
            "referenceName": "<Salesforce linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "objectApiName": "MyTable__c"
        }
    }
}
```

>[!NOTE]
>For back compatibiliy, when copying data from Salesforce, using previous "RelationalTable" type dataset will keep working, while you are suggested to switch to the new "SalesforceObject" type.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **RelationalTable** | Yes |
| tableName | Name of the table in Salesforce. | No (if "query" in activity source is specified) |

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Salesforce source and sink.

### Salesforce as source

To copy data from Salesforce, set the source type in the copy activity to **SalesforceSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **SalesforceSource** | Yes |
| query |Use the custom query to read data. You can use a SQL-92 query or [Salesforce Object Query Language (SOQL)](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm) query. For example: `select * from MyTable__c`. | No (if the "tableName" in dataset is specified) |

> [!IMPORTANT]
> The "__c" part of the API Name is needed for any custom object.

![Data Factory - Salesforce connection - API name](media/copy-data-from-salesforce/data-factory-salesforce-api-name-2.png)

>[!NOTE]
>For back compatibiliy, when copying data from Salesforce, using previous "RelationalSource" type copy source will keep working, while you are suggested to switch to the new "SalesforceSource" type.

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSalesforce",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Salesforce input dataset name>",
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
                "type": "SalesforceSource",
                "query": "SELECT Col_Currency__c, Col_Date__c, Col_Email__c FROM AllDataType__c"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

### Salesforce as sink

To copy data to Salesforce, set the sink type in the copy activity to **SalesforceSink**. The following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to: **SalesforceSink** | Yes |
| writeBehavior | The write behavior for the operation.<br/>Allowed values are: **Insert**, and **"Upsert"**. | No (default is Insert) |
| externalIdFieldName | The name of the external ID field for upsert operation. The specified field must be defined as "External Id Field" in the Salesforce object, and it cannot have NULL values in the corresponding input data. | Yes for "Upsert" |
| writeBatchSize | The row count of data written to Salesforce in each batch. | No (default is 5000) |
| ignoreNullValues | Indicates whether to ignore null values from input data during write operation.<br/>Allowed values are: **true**, and **false**.<br>- **true**: leave the data in the destination object unchanged when doing upsert/update operation and insert defined default value when doing insert operation.<br/>- **false**: update the data in the destination object to NULL when doing upsert/update operation and insert NULL value when doing insert operation. | No (default is false) |

### Example: Salesforce sink in copy activity

```json
"activities":[
    {
        "name": "CopyToSalesforce",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Salesforce input dataset name>",
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
                "type": "<source type>"
            },
            "sink": {
                "type": "SalesforceSink",
                "writeBehavior": "Upsert",
                "externalIdFieldName": "CustomerId__c",
                "writeBatchSize": 10000,
                "ignoreNullValues": true
            }
        }
    }
]
```

## Query tips

### Retrieving data from Salesforce Report

You can retrieve data from Salesforce reports by specifying query as `{call "<report name>"}`. Example: `"query": "{call \"TestReport\"}"`.

### Retrieving deleted records from Salesforce Recycle Bin

To query the soft deleted records from Salesforce Recycle Bin, you can specify **"IsDeleted = 1"** in your query. For example,

* To query only the deleted records, specify "select * from MyTable__c **where IsDeleted= 1**"
* To query all the records including the existing and the deleted, specify "select * from MyTable__c **where IsDeleted = 0 or IsDeleted = 1**"

### Retrieving data using where clause on DateTime column

When specify the SOQL or SQL query, pay attention to the DateTime format difference. For example:

* **SOQL sample**: `SELECT Id, Name, BillingCity FROM Account WHERE LastModifiedDate >= @{formatDateTime(pipeline().parameters.StartTime,'yyyy-MM-ddTHH:mm:ssZ')} AND LastModifiedDate < @{formatDateTime(pipeline().parameters.EndTime,'yyyy-MM-ddTHH:mm:ssZ')}`
* **SQL sample**: `SELECT * FROM Account WHERE LastModifiedDate >= {ts'@{formatDateTime(pipeline().parameters.StartTime,'yyyy-MM-dd HH:mm:ss')}'} AND LastModifiedDate < {ts'@{formatDateTime(pipeline().parameters.EndTime,'yyyy-MM-dd HH:mm:ss')}'}"`

## Data type mapping for Salesforce

When copying data from Salesforce, the following mappings are used from Salesforce data types to Azure Data Factory interim data types. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

| Salesforce data type | Data factory interim data type |
|:--- |:--- |
| Auto Number |String |
| Checkbox |Boolean |
| Currency |Double |
| Date |DateTime |
| Date/Time |DateTime |
| Email |String |
| Id |String |
| Lookup Relationship |String |
| Multi-Select Picklist |String |
| Number |Double |
| Percent |Double |
| Phone |String |
| Picklist |String |
| Text |String |
| Text Area |String |
| Text Area (Long) |String |
| Text Area (Rich) |String |
| Text (Encrypted) |String |
| URL |String |

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).