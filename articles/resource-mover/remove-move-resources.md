---
title: Remove resources from a move collection in Azure Resource Mover
description: Learn how to remove resources from a move collection in Azure Resource Mover.
manager: evansma
author: ankitaduttaMSFT
ms.service: resource-mover
ms.topic: how-to
ms.date: 10/30/2023
ms.author: ankitadutta
ms.custom:
#Customer intent: As an Azure admin,  I want remove resources I've added to a move collection.
---
# Manage move collections and resource groups

This article describes how to remove resources from a move collection, or remove a move collection/resource group, in [Azure Resource Mover](overview.md). Move collections are used when moving Azure resources between Azure regions.

## Remove a resource on portal

You can remove resources in a move collection, in the Resource Mover portal as follows:

1. On the **Azure Resource Mover** > **Across regions** pane, select all the resources you want to remove from the collection, and select **Remove**. 

    :::image type="content" source="./media/remove-move-resources/across-region.png" alt-text="Screenshot of the **Across regions** pane." lightbox="./media/remove-move-resources/across-region.png" :::

    :::image type="content" source="./media/remove-move-resources/portal-select-resources.png" alt-text="Screenshot of the Button to select to remove." :::

2. In **Remove resources**, select **Remove**.

    :::image type="content" source="./media/remove-move-resources/remove-portal.png" alt-text="Screenshot of the Button to select to remove resources from a move collection." :::

## Remove a move collection or a resource group on portal

You can remove a move collection/resource group in the portal. Removing a move collection/resource group deletes all the resources in the collection. 

To remove a move collection/resource group, follow these steps:

