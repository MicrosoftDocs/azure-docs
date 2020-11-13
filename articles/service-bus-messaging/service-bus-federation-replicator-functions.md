---
title: Message replication tasks and applications - Azure Service Bus | Microsoft Docs
description: This article provides an overview of building message replication tasks and applications with Azure Functions
ms.topic: article
ms.date: 09/15/2020
---

# Message replication tasks and applications

As explained in the [message replication and cross-region federation](service-bus-federation-overview.md) article, replication of message sequences between pairs of Service Bus entities and between Service Bus and other message sources and targets generally leans on Azure Functions.

[Azure Functions](../azure-functions/functions-overview.md) is a scalable and reliable execution environment for configuring and running serverless applications, including [message replication and federation](service-bus-federation-overview.md) tasks.

In this overview, you will learn about Azure Functions' built-in capabilities for such applications, about  code blocks that you can adapt and modify for transformation tasks, and about how to configure an Azure Functions application such that it integrates ideally with Service Bus and other Azure Messaging services. For many details, this article will point to the Azure Functions documentation.

## What is a replication task?

A replication task receives messages from a source and forwards them to a target. Most replication tasks will forward messages unchanged and at most perform mapping between metadata structures if the source and target protocols differ. 

Replication tasks are generally stateless, meaning that they do not share state or other side-effects across sequential or parallel executions of a task. That is also true for batching and chaining, which can both be implemented on top of the existing state of a stream. 

This makes replication tasks different from aggregation tasks, which are generally stateful, and are the domain of analytics frameworks and services like [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md).

## Replication applications and tasks in Azure Functions

