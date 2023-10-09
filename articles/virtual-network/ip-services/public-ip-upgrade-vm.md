---
title: 'Upgrade public IP addresses attached to a VM from Basic to Standard'
titleSuffix: Azure Virtual Network
description: This article shows you how to upgrade a public IP address attached to a VM to a standard public IP address
author: mbender-ms
ms.author: mbender
ms.date: 08/24/2023
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
---

# Upgrade public IP addresses attached to VM from Basic to Standard

>[!Important]
>On September 30, 2025, Basic SKU public IPs will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired/). If you are currently using Basic SKU public IPs, make sure to upgrade to Standard SKU public IPs prior to the retirement date. This article will help guide you through the upgrade process.

For more information about the retirement of Basic SKU Public IPs and the benefits of Standard SKU Public IPs, see [here](public-ip-basic-upgrade-guidance.md)

## Upgrade overview

This script upgrades any Public IP Addresses attached to VM from Basic to Standard SKU. In order to perform the upgrade, the Public IP Address allocation method is set to static before being disassociated from the VM. Once disassociated, the Public IP SKU is upgraded to Standard, then the IP is re-associated with the VM.

Because the Public IP allocation is set to 'Static' before detaching from the VM, the IP address won't change during the upgrade process, even in the event of a script failure. The module double-checks that the Public IP allocation method is 'Static' prior to detaching the Public IP from the VM. 

The module logs all upgrade activity to a file named `PublicIPUpgrade.log`, created in the same location where the module was executed (by default). 

## Constraints/ Unsupported Scenarios

* **VMs with NICs associated to a Load Balancer**: Because the Load Balancer and Public IP SKUs associated with a VM must match, it isn't possible to upgrade the instance-level Public IP addresses associated with a VM when the VM's NICs are also associated with a Load Balancer, either through Backend Pool or NAT Pool membership. Use the scripts [Upgrade a Basic Load Balancer to Standard SKU](../../load-balancer/upgrade-basic-standard-with-powershell.md) to upgrade both the Load Balancer and Public IPs as the same time.

* **VMs without a Network Security Group**: VMs with IPs to be upgraded must have a Network Security Group (NSG) associated with either the subnet of each IP configuration with a Public IP, or with the NIC directly. This is because Standard SKU Public IPs are "secure by default", meaning that any traffic to the Public IP must be explicitly allowed at an NSG to reach the VM. Basic SKU Public IPs allow any traffic by default. Upgrading Public IP SKUs without an NSG would result in inbound internet traffic to the Public IP previously allowed with the Basic SKU being blocked post-migration. See: [Public IP SKUs](public-ip-addresses.md#sku)

* **Virtual Machine Scale Sets with Public IP configurations**: If you have a virtual machine scale set (uniform model) with public IP configurations per instance, note these configurations aren't Public IP resources and as such cannot be upgraded. Instead, you can remove the Basic IP configuration and use the SKU property to specify that Standard IP configurations are required for each virtual machine scale set instance as shown [here](../../virtual-machine-scale-sets/virtual-machine-scale-sets-networking.md#public-ipv4-per-virtual-machine).

### Prerequisites

- Install the latest version of [PowerShell](/powershell/scripting/install/installing-powershell)
- Ensure whether you have the latest Az PowerShell module installed (and install the latest [Az PowerShell module](/powershell/azure/install-azure-powershell) if not)

## Download the script

Download the migration script from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureVMPublicIPUpgrade).

```powershell
PS C:\> Install-Module -Name AzureVMPublicIPUpgrade -Scope CurrentUser -Repository PSGallery -Force
```

## Use the module

1. Use `Connect-AzAccount` to connect to the required Azure AD tenant and Azure subscription

    ```powershell
    PS C:\> Connect-AzAccount -Tenant <TenantId> -Subscription <SubscriptionId>
    ```
2. Locate the VM with the attached Basic Public IPs that you wish to upgrade. Record its name and resource group name.

3. Examine the module parameters:
    - *VMName [string] Required* - This parameter is the name of your VM.
    - *ResourceGroupName [string] Required* - This parameter is the resource group for your VM with the Basic Public IPs attached that you want to upgrade.

4. Run the Upgrade command.

### Example uses of the script

To upgrade a single VM, pass the VM name and resource group name as parameters.

```powershell
    Start-VMPublicIPUpgrade -VMName 'myVM' -ResourceGroupName 'myRG'
```

To evaluate upgrading a single VM, without making any changes, add the -WhatIf parameter.

```powershell
    Start-VMPublicIPUpgrade -VMName 'myVM' -ResourceGroupName 'myRG' -WhatIf
```

To upgrade all VMs in a resource group, skipping VMs that do not have Network Security Groups.

```powershell
    Get-AzVM -ResourceGroupName 'myRG' | Start-VMPublicIPUpgrade -skipVMMissingNSG
```

