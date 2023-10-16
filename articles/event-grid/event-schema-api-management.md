---
title: API Management as an Event Grid source
description: This article describes how to use Azure API Management as an Event Grid event source. It provides the schema and links to how-to articles. 
ms.topic: conceptual
author: dlepow
ms.author: danlep
ms.date: 06/15/2022
---

# Azure API Management as an Event Grid source

This article provides the properties and schema for [Azure API Management](../api-management/index.yml) events. For an introduction to event schemas, see [Azure Event Grid event schema](./event-schema.md). It also gives you links to articles to use API Management as an event source.

## Available event types

API Management emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.ApiManagement.UserCreated | Raised when a user is created. |
| Microsoft.ApiManagement.UserUpdated | Raised when a user is updated. |
| Microsoft.ApiManagement.UserDeleted | Raised when a user is deleted. |
| Microsoft.ApiManagement.APICreated | Raised when an API is created. |
| Microsoft.ApiManagement.APIUpdated | Raised when an API is updated. |
| Microsoft.ApiManagement.APIDeleted | Raised when an API is deleted. |
| Microsoft.ApiManagement.ProductCreated | Raised when a product is created. |
| Microsoft.ApiManagement.ProductUpdated | Raised when a product is updated. |
| Microsoft.ApiManagement.ProductDeleted | Raised when a product is deleted. |
| Microsoft.ApiManagement.ReleaseCreated | Raised when an API release is created. |
| Microsoft.ApiManagement.ReleaseUpdated | Raised when an API release is updated. |
| Microsoft.ApiManagement.ReleaseDeleted | Raised when an API release is deleted. |
| Microsoft.ApiManagement.SubscriptionCreated | Raised when a subscription is created. |
| Microsoft.ApiManagement.SubscriptionUpdated | Raised when a subscription is updated. |
| Microsoft.ApiManagement.SubscriptionDeleted | Raised when a subscription is deleted. |
| Microsoft.ApiManagement.GatewayCreated | Raised when a self-hosted gateway is created. |
| Microsoft.ApiManagement.GatewayDeleted | Raised when a self-hosted gateway is updated. |
| Microsoft.ApiManagement.GatewayUpdated | Raised when a self-hosted gateway is deleted. |
| Microsoft.ApiManagement.GatewayAPIAdded | Raised when an API was removed from a self-hosted gateway. |
| Microsoft.ApiManagement.GatewayAPIRemoved | Raised when an API was removed from a self-hosted gateway. |
| Microsoft.ApiManagement.GatewayCertificateAuthorityCreated | Raised when a certificate authority was updated for a self-hosted. |
| Microsoft.ApiManagement.GatewayCertificateAuthorityDeleted | Raised when a certificate authority was deleted for a self-hosted. |
| Microsoft.ApiManagement.GatewayCertificateAuthorityUpdated | Raised when a certificate authority was updated for a self-hosted. |
| Microsoft.ApiManagement.GatewayHostnameConfigurationCreated | Raised when a hostname configuration was created for a self-hosted. |
| Microsoft.ApiManagement.GatewayHostnameConfigurationDeleted | Raised when a hostname configuration was deleted for a self-hosted. |
| Microsoft.ApiManagement.GatewayHostnameConfigurationUpdated | Raised when a hostname configuration was updated for a self-hosted. |

## Example event

# [Event Grid event schema](#tab/event-grid-event-schema)
The following example shows the schema of a product created event. The schema of other API Management resource created events is similar.

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

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of a product created event. The schema of other API Management resource created events is similar. 

```json
[{
  "id": "81dac958-49cf-487e-8805-d0baf0ee485a",
  "source": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}",
  "subject": "/products/myproduct",
  "data": {
    "resourceUri": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}/products/myproduct"
  },
  "Type": "Microsoft.ApiManagement.ProductCreated",
  "Time": "2021-07-02T00:38:44.3978295Z",
  "specversion":"1.0"
}]
```
---

# [Event Grid event schema](#tab/event-grid-event-schema)
The following example shows the schema of a user deleted event. The schema of other API Management resource deleted events is similar.

```json
[{
  "id": "92c502f2-a966-42a7-a428-d3b319844544",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}",
  "subject": "/users/apimuser-contoso-com",
  "data": {
    "resourceUri": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}/users/apimuser-contoso-com"
  },
  "eventType": "Microsoft.ApiManagement.UserDeleted",
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2021-07-02T00:47:47.8536532Z"
}]
```

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of a user deleted event. The schema of other API Management resource deleted events is similar. 

```json
[{
  "id": "81dac958-49cf-487e-8805-d0baf0ee485a",
  "source": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}",
  "subject": "/users/apimuser-contoso-com",
  "data": {
    "resourceUri": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}/users/apimuser-contoso-com"
  },
  "Type": "Microsoft.ApiManagement.UserDeleted",
  "Time": "2021-07-02T00:38:44.3978295Z",
  "specversion":"1.0"
}]
```
---

# [Event Grid event schema](#tab/event-grid-event-schema)

The following example shows the schema of an API updated event. The schema of other API Management resource updated events is similar. 
```json
[{
  "id": "95015754-aa51-4eb6-98d9-9ee322b82ad7",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}",
  "subject": "/apis/myapi;Rev=1",
  "data": {
    "resourceUri": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}/apis/myapi;Rev=1"
  },
  "eventType": "Microsoft.ApiManagement.APIUpdated",
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2021-07-12T23:13:44.9048323Z"
}]
```

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of an API updated event. The schema of other API Management resource updated events is similar. 

```json
[{
  "id": "95015754-aa51-4eb6-98d9-9ee322b82ad7",
  "source": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}",
  "subject": "/apis/myapi;Rev=1",
  "data": {
    "resourceUri": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.ApiManagement/service/{your-APIM-instance}/apis/myapi;Rev=1"
  },
  "Type": "Microsoft.ApiManagement.APIUpdated",
  "Time": "2021-07-12T23:13:44.9048323Z",
  "specversion":1.0
}]
```
---

## Event properties

# [Event Grid event schema](#tab/event-grid-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `topic` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
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
| `subject` | string | Publisher-defined path to the event subject. |
| `type` | string | One of the registered event types for this event source. |
| `time` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | API Management event data. |
| `specversion` | string | CloudEvents schema specification version. |

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `resourceUri` | string | The fully qualified ID of the resource that the compliance state change is for, including the resource name and resource type. Uses the format, `/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>/Microsoft.ApiManagement/service/<ServiceName>/<ResourceType>/<ResourceName>` |

## Tutorials and how-tos

|Title  |Description  |
|---------|---------|
| [Send events from API Management to Event Grid](../api-management/how-to-event-grid.md)| How to subscribe to API Management events using Event Grid. |

## Next steps

- For an introduction to Azure Event Grid, see [What is Event Grid?](./overview.md)
- For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](./subscription-creation-schema.md).


