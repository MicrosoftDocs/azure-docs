---
title: Application gateway v2 using UDR
description: This article provides guidance on how to use User Defined Routes (UDR) on Application Gateway v2
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: article
ms.date: 03/18/2020
ms.author: caya
---

# Using User-Defined Routes (UDR) with Application Gateway

User-Defined Routes (UDR) support is now in public preview for Application Gateway v2 SKU. There are a few scenarios that would require UDR with Application Gateway:

1. Disable Border Gateway Protocol (BGP) route propagation
2. Route 0.0.0.0/0 traffic directly to the Internet
3. Allow Application Gateway Ingress Controller to work with kubenet 

Scenarios that currently are **not** supported include:
1. Using a route table to route traffic through a virtual appliance, through a hub/spoke virtual network, or on-premise (forced tunneling).

> [!WARNING]
> An incorrect configuration of the route table could result in asymmetrical routing in Application Gateway v2. Please ensure that all management/control plane traffic is sent **directly to the internet** and not through a virtual appliance. Logging and metrics could also be affected. 

## Supported Scenarios
### Scenario 1: UDR to disable Border Gateway Protocol (BGP) Route Propagation to Application Gateway subnet
Sometimes 0.0.0.0/0 is advertised via ExpressRoute or VPN gateways associated with the Application Gateway virtual network. This breaks management plane traffic which requires a direct path to the internet. In such scenarios, UDR can be used to disable BGP route propagation. To disable BGP route propagation, follow the steps below: 

1. Create a Route Table resource in Azure and disable the "Virtual network gateway route propagation" field. 
2. Associate the Route Table to the appropriate subnet. 

Enabling UDR for this scenario should not break any existing setups. 

## Scenario 2: UDR to direct 0.0.0.0/0 to the Internet
UDR can currently be used on Application Gateway to send 0.0.0.0/0 traffic directly to the internet. 

## Scenario 3: UDR for Azure Kubernetes Service kubenet 

## Unsupported Scenarios
### Scenario: UDR for Virtual Appliances
Any scenario where 0.0.0.0/0 needs to be redirected through any virtual appliance, a hub/spoke virtual network, or on-premise (forced tunneling) is not yet supported. 


