---
title: Azure Monitor Basic Logs
description: Use Azure Monitor Basic Logs to quickly, or periodically investigate issues, troubleshoot code or configuration problems or address support cases.
author: MeirMen, adiBiran
ms.author: meirm, adbiran
ms.reviewer: osalzberg
ms.subservice: logs
ms.topic: conceptual
ms.date: 10/31/2021

---

# Azure Monitor Basic Logs (Preview)
Basic Logs is a feature of Azure Monitor that reduces the cost for high-value verbose logs that don’t require analytics and alerts.

provide a different variant of the log service that is adjusted to support  Logs will be ingested at a much lower cost, while queries will be limited and will incur cost. Log alerts will not be supported based on Basic Logs.

The workspace admin shall configure specific tables to use Basic Logs instead of the default analytics logs.
Basic Logs includes eight days of data retention. After this initial retention, data can be sent to archive where it can be stored for up to seven years. **TODO:** add link to archived logs.


### When to use Basic Logs
Azure Monitor Logs has hundreds of table definitions that cover lots of different components. These logs usually have scalar fields that enable powerful and efficient analysis. 
Azure Monitor is making use of these logs to provide rich set of insights solution on various aspects of your environment. But even in the most structured and well-defined environment, there are still logs coming from other sources that are verbose and textual.

There are two strategies to handle the textual logs:
1.	Parse them and extract the scalars from the text. Once parsed, these logs can be used for analytics and every mechanism that Azure Monitor supports. This pattern is usually used for high-value logs.
2.	Store them as-is and use them not for analytics but for compliancy and troubleshooting. Usually, these logs are fetched based on simple text search. This pattern is usually used for low-value and highly verbose logs.

Azure Monitor Logs provides tools for both strategies and the ability to apply both on the same data stream. Custom transforms (**TODO:** add link to transform documentation) can be used to parse logs as they are ingested to filter unnecessary logs. 

Basic Logs are designed to support high-volume non-analytics logs.
Most data types are used by various insights modules and thus can be used only as Analytics Logs. It will not be possible to configure them as Basic Logs. Other types will be Analytics Logs by default and will allow the workspace admin to set them as Basic Logs:

1.	All custom log V2 data types. Custom Logs gives the admin full flexibility to set the type of usage. Basic Logs are supported only on custom logs V2.
2.	ContainerLog and ContainerLogV2: Container Insights collects inventory, performance, and events data using various tables. ContainerLog and ContainerLogV2 include in many cases verbose text-based log records that are omitted by various pods. ContainerLogV2 adds more meta-data to the log record to ease the consumption and remove the need to join it to other tables.
3.	AppTraces: On top of the structured AppRequest / AppDependancy tables, Application Insights enable developer to omit their own freeform log records. 

More types may be added in the future.


## Difference from standard logs
Basic logs have the following differences from standard logs.

| Category | Description |
|:---|:---|
| Ingestion | Basic logs have a reduced cost for ingestion. |
| Log queries | Log queries against basic logs have a cost, while log queries against standard logs have no cost. |
| Retention |  Basic logs are retained for 8 days. Standard log retention can be configured. |


### Log queries with Basic Logs tables
Log queries using Basic Logs are expected to be infrequent and relatively simple.


### Limits
Only the following table operators are supported when running a query on Basic Logs. All functions and binary operators are supported when used within these operators.

- where
- extend
- project – including all its variants (project-away, project-rename, etc.)
- parse and parse-where


Some of the query execution parameters are different for queries over Basic Logs. When it comes to concurrent execution, it will support up to 2 concurrent queries per user. Purge will not be supported on these logs. The time range must be specified in the query header and not within the query body.

Queries can run only in the context of the relevant workspace. Queries cannot run in resource-context.

### Charges

> [!NOTE]
>During the preview period: 
>* Queries on Basic Logs will be free of charge.

Log queries on Basic Logs are charged by the amount of data they scan. For example, If a query is scanning three days of data for a table that ingest 100 GB/day, it would be charged on 300 GB. Calculation is based on chunks of up to one day of data. For more details on billing, see **TODO:** add link to billing page.

## Search jobs
If there is a need for more advanced processing on the results of these queries, customers can use Search Jobs that support Basic Logs. Search Jobs results are available as standard Analytics Log table and can be analyzed using standard queries. **TODO:** add link to Search Job documentation.


## Check if table is configured as Basic Logs
Open Log Analytics in the Azure portal and open the **Tables** tab. (see [Get started with Azure Monitor Log Analytics](./log-analytics-tutorial.md) for detailed instructions).
When browsing the list of tables, Basic Logs tables have a unique icon: 

![Screenshot of the Basic Logs table icon in the table list.](./media/basic-logs/BasicLogsTableIndicator.png)

On hover over Basic Logs table name it will show the table information view, with an indication that the table is configures as Basic Logs:

![Screenshot of the Basic Logs table indicator in the table details.](./media/basic-logs/BasicLogsTableInfo.png)

