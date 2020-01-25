---
title: Application gateway v2 using UDR
description: This article provides guidance on how to use User Defined Routes (UDR) on Application Gateway v2
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: article
ms.date: 01/24/2020
ms.author: caya
---

# Using User-Defined Routes (UDR) with Application Gateway

User-Defined Routes (UDR) support is now in public preview for Application Gateway v2 SKU. There are two main scenarios that would require UDR with Application Gateway:

1. Border Gateway Protocol (BGP) route propagation
2. Redirect traffic to a virtual appliance 

> [!WARNING]
> An incorrect configuration of the route table could result in asymmetrical routing in Application Gateway v2. Please ensure that all management/control plane traffic is sent **directly to the internet** and not through a virtual appliance. See scenario 2 for more details. 


## Scenario 1: UDR for Border Gateway Protocol (BGP) Route Propagation 
The first scenario is for BGP route propagation. This could be needed in scenarios involving ExpressRoute. To achieve BGP route propagation, follow the steps below: 

1. Create a Route Table resource in Azure and disable the "Virtual network gateway route propagation" field. 
2. Associate the Route Table to the appropriate subnet. 

This should not break any existing setups. 

## Scenario 2: UDR for Virtual Appliances
The second scenario is for directing traffic through a virtual appliance (i.e., Azure Firewall). 

1. Create a Route Table resource in Azure. Use the regional GatewayManager VIP to ensure that management/control plane traffic to/from the gateway manager is allowed to go **directly** to the internet. 
2. Associate the Route Table to the appropriate subnet. 

We will be adding support for custom tags in the future, but for now you will need to use the regional GatewayManager VIP to direct management/control plane traffic to the internet. 




