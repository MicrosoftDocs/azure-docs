---
title: Move resources associated with a maintenance configuration to another region
description: Learn how to move resources associated with a VM maintenance configuration to another Azure region
author: shants123
ms.service: virtual-machines
ms.topic: how-to
ms.date: 03/04/2020
ms.author: shants
#Customer intent: As an admin responsible for maintenance, I want move resources associated with a Maintenance Control configuration to another Azure region.
---


# Move resources in a Maintenance Control configuration to another region

Follow this article to move resources associated with a Maintenance Control configuration to a different Azure region. You might want to move a configuration for a number of reasons. For example, to take advantage of a new region, to deploy features or services available in a specific region, to meet internal policy and governance requirements, or in response to capacity planning.

[Maintenance control](maintenance-control.md), with customized maintenance configurations, allows you to control how platform updates are applied to VMs, and to Azure Dedicated Hosts. There are a couple of scenarios for moving maintenance control across regions:

- To move the resources associated with a maintenance configuration, but not the configuration itself, follow this article.
- To move your maintenance control configuration, but not the resources associated with the configuration, follow [these instructions](move-region-maintenance-configuration.md).
- To move both the maintenance configuration and the resources associated with it, first follow [these instructions](move-region-maintenance-configuration.md). Then, follow the instructions in this article.

## Prerequisites

Before you begin moving the resources associated with a Maintenance Control configuration:

- Make sure that the resources you're moving exist in the new region before you begin.
- Verify the Maintenance Control configurations associated with the Azure VMs and Azure Dedicated Hosts that you want to move. Check each resource individually. There's currently no way to retrieve configurations for multiple resources.
- When retrieving configurations for a resource:
    - Make sure you use the subscription ID for the account, not an Azure Dedicated Host ID.
    - CLI: The --output table  parameter is used for readability only, and can be deleted or changed.
    - PowerShell: The Format-Table Name parameter is used for readability only, and can be deleted or changed.
    - If you use PowerShell, you get an error if you try to list configurations for a resource that doesn't have any associated configurations. The error will be similar to: "Operation failed with status: 'Not Found'. Details: 404 Client Error: Not Found for url".

    
## Prepare to move

1. Before you start, define these variables. We've provided an example for each.

    **Variable** | **Details** | **Example**
    --- | ---
    $subId | ID for subscription containing the maintenance configurations | "our-subscription-ID"
    $rsrcGroupName | Resource group name (Azure VM) | "VMResourceGroup"
    $vmName | VM resource name |  "myVM"
    $adhRsrcGroupName |  Resource group (Dedicated hosts) | "HostResourceGroup"
    $adh | Dedicated host name | "myHost"
    $adhParentName | Parent resource name | "HostGroup"
    
2. To retrieve the maintenance configurations using the PowerShell [Get-AZConfigurationAssignment](/powershell/module/az.maintenance/get-azconfigurationassignment) command:

    - For Azure Dedicated Hosts, run:
        ```
        Get-AzConfigurationAssignment -ResourceGroupName $adhRsrcGroupName -ResourceName $adh -ResourceType hosts -ProviderName Microsoft.Compute -ResourceParentName $adhParentName -ResourceParentType hostGroups | Format-Table Name
        ```

    - For Azure VMs, run:

        ```
        Get-AzConfigurationAssignment -ResourceGroupName $rgName -ResourceName $vmName -ProviderName Microsoft.Compute -ResourceType virtualMachines | Format-Table Name
        ```
3. To retrieve the maintenance configurations using the CLI [az maintenance assignment](/cli/azure/maintenance/assignment) command:

    - For Azure Dedicated Hosts:

        ```
        az maintenance assignment list --subscription $subId --resource-group $adhRsrcGroupName --resource-name $adh --resource-type hosts --provider-name Microsoft.Compute --resource-parent-name $adhParentName --resource-parent-type hostGroups --query "[].{HostResourceGroup:resourceGroup,ConfigName:name}" --output table
        ```

    - For Azure VMs:

        ```
        az maintenance assignment list --subscription $subId --provider-name Microsoft.Compute --resource-group $rsrcGroupName --resource-name $vmName --resource-type virtualMachines --query "[].{HostResourceGroup:resourceGroup, ConfigName:name}" --output table
        ```


## Move 

1. [Follow these instructions](../site-recovery/azure-to-azure-tutorial-migrate.md?toc=/azure/virtual-machines/windows/toc.json&bc=/azure/virtual-machines/windows/breadcrumb/toc.json) to move the Azure VMs to the new region.
2. After the resources are moved, reapply maintenance configurations to the resources in the new region as appropriate, depending on whether you moved the maintenance configurations. You can apply a maintenance configuration to a resource using [PowerShell](../virtual-machines/maintenance-control-powershell.md) or [CLI](../virtual-machines/maintenance-control-cli.md).


## Verify the move

Verify resources in the new region, and verify associated configurations for the resources in the new region. 

## Clean up source resources

After the move, consider deleting the moved resources in the source region.


## Next steps

Follow [these instructions](move-region-maintenance-configuration.md) if you need to move maintenance configurations. 
