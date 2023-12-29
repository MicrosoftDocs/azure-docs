---
title: Copy data from and to Salesforce
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from Salesforce to supported sink data stores or from supported source data stores to Salesforce by using a copy activity in an Azure Data Factory or Azure Synapse Analytics pipeline.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 12/28/2023
---

# Copy data from and to Salesforce using Azure Data Factory or Azure Synapse Analytics


[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory and Azure Synapse pipelines to copy data from and to Salesforce. It builds on the [Copy Activity overview](copy-activity-overview.md) article that presents a general overview of the copy activity.

## Supported capabilities

This Salesforce connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For a list of data stores that are supported as sources or sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

Specifically, this Salesforce connector supports:

- Salesforce Developer, Professional, Enterprise, or Unlimited editions.
- Copying data from and to Salesforce production, sandbox, and custom domain.

>[!NOTE]
>This function supports copy of any schema from the above mentioned Salesforce environments, including the [Nonprofit Success Pack](https://www.salesforce.org/products/nonprofit-success-pack/) (NPSP). 

You can explicitly set the API version used to read/write data via [`apiVersion` property](#linked-service-properties) in linked service. When copying data to Salesforce, the connector uses BULK API 2.0.


## Prerequisites

- You need configure the Connected Apps in Salesforce portal refering to this [article](https://help.salesforce.com/s/articleView?id=sf.connected_app_client_credentials_setup.htm&type=5)

>[!IMPORTANT]
> - API permission must be enabled in Salesforce.
> - Access Token expire time could be changed through session policies instead of the refresh token.

## Salesforce request limits

Salesforce has limits for both total API requests and concurrent API requests. Note the following points:

- If the number of concurrent requests exceeds the limit, throttling occurs and you see random failures.
- If the total number of requests exceeds the limit, the Salesforce account is blocked for 24 hours.

You might also receive the "REQUEST_LIMIT_EXCEEDED" error message in both scenarios. For more information, see the "API request limits" section in [Salesforce developer limits](https://developer.salesforce.com/docs/atlas.en-us.218.0.salesforce_app_limits_cheatsheet.meta/salesforce_app_limits_cheatsheet/salesforce_app_limits_platform_api.htm).

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Salesforce using UI

Use the following steps to create a linked service to Salesforce in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Salesforce and select the Salesforce connector.

    :::image type="content" source="media/connector-salesforce/salesforce-connector.png" alt-text="Screenshot of the Salesforce connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-salesforce/configure-salesforce-linked-service.png" alt-text="Screenshot of linked service configuration for Salesforce.":::

## Connector configuration details

The following sections provide details about properties that are used to define entities specific to the Salesforce connector.

## Linked service properties

The following properties are supported for the Salesforce linked service.

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to **SalesforceV2**. |Yes |
| environmentUrl | Specify the URL of the Salesforce instance. <br> - Default is `"https://login.salesforce.com"`. <br> - To copy data from sandbox, specify `"https://test.salesforce.com"`. <br> - To copy data from custom domain, specify, for example, `"https://[domain].my.salesforce.com"`. |Yes |
| clientId |Specify the client ID of the Salesforce OAuth 2.0 Connected App. |Yes |
| clientSecret |Specify the client secret of the Salesforce OAuth 2.0 Connected App. |Yes |
| apiVersion | Specify the Salesforce Bulk API version to use, e.g. `52.0`. We support API version >= 47.0, as Bulk API 2.0 supports: <br>- Ingest Availability: 41.0 and later.<br>- Query Availability: 47.0 and later. | Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. If not specified, it uses the default Azure Integration Runtime. | No |

**Example: Store credentials**

```json
{
    "name": "SalesforceLinkedService",
    "properties": {
        "type": "SalesforceV2",
        "typeProperties": {
            "environmentUrl": "<environmentUrl>",
            "clientId": "<clientId>",
            "clientSecret": {
                "type": "SecureString",
                "value": "<clientSecret>"
            },
            "apiVersion": "<apiVersion>"
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
        "type": "SalesforceV2",
        "typeProperties": {
            "environmentUrl": "<environmentUrl>",
            "clientId": "<clientId>",
            "clientSecret": {
                "type": "AzureKeyVaultSecret",
                "secretName": "<secret name of password in AKV>",
                "store":{
                    "referenceName": "<Azure Key Vault linked service>",
                    "type": "LinkedServiceReference"
                }
            },
            "apiVersion": "<apiVersion>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example: Store credentials in Key Vault, as well as environmentUrl and clientId**

Note that by doing so, you will no longer be able to use the UI to edit settings.  The ***Specify dynamic contents in JSON format*** checkbox will be checked, and you will have to edit this configuration entirely by hand.  The advantage is you can derive ALL configuration settings from the Key Vault instead of parameterizing anything here.

```json
{
    "name": "SalesforceLinkedService",
    "properties": {
        "type": "SalesforceV2",
        "typeProperties": {
            "environmentUrl": {
                "type": "AzureKeyVaultSecret",
                "secretName": "<secret name of environment URL in AKV>",
                "store": {
                    "referenceName": "<Azure Key Vault linked service>",
                    "type": "LinkedServiceReference"
                },
            },
            "clientId": {
                "type": "AzureKeyVaultSecret",
                "secretName": "<secret name of clientId in AKV>",
                "store": {
                    "referenceName": "<Azure Key Vault linked service>",
                    "type": "LinkedServiceReference"
                },
            },
            "clientSecret": {
                "type": "AzureKeyVaultSecret",
                "secretName": "<secret name of password in AKV>",
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

To copy data from and to Salesforce, set the type property of the dataset to **SalesforceV2Object**. The following properties are supported.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **SalesforceV2Object**.  | Yes |
| objectApiName | The Salesforce object name to retrieve data from. | No for source (if "SOQLQuery" in source is specified), Yes for sink |
| reportId | The ID of the Salesforce report to retrieve data from. It is not supported in sink. Note that there are [limitations](https://developer.salesforce.com/docs/atlas.en-us.api_analytics.meta/api_analytics/sforce_analytics_rest_api_limits_limitations.htm) when you use reports. | No for source (if "SOQLQuery" in source is specified) |

> [!IMPORTANT]
> The "__c" part of **API Name** is needed for any custom object.

:::image type="content" source="media/copy-data-from-salesforce/data-factory-salesforce-api-name.png" alt-text="Salesforce connection API Name":::

**Example:**

```json
{
    "name": "SalesforceDataset",
    "properties": {
        "type": "SalesforceV2Object",
        "typeProperties": {
            "objectApiName": "MyTable__c"
        },
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Salesforce linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Salesforce source and sink.

### Salesforce as a source type

To copy data from Salesforce, set the source type in the copy activity to **SalesforceV2Source**. The following properties are supported in the copy activity **source** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **SalesforceV2Source**. | Yes |
| SOQLQuery | Use the custom query to read data. You can only use [Salesforce Object Query Language (SOQL)](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm) query with limitations [Understanding Bulk API 2.0 Query](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/queries.htm#SOQL%20Considerations). If query is not specified, all the data of the Salesforce object specified in "ObjectApiName/reportId" in dataset will be retrieved. | No (if "ObjectApiName/reportId" in the dataset is specified) |
| readBehavior | Indicates whether to query the existing records, or query all records including the deleted ones. If not specified, the default behavior is the former. <br>Allowed values: **query** (default), **queryAll**.  | Yes |

> [!IMPORTANT]
> The "__c" part of **API Name** is needed for any custom object.

:::image type="content" source="media/copy-data-from-salesforce/data-factory-salesforce-api-name-2.png" alt-text="Salesforce connection API Name list":::

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
                "type": "SalesforceV2Source",
                "SOQLQuery": "SELECT Col_Currency__c, Col_Date__c, Col_Email__c FROM AllDataType__c"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

> [!Note]
> Salesforce source doesn't support proxy settings in the self-hosted integration runtime, but sink does.

### Salesforce as a sink type

To copy data to Salesforce, set the sink type in the copy activity to **SalesforceV2Sink**. The following properties are supported in the copy activity **sink** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to **SalesforceV2Sink**. | Yes |
| writeBehavior | The write behavior for the operation.<br/>Allowed values are **Insert** and **Upsert**. | No (default is Insert) |
| externalIdFieldName | The name of the external ID field for the upsert operation. The specified field must be defined as "External ID Field" in the Salesforce object. It can't have NULL values in the corresponding input data. | Yes for "Upsert" |
| writeBatchSize | The row count of data written to Salesforce in each batch. | No (default is 5,000) |
| ignoreNullValues | Indicates whether to ignore NULL values from input data during a write operation.<br/>Allowed values are **true** and **false**.<br>- **True**: Leave the data in the destination object unchanged when you do an upsert or update operation. Insert a defined default value when you do an insert operation.<br/>- **False**: Update the data in the destination object to NULL when you do an upsert or update operation. Insert a NULL value when you do an insert operation. | No (default is false) |
| maxConcurrentConnections |The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No |

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
                "type": "SalesforceV2Sink",
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

When copying data from Salesforce, you can use either SOQL query or SQL query. Note that these two has different syntax and functionality support, do not mix it. You are suggested to use the SOQL query, which is natively supported by Salesforce. The following table lists the main differences:

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

## Data type mapping for Salesforce

When you copy data from Salesforce, the following mappings are used from Salesforce data types to interim data types within the service internally. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| Salesforce data type | Service interim data type |
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
> Salesforce Number type is mapping to Decimal type in Azure Data Factory and Azure Synapse pipelines as a service interim data type. Decimal type honors the defined precision and scale. For data whose decimal places exceeds the defined scale, its value will be rounded off in preview data and copy. To avoid getting such precision loss in Azure Data Factory and Azure Synapse pipelines, consider increasing the decimal places to a reasonably large value in **Custom Field Definition Edit** page of Salesforce. 

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).


## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
