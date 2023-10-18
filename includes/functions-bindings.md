---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 08/22/2022
ms.author: glenga
ms.custom: fasttrack-edit
---
This table shows the bindings that are supported in the major versions of the Azure Functions runtime:


| Type | 1.x<sup>1</sup> | 2.x and higher<sup>2</sup> | Trigger | Input | Output |
| ---- | :-: | :-: | :------: | :---: | :----: |
| [Blob storage](../articles/azure-functions/functions-bindings-storage-blob.md)          |✔|✔|✔|✔|✔|
| [Azure Cosmos DB](../articles/azure-functions/functions-bindings-cosmosdb-v2.md)               |✔|✔|✔|✔|✔|
| [Azure Data Explorer](../articles/azure-functions/functions-bindings-azure-data-explorer.md)               | |✔| |✔|✔|
| [Azure SQL](../articles/azure-functions/functions-bindings-azure-sql.md)               | |✔|✔|✔|✔|
| [Dapr](https://github.com/dapr/azure-functions-extension)<sup>4</sup>             | |✔|✔|✔|✔|
| [Event Grid](../articles/azure-functions/functions-bindings-event-grid.md)              |✔|✔|✔| |✔|
| [Event Hubs](../articles/azure-functions/functions-bindings-event-hubs.md)              |✔|✔|✔| |✔|
| [HTTP & webhooks](../articles/azure-functions/functions-bindings-http-webhook.md)             |✔|✔|✔| |✔|
| [IoT Hub](../articles/azure-functions/functions-bindings-event-iot.md)             |✔|✔|✔| ||
| [Kafka](../articles/azure-functions/functions-bindings-kafka.md)<sup>3</sup>             | |✔|✔| |✔|
| [Mobile Apps](../articles/azure-functions/functions-bindings-mobile-apps.md)             |✔| | |✔|✔|
| [Notification Hubs](../articles/azure-functions/functions-bindings-notification-hubs.md) |✔|| | |✔|
| [Queue storage](../articles/azure-functions/functions-bindings-storage-queue.md)         |✔|✔|✔| |✔|
| [Redis](../articles/azure-functions/functions-bindings-cache.md)                         | |✔|✔| | |
| [RabbitMQ](../articles/azure-functions/functions-bindings-rabbitmq.md)<sup>3</sup>             | |✔|✔| |✔|
| [SendGrid](../articles/azure-functions/functions-bindings-sendgrid.md)                   |✔|✔| | |✔|
| [Service Bus](../articles/azure-functions/functions-bindings-service-bus.md)             |✔|✔|✔| |✔|
| [SignalR](../articles/azure-functions/functions-bindings-signalr-service.md)             | |✔|✔|✔|✔|
| [Table storage](../articles/azure-functions/functions-bindings-storage-table.md)         |✔|✔| |✔|✔|
| [Timer](../articles/azure-functions/functions-bindings-timer.md)                         |✔|✔|✔| | |
| [Twilio](../articles/azure-functions/functions-bindings-twilio.md)                       |✔|✔| | |✔|

<sup>1</sup> [Support will end for version 1.x of the Azure Functions runtime on September 14, 2026](https://aka.ms/azure-functions-retirements/hostv1). We highly recommend that you [migrate your apps to version 4.x](../articles/azure-functions/migrate-version-1-version-4.md) for full support.

<sup>2</sup> Starting with the version 2.x runtime, all bindings except HTTP and Timer must be registered. See [Register binding extensions](../articles/azure-functions/functions-bindings-register.md).

<sup>3</sup> Triggers aren't supported in the Consumption plan. Requires [runtime-driven triggers](../articles/azure-functions/functions-networking-options.md#premium-plan-with-virtual-network-triggers).

<sup>4</sup> Supported only in Kubernetes, IoT Edge, and other self-hosted modes only.
