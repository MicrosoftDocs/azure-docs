---
title: What is Azure Load Balancer?
titleSuffix: Azure Load Balancer
description: Learn what Azure Load Balancer is, its key features, and how it supports scalable, highly available cloud workloads. Discover scenarios and benefits for your organization.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: overview
ms.date: 07/09/2025
ms.author: mbender
ms.custom: portfolio-consolidation-2025
#customer intent: As an IT administrator, I want to understand what Azure Load Balancer is so that I can decide if it fits my organization's needs.
---

# What is Azure Load Balancer?

> [!Important]
>On September 30, 2025, Basic Load Balancer will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer/). If you are currently using Basic Load Balancer, make sure to upgrade to Standard Load Balancer prior to the retirement date. For guidance on upgrading, visit [Upgrading from Basic Load Balancer - Guidance](load-balancer-basic-upgrade-guidance.md).

Azure Load Balancer is a cloud service that distributes incoming network traffic across backend virtual machines (VMs) or virtual machine scale sets (VMSS). This article explains Azure Load Balancer's key features, architecture, and scenarios, helping you decide if it fits your organization's load balancing needs for scalable, highly available workloads.

*Load balancing* refers to efficiently distributing incoming network traffic across a group of backend virtual machines (VMs) or virtual machine scale sets (VMSS).

> [!NOTE]
> Azure Load Balancer is one of the services that make up the Load Balancing and Content Delivery category in Azure. Other services in this category include [Azure Front Door](../frontdoor/front-door-overview.md) and [Azure Application Gateway](../application-gateway/overview.md). Each service has its own unique features and use cases. For more information on this service category, see [Load Balancing and Content Delivery](../networking/load-balancer-content-delivery/load-balancing-content-delivery-overview.md).

## Load balancer overview

Azure Load Balancer operates at layer 4 of the Open Systems Interconnection (OSI) model. It's the single point of contact for clients. The service distributes inbound flows that arrive at the load balancer's frontend to backend pool instances. These flows are distributed according to configured load-balancing rules and health probes. The backend pool instances can be Azure virtual machines (VMs) or virtual machine scale sets.

A [public load balancer](./components.md#frontend-ip-configurations) can provide both inbound and outbound connectivity for the VMs inside your virtual network. For inbound traffic scenarios, Azure Load Balancer can load balance internet traffic to your VMs. For outbound traffic scenarios, the service can translate the VMs' private IP addresses to public IP addresses for any outbound connections that originate from your VMs.

Alternatively, an [internal (or private) load balancer](./components.md#frontend-ip-configurations) are used to load balance traffic inside a virtual network. With internal load balancer, you can provide inbound connectivity to your VMs in private network connectivity scenarios, such as accessing a load balancer frontend from an on-premises network in a hybrid scenario. 

:::image type="content" source="media/load-balancer-overview/load-balancer.png" alt-text="Screenshot of a diagram showing Azure Load Balancer directing network traffic to backend virtual machines.":::

For more information on the service's individual components, see [Azure Load Balancer components](./components.md).

Azure Load Balancer has three stock-keeping units (SKUs) - Basic, Standard, and Gateway. Each SKU is catered towards a specific scenario and has differences in scale, features, and pricing. For more information, see [Azure Load Balancer SKUs](skus.md).

## Why use Azure Load Balancer

With Azure Load Balancer, you can scale your applications and create highly available services. The service supports both inbound and outbound scenarios, provides low latency and high throughput, and scales up to millions of flows for all TCP and UDP applications.

### Core capabilities

Azure Load Balancer provides:
- **High availability**: Distribute resources [within](./tutorial-load-balancer-standard-public-zonal-portal.md) and [across](./quickstart-load-balancer-standard-public-portal.md) availability zones
- **Scalability**: Handle millions of flows for TCP and UDP applications
- **Low latency**: Use pass-through load balancing for ultralow latency
- **Flexibility**: Support for [multiple ports, multiple IP addresses, or both](./load-balancer-multivip-overview.md)
- **Health monitoring**: Use [health probes](./load-balancer-custom-probe-overview.md) to ensure traffic is only sent to healthy instances

### Traffic distribution scenarios

- Load balance [internal](./quickstart-load-balancer-standard-internal-portal.md) and [external](./quickstart-load-balancer-standard-public-portal.md) traffic to Azure virtual machines
- Configure [outbound connectivity](./load-balancer-outbound-connections.md) for Azure virtual machines
- Load balance TCP and UDP flow on all ports simultaneously using [high-availability ports](./load-balancer-ha-ports-overview.md)
- Enable [port forwarding](./tutorial-load-balancer-port-forwarding-portal.md) to access virtual machines by public IP address and port

### Advanced features

- **IPv6 support**: Enable [load balancing of IPv6](./virtual-network-ipv4-ipv6-dual-stack-standard-load-balancer-powershell.md) traffic
- **Cross-region mobility**: Move [internal](./move-across-regions-internal-load-balancer-portal.md) and [external](./move-across-regions-external-load-balancer-portal.md) load balancer resources across Azure regions
- **Gateway load balancer integration**: Chain Standard Load Balancer and [Gateway Load Balancer](./tutorial-create-gateway-load-balancer.md)
- **Global load balancing integration**: Distribute traffic [across multiple Azure regions](./cross-region-overview.md) for global applications
- **Admin State**: [Override health probe behavior](./manage-admin-state-how-to.md) for maintenance and operational management

### Monitoring and insights

- **Comprehensive metrics**: Use multidimensional metrics through [Azure Monitor](/azure/azure-monitor/overview)
- **Pre-built dashboards**: Access [Insights for Azure Load Balancer](./load-balancer-insights.md) with useful visualizations
- **Diagnostics**: Review [Standard load balancer diagnostics](load-balancer-standard-diagnostics.md) for performance insights
- **Health Event Logs**: Monitor load balancer [health events](./load-balancer-health-event-logs.md) and status changes for proactive management
- **Load Balancer health status**: Gain deeper insights into the health of your load balancer through [health status](./load-balancer-manage-health-status.md) monitoring

### <a name="securebydefault"></a>Security features

Azure Load Balancer implements security through multiple layers:

#### Zero Trust security model
- **Standard Load Balancer** is built on the Zero Trust network security model
- Part of your virtual network, which is private and isolated by default

#### Network access controls
- Standard load balancers and public IP addresses are **closed to inbound connections by default**
- **Network Security Groups (NSGs)** must explicitly permit allowed traffic
- Traffic is blocked if no NSG exists on a subnet or NIC

#### Data protection
- Azure Load Balancer **doesn't store customer data**
- All traffic processing happens in real-time without data persistence

> [!IMPORTANT]
> Basic Load Balancer is open to the internet by default and will be retired on September 30, 2025. Migrate to Standard Load Balancer for enhanced security.

To learn about NSGs and how to apply them to your scenario, see [Network security groups](../virtual-network/network-security-groups-overview.md).

## Pricing and SLA

For [Standard Load Balancer](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/load-balancer/skus.md) pricing information, see [Load Balancer pricing](https://azure.microsoft.com/pricing/details/load-balancer/). For service-level agreements (SLAs), see the [Microsoft licensing information for online services](https://aka.ms/lbsla).

Basic Load Balancer is offered at no charge and has no SLA. Also, it will be retired on September 30, 2025.

## What's new?

Subscribe to the RSS feed and view the latest Azure Load Balancer updates on the [Azure Updates](https://azure.microsoft.com/updates?filters=%5B%22Load+Balancer%22%5D) page.

## Related content

- [Create a public load balancer](quickstart-load-balancer-standard-public-portal.md)
- [Azure Load Balancer components](./components.md)
