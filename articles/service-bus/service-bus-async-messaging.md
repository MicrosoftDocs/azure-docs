<properties 
    pageTitle="Service Bus asynchronous messaging | Microsoft Azure"
    description="Description of Service Bus asynchronous brokered messaging."
    services="service-bus"
    documentationCenter="na"
    authors="sethmanheim"
    manager="timlt"
    editor="" /> 
<tags 
    ms.service="service-bus"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="na"
    ms.date="06/27/2016"
    ms.author="sethm" />

# Asynchronous messaging patterns and high availability

Asynchronous messaging can be implemented in a variety of different ways. With queues, topics and subscriptions, collectively called messaging entities, Azure Service Bus supports asynchrony via a store and forward mechanism. In normal (synchronous) operation, you send messages to queues and topics, and receive messages from queues and subscriptions. Applications you write depend on these entities always being available. When the entity health changes, due to a variety of circumstances, you need a way to provide a reduced capability entity that can satisfy most needs.

Applications typically use asynchronous messaging patterns to enable a number of communication scenarios. You can build applications in which clients can send messages to services, even when the service is not running. For applications that experience bursts of communications, a queue can help level the load by providing a place to buffer communications. Finally, you can get a simple but effective load balancer to distribute messages across multiple machines.

In order to maintain availability of any of these entities, consider a number of different ways in which these entities can appear unavailable for a durable messaging system. Generally speaking, we see the entity become unavailable to applications we write in the following different ways:

1.  Unable to send messages.

2.  Unable to receive messages.

3.  Unable to manage entities (create, retrieve, update, or delete entities).

4.  Unable to contact the service.

For each of these failures, different failure modes exist that enable an application to continue to perform work at some level of reduced capability. For example, a system that can send messages but not receive them can still receive orders from customers but cannot process those orders. This topic discusses potential issues that can occur, and how those issues are mitigated. Service Bus has introduced a number of mitigations which you must opt into, and this topic also discusses the rules governing the use of those opt-in mitigations.

## Reliability in Service Bus

There are several ways to handle message and entity issues, and there are guidelines governing the appropriate use of those mitigations. To understand the guidelines, you must first understand what can fail in Service Bus. Due to the design of Azure systems, all of these issues tend to be short-lived. At a high level, the different causes of unavailability appear as follows:

-   Throttling from an external system on which Service Bus depends. Throttling occurs from interactions with storage and compute resources.

-   Issue for a system on which Service Bus depends. For example, a given part of storage can encounter issues.

-   Failure of Service Bus on single subsystem. In this situation, a compute node can get into an inconsistent state and must restart itself, causing all entities it serves to load balance to other nodes. This in turn can cause a short period of slow message processing.

-   Failure of Service Bus within an Azure datacenter. This is a "catastrophic failure" during which the system is unreachable for many minutes or a few hours.

> [AZURE.NOTE] The term **storage** can mean both Azure Storage and SQL Azure.

Service Bus contains a number of mitigations for these issues. The following sections discuss each issue and their respective mitigations.

### Throttling

With Service Bus, throttling enables cooperative message rate management. Each individual Service Bus node houses many entities. Each of those entities makes demands on the system in terms of CPU, memory, storage, and other facets. When any of these facets detects usage that exceeds defined thresholds, Service Bus can deny a given request. The caller receives a [ServerBusyException][] and retries after 10 seconds.

As a mitigation, the code must read the error and halt any retries of the message for at least 10 seconds. Since the error can happen across pieces of the customer application, it is expected that each piece independently executes the retry logic. The code can reduce the probability of being throttled by enabling partitioning on a queue or topic.

### Issue for an Azure dependency

Other components within Azure can occasionally have service issues. For example, when a system that Service Bus uses is being upgraded, that system can temporarily experience reduced capabilities. To work around these types of issues, Service Bus regularly investigates and implements mitigations. Side effects of these mitigations do appear. For example, to handle transient issues with storage, Service Bus implements a system that allows message send operations to work consistently. Due to the nature of the mitigation, a sent message can take up to 15 minutes to appear in the affected queue or subscription and be ready for a receive operation. Generally speaking, most entities will not experience this issue. However, given the number of entities in Service Bus within Azure, this mitigation is sometimes needed for a small subset of Service Bus customers.

### Service Bus failure on a single subsystem

