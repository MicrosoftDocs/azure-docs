---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/15/2026
ms.author: glenga
ms.custom: fasttrack-edit
---
This table shows the triggers and bindings available in Azure Functions:<sup>1</sup>

| Type | Trigger | Input | Output |
| ---- | :-----: | :---: | :----: |
| [Blob Storage](../articles/azure-functions/functions-bindings-storage-blob.md) | ✔ | ✔ | ✔ |
| [Azure Cosmos DB](../articles/azure-functions/functions-bindings-cosmosdb-v2.md) | ✔ | ✔ | ✔ |
| [Azure Data Explorer](../articles/azure-functions/functions-bindings-azure-data-explorer.md) | | ✔ | ✔ |
| [Azure SQL](../articles/azure-functions/functions-bindings-azure-sql.md) | ✔ | ✔ | ✔ |
| [Dapr](../articles/azure-functions/functions-bindings-dapr.md)<sup>3</sup> | ✔ | ✔ | ✔ |
| [Event Grid](../articles/azure-functions/functions-bindings-event-grid.md) | ✔ | | ✔ |
| [Event Hubs](../articles/azure-functions/functions-bindings-event-hubs.md) | ✔ | | ✔ |
| [HTTP and webhooks](../articles/azure-functions/functions-bindings-http-webhook.md) | ✔ | | ✔ |
| [IoT Hub](../articles/azure-functions/functions-bindings-event-iot.md) | ✔ | | |
| [Kafka](../articles/azure-functions/functions-bindings-kafka.md)<sup>2</sup> | ✔ | | ✔ |
| [Model Context Protocol](../articles/azure-functions/functions-bindings-mcp.md) | ✔ | | |
| [Queue Storage](../articles/azure-functions/functions-bindings-storage-queue.md) | ✔ | | ✔ |
| [Redis](../articles/azure-functions/functions-bindings-cache.md) | ✔ | ✔ | ✔ |
| [RabbitMQ](../articles/azure-functions/functions-bindings-rabbitmq.md)<sup>2</sup> | ✔ | | ✔ |
| [SendGrid](../articles/azure-functions/functions-bindings-sendgrid.md) | | | ✔ |
| [Service Bus](../articles/azure-functions/functions-bindings-service-bus.md) | ✔ | | ✔ |
| [Azure SignalR Service](../articles/azure-functions/functions-bindings-signalr-service.md) | ✔ | ✔ | ✔ |
| [Table Storage](../articles/azure-functions/functions-bindings-storage-table.md) | | ✔ | ✔ |
| [Timer](../articles/azure-functions/functions-bindings-timer.md) | ✔ | | |
| [Twilio](../articles/azure-functions/functions-bindings-twilio.md) | | | ✔ |
| [Managed connector](../articles/azure-functions/functions-connectors-overview.md) | ✔ | | |

1. Register all bindings except HTTP and timer. See [Register Azure Functions binding extensions](../articles/azure-functions/functions-bindings-register.md).
1. Triggers aren't supported in the Consumption plan. This binding type requires [runtime-driven triggers](../articles/azure-functions/functions-target-based-scaling.md#premium-plan-with-runtime-scale-monitoring-enabled).
1. This binding type is supported in Kubernetes, Azure IoT Edge, and other self-hosted modes only.
