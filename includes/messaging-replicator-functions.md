---
title: Include file
description: Include file
author: EldertGrootenboer
ms.service: azure-service-bus
ms.topic: include
ms.date: 09/22/2026
ms.author: egrootenboer
---
## What is a replication task?

A replication task receives events from a source and forwards them to a target. Most replication tasks forward events unchanged. If the source and target use different protocols, the task can also map their metadata structures.

Replication tasks are generally stateless. They don't share state or other side effects across sequential or parallel executions. Batching and chaining can also use the existing state of a stream.

This characteristic makes replication tasks different from aggregation tasks, which are generally stateful and are supported by analytics frameworks and services such as [Azure Stream Analytics](/azure/stream-analytics/stream-analytics-introduction).

## Replication applications and tasks in Azure Functions

In Azure Functions, a replication task uses a [trigger](/azure/azure-functions/functions-triggers-bindings) to receive messages from the source. The task sends copies to the target by using an [output binding](/azure/azure-functions/functions-triggers-bindings#binding-direction) or the corresponding Azure client library.

| Trigger | Output |
|---------|--------|
| [Azure Event Hubs trigger](/azure/azure-functions/functions-bindings-event-hubs-trigger?tabs=isolated-process) | [Azure Event Hubs output binding](/azure/azure-functions/functions-bindings-event-hubs-output?tabs=isolated-process) |
| [Azure Service Bus trigger](/azure/azure-functions/functions-bindings-service-bus-trigger?tabs=isolated-process) | [Azure Service Bus output binding](/azure/azure-functions/functions-bindings-service-bus-output?tabs=isolated-process) |
| [Azure IoT Hub trigger](/azure/azure-functions/functions-bindings-event-iot-trigger?tabs=csharp) | [Azure IoT Hub output binding](/azure/azure-functions/functions-bindings-event-iot-output?tabs=csharp) |
| [Azure Event Grid trigger](/azure/azure-functions/functions-bindings-event-grid-trigger?tabs=csharp) | [Azure Event Grid output binding](/azure/azure-functions/functions-bindings-event-grid-output?tabs=csharp) |
| [Azure Queue Storage trigger](/azure/azure-functions/functions-bindings-storage-queue-trigger?tabs=csharp) | [Azure Queue Storage output binding](/azure/azure-functions/functions-bindings-storage-queue-output?tabs=csharp) |
| [Apache Kafka trigger](https://github.com/azure/azure-functions-kafka-extension) | [Apache Kafka output binding](https://github.com/azure/azure-functions-kafka-extension) |
| [RabbitMQ trigger](https://github.com/azure/azure-functions-rabbitmq-extension) | [RabbitMQ output binding](https://github.com/azure/azure-functions-rabbitmq-extension) |
| | [Azure Notification Hubs output binding](/azure/azure-functions/functions-bindings-notification-hubs) |
| | [Azure SignalR Service output binding](/azure/azure-functions/functions-bindings-signalr-service-output?tabs=csharp) |
| | [Twilio SendGrid output binding](/azure/azure-functions/functions-bindings-sendgrid?tabs=csharp) |

Use the [Azure Functions .NET isolated worker model](/azure/azure-functions/dotnet-isolated-process-guide) for new .NET replication applications. Support for the .NET in-process model ends on November 10, 2026. To update an existing in-process replication application, follow the [.NET isolated worker migration guide](/azure/azure-functions/migrate-dotnet-to-isolated-model). <!-- wording: ok -->

You can deploy multiple replication tasks to the same function app. With Azure Functions Premium, multiple function apps can share the same App Service plan. This configuration also lets you colocate replication tasks written in different languages when an integration requires a language-specific library.

Prefer batch-oriented triggers when they're available. Receive the complete event or message structure instead of relying on Azure Functions [binding expressions](/azure/azure-functions/functions-bindings-expressions-patterns), so the task can preserve the source metadata.

Name each function after the source and target that it connects. Use the same name as a prefix for its connection and namespace settings.

### Data and metadata mapping

Map the message body and application properties that the target supports. The target assigns new values to broker-owned fields such as enqueue time and sequence number. Preserve the source values in the `repl-enqueue-time` and `repl-sequence` application properties. If either property already exists, append the new value with a semicolon separator. Don't copy delivery count or lock information.

The isolated worker Service Bus output binding supports simple output types, but not `ServiceBusMessage`. Use `ServiceBusClient` when a replication task must preserve Service Bus message metadata. Using a client also lets your code handle and log send failures. The following examples use Azure client libraries for both targets to make this behavior explicit.

### Retry policy

Configure retries based on the source trigger and target client. For Event Hubs triggers, you can apply an Azure Functions [function-level retry policy](/azure/azure-functions/functions-bindings-error-pages#retry-policies). Event Hubs doesn't write a checkpoint until the retry policy for the execution finishes.

Service Bus triggers use the retry and dead-letter behavior configured on the entity and in `host.json`. Don't apply a function-level retry attribute to a Service Bus trigger. A failed batch is redelivered in full, which can create duplicates at the target. When a message exceeds the source entity's `MaxDeliveryCount`, Service Bus moves it to the dead-letter queue. Set `MaxDeliveryCount` for the required recovery window and monitor the dead-letter queue.

The Azure client libraries also apply their configured retry policies to send operations. If a send still fails, let the exception escape from the function so the source trigger can retry the batch. An Event Hubs retry policy with an unlimited retry count pauses checkpoint progress for the affected partition until the target send succeeds.

### Set up a replication application host

A replication application is an Azure Functions application that hosts one or more replication tasks. Use a supported version of the Functions 4.x runtime and the .NET isolated worker model. Create the app on a plan that meets your scale and networking requirements.

Use a [system-assigned or user-assigned managed identity](/azure/app-service/overview-managed-identity) for the function app. Grant the identity permission to receive from each source and send to each target. Configure [identity-based connections](/azure/azure-functions/functions-reference#configure-an-identity-based-connection) for triggers, and provide the fully qualified target namespace to the Azure client registrations. For the examples, set `telemetrySourceConnection__fullyQualifiedNamespace`, `telemetryTarget__fullyQualifiedNamespace`, `jobsTransferSourceConnection__fullyQualifiedNamespace`, and `jobsTransferTarget__fullyQualifiedNamespace`.

The following `Program.cs` example registers the target service connections by using `DefaultAzureCredential`. In Azure, `DefaultAzureCredential` uses the function app's managed identity.

```csharp
using Azure.Identity;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.Services.AddAzureClients(clientBuilder =>
{
    clientBuilder.AddEventHubProducerClientWithNamespace(
        builder.Configuration["telemetryTarget:fullyQualifiedNamespace"],
        "telemetry-copy");
    clientBuilder.AddServiceBusClientWithNamespace(
        builder.Configuration["jobsTransferTarget:fullyQualifiedNamespace"]);
    clientBuilder.UseCredential(new DefaultAzureCredential());
});

builder.Build().Run();
```

The project needs the isolated worker packages, the Event Hubs and Service Bus binding extensions, `Azure.Identity`, `Azure.Messaging.EventHubs`, `Azure.Messaging.ServiceBus`, and `Microsoft.Extensions.Azure`. For current package and target framework requirements, see the [.NET isolated worker guide](/azure/azure-functions/dotnet-isolated-process-guide) and the [migration guide](/azure/azure-functions/migrate-dotnet-to-isolated-model).

Replication applications that access an Event Hubs or Service Bus namespace through a virtual network must use a hosting plan that supports virtual network integration. For more information, see [Azure Functions networking options](/azure/azure-functions/functions-networking-options).

### Examples

The following .NET isolated worker examples receive messages in batches, copy the customer-controlled body and metadata, and use the target client registered in `Program.cs`.

To copy event data between event hubs, use an Event Hubs trigger and an `EventHubProducerClient`:

```csharp
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Azure.Messaging.EventHubs;
using Azure.Messaging.EventHubs.Producer;
using Microsoft.Azure.Functions.Worker;

public sealed class EventHubReplicationFunction
{
    private readonly EventHubProducerClient outputClient;

    public EventHubReplicationFunction(EventHubProducerClient outputClient)
    {
        this.outputClient = outputClient;
    }

    [Function("telemetry")]
    [ExponentialBackoffRetry(-1, "00:00:05", "00:15:00")]
    public async Task Telemetry(
        [EventHubTrigger(
            "telemetry",
            ConsumerGroup = "%telemetrySourceConsumerGroup%",
            Connection = "telemetrySourceConnection")]
        EventData[] input,
        CancellationToken cancellationToken)
    {
        foreach (IGrouping<string, EventData> group in input.GroupBy(item => item.PartitionKey))
        {
            var options = new CreateBatchOptions { PartitionKey = group.Key };
            EventDataBatch batch = await outputClient.CreateBatchAsync(options, cancellationToken);

            try
            {
                foreach (EventData item in group)
                {
                    EventData copy = CopyEvent(item);

                    if (!batch.TryAdd(copy))
                    {
                        if (batch.Count == 0)
                        {
                            throw new InvalidOperationException("An event exceeds the maximum Event Hubs batch size.");
                        }

                        await outputClient.SendAsync(batch, cancellationToken);
                        batch.Dispose();
                        batch = await outputClient.CreateBatchAsync(options, cancellationToken);

                        if (!batch.TryAdd(copy))
                        {
                            throw new InvalidOperationException("An event exceeds the maximum Event Hubs batch size.");
                        }
                    }
                }

                if (batch.Count > 0)
                {
                    await outputClient.SendAsync(batch, cancellationToken);
                }
            }
            finally
            {
                batch.Dispose();
            }
        }
    }

    private static EventData CopyEvent(EventData input)
    {
        var output = new EventData(input.EventBody)
        {
            ContentType = input.ContentType,
            CorrelationId = input.CorrelationId,
            MessageId = input.MessageId,
        };

        foreach (KeyValuePair<string, object> property in input.Properties)
        {
            output.Properties[property.Key] = property.Value;
        }

        AppendReplicationProperty(
            output.Properties,
            "repl-enqueue-time",
            FormatSystemProperty(input, "x-opt-enqueued-time"));
        AppendReplicationProperty(
            output.Properties,
            "repl-sequence",
            FormatSystemProperty(input, "x-opt-sequence-number"));

        return output;
    }

    private static string FormatSystemProperty(EventData input, string name)
    {
        if (!input.SystemProperties.TryGetValue(name, out object? value))
        {
            throw new InvalidOperationException($"Event Hubs didn't provide {name}.");
        }

        return value switch
        {
            DateTime dateTime => dateTime.ToUniversalTime().ToString("O"),
            DateTimeOffset dateTimeOffset => dateTimeOffset.ToUniversalTime().ToString("O"),
            IFormattable formattable => formattable.ToString(null, CultureInfo.InvariantCulture),
            _ => value.ToString()!,
        };
    }

    private static void AppendReplicationProperty(
        IDictionary<string, object> properties,
        string name,
        string value)
    {
        properties[name] = properties.TryGetValue(name, out object? existing)
            ? $"{existing};{value}"
            : value;
    }
}
```

To copy messages between Service Bus entities, use a Service Bus trigger and a `ServiceBusClient`:

```csharp
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Functions.Worker;

public sealed class ServiceBusReplicationFunction
{
    private readonly ServiceBusSender sender;

    public ServiceBusReplicationFunction(ServiceBusClient client)
    {
        sender = client.CreateSender("jobs");
    }

    [Function("jobs-transfer")]
    public async Task JobsTransfer(
        [ServiceBusTrigger(
            "jobs-transfer",
            Connection = "jobsTransferSourceConnection",
            IsBatched = true,
            IsSessionsEnabled = true)]
        ServiceBusReceivedMessage[] input,
        CancellationToken cancellationToken)
    {
        foreach (IGrouping<(string SessionId, string PartitionKey), ServiceBusReceivedMessage> group
            in input.GroupBy(item => (item.SessionId, item.PartitionKey)))
        {
            ServiceBusMessageBatch batch = await sender.CreateMessageBatchAsync(cancellationToken);

            try
            {
                foreach (ServiceBusReceivedMessage item in group)
                {
                    ServiceBusMessage copy = CopyMessage(item);

                    if (!batch.TryAddMessage(copy))
                    {
                        if (batch.Count == 0)
                        {
                            throw new InvalidOperationException("A message exceeds the maximum Service Bus batch size.");
                        }

                        await sender.SendMessagesAsync(batch, cancellationToken);
                        batch.Dispose();
                        batch = await sender.CreateMessageBatchAsync(cancellationToken);

                        if (!batch.TryAddMessage(copy))
                        {
                            throw new InvalidOperationException("A message exceeds the maximum Service Bus batch size.");
                        }
                    }
                }

                if (batch.Count > 0)
                {
                    await sender.SendMessagesAsync(batch, cancellationToken);
                }
            }
            finally
            {
                batch.Dispose();
            }
        }
    }

    private static ServiceBusMessage CopyMessage(ServiceBusReceivedMessage input)
    {
        var output = new ServiceBusMessage(input.Body)
        {
            ContentType = input.ContentType,
            CorrelationId = input.CorrelationId,
            MessageId = input.MessageId,
            PartitionKey = input.PartitionKey,
            ReplyTo = input.ReplyTo,
            ReplyToSessionId = input.ReplyToSessionId,
            SessionId = input.SessionId,
            Subject = input.Subject,
            To = input.To,
        };

        foreach (KeyValuePair<string, object> property in input.ApplicationProperties)
        {
            output.ApplicationProperties[property.Key] = property.Value;
        }

        AppendReplicationProperty(
            output.ApplicationProperties,
            "repl-enqueue-time",
            input.EnqueuedTime.ToString("O"));
        AppendReplicationProperty(
            output.ApplicationProperties,
            "repl-sequence",
            input.SequenceNumber.ToString(CultureInfo.InvariantCulture));

        return output;
    }

    private static void AppendReplicationProperty(
        IDictionary<string, object> properties,
        string name,
        string value)
    {
        properties[name] = properties.TryGetValue(name, out object? existing)
            ? $"{existing};{value}"
            : value;
    }
}
```

The Service Bus example groups messages by session ID and partition key, then sends each group in source order. This approach preserves relative session order. Both examples create size-bounded batches that stay within the target service's maximum batch size. The Service Bus example doesn't copy the source time to live because doing so restarts the lifetime at the target. For expiration-aware replication, calculate the remaining lifetime or apply the target entity's expiration policy.

For a production replication path, also decide how to handle duplicate delivery, message expiration, transactions, scheduled messages, dead-lettered messages, and metadata that the target protocol can't represent.

### Monitoring

Use [Azure Functions monitoring](/azure/azure-functions/configure-monitoring) to monitor the replication application.

The Application Insights [Application Map](/azure/azure-monitor/app/app-map) visualizes dependencies between the replication task and its source and target. [Live Metrics](/azure/azure-monitor/app/live-stream) provides low-latency diagnostic information while the function app is running.

## Next steps

* [Azure Functions .NET isolated worker guide](/azure/azure-functions/dotnet-isolated-process-guide)
* [Migrate .NET apps to the isolated worker model](/azure/azure-functions/migrate-dotnet-to-isolated-model)
* [Azure Functions deployment technologies](/azure/azure-functions/functions-deployment-technologies)
* [Azure Functions diagnostics](/azure/azure-functions/functions-diagnostics)
* [Azure Functions networking options](/azure/azure-functions/functions-networking-options)
* [Azure Application Insights](/azure/azure-monitor/app/app-insights-overview)
