---
title: Guidance for virtual machine scale sets with Azure Standard Load Balancer
description: Learn about working with virtual machine scale sets and Azure Standard Load Balancer.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 05/03/2023
ms.author: mbender
ms.custom: template-concept, seodec18, engagement-fy23
---

# Guidance for Virtual Machine Scale Sets with Azure Load Balancer

When you work with Virtual Machine Scale Sets and Azure Load Balancer, consider the following guidelines.

## Port forwarding and inbound NAT rules

After the scale set has been created, the back-end port can't be modified for a load-balancing rule used by a health probe of the load balancer. To change the port, remove the health probe by updating the virtual machine scale set and updating the port. Then configure the health probe again.

When you use the Virtual Machine Scale Set in the back-end pool of the load balancer, the default inbound NAT rules are created automatically.
  
## Load-balancing rules

When you use the Virtual Machine Scale Set in the back-end pool of the load balancer, the default load-balancing rule is created automatically.

## Virtual Machine Scale Set instance-level IPs

When Virtual Machine Scale Sets with [public IPs per instance](../virtual-machine-scale-sets/virtual-machine-scale-sets-networking.md) are created with a load balancer in front,  the SKU of the Load Balancer (that is, Basic or Standard) determines the SKU of the instance IPs.

## Outbound rules

To create an outbound rule for a back-end pool that's already referenced by a load-balancing rule, select **No** under **Create implicit outbound rules** in the Azure portal when the inbound load-balancing rule is created.

  :::image type="content" source="./media/vm-scale-sets/load-balancer-and-vm-scale-sets.png" alt-text="Screenshot that shows load-balancing rule creation." border="true":::

Use the following methods to deploy a Virtual Machine Scale Sets with an existing instance of Load Balancer:

* [Configure a Virtual Machine Scale Sets with an existing instance of Azure Load Balancer using the Azure portal](./configure-vm-scale-set-portal.md)
* [Configure a Virtual Machine Scale Sets with an existing instance of Azure Load Balancer using Azure PowerShell](./configure-vm-scale-set-powershell.md)
* [Configure a Virtual Machine Scale Sets with an existing instance of Azure Load Balancer using the Azure CLI](./configure-vm-scale-set-cli.md)
