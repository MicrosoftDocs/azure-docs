---
title: Apache Kafka bindings for Azure Functions
description: Learn to integrate Azure Functions with an Apache Kafka stream.
author: craigshoemaker
ms.topic: reference
ms.date: 05/28/2021
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

This repository contains Kafka binding extensions for the **Azure WebJobs SDK**. The communication with Kafka is based on library **Confluent.Kafka**.

Please find samples [here](https://github.com/Azure/azure-functions-kafka-extension/tree/master/samples)

**DISCLAIMER**: This library is supported in the Premium Plan along with support for scaling as Go-Live - supported in Production with a SLA. It is also fully supported when using Azure Functions on Kubernetes where scaling will be handed by KEDA - scaling based on Kafka queue length. It is currently not supported on the Consumption plan (there will be no scale from zero) - this is something the Azure Functions team is still working on.

## Quick Start

This library provides Quick Start for each language. General information of the samples, refer to: 

* [Samples Overview Documentation](samples/README.md)

| Language | Description | Link | DevContainer |
| -------- | ----------- | ---- | ------------ |
| C# | C# precompiled sample with Visual Studio | [Readme](samples/dotnet/README.md)| No |
| Java | Java 8 sample | [Readme](samples/java/README.md) | Yes |
| JavaScript | Node 12 sample | [Readme](samples/javascript/README.md)| Yes |
| PowerShell | PowerShell 6 Sample | [Readme](samples/powershell/README.md)| No |
| Python | Python 3.8 sample | [Readme](samples/python/README.md)| Yes |
| TypeScript | TypeScript sample (Node 12) | [Readme](samples/typescript/kafka-trigger/README.md)| Yes |

The following direction is for C#. However, other languages work with C# extension. You can refer to the configuration parameters. 

## Bindings

There are two binding types in this repo: trigger and output. To get started using the extension in a WebJob project add reference to Microsoft.Azure.WebJobs.Extensions.Kafka project and call `AddKafka()` on the startup:

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

## Next steps

- [Run a function from an Apache Kafka event stream](./functions-bindings-kafka-trigger.md)