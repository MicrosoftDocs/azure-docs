<properties
	pageTitle="Configure webhooks on Azure Alerts | Microsoft Azure"
	description="Reroute Azure alerts to other non-Azure systems."
	authors="kamathashwin"
	manager=""
	editor=""
	services="monitoring-and-diagnostics"
	documentationCenter="monitoring-and-diagnostics"/>

<tags
	ms.service="monitoring-and-diagnostics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/15/2016"
	ms.author="ashwink"/>

# Configure a webhook on an Azure Alert

Webhooks allow you to route the Azure Alert notification to other systems for post-processing or custom actions. You can use a webhook on an alert to route it to services that send SMS, log bugs, notify a team via chat/messaging services, or do any number of other actions. This article will describe how to set a webhook on an Azure metric alert and what the payload for the HTTP POST to a webhook will be. For information on the setup and schema for an Azure Activity Log alert (alert on events), [see this page instead](./insights-auditlog-to-webhook-email.md).

Azure alerts HTTP POST the alert contents in JSON format, schema defined below, to a webhook URI that you provide when creating the alert. This URI must be a valid HTTP or HTTPS endpoint.

## Configuring webhooks via the portal

You can add or update the webhook URI in the Create/Update Alerts screen in the [Azure Portal](https://portal.azure.com/).

![Add an alert Rule](./media/insights-webhooks-alerts/Alertwebhook.png)

You can also configure an alert to post to a webhook URI using the [Azure PowerShell Cmdlets](./insights-powershell-samples.md#create-alert-rules), [Cross-Platform CLI](./insights-cli-samples.md#work-with-alerts), or [Insights REST API](https://msdn.microsoft.com/library/azure/dn933805.aspx).

## Authenticating the webhook

The webhook can authenticate using either of these methods:

1. **Token-based authorization** - The webhook URI is saved with a token ID, eg. `https://mysamplealert/webcallback?tokenid=sometokenid&someparameter=somevalue`
2.	**Basic authorization** - The webhook URI is saved with a username and password, eg. `https://userid:password@mysamplealert/webcallback?someparamater=somevalue&foo=bar`

## Payload schema

The POST operation will contain the following JSON payload and schema for all metric-based alerts.

```
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


| Field | Mandatory? | Fixed Set of Value(s)? | Notes |
| :-------------| :-------------   | :-------------   | :-------------   |
|status|Y|“Activated”, “Resolved”|This is how you find out what kind of alert it is. Azure automatically sends activated and resolved alerts for the condition one sets.|
|context| Y | | The alert context|
|timestamp| Y | | The time at which the alert was triggered. The alert is triggered as soon as the metric is read from the diagnostics storage.|
|id | Y | | Every alert rule has a unique id.|
|name|Y					|							|
|description		|Y					|							|Description about the alert.|
|conditionType		|Y					|“Metric”, “Event”			|Two types of alerts are supported. One based on metric and the other based on event. In the future we will support alerts for Events, so use this value to check if the alert is based on metric or event|
|condition			|Y					|							|This will have the specific fields to check for based on the conditionType|
|metricName			|for Metric alerts	|							|The name of the metric that defines what the rule monitors.|
|metricUnit			|for Metric alerts	|"Bytes", "BytesPerSecond" , "Count" , "CountPerSecond" , "Percent", "Seconds"|	 The unit allowed in the metric. Allowed values: https://msdn.microsoft.com/library/microsoft.azure.insights.models.unit.aspx|
|metricValue		|for Metric alerts	|							|The actual value of the metric that caused the alert|
|threshold			|for Metric alerts	|							|The threshold value that activates the alert|
|windowSize			|for Metric alerts	|							|The period of time that is used to monitor alert activity based on the threshold. Must be between 5 minutes and 1 day. ISO 8601 duration format.|
|timeAggregation	|for Metric alerts	|"Average", "Last" , "Maximum" , "Minimum" , "None", "Total" |	How the data that is collected should be combined over time. The default value is Average. Allowed values: https://msdn.microsoft.com/library/microsoft.azure.insights.models.aggregationtype.aspx|
|operator			|for Metric alerts 	|							|The operator used to compare the data and the threshold.|
|subscriptionId	 	|Y					|							|Azure subscription GUID|
|resourceGroupName	|Y					|							|resource-group-name of the impacted resource|
|resourceName	 	|Y					|							|resource name of the impacted resource|
|resourceType	 	|Y					|							|resource type of the impacted resource|
|resourceId	 		|Y					|							|resource id URI that uniquely identifies that resource|
|resourceRegion	 	|Y					|							|region/location of the resource that's impacted|
|portalLink	 		|Y					|							|direct azure portal link to the resource summary page|
|properties			|N					|Optional					|Is a set of <Key, Value> pairs (i.e. Dictionary<String, String>) that includes details about the event. The properties field is optional. In a custom UI or Logic app based workflow, users can enter key/values that can be passed via the payload. The alternate way to pass custom properties back to the webhook is via the webhook uri itself (as query parameters)|


>[AZURE.NOTE] The properties field can only be set using the [Insights REST API](https://msdn.microsoft.com/library/azure/dn933805.aspx).

## Next steps

- Learn more about Azure alerts and webhooks in the video [Integrate Azure Alerts with PagerDuty](http://go.microsoft.com/fwlink/?LinkId=627080)
- [Execute Azure Automation scripts (Runbooks) on Azure alerts](http://go.microsoft.com/fwlink/?LinkId=627081)
- [Use Logic App to send an SMS via Twilio from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-text-message-with-logic-app)
- [Use Logic App to send a Slack message from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-slack-with-logic-app)
- [Use Logic App to send a message to an Azure Queue from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-queue-with-logic-app)
