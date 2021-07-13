---
author: asudbring
ms.service: virtual-network
ms.topic: include
ms.date: 04/08/2021
ms.author: allensu
---
> [!NOTE]
> Azure provides an ephemeral IP for Azure Virtual Machines which aren't assigned a public IP address, or are in the backend pool of an internal Basic Azure Load Balancer. The ephemeral IP mechanism provides an outbound IP address that isn't configurable. 
>
>The ephemeral IP is disabled when a public IP address is assigned to the virtual machine or the virtual machine is placed in the backend pool of a Standard Load Balancer with or without outbound rules. If a [Azure Virtual Network NAT](../articles/virtual-network/nat-overview.md) gateway resource is assigned to the subnet of the virtual machine, the ephemeral IP is disabled.
>
> For more information on outbound connections in Azure, see [Using Source Network Address Translation (SNAT) for outbound connections](../articles/load-balancer/load-balancer-outbound-connections.md).