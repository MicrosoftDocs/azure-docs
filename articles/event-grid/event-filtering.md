---
title: Event filtering for Azure Event Grid
description: Describes how to filter events when creating an Azure Event Grid subscription.
services: event-grid
author: tfitzmac

ms.service: event-grid
ms.topic: conceptual
ms.date: 10/23/2018
ms.author: tomfitz
---

# Filter events when creating Event Grid subscriptions

This article describes how to filter the events that are sent to your endpoint. When creating an event subscription, you have three options for filtering:

* Event types
* Subject begins with or ends with
* Advanced fields and operators

## Event types

By default, all [event types](event-schema.md) for the event source are sent to the endpoint. You can decide to send only certain event types to your endpoint. For example, you can get notified of updates to your resources, but not notified for other operations like deletions. In that case, filter by the `Microsoft.Resources.ResourceWriteSuccess` event type. Provide an array with the event types, or specify `All` to get all event types for the event source.

The syntax for filtering by event type is:

```json
"filter": {
  "includedEventTypes": [
    "Microsoft.Storage.BlobCreated",
    "Microsoft.Storage.BlobDeleted"
  ]
}
```

## Subject begins with or ends with

For simple filtering by subject, specify a value that the subject must either begin with or end with. For example, you can specify the subject ends with `.txt` to only get events related to uploading a text file to storage account. Or, you can filter the subject begins with `/blobServices/default/containers/testcontainer` to get all events for that container but not other containers in the storage account. For more complicated subject filtering, see [Advanced fields and operators](#advanced-fields-and-operators).

When publishing events to custom topics, create subjects for your events that make it easy for subscribers to know whether they're interested in the event. Subscribers use the subject to filter and route events. Consider providing the path for where the event happened, so subscribers can filter by segments of that path. The path enables subscribers to narrowly or broadly filter events. For example, if you provide a three segment path like `/A/B/C` in the subject, subscribers can filter by the first segment `/A` to get a broad set of events. Those subscribers get events with subjects like `/A/B/C` or `/A/D/E`. Other subscribers can filter by `/A/B` to get a narrower set of events.

The syntax for filtering by event type is:

```json
"filter": {
  "subjectBeginsWith": "blobServices/default/containers/mycontainer/log",
  "subjectEndsWith": ".jpg"
}

```

## Advanced fields and operators

To filter by values in the data fields and specify the comparison operator, use the advanced filtering option. In advanced filtering, you specify the:

* operator - The type of comparison.
* key - The field in the event data that you're using for filtering. It can be a number, boolean, or string.
* values - The values to compare to the key.

The syntax for using advanced filters is:

```json
"filter": {
  "advancedFilters": [
    {
      "Operator": "NumberGreaterThanOrEquals",
      "Key": "Data.Key1",
      "Values": 5
    },
    {
      "Operator": "StringContains",
      "Key": "Subject",
      "Values": ["container1", "container2"]
    }
  ]
}
```

### Operator

The available operators for numbers are:

* NumberGreaterThan
* NumberGreaterThanOrEquals
* NumberLessThan
* NumberLessThanOrEquals
* NumberIn
* NumberNotIn

The available operator for booleans is: BoolEquals

The available operators for strings are:

* StringContains
* StringBeginsWith
* StringEndsWith
* StringIn
* StringNotIn

All string comparisons are case-insensitve.

### Key

For events in the Event Grid schema, use the following values for the key:

* Id
* Topic
* Subject
* EventType
* DataVersion
* Event data (like Data.key1)

For events in Cloud Events schema, use the following values for the key:

* EventId
* Source
* EventType
* EventTypeVersion
* Event data (like Data.key1)

For custom input schema, use the event data fields (like Data.key1 Data.key1.key2).

### Values

The values can be:

* number
* string
* boolean
* array

### Limitations

Advanced filtering has the following limitations:

* Five advanced filters per event grid subscription
* 512 characters per string value
* Five values for **in** and **not in** operators
* The key can only have two levels of nesting (like data.key1.key2)

The same key can be used in more than one filter.

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).