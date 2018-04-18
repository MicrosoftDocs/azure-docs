---
title: Webhook actions for log alerts in Azure Alerts (Preview) | Microsoft Docs
description: This article describes how to an log alert rule using log analytics or application insights, will push data as HTTP webhook and details of the different customizations possible.
author: msvijayn
manager: kmadnani1
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: 
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 2/2/2018
ms.author: vinagara

---

# Webhook actions for log alert rules
When an [alert is created in Azure (Preview)](monitor-alerts-unified-usage.md), you have the option of [configuring using action groups](monitoring-action-groups.md) to perform one or more actions.  This article describes the different webhook actions that are available and details on configuring the custom JSON-based webhook.


## Webhook actions

Webhook actions allow you to invoke an external process through a single HTTP POST request.  The service being called should support webhooks and determine how it uses any payload it receives.   Examples of using a webhook in response to an alert are sending a message in [Slack](http://slack.com) or creating an incident in [PagerDuty](http://pagerduty.com/).  

Webhook actions require the properties in the following table:

| Property | Description |
|:--- |:--- |
| Webhook URL |The URL of the webhook. |
| Custom JSON payload |Custom payload to send with the webhook, when this option is chosen during alert creation. Details available at [Manage alerts using Azure Alerts (Preview)](monitor-alerts-unified-usage.md) |

> [!NOTE]
> Test Webhook button alongside *Include custom JSON payload for webhook* option for Log Alert, will trigger dummy call to test the webhook URL. It does not contain actual data and representative of JSON schema used for Log Alerts. 

Webhooks include a URL and a payload formatted in JSON that is the data sent to the external service.  By default, the payload includes the values in the following table:  You can choose to replace this payload with a custom one of your own.  In that case you can use the variables in the table for each of the parameters to include their value in your custom payload.


| Parameter | Variable | Description |
|:--- |:--- |:--- |
| AlertRuleName |#alertrulename |Name of the alert rule. |
| Severity |#severity |Severity set for the fired log alert. |
| AlertThresholdOperator |#thresholdoperator |Threshold operator for the alert rule.  *Greater than* or *Less than*. |
| AlertThresholdValue |#thresholdvalue |Threshold value for the alert rule. |
| LinkToSearchResults |#linktosearchresults |Link to Log Analytics log search that returns the records from the query that created the alert. |
| ResultCount |#searchresultcount |Number of records in the search results. |
| Search Interval End time |#searchintervalendtimeutc |End time for the query in UTC format. |
| Search Interval |#searchinterval |Time window for the alert rule. |
| Search Interval StartTime |#searchintervalstarttimeutc |Start time for the query in UTC format. 
| SearchQuery |#searchquery |Log search query used by the alert rule. |
| SearchResults |"IncludeSearchResults": true|Records returned by the query as a JSON Table, limited to the first 1,000 records; if "IncludeSearchResults": true is added in custom JSON webhook definition as a top-level property. |
| WorkspaceID |#workspaceid |ID of your Log Analytics (OMS) workspace. |
| Application ID |#applicationid |ID of your Application Insight app. |
| Subscription ID |#subscriptionid |ID of your Azure Subscription used with Application Insights. 


For example, you might specify the following custom payload that includes a single parameter called *text*.  The service that this webhook calls would be expecting this parameter.

    {
        "text":"#alertrulename fired with #searchresultcount over threshold of #thresholdvalue."
    }

This example payload would resolve to something like the following when sent to the webhook.

    {
        "text":"My Alert Rule fired with 18 records over threshold of 10 ."
    }

To include search results in a custom payload, ensure that **IncudeSearchResults** is set as a top-level property in the json payload. 

## Sample payloads
This section shows sample payload for webhook for Log Alerts, including when payload is standard and when its custom.

> [!NOTE]
> To ensure backward compatibility, standard webhook payload for alerts using Azure Log Analytics is same as [OMS alert management](../log-analytics/log-analytics-alerts-creating.md). But for log alerts using [Application Insights](../application-insights/app-insights-analytics.md), the standard webhook payload is based on Action Group schema.

### Standard Webhook for Log Alerts 
Both of these examples have stated a dummy payload with only two columns and two rows.

#### Log Alert for Azure Log-Analytics
Following is a sample payload for a standard webhook action *without custom Json option* being used for  log analytics-based alerts.

    {
	"WorkspaceId":"12345a-1234b-123c-123d-12345678e",
	"AlertRuleName":"AcmeRule","SearchQuery":"search *",
	"SearchResult":
        {
		"tables":[
                    {"name":"PrimaryResult","columns":
                        [
				        {"name":"$table","type":"string"},
					    {"name":"Id","type":"string"},
					    {"name":"TimeGenerated","type":"datetime"},
                        ],
					"rows":
                        [
						    ["Fabrikam","33446677a","2018-02-02T15:03:12.18Z"],
                            ["Contoso","33445566b","2018-02-02T15:16:53.932Z"]
                        ]
                    }
                ]
        }
    "SearchIntervalStartTimeUtc": "2018-03-26T08:10:40Z",
    "SearchIntervalEndtimeUtc": "2018-03-26T09:10:40Z",
    "AlertThresholdOperator": "Greater Than",
    "AlertThresholdValue": 0,
    "ResultCount": 2,
    "SearchIntervalInSeconds": 3600,
    "LinkToSearchResults": "https://workspaceID.portal.mms.microsoft.com/#Workspace/search/index?_timeInterval.intervalEnd=2018-03-26T09%3a10%3a40.0000000Z&_timeInterval.intervalDuration=3600&q=Usage",
    "Description": null,
    "Severity": "Warning"
    }
    


#### Log Alert for Azure Application Insights
Following is a sample payload for a standard webhook *without custom Json option* when used for application insights-based log-alerts.
    

    {
    "schemaId":"Microsoft.Insights/LogAlert","data":
    { 
	"SubscriptionId":"12345a-1234b-123c-123d-12345678e",
	"AlertRuleName":"AcmeRule","SearchQuery":"search *",
	"SearchResult":
        {
		"tables":[
                    {"name":"PrimaryResult","columns":
                        [
				        {"name":"$table","type":"string"},
					    {"name":"Id","type":"string"},
					    {"name":"TimeGenerated","type":"datetime"},
                        ],
					"rows":
                        [
						    ["Fabrikam","33446677a","2018-02-02T15:03:12.18Z"],
                            ["Contoso","33445566b","2018-02-02T15:16:53.932Z"]
                        ]
                    }
                ]
        }
    "SearchIntervalStartTimeUtc": "2018-03-26T08:10:40Z",
    "SearchIntervalEndtimeUtc": "2018-03-26T09:10:40Z",
    "AlertThresholdOperator": "Greater Than",
    "AlertThresholdValue": 0,
    "ResultCount": 2,
    "SearchIntervalInSeconds": 3600,
    "LinkToSearchResults": "https://analytics.applicationinsights.io/subscriptions/12345a-1234b-123c-123d-12345678e/?query=search+*+&timeInterval.intervalEnd=2018-03-26T09%3a10%3a40.0000000Z&_timeInterval.intervalDuration=3600&q=Usage",
    "Description": null,
    "Severity": "Error"
    "ApplicationId": "123123f0-01d3-12ab-123f-abc1ab01c0a1"
    }
    }


#### Log Alert with custom JSON Payload
For example, to create a custom payload that includes just the alert name and the search results, you could use the following: 

    {
       "alertname":"#alertrulename",
       "IncludeSearchResults":true
    }

Following is a sample payload for a custom webhook action for any log alert.
    

    {
    "AlertRuleName":"AcmeRule","IncludeSearchResults":true,
	"SearchResult":
        {
		"tables":[
                    {"name":"PrimaryResult","columns":
                        [
				        {"name":"$table","type":"string"},
					    {"name":"Id","type":"string"},
					    {"name":"TimeGenerated","type":"datetime"},
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




## Next steps
- Learn about [Log Alerts in Azure Alerts (preview)](monitor-alerts-unified-log.md)
- Create and manage [action groups in Azure](monitoring-action-groups.md)
- Learn more about [Application Insights](../application-insights/app-insights-analytics.md)
- Learn more about [Log Analytics](../log-analytics/log-analytics-overview.md). 