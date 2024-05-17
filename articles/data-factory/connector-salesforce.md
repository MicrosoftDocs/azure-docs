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
ms.date: 04/01/2024
---

# Copy data from and to Salesforce using Azure Data Factory or Azure Synapse Analytics


[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory and Azure Synapse pipelines to copy data from and to Salesforce. It builds on the [Copy Activity overview](copy-activity-overview.md) article that presents a general overview of the copy activity.

>[!IMPORTANT]
>The new Salesforce connector provides improved native Salesforce support. If you are using the legacy Salesforce connector in your solution, please [upgrade your Salesforce connector](#upgrade-the-salesforce-linked-service) before **October 11, 2024**. Refer to this [section](#differences-between-salesforce-and-salesforce-legacy) for details on the difference between the legacy and latest version. 

## Supported capabilities

This Salesforce connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources or sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

Specifically, this Salesforce connector supports:

- Salesforce Developer, Professional, Enterprise, or Unlimited editions.
- Copying data from and to custom domain (Custom domain can be configured in both production and sandbox environments).

You can explicitly set the API version used to read/write data via [`apiVersion` property](#linked-service-properties) in linked service. When copying data to Salesforce, the connector uses BULK API 2.0.


## Prerequisites

- API permission must be enabled in Salesforce.
- You need configure the Connected Apps in Salesforce portal referring to this [official doc](https://help.salesforce.com/s/articleView?id=sf.connected_app_client_credentials_setup.htm&type=5) or our step by step guideline in the recommendation in this [article](connector-troubleshoot-salesforce.md#error-code-salesforceoauth2clientcredentialfailure).

    >[!IMPORTANT]
    > - The execution user must have the API Only permission.
    > - Access Token expire time could be changed through session policies instead of the refresh token.

## Salesforce Bulk API 2.0 Limits

We use Salesforce Bulk API 2.0 to query and ingest data. In Bulk API 2.0, batches are created for you automatically. You can submit up to **15,000** batches per rolling 24-hour period. If batches exceed the limit, you will see failures.

In Bulk API 2.0, only ingest jobs consume batches. Query jobs don't. For details, see [How Requests Are Processed in the Bulk API 2.0 Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/how_requests_are_processed.htm).

For more information, see the "General Limits" section in [Salesforce developer limits](https://developer.salesforce.com/docs/atlas.en-us.salesforce_app_limits_cheatsheet.meta/salesforce_app_limits_cheatsheet/salesforce_app_limits_platform_bulkapi.htm).

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
| environmentUrl | Specify the URL of the Salesforce instance. <br>For example, specify `"https://<domainName>.my.salesforce.com"` to copy data from the custom domain. Learn how to configure or view your custom domain referring to this [article](https://help.salesforce.com/s/articleView?id=sf.domain_name_setting_login_policy.htm&type=5). |Yes |
| authenticationType | Type of authentication used to connect to the Salesforce. <br/>The allowed value is **OAuth2ClientCredentials**. | Yes |
| clientId |Specify the client ID of the Salesforce OAuth 2.0 Connected App. For more information, go to this [article](https://help.salesforce.com/s/articleView?id=sf.connected_app_client_credentials_setup.htm&type=5) |Yes |
| clientSecret |Specify the client secret of the Salesforce OAuth 2.0 Connected App. For more information, go to this [article](https://help.salesforce.com/s/articleView?id=sf.connected_app_client_credentials_setup.htm&type=5) |Yes |
| apiVersion | Specify the Salesforce Bulk API 2.0 version to use, e.g. `52.0`. The Bulk API 2.0 only supports API version >= 47.0. To learn about Bulk API 2.0 version, see [article](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/bulk_common_diff_two_versions.htm). If you use a lower API version, it will result in a failure. | Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. If not specified, it uses the default Azure Integration Runtime. | No |

**Example: Store credentials**

```json
{
    "name": "SalesforceLinkedService",
    "properties": {
        "type": "SalesforceV2",
        "typeProperties": {
            "environmentUrl": "<environment URL>",
            "authenticationType": "OAuth2ClientCredentials",
            "clientId": "<client ID>",
            "clientSecret": {
                "type": "SecureString",
                "value": "<client secret>"
            },
            "apiVersion": "<API Version>"
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
            "environmentUrl": "<environment URL>",
            "authenticationType": "OAuth2ClientCredentials",
            "clientId": "<client ID>",
            "clientSecret": {
                "type": "AzureKeyVaultSecret",
                "secretName": "<secret name of client secret in AKV>",
                "store":{
                    "referenceName": "<Azure Key Vault linked service>",
                    "type": "LinkedServiceReference"
                }
            },
            "apiVersion": "<API Version>"
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
            "authenticationType": "OAuth2ClientCredentials",
            "clientId": {
                "type": "AzureKeyVaultSecret",
                "secretName": "<secret name of client ID in AKV>",
                "store": {
                    "referenceName": "<Azure Key Vault linked service>",
                    "type": "LinkedServiceReference"
                },
            },
            "clientSecret": {
                "type": "AzureKeyVaultSecret",
                "secretName": "<secret name of client secret in AKV>",
                "store":{
                    "referenceName": "<Azure Key Vault linked service>",
                    "type": "LinkedServiceReference"
                }
            },
            "apiVersion": "<API Version>"
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
| reportId | The ID of the Salesforce report to retrieve data from. It is not supported in sink. Note that there are [limitations](https://developer.salesforce.com/docs/atlas.en-us.api_analytics.meta/api_analytics/sforce_analytics_rest_api_limits_limitations.htm) when you use reports. | No for source (if "SOQLQuery" in source is specified), not support sink |

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
| SOQLQuery | Use the custom query to read data. You can only use [Salesforce Object Query Language (SOQL)](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm) query with limitations. For SOQL limitations, see this [article](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/queries.htm#SOQL%20Considerations). If query is not specified, all the data of the Salesforce object specified in "ObjectApiName/reportId" in dataset will be retrieved. | No (if "ObjectApiName/reportId" in the dataset is specified) |
| includeDeletedObjects | Indicates whether to query the existing records, or query all records including the deleted ones. If not specified, the default behavior is false. <br>Allowed values: **false** (default), **true**.   | No |

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
                "SOQLQuery": "SELECT Col_Currency__c, Col_Date__c, Col_Email__c FROM AllDataType__c",
                "includeDeletedObjects": false
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

### Salesforce as a sink type

To copy data to Salesforce, set the sink type in the copy activity to **SalesforceV2Sink**. The following properties are supported in the copy activity **sink** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to **SalesforceV2Sink**. | Yes |
| writeBehavior | The write behavior for the operation.<br/>Allowed values are **Insert** and **Upsert**. | No (default is Insert) |
| externalIdFieldName | The name of the external ID field for the upsert operation. The specified field must be defined as "External ID Field" in the Salesforce object. It can't have NULL values in the corresponding input data. | Yes for "Upsert" |
| writeBatchSize | The row count of data written to Salesforce in each batch. Suggest set this value from 10,000 to 200,000. Too little rows in each batch will reduce the copy performance. Too many rows in each batch may cause API timeout. | No (default is 100,000) |
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

## Upgrade the Salesforce linked service 

Here are steps that help you upgrade your linked service and related queries:

1. Configure the connected apps in Salesforce portal by referring to [Prerequisites](connector-salesforce.md#prerequisites).

1. Create a new Salesforce linked service and configure it by referring to [Linked service properties](connector-salesforce.md#linked-service-properties).  

1. If you use SQL query in the copy activity source or the lookup activity that refers to the legacy linked service, you need to convert them to the SOQL query. Learn more about SOQL query from [Salesforce as a source type](connector-salesforce.md#salesforce-as-a-source-type) and [Salesforce Object Query Language (SOQL)](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm).

1. readBehavior is replaced with includeDeletedObjects in the copy activity source or the lookup activity. For the detailed configuration, see [Salesforce as a source type](connector-salesforce.md#salesforce-as-a-source-type).

## Differences between Salesforce and Salesforce (legacy)

The Salesforce connector offers new functionalities and is compatible with most features of Salesforce (legacy) connector. The table below shows the feature differences between Salesforce and Salesforce (legacy).

|Salesforce |Salesforce (legacy)|
|:---|:---|
|Support SOQL within [Salesforce Bulk API 2.0](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/queries.htm#SOQL%20Considerations). <br>For SOQL queries:  <br>• GROUP BY, LIMIT, ORDER BY, OFFSET, or TYPEOF clauses are not supported. <br>• Aggregate Functions such as COUNT() are not supported, you can use Salesforce reports to implement them. <br>• Date functions in GROUP BY clauses are not supported, but they are supported in the WHERE clause. <br>• Compound address fields or compound geolocation fields are not supported. As an alternative, query the individual components of compound fields.  <br>• Parent-to-child relationship queries are not supported, whereas child-to-parent relationship queries are supported. |Support both SQL and SOQL syntax. |
|Objects that contain binary fields are not supported.| Objects that contain binary fields are supported, like Attachment object.|
|Support objects within Bulk API. For more information, see this [article](https://help.salesforce.com/s/articleView?id=000383508&type=1).|Support objects that are not supported by Bulk API, like CaseStatus.|
|Support report by selecting a report ID.|Support report query syntax, like `{call "<report name>"}`.|

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
