---
title: Virtual network business continuity
description: Learn what to do if there's an Azure service disruption impacting Azure Virtual Networks.
author: asudbring
ms.service: virtual-network
ms.topic: conceptual
ms.date: 03/23/2023
ms.author: allensu
---

# Virtual Network – Business Continuity

## Overview

A Virtual Network is a logical representation of your network in the cloud. It allows you to define your own private IP address space and segment the network into subnets. Virtual networks serve as a trust boundary to host your compute resources such as Azure Virtual Machines and load balancers. A virtual network allows direct private IP communication between the resources hosted in it. You can link a virtual network to an on-premises network through a VPN Gateway, or ExpressRoute.

A virtual network is created within the scope of a region. You can **create** virtual networks with the same address space in two different regions, but because they have the same address space, you can't connect them together. 

## Business Continuity

There could be several different ways that your application could be disrupted. A region could be completely cut off due to a natural disaster, or a partial disaster, due to a failure of multiple devices or services. The effect on the virtual network service is different in each of these situations.

**Q: If an outage occurs for an entire region, what do I do? For example, if a region is completely cut off due to a natural disaster? What happens to the virtual networks hosted in the region?**

A: The virtual network and the resources in the affected region remains inaccessible during the time of the service disruption.

:::image type="content" source="./media/virtual-network-disaster-recovery-guidance/vnet.png" alt-text="Diagram of a simple network.":::

**Q: What can I do to re-create the same virtual network in a different region?**

A: Virtual networks are fairly lightweight resources. You can invoke Azure APIs to create a virtual network with the same address space in a different region. To recreate the same environment that was present in the affected region, redeploy the virtual machines and other resources.  If you have on-premises connectivity, such as in a hybrid deployment, you have to deploy a new VPN Gateway, and connect to your on-premises network.

To create a virtual network, see [Create a virtual network](manage-virtual-network.md#create-a-virtual-network).

**Q: Can a replica of a virtual network in a given region be re-created in another region ahead of time?**

A: Yes, you can create two virtual networks using the same private IP address space and resources in two different regions ahead of time. If you're hosting internet-facing services in the virtual network, you could have set up Traffic Manager to geo-route traffic to the region that is active. However, you can't connect two virtual networks with the same address space to your on-premises network, as it would cause routing issues. At the time of a disaster and loss of a virtual network in one region, you can connect the other virtual network in the available region, with the matching address space to your on-premises network.

To create a virtual network, see [Create a virtual network](manage-virtual-network.md#create-a-virtual-network).

