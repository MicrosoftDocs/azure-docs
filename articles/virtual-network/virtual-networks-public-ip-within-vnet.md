<properties 
   pageTitle="How to use public IP addresses in a virtual network"
   description="Learn how to configure a virtual network to use public IP addresses"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carmonm"
   editor="tysonn" />
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/27/2016"
   ms.author="telmos" />

# Public IP address space in a Virtual Network (VNet)

Virtual networks (VNets) can contain both public and private (RFC 1918 address blocks) IP address spaces. When you add a public IP address range, it will be treated as part of the private VNet IP address space that is only reachable within the VNet, interconnected VNets, and from your on-premises location.

The picture below shows a VNet that includes public and private IP adress spaces.

![Public IP Conceptual](./media/virtual-networks-public-ip-within-vnet/IC775683.jpg)

## How do I add a public IP address range?

You add a public IP address range the same way you would add a private IP address range; by either using a *netcfg* file, or by adding the configuration in the [Azure portal](http://portal.azure.com). You can add a public IP address range when you create your VNet, or you can go back and add it afterward. The example below shows both public and private IP address spaces configured in the same VNet.

![Public IP Address in Portal](./media/virtual-networks-public-ip-within-vnet/IC775684.png)

## Are there any limitations?

There are a few IP address ranges that are not allowed:

- 224.0.0.0/4 (Multicast)

- 255.255.255.255/32 (Broadcast)

- 127.0.0.0/8 (loopback)

- 169.254.0.0/16 (link-local)

- 168.63.129.16/32 (Internal DNS)

## Next Steps

[How to manage DNS servers used by a VNet](../virtual-networks-manage-dns-in-vnet)