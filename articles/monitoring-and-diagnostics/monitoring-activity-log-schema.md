---
title: Azure Activity Log Event Schema | Microsoft Docs
description: Understand the event schema for data emitted into the Activity Log
author: johnkemnetz
manager: robb
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/20/2017
ms.author: johnkem

---
# Azure Activity Log event schema
The **Azure Activity Log** is a log that provides insight into any subscription-level events that have occurred in Azure. This article describes the event schema per category of data.

## Administrative
This category contains the record of all create, update, delete, and action operations performed through Resource Manager. Examples of the types of events you would see in this category include "create virtual machine" and "delete network security group" Every action taken by a user or application using Resource Manager is modeled as an operation on a particular resource type. If the operation type is Write, Delete, or Action, the records of both the start and success or fail of that operation are recorded in the Administrative category. The Administrative category also includes any changes to role-based access control in a subscription.

### Sample event
```json
{
  "authorization": {
    "action": "microsoft.support/supporttickets/write",
    "role": "Subscription Admin",
    "scope": "/subscriptions/s1/resourceGroups/MSSupportGroup/providers/microsoft.support/supporttickets/115012112305841"
  },
  "caller": "admin@contoso.com",
  "channels": "Operation",
  "claims": {
    "aud": "https://management.core.windows.net/",
    "iss": "https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/",
    "iat": "1421876371",
    "nbf": "1421876371",
    "exp": "1421880271",
    "ver": "1.0",
    "http://schemas.microsoft.com/identity/claims/tenantid": "1e8d8218-c5e7-4578-9acc-9abbd5d23315 ",
    "http://schemas.microsoft.com/claims/authnmethodsreferences": "pwd",
    "http://schemas.microsoft.com/identity/claims/objectidentifier": "2468adf0-8211-44e3-95xq-85137af64708",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn": "admin@contoso.com",
    "puid": "20030000801A118C",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "9vckmEGF7zDKk1YzIY8k0t1_EAPaXoeHyPRn6f413zM",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": "John",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "Smith",
    "name": "John Smith",
    "groups": "cacfe77c-e058-4712-83qw-f9b08849fd60,7f71d11d-4c41-4b23-99d2-d32ce7aa621c,31522864-0578-4ea0-9gdc-e66cc564d18c",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": " admin@contoso.com",
    "appid": "c44b4083-3bq0-49c1-b47d-974e53cbdf3c",
    "appidacr": "2",
    "http://schemas.microsoft.com/identity/claims/scope": "user_impersonation",
    "http://schemas.microsoft.com/claims/authnclassreference": "1"
  },
  "correlationId": "1e121103-0ba6-4300-ac9d-952bb5d0c80f",
  "description": "",
  "eventDataId": "44ade6b4-3813-45e6-ae27-7420a95fa2f8",
  "eventName": {
    "value": "EndRequest",
    "localizedValue": "End request"
  },
  "httpRequest": {
    "clientRequestId": "27003b25-91d3-418f-8eb1-29e537dcb249",
    "clientIpAddress": "192.168.35.115",
    "method": "PUT"
  },
  "id": "/subscriptions/s1/resourceGroups/MSSupportGroup/providers/microsoft.support/supporttickets/115012112305841/events/44ade6b4-3813-45e6-ae27-7420a95fa2f8/ticks/635574752669792776",
  "level": "Informational",
  "resourceGroupName": "MSSupportGroup",
  "resourceProviderName": {
    "value": "microsoft.support",
    "localizedValue": "microsoft.support"
  },
  "resourceUri": "/subscriptions/s1/resourceGroups/MSSupportGroup/providers/microsoft.support/supporttickets/115012112305841",
  "operationId": "1e121103-0ba6-4300-ac9d-952bb5d0c80f",
  "operationName": {
    "value": "microsoft.support/supporttickets/write",
    "localizedValue": "microsoft.support/supporttickets/write"
  },
  "properties": {
    "statusCode": "Created"
  },
  "status": {
    "value": "Succeeded",
    "localizedValue": "Succeeded"
  },
  "subStatus": {
    "value": "Created",
    "localizedValue": "Created (HTTP Status Code: 201)"
  },
  "eventTimestamp": "2015-01-21T22:14:26.9792776Z",
  "submissionTimestamp": "2015-01-21T22:14:39.9936304Z",
  "subscriptionId": "s1"
}
```

