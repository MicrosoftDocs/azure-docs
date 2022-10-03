---
title: Add rules for Azure Standard Load Balancer and virtual machine scale sets
titleSuffix: Add rules for Azure Standard Load Balancer and virtual machine scale sets
description: With this learning path, get started with Azure Standard Load Balancer and virtual machine scale sets.
services: load-balancer
documentationcenter: na
author: mbender-ms
ms.custom: seodec18
ms.service: load-balancer
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/17/2020
ms.author: mbender
---
# Add rules for Azure Load Balancer with virtual machine scale sets

When you work with virtual machine scale sets and Azure Load Balancer, consider the following guidelines.

## Port forwarding and inbound NAT rules

After the scale set has been created, the back-end port can't be modified for a load-balancing rule used by a health probe of the load balancer. To change the port, remove the health probe by updating the virtual machine scale set and updating the port. Then configure the health probe again.

When you use the virtual machine scale set in the back-end pool of the load balancer, the default inbound NAT rules are created automatically.
  
## Inbound NAT pool

Each virtual machine scale set must have at least one inbound NAT pool. An inbound NAT pool is a collection of inbound NAT rules. One inbound NAT pool can't support multiple virtual machine scale sets.

## Load-balancing rules

When you use the virtual machine scale set in the back-end pool of the load balancer, the default load-balancing rule is created automatically.

## Virtual Machine Scale Set Instance-level IPs

When virtual machine scale sets with [public IPs per instance](../virtual-machine-scale-sets/virtual-machine-scale-sets-networking.md) are created with a load balancer in front, the SKU of the instance IPs is determined by the SKU of the Load Balancer (i.e. Basic or Standard).

## Outbound rules

To create an outbound rule for a back-end pool that's already referenced by a load-balancing rule, select **No** under **Create implicit outbound rules** in the Azure portal when the inbound load-balancing rule is created.

  :::image type="content" source="./media/vm-scale-sets/load-balancer-and-vm-scale-sets.png" alt-text="Screenshot that shows load-balancing rule creation." border="true":::

Use the following methods to deploy a virtual machine scale set with an existing instance of Load Balancer:

* [Configure a virtual machine scale set with an existing instance of Azure Load Balancer using the Azure portal](./configure-vm-scale-set-portal.md)
* [Configure a virtual machine scale set with an existing instance of Azure Load Balancer using Azure PowerShell](./configure-vm-scale-set-powershell.md)
* [Configure a virtual machine scale set with an existing instance of Azure Load Balancer using the Azure CLI](./configure-vm-scale-set-cli.md)
* [Update or delete an existing instance of Azure Load Balancer used by a virtual machine scale set](./update-load-balancer-with-vm-scale-set.md)