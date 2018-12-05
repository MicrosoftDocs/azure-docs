---
title: Azure Activity Log event schema
description: Understand the event schema for data emitted into the Activity Log
author: johnkemnetz
services: azure-monitor
ms.service: azure-monitor
ms.topic: reference
ms.date: 4/12/2018
ms.author: dukek
ms.component: activitylog
---
# Azure Activity Log event schema
The **Azure Activity Log** is a log that provides insight into any subscription-level events that have occurred in Azure. This article describes the event schema per category of data. The schema of the data differs depending on if you are reading the data in the portal, PowerShell, CLI, or directly via the REST API versus [streaming the data to storage or Event Hubs using a Log Profile](./monitoring-overview-activity-logs.md#export-the-activity-log-with-a-log-profile). The examples below show the schema as made available via the portal, PowerShell, CLI, and REST API. A mapping of those properties to the [Azure diagnostic logs schema](./monitoring-diagnostic-logs-schema.md) is provided at the end of the article.

## Administrative
This category contains the record of all create, update, delete, and action operations performed through Resource Manager. Examples of the types of events you would see in this category include "create virtual machine" and "delete network security group" Every action taken by a user or application using Resource Manager is modeled as an operation on a particular resource type. If the operation type is Write, Delete, or Action, the records of both the start and success or fail of that operation are recorded in the Administrative category. The Administrative category also includes any changes to role-based access control in a subscription.

### Sample event
```json
{
    "authorization": {
        "action": "Microsoft.Network/networkSecurityGroups/write",
        "scope": "/subscriptions/<subscription ID>/resourcegroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNSG"
    },
    "caller": "rob@contoso.com",
    "channels": "Operation",
    "claims": {
        "aud": "https://management.core.windows.net/",
        "iss": "https://sts.windows.net/1114444b-7467-4144-a616-e3a5d63e147b/",
        "iat": "1234567890",
        "nbf": "1234567890",
        "exp": "1234567890",
        "_claim_names": "{\"groups\":\"src1\"}",
        "_claim_sources": "{\"src1\":{\"endpoint\":\"https://graph.windows.net/1114444b-7467-4144-a616-e3a5d63e147b/users/f409edeb-4d29-44b5-9763-ee9348ad91bb/getMemberObjects\"}}",
        "http://schemas.microsoft.com/claims/authnclassreference": "1",
        "aio": "A3GgTJdwK4vy7Fa7l6DgJC2mI0GX44tML385OpU1Q+z+jaPnFMwB",
        "http://schemas.microsoft.com/claims/authnmethodsreferences": "rsa,mfa",
        "appid": "355249ed-15d9-460d-8481-84026b065942",
        "appidacr": "2",
        "http://schemas.microsoft.com/2012/01/devicecontext/claims/identifier": "10845a4d-ffa4-4b61-a3b4-e57b9b31cdb5",
        "e_exp": "262800",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "Robertson",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": "Rob",
        "ipaddr": "111.111.1.111",
        "name": "Rob Robertson",
        "http://schemas.microsoft.com/identity/claims/objectidentifier": "f409edeb-4d29-44b5-9763-ee9348ad91bb",
        "onprem_sid": "S-1-5-21-4837261184-168309720-1886587427-18514304",
        "puid": "18247BBD84827C6D",
        "http://schemas.microsoft.com/identity/claims/scope": "user_impersonation",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "b-24Jf94A3FH2sHWVIFqO3-RSJEiv24Jnif3gj7s",
        "http://schemas.microsoft.com/identity/claims/tenantid": "1114444b-7467-4144-a616-e3a5d63e147b",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "rob@contoso.com",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn": "rob@contoso.com",
        "uti": "IdP3SUJGtkGlt7dDQVRPAA",
        "ver": "1.0"
    },
    "correlationId": "b5768deb-836b-41cc-803e-3f4de2f9e40b",
    "eventDataId": "d0d36f97-b29c-4cd9-9d3d-ea2b92af3e9d",
    "eventName": {
        "value": "EndRequest",
        "localizedValue": "End request"
    },
    "category": {
        "value": "Administrative",
        "localizedValue": "Administrative"
    },
    "eventTimestamp": "2018-01-29T20:42:31.3810679Z",
    "id": "/subscriptions/<subscription ID>/resourcegroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNSG/events/d0d36f97-b29c-4cd9-9d3d-ea2b92af3e9d/ticks/636528553513810679",
    "level": "Informational",
    "operationId": "04e575f8-48d0-4c43-a8b3-78c4eb01d287",
    "operationName": {
        "value": "Microsoft.Network/networkSecurityGroups/write",
        "localizedValue": "Microsoft.Network/networkSecurityGroups/write"
    },
    "resourceGroupName": "myResourceGroup",
    "resourceProviderName": {
        "value": "Microsoft.Network",
        "localizedValue": "Microsoft.Network"
    },
    "resourceType": {
        "value": "Microsoft.Network/networkSecurityGroups",
        "localizedValue": "Microsoft.Network/networkSecurityGroups"
    },
    "resourceId": "/subscriptions/<subscription ID>/resourcegroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNSG",
    "status": {
        "value": "Succeeded",
        "localizedValue": "Succeeded"
    },
    "subStatus": {
        "value": "",
        "localizedValue": ""
    },
    "submissionTimestamp": "2018-01-29T20:42:50.0724829Z",
    "subscriptionId": "<subscription ID>",
    "properties": {
        "statusCode": "Created",
        "serviceRequestId": "a4c11dbd-697e-47c5-9663-12362307157d",
        "responseBody": "",
        "requestbody": ""
    },
    "relatedEvents": []
}

```

### Property descriptions
| Element Name | Description |
| --- | --- |
| authorization |Blob of RBAC properties of the event. Usually includes the “action”, “role” and “scope” properties. |
| caller |Email address of the user who has performed the operation, UPN claim, or SPN claim based on availability. |
| channels |One of the following values: “Admin”, “Operation” |
| claims |The JWT token used by Active Directory to authenticate the user or application to perform this operation in Resource Manager. |
| correlationId |Usually a GUID in the string format. Events that share a correlationId belong to the same uber action. |
| description |Static text description of an event. |
| eventDataId |Unique identifier of an event. |
| httpRequest |Blob describing the Http Request. Usually includes the “clientRequestId”, “clientIpAddress” and “method” (HTTP method. For example, PUT). |
| level |Level of the event. One of the following values: “Critical”, “Error”, “Warning”, and “Informational” |
| resourceGroupName |Name of the resource group for the impacted resource. |
| resourceProviderName |Name of the resource provider for the impacted resource |
| resourceId |Resource ID of the impacted resource. |
| operationId |A GUID shared among the events that correspond to a single operation. |
| operationName |Name of the operation. |
| properties |Set of `<Key, Value>` pairs (that is, a Dictionary) describing the details of the event. |
| status |String describing the status of the operation. Some common values are: Started, In Progress, Succeeded, Failed, Active, Resolved. |
| subStatus |Usually the HTTP status code of the corresponding REST call, but can also include other strings describing a substatus, such as these common values: OK (HTTP Status Code: 200), Created (HTTP Status Code: 201), Accepted (HTTP Status Code: 202), No Content (HTTP Status Code: 204), Bad Request (HTTP Status Code: 400), Not Found (HTTP Status Code: 404), Conflict (HTTP Status Code: 409), Internal Server Error (HTTP Status Code: 500), Service Unavailable (HTTP Status Code: 503), Gateway Timeout (HTTP Status Code: 504). |
| eventTimestamp |Timestamp when the event was generated by the Azure service processing the request corresponding the event. |
| submissionTimestamp |Timestamp when the event became available for querying. |
| subscriptionId |Azure Subscription ID. |

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
  "id": "/subscriptions/<subscription ID>/events/c5bc4514-6642-2be3-453e-c6a67841b073/ticks/636361902148022297",
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
  "resourceId": "/subscriptions/<subscription ID>",
  "status": {
      "value": "Active",
      "localizedValue": "Active"
  },
  "subStatus": {
      "value": null
  },
  "submissionTimestamp": "2017-07-20T23:30:34.7431946Z",
  "subscriptionId": "<subscription ID>",
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
Refer to the [service health notifications](./monitoring-service-notifications.md) article for documentation about the values in the properties.

## Resource health
This category contains the record of any resource health events that have occurred to your Azure resources. An example of the type of event you would see in this category is "Virtual Machine health status changed to unavailable." Resource health events can represent one of four health statuses: Available, Unavailable, Degraded, and Unknown. Additionally, resource health events can be categorized as being Platform Initiated or User Initiated.

### Sample event

```json
{
    "channels": "Admin, Operation",
    "correlationId": "28f1bfae-56d3-7urb-bff4-194d261248e9",
    "description": "",
    "eventDataId": "a80024e1-883d-37ur-8b01-7591a1befccb",
    "eventName": {
        "value": "",
        "localizedValue": ""
    },
    "category": {
        "value": "ResourceHealth",
        "localizedValue": "Resource Health"
    },
    "eventTimestamp": "2018-09-04T15:33:43.65Z",
    "id": "/subscriptions/<subscription Id>/resourceGroups/<resource group>/providers/Microsoft.Compute/virtualMachines/<resource name>/events/a80024e1-883d-42a5-8b01-7591a1befccb/ticks/636716720236500000",
    "level": "Critical",
    "operationId": "",
    "operationName": {
        "value": "Microsoft.Resourcehealth/healthevent/Activated/action",
        "localizedValue": "Health Event Activated"
    },
    "resourceGroupName": "<resource group>",
    "resourceProviderName": {
        "value": "Microsoft.Resourcehealth/healthevent/action",
        "localizedValue": "Microsoft.Resourcehealth/healthevent/action"
    },
    "resourceType": {
        "value": "Microsoft.Compute/virtualMachines",
        "localizedValue": "Microsoft.Compute/virtualMachines"
    },
    "resourceId": "/subscriptions/<subscription Id>/resourceGroups/<resource group>/providers/Microsoft.Compute/virtualMachines/<resource name>",
    "status": {
        "value": "Active",
        "localizedValue": "Active"
    },
    "subStatus": {
        "value": "",
        "localizedValue": ""
    },
    "submissionTimestamp": "2018-09-04T15:36:24.2240867Z",
    "subscriptionId": "<subscription Id>",
    "properties": {
        "stage": "Active",
        "title": "Virtual Machine health status changed to unavailable",
        "details": "Virtual machine has experienced an unexpected event",
        "healthStatus": "Unavailable",
        "healthEventType": "Downtime",
        "healthEventCause": "PlatformInitiated",
        "healthEventCategory": "Unplanned"
    },
    "relatedEvents": []
}
```

### Property descriptions
| Element Name | Description |
| --- | --- |
| channels | Always “Admin, Operation” |
| correlationId | A GUID in the string format. |
| description |Static text description of the alert event. |
| eventDataId |Unique identifier of the alert event. |
| category | Always "ResourceHealth" |
| eventTimestamp |Timestamp when the event was generated by the Azure service processing the request corresponding the event. |
| level |Level of the event. One of the following values: “Critical”, “Error”, “Warning”, “Informational”, and “Verbose” |
| operationId |A GUID shared among the events that correspond to a single operation. |
| operationName |Name of the operation. |
| resourceGroupName |Name of the resource group that contains the resource. |
| resourceProviderName |Always "Microsoft.Resourcehealth/healthevent/action". |
| resourceType | The type of resource that was affected by a Resource Health event. |
| resourceId | Name of the resource ID for the impacted resource. |
| status |String describing the status of the health event. Values can be: Active, Resolved, InProgress, Updated. |
| subStatus | Usually null for alerts. |
| submissionTimestamp |Timestamp when the event became available for querying. |
| subscriptionId |Azure Subscription Id. |
| properties |Set of `<Key, Value>` pairs (that is, a Dictionary) describing the details of the event.|
| properties.title | A user friendly string that describes the health status of the resource. |
| properties.details | A user friendly string that describes further details about the event. |
| properties.currentHealthStatus | The current health status of the resource. One of the following values: "Available", "Unavailable", "Degraded", and "Unknown". |
| properties.previousHealthStatus | The previous health status of the resource. One of the following values: "Available", "Unavailable", "Degraded", and "Unknown". |
| properties.type | A description of the type of resource health event. |
| properties.cause | A description of the cause of the resource health event. Either "UserInitiated" and "PlatformInitiated". |


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
  "correlationId": "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/microsoft.insights/alertrules/myalert/incidents/L3N1YnNjcmlwdGlvbnMvZGY2MDJjOWMtN2FhMC00MDdkLWE2ZmItZWIyMGM4YmQxMTkyL3Jlc291cmNlR3JvdXBzL0NzbUV2ZW50RE9HRk9PRC1XZXN0VVMvcHJvdmlkZXJzL21pY3Jvc29mdC5pbnNpZ2h0cy9hbGVydHJ1bGVzL215YWxlcnQwNjM2MzYyMjU4NTM1MjIxOTIw",
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
  "id": "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.ClassicCompute/domainNames/myResourceGroup/slots/Production/roles/Event.BackgroundJobsWorker.razzle/events/149d4baf-53dc-4cf4-9e29-17de37405cd9/ticks/636362258535221920",
  "level": "Informational",
  "resourceGroupName": "myResourceGroup",
  "resourceProviderName": {
    "value": "Microsoft.ClassicCompute",
    "localizedValue": "Microsoft.ClassicCompute"
  },
  "resourceId": "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.ClassicCompute/domainNames/myResourceGroup/slots/Production/roles/Event.BackgroundJobsWorker.razzle",
  "resourceType": {
    "value": "Microsoft.ClassicCompute/domainNames/slots/roles",
    "localizedValue": "Microsoft.ClassicCompute/domainNames/slots/roles"
  },
  "operationId": "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/microsoft.insights/alertrules/myalert/incidents/L3N1YnNjcmlwdGlvbnMvZGY2MDJjOWMtN2FhMC00MDdkLWE2ZmItZWIyMGM4YmQxMTkyL3Jlc291cmNlR3JvdXBzL0NzbUV2ZW50RE9HRk9PRC1XZXN0VVMvcHJvdmlkZXJzL21pY3Jvc29mdC5pbnNpZ2h0cy9hbGVydHJ1bGVzL215YWxlcnQwNjM2MzYyMjU4NTM1MjIxOTIw",
  "operationName": {
    "value": "Microsoft.Insights/AlertRules/Resolved/Action",
    "localizedValue": "Microsoft.Insights/AlertRules/Resolved/Action"
  },
  "properties": {
    "RuleUri": "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/microsoft.insights/alertrules/myalert",
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
  "subscriptionId": "<subscription ID>"
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
| level |Level of the event. One of the following values: “Critical”, “Error”, “Warning”, and “Informational” |
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
| subscriptionId |Azure Subscription ID. |

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
  "description": "The autoscale engine attempting to scale resource '/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.ClassicCompute/domainNames/myResourceGroup/slots/Production/roles/myResource' from 3 instances count to 2 instances count.",
  "eventDataId": "a5b92075-1de9-42f1-b52e-6f3e4945a7c7",
  "eventName": {
    "value": "AutoscaleAction",
    "localizedValue": "AutoscaleAction"
  },
  "category": {
    "value": "Autoscale",
    "localizedValue": "Autoscale"
  },
  "id": "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/microsoft.insights/autoscalesettings/myResourceGroup-Production-myResource-myResourceGroup/events/a5b92075-1de9-42f1-b52e-6f3e4945a7c7/ticks/636361956518681572",
  "level": "Informational",
  "resourceGroupName": "myResourceGroup",
  "resourceProviderName": {
    "value": "microsoft.insights",
    "localizedValue": "microsoft.insights"
  },
  "resourceId": "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/microsoft.insights/autoscalesettings/myResourceGroup-Production-myResource-myResourceGroup",
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
    "Description": "The autoscale engine attempting to scale resource '/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.ClassicCompute/domainNames/myResourceGroup/slots/Production/roles/myResource' from 3 instances count to 2 instances count.",
    "ResourceName": "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.ClassicCompute/domainNames/myResourceGroup/slots/Production/roles/myResource",
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
  "subscriptionId": "<subscription ID>"
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
| level |Level of the event. One of the following values: “Critical”, “Error”, “Warning”, and “Informational” |
| resourceGroupName |Name of the resource group for the autoscale setting. |
| resourceProviderName |Name of the resource provider for the autoscale setting. |
| resourceId |Resource ID of the autoscale setting. |
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
| subscriptionId |Azure Subscription ID. |

## Security
This category contains the record any alerts generated by Azure Security Center. An example of the type of event you would see in this category is "Suspicious double extension file executed."

### Sample event
```json
{
    "channels": "Operation",
    "correlationId": "965d6c6a-a790-4a7e-8e9a-41771b3fbc38",
    "description": "Suspicious double extension file executed. Machine logs indicate an execution of a process with a suspicious double extension.\r\nThis extension may trick users into thinking files are safe to be opened and might indicate the presence of malware on the system.",
    "eventDataId": "965d6c6a-a790-4a7e-8e9a-41771b3fbc38",
    "eventName": {
        "value": "Suspicious double extension file executed",
        "localizedValue": "Suspicious double extension file executed"
    },
    "category": {
        "value": "Security",
        "localizedValue": "Security"
    },
    "eventTimestamp": "2017-10-18T06:02:18.6179339Z",
    "id": "/subscriptions/<subscription ID>/providers/Microsoft.Security/locations/centralus/alerts/965d6c6a-a790-4a7e-8e9a-41771b3fbc38/events/965d6c6a-a790-4a7e-8e9a-41771b3fbc38/ticks/636439033386179339",
    "level": "Informational",
    "operationId": "965d6c6a-a790-4a7e-8e9a-41771b3fbc38",
    "operationName": {
        "value": "Microsoft.Security/locations/alerts/activate/action",
        "localizedValue": "Microsoft.Security/locations/alerts/activate/action"
    },
    "resourceGroupName": "myResourceGroup",
    "resourceProviderName": {
        "value": "Microsoft.Security",
        "localizedValue": "Microsoft.Security"
    },
    "resourceType": {
        "value": "Microsoft.Security/locations/alerts",
        "localizedValue": "Microsoft.Security/locations/alerts"
    },
    "resourceId": "/subscriptions/<subscription ID>/providers/Microsoft.Security/locations/centralus/alerts/2518939942613820660_a48f8653-3fc6-4166-9f19-914f030a13d3",
    "status": {
        "value": "Active",
        "localizedValue": "Active"
    },
    "subStatus": {
        "value": null
    },
    "submissionTimestamp": "2017-10-18T06:02:52.2176969Z",
    "subscriptionId": "<subscription ID>",
    "properties": {
        "accountLogonId": "0x2r4",
        "commandLine": "c:\\mydirectory\\doubleetension.pdf.exe",
        "domainName": "hpc",
        "parentProcess": "unknown",
        "parentProcess id": "0",
        "processId": "6988",
        "processName": "c:\\mydirectory\\doubleetension.pdf.exe",
        "userName": "myUser",
        "UserSID": "S-3-2-12",
        "ActionTaken": "Detected",
        "Severity": "High"
    },
    "relatedEvents": []
}

```

### Property descriptions
| Element Name | Description |
| --- | --- |
| channels | Always “Operation” |
| correlationId | A GUID in the string format. |
| description |Static text description of the security event. |
| eventDataId |Unique identifier of the security event. |
| eventName |Friendly name of the security event. |
| id |Unique resource identifier of the security event. |
| level |Level of the event. One of the following values: “Critical”, “Error”, “Warning”, or “Informational” |
| resourceGroupName |Name of the resource group for the resource. |
| resourceProviderName |Name of the resource provider for Azure Security Center. Always "Microsoft.Security". |
| resourceType |The type of resource that generated the security event, such as "Microsoft.Security/locations/alerts" |
| resourceId |Resource ID of the security alert. |
| operationId |A GUID shared among the events that correspond to a single operation. |
| operationName |Name of the operation. |
| properties |Set of `<Key, Value>` pairs (that is, a Dictionary) describing the details of the event. These properties will vary depending on the type of security alert. See [this page](../security-center/security-center-alerts-type.md) for a description of the types of alerts that come from Security Center. |
| properties.Severity |The severity level. Possible values are "High," "Medium," or "Low." |
| status |String describing the status of the operation. Some common values are: Started, In Progress, Succeeded, Failed, Active, Resolved. |
| subStatus | Usually null for security events. |
| eventTimestamp |Timestamp when the event was generated by the Azure service processing the request corresponding the event. |
| submissionTimestamp |Timestamp when the event became available for querying. |
| subscriptionId |Azure Subscription ID. |

## Recommendation
This category contains the record of any new recommendations that are generated for your services. An example of a recommendation would be "Use availability sets for improved fault tolerance." There are 4 types of Recommendation events that can be generated: High Availability, Performance, Security, and Cost Optimization. 

### Sample event
```json
{
    "channels": "Operation",
    "correlationId": "92481dfd-c5bf-4752-b0d6-0ecddaa64776",
    "description": "The action was successful.",
    "eventDataId": "06cb0e44-111b-47c7-a4f2-aa3ee320c9c5",
    "eventName": {
        "value": "",
        "localizedValue": ""
    },
    "category": {
        "value": "Recommendation",
        "localizedValue": "Recommendation"
    },
    "eventTimestamp": "2018-06-07T21:30:42.976919Z",
    "id": "/SUBSCRIPTIONS/<Subscription ID>/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.COMPUTE/VIRTUALMACHINES/MYVM/events/06cb0e44-111b-47c7-a4f2-aa3ee320c9c5/ticks/636640038429769190",
    "level": "Informational",
    "operationId": "",
    "operationName": {
        "value": "Microsoft.Advisor/generateRecommendations/action",
        "localizedValue": "Microsoft.Advisor/generateRecommendations/action"
    },
    "resourceGroupName": "MYRESOURCEGROUP",
    "resourceProviderName": {
        "value": "MICROSOFT.COMPUTE",
        "localizedValue": "MICROSOFT.COMPUTE"
    },
    "resourceType": {
        "value": "MICROSOFT.COMPUTE/virtualmachines",
        "localizedValue": "MICROSOFT.COMPUTE/virtualmachines"
    },
    "resourceId": "/SUBSCRIPTIONS/<Subscription ID>/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.COMPUTE/VIRTUALMACHINES/MYVM",
    "status": {
        "value": "Active",
        "localizedValue": "Active"
    },
    "subStatus": {
        "value": "",
        "localizedValue": ""
    },
    "submissionTimestamp": "2018-06-07T21:30:42.976919Z",
    "subscriptionId": "<Subscription ID>",
    "properties": {
        "recommendationSchemaVersion": "1.0",
        "recommendationCategory": "Security",
        "recommendationImpact": "High",
        "recommendationRisk": "None"
    },
    "relatedEvents": []
}

```
### Property descriptions
| Element Name | Description |
| --- | --- |
| channels | Always “Operation” |
| correlationId | A GUID in the string format. |
| description |Static text description of the recommendation event |
| eventDataId | Unique identifier of the recommendation event. |
| category | Always "Recommendation" |
| id |Unique resource identifier of the recommendation event. |
| level |Level of the event. One of the following values: “Critical”, “Error”, “Warning”, or “Informational” |
| operationName |Name of the operation.  Always "Microsoft.Advisor/generateRecommendations/action"|
| resourceGroupName |Name of the resource group for the resource. |
| resourceProviderName |Name of the resource provider for the resource that this recommendation applies to, such as "MICROSOFT.COMPUTE" |
| resourceType |Name of the resource type for the resource that this recommendation applies to, such as "MICROSOFT.COMPUTE/virtualmachines" |
| resourceId |Resource ID of the resource that the recommendation applies to |
| status | Always "Active" |
| submissionTimestamp |Timestamp when the event became available for querying. |
| subscriptionId |Azure Subscription ID. |
| properties |Set of `<Key, Value>` pairs (that is, a Dictionary) describing the details of the recommendation.|
| properties.recommendationSchemaVersion| Schema version of the recommendation properties published in the Activity Log entry |
| properties.recommendationCategory | Category of the recommendation. Possible values are "High Availability", "Performance", "Security", and "Cost" |
| properties.recommendationImpact| Impact of the recommendation. Possible values are "High", "Medium", "Low" |
| properties.recommendationRisk| Risk of the recommendation. Possible values are "Error", "Warning", "None" |

## Mapping to diagnostic logs schema

When streaming the Azure Activity Log to a storage account or Event Hubs namespace, the data follows the [Azure diagnostic logs schema](./monitoring-diagnostic-logs-schema.md). Here is the mapping of properties from the schema above to the diagnostic logs schema:

| Diagnostic logs schema property | Activity Log REST API schema property | Notes |
| --- | --- | --- |
| time | eventTimestamp |  |
| resourceId | resourceId | subscriptionId, resourceType, resourceGroupName are all inferred from the resourceId. |
| operationName | operationName.value |  |
| category | Part of operation name | Breakout of the operation type - "Write"/"Delete"/"Action" |
| resultType | status.value | |
| resultSignature | substatus.value | |
| resultDescription | description |  |
| durationMs | N/A | Always 0 |
| callerIpAddress | httpRequest.clientIpAddress |  |
| correlationId | correlationId |  |
| identity | claims and authorization properties |  |
| Level | Level |  |
| location | N/A | Location of where the event was processed. *This is not the location of the resource, but rather where the event was processed. This property will be removed in a future update.* |
| Properties | properties.eventProperties |  |
| properties.eventCategory | category | If properties.eventCategory is not present, category is "Administrative" |
| properties.eventName | eventName |  |
| properties.operationId | operationId |  |
| properties.eventProperties | properties |  |


## Next steps
* [Learn more about the Activity Log (formerly Audit Logs)](monitoring-overview-activity-logs.md)
* [Stream the Azure Activity Log to Event Hubs](monitoring-stream-activity-logs-event-hubs.md)
