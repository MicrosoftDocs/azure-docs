---
title: Event replication tasks and applications - Azure Event Hubs | Microsoft Docs
description: This article provides an overview of building event replication tasks and applications with Azure Functions
ms.topic: article
ms.date: 09/15/2020
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

In Azure Functions, a replication task is implemented using a [trigger](../azure-functions/functions-triggers-bindings.md) that acquires one or more input event from a configured source and an [output binding](../azure-functions/functions-triggers-bindings#binding-direction) that forwards events copied from the source to a configured target. 

For simple replication tasks that only copy events between Event Hubs, or between an Event Hub and Service Bus, you do not have to write code. In a coming update of Azure Functions, you also won't even have to see code for such tasks. 

### Configuring a replication application

A replication application is an execution host for one or more replication tasks. 

It's an Azure Functions application that is configured to run either on the consumption plan or (recommended) on an Azure Functions Premium plan. All replication applications must run under a [system- or user-assigned managed identity](../app-service/overview-managed-identity). 

The linked Azure Resource Manager (ARM) templates create and configure a replication application with:

* an Azure Storage account for tracking the replication progress and for logs,
* a system-assigned managed identity, and 
* Azure Monitoring and Application Insights integration for monitoring.

Replication applications that must access Event Hubs bound to an Azure virtual network (VNet) must use the Azure Functions Premium plan and be configured to attach to the same VNet, which is also one of the available options.


|       | Deploy | Visualize  
|-------|------------------|--------------|---------------|
| **Azure Functions Consumption Plan** | [![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-function-premium-vnet-integration%2Fazuredeploy.json)|[![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-function-premium-vnet-integration%2Fazuredeploy.json)
| **Azure Functions Premium Plan** |[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-function-premium-vnet-integration%2Fazuredeploy.json) | [![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-function-premium-vnet-integration%2Fazuredeploy.json)
| **Azure Functions Premium Plan with VNet** | [![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-function-premium-vnet-integration%2Fazuredeploy.json)|[![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-function-premium-vnet-integration%2Fazuredeploy.json)

### Bundling and deploying replication tasks

Replication tasks are deployed into the replication application through the same deployment methods as any other Azure Function. All tasks that you want to run in parallel inside the replication application need to bundled into the same project and deployed together.



With Azure Functions Premium, multiple replication applications can share the same underlying resource pool, called an App Service Plan. That means you can easily collocate replication tasks written in .NET with replication tasks that are written in Java, for instance. That will matter if you want to take advantage of specific libraries such as Apache Camel that are only available for Java and if those are the best option for a particular integration path, even though you would commonly prefer a different language and runtime for you other replication tasks. 

The Azure Functions runtime environment provides a set of standard tasks where you only need to focus on the configuration. 

Tasks that you build yourself are called "custom tasks". Custom tasks can be built in any language supported by Azure Functions. Because Azure Functions automatically takes care of updating and maintaining standard tasks, but you need to control this for your own code, custom tasks need to be hosted in a separate replication application, which still might share the same App Service Plan.

#### Standard replication tasks

Standard replication tasks lean on pre-built components that are part of the Azure Functions runtime environment. That means they are maintained and updated by Microsoft and you don't have to worry about the code just as you don't need to worry about operating system updates or other updates in Azure Functions. 

A replication application with standard tasks is configured using a simple configuration file that defines pairs of event sources and event destinations (and related parameters) along with the kind of task you want to execute, for instance:

``` JSON  
{
    "configurationSource" : "config",
    "bindings" : [
        {
            "name": "input",
            "type": "eventHubsTrigger",
            "connection": "west-us-event-hub-namespace-config",
            "eventHubName" : "myeventhub",
            
        },
        {
            "name": "output",
            "type" : "eventHub",
            "connection" : "east-us-event-hub-namespace-config",
            "eventHubName" : "myeventhub"
        }
    ],
    "scriptFile" : "$ReplicationTasks",
    "entryPoint" : "$EventHubToEventHubCopy"
}
```

The shown configuration declares an *input* with an Event Hubs trigger that references a connection string from the application configuration for the connection information and designates the source event hub. It also declares an *output* with an Event Hubs target, using a different connection string configuration element and the target Event Hub. The replication task, referred to by "entryPoint" is the `EventHubToEventHubCopy` standard task, which copies the complete contents of the source Event Hub into the target Event Hub.

Standard replication tasks are available to move data between pairs of Event Hubs, between Service Bus and Event Hubs, between Event Grid and Event Hubs, and between Apache Kafka and Event Hubs. Further details for how to configure and deploy those standard tasks, including the one above, are documented in dedicated articles:

* [Replicating event data between different Event Hubs](event-hubs-federation-event-hubs.md)
* [Replicating event data between Event Hubs and Service Bus](event-hubs-federation-service-bus.md)
* [Replicating event data between Event Hubs and Event Grid](event-hubs-federation-event-grid.md)
* [Replicating event data between Event Hubs and Apache Kafka](event-hubs-federation-kafka.md)

#### Custom replication tasks

Custom replication tasks implement extra functionality not provided by standard tasks, often implementing one or more common [replication task pattern](event-hubs-federation-overview.md#replication-task-patterns), or integrating special routing targets.

For custom tasks, you should take advantage of Azure Functions' ability to build and deploy functions in multiple languages and host them in the same App Service Plan. Build a simple Java function to use one of hundreds of [Apache Camel](https://camel.apache.org/) connectors, use JavaScript to reshape JSON data, or use your favorite Python libraries to enrich the event payload with reference data or annotations.

For sending data between Event Hubs, the boilerplate code for a custom replication task that performs some action on the forwarded event on the hot path is quite simple. 

# [C#](#tab/csharp)

The function binds to an [EventHub trigger](../azure-functions/functions-bindings-event-hubs-trigger.md), specifying a configuration key *"EventHubSource"* for the connection string in the [EventHubTriggerAttribute](https://github.com/Azure/azure-functions-eventhubs-extension/blob/master/src/Microsoft.Azure.WebJobs.Extensions.EventHubs/EventHubTriggerAttribute.cs). The name of the source Event Hub instance can be set in the attribute or be overridden in the connection string.

The target Event Hub is bound with an [output binding](../azure-functions/functions-bindings-event-hubs-output?tabs=csharp), specifying a configuration key *"EventHubTarget"* for the connection string in the [EventHubAttribute](https://github.com/Azure/azure-functions-eventhubs-extension/blob/master/src/Microsoft.Azure.WebJobs.Extensions.EventHubs/EventHubAttribute.cs) on the return value. The name of the target Event Hub instance can be set in the attribute or be overridden in the connection string.
 
The body of the function can modify the `EventData` object or create a new one with a transformed payload.

``` C#
    [FunctionName("EventHubToEventHubBridge")]
    [return: EventHub("target", Connection = "EventHubTarget")]            
    public static async Task<EventData> Run(
        [EventHubTrigger("source", Connection = "EventHubSource")] EventData event,
        ILogger log)
    {
        // some action here
        return event; 
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

A forwarding replication task that uses batched transfers, which are preferred for fast replication between pairs of Event Hubs, looks like this: 

# [C#](#tab/csharp)

The trigger and output binding attributes are identical to the previous example, but the arguments differ. With the `EventData[]` parameter type, the function requests delivery of events in batches, and the `IAsyncCollector<EventData>` parameter is evaluated by the output binding to forward all output events likewise as a batch. 

The body of the function inside the `foreach` loop can modify the `EventData` object or create a new one with a transformed payload and forward that to the output.

``` C#
    [FunctionName("EventHubToEventHubBridge")]
    public static Task Run([EventHubTrigger("EventHubSource", Connection = "EventHubSource")] EventData[] events,
        [EventHub("EventHubTarget", Connection = "EventHubTarget")] IAsyncCollector<EventData> outputEvents, 
        ILogger log)
    {
        foreach (EventData eventData in events)
        {
            // some action here
            await outputEvents.AddAsync(eventData);
        }
    }
```

# [Java](#tab/java)

(TBD)

# [JavaScript](#tab/javascript)

(TBD)

# [Python](#tab/python)

(TBD)

## Custom replication application samples

The following repositories contain complete replication application samples that you can clone and customize to your needs. The samples don't aim to be useful as-is, but rather illustrate the concepts.

# [C#](#tab/csharp)

* [Forwarder]() - a batch-oriented forwarder as shown above.
* [Transcoder]() - shows how to transcode CBOR encoded payloads into JSON.
* [Transformer]() - shows how to change the shape of a JSON payload.

# [Java](#tab/java)

* [Forwarder]() - a batch-oriented forwarder as shown above.
* [Transcoder]() - shows how to transcode CBOR encoded payloads into JSON.
* [Transformer]() - shows how to change the shape of a JSON payload.


# [JavaScript](#tab/javascript)

* [Forwarder]() - a batch-oriented forwarder as shown above.
* [Transcoder]() - shows how to transcode CBOR encoded payloads into JSON.
* [Transformer]() - shows how to change the shape of a JSON payload.


# [Python](#tab/python)

* [Forwarder]() - a batch-oriented forwarder as shown above.
* [Transcoder]() - shows how to transcode CBOR encoded payloads into JSON.
* [Transformer]() - shows how to change the shape of a JSON payload.

---

## Next steps

* [Azure Functions Deployments](../azure-functions/functions-deployment-technologies.md)
* [Azure Functions Diagnostics](../azure-functions/functions-diagnostics.md)
* [Azure Functions Networking Options](../azure-functions/functions-networking-options.md)
* [Azure Application Insights](../azure-monitor/app/app-insights-overview.md)