1. Follow [these instructions](#remove-a-resource-on-portal) to remove resources from the collection. If you're removing a resource group, make sure it doesn't contain any resources.
2. Delete the move collection or resource group.  

## Remove a resource using PowerShell

Using PowerShell cmdlets you can remove a single resource from a MoveCollection, or remove multiple resources.

### Remove a single resource

Remove a resource (in our example the virtual network *psdemorm-vnet*) as follows:

```azurepowershell-interactive
# Remove a resource using the resource ID
Remove-AzResourceMoverMoveResource -ResourceGroupName "RG-MoveCollection-demoRMS" -MoveCollectionName "PS-centralus-westcentralus-demoRMS" -Name "psdemorm-vnet"
```
**Output after running cmdlet**

:::image type="content" source="./media/remove-move-resources/powershell-remove-single-resource.png" alt-text="Screenshot of output text after removing a resource from a move collection." :::

### Remove multiple resources

Remove multiple resources as follows:

1. Validate dependencies:

    ```azurepowershell-interactive
    $resp = Invoke-AzResourceMoverBulkRemove -ResourceGroupName "RG-MoveCollection-demoRMS" -MoveCollectionName "PS-centralus-westcentralus-demoRMS"  -MoveResource $('psdemorm-vnet') -ValidateOnly
    ```

    **Output after running cmdlet**

    :::image type="content" source="./media/remove-move-resources/remove-multiple-validate-dependencies.png" alt-text="Screenshot of output text after removing multiple resources from a move collection." :::

2. Retrieve the dependent resources that need to be removed (along with our example virtual network psdemorm-vnet):

    ```azurepowershell-interactive
    $resp.AdditionalInfo[0].InfoMoveResource
    ```

    **Output after running cmdlet**

    :::image type="content" source="./media/remove-move-resources/remove-multiple-get-dependencies.png" alt-text="Screenshot of output text after retrieving dependent resources that need to be removed." :::


3. Remove all resources, along with the virtual network:

    
    ```azurepowershell-interactive
    Invoke-AzResourceMoverBulkRemove -ResourceGroupName "RG-MoveCollection-demoRMS" -MoveCollectionName "PS-centralus-westcentralus-demoRMS"  -MoveResource $('PSDemoVM','psdemovm111', 'PSDemoRM-vnet','PSDemoVM-nsg')
    ```

    **Output after running cmdlet**

    :::image type="content" source="./media/remove-move-resources/remove-multiple-all.png" alt-text="Screenshot of output text after removing all resources from a move collection." :::


## Remove a collection using PowerShell

Remove an entire move collection from the subscription, as follows:

1. Follow [these instructions](#remove-a-resource-using-powershell) to remove resources in the collection using PowerShell.
2. Then remove a collection as follows:

    ```azurepowershell-interactive
    Remove-AzResourceMoverMoveCollection -ResourceGroupName "RG-MoveCollection-demoRMS" -MoveCollectionName "PS-centralus-westcentralus-demoRMS"
    ```

    **Output after running cmdlet**
    
    :::image type="content" source="./media/remove-move-resources/remove-collection.png" alt-text="Screenshot of output text after removing a move collection." :::

> [!NOTE]
> For removing resources in bulk where the dependency tree is not identified, use [Invoke-AzResourceMoverBulkRemove (Az.ResourceMover)](/powershell/module/az.resourcemover/invoke-azresourcemoverbulkremove). 

## VM resource state after removing

What happens when you remove a VM resource from a move collection depends on the resource state, as summarized in the table.

###  Remove VM state

**Resource state** | **VM** | **Networking**
--- | --- | --- 
**Added to move collection** | Delete from move collection. | Delete from move collection. 
**Dependencies resolved/prepare pending** | Delete from move collection  | Delete from move collection. 
**Prepare in progress**<br/> (or any other state in progress) | Delete operation fails with error.  | Delete operation fails with error.
**Prepare failed** | Delete from the move collection.<br/>Delete anything created in the target region, including replica disks. <br/><br/> Infrastructure resources created during the move need to be deleted manually. | Delete from the move collection.  
**Initiate move pending** | Delete from move collection.<br/><br/> Delete anything created in the target region, including VM, replica disks etc.  <br/><br/> Infrastructure resources created during the move need to be deleted manually. | Delete from move collection.
**Initiate move failed** | Delete from move collection.<br/><br/> Delete anything created in the target region, including VM, replica disks etc.  <br/><br/> Infrastructure resources created during the move need to be deleted manually. | Delete from move collection.
**Commit pending** | We recommend that you discard the move so that the target resources are deleted first.<br/><br/> The resource goes back to the **Initiate move pending** state, and you can continue from there. | We recommend that you discard the move so that the target resources are deleted first.<br/><br/> The resource goes back to the **Initiate move pending** state, and you can continue from there. 
**Commit failed** | We recommend that you discard the  so that the target resources are deleted first.<br/><br/> The resource goes back to the **Initiate move pending** state, and you can continue from there. | We recommend that you discard the move so that the target resources are deleted first.<br/><br/> The resource goes back to the **Initiate move pending** state, and you can continue from there.
**Discard completed** | The resource goes back to the **Initiate move pending** state.<br/><br/> It's deleted from the move collection, along with anything created at target - VM, replica disks, vault etc.  <br/><br/> Infrastructure resources created during the move need to be deleted manually. <br/><br/> Infrastructure resources created during the move need to be deleted manually. |  The resource goes back to the **Initiate move pending** state.<br/><br/> It's deleted from the move collection.
**Discard failed** | We recommend that you discard the moves so that the target resources are deleted first.<br/><br/> After that, the resource goes back to the **Initiate move pending** state, and you can continue from there. | We recommend that you discard the moves so that the target resources are deleted first.<br/><br/> After that, the resource goes back to the **Initiate move pending** state, and you can continue from there.
**Delete source pending** | Deleted from the move collection.<br/><br/> It doesn't delete anything created in the target region.  | Deleted from the move collection.<br/><br/> It doesn't delete anything created in the target region.
**Delete source failed** | Deleted from the move collection.<br/><br/> It doesn't delete anything created in the target region. | Deleted from the move collection.<br/><br/> It doesn't delete anything created in the target region.
**Move completed** | Deleted from the move collection.<br/><br/> It doesn't delete anything created in the target or source region. |  Deleted from the move collection.<br/><br/> It doesn't delete anything created in the target or source region.

## SQL resource state after removing

What happens when you remove an Azure SQL resource from a move collection depends on the resource state, as summarized in the table.

**Resource state** | **SQL** 
--- | --- 
**Added to move collection** | Delete from move collection. 
**Dependencies resolved/prepare pending** | Delete from move collection 
**Prepare in progress**<br/> (or any other state in progress)  | Delete operation fails with error. 
**Prepare failed** | Delete from move collection<br/><br/>Delete anything created in the target region. 
**Initiate move pending** |  Delete from move collection<br/><br/>Delete anything created in the target region. The SQL database exists at this point and will be deleted. 
**Initiate move failed** | Delete from move collection<br/><br/>Delete anything created in the target region. The SQL database exists at this point and must be deleted. 
**Commit pending** | We recommend that you discard the move so that the target resources are deleted first.<br/><br/> The resource goes back to the **Initiate move pending** state, and you can continue from there.
**Commit failed** | We recommend that you discard the move so that the target resources are deleted first.<br/><br/> The resource goes back to the **Initiate move pending** state, and you can continue from there. 
**Discard completed** |  The resource goes back to the **Initiate move pending** state.<br/><br/> It's deleted from the move collection, along with anything created at target, including SQL databases. 
**Discard failed** | We recommend that you discard the moves so that the target resources are deleted first.<br/><br/> After that, the resource goes back to the **Initiate move pending** state, and you can continue from there. 
**Delete source pending** | Deleted from the move collection.<br/><br/> It doesn't delete anything created in the target region. 
**Delete source failed** | Deleted from the move collection.<br/><br/> It doesn't delete anything created in the target region. 
**Move completed** | Deleted from the move collection.<br/><br/> It doesn't delete anything created in the target or source region.

## Next steps

Try [moving a VM](tutorial-move-region-virtual-machines.md) to another region with Resource Mover.
