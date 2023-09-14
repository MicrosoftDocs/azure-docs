---
title: Move Azure single instance Virtual Machines from regional to zonal availability zones using PowerShell
description: Move single instance Azure virtual machines from a regional configuration to a target Availability Zone within the same Azure region using PowerShell.
author: ankitaduttaMSFT
ms.service: virtual-machines
ms.topic: tutorial
ms.date: 08/10/2023
ms.author: ankitadutta
---

# Move a virtual machine in an availability zone using Azure PowerShell

This article details using Azure PowerShell to move Azure single instance VMs from regional to zonal availability zones. An [availability zone](../availability-zones/az-overview.md) is a physically separate zone in an Azure region. Use availability zones to protect your apps and data from an unlikely failure or loss of an entire datacenter.

To use an availability zone, create your virtual machine in a [supported Azure region](../availability-zones/az-region.md).

In this tutorial, you learn how to:

* Move Azure resources to a different Azure region

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario and use default options.

## Prerequisites

Verify the following requirements:

| Requirement | Description |
| --- | --- |
| **Subscription permissions** | Check you have *Owner* access on the subscription containing the resources that you want to move<br/><br/> **Why do I need Owner access?** The first time you add a resource for a  specific source and destination pair in an Azure subscription, Resource Mover creates a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) (formerly known as Managed Service Identify (MSI)) that's trusted by the subscription. To create the identity, and to assign it the required role (Contributor or User Access administrator in the source subscription), the account you use to add resources needs *Owner* permissions on the subscription. [Learn more](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles) about Azure roles. |
| **VM support** |  Review supported regions. <br><br>  - Check supported [compute], [storage], and [networking] settings.|
| **SQL support** | If you want to move SQL resources, review the [SQL requirements list].|
| **Destination subscription** | The subscription in the destination region needs enough quota to create the resources you're moving in the target region. If it doesn't have a quota, [request additional limits](../azure-resource-manager/management/azure-subscription-service-limits.md).|
| **Destination region charges** | Verify pricing and charges associated with the target region to which you're moving VMs. Use the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to help you. |
 
### Review PowerShell requirements

Most move resources operations are the same whether using the Azure portal or PowerShell, with a couple of exceptions.

| Operation | Portal | PowerShell |
| --- | --- | --- |
| Create a move collection | A move collection (a list of all the regional VMs you're moving) is created automatically. Required identity permissions are assigned in the backend by the portal. | You use PowerShell cmdlets to: <br> - Assign a managed identity to the collection.  <br> - Add regional VMs to the collection. |
| Resource move operations | Validate steps validates the User setting changes. Initiate Move starts the move process and creates a copy of source VM in the target zone and finalizes the move of the newly created VM in the target zone. | PowerShell cmdlets to: <br> - Resolve dependencies <br> - Perform the move <br> - Commit the move | 

### Sample values

We're using these values in our script examples:

| Setting | Value | 
| --- | --- |
| Subscription ID | subscription-id |
| Move Region | East US |
| Resource group (holding metadata for move collection) | RegionToZone-DemoMCRG |
| Move collection name | RegionToZone-DemoMC |
| Location of move collection | eastus2euap |
| IdentityType | SystemAssigned |
| VM name | myVM |
| Move Type | RegionToZone |
| VM Resource ID | xxx |

## Sign in to Azure

Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

```powershell-interactive
Connect-AzAccount –Subscription "<subscription-id>"
```

## Set up the move collection

The MoveCollection object stores metadata and configuration information about the resources you want to move. To set up a move collection, you do the following:

- Create a resource group for the move collection.
- Register the service provider to the subscription, so that the MoveCollection resource can be created.
- Create the MoveCollection object with managed identity. For the MoveCollection object to access the subscription in which the Resource Mover service is located, it needs a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) (formerly known as Managed Service Identity (MSI)) that's trusted by the subscription.
- Grant access to the Resource Mover subscription for the managed identity.

## Create the resource group

Create a resource group for the move collection metadata and configuration information with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

```powershell-interactive
New-AzResourceGroup -Name "RegionToZone-DemoMCRG" -Location "EastUS"
```

