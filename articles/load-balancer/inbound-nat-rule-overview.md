---
title: Inbound NAT Rule Overview
titleSuffix: Azure Load Balancer
description: Overview of what is inbound NAT rule, why to use inbound NAT rule, and how to use inbound NAT rule.
services: load-balancer
documentationcenter: na
author: irenehua
ms.service: load-balancer
# Customer intent: As an IT administrator, I want to learn more about the Azure Load Balancer service and what I can use it for. 
ms.topic: inbound NAT rule overview
ms.custom: seodec18
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 2/17/2022
ms.author: irenehua

---

# Inbound NAT Rule Overview

An *inbound NAT rule* lets you forward traffic from specific port of the Load Balancer frontend to specific port of the instance in the backend pool. 

## Why use inbound NAT rule?
### <a name="portforwarding"></a>Port Forwarding
Port forwarding lets you connect to Virtual Machines by using the Load Balancer frontend IP address and port number. The Load Balancer will receive the traffic on a certain port, and based on the inbound NAT rule it will forward the traffic to a specific Virtual Machine on a specific backend port. 

[Picture here to indicate that customers can access Virtual Machine on port B through LB using port A]

## Inbound NAT rule for a single Virtual Machine in the backend pool
By defining the inbound NAT rule for a single target machine, you can now connect to the virtual machine using the Azure Load Balancer frontend IP and selected frontend port. 

## Inbound NAT rule for Virtual Machine Scale Set or a group of Virtual Machines
Instead of choosing a single target machine, you can also reference the entire backend pool in the inbound NAT rule. A range of frontend ports will be pre-allocated based on your input of *frontend port range start* and *maximum number of machines in backend pool*. Upon creation of inbound NAT rule, port mappings will be created so that each instance in the backend pool can be connected to through a frontend port taken from the pre-allocated range. During the event of scaling down the backend pool, existing port mappings for the remaining instances will stay the same. And during the event of scaling up the backend pool, new port mappings will be created automatically for the new instances without the need to update the inbound NAT rule settings.

>[!NOTE]
> If the pre-defined frontend port range does not have sufficient number of frontend ports available, scaling up the backend pool will be blocked. And this could result in lack of network connectivity for the new instances. 


## Port Mapping Retrival
To retrieve the frontend port number for a specific instance in the backend pool, you can leverage the port mapping retrival API. 
Read more here. Insert how-to doc.
