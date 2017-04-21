---
title: Azure CLI Samples | Microsoft Docs
description: Azure CLI Samples
services: virtual-network
documentationcenter: virtual-network
author: KumudD
manager: timlt
editor: tysonn
tags:
ms.assetid:
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm:
ms.workload: infrastructure
ms.date: 04/19/2017
ms.author: kumud

---
# Azure CLI Samples for networking

The following table includes links to bash scripts built using the Azure CLI.

| | |
|-|-|
|**Create virtual networks**||
| [Peer two virtual networks](./scripts/virtual-network-cli-sample-peer-two-virtual-networks.md?toc=%2fazure%2fnetworking%2ftoc.json) | Creates and connects two virtual networks in the same region. |
| [Route traffic through a network virtual appliance](./scripts/virtual-network-cli-sample-route-traffic-through-nva.md?toc=%2fazure%2fnetworking%2ftoc.json) | creates a virtual network with front-end and back-end subnets and a VM that is able to route traffic between the two subnets. |
| [Create a virtual network for multi-tier applications](./scripts/virtual-network-cli-sample-multi-tier-application.md?toc=%2fazure%2fnetworking%2ftoc.json) | creates a virtual network with front-end and back-end subnets. Traffic to the front-end subnet is limited to HTTP and SSH, while traffic to the back-end subnet is limited to MySQL, port 3306. |
|**Load balancing and high availability**||
| [Create highly available VMs](./scripts/load-balancer-linux-cli-sample-nlb.md?toc=%2fazure%2fnetworking%2ftoc.json) | Creates several virtual machines in a highly available and load balanced configuration. |
| [Load balance multiple websites](./scripts/load-balancer-linux-cli-load-balance-multiple-websites-vm.md?toc=%2fazure%2fnetworking%2ftoc.json) | Creates two VMs with multiple IP configurations, joined to an Azure Availability Set, accessible through an Azure Load Balancer. |
| [Route traffic for high availability of applications](./scripts/traffic-manager-cli-websites-high-availability.md?toc=%2fazure%2fnetworking%2ftoc.json) |  Creates two app service plans, two web apps, a traffic manager profile, and two traffic manager endpoints. |
| | |
