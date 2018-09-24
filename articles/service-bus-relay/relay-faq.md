---
title: Azure Relay FAQs | Microsoft Docs
description: Get answers to some frequently asked questions about Azure Relay.
services: service-bus-relay
documentationcenter: na
author: spelluru
manager: timlt
editor: ''

ms.assetid: 886d2c7f-838f-4938-bd23-466662fb1c8e
ms.service: service-bus-relay
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/21/2018
ms.author: spelluru

---
# Azure Relay FAQs

This article answers some frequently asked questions (FAQs) about [Azure Relay](https://azure.microsoft.com/services/service-bus/). For general Azure pricing and support information, see the [Azure Support FAQs](https://azure.microsoft.com/support/faq/).

## General questions
### What is Azure Relay?
The [Azure Relay service](relay-what-is-it.md) facilitates your hybrid applications by helping you more securely expose services that reside within a corporate enterprise network to the public cloud. You can expose the services without opening a firewall connection, and without requiring intrusive changes to a corporate network infrastructure.

### What is a Relay namespace?
A [namespace](relay-create-namespace-portal.md) is a scoping container that you can use to address Relay resources within your application. You must create a namespace to use Relay. This is one of the first steps in getting started.

### What happened to Service Bus Relay service?
The previously named Service Bus Relay service is now called [WCF Relay](relay-wcf-dotnet-get-started.md). You can continue to use this service as usual. The Hybrid Connections feature is an updated version of a service that's been transplanted from Azure BizTalk Services. WCF Relay and Hybrid Connections both continue to be supported.

## Pricing
This section answers some frequently asked questions about the Relay pricing structure. You also can see the [Azure Support FAQs](https://azure.microsoft.com/support/faq/) for general Azure pricing information. For complete information about Relay pricing, see [Service Bus pricing details][Pricing overview].

### How do you charge for Hybrid Connections and WCF Relay?
For complete information about Relay pricing, see the [Hybrid Connections and WCF Relays][Pricing overview] table on the Service Bus pricing details page. In addition to the prices noted on that page, you are charged for associated data transfers for egress outside of the datacenter in which your application is provisioned.

### How am I billed for Hybrid Connections?
Here are three example billing scenarios for Hybrid Connections:

*   Scenario 1:
    *   You have a single listener, such as an instance of the Hybrid Connections Manager installed and continuously running for the entire month.
    *   You send 3 GB of data across the connection during the month. 
    *   Your total charge is $5.
*   Scenario 2:
    *   You have a single listener, such as an instance of the Hybrid Connections Manager installed and continuously running for the entire month.
    *   You send 10 GB of data across the connection during the month.
    *   Your total charge is $7.50. That's $5 for the connection and first 5 GB + $2.50 for the additional 5 GB of data.
*   Scenario 3:
    *   You have two instances, A and B, of the Hybrid Connections Manager installed and continuously running for the entire month.
    *   You send 3 GB of data across connection A during the month.
    *   You send 6 GB of data across connection B during the month.
    *   Your total charge is $10.50. That's $5 for connection A + $5 for connection B + $0.50 (for the sixth gigabyte on connection B).

Note that the prices used in the examples are applicable only during the Hybrid Connections preview period. Prices are subject to change upon general availability of Hybrid Connections.

### How are hours calculated for Relay?

WCF Relay is available only in Standard tier namespaces. Pricing and [connection quotas](../service-bus-messaging/service-bus-quotas.md) for relays otherwise have not changed. This means that relays continue to be charged based on the number of messages (not operations) and relay hours. For more information, see the ["Hybrid Connections and WCF Relays"](https://azure.microsoft.com/pricing/details/service-bus/) table on the pricing details page.

### What if I have more than one listener connected to a specific relay?
In some cases, a single relay might have multiple connected listeners. A relay is considered open when at least one relay listener is connected to it. Adding listeners to an open relay results in additional relay hours. The number of relay senders (clients that invoke or send messages to relays) that are connected to a relay does not affect the calculation of relay hours.

### How is the messages meter calculated for WCF Relays?
(**This applies only to WCF relays. Messages are not a cost for Hybrid Connections.**)

In general, billable messages for relays are calculated by using the same method that is used for brokered entities (queues, topics, and subscriptions), described previously. However, there are some notable differences.

Sending a message to a Service Bus relay is treated as a "full through" send to the relay listener that receives the message. It is not treated as a send operation to the Service Bus relay, followed by a delivery to the relay listener. A request-reply style service invocation (of up to 64 KB) against a relay listener results in two billable messages: one billable message for the request and one billable message for the response (assuming the response is also 64 KB or smaller). This is different than using a queue to mediate between a client and a service. If you use a queue to mediate between a client and a service, the same request-reply pattern requires a request send to the queue, followed by a dequeue/delivery from the queue to the service. This is followed by a response send to another queue, and a dequeue/delivery from that queue to the client. Using the same size assumptions throughout (up to 64 KB), the mediated queue pattern results in 4 billable messages. You'd be billed for twice the number of messages to implement the same pattern that you accomplish by using relay. Of course, there are benefits to using queues to achieve this pattern, such as durability and load leveling. These benefits might justify the additional expense.

Relays that are opened by using the **netTCPRelay** WCF binding treat messages not as individual messages, but as a stream of data flowing through the system. When you use this binding, only the sender and listener have visibility into the framing of the individual messages sent and received. For relays that use the **netTCPRelay** binding, all data is treated as a stream for calculating billable messages. In this case, Service Bus calculates the total amount of data sent or received via each individual relay on a 5-minute basis. Then, it divides that total amount of data by 64 KB to determine the number of billable messages for that relay during that time period.

## Quotas
| Quota name | Scope |  Notes | Value |
| --- | --- | --- | --- |
| Concurrent listeners on a relay |Entity |Subsequent requests for additional connections are rejected and an exception is received by the calling code. |25 |
| Concurrent relay connections per all relay endpoints in a service namespace |Namespace |- |5,000 |
| Relay endpoints per service namespace |Namespace |- |10,000 |
| Message size for [NetOnewayRelayBinding](/dotnet/api/microsoft.servicebus.netonewayrelaybinding) and [NetEventRelayBinding](/dotnet/api/microsoft.servicebus.neteventrelaybinding) relays |Namespace |Incoming messages that exceed these quotas are rejected and an exception is received by the calling code. |64 KB |
| Message size for [HttpRelayTransportBindingElement](/dotnet/api/microsoft.servicebus.httprelaytransportbindingelement) and [NetTcpRelayBinding](/dotnet/api/microsoft.servicebus.nettcprelaybinding) relays |Namespace |No limit on message size. |Unlimited |

### Does Relay have any usage quotas?
By default, for any cloud service, Microsoft sets an aggregate monthly usage quota that is calculated across all of a customer's subscriptions. We understand that at times your needs might exceed these limits. You can contact customer service at any time, so we can understand your needs and adjust these limits appropriately. For Service Bus, the aggregate usage quotas are as follows:

* 5 billion messages
* 2 million relay hours

Although we reserve the right to disable an account that exceeds its monthly usage quotas, we provide e-mail notification, and we make multiple attempts to contact the customer before taking any action. Customers that exceed these quotas are still responsible for excess charges.

### Naming restrictions
A Relay namespace name must be between 6 and 50 characters in length.

## Subscription and namespace management
### How do I migrate a namespace to another Azure subscription?

To move a namespace from one Azure subscription to another subscription, you can either use the [Azure portal](https://portal.azure.com) or use PowerShell commands. To move a namespace to another subscription, the namespace must already be active. The user running the commands must be an Administrator user on both the source and target subscriptions.

#### Azure portal

To use the Azure portal to migrate Azure Relay namespaces from one subscription to another subscription, see [Move resources to a new resource group or subscription](../azure-resource-manager/resource-group-move-resources.md#use-portal). 

#### PowerShell

To use PowerShell to move a namespace from one Azure subscription to another subscription, use the following sequence of commands. To execute this operation, the namespace must already be active, and the user running the PowerShell commands must be an Administrator user on both the source and target subscriptions.

```azurepowershell-interactive
# Create a new resource group in the target subscription.
Select-AzureRmSubscription -SubscriptionId 'ffffffff-ffff-ffff-ffff-ffffffffffff'
New-AzureRmResourceGroup -Name 'targetRG' -Location 'East US'

# Move the namespace from the source subscription to the target subscription.
Select-AzureRmSubscription -SubscriptionId 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
$res = Find-AzureRmResource -ResourceNameContains mynamespace -ResourceType 'Microsoft.ServiceBus/namespaces'
Move-AzureRmResource -DestinationResourceGroupName 'targetRG' -DestinationSubscriptionId 'ffffffff-ffff-ffff-ffff-ffffffffffff' -ResourceId $res.ResourceId
```

## Troubleshooting
### What are some of the exceptions generated by Azure Relay APIs, and suggested actions you can take?
For a description of common exceptions and suggested actions you can take, see [Relay exceptions][Relay exceptions].

### What is a shared access signature, and which languages can I use to generate a signature?
Shared Access Signatures (SAS) are an authentication mechanism based on SHA-256 secure hashes or URIs. For information about how to generate your own signatures in Node, PHP, Java, C, and C#, see [Service Bus authentication with shared access signatures][Shared Access Signatures].

### Is it possible to whitelist relay endpoints?
Yes. The relay client makes connections to the Azure Relay service by using fully qualified domain names. Customers can add an entry for `*.servicebus.windows.net` on firewalls that support DNS whitelisting.

## Next steps
* [Create a namespace](relay-create-namespace-portal.md)
* [Get started with .NET](relay-hybrid-connections-dotnet-get-started.md)
* [Get started with Node](relay-hybrid-connections-node-get-started.md)

[Pricing overview]: https://azure.microsoft.com/pricing/details/service-bus/
[Relay exceptions]: relay-exceptions.md
[Shared Access Signatures]: ../service-bus-messaging/service-bus-sas.md
