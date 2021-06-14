---
title: Apache Kafka bindings for Azure Functions
description: Learn to integrate Azure Functions with an Apache Kafka stream.
author: craigshoemaker
ms.topic: reference
ms.date: 06/14/2021
ms.author: cshoe
---

# Apache Kafka bindings for Azure Functions overview

Invoke Azure Functions and write values out to [Apache Kafka](https://kafka.apache.org/) event streams.

> [!IMPORTANT]
> Kafka bindings are only available for Azure Functions on the [Premium Plan](functions-premium-plan.md) an on Kubernetes where scaling is handed by KEDA.

| Action | Type |
|---------|---------|
| Run a function based on a new Kafka event | [Trigger](./functions-bindings-kafka-trigger.md) |
| Write to the Kafka event stream  |[Output binding](./functions-bindings-kafka-output.md) |

----

## Bindings

# [C#](#tab/csharp)

To get started using the extension in a WebJob project, add reference to [Microsoft.Azure.WebJobs.Extensions.Kafka](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Kafka/) project and call `AddKafka()` during startup.

```csharp
static async Task Main(string[] args)
{
  var builder = new HostBuilder()
        .UseEnvironment("Development")
        .ConfigureWebJobs(b =>
        {
            b.AddKafka();
        })
        .ConfigureAppConfiguration(b =>
        {
        })
        .ConfigureLogging((context, b) =>
        {
            b.SetMinimumLevel(LogLevel.Debug);
            b.AddConsole();
        })
        .ConfigureServices(services =>
        {
            services.AddSingleton<Functions>();
        })
        .UseConsoleLifetime();

    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}

public class Functions
{
    const string Broker = "localhost:9092";
    const string StringTopicWithOnePartition = "stringTopicOnePartition";
    const string StringTopicWithTenPartitions = "stringTopicTenPartitions";

    /// <summary>
    /// Trigger for the topic
    /// </summary>
    public void MultiItemTriggerTenPartitions(
        [KafkaTrigger(Broker, StringTopicWithTenPartitions, ConsumerGroup = "myConsumerGroup")] KafkaEventData<string> events,
        ILogger log)
    {
        foreach (var kafkaEvent in events)
        {
            log.LogInformation(kafkaEvent.Value);
        }
    }
}
```

# [C# Script](#tab/csharp-script)

**TODO**

# [Java](#tab/Java)

**TODO**

# [JavaScript](#tab/JavaScript)

**TODO**

# [PowerShell](#tab/PowerShell)

**TODO**

# [Python](#tab/python)

**TODO**

---

## Next steps

- [Run a function from an Apache Kafka event stream](./functions-bindings-kafka-trigger.md)
