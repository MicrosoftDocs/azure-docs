<properties
	pageTitle="Azure Insights: Use autoscale actions to send email and webhook alert notifications. | Microsoft Azure"
	description="See how to use autoscale actions to call web URLs or send email notifications in Azure Insights. "
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
	ms.date="07/19/2016"
	ms.author="ashwink"/>

# Use autoscale actions to send email and webhook alert notifications in Azure Insights

This article shows you how set up triggers so that you can call specific web URLs or send emails based on autoscale actions in Azure.  

## Webhooks
Webhooks allow you to route the Azure alert notifications to other systems for post-processing or custom notifications. For example, routing the alert to services that can handle an incoming web request to send SMS, log bugs, notify a team using chat or messaging services, etc. The webhook URI must be a valid HTTP or HTTPS endpoint.

## Email
Email can be sent to any valid email address. Administrators and co-administrators of the subscription where the rule is running will also be notified.


## Cloud Services and Web Apps
You can opt-in from the Azure portal for Cloud Services and Server Farms (Web Apps).

- Choose the **scale by** metric.

![scale by](./media/insights-autoscale-to-webhook-email/insights-autoscale-scale-by.png)

## Virtual Machine scale sets
For newer Virtual Machines created with Resource Manager (Virtual Machine scale sets), you can configure this using REST API, Resource Manager templates, PowerShell, and CLI. A portal interface is not yet available.
When using the REST API or Resource Manager template, include the notifications element with the following options.

```
"notifications": [
      {
        "operation": "Scale",
        "email": {
          "sendToSubscriptionAdministrator": false,
          "sendToSubscriptionCoAdministrators": false,
          "customEmails": [
              "user1@mycompany.com",
              "user2@mycompany.com"
              ]
        },
        "webhooks": [
          {
            "serviceUri": "https://foo.webhook.example.com?token=abcd1234",
            "properties": {
              "optional_key1": "optional_value1",
              "optional_key2": "optional_value2"
            }
          }
        ]
      }
    ]
```
|Field	|Mandatory?|	Description|
|---|---|---|
|operation	|yes	|value must be "Scale"|
|sendToSubscriptionAdministrator	|yes	|value must be "true" or "false"|
|sendToSubscriptionCoAdministrators	|yes	|value must be "true" or "false"|
|customEmails	|yes	|value can be null [] or string array of emails|
|webhooks	|yes	|value can be null or valid Uri|
|serviceUri	|yes	|a valid https Uri|
|properties	|yes	|value must be empty {} or can contain key-value pairs|


## Authentication in webhooks
There are two authentication URI forms:

1. Token-base authentication, where you save the webhook URI with a token ID as a query parameter. For example, https://mysamplealert/webcallback?tokenid=sometokenid&someparameter=somevalue
2. Basic authentication, where you use a user ID and password. For example, https://userid:password@mysamplealert/webcallback?someparamater=somevalue&parameter=value

## Autoscale notification webhook payload schema
When the autoscale notification is generated, the following metadata is included in the webhook payload:

```
{
        "version": "1.0",
        "status": "Activated",
        "operation": "Scale In",
        "context": {
                "timestamp": "2016-03-11T07:31:04.5834118Z",
                "id": "/subscriptions/s1/resourceGroups/rg1/providers/microsoft.insights/autoscalesettings/myautoscaleSetting",
                "name": "myautoscaleSetting",
                "details": "Autoscale successfully started scale operation for resource 'MyCSRole' from capacity '3' to capacity '2'",
                "subscriptionId": "s1",
                "resourceGroupName": "rg1",
                "resourceName": "MyCSRole",
                "resourceType": "microsoft.classiccompute/domainnames/slots/roles",
                "resourceId": "/subscriptions/s1/resourceGroups/rg1/providers/microsoft.classicCompute/domainNames/myCloudService/slots/Production/roles/MyCSRole",
                "portalLink": "https://portal.azure.com/#resource/subscriptions/s1/resourceGroups/rg1/providers/microsoft.classicCompute/domainNames/myCloudService",
                "oldCapacity": "3",
                "newCapacity": "2"
        },
        "properties": {
                "key1": "value1",
                "key2": "value2"
        }
}
```


|Field	|Mandatory?|	Description|
|---|---|---|
|status	|yes	|The status that indicates that an autoscale action was generated|
|operation|	yes	|For an increase of instances, it will be "Scale Out" and for a decrease in instances, it will be "Scale In"|
|context|	yes	|The autoscale action context|
|timestamp|	yes	|Time stamp when the autoscale action was triggered|
|id	|Yes|	Resource Manager ID of the autoscale setting|
|name	|Yes|	The name of the autoscale setting|
|details|	Yes	|Explanation of the action that the autoscale service took and the change in the instance count|
|subscriptionId|	Yes	|Subscription ID of the target resource that is being scaled|
|resourceGroupName|	Yes|	Resource Group name of the target resource that is being scaled|
|resourceName	|Yes|	Name of the target resource that is being scaled|
|resourceType	|Yes|	The three supported values: "microsoft.classiccompute/domainnames/slots/roles" - Cloud Service roles, "microsoft.compute/virtualmachinescalesets" - Virtual Machine Scale Sets,  and "Microsoft.Web/serverfarms" - Web App|
|resourceId	|Yes|Resource Manager ID of the target resource that is being scaled|
|portalLink	|Yes	|Azure portal link to the summary page of the target resource|
|oldCapacity|	Yes	|The current (old) instance count when Autoscale took a scale action|
|newCapacity|	Yes	|The new instance count that Autoscale scaled the resource to|
|Properties|	No|	Optional. Set of <Key, Value> pairs (for example,  Dictionary <String, String>). The properties field is optional. In a custom user interface  or Logic app based workflow, you can enter keys and values that can be passed using the payload. An alternate way to pass custom properties back to the outgoing webhook call is to use the webhook URI itself (as query parameters)|
