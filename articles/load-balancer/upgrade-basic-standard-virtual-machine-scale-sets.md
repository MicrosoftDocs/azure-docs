---
title: Upgrade from Basic to Standard for Virtual Machine Scale Sets
titleSuffix: Azure Load Balancer
description: This article shows you how to upgrade a load balancer from basic to standard SKU for Virtual Machine Scale Sets.
services: load-balancer
author: Welasco
ms.service: load-balancer
ms.topic: how-to
ms.date: 09/22/2022
ms.author: vsantana
---
# Upgrade a basic load balancer used with Virtual Machine Scale Sets

>[!Important]
>On September 30, 2025, Basic Load Balancer will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer/). If you are currently using Basic Load Balancer, make sure to upgrade to Standard Load Balancer prior to the retirement date. This article will help guide you through the upgrade process. 

[Azure Standard Load Balancer](load-balancer-overview.md) offers a rich set of functionality and high availability through zone redundancy. To learn more about Load Balancer SKU, see [comparison table](./skus.md#skus).

This article introduces a PowerShell module that creates a Standard Load Balancer with the same configuration as the Basic Load Balancer along with the associated  Virtual Machine Scale Set.

## Upgrade Overview

An Azure PowerShell module is available to upgrade from Basic load balancer to a Standard load balancer along with moving the associated virtual machine scale set. The PowerShell module performs the following functions:

- Verifies that the provided Basic load balancer scenario is supported for upgrade.
- Backs up the Basic load balancer and virtual machine scale set  configuration, enabling retry on failure or if errors are encountered.
- For public load balancers, updates the front end public IP address(es) to Standard SKU and static assignment as required.
- Upgrade the Basic load balancer configuration to a new Standard load balancer, ensuring configuration and feature parity.
- Upgrade virtual machine scale set backend pool members from the Basic load balancer to the standard load balancer.
- Creates and associates a network security group with the virtual machine scale set to ensure load balanced traffic reaches backend pool members, following Standard load balancer's move to a default-deny network policy.
- Logs the upgrade operation for easy audit and failure recovery.

### Unsupported Scenarios

- Basic load balancers with a virtual machine scale set backend pool member that is also a member of a backend pool on a different load balancer
- Basic load balancers with backend pool members that aren't a virtual machine scale set
- Basic load balancers with only empty backend pools
- Basic load balancers with IPV6 frontend IP configurations
- Basic load balancers with a virtual machine scale set backend pool member configured with 'Flexible' orchestration mode
- Basic load balancers with a virtual machine scale set backend pool member where one or more virtual machine scale set instances have ProtectFromScaleSetActions Instance Protection policies enabled
- Migrating a Basic load balancer to an existing Standard load balancer

### Prerequisites

- Install the latest version of [PowerShell](/powershell/scripting/install/installing-powershell)
- Determine whether you have the latest Az PowerShell module installed (8.2.0)
  - Install the latest Az PowerShell module](/powershell/azure/install-az-ps)

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
    - *BasicLoadBalancerName [string] Required* - This parameter is the name of the existing Basic load balancer you would like to upgrade
    - *ResourceGroupName [string] Required* - This parameter is the name of the resource group containing the Basic load balancer
    - *RecoveryBackupPath [string] Optional* - This parameter allows you to specify an alternative path in which to store the Basic load balancer ARM template backup file (defaults to the current working directory)
    - *FailedMigrationRetryFilePathLB [string] Optional* - This parameter allows you to specify a path to a Basic load balancer backup state file when retrying a failed upgrade (defaults to current working directory)
    - *FailedMigrationRetryFilePathVMSS [string] Optional* - This parameter allows you to specify a path to a virtual machine scale set backup state file when retrying a failed upgrade (defaults to current working directory)

4. Run the Upgrade command.

### Example: upgrade a basic load balancer to a standard load balancer with the same name, providing the basic load balancer name and resource group

```powershell
PS C:\> Start-AzBasicLoadBalancerUpgrade -ResourceGroupName <load balancer resource group name> -BasicLoadBalancerName <existing basic load balancer name>
```

### Example: upgrade a basic load balancer to a standard load balancer with the same name, providing the basic load object through the pipeline

```powershell
PS C:\> Get-AzLoadBalancer -Name <basic load balancer name> -ResourceGroup <Basic load balancer resource group name> | Start-AzBasicLoadBalancerUpgrade
```

### Example: upgrade a basic load balancer to a standard load balancer with the specified name, displaying logged output on screen

```powershell
PS C:\> Start-AzBasicLoadBalancerUpgrade -ResourceGroupName <load balancer resource group name> -BasicLoadBalancerName <existing basic load balancer name> -StandardLoadBalancerName <new standard load balancer name> -FollowLog
```

### Example: upgrade a basic load balancer to a standard load balancer with the specified name and store the basic load balancer backup file at the specified path

```powershell
PS C:\> Start-AzBasicLoadBalancerUpgrade -ResourceGroupName <load balancer resource group name> -BasicLoadBalancerName <existing basic load balancer name> -StandardLoadBalancerName <new standard load balancer name> -RecoveryBackupPath C:\BasicLBRecovery
```

### Example: retry a failed upgrade (due to error or script termination) by providing the Basic load balancer and virtual machine scale set backup state file

```powerhsell
PS C:\> Start-AzBasicLoadBalancerUpgrade -FailedMigrationRetryFilePathLB C:\RecoveryBackups\State_mybasiclb_rg-basiclbrg_20220912T1740032148.json -FailedMigrationRetryFilePathVMSS C:\RecoveryBackups\VMSS_myVMSS_rg-basiclbrg_20220912T1740032148.json
```

