---
title: Azure Standard Load Balancer and Virtual Machine Scale Sets
titleSuffix: Azure Standard Load Balancer and Virtual Machine Scale Sets
description: With this learning path, get started with Azure Standard Load Balancer and Virtual Machine Scale Sets.
services: load-balancer
documentationcenter: na
author: irenehua
ms.custom: seodec18
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/17/2020
ms.author: irenehua
---
# Azure Load Balancer with Azure virtual machine scale sets

When working with virtual machine scale sets and load balancer, the following guidelines should be considered:

## Multiple virtual machine scale sets can't use the same load balancer
  * Only one virtual machine scale set can be associated with a load balancer.  This is because each virtual machine scale set also represents an [availability set](https://docs.microsoft.com/azure/virtual-machines/windows/manage-availability#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy)-- and only one availability set can be added to a load balancer backend pool.
## Port Forwarding and inbound NAT rules:
  * After the scale set has been created, the backend port cannot be modified for a load balancing rule used by a health probe of the load balancer. To change the port, you can remove the health probe by updating the Azure virtual machine scale set, update the port and then configure the health probe again.
  * When using the virtual machine scale set in the backend pool of the load balancer, the default inbound NAT rules get created automatically.
## Inbound NAT pool:
  * Each virtual machine scale set must have at least one inbound NAT pool. 
  * Inbound NAT pool is a collection of inbound NAT rules. One inbound NAT pool cannot support multiple virtual machine scales sets.
  * In order to delete a NAT pool from an existing virtual machine scale set, you need to first remove the NAT pool from the scale set.  This also applies if you want to remove a Public IP associated with a frontend of a Standard Load Balancer with a virtual machine scale set in the backend pool.  A full example using CLI is shown below:
```azurecli-interactive
  az vmss update
     --resource-group MyResourceGroup
     --name MyVMSS
     --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerInboundNatPools
  az vmss update-instances
     -–instance-ids *
     --resource-group MyResourceGroup
     --name MyVMSS
  az network lb inbound-nat-pool delete
     --resource-group MyResourceGroup
     -–lb-name MyLoadBalancer
     --name MyNatPool
  az network lb frontend-ip delete
     --resource-group MyResourceGroup
     -–lb-name MyLoadBalancer
     --name MyFrontendIp
```
## Load balancing rules:
  * When using the virtual machine scale set in the backend pool of the load balancer, the default load balancing rule gets created automatically.
## Outbound rules:
  *  To create outbound rule for a backend pool that is already referenced by a load balancing rule, you need to first mark **"Create implicit outbound rules"** as **No** in the portal when the inbound load balancing rule is created.

  :::image type="content" source="./media/vm-scale-sets/load-balancer-and-vm-scale-sets.png" alt-text="Load balancing rule creation" border="true":::

The following methods can be used to deploy a virtual machine scale set with an existing Azure load balancer.

* [Configure a virtual machine scale set with an existing Azure Load Balancer using the Azure portal](https://docs.microsoft.com/azure/load-balancer/configure-vm-scale-set-portal).
* [Configure a virtual machine scale set with an existing Azure Load Balancer using Azure PowerShell](https://docs.microsoft.com/azure/load-balancer/configure-vm-scale-set-powershell).
* [Configure a virtual machine scale set with an existing Azure Load Balancer using the Azure CLI](https://docs.microsoft.com/azure/load-balancer/configure-vm-scale-set-cli).
