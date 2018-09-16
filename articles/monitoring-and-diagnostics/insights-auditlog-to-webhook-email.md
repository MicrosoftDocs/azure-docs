---
title: Call a webhook on a Azure activity log alert (classic)
description: Learn how to route activity log events to other services for custom actions. For example, you can send SMS messages, log bugs, or notify a team via a chat or messaging service.
author: johnkemnetz
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 01/23/2017
ms.author: johnkem
ms.component: alerts
---
# Call a webhook on an Azure activity log alert
You can use webhooks to route an Azure alert notification to other systems for post-processing or for custom actions. You can use a webhook on an alert to route it to services that send SMS messages, to log bugs, to notify a team via chat or messaging services, or for various other actions. You can also set up an activity log alert to send email when an alert is activated.

This article describes how to set a webhook to be called when an Azure activity log alert fires. It also shows what the payload for the HTTP POST to a webhook looks like. For information about the setup and schema of an Azure metric alert, see [Configure a webhook on an Azure metric alert](insights-webhooks-alerts.md). 

> [!NOTE]
> Currently, the feature that supports calling a webhook on an Azure activity log alert is in preview.
>
>

You can set up an activity log alert by using [Azure PowerShell cmdlets](insights-powershell-samples.md#create-metric-alerts), a [cross-platform CLI](insights-cli-samples.md#work-with-alerts), or [Azure Monitor REST APIs](https://msdn.microsoft.com/library/azure/dn933805.aspx). Currently, you can't use the Azure portal to set up an activity log alert.

## Authenticate the webhook
The webhook can authenticate by using either of these methods:

* **Token-based authorization**. The webhook URI is saved with a token ID. For example: `https://mysamplealert/webcallback?tokenid=sometokenid&someparameter=somevalue`
* **Basic authorization**. The webhook URI is saved with a username and password. For example:  `https://userid:password@mysamplealert/webcallback?someparamater=somevalue&foo=bar`

## Payload schema
The POST operation contains the following JSON payload and schema for all activity log-based alerts. This schema is similar to the one used for metric-based alerts.

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

| Element name | Description |
| --- | --- |
| status |Used for metric alerts. For activity log alerts, always set to Activated.|
| context |The context of the event. |
| activityLog | The log properties of the event.|
| authorization |The Role-Based Access Control (RBAC) properties of the event. These properties usually include **action**, **role**, and **scope**. |
| action | The action captured by the alert. |
| scope | The scope of the alert (that is, the resource).|
| channels | The operation. |
| claims | A collection of information as it relates to the claims. |
| caller |The GUID or username of the user who performed the operation, the UPN claim, or the SPN claim based on availability. Can be a null value for certain system calls. |
| correlationId |Usually a GUID in string format. Events with **correlationId** belong to the same larger action. They usually have the same **correlationId** value. |
| description |The alert description that was set when the alert was created. |
| eventSource |The name of the Azure service or infrastructure that generated the event. |
| eventTimestamp |The time the event occurred. |
| eventDataId |The unique identifier of the event. |
| level |One of the following values: Critical, Error, Warning, Informational, or Verbose. |
| operationName |The name of the operation. |
| operationId |Usually a GUID that's shared among the events. The GUID usually corresponds to a single operation. |
| resourceId |The resource ID of the affected resource. |
| resourceGroupName |The name of the resource group for the affected resource. |
| resourceProviderName |The resource provider of the affected resource. |
| status |A string value that indicates the status of the operation. Common values include Started, In Progress, Succeeded, Failed, Active, and Resolved. |
| subStatus |Usually includes the HTTP status code of the corresponding REST call. It might also include other strings that describe a substatus. Common substatus values include OK (HTTP Status Code: 200), Created (HTTP Status Code: 201), Accepted (HTTP Status Code: 202), No Content (HTTP Status Code: 204), Bad Request (HTTP Status Code: 400), Not Found (HTTP Status Code: 404), Conflict (HTTP Status Code: 409), Internal Server Error (HTTP Status Code: 500), Service Unavailable (HTTP Status Code: 503), and Gateway Timeout (HTTP Status Code: 504). |
| subscriptionId |The Azure Subscription ID. |
| submissionTimestamp |The time at which the event was generated by the Azure service that processed the request. |
| resourceType | The type of resource that generated the event.|
| properties |A set of key/value pairs that has details about the event. For example, `Dictionary<String, String>`. |

## Next steps
* Learn more about the [activity log](monitoring-overview-activity-logs.md).
* Learn how to [execute Azure Automation scripts (runbooks) on Azure alerts](http://go.microsoft.com/fwlink/?LinkId=627081).
* Learn how to [use a logic app to send an SMS message via Twilio from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-text-message-with-logic-app). This example is for metric alerts, but you can modify it to work with an activity log alert.
* Learn how to [use a logic app to send a Slack message from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-slack-with-logic-app). This example is for metric alerts, but you can modify it to work with an activity log alert.
* Learn how to [use a logic app to send a message to an Azure queue from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-queue-with-logic-app). This example is for metric alerts, but you can modify it to work with an activity log alert.