**Output**:
The output shows that the managed disk is in the same availability zone as the VM:

```powershell
ResourceGroupName  : RegionToZone-DemoMCR
Location           : eastus
ProvisioningState  : Succeeded
Tags               : 
                    Name      Value
                    ----      -----
                    Created    20230908

ResourceId         : /subscriptions/<Subscription id>/resourceGroups/RegionToZone-DemoMCRG

```

## Register the resource provider

1. Register the resource provider Microsoft.Migrate, so that the MoveCollection resource can be created, as follows:

    ```azurepowershell-interactive
    Register-AzResourceProvider -ProviderNamespace Microsoft.Migrate
    ```

2. Wait for registration:

    ```azurepowershell-interactive
    While(((Get-AzResourceProvider -ProviderNamespace Microsoft.Migrate)| where {$_.RegistrationState -eq "Registered" -and $_.ResourceTypes.ResourceTypeName -eq "moveCollections"}|measure).Count -eq 0)
    {
        Start-Sleep -Seconds 5
        Write-Output "Waiting for registration to complete."
    }
    ```

## Create a MoveCollection object

Create a MoveCollection object, and assign a managed identity to it, as follows:

```azurepowershell-interactive
New-AzResourceMoverMoveCollection -Name "RegionToZone-DemoMC"  -ResourceGroupName "RegionToZone-DemoMCRG" -MoveRegion "eastus" -Location "eastus2euap" -IdentityType "SystemAssigned" -MoveType "RegionToZone"
```

**Output**:

:::image type="content" source="./media/tutorial-move-region-powershell/output-move-collection.png" alt-text="Output text after creating move collection":::


## Grant access to the managed identity

Grant the managed identity access to the Resource Mover subscription as follows. You must be the subscription owner.

1. Retrieve identity details from the MoveCollection object.

    ```azurepowershell-interactive
    $moveCollection = Get-AzResourceMoverMoveCollection -Name "RegionToZone-DemoMC" -ResourceGroupName "RegionToZone-DemoMCRG"
    $identityPrincipalId = $moveCollection.IdentityPrincipalId
    ```

2. Assign the required roles to the identity so Azure Resource Mover can access your subscription to help move resources.

    ```azurepowershell-interactive
    New-AzRoleAssignment -ObjectId $identityPrincipalId -RoleDefinitionName Contributor -Scope "/subscriptions/<subscription-id>""

    New-AzRoleAssignment -ObjectId $identityPrincipalId -RoleDefinitionName "User Access Administrator" -Scope "/subscriptions/<subscription-id>"
    ```

## Add regional VMs to the move collection

Retrieve the IDs for existing source resources you want to move. Create the destination resource settings object, then add resources to the move collection.

> [!NOTE]
> Resources added to a move collection must be in the same subscription, but can be in different resource groups.

Add resources as follows:

1. Get the source resource ID:

    ```azurepowershell-interactive
    Add-AzResourceMoverMoveResource -ResourceGroupName "RegionToZone-DemoMCRG" -MoveCollectionName "RegionToZone-DemoMC" -SourceId "/subscriptions/<Subscription-id>/resourcegroups/PS-demo-RegionToZone-RG/providers/Microsoft.Compute/virtualMachines/RegionToZone-demoSourceVm" -Name "demoVM-MoveResource" -ResourceSetting $targetResourceSettingsObj
    ```

    **Output**
    :::image type="content" source="./media/tutorial-move-region-powershell/output-retrieve-resource.png" alt-text="Output text after retrieving the resource ID":::

  
**Modify settings as follows:**

