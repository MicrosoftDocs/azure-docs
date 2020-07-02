---
title: What is IP address 168.63.129.16? | Microsoft Docs
description: Learn about IP address 168.63.129.16 and how it works with your resources.
services: virtual-network
documentationcenter: na
author: genlin
manager: dcscontentpm
editor: v-jesits
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/15/2019
ms.author: genli

---

# What is IP address 168.63.129.16?

IP address 168.63.129.16 is a virtual public IP address that is used to facilitate a communication channel to Azure platform resources. Customers can define any address space for their private virtual network in Azure. Therefore, the Azure platform resources must be presented as a unique public IP address. This virtual public IP address facilitates the following things:

- Enables the VM Agent to communicate with the Azure platform to signal that it is in a "Ready" state.
- Enables communication with the DNS virtual server to provide filtered name resolution to the resources (such as VM) that do not have a custom DNS server. This filtering makes sure that customers can resolve only the hostnames of their resources.
- Enables [health probes from Azure load balancer](../load-balancer/load-balancer-custom-probe-overview.md) to determine the health state of VMs.
- Enables the VM to obtain a dynamic IP address from the DHCP service in Azure.
- Enables Guest Agent heartbeat messages for the PaaS role.

## Scope of IP address 168.63.129.16

The public IP address 168.63.129.16 is used in all regions and all national clouds. This special public IP address is owned by Microsoft and will not change. We recommend that you allow this IP address in any local (in the VM) firewall policies (outbound direction). The communication between this special IP address and the resources is safe because only the internal Azure platform can source a message from this IP address. If this address is blocked, unexpected behavior can occur in a variety of scenarios. 168.63.129.16 is a [virtual IP of the host node](../virtual-network/security-overview.md#azure-platform-considerations) and as such it is not subject to user defined routes.

- The VM Agent requires outbound communication over ports 80, 443, 32526 with WireServer (168.63.129.16). These should be open in the local firewall on the VM. The communication on these ports with 168.63.129.16 is not subject to the configured network security groups.
- 168.63.129.16 can provide DNS services to the VM. If this is not desired, this traffic can be blocked in the local firewall on the VM. By default DNS communication is not subject to the configured network security groups unless specifically targeted leveraging the [AzurePlatformDNS](../virtual-network/service-tags-overview.md#available-service-tags) service tag. To block DNS traffic to Azure DNS through NSG, create an outbound rule to deny traffic to [AzurePlatformDNS](../virtual-network/service-tags-overview.md#available-service-tags), and specify "*" as "Destination port ranges" and "Any" as protocol.
- When the VM is part of a load balancer backend pool, [health probe](../load-balancer/load-balancer-custom-probe-overview.md) communication should be allowed to originate from 168.63.129.16. The default network security group configuration has a rule that allows this communication. This rule leverages the [AzureLoadBalancer](../virtual-network/service-tags-overview.md#available-service-tags) service tag. If desired this traffic can be blocked by configuring the network security group however this will result in probes that fail.

In a non-virtual network scenario (Classic), the health probe is sourced from a private IP and 168.63.129.16 is not used.

## Next steps

- [Security groups](security-overview.md)
- [Create, change, or delete a network security group](manage-network-security-group.md)
