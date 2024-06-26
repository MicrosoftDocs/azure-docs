---
title: Azure API Center as Event Grid source
description: Describes the properties that are provided for Azure API Center events with Azure Event Grid
ms.topic: conceptual
ms.date: 03/05/2024
author: dlepow
ms.author: danlep
---

# Azure API Center as an Event Grid source (Preview)

This article provides the properties and schema for Azure API Center events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). 

> [!NOTE]
> This feature is currently in preview.

## Available event types
These events are triggered when a client adds or updates an API definition.

 |Event name |Description|
 |----------|-----------|
 |**Microsoft.ApiCenter.ApiDefinitionAdded** |Triggered when an API definition is added in an API center. |
 |**Microsoft.ApiCenter.ApiDefinitionUpdated** |Triggered when an API definition is updated in an API center.|
 
## Example event
When an event is triggered, the API Center service sends data about that event to subscribing endpoint. This section contains an example of what that data would look like for each API Center event.


# [Cloud event schema](#tab/cloud-event-schema)


### Microsoft.ApiCenter.ApiDefinitionAdded event

```json
[{
  "source": "/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.ApiCenter/services",
  "subject": "/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.ApiCenter/services/{api_center_name}/workspaces/default/apis/{api_name}/versions/{version_name}/definitions/{definition_name}",
  "type": "Microsoft.ApiCenter.ApiDefinitionAdded",
  "time": "2024-03-01T00:00:00.0000000Z",
  "id": "00000000-0000-0000-0000-000000000000",
  "data": {
    "title": "OpenAPI",
    "description": "Default spec",
    "specification": {
      "name": "openapi",
      "version": "3.0.1"
    }
  },
  "specversion": "1.0"
}]
```

### Microsoft.ApiCenter.ApiDefinitionUpdated event

```json
[{
  "source": "/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.ApiCenter/services",
  "subject": "/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.ApiCenter/services/{api_center_name}/workspaces/default/apis/{api_name}/versions/{version_name}/definitions/{definition_name}",
  "type": "Microsoft.ApiCenter.ApiDefinitionUpdated",
  "time": "2024-03-01T00:00:00.0000000Z",
  "id": "00000000-0000-0000-0000-000000000000",
  "data": {
    "title": "OpenAPI",
    "description": "Default spec",
    "specification": {
      "name": "openapi",
      "version": "3.0.1"
    }
  },
  "specversion": "1.0"
}]
```


# [Event Grid event schema](#tab/event-grid-event-schema)

### Microsoft.ApiCenter.ApiDefinitionAdded event

```json
[{
  "topic": "/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.ApiCenter/services",
  "subject": "/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.ApiCenter/services/{api_center_name}/workspaces/default/apis/{api_name}/versions/{version_name}/definitions/{definition_name}",
  "eventType": "Microsoft.ApiCenter.ApiDefinitionAdded",
  "id": "00000000-0000-0000-0000-000000000000",
  "data": {
    "title": "OpenAPI",
    "description": "Default spec",
    "specification": {
      "name": "openapi",
      "version": "3.0.1"
    }
  },
  "dataVersion": "1.0.0",
  "metadataVersion": "1",
  "eventTime": "2024-03-01T00:00:00.0000000Z"
}]
```

### Microsoft.ApiCenter.ApiDefinitionUpdated event

```json
[{
  "topic": "/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.ApiCenter/services",
  "subject": "/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.ApiCenter/services/{api_center_name}/workspaces/default/apis/{api_name}/versions/{version_name}/definitions/{definition_name}",
  "eventType": "Microsoft.ApiCenter.ApiDefinitionUpdated",
  "id": "00000000-0000-0000-0000-000000000000",
  "data": {
    "title": "OpenAPI",
    "description": "Default spec",
    "specification": {
      "name": "openapi",
      "version": "3.0.1"
    }
  },
  "dataVersion": "1.0.0",
  "metadataVersion": "1",
  "eventTime": "2024-03-01T00:00:00.0000000Z"
}]
```

---

## Event properties

# [Cloud event schema](#tab/cloud-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `source` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `type` | string | One of the registered event types for this event source. |
| `time` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | Azure API Center event data. |
| `specversion` | string | CloudEvents schema specification version. |

# [Event Grid event schema](#tab/event-grid-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `topic` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `eventType` | string | One of the registered event types for this event source. |
| `id` | string | Unique identifier for the event. |
| `data` | object | Azure API Center event data. |
| `dataVersion` | string | The schema version of the data object. The publisher defines the schema version. |
| `metadataVersion` | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `title` | string | The title of the API definition. |
| `description` | string | The description of the API definition. |
| `specification` | string | The API specification properties, consisting of `name` (specification name) and `version` (specification version) |

## Tutorials and how-tos

|Title  |Description  |
|---------|---------|
| [Enable linting and analysis for API governance in your API center](https://aka.ms/apicenter/docs/linting)| Use Event Grid events to trigger linting to analyze API definitions in your API center. |

## Related content

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).

