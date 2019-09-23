---
title: Microsoft Azure Peering Service | Microsoft Docs
description: Learn about Microsoft Azure Peering Service
services: peering-service
author: ypitsch
manager: 
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 
ms.author: ypitsch
---

# Microsoft Azure Peering Service (MAPS) Overview

## What is Peering Service? 
Peering Service is otherwise referred to Microsoft Azure Peering Service [MAPS]. It is a thought process that redefines the engineering to achieve fast, reliable, high throughput internet experience in edge computing environment. It works on the partnership program with key Internet Service Providers and Internet Exchange partners based on the SLA agreement. 

Peering Service ensures data packets are routed to the nearest edge point [POP], regardless of packet forwarding and returning. By selecting MAPS, an end-user is selecting an SP which is well connected to Microsoft through high capacity connections. These high capacity connections are optimized for high throughput, better latency and at an edge location that is close to the user. Moreover, this high capacity connections are engineered for High Availability (HA) which is necessary for SLA.

![background](media\peering-service-about\peering-service-what.png)

## Background
Microsoft Global Network has edge locations around the world where it can connect to an end-user via its Service Provider (SP). In the Networking traffic, the link connecting the end-user and ISP is referred as Last-Mile and the link connecting the data center and edge site [POP] is referred as First-Mile. Microsoft Global Network will do the optimal routing of the First Mile that links the edge site to the Data Center [DC]. However, optimizing the traffic route for Last Mile is challenging as it is bounded to ISP’s to which the customer will procure services. 

![background](media\peering-service-about\peering-service-background1.png)
## Prime Focus 
-	How to prioritize networking traffic over global network?
-	How to optimize last mile portion in networking?
-	What Microsoft can offer in the areas bounded with ISPs to achieve high throughput?
-	Though the entry path can be optimized by choosing nearest edge POP, how to ensure the same in the exit? 
-	Is there a possibility to monitor network latency?

![background](media\peering-service-about\peering-service-process-flow.png)

Microsoft came up with a concept ‘Peering Service’ also known as MAPS [Microsoft Azure Peering Service] that works on the partnership program with Internet Service Providers and Internet Exchange Partners to provide best-in-class internet experience for enterprise users. Commensurate to the SLA agreement made between Microsoft and Partners, preferences are set for subscribed users to navigate the traffic path through optimal ones.


## Key Customer Features
-	Best Internet routing to Microsoft Cloud Services to achieve optimal performance 
-	Traffic insight such as latency, throughput, packet loss for last mile, mid mile and first mile connectivity 
-	Route analytics and statistics. Events for route leak/hijack detection or non-optimal routing 
-	SLA on network-availability and packet-delivery on its network (TBD) 


## Why Peering Service?
From a business perspective, large scale enterprise users should opt for a redefined technique to get well connected with Microsoft network. Microsoft offers such capability through Peering Services by partnering with respective ISP’s. 
By purchasing Peering Service, every time a packet enters, and exits are ensured to take the route nearest to the edge point, by default. This is achieved by defining a strategy at the backend process.

![background](media\peering-service-about\peering-service-why.png)

## What is Peering Service having to offer?
 -	An enterprise grade internet through well connected partners.
 -	Guaranteed connectivity at the nearest edge site via partner ISP.
 -	Optimization in networking performance by understanding traffic insights
 -	**High Availability[HA]** – Peering location is ensured to get connected with two routers.
 -	**Geo Redundancy** – Redundant connection is made available, so failover is supported when needed.
 -  **Best Routing Path** – Best shortest path is chosen at both entry and exit points.
 -	**Route Analytics** – Network monitoring technology is offered to analyze the routing techniques.

## Behind the Scene 
The service provider will provide connectivity to Microsoft Cloud at a location nearest to user. Service Provider [SP] will route user traffic to Microsoft edge closest to user. Similarly, on traffic towards the user, Microsoft will route traffic to the edge location closest to the user and SP will deliver the traffic to the user. 
High availability (port redundant), high throughput, geo-redundant connectivity is maintained with Microsoft Global Network. This is achieved by a software controller automated behind the scene by Microsoft. 

![background](media\peering-service-about\peering-service-Behind-the-Scene.png)

## Next steps