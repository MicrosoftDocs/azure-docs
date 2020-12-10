---
title: Event replication tasks and applications - Azure Event Hubs | Microsoft Docs
description: This article provides an overview of building event replication tasks and applications with Azure Functions
ms.topic: article
ms.date: 12/01/2020
---

# Event replication tasks and applications

As explained in the [event replication and cross-region federation](event-hubs-federation-overview.md) article, replication of event streams between pairs of Event Hubs and between Event Hubs and other event stream sources and targets generally leans on Azure Functions.

[Azure Functions](../azure-functions/functions-overview.md) is a scalable and reliable execution environment for configuring and running serverless applications, including [event replication and federation](event-hubs-federation-overview.md) tasks.

In this overview, you will learn about Azure Functions' built-in capabilities for such applications, about  code blocks that you can adapt and modify for transformation tasks, and about how to configure an Azure Functions application such that it integrates ideally with Event Hubs and other Azure Messaging services. For many details, this article will point to the Azure Functions documentation.

## What is a replication task?

A replication task receives events from a source and forwards them to a target. Most replication tasks will forward events unchanged and at most perform mapping between metadata structures if the source and target protocols differ. 

Replication tasks are generally stateless, meaning that they do not share state or other side-effects across sequential or parallel executions of a task. That is also true for batching and chaining, which can both be implemented on top of the existing state of a stream. 

This makes replication tasks different from aggregation tasks, which are generally stateful, and are the domain of analytics frameworks and services like [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md).

## Replication applications and tasks in Azure Functions

