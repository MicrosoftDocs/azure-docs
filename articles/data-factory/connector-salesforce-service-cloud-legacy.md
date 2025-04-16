---
title: Copy data from and to Salesforce Service Cloud V1
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from Salesforce Service Cloud V1 to supported sink data stores, or from supported source data stores to Salesforce Service Cloud V1, using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
ms.author: jianleishen
author: jianleishen
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 10/15/2024
---

# Copy data from and to Salesforce Service Cloud V1 using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data from and to Salesforce Service Cloud. It builds on the [Copy Activity overview](copy-activity-overview.md) article that presents a general overview of the copy activity.

> [!IMPORTANT]
> The [Salesforce Service Cloud V2 connector](connector-salesforce-service-cloud.md) provides improved native Salesforce Service Cloud support. If you are using the [Salesforce Service Cloud V1 connector](connector-salesforce-service-cloud-legacy.md) in your solution, you are recommended to [upgrade your Salesforce Service Cloud connector](connector-salesforce-service-cloud.md#upgrade-the-salesforce-service-cloud-linked-service) at your earliest convenience. Refer to this [section](connector-salesforce-service-cloud.md#differences-between-salesforce-service-cloud-and-salesforce-service-cloud-legacy) for details on the difference between V2 and V1.

## Supported capabilities

This Salesforce Service Cloud connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources or sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

Specifically, this Salesforce Service Cloud connector supports:

- Salesforce Developer, Professional, Enterprise, or Unlimited editions.
- Copying data from and to Salesforce production, sandbox, and custom domain.

The Salesforce connector is built on top of the Salesforce REST/Bulk API. By default, when copying data from Salesforce, the connector uses [v45](https://developer.salesforce.com/docs/atlas.en-us.218.0.api_rest.meta/api_rest/dome_versions.htm) and automatically chooses between REST and Bulk APIs based on the data size - when the result set is large, Bulk API is used for better performance; when writing data to Salesforce, the connector uses [v40](https://developer.salesforce.com/docs/atlas.en-us.208.0.api_asynch.meta/api_asynch/asynch_api_intro.htm) of Bulk API. You can also explicitly set the API version used to read/write data via [`apiVersion` property](#linked-service-properties) in linked service.

## Prerequisites

API permission must be enabled in Salesforce.

## Salesforce request limits

Salesforce has limits for both total API requests and concurrent API requests. Note the following points:

- If the number of concurrent requests exceeds the limit, throttling occurs and you see random failures.
- If the total number of requests exceeds the limit, the Salesforce account is blocked for 24 hours.

You might also receive the "REQUEST_LIMIT_EXCEEDED" error message in both scenarios. For more information, see the "API request limits" section in [Salesforce developer limits](https://developer.salesforce.com/docs/atlas.en-us.218.0.salesforce_app_limits_cheatsheet.meta/salesforce_app_limits_cheatsheet/salesforce_app_limits_platform_api.htm).

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Salesforce Service Cloud using UI

Use the following steps to create a linked service to Salesforce Service Cloud in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for Salesforce and select the Salesforce Service Cloud connector.

    :::image type="content" source="media/connector-salesforce-service-cloud-legacy/salesforce-service-cloud-legacy-connector.png" alt-text="Select the Salesforce Service Cloud connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-salesforce-service-cloud-legacy/configure-salesforce-service-cloud-legacy-linked-service.png" alt-text="Configure a linked service to Salesforce Service Cloud.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to the Salesforce Service Cloud connector.

## Linked service properties

The following properties are supported for the Salesforce linked service.

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to **SalesforceServiceCloud**. |Yes |
| environmentUrl | Specify the URL of the Salesforce Service Cloud instance. <br> - Default is `"https://login.salesforce.com"`. <br> - To copy data from sandbox, specify `"https://test.salesforce.com"`. <br> - To copy data from custom domain, specify, for example, `"https://[domain].my.salesforce.com"`. |No |
| username |Specify a user name for the user account. |Yes |
| password |Specify a password for the user account.<br/><br/>Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |
| securityToken |Specify a security token for the user account. <br/><br/>To learn about security tokens in general, see [Security and the API](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_concepts_security.htm). The security token can be skipped only if you add the Integration Runtime's IP to the [trusted IP address list](https://developer.salesforce.com/docs/atlas.en-us.securityImplGuide.meta/securityImplGuide/security_networkaccess.htm) on Salesforce. When using Azure IR, refer to [Azure Integration Runtime IP addresses](azure-integration-runtime-ip-addresses.md).<br/><br/>For instructions on how to get and reset a security token, see [Get a security token](https://help.salesforce.com/apex/HTViewHelpDoc?id=user_security_token.htm). Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |No |
| apiVersion | Specify the Salesforce REST/Bulk API version to use, e.g. `48.0`. By default, the connector uses [v45](https://developer.salesforce.com/docs/atlas.en-us.218.0.api_rest.meta/api_rest/dome_versions.htm) to copy data from Salesforce, and uses [v40](https://developer.salesforce.com/docs/atlas.en-us.208.0.api_asynch.meta/api_asynch/asynch_api_intro.htm) to copy data to Salesforce. | No |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. If not specified, it uses the default Azure Integration Runtime. | No |

**Example: Store credentials**

```json
{
    "name": "SalesforceServiceCloudLinkedService",
    "properties": {
        "type": "SalesforceServiceCloud",
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
    "name": "SalesforceServiceCloudLinkedService",
    "properties": {
        "type": "SalesforceServiceCloud",
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

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Salesforce Service Cloud dataset.

To copy data from and to Salesforce Service Cloud, the following properties are supported.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **SalesforceServiceCloudObject**.  | Yes |
| objectApiName | The Salesforce object name to retrieve data from. | No for source, Yes for sink |

> [!IMPORTANT]
> The "__c" part of **API Name** is needed for any custom object.

:::image type="content" source="media/copy-data-from-salesforce/data-factory-salesforce-api-name.png" alt-text="Salesforce connection API Name":::

**Example:**

```json
{
    "name": "SalesforceServiceCloudDataset",
    "properties": {
        "type": "SalesforceServiceCloudObject",
        "typeProperties": {
            "objectApiName": "MyTable__c"
        },
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Salesforce Service Cloud linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to **RelationalTable**. | Yes |
| tableName | Name of the table in Salesforce Service Cloud. | No (if "query" in the activity source is specified) |

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Salesforce Service Cloud source and sink.

### Salesforce Service Cloud as a source type

To copy data from Salesforce Service Cloud, the following properties are supported in the copy activity **source** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **SalesforceServiceCloudSource**. | Yes |
| query |Use the custom query to read data. You can use [Salesforce Object Query Language (SOQL)](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm) query or SQL-92 query. See more tips in [query tips](#query-tips) section. If query is not specified, all the data of the Salesforce Service Cloud object specified in "objectApiName" in dataset will be retrieved. | No (if "objectApiName" in the dataset is specified) |
| readBehavior | Indicates whether to query the existing records, or query all records including the deleted ones. If not specified, the default behavior is the former. <br>Allowed values: **query** (default), **queryAll**.  | No |

> [!IMPORTANT]
> The "__c" part of **API Name** is needed for any custom object.

:::image type="content" source="media/copy-data-from-salesforce/data-factory-salesforce-api-name-2.png" alt-text="Salesforce connection API Name list":::

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSalesforceServiceCloud",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Salesforce Service Cloud input dataset name>",
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
                "type": "SalesforceServiceCloudSource",
                "query": "SELECT Col_Currency__c, Col_Date__c, Col_Email__c FROM AllDataType__c"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

> [!Note]
> Salesforce Service Cloud source doesn't support proxy settings in the self-hosted integration runtime, but sink does.

### Salesforce Service Cloud as a sink type

To copy data to Salesforce Service Cloud, the following properties are supported in the copy activity **sink** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to **SalesforceServiceCloudSink**. | Yes |
| writeBehavior | The write behavior for the operation.<br/>Allowed values are **Insert** and **Upsert**. | No (default is Insert) |
| externalIdFieldName | The name of the external ID field for the upsert operation. The specified field must be defined as "External ID Field" in the Salesforce Service Cloud object. It can't have NULL values in the corresponding input data. | Yes for "Upsert" |
| writeBatchSize | The row count of data written to Salesforce Service Cloud in each batch. | No (default is 5,000) |
| ignoreNullValues | Indicates whether to ignore NULL values from input data during a write operation.<br/>Allowed values are **true** and **false**.<br>- **True**: Leave the data in the destination object unchanged when you do an upsert or update operation. Insert a defined default value when you do an insert operation.<br/>- **False**: Update the data in the destination object to NULL when you do an upsert or update operation. Insert a NULL value when you do an insert operation. | No (default is false) |
| maxConcurrentConnections |The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No |

**Example:**

```json
"activities":[
    {
        "name": "CopyToSalesforceServiceCloud",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Salesforce Service Cloud output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "SalesforceServiceCloudSink",
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

### Retrieve data from a Salesforce Service Cloud report

You can retrieve data from Salesforce Service Cloud reports by specifying a query as `{call "<report name>"}`. An example is `"query": "{call \"TestReport\"}"`.

### Retrieve deleted records from the Salesforce Service Cloud Recycle Bin

To query the soft deleted records from the Salesforce Service Cloud Recycle Bin, you can specify `readBehavior` as `queryAll`. 

### Difference between SOQL and SQL query syntax

When copying data from Salesforce Service Cloud, you can use either SOQL query or SQL query. Note that these two has different syntax and functionality support, do not mix it. You are suggested to use the SOQL query, which is natively supported by Salesforce Service Cloud. The following table lists the main differences:

| Syntax | SOQL Mode | SQL Mode |
|:--- |:--- |:--- |
| Column selection | Need to enumerate the fields to be copied in the query, e.g. `SELECT field1, filed2 FROM objectname` | `SELECT *` is supported in addition to column selection. |
| Quotation marks | Filed/object names cannot be quoted. | Field/object names can be quoted, e.g. `SELECT "id" FROM "Account"` |
| Datetime format |  Refer to details [here](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_select_dateformats.htm) and samples in next section. | Refer to details [here](/sql/odbc/reference/develop-app/date-time-and-timestamp-literals) and samples in next section. |
| Boolean values | Represented as `False` and `True`, e.g. `SELECT … WHERE IsDeleted=True`. | Represented as 0 or 1, e.g. `SELECT … WHERE IsDeleted=1`. |
| Column renaming | Not supported. | Supported, e.g.: `SELECT a AS b FROM …`. |
| Relationship | Supported, e.g. `Account_vod__r.nvs_Country__c`. | Not supported. |

### Retrieve data by using a where clause on the DateTime column

When you specify the SOQL or SQL query, pay attention to the DateTime format difference. For example:

* **SOQL sample**: `SELECT Id, Name, BillingCity FROM Account WHERE LastModifiedDate >= @{formatDateTime(pipeline().parameters.StartTime,'yyyy-MM-ddTHH:mm:ssZ')} AND LastModifiedDate < @{formatDateTime(pipeline().parameters.EndTime,'yyyy-MM-ddTHH:mm:ssZ')}`
* **SQL sample**: `SELECT * FROM Account WHERE LastModifiedDate >= {ts'@{formatDateTime(pipeline().parameters.StartTime,'yyyy-MM-dd HH:mm:ss')}'} AND LastModifiedDate < {ts'@{formatDateTime(pipeline().parameters.EndTime,'yyyy-MM-dd HH:mm:ss')}'}`

### Error of MALFORMED_QUERY: Truncated

If you hit error of "MALFORMED_QUERY: Truncated", normally it's due to you have JunctionIdList type column in data and Salesforce has limitation on supporting such data with large number of rows. To mitigate, try to exclude JunctionIdList column or limit the number of rows to copy (you can partition to multiple copy activity runs).

## Data type mapping for Salesforce Service Cloud

When you copy data from Salesforce Service Cloud, the following mappings are used from Salesforce Service Cloud data types to interim data types used internally within the service. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| Salesforce Service Cloud data type | Service interim data type |
|:--- |:--- |
| Auto Number |String |
| Checkbox |Boolean |
| Currency |Decimal |
| Date |DateTime |
| Date/Time |DateTime |
| Email |String |
| ID |String |
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

> [!Note]
> Salesforce Service Cloud Number type is mapping to Decimal type in Azure Data Factory and Azure Synapse pipelines as a service interim data type. Decimal type honors the defined precision and scale. For data whose decimal places exceeds the defined scale, its value will be rounded off in preview data and copy. To avoid getting such precision loss in Azure Data Factory and Azure Synapse pipelines, consider increasing the decimal places to a reasonably large value in **Custom Field Definition Edit** page of Salesforce Service Cloud.

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).


## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