### Property descriptions
| Element Name | Description |
| --- | --- |
| authorization |Blob of RBAC properties of the event. Usually includes the “action”, “role” and “scope” properties. |
| caller |Email address of the user who has performed the operation, UPN claim, or SPN claim based on availability. |
| channels |One of the following values: “Admin”, “Operation” |
| claims |The JWT token used by Active Directory to authenticate the user or application to perform this operation in resource manager. |
| correlationId |Usually a GUID in the string format. Events that share a correlationId belong to the same uber action. |
| description |Static text description of an event. |
| eventDataId |Unique identifier of an event. |
| httpRequest |Blob describing the Http Request. Usually includes the “clientRequestId”, “clientIpAddress” and “method” (HTTP method. For example, PUT). |
| level |Level of the event. One of the following values: “Critical”, “Error”, “Warning”, “Informational” and “Verbose” |
| resourceGroupName |Name of the resource group for the impacted resource. |
| resourceProviderName |Name of the resource provider for the impacted resource |
| resourceId |Resource id of the impacted resource. |
| operationId |A GUID shared among the events that correspond to a single operation. |
| operationName |Name of the operation. |
| properties |Set of `<Key, Value>` pairs (that is, a Dictionary) describing the details of the event. |
| status |String describing the status of the operation. Some common values are: Started, In Progress, Succeeded, Failed, Active, Resolved. |
| subStatus |Usually the HTTP status code of the corresponding REST call, but can also include other strings describing a substatus, such as these common values: OK (HTTP Status Code: 200), Created (HTTP Status Code: 201), Accepted (HTTP Status Code: 202), No Content (HTTP Status Code: 204), Bad Request (HTTP Status Code: 400), Not Found (HTTP Status Code: 404), Conflict (HTTP Status Code: 409), Internal Server Error (HTTP Status Code: 500), Service Unavailable (HTTP Status Code: 503), Gateway Timeout (HTTP Status Code: 504). |
| eventTimestamp |Timestamp when the event was generated by the Azure service processing the request corresponding the event. |
| submissionTimestamp |Timestamp when the event became available for querying. |
| subscriptionId |Azure Subscription Id. |

## Service health
This category contains the record of any service health incidents that have occurred in Azure. An example of the type of event you would see in this category is "SQL Azure in East US is experiencing downtime." Service health events come in five varieties: Action Required, Assisted Recovery, Incident, Maintenance, Information, or Security, and only appear if you have a resource in the subscription that would be impacted by the event.

