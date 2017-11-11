---
title: Traffic View in Azure Traffic Manager | Microsoft Docs
description: Introduction to Traffic Manager Traffic View
services: traffic-manager
documentationcenter: traffic-manager
author: KumudD
manager: timlt
editor: 
tags: 

ms.assetid: 
ms.service: traffic-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 11/11/2017
ms.author: kumud
ms.custom: 
---

# Traffic Manager Traffic View

>[!NOTE]
>The Traffic View feature in Traffic Manager is in Public Preview and may not have the same level of availability and reliability as features that are in general availability release. The feature is not supported, may have constrained capabilities, and may not be available in all Azure locations. For the most up-to-date notifications on availability and status of this feature, check the [Azure Traffic Manager updates](https://azure.microsoft.com/updates/?product=traffic-manager) page.

Traffic Manager provides you with DNS level routing so that your end users are directed to healthy endpoints based on the routing method you had set up when the profile is created. This provides Traffic Manager with a view of your user bases (at a DNs resolver granularity level) and their traffic pattern. When you enable Traffic View, this information is processed to provide you with actionable insights. 

By using Traffic View, you can:
- get a visual display of a heat map of your end-points that are color-coded for latency scale that you can use as follows:
    - hover on a DNS query IP to view the query volumes.
    - click on an end-point to view the distribution volume across all source IPs that the end-point is connected to along with the latency that is color coded.
       >[NOTE!]
       > - Latency is shown as best effort. If data is unavailable, latency is shown as null.
       > - In most cases, the IP address of the DNS source query is of the local DNS resolver.
- understand where your user bases are located (up to a local DNS resolver level granularity).
- view the volume of traffic (observed as DNS queries handled by Azure Traffic Manager) originating from these regions.
- get insights into what is the representative latency experienced by these users.
- deep dive into the specific traffic patterns from each of these user bases to Azure regions where you have endpoints. 

For example, you can use Traffic View to understand which regions have a large number of traffic but suffer from higher latencies. Next, you can use this information to plan your footprint expansion to new Azure regions so that these users can have a lower latency experience.

## How Traffic View works

Traffic View works by having Traffic Manager look at the incoming queries received in the past seven days against a profile that has this feature enabled. From this information, it extracts the source IP of the DNS resolver that is then used as a representation of the location of the users. These are then grouped together at a DNS resolver level granularity to create user base regions by using the geographic information of IP addresses maintained by Traffic Manager. Traffic Manager then looks at the Azure regions to which the query was routed and constructs a traffic flow map for users from those regions.
In the next step, Traffic Manager correlates the user base region to Azure region mapping with the network intelligence latency tables that it maintains for different end user networks to understand the average latency experienced by users from those regions when connecting to Azure regions. All these calculations are then tabulated at a per local DNS resolver IP level before it is presented to you. You can process this information in an analytics workflow of your choice, you can also download this information as a CSV file.
When you use Traffic View, you are billed based on the number of data points used to create the insights presented. Currently the only data point type used is the queries received against your Traffic Manager profile. For more details on the pricing, visit the [Traffic Manager pricing page](https://azure.microsoft.com/pricing/details/traffic-manager/).


## Next steps

- Learn [how Traffic Manager works](traffic-manager-overview.md)
- Learn more about the [traffic-routing methods](traffic-manager-routing-methods.md) supported by Traffic Manager
- Learn how to [create a Traffic Manager profile](traffic-manager-create-profile.md)

