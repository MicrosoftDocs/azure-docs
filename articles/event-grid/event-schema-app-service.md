---
title: Azure App Service as Event Grid source
description: This article describes how to use Azure App Service as an Event Grid event source. It provides the schema and links to tutorial and how-to articles. 
ms.topic: conceptual
ms.date: 12/02/2022
---

# Azure App Service as an Event Grid source

This article provides the properties and schema for Azure App Service events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). It also gives you a list of quick starts and tutorials to use Azure App Service as an event source.

## Available event types

Azure App Service emits the following event types

|    Event Type                                             |    Description                                                     |
|-----------------------------------------------------------|--------------------------------------------------------------------|
|    Microsoft.Web/sites.BackupOperationStarted             |    Triggered when a backup has started                             |
|    Microsoft.Web/sites.BackupOperationCompleted           |    Triggered when a backup has completed                           |
|    Microsoft.Web/sites.BackupOperationFailed              |    Triggered when a backup has failed                              |
|    Microsoft.Web/sites.RestoreOperationStarted            |    Triggered when a restoration from a   backup has started        |
|    Microsoft.Web/sites.RestoreOperationCompleted          |    Triggered when a restoration from a   backup has completed      |
|    Microsoft.Web/sites.RestoreOperationFailed             |    Triggered when a restoration from a   backup has failed         |
|    Microsoft.Web/sites.SlotSwapStarted                    |    Triggered when a slot swap has started                          |
|    Microsoft.Web/sites.SlotSwapCompleted                  |    Triggered when a slot swap has   completed                      |
|    Microsoft.Web/sites.SlotSwapFailed                     |    Triggered when a slot swap has failed                           |
|    Microsoft.Web/sites.SlotSwapWithPreviewStarted         |    Triggered when a slot swap with   preview has started           |
|    Microsoft.Web/sites.SlotSwapWithPreviewCancelled       |    Triggered when a slot swap with   preview has been canceled    |
|    Microsoft.Web/sites.AppUpdated.Restarted               |    Triggered when a site has been   restarted                      |
|    Microsoft.Web/sites.AppUpdated.Stopped                 |    Triggered when a site has been stopped                          |
|    Microsoft.Web/sites.AppUpdated.ChangedAppSettings      |    Triggered when a site’s app settings   have changed             |
|    Microsoft.Web/serverfarms.AppServicePlanUpdated        |    Triggered when an App Service Plan is   updated                 |

## Properties common to all events

# [Event Grid event schema](#tab/event-grid-event-schema)
When an event is triggered, the Event Grid service sends data about that event to subscribing endpoint.
This section contains an example of what that data would look like for each event. Each event has the following top-level data:

|     Property          |     Type     |     Description                                                                                                                                |
|-----------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------|
|    `topic`              |    string    |    Full resource path to the event   source. This field isn't writeable. Event Grid provides this value.                                      |
|    `subject`            |    string    |    Publisher-defined path to the   event subject.                                                                                              |
|    `eventType`          |    string    |    One of the registered event   types for this event source.                                                                                  |
|    `eventTime`          |    string    |    The time the event is generated   based on the provider's UTC time.                                                                         |
|    `id`                 |    string    |    Unique identifier for the event.                                                                                                            |
|    `data`               |    object    |    Blob storage event data.                                                                                                                    |
|    `dataVersion`        |    string    |    The schema version of the data   object. The publisher defines the schema version.                                                          |
|    `metadataVersion`    |    string    |    The schema version of the event   metadata. Event Grid defines the schema of the top-level properties. Event   Grid provides this value.    |

# [Cloud event schema](#tab/cloud-event-schema)

When an event is triggered, the Event Grid service sends data about that event to subscribing endpoint.
This section contains an example of what that data would look like for each event. Each event has the following top-level data:

