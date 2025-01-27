---
title: What is Azure Load Balancer?
titleSuffix: Azure Load Balancer
description: Get an overview of Azure Load Balancer features, architecture, and implementation. Learn how the service works and how to use it in the cloud.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: overview
ms.date: 06/18/2024
ms.author: mbender
ms.custom: template-overview, engagement-fy23
# Customer intent: As an IT administrator, I want to learn more about the Azure Load Balancer service and what I can use it for.
---

# What is Azure Load Balancer?

*Load balancing* refers to efficiently distributing incoming network traffic across a group of backend servers or resources.

Azure Load Balancer operates at layer 4 of the Open Systems Interconnection (OSI) model. It's the single point of contact for clients. The service distributes inbound flows that arrive at the load balancer's frontend to backend pool instances. These flows are distributed according to configured load-balancing rules and health probes. The backend pool instances can be Azure virtual machines (VMs) or virtual machine scale sets.

A [public load balancer](./components.md#frontend-ip-configurations) can provide both inbound and outbound connectivity for the VMs inside your virtual network. For inbound traffic scenarios, Azure Load Balancer can load balance internet traffic to your VMs. For outbound traffic scenarios, the service can translate the VMs' private IP addresses to public IP addresses for any outbound connections that originate from your VMs.

Alternatively, an [internal (or private) load balancer](./components.md#frontend-ip-configurations) can provide inbound connectivity to your VMs in private network connectivity scenarios, such as accessing a load balancer frontend from an on-premises network in a hybrid scenario. Internal load balancers are used to load balance traffic inside a virtual network.

:::image type="content" source="media/load-balancer-overview/load-balancer.png" alt-text="Diagram that depicts a load balancer directing traffic.":::

For more information on the service's individual components, see [Azure Load Balancer components](./components.md).

## Why use Azure Load Balancer?

With Azure Load Balancer, you can scale your applications and create highly available services.

The service supports both inbound and outbound scenarios. It provides low latency and high throughput, and it scales up to millions of flows for all TCP and UDP applications.

Key scenarios that you can accomplish by using Azure Standard Load Balancer include:

- Load balance [internal](./quickstart-load-balancer-standard-internal-portal.md) and [external](./quickstart-load-balancer-standard-public-portal.md) traffic to Azure virtual machines.

- Use pass-through load balancing, which results in ultralow latency.

- Increase availability by distributing resources [within](./tutorial-load-balancer-standard-public-zonal-portal.md) and [across](./quickstart-load-balancer-standard-public-portal.md) zones.

- Configure [outbound connectivity](./load-balancer-outbound-connections.md) for Azure virtual machines.

- Use [health probes](./load-balancer-custom-probe-overview.md) to monitor load-balanced resources.

- Employ [port forwarding](./tutorial-load-balancer-port-forwarding-portal.md) to access virtual machines in a virtual network by public IP address and port.

- Enable support for [load balancing](./virtual-network-ipv4-ipv6-dual-stack-standard-load-balancer-powershell.md) of [IPv6](../virtual-network/ip-services/ipv6-overview.md).

- Use multidimensional metrics through [Azure Monitor](/azure/azure-monitor/overview). You can filter, group, and break out these metrics for a particular dimension. They provide current and historic insights into performance and health of your service.

  [Insights for Azure Load Balancer](./load-balancer-insights.md) offer a preconfigured dashboard with useful visualizations for these metrics. Resource Health is also supported. For more details, review [Standard load balancer diagnostics](load-balancer-standard-diagnostics.md).

- Load balance services on [multiple ports, multiple IP addresses, or both](./load-balancer-multivip-overview.md).

- Move [internal](./move-across-regions-internal-load-balancer-portal.md) and [external](./move-across-regions-external-load-balancer-portal.md) load balancer resources across Azure regions.

- Load balance TCP and UDP flow on all ports simultaneously by using [high-availability ports](./load-balancer-ha-ports-overview.md).

- Chain Standard Load Balancer and [Gateway Load Balancer](./tutorial-gateway-portal.md).

### <a name="securebydefault"></a>Security by default

- Standard Load Balancer is built on the Zero Trust network security model.

- Standard Load Balancer is part of your virtual network, which is private and isolated for security.

- Standard load balancers and standard public IP addresses are closed to inbound connections, unless network security groups (NSGs) open them. You use NSGs to explicitly permit allowed traffic. If you don't have an NSG on a subnet or network interface card (NIC) of your virtual machine resource, traffic isn't allowed to reach the resource. To learn about NSGs and how to apply them to your scenario, see [Network security groups](../virtual-network/network-security-groups-overview.md).

- Basic Load Balancer is open to the internet by default.

- Azure Load Balancer doesn't store customer data.

## Pricing and SLA

For Standard Load Balancer pricing information, see [Load Balancer pricing](https://azure.microsoft.com/pricing/details/load-balancer/). For service-level agreements (SLAs), see the [Microsoft licensing information for online services](https://aka.ms/lbsla).

Basic Load Balancer is offered at no charge and has no SLA.

## What's new?

Subscribe to the RSS feed and view the latest Azure Load Balancer updates on the [Azure Updates](https://azure.microsoft.com/updates?filters=%5B%22Load+Balancer%22%5D) page.

## Related content

- [Create a public load balancer](quickstart-load-balancer-standard-public-portal.md)
- [Azure Load Balancer components](./components.md)
