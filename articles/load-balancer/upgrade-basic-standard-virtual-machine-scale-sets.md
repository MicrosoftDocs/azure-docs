---
title: Upgrade from Basic to Standard for Virtual Machine Scale Sets
titleSuffix: Azure Load Balancer
description: This article shows you how to upgrade a load balancer from basic to standard SKU for Virtual Machine Scale Sets.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.date: 04/17/2023
ms.author: mbender
ms.custom: template-how-to, engagement-fy23
---

# Upgrade a basic load balancer used with Virtual Machine Scale Sets

>[!Important]
>On September 30, 2025, Basic Load Balancer will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer/). If you are currently using Basic Load Balancer, make sure to upgrade to Standard Load Balancer prior to the retirement date. 

[Azure Standard Load Balancer](load-balancer-overview.md) offers a rich set of functionality and high availability through zone redundancy. To learn more about Load Balancer SKU, see [comparison table](./skus.md#skus).

This article introduces a PowerShell module that creates a Standard Load Balancer with the same configuration as the Basic Load Balancer, then associates the Virtual Machine Scale Set backend pool member with the new Load Balancer.

## Upgrade Overview

The PowerShell module performs the following functions:

- Verifies that the provided Basic Load Balancer scenario is supported for upgrade.
- Backs up the Basic Load Balancer and Virtual Machine Scale Set configuration, enabling retry on failure or if errors are encountered.
- For public load balancers, updates the front end public IP address(es) to Standard SKU and static assignment as required.
- Upgrades the Basic Load Balancer configuration to a new Standard Load Balancer, ensuring configuration and feature parity.
- Upgrades Virtual Machine Scale Set backend pool members from the Basic Load Balancer to the Standard Load Balancer.
- Creates and associates a network security group with the Virtual Machine Scale Set to ensure load balanced traffic reaches backend pool members, following Standard Load Balancer's move to a default-deny network policy.
- Logs the upgrade operation for easy audit and failure recovery.

>[!NOTE]
> Migrating _internal_ Basic Load Balancers where the backend VMs or VMSS instances do not have Public IP Addresses assigned requires additional action post-migration to enable backend pool members to connect to the internet. The recommended approach is to create a NAT Gateway and assign it to the backend pool members' subnet (see: [**Integrate NAT Gateway with Internal Load Balancer**](../virtual-network/nat-gateway/tutorial-nat-gateway-load-balancer-internal-portal.md)). Alternatively, Public IP Addresses can be allocated to each VMSS instance by adding a Public IP Configuration to the Network Profile (see: [**VMSS Public IPv4 Address Per Virtual Machine**](../virtual-machine-scale-sets/virtual-machine-scale-sets-networking.md)). 

>[!NOTE]
> If the Virtual Machine Scale Set in the Load Balancer backend pool has Public IP Addresses in its network configuration, the Public IP Addresses will change during migration (the Public IPs must be removed prior to the migration, then added back post migration with a Standard SKU configuration)

>[!NOTE]
> If the Virtual Machine Scale Set behind the Load Balancer is a **Service Fabric Cluster**, migration with this script will take more time. In testing, a 5-node Bronze cluster was unavailable for about 30 minutes and a 5-node Silver cluster was unavailable for about 45 minutes. For Service Fabric clusters that require minimal / no connectivity downtime, adding a new nodetype with Standard Load Balancer and IP resources is a better solution.

### Unsupported Scenarios

- Basic Load Balancers with a Virtual Machine Scale Set backend pool member that is also a member of a backend pool on a different load balancer
- Basic Load Balancers with IPV6 frontend IP configurations
- Basic Load Balancers with a Virtual Machine Scale Set backend pool member where one or more Virtual Machine Scale Set instances have ProtectFromScaleSetActions Instance Protection policies enabled
- Migrating a Basic Load Balancer to an existing Standard Load Balancer

### Prerequisites

- Install the latest version of [PowerShell](/powershell/scripting/install/installing-powershell)
- Determine whether you have the latest Az PowerShell module installed (8.2.0)
  - Install the latest [Az PowerShell module](/powershell/azure/install-azure-powershell)

## Install the 'AzureBasicLoadBalancerUpgrade' module

Install the module from [PowerShell gallery](https://www.powershellgallery.com/packages/AzureBasicLoadBalancerUpgrade)

```powershell
PS C:\> Install-Module -Name AzureBasicLoadBalancerUpgrade -Scope CurrentUser -Repository PSGallery -Force
```

## Use the module

1. Use `Connect-AzAccount` to connect to the required Azure AD tenant and Azure subscription

    ```powershell
    PS C:\> Connect-AzAccount -Tenant <TenantId> -Subscription <SubscriptionId>
    ```

2. Find the Load Balancer you wish to upgrade. Record its name and resource group name.

3. Examine the module parameters:
    - *BasicLoadBalancerName [string] Required* - This parameter is the name of the existing Basic Load Balancer you would like to upgrade
    - *ResourceGroupName [string] Required* - This parameter is the name of the resource group containing the Basic Load Balancer
    - *RecoveryBackupPath [string] Optional* - This parameter allows you to specify an alternative path in which to store the Basic Load Balancer ARM template backup file (defaults to the current working directory)
    - *FailedMigrationRetryFilePathLB [string] Optional* - This parameter allows you to specify a path to a Basic Load Balancer backup state file when retrying a failed upgrade (defaults to current working directory)
    - *FailedMigrationRetryFilePathVMSS [string] Optional* - This parameter allows you to specify a path to a Virtual Machine Scale Set backup state file when retrying a failed upgrade (defaults to current working directory)

4. Run the Upgrade command.

### Example: upgrade a Basic Load Balancer to a Standard Load Balancer with the same name, providing the Basic Load Balancer name and resource group

```powershell
PS C:\> Start-AzBasicLoadBalancerUpgrade -ResourceGroupName <load balancer resource group name> -BasicLoadBalancerName <existing Basic Load Balancer name>
```

### Example: upgrade a Basic Load Balancer to a Standard Load Balancer with the same name, providing the basic load object through the pipeline

```powershell
PS C:\> Get-AzLoadBalancer -Name <Basic Load Balancer name> -ResourceGroup <Basic Load Balancer resource group name> | Start-AzBasicLoadBalancerUpgrade
```

### Example: upgrade a Basic Load Balancer to a Standard Load Balancer with the specified name, displaying logged output on screen

```powershell
PS C:\> Start-AzBasicLoadBalancerUpgrade -ResourceGroupName <load balancer resource group name> -BasicLoadBalancerName <existing Basic Load Balancer name> -StandardLoadBalancerName <new Standard Load Balancer name> -FollowLog
```

### Example: upgrade a Basic Load Balancer to a Standard Load Balancer with the specified name and store the Basic Load Balancer backup file at the specified path

```powershell
PS C:\> Start-AzBasicLoadBalancerUpgrade -ResourceGroupName <load balancer resource group name> -BasicLoadBalancerName <existing Basic Load Balancer name> -StandardLoadBalancerName <new Standard Load Balancer name> -RecoveryBackupPath C:\BasicLBRecovery
```

### Example: retry a failed upgrade (due to error or script termination) by providing the Basic Load Balancer and Virtual Machine Scale Set backup state file

```powerhsell
PS C:\> Start-AzBasicLoadBalancerUpgrade -FailedMigrationRetryFilePathLB C:\RecoveryBackups\State_mybasiclb_rg-basiclbrg_20220912T1740032148.json -FailedMigrationRetryFilePathVMSS C:\RecoveryBackups\VMSS_myVMSS_rg-basiclbrg_20220912T1740032148.json
```

## Common Questions

### Will this migration cause downtime to my application? 

Yes, because the Basic Load Balancer needs to be removed before the new Standard Load Balancer can be created, there will be downtime to your application. See [How long does the Upgrade take?](#how-long-does-the-upgrade-take)

### Will the module migrate my frontend IP address to the new Standard Load Balancer?

Yes, for both public and internal load balancers, the module ensures that front end IP addresses are maintained. For public IPs, the IP is converted to a static IP prior to migration (if necessary). For internal front ends, the module attempts to reassign the same IP address freed up when the Basic Load Balancer was deleted; if the private IP isn't available the script fails (see [What happens if my upgrade fails mid-migration?](#what-happens-if-my-upgrade-fails-mid-migration)).

### How long does the Upgrade take?

The upgrade normally takes a few minutes for the script to finish. The following factors may lead to longer upgrade times:
- Complexity of your load balancer configuration
- Number of backend pool members
- Instance count of associated Virtual Machine Scale Sets
- Service Fabric Cluster: Upgrades for Service Fabric Clusters take up to an hour in testing.

Keep the downtime in mind and plan for failover if necessary.

### Does the script migrate my backend pool members from my Basic Load Balancer to the newly created Standard Load Balancer?

Yes. The Azure PowerShell script migrates the Virtual Machine Scale Set to the newly created public or private Standard Load Balancer.

### Which load balancer components are migrated?

The script migrates the following from the Basic Load Balancer to the Standard Load Balancer:

**Public Load Balancer:**

- Public frontend IP configuration
  - Converts the public IP to a static IP, if dynamic
  - Updates the public IP SKU to Standard, if Basic
  - Upgrade all associated public IPs to the new Standard Load Balancer
- Health Probes:
  - All probes are migrated to the new Standard Load Balancer
- Load balancing rules:
  - All load balancing rules are migrated to the new Standard Load Balancer
- Inbound NAT Rules:
  - All user-created NAT rules are migrated to the new Standard Load Balancer
- Inbound NAT Pools:
  - All inbound NAT Pools will be migrated to the new Standard Load Balancer
- Outbound Rules:
  - Basic load balancers don't support configured outbound rules. The script creates an outbound rule in the Standard load balancer to preserve the outbound behavior of the Basic load balancer. For more information about outbound rules, see [Outbound rules](./outbound-rules.md).
- Network security group
  - Basic Load Balancer doesn't require a network security group to allow outbound connectivity. In case there's no network security group associated with the Virtual Machine Scale Set, a new network security group is created to preserve the same functionality. This new network security group is associated to the Virtual Machine Scale Set backend pool member network interfaces. It allows the same load balancing rules ports and protocols and preserve the outbound connectivity.
- Backend pools:
  - All backend pools are migrated to the new Standard Load Balancer
  - All Virtual Machine Scale Set network interfaces and IP configurations are migrated to the new Standard Load Balancer
  - If a Virtual Machine Scale Set is using Rolling Upgrade policy, the script will update the Virtual Machine Scale Set upgrade policy to "Manual" during the migration process and revert it back to "Rolling" after the migration is completed.

**Internal Load Balancer:**

- Private frontend IP configuration
- Health Probes:
  - All probes are migrated to the new Standard Load Balancer
- Load balancing rules:
  - All load balancing rules are migrated to the new Standard Load Balancer
- Inbound NAT Pools:
  - All inbound NAT Pools will be migrated to the new Standard Load Balancer
- Inbound NAT Rules:
  - All user-created NAT rules are migrated to the new Standard Load Balancer
- Backend pools:
  - All backend pools are migrated to the new Standard Load Balancer
  - All Virtual Machine Scale Set network interfaces and IP configurations are migrated to the new Standard Load Balancer
  - If there's a Virtual Machine Scale Set using Rolling Upgrade policy, the script will update the Virtual Machine Scale Set upgrade policy to "Manual" during the migration process and revert it back to "Rolling" after the migration is completed.

>[!NOTE]
> Network security group are not configured as part of Internal Load Balancer upgrade. To learn more about NSGs, see [Network security groups](../virtual-network/network-security-groups-overview.md)

### What happens if my upgrade fails mid-migration?

The module is designed to accommodate failures, either due to unhandled errors or unexpected script termination. The failure design is a 'fail forward' approach, where instead of attempting to move back to the Basic Load Balancer, you should correct the issue causing the failure (see the error output or log file), and retry the migration again, specifying the `-FailedMigrationRetryFilePathLB <BasicLoadBalancerbackupFilePath> -FailedMigrationRetryFilePathVMSS <VMSSBackupFile>` parameters. For public load balancers, because the Public IP Address SKU has been updated to Standard, moving the same IP back to a Basic Load Balancer won't be possible. The basic failure recovery procedure is:

  1. Address the cause of the migration failure. Check the log file `Start-AzBasicLoadBalancerUpgrade.log` for details
  1. [Remove the new Standard Load Balancer](./update-load-balancer-with-vm-scale-set.md) (if created). Depending on which stage of the migration failed, you may have to remove the Standard Load Balancer reference from the Virtual Machine Scale Set network interfaces (IP configurations) and Health Probes in order to remove the Standard Load Balancer.
  1. Locate the Basic Load Balancer state backup file. This file will either be in the directory where the script was executed, or at the path specified with the `-RecoveryBackupPath` parameter during the failed execution. The file is named: `State_<basicLBName>_<basicLBRGName>_<timestamp>.json`
  1. Rerun the migration script, specifying the `-FailedMigrationRetryFilePathLB <BasicLoadBalancerbackupFilePath>` and `-FailedMigrationRetryFilePathVMSS <VMSSBackupFile>` parameters instead of -BasicLoadBalancerName or passing the Basic Load Balancer over the pipeline

## Next steps

[Learn about Azure Load Balancer](load-balancer-overview.md)
