---
title: Troubleshooting guide for Azure Service Bus | Microsoft Docs
description: Learn about troubleshooting tips and recommendations for a few issues that you see when using Azure Service Bus.
ms.topic: article
ms.date: 08/29/2022
---

# Troubleshooting guide for Azure Service Bus
This article provides troubleshooting tips and recommendations for a few issues that you see when using Azure Service Bus. 

## Connectivity issues

### Time out when connecting to service
Depending on the host environment and network, a connectivity issue might present to applications as either a `TimeoutException`, `OperationCanceledException`, or a `ServiceBusException` with `Reason` of `ServiceTimeout` and most often occurs when the client can't find a network path to the service.

To troubleshoot:

- Verify that the connection string or fully qualified domain name that you specified when creating the client is correct. For information on how to acquire a connection string, see [Get a Service Bus connection string](service-bus-quickstart-portal.md#get-the-connection-string).
- Check the firewall and port permissions in your hosting environment. Check that the AMQP ports 5671 and 5672 are open and that the endpoint is allowed through the firewall.
- Try using the Web Socket transport option, which connects using port 443. For details, see [configure the transport](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/samples/Sample13_AdvancedConfiguration.md#configuring-the-transport).
- See if your network is blocking specific IP addresses. For details, see [What IP addresses do I need to allow?](service-bus-faq.md#what-ip-addresses-do-i-need-to-add-to-allowlist-)
- If applicable, verify the proxy configuration. For details, see: [Configuring the transport](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/samples/Sample13_AdvancedConfiguration.md#configuring-the-transport)
- For more information about troubleshooting network connectivity, see: [Connectivity, certificate, or timeout issues][#connectivity-certificate-or-timeout-issues].

### Secure socket layer (SSL) handshake failures
This error can occur when an intercepting proxy is used. To verify, We recommend that you test the application in the host environment with the proxy disabled.

### Socket exhaustion errors
Applications should prefer treating the Service Bus types as singletons, creating and using a single instance through the lifetime of the application. Each new [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) created results in a new AMQP connection, which uses a socket. The [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) type manages the connection for all types created from that instance. Each [ServiceBusReceiver](/dotnet/api/azure.messaging.servicebus.servicebusreceiver), [ServiceBusSessionReceiver](/dotnet/api/azure.messaging.servicebus.servicebussessionreceiver), [ServiceBusSender](/dotnet/api/azure.messaging.servicebus.servicebussender), and [ServiceBusProcessor](/dotnet/api/azure.messaging.servicebus.servicebusprocessor) manages its own AMQP link for the associated Service Bus entity. When you use [ServiceBusSessionProcessor](/dotnet/api/azure.messaging.servicebus.servicebussessionprocessor), multiple AMQP links are established depending on the number of sessions that are being processed concurrently.

The clients are safe to cache when idle; they'll ensure efficient management of network, CPU, and memory use, minimizing their impact during periods of inactivity. It's also important that either `CloseAsync` or `DisposeAsync` be called when a client is no longer needed to ensure that network resources are properly cleaned up.

### Adding components to the connection string doesn't work
The current generation of the Service Bus client library supports connection strings only in the form published by the Azure portal. These are intended to provide basic location and shared key information only. Configuring behavior of the clients is done through its options.

Previous generations of the Service Bus clients allowed for some behavior to be configured by adding key/value components to a connection string. These components are no longer recognized and have no effect on client behavior.

#### "TransportType=AmqpWebSockets" alternative
To configure Web Sockets as the transport type, see [Configuring the transport](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/samples/Sample13_AdvancedConfiguration.md#configuring-the-transport).

#### "Authentication=Managed Identity" Alternative
To authenticate with Managed Identity, see: [Identity and Shared Access Credentials](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/servicebus/Azure.Messaging.ServiceBus#authenticating-with-azureidentity). For more information about the `Azure.Identity` library, see [Authentication and the Azure SDK](https://devblogs.microsoft.com/azure-sdk/authentication-and-the-azure-sdk).

## Logging and diagnostics
The Service Bus client library is fully instrumented for logging information at various levels of detail using the .NET `EventSource` to emit information. Logging is performed for each operation and follows the pattern of marking the starting point of the operation, its completion, and any exceptions encountered. Additional information that might offer insight is also logged in the context of the associated operation.

### Enable logging
The Service Bus client logs are available to any `EventListener` by opting into the sources starting with `Azure-Messaging-ServiceBus` or by opting into all sources that have the trait `AzureEventSource`. To make capturing logs from the Azure client libraries easier, the `Azure.Core` library used by Service Bus offers an `AzureEventSourceListener`.

For more information, see: [Logging with the Azure SDK for .NET](https://docs.microsoft.com/dotnet/azure/sdk/logging).

### Distributed tracing
The Service Bus client library supports distributed tracing thorugh integration with the Application Insights SDK. It also has **experimental** support for the OpenTelemetry specification via the .NET [ActivitySource](/dotnet/api/system.diagnostics.activitysource) type introduced in .NET 5. In order to enable `ActivitySource` support for use with OpenTelemetry, see [ActivitySource support](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/samples/Diagnostics.md#activitysource-support).

In order to use the GA DiagnosticActivity support, you can integrate with the Application Insights SDK. More details can be found in [ApplicationInsights with Azure Monitor](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/samples/Diagnostics.md#applicationinsights-with-azure-monitor).

The library creates the following spans:

`Message`  
`ServiceBusSender.Send`  
`ServiceBusSender.Schedule`  
`ServiceBusSender.Cancel`  
`ServiceBusReceiver.Receive`  
`ServiceBusReceiver.ReceiveDeferred`  
`ServiceBusReceiver.Peek`  
`ServiceBusReceiver.Abandon`  
`ServiceBusReceiver.Complete`  
`ServiceBusReceiver.DeadLetter`  
`ServiceBusReceiver.Defer`  
`ServiceBusReceiver.RenewMessageLock`  
`ServiceBusSessionReceiver.RenewSessionLock`  
`ServiceBusSessionReceiver.GetSessionState`  
`ServiceBusSessionReceiver.SetSessionState`  
`ServiceBusProcessor.ProcessMessage`  
`ServiceBusSessionProcessor.ProcessSessionMessage`  
`ServiceBusRuleManager.CreateRule`  
`ServiceBusRuleManager.DeleteRule`  
`ServiceBusRuleManager.GetRules`  

Most of the spans are self-explanatory and are started and stopped during the operation that bears its name. The span that ties the others together is `Message`. The way that the message is traced is via the `Diagnostic-Id` that is set in the [ServiceBusMessage.ApplicationProperties](/dotnet/api/azure.messaging.servicebus.servicebusmessage.applicationproperties) property by the library during send and schedule operations. In Application Insights, `Message` spans will be displayed as linking out to the various other spans that were used to interact with the message, for example, the `ServiceBusReceiver.Receive` span, the `ServiceBusSender.Send` span, and the `ServiceBusReceiver.Complete` span would all be linked from the `Message` span. Here's an example of what this looks like in Application Insights:

:::image type="content" source="./media/service-bus-troubleshooting-guide/distributed-trace-example.png" alt-text="Image showing a sample distributed trace.":::

In the above screenshot, you see the end-to-end transaction that can be viewed in Application Insights in the portal. In this scenario, the application is sending messages and using the [ServiceBusSessionProcessor](/dotnet/api/azure.messaging.servicebus.servicebussessionprocessor) to process them. The `Message` activity is linked to `ServiceBusSender.Send`, `ServiceBusReceiver.Receive`, `ServiceBusSessionProcessor.ProcessSessionMessage`, and `ServiceBusReceiver.Complete`. 

> [!NOTE]
> For more information, see [Distributed tracing and correlation through Service Bus messaging](service-bus-end-to-end-tracing.md).

## Troubleshoot sender issues

### Can't send batch with multiple partition keys

When an app sends a batch to a partition-enabled entity, all messages included in a single send operation must have the same `PartitionKey`. If your entity is session-enabled, the same requirement holds true for the `SessionId` property. In order to send messages with different `PartitionKey` or `SessionId` values, group the messages in separate [ServiceBusMessageBatch][ServiceBusMessageBatch] instances or include them in separate calls to the [SendMessagesAsync][SendMessages] overload that takes a set of [ServiceBusMessage] instances.

### Batch fails to send

We define a message batch as either [ServiceBusMessageBatch][ServiceBusMessageBatch] containing 2 or more messages, or a call to [SendMessagesAsync][SendMessages] where 2 or more messages are passed in. The service doesn't allow a message batch to exceed 1 MB. This is true whether or not the [Premium large message support][LargeMessageSupport] feature is enabled. If you intend to send a message greater than 1 MB, it must be sent individually rather than grouped with other messages. Unfortunately, the [ServiceBusMessageBatch][ServiceBusMessageBatch] type doesn't currently support validating that a batch doesn't contain any messages greater than 1 MB as the size is constrained by the service and might change. So if you intend to use the premium large message support feature, you'll need to ensure you send messages over 1 MB individually. See this [GitHub discussion][GitHubDiscussionOnBatching] for more info.

## Troubleshoot receiver issues

### Number of messages returned doesn't match number requested in batch receive

When attempting to do a batch receive, that is, passing a `maxMessages` value of 2 or greater to the [ReceiveMessagesAsync][ReceiveMessages] method, you aren't guaranteed to receive the number of messages requested, even if the queue or subscription has that many messages available at that time, and even if the entire configured `maxWaitTime` hasn't yet elapsed. To maximize throughput and avoid lock expiration, once the first message comes over the wire, the receiver will wait an additional 20 milliseconds for any additional messages before dispatching the messages for processing.  The `maxWaitTime` controls how long the receiver will wait to receive the *first* message - subsequent messages will be waited for 20 milliseconds. Therefore, your application shouldn't assume that all messages available will be received in one call.

### Message or session lock is lost before lock expiration time

The Service Bus service leverages the AMQP protocol, which is stateful. Due to the nature of the protocol, if the link that connects the client and the service is detached after a message is received, but before the message is settled, the message isn't able to be settled on reconnecting the link. Links can be detached due to a short-term transient network failure, a network outage, or due to the service enforced 10-minute idle timeout. The reconnection of the link happens automatically as a part of any operation that requires the link, that is, settling or receiving messages. Because of this, you encounter `ServiceBusException` with `Reason` of `MessageLockLost` or `SessionLockLost` even if the lock expiration time hasn't yet passed. 

### How to browse scheduled or deferred messages

Scheduled and deferred messages are included when peeking messages. They can be identified by the [ServiceBusReceivedMessage.State][MessageState] property. Once you have the [SequenceNumber][SequenceNumber] of a deferred message, you can receive it with a lock via the [ReceiveDeferredMessagesAsync][ReceiveDeferredMessages] method.

When working with topics, you can't peek scheduled messages on the subscription, as the messages remain in the topic until the scheduled enqueue time. As a workaround, you can construct a [ServiceBusReceiver][ServiceBusReceiver] passing in the topic name in order to peek such messages. Note that no other operations with the receiver will work when using a topic name.

### How to browse session messages across all sessions

You can use a regular [ServiceBusReceiver][ServiceBusReceiver] to peek across all sessions. To peek for a specific session you can use the [ServiceBusSessionReceiver][ServiceBusSessionReceiver], but you'll need to obtain a session lock.

### NotSupportedException thrown when accessing message body

This issue occurs most often in interop scenarios when receiving a message sent from a different library that uses a different AMQP message body format. If you're interacting with these types of messages, see the [AMQP message body sample][MessageBody] to learn how to access the message body. 

## Troubleshoot processor issues

### Autolock renewal isn't working

Autolock renewal relies on the system time to determine when to renew a lock for a message or session. If your system time isn't accurate, for example, your clock is slow, then lock renewal might not happen before the lock is lost. Ensure that your system time is accurate if autolock renewal isn't working.

### Processor appears to hang or have latency issues when using high concurrency

This is often caused by thread starvation, particularly when using the session processor and using a very high value for [MaxConcurrentSessions][MaxConcurrentSessions], relative to the number of cores on the machine. The first thing to check would be to make sure you aren't doing sync-over-async in any of your event handlers. Sync-over-async is an easy way to cause deadlocks and thread starvation. Even if you aren't doing sync over async, any pure sync code in your handlers could contribute to thread starvation. If you've determined that this isn't the issue, for example, because you have pure async code, you can try increasing your [TryTimeout][TryTimeout]. This will relieve pressure on the thread pool by reducing the number of context switches and timeouts that occur when using the session processor in particular. The default value for [TryTimeout][TryTimeout] is 60 seconds, but it can be set all the way up to 1 hour.  We recommend testing with the `TryTimeout` set to 5 minutes as a starting point and iterate from there. If none of these suggestions work, you simply need to scale out to multiple hosts, reducing the concurrency in your application, but running the application on multiple hosts to achieve the desired overall concurrency.

Further reading:
- [Debug thread pool Starvation][DebugThreadPoolStarvation]
- [Diagnosing .NET Core thread pool Starvation with PerfView (Why my service isn't saturating all cores or seems to stall)](https://docs.microsoft.com/archive/blogs/vancem/diagnosing-net-core-threadpool-starvation-with-perfview-why-my-service-is-not-saturating-all-cores-or-seems-to-stall)
- [Diagnosing thread pool exhaustion Issues in .NET Core Apps][DiagnoseThreadPoolExhaustion] _(video)_

### Session processor takes too long to switch sessions

This can be configured using the [SessionIdleTimeout][SessionIdleTimeout], which tells the processor how long to wait to receive a message from a session, before giving up and moving to another one. This is useful if you have many sparsely populated sessions, where each session only has a few messages. If you expect that each session will have many messages that trickle in, setting this too low can be counter productive, as it will result in unnecessary closing of the session.

### Processor stops immediately

This is often observed for demo or testing scenarios.  `StartProcessingAsync` returns immediately after the processor has started. Calling this method won't block and keep your application alive while the processor is running, so you'll need some other mechanism to do so.  For demos or testing, it's sufficient to just add a `Console.ReadKey()` call after you start the processor. For production scenarios, you'll likely want to use some sort of framework integration like [BackgroundService][BackgroundService] to provide convenient application lifecycle hooks that can be used for starting and disposing the processor.

## Troubleshoot transactions

For general information about transactions in Service Bus, see the [Overview of Service Bus transaction processing][Transactions].

### Supported operations

Not all operations are supported when using transactions. To see the list of supported transactions, see [Operations within a transaction scope][TransactionOperations].

### Timeout

A transaction times out after a [period of time][TransactionTimeout], so it's important that processing that occurs within a transaction scope adheres to this timeout.

### Operations in a transaction aren't retried

This is by design. Consider the following scenario - you're attempting to complete a message within a transaction, but there's some transient error that occurs, for example, `ServiceBusException` with a `Reason` of `ServiceCommunicationProblem`. Suppose the request does actually make it to the service. If the client were to retry, the service would see two complete requests. The first complete won't be finalized until the transaction is committed. The second complete isn't able to even be evaluated before the first complete finishes. The transaction on the client is waiting for the complete to finish. This creates a deadlock where the service is waiting for the client to complete the transaction, but the client is waiting for the service to acknowledge the second complete operation. The transaction will eventually time out after 2 minutes, but this is a bad user experience. For this reason, we don't retry operations within a transaction.

### Transactions across entities are not working

In order to perform transactions that involve multiple entities, you'll need to set the `ServiceBusClientOptions.EnableCrossEntityTransactions` property to `true`. For details, see the [Transactions across entities][CrossEntityTransactions] sample. 

## Quotas

Information about Service Bus quotas can be found [here][ServiceBusQuotas].

## Connectivity, certificate, or timeout issues
The following steps help you with troubleshooting connectivity/certificate/timeout issues for all services under *.servicebus.windows.net. 

- Browse to or [wget](https://www.gnu.org/software/wget/) `https://<yournamespace>.servicebus.windows.net/`. It helps with checking whether you have IP filtering or virtual network or certificate chain issues, which are common when using Java SDK.

    An example of successful message:
    
    ```xml
    <feed xmlns="http://www.w3.org/2005/Atom"><title type="text">Publicly Listed Services</title><subtitle type="text">This is the list of publicly-listed services currently available.</subtitle><id>uuid:27fcd1e2-3a99-44b1-8f1e-3e92b52f0171;id=30</id><updated>2019-12-27T13:11:47Z</updated><generator>Service Bus 1.1</generator></feed>
    ```
    
    An example of failure error message:

    ```xml
    <Error>
        <Code>400</Code>
        <Detail>
            Bad Request. To know more visit https://aka.ms/sbResourceMgrExceptions. . TrackingId:b786d4d1-cbaf-47a8-a3d1-be689cda2a98_G22, SystemTracker:NoSystemTracker, Timestamp:2019-12-27T13:12:40
        </Detail>
    </Error>
    ```
- Run the following command to check if any port is blocked on the firewall. Ports used are 443 (HTTPS), 5671 and 5672 (AMQP) and 9354 (Net Messaging/SBMP). Depending on the library you use, other ports are also used. Here's the sample command that check whether the 5671 port is blocked. C 

    ```powershell
    tnc <yournamespacename>.servicebus.windows.net -port 5671
    ```

    On Linux:

    ```shell
    telnet <yournamespacename>.servicebus.windows.net 5671
    ```
- When there are intermittent connectivity issues, run the following command to check if there are any dropped packets. This command tries to establish 25 different TCP connections every 1 second with the service. Then, you can check how many of them succeeded/failed and also see TCP connection latency. You can download the `psping` tool from [here](/sysinternals/downloads/psping).

    ```shell
    .\psping.exe -n 25 -i 1 -q <yournamespace>.servicebus.windows.net:5671 -nobanner     
    ```
    You can use equivalent commands if you're using other tools such as `tnc`, `ping`, and so on. 
- Obtain a network trace if the previous steps don't help and analyze it using tools such as [Wireshark](https://www.wireshark.org/). Contact [Microsoft Support](https://support.microsoft.com/) if needed. 
- To find the right IP addresses to add to allowlist for your connections, see [What IP addresses do I need to add to allowlist](service-bus-faq.yml#what-ip-addresses-do-i-need-to-add-to-allowlist-). 

[!INCLUDE [service-bus-amqp-support-retirement](../../includes/service-bus-amqp-support-retirement.md)]

## Issues that might occur with service upgrades/restarts

### Symptoms
- Requests might be momentarily throttled.
- There might be a drop in incoming messages/requests.
- The log file might contain error messages.
- The applications might be disconnected from the service for a few seconds.

### Cause
Backend service upgrades and restarts might cause these issues in your applications.

### Resolution
If the application code uses SDK, the [retry policy](/azure/architecture/best-practices/retry-service-specific#service-bus) is already built in and active. The application reconnects without significant impact to the application/workflow.

## Unauthorized access: Send claims are required

### Symptoms 
You might see this error when attempting to access a Service Bus topic from Visual Studio on an on-premises computer using a user-assigned managed identity with send permissions.

```bash
Service Bus Error: Unauthorized access. 'Send' claim\(s\) are required to perform this operation.
```

### Cause
The identity doesn't have permissions to access the Service Bus topic. 

### Resolution
To resolve this error, install the [Microsoft.Azure.Services.AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication/) library.  For more information, see [Local development authentication](/dotnet/api/overview/azure/service-to-service-authentication#local-development-authentication). 

To learn how to assign permissions to roles, see [Authenticate a managed identity with Microsoft Entra ID to access Azure Service Bus resources](service-bus-managed-service-identity.md).

## Service Bus Exception: Put token failed

### Symptoms
You receive the following error message: 

`Microsoft.Azure.ServiceBus.ServiceBusException: Put token failed. status-code: 403, status-description: The maximum number of '1000' tokens per connection has been reached.` 

[!INCLUDE [service-bus-track-0-and-1-sdk-support-retirement](../../includes/service-bus-track-0-and-1-sdk-support-retirement.md)]

### Cause
Number of authentication tokens for concurrent links in a single connection to a Service Bus namespace has exceeded the limit: 1000. 

### Resolution
Do one of the following steps:

- Reduce the number of concurrent links in a single connection or use a new connection
- Use SDKs for Azure Service Bus, which ensures that you don't get into this situation (recommended)


## Adding virtual network rule using PowerShell fails

### Symptoms
You have configured two subnets from a single virtual network in a virtual network rule. When you try to remove one subnet using the [Remove-AzServiceBusVirtualNetworkRule](/powershell/module/az.servicebus/remove-azservicebusvirtualnetworkrule) cmdlet, it doesn't remove the subnet from the virtual network rule. 

```azurepowershell-interactive
Remove-AzServiceBusVirtualNetworkRule -ResourceGroupName $resourceGroupName -Namespace $serviceBusName -SubnetId $subnetId
```

### Cause
The Azure Resource Manager ID that you specified for the subnet might be invalid. This issue might happen when the virtual network is in a different resource group from the one that has the Service Bus namespace. If you don't explicitly specify the resource group of the virtual network, the CLI command constructs the Azure Resource Manager ID by using the resource group of the Service Bus namespace. So, it fails to remove the subnet from the network rule. 

### Resolution
Specify the full Azure Resource Manager ID of the subnet that includes the name of the resource group that has the virtual network. For example:

```azurepowershell-interactive
Remove-AzServiceBusVirtualNetworkRule -ResourceGroupName myRG -Namespace myNamespace -SubnetId "/subscriptions/SubscriptionId/resourcegroups/ResourceGroup/myOtherRG/providers/Microsoft.Network/virtualNetworks/myVNet/subnets/mySubnet"
```

## Resource locks don't work when using the data plane SDK

### Symptoms
You have configured a delete lock on a Service Bus namespace, but you're able to delete resources in the namespace (queues, topics, etc.) by using the Service Bus Explorer. 

### Cause
Resource lock is preserved in Azure Resource Manager (control plane) and it doesn't prevent the data plane SDK call from deleting the resource directly from the namespace. The standalone Service Bus Explorer uses the data plane SDK, so the deletion goes through. 

### Resolution
We recommend that you use the Azure Resource Manager based API via Azure portal, PowerShell, CLI, or Resource Manager template to delete entities so that the resource lock prevents the resources from being accidentally deleted.

## Entity is no longer available

### Symptoms
You see an error that the entity is no longer available. 

### Cause
The resource might have been deleted. Follow these steps to identify why the entity was deleted. 

- Check the activity log to see if there's an Azure Resource Manager request for deletion. 
- Check the operational log to see if there was a direct API call for deletion. To learn how to collect an operational log, see [Collection and routing](monitor-service-bus.md#collection-and-routing). For the schema and an example of an operation log, see [Operation logs](monitor-service-bus-reference.md#operational-logs)
- Check the operation log to see if there was an `autodeleteonidle` related deletion. 


## Next steps
See the following articles: 

- [Azure Resource Manager exceptions](service-bus-resource-manager-exceptions.md). It list exceptions generated when interacting with Azure Service Bus using Azure Resource Manager (via templates or direct calls).
- [Messaging exceptions](service-bus-messaging-exceptions-latest.md). It provides a list of exceptions generated by .NET Framework for Azure Service Bus.
