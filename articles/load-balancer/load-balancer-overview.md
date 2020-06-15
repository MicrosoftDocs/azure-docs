---
title: What is Azure Load Balancer?
titleSuffix: Azure Load Balancer
description: Overview of Azure Load Balancer features, architecture, and implementation. Learn how the Load Balancer works and how to use it in the cloud.
services: load-balancer
documentationcenter: na
author: asudbring
ms.service: load-balancer
Customer intent: As an IT administrator, I want to learn more about the Azure Load Balancer service and what I can use it for. 
ms.devlang: na
ms.topic: overview
ms.custom: seodec18
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 1/14/2020
ms.author: allensu

---

# What is Azure Load Balancer?

*Load balancing* refers to evenly distributing load (incoming network traffic) across a group of backend resources or servers. 

Azure Load Balancer operates at layer four of the Open Systems Interconnection (OSI) model. It's the single point of contact for clients. Load Balancer distributes inbound flows that arrive at the load balancer's front end to backend pool instances. These flows are according to configured load balancing rules and health probes. The backend pool instances can be Azure Virtual Machines or instances in a virtual machine scale set.

A **[public load balancer](./components.md#frontend-ip-configurations)** can provide outbound connections for virtual machines (VMs) inside your virtual network. These connections are accomplished by translating their private IP addresses to public IP addresses. Public Load Balancers are used to load balance internet traffic to your VMs.

An **[internal (or private) load balancer](./components.md#frontend-ip-configurations)** is used where private IPs are needed at the frontend only. Internal load balancers are used to load balance traffic inside a virtual network. A load balancer frontend can be accessed from an on-premises network in a hybrid scenario.

<p align="center">
  <img src="./media/load-balancer-overview/load-balancer.svg" width="512" title="Azure Load Balancer">
</p>

*Figure: Balancing multi-tier applications by using both public and internal Load Balancer*

For more information on the individual load balancer components, see [Azure Load Balancer components](./components.md).

## Why use Azure Load Balancer?
With Standard Load Balancer, you can scale your applications and create highly available services. 
Load balancer supports both inbound and outbound scenarios. Load balancer provides low latency and high throughput, and scales up to millions of flows for all TCP and UDP applications.

Key scenarios that you can accomplish using Standard Load Balancer include:

- Load balance **[internal](https://docs.microsoft.com/azure/load-balancer/tutorial-load-balancer-standard-manage-portal)** and **[external](https://docs.microsoft.com/azure/load-balancer/tutorial-load-balancer-standard-internal-portal)** traffic to Azure virtual machines.

- Increase availability by distributing resources **[within](https://docs.microsoft.com/azure/load-balancer/tutorial-load-balancer-standard-public-zonal-portal)** and **[across](https://docs.microsoft.com/azure/load-balancer/tutorial-load-balancer-standard-public-zone-redundant-portal)** zones.

- Configure **[outbound connectivity ](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections)** for Azure virtual machines.

- Use **[health probes](https://docs.microsoft.com/azure/load-balancer/load-balancer-custom-probe-overview)** to monitor load-balanced resources.

- Employ **[port forwarding](https://docs.microsoft.com/azure/load-balancer/tutorial-load-balancer-port-forwarding-portal)** to access virtual machines in a virtual network by public IP address and port.

- Enable support for **[load-balancing](https://docs.microsoft.com/azure/virtual-network/virtual-network-ipv4-ipv6-dual-stack-standard-load-balancer-powershell)** of **[IPv6](https://docs.microsoft.com/azure/virtual-network/ipv6-overview)**.

- Standard Load Balancer provides multi-dimensional metrics through [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview).  These metrics can be filtered, grouped, and broken out for a given dimension.  They provide current and historic insights into performance and health of your service.  Resource Health is also supported. Review **[Standard Load Balancer Diagnostics](load-balancer-standard-diagnostics.md)** for more details.

- Load balance services on **[multiple ports, multiple IP addresses, or both](https://docs.microsoft.com/azure/load-balancer/load-balancer-multivip-overview)**.

- Move **[internal](https://docs.microsoft.com/azure/load-balancer/move-across-regions-internal-load-balancer-portal)** and **[external](https://docs.microsoft.com/azure/load-balancer/move-across-regions-external-load-balancer-portal)** load balancer resources across Azure regions.

- Load balance TCP and UDP flow on all ports simultaneously using **[HA ports](https://docs.microsoft.com/azure/load-balancer/load-balancer-ha-ports-overview)**.

### <a name="securebydefault"></a>Secure by default

Standard Load Balancer is built on the zero trust network security model at its core. Standard Load Balancer secure by default and is part of your virtual network. The virtual network is a private and isolated network.  This means Standard Load Balancers and Standard Public IP addresses are closed to inbound flows unless opened by Network Security Groups. NSGs are used to explicitly permit allowed traffic.  If you do not have an NSG on a subnet or NIC of your virtual machine resource, traffic is not allowed to reach this resource. To learn more about NSGs and how to apply them for your scenario, see [Network Security Groups](../virtual-network/security-overview.md).
Basic Load Balancer is open to the internet by default.

## Pricing and SLA

For Standard Load Balancer pricing information, see [Load Balancer pricing](https://azure.microsoft.com/pricing/details/load-balancer/).
Basic Load Balancer is offered at no charge.
See [SLA for Load Balancer](https://aka.ms/lbsla). Basic Load Balancer has no SLA.

## Next steps
See [Upgrade a Basic Load Balancer](upgrade-basic-standard.md) to upgrade Basic Load Balancer to Standard Load Balancer.

See [Create a public Standard Load Balancer](quickstart-load-balancer-standard-public-portal.md) to get started with using a Load Balancer.

For more information on Azure Load Balancer limitations and components see [Azure Load Balancer components](./components.md) and [Azure Load Balancer concepts](./concepts.md)

For an Azure load balancing options comparison, see [Overview of load-balancing options in Azure](https://docs.microsoft.com/azure/architecture/guide/technology-choices/load-balancing-overview).
