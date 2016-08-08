<properties
	pageTitle="Azure Insights: Use audit logs to send email and webhook alert notifications in Azure Insights. | Microsoft Azure"
	description="See how to use service auditlog entries to call web URLs or send email notifications in Azure Insights. "
	authors="kamathashwin"
	manager=""
	editor=""
	services="monitoring-and-diagnostics"
	documentationCenter="monitoring-and-diagnostics"/>

<tags
	ms.service="monitoring"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/30/2016"
	ms.author="ashwink"/>

# Use audit logs to send email and webhook alert notifications in Azure Insights

This article shows you the payload schema when an audit log event triggers a webhook and it describes how you can send emails using the same event.

>[AZURE.NOTE] This feature is currently in Preview. Over the coming months the Alert on Events infrastructure and performance will be improved. In this preview, this feature is only accessible using Azure PowerShell and CLI. Access to the same feature using the Azure portal will be available later.

## Webhooks
Webhooks allow you to route Azure alert notifications to other systems for post-processing or custom notifications. For example, routing the alert to services that can handle an incoming web request to send SMS, log bugs, or notify someone using chat or messaging services. The webhook URI must be a valid HTTP or HTTPS endpoint.

## Email
Emails can be sent to any valid email address. Administrators and co-administrators of the subscription where the rule is running will also be notified.

### Example email rule
You must set up an email rule, a webhook rule and then tell the rules to start when the audit log event occurs. You can see an example using PowerShell at [Azure Insights PowerShell quickstart samples](insights-powershell-samples.md#alert-on-audit-log-event).


## Authentication
There are two authentication URI forms:

1. Token-based authentication by saving the webhook URI with a token Id as a query parameter. For example, https://mysamplealert/webcallback?tokenid=sometokenid&someparameter=somevalue
2. Basic authentication by using a user ID and password. For example, https://userid:password@mysamplealert/webcallback?someparamater=somevalue&parameter=value

## Audit log event notification webhook payload schema
When a new event becomes available, the alert on audit log events executes the configured webhook with event metadata in the webhook payload. The following example shows the webhook payload schema:

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

|Element Name|	Description|
|---|---|
|status	|Always set to "activated"|
|context|Context of the event|
|resourceProviderName|The resource provider of the impacted resource|
|conditionType	|"Event"|
|name	|Name of the alert rule|
|id	|Resource ID of the alert|
|description|	Description set on the alert by the creator of the alert|
|subscriptionId	|Azure Subscription GUID|
|timestamp|	Timestamp when the event was generated by the Azure service that processed the request corresponding the event|
|resourceId	|Resource ID URI that uniquely identifies the resource|
|resourceGroupName|Resource-group-name of the impacted resource|
|properties	|Set of <Key, Value> pairs (i.e. Dictionary<String, String>) that includes details about the event|
|event|Element containing metadata about the event|
|authorization|Captures the RBAC properties of the event. These usually include the “action”, “role” and the “scope”.|
|category	| Category of the event. Supported values include: Administrative, Alert, Security, ServiceHealth, Recommendation|
|caller|Email address of the user who has performed the operation, the UPN claim or SPN claim based on availability. Can be null for certain system calls.|
|correlationId|	Usually a GUID in string format. Events with correlationId belong to the same larger action and usually share the same correlationId.|
|eventDescription	|A static text describing an event|
|eventDataId|Unique identifier of an event|
|eventSource	|Name of the Azure service or infrastructure that  generated the event|
|httpRequest|	Usually includes the “clientRequestId”, “clientIpAddress” and “method” (HTTP method e.g. PUT).|
|level|One of the following values: “Critical”, “Error”, “Warning”, “Informational” and “Verbose”|
|operationId|Usually a GUID shared among the events corresponding to single operation|
|operationName|Name of the operation|
|properties	|The element within the event element contains properties of the event.|
|status|String describing the status of the operation. Common values include: Started, In Progress, Succeeded, Failed, Active, Resolved|
|subStatus|	Usually includes the HTTP status code of the corresponding REST call. It might also include other strings describing a substatus. Common substatus values include: OK (HTTP Status Code: 200), Created (HTTP Status Code: 201), Accepted (HTTP Status Code: 202), No Content (HTTP Status Code: 204), Bad Request (HTTP Status Code: 400), Not Found (HTTP Status Code: 404), Conflict (HTTP Status Code: 409), Internal Server Error (HTTP Status Code: 500), Service Unavailable (HTTP Status Code:503), Gateway Timeout (HTTP Status Code: 504)|
