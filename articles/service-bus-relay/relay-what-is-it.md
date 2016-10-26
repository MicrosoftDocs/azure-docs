<properties
	pageTitle="What is Azure relay? | Microsoft Azure"
	description="Overview of Azure Relay"
	services="service-bus"
	documentationCenter=".net"
	authors="banisadr"
	manager="timlt"
	editor="" />

<tags
	ms.service="service-bus"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="11/01/2016"
	ms.author="babanisa" />

# What is Azure Relay?

Azure Relay service facilitates your hybrid applications by enabling you to securely expose services that reside within a corporate enterprise network to the public cloud, without having to open a firewall connection, or require intrusive changes to a corporate network infrastructure. Relay allows you to build applications that run in both an Azure datacenter and your own on-premises enterprise environment. Relay supports a variety of different transport protocols and web services standards. This includes SOAP, WS-*, and REST.

The relay service supports traditional one-way messaging, request/response messaging, and peer-to-peer messaging. It also supports event distribution at internet-scope to enable publish/subscribe scenarios and bi-directional socket communication for increased point-to-point efficiency. 

In the relayed messaging pattern, an on-premises service connects to the relay service through an outbound port and creates a bi-directional socket for communication tied to a particular rendezvous address. The client can then communicate with the on-premises service by sending messages to the relay service targeting the rendezvous address. The relay service will then "relay" messages to the on-premises service through the bi-directional socket already in place. The client does not need a direct connection to the on-premises service, it is not required to know where the service resides, and the on-premises service does not need any inbound ports open on the firewall.

The key capability elements provided by Relay are bi-directional, unbuffered communication across network boundaries with TCP-like throttling, endpoint discovery, presence information, and overlaid endpoint security. Relay's capabilities differ from network-level integration technologies such as VPN in that it can be scoped to a single application on a single machine, while VPN technology is far more intrusive as it relies on altering the network environment.

Azure Relay has two offerings:

1. [Hybrid Connections](#hybrid-connections) - Uses the open standard Web Sockets

2. [WCF Relays](#wcf-relays) - Uses Windows Communication Foundation

Hybrid Connections and WCF Relays both enable secure connection to assests that exist within a corporate enterprise network. Use of one over the other is dependant on your particular needs detailed below:

|                                 | WCF Relay | Hybrid Connections |
| ------------------------------- |:---------:| :-----------------:|
| **WCF**                         |     x     |                    |
| **NETFX**                       |     x     |                    |
| **Standards-Based Protocol**    |           |         x          |
| **Open Protocol Documentation** |           |         x          |
| **Apache Thrift**               |           |         x          |
| **NodeJS**                      |           |         x          |
| **In-Browser JavaScript**       |           |         x          |
| **.NET Standard**               |           |         x          |
| **Java***                       |           |         x          |
*<sup><sub>By General Availability</sub></sup>

## Hybrid Connections

Azure Relay's Hybrid Connections capability is a secure, open-protocol evolution of the existing Relay features that can be implemented on any platform and in any language that has a basic WebSocket capability, which explicitly includes the WebSocket API in common web browsers. Hybrid Connections based on HTTP and WebSockets.

Hybrid Connections supersedes the former, equally named "BizTalk Services" feature that was built on the Azure Service Bus WCF Relay. The new Hybrid Connections capability complements the existing WCF Relay and these two service capabilities will exist side-by-side in the Relay service for the foreseeable future; they share a common gateway, but are otherwise different implementations. 

Hybrid Connections allows establishing bi-directional, binary stream communication between two networked applications, whereby either or both of the parties can reside behind NATs or Firewalls. The “listener” that accepts relayed connections and the “sender” that initiates connections can both be implemented on any platform and in any language that has a basic WebSocket capability, which explicitly includes the WebSocket API in common web browsers. 

## WCF Relays

The WCF Relay works for the full .NET Framework (NETFX) and for WCF. You initiate the connection between your on-premise service and the relay service using a suite of WCF "relay" bindings. Behind the scenes, the relay bindings map to new transport binding elements designed to create WCF channel components that integrate with Service Bus in the cloud.  

## Next steps:

- [Create a namespace](relay-create-namespace-portal.md)