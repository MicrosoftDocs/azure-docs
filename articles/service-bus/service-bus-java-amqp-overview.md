<properties 
	pageTitle="Service Bus AMQP overview (Java) | Microsoft Azure" 
	description="Learn about using the Advanced Message Queuing Protocol (AMQP) 1.0 in Azure." 
	services="service-bus" 
	documentationCenter="java" 
	authors="sethmanheim" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="service-bus" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="Java" 
	ms.topic="article" 
	ms.date="07/21/2015" 
	ms.author="sethm"/>


# AMQP 1.0 support in Service Bus

Both the Azure Service Bus cloud service and on-prem [Service Bus for Windows Server (Service Bus 1.1)](https://msdn.microsoft.com/library/dn282144.aspx) support the Advanced Message Queueing Protocol (AMQP) 1.0. AMQP enables you to build cross-platform, hybrid applications using an open standard protocol. You can construct applications using components that are built using different languages and frameworks, and that run on different operating systems. All these components can connect to Service Bus and seamlessly exchange structured business messages efficiently and at full fidelity.

## Introduction: What is AMQP 1.0 and why is it important?

Traditionally, message-oriented middleware products have used proprietary protocols for communication between client applications and brokers. This means that once you've selected a particular vendor's messaging broker, you must use that vendor's libraries to connect your client applications to that broker. This results in a degree of dependence on that vendor, since porting an application to a different product requires code changes in all the connected applications. 

Furthermore, connecting messaging brokers from different vendors is tricky. This typically requires application-level bridging to move messages from one system to another and to translate between their proprietary message formats. This is a common requirement; for example, when you must provide a new unified interface to older disparate systems, or integrate IT systems following a merger.

The software industry is a fast-moving business; new programming languages and application frameworks are introduced at a sometimes bewildering pace. Similarly, the requirements of IT systems evolve over time and developers want to take advantage of the latest platform features. However, sometimes the selected messaging vendor does not support these platforms. Because messaging protocols are proprietary, it's not possible for others to provide libraries for these new platforms. Therefore, you must use approaches such as building gateways or bridges that enable you to continue to use the messaging product.

The development of the Advanced Message Queuing Protocol (AMQP) 1.0 was motivated by these issues. It originated at JP Morgan Chase, who, like most financial services firms, are heavy users of message-oriented middleware. The goal was simple: to create an open-standard messaging protocol that made it possible to build message-based applications using components built using different languages, frameworks, and operating systems, all using best-of-breed components from a range of suppliers.

## AMQP 1.0 technical features

AMQP 1.0 is an efficient, reliable, wire-level messaging protocol that you can use to build robust, cross-platform, messaging applications. The protocol has a simple goal: to define the mechanics of the secure, reliable, and efficient transfer of messages between two parties. The messages themselves are encoded using a portable data representation that enables heterogeneous senders and receivers to exchange structured business messages at full fidelity. The following is a summary of the most important features:

*    **Efficient**: AMQP 1.0 is a connection-oriented protocol that uses a binary encoding for the protocol instructions and the business messages transferred over it. It incorporates sophisticated flow-control schemes to maximize the utilization of the network and the connected components. That said, the protocol was designed to strike a balance between efficiency, flexibility and interoperability.
*    **Reliable**: The AMQP 1.0 protocol allows messages to be exchanged with a range of reliability guarantees, from fire-and-forget to reliable, exactly-once acknowledged delivery.
*    **Flexible**: AMQP 1.0 is a flexible protocol that can be used to support different topologies. The same protocol can be used for client-to-client, client-to-broker, and broker-to-broker communications.
*    **Broker-model independent**: The AMQP 1.0 specification does not make any requirements on the messaging model used by a broker. This means that it's possible to easily add AMQP 1.0 support to existing messaging brokers.

## AMQP 1.0 is a Standard (with a capital 'S')

AMQP 1.0 has been in development since 2008 by a core group of more than 20 companies, both technology suppliers and end-user firms. During that time, user firms have contributed their real-world business requirements and the technology vendors have evolved the protocol to meet those requirements. Throughout the process, vendors have participated in workshops in which they collaborated to validate the interoperability between their implementations.

In October 2011, the development work transitioned to a technical committee within the Organization for the Advancement of Structured Information Standards (OASIS) and the OASIS AMQP 1.0 Standard was released in October 2012. The following firms participated in the technical committee during the development of the standard:

*    **Technology vendors**: Axway Software, Huawei Technologies, IIT Software, INETCO Systems, Kaazing, Microsoft, Mitre Corporation, Primeton Technologies, Progress Software, Red Hat, SITA, Software AG, Solace Systems, VMware, WSO2, Zenika.
*    **User firms**: Bank of America, Credit Suisse, Deutsche Boerse, Goldman Sachs, JPMorgan Chase.

Some of the commonly cited benefits of open standards include:

*    Less chance of vendor lock-in
*    Interoperability
*    Broad availability of libraries and tooling
*    Protection against obsolescence
*    Availability of knowledgeable staff
*    Lower and manageable risk

## AMQP 1.0 and Service Bus

AMQP 1.0 support in Azure Service Bus means that you can now leverage the Service Bus queuing and publish/subscribe brokered messaging features from a range of platforms using an efficient binary protocol. Furthermore, you can build applications comprised of components built using a mix of languages, frameworks, and operating systems.

The following figure illustrates an example deployment in which Java clients running on Linux, written using the standard Java Message Service (JMS) API and .NET clients running on Windows, exchange messages via Service Bus using AMQP 1.0.

![][0]

**Figure 1: Example deployment scenario showing cross-platform messaging using Service Bus and AMQP 1.0**

At this time the following client libraries are known to work with Service Bus:

| Language | Library                                                                       |
|----------|-------------------------------------------------------------------------------|
| Java     | Apache Qpid Java Message Service (JMS) client<br/>IIT Software SwiftMQ Java client |
| C        | Apache Qpid Proton-C                                                          |
| PHP      | Apache Qpid Proton-PHP                                                        |
| Python   | Apache Qpid Proton-Python                                                     |


**Figure 2: Table of AMQP 1.0 client libraries**

For more information about how to obtain and use these libraries with Service Bus, see the [Service Bus AMQP Developer's Guide][]. See the "References" section below for further information.

## Summary

*    AMQP 1.0 is an open, reliable messaging protocol that you can use to build cross-platform, hybrid applications. AMQP 1.0 is an OASIS standard.
*    AMQP 1.0 support is now available in Azure Service Bus as well as Service Bus for Windows Server (Service Bus 1.1). Pricing is the same as for the existing protocols.

## References

*    [How to use AMQP 1.0 with the Service Bus .NET API](http://aka.ms/lym3vk)
*    [How to use the Java Message Service (JMS) API with Service Bus & AMQP 1.0](http://aka.ms/ll1fm3)
*    [Service Bus AMQP Developer's Guide](http://msdn.microsoft.com/library/jj841071.aspx)
*    [OASIS Advanced Message Queuing Protocol (AMQP) Version 1.0 specification](http://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-complete-v1.0-os.pdf)

[0]: ./media/service-bus-java-amqp-overview/Example1.png
[Service Bus AMQP Developer's Guide]: http://msdn.microsoft.com/library/jj841071.aspx

 