With any application, circumstances can cause an internal component of Service Bus to become inconsistent. When Service Bus detects this, it collects data from the application to aid in diagnosing what happened. Once the data is collected, the application is restarted in an attempt to return it to a consistent state. This process happens fairly quickly, and results in an entity appearing to be unavailable for up to a few minutes, though typical down times are much shorter.

In these cases, the client application generates a [System.TimeoutException][] or [MessagingException][] exception. Service Bus contains a mitigation for this issue in the form of automated client retry logic. Once the retry period is exhausted and the message is not delivered, you can explore using other features such as [paired namespaces][]. Paired namespaces have other caveats that are discussed in that article.

### Failure of Service Bus within an Azure datacenter

The most probable reason for a failure in an Azure datacenter is a failed upgrade deployment of Service Bus or a dependent system. As the platform has matured, the likelihood of this type of failure has diminished. A datacenter failure can also happen for reasons that include the following:

-   Electrical outage (power supply and generating power disappear).
-   Connectivity (internet break between your clients and Azure).

In both cases, a natural or man-made disaster caused the issue. To work around this and make sure that you can still send messages, you can use [paired namespaces][] to enable messages to be sent to a second location while the primary location is made healthy again. For more information, see [Best practices for insulating applications against Service Bus outages and disasters][].

## Paired namespaces

The [paired namespaces][] feature supports scenarios in which a Service Bus entity or deployment within a data center becomes unavailable. While this event occurs infrequently, distributed systems still must be prepared to handle worst case scenarios. Typically, this event happens because some element on which Service Bus depends is experiencing a short-term issue. To maintain application availability during an outage, Service Bus users can use two separate namespaces, preferably in separate data centers, to host their messaging entities. The remainder of this section uses the following terminology:

-   Primary namespace: The namespace your application interacts with for send and receive operations.

-   Secondary namespace: The namespace that acts as a backup to the primary namespace. Application logic does not interact with this namespace.

-   Failover interval: The amount of time to accept normal failures before the application switches from the primary namespace to the secondary namespace.

Paired namespaces support *send availability*. Send availability preserves the ability to send messages. To use send availability, your application must meet the following requirements:

1.  Messages are only received from the primary namespace.

2.  Messages sent to a given queue or topic might arrive out of order.

3.  If your application uses sessions, messages within a session might arrive out of order. This is a break from normal functionality of sessions. This means that your application uses sessions to logically group messages. Session state is only maintained on the primary namespace.

4.  Messages within a session might arrive out of order. This is a break from normal functionality of sessions. This means that your application uses sessions to logically group messages.

5.  Session state is only maintained on the primary namespace.

6.  The primary queue can come online and start accepting messages before the secondary queue delivers all messages into the primary queue.

The following sections discuss the APIs, how the APIs are implemented, and shows sample code that uses the feature. Note that there are billing implications associated with this feature.

### The MessagingFactory.PairNamespaceAsync API

The paired namespaces feature includes the [PairNamespaceAsync][] method on the [Microsoft.ServiceBus.Messaging.MessagingFactory][] class:

```
public Task PairNamespaceAsync(PairedNamespaceOptions options);
```

When the task completes, the namespace pairing is also complete and ready to act upon for any [MessageReceiver][], [QueueClient][], or [TopicClient][] created with the [MessagingFactory][] instance. [Microsoft.ServiceBus.Messaging.PairedNamespaceOptions][] is the base class for the different types of pairing that are available with a [MessagingFactory][] object. Currently, the only derived class is one named [SendAvailabilityPairedNamespaceOptions][], which implements the send availability requirements. [SendAvailabilityPairedNamespaceOptions][] has a set of constructors that build on each other. Looking at the constructor with the most parameters, you can understand the behavior of the other constructors.

```
public SendAvailabilityPairedNamespaceOptions(
    NamespaceManager secondaryNamespaceManager,
    MessagingFactory messagingFactory,
    int backlogQueueCount,
    TimeSpan failoverInterval,
    bool enableSyphon)
```

These parameters have the following meanings:

-   *secondaryNamespaceManager*: An initialized [NamespaceManager][] instance for the secondary namespace that the [PairNamespaceAsync][] method can use to set up the secondary namespace. The namespace manager is used to obtain the list of queues in the namespace and to make sure that the required backlog queues exist. If those queues do not exist, they are created. [NamespaceManager][] requires the ability to create a token with the **Manage** claim.

-   *messagingFactory*: The [MessagingFactory][] instance for the secondary namespace. The [MessagingFactory][] object is used to send and, if the [EnableSyphon][] property is set to **true**, receive messages from the backlog queues.