### Sample event
```json
{
  "channels": "Admin",
  "correlationId": "c550176b-8f52-4380-bdc5-36c1b59d3a44",
  "description": "Active: Network Infrastructure - UK South",
  "eventDataId": "c5bc4514-6642-2be3-453e-c6a67841b073",
  "eventName": {
      "value": null
  },
  "category": {
      "value": "ServiceHealth",
      "localizedValue": "Service Health"
  },
  "eventTimestamp": "2017-07-20T23:30:14.8022297Z",
  "id": "/subscriptions/mySubscriptionID/events/c5bc4514-6642-2be3-453e-c6a67841b073/ticks/636361902148022297",
  "level": "Warning",
  "operationName": {
      "value": "Microsoft.ServiceHealth/incident/action",
      "localizedValue": "Microsoft.ServiceHealth/incident/action"
  },
  "resourceProviderName": {
      "value": null
  },
  "resourceType": {
      "value": null,
      "localizedValue": ""
  },
  "resourceId": "/subscriptions/mySubscriptionID",
  "status": {
      "value": "Active",
      "localizedValue": "Active"
  },
  "subStatus": {
      "value": null
  },
  "submissionTimestamp": "2017-07-20T23:30:34.7431946Z",
  "subscriptionId": "mySubscriptionID",
  "properties": {
    "title": "Network Infrastructure - UK South",
    "service": "Service Fabric",
    "region": "UK South",
    "communication": "Starting at approximately 21:41 UTC on 20 Jul 2017, a subset of customers in UK South may experience degraded performance, connectivity drops or timeouts when accessing their Azure resources hosted in this region. Engineers are investigating underlying Network Infrastructure issues in this region. Impacted services may include, but are not limited to App Services, Automation, Service Bus, Log Analytics, Key Vault, SQL Database, Service Fabric, Event Hubs, Stream Analytics, Azure Data Movement, API Management, and Azure Search. Multiple engineering teams are engaged in multiple workflows to mitigate the impact. The next update will be provided in 60 minutes, or as events warrant.",
    "incidentType": "Incident",
    "trackingId": "NA0F-BJG",
    "impactStartTime": "2017-07-20T21:41:00.0000000Z",
    "impactedServices": "[{\"ImpactedRegions\":[{\"RegionName\":\"UK South\"}],\"ServiceName\":\"Service Fabric\"}]",
    "defaultLanguageTitle": "Network Infrastructure - UK South",
    "defaultLanguageContent": "Starting at approximately 21:41 UTC on 20 Jul 2017, a subset of customers in UK South may experience degraded performance, connectivity drops or timeouts when accessing their Azure resources hosted in this region. Engineers are investigating underlying Network Infrastructure issues in this region. Impacted services may include, but are not limited to App Services, Automation, Service Bus, Log Analytics, Key Vault, SQL Database, Service Fabric, Event Hubs, Stream Analytics, Azure Data Movement, API Management, and Azure Search. Multiple engineering teams are engaged in multiple workflows to mitigate the impact. The next update will be provided in 60 minutes, or as events warrant.",
    "stage": "Active",
    "communicationId": "636361902146035247",
    "version": "0.1.1"
  }
}
```

### Property descriptions
Element Name | Description
-------- | -----------
channels | Is one of the following values: “Admin”, “Operation”
correlationId | Is usually a GUID in the string format. Events with that belong to the same uber action usually share the same correlationId.
description | Description of the event.
eventDataId | The unique identifier of an event.
eventName | The title of the event.
level | Level of the event. One of the following values: “Critical”, “Error”, “Warning”, “Informational” and “Verbose”
resourceProviderName | Name of the resource provider for the impacted resource. If not known, this will be null.
resourceType| The type of resource of the impacted resource. If not known, this will be null.
subStatus | Usually null for Service Health events.
eventTimestamp | Timestamp when the log event was generated and submitted to the Activity Log.
submissionTimestamp | 	Timestamp when the event became available in the Activity Log.
subscriptionId | The Azure subscription in which this event was logged.
status | String describing the status of the operation. Some common values are: Active, Resolved.
operationName | Name of the operation. Usually Microsoft.ServiceHealth/incident/action.
category | "ServiceHealth"
resourceId | Resource id of the impacted resource, if known. Subscription ID is provided otherwise.
Properties.title | The localized title for this communication. English is the default language.
Properties.communication | The localized details of the communication with HTML markup. English is the default.
Properties.incidentType | Possible values: AssistedRecovery, ActionRequired, Information, Incident, Maintenance, Security
Properties.trackingId | Identifies the incident this event is associated with. Use this to correlate the events related to an incident.
Properties.impactedServices | An escaped JSON blob which describes the services and regions that are impacted by the incident. A list of Services, each of which has a ServiceName and a list of ImpactedRegions, each of which has a RegionName.
Properties.defaultLanguageTitle | The communication in English
Properties.defaultLanguageContent | The communication in English as either html markup or plain text
Properties.stage | Possible values for AssistedRecovery, ActionRequired, Information, Incident, Security: are Active, Resolved. For Maintenance they are: Active, Planned, InProgress, Canceled, Rescheduled, Resolved, Complete
Properties.communicationId | The communication this event is associated.

## Alert
This category contains the record of all activations of Azure alerts. An example of the type of event you would see in this category is "CPU % on myVM has been over 80 for the past 5 minutes." A variety of Azure systems have an alerting concept -- you can define a rule of some sort and receive a notification when conditions match that rule. Each time a supported Azure alert type 'activates,' or the conditions are met to generate a notification, a record of the activation is also pushed to this category of the Activity Log.

### Sample event

