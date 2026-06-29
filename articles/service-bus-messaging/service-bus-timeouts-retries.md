---
title: Handle timeouts and configure retries in Azure Service Bus
description: Learn why send and receive operations time out in Azure Service Bus, how to configure retry options, and how to avoid common client-side patterns that cause timeouts.
ms.topic: how-to
ms.date: 06/26/2026
ms.devlang: csharp
ms.custom:
  - devx-track-dotnet
---

# Handle timeouts and configure retries in Azure Service Bus

Send and receive operations can time out when a request doesn't complete within the configured time. Most timeouts are recoverable, and the client libraries retry them automatically. When a timeout reaches your application code, either every retry was exhausted or the operation took longer than the configured try timeout.

This article explains what a timeout means, how to configure the retry options that govern this behavior, and how to avoid the client-side patterns that cause avoidable timeouts. It complements the [Troubleshooting guide](service-bus-troubleshooting-guide.md) and the [Service Bus exceptions](service-bus-messaging-exceptions-latest.md) reference.

## What a timeout means

Depending on the operation and host environment, a timeout surfaces as a `TimeoutException`, an `OperationCanceledException`, or a [ServiceBusException](/dotnet/api/azure.messaging.servicebus.servicebusexception) with a `Reason` of `ServiceTimeout`.

A `ServiceTimeout` indicates that the service didn't respond to the request within the expected amount of time. The cause can be on either side of the connection:

- **Client side** - the application can't reach the service in time (network path, DNS, proxy, firewall), the client is overloaded (thread-pool starvation, high CPU), or the configured try timeout is too short for the operation.
- **Service side** - a transient service condition or a broader incident. When the service is at fault, the failure is typically correlated across many operations and is visible in the namespace **Resource health** page in the Azure portal.

Use the `IsTransient` property on `ServiceBusException` to distinguish recoverable failures. When `IsTransient` is `true`, the client already applied the retry policy and every attempt failed. A persistent transient timeout usually points to a connectivity problem or an undersized retry configuration.

## Configure retry options

The client libraries retry transient failures, including timeouts, according to the retry options you configure on the client. In the .NET library, set [ServiceBusRetryOptions](/dotnet/api/azure.messaging.servicebus.servicebusretryoptions) through [ServiceBusClientOptions](/dotnet/api/azure.messaging.servicebus.servicebusclientoptions).

```csharp
var options = new ServiceBusClientOptions
{
    RetryOptions = new ServiceBusRetryOptions
    {
        Mode = ServiceBusRetryMode.Exponential,
        MaxRetries = 3,
        Delay = TimeSpan.FromSeconds(0.8),
        MaxDelay = TimeSpan.FromSeconds(60),
        TryTimeout = TimeSpan.FromSeconds(60)
    }
};

var client = new ServiceBusClient(fullyQualifiedNamespace, credential, options);
```

| Option | What it controls | Default |
|--------|------------------|---------|
| `Mode` | Whether back-off is `Fixed` or `Exponential` | `Exponential` |
| `MaxRetries` | Maximum number of retry attempts for a transient failure | 3 |
| `Delay` | Base delay between attempts | 0.8 seconds |
| `MaxDelay` | Upper bound on the back-off delay | 60 seconds |
| `TryTimeout` | Maximum duration for a single attempt before it times out | 60 seconds |

Check the current defaults against the [ServiceBusRetryOptions reference](/dotnet/api/azure.messaging.servicebus.servicebusretryoptions), because they can change between library versions. Equivalent retry options exist in the [Java](/java/api/com.azure.messaging.servicebus.servicebusclientbuilder), [JavaScript](/javascript/api/@azure/service-bus/), [Python](/python/api/azure-servicebus/azure.servicebus), and [Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus) client libraries.

### Tune the values for your workload

