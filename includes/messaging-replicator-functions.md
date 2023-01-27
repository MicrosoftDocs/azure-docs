---
title: Include file
description: Include file
services: service-bus-messaging, event-hubs
author: spelluru
ms.service: service-bus-messaging, event-hubs
ms.topic: include
ms.date: 12/12/2020
ms.author: spelluru
ms.custom: include file
---
## What is a replication task?

A replication task receives events from a source and forwards them to a target. Most replication tasks will forward events unchanged and at most perform mapping between metadata structures if the source and target protocols differ.

Replication tasks are generally stateless, meaning that they don't share state or other side-effects across sequential or parallel executions of a task. That is also true for batching and chaining, which can both be implemented on top of the existing state of a stream.

This makes replication tasks different from aggregation tasks, which are generally stateful, and are the domain of analytics frameworks and services like [Azure Stream Analytics](../articles/stream-analytics/stream-analytics-introduction.md).

## Replication applications and tasks in Azure Functions

In Azure Functions, a replication task is implemented using a [trigger](../articles/azure-functions/functions-triggers-bindings.md) that acquires input messages from a configured source and an [output binding](../articles/azure-functions/functions-triggers-bindings.md#binding-direction) that forwards messages copied from the source to a configured target.

| Trigger  | Output |
|----------|--------|
| [Azure Event Hubs trigger](../articles/azure-functions/functions-bindings-event-hubs-trigger.md?tabs=csharp) | [Azure Event Hubs output binding](../articles/azure-functions/functions-bindings-event-hubs-output.md?tabs=csharp) |
| [Azure Service Bus trigger](../articles/azure-functions/functions-bindings-service-bus-trigger.md?tabs=csharp) | [Azure Service Bus output binding](../articles/azure-functions/functions-bindings-service-bus-output.md?tabs=csharp) |
| [Azure IoT Hub trigger](../articles/azure-functions/functions-bindings-event-iot-trigger.md?tabs=csharp) | [Azure IoT Hub output binding](../articles/azure-functions/functions-bindings-event-iot-output.md?tabs=csharp) |
| [Azure Event Grid trigger](../articles/azure-functions/functions-bindings-event-grid-trigger.md?tabs=csharp) | [Azure Event Grid output binding](../articles/azure-functions/functions-bindings-event-grid-output.md?tabs=csharp) |
| [Azure Queue Storage trigger](../articles/azure-functions/functions-bindings-storage-queue-trigger.md?tabs=csharp) | [Azure Queue Storage output binding](../articles/azure-functions/functions-bindings-storage-queue-output.md?tabs=csharp) |
| [Apache Kafka trigger](https://github.com/azure/azure-functions-kafka-extension) | [Apache Kafka output binding](https://github.com/azure/azure-functions-kafka-extension) |
| [RabbitMQ trigger](https://github.com/azure/azure-functions-rabbitmq-extension) | [RabbitMQ output binding](https://github.com/azure/azure-functions-rabbitmq-extension) |
| | [Azure Notification Hubs output binding](../articles/azure-functions/functions-bindings-notification-hubs.md) |
| | [Azure SignalR service output binding](../articles/azure-functions/functions-bindings-signalr-service-output.md?tabs=csharp) |
| | [Twilio SendGrid output binding](../articles/azure-functions/functions-bindings-sendgrid.md?tabs=csharp) |

Replication tasks are deployed into the replication application through the same deployment methods as any other Azure Functions application. You can configure multiple tasks into the same application.

With Azure Functions Premium, multiple replication applications can share the same underlying resource pool, called an App Service Plan. That means you can easily collocate replication tasks written in .NET with replication tasks that are written in Java, for instance. That will matter if you want to take advantage of specific libraries such as Apache Camel that are only available for Java and if those are the best option for a particular integration path, even though you would commonly prefer a different language and runtime for your other replication tasks.

Whenever available, you should prefer the batch-oriented triggers over triggers that deliver individual events or messages and you should always obtain the complete event or message structure rather than rely on Azure Function's [parameter binding expressions](../articles/azure-functions/functions-bindings-expressions-patterns.md).

The name of the function should reflect the pair of source and target you're connecting, and you should prefix references to connection strings or other configuration elements in the application configuration files with that name.

### Data and metadata mapping

Once you've decided on a pair of input trigger and output binding, you'll have to perform some mapping between the different event or message types, unless the type of your trigger and the output is the same.

For simple replication tasks that copy messages between Event Hubs and Service Bus, you don't have to write your own code, but can lean on a [utility library that is provided](https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/src/Azure.Messaging.Replication) with the replication samples.

### Retry policy

To avoid data loss during availability event on either side of a replication function, you need to configure the retry policy to be robust. Refer to the [Azure Functions documentation on retries](../articles/azure-functions/functions-bindings-error-pages.md) to configure the retry policy.

The policy settings chosen for the example projects in the [sample repository](https://github.com/Azure-Samples/azure-messaging-replication-dotnet) configure an exponential backoff strategy with retry intervals from 5 seconds to 15 minutes with infinite retries to avoid data loss.

The generally available (GA) version of retry policies for Azure Functions only supports Event Hubs and Timer triggers. The preview support for all other trigger has been removed.

### Setting up a replication application host

A replication application is an execution host for one or more replication tasks.

It's an Azure Functions application that is configured to run either on the consumption plan or (recommended) on an Azure Functions Premium plan. All replication applications must run under a [system-assigned or user-assigned managed identity](../articles/app-service/overview-managed-identity.md).

The linked Azure Resource Manager (ARM) templates create and configure a replication application with:

* An Azure Storage account for tracking the replication progress and for logs.
* A system-assigned managed identity.
* Azure Monitor and Application Insights integration for monitoring.

Replication applications that must access Event Hubs bound to an Azure virtual network (VNet) must use the Azure Functions Premium plan and be configured to attach to the same VNet, which is also one of the available options.

| | Deploy | Visualize |
|--|--|--|
| **Azure Functions Consumption Plan** | [![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-messaging-replication-dotnet%2Fmain%2Ftemplates%2Fconsumption%2Fazuredeploy.json)|[![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-messaging-replication-dotnet%2Fmain%2Ftemplates%2Fconsumption%2Fazuredeploy.json) |
| **Azure Functions Premium Plan** |[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-messaging-replication-dotnet%2Fmain%2Ftemplates%2Fpremium%2Fazuredeploy.json) | [![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-messaging-replication-dotnet%2Fmain%2Ftemplates%2Fpremium%2Fazuredeploy.json) |
| **Azure Functions Premium Plan with VNet** | [![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-messaging-replication-dotnet%2Fmain%2Ftemplates%2Fpremium-vnet%2Fazuredeploy.json)|[![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-messaging-replication-dotnet%2Fmain%2Ftemplates%2Fpremium-vnet%2Fazuredeploy.json) |

### Examples

The [samples repository](https://github.com/Azure-Samples/azure-messaging-replication-dotnet/) contains several examples of replication tasks that copy events between Event Hubs and/or between Service Bus entities.

For copying event data between event hubs, you use an Event Hubs Trigger with an Event Hubs output binding:

```csharp
[FunctionName("telemetry")]
[ExponentialBackoffRetry(-1, "00:00:05", "00:05:00")]
public static Task Telemetry(
    [EventHubTrigger("telemetry", ConsumerGroup = "$USER_FUNCTIONS_APP_NAME.telemetry", Connection = "telemetry-source-connection")] EventData[] input,
    [EventHub("telemetry-copy", Connection = "telemetry-target-connection")] EventHubClient outputClient,
    ILogger log)
{
    return EventHubReplicationTasks.ForwardToEventHub(input, outputClient, log);
}
```

For copying messages between Service Bus entities, you use the Service Bus trigger and output binding:

```csharp
[FunctionName("jobs-transfer")]
[ExponentialBackoffRetry(-1, "00:00:05", "00:05:00")]
public static Task JobsTransfer(
    [ServiceBusTrigger("jobs-transfer", Connection = "jobs-transfer-source-connection")] Message[] input,
    [ServiceBus("jobs", Connection = "jobs-target-connection")] IAsyncCollector<Message> output,
    ILogger log)
{
    return ServiceBusReplicationTasks.ForwardToServiceBus(input, output, log);
}
```

The helper methods can make it easy to replicate between Event Hubs and Service Bus:

| Source      | Target      | Entry Point |
|-------------|-------------|------------------------------------------------------------------------
| Event Hubs   | Event Hubs   | `Azure.Messaging.Replication.EventHubReplicationTasks.ForwardToEventHub`
| Event Hubs   | Service Bus | `Azure.Messaging.Replication.EventHubReplicationTasks.ForwardToServiceBus`
| Service Bus | Event Hubs   | `Azure.Messaging.Replication.ServiceBusReplicationTasks.ForwardToEventHub`
| Service Bus | Service Bus | `Azure.Messaging.Replication.ServiceBusReplicationTasks.ForwardToServiceBus`

### Monitoring

To learn how you can monitor your replication app, please refer to the [monitoring section](../articles/azure-functions/configure-monitoring.md) of the Azure Functions documentation.

A particularly useful visual tool for monitoring replication tasks is the Application Insights [Application Map](../articles/azure-monitor/app/app-map.md), which is automatically generated from the captured monitoring information and allows exploring the reliability and performance of the replication task source and target transfers.

For immediate diagnostic insights, you can work with the [Live Metrics](../articles/azure-monitor/app/live-stream.md) portal tool, which provides low latency visualization of log details.

## Next steps

* [Azure Functions Deployments](../articles/azure-functions/functions-deployment-technologies.md)
* [Azure Functions Diagnostics](../articles/azure-functions/functions-diagnostics.md)
* [Azure Functions Networking Options](../articles/azure-functions/functions-networking-options.md)
* [Azure Application Insights](../articles/azure-monitor/app/app-insights-overview.md)
