<properties
	pageTitle="How to configure Azure alerts to send to other systems"
	description="Reroute Azure alerts to other non-Azure systems."
	authors="kamathashwin"
	manager=""
	editor=""
	services="azure-portal"
	documentationCenter="na"/>

<tags
	ms.service="azure-portal"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/16/2016"
	ms.author="ashwink"/>

# How to configure webhooks for alerts

Webhooks allow the user to route the Azure Alert notifications to other systems for post-processing or custom notifications. Examples of this can be routing the Alert to services that can handle an incoming web request to send SMS, log bugs, notify a team via chat/messaging services etc.

The webhook uri must be a valid HTTP or HTTPS endpoint. The Azure Alert service will make a POST operation at the specified webhook, passing on a specific JSON payload and schema.

## Configuring webhooks via the portal

In the Create/Update Alerts screen on the [Azure Portal](https://portal.azure.com/), you can add or update the webhook uri.

![Add an alert Rule](./media/insights-webhooks-alerts/Alertwebhook.png)


## Authentication

The authentication can be of two types:

1. **Token Based auth** - In this case you will save the webhook uri with a token Id such as *https://mysamplealert/webcallback?tokenid=sometokenid&someparameter=somevalue*
2.	**Basic Auth** - using a userid and password:
In this case you will save the webhook uri as *https://userid:password@mysamplealert/webcallback?someparamater=somevalue&foo=bar*

## Payload schema

The POST operation will contain the following JSON payload and schema for all metric based alerts.

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

>[AZURE.NOTE] In our next refresh, we will add support for alerts on Events (“conditionType” : “Event”)


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


>[AZURE.NOTE] You cannot use the properties field via the Portal. In our upcoming release of the Insights SDK, you can set the properties via the Alert API.

## Next steps

For additional background, learn more about Azure Alerts and webhooks in the video [Integrate Azure Alerts with PagerDuty](http://go.microsoft.com/fwlink/?LinkId=627080)

To learn how to programmatically create a webhook see [Create an Alert with Webhooks using Azure Insights SDK (C#)](https://code.msdn.microsoft.com/Create-Azure-Alerts-with-b938077a).

Once you have set up your webhooks and Alerts, explore these other options to initiate an automation script.

[Execute Azure Automation scripts (Runbooks)](http://go.microsoft.com/fwlink/?LinkId=627081)

Use Azure Alerts to send messages to other services. Use the following example templates to get started.

[Use Logic App to send SMS via Twilio API](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-text-message-with-logic-app)

[Use Logic App to send Slack messages](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-slack-with-logic-app)

[Use Logic App to send messages to an Azure Queue](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-queue-with-logic-app)
