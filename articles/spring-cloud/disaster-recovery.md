---
title: Azure Spring Cloud geo-disaster recovery | Microsoft Docs
description: Learn how to protect your Spring Cloud application from regional outages
author: bmitchell287
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 10/24/2019
ms.author: brendm

---
# Azure Spring Cloud disaster recovery

This article explains some strategies you can use to protect your Azure Spring Cloud applications from experiencing downtime.  Any region or data center may experience downtime caused by regional disasters, but careful planning can mitigate impact on your customers.

## Plan your application deployment

Azure Spring Cloud applications run in a specific region.  Azure operates in multiple geographies around the world. An Azure geography is a defined area of the world that contains at least one Azure Region. An Azure region is an area within a geography, containing one or more data centers.  Each Azure region is paired with another region within the same geography, together making a regional pair. Azure serializes platform updates (planned maintenance) across regional pairs, ensuring that only one region in each pair is updated at a time. In the event of an outage affecting multiple regions, at least one region in each pair will be prioritized for recovery.

Ensuring high availability and protection from disasters requires that you deploy your Spring Cloud applications to multiple regions.  Azure provides a list of [paired regions](../best-practices-availability-paired-regions.md) so that you can plan your Spring Cloud deployments to regional pairs.  We recommend that you consider three key factors when designing your micro-service architecture:  region availability, Azure paired regions, and service availability.

*  Region availability:  Choose a geographic area close to your users to minimize network lag and transmission time.
*  Azure paired regions:  Choose paired regions within your chosen geographic area to ensure coordinated platform updates and prioritized recovery efforts if needed.
*  Service availability:   Decide whether your paired regions should run hot/hot, hot/warm, or hot/cold.

## Use Azure Traffic Manager to route traffic

[Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) provides DNS-based traffic load-balancing and can distribute network traffic across multiple regions.  Use Azure Traffic Manager to direct customers to the closest Azure Spring Cloud service instance to them.  For best performance and redundancy, direct all application traffic through Azure Traffic Manager before sending it to your Azure Spring Cloud service.

If you have Azure Spring Cloud applications in multiple regions, use Azure Traffic Manager to control the flow of traffic to your applications in each regions.  Define an Azure Traffic Manager endpoint for each service using the service IP. Customers should connect to an Azure Traffic Manager DNS name pointing to the Azure Spring Cloud service.  Azure Traffic Manager load balances traffic across the defined endpoints.  If a disaster strikes a data center, Azure Traffic Manager will direct traffic from that region to its pair, ensuring service continuity.