### Recovering from a failed migration

If a migration fails due to a transient issue, such as a network outage or client system issue, the migration can be re-run to configure the VM and Public IPs in the goal state. At execution, the script outputs a recovery log file, which is used to ensure the VM is properly reconfigured. Review the log file `PublicIPUpgrade.log` created in the location where the script was executed.

To recover from a failed upgrade, pass the recovery log file path to the script with the `-recoverFromFile` parameter and identify the VM to recover with the `-VMName` and `-VMResourceGroup` or `-VMResourceID` parameters, as shown in this example.

```powershell
    Start-VMPublicIPUpgrade -RecoverFromFile ./PublicIPUpgrade_Recovery_2020-01-01-00-00.csv -VMName myVM -VMResourceGroup -rg-myrg
```

## Common questions

### How long will the migration take and how long will my VM be inaccessible at its Public IP?

The time it takes to upgrade a VM's Public IPs depends on the number of Public IPs and Network Interfaces associated with the VM. In testing, a VM with a single NIC and Public IP takes between 1 and 2 minutes to upgrade. Each NIC on the VM adds about another minute, and each Public IP adds a few seconds each.

### Can I roll back to a Basic SKU Public IP?

It isn't possible to downgrade a Public IP address from Standard to Basic.

### Can I test a migration before executing? 

There is no way to evaluate upgrading a Public IP without completing the action. However, this script includes a `-whatif` parameter, which checks that your VM will support the upgrade and walks through the steps without taking action. 

### Does the script support Zonal Basic SKU Public IPs? 

Yes, the process of upgrading a Zonal Basic SKU Public IP to a Zonal Standard SKU Public IP is identical and works in the script.

## Use Resource Graph to list VMs with Public IPs requiring upgrade

### Query to list virtual machines with Basic SKU public IP addresses

This query returns a list of virtual machine IDs with Basic SKU public IP addresses attached. 

