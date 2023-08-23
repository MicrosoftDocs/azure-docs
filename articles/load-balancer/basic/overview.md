---
title: What is Basic Azure Load Balancer?
description: Overview of Basic Azure Load Balancer.
author: mbender-ms
ms.service: load-balancer
ms.author: mbender
ms.topic: overview
ms.date: 04/11/2023
ms.custom: template-overview, engagement-fy23
---

# What is Basic Azure Load Balancer?

Basic Azure Load Balancer is a SKU of Azure Load Balancer. A basic load balancer provides limited features and capabilities. Azure recommends a standard SKU Azure Load Balancer for production environments. 

For more information on a standard SKU Azure Load Balancer, see [What is Azure Load Balancer?](../load-balancer-overview.md). 

For more information about the Azure Load Balancer SKUs, see [SKUs](../skus.md).

## Load balancer types

An Azure Load Balancer is available in two types:

A **[public load balancer](../components.md#frontend-ip-configurations)** can provide outbound connections for virtual machines (VMs) inside your virtual network. These connections are accomplished by translating their private IP addresses to public IP addresses. Public load balancers are used to load balance internet traffic to your VMs.

An **[internal (or private) load balancer](../components.md#frontend-ip-configurations)** is used where private IPs are needed at the frontend only. Internal load balancers are used to load balance traffic inside a virtual network. A load balancer frontend can be accessed from an on-premises network in a hybrid scenario.

## Next steps

For more information on creating a basic load balancer, see:

- [Quickstart: Create a basic internal load balancer - Azure portal](./quickstart-basic-internal-load-balancer-portal.md)
- [Quickstart: Create a basic public load balancer - Azure portal](./quickstart-basic-public-load-balancer-portal.md)

