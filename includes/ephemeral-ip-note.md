---
author: asudbring
ms.service: virtual-network
ms.topic: include
ms.date: 02/07/2022
ms.author: allensu
---
> [!NOTE]
> Azure provides a default outbound access IP for VMs that either aren't assigned a public IP address or are in the back-end pool of an internal basic Azure load balancer. The default outbound access IP mechanism provides an outbound IP address that isn't configurable. 
>
> For more information, see [Default outbound access in Azure](../articles/virtual-network/ip-services/default-outbound-access.md).
>
> The default outbound access IP is disabled when either a public IP address is assigned to the VM or the VM is placed in the back-end pool of a standard load balancer, with or without outbound rules. If an [Azure Virtual Network network address translation (NAT)](../articles/virtual-network/nat-gateway/nat-overview.md) gateway resource is assigned to the subnet of the virtual machine, the default outbound access IP is disabled.
>
> VMs that are created by virtual machine scale sets in flexible orchestration mode don't have default outbound access.
>
> For more information about outbound connections in Azure, see [Use source network address translation (SNAT) for outbound connections](../articles/load-balancer/load-balancer-outbound-connections.md).