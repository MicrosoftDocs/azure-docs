---
title: What is Azure Load Balancer?
titleSuffix: Azure Load Balancer
description: Overview of Azure Load Balancer features, architecture, and implementation. Learn how the Load Balancer works and how to leverage it in the cloud.
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

*Load balancing* refers to efficiently distributing load or incoming network traffic across a group of backend resources or servers. Azure offers a [variety of load balancing options](https://docs.microsoft.com/azure/architecture/guide/technology-choices/load-balancing-overview) that you can choose from based on your need. This document covers the Azure Load Balancer.

Azure Load Balancer operates at layer four of the Open Systems Interconnection (OSI) model. It is the single point of contact for clients. Load balancer distributes new inbound flows that arrive at the load balancer's front end to back-end pool instances, according to specified load balancing rules and health probes. The back-end pool instances can be Azure Virtual Machines or instances in a virtual machine scale set.

## Why use Azure Load Balancer?
With Azure Load Balancer, you can scale your applications and create high available services. 
Load balancer supports both, inbound and outbound scenarios, provides low latency and high throughput, and scales up to millions of flows for all TCP and UDP applications.

A **[public load balancer](./concepts-limitations.md#publicloadbalancer)** can provide outbound connections for virtual machines (VMs) inside your virtual network by translating their private IP addresses to public IP addresses. Public Load Balancers are used to load balancer internet traffic to your VMs.

An **[internal (or private) load balancer](./concepts-limitations.md#internalloadbalancer)** can be used for scenarios where only private IP addresses are needed at the frontend. Internal load balancers are used to load balance traffic inside a virtual network. You can also reach a load balancer frontend from an on-premises network in a hybrid scenario.

![](./media/load-balancer-arm/load-balancer-arm.png)

For more information on the individual load balancer components, see [Azure Load Balancer concepts and limitations](./concepts-limitations.md)

## <a name="skus"></a> Load Balancer SKU comparison

Load balancer supports both Basic and Standard SKUs. These SKUs differ in scenario scale, features, and pricing. Any scenario that's possible with Basic Load Balancer can be created with Standard Load Balancer. The APIs for both SKUs are similar and are invoked through the specification of a SKU. The API for supporting SKUs for load balancer and the public IP is available starting with the `2017-08-01` API. Both SKUs share the same general API and structure.

The complete scenario configuration might differ slightly depending on SKU. Load balancer documentation calls out when an article applies only to a specific SKU. To compare and understand the differences, see the following table. For more information, see [Azure Standard Load Balancer overview](load-balancer-standard-overview.md).

>[!NOTE]
> Microsoft recommends Standard Load Balancer.
Standalone VMs, availability sets, and virtual machine scale sets can be connected to only one SKU, never both. Load Balancer and the public IP address SKU must match when you use them with public IP addresses. Load Balancer and public IP SKUs aren't mutable.

[!INCLUDE [comparison table](../../includes/load-balancer-comparison-table.md)]

For more information, see [Load balancer limits](https://aka.ms/lblimits). For Standard Load Balancer details, see [overview](load-balancer-standard-overview.md), [pricing](https://aka.ms/lbpricing), and [SLA](https://aka.ms/lbsla).


## Pricing

Standard Load Balancer usage is charged.

* Number of configured load-balancing and outbound rules. Inbound NAT rules don't count in the total number of rules.
* Amount of data processed inbound and outbound independent of rules.

For Standard Load Balancer pricing information, see [Load Balancer pricing](https://azure.microsoft.com/pricing/details/load-balancer/).

Basic Load Balancer is offered at no charge.

## SLA

For information about the Standard Load Balancer SLA, see [SLA for Load Balancer](https://aka.ms/lbsla).

## Next steps

See [Create a public Standard Load Balancer](quickstart-load-balancer-standard-public-portal.md) to get started with using a Load Balancer: create one, create VMs with a custom IIS extension installed, and load balance the web app between the VMs.

For more information on Azure Load Balancer limitations and components, see [Azure Load Balancer concepts and limitations](./concepts-limitations.md)
