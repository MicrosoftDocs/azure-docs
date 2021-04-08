---
author: asudbring
ms.service: virtual-network
ms.topic: include
ms.date: 04/08/2021
ms.author: allensu
---
> [!NOTE]
> **Option 1 (Minimal):** 
>
> When a Standard Public IP is associated to a network interface, pseudo public IPs are no longer applied for outbound connections. Pseudo IPs are only applied for outbound connections using a Basic Load Balancer.
>
> For more information on outbound connections in Azure, see [Using Source Network Address Translation (SNAT) for outbound connections](./articles/load-balancer/load-balancer-outbound-connections.md)

> [!NOTE]
> **Option 2 (Detailed):**
>
> Azure provides default SNAT for Azure Virtual Machines which aren't assigned a public IP address or are in the backend pool of a Basic SKU Azure Load Balancer. The default SNAT mechanism provides a pseudo outbound IP address that isn't configurable. Default SNAT is disabled when a public IP address is assigned to the virtual machine or the virtual machine is placed in the backend pool of a Standard Load Balancer with or without outbound rules.
>
> For more information on outbound connections in Azure, see [Using Source Network Address Translation (SNAT) for outbound connections](./articles/load-balancer/load-balancer-outbound-connections.md)