---
title: Inbound NAT rules
titleSuffix: Azure Load Balancer
description: Overview of what is inbound NAT rule, why to use inbound NAT rule, and how to use inbound NAT rule.
author: asudbring
ms.service: load-balancer
ms.topic: conceptual
ms.custom:
ms.date: 2/17/2022
ms.author: allensu
#Customer intent: As a administrator, I want to create an inbound NAT rule so that I can forward a port to a virtual machine in the backend pool of an Azure Load Balancer.
---

# Inbound NAT rules

An inbound NAT rule is used to forward traffic from a load balancer frontend to one or more instances in the backend pool.

## Why use inbound NAT rule?

An inbound NAT rule is used for port forwarding. Port forwarding lets you connect to virtual machines by using the load balancer frontend IP address and port number. The load balancer will receive the traffic on a port, and based on the inbound NAT rule, forwards the traffic to a designated virtual machine on a specific backend port. 

## Types of inbound NAT rule

There are two types of inbound NAT rule available for Azure Load Balancer, single virtual machine and multiple virtual machines.

### Single virtual machine

A single virtual machine inbound NAT rule is defined for a single target virtual machine. The load balancer's frontend IP address and the selected frontend port are used for connections to the virtual machine.

:::image type="content" source="./media/inbound-nat-rules/inbound-nat-rule.png" alt-text="Diagram of a single virtual machine inbound NAT rule.":::

### Multiple virtual machines and virtual machine scale sets

A multiple virtual machines inbound NAT rule references the entire backend pool in the rule. A range of frontend ports are pre-allocated based on the rule settings of **

Instead of choosing a single target machine, you can also reference the entire backend pool in the inbound NAT rule. A range of frontend ports will be pre-allocated based on your input of *frontend port range start* and *maximum number of machines in backend pool*. Upon creation of inbound NAT rule, port mappings will be created so that each instance in the backend pool can be connected to through a frontend port taken from the pre-allocated range. During the event of scaling down the backend pool, existing port mappings for the remaining instances will stay the same. And during the event of scaling up the backend pool, new port mappings will be created automatically for the new instances without the need to update the inbound NAT rule settings.

>[!NOTE]
> If the pre-defined frontend port range does not have sufficient number of frontend ports available, scaling up the backend pool will be blocked. And this could result in lack of network connectivity for the new instances. 


## Port Mapping Retrival
To retrieve the frontend port number for a specific instance in the backend pool, you can leverage the port mapping retrival API. 
Read more here. Insert how-to doc.