## Common Questions

### Will the module migrate my frontend IP address to the new Standard load balancer?

Yes, for both public and internal load balancers, the module ensures that front end IP addresses are maintained. For public IPs, the IP is converted to a static IP prior to migration (if necessary). For internal front ends, the module will attempt to reassign the same IP address freed up when the Basic load balancer was deleted; if the private IP isn't available the script will fail. In this scenario, remove the virtual network connected device that has claimed the intended front end IP and rerun the module with the `-FailedMigrationRetryFilePathLB <BasicLoadBalancerbackupFilePath> -FailedMigrationRetryFilePathVMSS <VMSSBackupFile>` parameters specified.

### How long does the Upgrade take?

The upgrade normally takes a few minutes for the script to finish. The following factors may lead to longer upgrade times:
- Complexity of your load balancer configuration
- Number of backend pool members
- Instance count of associated Virtual Machine Scale Sets.
Keep the downtime in mind and plan for failover if necessary.

### Does the script migrate my backend pool members from my basic load balancer to the newly created standard load balancer?

Yes. The Azure PowerShell script migrates the virtual machine scale set to the newly created public or private standard load balancer.

### Which load balancer components are migrated?

The script migrates the following from the Basic load balancer to the Standard load balancer:

**Public Load Balancer:**

- Public frontend IP configuration
  - Converts the public IP to a static IP, if dynamic
  - Updates the public IP SKU to Standard, if Basic
  - Upgrade all associated public IPs to the new Standard load balancer
- Health Probes:
  - All probes will be migrated to the new Standard load balancer
- Load balancing rules:
  - All load balancing rules will be migrated to the new Standard load balancer
- Inbound NAT Rules:
  - All NAT rules will be migrated to the new Standard load balancer
- Outbound Rules:
  - Basic load balancers don't support configured outbound rules. The script will create an outbound rule in the Standard load balancer to preserve the outbound behavior of the Basic load balancer. For more information about outbound rules, see [Outbound rules](./outbound-rules.md).
- Network security group
  - Basic load balancer doesn't require a network security group to allow outbound connectivity. In case there's no network security group associated with the virtual machine scale set, a new network security group will be created to preserve the same functionality. This new network security group will be associated to the virtual machine scale set backend pool member network interfaces. It will allow the same load balancing rules ports and protocols and preserve the outbound connectivity.
- Backend pools:
  - All backend pools will be migrated to the new Standard load balancer
  - All virtual machine scale set network interfaces and IP configurations will be migrated to the new Standard load balancer
  - If a virtual machine scale set is using Rolling Upgrade policy, the script will update the virtual machine scale set upgrade policy to "Manual" during the migration process and revert it back to "Rolling" after the migration is completed.

**Internal Load Balancer:**

- Private frontend IP configuration
  - Converts the public IP to a static IP, if dynamic
  - Updates the public IP SKU to Standard, if Basic
- Health Probes:
  - All probes will be migrated to the new Standard load balancer
- Load balancing rules:
  - All load balancing rules will be migrated to the new Standard load balancer
- Inbound NAT Rules:
  - All NAT rules will be migrated to the new Standard load balancer
- Backend pools:
  - All backend pools will be migrated to the new Standard load balancer
  - All virtual machine scale set network interfaces and IP configurations will be migrated to the new Standard load balancer
  - If there's a virtual machine scale set using Rolling Upgrade policy, the script will update the virtual machine scale set upgrade policy to "Manual" during the migration process and revert it back to "Rolling" after the migration is completed.

>[!NOTE]
> Network security group are not configured as part of Internal Load Balancer upgrade. To learn more about NSGs, see [Network security groups](../virtual-network/network-security-groups-overview.md)

### What happens if my upgrade fails mid-migration?

The module is designed to accommodate failures, either due to unhandled errors or unexpected script termination. The failure design is a 'fail forward' approach, where instead of attempting to move back to the Basic load balancer, you should correct the issue causing the failure (see the error output or log file), and retry the migration again, specifying the `-FailedMigrationRetryFilePathLB <BasicLoadBalancerbackupFilePath> -FailedMigrationRetryFilePathVMSS <VMSSBackupFile>` parameters. For public load balancers, because the Public IP Address SKU has been updated to Standard, moving the same IP back to a Basic load balancer won't be possible. The basic failure recovery procedure is:

  1. Address the cause of the migration failure. Check the log file `Start-AzBasicLoadBalancerUpgrade.log` for details
  1. [Remove the new Standard load balancer](./update-load-balancer-with-vm-scale-set.md) (if created). Depending on which stage of the migration failed, you may have to remove the Standard load balancer reference from the virtual machine scale set network interfaces (IP configurations) and health probes in order to remove the Standard load balancer and try again.
  1. Locate the basic load balancer state backup file. This will either be in the directory where the script was executed, or at the path specified with the `-RecoveryBackupPath` parameter during the failed execution. The file will be named: `State_<basicLBName>_<basicLBRGName>_<timestamp>.json`
  1. Rerun the migration script, specifying the `-FailedMigrationRetryFilePathLB <BasicLoadBalancerbackupFilePath> -FailedMigrationRetryFilePathVMSS <VMSSBackupFile>` parameters instead of -BasicLoadBalancerName or passing the Basic load balancer over the pipeline

## Next steps

[Learn about Azure Load Balancer](load-balancer-overview.md)