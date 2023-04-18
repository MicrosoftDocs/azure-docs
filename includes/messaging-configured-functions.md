---
 title: include file
 description: include file
 services: service-bus-messaging, event-hubs
 author: spelluru
 ms.service: service-bus-messaging, event-hubs
 ms.topic: include
 ms.date: 12/12/2020
 ms.author: spelluru
 ms.custom: include file
---

Azure Functions allows for creating configuration-only replication tasks that lean on a pre-built entry point. The [configuration-based replication samples for Azure Functions](https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/functions/config) illustrate how to leverage [pre-built helpers](https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/src/Azure.Messaging.Replication) in your own code or avoid handling code altogether and just use configuration.

## Create a replication task
To create such a replication task, first create a new folder underneath the project folder. The name of the new folder is the name of the function, for instance `europeToAsia` or `telemetry`. The name has no direct correlation with the messaging entities being used and serves only for you to identify them. You can create dozens of functions in the same project.

Next, create a `function.json` file in the folder. The file configures the function. Start with the following content:

```json
{
    "configurationSource": "config",
    "bindings" : [
        {
            "direction": "in",
            "name": "input" 
        },
        {
            "direction": "out",
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
    "scriptFile": "../bin/Azure.Messaging.Replication.dll",
    "entryPoint": "Azure.Messaging.Replication.*"
}
```

In that file, you need to complete three configuration steps that depend on which entities you want to connect:

1. [Configure the input direction](#configure-the-input-direction)
2. [Configure the output direction](#configure-the-output-direction)
3. [Configure the entry point](#configure-the-entry-point)

### Configure the input direction

#### Event Hub input

If you want to receive events from an Event Hub, add configuration information to the top section within "bindings" that sets

* **type** - the "eventHubTrigger" type.
* **connection** - the name of the app settings value for the Event Hub connection string. 
* **eventHubName** - the name of the Event Hub within the namespace identified by the connection string.
* **consumerGroup** - the name of the consumer group. Mind that the name is enclosed in percent signs and therefore also refers to an app settings value.

```json
    ...
    "bindings" : [
        {
            "direction": "in",
            "type": "eventHubTrigger",
            "connection": "functionname-source-connection",
            "eventHubName": "eventHubA",
            "consumerGroup" : "%functionname-source-consumergroup%",
            "name": "input" 
        }
    ...
```

#### Service Bus Queue input

If you want to receive events from a Service Bus queue, add configuration information to the top section within "bindings" that sets

* **type** - the "serviceBusTrigger" type.
* **connection** - the name of the app settings value for the Service Bus connection string.
* **queueName** - the name of the Service Bus Queue within the namespace identified by the connection string.

```json
    ...
    "bindings" : [
        {
            "direction": "in",
            "type": "serviceBusTrigger",
            "connection": "functionname-source-connection",
            "queueName": "queue-a",
            "name": "input" 
        }
    ...
```

#### Service Bus Topic input

If you want to receive events from a Service Bus topic, add configuration information to the top section within "bindings" that sets

* **type** - the "serviceBusTrigger" type.
* **connection** - the name of the app settings value for the Service Bus connection string. This value must be `{FunctionName}-source-connection` if you want to use the provided scripts.
* **topicName** - the name of the Service Bus Topic within the namespace identified by the connection string.
* **subscriptionName** - the name of the Service Bus Subscription on the given topic within the namespace identified by the connection string.

```json
    ...
    "bindings" : [
        {
            "direction": "in",
            "type": "serviceBusTrigger",
            "connection": "functionname-source-connection",
            "topicName": "topic-x",
            "subscriptionName" : "sub-y",
            "name": "input" 
        }
    ...
```

### Configure the output direction

#### Event Hub output

If you want to forward events to an Event Hub, add configuration information to the bottom section within "bindings" that sets

* **type** - the "eventHub" type.
* **connection** - the name of the app settings value for the Event Hub connection string. 
* **eventHubName** - the name of the Event Hub within the namespace identified by the connection string.

```json
    ...
    "bindings" : [
        {
            ...
        },
        {
            "direction": "out",
            "type": "eventHub",
            "connection": "functionname-target-connection",
            "eventHubName": "eventHubB",
            "name": "output" 
        }
    ...
```

#### Service Bus Queue output

If you want to forward events to a Service Bus Queue, add configuration information to the bottom section within "bindings" that sets

* **type** - the "serviceBus" type.
* **connection** - the name of the app settings value for the Service Bus connection string. 
* **queueName** - the name of the Service Bus queue within the namespace identified by the connection string.

```json
    ...
    "bindings" : [
        {
            ...
        },
        {
            "direction": "out",
            "type": "serviceBus",
            "connection": "functionname-target-connection",
            "queueName": "queue-b",
            "name": "output" 
        }
    ...
```

#### Service Bus Topic output

If you want to forward events to a Service Bus Topic, add configuration information to the bottom section within "bindings" that sets

* **type** - the "serviceBus" type.
* **connection** - the name of the app settings value for the Service Bus connection string. 
* **topicName** - the name of the Service Bus topic within the namespace identified by the connection string.

```json
    ...
    "bindings" : [
        {
            ...
        },
        {
            "direction": "out",
            "type": "serviceBus",
            "connection": "functionname-target-connection",
            "topicName": "topic-b",
            "name": "output" 
        }
    ...
```

### Configure the entry point

The entry point configuration picks one of the standard replication tasks. If you are modifying the `Azure.Messaging.Replication` project, you can also add tasks and refer to them here. For instance:

```json
    ...
    "scriptFile": "../dotnet/bin/Azure.Messaging.Replication.dll",
    "entryPoint": "Azure.Messaging.Replication.EventHubReplicationTasks.ForwardToEventHub"
    ...
```

The following table gives you the correct values for combinations of sources and targets:

| Source      | Target      | Entry Point 
|-------------|-------------|------------------------------------------------------------------------
| Event Hub   | Event Hub   | `Azure.Messaging.Replication.EventHubReplicationTasks.ForwardToEventHub`
| Event Hub   | Service Bus | `Azure.Messaging.Replication.EventHubReplicationTasks.ForwardToServiceBus`
| Service Bus | Event Hub   | `Azure.Messaging.Replication.ServiceBusReplicationTasks.ForwardToEventHub`
| Service Bus | Service Bus | `Azure.Messaging.Replication.ServiceBusReplicationTasks.ForwardToServiceBus`

### Retry policy

Refer to the [Azure Functions documentation on retries](../articles/azure-functions/functions-bindings-error-pages.md) to configure the retry policy for Event Hubs. The policy settings chosen throughout the projects in this repository configure an exponential backoff strategy with retry intervals from 5 seconds to 5 minutes with infinite retries to avoid data loss.

The generally available (GA) version of retry policies for Azure Functions only supports Event Hubs and Timer triggers. The preview support for Service Bus trigger has been removed. 

### Build, deploy, and configure

While you are focusing on configuration, the tasks still require building a deployable application and to configure the Azure Functions hosts such that it has all the required information to connect to the given endpoints. 

This is illustrated, together with reusable scripts, in the [configuration-based replication samples for Azure Functions](https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/functions/config).
