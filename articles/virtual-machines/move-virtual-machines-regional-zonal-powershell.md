---
title: Move Azure single instance Virtual Machines from regional to zonal availability zones using PowerShell and CLI
description: Move single instance Azure virtual machines from a regional configuration to a target Availability Zone within the same Azure region using PowerShell and CLI.
author: ankitaduttaMSFT
ms.service: virtual-machines
ms.topic: tutorial
ms.date: 09/25/2023
ms.author: ankitadutta
---

# Move a virtual machine in an availability zone using Azure PowerShell and CLI

This article details using Azure PowerShell and CLI cmdlets to move Azure single instance VMs from regional to zonal availability zones. An [availability zone](../availability-zones/az-overview.md) is a physically separate zone in an Azure region. Use availability zones to protect your apps and data from an unlikely failure or loss of an entire data center.

To use an availability zone, create your virtual machine in a [supported Azure region](../availability-zones/az-region.md).

> [!IMPORTANT]
> Regional to zonal move of single instance VM(s) configuration is currently in *Public Preview*.

## Prerequisites

Verify the following requirements:

| Requirement | Description |
| --- | --- |
| **Subscription permissions** | Ensure you have *Owner* access on the subscription containing the resources that you want to move.<br/><br/> [Managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) needs these permissions: <br> - Permission to write or create resources in user subscription, available with the *Contributor role*. <br> - Permission to create role assignments. Typically available with the *Owner* or *User Access Administrator* roles, or with a custom role that has the `Microsoft.Authorization` role assignments or write permission assigned. This permission isn't needed if the data share resource's managed identity is already granted access to the Azure data store. <br> [Learn more](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles) about Azure roles. |
| **VM support** |  [Review](../resource-mover/common-questions.md) the supported regions. <br><br>  - Check supported [compute](../resource-mover/support-matrix-move-region-azure-vm.md#supported-vm-compute-settings), [storage](../resource-mover/support-matrix-move-region-azure-vm.md#supported-vm-storage-settings), and [networking](../resource-mover/support-matrix-move-region-azure-vm.md#supported-vm-networking-settings) settings.|
| **VM health status** | The VMs you want to move must be in a healthy state before attempting the  zonal move. Ensure that all pending reboots and mandatory updates are complete and the Virtual Machine is working and is in a healthy state before attempting the VM zonal move. |


### Review PowerShell and CLI requirements

Most move resources operations are the same whether using the Azure portal or PowerShell or CLI, with a couple of exceptions.

| Operation | Portal | PowerShell/CLI |
| --- | --- | --- |
| **Create a move collection** | A move collection (a list of all the regional VMs that you're moving) is created automatically. Required identity permissions are assigned in the backend by the portal. | You can use [PowerShell cmdlets](/powershell/module/az.resourcemover/?view=azps-10.3.0#resource-mover) or [CLI cmdlets](https://learn.microsoft.com/cli/azure/resource-mover?view=azure-cli-latest) to: <br> - Assign a managed identity to the collection.  <br> - Add regional VMs to the collection. |
| **Resource move operations** | Validate steps and validates the *User* setting changes. **Initiate move** starts the move process and creates a copy of source VM in the target zone. It also finalizes the move of the newly created VM in the target zone. | [PowerShell cmdlets](/powershell/module/az.resourcemover/?view=azps-10.3.0#resource-mover) or [CLI cmdlets](https://learn.microsoft.com/cli/azure/resource-mover?view=azure-cli-latest) to: <br> - Add regional VMs to the collection <br> - Resolve dependencies <br> - Perform the move. <br> - Commit the move. | 

### Sample values

We use these values in our script examples:

| Setting | Value | 
| --- | --- |
| Subscription ID | subscription-id |
| Move Region | East US |
| Resource group (holding metadata for move collection) | RegionToZone-DemoMCRG |
| Move collection name | RegionToZone-DemoMC |
| Location of the move collection | eastus2euap |
| IdentityType | SystemAssigned |
| VM name | demoVM-MoveResource  |
| Move Type | RegionToZone |

## Sign in to Azure

Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

```powershell-interactive
Connect-AzAccount –Subscription "<subscription-id>"
```

## Set up the move collection

The MoveCollection object stores metadata and configuration information about the resources you want to move. To set up a move collection, do the following:

- Create a resource group for the move collection.
- Register the service provider to the subscription, so that the MoveCollection resource can be created.
- Create the MoveCollection object with managed identity. For the MoveCollection object to access the subscription in which the Resource Mover service is located, it needs a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) (formerly known as Managed Service Identity (MSI)) that's trusted by the subscription.
- Grant access to the Resource Mover subscription for the managed identity.

## Create the resource group

Use the following cmdlet to create a resource group for the move collection metadata and configuration information with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

# [PowerShell](#tab/PowerShell)

```powershell-interactive
New-AzResourceGroup -Name "RegionToZone-DemoMCRG" -Location "EastUS"
```

**Output**:

The output shows that the managed disk is in the same availability zone as the VM:

```powershell
ResourceGroupName : RegionToZone-DemoMCRG
Location          : eastus
ProvisioningState : Succeeded
Tags              :
                    Name     Value
                    =======  ========
                    Created  20230908

ResourceId        : /subscriptions/<Subscription-id>/resourceGroups/RegionToZone-DemoMCRG
```

# [CLI](#tab/CLI)

```azurecli-interactive
az group create --location eastus2 --name clidemo-RG
```

**Output**:

```azurecli
{
  "id": "/subscriptions/e80eb9fa-c996-4435-aa32-5af6f3d3077c/resourceGroups/clidemo-RG",
  "location": "eastus",
  "managedBy": null,
  "name": "clidemo-RG",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": {
    "Created": "20230921"
  },
  "type": "Microsoft.Resources/resourceGroups"
}
```

---

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

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
New-AzResourceMoverMoveCollection -Name "RegionToZone-DemoMC"  -ResourceGroupName "RegionToZone-DemoMCRG" -MoveRegion "eastus" -Location "eastus2euap" -IdentityType "SystemAssigned" -MoveType "RegionToZone"
```

**Output**:

```powershell
Etag                                   Location    Name
----                                   --------    ----
"3a00c441-0000-3400-0000-64fac1b30000" eastus2euap RegionToZone-DemoMC
```

# [CLI](#tab/CLI)

```azurecli-interactive
az resource-mover move-collection create --identity type=SystemAssigned --location eastus2 --move-region uksouth --name cliDemo-zonalMC --resource-group clidemo-RG --move-type RegionToZone
```

**Output**:

```azurecli
{
  "etag": "\"1c00c55a-0000-0200-0000-650c15c40000\"",
  "id": "/subscriptions/e80eb9fa-c996-4435-aa32-5af6f3d3077c/resourceGroups/clidemo-RG/providers/Microsoft.Migrate/moveCollections/cliDemo-zonalMC",
  "identity": {
    "principalId": "45bc279c-3353-4f6a-bb4f-8efb48faba59",
    "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
    "type": "SystemAssigned"
  },
  "location": "eastus2",
  "name": "cliDemo-zonalMC",
  "properties": {
    "moveRegion": "uksouth",
    "moveType": "RegionToZone",
    "provisioningState": "Succeeded",
    "version": "V2"
  },
  "resourceGroup": "clidemo-RG",
  "systemData": {
    "createdAt": "2023-09-21T10:06:58.5788527Z",
    "createdBy": "yashjain@microsoft.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-09-21T10:06:58.5788527Z",
    "lastModifiedBy": "yashjain@microsoft.com",
    "lastModifiedByType": "User"
  },
  "type": "Microsoft.Migrate/moveCollections"
}
```

---

>[!NOTE]
> For Regional to zonal move, the `MoveType` parameter should be set as *RegionToZone* and `MoveRegion` parameter should be set as the location where resources undergoing zonal move reside. Ensure that the parameters `SourceRegion` and `TargetRegion` are not required and should be set to *null*. 

## Grant access to the managed identity

Grant the managed identity access to the Resource Mover subscription as follows. You must be the subscription owner.

1. Retrieve identity details from the MoveCollection object.

    ```azurepowershell-interactive
    $moveCollection = Get-AzResourceMoverMoveCollection -Name "RegionToZone-DemoMC" -ResourceGroupName "RegionToZone-DemoMCRG"
    $identityPrincipalId = $moveCollection.IdentityPrincipalId
    ```

2. Assign the required roles to the identity so Azure Resource Mover can access your subscription to help move resources. Review the list of [required permissions](../resource-mover/common-questions.md#what-managed-identity-permissions-does-resource-mover-need) for the move.

    # [PowerShell](#tab/PowerShell)


    ```azurepowershell-interactive
    New-AzRoleAssignment -ObjectId $identityPrincipalId -RoleDefinitionName Contributor -Scope "/subscriptions/<subscription-id>""
    New-AzRoleAssignment -ObjectId $identityPrincipalId -RoleDefinitionName "User Access Administrator" -Scope "/subscriptions/<subscription-id>"
    ```

    # [CLI](#tab/CLI)

    ```azurecli-interactive
    az role assignment create --assignee-object-id 45bc279c-3353-4f6a-bb4f-8efb48faba59 --assignee-principal-type ServicePrincipal --role Contributor --scope /subscriptions/<Subscription-id>
    az role assignment create --assignee-object-id 45bc279c-3353-4f6a-bb4f-8efb48faba59 --assignee-principal-type ServicePrincipal --role "User Access Administrator" --scope /subscriptions/<Subscription-id>

    ```

    ---

## Add regional VMs to the move collection

Retrieve the IDs for existing source resources that you want to move. Create the destination resource settings object, then add resources to the move collection.

> [!NOTE]
> Resources added to a move collection must be in the same subscription but can be in different resource groups.

1. Create target resource setting object as follows:

    ```azurepowershell-interactive
    $targetResourceSettingsObj = New-Object Microsoft.Azure.PowerShell.Cmdlets.ResourceMover.Models.Api20230801.VirtualMachineResourceSettings
    $targetResourceSettingsObj.ResourceType = "Microsoft.Compute/virtualMachines"
    $targetResourceSettingsObj.TargetResourceName = "RegionToZone-demoTargetVm"
    $targetResourceSettingsObj.TargetAvailabilityZone = "2"
    ```
    
    **Output** <br>

    ```powershell
    ResourceType                      TargetResourceGroupName TargetResourceName        TargetAvailabilitySetId TargetAvailabilityZone TargetVMSize UserManagedIdentity
    ------------                      ----------------------- ------------------        ----------------------- ---------------------- ------------ -------------------
    Microsoft.Compute/virtualMachines                         RegionToZone-demoTargetVm                         2
    ```


1. Add resources

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell-interactive
    Add-AzResourceMoverMoveResource -ResourceGroupName "RegionToZone-DemoMCRG" -MoveCollectionName "RegionToZone-DemoMC" -SourceId "/subscriptions/<Subscription-id>/resourcegroups/PS-demo-RegionToZone-RG/providers/Microsoft.Compute/virtualMachines/RegionToZone-demoSourceVm" -Name "demoVM-MoveResource" -ResourceSetting $targetResourceSettingsObj
    ```

    **Output**

    ```powershell
    DependsOn                         : {}
    DependsOnOverride                 : {}
    ErrorsPropertiesCode              :
    ErrorsPropertiesDetail            :
    ErrorsPropertiesMessage           :
    ErrorsPropertiesTarget            :
    ExistingTargetId                  :
    Id                                : /subscriptions/<Subscription-id>/resourceGroups/RegionToZone-DemoMCRG/providers/Microsoft.Migrate/moveCollections/Re
                                        gionToZone-DemoMC/moveResources/demoVM-MoveResource
    IsResolveRequired                 : False
    JobStatusJobName                  :
    JobStatusJobProgress              :
    MoveStatusErrorsPropertiesCode    : DependencyComputationPending
    MoveStatusErrorsPropertiesDetail  : {}
    MoveStatusErrorsPropertiesMessage : The dependency computation is not completed for resource - /subscriptions/<Subscription-id>/resourcegroups/PS-demo-R
                                        egionToZone-RG/providers/Microsoft.Compute/virtualMachines/RegionToZone-demoSourceVm'.
                                            Possible Causes: Dependency computation is pending for resource.
                                            Recommended Action: Validate dependencies to compute the dependencies.
    
    MoveStatusErrorsPropertiesTarget  :
    MoveStatusMoveState               : MovePending
    Name                              : demoVM-MoveResource
    ProvisioningState                 : Succeeded
    ResourceSetting                   : Microsoft.Azure.PowerShell.Cmdlets.ResourceMover.Models.Api20230801.VirtualMachineResourceSettings
    SourceId                          : /subscriptions/<Subscription-id>/resourcegroups/PS-demo-RegionToZone-RG/providers/Microsoft.Compute/virtualMachines/
                                        RegionToZone-demoSourceVm
    SourceResourceSetting             : Microsoft.Azure.PowerShell.Cmdlets.ResourceMover.Models.Api20230801.VirtualMachineResourceSettings
    SystemDataCreatedAt               : 9/8/2023 6:48:11 AM
    SystemDataCreatedBy               : xxxxx@microsoft.com
    SystemDataCreatedByType           : User
    SystemDataLastModifiedAt          : 9/8/2023 6:48:11 AM
    SystemDataLastModifiedBy          : xxxxx@microsoft.com
    SystemDataLastModifiedByType      : User
    TargetId                          :
    Type                              :
    ```

    # [CLI](#tab/CLI)

    ```azurecli-interactive
    az resource-mover move-resource add --resource-group clidemo-RG --move-collection-name cliDemo-zonalMC --name vm-demoMR --source-id "/subscriptions/e80eb9fa-c996-4435-aa32-5af6f3d3077c/resourceGroups/regionToZone-bugBash/providers/Microsoft.Compute/virtualMachines/regionToZone-test-LRS" --resource-settings '{ "resourceType": "Microsoft.Compute/virtualMachines", "targetResourceName": "regionToZone-test-LRS", "targetAvailabilityZone": "2", "targetVmSize": "Standard_B2s" }'
    ```
    **Output**

    ```azurecli
    {
      "id": "/subscriptions/e80eb9fa-c996-4435-aa32-5af6f3d3077c/resourceGroups/clidemo-RG/providers/Microsoft.Migrate/moveCollections/cliDemo-zonalMC/moveResources/vm-demoMR",
      "name": "vm-demoMR",
      "properties": {
        "dependsOn": [],
        "dependsOnOverrides": [],
        "isResolveRequired": false,
        "moveStatus": {
          "errors": {
            "properties": {
              "code": "DependencyComputationPending",
              "details": [],
              "message": "The dependency computation is not completed for resource - /subscriptions/e80eb9fa-c996-4435-aa32-5af6f3d3077c/resourceGroups/regionToZone-bugBash/providers/Microsoft.Compute/virtualMachines/regionToZone-test-LRS'.\n    Possible Causes: Dependency computation is pending for resource.\n    Recommended Action: Validate dependencies to compute the dependencies.\n    "
            }
          },
          "moveState": "MovePending"
        },
        "provisioningState": "Succeeded",
        "resourceSettings": {
          "resourceType": "Microsoft.Compute/virtualMachines",
          "targetAvailabilityZone": "2",
          "targetResourceName": "regionToZone-test-LRS",
          "targetVmSize": "Standard_B2s"
        },
        "sourceId": "/subscriptions/e80eb9fa-c996-4435-aa32-5af6f3d3077c/resourceGroups/regionToZone-bugBash/providers/Microsoft.Compute/virtualMachines/regionToZone-test-LRS",
        "sourceResourceSettings": {
          "resourceType": "Microsoft.Compute/virtualMachines",
          "tags": {
            "azsecpack": "nonprod",
            "platformsettings.host_environment.service.platform_optedin_for_rootcerts": "true"
          },
          "targetResourceName": "regionToZone-test-LRS",
          "targetVmSize": "Standard_B2s",
          "userManagedIdentities": [
            "/subscriptions/e80eb9fa-c996-4435-aa32-5af6f3d3077c/resourceGroups/AzSecPackAutoConfigRG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/AzSecPackAutoConfigUA-uksouth"
          ]
        }
      },
      "resourceGroup": "clidemo-RG",
      "systemData": {
        "createdAt": "2023-09-21T10:35:03.2036685Z",
        "createdBy": "yashjain@microsoft.com",
        "createdByType": "User",
        "lastModifiedAt": "2023-09-21T10:35:03.2036685Z",
        "lastModifiedBy": "yashjain@microsoft.com",
        "lastModifiedByType": "User"
      }
    }
    ```
    
    ---
  
## Modify settings

You can modify destination settings when moving Azure VMs and associated resources. We recommend that you only change destination settings before you validate the move collection.

**Settings that you can modify are:**

- **Virtual machine settings:** Resource group, VM name, VM availability zone, VM SKU, VM key vault, and Disk encryption set.
- **Networking resource settings:** For Network interfaces, virtual networks (VNets/), and network security groups/network interfaces, you can either:
    - Use an existing networking resource in the destination region.
    - Create a new resource with a different name.
- **Public IP/Load Balancer:** SKU and Zone


Modify settings as follows:

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


## Resolve dependencies

Check whether the regional VMs you added have any dependencies on other resources, and add as needed.

1. Resolve dependencies as follows:
    
    # [PowerShell](#tab/PowerShell)
        
    ```
    Resolve-AzResourceMoverMoveCollectionDependency -ResourceGroupName "RegionToZone-DemoMCRG" -MoveCollectionName "RegionToZone-DemoMC"
    ```
        
    **Output (when dependencies exist)**
    
    ```powershell
    AdditionalInfo :
    Code           :
    Detail         :
    EndTime        : 9/8/2023 6:52:14 AM
    Id             : /subscriptions/<Subscription-id>/resourceGroups/RegionToZone-DemoMCRG/providers/Microsoft.Migrate/moveCollections/RegionToZone-DemoMC/o
                     perations/bc68354b-ec1f-44cb-92ab-fb3b4ad90229
    Message        :
    Name           : bc68354b-ec1f-44cb-92ab-fb3b4ad90229
    Property       : Microsoft.Azure.PowerShell.Cmdlets.ResourceMover.Models.Any
    StartTime      : 9/8/2023 6:51:50 AM
    Status         : Succeeded
    ```
    
    # [CLI](#tab/CLI)
    
    ```azurecli-interactive
    az resource-mover move-collection resolve-dependency --name cliDemo-zonalMC --resource-group clidemo-RG 
    ```
    **Output (when dependencies exist)**
    
    ```azurecli
    {
      "endTime": "9/21/2023 10:46:30 AM",
      "id": "/subscriptions/e80eb9fa-c996-4435-aa32-5af6f3d3077c/resourceGroups/clidemo-RG/providers/Microsoft.Migrate/moveCollections/cliDemo-zonalMC/operations/9bd337d0-90d5-4537-bdab-a7c0cd33e6d5",
      "name": "9bd337d0-90d5-4537-bdab-a7c0cd33e6d5",
      "resourceGroup": "clidemo-RG",
      "startTime": "9/21/2023 10:46:17 AM",
      "status": "Succeeded"
    }
    ```
    
    ---


1. To get a list of resources added to the move collection:
    # [PowerShell](#tab/PowerShell)

    ```azurepowershell-interactive
    $list = Get-AzResourceMoverMoveResource -ResourceGroupName "RegionToZone-DemoMCRG" -MoveCollectionName "RegionToZone-DemoMC" $list.Name
    ```

    **Output:**

    ```powershell
    demoVM-MoveResource
    mr_regiontozone-demosourcevm661_d6f18900-3b87-4fb5-9bdf-12da2f9fb185
    mr_regiontozone-demosourcevm-vnet_d8536bf5-2d5f-4778-9650-32d0570bc41a
    mr_regiontozone-demosourcevm-ip_6af03f1f-eae8-4541-83f5-97a2506cfc3e
    mr_regiontozone-demosourcevm-nsg_98d68420-d7ff-4e2d-b758-25a6df80fca7
    mr_nrms-timkbo3hy3nnmregiontozone-demosourcevm-vnet_f474c880-4823-4ed3-b761-96df6500f6a3
    ```

    # [CLI](#tab/CLI)
    
    ```azurecli-interactive
    az resource-mover move-resource list --move-collection-name cliDemo-zonalMC --resource-group clidemo-RG
    ```
    ---

1. To remove resources from the resource collection, follow these [instructions](../resource-mover/remove-move-resources.md).
    

## Initiate move of VM resources

# [PowerShell](#tab/PowerShell)

```azurepowershell
Invoke-AzResourceMoverInitiateMove -ResourceGroupName "RegionToZone-DemoMCRG" -MoveCollectionName "RegionToZone-DemoMC" -MoveResource $("demoVM-MoveResource") -MoveResourceInputType "MoveResourceId"
```

**Output**

```powershell
AdditionalInfo :
Code           :
Detail         :
EndTime        : 9/8/2023 7:07:58 AM
Id             : /subscriptions/<Subscription-id>/resourceGroups/RegionToZone-DemoMCRG/providers/Microsoft.Migrate/moveCollections/RegionToZone-DemoMC/o
                 perations/d3e06ac3-a961-4045-8301-aee7f6911160
Message        :
Name           : d3e06ac3-a961-4045-8301-aee7f6911160
Property       : Microsoft.Azure.PowerShell.Cmdlets.ResourceMover.Models.Any
StartTime      : 9/8/2023 7:01:31 AM
Status         : Succeeded
```

# [CLI](#tab/CLI)

```azurecli-interactive
az resource-mover move-collection initiate-move --move-resources "/subscriptions/e80eb9fa-c996-4435-aa32-5af6f3d3077c/resourceGroups/clidemo-RG/providers/Microsoft.Migrate/moveCollections/cliDemo-zonalMC/moveResources/vm-demoMR" --validate-only false --name cliDemo-zonalMC --resource-group clidemo-RG
```

**Output**

```azurecli
{
  "endTime": "9/21/2023 11:35:43 AM",
  "id": "/subscriptions/e80eb9fa-c996-4435-aa32-5af6f3d3077c/resourceGroups/clidemo-RG/providers/Microsoft.Migrate/moveCollections/cliDemo-zonalMC/operations/e1086818-b38b-4332-ac69-171a2958390c",
  "name": "e1086818-b38b-4332-ac69-171a2958390c",
  "resourceGroup": "clidemo-RG",
  "startTime": "9/21/2023 11:31:28 AM",
  "status": "Succeeded"
}
```

---

## Commit

After the initial move, you must commit the move or discard it. **Commit** completes the move to the target region. 

**Commit the move as follows:**

  # [PowerShell](#tab/PowerShell)

  ```
  Invoke-AzResourceMover-VMZonalMoveCommit -ResourceGroupName "RG-MoveCollection-demoRMS" -MoveCollectionName "PS-centralus-westcentralus-demoRMS" -MoveResource $('psdemovm111', 'PSDemoRM-vnet','PSDemoVM-nsg', ‘PSDemoVM’) -MoveResourceInputType "MoveResourceId"
  ```

  **Output**:

  ```powershell
  AdditionalInfo : 
  Code           : 
  Detail         : 
  EndTime        : 9/22/2023 5:26:55 AM 
  Id             : /subscriptions/e80eb9fa-c996-4435-aa32-5af6f3d3077c/resourceGroups/RegionToZone-DemoMCRG/providers/Microsoft.Migrate/moveCollections/RegionToZone-DemoMC/operations/35dd1d93-ba70-4dc9-a17f-7d8ba48678d8 
  Message        : 
  Name           : 35dd1d93-ba70-4dc9-a17f-7d8ba48678d8 
  Property       : Microsoft.Azure.PowerShell.Cmdlets.ResourceMover.Models.Any 
  StartTime      : 9/22/2023 5:26:54 AM 
  Status         : Succeeded 
  ```    

  # [CLI](#tab/CLI)

  ```azurecli-interactive
  az resource-mover move-collection commit --move-resources "/subscriptions/<Subscription-id>/resourceGroups/clidemo-RG/providers/Microsoft.Migrate/moveCollections/cliDemo-zonalMC/moveResources/vm-demoMR" --validate-only false --name cliDemo-zonalMC --resource-group clidemo-RG
  ``` 

  **Output**:

  ```azurecli
  {
    "endTime": "9/21/2023 11:47:14 AM",
    "id": "/subscriptions/e80eb9fa-c996-4435-aa32-5af6f3d3077c/resourceGroups/clidemo-RG/providers/Microsoft.Migrate/moveCollections/cliDemo-zonalMC/operations/34c0d405-672f-431a-8879-582c48940b4a",
    "name": "34c0d405-672f-431a-8879-582c48940b4a",
    "resourceGroup": "clidemo-RG",
    "startTime": "9/21/2023 11:45:13 AM",
    "status": "Succeeded"
  }
  ```

  ---


## Delete source regional VMs

After you commit the move and verify that the resources work as expected in the target region, you can delete each source resource using:

- [Azure portal](../azure-resource-manager/management/manage-resources-portal.md#delete-resources)
- [PowerShell](../azure-resource-manager/management/manage-resources-powershell.md#delete-resources)
- [Azure CLI](../azure-resource-manager/management/manage-resource-groups-cli.md#delete-resource-groups)

## Next steps

Learn how to move single instance Azure VMs from regional to zonal configuration via [portal](./move-virtual-machines-regional-zonal-portal.md).
