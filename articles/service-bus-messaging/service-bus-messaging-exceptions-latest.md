---
title: Azure Service Bus - messaging exceptions | Microsoft Docs
description: This article provides a list of Azure Service Bus messaging exceptions and suggested actions to taken when the exception occurs.
ms.topic: article
ms.date: 02/17/2023
---

# Service Bus messaging exceptions (.NET)
The Service Bus .NET client library surfaces exceptions when a service operation or a client encounters an error. When possible, standard .NET exception types are used to convey error information. For scenarios specific to Service Bus, a [ServiceBusException](/dotnet/api/azure.messaging.servicebus.servicebusexception) is thrown.

The Service Bus clients automatically retry exceptions that are considered transient, following the configured [retry options](/dotnet/api/azure.messaging.servicebus.servicebusretryoptions). When an exception is surfaced to the application, either all retries were applied unsuccessfully, or the exception was considered nontransient. More information on configuring retry options can be found in the [Customizing the retry options](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/samples/Sample13_AdvancedConfiguration.md#customizing-the-retry-options) sample.

## ServiceBusException

The exception includes some contextual information to help you understand the context of the error and its relative severity. 

- `EntityPath` : Identifies the Service Bus entity from which the exception occurred, if available.
- `IsTransient` : Indicates whether or not the exception is considered recoverable. In the case where it was deemed transient, the appropriate retry policy has already been applied and all retries were unsuccessful.
- `Message` : Provides a description of the error that occurred and relevant context.
- `StackTrace` : Represents the immediate frames of the call stack, highlighting the location in the code where the error occurred.
- `InnerException` : When an exception was the result of a service operation, it's often a `Microsoft.Azure.Amqp.AmqpException` instance describing the error, following the [OASIS Advanced Message Queuing Protocol (AMQP) 1.0 spec](https://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-types-v1.0-os.html).
- `Reason` : Provides a set of well-known reasons for the failure that help to categorize and clarify the root cause. These values are intended to allow for applying exception filtering and other logic where inspecting the text of an exception message wouldn't be ideal. Some key failure reasons are:
    - `ServiceTimeout`: Indicates that the Service Bus service didn't respond to an operation request within the expected amount of time. It might be due to a transient network issue or service problem. The Service Bus service might or might not have successfully completed the request; the status isn't known. In the context of the next available session, this exception indicates that there were no unlocked sessions available in the entity. These errors are transient errors that are automatically retried.
    - `QuotaExceeded`: Typically indicates that there are too many active receive operations for a single entity. In order to avoid this error, reduce the number of potential concurrent receives. You can use batch receives to attempt to receive multiple messages per receive request. For more information, see [Service Bus quotas](service-bus-quotas.md).
    - `MessageSizeExceeded`: Indicates that the max message size has been exceeded. The message size includes the body of the message, and any associated metadata. The best approach for resolving this error is to reduce the number of messages being sent in a batch or the size of the body included in the message. Because size limits are subject to change, see [Service Bus quotas](service-bus-quotas.md) for specifics.  
    - `MessageLockLost`: Indicates that the lock on the message is lost. Callers should attempt to receive and process the message again. This exception only applies to non-session entities. This error occurs if processing takes longer than the lock duration and the message lock isn't renewed. This error can also occur when the link is detached due to a transient network issue or when the link is idle for 10 minutes. 
    
        The Service Bus service uses the AMQP protocol, which is stateful. Due to the nature of the protocol, if the link that connects the client and the service is detached after a message is received, but before the message is settled, the message isn't able to be settled on reconnecting the link. Links can be detached due to a short-term transient network failure, a network outage, or due to the service enforced 10-minute idle timeout. The reconnection of the link happens automatically as a part of any operation that requires the link, that is, settling or receiving messages. Because of this behavior, you might encounter `ServiceBusException` with `Reason` of `MessageLockLost` or `SessionLockLost` even if the lock expiration time hasn't yet passed. 
    - `SessionLockLost`: Indicates that the lock on the session has expired. Callers should attempt to accept the session again. This exception applies only to session-enabled entities. This error occurs if processing takes longer than the lock duration and the session lock isn't renewed. This error can also occur when the link is detached due to a transient network issue or when the link is idle for 10 minutes. The Service Bus service uses the AMQP protocol, which is stateful. Due to the nature of the protocol, if the link that connects the client and the service is detached after a message is received, but before the message is settled, the message isn't able to be settled on reconnecting the link. Links can be detached due to a short-term transient network failure, a network outage, or due to the service enforced 10-minute idle timeout. The reconnection of the link happens automatically as a part of any operation that requires the link, that is, settling or receiving messages. Because of  this behavior, you might encounter `ServiceBusException` with `Reason` of `MessageLockLost` or `SessionLockLost` even if the lock expiration time hasn't yet passed. 
    - `MessageNotFound`: This error occurs when attempting to receive a deferred message by sequence number for a message that either doesn't exist in the entity, or is currently locked. 
    - `SessionCannotBeLocked`: Indicates that the requested session can't be locked because the lock is already held elsewhere. Once the lock expires, the session can be accepted.
    - `GeneralError`: Indicates that the Service Bus service encountered an error while processing the request. This error is often caused by service upgrades and restarts. These errors are transient errors that are automatically retried.
    - `ServiceCommunicationProblem`: Indicates that there was an error communicating with the service. The issue might stem from a transient network problem, or a service problem. These errors are transient errors that will be automatically retried.
    - `ServiceBusy`: Indicates that a request was throttled by the service. The details describing what can cause a request to be throttled and how to avoid being throttled can be found [here](service-bus-throttling.md). Throttled requests are retried, but the client library automatically applies a 10 second back off before attempting any more requests using the same `ServiceBusClient` (or any subtypes created from that client). It can cause issues if your entity's lock duration is less than 10 seconds, as message or session locks are likely to be lost for any unsettled messages or locked sessions. Because throttled requests are generally retried successfully, the exceptions generated would be logged as warnings rather than errors - the specific warning-level event source event is 43 (RunOperation encountered an exception and retry occurs.).
    - `MessagingEntityAlreadyExists`: Indicates that An entity with the same name exists under the same namespace.
    - `MessagingEntityDisabled`: The Messaging Entity is disabled. Enable the entity again using Portal.
    - `MessagingEntityNotFound`: Service Bus service can't find a Service Bus resource.

## Handle ServiceBusException - example
Here's an example of how to handle a `ServiceBusException` and filter by the `Reason`.

```csharp
try
{
    // Receive messages using the receiver client
}
catch (ServiceBusException ex) when
    (ex.Reason == ServiceBusFailureReason.ServiceTimeout)
{
    // Take action based on a service timeout
}
```

### Other common exceptions

- `ArgumentException`: Client throws this exception deriving from `ArgumentException` when a parameter provided when interacting with the client is invalid. Information about the specific parameter and the nature of the problem can be found in the `Message`.
- `InvalidOperationException`: Occurs when attempting to perform an operation that isn't valid for its current configuration. This exception typically occurs when a client wasn't configured to support the operation. Often, it can be mitigated by adjusting the options passed to the client.
- `NotSupportedException`: Occurs when a requested operation is valid for the client, but not supported by its current state. Information about the scenario can be found in the `Message`.
- `AggregateException`: Occurs when an operation might encounter multiple exceptions and is surfacing them as a single failure. This exception is most commonly encountered when starting or stopping the Service Bus processor or Service Bus session processor.

## Reason: QuotaExceeded 

[ServiceBusException](/dotnet/api/azure.messaging.servicebus.servicebusexception) with reason set to `QuotaExceeded` indicates that a quota for a specific entity has been exceeded. 

> [!NOTE]
> For Service Bus quotas, see [Quotas](service-bus-quotas.md).

### Queues and topics

For queues and topics, it's often the size of the queue. The error message property contains further details, as in the following example:

```output
Message: The maximum entity size has been reached or exceeded for Topic: 'xxx-xxx-xxx'. 
    Size of entity in bytes:1073742326, Max entity size in bytes:
1073741824..TrackingId:xxxxxxxxxxxxxxxxxxxxxxxxxx, TimeStamp:3/15/2013 7:50:18 AM
```

The message states that the topic exceeded its size limit, in this case 1 GB (the default size limit).

### Namespaces

For namespaces, QuotaExceeded exception can indicate that an application has exceeded the maximum number of connections to a namespace. For example:

```output
<tracking-id-guid>_G12 ---> 
System.ServiceModel.FaultException`1[System.ServiceModel.ExceptionDetail]: 
ConnectionsQuotaExceeded for namespace xxx.
```

### Common causes

There are two common causes for this error: the dead-letter queue, and nonfunctioning message receivers.

- **[Dead-letter queue](service-bus-dead-letter-queues.md)**
    A reader is failing to complete messages and the messages are returned to the queue/topic when the lock expires. It can happen if the reader encounters an exception that prevents it from completing the message. After a message has been read 10 times, it moves to the dead-letter queue by default. This behavior is controlled by the [MaxDeliveryCount](/dotnet/api/azure.messaging.servicebus.administration.queueproperties.maxdeliverycount) property and has a default value of 10. As messages pile up in the dead letter queue, they take up space.

    To resolve the issue, read and complete the messages from the dead-letter queue, as you would from any other queue. 
- **Receiver stopped**. A receiver has stopped receiving messages from a queue or subscription. The way to identify the issue is to look at the [active message count](/dotnet/api/azure.messaging.servicebus.administration.queueruntimeproperties.activemessagecount). If the active message count is high or growing, then the messages aren't being read as fast as they're being written.


## Reason: MessageLockLost


### Cause

[ServiceBusException](/dotnet/api/azure.messaging.servicebus.servicebusexception) with reason set to `MessageLockLost` indicates that a message is received using the [PeekLock](message-transfers-locks-settlement.md#peeklock) Receive mode and the lock held by the client expires on the service side.

The lock on a message might expire due to various reasons:

  * The lock timer has expired before it was renewed by the client application.
  * The client application acquired the lock, saved it to a persistent store and then restarted. Once it restarted, the client application looked at the inflight messages and tried to complete the messages.

You might also receive this exception in the following scenarios:

* Service Update
* OS update
* Changing properties on the entity (queue, topic, subscription) while holding the lock.

### Resolution

When a client application receives **MessageLockLostException**, it can no longer process the message. The client application might optionally consider logging the exception for analysis, but the client *must* dispose off the message.

Since the lock on the message has expired, it would go back on the Queue (or Subscription) and can be processed by the next client application that calls receive.

If the **MaxDeliveryCount** has exceeded, then the message might be moved to the **DeadLetterQueue**.

## Reason: SessionLockLost

### Cause

[ServiceBusException](/dotnet/api/azure.messaging.servicebus.servicebusexception) with reason set to `MessageLockLost` is thrown when a session is accepted and the lock held by the client expires on the service side.

The lock on a session might expire due to various reasons:

  * The lock timer has expired before it was renewed by the client application.
  * The client application acquired the lock, saved it to a persistent store and then restarted. Once it restarted, the client application looked at the inflight sessions and tried to process the messages in those sessions.

You might also receive this exception in the following scenarios:

* Service Update
* OS update
* Changing properties on the entity (queue, topic, subscription) while holding the lock.

### Resolution

When a client application receives **SessionLockLostException**, it can no longer process the messages on the session. The client application might consider logging the exception for analysis, but the client *must* dispose off the message.

Since the lock on the session has expired, it would go back on the Queue (or Subscription) and can be locked by the next client application that accepts the session. Since the session lock is held by a single client application at any given time, the in-order processing is guaranteed.

## TimeoutException

A [TimeoutException](/dotnet/api/system.timeoutexception) indicates that a user-initiated operation is taking longer than the operation timeout.

You should check the value of the [ServicePointManager.DefaultConnectionLimit](/dotnet/api/system.net.servicepointmanager.defaultconnectionlimit) property, as hitting this limit can also cause a [TimeoutException](/dotnet/api/system.timeoutexception).

Timeouts are expected to happen during or in-between maintenance operations such as Service Bus service updates (or) OS updates on resources that run the service. During OS updates, entities are moved around and nodes are updated or rebooted, which can cause timeouts. For service level agreement (SLA) details for the Azure Service Bus service, see [SLA for Service Bus](https://azure.microsoft.com/support/legal/sla/service-bus/).


## SocketException

### Cause

A **SocketException** is thrown in the following cases:

   * When a connection attempt fails because the host didn't properly respond after a specified time (TCP error code 10060).
   * An established connection failed because connected host has failed to respond.
   * There was an error processing the message or the timeout is exceeded by the remote host.
   * Underlying network resource issue.

### Resolution

The **SocketException** errors indicate that the VM hosting the applications is unable to convert the name `<mynamespace>.servicebus.windows.net` to the corresponding IP address.

Check to see if the following command succeeds in mapping to an IP address.

```powershell
PS C:\> nslookup <mynamespace>.servicebus.windows.net
```

Which should provide an output like:

```bash
Name:    <cloudappinstance>.cloudapp.net
Address:  XX.XX.XXX.240
Aliases:  <mynamespace>.servicebus.windows.net
```

If the above name **does not resolve** to an IP and the namespace alias, check with the network administrator to investigate further. Name resolution is done through a DNS server typically a resource in the customer network. If the DNS resolution is done by Azure DNS, contact Azure support.

If name resolution **works as expected**, check if connections to Azure Service Bus is allowed [here](service-bus-troubleshooting-guide.md#connectivity-certificate-or-timeout-issues).


## Next steps

For the complete Service Bus .NET API reference, see the [Azure .NET API reference](/dotnet/api/overview/azure/service-bus).
For troubleshooting tips, see the [Troubleshooting guide](service-bus-troubleshooting-guide.md).
