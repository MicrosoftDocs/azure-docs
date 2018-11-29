---
author: kumudD
ms.service: load-balancer
ms.topic: include
ms.date: 11/09/2018	
ms.author: kumud
---
An Azure load balancer is a Layer-4 (TCP, UDP) load balancer. The load balancer provides high availability by distributing incoming traffic among healthy service instances in cloud services or virtual machines in a load balancer set. Azure Load Balancer can also present those services on multiple ports, multiple IP addresses, or both.

You can configure a load balancer to:

* Load balance incoming Internet traffic to virtual machines (VMs). We refer to a load balancer in this scenario as an [Internet-facing load balancer](../articles/load-balancer/load-balancer-internet-overview.md).
* Load balance traffic between VMs in a virtual network (VNet), between VMs in cloud services, or between on-premises computers and VMs in a cross-premises virtual network. We refer to a load balancer in this scenario as an [internal load balancer (ILB)](../articles/load-balancer/load-balancer-internal-overview.md).
* Forward external traffic to a specific VM instance.