In Azure Functions, a replication task is implemented using a [trigger](../azure-functions/functions-triggers-bindings.md) that acquires one or more input event from a configured source and an [output binding](../azure-functions/functions-triggers-bindings.md#binding-direction) that forwards events copied from the source to a configured target. 

For simple replication tasks that only copy events between Event Hubs, or between an Event Hub and Service Bus, you do not have to write code. In a coming update of Azure Functions, you also won't even have to see code for such tasks. 

### Configuring a replication application

A replication application is an execution host for one or more replication tasks. 

It's an Azure Functions application that is configured to run either on the consumption plan or (recommended) on an Azure Functions Premium plan. All replication applications must run under a [system- or user-assigned managed identity](../app-service/overview-managed-identity.md). 

The linked Azure Resource Manager (ARM) templates create and configure a replication application with:

* an Azure Storage account for tracking the replication progress and for logs,
* a system-assigned managed identity, and 
* Azure Monitoring and Application Insights integration for monitoring.

Replication applications that must access Event Hubs bound to an Azure virtual network (VNet) must use the Azure Functions Premium plan and be configured to attach to the same VNet, which is also one of the available options.


|       | Deploy | Visualize  
|-------|------------------|--------------|---------------|
| **Azure Functions Consumption Plan** | [![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-messaging-replication-dotnet%2Fmain%2Ftemplates%2FAconsumption%2Fazuredeploy.json)|[![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-messaging-replication-dotnet%2Fmain%2Ftemplates%2Fconsumption%2Fazuredeploy.json)
| **Azure Functions Premium Plan** |[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-messaging-replication-dotnet%2Fmain%2Ftemplates%2Fpremium%2Fazuredeploy.json) | [![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-messaging-replication-dotnet%2Fmain%2Ftemplates%2Fpremium%2Fazuredeploy.json)
| **Azure Functions Premium Plan with VNet** | [![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-messaging-replication-dotnet%2Fmain%2Ftemplates%2Fpremium-vnet%2Fazuredeploy.json)|[![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-messaging-replication-dotnet%2Fmain%2Ftemplates%2Fpremium-vnet%2Fazuredeploy.json)

### Bundling and deploying replication tasks

Replication tasks are deployed into the replication application through the same deployment methods as any other Azure Function. All tasks that you want to run in parallel inside the replication application need to bundled into the same project and deployed together.

With Azure Functions Premium, multiple replication applications can share the same underlying resource pool, called an App Service Plan. That means you can easily collocate replication tasks written in .NET with replication tasks that are written in Java, for instance. That will matter if you want to take advantage of specific libraries such as Apache Camel that are only available for Java and if those are the best option for a particular integration path, even though you would commonly prefer a different language and runtime for you other replication tasks. 

The Azure Functions runtime environment provides a set of standard tasks where you only need to focus on the configuration. 

Tasks that you build yourself are called "custom tasks". Custom tasks can be built in any language supported by Azure Functions. Because Azure Functions automatically takes care of updating and maintaining standard tasks, but you need to control this for your own code, custom tasks need to be hosted in a separate replication application, which still might share the same App Service Plan.

#### Configured replication tasks

Configured replication tasks lean on pre-built components. A replication
application with such tasks is configured using a configuration file that
defines pairs of event sources and event destinations (and related parameters)
along with the kind of pre-built task you want to execute, for instance:

``` JSON  
{
    "configurationSource": "config",
    "bindings" : [
        {
            "direction": "in",
            "type": "eventHubTrigger",
            "connection": "Input1ToOutput1-source-connection",
            "eventHubName": "input1",
            "name": "input" 
        },
        {
            "direction": "out",
            "type": "eventHub",
            "connection": "Input1ToOutput1-target-connection",
            "eventHubName": "output1",
            "name": "output"
        }
    ],
    "retry": {
        "strategy": "exponentialBackoff",
        "maxRetryCount": -1,
        "minimumInterval": "00:00:05",
        "maximumInterval": "00:05:00"
    },
    "disabled": false,
    "scriptFile": "../dotnet/bin/Azure.Messaging.Replication.dll",
    "entryPoint": "Azure.Messaging.Replication.EventHubReplicationTasks.ForwardToEventHub"
}
```

The shown configuration declares an *input* with an Event Hubs trigger that references a connection string from the application configuration for the connection information and designates the source event hub. It also declares an *output* with an Event Hubs target, using a different connection string configuration element and the target Event Hub. The replication task, referred to by "entryPoint" is the pre-built `EventHubReplicationTasks.ForwardToEventHub` standard task, which copies the complete contents of the source Event Hub into the target Event Hub.

Further details for how to configure and deploy such tasks, including the one above, are documented in dedicated articles:

* [Replicating event data between different Event Hubs](event-hubs-federation-event-hubs.md)
* [Replicating event data between Event Hubs and Service Bus](event-hubs-federation-service-bus.md)

#### Custom replication tasks

Custom replication tasks implement extra functionality not provided by configured tasks, often implementing one or more common [editor task pattern](event-hubs-federation-patterns.md#editor), or integrating special routing targets.

For sending data between Event Hubs, the boilerplate code for a custom replication task that performs some action on the forwarded event on the "hot path" is quite simple. 

# [C#](#tab/csharp)

The following function binds to an [EventHub trigger](../azure-functions/functions-bindings-event-hubs-trigger.md), specifying a configuration key *"Eh1ToEh2-source-connection"* for the connection string in the [EventHubTriggerAttribute](https://github.com/Azure/azure-functions-eventhubs-extension/blob/master/src/Microsoft.Azure.WebJobs.Extensions.EventHubs/EventHubTriggerAttribute.cs). The name of the source Event Hub instance can be set in the attribute or be overridden in the connection string.

The target Event Hub is bound with an [output binding](../azure-functions/functions-bindings-event-hubs-output.md?tabs=csharp), specifying a configuration key *"Eh1ToEh2-target-connection"* for the connection string in the [EventHubAttribute](https://github.com/Azure/azure-functions-eventhubs-extension/blob/master/src/Microsoft.Azure.WebJobs.Extensions.EventHubs/EventHubAttribute.cs) on the return value. The name of the target Event Hub instance can be set in the attribute or be overridden in the connection string.
 
The body of the function can modify the `EventData` object or create a new one with a transformed payload.

```csharp
[FunctionName("Eh1ToEh2")]
public static void Eh1ToEh2(
    [EventHubTrigger("eh1", Connection = "Eh1ToEh2-source-connection")]
    EventData[] input,
    [EventHub("eh2", Connection = "Eh1ToEh2-target-connection")
    IAsyncCollector<EventData> output,
    ILogger log)
{
    foreach (var eventData in input)
    {
        // ...your task to transform, transcode, enrich, reduce, validate, etc. ...

        await output.AddAsync(eventData);
    }
}
```

# [Java](#tab/java)

The following example shows an Event Hub trigger binding which logs the message body of the Event Hub trigger.

```java
@FunctionName("ehprocessor")
@EventHubOutput(name = "event", eventHubName = "samples-workitems", connection = "AzureEventHubConnection")
public EventData eventHubProcessor(
  @EventHubTrigger(name = "msg",
                  eventHubName = "myeventhubname",
                  connection = "myconnvarname") String message,
       final ExecutionContext context )  {
          context.getLogger().info(message);
}
```

# [JavaScript](#tab/javascript)

(TBD)

# [Python](#tab/python)

(TBD)

---


## Custom replication application samples

The following repositories contain complete replication application samples that you can clone and customize to your needs. 

# [C#](#tab/csharp)

* [Template](https://github.com/Azure/azure-messaging-replication-dotnet/functions/code/CodeBaseApp) - a batch-oriented forwarder as shown above.
* [Forwarder](https://github.com/Azure/azure-messaging-replication-dotnet/functions/code/EventHubToEventHubCopy) - a batch-oriented forwarder as shown above.

# [Java](#tab/java)

Coming soon

# [JavaScript](#tab/javascript)

Coming soon

# [Python](#tab/python)

Coming soon
---

## Next steps

* [Azure Functions Deployments](../azure-functions/functions-deployment-technologies.md)
* [Azure Functions Diagnostics](../azure-functions/functions-diagnostics.md)
* [Azure Functions Networking Options](../azure-functions/functions-networking-options.md)
* [Azure Application Insights](../azure-monitor/app/app-insights-overview.md)


## Azure Functions Replication Template Project

This is a preconfigured project for your own replication tasks. You can either
reference the standard tasks, as shown in other sample projects parallel to this
one, or you can write your own tasks.

The `AzureFunctionsBaseApp.csproj` project file already references the Azure
Event Hubs, Azure Service Bus, and Azure Storage extensions for Azure Functions
as well as the Azure Functions SDK. It also references the standard tasks from
this repository.

### Adding replication tasks

To add replication tasks, follow the guidance in the Azure Functions
documentation for
[triggers](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?tabs=csharp):

* [Azure Event Hubs
  trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-hubs-trigger?tabs=csharp)
  
* [Azure Service Bus
  trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus-trigger?tabs=csharp)
  
* [Azure IoT Hub
  trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-iot-trigger?tabs=csharp)
  
* [Azure Event Grid
  trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-grid-trigger?tabs=csharp)
* [Azure Queue Storage
  trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-queue-trigger?tabs=csharp)
  
* [Apache Kafka
  trigger](https://github.com/azure/azure-functions-kafka-extension)
* [RabbitMQ
  trigger](https://github.com/azure/azure-functions-rabbitmq-extension) 

Whenever available, you should prefer the batch-oriented triggers over triggers
that deliver individual events or messages and you should always obtain the
complete event or message structure rather than rely on Azure Function's
[parameter binding
expressions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-expressions-patterns).


The name of the function should reflect the pair of source and target you are
connecting, and you should prefix references to connection strings or other
configuration elements in the application configuration files with that name. 

As an example for the recommended usage pattern, consider this function asking
for an array (batch) of `EventData` objects from an Event Hub.

```csharp
[FunctionName("Eh1ToEh2")]
public static void Eh1ToEh2(
    [EventHubTrigger("eh1", Connection = "Eh1ToEh2-source-connection")]
    EventData[] input,
    // ... output binding ...
    ILogger log)
{
    foreach (var message in input)
    {
        // ... copy to output ...
    }
}
```

Once you've created a function based on a trigger, you can [bind the
output](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?tabs=csharp)
of the function to a target. The following list enumerates the options directly
supported by Azure Functions:

* [Azure Event hubs output
  binding](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-hubs-output?tabs=csharp)
  
* [Azure Service Bus output
  binding](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus-output?tabs=csharp)
* [Azure IoT Hub output
  binding](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-iot-output?tabs=csharp)
  
* [Azure Queue Storage output
  binding](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-queue-output?tabs=csharp)
* [Azure Notification Hubs output
  binding](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-notification-hubs)
  
* [Azure SignalR service output
  binding](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-signalr-service-output?tabs=csharp)
* [Azure Event Grid output
  binding](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-grid-output?tabs=csharp)
  
* [Twilio SendGrid output
  binding](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-sendgrid?tabs=csharp)
  
* [Apache Kafka output
  binding](https://github.com/azure/azure-functions-kafka-extension) 
* [RabbitMQ output
  binding](https://github.com/azure/azure-functions-rabbitmq-extension) 

Again, prefer the batch version of the output binding where available. 

For Event Hubs, you can bind an `IAsyncCollector<EventData>` as the output which
will cause a batch transfer. For Service Bus, you can bind
`IAsyncCollector<Message>`.

The example below completes the prior one by copying data from an Event Hub
input to an Event Hub output. You can obviously modify the event or message or
create an entirely new one, or even emit zero or multiple output events based on
one input event, while your code is in control.


```csharp
[FunctionName("Eh1ToEh2")]
public static void Eh1ToEh2(
    [EventHubTrigger("eh1", Connection = "Eh1ToEh2-source-connection")]
    EventData[] input,
    [EventHub("eh2", Connection = "Eh1ToEh2-target-connection")
    IAsyncCollector<EventData> output,
    ILogger log)
{
    foreach (var eventData in input)
    {
        // ...your task to transform, transcode, enrich, reduce, validate, etc. ...

        await output.AddAsync(eventData);
    }
}
```


### Retry policy

Refer to the [Azure Functions documentation on
retries](../azure-functions/functions-bindings-error-pages?tabs=csharp) to
configure the retry policy. The policy settings chosen throughout the projects
in this repository configure an exponential backoff strategy with retry
intervals from 5 seconds to 5 minutes with infinite retries to avoid data loss.

For Service Bus, review the ["using retry support on top of trigger
resilience"](../azure-functions/functions-bindings-error-pages?tabs=csharp#using-retry-support-on-top-of-trigger-resilience)
section to understand the interaction of triggers and the maximum delivery count
defined for the queue.

### Data and metadata mapping

Once you've decided on a pair of input trigger and output binding, you will have
to perform some mapping between the different event or message types, unless the
type of your trigger and the output is the same.

For instance, going from Event Hub to another Event Hub is trivial as the prior
example shows. If you want to map between different messaging services, you will
need to do some metadata mapping.

> The mappings shown here will become simpler and at the same time more complete
> with the coming update of the Azure Event Hubs and Azure Service Bus triggers
> based on the new Azure SDK where the underlying AMQP structures can be
> accessed directly and also copied into new messages.

#### Service Bus To Event Hubs

Going from Service Bus to Event Hubs, you should copy several of the system
properties from the Service Bus input message such that the metadata is not
lost. Event Hubs preserves this information on events passing through it, even
though the properties are not available on the strongly typed API. The SessionId
is mapped to the Event Hub PartitionKey if available, such that related events
stay together. 

```csharp
[FunctionName("QueueAtoEh1")]
public static async Task QueueAtoEh1(
    [ServiceBusTrigger("queue-a", Connection = "QueueAtoEh1-source-connection")]
    Message[] input, 
    [EventHub("eh1", Connection = "QueueAtoEh1-target-connection")]
    IAsyncCollector<EventData> output, ILogger log)
{
    foreach (var message in input)
    {
        var eventData = new EventData(message.Body)
        {
            SystemProperties =
            {
                { "content-type", message.ContentType },
                { "to", message.To },
                { "correlation-id", message.CorrelationId },
                { "subject", message.Label },
                { "reply-to", message.ReplyTo },
                { "reply-to-group-name", message.ReplyToSessionId },
                { "message-id", message.MessageId },
                { "x-opt-partition-key", message.PartitionKey ?? message.SessionId }
            }
        };

        foreach (var property in message.UserProperties)
        {
            eventData.Properties.Add(property);
        }

        await output.AddAsync(eventData);
    }
}
```

This mapping is also implemented in the
`Azure.Messaging.ReplicationServiceBusReplicationTasks.ForwardToEventHub()`
helper, which can be used instead:

```csharp
[FunctionName("Eh1ToQueueA")]
public static async Task Eh1ToQueueA(
    [EventHubTrigger("eh1", Connection = "Eh1ToQueueA-source-connection")]
    EventData[] input, 
    [ServiceBus("queueA", Connection = "Eh1ToQueueA-target-connection")]
    IAsyncCollector<Message> output,
    ILogger log)
{
   return ServiceBusReplicationTasks.ForwardToEventHub(input, output, log);
}
```

#### Event Hubs to Service Bus

When mapping from Service Bus to Event Hubs, you'll do the same metadata mapping
in the other direction. 

```csharp
[FunctionName("Eh1ToQueueA")]
public static async Task Eh1ToQueueA(
    [EventHubTrigger("eh1", Connection = "Eh1ToQueueA-source-connection")]
    EventData[] input, 
    [ServiceBus("queueA", Connection = "Eh1ToQueueA-target-connection")]
    IAsyncCollector<Message> output,
    ILogger log)
{
    foreach (EventData eventData in input)
    {
        var item = new Message(eventData.Body.ToArray())
        {
            ContentType = eventData.SystemProperties["content-type"] as string,
            To = eventData.SystemProperties["to"] as string,
            CorrelationId = eventData.SystemProperties["correlation-id"] as string,
            Label = eventData.SystemProperties["subject"] as string,
            ReplyTo = eventData.SystemProperties["reply-to"] as string,
            ReplyToSessionId = eventData.SystemProperties["reply-to-group-name"] as string,
            MessageId = eventData.SystemProperties["message-id"] as string ?? eventData.SystemProperties.Offset,
            PartitionKey = eventData.SystemProperties.PartitionKey,
            SessionId = eventData.SystemProperties.PartitionKey
        };

        foreach (var property in eventData.Properties)
        {
            item.UserProperties.Add(property);
        }

        await output.AddAsync(item);
    }
}
```

This mapping is also implemented in the
`Azure.Messaging.Replication.EventHubReplicationTasks.ForwardToServiceBus()`
helper, which can be used instead:

```csharp
[FunctionName("Eh1ToQueueA")]
public static async Task Eh1ToQueueA(
    [EventHubTrigger("eh1", Connection = "Eh1ToQueueA-source-connection")]
    EventData[] input, 
    [ServiceBus("queueA", Connection = "Eh1ToQueueA-target-connection")]
    IAsyncCollector<Message> output,
    ILogger log)
{
   return EventHubReplicationTasks.ForwardToServiceBus(input, output, log);
}
```

### Configure and Deploy

Once you've created the tasks you need, you will build the project, configure
the [existing application host](../../../templates/README.md), and deploy.

The `Configure-Function.ps1` Powershell script calls the shared
[Update-PairingConfiguration.ps1](../../../scripts/powershell/README.md)
Powershell script and needs to be run once for each task in an existing Function
app, for the configured pairing.

For instance, assume the task `Eh1ToQueueA` from above. For this task, you would
configure the Function application and the permissions on the messaging
resources like this:

```powershell
Configure-Function.ps1  -FunctionAppName "myreplicationapp"
                        -TaskName "Eh1ToQueueA"
                        -SourceNamespaceName "my1stnamespace"
                        -SourceEventHubName "eh1"
                        -TargetNamespaceName "my2ndnamespace"
                        -TargetQueueName "queue-a"
```

The script assumes that the messaging resources - here the Event Hub and the
Queue - already exist. The configuration script will add the required
configuration entries to the application configuration. 

Mind that this particular script currently only covers Event Hubs and Service
Bus.

Replication applications are regular Azure Function applications and you can
therefore use any of the [available deployment
options](https://docs.microsoft.com/en-us/azure/azure-functions/functions-deployment-technologies).
For testing, you can also run the [application
locally](https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-local),
but with the messaging services in the cloud.

Using the Azure Functions tools, the simplest way to deploy the application is 

```powershell
func azure functionapp publish "myreplicationapp" --force
```

