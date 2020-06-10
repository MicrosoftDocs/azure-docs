---
title: Introduction to Azure Service Fabric networking 
description: Learn about networks, gateways, and intelligent traffic routing in Service Fabric Mesh.
author: dkkapur
ms.topic: conceptual
ms.date: 11/26/2018
ms.author: dekapur
ms.custom: mvc, devcenter 

---
# Introduction to networking in Service Fabric Mesh applications
This article describes different types of load balancers, how gateways connect the network with your applications to other networks, and how traffic is routed between the services in your applications.

## Layer 4 vs layer 7 load balancers
Load balancing can be performed at different layers in the [OSI model](https://en.wikipedia.org/wiki/OSI_model) for networking, often in layer 4 (L4) and layer 7 (L7).  Typically, there are two types of load balancers:

- An L4 load balancer works at the networking transport layer, which deals with delivery of packets with no regard to the content of the packets. Only packet headers are inspected by the load balancer, so the balancing criteria is limited to IP addresses and ports. For example, a client makes a TCP connection to the load balancer. The load balancer terminates the connection (by responding directly to the SYN), selects a backend, and makes a new TCP connection to the backend (sends a new SYN). An L4 load balancer typically operates only at the level of the L4 TCP/UDP connection or session. Thus the load balance redirects bytes around and makes sure that bytes from the same session wind up at the same backend. The L4 load balancer is unaware of any application details of the bytes that it is moving. The bytes could be any application protocol.

- An L7 load balancer works at the application layer, which deals with the content of each packet. It inspects packet contents because it understands protocols such as HTTP, HTTPS, or WebSockets. This gives the load balancer the ability to perform advanced routing. For example, a client makes a single HTTP/2 TCP connection to the load balancer. The load balancer then proceeds to make two backend connections. When the client sends two HTTP/2 streams to the load balancer, stream one is sent to backend one and stream two is sent to backend two. Thus, even multiplexing clients that have vastly different request loads will be balanced efficiently across the backends. 

## Networks and gateways
In the [Service Fabric Resource Model](service-fabric-mesh-service-fabric-resources.md), a Network resource is an individually deployable resource, independent of an Application or Service resource that may refer to it as their dependency. It is used to create a network for your applications that is open to the internet. Multiple services from different applications can be a part of the same network. This private network is created and managed by Service Fabric and is not an Azure virtual network (VNET). Applications can be dynamically added and removed from the network resource to enable and disable VNET connectivity. 

A gateway is used to bridge two networks. The Gateway resource deploys an [Envoy proxy](https://www.envoyproxy.io/) that provides L4 routing for any protocol and L7 routing for advanced HTTP(S) application routing. The gateway routes traffic into your network from an external network and determines which service to route traffic to.  The external network could be an open network (essentially, the public internet) or an Azure virtual network, allowing you to connect with your other Azure applications and resources. 

![Network and gateway][Image1]

When the network resource is created with `ingressConfig`, a public IP is assigned to the network resource. The public IP will be tied to the lifetime of the network resource.

When a Mesh application is created, it should reference an existing network resource. New public ports can be added or existing ports can be removed from the ingress configuration. A delete for a network resource will fail if an application resource is referencing it. When the application is deleted, the network resource is removed.

## Next steps 
To learn more about Service Fabric Mesh, read the overview:
- [Service Fabric Mesh overview](service-fabric-mesh-overview.md)

[Image1]: media/service-fabric-mesh-networks-and-gateways/NetworkAndGateway.png