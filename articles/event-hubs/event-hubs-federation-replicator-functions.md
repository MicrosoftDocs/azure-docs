---
title: Event replication tasks and applications - Azure Event Hubs | Microsoft Docs
description: This article provides an overview of building event replication tasks and applications with Azure Functions
ms.topic: article
ms.date: 09/15/2020
---

# Event replication tasks and applications

[Azure Functions](../azure-functions/functions-overview.md) is a scalable and reliable execution environment for configuring and running [event replication and federation](event-hubs-federation-overview.md) tasks.

In this overview, you will learn about Azure Functions' built-in capabilities for such applications, about  code blocks that you can adapt and modify for transformation tasks, and about how to configure an Azure Functions application such that it integrates ideally with Event Hubs and other Azure Messaging services. For many details, this article will point to the Azure Functions documentation.

## What is a replication task?

A replication task receives events from a source and forwards them to a target. Most replication tasks will forward events unchanged and at most perform mapping between metadata structures if the source and target protocols differ. 

In more advanced cases, task mights perform one or a combination of actions on events  before forwarding, for instance:

- *Transcoding* - If the event content (also referred to as "body" or "payload") arrives from the source encoded using the Apache Avro format or some proprietary serialization format, but the expectation of the system owning the target is for the content to be JSON encoded, a transcoding replication task will first deserialize the payload from Apache Avro into an in-memory object graph and then serialize that graph into the JSON format for the event that is being forwarded. Transcoding also includes content compression and decompression tasks.   
- *Transformation* - Events that contain structured data may require reshaping of that data for easier consumption by downstream consumers. This may involve work like flattening nested structures, pruning extraneous data elements, or reshaping the payload to exactly fit a given schema.
- *Batching* - Events may be received in batches (multiple events in a single transfer) from a source, but have to be forwarded singly to a target, or vice versa. A task may therefore forward multiple events based on a single input event transfer or aggregate a set of events that are then transferred together. 
- *Validation* - Event data from external sources often need to be checked for whether they are in compliance with a set of rules before they may be forwarded. The rules may be expressed using schemas or code. Events that are found not to be in compliance may be dropped, with the issue noted in logs, or may be forwarded to a special target destination to handle them further.   
- *Enrichment* - Event data coming from some sources may require enrichment with further context for it to be usable in target systems. This may involve looking up reference data and embedding that data with the event, or adding information about the source that is known to the replication task, but not contained in the events. 
- *Filtering* - Some events arriving from a source might have to be withheld from the target based on some rule. A filter tests the event against a rule and drops the event if the event does not match the rule. Filtering out duplicate events by observing certain criteria and dropping subsequent events with the same values is a form of filtering.
- *Routing and Partitioning* - Some replication tasks may allow for two or more alternative targets, and define rules for which replication target is chosen for any particular event based on the metadata or content of the event. A special form of routing is partitioning, where the task explicitly assigns partitions in one replication target based on rules.
- *Cryptography* - A replication task may have to decrypt content arriving from the source and/or encrypt content forwarded onwards to a target, and/or it may have to verify the integrity of content and metadata relative to a signature carried in the event, or attach such a signature. 
- *Attestation* - A replication task may attach metadata, potentially protected by a digital signature, to an event that attests that the event has been received through a specific channel or at a specific time.     
- *Chaining* - A replication task may apply signatures to sequences of events such that the integrity of the sequence is protected and missing events can be detected.

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

Standard replication tasks are available to move data between pairs of Event Hubs, between Service Bus and Event Hubs, between Event Grid and Event Hubs, and between Apache Kafka and Event Hubs. Details for how to configure and deploy those standard tasks are documented in dedicated articles:

* [Replicating event data between different Event Hubs](event-hubs-federation-event-hubs.md)
* [Replicating event data between Event Hubs and Service Bus](event-hubs-federation-service-bus.md)
* [Replicating event data between Event Hubs and Event Grid](event-hubs-federation-event-grid.md)
* [Replicating event data between Event Hubs and Apache Kafka](event-hubs-federation-kafka.md)

#### Custom replication tasks
For Event Hubs, boilerplate code for a custom replication task is as simple as this: 

> TODO: Other languages

``` C#
    [FunctionName("EventHubToEventHubBridge")]
    [return: EventHub("EventHubTarget", Connection = "EventHubTarget")]            
    public static async Task<EventData> Run(
        [EventHubTrigger("EventHubSource", Connection = "EventHubSource")] EventData event,
        ILogger log)
    {
        // some action here
        return event; 
    }
```

A replication task that uses batched transfers, which are preferred for fast replication between pairs of Event Hubs, looks like this: 

> TODO: Other languages

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
´´´






### Ready-to-use replication tasks 



