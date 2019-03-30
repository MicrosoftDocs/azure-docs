---
author: cynthn
ms.service: virtual-machines
ms.topic: include
ms.date: 10/26/2018
ms.author: cynthn
---
It is important to realize that there are two ways to configure an availability group listener in Azure. The ways differ in the type of Azure load balancer you use when you create the listener. The following table describes the differences:

| Load balancer type | Implementation | Use when: |
| --- | --- | --- |
| **External** |Uses the *public virtual IP address* of the cloud service that hosts the virtual machines (VMs). |You need to access the listener from outside the virtual network, including from the Internet. |
| **Internal** |Uses an *internal load balancer* with a private address for the listener. |You can access the listener only from within the same virtual network. This access includes site-to-site VPN in hybrid scenarios. |

> [!IMPORTANT]
> For a listener that uses the cloud service's public VIP (external load balancer), as long as the client, listener, and databases are in the same Azure region, you will not incur egress charges. Otherwise, any data returned through the listener is considered egress, and it is charged at normal data-transfer rates. 
> 
> 

An ILB can be configured only on virtual networks with a regional scope. Existing virtual networks that have been configured for an affinity group cannot use an ILB. For more information, see [Internal load balancer overview](../articles/load-balancer/load-balancer-internal-overview.md).

