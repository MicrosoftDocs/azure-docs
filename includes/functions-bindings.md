---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 12/12/2025
ms.author: glenga
ms.custom: fasttrack-edit
---
This table shows the bindings that are supported in the major versions of the Azure Functions runtime:

| Type | 4.x<sup>1</sup> | 1.x<sup>2</sup> | Trigger | Input | Output |
| ---- | :-: | :-: | :------: | :---: | :----: |
| [Blob Storage](../articles/azure-functions/functions-bindings-storage-blob.md)          |✔|✔|✔|✔|✔|
| [Azure Cosmos DB](../articles/azure-functions/functions-bindings-cosmosdb-v2.md)               |✔|✔|✔|✔|✔|
| [Azure Data Explorer](../articles/azure-functions/functions-bindings-azure-data-explorer.md)               |✔| | |✔|✔|
| [Azure SQL](../articles/azure-functions/functions-bindings-azure-sql.md)               |✔| |✔|✔|✔|
| [Dapr](../articles/azure-functions/functions-bindings-dapr.md)<sup>4</sup>             |✔| |✔|✔|✔|
| [Event Grid](../articles/azure-functions/functions-bindings-event-grid.md)              |✔|✔|✔| |✔|
| [Event Hubs](../articles/azure-functions/functions-bindings-event-hubs.md)              |✔|✔|✔| |✔|
| [HTTP and webhooks](../articles/azure-functions/functions-bindings-http-webhook.md)             |✔|✔|✔| |✔|
| [IoT Hub](../articles/azure-functions/functions-bindings-event-iot.md)             |✔|✔|✔| ||
| [Kafka](../articles/azure-functions/functions-bindings-kafka.md)<sup>3</sup>             |✔| |✔| |✔|
| [Mobile Apps](../articles/azure-functions/functions-bindings-mobile-apps.md)             | |✔| |✔|✔|
| [Model Context Protocol](../articles/azure-functions/functions-bindings-mcp.md)          |✔| |✔| | |
| [Notification Hubs](../articles/azure-functions/functions-bindings-notification-hubs.md) ||✔| |✔|
| [Queue Storage](../articles/azure-functions/functions-bindings-storage-queue.md)         |✔|✔|✔| |✔|
| [Redis](../articles/azure-functions/functions-bindings-cache.md)                         |✔| |✔|✔|✔|
| [RabbitMQ](../articles/azure-functions/functions-bindings-rabbitmq.md)<sup>3</sup>             |✔| |✔| |✔|
| [SendGrid](../articles/azure-functions/functions-bindings-sendgrid.md)                   |✔|✔| | |✔|
| [Service Bus](../articles/azure-functions/functions-bindings-service-bus.md)             |✔|✔|✔| |✔|
| [Azure SignalR Service](../articles/azure-functions/functions-bindings-signalr-service.md)             |✔| |✔|✔|✔|
| [Table Storage](../articles/azure-functions/functions-bindings-storage-table.md)         |✔|✔| |✔|✔|
| [Timer](../articles/azure-functions/functions-bindings-timer.md)                         |✔|✔|✔| | |
| [Twilio](../articles/azure-functions/functions-bindings-twilio.md)                       |✔|✔| | |✔|

1. Register all bindings except HTTP and timer. See [Register Azure Functions binding extensions](../articles/azure-functions/functions-bindings-register.md). This step isn't required when using version 1.x of the Functions runtime.
1. [Support ends for version 1.x of the Azure Functions runtime on September 14, 2026](https://aka.ms/azure-functions-retirements/hostv1). [Migrate your apps to version 4.x](../articles/azure-functions/migrate-version-1-version-4.md) for full support.
1. Triggers aren't supported in the Consumption plan. This binding type requires [runtime-driven triggers](../articles/azure-functions/functions-networking-options.md#elastic-premium-plan-with-virtual-network-triggers).
1. This binding type is supported in Kubernetes, Azure IoT Edge, and other self-hosted modes only.
