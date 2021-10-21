---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/20/2021
ms.author: glenga
---

Event Grid is an Azure service that sends HTTP requests to notify you about events that happen in *publishers*. A publisher is the service or resource that originates the event. For example, an Azure blob storage account is a publisher, and [a blob upload or deletion is an event](../storage/blobs/storage-blob-event-overview.md). Some [Azure services have built-in support for publishing events to Event Grid](../event-grid/overview.md#event-sources).

Event *handlers* receive and process events. Azure Functions is one of several [Azure services that have built-in support for handling Event Grid events](../event-grid/overview.md#event-handlers). In this reference, you learn to use an Event Grid trigger to invoke a function when an event is received from Event Grid, and to use the output binding to send events to an [Event Grid custom topic](../event-grid/post-to-custom-topic.md).

If you prefer, you can use an HTTP trigger to handle Event Grid Events. To learn more, see [Receive events to an HTTP endpoint](../event-grid/receive-events.md). Currently, you can't use an Event Grid trigger for an Azure Functions app when the event is delivered in the [CloudEvents schema](../event-grid/cloudevents-schema.md#azure-functions). When you need to use this schema, you should instead use an HTTP trigger.