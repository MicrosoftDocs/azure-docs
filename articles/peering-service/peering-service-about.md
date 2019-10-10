---
title: Microsoft Azure Peering Service | Microsoft Docs
description: Learn about Microsoft Azure Peering Service
services: peering-service
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2019
ms.author: v-meravi
---

# Peering Service Overview
## What is Peering Service? 

Peering Service is a networking service that aims at improving customer’s internet access to Microsoft Public services such as Office 365, Dynamics 365, SaaS services running on Azure or any Microsoft services accessible via public IP Azure. Microsoft has partnered with Internet Service Providers [ISP] and Internet Exchange Providers [IXP] to provide reliable and performant internet connectivity subject to technical requirements in terms of resiliency, geo redundancy and optimal routing (shortest paths and no intermediates in the routing path). 

By selecting Peering Service, an end user is selecting a Service Provider [SP], which is well connected to Microsoft through high capacity connections. These capacity connections are optimized for high throughput, better latency at an edge location that is closer to the user. Moreover, these  capacity connections are engineered for High Availability.

![optimal internet](./media/peering-service-about/peering-service-what.png)

Customers can also opt for Peering Service telemetry such as user latency measures to Microsoft network, BGP route monitoring, and alerts against leaks and hijacks by registering the Peering Service in the Azure Portal.  

> [!Note]
> To utilize the Peering Service, customer is not required to register with Microsoft.The only requirement is to reach out to a [certified Service Provider](peering-service-location-partners.md) to procure the service. However, to opt for Peering Service telemetry, the customer must register for the same in the Azure Portal.  
>To know how to register a Peering Service please refer [here](peering-service-azure-portal.md).  
>

## What Peering Service isn't about?
**Peering Service is not a private connectivity product like ExpressRoute or a VPN product.**

- It’s an IP service that uses the public internet.  

- It’s a collaboration platform with SPs and a value-added service that is intended to offer optimal and reliable routing to public SPs or SaaS traffic such as Office 365, Dynamics 365 or any SaaS traffic running on Azure.  

> [!Note]
> For more information about ExpressRoute please refer [here](https://docs.microsoft.com/en-us/azure/expressroute/)
>

## Background

Office 365, Dynamics 365,  and any other Microsoft SaaS services are hosted in multiple Microsoft data centers and can be accessed from any geographic location. The Microsoft Global Network has edge locations around the world where it can connect to an end user via their Service Provider (SP).  

Microsoft ensures the networking traffic egressing from the prefixes registered with Peering Service connection takes the nearest Edge locations on the Microsoft Global Network. The traffic stays in control over Microsoft network and can be tracked down for telemetry purposes. 

![first mile ](./media/peering-service-about/peering-service-background-final.png)

> [!Note]
> For more information about the Microsoft Global Network refer [here](https://docs.microsoft.com/en-us/azure/networking/microsoft-global-network).
>

## Key Customer Features

 -	Best Internet routing to Microsoft Cloud Services to achieve optimal performance. 
 -	Traffic insight such as latency, throughput, and so on.
 -	Route analytics and statistics. Events for route leak/hijack detection or non-optimal routing. 

## Why Peering Service?

Enterprises looking for “Internet first” access to the cloud or considering SD SD-WAN architecture or with high usage of Microsoft SaaS services need robust and performant internet connectivity. Peering Service enables the customers to make that transition happen. Microsoft and Service Providers have partnered to deliver reliable and performance centric public connectivity to the Microsoft cloud. Some of the key characteristics are discussed as below:

### 1. Robust, Reliable Peering

- **Local Redundancy**
   - Microsoft and SP interconnect across multiple edge locations to deliver Peering Service. In each location, interconnection must support failover across two routers. 
   - Each peering location is provisioned with redundant and diverse peering links.

- **Geo Redundancy**
   - Microsoft peers with Service Provider at multiple metro locations so that if one of the edge nodes has a degraded performance, the traffic routes to Microsoft via alternate sites. Microsoft routes traffic in its global network using SDN based routing policies for optimal performance. 

   - Ensures to use the shortest routing path by always choosing the nearest Edge POP to the end user and ensures the customer is one hop away from Microsoft​.  
 
![first mile ](./media/peering-service-about/peering-service-geo-shortest.png)

### 2. Optimal Routing

-  **Cold- potato**
    - Cold-potato routing technique offers control over the networking traffic by ensuring the networking packets are routed within the Microsoft network as much as possible.  

    - When traffic egresses, the chances of dropping off the traffic to the immediate point are possible. Cold-potato technique prevents the packets from the immediate drop off and ensures the best routing path is chosen to stay in the Microsoft network. 

    - Microsoft guarantees to use to utilize the cold-potato routing technique to provide better accessibility to the Microsoft networks. 
 
![first mile ](./media/peering-service-about/peering-service-cold-potato.png)

### 3. Monitoring platform

   - Network monitoring technology is offered to analyze the end user traffic, and provides the following capabilities:  

      - Internet route anomalies detection.

      - Latency from the user to the edge.

   - RADAR detects for route hijacks/leaks, origin autonomous exchange and the captures in the event logs.  

**Latency Reporting**

   - Microsoft measures the networking performance by validating the round-trip time taken from the client to reach the server. Based on which the latency reports are generated.  
   - Customer can view latency reports for different geographic locations.  

![latency reporting](./media/peering-service-about/peering-service-latency-report.png)
 
### 4. Secured Peering

- Ensures routing happens only via a preferred path that is defined when registering the customer with peering Service. 

- Microsoft guarantees to route the traffic via preferred path regardless of any malicious activity. 

## Next steps

- Learn about [Peering Service connection](peering-service-faq.md).

- Find a service provider. See [Peering Service partners and locations](peering-service-location-partners.md).

- Register the [Peering Service connection](peering-service-azure-portal).

- [Measure connection telemetry](peering-service-measure-connection-telemetry.md).
