---
author: asudbring
ms.service: virtual-network
ms.topic: include
ms.date: 04/15/2024
ms.author: allensu
---
> [!NOTE]
> Azure provides a default outbound access IP for VMs that either aren't assigned a public IP address or are in the backend pool of an internal basic Azure load balancer. The default outbound access IP mechanism provides an outbound IP address that isn't configurable.
>
> The default outbound access IP is disabled when one of the following events happens:
> - A public IP address is assigned to the VM.
> - The VM is placed in the backend pool of a standard load balancer, with or without outbound rules.
> - An [Azure NAT Gateway](../articles/virtual-network/nat-gateway/nat-overview.md) resource is assigned to the subnet of the VM.
>
> VMs that you create by using virtual machine scale sets in flexible orchestration mode don't have default outbound access.
>
> For more information about outbound connections in Azure, see [Default outbound access in Azure](../articles/virtual-network/ip-services/default-outbound-access.md) and [Use Source Network Address Translation (SNAT) for outbound connections](../articles/load-balancer/load-balancer-outbound-connections.md).
