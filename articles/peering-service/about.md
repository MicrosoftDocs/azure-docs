---
title: Azure Peering Service Preview Overview
description: Learn about Azure Peering Service Overview
services: peering-service
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: Infrastructure-services
ms.date: 11/04/2019
ms.author: v-meravi
---

# Azure Peering Service Preview Overview

Azure Peering Service is a networking service that enhances customer connectivity to Microsoft cloud services such as Office 365, Dynamics 365, software as a service (Saas) services, Azure, or any Microsoft services accessible via the public internet. Microsoft has partnered with internet service providers (ISP), internet exchange partners (IXP) and, software-defined cloud interconnect (SDCI) providers worldwide to provide reliable, and high-performing public connectivity with optimal routing from the customer to the Microsoft network.

With Peering Service, customer can select a well connected partner service provider (SP) in a given region. Public connectivity is optimized for high reliability and minimal latency from cloud services to the end-user location.

![Distributed connectivity to Microsoft Cloud](./media/peering-service-about/peering-service-what.png)

Customers can also opt for Peering Service telemetry such as user latency measures to Microsoft network, BGP route monitoring, and alerts against leaks, and hijacks by registering the Peering Service connection in the Azure portal.  

To use Peering Service, customer isn't required to register with Microsoft. The only requirement is to reach out to a [Peering Service partner](location-partners.md) to procure the service. However, to opt for Peering Service telemetry, customer must register for the same in the Azure portal.  

For instructions on how to register the Peering Service, refer [here](azure-portal.md).  

> [!Note]
> This article is intended for network architects in charge of enterprise connectivity to the cloud and to the internet.

>
> [!IMPORTANT]
> "Peering Service” is currently in public preview.
> This preview version is provided without a service level agreement. We don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## What is Peering Service?

Peering Service is:

- An IP service that uses the public internet.  

- A collaboration platform with SPs and a value-added service that is intended to offer optimal and reliable routing to the customer via service provider partner to the Microsoft Cloud over the public network.

Peering Service is not a private connectivity product like Azure ExpressRoute or a VPN product.

> [!Note]
> For more information about **ExpressRoute**, refer [here](https://docs.microsoft.com/azure/expressroute/)
>

## Background

Office 365, Dynamics 365, and any other Microsoft SaaS services are hosted in multiple Microsoft data centers and can be accessed from any geographic location. The *Microsoft Global Network* has Microsoft Edge Point of Presence (PoP) locations around the world where it can connect to an end user via their service providers.  

Microsoft and partner service providers ensure the traffic for the prefixes registered with Peering Service connection enters and exits the nearest Microsoft Edge PoP locations on the *Microsoft Global Network*. Microsoft ensures the networking traffic egressing from the prefixes registered with Peering Service connection takes the nearest Microsoft Edge PoP locations on the *Microsoft Global Network*.

![Microsoft Network and Public connectivity](./media/peering-service-about/peering-service-background-final.png)

> [!Note]
> For more information about the Microsoft Global Network, refer [here](https://docs.microsoft.com/azure/networking/microsoft-global-network).
>

## Why use Peering Service?

Enterprises looking for internet-first access to the Cloud or considering SD-WAN architecture or with high usage of Microsoft SaaS services need robust and high-performing internet connectivity. Customers can make that transition happen by using Peering Service. Microsoft and service providers have partnered to deliver reliable and performance-centric public connectivity to the Microsoft Cloud. Some of the key customer features are listed below:

- Best public routing over internet to <i>Microsoft Cloud Services</i> for optimal performance and reliability.
- Ability to select the preferred SP to connect to Microsoft cloud.
- Traffic insights such as latency reporting, and prefix monitoring.
- Optimum Network Hops (AS Hops) from the Microsoft cloud.
- **Route analytics and statistics** - Events for ([BGP](https://en.wikipedia.org/wiki/Border_Gateway_Protocol)) route anomalies (leak/hijack detection), and suboptimal routing.

### Robust, Reliable Peering

Peering Service uses two types of redundancy:

- **Local Redundancy**

   Microsoft and service providers interconnect across multiple Microsoft Edge PoP locations to deliver Peering Service. In each location, interconnection must support failover across two routers.

   Each peering location is provisioned with redundant and diverse peering links.

- **Geo-redundancy**

   Microsoft has interconnected with the service providers at multiple metro locations so that if one of the edge nodes has degraded performance, the traffic routes to/from Microsoft via alternate sites. Microsoft routes traffic in its global network using SDN-based routing policies for optimal performance.

   Ensures to use the shortest routing path by always choosing the nearest Microsoft Edge POP to the end user and ensures the customer is one network hop (AS hops) away from Microsoft​.  

   ![Geo Redundancy](./media/peering-service-about/peering-service-geo-shortest.png)

### Optimal Routing

-  **Cold-potato**

   Software defined cold-potato routing technique offers control over network traffic originating from the Microsoft Cloud. It ensures that traffic stays on the high capacity, low latency, and highly reliable Microsoft Global Network until it's as close to the destination as possible.
   
   Routing that doesn't use the cold-potato technique is referred to as hot-potato routing. Traffic that originates from the Microsoft cloud then goes over the internet.

   ![Cold-potato routing](./media/peering-service-about/peering-service-cold-potato.png)

### Monitoring platform

   Service monitoring is offered to analyze customer traffic and routing, and it provides the following capabilities:  

-  **Internet BGP route anomalies detection**
          
   This service to detect and alert for any route anomaly events like route hijacks to the customer prefixes.

-  **Customer latency**

   This service monitors the routing performance between the customer's location and Microsoft. 
   
   Routing performance is measured by validating the round-trip time taken from the client to reach the Microsoft Edge PoP. Customer can view the latency reports for different geographic locations.

   Monitoring captures the events in case of any service degradation.

   ![Monitoring platform for Peering Service](media/peering-service-about/peering-service-latency-report.png)

### Traffic protection

Routing happens only via a preferred path that's defined when the customer is registered with peering Service.

Microsoft guarantees to route the traffic via preferred path even if malicious activity is detected.

BGP route anomalies are reported in the Azure portal, if any.

## Next steps

To learn about Peering Service connection, see [Peering Service connection](connection.md).

To learn about Peering Service connection telemetry, see [Peering Service connection telemetry](connection-telemetry.md).

To find a Service Provider partner, see [Peering Service partners and locations](location-partners.md).

To onboard Peering Service connection, see [Onboarding Peering Service model](onboarding-model.md).

To register a connection using the Azure portal, see [Register Peering Service connection using the Azure portal](azure-portal.md).

To measure telemetry, see [Measure connection telemetry](measure-connection-telemetry.md).
