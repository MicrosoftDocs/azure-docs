---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/20/2021
ms.author: glenga
---

Event Grid is an Azure service that sends HTTP requests to notify you about events that happen in publishers. A _publisher_ is the service or resource that originates the event. For example, an Azure blob storage account is a publisher, and [a blob upload or deletion is an event](../articles/storage/blobs/storage-blob-event-overview.md). Some [Azure services have built-in support for publishing events to Event Grid](../articles/event-grid/overview.md#event-sources).

Event *handlers* receive and process events. Azure Functions is one of several [Azure services that have built-in support for handling Event Grid events](../articles/event-grid/overview.md#event-handlers). Functions provides an Event Grid trigger, which invokes a function when an event is received from Event Grid. A similar output binding can be used to send events from your function to an [Event Grid custom topic](../articles/event-grid/post-to-custom-topic.md).

You can also use an HTTP trigger to handle Event Grid Events. For example, you can't currently use an Event Grid trigger when the event is delivered in the [CloudEvents schema](../articles/event-grid/cloudevents-schema.md#azure-functions). When you need to use this schema, you should instead use an HTTP trigger. To learn more, see [Receive events to an HTTP endpoint](../articles/event-grid/receive-events.md).