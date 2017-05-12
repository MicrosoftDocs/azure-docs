---
title: Azure Relay FAQs | Microsoft Docs
description: Get answers to some frequently asked questions about Azure Relay.
services: service-bus-relay
documentationcenter: na
author: jtaubensee
manager: timlt
editor: ''

ms.assetid: 886d2c7f-838f-4938-bd23-466662fb1c8e
ms.service: service-bus-relay
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/09/2017
ms.author: jotaub;sethm

---
# Azure Relay FAQs

This article answers some frequently asked questions (FAQs) about [Azure Relay](https://azure.microsoft.com/services/service-bus/). For general Azure pricing and support information, see [Azure Support FAQs](http://go.microsoft.com/fwlink/?LinkID=185083).

## General questions
### What is Azure Relay?
The [Azure Relay service](relay-what-is-it.md) facilitates your hybrid applications by helping you more securely expose services that reside within a corporate enterprise network to the public cloud. You can expose the services without opening a firewall connection, and without requiring intrusive changes to a corporate network infrastructure.

### What is a Relay namespace?
A [namespace](relay-create-namespace-portal.md) gives you a scoping container that you can use to address Relay resources within your application. You must create a namespace to use Relay. Creating a namespace is one of the first steps in getting started.

### What happened to the previously named Service Bus Relay service?
The previously named Service Bus Relay service is now called *WCF Relay*. You can continue to use this service as usual. The Hybrid Connections feature is an updated version of a service that's been transplanted from Microsoft BizTalk. Both WCF Relay and Hybrid Connections continue to be supported.

## Pricing
This section answers some frequently asked questions about the Relay pricing structure. For general Azure pricing information, see [Azure Support FAQs](http://go.microsoft.com/fwlink/?LinkID=185083). For complete information about Relay pricing, see [Service Bus pricing details](https://azure.microsoft.com/pricing/details/service-bus/).

### How do you charge for Hybrid Connections and WCF Relay?
For complete information about Relay pricing, see [Service Bus pricing details][Pricing overview]. In addition to the prices noted, you are charged for associated data transfers for egress outside of the datacenter in which your application is provisioned.

### How am I billed for Hybrid Connections?
Here are three example scenarios for billing for Hybrid Connections:

*   If you have a single listener, such as an instance of the Hybrid Connections Manager that's installed and continuously running for the entire month, and you send 3 GB of data across the connection that month, your total charge is $5.
*   If you have a single listener, such as an instance of the Hybrid Connections Manager that's installed and continuously running for the entire month, and you send 10 GB of data across the connection that month, your total charge is $7.50. That's $5 for the connection and first 5 GB + $2.50 for the additional 5 GB of data.
*   If you have two instances, A and B, of the Hybrid Connections Manager that's installed and continuously running for the entire month, and you send 3 GB of data across connection A and 6 GB across connection B, your total charge is $10.50. That's $5 for connection A + $5 for connection B + $0.50 (for the additional 1 GB on connection B).

Note that the prices used in the examples are applicable only during the Hybrid Connections preview period. Prices are subject to change upon general availability of Hybrid Connections.

### How are hours calculated for Azure Relay?
WCF Relay and Hybrid Connection hours are billed for the cumulative amount of time during which each Service Bus relay is "open." A relay is implicitly instantiated and opened at a given Service Bus address (service namespace URL) when a relay-enabled service (or “relay listener”) first connects to that address. The relay is closed only when the last listener disconnects from that Service Bus address. Therefore, for billing purposes a relay is considered "open" from the time the first relay listener connects until the last relay listener disconnects from the Service Bus address of that relay.

WCF Relay is available only in Standard tier namespaces. Otherwise, pricing and [connection quotas](../service-bus-messaging/service-bus-quotas.md) for relays remain unchanged. This means that relays continue to be charged based on the number of messages (not operations), and relay hours. For more information, see the [Hybrid Connections and WCF relays](https://azure.microsoft.com/pricing/details/service-bus/) table on the pricing details page.

### What if I have more than one listener connected to a specific relay?
In some cases, a single relay might have multiple connected listeners. A relay is considered "open" when at least one relay listener is connected to it. Adding listeners to an open relay results in additional relay hours. The number of relay senders (clients that invoke or send messages to relays) connected to a relay also has no effect on the calculation of relay hours.

### How is the messages meter calculated for WCF relays?
**This applies only to WCF relays. Messages are not a cost for Hybrid Connections.**

In general, billable messages are calculated for relays that use the same method described in the preceding question for brokered entities (queues, topics, and subscriptions). However, there are several notable differences:

Sending a message to a Service Bus relay is treated as a "full through" send to the relay listener that receives the message. It's not treated like a send to the Service Bus relay, followed by a delivery to the relay listener. Therefore, a request-reply style service invocation (of up to 64 KB) against a relay listener results in two billable messages: one billable message for the request and one billable message for the response (assuming the response is also 64 KB or smaller). This is different than using a queue to mediate between a client and a service. If you use a queue to mediate between a client and a service, the same request-reply pattern requires a request send to the queue, followed by a dequeue/delivery from the queue to the service. This is followed by a response send to another queue, and a dequeue/delivery from that queue to the client. Using the same size assumptions (up to 64 KB) throughout, the mediated queue pattern would thus result in four billable messages, twice the number billed to implement the same pattern by using relay. Of course, there are benefits to using queues to achieve this pattern, such as durability and load leveling. These benefits might justify the additional expense.

Relays that are opened by using the netTCPRelay WCF binding treat messages not as individual messages but as a stream of data flowing through the system. Only the sender and listener have visibility into the framing of the individual messages sent and received when you use this binding. Thus, for relays that use the netTCPRelay binding, all data is treated as a stream for the purpose of calculating billable messages. In this case, Service Bus calculates the total amount of data sent or received via each individual relay on a 5-minute basis. Then, it divides that total by 64 KB to determine the number of billable messages for the relay in question during that time period.

## Quotas
| Quota name | Scope | Type | Behavior when exceeded | Value |
| --- | --- | --- | --- | --- |
| Concurrent listeners on a relay |Entity |Static |Subsequent requests for additional connections are rejected and an exception is received by the calling code. |25 |
| Concurrent relay listeners |Systemwide |Static |Subsequent requests for additional connections are rejected and an exception is received by the calling code. |2,000 |
| Concurrent relay connections for all relay endpoints in a service namespace |Systemwide |Static |- |5,000 |
| Relay endpoints per service namespace |Systemwide |Static |- |10,000 |
| Message size for [NetOnewayRelayBinding](https://msdn.microsoft.com/library/microsoft.servicebus.netonewayrelaybinding.aspx) and [NetEventRelayBinding](https://msdn.microsoft.com/library/microsoft.servicebus.neteventrelaybinding.aspx) relays |Systemwide |Static |Incoming messages that exceed these quotas are rejected and an exception is received by the calling code. |64 KB |
| Message size for [HttpRelayTransportBindingElement](https://msdn.microsoft.com/library/microsoft.servicebus.httprelaytransportbindingelement.aspx) and [NetTcpRelayBinding](https://msdn.microsoft.com/library/microsoft.servicebus.nettcprelaybinding.aspx) relays |Systemwide |Static |- |Unlimited |

### Does Azure Relay have any usage quotas?
By default, for any cloud service, Microsoft sets an aggregate monthly usage quota that is calculated across all of a customer's subscriptions. Because we understand that at times your needs might exceed these limits, you can contact customer service at any time so that we can understand your needs and adjust these limits appropriately. For Service Bus, the aggregate usage quotas are as follows:

* 5 billion messages
* 2 million relay hours

Although we reserve the right to disable a customer account that has exceeded its monthly usage quotas, we provide e-mail notification, and we make multiple attempts to contact a customer before taking any action. Customers who exceed these quotas are still responsible for charges that exceed the quotas.

### Naming restrictions
An Azure Relay namespace name can be only between 6 and 50 characters in length.

## Subscription and namespace management
### How do I migrate a namespace to another Azure subscription?

You can move a namespace from one Azure subscription to another either in the [Azure portal](https://portal.azure.com) or by using PowerShell commands. To move a namespace from one Azure subscription to another, the namespace must already be active. The user running the commands must be an Administrator user on both the source and target subscriptions.

#### Azure portal

To use the Azure portal to migrate Azure Relay namespaces from one subscription to another subscription, see [Move resources to a new resource group or subscription](../azure-resource-manager/resource-group-move-resources.md#use-portal). 

#### PowerShell

To move a namespace from one Azure subscription to another, use the following sequence of PowerShell commands. To execute this operation, the namespace must already be active, and the user running the PowerShell commands must be an Administrator user on both the source and target subscriptions.

```powershell
# Create a new resource group in the target subscription.
Select-AzureRmSubscription -SubscriptionId 'ffffffff-ffff-ffff-ffff-ffffffffffff'
New-AzureRmResourceGroup -Name 'targetRG' -Location 'East US'

# Move the namespace from the source subscription to the target subscription.
Select-AzureRmSubscription -SubscriptionId 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
$res = Find-AzureRmResource -ResourceNameContains mynamespace -ResourceType 'Microsoft.ServiceBus/namespaces'
Move-AzureRmResource -DestinationResourceGroupName 'targetRG' -DestinationSubscriptionId 'ffffffff-ffff-ffff-ffff-ffffffffffff' -ResourceId $res.ResourceId
```

## Troubleshooting
### What are some of the exceptions generated by Azure Relay APIs and their suggested actions?
The [Relay exceptions][Relay exceptions] article describes some exceptions with suggested actions.

### What is a shared access signature, and which languages can I use to generate a signature?
Shared access signatures are an authentication mechanism based on SHA – 256 secure hashes or URIs. For information about how to generate your own signatures in Node, PHP, Java, C, and C#, see [Shared access signatures][Shared Access Signatures].

### Is it possible to whitelist Relay endpoints?
Yes. The Relay client makes connections to the Relay service using fully qualified domain names. Customers can add an entry for `*.servicebus.windows.net` on firewalls that support DNS whitelisting.

## Next steps
* [Create a namespace](relay-create-namespace-portal.md)
* [Get started with .NET](relay-hybrid-connections-dotnet-get-started.md)
* [Get started with Node](relay-hybrid-connections-node-get-started.md)

[Pricing overview]: https://azure.microsoft.com/pricing/details/service-bus/
[Relay exceptions]: relay-exceptions.md
[Shared access signatures]: ../service-bus-messaging/service-bus-sas.md