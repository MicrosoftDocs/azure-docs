<properties
	pageTitle="How to configure Azure alerts to send to other systems"
	description="Reroute Azure alerts to other non-Azure systems."
	authors="rboucher"
	manager="ronmart"
	editor=""
	services="azure-portal"
	documentationCenter="na"/>

<tags
	ms.service="azure-portal"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/25/2015"
	ms.author="robb"/>

# How to configure webhook for alerts

Webhooks allow the user to route the Azure Alert notifications to other systems for post-processing or custom notifications. Examples of this can be routing the Alert to services that can handle an incoming web request to send SMS, log bugs, notify a team via chat/messaging services etc.

The webhook uri must be a valid HTTP or HTTPS endpoint. The Azure Alert service will make a POST operation at the specified webhook, passing on a specific JSON payload and schema.

## Configuring webhook via the Portal

In the Create/Update Alerts screen on the [Azure Portal](https://portal.azure.com/), you can add or update the webhook uri.

![Add an alert Rule](./media/insights-webhooks-alerts/Alertwebhook.png)


## Authentication

The authentication can be of two types:

1. **Token Based auth** - In this case you will save the webhook uri with a token Id such as *https://mysamplealert/webcallback?tokenid=sometokenid&someparameter=somevalue*
2.	**Basic Auth** - using a userid and password:
In this case you will save the webhook uri as *https://userid:password@mysamplealert/webcallback?someparamater=somevalue&foo=bar*

## Payload Schema

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
            "portalLink": “https://portal.azure.com/#resource/subscriptions/s1/resourceGroups/useast/providers/microsoft.foo/sites/mysite1”                                
},
"properties": {
              "key1": "value1",
              "key2": "value2"
              }
}
```

>[AZURE.NOTE] In our next refresh, we will add support for alerts on Events (“conditionType” : “Event”)

Testing a table here.

| Geography     |  Paired Regions  |                  |
| :-------------| :-------------   | :-------------   |
| North America | North Central US | South Central US |
| North America | East US          | West US          |
| North America | US East 2        | US Central       |
| Europe        | North Europe     | West Europe      |
| Asia          | South East Asia  | East Asia        |
| China         | East China       | North China      |
| Japan         | Japan East       | Japan West       |
| Brazil        | Brazil South (1) | South Central US |
| Australia     | Australia East   | Australia Southeast|
| US Government | US Gov Iowa      | US Gov Virginia  |



>[AZURE.NOTE] Note: You cannot use the properties field via the Portal. In our upcoming release of the Insights SDK, you can set the properties via the Alert API.

## Next Steps

[Integrate Azure Alerts with PagerDuty](http://go.microsoft.com/fwlink/?LinkId=627080)

[Execute Azure Automation scripts (Runbooks)](http://go.microsoft.com/fwlink/?LinkId=627081)

[Use Logic App to send SMS via Twilio API](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-text-message-with-logic-app)

[Use Logic App to send Slack messages](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-slack-with-logic-app)

[Use Logic App to send messages to an Azure Queue](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-queue-with-logic-app)