You can also use **Tables - Get** API call to check whether the table is configured as _Basic Logs_ or _Analytics Logs_.

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}?api-version=2021-07-01-privatepreview
```

### Response Body
|Name | Type | Description |
| --- | --- | --- |
|properties.plan | string  | The table plan: "Analytics" \ "Basic"|
|properties.retentionInDays | integer  | The table's data retention in days. In _Basic Logs_ the value is 8 days, fixed. In _Analytics Logs_, between 7 and 730.| 
|properties.totalRetentionInDays | integer  | The table's data retention including Archive period|
|properties.archiveRetentionInDays|integer|The table's archive period (read-only, calculated).|
|properties.lastPlanModifiedDate|String|Last time when plan was set for this table. Null if no change was ever done from the default settings (read-only) 

### Examples
#### Sample Request
```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/ContainerLog?api-version=2021-07-01-privatepreview
```


#### Sample Response 
Status code: 200
```http
{
    "properties": {
        "retentionInDays": 8,
        "totalRetentionInDays": 8,
        "archiveRetentionInDays": 0,
        "plan": "Basic",
        "lastPlanModifiedDate": "Mon, 01 Nov 2021 15:04:54 GMT",
        "schema": {...},
        "provisioningState": "Succeeded"        
    },
    "id": "subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/ContainerLog",
    "name": "ContainerLog"
}
```
>[!TIP]
>* You can use any REST API tool to run the commands. [Read More](https://docs.microsoft.com/rest/api/azure/)
>* You need to use the Bearer token for authentication. [Read More](https://social.technet.microsoft.com/wiki/contents/articles/51140.azure-rest-management-api-the-quickest-way-to-get-your-bearer-token.aspx)
## Configure a table to Basic Logs 
Use **Tables - Update** API call to set a table to Basic Logs or set it back to analytics log:

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}?api-version=2021-07-01-privatepreview
```

### Request Body
|Name | Type | Description |
| --- | --- | --- |
|properties.plan | string  | The table plan: "Analytics" \ "Basic"|

> [!IMPORTANT]
>* Switching between plans is limited to once a week.
>* Use PUT in the first update of table properties, to create the table entity.
>* To protect your data and prevent data loss, when you switch from a plan with high retention to plan with low retention, the difference will be saved as archived. 
### Examples
#### Sample Request
```http
PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/ContainerLog?api-version=2021-07-01-privatepreview
```

Request body, switch to Basic Logs 
```http
{
    "properties": {
        "plan": "Basic"
    }
}
```
Request body, switch to analytics logs 
```http
{
    "properties": {
        "plan": "Analytics"
    }
}
```
#### Sample Response - Basic Logs table 
Status code: 200
```http
{
    "properties": {
        "retentionInDays": 8,
        "totalRetentionInDays": 30,
        "archiveRetentionInDays": 22,
        "plan": "Basic",
        "lastPlanModifiedDate": "Mon, 01 Nov 2021 15:04:54 GMT",
        "schema": {...}        
    },
    "id": "subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/ContainerLog",
    "name": "ContainerLog"
}
```

## Update table retention
Use **Tables - Update** API call to set table retention.
```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}?api-version=2021-07-01-privatepreview
```

### Request Body
|Name | Type | Description |
| --- | --- | --- |
|properties.retentionInDays | integer  | The table's data retention in days, between 7 and 730. In _Basic Logs_ the value is fixed: 8. Setting this property to null will default to the workspace retention.| 
|properties.totalRetentionInDays | integer  | The table's total data retention including archive period. Setting this property to null will default to properties.retentionInDays, with no archive| 

> [!IMPORTANT]
>* Use PUT in the first update of table properties, to create the table entity.
>* You can configure the table and set retention value in one Update API call.
> [!TIP]
>You can use either PUT or PATCH, with the following difference:  
>When calling **PUT**, if retentionInDays\totalretentionInDays is null or unspecified, their value will be set to default.
>When calling **PATCH**, if retentionInDays\totalretentionInDays is null or unspecified the existing value will be kept. 
>
>properties.retentionInDays default value is the workspace retention and properties.totalRetentionInDays default value is table's retention

## Run queries over Basic Logs table
Queries can be executed from the Log Analytics experience in the Azure portal, or from a dedicated REST API. 

### Run a query from the Portal
Open Log Analytics in the Azure portal and open the **Tables** tab. (see [Get started with Azure Monitor Log Analytics](./log-analytics-tutorial.md) for detailed instructions).
On selecting a table, Log Analytics identifies which type of table it is and the UI is aligned to support the query specifications per the table configuration. On a Basic Logs table, the query authoring experience is aligned to the query limitations as explained above. 
![Screenshot of Query on Basic Logs limitations.](./media/basic-logs/QueryValidator.png)

### Run a query from REST API
Queries on Basic Logs tables can be executed from the Log Analytics REST API: '/search'. 
'/search' API is based on '/query' API with the following changes:
- Query language is according to the limitation explained above
- Time span must be specified in the header


#### Sample Request
```http
https://api.loganalytics.io/v1/workspaces/testWS/search?timespan=P1D
```

Request body
```http
{
    "query": "ContainerLog | where LogEntry has \"some value\"\n",
}
```