-   *backlogQueueCount*: The number of backlog queues to create. This value must be at least 1. When sending messages to the backlog, one of these queues is randomly chosen. If you set the value to 1, then only one queue can ever be used. When this happens and the one backlog queue generates errors, the client is not be able to try a different backlog queue and may fail to send your message. We recommend setting this value to some larger value and default the value to 10. You can change this to a higher or lower value depending on how much data your application sends per day. Each backlog queue can hold up to 5 GB of messages.

-   *failoverInterval*: The amount of time during which you will accept failures on the primary namespace before switching any single entity over to the secondary namespace. Failovers occur on an entity-by-entity basis. Entities in a single namespace frequently live in different nodes within Service Bus. A failure in one entity does not imply a failure in another. You can set this value to [System.TimeSpan.Zero][] to failover to the secondary immediately after your first, non-transient failure. Failures that trigger the failover timer are any [MessagingException][] in which the [IsTransient][] property is false, or a [System.TimeoutException][]. Other exceptions, such as [UnauthorizedAccessException][] do not cause failover, because they indicate that the client is configured incorrectly. A [ServerBusyException][] does not cause failover because the correct pattern is to wait 10 seconds, then send the message again.

-   *enableSyphon*: Indicates that this particular pairing should also syphon messages from the secondary namespace back to the primary namespace. In general, applications that send messages should set this value to **false**; applications that receive messages should set this value to **true**. The reason for this is that frequently, there are fewer message receivers than message senders. Depending on the number of receivers, you can choose to have a single application instance handle the syphon duties. Using many receivers has billing implications for each backlog queue.

To use the code, create a primary [MessagingFactory][] instance, a secondary [MessagingFactory][] instance, a secondary [NamespaceManager][] instance, and a [SendAvailabilityPairedNamespaceOptions][] instance. The call can be as simple as the following:

```
SendAvailabilityPairedNamespaceOptions sendAvailabilityOptions = new SendAvailabilityPairedNamespaceOptions(secondaryNamespaceManager, secondary);
primary.PairNamespaceAsync(sendAvailabilityOptions).Wait();
```

When the task returned by the [PairNamespaceAsync][] method completes, everything is set up and ready to use. Before the task is returned, you may not have completed all of the background work necessary for the pairing to work right. As a result, you should not start sending messages until the task returns. If any failures occurred, such as bad credentials, or failure to create the backlog queues, those exceptions will be thrown once the task completes. Once the task returns, verify that the queues were found or created by examining the [BacklogQueueCount][] property on your [SendAvailabilityPairedNamespaceOptions][] instance. For the preceding code, that operation appears as follows:

```
if (sendAvailabilityOptions.BacklogQueueCount < 1)
{
    // Handle case where no queues were created.
}
```

## Next steps

Now that you've learned the basics of asynchronous messaging in Service Bus, read more details about [paired namespaces][].

  [ServerBusyException]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.serverbusyexception.aspx
  [System.TimeoutException]: https://msdn.microsoft.com/library/system.timeoutexception.aspx
  [MessagingException]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.messagingexception.aspx
  [Best practices for insulating applications against Service Bus outages and disasters]: service-bus-outages-disasters.md
  [Microsoft.ServiceBus.Messaging.MessagingFactory]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.messagingfactory.aspx
  [MessageReceiver]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.messagereceiver.aspx
  [QueueClient]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.queueclient.aspx
  [TopicClient]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.topicclient.aspx
  [Microsoft.ServiceBus.Messaging.PairedNamespaceOptions]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.pairednamespaceoptions.aspx
  [MessagingFactory]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.messagingfactory.aspx
  [SendAvailabilityPairedNamespaceOptions]:https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sendavailabilitypairednamespaceoptions.aspx
  [NamespaceManager]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.namespacemanager.aspx
  [PairNamespaceAsync]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.messagingfactory.pairnamespaceasync.aspx
  [EnableSyphon]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sendavailabilitypairednamespaceoptions.enablesyphon.aspx
  [System.TimeSpan.Zero]: https://msdn.microsoft.com/library/azure/system.timespan.zero.aspx
  [IsTransient]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.messagingexception.istransient.aspx
  [UnauthorizedAccessException]: https://msdn.microsoft.com/library/azure/system.unauthorizedaccessexception.aspx
  [BacklogQueueCount]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sendavailabilitypairednamespaceoptions.backlogqueuecount.aspx
  [paired namespaces]: service-bus-paired-namespaces.md