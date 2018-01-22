---
title: Call a webhook on Azure Activity Log alerts | Microsoft Docs
description: Route Activity log events to other services for custom actions. For example send SMS, log bugs, or notify a team via chat/messaging service. 
author: johnkemnetz
manager: orenr
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
ms.author: johnkem

---
# Call a webhook on Azure Activity Log alerts
Webhooks allow you to route an Azure alert notification to other systems for post-processing or custom actions. You can use a webhook on an alert to route it to services that send SMS, log bugs, notify a team via chat/messaging services, or do any number of other actions. This article describes how to set a webhook to be called when an Azure Activity Log alert fires. It also shows what the payload for the HTTP POST to a webhook looks like. For information on the setup and schema for an Azure metric alert, [see this page instead](insights-webhooks-alerts.md). You can also set up an Activity Log alert to send email when activated.

> [!NOTE]
> This feature is currently in preview and will be removed at some point in the future.
>
>

You can set up an Activity Log alert using the [Azure PowerShell Cmdlets](insights-powershell-samples.md#create-metric-alerts), [Cross-Platform CLI](insights-cli-samples.md#work-with-alerts), or [Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn933805.aspx). Currently, you cannot set one up using the Azure portal.

## Authenticating the webhook
The webhook can authenticate using either of these methods:

1. **Token-based authorization** - The webhook URI is saved with a token ID, for example, `https://mysamplealert/webcallback?tokenid=sometokenid&someparameter=somevalue`
2. **Basic authorization** - The webhook URI is saved with a username and password, for example, `https://userid:password@mysamplealert/webcallback?someparamater=somevalue&foo=bar`

## Payload schema
The POST operation contains the following JSON payload and schema for all Activity Log-based alerts. This schema is similar to the one used by metric-based alerts.

```json
{
    "WebhookName": "Alert1515526229589",
    "RequestBody": {
        "schemaId": "Microsoft.Insights/activityLogs",
        "data": {
            "status": "Activated",
            "context": {
                "activityLog": {
                    "authorization": {
                        "action": "Microsoft.Compute/virtualMachines/deallocate/action",
                        "scope": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoVM/providers/Microsoft.Compute/virtualMachines/ContosoVM1"
                    },
                    "channels": "Operation",
                    "claims": {
                        "aud": "https://management.core.windows.net/",
                        "iss": "https://sts.windows.net/00000000-0000-0000-0000-000000000000/",
                        "iat": "1234567890",
                        "nbf": "1234567890",
                        "exp": "1234567890",
                        "aio": "Y2NgYBD8ZLlhu27JU6WZsXemMIvVAAA=",
                        "appid": "00000000-0000-0000-0000-000000000000",
                        "appidacr": "2",
                        "e_exp": "262800",
                        "http://schemas.microsoft.com/identity/claims/identityprovider": "https://sts.windows.net/00000000-0000-0000-0000-000000000000/",
                        "http://schemas.microsoft.com/identity/claims/objectidentifier": "00000000-0000-0000-0000-000000000000",
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "00000000-0000-0000-0000-000000000000",
                        "http://schemas.microsoft.com/identity/claims/tenantid": "00000000-0000-0000-0000-000000000000",
                        "uti": "XnCk46TrDkOQXwo49Y8fAA",
                        "ver": "1.0"
                    },
                    "caller": "00000000-0000-0000-0000-000000000000",
                    "correlationId": "00000000-0000-0000-0000-000000000000",
                    "description": "",
                    "eventSource": "Administrative",
                    "eventTimestamp": "2018-01-09T20:11:25.8410967+00:00",
                    "eventDataId": "00000000-0000-0000-0000-000000000000",
                    "level": "Informational",
                    "operationName": "Microsoft.Compute/virtualMachines/deallocate/action",
                    "operationId": "00000000-0000-0000-0000-000000000000",
                    "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoVM/providers/Microsoft.Compute/virtualMachines/ContosoVM1",
                    "resourceGroupName": "ContosoVM",
                    "resourceProviderName": "Microsoft.Compute",
                    "status": "Succeeded",
                    "subStatus": "",
                    "subscriptionId": "00000000-0000-0000-0000-000000000000",
                    "submissionTimestamp": "2018-01-09T20:11:40.2986126+00:00",
                    "resourceType": "Microsoft.Compute/virtualMachines"
                }
            },
            "properties": {}
        }
    },
    "RequestHeader": {
        "Expect": "100-continue",
        "Host": "s1events.azure-automation.net",
        "User-Agent": "IcMBroadcaster/1.0",
        "X-CorrelationContext": "RkkKACgAAAACAAAAEADlBbM7x86VTrHdQ2JlmlxoAQAQALwazYvJ/INPskb8S5QzgDk=",
        "x-ms-request-id": "00000000-0000-0000-0000-000000000000"
    }
}
```

| Element Name | Description |
| --- | --- |
| status |Used for metric alerts. Always set to "activated" for Activity Log alerts. |
| context |Context of the event. |
| activityLog | The log properties of the event.|
| authorization |The RBAC properties of the event. These usually include the "action", "role" and the "scope." |
| action | Action captured by the alert. |
| scope | Scope of the alert (i.e resource).|
| channels | Operation |
| claims | A collection of information is at relates to the claims. |
| caller |GUID or username of the user who performed the operation, UPN claim, or SPN claim based on availability. Can be null for certain system calls. |
| correlationId |Usually a GUID in string format. Events with correlationId belong to the same larger action and usually share a correlationId. |
| description |Alert description as set during creation of the alert. |
| eventSource |Name of the Azure service or infrastructure that generated the event. |
| eventTimestamp |Time the event occured. |
| eventDataId |Unique identifier for the event. |
| level |One of the following values: "Critical", "Error", "Warning", "Informational" and "Verbose." |
| operationName |Name of the operation. |
| operationId |Usually a GUID shared among the events corresponding to single operation. |
| resourceId |Resource ID of the impacted resource. |
| resourceGroupName |Name of the resource group for the impacted resource |
| resourceProviderName |The resource provider of the impacted resource. |
| status |String. Status of the operation. Common values include: "Started", "In Progress", "Succeeded", "Failed", "Active", "Resolved". |
| subStatus |Usually includes the HTTP status code of the corresponding REST call. It might also include other strings describing a substatus. Common substatus values include: OK (HTTP Status Code: 200), Created (HTTP Status Code: 201), Accepted (HTTP Status Code: 202), No Content (HTTP Status Code: 204), Bad Request (HTTP Status Code: 400), Not Found (HTTP Status Code: 404), Conflict (HTTP Status Code: 409), Internal Server Error (HTTP Status Code: 500), Service Unavailable (HTTP Status Code: 503), Gateway Timeout (HTTP Status Code: 504) |
| subscriptionId |Azure Subscription ID. |
| submissionTimestamp |Time at which the event was generated by the Azure service that processed the request. |
| resourceType | The type of resource that generated the event.|
| properties |Set of `<Key, Value>` pairs (i.e. `Dictionary<String, String>`) that includes details about the event. |

## Next steps
* [Learn more about the Activity Log](monitoring-overview-activity-logs.md)
* [Execute Azure Automation scripts (Runbooks) on Azure alerts](http://go.microsoft.com/fwlink/?LinkId=627081)
* [Use Logic App to send an SMS via Twilio from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-text-message-with-logic-app). This example is for metric alerts, but could be modified to work with an Activity Log alert.
* [Use Logic App to send a Slack message from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-slack-with-logic-app). This example is for metric alerts, but could be modified to work with an Activity Log alert.
* [Use Logic App to send a message to an Azure Queue from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-queue-with-logic-app). This example is for metric alerts, but could be modified to work with an Activity Log alert.