|     Property          |     Type     |     Description                                                                                                                                |
|-----------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------|
|    `source`              |    string    |    Full resource path to the event   source. This field isn't writeable. Event Grid provides this value.                                      |
|    `subject`            |    string    |    Publisher-defined path to the   event subject.                                                                                              |
|    `type`          |    string    |    One of the registered event   types for this event source.                                                                                  |
|    `time`          |    string    |    The time the event is generated   based on the provider's UTC time.                                                                         |
|    `id`                 |    string    |    Unique identifier for the event.                                                                                                            |
|    `data`               |    object    |    Blob storage event data.                                                                                                                    |
| `specversion` | string | CloudEvents schema specification version. |

---

## Example events

### BackupOperationStarted, BackupOperationCompleted, BackupOperationFailed

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
	"id": "7c5d6de5-eb70-4de2-b788-c52a544e68b8",
	"topic": "/subscriptions/<id>/resourceGroups/<rg>/providers/Microsoft.Web/sites/<site-name>",
	"subject": "/Microsoft.Web/sites/<site-name>",
	"eventType": "Microsoft.Web.BackupOperationStarted",
	"eventTime": "2020-01-28T18:26:51.7194887Z",
	"data": {
		"appEventTypeDetail": {
			"action": "Started"
		},
		"name": "<site-name>",
		"clientRequestId": "None",
		"correlationRequestId": "None",
		"requestId": "292f499d-04ee-4066-994d-c2df57b99198",
		"address": "None",
		"verb": "None"
	},
	"dataVersion": "1",
	"metaDataVersion": "1"
}
```
# [Cloud event schema](#tab/cloud-event-schema)

```json
{
	"id": "7c5d6de5-eb70-4de2-b788-c52a544e68b8",
	"source": "/subscriptions/<id>/resourceGroups/<rg>/providers/Microsoft.Web/sites/<site-name>",
	"subject": "/Microsoft.Web/sites/<site-name>",
	"type": "Microsoft.Web.BackupOperationStarted",
	"time": "2020-01-28T18:26:51.7194887Z",
	"data": {
		"appEventTypeDetail": {
			"action": "Started"
		},
		"name": "<site-name>",
		"clientRequestId": "None",
		"correlationRequestId": "None",
		"requestId": "292f499d-04ee-4066-994d-c2df57b99198",
		"address": "None",
		"verb": "None"
	},
	"specversion": "1.0"
}
```

---

The data object contains the following properties:

|    Property                |    Type      |    Description                                                                                                       |
|----------------------------|--------------|----------------------------------------------------------------------------------------------------------------------|
|    `appEventTypeDetail`      |    object    |    Detail of action on the app                                                                                       |
|    `action`                  |    string    |    Type of action of the operation                                                                                   |
|    `name`                    |    string    |    name of the web site that had this event                                                                          |
|    `clientRequestId`         |    string    |    The client request ID generated by the app service for the site API   operation that triggered this event         |
|    `correlationRequestId`    |    string    |    The correlation request ID generated by the app service for the site   API operation that triggered this event    |
|    `requestId`               |    string    |    The request ID generated by the app service for the site API operation   that triggered this event                |
|    `address`                 |    string    |    HTTP request URL of this operation                                                                                |
|    `verb`                    |    string    |    HTTP verb of this operation                                                                                       |

### RestoreOperationStarted, RestoreOperationCompleted, RestoreOperationFailed

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
	"id": "7c5d6de5-eb70-4de2-b788-c52a544e68b8",
	"topic": "/subscriptions/<id>/resourceGroups/<rg>/providers/Microsoft.Web/sites/<site-name>",
	"subject": "/Microsoft.Web/sites/<site-name>",
	"eventType": "Microsoft.Web.RestoreOperationStarted",
	"eventTime": "2020-01-28T18:26:51.7194887Z",
	"data": {
		"appEventTypeDetail": {
			"action": "Started"
		},
		"name": "<site-name>",
		"clientRequestId": "None",
		"correlationRequestId": "None",
		"requestId": "292f499d-04ee-4066-994d-c2df57b99198",
		"address": "None",
		"verb": "POST"
	},
	"dataVersion": "1",
	"metaDataVersion": "1"
}
```

