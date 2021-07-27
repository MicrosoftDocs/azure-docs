---
title: Update or delete an existing load balancer used by virtual machine scale sets
titleSuffix: Update or delete an existing load balancer used by virtual machine scale sets
description: With this how-to article, get started with Azure Standard Load Balancer and virtual machine scale sets.
services: load-balancer
documentationcenter: na
author: irenehua
ms.custom: seodec18, devx-track-azurecli
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/29/2020
ms.author: irenehua
---
# Update or delete a load balancer used by virtual machine scale sets

When you work with virtual machine scale sets and an instance of Azure Load Balancer, you can:

- Add, update, and delete rules.
- Add configurations.
- Delete the load balancer.

## Set up a load balancer for scaling out virtual machine scale sets

Make sure that the instance of Azure Load Balancer has an [inbound NAT pool](/cli/azure/network/lb/inbound-nat-pool) set up and that the virtual machine scale set is put in the backend pool of the load balancer. Load Balancer will automatically create new inbound NAT rules in the inbound NAT pool when new virtual machine instances are added to the virtual machine scale set.

To check whether the inbound NAT pool is properly set up:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left menu, select **All resources**. Then select **MyLoadBalancer** from the resource list.
1. Under **Settings**, select **Inbound NAT rules**. In the right pane, if you see a list of rules created for each individual instance in the virtual machine scale set, you're all set to go for scaling up at any time.

## Add inbound NAT rules

Individual inbound NAT rules can't be added. But you can add a set of inbound NAT rules with defined front-end port range and back-end port for all instances in the virtual machine scale set.

To add a whole set of inbound NAT rules for the virtual machine scale sets, first create an inbound NAT pool in the load balancer. Then reference the inbound NAT pool from the network profile of the virtual machine scale set. A full example using the CLI is shown.

The new inbound NAT pool should not have an overlapping front-end port range with existing inbound NAT pools. To view existing inbound NAT pools that are set up, use this [CLI command](/cli/azure/network/lb/inbound-nat-pool#az_network_lb_inbound_nat_pool_list):
  
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
          --instance-ids *
          --resource-group MyResourceGroup
          --name MyVMSS
```
## Update inbound NAT rules

Individual inbound NAT rules can't be updated. But you can update a set of inbound NAT rules with a defined front-end port range and a back-end port for all instances in the virtual machine scale set.

To update a whole set of inbound NAT rules for virtual machine scale sets, update the inbound NAT pool in the load balancer.
    
```azurecli-interactive
az network lb inbound-nat-pool update 
        -g MyResourceGroup 
        --lb-name MyLb 
        -n MyNatPool
        --protocol Tcp 
        --backend-port 8080
```

## Delete inbound NAT rules

Individual inbound NAT rules can't be deleted, but you can delete the entire set of inbound NAT rules by deleting the inbound NAT pool.

To delete the NAT pool, first remove it from the scale set. A full example using the CLI is shown here:

```azurecli-interactive
    az vmss update
       --resource-group MyResourceGroup
       --name MyVMSS
       --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerInboundNatPools
     az vmss update-instances 
       --instance-ids "*" 
       --resource-group MyResourceGroup
       --name MyVMSS
    az network lb inbound-nat-pool delete
       --resource-group MyResourceGroup
       --lb-name MyLoadBalancer
       --name MyNatPool
```

## Add multiple IP configurations

To add multiple IP configurations:

1. On the left menu, select **All resources**. Then select **MyLoadBalancer** from the resource list.
1. Under **Settings**, select **Frontend IP configuration**. Then select **Add**.
1. On the **Add frontend IP address** page, enter the values and select **OK**.
1. Follow [step 5](./load-balancer-multiple-ip.md#step-5-configure-the-health-probe) and [step 6](./load-balancer-multiple-ip.md#step-5-configure-the-health-probe) in this tutorial if new load-balancing rules are needed.
1. Create a new set of inbound NAT rules by using the newly created front-end IP configurations if needed. An example is found in the previous section.

## Multiple Virtual Machine Scale Sets behind a single Load Balancer

Create inbound NAT Pool in Load Balancer, reference the inbound NAT pool in the network profile of a Virtual Machine Scale Set, and finally update the instances for the changes to take effect. Repeat the steps for all Virtual Machine Scale Sets.

Make sure to create separate inbound NAT pools with non-overlapping frontend port ranges.
  
```azurecli-interactive
  az network lb inbound-nat-pool create 
          -g MyResourceGroup 
          --lb-name MyLb
          -n MyNatPool 
          --protocol Tcp 
          --frontend-port-range-start 80 
          --frontend-port-range-end 89 
          --backend-port 80 
          --frontend-ip-name MyFrontendIpConfig
  az vmss update 
          -g MyResourceGroup 
          -n myVMSS 
          --add virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerInboundNatPools "{'id':'/subscriptions/mySubscriptionId/resourceGroups/MyResourceGroup/providers/Microsoft.Network/loadBalancers/MyLb/inboundNatPools/MyNatPool'}"
            
  az vmss update-instances
          --instance-ids *
          --resource-group MyResourceGroup
          --name MyVMSS
          
  az network lb inbound-nat-pool create 
          -g MyResourceGroup 
          --lb-name MyLb
          -n MyNatPool2
          --protocol Tcp 
          --frontend-port-range-start 100 
          --frontend-port-range-end 109 
          --backend-port 80 
          --frontend-ip-name MyFrontendIpConfig2
  az vmss update 
          -g MyResourceGroup 
          -n myVMSS2 
          --add virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerInboundNatPools "{'id':'/subscriptions/mySubscriptionId/resourceGroups/MyResourceGroup/providers/Microsoft.Network/loadBalancers/MyLb/inboundNatPools/MyNatPool2'}"
            
  az vmss update-instances
          --instance-ids *
          --resource-group MyResourceGroup
          --name MyVMSS2
```

## Delete the front-end IP configuration used by the virtual machine scale set

To delete the front-end IP configuration in use by the scale set:

 1. First delete the inbound NAT pool (the set of inbound NAT rules) that references the front-end IP configuration. Instructions on how to delete the inbound rules are found in the previous section.
 1. Delete the load-balancing rule that references the front-end IP configuration.
 1. Delete the front-end IP configuration.

## Delete a load balancer used by a virtual machine scale set

To delete the front-end IP configuration in use by the scale set:

 1. First delete the inbound NAT pool (the set of inbound NAT rules) that references the front-end IP configuration. Instructions on how to delete the inbound rules are found in the previous section.
 1. Delete the load-balancing rule that references the back-end pool that contains the virtual machine scale set.
 1. Remove the `loadBalancerBackendAddressPool` reference from the network profile of the virtual machine scale set.
 
 A full example using the CLI is shown here:

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
Finally, delete the load balancer resource.
 
## Next steps

To learn more about Azure Load Balancer and virtual machine scale sets, read more about the concepts.

> [Azure Load Balancer with virtual machine scale sets](load-balancer-standard-virtual-machine-scale-sets.md)
