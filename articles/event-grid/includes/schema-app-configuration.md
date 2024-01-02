---
 title: include file
 description: include file
 services: event-grid
 author: spelluru
 ms.service: event-grid
 ms.topic: include
 ms.date: 12/02/2022
 ms.author: spelluru
 ms.custom: include file
---

## Available event types

Event Grid uses [event subscriptions](../concepts.md#event-subscriptions) to route event messages to subscribers. Azure App Configuration emits the following event types: 

| Event type | Description |
| ---------- | ----------- |
| Microsoft.AppConfiguration.KeyValueModified | Raised when a key-value is created or replaced. |
| Microsoft.AppConfiguration.KeyValueDeleted | Raised when a key-value is deleted. |
| Microsoft.AppConfiguration.SnapshotCreated | Raised when a snapshot is created. |
| Microsoft.AppConfiguration.SnapshotModified | Raised when a snapshot is modified. |

## Event schema

# [Event Grid event schema](#tab/event-grid-event-schema)
An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `topic` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `eventType` | string | One of the registered event types for this event source. |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | App Configuration event data. |
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
| `data` | object | App Configuration event data. |
| `specversion` | string | CloudEvents schema specification version. |

---

The data object has the following properties:

### Key-value event

| Property | Type | Description |
| -------- | ---- | ----------- |
| `key` | string | The key of the key-value that was modified or deleted. |
| `label` | string | The label, if any, of the key-value that was modified or deleted. |
| `etag` | string | For `KeyValueModified` the etag of the new key-value. For `KeyValueDeleted` the etag of the key-value that was deleted. |
| `syncToken` | string | The sync token representing the server state after the key-value event. |

### Snapshot event

| Property | Type | Description |
| -------- | ---- | ----------- |
| `name` | string | The name of the snapshot that was created or modified. |
| `etag` | string | For `SnapshotCreated` the etag of the new snapshot. For `SnapshotModified` the etag of the snapshot that was modified. |
| `syncToken` | string | The sync token representing the server state after the snapshot event. |

## Example event

# [Event Grid event schema](#tab/event-grid-event-schema)
The following example shows the schema of a key-value modified event: 

```json
[{
  "id": "84e17ea4-66db-4b54-8050-df8f7763f87b",
  "topic": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/microsoft.appconfiguration/configurationstores/contoso",
  "subject": "https://contoso.azconfig.io/kv/Foo?label=FizzBuzz",
  "data": {
    "key": "Foo",
    "label": "FizzBuzz",
    "etag": "FnUExLaj2moIi4tJX9AXn9sakm0"
  },
  "eventType": "Microsoft.AppConfiguration.KeyValueModified",
  "eventTime": "2019-05-31T20:05:03Z",
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```

The following example shows the schema of a key-value deleted event: 

```json
[{
  "id": "84e17ea4-66db-4b54-8050-df8f7763f87b",
  "topic": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/microsoft.appconfiguration/configurationstores/contoso",
  "subject": "https://contoso.azconfig.io/kv/Foo?label=FizzBuzz",
  "data": {
    "key": "Foo",
    "label": "FizzBuzz",
    "etag": "FnUExLaj2moIi4tJX9AXn9sakm0"
  },
  "eventType": "Microsoft.AppConfiguration.KeyValueDeleted",
  "eventTime": "2019-05-31T20:05:03Z",
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```

The following example shows the schema of a snapshot created event:

```json
[{
  "id": "84e17ea4-66db-4b54-8050-df8f7763f87b",
  "topic": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/microsoft.appconfiguration/configurationstores/contoso",
  "subject": "https://contoso.azconfig.io/snapshots/Foo",
  "data": {
    "Name": "Foo",
    "etag": "FnUExLaj2moIi4tJX9AXn9sakm0",
    "syncToken": "zAJw6V16=Njo1IzUxNjQ2NzM=;sn=5164673"
  },
  "eventType": "Microsoft.AppConfiguration.SnapshotCreated",
  "eventTime": "2023-09-02T20:05:03Z",
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```

The following example shows the schema of a snapshot modified event:

```json
[{
  "id": "84e17ea4-66db-4b54-8050-df8f7763f87b",
  "topic": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/microsoft.appconfiguration/configurationstores/contoso",
  "subject": "https://contoso.azconfig.io/snapshots/Foo",
  "data": {
    "name": "Foo",
    "label": "FizzBuzz",
    "etag": "FnUExLaj2moIi4tJX9AXn9sakm0",
    "syncToken": "zAJw6V16=Njo1IzUxNjQ2NzM=;sn=5164673"
  },
  "eventType": "Microsoft.AppConfiguration.SnapshotModified",
  "eventTime": "2023-09-03T20:05:03Z",
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```
# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of a key-value modified event: 

```json
[{
  "id": "84e17ea4-66db-4b54-8050-df8f7763f87b",
  "source": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/microsoft.appconfiguration/configurationstores/contoso",
  "subject": "https://contoso.azconfig.io/kv/Foo?label=FizzBuzz",
  "data": {
    "key": "Foo",
    "label": "FizzBuzz",
    "etag": "FnUExLaj2moIi4tJX9AXn9sakm0"
  },
  "type": "Microsoft.AppConfiguration.KeyValueModified",
  "time": "2019-05-31T20:05:03Z",
  "specversion": "1.0"
}]
```

The following example shows the schema of a key-value deleted event: 

```json
[{
  "id": "84e17ea4-66db-4b54-8050-df8f7763f87b",
  "source": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/microsoft.appconfiguration/configurationstores/contoso",
  "subject": "https://contoso.azconfig.io/kv/Foo?label=FizzBuzz",
  "data": {
    "key": "Foo",
    "label": "FizzBuzz",
    "etag": "FnUExLaj2moIi4tJX9AXn9sakm0"
  },
  "type": "Microsoft.AppConfiguration.KeyValueDeleted",
  "time": "2019-05-31T20:05:03Z",
  "specversion": "1.0"
}]
```

The following example shows the schema of a snapshot created event: 

```json
[{
  "source": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/microsoft.appconfiguration/configurationstores/contoso",
  "subject": "https://contoso.azconfig.io/kvsnapshots/Foo",
  "type": "Microsoft.AppConfiguration.SnapshotCreated",
  "time": "2023-09-02T20:05:03.0000000Z",
  "id": "84e17ea4-66db-4b54-8050-df8f7763f87b",
  "data": {
    "name": "Foo",
    "etag": "FnUExLaj2moIi4tJX9AXn9sakm0",
    "syncToken": "zAJw6V16=Njo1IzUxNjQ2NzM=;sn=5164673"
  },
  "specversion": "1.0"
}]
```

The following example shows the schema of a snapshot modified event: 

```json
[{
  "source": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/microsoft.appconfiguration/configurationstores/contoso",
  "subject": "https://contoso.azconfig.io/snapshots/Foo",
  "type": "Microsoft.AppConfiguration.SnapshotModified",
  "time": "2023-09-03T20:05:03.0000000Z",
  "id": "84e17ea4-66db-4b54-8050-df8f7763f87b",
  "data": {
    "name": "Foo",
    "etag": "FnUExLaj2moIi4tJX9AXn9sakm0",
    "syncToken": "zAJw6V16=Njo1IzUxNjQ2NzM=;sn=5164673"
  },
  "specversion": "1.0"
}]
```
---


