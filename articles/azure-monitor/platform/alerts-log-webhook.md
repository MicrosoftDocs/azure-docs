---
title: Webhook actions for log alerts in Azure alerts
description: This article describes how to create a log alert rule by using the Log Analytics workspace or Application Insights, how the alert pushes data as an HTTP webhook, and the details of the different customizations that are possible.
author: msvijayn
services: monitoring
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 06/25/2019
ms.author: vinagara
ms.subservice: alerts
---

# Webhook actions for log alert rules
When a [log alert is created in Azure](alerts-log.md), you have the option of [configuring it by using action groups](action-groups.md) to perform one or more actions. This article describes the different webhook actions that are available and shows how to configure a custom JSON-based webhook.

> [!NOTE]
> You also can use the [common alert schema](https://aka.ms/commonAlertSchemaDocs) for your webhook integrations. The common alert schema provides the advantage of having a single extensible and unified alert payload across all the alert services in Azure Monitor. [Learn about the common alert schema definitions.](https://aka.ms/commonAlertSchemaDefinitions)​

## Webhook actions

With webhook actions, you can invoke an external process through a single HTTP POST request. The service that's called should support webhooks and determine how to use any payload it receives.

Webhook actions require the properties in the following table.

| Property | Description |
|:--- |:--- |
| **Webhook URL** |The URL of the webhook. |
| **Custom JSON payload** |The custom payload to send with the webhook when this option is chosen during alert creation. For more information, see [Manage log alerts](alerts-log.md).|

> [!NOTE]
> The **View Webhook** button alongside the **Include custom JSON payload for webhook** option for the log alert displays the sample webhook payload for the customization that was provided. It doesn't contain actual data but is representative of the JSON schema that's used for log alerts. 

Webhooks include a URL and a payload formatted in JSON that the data sent to the external service. By default, the payload includes the values in the following table. You can choose to replace this payload with a custom one of your own. In that case, use the variables in the table for each of the parameters to include their values in your custom payload.


| Parameter | Variable | Description |
|:--- |:--- |:--- |
| *AlertRuleName* |#alertrulename |Name of the alert rule. |
| *Severity* |#severity |Severity set for the fired log alert. |
| *AlertThresholdOperator* |#thresholdoperator |Threshold operator for the alert rule, which uses greater than or less than. |
| *AlertThresholdValue* |#thresholdvalue |Threshold value for the alert rule. |
| *LinkToSearchResults* |#linktosearchresults |Link to the Analytics portal that returns the records from the query that created the alert. |
| *ResultCount* |#searchresultcount |Number of records in the search results. |
| *Search Interval End time* |#searchintervalendtimeutc |End time for the query in UTC, with the format mm/dd/yyyy HH:mm:ss AM/PM. |
| *Search Interval* |#searchinterval |Time window for the alert rule, with the format HH:mm:ss. |
| *Search Interval StartTime* |#searchintervalstarttimeutc |Start time for the query in UTC, with the format mm/dd/yyyy HH:mm:ss AM/PM. 
| *SearchQuery* |#searchquery |Log search query used by the alert rule. |
| *SearchResults* |"IncludeSearchResults": true|Records returned by the query as a JSON table, limited to the first 1,000 records, if "IncludeSearchResults": true is added in a custom JSON webhook definition as a top-level property. |
| *Alert Type*| #alerttype | The type of log alert rule configured as [Metric measurement](alerts-unified-log.md#metric-measurement-alert-rules) or [Number of results](alerts-unified-log.md#number-of-results-alert-rules).|
| *WorkspaceID* |#workspaceid |ID of your Log Analytics workspace. |
| *Application ID* |#applicationid |ID of your Application Insights app. |
| *Subscription ID* |#subscriptionid |ID of your Azure subscription used. 

> [!NOTE]
> *LinkToSearchResults* passes parameters like *SearchQuery*, *Search Interval StartTime*, and *Search Interval End time* in the URL to the Azure portal for viewing in the Analytics section. The Azure portal has a URI size limit of approximately 2,000 characters. The portal will *not* open links provided in alerts if the parameter values exceed the limit. You can manually input details to view results in the Analytics portal. Or, you can use the [Application Insights Analytics REST API](https://dev.applicationinsights.io/documentation/Using-the-API) or the [Log Analytics REST API](/rest/api/loganalytics/) to retrieve results programmatically. 

For example, you might specify the following custom payload that includes a single parameter called *text*. The service that this webhook calls expects this parameter.

```json

    {
        "text":"#alertrulename fired with #searchresultcount over threshold of #thresholdvalue."
    }
```
This example payload resolves to something like the following when it's sent to the webhook:

```json
    {
        "text":"My Alert Rule fired with 18 records over threshold of 10 ."
    }
```
Because all variables in a custom webhook must be specified within a JSON enclosure, like "#searchinterval," the resultant webhook also has variable data inside enclosures, like "00:05:00."

To include search results in a custom payload, ensure that **IncludeSearchResults** is set as a top-level property in the JSON payload. 

## Sample payloads
This section shows sample payloads for webhooks for log alerts. The sample payloads include examples when the payload is standard and when it's custom.

### Standard webhook for log alerts 
Both of these examples have a dummy payload with only two columns and two rows.

#### Log alert for Log Analytics
The following sample payload is for a standard webhook action *without a custom JSON option* that's used for alerts based on Log Analytics:

```json
{
	"SubscriptionId":"12345a-1234b-123c-123d-12345678e",
	"AlertRuleName":"AcmeRule",
    "SearchQuery":"Perf | where ObjectName == \"Processor\" and CounterName == \"% Processor Time\" | summarize AggregatedValue = avg(CounterValue) by bin(TimeGenerated, 5m), Computer",
    "SearchIntervalStartTimeUtc": "2018-03-26T08:10:40Z",
    "SearchIntervalEndtimeUtc": "2018-03-26T09:10:40Z",
    "AlertThresholdOperator": "Greater Than",
    "AlertThresholdValue": 0,
    "ResultCount": 2,
    "SearchIntervalInSeconds": 3600,
    "LinkToSearchResults": "https://portal.azure.com/#Analyticsblade/search/index?_timeInterval.intervalEnd=2018-03-26T09%3a10%3a40.0000000Z&_timeInterval.intervalDuration=3600&q=Usage",
    "Description": "log alert rule",
    "Severity": "Warning",
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
        },
	"WorkspaceId":"12345a-1234b-123c-123d-12345678e",
    "AlertType": "Metric measurement"
 }
 ```

> [!NOTE]
> The "Severity" field value might change if you've [switched your API preference](alerts-log-api-switch.md) for log alerts on Log Analytics.


#### Log alert for Application Insights
The following sample payload is for a standard webhook *without a custom JSON option* when it's used for log alerts based on Application Insights:
    
```json
{
    "schemaId":"Microsoft.Insights/LogAlert","data":
    { 
	"SubscriptionId":"12345a-1234b-123c-123d-12345678e",
	"AlertRuleName":"AcmeRule",
    "SearchQuery":"requests | where resultCode == \"500\"",
    "SearchIntervalStartTimeUtc": "2018-03-26T08:10:40Z",
    "SearchIntervalEndtimeUtc": "2018-03-26T09:10:40Z",
    "AlertThresholdOperator": "Greater Than",
    "AlertThresholdValue": 0,
    "ResultCount": 2,
    "SearchIntervalInSeconds": 3600,
    "LinkToSearchResults": "https://portal.azure.com/AnalyticsBlade/subscriptions/12345a-1234b-123c-123d-12345678e/?query=search+*+&timeInterval.intervalEnd=2018-03-26T09%3a10%3a40.0000000Z&_timeInterval.intervalDuration=3600&q=Usage",
    "Description": null,
    "Severity": "3",
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
        },
    "ApplicationId": "123123f0-01d3-12ab-123f-abc1ab01c0a1",
    "AlertType": "Number of results"
    }
}
```

#### Log alert with custom JSON payload
For example, to create a custom payload that includes just the alert name and the search results, you can use the following: 

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
- Learn about [log alerts in Azure alerts](alerts-unified-log.md).
- Understand how to [manage log alerts in Azure](alerts-log.md).
- Create and manage [action groups in Azure](action-groups.md).
- Learn more about [Application Insights](../../azure-monitor/app/analytics.md).
- Learn more about [log queries](../log-query/log-query-overview.md). 

