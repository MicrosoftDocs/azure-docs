---
title: Administrative State (Admin State) in Azure Load Balancer
titleSuffix: Azure Load Balancer
description: Overview of Administrative State (Admin State) in Azure Load Balancer.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: conceptual
ms.date: 06/23/2023
ms.author: mbender
ms.custom: template-concept, references_regions
---

# Administrative State (Admin State) in Azure Load Balancer






[!INCLUDE [load-balancer-admin-state-preview](../../includes/load-balancer-admin-state-preview.md)]

Administrative State (Admin State) is a feature of Azure Load Balancer that allows you to override the Load Balancer’s health probe behavior on a per backend pool instance basis.  

## Why use admin state? 

Admin State is useful in scenarios where you want to have more control over the behavior of your Load Balancer. For example, you can set the Admin State to upUP to always consider the backend instance eligible for new connections, even if the health probe indicates otherwise. Conversely, you can set the Admin State to DOWNdown to prevent new connections, even if the health probe indicates that the backend instance is healthy. This can be useful for maintenance or other scenarios where you want to temporarily take a backend instance out of rotation. 

## Types of admin state values 

There are three types of admin state values: UP, DOWN, NONE. The table below describes the effects of each state on new connections and existing connections.  

Admin State   

New Connections    

Existing Connections   

UP   

Load Balancer will ignore the health probe and will always consider the backend instance as eligible for new connections.  

 

Load Balancer will ignore the health probe and will always allow existing connections to persist to the backend instance.   

 

DOWN  

Load Balancer will ignore the health probe and will not allow new connections to the backend instance.  

Load Balancer will ignore the health probe and existing connections will be determined according to the protocol below: 

 

TCP: Established TCP connections to the backend instance persists.  

 

UDP: Existing UDP flows move to another healthy instance in the backend pool. 

 

Note: This is similar to a Probe Down behavior.    

NONE (Blank)   

Load Balancer will respect the health probe behavior.  

Load Balancer will respect the health probe behavior. 

 

 

Note: Load Balancer Health Probe Status metrics will reflect your configured admin state value changes.  

Limitations 

Admin state will take effect on a per backendpool instance basis. In a scenario where a virtual machine instance is in more than one backendpool, the admin state set on one backendpool will not affect the other backendpool.  

Admin state will only take effect when there is a health probe configured on the Load Balancer rules.  

Admin state is not supported with inbound NAT rule.  

Admin state cannot be set as part of the NIC-based Load Balancer backendpool Create experiences.  


> [!div class="nextstepaction"]
> [Learn more about Load Balancer health probes](load-balancer-custom-probe-overview.md)
