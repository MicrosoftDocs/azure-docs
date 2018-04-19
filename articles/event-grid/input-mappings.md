---
title: Map custom field to Azure Event Grid schema
description: Describes how to convert your custom schema to the Azure Event Grid schema.
services: event-grid
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 04/18/2018
ms.author: tomfitz
---

# Map custom fields to Event Grid schema

If your event data does not match the expected [Event Grid schema](event-schema.md), you can still use Event Grid to route event to subscribers. This article describes how to map your schema to the Event Grid schema.

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

Although that format doesn't match the required schema, Event Grid enables you to map your fields to the schema.

## Create custom topic with mapped fields

When creating a custom topic, specify how to map fields from your original event to the Event Grid schema. In the **input-mapping-default-values** parameter, provide default values that are used for all events. You can specify default values for `subject`, `eventtype`, and `dataversion`. In the **input-mapping-fields** parameter, provide the one-to-one mapping between the two schemas. You can specify values for `id`, `topic`, `eventtime`, `subject`, `eventtype`, and `dataversion`.

```azurecli-interactive
az eventgrid topic create \
  -n demotopic \
  -l eastus2 \
  -g myResourceGroup \
  --input-mapping-fields topic=myTopicField eventType=myEventTypeField \
  --input-mapping-default-values subject=DefaultSubject dataVersion=1.0
```

## Subscribe to custom topic

When subscribing to the custom topic, specify `inputeventschema` for the **event-delivery-schema** parameter.

```azurecli-interactive
az eventgrid event-subscription create \
  --topic-name demotopic \
  -g myResourceGroup \
  --name eventsub1 \
  --event-delivery-schema inputeventschema \
  --endpoint-type storagequeue \
  --endpoint <storage-queue-url>
```

## Publish event to topic

You are now ready to send an event to the custom topic, and see the result of the mapping. Use the following script to post an event:

```azurecli-interactive
endpoint=$(az eventgrid topic show --name demotopic -g myResourceGroup --query "endpoint" --output tsv)
key=$(az eventgrid topic key list --name demotopic -g myResourceGroup --query "key1" --output tsv)

body=$(eval echo "'$(curl https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/event-grid/customevent.json)'")

curl -X POST -H "aeg-sas-key: $key" -d "$body" $endpoint
```

Notice that the event data has been transformed from its original to schema to the event grid schema.

## Next steps

* For information about event delivery and retries, [Event Grid message delivery and retry](delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
