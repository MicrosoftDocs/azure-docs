---
title: Configure Inbound NAT Rules for Virtual Machine Scale Sets
description: Learn how to configure, update, and delete inbound NAT Rules for Virtual Machine Scale Set instances. Azure offers two options for Inbound NAT rules.
author: mbender-ms
ms.author: mbender
ms.service: azure-load-balancer
ms.topic: how-to 
ms.date: 07/17/2026
ms.custom: template-how-to, devx-track-azurecli
# Customer intent: As a cloud administrator, I want to configure and manage inbound NAT rules for Virtual Machine Scale Sets, so that I can efficiently handle traffic distribution and improve scalability in my applications.
---

# Configure inbound NAT Rules for Virtual Machine Scale Sets

In this article, you'll learn how to configure, update, and delete inbound NAT Rules for Virtual Machine Scale Set instances. Azure offers two options for inbound NAT rules. The first option is the ability to add a single inbound NAT rule to a single backend resource. The second option is the ability to create a group of inbound NAT rules for a backend pool. It's recommended to use the second option for inbound NAT rules when using Virtual Machine Scale Sets, since this option provides better flexibility and scalability. Learn more about the various options for [inbound NAT rules](inbound-nat-rules.md). 

## Prerequisites

- A Standard SKU [Azure Load Balancer](quickstart-load-balancer-standard-public-portal.md) in the same subscription as the Virtual Machine Scale Set.
- A [Virtual Machine Scale Set instance](configure-vm-scale-set-portal.md) in the backend pool of the load balancer.
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Manage inbound NAT rules

You can't add, update, or delete individual inbound NAT rules for a virtual machine scale set. Instead, use inbound NAT rule V2, which targets a backend pool with a defined, non-overlapping frontend port range and backend port for all instances in the scale set.

For the shared Azure portal, PowerShell, and CLI steps to create, change the port range allocation for, and remove an inbound NAT rule V2, see [Inbound NAT rule V2 for virtual machines and virtual machine scale sets](manage-inbound-nat-rules.md#inbound-nat-rule-v2-for-virtual-machines-and-virtual-machine-scale-sets).

You can attach multiple sets of inbound NAT rules to a single virtual machine scale set, as long as the rules' frontend port ranges don't overlap.

## Next steps
To learn more about Azure Load Balancer and Virtual Machine Scale Sets, read more about the concepts. 

Learn to use [Azure Load Balancer with Virtual Machine Scale Sets](load-balancer-standard-virtual-machine-scale-sets.md).
