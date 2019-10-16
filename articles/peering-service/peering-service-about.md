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

# What is Peering Service? 

Peering Service is a networking service that aims at enhancing customer connectivity to Microsoft Cloud services such as Office 365, Dynamics 365, SaaS services, Azure or any Microsoft services accessible via public internet. Microsoft has partnered with *Internet Service Providers [ISP]*, *Internet Exchange Providers [IXP]* and, *Software Defined Cloud Interconnect (SDCI)* providers, worldwide to provide highly reliable and performant public connectivity with the optimal routing to/from for the customers.

By selecting “*Peering Service*”, an end user is selecting a partner Service Provider [SP] in a given region, which is well connected to Microsoft through highly reliable interconnections. These connections are optimized for high reliability and minimal latency from  cloud services to the end user location.

![optimal internet](./media/peering-service-about/peering-service-what.png)

Customers can also opt for *Peering Service telemetry* such as user latency measures to Microsoft network, BGP route monitoring, and alerts against leaks and hijacks by registering the Peering Service in the Azure portal.  

To use the Peering Service, customer isn't required to register with Microsoft. The only requirement is to reach out to a [Peering Service partner](peering-service-location-partners.md) to procure the service. However, to opt for Peering Service telemetry, the customer must register for the same in the Azure portal.  

For instructions on how to register a Peering Service, refer [here](peering-service-azure-portal.md).  

## What Peering Service isn't about?

**Peering Service is not a private connectivity product like ExpressRoute or a VPN product.**

- It’s an IP service that uses the public internet.  

- It’s a collaboration platform with SPs and a value-added service that is intended to offer optimal and reliable routing to customer via partner service provider to Microsoft Cloud over the public network.

> [!Note]
> For more information about **ExpressRoute**, refer [here](https://docs.microsoft.com/en-us/azure/expressroute/)
>

## Background

Office 365, Dynamics 365,  and any other Microsoft SaaS services are hosted in multiple Microsoft data centers and can be accessed from any geographic location. The *Microsoft Global Network* has Edge locations around the world where it can connect to an end user via their Service Provider (SP).  

Microsoft and partner SPs ensure that traffic for the prefixes registered with Peering Service connection enters and exits the nearest Microsoft Edge (PoP) locations on the *Microsoft Global Network*. Microsoft ensures the networking traffic egressing from the prefixes registered with Peering Service connection takes the nearest Edge locations on the *Microsoft Global Network*.

![first mile ](./media/peering-service-about/peering-service-background-final.png)

> [!Note]
> For more information about the Microsoft Global Network, refer [here](https://docs.microsoft.com/en-us/azure/networking/microsoft-global-network).
>

## Why Peering Service?

Enterprises looking for “Internet first” access to the Cloud or considering SD-WAN architecture or with high usage of Microsoft SaaS services need robust and performant internet connectivity. *Peering Service* enables the customers to make that transition happen. Microsoft and Service Providers have partnered to deliver reliable and performance-centric public connectivity to the Microsoft Cloud. Some of the key customer features are listed below:

- Best  public routing over internet to Microsoft Cloud Services for optimal performance and reliability.
- Ability to select the preferred SP to connect to Microsoft cloud
- Traffic insights such as latency reporting, and prefix  monitoring.
- Optimum Network Hops (AS Hops) from Microsoft Cloud.
- **Route analytics and statistics** - Events for route anomalies (leak/hijack detection), and  suboptimal routing.

### Robust, Reliable Peering

- **Local Redundancy**
   - Microsoft and SP interconnect across multiple Edge locations to deliver *Peering Service*. In each location, interconnection must support failover across two routers.
   - Each peering location is provisioned with redundant and diverse peering links.

- **Geo Redundancy**
   - Microsoft interconnects with Service Provider at multiple metro locations so that if one of the edge nodes has degraded performance, the traffic routes to/from Microsoft via alternate sites. Microsoft routes traffic in its global network using SDN-based routing policies for optimal performance.

   - Ensures to use the shortest routing path by always choosing the nearest Microsoft Edge POP to the end user and ensures the customer is one network hop(AS hops) away from Microsoft​.  
 
![first mile ](./media/peering-service-about/peering-service-geo-shortest.png)

### Optimal Routing

-  **Cold-potato**

   -	Software defined cold-potato routing technique offers control over the networking traffic by ensuring the traffic stays on the Microsoft network as much as possible during the packet journey.

   -	When traffic egresses, the chances of exiting the Microsoft network close to the service (*Hot-potato*) are possible. Cold-potato technique prevents the packets from the immediate  exit  and ensures the best routing path is chosen to reach the destination.
 
![first mile ](./media/peering-service-about/peering-service-cold-potato.png)

### Monitoring platform

   Service monitoring is offered to analyze the end-user traffic and routing, and provides the following capabilities:  

-  **Internet route anomalies detection**
          
     - A service to detect and alert for any route anomaly events including route hijacks to the customer prefixes.

-  **End user latency**

      - Monitors the routing path for those prefixes registered with Peering Service and captures as event log for any failover events.

      - Measures the networking performance by validating the round-trip time taken from the client to reach the Edge. Customer can view latency reports for different geographic locations.

      - View latency reports for different geographic locations.

      - Captures failover events and notifies the customer.

![latency reporting](./media/peering-service-about/peering-service-latency-report.png)
 
### Traffic protection

- Ensures routing happens only via a preferred path that is defined when registering the customer with peering Service.

- Microsoft guarantees to route the traffic via preferred path even if there is any malicious activity detected.

- Route anomalies are reported in the Azure portal, if any.

## Next steps

To learn about peering Service concepts, see [Peering Service connection](peering-service-faq.md).

To find a Service Provider partner, see [Peering Service partners and locations](peering-service-location-partners.md).

To onboard the Peering Service connection, see [Peering Service connection](peering-service-onboarding-model.md).

To register the connection using Azure portal, see [Peering Service connection](peering-service-azure-portal.md.

To measure the telemetry, see [Measure connection telemetry](peering-service-measure-connection-telemetry.md).
