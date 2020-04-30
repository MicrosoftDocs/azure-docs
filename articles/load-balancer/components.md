---
title: Azure Load Balancer components
description: Overview of Azure Load Balancer components
services: load-balancer
documentationcenter: na
author: asudbring
ms.service: load-balancer
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/28/2020
ms.author: allensu

---
# Azure Load Balancer components

Azure Load Balancer contains several key components for it's operation.  These components can be configured in your subscription via the Azure portal, Azure CLI, Azure PowerShell, or ARM Templates.  

## Frontend IP configurations

The IP address of the load balancer. It's the point of contact for clients. These addresses can be either:

- [Public IP Address](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address)
- [Private IP Address](https://docs.microsoft.com/azure/virtual-network/virtual-network-ip-addresses-overview-arm#private-ip-addresses)

The selection of the IP address determines the **type** of load balancer created. If you select a private IP address, you create an internal load balancer. If you select a public IP address, you create a public load balancer.

## Backend pool

The group of virtual machines or instances in the virtual machine scale set that are going to serve the incoming request. To scale cost-effectively to meet high volumes of incoming traffic, computing guidelines generally recommend adding more instances to the backend pool. Load balancer instantly reconfigures itself via automatic reconfiguration when you scale instances up or down. Adding or removing VMs from the backend pool reconfigures the load balancer without additional operations. The scope of the backend pool is any virtual machine in the virtual network. See [Load balancer limits](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#load-balancer) for scale considerations. When considering how to design your backend pool, you can design for the least number of individual backend pool resources to further optimize the duration of management operations. There is no difference in data plane performance or scale.

## Health probes

A health probe is used to determine the health of the instances in the backend pool. You can define the unhealthy threshold for your health probes. When a probe fails to respond, the load balancer stops sending new connections to the unhealthy instances. A probe failure doesn't affect existing connections. The connection continues until the application:

- Ends the flow
- Idle timeout occurs
- The VM shuts down

Load Balancer provides different health probe types for endpoints:

- TCP
- HTTP
- HTTPS

Basic load balancer does not support HTTPS probes. In addition, Basic load balancer will terminate all TCP connections (including established connections).

For more information, see [Probe types](load-balancer-custom-probe-overview.md#types).

## Load balancing rules

Load balancing rules tell the load balancer what to do. A load balancing rule maps a given frontend IP configuration and port to multiple backend IP addresses and ports.

## Inbound NAT rules

An inbound NAT rule forwards traffic from a specific port of a specific frontend IP address to a specific port of a specific backend instance inside the virtual network. **[Port forwarding](https://docs.microsoft.com/azure/load-balancer/tutorial-load-balancer-port-forwarding-portal)** is done by the same hash-based distribution as load balancing. Common scenarios for this capability are Remote Desktop Protocol (RDP) or Secure Shell (SSH) sessions to individual VM instances inside an Azure Virtual Network. You can map multiple internal endpoints to ports on the same front-end IP address. You can use the front-end IP addresses to remotely administer your VMs without an additional jump box.

## Outbound rules

An **[outbound rule](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-rules-overview)** configures outbound Network Address Translation (NAT) for all virtual machines or instances identified by the backend pool of your Standard load balancer to be translated to the frontend.

Basic load balancer does not support Outbound rules.
![Azure Load Balancer](./media/load-balancer-overview/load-balancer-overview.png)

## Next steps

- See [Create a public Standard Load Balancer](quickstart-load-balancer-standard-public-portal.md) to get started with using a Load Balancer.
- Learn more about [Azure Load Balancer](load-balancer-overview.md).
- Learn about using [Standard Load Balancer and Availability Zones](load-balancer-standard-availability-zones.md).
- Learn about [Standard Load Balancer Diagnostics](load-balancer-standard-diagnostics.md).
- Learn about [TCP Reset on Idle](load-balancer-tcp-reset.md).
- Learn about [Standard Load Balancer with HA Ports load balancing rules](load-balancer-ha-ports-overview.md).
- Learn about using [Load Balancer with Multiple Frontends](load-balancer-multivip-overview.md).
- Learn more about [Network Security Groups](../virtual-network/security-overview.md).