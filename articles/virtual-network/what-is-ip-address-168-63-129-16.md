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
ms.date: 1/21/2019
ms.author: genli

---

# What is IP address 168.63.129.16?

IP address 168.63.129.16 is a virtual public IP address that is used to facilitate a communication channel to Azure platform resources for the bring-your-own-IP Virtual Network scenario. Because the Azure platform enables customers to define any private or custom address space, this resource must be a unique public IP address. It cannot be a private IP address because the address cannot be a duplicate of the address space that the customer defines. This virtual public IP address facilitates the following things:

- Enables the VM Agent to communicate with the Azure platform to signal that it is in a “Ready” state.
- Enables communication with the DNS virtual server to provide filtered name resolution to the resources (such as VM) that do not have a custom DNS server. This filtering makes sure that customers can resolve only the hostnames of their resources.
- Enables monitoring probes from the load balancer to determine the health state of VMs in a load-balanced set.
- Enables Guest Agent heartbeat messages for the PaaS role.

## Scope of IP address 168.63.129.16

Virtual public IP address 168.63.129.16 is used in all regions and all national clouds. This special public IP address will not change. It is allowed by the default network security group rule. We recommend that you allow this IP address in any local firewall policies. The communication between this special IP address and the resources is safe because only the internal Azure platform can source a message from this IP address. If this address is blocked, unexpected behavior can occur in a variety of scenarios.

Additionally, you can expect that traffic from virtual public IP address 168.63.129.16 will not be considered to be attack traffic if the address is communicating to the endpoint that is configured for a load-balanced set monitor probe. In a non-virtual network scenario, the monitor probe is sourced from a private IP.


## Next steps

- [Security groups](security-overview.md)
- [Create, change, or delete a network security group](manage-network-security-group.md)
