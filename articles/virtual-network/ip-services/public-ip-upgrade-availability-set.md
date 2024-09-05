---
title: 'Upgrade public IP addresses attached to virtual machines in an Availability Set from Basic to Standard'
titleSuffix: Azure Virtual Network
description: This article shows you how to upgrade all public IP address attached to a VM in an Availability Set to a standard public IP address
author: mbender-ms
ms.author: mbratschun
ms.date: 08/27/2024
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: how-to
---

# Upgrade all public IP addresses attached to VMs in an Availability Set from Basic to Standard

>[!Important]
>On September 30, 2025, Basic SKU public IPs will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired/). If you are currently using Basic SKU public IPs, make sure to upgrade to Standard SKU public IPs prior to the retirement date. This article will help guide you through the upgrade process.

For more information about the retirement of Basic SKU Public IPs and the benefits of Standard SKU Public IPs, see [here](public-ip-basic-upgrade-guidance.md)

## Upgrade overview

This script upgrades any Public IP Addresses attached to the Virtual Machines (VMs) in an Availability Set from Basic to Standard SKU. In order to perform the upgrade, the Public IP Address allocation method is set to static before being disassociated from each VM. Once disassociated, the Public IP SKU is upgraded to Standard, then the IP is reassociated with original VM until all IPs are upgraded.

Because the Public IP allocation is set to 'Static' before detaching from the VMs, the IP addresses don't change during the upgrade process, even in the event of a script failure. The module double-checks that the Public IP allocation method is 'Static' before detaching the Public IP from the VM. 

The module logs all upgrade activity to a file named `AvSetPublicIPUpgrade.log`, created in the same location where the module was executed (by default). 

## Constraints/ Unsupported Scenarios

* **VMs with network interfaces associated to a Load Balancer**: Because the Load Balancer and Public IP SKUs associated with a VM must match, it isn't possible to upgrade the instance-level Public IP addresses associated with a VM when the VM's network interfaces are also associated with a Load Balancer, either through Backend Pool or NAT Pool membership. Use the scripts [Upgrade a Basic Load Balancer to Standard SKU](../../load-balancer/upgrade-basic-standard-with-powershell.md) to upgrade both the Load Balancer and Public IPs as the same time.

* **VMs without a Network Security Group**: VMs with IPs to be upgraded must have a Network Security Group (NSG) associated with either the subnet of each IP configuration with a Public IP, or with the NIC directly. This is because Standard SKU Public IPs are "secure by default," meaning that any traffic to the Public IP must be explicitly allowed at an NSG to reach the VM. Basic SKU Public IPs allow any traffic by default. Upgrading Public IP SKUs without an NSG would result in inbound internet traffic to the Public IP previously allowed with the Basic SKU. See: [Public IP SKUs](public-ip-addresses.md#sku)

## Download the script

Download the migration script from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureAvSetBasicPublicIPUpgrade).

```powershell
Install-Module -Name AzureAvSetBasicPublicIPUpgrade -Scope CurrentUser -Repository PSGallery -Force
```

## Use the module

1. Use `Select-AzSubscription` to select the Azure subscription where your Availability Set exists

    ```powershell
    Select-AzSubscription -Subscription <SubscriptionId>
    ```
2. Locate the Availability Set with the attached Basic Public IPs that you wish to upgrade. Record its name and resource group name.

3. Examine the module parameters:
    - *AvailabilitySetName  [string] Required* - This parameter is the name of your Availability Set.
    - *ResourceGroupName [string] Required* - This parameter is the resource group for your Availability Set with the Basic Public IPs attached that you want to upgrade.

4. Run the upgrade, using the following examples or `Get-Help Start-AzAvSetPublicIPUpgrade` for guidance.

### Example uses of the script

Upgrade VMs in a single Availability Set, passing the Availability Set name and resource group name as parameters.
```powershell
Start-AzAvSetPublicIPUpgrade -availabilitySetName 'myAvSet' -resourceGroupName 'myRG'
```

Evaluate VMs in a single Availability Set, without making any changes
```powershell
Start-AzAvSetPublicIPUpgrade -availabilitySetName 'myAvSet' -resourceGroupName 'myRG' -WhatIf
```

Attempt upgrade of VMs in every Availability Set the user has access to. VMs without Public IPs, which are already upgraded, or which do not have NSGs are skipped.
```powershell
Get-AzAvailabilitySet -resourceGroupName 'myRG' | Start-AzAvSetPublicIPUpgrade -skipVMMissingNSG
```

Recover from a failed migration, passing the name and resource group of the Availability Set to recover, along with the recovery log file.
```powershell
Start-AzAvSetPublicIPUpgrade -RecoverFromFile ./AvSetPublicIPUpgrade_Recovery_2020-01-01-00-00.csv -AvailabilitySetName myAvSet -ResourceGroup rg-myrg
```
 
### Recovering from a failed migration

If a migration fails due to a transient issue, such as a network outage or client system issue, the migration can be retried to configure the VM and Public IPs in the goal state. At execution, the script outputs a recovery log file, which is used to ensure the VM is properly reconfigured. Review the log file `AvSetPublicIPUpgrade.log` created in the location where the script was executed.

To recover from a failed upgrade, pass the recovery log file path to the script with the `-recoverFromFile` parameter and identify the Availability Set to recover with the `-AvailabilitySetName` parameter, as shown in this example.

```powershell
Start-VMPublicIPUpgrade -RecoverFromFile ./AvSetPublicIPUpgrade_Recovery_2020-01-01-00-00.csv -AvailabilitySetName myAvSet -ResourceGroupName rg-myrg
```

## Common questions

### How long will the migration take and how long will my VM be inaccessible at its Public IP?

The time it takes to upgrade a VM's Public IPs depends on the number of Public IPs and Network Interfaces associated with the VM. In testing, a VM with a single NIC and Public IP takes between 1 and 2 minutes to upgrade. Each NIC on the VM adds about another minute, and each Public IP adds a few seconds each.

### Can I roll back to a Basic SKU Public IP?

It isn't possible to downgrade a Public IP address from Standard to Basic.

### Can I test a migration before executing? 

There is no way to evaluate upgrading a Public IP without completing the action. However, this script includes a `-WhatIf` parameter, which checks that your Availability Set VMs will support the upgrade and walks through the steps without taking action. 

### Does the script support Zonal Basic SKU Public IPs? 

Yes, the process of upgrading a Zonal Basic SKU Public IP to a Zonal Standard SKU Public IP is identical and works in the script.

## Next steps

* [Upgrading a Basic public IP address to Standard SKU - Guidance](public-ip-basic-upgrade-guidance.md)
* [Upgrading a Basic public IP address to Standard SKU - Portal](public-ip-upgrade-portal.md)
