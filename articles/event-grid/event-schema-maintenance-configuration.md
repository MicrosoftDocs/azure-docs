---
title: Azure Maintenance Configuration as an Event Grid source
description: The article provides details on Azure Maintenance Configuration as an Event Grid source. 
ms.topic: conceptual
author: ApnaLakshay
ms.author: lnagpal
ms.date: 11/29/2023
---

# Azure Maintenance Configuration as an Event Grid source

This article provides the properties and schema for Azure Maintenance Configurations events. For an introduction to event schemas, see [Azure Event Grid event schema](./event-schema.md). It also gives you links to articles to use Maintenance Configuration as an event source.

## Available event types

Maintenance Configuration emits the following event types: 

**Event type** | **Description**
---| ---|
Microsoft.Maintenance.PreMaintenanceEvent | Raised before maintenance job start and gives user an opportunity to perform pre maintenance operations. |
Microsoft.Maintenance.PostMaintenanceEvent | Raised after maintenance job completes and gives an opportunity to perform post maintenance operations. 

## Example event


# [Cloud event schema](#tab/cloud-event-schema)

Following is an example for a schema of a pre-maintenance event:


```json
[{ 
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration/providers/microsoft.maintenance/applyupdates/20230509150000", 
  "source": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration", 
  "subject": "contosomaintenanceconfiguration", 
"data": 
{ 
   "CorrelationId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration/providers/microsoft.maintenance/applyupdates/20230509150000",  
   "MaintenanceConfigurationId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration",  
   "StartDateTime": "2023-05-09T15:00:00Z",  
   "EndDateTime": "2023-05-09T18:55:00Z",  
   "CancellationCutOffDateTime": "2023-05-09T14:59:00Z",  
   "ResourceSubscriptionIds": ["subscription guid 1", "subscription guid 2"] 
} 
"type": "Microsoft.Maintenance.PreMaintenanceEvent", 
"time": "2023-05-09T14:25:00.3717473Z", 
  "specversion": "1.0" 
}] 
```

# [Event Grid event schema](#tab/event-grid-event-schema)
Following is an example of a schema for the Pre-Maintenance event:

```json
[{ 
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration/providers/microsoft.maintenance/applyupdates/20230509150000", 
  "topic": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration", 
  "subject": "contosomaintenanceconfiguration", 
"data": 
{ 
   "CorrelationId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration/providers/microsoft.maintenance/applyupdates/20230509150000",  
   "MaintenanceConfigurationId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration",  
   "StartDateTime": "2023-05-09T15:00:00Z",  
   "EndDateTime": "2023-05-09T18:55:00Z",  
   "CancellationCutOffDateTime": "2023-05-09T14:59:00Z",  
   "ResourceSubscriptionIds": ["subscription guid 1", "subscription guid 2"] 
} 
"eventType": "Microsoft.Maintenance.PreMaintenanceEvent", 
"eventTime": "2023-05-09T14:25:00.3717473Z", 
  "dataVersion": "1.0", 
  "metadataVersion": "1" 
}]
```

---


# [Cloud event schema](#tab/cloud-event-schema)

Following is an example for a post maintenance event:

```json
[{ 
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration/providers/microsoft.maintenance/applyupdates/20230509150000", 
  "source": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration", 
  "subject": "contosomaintenanceconfiguration", 
"data": 
{ 
   "CorrelationId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration/providers/microsoft.maintenance/applyupdates/20230509150000",  
   "MaintenanceConfigurationId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration",  
   "Status": "Succeeded", 
   "StartDateTime": "2023-05-09T15:00:00Z",  
   "EndDateTime": "2023-05-09T18:55:00Z",  
   "ResourceSubscriptionIds": ["subscription guid 1", "subscription guid 2"] 
} 
"type": "Microsoft.Maintenance.PostMaintenanceEvent", 
"time": "2023-05-09T15:55:00.3717473Z", 
  "specversion": "1.0" 
}] 
```

# [Event Grid event schema](#tab/event-grid-event-schema)
Following is an example of a schema for a post-maintenance event:

```json
[{ 
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration/providers/microsoft.maintenance/applyupdates/20230509150000", 
  "topic": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration", 
  "subject": "contosomaintenanceconfiguration", 
"data": 
{ 
   "CorrelationId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration/providers/microsoft.maintenance/applyupdates/20230509150000",  
   "MaintenanceConfigurationId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Maintenance/maintenanceConfigurations/contosomaintenanceconfiguration",  
   "Status": "Succeeded", 
   "StartDateTime": "2023-05-09T15:00:00Z",  
   "EndDateTime": "2023-05-09T18:55:00Z",  
   "ResourceSubscriptionIds": ["subscription guid 1", "subscription guid 2"] 
} 
"eventType": "Microsoft.Maintenance.PostMaintenanceEvent", 
"eventTime": "2023-05-09T15:55:00.3717473Z", 
  "dataVersion": "1.0", 
  "metadataVersion": "1" 
}] 
```

---

## Event properties


# [Cloud event schema](#tab/cloud-event-schema)

An event has the following top-level data:

**Property** | **Type** | **Description** |
--- | --- | --- |
source | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
subject | string | Publisher-defined path to the event subject. |
type | string | One of the registered event types for this event source. |
time |  string |  The time the event is generated based on the provider's UTC time. |
ID | string |  Unique identifier for the event. |
data | object |  App Configuration event data. |
specversion | string | CloudEvents schema specification version. 

# [Event Grid event schema](#tab/event-grid-event-schema)

An event has the following top-level data:

**Property** | **Type** | **Description** |
--- | --- | --- |
topic | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
subject | string | Publisher-defined path to the event subject. |
eventType | string | One of the registered event types for this event source. |
eventTime | string | The time the event is generated based on the provider's UTC time. |
ID | string | Unique identifier for the event | 
data | object | App Configuration event data. | 
dataVersion | string | The schema version of the data object. The publisher defines the schema version. |
metadataVersion | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. | 

---

The data object has the following properties:

**Property** | **Type** | **Description** |
--- | --- | --- |
CorrelationId | string | The resource ID of specific maintenance schedule instance. |
MaintenanceConfigurationId | string | The resource ID of maintenance configuration. |
StartDateTime | string | The maintenance schedule start time. |
EndDateTime | string | The maintenance schedule end time. |
CancellationCutOffDateTime | string | The maintenance schedule instance cancellation cut-off time. | 
ResourceSubscriptionIds | string | The subscription IDs from which VMs are included in this schedule instance. |
Status | string | The completion status of maintenance schedule instance. 

## Next steps

- For an introduction to Azure Event Grid, see [What is Event Grid?](./overview.md)
- For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](./subscription-creation-schema.md).


