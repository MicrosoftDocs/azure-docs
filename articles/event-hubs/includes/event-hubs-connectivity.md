---
title: Troubleshoot connectivity issues
description: Include file with some common content that helps you with troubleshooting connectivity issues. 
author: spelluru
ms.service: azure-event-hubs
ms.topic: include
ms.date: 07/29/2024
ms.author: spelluru
ms.custom: "include file"

---

### What protocols I can use to send and receive events? 
Producers or senders can use Advanced Messaging Queuing Protocol (AMQP), Kafka, or HTTPS protocols to send events to an event hub. 

Consumers or receivers use AMQP or Kafka to receive events from an event hub. Event Hubs supports only the pull model for consumers to receive events from it. Even when you use event handlers to handle events from an event hub, the event processor internally uses the pull model to receive events from the event hub.

#### AMQP
You can use the **AMQP 1.0** protocol to send events to and receive events from Azure Event Hubs. AMQP provides reliable, performant, and secure communication for both sending and receiving events. You can use it for high-performance and real-time streaming and is supported by most Azure Event Hubs SDKs.

#### HTTPS/REST API
You can only send events to Event Hubs using HTTP POST requests. Event Hubs doesn't support receiving events over HTTPS. It's suitable for lightweight clients where a direct TCP connection isn't feasible. 

#### Apache Kafka
Azure Event Hubs has a built-in Kafka endpoint that supports Kafka producers and consumers. Applications that are built using Kafka can use Kafka protocol (version 1.0 or later) to send and receive events from Event Hubs without any code changes. 

Azure SDKs abstract the underlying communication protocols and provide a simplified way to send and receive events from Event Hubs using languages like C#, Java, Python, JavaScript, etc.

### What ports do I need to open on the firewall? 
You can use the following protocols with Azure Event Hubs to send and receive events:

- Advanced Message Queuing Protocol 1.0 (AMQP)
- Hypertext Transfer Protocol 1.1 with Transport Layer Security (HTTPS)
- Apache Kafka

See the following table for the outbound ports you need to open to use these protocols to communicate with Azure Event Hubs. 

| Protocol | Ports | Details | 
| -------- | ----- | ------- | 
| AMQP | 5671 and 5672 | See [AMQP protocol guide](../../service-bus-messaging/service-bus-amqp-protocol-guide.md) | 
| HTTPS | 443 | This port is used for the HTTP/REST API and for AMQP-over-WebSockets. |
| Kafka | 9093 | See [Use Event Hubs from Kafka applications](../azure-event-hubs-apache-kafka-overview.md)

The HTTPS port is required for outbound communication also when AMQP is used over port 5671, because several management operations performed by the client SDKs and the acquisition of tokens from Microsoft Entra ID (when used) run over HTTPS. 

The official Azure SDKs generally use the AMQP protocol for sending and receiving events from Event Hubs. The AMQP-over-WebSockets protocol option runs over port TCP 443 just like the HTTP API, but is otherwise functionally identical with plain AMQP. This option has higher initial connection latency because of extra handshake round trips and slightly more overhead as tradeoff for sharing the HTTPS port. If this mode is selected, TCP port 443 is sufficient for communication. The following options allow selecting the plain AMQP or AMQP WebSockets mode:

| Language | Option   |
| -------- | ----- |
| .NET     | [EventHubConnectionOptions.TransportType](/dotnet/api/azure.messaging.eventhubs.eventhubconnectionoptions.transporttype) property with [EventHubsTransportType.AmqpTcp](/dotnet/api/azure.messaging.eventhubs.eventhubstransporttype) or [EventHubsTransportType.AmqpWebSockets](/dotnet/api/azure.messaging.eventhubs.eventhubstransporttype) |
| Java     | [com.microsoft.azure.eventhubs.EventProcessorClientBuilder.transporttype](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventhubs/azure-messaging-eventhubs/src/main/java/com/azure/messaging/eventhubs/EventProcessorClientBuilder.java) with [AmqpTransportType.AMQP](/java/api/com.azure.core.amqp.amqptransporttype) or [AmqpTransportType.AMQP_WEB_SOCKETS](/java/api/com.azure.core.amqp.amqptransporttype) |
| Node  | [EventHubConsumerClientOptions](/javascript/api/@azure/event-hubs/eventhubconsumerclientoptions) has a `webSocketOptions` property. |
| Python | [EventHubConsumerClient.transport_type](/python/api/azure-eventhub/azure.eventhub.eventhubconsumerclient) with [TransportType.Amqp](/python/api/azure-eventhub/azure.eventhub.transporttype) or [TransportType.AmqpOverWebSocket](/python/api/azure-eventhub/azure.eventhub.transporttype) |

