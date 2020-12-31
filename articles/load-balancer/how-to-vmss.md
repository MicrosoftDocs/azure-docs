---
title: Configure existing Azure Load Balancer with Virtual Machine Scale Sets
titleSuffix: Configure existing Azure Load Balancer with Virtual Machine Scale Sets
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
ms.date: 12/30/2020
ms.author: irenehua
---
# How to update/delete Azure Load Balancer with Virtual Machine Scale Sets

## How to add inbound NAT rules? 
  * Individual inbound NAT rule cannot be added. However, you can add a set of inbound NAT rules with defined frontend port range and backend port for all instances in the Virtual Machine Scale Set.
  * In order to add a whole set of inbound NAT rules for the Virtual Machine Scale Sets, you need to first create an inbound NAT pool in the Load Balancer, and then reference the inbound NAT pool from the network profile of Virtual Machine Scale Set. A full example using CLI is shown below.
  * Note that the new inbound NAT pool should not have overlapping frontend port range with existing inbound NAT pools. To view existing inbound NAT pools set up, you can use this [CLI command](https://docs.microsoft.com/cli/azure/network/lb/inbound-nat-pool?view=azure-cli-latest#az_network_lb_inbound_nat_pool_list)
```azurecli-interactive
az network lb inbound-nat-pool create 
        -g MyResourceGroup 
        --lb-name MyLb
        -n MyNatPool 
        --protocol Tcp 
        --frontend-port-range-start 80 
        --frontend-port-range-end 89 
        --backend-port 80 
        --frontend-ip-name MyFrontendIp
az vmss update 
        -g MyResourceGroup 
        -n myVMSS 
        --add virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerInboundNatPools "{'id':'/subscriptions/mySubscriptionId/resourceGroups/MyResourceGroup/providers/Microsoft.Network/loadBalancers/MyLb/inboundNatPools/MyNatPool'}"
```
## How to delete inbound NAT rules? 
  * Each virtual machine scale set must have at least one inbound NAT pool. 
  * Inbound NAT pool is a collection of inbound NAT rules. One inbound NAT pool cannot support multiple virtual machine scales sets.
  * In order to delete a NAT pool from an existing virtual machine scale set, you need to first remove the NAT pool from the scale set. A full example using CLI is shown below:
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
```

## How to delete inbound NAT rules? 
## Load balancing rules:
  * When using the virtual machine scale set in the backend pool of the load balancer, the default load balancing rule gets created automatically.
## Outbound rules:
  *  To create outbound rule for a backend pool that is already referenced by a load balancing rule, you need to first mark **"Create implicit outbound rules"** as **No** in the portal when the inbound load balancing rule is created.

  :::image type="content" source="./media/vm-scale-sets/load-balancer-and-vm-scale-sets.png" alt-text="Load balancing rule creation" border="true":::

The following methods can be used to deploy a virtual machine scale set with an existing Azure load balancer.

* [Configure a virtual machine scale set with an existing Azure Load Balancer using the Azure portal](./configure-vm-scale-set-portal.md).
* [Configure a virtual machine scale set with an existing Azure Load Balancer using Azure PowerShell](./configure-vm-scale-set-powershell.md).
* [Configure a virtual machine scale set with an existing Azure Load Balancer using the Azure CLI](./configure-vm-scale-set-cli.md).
