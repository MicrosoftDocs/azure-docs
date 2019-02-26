---
title: What is IP address 168.63.129.16? | Microsoft Docs
description: Learn about IP address 168.63.129.16 and how it works with your resources.
services: virtual-network
documentationcenter: na
author: genlin
manager: cshepard
editor: v-jesits
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/21/2019
ms.author: genli

---

# What is IP address 168.63.129.16?

IP address 168.63.129.16 is a virtual public IP address that is used to facilitate a communication channel to Azure platform resources. Customers can define any address space for their private virtual network in Azure. Therefore, the Azure platform resources must be presented as a unique public IP address. This virtual public IP address facilitates the following things:

- Enables the VM Agent to communicate with the Azure platform to signal that it is in a "Ready" state.
- Enables communication with the DNS virtual server to provide filtered name resolution to the resources (such as VM) that do not have a custom DNS server. This filtering makes sure that customers can resolve only the hostnames of their resources.
- Enables health probes from the load balancer to determine the health state of VMs in a load-balanced set.
- Enables Guest Agent heartbeat messages for the PaaS role.

## Scope of IP address 168.63.129.16

Virtual public IP address 168.63.129.16 is used in all regions and all national clouds. This special public IP address will not change. It is allowed by the default network security group rule. We recommend that you allow this IP address in any local firewall policies. The communication between this special IP address and the resources is safe because only the internal Azure platform can source a message from this IP address. If this address is blocked, unexpected behavior can occur in a variety of scenarios.

Additionally, you can expect that traffic to flow from virtual public IP address 168.63.129.16 to the endpoint that is configured for a [Load Balancer health probe](../load-balancer/load-balancer-custom-probe-overview.md). In a non-virtual network scenario, the health probe is sourced from a private IP. 

## Next steps

- [Security groups](security-overview.md)
- [Create, change, or delete a network security group](manage-network-security-group.md)
