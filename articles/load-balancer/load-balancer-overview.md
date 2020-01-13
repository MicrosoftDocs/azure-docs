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
ms.date: 12/05/2019
ms.author: allensu

---

# What is Azure Load Balancer?

*Load balancing* refers to evenly distributing load (incoming network traffic) across a group of backend resources or servers. Azure offers a [variety of load balancing options](https://docs.microsoft.com/azure/architecture/guide/technology-choices/load-balancing-overview) that you can choose from based on your need. This document covers the Azure Load Balancer.

Azure Load Balancer operates at layer four of the Open Systems Interconnection (OSI) model. It's the single point of contact for clients. Load balancer distributes new inbound flows that arrive at the load balancer's front end to back-end pool instances. These flows are according to configured load-balancing rules and health probes. The back-end pool instances can be Azure Virtual Machines or instances in a virtual machine scale set.

>[!NOTE]
> Microsoft recommends Standard Load Balancer.
Standalone VMs, availability sets, and virtual machine scale sets can be connected to only one SKU, never both. Load Balancer and the public IP address SKU must match when you use them with public IP addresses. Load Balancer and public IP SKUs aren't mutable.

## Why use Azure Load Balancer?
With Azure Load Balancer, you can scale your applications and create highly available services. 
Load balancer supports both inbound and outbound scenarios. Load balancer provides low latency and high throughput, and scales up to millions of flows for all TCP and UDP applications.

A **[public load balancer](./concepts-limitations.md#publicloadbalancer)** can provide outbound connections for virtual machines (VMs) inside your virtual network. These connections are accomplished by translating their private IP addresses to public IP addresses. Public Load Balancers are used to load balancer internet traffic to your VMs.

An **[internal (or private) load balancer](./concepts-limitations.md#internalloadbalancer)** is used where private IPs are needed at the frontend only. Internal load balancers are used to load balance traffic inside a virtual network. A load balancer frontend can be accessed from an on-premises network in a hybrid scenario.

<div align="center">
  <img src='./media/load-balancer-arm/load-balancer-arm.png'>
</div>

For more information on the individual load balancer components, see [Azure Load Balancer components and limitations](./concepts-limitations.md)

### Load Balancer Options

For more information on the key scenarios that you can implement, see the Load Balancing options below:

- **Health Monitoring**: [Standard Load Balancer diagnostics with metrics, alerts and resource health](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-diagnostics)

- **HA Ports**: [High availability ports overview](https://docs.microsoft.com/azure/load-balancer/load-balancer-ha-ports-overview)

- **IPV6**: [What is IPv6 for Azure Virtual Network? (Preview)](https://docs.microsoft.com/azure/virtual-network/ipv6-overview)

- **Port Forwarding**: [Tutorial: Configure port forwarding in Azure Load Balancer using the portal](https://docs.microsoft.com/azure/load-balancer/tutorial-load-balancer-port-forwarding-portal)

- **Availability Zones**: [Standard Load Balancer and Availability Zones](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-availability-zones)

- **Outbound Connections and Outbound Rules**: [Outbound connections in Azure](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections), [Load Balancer outbound rules](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-rules-overview)


## Pricing

Standard Load Balancer usage is charged.

* Number of configured load-balancing and outbound rules. Inbound NAT rules don't count in the total number of rules.
* Amount of data processed inbound and outbound independent of rules.

For Standard Load Balancer pricing information, see [Load Balancer pricing](https://azure.microsoft.com/pricing/details/load-balancer/).

Basic Load Balancer is offered at no charge.

## SLA

For information about the Standard Load Balancer SLA, see [SLA for Load Balancer](https://aka.ms/lbsla).

## Next steps

See [Create a public Standard Load Balancer](quickstart-load-balancer-standard-public-portal.md) to get started with using a Load Balancer.

For more information on Azure Load Balancer limitations and components, see [Azure Load Balancer concepts and limitations](./concepts-limitations.md)