```json
{
  "caller": "Microsoft.Insights/alertRules",
  "channels": "Admin, Operation",
  "claims": {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/spn": "Microsoft.Insights/alertRules"
  },
  "correlationId": "/subscriptions/mySubscriptionID/resourceGroups/myResourceGroup/providers/microsoft.insights/alertrules/myalert/incidents/L3N1YnNjcmlwdGlvbnMvZGY2MDJjOWMtN2FhMC00MDdkLWE2ZmItZWIyMGM4YmQxMTkyL3Jlc291cmNlR3JvdXBzL0NzbUV2ZW50RE9HRk9PRC1XZXN0VVMvcHJvdmlkZXJzL21pY3Jvc29mdC5pbnNpZ2h0cy9hbGVydHJ1bGVzL215YWxlcnQwNjM2MzYyMjU4NTM1MjIxOTIw",
  "description": "'Disk read LessThan 100000 ([Count]) in the last 5 minutes' has been resolved for CloudService: myResourceGroup/Production/Event.BackgroundJobsWorker.razzle (myResourceGroup)",
  "eventDataId": "149d4baf-53dc-4cf4-9e29-17de37405cd9",
  "eventName": {
    "value": "Alert",
    "localizedValue": "Alert"
  },
  "category": {
    "value": "Alert",
    "localizedValue": "Alert"
  },
  "id": "/subscriptions/mySubscriptionID/resourceGroups/myResourceGroup/providers/Microsoft.ClassicCompute/domainNames/myResourceGroup/slots/Production/roles/Event.BackgroundJobsWorker.razzle/events/149d4baf-53dc-4cf4-9e29-17de37405cd9/ticks/636362258535221920",
  "level": "Informational",
  "resourceGroupName": "myResourceGroup",
  "resourceProviderName": {
    "value": "Microsoft.ClassicCompute",
    "localizedValue": "Microsoft.ClassicCompute"
  },
  "resourceId": "/subscriptions/mySubscriptionID/resourceGroups/myResourceGroup/providers/Microsoft.ClassicCompute/domainNames/myResourceGroup/slots/Production/roles/Event.BackgroundJobsWorker.razzle",
  "resourceType": {
    "value": "Microsoft.ClassicCompute/domainNames/slots/roles",
    "localizedValue": "Microsoft.ClassicCompute/domainNames/slots/roles"
  },
  "operationId": "/subscriptions/mySubscriptionID/resourceGroups/myResourceGroup/providers/microsoft.insights/alertrules/myalert/incidents/L3N1YnNjcmlwdGlvbnMvZGY2MDJjOWMtN2FhMC00MDdkLWE2ZmItZWIyMGM4YmQxMTkyL3Jlc291cmNlR3JvdXBzL0NzbUV2ZW50RE9HRk9PRC1XZXN0VVMvcHJvdmlkZXJzL21pY3Jvc29mdC5pbnNpZ2h0cy9hbGVydHJ1bGVzL215YWxlcnQwNjM2MzYyMjU4NTM1MjIxOTIw",
  "operationName": {
    "value": "Microsoft.Insights/AlertRules/Resolved/Action",
    "localizedValue": "Microsoft.Insights/AlertRules/Resolved/Action"
  },
  "properties": {
    "RuleUri": "/subscriptions/mySubscriptionID/resourceGroups/myResourceGroup/providers/microsoft.insights/alertrules/myalert",
    "RuleName": "myalert",
    "RuleDescription": "",
    "Threshold": "100000",
    "WindowSizeInMinutes": "5",
    "Aggregation": "Average",
    "Operator": "LessThan",
    "MetricName": "Disk read",
    "MetricUnit": "Count"
  },
  "status": {
    "value": "Resolved",
    "localizedValue": "Resolved"
  },
  "subStatus": {
    "value": null
  },
  "eventTimestamp": "2017-07-21T09:24:13.522192Z",
  "submissionTimestamp": "2017-07-21T09:24:15.6578651Z",
  "subscriptionId": "mySubscriptionID"
}
```

