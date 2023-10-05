---
title: Inbound NAT rules
titleSuffix: Azure Load Balancer
description: Overview of what is inbound NAT rule, why to use inbound NAT rule, and how to use inbound NAT rule.
author: mbender-ms
ms.service: load-balancer
ms.topic: conceptual
ms.date: 05/03/2023
ms.author: mbender
ms.custom: template-concept, engagement-fy23
#Customer intent: As a administrator, I want to create an inbound NAT rule so that I can forward a port to a virtual machine in the backend pool of an Azure Load Balancer.
---

# Inbound NAT rules

An inbound NAT rule is used to forward traffic from a load balancer frontend to one or more instances in the backend pool.

## Why use an inbound NAT rule?

An inbound NAT rule is used for port forwarding. Port forwarding lets you connect to virtual machines by using the load balancer frontend IP address and port number. The load balancer receives the traffic on a port, and based on the inbound NAT rule, forwards the traffic to a designated virtual machine on a specific backend port. 

## Types of inbound NAT rules

There are two types of inbound NAT rule available for Azure Load Balancer, single virtual machine and multiple virtual machines.

### Single virtual machine

A single virtual machine inbound NAT rule is defined for a single target virtual machine. The load balancer's frontend IP address and the selected frontend port are used for connections to the virtual machine.

:::image type="content" source="./media/inbound-nat-rules/inbound-nat-rule.png" alt-text="Diagram of a single virtual machine inbound NAT rule.":::

### Multiple virtual machines and virtual machine scale sets

A multiple virtual machines inbound NAT rule references the entire backend pool in the rule. A range of frontend ports are preallocated based on the rule settings of **Frontend port range start** and **Maximum number of machines in the backend pool**.

:::image type="content" source="./media/inbound-nat-rules/add-inbound-nat-rule.png" alt-text="Screenshot of a multiple virtual machines inbound NAT rule.":::

During inbound port rule creation, port mappings are made to the backend pool from the preallocated range that's defined in the rule.

When the backend pool is scaled down, existing port mappings for the remaining virtual machines persist. When the backend pool is scaled up, new port mappings are created automatically for the new virtual machines added to the backend pool. An update to the inbound NAT rule settings isn't required.

:::image type="content" source="./media/inbound-nat-rules/inbound-nat-rule-port-mapping.png" alt-text="Diagram of a multiple virtual machine inbound NAT rule.":::

>[!NOTE]
> If the pre-defined frontend port range doesn't have a sufficient number of frontend ports available, scaling up the backend pool will be blocked. This blockage could result in a lack of network connectivity for the new instances. 

## Port mapping retrieval

You can use the portal to retrieve the port mappings for virtual machines in the backend pool. For more information, see [Manage inbound NAT rules](manage-inbound-nat-rules.md#view-port-mappings).

## Next steps

For more information about Azure Load Balancer inbound NAT rules, see:

* [Manage inbound NAT rules](manage-inbound-nat-rules.md)

* [Tutorial: Create a multiple virtual machines inbound NAT rule using the Azure portal](tutorial-nat-rule-multi-instance-portal.md)

* [Tutorial: Create a single virtual machine inbound NAT rule using the Azure portal](tutorial-load-balancer-port-forwarding-portal.md)

* [Tutorial: Migrate from Inbound NAT Pools to NAT Rules](load-balancer-nat-pool-migration.md) 


