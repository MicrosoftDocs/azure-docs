<properties
	pageTitle="Service Bus Messaging overview - Azure"
	description="Service Bus Messaging: Flexible Data Delivery in the Cloud"
	services="service-bus"
	documentationCenter=".net"
	authors="djrosanova"
	manager="timlt"
	editor="mattshel"/>

<tags
	ms.service="service-bus"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="02/26/2015"
	ms.author="sethm"/>


# Service Bus Messaging: Flexible Data Delivery in the Cloud

Microsoft Azure Service Bus messaging is a reliable information delivery service. The purpose of this service is to make communication easier. When two or more parties want to exchange information, they need a communication mechanism. Service Bus messaging is a brokered, or third party communication mechanism. This is similar to a postal service in the physical world. Postal services make it very easy to send different kinds of letters and packages with a variety of delivery guarantees, anywhere in the world.

Similar to the postal service delivering letters, Azure Service Bus messaging is about flexible information delivery from both the sender and the recipient. The messaging service ensures that the information is delivered even if the two parties are never both online at the same time, or if they aren't available at the exact same instant. In this way, messaging is similar to sending a letter, while non-brokered communication is similar to placing a phone call (or how a phone call used to be - before call waiting and caller ID, which are much more like brokered messaging).

The message sender can also require a variety of delivery characteristics including transactions, duplicate detection, time based expiration, and batching. These patterns have postal analogies as well: repeat delivery, required signature, address change, or recall.

Service Bus messaging has two separate features: queues and topics. Both messaging entities support all of the concepts presented above - and more. The primary difference is that topics support publish/subscribe capabilities that can be used for sophisticated content-based routing and delivery logic, including sending to multiple recipients.

## Next steps

For more information about Service Bus messaging, see the following topics.

- [Azure Service Bus Architectural Overview](fundamentals-service-bus-hybrid-solutions.md)

- [How to use Service Bus Queues](service-bus-dotnet-how-to-use-queues.md)

- [How to use Service Bus Topics](service-bus-dotnet-how-to-use-topics-subscriptions.md)
