---
title: Azure PowerShell Samples - Networking
description: Learn about Azure PowerShell samples for networking, including a sample for creating a virtual network for multi-tier applications.
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 03/23/2023
ms.author: allensu
---
# Azure PowerShell Samples for networking

The following table includes links to scripts for Azure PowerShell.

| Script | Description |
|-|-|
|**Connectivity between Azure resources**||
| [Create a virtual network for multi-tier applications](./scripts/virtual-network-powershell-sample-multi-tier-application.md?toc=%2fazure%2fnetworking%2ftoc.json) | Creates a virtual network with front-end and back-end subnets. Traffic to the front-end subnet is limited to HTTP, while traffic to the back-end subnet is limited to SQL, port 1433. |
| [Peer two virtual networks](./scripts/virtual-network-powershell-sample-peer-two-virtual-networks.md?toc=%2fazure%2fnetworking%2ftoc.json) | Creates and connects two virtual networks in the same region. |
| [Route traffic through a network virtual appliance](./scripts/virtual-network-powershell-sample-route-traffic-through-nva.md?toc=%2fazure%2fnetworking%2ftoc.json) | Creates a virtual network with front-end and back-end subnets and a VM that is able to route traffic between the two subnets. |
| [Filter inbound and outbound VM network traffic](./scripts/virtual-network-powershell-filter-network-traffic.md?toc=%2fazure%2fnetworking%2ftoc.json) | Creates a virtual network with front-end and back-end subnets. Inbound network traffic to the front-end subnet is limited to HTTP and HTTPS. Outbound traffic to the Internet from the back-end subnet isn't permitted. |
|**Load balancing and traffic direction**||
| [Load balance traffic to VMs for high availability](./scripts/load-balancer-windows-powershell-sample-nlb.md?toc=%2fazure%2fnetworking%2ftoc.json) | Creates several virtual machines in a highly available and load balanced configuration. |
| [Direct traffic across multiple regions for high application availability](./scripts/traffic-manager-powershell-websites-high-availability.md?toc=%2fazure%2fnetworking%2ftoc.json) |  Creates two app service plans, two web apps, a traffic manager profile, and two traffic manager endpoints. |
| | |
