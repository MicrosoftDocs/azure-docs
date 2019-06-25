---
title: Azure Front Door Service - Load Balancing with Azure's application delivery suite | Microsoft Docs
description: This article helps you learn about how Azure recommends load balancing with it's application delivery suite
services: frontdoor
documentationcenter: ''
author: sharad4u
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/10/2018
ms.author: sharadag
---

# Load-balancing with Azure’s application delivery suite

## Introduction
Microsoft Azure provides multiple global and regional services for managing how your network traffic is distributed and load balanced: Traffic Manager, Front Door Service, Application Gateway, and Load Balancer.  Along with Azure’s many regions and zonal architecture, using these services together enable you to build robust, scalable high-performance applications.

![Application Delivery Suite ][1]
 
These services are broken into two categories:
1. **Global load balancing services** such as Traffic Manager and Front Door distribute traffic from your end users across your regional backends, across clouds or even your hybrid on-premises services. Global load balancing routes your traffic to your closest service backend and reacts to changes in service reliability or performance to maintain always-on, maximal performance for your users. 
2. **Regional load balancing services** such as Standard Load Balancer or Application Gateway provide the ability to distribute traffic within virtual networks (VNETs) across your virtual machines (VMs) or zonal service endpoints within a region.

Combining global and regional services in your application provides an end-to-end reliable, performant, and secure way to route traffic to and from your users to your IaaS, PaaS, or on-premises services. In the next section, we describe each of these services.

## Global load balancing
**Traffic Manager** provides global DNS load balancing. It looks at incoming DNS requests and responds with a healthy backend, in accordance with the routing policy the customer has selected. Options for routing methods are:
- Performance routing to send the requestor to the closest backend in terms of latency.
- Priority routing to direct all traffic to a backend, with other backends as back up.
- Weighted round-robin routing, which distributes traffic based on the weighting that is assigned to each backend.
- Geographic routing to ensure that requestors located in specific geographic regions are directed to the backends mapped to those regions (for example, all requests from Spain should be directed to the France Central Azure region)
- Subnet routing that allows you to map IP address ranges to backends so that requests coming from those will be sent to the specified backend (for example, all users connecting from your corporate HQ’s IP address range should get different web content than the general users)

The client connects directly to that backend. Azure Traffic Manager detects when a backend is unhealthy and then redirects the clients to another healthy instance. Refer to [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) documentation to learn more about the service.

**Azure Front Door Service** provides dynamic website acceleration (DSA) including global HTTP load balancing.  It looks at incoming HTTP requests routes to the closest service backend / region for the specified hostname, URL path, and configured rules.  
Front Door terminates HTTP requests at the edge of Microsoft’s network and actively probes to detect application or infrastructure health or latency changes.  Front Door then always routes traffic to the fastest and available (healthy) backend. Refer to Front Door's [routing architecture](front-door-routing-architecture.md) details and [traffic routing methods](front-door-routing-methods.md) to learn more about the service.

## Regional load balancing
Application Gateway provides application delivery controller (ADC) as a service, offering various Layer 7 load-balancing capabilities for your application. It allows customers to optimize web farm productivity by offloading CPU-intensive SSL termination to the application gateway. Other Layer 7 routing capabilities include round-robin distribution of incoming traffic, cookie-based session affinity, URL path-based routing, and the ability to host multiple websites behind a single application gateway. Application Gateway can be configured as an Internet-facing gateway, an internal-only gateway, or a combination of both. Application Gateway is fully Azure managed, scalable, and highly available. It provides a rich set of diagnostics and logging capabilities for better manageability.
Load Balancer is an integral part of the Azure SDN stack, providing high-performance, low-latency Layer 4 load-balancing services for all UDP and TCP protocols. It manages inbound and outbound connections. You can configure public and internal load-balanced endpoints and define rules to map inbound connections to back-end pool destinations by using TCP and HTTP health-probing options to manage service availability.


## Choosing a global load balancer
When choosing a global load balancer between Traffic Manager and Azure Front Door for global routing, you should consider what’s similar and what’s different about the two services.   Both services provide
- **Multi-geo redundancy:** If one region goes down, traffic seamlessly routes to the closest region without any intervention from the application owner.
- **Closest region routing:** Traffic is automatically routed to the closest region

</br>The following table describes the differences between Traffic Manager and Azure Front Door Service:</br>

| Traffic Manager |	Azure Front Door Service |
| --------------- | ------------------------ |
|**Any protocol:** Because Traffic Manager works at the DNS layer, you can route any type of network traffic; HTTP, TCP, UDP, etc. | **HTTP acceleration:** With Front Door traffic is proxied at the Edge of Microsoft’s network.  Because of this, HTTP(S) requests see latency and throughput improvements reducing latency for SSL negotiation and using hot connections from AFD to your application.|
|**On-premises routing:** With routing at a DNS layer, traffic always goes from point to point.  Routing from your branch office to your on premises datacenter can take a direct path; even on your own network using Traffic Manager. | **Independent scalability:** Because Front Door works with the HTTP request, requests to different URL paths can be routed to different backend / regional service pools (microservices) based on rules and the health of each application microservice.|
|**Billing format:** DNS-based billing scales with your users and for services with more users, plateaus to reduce cost at higher usage. |**Inline security:** Front Door enables rules such as rate limiting and IP ACL-ing to let you protect your backends before traffic reaches your application. 

</br>Because of the performance, operability and security benefits to HTTP workloads with Front Door, we recommend customers use Front Door for their HTTP workloads.    Traffic Manager and Front Door can be used in parallel to serve all traffic for your application. 

## Building with Azure’s application delivery suite 
We recommend that all websites, APIs, services be geographically redundant and deliver traffic to its users from the closest (lowest latency) location to them whenever possible.  Combining services from Traffic Manager, Front Door Service, Application Gateway, and Load Balancer enables you to build geographically and zonally redundant to maximize reliability, scale, and performance.

In the following diagram, we describe an example service that uses a combination of all these services to build a global web service.   In this case, the architect has used Traffic Manager to route to global backends for file and object delivery, while using Front Door to globally route URL paths that match the pattern /store/* to the service they’ve migrated to App Service while routing all other requests to regional Application Gateways.

In the region, for their IaaS service, the application developer has decided that any URLs that match the pattern /images/* are served from a dedicated pool of VMs that are different from the rest of the web farm.

Additionally, the default VM pool serving the dynamic content needs to talk to a back-end database that is hosted on a high-availability cluster. The entire deployment is set up through Azure Resource Manager.

The following diagram shows the architecture of this scenario:

![Application Delivery Suite Detailed Architecture][2] 

> [!NOTE]
> This example is only one of many possible configurations of the load-balancing services that Azure offers. Traffic Manager, Front Door, Application Gateway, and Load Balancer can be mixed and matched to best suit your load-balancing needs. For example, if SSL offload or Layer 7 processing is not necessary, Load Balancer can be used in place of Application Gateway.


## Next Steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).

<!--Image references-->
[1]: ./media/front-door-lb-with-azure-app-delivery-suite/application-delivery-figure1.png
[2]: ./media/front-door-lb-with-azure-app-delivery-suite/application-delivery-figure2.png