# [Cloud event schema](#tab/cloud-event-schema)

```json
{
	"id": "7c5d6de5-eb70-4de2-b788-c52a544e68b8",
	"source": "/subscriptions/<id>/resourceGroups/<rg>/providers/Microsoft.Web/sites/<site-name>",
	"subject": "/Microsoft.Web/sites/<site-name>",
	"type": "Microsoft.Web.RestoreOperationStarted",
	"time": "2020-01-28T18:26:51.7194887Z",
	"data": {
		"appEventTypeDetail": {
			"action": "Started"
		},
		"name": "<site-name>",
		"clientRequestId": "None",
		"correlationRequestId": "None",
		"requestId": "292f499d-04ee-4066-994d-c2df57b99198",
		"address": "None",
		"verb": "POST"
	},
	"specversion": "1.0"
}
```

---

The data object contains the following properties:

|    Property                |    Type      |    Description                                                                                                       |
|----------------------------|--------------|----------------------------------------------------------------------------------------------------------------------|
|    `appEventTypeDetail`      |    object    |    Detail of action on the app                                                                                       |
|    `action`                  |    string    |    Type of action of the operation                                                                                   |
|    `name`                    |    string    |    name of the web site that had this event                                                                          |
|    `clientRequestId`         |    string    |    The client request ID generated by the app service for the site API   operation that triggered this event         |
|    `correlationRequestId`    |    string    |    The correlation request ID generated by the app service for the site   API operation that triggered this event    |
|    `requestId`               |    string    |    The request ID generated by the app service for the site API operation   that triggered this event                |
|    `address`                 |    string    |    HTTP request URL of this operation                                                                                |
|    `verb`                    |    string    |    HTTP verb of this operation                                                                                       |