1. Retrieve the move resource for which you want to edit properties. For example, to retrieve a VM run:

    ```azurepowershell-interactive
    $moveResourceObj = Get-AzResourceMoverMoveResource -MoveCollectionName " RegionToZone-DemoMCRG " -ResourceGroupName " RegionToZone-DemoMC " -Name "PSDemoVM"
    ``````

2. Copy the resource setting to a target resource setting object.

    ```azurepowershell-interactive
    $TargetResourceSettingObj = $moveResourceObj.ResourceSetting
    ```

3. Set the parameter in the target resource setting object. For example, to change the name of the destination VM:

    ```azurepowershell-interactive
    $TargetResourceSettingObj.TargetResourceName="PSDemoVM-target"
    ```
4. Update the move resource destination settings. In this example, we change the name of the VM from PSDemoVM to PSDemoVMTarget.

    ```azurepowershell-interactive
    Update-AzResourceMoverMoveResource -ResourceGroupName " RegionToZone-DemoMCRG " -MoveCollectionName " RegionToZone-DemoMC -SourceId "/subscriptions/<Subscription-d>/resourceGroups/PSDemoRM/providers/Microsoft.Compute/virtualMachines/PSDemoVM" -Name "PSDemoVM" -ResourceSetting $TargetResourceSettingObj
    ```
    
    **Output**
        :::image type="content" source="./media/tutorial-move-region-powershell/output-retrieve-resource.png" alt-text="Output text after retrieving the resource ID":::


## Resolve dependencies

Check whether the regional VMs you added have any dependencies on other resources, and add as needed.

1. Resolve dependencies as follows:
    ```azurepowershell-interactive
    Resolve-AzResourceMoverMoveCollectionDependency -ResourceGroupName "RegionToZone-DemoMCRG" -MoveCollectionName "RegionToZone-DemoMC"
    ``````
    
    **Output (when dependencies exist)**

       :::image type="content" source="./media/tutorial-move-region-powershell/output-retrieve-resource.png" alt-text="Output text after retrieving the resource ID":::

    **Note:**
     - If you want to get a list of resources added to the move collection, you can call

            ```
            $list = Get-AzResourceMoverMoveResource -ResourceGroupName "RegionToZone-DemoMCRG" -MoveCollectionName "RegionToZone-DemoMC" $list.Name
            ```
            **Output**
            :::image type="content" source="./media/tutorial-move-region-powershell/output-retrieve-resource.png" alt-text="Output text after retrieving the resource ID":::
     
     - If for any reason you want to remove resources from the resource collection, follow the instructions in this article.
    

## Initiate move of VM resources

```azurepowershell
Invoke-AzResourceMoverInitiateMove -ResourceGroupName "RegionToZone-DemoMCRG" -MoveCollectionName "RegionToZone-DemoMC" -MoveResource $("demoVM-MoveResource") -MoveResourceInputType "MoveResourceId"
```

**Output**

:::image type="content" source="./media/tutorial-move-region-powershell/output-retrieve-resource.png" alt-text="Output text after retrieving the resource ID":::

## Commit

After the initial move, you can decide whether you want to commit the move or discard it. Commit completes the move to the target region. After committing, a source regional VM will be in a state of *Delete source pending* and you can decide if you want to delete it.

**To commit the move:**

1. Commit the move as follows:

    ```
    Invoke-AzResourceMover-VMZonalMoveCommit -ResourceGroupName "RG-MoveCollection-demoRMS" -MoveCollectionName "PS-centralus-westcentralus-demoRMS" -MoveResource $('psdemovm111', 'PSDemoRM-vnet','PSDemoVM-nsg', ‘PSDemoVM’) -MoveResourceInputType "MoveResourceId"
    ```

    **Output**
    :::image type="content" source="./media/tutorial-move-region-powershell/output-retrieve-resource.png" alt-text="Output text after retrieving the resource ID":::

2. Verify that all regional VMs have moved to the target region:
    
        ```
        Get-AzResourceMover-VMZonalMoveMoveResource -ResourceGroupName "RG-MoveCollection-demoRMS " -MoveCollectionName "PS-centralus-westcentralus-demoRMS"
        ```
    
All resources are now in a *Delete Source Pending* state in the target region.

## Delete source regional VMs

After committing the move, and verifying that resources work as expected in the target region, you can delete each source resource in the Azure portal, using PowerShell, or using [Azure CLI](../azure-resource-manager/management/manage-resource-groups-cli.md#delete-resources). 


## Next steps

- Learn how to move single instance Azure VMs from regional to zonal configuration via [portal](./move-virtual-macines-regional-zonal-portal.md).