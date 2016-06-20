<properties
	pageTitle="Service Bus messaging overview | Microsoft Azure"
	description="Service Bus Messaging: flexible data delivery in the cloud"
	services="service-bus"
	documentationCenter=".net"
	authors="sethmanheim"
	manager="timlt"
	editor=""/>

<tags
	ms.service="service-bus"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="get-started-article"
	ms.date="06/20/2016"
	ms.author="sethm"/>


# Service Bus messaging: flexible data delivery in the cloud

Microsoft Azure Service Bus messaging is a reliable information delivery service. The purpose of this service is to make communication easier. When two or more parties want to exchange information, they need a communication mechanism. Service Bus messaging is a brokered, or third party communication mechanism. This is similar to a postal service in the physical world. Postal services make it very easy to send different kinds of letters and packages with a variety of delivery guarantees, anywhere in the world.

Similar to the postal service delivering letters, Service Bus messaging is flexible information delivery from both the sender and the recipient. The messaging service ensures that the information is delivered even if the two parties are never both online at the same time, or if they aren't available at the exact same time. In this way, messaging is similar to sending a letter, while non-brokered communication is similar to placing a phone call (or how a phone call used to be - before call waiting and caller ID, which are much more like brokered messaging).

The message sender can also require a variety of delivery characteristics including transactions, duplicate detection, time-based expiration, and batching. These patterns have postal analogies as well: repeat delivery, required signature, address change, or recall.

Service Bus supports two distinct messaging patterns: *relayed* messaging and *brokered* messaging.

## Relayed messaging

The [relay](service-bus-relay-overview.md) component of Service Bus is a centralized (but highly load-balanced) service that supports a variety of different transport protocols and Web services standards. This includes SOAP, WS-*, and even REST. The [relay service](service-bus-dotnet-how-to-use-relay.md) provides a variety of different relay connectivity options and can help negotiate direct peer-to-peer connections when it is possible. Service Bus is optimized for .NET developers who use the Windows Communication Foundation (WCF), both with regard to performance and usability, and provides full access to its relay service through SOAP and REST interfaces. This makes it possible for any SOAP or REST programming environment to integrate with Service Bus.

The relay service supports traditional one-way messaging, request/response messaging, and peer-to-peer messaging. It also supports event distribution at Internet-scope to enable publish-subscribe scenarios and bi-directional socket communication for increased point-to-point efficiency. In the relayed messaging pattern, an on-premises service connects to the relay service through an outbound port and creates a bi-directional socket for communication tied to a particular rendezvous address. The client can then communicate with the on-premises service by sending messages to the relay service targeting the rendezvous address. The relay service will then "relay" messages to the on-premises service through the bi-directional socket already in place. The client does not need a direct connection to the on-premises service, nor is it required to know where the service resides, and the on-premises service does not need any inbound ports open on the firewall.

You must initiate the connection between your on-premises service and the relay service, using a suite of WCF "relay" bindings. Behind the scenes, the relay bindings map to transport binding elements designed to create WCF channel components that integrate with Service Bus in the cloud.

Relayed messaging provides many benefits, but requires the server and client to both be online at the same time in order to send and receive messages. This is not optimal for HTTP-style communication, in which the requests may not be typically long-lived, nor for clients that connect only occasionally, such as browsers, mobile applications, and so on. Brokered messaging supports decoupled communication, and has its own advantages; clients and servers can connect when needed and perform their operations in an asynchronous manner.

## Brokered messaging

In contrast to the relayed messaging scheme, [brokered messaging](service-bus-queues-topics-subscriptions.md) can be thought of as asynchronous, or "temporally decoupled." Producers (senders) and consumers (receivers) do not have to be online at the same time. The messaging infrastructure reliably stores messages in a "broker" (such as a queue) until the consuming party is ready to receive them. This allows the components of the distributed application to be disconnected, either voluntarily; for example, for maintenance, or due to a component crash, without affecting the entire system. Furthermore, the receiving application may only have to come online during certain times of the day, such as an inventory management system that only is required to run at the end of the business day.

The core components of the Service Bus brokered messaging infrastructure are queues, topics, and subscriptions.  The primary difference is that topics support publish/subscribe capabilities that can be used for sophisticated content-based routing and delivery logic, including sending to multiple recipients. These components enable new asynchronous messaging scenarios, such as temporal decoupling, publish/subscribe, and load balancing. For more information about these messaging entities, see [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md).

As with the relayed messaging infrastructure, the brokered messaging capability is provided for WCF and .NET Framework programmers, and also via REST.

## Next steps

To learn more about Service Bus messaging, see the following topics.

- [Service Bus fundamentals](service-bus-fundamentals-hybrid-solutions.md)
- [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
- [Service Bus architecture](service-bus-architecture.md)
- [How to use Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
- [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
 
