---
title: Migrate from Inbound NAT rules version 1 to version 2 
description: Learn how to migrate from Inbound NAT rules version 1 to version 2 in Azure Load Balancer.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 08/22/2024
ms.author: mbender
---

# Migrate from Inbound NAT rules version 1 to version 2

An [inbound NAT rule](inbound-nat-rules.md) is used to forward traffic from a load balancer’s frontend to one or more instances in the backend pool. These rules provide a 1:1 mapping between the load balancer’s frontend IP address and backend instances. There are currently two versions of Inbound NAT rules, version 1 and version 2.

:::image type="content" source="media/load-balancer-nat-pool-migration/load-balancer-inbound-nat-rule-flow.png" alt-text="Diagram of load balancer inbound nat rules":::
## Version 1 

[Version 1](inbound-nat-rules.md) is the legacy approach for assigning an Azure Load Balancer’s frontend port to each backend instance. Rules are applied to the backend instance’s network interface card (NIC). For Virtual Machine Scale Sets (VMSS) instances, inbound NAT rules are automatically created/deleted as new instances are scaled up/down.  

## Version 2 

[Version 2](inbound-nat-rules.md) of Inbound NAT rules provide the same feature set as version 1, with extra benefits.  

- Simplified deployment experience and optimized updates.
  - Inbound NAT rules now target the backend pool of the load balancer and no longer require a reference on the virtual machine's NIC. Previously on version 1, both the load balancer and the virtual machine's NIC needed to be updated whenever the Inbound NAT rule was changed. Version 2 only requires a single call on the load balancer’s configuration, resulting in optimized updates.
- Easily retrieve port mapping between Inbound NAT rules and backend instances.
  - With the legacy offering, to retrieve the port mapping between an Inbound NAT rule and a virtual machine instance, the rule would need to be correlated with the virtual machine's NIC. Version 2 injects the port mapping between the rule and backend instance directly into the load balancer’s configuration. 

## How do I know if I’m using version 1 of Inbound NAT rules? 

The easiest way to identify if your deployments are using version 1 of the feature is by inspecting the load balancer’s configuration. If either the `InboundNATPool` property or the `backendIPConfiguration` property within the `InboundNATRule` configuration is populated, then the deployment is version 1 of Inbound NAT rules.  

## How to migrate from version 1 to version 2?  

Prior to migrating it's important to review the following information:  

- Migrating to version 2 of Inbound NAT rules causes downtime to active traffic that is flowing through the NAT rules. Traffic flowing through [load balancer rules](components.md) or [outbound rules](components.md) aren't impacted during the migration process.
- Plan out the max number of instances in a backend pool. Since version 2 targets the load balancer’s backend pool, a sufficient number of ports need to be allocated for the NAT rule’s frontend.
- Each backend instance is exposed on the port configured in the new NAT rule.
- Multiple NAT rules can’t exist if they have an overlapping port range or have the same backend port.
- NAT rules and load balancing rules can’t share the same backend port.  

### Manual Migration  

The following three steps need to be performed to migrate to version 2 of inbound NAT rules  

1. Delete the version 1 of inbound NAT rules on the load balancer’s configuration.
2. Remove the reference to the NAT rule on the virtual machine or virtual machine scale set configuration.
   1. All virtual machine scale set instances need to be updated.
3. Deploy version 2 of Inbound NAT rules  

### Virtual Machine

# [Azure CLI](#tab/azure-cli)

```azurecli

az network lb inbound-nat-rule delete -g MyResourceGroup --lb-name MyLoadBalancer --name NATRule 

az network nic ip-config inbound-nat-rule remove -g MyResourceGroup --nic-name MyNic -n MyIpConfig --inbound-nat-rule MyNatRul 

az network lb inbound-nat-rule create -g MyResourceGroup --lb-name MyLoadBalancer -n MyNatRule --protocol Tcp --frontend-port-range-start 201 --frontend-port-range-end 500 --backend-port 80 

```

# [PowerShell](#tab/powershell)

