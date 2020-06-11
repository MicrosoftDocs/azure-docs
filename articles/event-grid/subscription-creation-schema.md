---
title: Azure Event Grid subscription schema
description: This article describes the properties for subscribing to an event with Azure Event Grid. Event Grid subscription schema. 
services: event-grid
author: femila

ms.service: event-grid
ms.topic: reference
ms.date: 01/23/2020
ms.author: femila
---

# Event Grid subscription schema

To create an Event Grid subscription, you send a request to the Create Event subscription operation. Use the following format:

```HTTP
PUT /subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/{resource-provider}/{resource-type}/{resource-name}/Microsoft.EventGrid/eventSubscriptions/{event-type-definitions}?api-version=2018-01-01
``` 

For example, to create an event subscription for a storage account named `examplestorage` in a resource group named `examplegroup`, use the following format:

```HTTP
PUT /subscriptions/{subscription-id}/resourceGroups/examplegroup/providers/Microsoft.Storage/storageaccounts/examplestorage/Microsoft.EventGrid/eventSubscriptions/{event-type-definitions}?api-version=2018-01-01
``` 

The Event Subscription name must be 3-64 characters in length and can only contain a-z, A-Z, 0-9, and "-". The article describes the properties and schema for the body of the request.
 
## Event subscription properties

| Property | Type | Description |
| -------- | ---- | ----------- |
| destination | object | The object that defines the endpoint. |
| filter | object | An optional field for filtering the types of events. |

### destination object

| Property | Type | Description |
| -------- | ---- | ----------- |
| endpointType | string | The type of endpoint for the subscription (webhook/HTTP, Event Hub, or queue). | 
| endpointUrl | string | The destination URL for events in this event subscription. | 

### filter object

| Property | Type | Description |
| -------- | ---- | ----------- |
| includedEventTypes | array | Match when the event type in the event message is an exact match to one of these event type names. Raises an error when event name does not match the registered event type names for the event source. Default matches all event types. |
| subjectBeginsWith | string | A prefix-match filter to the subject field in the event message. The default or empty string matches all. | 
| subjectEndsWith | string | A suffix-match filter to the subject field in the event message. The default or empty string matches all. |
| isSubjectCaseSensitive | string | Controls case-sensitive matching for filters. |


## Example subscription schema

```json
{
  "properties": {
    "destination": {
      "endpointType": "webhook",
      "properties": {
          "endpointUrl": "https://example.azurewebsites.net/api/HttpTriggerCSharp1?code=VXbGWce53l48Mt8wuotr0GPmyJ/nDT4hgdFj9DpBiRt38qqnnm5OFg=="
      }
    },
    "filter": {
      "includedEventTypes": [ "Microsoft.Storage.BlobCreated", "Microsoft.Storage.BlobDeleted" ],
      "subjectBeginsWith": "/blobServices/default/containers/mycontainer/log",
      "subjectEndsWith": ".jpg",
      "isSubjectCaseSensitive ": "true"
    }
  }
}
```

## Next steps

* For an introduction to Event Grid, see [What is Event Grid?](overview.md)
