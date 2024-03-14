---
title: Upgrade from Basic to Standard with PowerShell
titleSuffix: Azure Load Balancer
description: This article shows you how to upgrade a load balancer from basic to standard SKU for Virtual Machine or Virtual Machine Scale Sets backends using a PowerShell module.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.date: 10/03/2023
ms.author: mbender
ms.custom: template-how-to, engagement-fy23
---

# Upgrade a basic load balancer with PowerShell

>[!Important]
>On September 30, 2025, Basic Load Balancer will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer/). If you are currently using Basic Load Balancer, make sure to upgrade to Standard Load Balancer prior to the retirement date. 

[Azure Standard Load Balancer](load-balancer-overview.md) offers a rich set of functionality and high availability through zone redundancy. To learn more about Load Balancer SKU, see [comparison table](./skus.md#skus).

This article introduces a PowerShell module that creates a Standard Load Balancer with the same configuration as the Basic Load Balancer, then associates the Virtual Machine Scale Set or Virtual Machine backend pool members with the new Load Balancer.

For an in-depth walk-through of the upgrade module and process, see the following video:
> [!VIDEO https://learn.microsoft.com/_themes/docs.theme/master/en-us/_themes/global/video-embed.html?id=8e203b99-41ff-4454-9cbd-58856708f1c6]

- 03:06 - <a href="https://learn.microsoft.com/_themes/docs.theme/master/en-us/_themes/global/video-embed.html?id=8e203b99-41ff-4454-9cbd-58856708f1c6#time=0h3m06s" target="_blank">Step-by-step</a>
- 32:54 - <a href="https://learn.microsoft.com/_themes/docs.theme/master/en-us/_themes/global/video-embed.html?id=8e203b99-41ff-4454-9cbd-58856708f1c6#time=0h32m45s" target="_blank">Recovery</a>
- 40:55 - <a href="https://learn.microsoft.com/_themes/docs.theme/master/en-us/_themes/global/video-embed.html?id=8e203b99-41ff-4454-9cbd-58856708f1c6#time=0h40m55s" target="_blank">Advanced Scenarios</a>
- 57:54 - <a href="https://learn.microsoft.com/_themes/docs.theme/master/en-us/_themes/global/video-embed.html?id=8e203b99-41ff-4454-9cbd-58856708f1c6#time=0h57m54s" target="_blank">Resources</a>

## Upgrade Overview

The PowerShell module performs the following functions:

- Verifies that the provided Basic Load Balancer scenario is supported for upgrade.
- Backs up the Basic Load Balancer and Virtual Machine Scale Set configuration, enabling retry on failure or if errors are encountered.
- For public load balancers, updates the front end public IP addresses to Standard SKU and static assignment
- Upgrades the Basic Load Balancer configuration to a new Standard Load Balancer, ensuring configuration and feature parity.
- Migrates Virtual Machine Scale Set and Virtual Machine backend pool members from the Basic Load Balancer to the Standard Load Balancer.
- Creates and associates a network security group with the Virtual Machine Scale Set or Virtual Machine to ensure load balanced traffic reaches backend pool members, following Standard Load Balancer's move to a default-deny network policy.
- Upgrades instance-level Public IP addresses associated with Virtual Machine Scale Set or Virtual Machine instances
- Upgrades [Inbound NAT Pools to Inbound NAT Rules](load-balancer-nat-pool-migration.md#why-migrate-to-nat-rules) for Virtual Machine Scale Set backends. Specify `-skipUpgradeNATPoolsToNATRules` to skip this upgrade.
- Logs the upgrade operation for easy audit and failure recovery.

>[!WARNING]
> Migrating _internal_ Basic Load Balancers where the backend VMs or VMSS instances do not have Public IP Addresses requires additional steps for backend connectivity to the internet. Review [How should I configure outbound traffic for my Load Balancer?](#how-should-i-configure-outbound-traffic-for-my-load-balancer)

>[!NOTE]
> If the Virtual Machine Scale Set in the Load Balancer backend pool has Public IP Addresses in its network configuration, the Public IP Addresses associated with each Virtual Machine Scale Set instance will change when they are upgraded to Standard SKU. This is because scale set instance-level Public IP addresses cannot be upgraded, only replaced with a new Standard SKU Public IP. All other Public IP addresses will be retained through the migration. 

>[!NOTE]
> If the Virtual Machine Scale Set behind the Load Balancer is a **Service Fabric Cluster**, migration with this script will take more time. In testing, a 5-node Bronze cluster was unavailable for about 30 minutes and a 5-node Silver cluster was unavailable for about 45 minutes. For Service Fabric clusters that require minimal / no connectivity downtime, adding a new nodetype with Standard Load Balancer and IP resources is a better solution.

### Unsupported Scenarios

- Basic Load Balancers with IPv6 frontend IP configurations
- Basic Load Balancers for [Azure Kubernetes Services (AKS) clusters](../aks/load-balancer-standard.md#moving-from-a-basic-sku-load-balancer-to-standard-sku)
- Basic Load Balancers with a Virtual Machine Scale Set backend pool member where one or more Virtual Machine Scale Set instances have ProtectFromScaleSetActions Instance Protection policies enabled
- Migrating a Basic Load Balancer to an existing Standard Load Balancer

## Install the 'AzureBasicLoadBalancerUpgrade' module

### Prerequisites

- **PowerShell**: A supported version of PowerShell version 7 or higher is recommended for use with the AzureBasicLoadBalancerUpgrade module on all platforms including Windows, Linux, and macOS. However, PowerShell 5.1 on Windows is supported. 
- **Az PowerShell Module**: Determine whether you have the latest Az PowerShell module installed
  - Install the latest [Az PowerShell module](/powershell/azure/install-azure-powershell)
- **Az.ResourceGraph PowerShell Module**: The Az.ResourceGraph PowerShell module is used to query resource configuration during upgrade and is a separate install from the Az PowerShell module. It is automatically added if you install the `AzureBasicLoadBalancerUpgrade` module using the `Install-Module` command. 

### Module Installation

Install the module from [PowerShell gallery](https://www.powershellgallery.com/packages/AzureBasicLoadBalancerUpgrade)

```powershell
PS C:\> Install-Module -Name AzureBasicLoadBalancerUpgrade -Scope CurrentUser -Repository PSGallery -Force
```

## Pre- and Post-migration Steps

### Pre-migration steps

- [Validate](#example-validate-a-scenario) that your scenario is supported
- Plan for [application downtime](#how-long-does-the-upgrade-take) during migration
- Develop inbound and outbound connectivity tests for your traffic
- Plan for instance-level Public IP changes on Virtual Machine Scale Set instances (see note)
- [Recommended] Create Network Security Groups or add security rules to an existing Network Security Group for your backend pool members. Allow the traffic through the Load Balancer and any other traffic which will need to be explicitly allowed on public Standard SKU resources
- [Recommended] Prepare your [outbound connectivity](../virtual-network/ip-services/default-outbound-access.md), taking one of the following approaches described in [How should I configure outbound traffic for my Load Balancer?](#how-should-i-configure-outbound-traffic-for-my-load-balancer)

### Post-migration steps

- [Validate that your migration was successful](#example-validate-completed-migration)
- Test inbound application connectivity through the Load Balancer
- Test outbound connectivity from backend pool members to the Internet
- For Public Load Balancers with multiple backend pools, create [Outbound Rules](./outbound-rules.md) for each backend pool 

## Use the module

1. Use `Connect-AzAccount` to connect to the required Microsoft Entra tenant and Azure subscription

    ```powershell
    PS C:\> Connect-AzAccount -Tenant <TenantId> -Subscription <SubscriptionId>
    ```

2. Find the Load Balancer you wish to upgrade. Record its name and resource group name.

3. Examine the basic module parameters:
    - *BasicLoadBalancerName [string] Required* - This parameter is the name of the existing Basic Load Balancer you would like to upgrade
    - *ResourceGroupName [string] Required* - This parameter is the name of the resource group containing the Basic Load Balancer
    - *StandardLoadBalancerName [string] Optional* - Use this parameter to optionally configure a new name for the Standard Load Balancer. If not specified, the Basic Load Balancer name is reused.
    - *RecoveryBackupPath [string] Optional* - This parameter allows you to specify an alternative path in which to store the Basic Load Balancer ARM template backup file (defaults to the current working directory)
    
    >[!NOTE]
    >Additional parameters for advanced and recovery scenarios can be viewed by running `Get-Help Start-AzBasicLoadBalancerUpgrade -Detailed` 

4. Run the Upgrade command.

### Example: validate a scenario

Validate that a Basic Load Balancer is supported for upgrade

```powershell
PS C:\> Start-AzBasicLoadBalancerUpgrade -ResourceGroupName <loadBalancerRGName> -BasicLoadBalancerName <basicLBName> -validateScenarioOnly
```

### Example: upgrade by name

Upgrade a Basic Load Balancer to a Standard Load Balancer with the same name, providing the Basic Load Balancer name and resource group name

```powershell
PS C:\> Start-AzBasicLoadBalancerUpgrade -ResourceGroupName <loadBalancerRGName> -BasicLoadBalancerName <basicLBName>
```

### Example: upgrade, change name, and show logs

Upgrade a Basic Load Balancer to a Standard Load Balancer with the specified name, displaying logged output on screen

```powershell
PS C:\> Start-AzBasicLoadBalancerUpgrade -ResourceGroupName <loadBalancerRGName> -BasicLoadBalancerName <basicLBName> -StandardLoadBalancerName <newStandardLBName> -FollowLog
```

### Example: upgrade with alternate backup path

Upgrade a Basic Load Balancer to a Standard Load Balancer with the specified name and store the Basic Load Balancer backup file at the specified path

```powershell
PS C:\> Start-AzBasicLoadBalancerUpgrade -ResourceGroupName <loadBalancerRGName> -BasicLoadBalancerName <basicLBName> -StandardLoadBalancerName <newStandardLBName> -RecoveryBackupPath C:\BasicLBRecovery
```

### Example: validate completed migration

Validate a completed migration by passing the Basic Load Balancer state file backup and the Standard Load Balancer name

```powershell
PS C:\> Start-AzBasicLoadBalancerUpgrade -validateCompletedMigration -basicLoadBalancerStatePath C:\RecoveryBackups\State_mybasiclb_rg-basiclbrg_20220912T1740032148.json
```

### Example: migrate multiple, related Load Balancers

Migrate multiple Load Balancers with shared backend members at the same time, usually when an application has an internal and an external Load Balancer

```powershell
# build array of multiple basic load balancers
PS C:\> $multiLBConfig = @(
    @{
        'standardLoadBalancerName' = 'myStandardInternalLB01' # specifying the standard load balancer name is optional
        'basicLoadBalancer' = (Get-AzLoadBalancer -ResourceGroupName myRG -Name myBasicInternalLB01)
    },
        @{
        'standardLoadBalancerName' = 'myStandardExternalLB02'
        'basicLoadBalancer' = (Get-AzLoadBalancer -ResourceGroupName myRG -Name myBasicExternalLB02)
    }
)
# pass the array of load balancer configurations to the -MultiLBConfig parameter
PS C:\> Start-AzBasicLoadBalancerUpgrade -MultiLBConfig $multiLBConfig
```

### Example: retry failed virtual machine scale set migration

Retry a failed upgrade for a virtual machine scale set's load balancer (due to error or script termination) by providing the Basic Load Balancer and Virtual Machine Scale Set backup state file

```powershell
PS C:\> Start-AzBasicLoadBalancerUpgrade -FailedMigrationRetryFilePathLB C:\RecoveryBackups\State_mybasiclb_rg-basiclbrg_20220912T1740032148.json -FailedMigrationRetryFilePathVMSS C:\RecoveryBackups\VMSS_myVMSS_rg-basiclbrg_20220912T1740032148.json
```

### Example: retry failed virtual machine migration

Retry a failed upgrade for a VM load balancer (due to error or script termination) by providing the Basic Load Balancer backup state file

```powershell
PS C:\> Start-AzBasicLoadBalancerUpgrade -FailedMigrationRetryFilePathLB C:\RecoveryBackups\State_mybasiclb_rg-basiclbrg_20220912T1740032148.json
```

## Common Questions

### Will this migration cause downtime to my application? 

Yes, because the Basic Load Balancer needs to be removed before the new Standard Load Balancer can be created, there will be downtime to your application. See [How long does the Upgrade take?](#how-long-does-the-upgrade-take)

### Will the module migrate my frontend IP address to the new Standard Load Balancer?

Yes, for both public and internal load balancers, the module ensures that front end IP addresses are maintained. For public IPs, the IP is converted to a static IP before migration. For internal front ends, the module attempts to reassign the same IP address freed up when the Basic Load Balancer was deleted. If the private IP isn't available the script fails (see [What happens if my upgrade fails mid-migration?](#what-happens-if-my-upgrade-fails-mid-migration)).

### How long does the Upgrade take?

The upgrade normally takes a few minutes for the script to finish. The following factors may lead to longer upgrade times:
- Complexity of your load balancer configuration
- Number of backend pool members
- Instance count of associated Virtual Machine Scale Sets or Virtual Machinesf
- Service Fabric Cluster: Upgrades for Service Fabric Clusters take around an hour in testing

Keep the downtime in mind and plan for failover if necessary.

### Does the script migrate my backend pool members from my Basic Load Balancer to the newly created Standard Load Balancer?

Yes. The Azure PowerShell script migrates the Virtual Machine Scale Sets and Virtual Machines to the newly created Standard Load Balancer backend pools.

### Which load balancer components are migrated?

The script migrates the following from the Basic Load Balancer to the Standard Load Balancer:

**Public and Private Load Balancers:**

- Health Probes:
  - All probes are migrated to the new Standard Load Balancer
- Load balancing rules:
  - All load balancing rules are migrated to the new Standard Load Balancer
- Inbound NAT Rules:
  - All user-created NAT rules are migrated to the new Standard Load Balancer
- Inbound NAT Pools:
  - By default, NAT Pools are upgraded to NAT Rules
  - To migrate NAT Pools instead, specify the `-skipUpgradeNATPoolsToNATRules` parameter when upgrading
- Backend pools:
  - All backend pools are migrated to the new Standard Load Balancer
  - All Virtual Machine Scale Set and Virtual Machine network interfaces and IP configurations are migrated to the new Standard Load Balancer
  - If a Virtual Machine Scale Set is using Rolling Upgrade policy, the script will update the Virtual Machine Scale Set upgrade policy to "Manual" during the migration process and revert it back to "Rolling" after the migration is completed.
- Instance-level Public IP addresses
    - For both Virtual Machines and Virtual Machine Scale Sets, converts attached Public IPs from Basic to Standard SKU. Note, Scale Set instance Public IPs change during the upgrade; virtual machine IPs do not. 
- Tags from the Basic Load Balancer to Standard Load Balancer

**Public Load Balancer:**

- Public frontend IP configuration
  - Converts the public IP to a static IP, if dynamic
  - Updates the public IP SKU to Standard, if Basic
  - Upgrade all associated public IPs to the new Standard Load Balancer
- Outbound Rules:
  - Basic load balancers don't support configured outbound rules. The script creates an outbound rule in the Standard load balancer to preserve the outbound behavior of the Basic load balancer. For more information about outbound rules, see [Outbound rules](./outbound-rules.md).
- Network security group
  - Basic Load Balancer doesn't require a network security group to allow outbound connectivity. In case there's no network security group associated with the Virtual Machine Scale Set, a new network security group is created to preserve the same functionality. This new network security group is associated to the Virtual Machine Scale Set backend pool member network interfaces. It allows the same load balancing rules ports and protocols and preserve the outbound connectivity.


**Internal Load Balancer:**

- Private frontend IP configuration

>[!NOTE]
> Network security groups are not configured as part of Internal Load Balancer upgrade. To learn more about NSGs, see [Network security groups](../virtual-network/network-security-groups-overview.md)

### How do I migrate when my backend pool members belong to multiple Load Balancers?

In a scenario where your backend pool members are also members of backend pools on another Load Balancer, such as when you have internal and external Load Balancers for the same application, the Basic Load Balancers need to be migrated at the same time. Trying to migrate the Load Balancers one at a time would attempt to mix Basic and Standard SKU resources, which is not allowed. The migration script supports this by passing multiple Basic Load Balancers into the same [script execution using the `-MultiLBConfig` parameter](#example-migrate-multiple-related-load-balancers). 

### How do I validate that a migration was successful?

At the end of its execution, the upgrade module performs the following validations, comparing the Basic Load Balancer to the new Standard Load Balancer. In a failed migration, this same operation can be called using the `-validateCompletedMigration` and `-basicLoadBalancerStatePath` parameters to determine the configuration state of the Standard Load Balancer (if one was created). The log file created during the migration also provides extensive detail on the migration operation and any errors. 

- The Standard Load Balancer exists and its SKU is 'Standard'
- The count of front end IP configurations match and that the IP addresses are the same
- The count of backend pools and their memberships matches
- The count of load balancing rules matches
- The count of health probes matches
- The count of inbound NAT rules matches
- The count of inbound NAT pools matches
- External Standard Load Balancers have a configured outbound rule
- External Standard Load Balancer backend pool members have associated Network Security Groups

### How should I configure outbound traffic for my Load Balancer?

Standard SKU Load Balancers do not allow default outbound access for their backend pool members. Allowing outbound access to the internet requires more steps. 

For external Load Balancers, you can use [Outbound Rules](./outbound-rules.md) to explicitly enable outbound traffic for your pool members. If you have a single backend pool, we automatically configure an Outbound Rule for you during migration; if you have more than one backend pool, you will need to manually create your Outbound Rules to specify port allocations. 

For internal Load Balancers, Outbound Rules are not an option because there is no Public IP address to SNAT through. This leaves a couple options to consider:

- **NAT Gateway**: NAT Gateways are Azure's [recommended approach](../virtual-network/ip-services/default-outbound-access.md#if-i-need-outbound-access-what-is-the-recommended-way) for outbound traffic in most cases. However, NAT Gateways require that the attached subnet has no basic SKU network resources--meaning you will need to have migrated all your Load Balancers and Public IP Addresses before you can use them. For this reason, we recommend using a two step approach where you first use one of the following approaches for outbound connectivity, then [switch to NAT Gateways](../virtual-network/nat-gateway/tutorial-nat-gateway-load-balancer-internal-portal.md) once your basic SKU migrations are complete. 
- **Network Virtual Appliance**: Route your traffic through a Network Virtual Appliance, such as an Azure Firewall, which will in turn route your traffic to the internet. This option is ideal if you already have a Network Virtual Appliance configured.
- **Secondary External Load Balancer**: By adding a secondary external Load Balancer to your backend resources, you can use the external Load Balancer for outbound traffic by configuring outbound rules. If this external Load Balancer does not have any load balancing rules, NAT rules, or inbound NAT pools configured, your backend resources will remain isolated to your internal network for inbound traffic--see [outbound-only load balancer configuration](./egress-only.md). With this option, the external Load Balancer can be configured prior to migrating from basic to standard SKU and migrated at the same time as the internal load balancer using [using the `-MultiLBConfig` parameter](#example-migrate-multiple-related-load-balancers)
- **Public IP Addresses**: Lastly, Public IP addresses can be added directly to your [Virtual Machines](../virtual-network/ip-services/associate-public-ip-address-vm.md) or [Virtual Machine Scale Set instances](../virtual-machine-scale-sets/virtual-machine-scale-sets-networking.md#public-ipv4-per-virtual-machine). However, this option is not recommended due to the additional security surface area and expense of adding Public IP Addresses.  

### What happens if my upgrade fails mid-migration?

The module is designed to accommodate failures, either due to unhandled errors or unexpected script termination. The failure design is a 'fail forward' approach, where instead of attempting to move back to the Basic Load Balancer, you should correct the issue causing the failure (see the error output or log file), and retry the migration again, specifying the `-FailedMigrationRetryFilePathLB <BasicLoadBalancerBackupFilePath> -FailedMigrationRetryFilePathVMSS <VMSSBackupFile>` parameters. For public load balancers, because the Public IP Address SKU has been updated to Standard, moving the same IP back to a Basic Load Balancer won't be possible. 

Watch a video of the recovery process: 
> [!VIDEO https://learn.microsoft.com/_themes/docs.theme/master/en-us/_themes/global/video-embed.html?id=8e203b99-41ff-4454-9cbd-58856708f1c6]

If your failed migration was targeting multiple load balancers at the same time, using the `-MultiLBConfig` parameter, recover each Load Balancer individually using the same process as below. 

The basic failure recovery procedure is:

  1. Address the cause of the migration failure. Check the log file `Start-AzBasicLoadBalancerUpgrade.log` for details
  1. [Remove the new Standard Load Balancer](./update-load-balancer-with-vm-scale-set.md) (if created). Depending on which stage of the migration failed, you may have to remove the Standard Load Balancer reference from the Virtual Machine Scale Set or Virtual Machine network interfaces (IP configurations) and Health Probes in order to remove the Standard Load Balancer.
  1. Locate the Basic Load Balancer state backup file. This file will either be in the directory where the script was executed, or at the path specified with the `-RecoveryBackupPath` parameter during the failed execution. The file is named: `State_<basicLBName>_<basicLBRGName>_<timestamp>.json`
  1. Rerun the migration script, specifying the `-FailedMigrationRetryFilePathLB <BasicLoadBalancerbackupFilePath>` and `-FailedMigrationRetryFilePathVMSS <VMSSBackupFile>` (for Virtual Machine Scale set backends) parameters instead of -BasicLoadBalancerName or passing the Basic Load Balancer over the pipeline

## Next steps

- [If skipped, migrate from using NAT Pools to NAT Rules for Virtual Machine Scale Sets](load-balancer-nat-pool-migration.md)
- [Learn about Azure Load Balancer](load-balancer-overview.md)
