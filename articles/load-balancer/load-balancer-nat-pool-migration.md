---
title: Azure Load Balancer NAT Pool to NAT Rule Migration
description: Process for migrating NAT Pools to NAT Rules on Azure Load Balancer.
services: load-balancer
author: mbrat2005
ms.service: load-balancer
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 05/01/2023
ms.author: mbratschun
ms.custom: template-how-to, engagement-fy23
---

# Tutorial: Migrate from Inbound NAT Pools to NAT Rules

Azure Load Balancer NAT Pools are the legacy approach for automatically assigning Load Balancer front end ports to each instance in a Virtual Machine Scale Set. [NAT Rules](inbound-nat-rules.md) on Standard SKU Load Balancers have replaced this functionality with an approach that is both easier to manage and faster to configure. 

## Why Migrate to NAT Rules?

NAT Rules provide the same functionality as NAT Pools, but have the following advantages:
* NAT Rules can be managed using the Portal
* NAT Rules can leverage Backend Pools, simplifying configuration
* NAT Rules configuration changes apply more quickly than NAT Pools
* NAT Pools cannot be used in conjunction with user-configured NAT Rules

## Migration Process

The migration process will create a new Backend Pool for each Inbound NAT Pool existing on the target Load Balancer. A corresponding NAT Rule will be created for each NAT Pool and associated with the new Backend Pool. Existing Backend Pool membership will be retained. 

> [!IMPORTANT]
> The migration process removes the Virtual Machine Scale Set(s) from the NAT Pools before associating the Virtual Machine Scale Set(s) with the new NAT Rules. This requires an update to the Virtual Machine Scale Set(s) model, which may cause a brief downtime while instances are upgraded with the model.

> [!NOTE]
> Frontend port mapping to Virtual Machine Scale Set instances may change with the move to NAT Rules, especially in situations where a single NAT Pool has multiple associated Virtual Machine Scale Sets. The new port assignment will align sequentially to instance ID numbers; when there are multiple Virtual Machine Scale Sets, ports will be assigned to all instances in one scale set, then the next, continuing. 

> [!NOTE]
> Service Fabric Clusters take significantly longer to update the Virtual Machine Scale Set model (up to an hour). 

### Prerequisites 

* In order to migrate a Load Balancer's NAT Pools to NAT Rules, the Load Balancer SKU must be 'Standard'. To automate this upgrade process, see the steps provided in [Upgrade a Basic Load Balancer to Standard with PowerShell](upgrade-basic-standard-with-powershell.md).
* Virtual Machine Scale Sets associated with the target Load Balancer must use either a 'Manual' or 'Automatic' upgrade policy--'Rolling' upgrade policy is not supported. For more information, see [Virtual Machine Scale Sets Upgrade Policies](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md)
* Install the latest version of [PowerShell](/powershell/scripting/install/installing-powershell)
* Install the [Azure PowerShell modules](/powershell/azure/install-azure-powershell)

### Install the 'AzureLoadBalancerNATPoolMigration' module

Install the module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureLoadBalancerNATPoolMigration)

```azurepowershell
Install-Module -Name AzureLoadBalancerNATPoolMigration -Scope CurrentUser -Repository PSGallery -Force
```

### Use the module to upgrade NAT Pools to NAT Rules

1. Connect to Azure with `Connect-AzAccount`
1. Find the target Load Balancer for the NAT Rules upgrade and note its name and Resource Group name
1. Run the migration command

#### Example: specify the Load Balancer name and Resource Group name
   ```azurepowershell
   Start-AzNATPoolMigration -ResourceGroupName <loadBalancerResourceGroupName> -LoadBalancerName <LoadBalancerName>
   ```

#### Example: pass a Load Balancer from the pipeline
   ```azurepowershell
   Get-AzLoadBalancer -ResourceGroupName -ResourceGroupName <loadBalancerResourceGroupName> -Name <LoadBalancerName> | Start-AzNATPoolMigration
   ```

## Common Questions

### Will migration cause downtime to my NAT ports?

Yes, because we must first remove the NAT Pools before we can create the NAT Rules, there will be a brief time where there is no mapping of the front end port to a back end port.

> [!NOTE]
> Downtime for NAT'ed port on Service Fabric clusters will be significantly longer--up to an hour for a Silver cluster in testing. 

### Do I need to keep both the new Backend Pools created during the migration and my existing Backend Pools if the membership is the same?

No, following the migration, you can review the new backend pools. If the membership is the same between backend pools, you can replace the new backend pool in the NAT Rule with an existing backend pool, then remove the new backend pool. 

## Next steps

- Learn about [Managing Inbound NAT Rules](./manage-inbound-nat-rules.md)
- Learn about [Azure Load Balancer NAT Pools and NAT Rules](https://azure.microsoft.com/blog/manage-port-forwarding-for-backend-pool-with-azure-load-balancer/)
