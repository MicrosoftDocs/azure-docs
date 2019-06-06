---
title: Copy data from and to Salesforce by using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from Salesforce to supported sink data stores or from supported source data stores to Salesforce by using a copy activity in a data factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 04/19/2019
ms.author: jingwang

---
# Copy data from and to Salesforce by using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-salesforce-connector.md)
> * [Current version](connector-salesforce.md)

This article outlines how to use Copy Activity in Azure Data Factory to copy data from and to Salesforce. It builds on the [Copy Activity overview](copy-activity-overview.md) article that presents a general overview of the copy activity.

## Supported capabilities

You can copy data from Salesforce to any supported sink data store. You also can copy data from any supported source data store to Salesforce. For a list of data stores that are supported as sources or sinks by the Copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Salesforce connector supports:

- Salesforce Developer, Professional, Enterprise, or Unlimited editions.
- Copying data from and to Salesforce production, sandbox, and custom domain.

The Salesforce connector is built on top of the Salesforce REST/Bulk API, with [v45](https://developer.salesforce.com/docs/atlas.en-us.218.0.api_rest.meta/api_rest/dome_versions.htm) for copy data from and [v40](https://developer.salesforce.com/docs/atlas.en-us.208.0.api_asynch.meta/api_asynch/asynch_api_intro.htm) for copy data to.

## Prerequisites

API permission must be enabled in Salesforce. For more information, see [Enable API access in Salesforce by permission set](https://www.data2crm.com/migration/faqs/enable-api-access-salesforce-permission-set/)

## Salesforce request limits

Salesforce has limits for both total API requests and concurrent API requests. Note the following points:

- If the number of concurrent requests exceeds the limit, throttling occurs and you see random failures.
- If the total number of requests exceeds the limit, the Salesforce account is blocked for 24 hours.

You might also receive the "REQUEST_LIMIT_EXCEEDED" error message in both scenarios. For more information, see the "API request limits" section in [Salesforce developer limits](https://resources.docs.salesforce.com/200/20/en-us/sfdc/pdf/salesforce_app_limits_cheatsheet.pdf).

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to the Salesforce connector.

## Linked service properties

The following properties are supported for the Salesforce linked service.

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to **Salesforce**. |Yes |
| environmentUrl | Specify the URL of the Salesforce instance. <br> - Default is `"https://login.salesforce.com"`. <br> - To copy data from sandbox, specify `"https://test.salesforce.com"`. <br> - To copy data from custom domain, specify, for example, `"https://[domain].my.salesforce.com"`. |No |
| username |Specify a user name for the user account. |Yes |
| password |Specify a password for the user account.<br/><br/>Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |
| securityToken |Specify a security token for the user account. For instructions on how to reset and get a security token, see [Get a security token](https://help.salesforce.com/apex/HTViewHelpDoc?id=user_security_token.htm). To learn about security tokens in general, see [Security and the API](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_concepts_security.htm).<br/><br/>Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. If not specified, it uses the default Azure Integration Runtime. | No for source, Yes for sink if the source linked service doesn't have integration runtime |

>[!IMPORTANT]
>When you copy data into Salesforce, the default Azure Integration Runtime can't be used to execute copy. In other words, if your source linked service doesn't have a specified integration runtime, explicitly [create an Azure Integration Runtime](create-azure-integration-runtime.md#create-azure-ir) with a location near your Salesforce instance. Associate the Salesforce linked service as in the following example.

**Example: Store credentials in Data Factory**

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

**Example: Store credentials in Key Vault**

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

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Salesforce dataset.

To copy data from and to Salesforce, set the type property of the dataset to **SalesforceObject**. The following properties are supported.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **SalesforceObject**.  | Yes |
| objectApiName | The Salesforce object name to retrieve data from. | No for source, Yes for sink |

> [!IMPORTANT]
> The "__c" part of **API Name** is needed for any custom object.

![Data Factory Salesforce connection API Name](media/copy-data-from-salesforce/data-factory-salesforce-api-name.png)

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
>For backward compatibility: When you copy data from Salesforce, if you use the previous "RelationalTable" type dataset, it keeps working while you see a suggestion to switch to the new "SalesforceObject" type.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to **RelationalTable**. | Yes |
| tableName | Name of the table in Salesforce. | No (if "query" in the activity source is specified) |

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Salesforce source and sink.

### Salesforce as a source type

To copy data from Salesforce, set the source type in the copy activity to **SalesforceSource**. The following properties are supported in the copy activity **source** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **SalesforceSource**. | Yes |
| query |Use the custom query to read data. You can use [Salesforce Object Query Language (SOQL)](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm) query or SQL-92 query. See more tips in [query tips](#query-tips) section. If query is not specified, all the data of the Salesforce object specified in "objectApiName" in dataset will be retrieved. | No (if "objectApiName" in the dataset is specified) |
| readBehavior | Indicates whether to query the existing records, or query all records including the deleted ones. If not specified, the default behavior is the former. <br>Allowed values: **query** (default), **queryAll**.  | No |

> [!IMPORTANT]
> The "__c" part of **API Name** is needed for any custom object.

![Data Factory Salesforce connection API Name list](media/copy-data-from-salesforce/data-factory-salesforce-api-name-2.png)

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

>[!NOTE]
>For backward compatibility: When you copy data from Salesforce, if you use the previous "RelationalSource" type copy, the source keeps working while you see a suggestion to switch to the new "SalesforceSource" type.

### Salesforce as a sink type

To copy data to Salesforce, set the sink type in the copy activity to **SalesforceSink**. The following properties are supported in the copy activity **sink** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to **SalesforceSink**. | Yes |
| writeBehavior | The write behavior for the operation.<br/>Allowed values are **Insert** and **Upsert**. | No (default is Insert) |
| externalIdFieldName | The name of the external ID field for the upsert operation. The specified field must be defined as "External Id Field" in the Salesforce object. It can't have NULL values in the corresponding input data. | Yes for "Upsert" |
| writeBatchSize | The row count of data written to Salesforce in each batch. | No (default is 5,000) |
| ignoreNullValues | Indicates whether to ignore NULL values from input data during a write operation.<br/>Allowed values are **true** and **false**.<br>- **True**: Leave the data in the destination object unchanged when you do an upsert or update operation. Insert a defined default value when you do an insert operation.<br/>- **False**: Update the data in the destination object to NULL when you do an upsert or update operation. Insert a NULL value when you do an insert operation. | No (default is false) |

**Example: Salesforce sink in a copy activity**

```json
"activities":[
    {
        "name": "CopyToSalesforce",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Salesforce output dataset name>",
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

### Retrieve data from a Salesforce report

You can retrieve data from Salesforce reports by specifying a query as `{call "<report name>"}`. An example is `"query": "{call \"TestReport\"}"`.

### Retrieve deleted records from the Salesforce Recycle Bin

To query the soft deleted records from the Salesforce Recycle Bin, you can specify `readBehavior` as `queryAll`. 

### Difference between SOQL and SQL query syntax

When copying data from Salesforce, you can use either SOQL query or SQL query. Note that these two has different syntax and functionality support, do not mix it. You are suggested to use the SOQL query which is natively supported by Salesforce. The following table lists the main differences:

| Syntax | SOQL Mode | SQL Mode |
|:--- |:--- |:--- |
| Column selection | Need to enumerate the fields to be copied in the query, e.g. `SELECT field1, filed2 FROM objectname` | `SELECT *` is supported in addition to column selection. |
| Quotation marks | Filed/object names cannot be quoted. | Field/object names can be quoted, e.g. `SELECT "id" FROM "Account"` |
| Datetime format |  Refer to details [here](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_select_dateformats.htm) and samples in next section. | Refer to details [here](https://docs.microsoft.com/sql/odbc/reference/develop-app/date-time-and-timestamp-literals?view=sql-server-2017) and samples in next section. |
| Boolean values | Represented as `False` and `True`, e.g. `SELECT … WHERE IsDeleted=True`. | Represented as 0 or 1, e.g. `SELECT … WHERE IsDeleted=1`. |
| Column renaming | Not supported. | Supported, e.g.: `SELECT a AS b FROM …`. |
| Relationship | Supported, e.g. `Account_vod__r.nvs_Country__c`. | Not supported. |

### Retrieve data by using a where clause on the DateTime column

When you specify the SOQL or SQL query, pay attention to the DateTime format difference. For example:

* **SOQL sample**: `SELECT Id, Name, BillingCity FROM Account WHERE LastModifiedDate >= @{formatDateTime(pipeline().parameters.StartTime,'yyyy-MM-ddTHH:mm:ssZ')} AND LastModifiedDate < @{formatDateTime(pipeline().parameters.EndTime,'yyyy-MM-ddTHH:mm:ssZ')}`
* **SQL sample**: `SELECT * FROM Account WHERE LastModifiedDate >= {ts'@{formatDateTime(pipeline().parameters.StartTime,'yyyy-MM-dd HH:mm:ss')}'} AND LastModifiedDate < {ts'@{formatDateTime(pipeline().parameters.EndTime,'yyyy-MM-dd HH:mm:ss')}'}`

### Error of MALFORMED_QUERY:Truncated

If you hit error of "MALFORMED_QUERY: Truncated", normally it's due to you have JunctionIdList type column in data and Salesforce has limitation on supporting such data with large number of rows. To mitigate, try to exclude JunctionIdList column or limit the number of rows to copy (you can partition to multiple copy activity runs).

## Data type mapping for Salesforce

When you copy data from Salesforce, the following mappings are used from Salesforce data types to Data Factory interim data types. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| Salesforce data type | Data Factory interim data type |
|:--- |:--- |
| Auto Number |String |
| Checkbox |Boolean |
| Currency |Decimal |
| Date |DateTime |
| Date/Time |DateTime |
| Email |String |
| Id |String |
| Lookup Relationship |String |
| Multi-Select Picklist |String |
| Number |Decimal |
| Percent |Decimal |
| Phone |String |
| Picklist |String |
| Text |String |
| Text Area |String |
| Text Area (Long) |String |
| Text Area (Rich) |String |
| Text (Encrypted) |String |
| URL |String |

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Data Factory, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
