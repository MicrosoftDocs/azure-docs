---
title: Configure webhooks on Azure metric alerts | Microsoft Docs
description: Reroute Azure alerts to other non-Azure systems.
author: kamathashwin
manager: carmonm
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: 8b3ae540-1d19-4f3d-a635-376042f8a5bb
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/03/2017
ms.author: ashwink

---
# Configure a webhook on an Azure metric alert
Webhooks allow you to route an Azure alert notification to other systems for post-processing or custom actions. You can use a webhook on an alert to route it to services that send SMS, log bugs, notify a team via chat/messaging services, or do any number of other actions. This article describes how to set a webhook on an Azure metric alert and what the payload for the HTTP POST to a webhook looks like. For information on the setup and schema for an Azure Activity Log alert (alert on events), [see this page instead](insights-auditlog-to-webhook-email.md).

Azure alerts HTTP POST the alert contents in JSON format, schema defined below, to a webhook URI that you provide when creating the alert. This URI must be a valid HTTP or HTTPS endpoint. Azure posts one entry per request when an alert is activated.

## Configuring webhooks via the portal
You can add or update the webhook URI in the Create/Update Alerts screen in the [portal](https://portal.azure.com/).

![Add an alert Rule](./media/insights-webhooks-alerts/Alertwebhook.png)

You can also configure an alert to post to a webhook URI using the [Azure PowerShell Cmdlets](insights-powershell-samples.md#create-alert-rules), [Cross-Platform CLI](insights-cli-samples.md#work-with-alerts), or [Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn933805.aspx).

## Authenticating the webhook
The webhook can authenticate using token-based authorization. The webhook URI is saved with a token ID, eg. `https://mysamplealert/webcallback?tokenid=sometokenid&someparameter=somevalue`

## Payload schema
The POST operation contains the following JSON payload and schema for all metric-based alerts.

```JSON
{
"status": "Activated",
"context": {
            "timestamp": "2015-08-14T22:26:41.9975398Z",
            "id": "/subscriptions/s1/resourceGroups/useast/providers/microsoft.insights/alertrules/ruleName1",
            "name": "ruleName1",
            "description": "some description",
            "conditionType": "Metric",
            "condition": {
                        "metricName": "Requests",
                        "metricUnit": "Count",
                        "metricValue": "10",
                        "threshold": "10",
                        "windowSize": "15",
                        "timeAggregation": "Average",
                        "operator": "GreaterThanOrEqual"
                },
            "subscriptionId": "s1",
            "resourceGroupName": "useast",                                
            "resourceName": "mysite1",
            "resourceType": "microsoft.foo/sites",
            "resourceId": "/subscriptions/s1/resourceGroups/useast/providers/microsoft.foo/sites/mysite1",
            "resourceRegion": "centralus",
            "portalLink": "https://portal.azure.com/#resource/subscriptions/s1/resourceGroups/useast/providers/microsoft.foo/sites/mysite1"
},
"properties": {
              "key1": "value1",
              "key2": "value2"
              }
}
```


| Field | Mandatory | Fixed Set of Values | Notes |
|:--- |:--- |:--- |:--- |
| status |Y |“Activated”, “Resolved” |Status for the alert based off of the conditions you have set. |
| context |Y | |The alert context. |
| timestamp |Y | |The time at which the alert was triggered. |
| id |Y | |Every alert rule has a unique id. |
| name |Y | |The alert name. |
| description |Y | |Description of the alert. |
| conditionType |Y |“Metric”, “Event” |Two types of alerts are supported. One based on a metric condition and the other based on an event in the Activity Log. Use this value to check if the alert is based on metric or event. |
| condition |Y | |The specific fields to check for based on the conditionType. |
| metricName |for Metric alerts | |The name of the metric that defines what the rule monitors. |
| metricUnit |for Metric alerts |"Bytes", "BytesPerSecond", "Count", "CountPerSecond", "Percent", "Seconds" |The unit allowed in the metric. [Allowed values are listed here](https://msdn.microsoft.com/library/microsoft.azure.insights.models.unit.aspx). |
| metricValue |for Metric alerts | |The actual value of the metric that caused the alert. |
| threshold |for Metric alerts | |The threshold value at which the alert is activated. |
| windowSize |for Metric alerts | |The period of time that is used to monitor alert activity based on the threshold. Must be between 5 minutes and 1 day. ISO 8601 duration format. |
| timeAggregation |for Metric alerts |"Average", "Last", "Maximum", "Minimum", "None", "Total" |How the data that is collected should be combined over time. The default value is Average. [Allowed values are listed here](https://msdn.microsoft.com/library/microsoft.azure.insights.models.aggregationtype.aspx). |
| operator |for Metric alerts | |The operator used to compare the current metric data to the set threshold. |
| subscriptionId |Y | |Azure subscription ID. |
| resourceGroupName |Y | |Name of the resource group for the impacted resource. |
| resourceName |Y | |Resource name of the impacted resource. |
| resourceType |Y | |Resource type of the impacted resource. |
| resourceId |Y | |Resource ID of the impacted resource. |
| resourceRegion |Y | |Region or location of the impacted resource. |
| portalLink |Y | |Direct link to the portal resource summary page. |
| properties |N |Optional |Set of `<Key, Value>` pairs (i.e. `Dictionary<String, String>`) that includes details about the event. The properties field is optional. In a custom UI or Logic app-based workflow, users can enter key/values that can be passed via the payload. The alternate way to pass custom properties back to the webhook is via the webhook uri itself (as query parameters) |

> [!NOTE]
> The properties field can only be set using the [Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn933805.aspx).
>
>

## Next steps
* Learn more about Azure alerts and webhooks in the video [Integrate Azure Alerts with PagerDuty](http://go.microsoft.com/fwlink/?LinkId=627080)
* [Execute Azure Automation scripts (Runbooks) on Azure alerts](http://go.microsoft.com/fwlink/?LinkId=627081)
* [Use Logic App to send an SMS via Twilio from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-text-message-with-logic-app)
* [Use Logic App to send a Slack message from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-slack-with-logic-app)
* [Use Logic App to send a message to an Azure Queue from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-queue-with-logic-app)
