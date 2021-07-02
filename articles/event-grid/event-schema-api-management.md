---
title: API Management as an Event Grid source
description: This article describes how to use Azure API Management as an Event Grid event source. It provides the schema and links to how-to articles. 
ms.topic: conceptual
author: spelluru
ms.author: dlepow
ms.date: 07/02/2021
---

# Azure API Management as an Event Grid source (Preview)

This article provides the properties and schema for [Azure API Management](../api-management/index.yml) events. For an introduction to event schemas, see [Azure Event Grid event schema](./event-schema.md). It also gives you links to articles to use API Management as an event source.

## Available event types

API Management emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.APIManagement.UserCreated | Raised when a user is created. |
| Microsoft.APIManagement.UserUpdated | Raised when a user is updated. |
| Microsoft.APIManagement.UserDeleted | Raised when a user is deleted. |
| Microsoft.APIManagement.APICreated | Raised when an API is created. |
| Microsoft.APIManagement.APIUpdated | Raised when an API is updated. |
| Microsoft.APIManagement.APIDeleted | Raised when an API is deleted. |
| Microsoft.APIManagement.ProductCreated | Raised when a product is created. |
| Microsoft.APIManagement.ProductUpdated | Raised when a product is updated. |
| Microsoft.APIManagement.ProductDeleted | Raised when a product is deleted. |
| Microsoft.APIManagement.ReleaseCreated | Raised when an API release is created. |
| Microsoft.APIManagement.ReleaseUpdated | Raised when an API release is updated. |
| Microsoft.APIManagement.ReleaseDeleted | Raised when an API release is deleted. |
| Microsoft.APIManagement.SubscriptionCreated | Raised when a subscription is created. |
| Microsoft.APIManagement.SubscriptionUpdated | Raised when a subscription is updated. |
| Microsoft.APIManagement.SubscriptionDeleted | Raised when a subscription is deleted. |

## Example event

# [Event Grid event schema](#tab/event-grid-event-schema)
The following example shows the schema of an product created event. The schema of other API Management resource created events is similar.

```json
[{
  "id": "92c502f2-a966-42a7-a428-d3b319844544",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}",
  "subject": "/products/myproduct",
  "data": {
    "resourceUri": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}/products/myproduct"
  },
  "eventType": "Microsoft.ApiManagement.ProductCreated",
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2021-07-02T00:47:47.8536532Z"
}]
```

The following example shows the schema of a user deleted event. The schema of other API Management resource deleted events is similar. 

```json
[{
  "id": "81dac958-49cf-487e-8805-d0baf0ee485a",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}",
  "subject": "/users/apimuser-contoso-com",
  "data": {
    "resourceUri": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}/users/apimuser-contoso-com"
  },
  "eventType": "Microsoft.ApiManagement.UserDeleted",x`
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2021-07-02T00:38:44.3978295Z"
}]
```
# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of an API updated event. The schema of other API Management resource updated events is similar. 

```json
[{
  "id": "96c9a22d-c047-41f4-bd4f-7547df2bb884",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}",
  "subject": "/apis/demo-conference-api;Rev=1",
  "data": {
    "updatedProperties": [
      "path"
    ],
    "resourceUri": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}/apis/demo-conference-api;Rev=1"
  },
  "eventType": "Microsoft.ApiManagement.APIUpdated",
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2021-07-02T18:36:27.0214836Z"
}]
```

---

## Event properties

# [Event Grid event schema](#tab/event-grid-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `topic` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | The fully qualified ID of the resource that the compliance state change is for, including the resource name and resource type. Uses the format, `/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>/providers/<ProviderNamespace>/<ResourceType>/<ResourceName>` |
| `eventType` | string | One of the registered event types for this event source. |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | API Management event data. |
| `dataVersion` | string | The schema version of the data object. The publisher defines the schema version. |
| `metadataVersion` | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

# [Cloud event schema](#tab/cloud-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `source` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | The fully qualified ID of the resource that the compliance state change is for, including the resource name and resource type. Uses the format, `/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>/providers/<ProviderNamespace>/<ResourceType>/<ResourceName>` |
| `type` | string | One of the registered event types for this event source. |
| `time` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | API Management event data. |
| `specversion` | string | CloudEvents schema specification version. |

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `resourceUri` | string | The URI of the API Management resource that triggered the event. |
| `updatedProperties` | string[] | List of properties updated in the API Management resouce that triggered an update event. |

## Tutorials and how-tos
|Title  |Description  |
|---------|---------|
| [Send events from API Management to Event Grid](../api-management/how-to-event-grid.md)| How to subscribe to API Management events using Event Grid. |

## Next steps

- For an introduction to Azure Event Grid, see [What is Event Grid?](./overview.md)
- For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](./subscription-creation-schema.md).