```kusto
Resources
| where type =~ 'microsoft.compute/virtualmachines'
| project vmId = tolower(id), vmNics = properties.networkProfile.networkInterfaces
| join (
  Resources |
  where type =~ 'microsoft.network/networkinterfaces' |
  project nicVMId = tolower(tostring(properties.virtualMachine.id)), allVMNicID = tolower(id), nicIPConfigs = properties.ipConfigurations)
  on $left.vmId == $right.nicVMId
| join (
  Resources
  | where type =~ 'microsoft.network/publicipaddresses' and isnotnull(properties.ipConfiguration.id)
  | where sku.name == 'Basic' // exclude to find all VMs with Public IPs
  | project pipId = id, pipSku = sku.name, pipAssociatedNicId = tolower(tostring(split(properties.ipConfiguration.id, '/ipConfigurations/')[0])))
  on $left.allVMNicID == $right.pipAssociatedNicId
| project vmId, pipId, pipSku
```

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.compute/virtualmachines' | project vmId = tolower(id), vmNics = properties.networkProfile.networkInterfaces | join (Resources | where type =~ 'microsoft.network/networkinterfaces' | project nicVMId = tolower(tostring(properties.virtualMachine.id)), allVMNicID = tolower(id), nicIPConfigs = properties.ipConfigurations) on \$left.vmId == \$right.nicVMId | join ( Resources | where type =~ 'microsoft.network/publicipaddresses' and isnotnull(properties.ipConfiguration.id) | where sku.name == 'Basic' | project pipId = id, pipSku = sku.name, pipAssociatedNicId = tolower(tostring(split(properties.ipConfiguration.id, '/ipConfigurations/')[0]))) on \$left.allVMNicID == \$right.pipAssociatedNicId | project vmId, pipId, pipSku"
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.compute/virtualmachines' | project vmId = tolower(id), vmNics = properties.networkProfile.networkInterfaces | join (Resources | where type =~ 'microsoft.network/networkinterfaces' | project nicVMId = tolower(tostring(properties.virtualMachine.id)), allVMNicID = tolower(id), nicIPConfigs = properties.ipConfigurations) on `$left.vmId == `$right.nicVMId | join ( Resources | where type =~ 'microsoft.network/publicipaddresses' and isnotnull(properties.ipConfiguration.id) | where sku.name == 'Basic' | project pipId = id, pipSku = sku.name, pipAssociatedNicId = tolower(tostring(split(properties.ipConfiguration.id, '/ipConfigurations/')[0]))) on `$left.allVMNicID == `$right.pipAssociatedNicId | project vmId, pipId, pipSku"
```

### [Portal](#tab/azure-portal)

Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fvirtualmachines%27%0A%7C%20project%20vmId%20%3D%20tolower%28id%29%2C%20vmNics%20%3D%20properties.networkProfile.networkInterfaces%0A%7C%20join%20%28%0A%20%20Resources%20%7C%0A%20%20where%20type%20%3D~%20%27microsoft.network%2Fnetworkinterfaces%27%20%7C%0A%20%20project%20nicVMId%20%3D%20tolower%28tostring%28properties.virtualMachine.id%29%29%2C%20allVMNicID%20%3D%20tolower%28id%29%2C%20nicIPConfigs%20%3D%20properties.ipConfigurations%29%0A%20%20on%20%24left.vmId%20%3D%3D%20%24right.nicVMId%0A%7C%20join%20%28%0A%20%20Resources%0A%20%20%7C%20where%20type%20%3D~%20%27microsoft.network%2Fpublicipaddresses%27%20and%20isnotnull%28properties.ipConfiguration.id%29%0A%20%20%7C%20where%20sku.name%20%3D%3D%20%27Basic%27%0A%20%20%7C%20project%20pipId%20%3D%20id%2C%20pipSku%20%3D%20sku.name%2C%20pipAssociatedNicId%20%3D%20tolower%28tostring%28split%28properties.ipConfiguration.id%2C%20%27%2FipConfigurations%2F%27%29%5B0%5D%29%29%29%0A%20%20on%20%24left.allVMNicID%20%3D%3D%20%24right.pipAssociatedNicId%0A%7C%20project%20vmId%2C%20pipId%2C%20pipSku" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fvirtualmachines%27%0A%7C%20project%20vmId%20%3D%20tolower%28id%29%2C%20vmNics%20%3D%20properties.networkProfile.networkInterfaces%0A%7C%20join%20%28%0A%20%20Resources%20%7C%0A%20%20where%20type%20%3D~%20%27microsoft.network%2Fnetworkinterfaces%27%20%7C%0A%20%20project%20nicVMId%20%3D%20tolower%28tostring%28properties.virtualMachine.id%29%29%2C%20allVMNicID%20%3D%20tolower%28id%29%2C%20nicIPConfigs%20%3D%20properties.ipConfigurations%29%0A%20%20on%20%24left.vmId%20%3D%3D%20%24right.nicVMId%0A%7C%20join%20%28%0A%20%20Resources%0A%20%20%7C%20where%20type%20%3D~%20%27microsoft.network%2Fpublicipaddresses%27%20and%20isnotnull%28properties.ipConfiguration.id%29%0A%20%20%7C%20where%20sku.name%20%3D%3D%20%27Basic%27%0A%20%20%7C%20project%20pipId%20%3D%20id%2C%20pipSku%20%3D%20sku.name%2C%20pipAssociatedNicId%20%3D%20tolower%28tostring%28split%28properties.ipConfiguration.id%2C%20%27%2FipConfigurations%2F%27%29%5B0%5D%29%29%29%0A%20%20on%20%24left.allVMNicID%20%3D%3D%20%24right.pipAssociatedNicId%0A%7C%20project%20vmId%2C%20pipId%2C%20pipSkuu" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fvirtualmachines%27%0A%7C%20project%20vmId%20%3D%20tolower%28id%29%2C%20vmNics%20%3D%20properties.networkProfile.networkInterfaces%0A%7C%20join%20%28%0A%20%20Resources%20%7C%0A%20%20where%20type%20%3D~%20%27microsoft.network%2Fnetworkinterfaces%27%20%7C%0A%20%20project%20nicVMId%20%3D%20tolower%28tostring%28properties.virtualMachine.id%29%29%2C%20allVMNicID%20%3D%20tolower%28id%29%2C%20nicIPConfigs%20%3D%20properties.ipConfigurations%29%0A%20%20on%20%24left.vmId%20%3D%3D%20%24right.nicVMId%0A%7C%20join%20%28%0A%20%20Resources%0A%20%20%7C%20where%20type%20%3D~%20%27microsoft.network%2Fpublicipaddresses%27%20and%20isnotnull%28properties.ipConfiguration.id%29%0A%20%20%7C%20where%20sku.name%20%3D%3D%20%27Basic%27%0A%20%20%7C%20project%20pipId%20%3D%20id%2C%20pipSku%20%3D%20sku.name%2C%20pipAssociatedNicId%20%3D%20tolower%28tostring%28split%28properties.ipConfiguration.id%2C%20%27%2FipConfigurations%2F%27%29%5B0%5D%29%29%29%0A%20%20on%20%24left.allVMNicID%20%3D%3D%20%24right.pipAssociatedNicId%0A%7C%20project%20vmId%2C%20pipId%2C%20pipSku" target="_blank">portal.azure.cn</a>
---

## Next steps

* [Upgrading a Basic public IP address to Standard SKU - Guidance](public-ip-basic-upgrade-guidance.md)
* [Upgrading a Basic public IP address to Standard SKU - Portal](public-ip-upgrade-portal.md)
