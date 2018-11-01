---
title: Map custom field to Azure Event Grid schema
description: Describes how to convert your custom schema to the Azure Event Grid schema.
services: event-grid
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.topic: conceptual
ms.date: 10/02/2018
ms.author: tomfitz
---

# Map custom fields to Event Grid schema

If your event data doesn't match the expected [Event Grid schema](event-schema.md), you can still use Event Grid to route event to subscribers. This article describes how to map your schema to the Event Grid schema.

[!INCLUDE [event-grid-preview-feature-note.md](../../includes/event-grid-preview-feature-note.md)]

## Original event schema

Let's suppose you have an application that sends events in the following format:

```json
[
  {
    "myEventTypeField":"Created",
    "resource":"Users/example/Messages/1000",
    "resourceData":{"someDataField1":"SomeDataFieldValue"}
  }
]
```

Although that format doesn't match the required schema, Event Grid enables you to map your fields to the schema. Or, you can receive the values in the original schema.

## Create custom topic with mapped fields

When creating a custom topic, specify how to map fields from your original event to the event grid schema. There are three properties you use to customize the mapping:

* The `--input-schema` parameter specifies the type of schema. The available options are *cloudeventv01schema*, *customeventschema*, and *eventgridschema*. The default value is eventgridschema. When creating custom mapping between your schema and the event grid schema, use customeventschema. When events are in the CloudEvents schema, use cloudeventv01schema.

* The `--input-mapping-default-values` parameter specifies default values for fields in the Event Grid schema. You can set default values for `subject`, `eventtype`, and `dataversion`. Typically, you use this parameter when your custom schema doesn't include a field that corresponds to one of those three fields. For example, you can specify that data version is always set to **1.0**.

* The `--input-mapping-fields` parameter maps fields from your schema to the event grid schema. You specify values in space-separated key/value pairs. For the key name, use the name of the event grid field. For the value, use the name of your field. You can use key names for `id`, `topic`, `eventtime`, `subject`, `eventtype`, and `dataversion`.

The following example creates a custom topic with some mapped and default fields:

```azurecli-interactive
# if you have not already installed the extension, do it now.
# This extension is required for preview features.
az extension add --name eventgrid

az eventgrid topic create \
  -n demotopic \
  -l eastus2 \
  -g myResourceGroup \
  --input-schema customeventschema \
  --input-mapping-fields eventType=myEventTypeField \
  --input-mapping-default-values subject=DefaultSubject dataVersion=1.0
```

## Subscribe to event grid topic

When subscribing to the custom topic, you specify the schema you would like to use for receiving the events. You use the `--event-delivery-schema` parameter and set it to *cloudeventv01schema*, *eventgridschema*, or *inputeventschema*. The default value is eventgridschema.

The examples in this section use a Queue storage for the event handler. For more information, see [Route custom events to Azure Queue storage](custom-event-to-queue-storage.md).

The following example subscribes to an event grid topic and uses the event grid schema:

```azurecli-interactive
az eventgrid event-subscription create \
  --topic-name demotopic \
  -g myResourceGroup \
  --name eventsub1 \
  --event-delivery-schema eventgridschema \
  --endpoint-type storagequeue \
  --endpoint <storage-queue-url>
```

The next example uses the input schema of the event:

```azurecli-interactive
az eventgrid event-subscription create \
  --topic-name demotopic \
  -g myResourceGroup \
  --name eventsub2 \
  --event-delivery-schema inputeventschema \
  --endpoint-type storagequeue \
  --endpoint <storage-queue-url>
```

## Publish event to topic

You're now ready to send an event to the custom topic, and see the result of the mapping. The following script to post an event in the [example schema](#original-event-schema):

```azurecli-interactive
endpoint=$(az eventgrid topic show --name demotopic -g myResourceGroup --query "endpoint" --output tsv)
key=$(az eventgrid topic key list --name demotopic -g myResourceGroup --query "key1" --output tsv)

event='[ { "myEventTypeField":"Created", "resource":"Users/example/Messages/1000", "resourceData":{"someDataField1":"SomeDataFieldValue"} } ]'

curl -X POST -H "aeg-sas-key: $key" -d "$event" $endpoint
```

Now, look at your Queue storage. The two subscriptions delivered events in different schemas.

The first subscription used event grid schema. The format of the delivered event is:

```json
{
  "Id": "016b3d68-881f-4ea3-8a9c-ed9246582abe",
  "EventTime": "2018-05-01T20:00:25.2606434Z",
  "EventType": "Created",
  "DataVersion": "1.0",
  "MetadataVersion": "1",
  "Topic": "/subscriptions/<subscription-id>/resourceGroups/myResourceGroup/providers/Microsoft.EventGrid/topics/demotopic",
  "Subject": "DefaultSubject",
  "Data": {
    "myEventTypeField": "Created",
    "resource": "Users/example/Messages/1000",
    "resourceData": { "someDataField1": "SomeDataFieldValue" } 
  }
}
```

These fields contain the mappings from the custom topic. **myEventTypeField** is mapped to **EventType**. The default values for **DataVersion** and **Subject** are used. The **Data** object contains the original event schema fields.

The second subscription used the input event schema. The format of the delivered event is:

```json
{
  "myEventTypeField": "Created",
  "resource": "Users/example/Messages/1000",
  "resourceData": { "someDataField1": "SomeDataFieldValue" }
}
```

Notice that the original fields were delivered.

## Next steps

* For information about event delivery and retries, [Event Grid message delivery and retry](delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