### Property descriptions
| Element Name | Description |
| --- | --- |
| caller | Always Microsoft.Insights/alertRules |
| channels | Always “Admin, Operation” |
| claims | JSON blob with the SPN (service principal name), or resource type, of the alert engine. |
| correlationId | A GUID in the string format. |
| description |Static text description of the alert event. |
| eventDataId |Unique identifier of the alert event. |
| level |Level of the event. One of the following values: “Critical”, “Error”, “Warning”, “Informational” and “Verbose” |
| resourceGroupName |Name of the resource group for the impacted resource if it is a metric alert. For other alert types, this is the name of the resource group that contains the alert itself. |
| resourceProviderName |Name of the resource provider for the impacted resource if it is a metric alert. For other alert types, this is the name of the resource provider for the alert itself. |
| resourceId | Name of the resource ID for the impacted resource if it is a metric alert. For other alert types, this is the resource ID of the alert resource itself. |
| operationId |A GUID shared among the events that correspond to a single operation. |
| operationName |Name of the operation. |
| properties |Set of `<Key, Value>` pairs (that is, a Dictionary) describing the details of the event. |
| status |String describing the status of the operation. Some common values are: Started, In Progress, Succeeded, Failed, Active, Resolved. |
| subStatus | Usually null for alerts. |
| eventTimestamp |Timestamp when the event was generated by the Azure service processing the request corresponding the event. |
| submissionTimestamp |Timestamp when the event became available for querying. |
| subscriptionId |Azure Subscription Id. |

### Properties field per alert type
The properties field will contain different values depending on the source of the alert event. Two common alert event providers are Activity Log alerts and metric alerts.

#### Properties for Activity Log alerts
| Element Name | Description |
| --- | --- |
| properties.subscriptionId | The subscription ID from the activity log event which caused this activity log alert rule to be activated. |
| properties.eventDataId | The event data ID from the activity log event which caused this activity log alert rule to be activated. |
| properties.resourceGroup | The resource group from the activity log event which caused this activity log alert rule to be activated. |
| properties.resourceId | The resource ID from the activity log event which caused this activity log alert rule to be activated. |
| properties.eventTimestamp | The event timestamp of the activity log event which caused this activity log alert rule to be activated. |
| properties.operationName | The operation name from the activity log event which caused this activity log alert rule to be activated. |
| properties.status | The status from the activity log event which caused this activity log alert rule to be activated.|

#### Properties for metric alerts
| Element Name | Description |
| --- | --- |
| properties.RuleUri | Resource ID of the metric alert rule itself. |
| properties.RuleName | The name of the metric alert rule. |
| properties.RuleDescription | The description of the metric alert rule (as defined in the alert rule). |
| properties.Threshold | The threshold value used in the evaluation of the metric alert rule. |
| properties.WindowSizeInMinutes | The window size used in the evaluation of the metric alert rule. |
| properties.Aggregation | The aggregation type defined in the metric alert rule. |
| properties.Operator | The conditional operator used in the evaluation of the metric alert rule. |
| properties.MetricName | The metric name of the metric used in the evaluation of the metric alert rule. |
| properties.MetricUnit | The metric unit for the metric used in the evaluation of the metric alert rule. |

## Autoscale
This category contains the record of any events related to the operation of the autoscale engine based on any autoscale settings you have defined in your subscription. An example of the type of event you would see in this category is "Autoscale scale up action failed." Using autoscale, you can automatically scale out or scale in the number of instances in a supported resource type based on time of day and/or load (metric) data using an autoscale setting. When the conditions are met to scale up or down, the start and succeeded or failed events will be recorded in this category.

