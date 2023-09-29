---
title: What is Azure Load Balancer?
titleSuffix: Azure Load Balancer
description: Overview of Azure Load Balancer features, architecture, and implementation. Learn how the Load Balancer works and how to use it in the cloud.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
# Customer intent: As an IT administrator, I want to learn more about the Azure Load Balancer service and what I can use it for. 
ms.topic: overview
ms.workload: infrastructure-services
ms.date: 09/15/2023
ms.author: mbender
ms.custom: template-overview, engagement-fy23
---

# What is Azure Load Balancer?

*Load balancing* refers to efficiently distributing incoming network traffic across a group of backend servers or resources.

Azure Load Balancer operates at layer 4 of the Open Systems Interconnection (OSI) model. It's the single point of contact for clients. Load balancer distributes inbound flows that arrive at the load balancer's front end to backend pool instances. These flows are according to configured load-balancing rules and health probes. The backend pool instances can be Azure Virtual Machines or instances in a Virtual Machine Scale Set.

A **[public load balancer](./components.md#frontend-ip-configurations)** can provide outbound connections for virtual machines (VMs) inside your virtual network. These connections are accomplished by translating their private IP addresses to public IP addresses. Public Load Balancers are used to load balance internet traffic to your VMs.

An **[internal (or private) load balancer](./components.md#frontend-ip-configurations)** is used where private IPs are needed at the frontend only. Internal load balancers are used to load balance traffic inside a virtual network. A load balancer frontend can be accessed from an on-premises network in a hybrid scenario.

:::image type="content" source="media/load-balancer-overview/load-balancer.png" alt-text="Diagram depicts public and internal load balancers directing traffic to web and business tiers.":::

*Figure: Balancing multi-tier applications by using both public and internal Load Balancer*

For more information on the individual load balancer components, see [Azure Load Balancer components](./components.md).

>[!NOTE]
> Azure provides a suite of fully managed load-balancing solutions for your scenarios. 
> * If you are looking to do DNS based global routing and do **not** have requirements for Transport Layer Security (TLS) protocol termination ("SSL offload"), per-HTTP/HTTPS request or application-layer processing, review [Traffic Manager](../traffic-manager/traffic-manager-overview.md). 
> * If you want to load balance between your servers in a region at the application layer, review [Application Gateway](../application-gateway/overview.md).
> * If you need to optimize global routing of your web traffic and optimize top-tier end-user performance and reliability through quick global failover, see [Front Door](../frontdoor/front-door-overview.md).
> 
> Your end-to-end scenarios may benefit from combining these solutions as needed.
> For an Azure load-balancing options comparison, see [Overview of load-balancing options in Azure](/azure/architecture/guide/technology-choices/load-balancing-overview).


## Why use Azure Load Balancer?
With Azure Load Balancer, you can scale your applications and create highly available services. 
Load balancer supports both inbound and outbound scenarios. Load balancer provides low latency and high throughput, and scales up to millions of flows for all TCP and UDP applications.

Key scenarios that you can accomplish using Azure Standard Load Balancer include:

- Load balance **[internal](./quickstart-load-balancer-standard-internal-portal.md)** and **[external](./quickstart-load-balancer-standard-public-portal.md)** traffic to Azure virtual machines.

- Increase availability by distributing resources **[within](./tutorial-load-balancer-standard-public-zonal-portal.md)** and **[across](./quickstart-load-balancer-standard-public-portal.md)** zones.

- Configure **[outbound connectivity](./load-balancer-outbound-connections.md)** for Azure virtual machines.

- Use **[health probes](./load-balancer-custom-probe-overview.md)** to monitor load-balanced resources.

- Employ **[port forwarding](./tutorial-load-balancer-port-forwarding-portal.md)** to access virtual machines in a virtual network by public IP address and port.

- Enable support for **[load-balancing](./virtual-network-ipv4-ipv6-dual-stack-standard-load-balancer-powershell.md)** of **[IPv6](../virtual-network/ip-services/ipv6-overview.md)**.

- Standard load balancer provides multi-dimensional metrics through [Azure Monitor](../azure-monitor/overview.md).  These metrics can be filtered, grouped, and broken out for a given dimension.  They provide current and historic insights into performance and health of your service. [Insights for Azure Load Balancer](./load-balancer-insights.md) offers a preconfigured dashboard with useful visualizations for these metrics.  Resource Health is also supported. Review **[Standard load balancer diagnostics](load-balancer-standard-diagnostics.md)** for more details.

- Load balance services on **[multiple ports, multiple IP addresses, or both](./load-balancer-multivip-overview.md)**.

- Move **[internal](./move-across-regions-internal-load-balancer-portal.md)** and **[external](./move-across-regions-external-load-balancer-portal.md)** load balancer resources across Azure regions.

- Load balance TCP and UDP flow on all ports simultaneously using **[HA ports](./load-balancer-ha-ports-overview.md)**.

- Chain Standard Load Balancer and [Gateway Load Balancer](./tutorial-gateway-portal.md).

### <a name="securebydefault"></a>Secure by default

* Standard load balancer is built on the zero trust network security model.

* Standard Load Balancer is secure by default and part of your virtual network. The virtual network is a private and isolated network.  

* Standard load balancers and standard public IP addresses are closed to inbound connections unless opened by Network Security Groups. NSGs are used to explicitly permit allowed traffic.  If you don't have an NSG on a subnet or NIC of your virtual machine resource, traffic isn't allowed to reach this resource. To learn about NSGs and how to apply them to your scenario, see [Network Security Groups](../virtual-network/network-security-groups-overview.md).

* Basic load balancer is open to the internet by default. 

* Load balancer doesn't store customer data.

## Pricing and SLA

For standard load balancer pricing information, see [Load balancer pricing](https://azure.microsoft.com/pricing/details/load-balancer/).
Basic load balancer is offered at no charge.
See [SLA for load balancer](https://aka.ms/lbsla). Basic load balancer has no SLA.

## What's new?

Subscribe to the RSS feed and view the latest Azure Load Balancer feature updates on the [Azure Updates](https://azure.microsoft.com/updates/?category=networking&query=load%20balancer) page.

## Next steps

* See [Create a public standard load balancer](quickstart-load-balancer-standard-public-portal.md) to get started with using a load balancer.

* For more information on Azure Load Balancer limitations and components, see [Azure Load Balancer components](./components.md) and [Azure Load Balancer concepts](./concepts.md)

* [Learn module: Introduction to Azure Load Balancer](/training/paths/intro-to-azure-application-delivery-services).