### SlotSwapStarted, SlotSwapCompleted, SlotSwapFailed

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
	"id": "7c5d6de5-eb70-4de2-b788-c52a544e68b8",
	"topic": "/subscriptions/<id>/resourceGroups/<rg>/providers/Microsoft.Web/sites/<site-name>",
	"subject": "/Microsoft.Web/sites/<site-name>",
	"eventType": "Microsoft.Web.SlotSwapStarted",
	"eventTime": "2020-01-28T18:26:51.7194887Z",
	"data": {
		"appEventTypeDetail": null,
		"name": "<site-name>",
		"clientRequestId": "922f4841-20d9-4dd6-8c5b-23f0d85e5592",
		"correlationRequestId": "9ac46505-2b8a-4e06-834c-05ffbe2e8c3a",
		"requestId": "765117aa-eaf8-4bd2-a644-1dbf69c7b0fd",
		"address": "/websystems/WebSites/web/subscriptions/<id>/webspaces/<webspace>/sites/<site-name>/slots?Command=SWAP&targetSlot=production",
		"verb": "POST",
		"sourceSlot": "staging",
		"targetSlot": "production"
	},
	"dataVersion": "1",
	"metaDataVersion": "1"
}
```

# [Cloud event schema](#tab/cloud-event-schema)

```json
{
	"id": "7c5d6de5-eb70-4de2-b788-c52a544e68b8",
	"source": "/subscriptions/<id>/resourceGroups/<rg>/providers/Microsoft.Web/sites/<site-name>",
	"subject": "/Microsoft.Web/sites/<site-name>",
	"type": "Microsoft.Web.SlotSwapStarted",
	"time": "2020-01-28T18:26:51.7194887Z",
	"data": {
		"appEventTypeDetail": null,
		"name": "<site-name>",
		"clientRequestId": "922f4841-20d9-4dd6-8c5b-23f0d85e5592",
		"correlationRequestId": "9ac46505-2b8a-4e06-834c-05ffbe2e8c3a",
		"requestId": "765117aa-eaf8-4bd2-a644-1dbf69c7b0fd",
		"address": "/websystems/WebSites/web/subscriptions/<id>/webspaces/<webspace>/sites/<site-name>/slots?Command=SWAP&targetSlot=production",
		"verb": "POST",
		"sourceSlot": "staging",
		"targetSlot": "production"
	},
    "specversion": "1.0"
}
```

---

The data object contains the following properties:

|    Property                |    Type      |    Description                                                                                                       |
|----------------------------|--------------|----------------------------------------------------------------------------------------------------------------------|
|    `appEventTypeDetail`      |    object    |    Detail of action on the app                                                                                       |
|    `action`                 |    string    |    Type of action of the operation                                                                                   |
|    `name`                    |    string    |    name of the web site that had this event                                                                          |
|    `clientRequestId`         |    string    |    The client request ID generated by the app service for the site API   operation that triggered this event         |
|    `correlationRequestId`    |    string    |    The correlation request ID generated by the app service for the site   API operation that triggered this event    |
|   `requestId`               |    string    |    The request ID generated by the app service for the site API   operation that triggered this event                |
|    `address`                 |    string    |    HTTP request URL of this operation                                                                                |
|    `verb`                    |    string    |    HTTP verb of this operation                                                                                       |
|    `sourceSlot`              |    string    |    The source slot of the swap                                                                                       |

### SlotSwapWithPreviewStarted, SlotSwapWithPreviewCancelled

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
	"id": "7c5d6de5-eb70-4de2-b788-c52a544e68b8",
	"topic": "/subscriptions/<id>/resourceGroups/<rg>/providers/Microsoft.Web/sites/<site-name>",
	"subject": "/Microsoft.Web/sites/<site-name>",
	"eventType": "Microsoft.Web.SlotSwapWithPreviewStarted",
	"eventTime": "2020-01-28T18:26:51.7194887Z",
	"data": {
		"appEventTypeDetail": null,
		"name": "<site-name>",
		"clientRequestId": "922f4841-20d9-4dd6-8c5b-23f0d85e5592",
		"correlationRequestId": "9ac46505-2b8a-4e06-834c-05ffbe2e8c3a",
		"requestId": "765117aa-eaf8-4bd2-a644-1dbf69c7b0fd",
		"address": "/websystems/WebSites/web/subscriptions/<id>/webspaces/<webspace>/sites/<site-name>/slots?Command=SWAP&targetSlot=production",
		"verb": "POST",
		"sourceSlot": "staging",
		"targetSlot": "production"
	},
	"dataVersion": "1",
	"metaDataVersion": "1"
}
```

# [Cloud event schema](#tab/cloud-event-schema)

```json
{
	"id": "7c5d6de5-eb70-4de2-b788-c52a544e68b8",
	"source": "/subscriptions/<id>/resourceGroups/<rg>/providers/Microsoft.Web/sites/<site-name>",
	"subject": "/Microsoft.Web/sites/<site-name>",
	"type": "Microsoft.Web.SlotSwapWithPreviewStarted",
	"time": "2020-01-28T18:26:51.7194887Z",
	"data": {
		"appEventTypeDetail": null,
		"name": "<site-name>",
		"clientRequestId": "922f4841-20d9-4dd6-8c5b-23f0d85e5592",
		"correlationRequestId": "9ac46505-2b8a-4e06-834c-05ffbe2e8c3a",
		"requestId": "765117aa-eaf8-4bd2-a644-1dbf69c7b0fd",
		"address": "/websystems/WebSites/web/subscriptions/<id>/webspaces/<webspace>/sites/<site-name>/slots?Command=SWAP&targetSlot=production",
		"verb": "POST",
		"sourceSlot": "staging",
		"targetSlot": "production"
	},
    "specversion": "1.0"
}
```

---

The data object contains the following properties:

