<properties
	pageTitle="Service Bus Relayed Messaging"
	description="Overview of Service Bus relay."
	services="service-bus"
	documentationCenter=".net"
	authors="sethmanheim"
	manager="timlt"
	editor=""/>

<tags
	ms.service="service-bus"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="06/04/2015"
	ms.author="sethm"/>


# Service Bus relayed messaging

The central component of Service Bus is a centralized (but highly load-balanced) relay service that enables you to build hybrid applications that run in both an Azure datacenter and your own on-premises enterprise environment.  The relay service supports a variety of different transport protocols and web services standards. This includes SOAP, WS-*, and even REST. The Service Bus relay facilitates your hybrid applications by enabling you to securely expose Windows Communication Foundation (WCF) services that reside within a corporate enterprise network to the public cloud, without having to open a firewall connection, or require intrusive changes to a corporate network infrastructure. 

![Relay Concepts](./media/service-bus-relay-overview/sb-relay-01.png)

The relay service supports traditional one-way messaging, request/response messaging, and peer-to-peer messaging. It also supports event distribution at internet-scope to enable publish/subscribe scenarios and bi-directional socket communication for increased point-to-point efficiency. 

In the relayed messaging pattern, an on-premises service connects to the relay service through an outbound port and creates a bi-directional socket for communication tied to a particular rendezvous address. The client can then communicate with the on-premises service by sending messages to the relay service targeting the rendezvous address. The relay service will then "relay" messages to the on-premises service through the bi-directional socket already in place. The client does not need a direct connection to the on-premises service, it is not required to know where the service resides, and the on-premises service does not need any inbound ports open on the firewall.

You initiate the connection between your on-premise service and the relay service using a suite of WCF "relay" bindings. Behind the scenes, the relay bindings map to new transport binding elements designed to create WCF channel components that integrate with Service Bus in the cloud. 

## Next steps

For more information about Service Bus relay, see the following topics.

- [Azure Service Bus Architectural Overview](fundamentals-service-bus-hybrid-solutions.md)

- [How to Use the Service Bus Relay Service](service-bus-dotnet-how-to-use-relay.md)

 