- **Increase `TryTimeout`** when operations legitimately take longer than 60 seconds - for example, receiving from a low-traffic queue with a long `maxWaitTime`, or operating over a high-latency network. A larger try timeout reduces premature timeouts but also lengthens the time before a genuinely unreachable service surfaces an error.
- **Increase `MaxRetries` or `MaxDelay`** to ride out longer transient conditions, at the cost of slower failure detection.
- **Keep the lock duration in mind.** When `Reason` is `ServiceBusy` (throttling), the client applies a 10-second back-off. If your entity's lock duration is shorter than the back-off, message or session locks can be lost during the wait. See [Throttling](service-bus-throttling.md).

## Avoid client-side patterns that cause timeouts

Many timeout escalations are caused by application patterns rather than the service. Address these first.

### Don't block on asynchronous calls (sync-over-async)

Calling `.Result`, `.Wait()`, or `.GetAwaiter().GetResult()` on the async Service Bus APIs blocks a thread-pool thread. Under load, this action starves the thread pool: callbacks that complete the I/O can't run, so operations time out even though the service is healthy. The symptom is timeouts that worsen with concurrency and clear when load drops.

Use `async`/`await` end to end instead:

```csharp
// Avoid
ServiceBusReceivedMessage message = receiver.ReceiveMessageAsync().GetAwaiter().GetResult();

// Prefer
ServiceBusReceivedMessage message = await receiver.ReceiveMessageAsync();
```

### Reuse the client as a singleton

Each new [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) opens a new AMQP connection. Creating a client per message or per request exhausts sockets and produces connection timeouts. Create one client for the lifetime of the application and reuse it. For details, see [Socket exhaustion errors](service-bus-troubleshooting-guide.md#socket-exhaustion-errors).

### Right-size prefetch and concurrency

A high prefetch count or a high `MaxConcurrentCalls` combined with slow message processing can cause lock timeouts and processing latency that present as timeouts. Match prefetch to your processing rate and renew locks when processing legitimately takes longer than the lock duration. See [Prefetch messages](service-bus-prefetch.md) and [Best practices for performance](service-bus-performance-improvements.md).

### Verify the network path

When timeouts occur at connection time, confirm the client can reach the service:

- AMQP ports 5671 and 5672 are open, or use the Web Sockets transport over port 443.
- DNS resolves the namespace, including any private endpoint and private DNS zone configuration.
- No proxy or firewall is intercepting the connection.

For step-by-step network checks, see [Connectivity, certificate, or timeout issues](service-bus-troubleshooting-guide.md#connectivity-certificate-or-timeout-issues).

## Handle timeouts in code

Filter on the `Reason` so you can react to a timeout specifically instead of catching every failure the same way:

```csharp
try
{
    await sender.SendMessageAsync(message);
}
catch (ServiceBusException ex) when (ex.Reason == ServiceBusFailureReason.ServiceTimeout)
{
    // The client already retried. Log for correlation, then decide whether
    // to retry at the application level or surface the failure.
}
```

## Decide whether it's the client or the service

Before escalating a timeout as a service issue, rule out the client:

1. Check the namespace **Resource health** page in the Azure portal for the affected time window.
1. Check whether the timeouts correlate with high client CPU or high concurrency.
1. Enable client logging to see whether retries are firing and what the underlying AMQP error is. See [Logging and diagnostics](service-bus-troubleshooting-guide.md#logging-and-diagnostics).
1. Confirm the network path and DNS resolution from the client host.

If Resource health shows the namespace as healthy and the timeouts correlate with client load or configuration, the issue is most likely on the client. If Resource health shows degradation across the window, the cause is more likely service side.

## Related content

- [Troubleshooting guide for Azure Service Bus](service-bus-troubleshooting-guide.md)
- [Service Bus messaging exceptions](service-bus-messaging-exceptions-latest.md)
- [Best practices for performance](service-bus-performance-improvements.md)
- [Prefetch messages](service-bus-prefetch.md)
- [Service Bus throttling](service-bus-throttling.md)
