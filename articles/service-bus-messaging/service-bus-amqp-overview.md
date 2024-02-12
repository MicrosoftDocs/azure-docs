---
title: Overview of AMQP 1.0 in Azure Service Bus
description: Learn how Azure Service Bus supports Advanced Message Queuing Protocol (AMQP), an open standard protocol.
ms.topic: article
ms.date: 08/16/2023
---

# Advanced Message Queueing Protocol (AMQP) 1.0 support in Service Bus
The Azure Service Bus cloud service uses the [AMQP 1.0](http://docs.oasis-open.org/amqp/core/v1.0/amqp-core-overview-v1.0.html) as its primary means of communication. Microsoft has been engaged with partners across the industry, both customers and vendors of competing messaging brokers, to develop and evolve AMQP over the past decade, with new extensions being developed in the [OASIS AMQP Technical Committee](https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=amqp). AMQP 1.0 is an ISO and IEC standard ([ISO 19464:20149](https://www.iso.org/standard/64955.html)). 

AMQP enables you to build cross-platform, hybrid applications using a vendor-neutral and implementation-neutral, open standard protocol. You can construct applications using components that are built using different languages and frameworks, and that run on different operating systems. All these components can connect to Service Bus and seamlessly exchange structured business messages efficiently and at full fidelity.

## Introduction: What is AMQP 1.0 and why is it important?
Traditionally, message-oriented middleware products have used proprietary protocols for communication between client applications and brokers. It means that once you've selected a particular vendor's messaging broker, you must use that vendor's libraries to connect your client applications to that broker. It results in a degree of dependence on that vendor, since porting an application to a different product requires code changes in all the connected applications. In the Java community, language-specific API standards like Java Message Service (JMS) and the Spring Framework's abstractions have alleviated that pain somewhat, but have a narrow feature scope and exclude developers using other languages.

Furthermore, connecting messaging brokers from different vendors is tricky. It typically requires application-level bridging to move messages from one system to another and to translate between their proprietary message formats. It's a common requirement; for example, when you must provide a new unified interface to older disparate systems, or integrate IT systems following a merger. AMQP allows for interconnecting connecting brokers directly, for instance using routers like [Apache Qpid Dispatch Router](https://qpid.apache.org/components/dispatch-router/index.html) or broker-native "shovels" like the one of [RabbitMQ](service-bus-integrate-with-rabbitmq.md).

The software industry is a fast-moving business; new programming languages and application frameworks are introduced at a sometimes bewildering pace. Similarly, the requirements of IT systems evolve over time and developers want to take advantage of the latest platform features. However, sometimes the selected messaging vendor doesn't support these platforms. If messaging protocols are proprietary, it's not possible for others to provide libraries for these new platforms. Therefore, you must use approaches such as building gateways or bridges that enable you to continue to use the messaging product.

The development of the Advanced Message Queuing Protocol (AMQP) 1.0 was motivated by these issues. It originated at JP Morgan Chase, who, like most financial services firms, are heavy users of message-oriented middleware. The goal was simple: to create an open-standard messaging protocol that made it possible to build message-based applications using components built using different languages, frameworks, and operating systems, all using best-of-breed components from a range of suppliers.

## AMQP 1.0 technical features
AMQP 1.0 is an efficient, reliable, wire-level messaging protocol that you can use to build robust, cross-platform, messaging applications. The protocol has a simple goal: to define the mechanics of the secure, reliable, and efficient transfer of messages between two parties. The messages themselves are encoded using a portable data representation that enables heterogeneous senders and receivers to exchange structured business messages at full fidelity. Here's a summary of the most important features:

* **Efficient**: AMQP 1.0 is a connection-oriented protocol that uses a binary encoding for the protocol instructions and the business messages transferred over it. It incorporates sophisticated flow-control schemes to maximize the utilization of the network and the connected components. That said, the protocol was designed to strike a balance between efficiency, flexibility, and interoperability.
* **Reliable**: The AMQP 1.0 protocol allows messages to be exchanged with a range of reliability guarantees, from fire-and-forget to reliable, exactly once acknowledged delivery.
* **Flexible**: AMQP 1.0 is a flexible protocol that can be used to support different topologies. The same protocol can be used for client-to-client, client-to-broker, and broker-to-broker communications.
* **Broker-model independent**: The AMQP 1.0 specification doesn't make any requirements on the messaging model used by a broker. This means that it's possible to easily add AMQP 1.0 support to existing messaging brokers.

## AMQP 1.0 is a Standard (with a capital 'S')
AMQP 1.0 is an international standard, approved by ISO and IEC as ISO/IEC 19464:2014.

AMQP 1.0 has been in development since 2008 by a core group of more than 20 companies, both technology suppliers and end-user firms. During that time, user firms have contributed their real-world business requirements and the technology vendors have evolved the protocol to meet those requirements. Throughout the process, vendors have participated in workshops in which they collaborated to validate the interoperability between their implementations.

In October 2011, the development work transitioned to a technical committee within the Organization for the Advancement of Structured Information Standards (OASIS) and the OASIS AMQP 1.0 Standard was released in October 2012. The following firms participated in the technical committee during the development of the standard:

* **Technology vendors**: Axway Software, Huawei Technologies, IIT Software, INETCO Systems, Kaazing, Microsoft, Mitre Corporation, Primeton Technologies, Progress Software, Red Hat, SITA, Software AG, Solace Systems, VMware, WSO2, Zenika.
* **User firms**: Bank of America, Credit Suisse, Deutsche Boerse, Goldman Sachs, JPMorgan Chase.

The current chairs of the [OASIS AMQP Technical Committee](https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=amqp) represent Red Hat and Microsoft.

Some of the commonly cited benefits of open standards include:

* Less chance of vendor lock-in
* Interoperability
* Broad availability of libraries and tooling
* Protection against obsolescence
* Availability of knowledgeable staff
* Lower and manageable risk

## AMQP 1.0 and Service Bus
AMQP 1.0 support in Azure Service Bus means that you can use the Service Bus queuing and publish/subscribe brokered messaging features from a range of platforms using an efficient binary protocol. Furthermore, you can build applications comprised of components built using a mix of languages, frameworks, and operating systems.

The following figure illustrates an example deployment in which Java clients running on Linux, written using the standard Java Message Service (JMS) API and .NET clients running on Windows, exchange messages via Service Bus using AMQP 1.0.

![Diagram showing one Service Bus exchanging messages with two Linux environments and two Windows environments.][0]

**Figure 1: Example deployment scenario showing cross-platform messaging using Service Bus and AMQP 1.0**

All supported Service Bus client libraries available via the Azure SDK use AMQP 1.0.

- [Azure Service Bus for .NET](/dotnet/api/overview/azure/service-bus?preserve-view=true)
- [Azure Service Bus libraries for Java](/java/api/overview/azure/servicebus?preserve-view=true)
- [Azure Service Bus provider for Java JMS 2.0](how-to-use-java-message-service-20.md)
- [Azure Service Bus Modules for JavaScript and TypeScript](/javascript/api/overview/azure/service-bus?preserve-view=true)
- [Azure Service Bus libraries for Python](/python/api/overview/azure/servicebus?preserve-view=true)

[!INCLUDE [service-bus-websockets-options](./includes/service-bus-websockets-options.md)]

In addition, you can use Service Bus from any AMQP 1.0 compliant protocol stack:

[!INCLUDE [messaging-oss-amqp-stacks.md](../../includes/messaging-oss-amqp-stacks.md)]

## Summary
* AMQP 1.0 is an open, reliable messaging protocol that you can use to build cross-platform, hybrid applications. AMQP 1.0 is an OASIS standard.

## Next steps
Ready to learn more? Visit the following links:

* [Using Service Bus from .NET with AMQP]
* [Using Service Bus from Java with AMQP]

[0]: ./media/service-bus-amqp-overview/service-bus-amqp-1.png
[Using Service Bus from .NET with AMQP]: service-bus-amqp-dotnet.md
[Using Service Bus from Java with AMQP]: ./service-bus-java-how-to-use-jms-api-amqp.md

