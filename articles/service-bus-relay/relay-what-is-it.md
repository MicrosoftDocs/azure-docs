---
title: What is Azure Relay and why use it overview | Microsoft Docs
description: Overview of Azure Relay
services: service-bus-relay
documentationcenter: .net
author: spelluru
manager: timlt
editor: ''

ms.assetid: 1e3e971d-2a24-4f96-a88a-ce3ea2b1a1cd
ms.service: service-bus-relay
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: get-started-article
ms.date: 10/03/2018
ms.author: spelluru

---
# What is Azure Relay?
The Azure Relay service enables you to securely expose services that run in your corporate network to the public cloud. You can do so without opening a firewall connection, or making intrusive changes to your corporate network infrastructure. 

The relay service supports the following scenarios between on-premises services and applications running in the cloud or in another on-premises environment. 

- Traditional one-way, request/response, and peer-to-peer traffic
- Event distribution at internet-scope to enable publish/subscribe scenarios 
- Bi-directional and unbuffered socket communication for increased point-to-point efficiency.

Azure Relay differs from network-level integration technologies such as VPN. An Azure relay can be scoped to a single application endpoint on a single machine. The VPN technology is far more intrusive, as it relies on altering the network environment. It provides TCP-like throttling, endpoint discovery, connectivity status, and endpoint security.

## Basic flow
In the relayed data transfer pattern, the basic steps involved are:

1. An on-premises service connects to the relay service through an outbound port. 
2. It creates a bi-directional socket for communication tied to a particular address. 
3. The client can then communicate with the on-premises service by sending traffic to the relay service targeting that  address. 
4. The relay service then *relays* data to the on-premises service through a bi-directional socket dedicated to each client. The client doesn't need a direct connection to the on-premises service. It doesn't need to know the location of the service. And, the on-premises service doesn't need any inbound ports open on the firewall.


## Features 
Azure Relay has two features:

- [Hybrid Connections](#hybrid-connections) - Uses the open standard web sockets enabling multi-platform scenarios.
- [WCF Relays](#wcf-relays) - Uses Windows Communication Foundation (WCF) to enable remote procedure calls. WCF Relay is the legacy relay offering that many customers already use with their WCF programming models.

## Hybrid Connections

The Hybrid Connections feature in Azure Relay is a secure, and open-protocol evolution of the Relay features that existed earlier. You can use it on any platform and in any language. Hybrid Connections feature in Azure Relay is based on HTTP and WebSockets protocols. It allows you to send requests and receive responses over web sockets and HTTP(S). This feature is compatible with WebSocket API in common web browsers. 

For details on the Hybrid Connection protocol, see [Hybrid Connections protocol guide](relay-hybrid-connections-protocol.md). You can use Hybrid Connections with any web sockets library for any runtime/language.

> [!NOTE]
> Hybrid Connections of Azure Relay replaces the old Hybrid Connections feature of BizTalk Services. The Hybrid Connections feature in BizTalk Services was built on the Azure Service Bus WCF Relay. The Hybrid Connections capability in Azure Relay complements the pre-existing WCF Relay feature. These two service capabilities (WCF Relay and Hybrid Connections) exist side-by-side in the Azure Relay service. They share a common gateway, but are otherwise different implementations.

## WCF Relay
WCF Relay works with the full .NET Framework and for WCF. You create a connection between your on-premises service and the relay service using a suite of WCF "relay" bindings. Behind the scenes, the relay bindings map to new transport binding elements designed to create WCF channel components that integrate with Service Bus in the cloud. For more information, see [getting started with WCF Relay](relay-wcf-dotnet-get-started.md).

## Hybrid Connections vs. WCF Relay
Hybrid Connections and WCF Relay both enable secure connection to assets that exist within a corporate network. Use of one over the other depends on your particular needs, as described in the following table:

|  | WCF Relay | Hybrid Connections |
| --- |:---:|:---:|
| **WCF** |x | |
| **.NET Core** | |x |
| **.NET Framework** |x |x |
| **Java script/Node.JS** | |x |
| **Standards-Based open protocol** | |x |
| **Multiple RPC programming models** | |x |

## Architecture: Processing of incoming relay requests

![Processing of Incoming WCF Relay Requests](./media/relay-what-is-it/ic690645.png)

1. Listening client sends a listening request to the Azure Relay service. The Azure load balancer routes the request to one of the gateway nodes. 
2. The Azure Relay service creates a relay in the gateway store. 
3. Sending client sends a request to connect to the listening service. 
4. The gateway that receives the request looks up for the relay in the gateway store. 
5. The gateway forwards the connection request to the right gateway mentioned in the gateway store. 
6. The gateway sends a request to the listening client for it to create a temporary channel to the gateway node that's closest to the sending client. 
7. Now, the listening client creates a temporary channel and sends a response message to the gateway that's closest to the sending client.
8. The gateway forwards the response message to the sending client. 

When the relay connection is established, the clients can exchange messages via the gateway node that is used for the rendezvous.

## Next steps
* [Get started with .NET Websockets](relay-hybrid-connections-dotnet-get-started.md)
* [Get started with .NET HTTP Requests](relay-hybrid-connections-http-requests-dotnet-get-started.md)
* [Get started with Node Websockets](relay-hybrid-connections-node-get-started.md)
* [Get started with Node HTTP Requests](relay-hybrid-connections-http-requests-node-get-started.md)
* [Relay FAQ](relay-faq.md)

