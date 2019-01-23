---
title: What is the IP address 168.63.129.16 | Microsoft Docs
description: Learn about what the IP address 168.63.129.16 is and how it works with your resources.
services: virtual-network
documentationcenter: na
author: genlin
manager: cshepard
editor: ''
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

# What is the IP address 168.63.129.16

The IP address 168.63.129.16 is a virtual public IP address that is used to facilitate a communication channel to internal platform resources for the bring-your-own-IP Virtual Network scenario. Because the Azure platform allows customers to define any private or custom address space, this resource must be a unique public IP address. It cannot be a private IP address as the address cannot be a duplicate of address space the customer defines.  This virtual public IP address facilitates the following things:

- Enables the VM Agent to communicate with Azure platform to signal that it is in a “Ready” state
- Enables communication with the DNS virtual server to provide filtered name resolution to the resources (such as VM) that do not have custom DNS server.  This filtering ensures that customers can only resolve the hostnames of their resources.
- Enables monitoring probes from the load balancer to determine health state for VMs in a load balanced set
- Enables PaaS role Guest Agent heartbeat messages

## Scope of the IP address 168.63.129.16

The virtual public IP address 168.63.129.16 is used in all regions and all national clouds. This special public IP address will not change. It is allowed by the default Network security group rule. It is recommended that this IP is allowed in any local firewall policies. The communication between this special IP address and the resources is safe as only the internal Azure platform can source a message from this IP address. If this virtual public IP is blocked, this will result unexpected behavior in a variety of scenarios.

Additionally, traffic from virtual public IP address 168.63.129.16 that is communicating to the endpoint configured for a load balanced set monitor probe should not be considered attack traffic.  In a non-virtual network scenario, the monitor probe is sourced from a private IP.


## Next steps

- [Create](manage-public-ip-address-prefix.md) a public IP address prefix
