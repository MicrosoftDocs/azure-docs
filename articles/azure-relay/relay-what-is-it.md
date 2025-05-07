---
title: What is Azure Relay? | Microsoft Docs
description: This article provides an overview of the Azure Relay service, which allows you to develop cloud applications that consume on-premises services running in your corporate network without opening a firewall connection or making intrusive changes to your network infrastructure.
ms.topic: overview
ms.date: 12/17/2024
---

# What is Azure Relay?
The Azure Relay service enables you to securely expose services that run in your corporate network to the public cloud. You can do so without opening a port on your firewall, or making intrusive changes to your corporate network infrastructure. 

The relay service supports the following scenarios between on-premises services and applications running in the cloud or in another on-premises environment. 

- Traditional one-way, request/response, and peer-to-peer communication 
- Event distribution at internet-scope to enable publish/subscribe scenarios 
- Bi-directional and unbuffered socket communication across network boundaries

Azure Relay differs from network-level integration technologies such as VPN. An Azure relay can be scoped to a single application endpoint on a single machine. The VPN technology is far more intrusive, as it relies on altering the network environment. 

## Basic flow
In the relayed data transfer pattern, the basic steps involved are:

1. An on-premises service connects to the relay service through an outbound port. 
2. It creates a bi-directional socket for communication tied to a particular address. 
3. The client can then communicate with the on-premises service by sending traffic to the relay service targeting that  address. 
4. The relay service then *relays* data to the on-premises service through the bi-directional socket dedicated to the client. The client doesn't need a direct connection to the on-premises service. It doesn't need to know the location of the service. And, the on-premises service doesn't need any inbound ports open on the firewall.


## Features 
Azure Relay has two features:

- [Hybrid Connections](#hybrid-connections) - Uses the open standard web sockets enabling multi-platform scenarios.
- [WCF Relays](#wcf-relay) - Uses Windows Communication Foundation (WCF) to enable remote procedure calls. WCF Relay is the legacy relay offering that many customers already use with their WCF programming models.

## Hybrid Connections

The Hybrid Connections feature in Azure Relay is a secure, and open-protocol evolution of the Relay features that existed earlier. You can use it on any platform and in any language. Hybrid Connections feature in Azure Relay is based on HTTP and WebSockets protocols. It allows you to send requests and receive responses over web sockets or HTTP(S). This feature is compatible with WebSocket API in common web browsers. 

For details on the Hybrid Connection protocol, see [Hybrid Connections protocol guide](relay-hybrid-connections-protocol.md). You can use Hybrid Connections with any web sockets library for any runtime/language.

> [!NOTE]
> Hybrid Connections of Azure Relay replaces the old Hybrid Connections feature of BizTalk Services. The Hybrid Connections feature in BizTalk Services was built on the Azure Service Bus WCF Relay. The Hybrid Connections capability in Azure Relay complements the pre-existing WCF Relay feature. These two service capabilities (WCF Relay and Hybrid Connections) exist side-by-side in the Azure Relay service. They share a common gateway, but are otherwise different implementations.

To get started with using Hybrid Connections in Azure Relay, see the following quick starts: 

- [Hybrid Connections - .NET WebSockets](relay-hybrid-connections-dotnet-get-started.md)
- [Hybrid Connections - Node WebSockets](relay-hybrid-connections-node-get-started.md)
- [Hybrid Connections - .NET HTTP](relay-hybrid-connections-http-requests-dotnet-get-started.md)
- [Hybrid Connections - Node HTTP](relay-hybrid-connections-http-requests-node-get-started.md)
- [Hybrid Connections - Java HTTP](relay-hybrid-connections-java-get-started.md)

For more samples, see [Azure Relay - Hybrid Connections samples on GitHub](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections).

## WCF Relay
WCF Relay works with the full .NET Framework and for WCF. You create a connection between your on-premises service and the relay service using a suite of WCF "relay" bindings. The relay bindings map to new transport binding elements designed to create WCF channel components that integrate with Service Bus in the cloud.

To get started with using WCF Relay, see the following quick starts: 

- [Expose an on-premises WCF service to a web app in the cloud](service-bus-dotnet-hybrid-app-using-service-bus-relay.md)
- [Expose an on-premises WCF service to a WCF client outside your network](service-bus-relay-tutorial.md)
- [Expose an on-premises WCF REST service to a client outside your network](service-bus-relay-rest-tutorial.md)

For more samples, see [Azure Relay - WCF Relay samples on GitHub](https://github.com/Azure/azure-relay/tree/master/samples/wcf-relay).

## Hybrid Connections vs. WCF Relay
Hybrid Connections and WCF Relay both enable secure connection to assets that exist within a corporate network. Use of one over the other depends on your particular needs, as described in the following table:

|  | WCF Relay | Hybrid Connections |
| --- |:---:|:---:|
| **WCF** |x | |
| **.NET Core** | |x |
| **.NET Framework** |x |x |
| **JavaScript/Node.js** | |x |
| **Standards-Based open protocol** | |x |
| **RPC programming models** | |x |

## Architecture: Processing of incoming relay requests
The following diagram shows you how incoming relay requests are handled by the Azure Relay service when both sending and receiving clients are outside a corporate network.

![Processing of Incoming WCF Relay Requests](./media/relay-what-is-it/process-flow.svg)

1. Listening client sends a listening request to the Azure Relay service. The Azure load balancer routes the request to one of the gateway nodes. 
2. The Azure Relay service creates a relay in the gateway store. 
3. Sending client sends a request to connect to the listening service. 
4. The gateway that receives the request looks up for the relay in the gateway store. 
5. The gateway forwards the connection request to the right gateway mentioned in the gateway store. 
6. The gateway sends a request to the listening client for it to create a temporary channel to the gateway node that's closest to the sending client. 
7. The listening client creates a temporary channel to the gateway that's closest to the sending client. Now that the connection is established between clients via a gateway, the clients can exchange messages with each other. 
8. The gateway forwards any messages from the listening client to the sending client. 
9. The gateway forwards any messages from the sending client to the listening client.  

## Next steps
Follow one or more of the following quick starts, or see [Azure Relay samples on GitHub](https://github.com/Azure/azure-relay/tree/master/samples).

- Hybrid Connections
    - [Hybrid Connections - .NET WebSockets](relay-hybrid-connections-dotnet-get-started.md)
    - [Hybrid Connections - Node WebSockets](relay-hybrid-connections-node-get-started.md)
    - [Hybrid Connections - .NET HTTP](relay-hybrid-connections-http-requests-dotnet-get-started.md)
    - [Hybrid Connections - Node HTTP](relay-hybrid-connections-http-requests-node-get-started.md)
- WCF Relay
    - [Expose an on-premises WCF service to a web app in the cloud](service-bus-dotnet-hybrid-app-using-service-bus-relay.md)
    - [Expose an on-premises WCF service to a WCF client outside your network](service-bus-relay-tutorial.md)
    - [Expose an on-premises WCF REST service to a client outside your network](service-bus-relay-rest-tutorial.md)

For a list of frequently asked questions and their answers, see [Relay FAQ](relay-faq.yml).
