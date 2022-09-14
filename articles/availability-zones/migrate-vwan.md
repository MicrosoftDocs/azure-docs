---
title: Migrate your Azure Virtual WAN gateways to availability zone support 
description: Learn how to migrate your Azure Virtual WAN gateways to availability zone support.
author: anaharris-ms
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 09/14/2022
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions
---

# Migrate Azure Virtual WAN to availability zone support

This guide describes how to migrate Azure Virtual WAN gateways from non-availability zone support to availability zone support.

Virtual WAN is a collection of both the [virtual hubs](../virtual-wan/virtual-wan-about.md#resources) and gateway such as VPN and ExpressRoute. Because Virtual WAN itself is a global resources, it doesn't live in a particular region and therefore doesn't require availability zone support. However, the virtual hubs and the services they contain, such as VPN, ExpressRoute, and Azure Firewall are regional. If a virtual hub is in a region that supports availability zones, each service within that hub - except Azure Firewall - is automatically deployed across those availability zones when you create them. 

>[!NOTE]
>To deploy Azure Firewall with support for availability zones, you'll need to do so using Azure Firewall Manager Portal, PowerShell, or CLI. 

When a region and hub with no availability zone support has been upgraded to availability zone support after the initial deployment of your virtual hub and services, you'll have to redeploy the each service in order to take advantage of availability zones.  However, since you can't configure an existing Firewall to be deployed across availability zones, you'll need to delete and redeploy your Azure Firewall.


## Prerequisites

<!-- List all required SKUs or any other requirements here.  Feel free to provide links to pages that contain these prereqs. -->

## Downtime requirements

<!-- Is there downtime required for this procedure. I am assuming the answer is yes. Please confirm. -->

## Migration guidance: Redeploy ExpressRoute

<!-- I am assuming that we will need to delete the old ExpressRoute gateway. Please provide links or directions, recommendations -->

To create an ExpressRoute gateway, follow the steps in [To create a gateway in an existing hub](../virtual-wan/virtual-wan-expressroute-portal#existinghub).


## Migration guidance: Redeploy Point to site VPN Gateway

<!-- Please advise how the user would migrate Point to site VPN gateways.-->

## Migration Guidance Virtual WAN Site to Site VPN Gateway

<!-- Do we need to recreate the entire hub here or do we just reconfigure sites?-->

