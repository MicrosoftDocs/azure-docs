---
title: Traffic View in Azure Traffic Manager | Microsoft Docs
description: Introduction to Real User Measurements in Traffic Manager
services: traffic-manager
documentationcenter: traffic-manager
author: KumudD
manager: timlt
editor: 
tags: 

ms.assetid: 
ms.service: traffic-manager
ms.devlang: na
ms.topic: 
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 09/19/2017
ms.author: kumud
ms.custom: 
---

# Traffic Manager Traffic View

Traffic Manager provides you with DNS level routing so that your end users are directed to healthy endpoints based on the routing method you had set up when the profile is created. This provides Traffic Manager with a view of your user bases (at a DNs resolver granularity level) and their traffic pattern. When you enable Traffic View, this information is processed to provide you with actionable insights. 

By using Traffic View, you can:
- understand where your user bases are located (up to a local DNS resolver level granularity).
- the volume of traffic originating from these regions.
- what is the representative latency experienced by these users.
- deep dive into the specific traffic patterns from each of these user bases to Azure regions where you have endpoints. 

For example, you can use Traffic View to understand which regions have a large number of traffic but suffer from higher latencies. Next you can use this information to plan your footprint expansion to new Azure regions so that these users can have a lower latency experience.

## How Traffic View Works

Traffic View works by having Traffic Manager look at the incoming queries received in the past seven days against a profile that has this feature enabled. From this information, it extracts the source IP of the DNS resolver that is then used as a representation of the location of the users. These are then grouped together at a DNS resolver level granularity to create user base regions by using the geographic information of IP addresses maintained by Traffic Manager. Traffic Manager then looks at the Azure regions to which the query was routed and constructs a traffic flow map for users from those regions.
In the next step, Traffic Manager correlates the user base region to Azure region mapping with the network intelligence latency tables that it maintains for different end user networks to understand the average latency experienced by users from those regions when connecting to Azure regions. All these calculations are then tabulated at a per local DNS resolver IP level before it is presented to you. You can process this information in an analytics workflow of your choice, you can also download this information as a CSV file.
When you use Traffic View, you are billed based on the number of data points used to create the insights presented. Currently the only data point type used is the queries received against your Traffic Manager profile. For more details on the pricing, visit the [Traffic Manager pricing page](https://azure.microsoft.com/pricing/details/traffic-manager/).


## Next steps

- Learn [how Traffic Manager works](traffic-manager-overview.md)
- Learn more about the [traffic-routing methods](traffic-manager-routing-methods.md) supported by Traffic Manager
- Learn how to [create a Traffic Manager profile](traffic-manager-create-profile)

