---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/04/2018
ms.author: glenga
---

Errors raised in an Azure Functions can come from any of the following origins:

- Use of built-in Azure Functions [triggers and bindings](..\articles\azure-functions\functions-triggers-bindings.md)
- Calls to APIs of underlying Azure services
- Calls to REST endpoints
- Calls to client libraries, packages, or third-party APIs

Following solid error handling practices is important to avoid loss of data or missed messages. Recommended error handling practices include the following actions:

- [Enable Application Insights](../articles/azure-functions/functions-monitoring.md)
- [Use structured error handling](#use-structured-error-handling)
- [Design for idempotency](../articles/azure-functions/functions-idempotent.md)
- [Implement retry policies](../articles/azure-functions/functions-reliable-event-processing.md) (where appropriate)

### Use structured error handling

Capturing and publishing errors is critical to monitoring the health of your application. The top-most level of any function code should include a try/catch block. In the catch block, you can capture and publish errors.

### Retry support

The following triggers have built-in retry support:

* [Azure Blob storage](../articles/azure-functions/functions-bindings-storage-blob.md)
* [Azure Queue storage](../articles/azure-functions/functions-bindings-storage-queue.md)
* [Azure Service Bus (queue/topic)](../articles/azure-functions/functions-bindings-service-bus.md)

By default, these triggers retry requests up to five times. After the fifth retry, both the Azure Queue storage and Azure Service Bus triggers write a message to a [poison queue](..\articles\azure-functions\functions-bindings-storage-queue-trigger.md#poison-messages).

You need to manually implement retry policies for any other triggers or bindings types. Manual implementations may include writing error information to a [poison message queue](..\articles\azure-functions\functions-bindings-storage-blob-trigger.md#poison-blobs). By writing to a poison queue, you have the opportunity to retry operations at a later time. This approach is the same one used by the Blob storage trigger.
