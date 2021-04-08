---
author: asudbring
ms.service: virtual-network
ms.topic: include
ms.date: 04/08/2021
ms.author: allensu
---
> [!NOTE]
> Azure provides default SNAT for Azure Virtual Machines which aren't assigned a public IP address. The default SNAT mechanism provides a ephemeral outbound IP address that isn't configurable. Default SNAT is disabled when a public IP address is assigned to the virtual machine or the virtual machine is placed in the backend pool of a Standard Load Balancer with or without outbound rules.
>
> For more information on outbound connections in Azure, see [Using Source Network Address Translation (SNAT) for outbound connections](../articles/load-balancer/load-balancer-outbound-connections.md).