|    Property                |    Type      |    Description                                                                                                       |
|----------------------------|--------------|----------------------------------------------------------------------------------------------------------------------|
|    `appEventTypeDetail`      |    object    |    Detail of action on the app                                                                                       |
|    `action`                 |    string    |    Type of action of the operation                                                                                   |
|    `name`                    |    string    |    name of the web site that had this event                                                                          |
|    `clientRequestId`         |    string    |    The client request ID generated by the app service for the site API   operation that triggered this event         |
|    `correlationRequestId`    |    string    |    The correlation request ID generated by the app service for the site   API operation that triggered this event    |
|    `requestId`               |    string    |    The request ID generated by the app service for the site API   operation that triggered this event                |
|    `address`                 |    string    |    HTTP request URL of this operation                                                                                |
|    `verb`                    |    string    |    HTTP verb of this operation                                                                                       |

### AppUpdated.Restarted, AppUpdated.Stopped, AppUpdated.ChangedAppSettings

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
	"id": "b74ea56b-2a3f-4de5-a5d7-38e60c81cf23",
	"topic": "/subscriptions/<id>/resourceGroups/<group>/providers/Microsoft.Web/sites/<site-name>",
	"subject": "/Microsoft.Web/sites/<site-name>",
	"eventType": "Microsoft.Web.AppUpdated",
	"eventTime": "2020-01-28T18:22:30.2760952Z",
	"data": {
		"appEventTypeDetail": {
			"action": "Stopped"
		},
		"name": "<site-name>",
		"clientRequestId": "64a5e0aa-7cee-4ff1-9093-b9197b820014",
		"correlationRequestId": "25bb36a5-8f6c-4f04-b615-e9a0ee045756",
		"requestId": "f2e8eb3f-b190-42de-b99e-6acefe587374",
		"address": "/websystems/WebSites/web/subscriptions/<id>/webspaces/<webspace>/sites/<site-name>/stop",
		"verb": "POST"
	},
	"dataVersion": "1'",
	"metaDataVersion": "1"
}
```

# [Cloud event schema](#tab/cloud-event-schema)

```json
{
	"id": "b74ea56b-2a3f-4de5-a5d7-38e60c81cf23",
	"source": "/subscriptions/<id>/resourceGroups/<group>/providers/Microsoft.Web/sites/<site-name>",
	"subject": "/Microsoft.Web/sites/<site-name>",
	"type": "Microsoft.Web.AppUpdated",
	"time": "2020-01-28T18:22:30.2760952Z",
	"data": {
		"appEventTypeDetail": {
			"action": "Stopped"
		},
		"name": "<site-name>",
		"clientRequestId": "64a5e0aa-7cee-4ff1-9093-b9197b820014",
		"correlationRequestId": "25bb36a5-8f6c-4f04-b615-e9a0ee045756",
		"requestId": "f2e8eb3f-b190-42de-b99e-6acefe587374",
		"address": "/websystems/WebSites/web/subscriptions/<id>/webspaces/<webspace>/sites/<site-name>/stop",
		"verb": "POST"
	},
    "specversion": "1.0"
}
```

---

The data object has the following properties:

|    Property                |    Type      |    Description                                                                                                       |
|----------------------------|--------------|----------------------------------------------------------------------------------------------------------------------|
|    `appEventTypeDetail`      |    object    |    Detail of action on the app                                                                                       |
|    `action`                  |    string    |    Type of action of the operation                                                                                   |
|    `name`                    |    string    |    name of the web site that had this event                                                                          |
|    `clientRequestId`         |    string    |    The client request ID generated by the app service for the site API   operation that triggered this event         |
|    `correlationRequestId`    |    string    |    The correlation request ID generated by the app service for the site   API operation that triggered this event    |
|    `requestId`               |    string    |    The request ID generated by the app service for the site API   operation that triggered this event                |
|    `address`                 |    string    |    HTTP request URL of this operation                                                                                |
|    `verb`                    |    string    |    HTTP verb of this operation                                                                                       |

### Serverfarms.AppServicePlanUpdated

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
	"id": "56501672-9150-40e1-893a-18420c7fdbf7",
	"topic": "/subscriptions/<id>/resourceGroups/<rg>/providers/Microsoft.Web/serverfarms/<serverfarm-name>",
	"subject": "/Microsoft.Web/serverfarms/<plan-name>",
	"eventType": "Microsoft.Web.AppServicePlanUpdated",
	"eventTime": "2020-01-28T18:22:23.5516004Z",
	"data": {
		"serverFarmEventTypeDetail": {
			"stampKind": "Public",
			"action": "Updated",
			"status": "Started"
		},
		"serverFarmId": "0",
		"sku": {
			"name": "P1v2",
			"tier": "PremiumV2",
			"size": "P1v2",
			"family": "Pv2",
			"capacity": 1
		},
		"clientRequestId": "8f880321-a991-45c7-b743-6ff63fe4c004",
		"correlationRequestId": "1995c3be-ba7f-4ccf-94af-516df637ec8a",
		"requestId": "b973a8e6-6949-4783-b44c-ac778be831bb",
		"address": "/websystems/WebSites/serverfarms/subscriptions/<id>/webspaces/<webspace-id>/serverfarms/<plan-name>/async",
		"verb": "PUT"
	},
	"dataVersion": "1",
	"metaDataVersion": "1"
}
```

