---
title: Call a webhook on Azure Activity Log alerts | Microsoft Docs
description: Route Activity log events to other services for custom actions. For example send SMS, log bugs, or notify a team via chat/messaging service. 
author: kamathashwin
manager: carmonm
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: 64d333d1-7f37-4a00-9d16-dda6e69a113b
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/23/2017
ms.author: ashwink

---
# Call a webhook on Azure Activity Log alerts
Webhooks allow you to route an Azure alert notification to other systems for post-processing or custom actions. You can use a webhook on an alert to route it to services that send SMS, log bugs, notify a team via chat/messaging services, or do any number of other actions. This article describes how to set a webhook to be called when an Azure Activity Log alert fires. It also shows what the payload for the HTTP POST to a webhook looks like. For information on the setup and schema for an Azure metric alert, [see this page instead](insights-webhooks-alerts.md). You can also set up an Activity Log alert to send email when activated.

> [!NOTE]
> This feature is currently in preview and will be removed at some point in the future.
>
>

You can set up an Activity Log alert using the [Azure PowerShell Cmdlets](insights-powershell-samples.md#create-alert-rules), [Cross-Platform CLI](insights-cli-samples.md#work-with-alerts), or [Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn933805.aspx). Currently, you cannot set one up using the Azure portal.

## Authenticating the webhook
The webhook can authenticate using either of these methods:

1. **Token-based authorization** - The webhook URI is saved with a token ID, for example, `https://mysamplealert/webcallback?tokenid=sometokenid&someparameter=somevalue`
2. **Basic authorization** - The webhook URI is saved with a username and password, for example, `https://userid:password@mysamplealert/webcallback?someparamater=somevalue&foo=bar`

## Payload schema
The POST operation contains the following JSON payload and schema for all Activity Log-based alerts. This schema is similar to the one used by metric-based alerts.

```
{
        "status": "Activated",
        "context": {
                "resourceProviderName": "Microsoft.Web",
                "event": {
                        "$type": "Microsoft.WindowsAzure.Management.Monitoring.Automation.Notifications.GenericNotifications.Datacontracts.InstanceEventContext, Microsoft.WindowsAzure.Management.Mon.Automation",
                        "authorization": {
                                "action": "Microsoft.Web/sites/start/action",
                                "scope": "/subscriptions/s1/resourcegroups/rg1/providers/Microsoft.Web/sites/leoalerttest"
                        },
                        "eventDataId": "327caaca-08d7-41b1-86d8-27d0a7adb92d",
                        "category": "Administrative",
                        "caller": "myname@mycompany.com",
                        "httpRequest": {
                                "clientRequestId": "f58cead8-c9ed-43af-8710-55e64def208d",
                                "clientIpAddress": "104.43.166.155",
                                "method": "POST"
                        },
                        "status": "Succeeded",
                        "subStatus": "OK",
                        "level": "Informational",
                        "correlationId": "4a40beaa-6a63-4d92-85c4-923a25abb590",
                        "eventDescription": "",
                        "operationName": "Microsoft.Web/sites/start/action",
                        "operationId": "4a40beaa-6a63-4d92-85c4-923a25abb590",
                        "properties": {
                                "$type": "Microsoft.WindowsAzure.Management.Common.Storage.CasePreservedDictionary, Microsoft.WindowsAzure.Management.Common.Storage",
                                "statusCode": "OK",
                                "serviceRequestId": "f7716681-496a-4f5c-8d14-d564bcf54714"
                        }
                },
                "timestamp": "Friday, March 11, 2016 9:13:23 PM",
                "id": "/subscriptions/s1/resourceGroups/rg1/providers/microsoft.insights/alertrules/alertonevent2",
                "name": "alertonevent2",
                "description": "test alert on event start",
                "conditionType": "Event",
                "subscriptionId": "s1",
                "resourceId": "/subscriptions/s1/resourcegroups/rg1/providers/Microsoft.Web/sites/leoalerttest",
                "resourceGroupName": "rg1"
        },
        "properties": {
                "key1": "value1",
                "key2": "value2"
        }
}
```

| Element Name | Description |
| --- | --- |
| status |Used for metric alerts. Always set to "activated" for Activity Log alerts. |
| context |Context of the event. |
| resourceProviderName |The resource provider of the impacted resource. |
| conditionType |Always "Event." |
| name |Name of the alert rule. |
| id |Resource ID of the alert. |
| description |Alert description as set during creation of the alert. |
| subscriptionId |Azure Subscription ID. |
| timestamp |Time at which the event was generated by the Azure service that processed the request. |
| resourceId |Resource ID of the impacted resource. |
| resourceGroupName |Name of the resource group for the impacted resource |
| properties |Set of `<Key, Value>` pairs (i.e. `Dictionary<String, String>`) that includes details about the event. |
| event |Element containing metadata about the event. |
| authorization |The RBAC properties of the event. These usually include the “action”, “role” and the “scope.” |
| category |Category of the event. Supported values include: Administrative, Alert, Security, ServiceHealth, Recommendation. |
| caller |Email address of the user who performed the operation, UPN claim, or SPN claim based on availability. Can be null for certain system calls. |
| correlationId |Usually a GUID in string format. Events with correlationId belong to the same larger action and usually share a correlationId. |
| eventDescription |Static text description of the event. |
| eventDataId |Unique identifier for the event. |
| eventSource |Name of the Azure service or infrastructure that generated the event. |
| httpRequest |Usually includes the “clientRequestId”, “clientIpAddress” and “method” (HTTP method e.g. PUT). |
| level |One of the following values: “Critical”, “Error”, “Warning”, “Informational” and “Verbose.” |
| operationId |Usually a GUID shared among the events corresponding to single operation. |
| operationName |Name of the operation. |
| properties |Properties of the event. |
| status |String. Status of the operation. Common values include: "Started", "In Progress", "Succeeded", "Failed", "Active", "Resolved". |
| subStatus |Usually includes the HTTP status code of the corresponding REST call. It might also include other strings describing a substatus. Common substatus values include: OK (HTTP Status Code: 200), Created (HTTP Status Code: 201), Accepted (HTTP Status Code: 202), No Content (HTTP Status Code: 204), Bad Request (HTTP Status Code: 400), Not Found (HTTP Status Code: 404), Conflict (HTTP Status Code: 409), Internal Server Error (HTTP Status Code: 500), Service Unavailable (HTTP Status Code: 503), Gateway Timeout (HTTP Status Code: 504) |

## Next steps
* [Learn more about the Activity Log](monitoring-overview-activity-logs.md)
* [Execute Azure Automation scripts (Runbooks) on Azure alerts](http://go.microsoft.com/fwlink/?LinkId=627081)
* [Use Logic App to send an SMS via Twilio from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-text-message-with-logic-app). This example is for metric alerts, but could be modified to work with an Activity Log alert.
* [Use Logic App to send a Slack message from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-slack-with-logic-app). This example is for metric alerts, but could be modified to work with an Activity Log alert.
* [Use Logic App to send a message to an Azure Queue from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-queue-with-logic-app). This example is for metric alerts, but could be modified to work with an Activity Log alert.