In Azure Functions, a replication task is implemented using a [trigger](../azure-functions/functions-triggers-bindings.md) that acquires one or more input message from a configured source and an [output binding](../azure-functions/functions-triggers-bindings.md#binding-direction) that forwards messages copied from the source to a configured target. 

For simple replication tasks that only copy messages between Service Bus, or between an Event Hub and Service Bus, you do not have to write code. In a coming update of Azure Functions, you also won't even have to see code for such tasks. 

### Configuring a replication application

A replication application is an execution host for one or more replication tasks. 

It's an Azure Functions application that is configured to run either on the consumption plan or (recommended) on an Azure Functions Premium plan. All replication applications must run under a [system- or user-assigned managed identity](../app-service/overview-managed-identity.md). 

The linked Azure Resource Manager (ARM) templates create and configure a replication application with:

* an Azure Storage account for tracking the replication progress and for logs,
* a system-assigned managed identity, and 
* Azure Monitoring and Application Insights integration for monitoring.

Replication applications that must access Service Bus bound to an Azure virtual network (VNet) must use the Azure Functions Premium plan and be configured to attach to the same VNet, which is also one of the available options.


|       | Deploy | Visualize  
|-------|------------------|--------------|---------------|
| **Azure Functions Consumption Plan** | [![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-function-premium-vnet-integration%2Fazuredeploy.json)|[![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-function-premium-vnet-integration%2Fazuredeploy.json)
| **Azure Functions Premium Plan** |[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-function-premium-vnet-integration%2Fazuredeploy.json) | [![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-function-premium-vnet-integration%2Fazuredeploy.json)
| **Azure Functions Premium Plan with VNet** | [![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-function-premium-vnet-integration%2Fazuredeploy.json)|[![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-function-premium-vnet-integration%2Fazuredeploy.json)

### Replication tasks

Replication tasks are deployed as into the replication application through the same deployment methods as any other Azure Functions application. You can configure multiple tasks into the same application. 

With Azure Functions Premium, multiple replication applications can share the same underlying resource pool, called an App Service Plan. That means you can easily collocate replication tasks written in .NET with replication tasks that are written in Java, for instance. That will matter if you want to take advantage of specific libraries such as Apache Camel that are only available for Java and if those are the best option for a particular integration path, even though you would commonly prefer a different language and runtime for you other replication tasks. 

Tasks that you build yourself are called "custom tasks". Custom tasks can be built in any language supported by Azure Functions. Because Azure Functions automatically takes care of updating and maintaining standard tasks, but you need to control this for your own code, custom tasks need to be hosted in a separate replication application, which still might share the same App Service Plan.

#### Custom replication tasks

Custom replication tasks implement extra functionality not provided by standard tasks.

For custom tasks, you should take advantage of Azure Functions' ability to build and deploy functions in multiple languages and host them in the same App Service Plan. Build a simple Java function to use one of hundreds of [Apache Camel](https://camel.apache.org/) connectors, use JavaScript to reshape JSON data, or use your favorite Python libraries to enrich the message payload with reference data or annotations.

For sending data between Service Bus entities, the boilerplate code for a custom replication task that performs some action on the forwarded message on the hot path is quite simple. 

# [C#](#tab/csharp)

The function binds to an [Service Bus trigger](../azure-functions/functions-bindings-service-bus-trigger.md), specifying a configuration key *"ServiceBusSource"* for the connection string in the [ServiceBusTriggerAttribute](https://github.com/Azure/azure-functions-messagehubs-extension/blob/master/src/Microsoft.Azure.WebJobs.Extensions.ServiceBus/ServiceBusTriggerAttribute.cs). The name of the source Service Bus instance can be set in the attribute or be overridden in the connection string.

The target Service Bus is bound with an [output binding](../azure-functions/functions-bindings-service-bus-output.md?tabs=csharp), specifying a configuration key *"ServiceBusTarget"* for the connection string in the [ServiceBusAttribute](https://github.com/Azure/azure-functions-messagehubs-extension/blob/master/src/Microsoft.Azure.WebJobs.Extensions.ServiceBus/ServiceBusAttribute.cs) on the return value. The name of the target Service Bus instance can be set in the attribute or be overridden in the connection string.
 
The body of the function can modify the `Message` object or create a new one with a transformed payload.

``` C#
    [FunctionName("ServiceBusToServiceBusBridge")]
    [return: ServiceBus("target", Connection = "ServiceBusTarget")]            
    public static async Task<Message> Run(
        [ServiceBusTrigger("source", Connection = "ServiceBusSource")] Message message,
        ILogger log)
    {
        // some action here
        return message; 
    }
```

# [Java](#tab/java)

The following example shows an Service Bus trigger binding which logs the message body of the Service Bus trigger.

```java
@FunctionName("ehprocessor")
@ServiceBusOutput(name = "message", messageHubName = "samples-workitems", connection = "AzureServiceBusConnection")
public Message messageHubProcessor(
  @ServiceBusTrigger(name = "msg",
                  messageHubName = "mymessagehubname",
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

A forwarding replication task that uses batched transfers, which are preferred for fast replication between pairs of Service Bus, looks like this: 

# [C#](#tab/csharp)

The trigger and output binding attributes are identical to the previous example, but the arguments differ. With the `Message[]` parameter type, the function requests delivery of messages in batches, and the `IAsyncCollector<Message>` parameter is evaluated by the output binding to forward all output messages likewise as a batch. 

The body of the function inside the `foreach` loop can modify the `Message` object or create a new one with a transformed payload and forward that to the output.

``` C#
    [FunctionName("ServiceBusToServiceBusBridge")]
    public static Task Run([ServiceBusTrigger("ServiceBusSource", Connection = "ServiceBusSource")] Message[] messages,
        [ServiceBus("ServiceBusTarget", Connection = "ServiceBusTarget")] IAsyncCollector<Message> outputMessages, 
        ILogger log)
    {
        foreach (Message messageData in messages)
        {
            // some action here
            await outputMessages.AddAsync(messageData);
        }
    }
```

# [Java](#tab/java)

(TBD)

# [JavaScript](#tab/javascript)

(TBD)

# [Python](#tab/python)

(TBD)

---

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