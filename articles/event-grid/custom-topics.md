---
title: Custom topics in Azure Event Grid
description: Describes custom topics in Azure Event Grid.
ms.topic: conceptual
ms.custom:
  - devx-track-azurecli
  - devx-track-arm-template
  - devx-track-azurepowershell
  - build-2023
  - ignite-2023
ms.date: 04/27/2023
---

# Custom topics in Azure Event Grid

An Event Grid topic provides an endpoint where the source sends events. The publisher creates an Event Grid topic, and decides whether an event source needs one topic or more than one topic. A topic is used for a collection of related events. To respond to certain types of events, subscribers decide which topics to subscribe to.

**Custom topics** are application and third-party topics. When you create or are given access to a custom topic, you see that custom topic in your subscription. Custom topics support [push delivery](push-delivery-overview.md). Consult [when to use pull or push delivery](pull-delivery-overview.md#when-to-use-push-delivery-vs-pull-delivery) to help you decide if push delivery is the right approach given your requirements.

When designing your application, you have to decide how many topics to create. For relatively large solutions, create a **custom topic** for **each category of related events**. For example, consider an application that manages user accounts and another application about customer orders. It's unlikely that all event subscribers want events from both applications. To segregate concerns, create two topics: one for each application. Let event handlers subscribe to the topic according to their requirements. For small solutions, you might prefer to send all events to a single topic. Event subscribers can filter for the event types they want.

## Event schema

Custom topics supports two types of event schemas: Cloud events and Event Grid schema.

### Cloud event schema

In addition to its [default event schema](event-schema.md), Azure Event Grid natively supports events in the [JSON implementation of CloudEvents v1.0](https://github.com/cloudevents/spec/blob/v1.0/json-format.md) and [HTTP protocol binding](https://github.com/cloudevents/spec/blob/v1.0/http-protocol-binding.md). [CloudEvents](https://cloudevents.io/) is an [open specification](https://github.com/cloudevents/spec/blob/v1.0/spec.md) for describing event data.

CloudEvents simplifies interoperability by providing a common event schema for publishing and consuming events. This schema allows for uniform tooling, standard ways of routing & handling events, and a common way to deserialize your events. With a common schema, you can more easily integrate work across platforms.

> [!NOTE]
> For more information, see [Cloud event schema](cloud-event-schema.md).

### Event Grid event schema

When you use Event Grid event schema, you can specify your application-specific properties in the **data** object. 

```json
[
  {
    "topic": string,
    "subject": string,
    "id": string,
    "eventType": string,
    "eventTime": string,
    "data":{
      object-unique-to-each-publisher
    },
    "dataVersion": string,
    "metadataVersion": string
  }
]
```

> [!NOTE]
> For more information, see [Event Grid event schema](event-schema.md).

The following sections provide links to tutorials to create custom topics using Azure portal, CLI, PowerShell, and Azure Resource Manager (ARM) templates.

## Azure portal tutorials

|Title  |Description  |
|---------|---------|
| [Quickstart: create and route custom events with the Azure portal](custom-event-quickstart-portal.md) | Shows how to use the portal to send custom events. |
| [Quickstart: route custom events to Azure Queue storage](custom-event-to-queue-storage.md) | Describes how to send custom events to a Queue storage. |
| [How to: post to custom topic](post-to-custom-topic.md) | Shows how to post an event to a custom topic. |


## Azure CLI tutorials

|Title  |Description  |
|---------|---------|
| [Quickstart: create and route custom events with Azure CLI](custom-event-quickstart.md) | Shows how to use Azure CLI to send custom events. |
| [Azure CLI: create Event Grid custom topic](./scripts/event-grid-cli-create-custom-topic.md)|Sample script that creates a custom topic. The script retrieves the endpoint and a key.|
| [Azure CLI: subscribe to events for a custom topic](./scripts/cli-subscribe-custom-topic.md)|Sample script that creates a subscription for a custom topic. It sends events to a WebHook.|

## Azure PowerShell tutorials

|Title  |Description  |
|---------|---------|
| [Quickstart: create and route custom events with Azure PowerShell](custom-event-quickstart-powershell.md) | Shows how to use Azure PowerShell to send custom events. |
| [PowerShell: create Event Grid custom topic](./scripts/powershell-create-custom-topic.md)|Sample script that creates a custom topic. The script retrieves the endpoint and a key.|
| [PowerShell: subscribe to events for a custom topic](./scripts/powershell-subscribe-custom-topic.md)|Sample script that creates a subscription for a custom topic. It sends events to a WebHook.|

## ARM template tutorials

|Title  |Description  |
|---------|---------|
| [Resource Manager template: custom topic and WebHook endpoint](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventgrid/event-grid) | A Resource Manager template that creates a custom topic and subscription for that custom topic. It sends events to a WebHook. |
| [Resource Manager template: custom topic and Event Hubs endpoint](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventgrid/event-grid-event-hubs-handler)| A Resource Manager template that creates a subscription for a custom topic. It sends events to an Azure Event Hubs. |

> [!NOTE]
> Azure Digital Twins can route event notifications to custom topics that you create with Event Grid. For more information, see [Endpoints and event routes](../digital-twins/concepts-route-events.md) in the Azure Digital Twins documentation.

## Next steps

See the following articles:

- [System topics](system-topics.md)
- [Domains](event-domains.md)
