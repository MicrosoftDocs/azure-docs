---
title: What is Traffic Manager - Azure | Microsoft Docs
description: This article provides an overview of Traffic Manager. Find out if it is the right traffic routing choice for your application.
services: traffic-manager
documentationcenter: ''
author: kumudd
manager: jeconnoc
editor: ''
ms.service: traffic-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/25/2018
ms.author: kumud
---

# Overview of Traffic Manager

Azure Traffic Manager allows you to control the distribution of user traffic for service endpoints in different datacenters. Service endpoints supported by Traffic Manager include Azure VMs, Web Apps, and Cloud service. You can also use Traffic Manager with external, non-Azure endpoints.

Traffic Manager uses the Domain Name System (DNS) to direct client requests to the most appropriate endpoint based on a traffic-routing method and the health of the endpoints. Traffic Manager provides a range of [traffic-routing methods](traffic-manager-routing-methods.md) and [endpoint monitoring options](traffic-manager-monitoring.md) to suit different application needs and automatic failover models. Traffic Manager is resilient to failure, including the failure of an entire Azure region.

## Traffic Manager benefits

Traffic Manager can help you:

* **Improve availability of critical applications**

    Traffic Manager delivers high availability for your applications by monitoring your endpoints and providing automatic failover when an endpoint goes down.

    ![Improve availability using Traffic Manager](./media/traffic-manager-overview/traffic-manager-overview.png)

* **Improve responsiveness for high-performance applications**

    Azure allows you to run cloud services or websites in datacenters located around the world. Traffic Manager improves application responsiveness by directing traffic to the endpoint with the lowest network latency for the client.

* **Perform service maintenance without downtime**

    You can perform planned maintenance operations on your applications without downtime. Traffic Manager directs traffic to alternative endpoints while the maintenance is in progress.

* **Combine on-premises and cloud-based applications**

    Traffic Manager supports external, non-Azure endpoints enabling it to be used with hybrid cloud and on-premises deployments, including the "burst-to-cloud," "migrate-to-cloud," and "failover-to-cloud" scenarios.

* **Distribute traffic for large, complex deployments**

    Using [nested Traffic Manager profiles](traffic-manager-nested-profiles.md), traffic-routing methods can be combined to create sophisticated and flexible rules to support the needs of larger, more complex deployments.



## Pricing

For pricing information, see [Traffic Manager Pricing](https://azure.microsoft.com/pricing/details/traffic-manager/).


## Next steps

Learn more about Traffic Manager [endpoint monitoring and automatic failover](traffic-manager-monitoring.md).

Learn more about Traffic Manager [traffic routing methods](traffic-manager-routing-methods.md).

Learn about some of the other key [networking capabilities](../networking/networking-overview.md) of Azure.

<!--Image references-->
[1]: ./media/traffic-manager-how-traffic-manager-works/dns-configuration.png
[2]: ./media/traffic-manager-how-traffic-manager-works/flow.png

