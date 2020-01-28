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

User-Defined Routes (UDR) support is now in public preview for Application Gateway v2 SKU. There are a few scenarios that would require UDR with Application Gateway:

1. Border Gateway Protocol (BGP) route propagation
2. Redirect traffic to a virtual appliance 
3. Application Gateway with in a hub and spoke model

Scenarios that currently are **not** supported include:
1. Using a route table to route traffic back on premise through Application Gateway

> [!WARNING]
> An incorrect configuration of the route table could result in asymmetrical routing in Application Gateway v2. Please ensure that all management/control plane traffic is sent **directly to the internet** and not through a virtual appliance. See scenario 2 for more details. 


## Scenario 1: UDR for Border Gateway Protocol (BGP) Route Propagation 
The first scenario is for BGP route propagation. UDR for BGP route propagation could be needed in scenarios involving ExpressRoute. To achieve BGP route propagation, follow the steps below: 

1. Create a Route Table resource in Azure and disable the "Virtual network gateway route propagation" field. 
2. Associate the Route Table to the appropriate subnet. 

Enabling UDR for this scenario should not break any existing setups. 

## Scenario 2: UDR for Virtual Appliances
The second scenario is for directing traffic through a virtual appliance (for example, Azure Firewall). 

1. Create a Route Table resource in Azure. Use the regional GatewayManager VIP to ensure that management/control plane traffic to/from the gateway manager is allowed to go **directly** to the internet. 
2. Associate the Route Table to the appropriate subnet. 

We will be adding support for custom tags in the future, but for now you will need to use the regional GatewayManager VIP to direct management/control plane traffic to the internet. 

## Scenario 3: Application Gateway in a Hub and Spoke Model
The third scenario is using Application Gateway to route traffic in a hub and spoke model. Using a route table for this scenario, you can route traffic to the hub and Application Gateway as a spoke. 






