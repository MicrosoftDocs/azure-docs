---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/31/2023
ms.author: mahender
---

If you haven't already, update your project to reference the latest stable versions of:
- [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/)
- [Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/)

Depending on the triggers and bindings your app uses, your app might need to reference a different set of packages. The following table shows the replacements for some of the most commonly used extensions:

| Scenario | Changes to package references |
| - | - |
| Timer trigger |  Add<br/>[Microsoft.Azure.Functions.Worker.Extensions.Timer][timer] |
| Storage bindings | Replace<br/>`Microsoft.Azure.WebJobs.Extensions.Storage`<br/>with<br/>[Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs][blobs],<br/>[Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues][queues], and<br/>[Microsoft.Azure.Functions.Worker.Extensions.Tables][tables] |
| Blob bindings | Replace references to<br/>`Microsoft.Azure.WebJobs.Extensions.Storage.Blobs`<br/>with the latest version of<br/>[Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs][blobs] |
| Queue bindings | Replace references to<br/>`Microsoft.Azure.WebJobs.Extensions.Storage.Queues`<br/>with the latest version of<br/>[Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues][queues] |
| Table bindings | Replace references to<br/>`Microsoft.Azure.WebJobs.Extensions.Tables`<br/>with the latest version of<br/>[Microsoft.Azure.Functions.Worker.Extensions.Tables][tables] |
| Cosmos DB bindings | Replace references to<br/>`Microsoft.Azure.WebJobs.Extensions.CosmosDB`<br/>and/or<br/>`Microsoft.Azure.WebJobs.Extensions.DocumentDB`<br/>with the latest version of<br/>[Microsoft.Azure.Functions.Worker.Extensions.CosmosDB][cosmos] | 
| Service Bus bindings | Replace references to<br/>`Microsoft.Azure.WebJobs.Extensions.ServiceBus`<br/>with the latest version of<br/>[Microsoft.Azure.Functions.Worker.Extensions.ServiceBus][servicebus] | 
| Event Hubs bindings | Replace references to<br/>`Microsoft.Azure.WebJobs.Extensions.EventHubs`<br/>with the latest version of<br/>[Microsoft.Azure.Functions.Worker.Extensions.EventHubs][eventhubs] | 
| Event Grid bindings | Replace references to<br/>`Microsoft.Azure.WebJobs.Extensions.EventGrid`<br/>with the latest version of<br/>[Microsoft.Azure.Functions.Worker.Extensions.EventGrid][eventgrid] | 
| SignalR Service bindings | Replace references to<br/>`Microsoft.Azure.WebJobs.Extensions.SignalRService`<br/>with the latest version of<br/>[Microsoft.Azure.Functions.Worker.Extensions.SignalRService][signalr] |
| Durable Functions | Replace references to<br/>`Microsoft.Azure.WebJobs.Extensions.DurableTask`<br/>with the latest version of<br/>[Microsoft.Azure.Functions.Worker.Extensions.DurableTask][durable] |
| Durable Functions<br/>(SQL storage provider) | Replace references to<br/>`Microsoft.DurableTask.SqlServer.AzureFunctions`<br/>with the latest version of<br/>[Microsoft.Azure.Functions.Worker.Extensions.DurableTask.SqlServer][durable-sql] |
| Durable Functions<br/>(Netherite storage provider) | Replace references to<br/>`Microsoft.Azure.DurableTask.Netherite.AzureFunctions`<br/>with the latest version of<br/>[Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite][durable-netherite] |
| SendGrid bindings| Replace references to<br/>`Microsoft.Azure.WebJobs.Extensions.SendGrid`<br/>with the latest version of<br/>[Microsoft.Azure.Functions.Worker.Extensions.SendGrid][sendgrid] | 
| Kafka bindings | Replace references to<br/>`Microsoft.Azure.WebJobs.Extensions.Kafka`<br/>with the latest version of<br/>[Microsoft.Azure.Functions.Worker.Extensions.Kafka][kafka] |
| RabbitMQ bindings | Replace references to<br/>`Microsoft.Azure.WebJobs.Extensions.RabbitMQ`<br/>with the latest version of<br/>[Microsoft.Azure.Functions.Worker.Extensions.RabbitMQ][rabbitmq] |
| Dependency injection<br/>and startup config | Remove references to<br/>`Microsoft.Azure.Functions.Extensions`<br/>(The isolated worker model provides this functionality by default.) |

See [Supported bindings](../articles/azure-functions/functions-triggers-bindings.md#supported-bindings) for a complete list of extensions to consider, and consult each extension's documentation for full installation instructions for the isolated process model. Be sure to install the latest stable version of any packages you are targeting.

**Your isolated worker model application should not reference any packages in the `Microsoft.Azure.WebJobs.*` namespaces or `Microsoft.Azure.Functions.Extensions`.** If you have any remaining references to these, they should be removed.

> [!TIP]
> Your app might also depend on Azure SDK types, either as part of your triggers and bindings or as a standalone dependency. You should take this opportunity to upgrade these as well. The latest versions of the Functions extensions work with the latest versions of the [Azure SDK for .NET](/dotnet/azure/sdk/azure-sdk-for-dotnet), almost all of the packages for which are the form `Azure.*`.

[blobs]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs
[queues]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues
[tables]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Tables
[servicebus]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.ServiceBus
[eventgrid]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventGrid
[cosmos]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.CosmosDB
[timer]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Timer
[eventhubs]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventHubs
[signalr]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.SignalRService
[rabbitmq]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.RabbitMQ
[kafka]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Kafka
[sendgrid]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.SendGrid
[durable]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask
[durable-sql]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.SqlServer
[durable-netherite]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite
