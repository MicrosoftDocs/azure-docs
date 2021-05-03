---
title: Move a maintenance configuration to another Azure region
description: Learn how to move a VM maintenance configuration to another Azure region
author: shants123
ms.service: virtual-machines
ms.topic: how-to
ms.tgt_pltfrm: vm
ms.date: 03/04/2020
ms.author: shants
#Customer intent: As an admin responsible for maintenance, I want move a Maintenance Control configuration associated with Azure resources to another Azure region.
---


# Move a Maintenance Control configuration to another region

Follow this article to move a Maintenance Control configuration to a different Azure region. You might want to move a configuration for a number of reasons. For example, to take advantage of a new region, to deploy features or services available in a specific region, to meet internal policy and governance requirements, or in response to capacity planning.

[Maintenance control](maintenance-control.md), with customized maintenance configurations, allows you to control how platform updates are applied to VMs, and to Azure Dedicated Hosts. There are a couple of scenarios for moving maintenance control across regions:

- To move your maintenance control configuration, but not the resources associated with the configuration, follow the instructions in this article.
- To move the resources associated with a maintenance configuration, but not the configuration itself, follow [these instructions](move-region-maintenance-configuration-resources.md).
- To move both the maintenance configuration and the resources associated with it, first follow the instructions in this article. Then, follow [these instructions](move-region-maintenance-configuration-resources.md).

## Prerequisites

Before you begin moving a maintenance control configuration:

- Maintenance configurations are associated with Azure VMs or Azure Dedicated Hosts. Make sure that VM/host resources exist in the new region before you begin.
- Identify: 
    - Existing maintenance control configurations.
    - The resource groups in which existing configurations currently reside. 
    - The resource groups to which the configurations will be added after moving to the new region. 
    - The resources associated with the maintenance configuration you want to move.
    - Check that the resources in the new region are the same as those associated with the current maintenance configurations. The configurations can have the same names in the new region as they did in the old, but this isn't required.

## Prepare and move 

1. Retrieve all of the maintenance configurations in each subscription. Run the CLI [az maintenance configuration list](/cli/azure/maintenance/configuration#az_maintenance_configuration_list) command to do this, replacing $subId with your subscription ID.

    ```
    az maintenance configuration list --subscription $subId --query "[*].{Name:name, Location:location, ResGroup:resourceGroup}" --output table
    ```
2. Review the returned table list of configuration records within the subscription. Here's an example. Your list will contain values for your specific environment.

    **Name** | **Location** | **Resource group**
    --- | --- | ---
    Skip Maintenance | eastus2 | configuration-resource-group
    IgniteDemoConfig | eastus2 | configuration-resource-group
    defaultMaintenanceConfiguration-eastus | eastus | test-configuration
    

3. Save your list for reference. As you move the configurations, it helps you to verify that everything's been moved.
4. As a reference, map each configuration/resource group to the new resource group in the new region.
5. Create new maintenance configurations in the new region using [PowerShell](../virtual-machines/maintenance-control-powershell.md#create-a-maintenance-configuration), or [CLI](../virtual-machines/maintenance-control-cli.md#create-a-maintenance-configuration).
6. Associate the configurations with the resources in the new region, using [PowerShell](../virtual-machines/maintenance-control-powershell.md#assign-the-configuration), or [CLI](../virtual-machines/maintenance-control-cli.md#assign-the-configuration).


## Verify the move

After moving the configurations, compare configurations and resources in the new region with the table list you prepared.


## Clean up source resources

After the move, consider deleting the moved maintenance configurations in the source region, [PowerShell](../virtual-machines/maintenance-control-powershell.md#remove-a-maintenance-configuration), or [CLI](../virtual-machines/maintenance-control-cli.md#delete-a-maintenance-configuration).


## Next steps

Follow [these instructions](move-region-maintenance-configuration-resources.md) if you need to move resources associated with maintenance configurations. 
