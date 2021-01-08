---
title: Update or delete existing Azure Load Balancer used by Virtual Machine Scale Set
titleSuffix: Update or delete existing Azure Load Balancer used by Virtual Machine Scale Set
description: With this how-to article, get started with Azure Standard Load Balancer and Virtual Machine Scale Sets.
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
# How to update/delete Azure Load Balancer used by Virtual Machine Scale Sets

## How to set up Azure Load Balancer for scaling out Virtual Machine Scale Sets
  * Make sure that the Load Balancer has [inbound NAT pool](https://docs.microsoft.com/cli/azure/network/lb/inbound-nat-pool?view=azure-cli-latest) set up and that the Virtual Machine Scale Set is put in the backend pool of the Load Balancer. Azure Load Balancer will automatically create new inbound NAT rules in the inbound NAT pool when new Virtual Machine instances are added to the Virtual Machine Scale Set. 
  * To check whether inbound NAT pool is properly set up, 
  1. Sign in to the Azure portal at https://portal.azure.com.
  
  1. Select **All resources** on the left menu, and then select **MyLoadBalancer** from the resource list.
  
  1. Under **Settings**, select **Inbound NAT Rules**.
If you see on the right pane, a list of rules created for each individual instance in the Virtual Machine Scale Set, the congrats you are all set to go for scaling up at any time.

## How to add inbound NAT rules? 
  * Individual inbound NAT rule cannot be added. However, you can add a set of inbound NAT rules with defined frontend port range and backend port for all instances in the Virtual Machine Scale Set.
  * In order to add a whole set of inbound NAT rules for the Virtual Machine Scale Sets, you need to first create an inbound NAT pool in the Load Balancer, and then reference the inbound NAT pool from the network profile of Virtual Machine Scale Set. A full example using CLI is shown below.
  * The new inbound NAT pool should not have overlapping frontend port range with existing inbound NAT pools. To view existing inbound NAT pools set up, you can use this [CLI command](https://docs.microsoft.com/cli/azure/network/lb/inbound-nat-pool?view=azure-cli-latest#az_network_lb_inbound_nat_pool_list)
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
        
az vmss update-instances
        -–instance-ids *
        --resource-group MyResourceGroup
        --name MyVMSS
```
## How to update inbound NAT rules? 
  * Individual inbound NAT rule cannot be updated. However, you can update a set of inbound NAT rules with defined frontend port range and backend port for all instances in the Virtual Machine Scale Set.
  * In order to update a whole set of inbound NAT rules for the Virtual Machine Scale Sets, you need to update the inbound NAT pool in the Load Balancer. 
```azurecli-interactive
az network lb inbound-nat-pool update 
        -g MyResourceGroup 
        --lb-name MyLb 
        -n MyNatPool
        --protocol Tcp 
        --backend-port 8080
```

## How to delete inbound NAT rules? 
* Individual inbound NAT rule cannot be deleted. However, you can delete the entire set of inbound NAT rules.
* In order to delete the whole set of inbound NAT rules used by the Scale Set, you need to first remove the NAT pool from the scale set. A full example using CLI is shown below:
```azurecli-interactive
  az vmss update
     --resource-group MyResourceGroup
     --name MyVMSS
   az vmss update-instances 
     --instance-ids "*" 
     --resource-group MyResourceGroup
     --name MyVMSS
  az network lb inbound-nat-pool delete
     --resource-group MyResourceGroup
     -–lb-name MyLoadBalancer
     --name MyNatPool
```

## How to add multiple IP Configurations:
1. Select **All resources** on the left menu, and then select **MyLoadBalancer** from the resource list.
   
1. Under **Settings**, select **Frontend IP Configurations**, and then select **Add**.
   
1. On the **Add frontend IP address** page, type in the values and select **OK**

1. Follow [Step 5](https://docs.microsoft.com/azure/load-balancer/load-balancer-multiple-ip#step-5-configure-the-health-probe) and [Step 6](https://docs.microsoft.com/azure/load-balancer/load-balancer-multiple-ip#step-5-configure-the-health-probe) in this tutorial if new load balancing rules are needed

1. Create new set of inbound NAT rules using the newly created frontend IP Configurations if needed. Example can be found here in the [previous section].

## How to delete Frontend IP Configuration used by Virtual Machine Scale Set: 
 1. To delete the Frontend IP Configuration in use by the Scale Set, you need to first delete the inbound NAT pool (set of inbound NAT rules) referencing the frontend IP configuration. Instructions on how to delete the inbound rules can be found in the previous section.
 1. Delete the Load Balancing rule referencing the Frontend IP Configuration. 
 1. Delete the Frontend IP Configuration.
 

## How to delete Azure Load Balancer used by Virtual Machine Scale Set: 
 1. To delete the Frontend IP Configuration in use by the Scale Set, you need to first delete the inbound NAT pool (set of inbound NAT rules) referencing the frontend IP configuration. Instructions on how to delete the inbound rules can be found in the previous section.
 
 1. Delete the Load Balancing rule referencing backend pool containing the Virtual Machine Scale Set.
 
 1. Remove the loadBalancerBackendAddressPool reference from the network profile of the Virtual Machine Scale Set. A full example using CLI is shown below:
 ```azurecli-interactive
  az vmss update
     --resource-group MyResourceGroup
     --name MyVMSS
     --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerBackendAddressPools
  az vmss update-instances 
     --instance-ids "*" 
     --resource-group MyResourceGroup
     --name MyVMSS
```
Finally, delete the Load Balancer Resource.
 
## Next steps

To learn more about Azure Load Balancer and Virtual Machine Scale Set, read more about the concepts.

> [Azure Load Balancer with Azure virtual machine scale sets](load-balancer-standard-virtual-machine-scale-sets.md)
