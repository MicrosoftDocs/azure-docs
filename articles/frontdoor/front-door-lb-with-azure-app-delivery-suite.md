---
title: Azure Front Door - Load Balancing with Azure's application delivery suite | Microsoft Docs
description: This article helps you learn about how Azure recommends load balancing with its application delivery suite
services: frontdoor
documentationcenter: ''
author: duongau
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/28/2020
ms.author: duau
---

# Load-balancing with Azure’s application delivery suite

## Introduction
Microsoft Azure provides various global and regional services for managing how your network traffic is distributed and load balanced: 

* Application Gateway
* Front Door 
* Load Balancer  
* Traffic Manager

Along with Azure’s many regions and zonal architecture, using these services together can enable you to build robust, scalable, and high-performance applications.

:::image type="content" source="./media/front-door-lb-with-azure-app-delivery-suite/application-delivery-figure1.png" alt-text="Application Delivery Suite":::
 
These services are broken into two categories:
1. **Global load-balancing services** such as Traffic Manager and Front Door distribute traffic from your end users across your regional backends, across clouds and even your hybrid on-premises services. Global load balancing routes your traffic to your closest service backend and reacts to changes in service reliability to maintain always-on availability and high performance for your users. 
1. **Regional load-balancing services** such as Load Balancers and Application Gateways provide the ability to distribute traffic to virtual machines (VMs) within a virtual network (VNETs) or service endpoints within a region.

When you combine these global and regional services, your application will benefit from reliable and secured end-to-end traffic that gets sent from your end users to your IaaS, PaaS, or on-premises services. In the next section, we describe each of these services.

## Global load balancing
**Traffic Manager** provides global DNS load balancing. It looks at incoming DNS requests and responds with a healthy backend, following the routing policy the customer has selected. Options for routing methods are:
- **Performance routing sends requests to the closest backend with the least latency.
- **Priority routing** direct all traffic to a backend, with other backends as backup.
- **Weighted round-robin routing** distributes traffic based on the weighting that is assigned to each backend.
- **Geographic routing** ensures requests that get sourced from specific geographical regions get handled by backends mapped for those regions. (For example, all requests from Spain should be directed to the France Central Azure region)
- **Subnet routing** allows you to map IP address ranges to backends, so that incoming requests for those IPs will be sent to the specific backend. (For example, any users that connect from your corporate HQ’s IP address range should get different web content than the general users)

The client connects directly to that backend. Azure Traffic Manager detects when a backend is unhealthy and then redirects the clients to another healthy instance. Refer to [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) documentation to learn more about the service.

**Azure Front Door** provides dynamic website acceleration (DSA) including global HTTP load balancing.  It looks at incoming HTTP requests routes to the closest service backend / region for the specified hostname, URL path, and configured rules.  
Front Door terminates HTTP requests at the edge of Microsoft’s network and actively probes to detect application or infrastructure health or latency changes.  Front Door then always routes traffic to the fastest and available (healthy) backend. Refer to Front Door's [routing architecture](front-door-routing-architecture.md) details and [traffic routing methods](front-door-routing-methods.md) to learn more about the service.

## Regional load balancing
Application Gateway provides application delivery controller (ADC) as a service, offering various Layer 7 load-balancing capabilities for your application. It allows customers to optimize web farm productivity by offloading CPU-intensive TLS termination to the application gateway. Other additional Layer 7 routing capabilities also include round-robin distribution of incoming traffic, cookie-based session affinity, URL path-based routing, and the ability to host multiple websites behind a single application gateway. 
Application Gateway can be configured as an Internet-facing endpoint, an internal-only endpoint, or a combination of both. Application Gateway is fully Azure managed, providing you with scalability, and highly availability. It provides a rich set of diagnostics and logging capabilities for better manageability.

Load Balancers are an integral part of the Azure SDN stack, which provides you with high-performance, low-latency Layer 4 load-balancing services for all UDP and TCP protocols. You can configure public or internal load-balanced endpoints by defining rules that map inbound connections to back-end pools. With health-probing monitoring using TCP or HTTPS, it can help you manage your service availability.

## Choosing a global load balancer
When choosing a global load balancer between Traffic Manager and Azure Front Door for global routing, you should consider what’s similar and what’s different about the two services.   Both services provide
- **Multi-geo redundancy:** If one region goes out of service, traffic seamlessly routes to the closest region without any intervention from the application owner.
- **Closest region routing:** Traffic is automatically routed to the closest region

</br>The following table describes the differences between Traffic Manager and Azure Front Door:</br>

| Traffic Manager |	Azure Front Door |
| --------------- | ------------------------ |
|**Any protocol:** Since Traffic Manager works at the DNS layer, you can route any type of network traffic; HTTP, TCP, UDP, and so on. | **HTTP acceleration:** With Front Door, traffic is proxied at the edge of the Microsoft network. HTTP/S requests will see latency and throughput improvements, which reduce latency for TLS negotiation.|
|**On-premises routing:** With routing at a DNS layer, traffic always goes from point to point.  Routing from your branch office to your on premises datacenter can take a direct path; even on your own network using Traffic Manager. | **Independent scalability:** Since Front Door works with the HTTP request, requests to different URL paths can be routed to different backend / regional service pools (microservices) based on rules and the health of each application microservice.|
|**Billing format:** DNS-based billing scales with your users and for services with more users, plateaus to reduce cost at higher usage. |**Inline security:** Front Door enables rules such as rate limiting and IP ACL-ing to let you protect your backends before traffic reaches your application. 

</br>We recommend customers to use Front Door for their HTTP workload because of the performance, operability, and security benefits that HTTP works with Front Door. Traffic Manager and Front Door can be used in parallel to serve all traffic for your application. 

## Building with Azure’s application delivery suite 
We recommend all websites, APIs, services be geographically redundant so it can deliver traffic to its users from the nearest location whenever possible.  Combining multiple load-balancing services enables you to build geographical and zonal redundancy to maximize reliability and performance.

In the following diagram, we describe an example architecture that uses a combination of all these services to build a global web service. The architect used Traffic Manager to route traffic to global backends for file and object delivery. While using Front Door, to globally route URL paths that match the pattern /store/* to the service they’ve migrated to App Service. Lastly, routing all other requests to regional Application Gateways.

In each region of IaaS service, the application developer has decided that any URLs that match the pattern /images/* get served from a dedicated pool of VMs. This pool of VMs is different from the rest of the web farm.

Additionally, the default VM pool serving the dynamic content needs to talk to a back-end database that is hosted on a high-availability cluster. The entire deployment is configured through Azure Resource Manager.

The following diagram shows the architecture of this scenario:

:::image type="content" source="./media/front-door-lb-with-azure-app-delivery-suite/application-delivery-figure2.png" alt-text="Application Delivery Suite Detailed Architecture":::

> [!NOTE]
> This example is only one of many possible configurations of the load-balancing services that Azure offers. Traffic Manager, Front Door, Application Gateway, and Load Balancer can be mixed and matched to best suit your load-balancing needs. For example, if TLS/SSL offload or Layer 7 processing is not necessary, Load Balancer can be used in place of Application Gateway.

## Next Steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