# [Cloud event schema](#tab/cloud-event-schema)

```json
{
	"id": "56501672-9150-40e1-893a-18420c7fdbf7",
	"source": "/subscriptions/<id>/resourceGroups/<rg>/providers/Microsoft.Web/serverfarms/<serverfarm-name>",
	"subject": "/Microsoft.Web/serverfarms/<plan-name>",
	"type": "Microsoft.Web.AppServicePlanUpdated",
	"time": "2020-01-28T18:22:23.5516004Z",
	"data": {
		"serverFarmEventTypeDetail": {
			"stampKind": "Public",
			"action": "Updated",
			"status": "Started"
		},
		"serverFarmId": "0",
		"sku": {
			"name": "P1v2",
			"tier": "PremiumV2",
			"size": "P1v2",
			"family": "Pv2",
			"capacity": 1
		},
		"clientRequestId": "8f880321-a991-45c7-b743-6ff63fe4c004",
		"correlationRequestId": "1995c3be-ba7f-4ccf-94af-516df637ec8a",
		"requestId": "b973a8e6-6949-4783-b44c-ac778be831bb",
		"address": "/websystems/WebSites/serverfarms/subscriptions/<id>/webspaces/<webspace-id>/serverfarms/<plan-name>/async",
		"verb": "PUT"
	},
    "specversion": "1.0"
}
```

---

The data object has the following properties:

|    Property                         |    Type      |    Description                                                                                                       |
|-------------------------------------|--------------|----------------------------------------------------------------------------------------------------------------------|
|    `appServicePlanEventTypeDetail`    |    object    |    Detail of action on the app service plan                                                                          |
|    `stampKind`                        |    string    |    Kind of environment where app service plan is                                                                     |
|    `action`                           |    string    |    Type of action on the app service plan                                                                            |
|    `status`                           |    string    |    Status of the operation on the app service plan                                                                   |
|    `sku`                              |    object    |    sku of the app service plan                                                                                       |
|    `name`                             |    string    |    name of the app service plan                                                                                      |
|    `Tier`                             |    string    |    tier of the app service plan                                                                                      |
|    `Size`                             |    string    |    size of the app service plan                                                                                      |
|    `Family`                           |    string    |    family of app service plan                                                                                        |
|    `Capacity`                         |    string    |    capacity of app service plan                                                                                      |
|    `action`                           |    string    |    Type of action of the operation                                                                                   |
|    `name`                             |    string    |    name of the web site that had this event                                                                          |
|    `clientRequestId`                  |    string    |    The client request ID generated by the app service for the site API   operation that triggered this event         |
|    `correlationRequestId`             |    string    |    The correlation request ID generated by the app service for the site   API operation that triggered this event    |
|    `requestId`                        |    string    |    The request ID generated by the app service for the site API   operation that triggered this event                |
|    `address`                         |    string    |    HTTP request URL of this operation                                                                                |
|    `verb`                             |    string    |    HTTP verb of this operation                                                                                       |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md)