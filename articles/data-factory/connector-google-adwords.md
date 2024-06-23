---
title: Copy data from Google Ads
description: Learn how to copy data from Google Ads to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 05/06/2024
---

# Copy data from Google Ads using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]


This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from Google Ads. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!Important]
> Please kindly [upgrade your Google Ads driver version](#upgrade-the-google-ads-driver-version) before **February 18, 2024**. If not, connection will start to fail with an [error](connector-troubleshoot-google-ads.md#error-code-deprecatedgoogleadslegacydriverversion) because of the deprecation of the legacy driver.

## Supported capabilities

This Google Ads connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

The service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Google Ads using UI

Use the following steps to create a linked service to Google Ads in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Google Ads and select the Google Ads connector.

   :::image type="content" source="media/connector-google-adwords/google-adwords-connector.png" alt-text="Screenshot of the Google Ads connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-google-adwords/configure-google-adwords-linked-service.png" alt-text="Screenshot of linked service configuration for Google Ads.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Google Ads connector.

## Linked service properties

The following properties are supported for Google Ads linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **GoogleAdWords** | Yes |
| googleAdsApiVersion | The Google Ads API version that you use when you select the recommended driver version. You can refer this [article](https://developers.google.com/google-ads/api/docs/release-notes) for API version information.|  Yes |
| clientCustomerID | The Client customer ID of the Ads account that you want to fetch report data for.  | Yes |
| loginCustomerID | The customer ID of the Google Ads manager account through which you want to fetch report data of specific customer.| No |
| developerToken | The developer token associated with the manager account that you use to grant access to the Ads API.  You can choose to mark this field as a SecureString to store it securely, or store password in Azure Key Vault and let the copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | Yes |
| authenticationType | The OAuth 2.0 authentication mechanism used for authentication. <br/>Allowed values are: **ServiceAuthentication**, **UserAuthentication**. <br/>ServiceAuthentication can only be used on self-hosted IR. | Yes |
|*For **UserAuthentication***:|||
| refreshToken | The refresh token obtained from Google for authorizing access to Ads for UserAuthentication. You can choose to mark this field as a SecureString to store it securely, or store password in Azure Key Vault and let the copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | No |
| clientId | The client ID of the Google application used to acquire the refresh token. You can choose to mark this field as a SecureString to store it securely, or store password in Azure Key Vault and let the copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | No |
| clientSecret | The client secret of the google application used to acquire the refresh token. You can choose to mark this field as a SecureString to store it securely, or store password in Azure Key Vault and let the copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | No |
|*For **ServiceAuthentication***:|||
| email | The service account email ID that is used for ServiceAuthentication and can only be used on self-hosted IR.  | No |
| privateKey | The service private key that is used for ServiceAuthentication for recommended driver version and can only be used on self-hosted IR. You can choose to mark this field as a SecureString to store it securely, or store password in Azure Key Vault and let the copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md).| No |
|*For **ServiceAuthentication** using the legacy driver version*:|||
| email | The service account email ID that is used for ServiceAuthentication and can only be used on self-hosted IR.  | No |
| keyFilePath | The full path to the `.p12` or `.json` key file that is used to authenticate the service account email address and can only be used on self-hosted IR. | No |
| trustedCertPath | The full path of the .pem file containing trusted CA certificates for verifying the server when connecting over TLS. This property can only be set when using TLS on self-hosted IR. The default value is the cacerts.pem file installed with the IR. | No |
| useSystemTrustStore | Specifies whether to use a CA certificate from the system trust store or from a specified PEM file. The default value is false. | No |


**Example:**

```json
{
    "name": "GoogleAdsLinkedService",
    "properties": {
        "type": "GoogleAdWords",
        "typeProperties": {
            "clientCustomerID": "<clientCustomerID>",
            "loginCustomerID": "<loginCustomerID>",
            "developerToken": {
                "type": "SecureString",
                "value": "<developerToken>"
            },
            "authenticationType": "UserAuthentication",
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
            "googleAdsApiVersion": "v14"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Google Ads dataset.

To copy data from Google Ads, set the type property of the dataset to **GoogleAdWordsObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **GoogleAdWordsObject** | Yes |
| tableName | Name of the table. Specify this property when you use the legacy driver version.| No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "GoogleAdsDataset",
    "properties": {
        "type": "GoogleAdWordsObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<GoogleAds linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}

```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Google Ads source.

### Google Ads as source

To copy data from Google Ads set the source type in the copy activity to **GoogleAdWordsSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **GoogleAdWordsSource** | Yes |
| query | Use the GAQL query to read data. For example: `SELECT campaign.id FROM campaign`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromGoogleAds",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<GoogleAds input dataset name>",
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
                "query": "SELECT campaign.id FROM campaign"
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

## Upgrade the Google Ads driver version

To upgrade your Google Ads driver version, you need update your linked service and learn how to migrate from SQL to Google Ads Query Language (GAQL).

### Update the linked service configuration

In **Edit linked service** page, select **Recommended** under **Driver version** and configure the linked service by referring to [Linked service properties](#linked-service-properties). 

### Migrate from SQL to GAQL

Convert your query statements and field names when migrating from SQL to GAQL. 

#### Query statements

If you use SQL query in the copy activity source or the lookup activity that refers to the legacy Google Ads linked service, you need to update them to GAQL query.

In contrast to SQL, the query in GAQL is made up of six kinds of clauses:

- `SELECT`
- `FROM`
- `WHERE`
- `ORDER BY`
- `LIMIT`
- `PARAMETERS`

Go to [Google Ads Query Language Grammar](https://developers.google.com/google-ads/api/docs/query/grammar) for the introduction of GAQL.

Take the following SQL statement as an example:

`SELECT *|FieldName FROM ResourceName WHERE FieldName Operator Value`

You can follow the guidance below to convert the SQL statement to the corresponding GAQL statement:

1. If `*` (asterisk) is used after the `SELECT` clause, then you need to specify all the required fields in place of the asterisk as GAQL doesn't support `SELECT *`. Go to this [article](https://developers.google.com/google-ads/api/fields/v14/ad_group) to see all the selectable fields in the specific resource.
2. If the field name is used after the `SELECT` clause, then you need to convert the name to the corresponding field name in GAQL as they have different naming conventions. For example, the field name `campaign_id` in SQL query statement should be converted to `campaign.id` in GAQL. See [Field name](#field-name) for more details on field name conversion.
3. The resource name can be left as it is unless its case is inconsistent with what is specified [here](https://developers.google.com/google-ads/api/fields/v14/overview#list-of-all-resources).
4. `WHERE` clause should be updated according to the [GAQL grammar](https://developers.google.com/google-ads/api/docs/query/grammar) as the operators supported by GAQL are not consistent with SQL, and field name should also be converted as described in the second point.

Here are two very useful tools offered by Google and they are highly recommended when building the corresponding GAQL query statements:

- [Interactive GAQL query builder](https://developers.google.com/google-ads/api/fields/v14/overview_query_builder) 
- [GAQL query validator](https://developers.google.com/google-ads/api/fields/v14/query_validator) 

#### Field name

The field name used in SQL is not aligned with GAQL. You also need to learn the conversion rules from field names in SQL to field names in GAQL. The conversion rule can be summarized as follows:

- If the field name belongs to a resource, the underscore (`_`) in SQL will be changed to dot (`.`) in GAQL. And for the words between the dot, the camelCase type statement used in SQL will be changed to standalone words with added underscores in between. The first string of type PascalCase in SQL will be changed to the corresponding resource name in GAQL.

- If the field name belongs to segments or metrics, the prefix `segments.` or `metrics.` should be added in GAQL, then follow the same rule as described in the first point to convert the name.

Here are the concrete examples of the field name conversion:

| Category | Field names in SQL | Field names in GAQL | 
|---------| --------|---------| 
| Resource fields | `Campaign_startDate` | `campaign.start_date` | 
| Resource fields | `Customer_conversionTrackingSetting_conversionTrackingStatus` | `customer.conversion_tracking_setting.conversion_tracking_status` | 
| Segments | `DayOfWeek` | `segments.day_of_week` | 
| Metrics | `VideoViews` | `metrics.video_views` | 

## Differences between Google Ads using the recommended and the legacy driver version

The table below shows the feature differences between Google Ads using the recommended and the legacy driver version.

| Recommended driver version | Legacy driver version |
|:---|:---|
|Specifying Google Ads API version is supported.|Specifying Google Ads API version is not supported.|
|ServiceAuthentication supports two properties: <br>&nbsp; • email<br>&nbsp; • privateKey |ServiceAuthentication supports four properties:<br>&nbsp; • email<br>&nbsp; • keyFilePath<br>&nbsp; • trustedCertPath<br>&nbsp; • useSystemTrustStore |
|Selecting a table in a dataset is not supported.|Support selecting a table in a dataset and querying the table in copy activities.|
|Support GAQL syntax as the query language.|Support SQL syntax as the query language.|
|The output column names are the same as the field names defined in Google Ads.|The output column names don't match the field names defined in Google Ads.|
|The following mappings are used from Google Ads data types to interim data types used by the service internally.<br><br>float -> float <br>int32 -> int <br>int64 -> long |The following mappings are used from Google Ads data types to interim data types used by the service internally. <br><br>float -> string <br>int32 -> string <br>int64 -> string |

## Upgrade Google AdWords connector to Google Ads connector 

Upgrade your Google AdWords linked service to the latest Google Ads linked service following the steps below:

1. Select **Recommended** as driver version to create a new Google Ads linked service and configure it by referring to [Linked service properties](connector-google-adwords.md#linked-service-properties). 
1. Update your pipelines that refer to the legacy Google AdWords linked service. Considering that the Google Ads linked service only supports using query to copy data, so:
    1. If your pipeline is directly retrieving data from the report of Google AdWords, find the corresponding resource name of Google Ads in the table below and use this [tool](https://developers.google.com/google-ads/api/fields/v15/overview_query_builder) to build the query.
        
        | Google AdWords report| Google Ads resource |
        |---------| --------|
        | ACCOUNT_PERFORMANCE_REPORT | customer |  
        | AD_PERFORMANCE_REPORT | ad_group_ad |  
        | ADGROUP_PERFORMANCE_REPORT | ad_group |  
        | AGE_RANGE_PERFORMANCE_REPORT | age_range_view | 
        | AUDIENCE_PERFORMANCE_REPORT | campaign_audience_view,ad_group_audience_view | 
        | AUTOMATIC_PLACEMENTS_PERFORMANCE_REPORT | group_placement_view |  
        | BID_GOAL_PERFORMANCE_REPORT | bidding_strategy | 
        | BUDGET_PERFORMANCE_REPORT | campaign_budget |  
        | CALL_METRICS_CALL_DETAILS_REPORT | call_view | 
        | CAMPAIGN_AD_SCHEDULE_TARGET_REPORT | ad_schedule_view |  
        | CAMPAIGN_CRITERIA_REPORT | campaign_criterion | 
        | CAMPAIGN_PERFORMANCE_REPORT | campaign | 
        | CAMPAIGN_SHARED_SET_REPORT | campaign_shared_set |  
        | CAMPAIGN_LOCATION_TARGET_REPORT | location_view | 
        | CLICK_PERFORMANCE_REPORT | click_view | 
        | DISPLAY_KEYWORD_PERFORMANCE_REPORT | display_keyword_view | 
        | DISPLAY_TOPICS_PERFORMANCE_REPORT | topic_view |  
        | GENDER_PERFORMANCE_REPORT | gender_view |  
        | GEO_PERFORMANCE_REPORT | geographic_view,user_location_view |  
        | KEYWORDLESS_QUERY_REPORT | dynamic_search_ads_search_term_view | 
        | KEYWORDS_PERFORMANCE_REPORT | keyword_view |  
        | LABEL_REPORT | label |  
        | LANDING_PAGE_REPORT | landing_page_view,expanded_landing_page_view | 
        | PAID_ORGANIC_QUERY_REPORT | paid_organic_search_term_view |  
        | PARENTAL_STATUS_PERFORMANCE_REPORT | parental_status_view |  
        | PLACEHOLDER_FEED_ITEM_REPORT | feed_item,feed_item_target |  
        | PLACEHOLDER_REPORT | feed_placeholder_view | 
        | PLACEMENT_PERFORMANCE_REPORT | managed_placement_view | 
        | PRODUCT_PARTITION_REPORT | product_group_view | 
        | SEARCH_QUERY_PERFORMANCE_REPORT | search_term_view |  
        | SHARED_SET_CRITERIA_REPORT | shared_criterion |  
        | SHARED_SET_REPORT | shared_set |  
        | SHOPPING_PERFORMANCE_REPORT | shopping_performance_view | 
        | TOP_CONTENT_PERFORMANCE_REPORT | No longer available in the Google Ads API. | 
        | URL_PERFORMANCE_REPORT | detail_placement_view |  
        | USER_AD_DISTANCE_REPORT | distance_view |  
        | VIDEO_PERFORMANCE_REPORT | video | 

    1. If the pipeline is using query to retrieve data from Google AdWords, use [Query Migration tool](https://developers.google.com/google-ads/scripts/docs/reference/query-migration-tool) to translate the AWQL (AdWords Query Language) into GAQL (Google Ads Query Language). 

1. Be aware that there are certain limitations with this upgrade: 
    1. Not all report types from AWQL are supported in GAQL. 
    1. Not all AWQL queries are cleanly translated to GAQL queries.  

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