```powershell

$slb = Get-AzLoadBalancer -Name "MyLoadBalancer" -ResourceGroupName "MyResourceGroup" 

Remove-AzLoadBalancerInboundNatRuleConfig -Name "myinboundnatrule" -LoadBalancer $loadbalancer 

Set-AzLoadBalancer -LoadBalancer $slb 

$nic = Get-AzNetworkInterface -Name "myNIC" -ResourceGroupName "MyResourceGroup" 

$nic.IpConfigurations[0].LoadBalancerInboundNatRule  = $null 

Set-AzNetworkInterface -NetworkInterface $nic

```
---


### Virtual Machine Scale Set

# [Azure CLI](#tab/azure-cli)

```azurecli

az network lb inbound-nat-pool delete  -g MyResourceGroup --lb-name MyLoadBalancer -n MyNatPool  

az vmss update -g MyResourceGroup -n MyVMScaleSet --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerInboundNatPools  

az vmss update-instances --instance-ids '*' --resource-group MyResourceGroup --name MyVMScaleSet 

az network lb inbound-nat-rule create -g MyResourceGroup --lb-name MyLoadBalancer -n MyNatRule --protocol Tcp --frontend-port-range-start 201 --frontend-port-range-end 500 --backend-port 80 

```

# [PowerShell](#tab/powershell)

```powershell

# Remove the Inbound NAT rule

$slb = Get-AzLoadBalancer -Name "MyLoadBalancer" -ResourceGroupName "MyResourceGroup" 

Remove-AzLoadBalancerInboundNatPoolConfig -Name myinboundnatpool -LoadBalancer $slb 

Set-AzLoadBalancer -LoadBalancer $slb 

# Remove the Inbound NAT pool association 

$vmss = Get-AzVmss -ResourceGroupName "MyResourceGroup" -VMScaleSetName "MyVMScaleSet" 

$vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].IpConfigurations[0].loadBalancerInboundNatPools = $null 

Update-AzVmss -ResourceGroupName $resourceGroupName -Name $vmssName -VirtualMachineScaleSet $vmss 

# Upgrade all instances in the VMSS 

Update-AzVmssInstance -ResourceGroupName $resourceGroupName -VMScaleSetName $vmssName -InstanceId "*" 
```
---

## Migration with automation script for Virtual Machine Scale Set 

> [!NOTE] This script is designed to work if there is only one VMSS instance attached to your load balancer.  

### Prerequisites

Before beginning the migration process, ensure the following prerequisites are met:

- The load balancer's SKU must be **Standard** to migrate a load balancer's NAT Pools to NAT Rules. To automate this upgrade process, see the steps provided in [Upgrade a Basic Load Balancer to Standard with PowerShell](upgrade-basic-standard-with-powershell.md).
- The Virtual Machine Scale Sets associated with the target Load Balancer must use either a 'Manual' or 'Automatic' upgrade policy--'Rolling' upgrade policy isn't supported. For more information, see [Virtual Machine Scale Sets Upgrade Policies](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy).
- Install the latest version of [PowerShell](/powershell/scripting/install/installing-powershell).
- Install the [Azure PowerShell modules](/powershell/azure/install-azure-powershell).

### Install the `AzureLoadBalancerNATPoolMigration` module 

With the following command, install the `AzureLoadBalancerNATPoolMigration` module from the PowerShell Gallery:

```powershell
# Install the AzureLoadBalancerNATPoolMigration module

Install-Module -Name AzureLoadBalancerNATPoolMigration -Scope CurrentUser -Repository PSGallery -Force 
```

### Upgrade NAT Pools to NAT Rules

With the `azureLoadBalancerNATPoolMigration` module installed, upgrade your NAT Pools to NAT Rules with the following steps:

1. Connect to Azure with `Connect-AzAccount`.
2. Collect the names of the **target load balancer** for the NAT Rules upgrade and its **Resource Group** name.
3. Run the migration command with your resource names replacing the placeholders of `<loadBalancerResourceGroupName>` and `<loadBalancerName>`:

    ```powershell
    # Run the migration command 
    
    Start-AzNATPoolMigration -ResourceGroupName <loadBalancerResourceGroupName> -LoadBalancerName <loadBalancerName>
    
    ```

## Next steps

- Learn about [Managing Inbound NAT Rules](./manage-inbound-nat-rules.md)
- Learn about [Azure Load Balancer NAT Pools and NAT Rules](https://azure.microsoft.com/blog/manage-port-forwarding-for-backend-pool-with-azure-load-balancer/)