### What IP addresses do I need to allow?
When you're working with Azure, sometimes you have to allow specific IP address ranges or URLs in your corporate firewall or proxy to access all Azure services you're using or trying to use. Verify that the traffic is allowed on IP addresses used by Event Hubs. For IP addresses used by Azure Event Hubs: see [Azure IP Ranges and Service Tags - Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519).

Also, verify that the IP address for your namespace is allowed. To find the right IP addresses to allow for your connections, follow these steps:

1. Run the following command from a command prompt: 

    ```
    nslookup <YourNamespaceName>.servicebus.windows.net
    ```
2. Note down the IP address returned in `Non-authoritative answer`. 

If you use a namespace hosted in an older cluster (based on Cloud Services - CNAME ending in *.cloudapp.net) and the namespace is **zone redundant**, you need to follow few extra steps. If your namespace is on a newer cluster (based on Virtual Machine Scale Set - CNAME ending in *.cloudapp.azure.com) and zone redundant you can skip below steps.

1. First, you run nslookup on the namespace.

    ```
    nslookup <yournamespace>.servicebus.windows.net
    ```
2. Note down the name in the **non-authoritative answer** section, which is in one of the following formats: 

    ```
    <name>-s1.cloudapp.net
    <name>-s2.cloudapp.net
    <name>-s3.cloudapp.net
    ```
3. Run nslookup for each one with suffixes s1, s2, and s3 to get the IP addresses of all three instances running in three availability zones, 

    > [!NOTE]
    > The IP address returned by the `nslookup` command isn't a static IP address. However, it remains constant until the underlying deployment is deleted or moved to a different cluster.

### What client IPs are sending events to or receiving events from my namespace?
First, enable [IP filtering](../event-hubs-ip-filtering.md) on the namespace. 

Then, Enable diagnostic logs for [Event Hubs virtual network connection events](../monitor-event-hubs-reference.md#event-hubs-virtual-network-connection-event-schema) by following instructions in the [Enable diagnostic logs](/azure/azure-monitor/essentials/diagnostic-settings). You see the IP address for which connection is denied.

```json
{
    "SubscriptionId": "0000000-0000-0000-0000-000000000000",
    "NamespaceName": "namespace-name",
    "IPAddress": "1.2.3.4",
    "Action": "Deny Connection",
    "Reason": "IPAddress doesn't belong to a subnet with Service Endpoint enabled.",
    "Count": "65",
    "ResourceId": "/subscriptions/0000000-0000-0000-0000-000000000000/resourcegroups/testrg/providers/microsoft.eventhub/namespaces/namespace-name",
    "Category": "EventHubVNetConnectionEvent"
}
```

> [!IMPORTANT]
> Virtual network logs are generated only if the namespace allows access from **specific IP addresses** (IP filter rules). If you don't want to restrict access to your namespace using these features and still want to get virtual network logs to track IP addresses of clients connecting to the Event Hubs namespace, you could use the following workaround: [Enable IP filtering](../event-hubs-ip-filtering.md), and add the total addressable IPv4 range (`0.0.0.0/1` - `128.0.0.0/1`) and IPv6 range (`::/1` - `8000::/1`). 

> [!NOTE]
> Currently, it's not possible to determine the source IP of an individual message or event. 
