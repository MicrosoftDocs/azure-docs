---
title: Webhook actions for log alerts in Azure alerts
description: This article describes how to configure log alert pushes with webhook action and available customizations.
services: monitoring
ms.topic: conceptual
ms.date: 05/02/2023
ms.reviewer: yalavi
---

# Webhook actions for log alert rules

[Log alerts](alerts-log.md) support [configuring action groups to use webhooks](./action-groups.md). In this article, we describe the properties that are available. You can use webhook actions to invoke a single HTTP POST request. The service that's called should support webhooks and know how to use the payload it receives.

We recommend that you use [common alert schema](../alerts/alerts-common-schema.md) for your webhook integrations. The common alert schema provides the advantage of having a single extensible and unified alert payload across all the alert services in Azure Monitor.

For log alert rules that have a custom JSON payload defined, enabling the common alert schema reverts the payload schema to the one described in [Common alert schema](../alerts/alerts-common-schema.md#alert-context-fields-for-log-alerts). If you want to have a custom JSON payload defined, the webhook can't use the common alert schema.

Alerts with the common schema enabled have an upper size limit of 256 KB per alert. A bigger alert doesn't include search results. When the search results aren't included, use `LinkToFilteredSearchResultsAPI` or `LinkToSearchResultsAPI` to access query results via the Log Analytics API.

## Sample payloads
This section shows sample payloads for webhooks for log alerts. The sample payloads include examples when the payload is standard and when it's custom.

### Log alert for all resources logs (from API version `2021-08-01`)

The following sample payload is for a standard webhook when it's used for log alerts based on resources logs:

```json
{
    "schemaId": "azureMonitorCommonAlertSchema",
    "data": {
        "essentials": {
            "alertId": "/subscriptions/12345a-1234b-123c-123d-12345678e/providers/Microsoft.AlertsManagement/alerts/12345a-1234b-123c-123d-12345678e",
            "alertRule": "AcmeRule",
            "severity": "Sev4",
            "signalType": "Log",
            "monitorCondition": "Fired",
            "monitoringService": "Log Alerts V2",
            "alertTargetIDs": [
                "/subscriptions/12345a-1234b-123c-123d-12345678e/resourcegroups/ai-engineering/providers/microsoft.compute/virtualmachines/testvm"
            ],
            "originAlertId": "123c123d-1a23-1bf3-ba1d-dd1234ff5a67",
            "firedDateTime": "2020-07-09T14:04:49.99645Z",
            "description": "log alert rule V2",
            "essentialsVersion": "1.0",
            "alertContextVersion": "1.0"
        },
        "alertContext": {
            "properties": {
              "name1": "value1",
              "name2": "value2"
            },
            "conditionType": "LogQueryCriteria",
            "condition": {
                "windowSize": "PT10M",
                "allOf": [
                    {
                        "searchQuery": "Heartbeat",
                        "metricMeasureColumn": "CounterValue",
                        "targetResourceTypes": "['Microsoft.Compute/virtualMachines']",
                        "operator": "LowerThan",
                        "threshold": "1",
                        "timeAggregation": "Count",
                        "dimensions": [
                            {
                                "name": "ResourceId",
                                "value": "/subscriptions/12345a-1234b-123c-123d-12345678e/resourceGroups/TEST/providers/Microsoft.Compute/virtualMachines/testvm"
                            }
                        ],
                        "metricValue": 0.0,
                        "failingPeriods": {
                            "numberOfEvaluationPeriods": 1,
                            "minFailingPeriodsToAlert": 1
                        },
                        "linkToSearchResultsUI": "https://portal.azure.com#@12f345bf-12f3-12af-12ab-1d2cd345db67/blade/Microsoft_Azure_Monitoring_Logs/LogsBlade/source/Alerts.EmailLinks/scope/%7B%22resources%22%3A%5B%7B%22resourceId%22%3A%22%2Fsubscriptions%2F12345a-1234b-123c-123d-12345678e%2FresourceGroups%2FTEST%2Fproviders%2FMicrosoft.Compute%2FvirtualMachines%2Ftestvm%22%7D%5D%7D/q/eJzzSE0sKklKTSypUSjPSC1KVQjJzE11T81LLUosSU1RSEotKU9NzdNIAfJKgDIaRgZGBroG5roGliGGxlYmJlbGJnoGEKCpp4dDmSmKMk0A/prettify/1/timespan/2020-07-07T13%3a54%3a34.0000000Z%2f2020-07-09T13%3a54%3a34.0000000Z",
                        "linkToFilteredSearchResultsUI": "https://portal.azure.com#@12f345bf-12f3-12af-12ab-1d2cd345db67/blade/Microsoft_Azure_Monitoring_Logs/LogsBlade/source/Alerts.EmailLinks/scope/%7B%22resources%22%3A%5B%7B%22resourceId%22%3A%22%2Fsubscriptions%2F12345a-1234b-123c-123d-12345678e%2FresourceGroups%2FTEST%2Fproviders%2FMicrosoft.Compute%2FvirtualMachines%2Ftestvm%22%7D%5D%7D/q/eJzzSE0sKklKTSypUSjPSC1KVQjJzE11T81LLUosSU1RSEotKU9NzdNIAfJKgDIaRgZGBroG5roGliGGxlYmJlbGJnoGEKCpp4dDmSmKMk0A/prettify/1/timespan/2020-07-07T13%3a54%3a34.0000000Z%2f2020-07-09T13%3a54%3a34.0000000Z",
                        "linkToSearchResultsAPI": "https://api.loganalytics.io/v1/subscriptions/12345a-1234b-123c-123d-12345678e/resourceGroups/TEST/providers/Microsoft.Compute/virtualMachines/testvm/query?query=Heartbeat%7C%20where%20TimeGenerated%20between%28datetime%282020-07-09T13%3A44%3A34.0000000%29..datetime%282020-07-09T13%3A54%3A34.0000000%29%29&timespan=2020-07-07T13%3a54%3a34.0000000Z%2f2020-07-09T13%3a54%3a34.0000000Z",
                        "linkToFilteredSearchResultsAPI": "https://api.loganalytics.io/v1/subscriptions/12345a-1234b-123c-123d-12345678e/resourceGroups/TEST/providers/Microsoft.Compute/virtualMachines/testvm/query?query=Heartbeat%7C%20where%20TimeGenerated%20between%28datetime%282020-07-09T13%3A44%3A34.0000000%29..datetime%282020-07-09T13%3A54%3A34.0000000%29%29&timespan=2020-07-07T13%3a54%3a34.0000000Z%2f2020-07-09T13%3a54%3a34.0000000Z"
                    }
                ],
                "windowStartTime": "2020-07-07T13:54:34Z",
                "windowEndTime": "2020-07-09T13:54:34Z"
            }
        }
    }
}
```

### Log alert for Log Analytics (up to API version `2018-04-16`)
The following sample payload is for a standard webhook action that's used for alerts based on Log Analytics:

> [!NOTE]
> The `"Severity"` field value changes if you've [switched to the current scheduledQueryRules API](./alerts-log-api-switch.md) from the [legacy Log Analytics Alert API](./api-alerts.md).

```json
{
    "SubscriptionId": "12345a-1234b-123c-123d-12345678e",
    "AlertRuleName": "AcmeRule",
    "SearchQuery": "Perf | where ObjectName == \"Processor\" and CounterName == \"% Processor Time\" | summarize AggregatedValue = avg(CounterValue) by bin(TimeGenerated, 5m), Computer",
    "SearchIntervalStartTimeUtc": "2018-03-26T08:10:40Z",
    "SearchIntervalEndtimeUtc": "2018-03-26T09:10:40Z",
    "AlertThresholdOperator": "Greater Than",
    "AlertThresholdValue": 0,
    "ResultCount": 2,
    "SearchIntervalInSeconds": 3600,
    "LinkToSearchResults": "https://portal.azure.com/#Analyticsblade/search/index?_timeInterval.intervalEnd=2018-03-26T09%3a10%3a40.0000000Z&_timeInterval.intervalDuration=3600&q=Usage",
    "LinkToFilteredSearchResultsUI": "https://portal.azure.com/#Analyticsblade/search/index?_timeInterval.intervalEnd=2018-03-26T09%3a10%3a40.0000000Z&_timeInterval.intervalDuration=3600&q=Usage",
    "LinkToSearchResultsAPI": "https://api.loganalytics.io/v1/workspaces/workspaceID/query?query=Heartbeat&timespan=2020-05-07T18%3a11%3a51.0000000Z%2f2020-05-07T18%3a16%3a51.0000000Z",
    "LinkToFilteredSearchResultsAPI": "https://api.loganalytics.io/v1/workspaces/workspaceID/query?query=Heartbeat&timespan=2020-05-07T18%3a11%3a51.0000000Z%2f2020-05-07T18%3a16%3a51.0000000Z",
    "Description": "log alert rule",
    "Severity": "Warning",
    "AffectedConfigurationItems": [
        "INC-Gen2Alert"
    ],
    "Dimensions": [
        {
            "name": "Computer",
            "value": "INC-Gen2Alert"
        }
    ],
    "SearchResult": {
        "tables": [
            {
                "name": "PrimaryResult",
                "columns": [
                    {
                        "name": "$table",
                        "type": "string"
                    },
                    {
                        "name": "Computer",
                        "type": "string"
                    },
                    {
                        "name": "TimeGenerated",
                        "type": "datetime"
                    }
                ],
                "rows": [
                    [
                        "Fabrikam",
                        "33446677a",
                        "2018-02-02T15:03:12.18Z"
                    ],
                    [
                        "Contoso",
                        "33445566b",
                        "2018-02-02T15:16:53.932Z"
                    ]
                ]
            }
        ]
    },
    "WorkspaceId": "12345a-1234b-123c-123d-12345678e",
    "AlertType": "Metric measurement"
}
```

### Log alert for Application Insights (up to API version `2018-04-16`)
The following sample payload is for a standard webhook when it's used for log alerts based on Application Insights resources:
    
```json
{
    "schemaId": "Microsoft.Insights/LogAlert",
    "data": {
        "SubscriptionId": "12345a-1234b-123c-123d-12345678e",
        "AlertRuleName": "AcmeRule",
        "SearchQuery": "requests | where resultCode == \"500\" | summarize AggregatedValue = Count by bin(Timestamp, 5m), IP",
        "SearchIntervalStartTimeUtc": "2018-03-26T08:10:40Z",
        "SearchIntervalEndtimeUtc": "2018-03-26T09:10:40Z",
        "AlertThresholdOperator": "Greater Than",
        "AlertThresholdValue": 0,
        "ResultCount": 2,
        "SearchIntervalInSeconds": 3600,
        "LinkToSearchResults": "https://portal.azure.com/AnalyticsBlade/subscriptions/12345a-1234b-123c-123d-12345678e/?query=search+*+&timeInterval.intervalEnd=2018-03-26T09%3a10%3a40.0000000Z&_timeInterval.intervalDuration=3600&q=Usage",
        "LinkToFilteredSearchResultsUI": "https://portal.azure.com/AnalyticsBlade/subscriptions/12345a-1234b-123c-123d-12345678e/?query=search+*+&timeInterval.intervalEnd=2018-03-26T09%3a10%3a40.0000000Z&_timeInterval.intervalDuration=3600&q=Usage",
        "LinkToSearchResultsAPI": "https://api.applicationinsights.io/v1/apps/0MyAppId0/metrics/requests/count",
        "LinkToFilteredSearchResultsAPI": "https://api.applicationinsights.io/v1/apps/0MyAppId0/metrics/requests/count",
        "Description": null,
        "Severity": "3",
        "Dimensions": [
            {
                "name": "IP",
                "value": "1.1.1.1"
            }
        ],
        "SearchResult": {
            "tables": [
                {
                    "name": "PrimaryResult",
                    "columns": [
                        {
                            "name": "$table",
                            "type": "string"
                        },
                        {
                            "name": "Id",
                            "type": "string"
                        },
                        {
                            "name": "Timestamp",
                            "type": "datetime"
                        }
                    ],
                    "rows": [
                        [
                            "Fabrikam",
                            "33446677a",
                            "2018-02-02T15:03:12.18Z"
                        ],
                        [
                            "Contoso",
                            "33445566b",
                            "2018-02-02T15:16:53.932Z"
                        ]
                    ]
                }
            ]
        },
        "ApplicationId": "123123f0-01d3-12ab-123f-abc1ab01c0a1",
        "AlertType": "Metric measurement"
    }
}
```

### Log alert with a custom JSON payload (up to API version `2018-04-16`)

> [!NOTE]
> A custom JSON-based webhook isn't supported from API version `2021-08-01`.

The following table lists default webhook action properties and their custom JSON parameter names.

| Parameter | Variable | Description |
|:--- |:--- |:--- |
| `AlertRuleName` |#alertrulename |Name of the alert rule. |
| `Severity` |#severity |Severity set for the fired log alert. |
| `AlertThresholdOperator` |#thresholdoperator |Threshold operator for the alert rule. |
| `AlertThresholdValue` |#thresholdvalue |Threshold value for the alert rule. |
| `LinkToSearchResults` |#linktosearchresults |Link to the Analytics portal that returns the records from the query that created the alert. |
| `LinkToSearchResultsAPI` |#linktosearchresultsapi |Link to the Analytics API that returns the records from the query that created the alert. |
| `LinkToFilteredSearchResultsUI` |#linktofilteredsearchresultsui |Link to the Analytics portal that returns the records from the query filtered by dimensions value combinations that created the alert. |
| `LinkToFilteredSearchResultsAPI` |#linktofilteredsearchresultsapi |Link to the Analytics API that returns the records from the query filtered by dimensions value combinations that created the alert. |
| `ResultCount` |#searchresultcount |Number of records in the search results. |
| `Search Interval End time` |#searchintervalendtimeutc |End time for the query in UTC, with the format mm/dd/yyyy HH:mm:ss AM/PM. |
| `Search Interval` |#searchinterval |Time window for the alert rule, with the format HH:mm:ss. |
| `Search Interval StartTime` |#searchintervalstarttimeutc |Start time for the query in UTC, with the format mm/dd/yyyy HH:mm:ss AM/PM. 
| `SearchQuery` |#searchquery |Log search query used by the alert rule. |
| `SearchResults` |"IncludeSearchResults": true|Records returned by the query as a JSON table, limited to the first 1,000 records. "IncludeSearchResults": true is added in a custom JSON webhook definition as a top-level property. |
| `Dimensions` |"IncludeDimensions": true|Dimensions value combinations that triggered that alert as a JSON section. "IncludeDimensions": true is added in a custom JSON webhook definition as a top-level property. |
| `Alert Type`| #alerttype | The type of log alert rule configured as [Metric measurement or Number of results](./alerts-unified-log.md#measure).|
| `WorkspaceID` |#workspaceid |ID of your Log Analytics workspace. |
| `Application ID` |#applicationid |ID of your Application Insights app. |
| `Subscription ID` |#subscriptionid |ID of your Azure subscription used. |

You can use **Include custom JSON payload for webhook** to get a custom JSON payload by using the parameters. You can also generate more properties.

For example, you might specify the following custom payload that includes a single parameter called `text`. The service that this webhook calls expects this parameter:

```json

    {
        "text":"#alertrulename fired with #searchresultcount over threshold of #thresholdvalue."
    }
```

This example payload resolves to something like the following example when it's sent to the webhook:

```json
    {
        "text":"My Alert Rule fired with 18 records over threshold of 10 ."
    }
```

Variables in a custom webhook must be specified within a JSON enclosure. For example, referencing `#searchresultcount` in the webhook example generates output based on the alert results.

To include search results, add **IncludeSearchResults** as a top-level property in the custom JSON. Search results are included as a JSON structure, so results can't be referenced in custom-defined fields.

> [!NOTE]
> The **View Webhook** button next to the **Include custom JSON payload for webhook** option displays a preview of what was provided. It doesn't contain actual data but is representative of the JSON schema that will be used.

For example, to create a custom payload that includes only the alert name and the search results, use this configuration:

```json
    {
       "alertname":"#alertrulename",
       "IncludeSearchResults":true
    }
```

The following sample payload is for a custom webhook action for any log alert:
    
```json
    {
    "alertname":"AcmeRule","IncludeSearchResults":true,
    "SearchResults":
        {
        "tables":[
                    {"name":"PrimaryResult","columns":
                        [
                        {"name":"$table","type":"string"},
                        {"name":"Id","type":"string"},
                        {"name":"TimeGenerated","type":"datetime"}
                        ],
                    "rows":
                        [
                            ["Fabrikam","33446677a","2018-02-02T15:03:12.18Z"],
                            ["Contoso","33445566b","2018-02-02T15:16:53.932Z"]
                        ]
                    }
                ]
        }
    }
```

## Next steps
- Learn about [log alerts in Azure alerts](./alerts-unified-log.md).
- Understand how to [manage log alerts in Azure](alerts-log.md).
- Create and manage [action groups in Azure](./action-groups.md).
- Learn more about [Application Insights](../logs/log-query-overview.md).
- Learn more about [log queries](../logs/log-query-overview.md).