### Sample event
```json
{
  "caller": "Microsoft.Insights/autoscaleSettings",
  "channels": "Admin, Operation",
  "claims": {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/spn": "Microsoft.Insights/autoscaleSettings"
  },
  "correlationId": "fc6a7ff5-ff68-4bb7-81b4-3629212d03d0",
  "description": "The autoscale engine attempting to scale resource '/subscriptions/mySubscriptionID/resourceGroups/myResourceGroup/providers/Microsoft.ClassicCompute/domainNames/myResourceGroup/slots/Production/roles/myResource' from 3 instances count to 2 instances count.",
  "eventDataId": "a5b92075-1de9-42f1-b52e-6f3e4945a7c7",
  "eventName": {
    "value": "AutoscaleAction",
    "localizedValue": "AutoscaleAction"
  },
  "category": {
    "value": "Autoscale",
    "localizedValue": "Autoscale"
  },
  "id": "/subscriptions/mySubscriptionID/resourceGroups/myResourceGroup/providers/microsoft.insights/autoscalesettings/myResourceGroup-Production-myResource-myResourceGroup/events/a5b92075-1de9-42f1-b52e-6f3e4945a7c7/ticks/636361956518681572",
  "level": "Informational",
  "resourceGroupName": "myResourceGroup",
  "resourceProviderName": {
    "value": "microsoft.insights",
    "localizedValue": "microsoft.insights"
  },
  "resourceId": "/subscriptions/mySubscriptionID/resourceGroups/myResourceGroup/providers/microsoft.insights/autoscalesettings/myResourceGroup-Production-myResource-myResourceGroup",
  "resourceType": {
    "value": "microsoft.insights/autoscalesettings",
    "localizedValue": "microsoft.insights/autoscalesettings"
  },
  "operationId": "fc6a7ff5-ff68-4bb7-81b4-3629212d03d0",
  "operationName": {
    "value": "Microsoft.Insights/AutoscaleSettings/Scaledown/Action",
    "localizedValue": "Microsoft.Insights/AutoscaleSettings/Scaledown/Action"
  },
  "properties": {
    "Description": "The autoscale engine attempting to scale resource '/subscriptions/mySubscriptionID/resourceGroups/myResourceGroup/providers/Microsoft.ClassicCompute/domainNames/myResourceGroup/slots/Production/roles/myResource' from 3 instances count to 2 instances count.",
    "ResourceName": "/subscriptions/mySubscriptionID/resourceGroups/myResourceGroup/providers/Microsoft.ClassicCompute/domainNames/myResourceGroup/slots/Production/roles/myResource",
    "OldInstancesCount": "3",
    "NewInstancesCount": "2",
    "LastScaleActionTime": "Fri, 21 Jul 2017 01:00:51 GMT"
  },
  "status": {
    "value": "Succeeded",
    "localizedValue": "Succeeded"
  },
  "subStatus": {
    "value": null
  },
  "eventTimestamp": "2017-07-21T01:00:51.8681572Z",
  "submissionTimestamp": "2017-07-21T01:00:52.3008754Z",
  "subscriptionId": "mySubscriptionID"
}

```

### Property descriptions
| Element Name | Description |
| --- | --- |
| caller | Always Microsoft.Insights/autoscaleSettings |
| channels | Always “Admin, Operation” |
| claims | JSON blob with the SPN (service principal name), or resource type, of the autoscale engine. |
| correlationId | A GUID in the string format. |
| description |Static text description of the autoscale event. |
| eventDataId |Unique identifier of the autoscale event. |
| level |Level of the event. One of the following values: “Critical”, “Error”, “Warning”, “Informational” and “Verbose” |
| resourceGroupName |Name of the resource group for the autoscale setting. |
| resourceProviderName |Name of the resource provider for the autoscale setting. |
| resourceId |Resource id of the autoscale setting. |
| operationId |A GUID shared among the events that correspond to a single operation. |
| operationName |Name of the operation. |
| properties |Set of `<Key, Value>` pairs (that is, a Dictionary) describing the details of the event. |
| properties.Description | Detailed description of what the autoscale engine was doing. |
| properties.ResourceName | Resource ID of the impacted resource (the resource on which the scale action was being performed) |
| properties.OldInstancesCount | The number of instances before the autoscale action took effect. |
| properties.NewInstancesCount | The number of instances after the autoscale action took effect. |
| properties.LastScaleActionTime | The timestamp of when the autoscale action occurred. |
| status |String describing the status of the operation. Some common values are: Started, In Progress, Succeeded, Failed, Active, Resolved. |
| subStatus | Usually null for autoscale. |
| eventTimestamp |Timestamp when the event was generated by the Azure service processing the request corresponding the event. |
| submissionTimestamp |Timestamp when the event became available for querying. |
| subscriptionId |Azure Subscription Id. |

## Next steps
* [Learn more about the Activity Log (formerly Audit Logs)](monitoring-overview-activity-logs.md)
* [Stream the Azure Activity Log to Event Hubs](monitoring-stream-activity-logs-event-hubs.md)
