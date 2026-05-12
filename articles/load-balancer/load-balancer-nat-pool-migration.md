---
title: Migrate from Inbound NAT rules version 1 to version 2 
description: Learn how to migrate Azure Load balancer from inbound NAT rules version 1 to version 2.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 01/28/2025
ms.author: mbender
# Customer intent: As a cloud architect, I want to migrate inbound NAT rules from version 1 to version 2 for multiple VMs or VMSS in Azure Load Balancer, so that I can ensure compliance with the upcoming retirement timeline and leverage improved deployment efficiency and optimized updates for my backend infrastructure.
---

# Migrate from Inbound NAT rules version 1 to version 2

An [inbound NAT rule](inbound-nat-rules.md) is used to forward traffic from a load balancer’s frontend to one or more instances in the backend pool. These rules provide a 1:1 mapping between the load balancer’s frontend IP address and backend instances. There are currently two versions of Inbound NAT rules, version 1 and version 2.

>[!Important]
> On September 30, 2027, **Inbound NAT Pools** (the VMSS-specific feature of Inbound NAT rules V1) will be retired. If you are currently using Inbound NAT Pools with Virtual Machine Scale Sets, migrate to Inbound NAT rules V2 prior to the retirement date. **Single VM Inbound NAT rules V1 are not affected by this retirement** and do not need to be migrated.

## NAT rule version 1 

[Version 1](inbound-nat-rules.md) of Inbound NAT rules includes two distinct features:

- **Single VM Inbound NAT rules** — Provides 1:1 port mapping between a load balancer frontend IP/port and a specific virtual machine. Rules are applied directly to the VM's network interface card (NIC). **These are not being retired and do not need to be migrated.**

- **Inbound NAT Pools (VMSS only)** — This is the legacy approach for assigning an Azure Load Balancer’s frontend port to each backend instance. Inbound NAT rules are automatically created and deleted per Virtual Machine Scale Set instance as the scale set scales up and down. NAT Pools are defined on the load balancer and referenced by the VMSS NIC configuration via the `loadBalancerInboundNatPools` property. **These are being retired on September 30, 2027 and must be migrated to Inbound NAT rules V2.**

## NAT rule version 2 

[Version 2](inbound-nat-rules.md) of Inbound NAT rules provide the same feature set as version 1, with extra benefits.  

- Simplified deployment experience and optimized updates.
  - Inbound NAT rules now target the backend pool of the load balancer and no longer require a reference on the virtual machine's NIC. Previously on version 1, both the load balancer and the virtual machine's NIC needed to be updated whenever the Inbound NAT rule was changed. Version 2 only requires a single call on the load balancer’s configuration, resulting in optimized updates.
- Easily retrieve port mapping between Inbound NAT rules and backend instances.
  - With the legacy offering, to retrieve the port mapping between an Inbound NAT rule and a virtual machine instance, the rule would need to be correlated with the virtual machine's NIC. Version 2 injects the port mapping between the rule and backend instance directly into the load balancer’s configuration. 

## How do I know if I’m using version 1 of Inbound NAT rules? 

The easiest way to identify if your deployments are using version 1 of the feature is by inspecting the load balancer’s configuration. Version 1 nat rules will have a **Type** value of *Azure Virtual Machine* with a defined **Target virtual machine** value.

:::image type="content" source="media/load-balancer-nat-pool-migration/nat-rule-version-1.png" alt-text="Screenshot of NAT rule version 1 configuration in Azure portal.":::

For version 2 NAT rules, the **Type** value will be *Backend pool* with a defined **Target backend pool** value.

:::image type="content" source="media/load-balancer-nat-pool-migration/nat-rule-version-2.png" alt-text="Screenshot of NAT rule version 2 configuration in Azure portal.":::

To programmatically determine if a deployment is using version 1 of Inbound NAT rules, inspect the load balancer’s configuration using the Azure CLI or PowerShell. If either the `backendIPConfiguration` property within the `InboundNATRule` configuration is populated, then the deployment is version 1 of Inbound NAT rules. Version 2 rules will have the `backendAddressPool` property instead of the `backendIPConfiguration` property.

## How do I know if I’m using Inbound NAT Pools?

To check if your load balancer has Inbound NAT Pools configured:

# [Azure CLI](#tab/azure-cli)

```azurecli
az network lb inbound-nat-pool list -g MyResourceGroup --lb-name MyLoadBalancer
```

# [PowerShell](#tab/powershell)

```powershell
$slb = Get-AzLoadBalancer -Name "MyLoadBalancer" -ResourceGroupName "MyResourceGroup"
$slb.InboundNatPools
```

---

If the above commands return any results, your load balancer is using Inbound NAT Pools and should be migrated.

The key difference is the ARM property name: Inbound NAT Pools appear under the `inboundNatPools` property on the load balancer, while Inbound NAT rules appear under the `inboundNatRules` property. If your load balancer has a non-empty `inboundNatPools` array, it is using Inbound NAT Pools and must be migrated to V2 before September 30, 2027.

> [!NOTE]
> If your load balancer only has single VM Inbound NAT rules (Type = "Azure Virtual Machine") and no Inbound NAT Pools, **no migration is required**. Single VM V1 rules are not being retired.

## How to migrate from Inbound NAT Pools to version 2?  

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
3. Deploy version 2 of Inbound NAT rules.

### Virtual Machine Scale Set

> [!IMPORTANT]
> This is the required migration path for the Inbound NAT Pools retirement. All VMSS deployments using Inbound NAT Pools must complete this migration before September 30, 2027.
> 
The following steps are used to migrate from version 1 to version 2 of Inbound NAT rules for a virtual machine scale set. It assumes the virtual machine scale set's upgrade mode is set to Manual. For more information, see [Orchestration modes for Virtual Machine Scale Sets in Azure](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes)


# [Azure CLI](#tab/azure-cli)

```azurecli

az network lb inbound-nat-pool delete  -g MyResourceGroup --lb-name MyLoadBalancer -n MyNatPool  

az vmss update -g MyResourceGroup -n MyVMScaleSet --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerInboundNatPools  

az vmss update-instances --instance-ids '*' --resource-group MyResourceGroup --name MyVMScaleSet 

az network lb inbound-nat-rule create -g MyResourceGroup --lb-name MyLoadBalancer -n MyNatRule --protocol Tcp --frontend-port-range-start 201 --frontend-port-range-end 500 --backend-port 22 --backend-address-pool MybackendPool

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

# Upgrade all instances in the VMSS 

Update-AzVmssInstance -ResourceGroupName $resourceGroupName -VMScaleSetName $vmssName -InstanceId "*"

$slb | Add-AzLoadBalancerInboundNatRuleConfig -Name "NewNatRuleV2" -FrontendIPConfiguration $slb.FrontendIpConfigurations[0] -Protocol "Tcp" -FrontendPortRangeStart 201-FrontendPortRangeEnd 500 -BackendAddressPool $slb.BackendAddressPools[0] -BackendPort 22
$slb | Set-AzLoadBalancer
 
```
---

## Migration with automation script for Virtual Machine Scale Set 

The migration process will reuse existing backend pools with membership matching the NAT Pools to be migrated; if no matching backend pool is found, the script will exit (without making changes). Alternatively, use the  `-backendPoolReuseStrategy` parameter to either always create new backend pools (`NoReuse`) or create a new backend pool if a matching one doesn't exist (`OptionalFirstMatch`). Backend pools and NAT Rule associations can be updated post migration to match your preference.
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
