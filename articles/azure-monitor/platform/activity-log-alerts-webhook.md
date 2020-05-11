---
title: Understand the webhook schema used in activity log alerts
description: Learn about the schema of the JSON that is posted to a webhook URL when an activity log alert activates.
ms.topic: conceptual
ms.date: 03/31/2017
ms.subservice: alerts
---

# Webhooks for Azure activity log alerts
As part of the definition of an action group, you can configure webhook endpoints to receive activity log alert notifications. With webhooks, you can route these notifications to other systems for post-processing or custom actions. This article shows what the payload for the HTTP POST to a webhook looks like.

For more information on activity log alerts, see how to [create Azure activity log alerts](activity-log-alerts.md).

For information on action groups, see how to [create action groups](../../azure-monitor/platform/action-groups.md).

> [!NOTE]
> You can also use the [common alert schema](https://aka.ms/commonAlertSchemaDocs), which provides the advantage of having a single extensible and unified alert payload across all the alert services in Azure Monitor, for your webhook integrations. [Learn about the common alert schema definitions.](https://aka.ms/commonAlertSchemaDefinitions)​


## Authenticate the webhook
The webhook can optionally use token-based authorization for authentication. The webhook URI is saved with a token ID, for example, `https://mysamplealert/webcallback?tokenid=sometokenid&someparameter=somevalue`.

## Payload schema
The JSON payload contained in the POST operation differs based on the payload's data.context.activityLog.eventSource field.

### Common

```json
{
    "schemaId": "Microsoft.Insights/activityLogs",
    "data": {
        "status": "Activated",
        "context": {
            "activityLog": {
                "channels": "Operation",
                "correlationId": "6ac88262-43be-4adf-a11c-bd2179852898",
                "eventSource": "Administrative",
                "eventTimestamp": "2017-03-29T15:43:08.0019532+00:00",
                "eventDataId": "8195a56a-85de-4663-943e-1a2bf401ad94",
                "level": "Informational",
                "operationName": "Microsoft.Insights/actionGroups/write",
                "operationId": "6ac88262-43be-4adf-a11c-bd2179852898",
                "status": "Started",
                "subStatus": "",
                "subscriptionId": "52c65f65-0518-4d37-9719-7dbbfc68c57a",
                "submissionTimestamp": "2017-03-29T15:43:20.3863637+00:00",
                ...
            }
        },
        "properties": {}
    }
}
```

### Administrative

```json
{
    "schemaId": "Microsoft.Insights/activityLogs",
    "data": {
        "status": "Activated",
        "context": {
            "activityLog": {
                "authorization": {
                    "action": "Microsoft.Insights/actionGroups/write",
                    "scope": "/subscriptions/52c65f65-0518-4d37-9719-7dbbfc68c57b/resourceGroups/CONTOSO-TEST/providers/Microsoft.Insights/actionGroups/IncidentActions"
                },
                "claims": "{...}",
                "caller": "me@contoso.com",
                "description": "",
                "httpRequest": "{...}",
                "resourceId": "/subscriptions/52c65f65-0518-4d37-9719-7dbbfc68c57b/resourceGroups/CONTOSO-TEST/providers/Microsoft.Insights/actionGroups/IncidentActions",
                "resourceGroupName": "CONTOSO-TEST",
                "resourceProviderName": "Microsoft.Insights",
                "resourceType": "Microsoft.Insights/actionGroups"
            }
        },
        "properties": {}
    }
}
```

### Security

```json
{
	"schemaId":"Microsoft.Insights/activityLogs",
	"data":{"status":"Activated",
		"context":{
			"activityLog":{
				"channels":"Operation",
				"correlationId":"2518408115673929999",
				"description":"Failed SSH brute force attack. Failed brute force attacks were detected from the following attackers: [\"IP Address: 01.02.03.04\"].  Attackers were trying to access the host with the following user names: [\"root\"].",
				"eventSource":"Security",
				"eventTimestamp":"2017-06-25T19:00:32.607+00:00",
				"eventDataId":"Sec-07f2-4d74-aaf0-03d2f53d5a33",
				"level":"Informational",
				"operationName":"Microsoft.Security/locations/alerts/activate/action",
				"operationId":"Sec-07f2-4d74-aaf0-03d2f53d5a33",
				"properties":{
					"attackers":"[\"IP Address: 01.02.03.04\"]",
					"numberOfFailedAuthenticationAttemptsToHost":"456",
					"accountsUsedOnFailedSignInToHostAttempts":"[\"root\"]",
					"wasSSHSessionInitiated":"No","endTimeUTC":"06/25/2017 19:59:39",
					"actionTaken":"Detected",
					"resourceType":"Virtual Machine",
					"severity":"Medium",
					"compromisedEntity":"LinuxVM1",
					"remediationSteps":"[In case this is an Azure virtual machine, add the source IP to NSG block list for 24 hours (see https://azure.microsoft.com/documentation/articles/virtual-networks-nsg/)]",
					"attackedResourceType":"Virtual Machine"
				},
				"resourceId":"/subscriptions/12345-5645-123a-9867-123b45a6789/resourceGroups/contoso/providers/Microsoft.Security/locations/centralus/alerts/Sec-07f2-4d74-aaf0-03d2f53d5a33",
				"resourceGroupName":"contoso",
				"resourceProviderName":"Microsoft.Security",
				"status":"Active",
				"subscriptionId":"12345-5645-123a-9867-123b45a6789",
				"submissionTimestamp":"2017-06-25T20:23:04.9743772+00:00",
				"resourceType":"MICROSOFT.SECURITY/LOCATIONS/ALERTS"
			}
		},
		"properties":{}
	}
}
```

### Recommendation

```json
{
	"schemaId":"Microsoft.Insights/activityLogs",
	"data":{
		"status":"Activated",
		"context":{
			"activityLog":{
				"channels":"Operation",
				"claims":"{\"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress\":\"Microsoft.Advisor\"}",
				"caller":"Microsoft.Advisor",
				"correlationId":"123b4c54-11bb-3d65-89f1-0678da7891bd",
				"description":"A new recommendation is available.",
				"eventSource":"Recommendation",
				"eventTimestamp":"2017-06-29T13:52:33.2742943+00:00",
				"httpRequest":"{\"clientIpAddress\":\"0.0.0.0\"}",
				"eventDataId":"1bf234ef-e45f-4567-8bba-fb9b0ee1dbcb",
				"level":"Informational",
				"operationName":"Microsoft.Advisor/recommendations/available/action",
				"properties":{
					"recommendationSchemaVersion":"1.0",
					"recommendationCategory":"HighAvailability",
					"recommendationImpact":"Medium",
					"recommendationName":"Enable Soft Delete to protect your blob data",
					"recommendationResourceLink":"https://portal.azure.com/#blade/Microsoft_Azure_Expert/RecommendationListBlade/recommendationTypeId/12dbf883-5e4b-4f56-7da8-123b45c4b6e6",
					"recommendationType":"12dbf883-5e4b-4f56-7da8-123b45c4b6e6"
				},
				"resourceId":"/subscriptions/12345-5645-123a-9867-123b45a6789/resourceGroups/contoso/providers/microsoft.storage/storageaccounts/contosoStore",
				"resourceGroupName":"CONTOSO",
				"resourceProviderName":"MICROSOFT.STORAGE",
				"status":"Active",
				"subStatus":"",
				"subscriptionId":"12345-5645-123a-9867-123b45a6789",
				"submissionTimestamp":"2017-06-29T13:52:33.2742943+00:00",
				"resourceType":"MICROSOFT.STORAGE/STORAGEACCOUNTS"
			}
		},
		"properties":{}
	}
}
```

### ServiceHealth

```json
{
    "schemaId": "Microsoft.Insights/activityLogs",
    "data": {
        "status": "Activated",
        "context": {
            "activityLog": {
            "channels": "Admin",
            "correlationId": "bbac944f-ddc0-4b4c-aa85-cc7dc5d5c1a6",
            "description": "Active: Virtual Machines - Australia East",
            "eventSource": "ServiceHealth",
            "eventTimestamp": "2017-10-18T23:49:25.3736084+00:00",
            "eventDataId": "6fa98c0f-334a-b066-1934-1a4b3d929856",
            "level": "Informational",
            "operationName": "Microsoft.ServiceHealth/incident/action",
            "operationId": "bbac944f-ddc0-4b4c-aa85-cc7dc5d5c1a6",
            "properties": {
                "title": "Virtual Machines - Australia East",
                "service": "Virtual Machines",
                "region": "Australia East",
                "communication": "Starting at 02:48 UTC on 18 Oct 2017 you have been identified as a customer using Virtual Machines in Australia East who may receive errors starting Dv2 Promo and DSv2 Promo Virtual Machines which are in a stopped &quot;deallocated&quot; or suspended state. Customers can still provision Dv1 and Dv2 series Virtual Machines or try deploying Virtual Machines in other regions, as a possible workaround. Engineers have identified a possible fix for the underlying cause, and are exploring implementation options. The next update will be provided as events warrant.",
                "incidentType": "Incident",
                "trackingId": "0NIH-U2O",
                "impactStartTime": "2017-10-18T02:48:00.0000000Z",
                "impactedServices": "[{\"ImpactedRegions\":[{\"RegionName\":\"Australia East\"}],\"ServiceName\":\"Virtual Machines\"}]",
                "defaultLanguageTitle": "Virtual Machines - Australia East",
                "defaultLanguageContent": "Starting at 02:48 UTC on 18 Oct 2017 you have been identified as a customer using Virtual Machines in Australia East who may receive errors starting Dv2 Promo and DSv2 Promo Virtual Machines which are in a stopped &quot;deallocated&quot; or suspended state. Customers can still provision Dv1 and Dv2 series Virtual Machines or try deploying Virtual Machines in other regions, as a possible workaround. Engineers have identified a possible fix for the underlying cause, and are exploring implementation options. The next update will be provided as events warrant.",
                "stage": "Active",
                "communicationId": "636439673646212912",
                "version": "0.1.1"
            },
            "status": "Active",
            "subscriptionId": "45529734-0ed9-4895-a0df-44b59a5a07f9",
            "submissionTimestamp": "2017-10-18T23:49:28.7864349+00:00"
        }
    },
    "properties": {}
    }
}
```

For specific schema details on service health notification activity log alerts, see [Service health notifications](../../azure-monitor/platform/service-notifications.md). Additionally, learn how to [configure service health webhook notifications with your existing problem management solutions](../../service-health/service-health-alert-webhook-guide.md).

### ResourceHealth

```json
{
    "schemaId": "Microsoft.Insights/activityLogs",
    "data": {
        "status": "Activated",
        "context": {
            "activityLog": {
                "channels": "Admin, Operation",
                "correlationId": "a1be61fd-37ur-ba05-b827-cb874708babf",
                "eventSource": "ResourceHealth",
                "eventTimestamp": "2018-09-04T23:09:03.343+00:00",
                "eventDataId": "2b37e2d0-7bda-4de7-ur8c6-1447d02265b2",
                "level": "Informational",
                "operationName": "Microsoft.Resourcehealth/healthevent/Activated/action",
                "operationId": "2b37e2d0-7bda-489f-81c6-1447d02265b2",
                "properties": {
                    "title": "Virtual Machine health status changed to unavailable",
                    "details": "Virtual machine has experienced an unexpected event",
                    "currentHealthStatus": "Unavailable",
                    "previousHealthStatus": "Available",
                    "type": "Downtime",
                    "cause": "PlatformInitiated"
                },
                "resourceId": "/subscriptions/<subscription Id>/resourceGroups/<resource group>/providers/Microsoft.Compute/virtualMachines/<resource name>",
                "resourceGroupName": "<resource group>",
                "resourceProviderName": "Microsoft.Resourcehealth/healthevent/action",
                "status": "Active",
                "subscriptionId": "<subscription Id>",
                "submissionTimestamp": "2018-09-04T23:11:06.1607287+00:00",
                "resourceType": "Microsoft.Compute/virtualMachines"
            }
        }
    }
}
```

| Element name | Description |
| --- | --- |
| status |Used for metric alerts. Always set to "activated" for activity log alerts. |
| context |Context of the event. |
| resourceProviderName |The resource provider of the impacted resource. |
| conditionType |Always "Event." |
| name |Name of the alert rule. |
| id |Resource ID of the alert. |
| description |Alert description set when the alert is created. |
| subscriptionId |Azure subscription ID. |
| timestamp |Time at which the event was generated by the Azure service that processed the request. |
| resourceId |Resource ID of the impacted resource. |
| resourceGroupName |Name of the resource group for the impacted resource. |
| properties |Set of `<Key, Value>` pairs (that is, `Dictionary<String, String>`) that includes details about the event. |
| event |Element that contains metadata about the event. |
| authorization |The Role-Based Access Control properties of the event. These properties usually include the action, the role, and the scope. |
| category |Category of the event. Supported values include Administrative, Alert, Security, ServiceHealth, and Recommendation. |
| caller |Email address of the user who performed the operation, UPN claim, or SPN claim based on availability. Can be null for certain system calls. |
| correlationId |Usually a GUID in string format. Events with correlationId belong to the same larger action and usually share a correlationId. |
| eventDescription |Static text description of the event. |
| eventDataId |Unique identifier for the event. |
| eventSource |Name of the Azure service or infrastructure that generated the event. |
| httpRequest |The request usually includes the clientRequestId, clientIpAddress, and HTTP method (for example, PUT). |
| level |One of the following values: Critical, Error, Warning and Informational. |
| operationId |Usually a GUID shared among the events corresponding to single operation. |
| operationName |Name of the operation. |
| properties |Properties of the event. |
| status |String. Status of the operation. Common values include Started, In Progress, Succeeded, Failed, Active, and Resolved. |
| subStatus |Usually includes the HTTP status code of the corresponding REST call. It might also include other strings that describe a substatus. Common substatus values include OK (HTTP Status Code: 200), Created (HTTP Status Code: 201), Accepted (HTTP Status Code: 202), No Content (HTTP Status Code: 204), Bad Request (HTTP Status Code: 400), Not Found (HTTP Status Code: 404), Conflict (HTTP Status Code: 409), Internal Server Error (HTTP Status Code: 500), Service Unavailable (HTTP Status Code: 503), and Gateway Timeout (HTTP Status Code: 504). |

For specific schema details on all other activity log alerts, see [Overview of the Azure activity log](../../azure-monitor/platform/platform-logs-overview.md).

## Next steps
* [Learn more about the activity log](../../azure-monitor/platform/platform-logs-overview.md).
* [Execute Azure automation scripts (Runbooks) on Azure alerts](https://go.microsoft.com/fwlink/?LinkId=627081).
* [Use a logic app to send an SMS via Twilio from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-text-message-with-logic-app). This example is for metric alerts, but it can be modified to work with an activity log alert.
* [Use a logic app to send a Slack message from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-slack-with-logic-app). This example is for metric alerts, but it can be modified to work with an activity log alert.
* [Use a logic app to send a message to an Azure queue from an Azure alert](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-queue-with-logic-app). This example is for metric alerts, but it can be modified to work with an activity log alert.

