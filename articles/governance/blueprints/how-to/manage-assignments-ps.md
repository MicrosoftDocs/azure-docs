---
title: How to manage assignments with PowerShell
description: Learn how to manage blueprint assignments with the official Azure Blueprints PowerShell module, Az.Blueprint.
author: DCtheGeek
ms.author: dacoulte
ms.date: 03/14/2019
ms.topic: conceptual
ms.service: blueprints
manager: carmonm
---
# How to manage assignments with PowerShell

A blueprint assignment can be managed using the **Az.Blueprint** Azure PowerShell module. The module
supports fetching, creating, updating, and removing assignments. The module can also fetch details
on existing blueprint definitions. This article covers how to install the module and start using it.

## Add the Az.Blueprint module

To enable Azure PowerShell to manage blueprint assignments, the module must be added. This module
can be used with locally installed PowerShell, with [Azure Cloud Shell](https://shell.azure.com), or
with the [Azure PowerShell Docker image](https://hub.docker.com/r/azuresdk/azure-powershell/).

### Base requirements

The Azure Blueprints module requires the following software:

- Azure PowerShell 1.5.0 or higher. If it isn't yet installed, follow [these instructions](/powershell/azure/install-az-ps).
- PowerShellGet 2.0.1 or higher. If it isn't installed or updated, follow [these instructions](/powershell/gallery/installing-psget).

### Install the module

The Blueprints module for PowerShell is **Az.Blueprint**.

1. From an **administrative** PowerShell prompt, run the following command:

   ```azurepowershell-interactive
   # Install the Blueprints module from PowerShell Gallery
   Install-Module -Name Az.Blueprint
   ```

   > [!NOTE]
   > If **Az.Accounts** is already installed, it may be necessary to use `-AllowClobber` to force
   > the installation.

1. Validate that the module has been imported and is the correct version (0.1.0):

   ```azurepowershell-interactive
   # Get a list of commands for the imported Az.Blueprint module
   Get-Command -Module 'Az.Blueprint' -CommandType 'Cmdlet'
   ```

## Get blueprint definitions

The first step to working with an assignment is often getting a reference to a blueprint definition.
The `Get-AzBlueprint` cmdlet gets one or more blueprint definitions. The cmdlet can get blueprint
definitions from a management group with `-ManagementGroupId {mgId}` or a subscription with
`-SubscriptionId {subId}`. The **Name** parameter gets a blueprint definition, but must be used with
**ManagementGroupId** or **SubscriptionId**. **Version** can be used with **Name** to be more
explicit about which blueprint definition is returned. Instead of **Version**, the switch
`-LatestPublished` grabs the most recently published version.

The following example uses `Get-AzBlueprint` to get all versions of a blueprint definition named
'101-blueprints-definition-subscription' from a specific subscription represented as `{subId}`:

```azurepowershell-interactive
# Login first with Connect-AzAccount if not using Cloud Shell

# Get all versions of the blueprint definition in the specified subscription
$blueprints = Get-AzBlueprint -SubscriptionId '{subId}' -Name '101-blueprints-definition-subscription'

# Display the blueprint definition object
$blueprints
```

The example output for a blueprint definition with multiple versions looks like this:

```output
Name                 : 101-blueprints-definition-subscription
Id                   : /subscriptions/{subId}/providers/Microsoft.Blueprint/blueprints/101
                       -blueprints-definition-subscription
DefinitionLocationId : {subId}
Versions             : {1.0, 1.1}
TimeCreated          : 2019-02-25
TargetScope          : Subscription
Parameters           : {storageAccount_storageAccountType, storageAccount_location,
                       allowedlocations_listOfAllowedLocations, [Usergrouporapplicationname]:Reader_RoleAssignmentName}
ResourceGroups       : ResourceGroup
```

The [blueprint parameters](../concepts/parameters.md#blueprint-parameters) on the blueprint
definition can be expanded to provide more information.

```azurepowershell-interactive
$blueprints.Parameters
```

```output
Key                                                    Value
---                                                    -----
storageAccount_storageAccountType                      Microsoft.Azure.Commands.Blueprint.Models.PSParameterDefinition
storageAccount_location                                Microsoft.Azure.Commands.Blueprint.Models.PSParameterDefinition
allowedlocations_listOfAllowedLocations                Microsoft.Azure.Commands.Blueprint.Models.PSParameterDefinition
[Usergrouporapplicationname]:Reader_RoleAssignmentName Microsoft.Azure.Commands.Blueprint.Models.PSParameterDefinition
```

## Get blueprint assignments

If the blueprint assignment already exists, you can get a reference to it with the
`Get-AzBlueprintAssignment` cmdlet. The cmdlet takes **SubscriptionId** and **Name** as optional
parameters. If **SubscriptionId** is not specified, the current subscription context is used.

The following example uses `Get-AzBlueprintAssignment` to get a single blueprint assignment named
'Assignment-lock-resource-groups' from a specific subscription represented as `{subId}`:

```azurepowershell-interactive
# Login first with Connect-AzAccount if not using Cloud Shell

# Get the blueprint assignment in the specified subscription
$blueprintAssignment = Get-AzBlueprintAssignment -SubscriptionId '{subId}' -Name 'Assignment-lock-resource-groups'

# Display the blueprint assignment object
$blueprintAssignment
```

The example output for a blueprint assignment looks like this:

```output
Name              : Assignment-lock-resource-groups
Id                : /subscriptions/{subId}/providers/Microsoft.Blueprint/blueprintAssignme
                    nts/Assignment-lock-resource-groups
Scope             : /subscriptions/{subId}
LastModified      : 2019-02-19
LockMode          : AllResourcesReadOnly
ProvisioningState : Succeeded
Parameters        :
ResourceGroups    : ResourceGroup
```

## Create blueprint assignments

If the blueprint assignment doesn't exist yet, you can create it with the
`New-AzBlueprintAssignment` cmdlet. This cmdlet uses the following parameters:

- **Name** [required]
  - Specifies the name of the blueprint assignment
  - Must be unique and not already exist in **SubscriptionId**
- **Blueprint** [required]
  - Specifies the blueprint definition to assign
  - Use `Get-AzBlueprint` to get the reference object
- **Location** [required]
  - Specifies the region for the system-assigned managed identity and subscription deployment object
    to be created in
- **Subscription** (optional)
  - Specifies the subscription the assignment is deployed to
  - If not provided, defaults to the current subscription context
- **Lock** (optional)
  - Defines the [blueprint resource locking](../concepts/resource-locking.md) to use for deployed
    resources
  - Supported options: _None_, _AllResourcesReadOnly_, _AllResourcesDoNotDelete_
  - If not provided, defaults to _None_
- **SystemAssignedIdentity** (optional)
  - Select to create a system-assigned managed identity for the assignment and to deploy the
    resources
  - Default for the "identity" parameter set
  - Can't be used with **UserAssignedIdentity**
- **UserAssignedIdentity** (optional)
  - Specifies the user-assigned managed identity to use for the assignment and to deploy the
    resources
  - Part of the "identity" parameter set
  - Can't be used with **SystemAssignedIdentity**
- **Parameter** (optional)
  - A [hash table](/powershell/module/microsoft.powershell.core/about/about_hash_tables) of
    key/value pairs for setting [dynamic parameters](../concepts/parameters.md#dynamic-parameters)
    on the blueprint assignment
  - Default for a dynamic parameter is the **defaultValue** in the definition
  - If a parameter isn't provided and has no **defaultValue**, the parameter isn't optional

    > [!NOTE]
    > **Parameter** doesn't support secureStrings.

- **ResourceGroupParameter** (optional)
  - A [hash table](/powershell/module/microsoft.powershell.core/about/about_hash_tables) of resource
    group artifacts
  - Each resource group artifact placeholder will have a key/value pairs for dynamically setting
    **Name** and/or **Location** on that resource group artifact
  - If a resource group parameter isn't provided and has no **defaultValue**, the resource group
    parameter isn't optional

The following example creates a new assignment of version '1.1' of the 'my-blueprint' blueprint
definition fetched with `Get-AzBlueprint`, sets the managed identity and assignment object location
to 'westus2', locks the resources with _AllResourcesReadOnly_, and sets the hash tables for both
**Parameter** and **ResourceGroupParameter** on specific subscription represented as `{subId}`:

```azurepowershell-interactive
# Login first with Connect-AzAccount if not using Cloud Shell

# Get version '1.1' of the blueprint definition in the specified subscription
$bpDefinition = Get-AzBlueprint -SubscriptionId '{subId}' -Name 'my-blueprint' -Version '1.1'

# Create the hash table for Parameters
$bpParameters = @{storageAccount_storageAccountType='Standard_GRS'}

# Create the hash table for ResourceGroupParameters
# ResourceGroup is the resource group artifact placeholder name
$bpRGParameters = @{ResourceGroup=@{name='storage_rg';location='westus2'}}

# Create the new blueprint assignment
$bpAssignment = New-AzBlueprintAssignment -Name 'my-blueprint-assignment' -Blueprint $bpDefinition `
    -SubscriptionId '{subId}' -Location 'westus2' -Lock AllResourcesReadyOnly `
    -Parameter $bpParameters -ResourceGroupParameter $bpRGParameters
```

The example output for creating a blueprint assignment looks like this:

```output
Name              : my-blueprint-assignment
Id                : /subscriptions/{subId}/providers/Microsoft.Blueprint/blueprintAssi
                    gnments/my-blueprint-assignment
Scope             : /subscriptions/{subId}
LastModified      : 2019-03-13
LockMode          : AllResourcesReadyOnly
ProvisioningState : Creating
Parameters        : {storageAccount_storageAccountType}
ResourceGroups    : ResourceGroup
```

## Update blueprint assignments

Sometimes it's necessary to update a blueprint assignment that has already been created. The
`Set-AzBlueprintAssignment` cmdlet handles this action. The cmdlet takes most of the same parameters
that the `New-AzBlueprintAssignment` cmdlet does, allowing anything that was set on the assignment
to be updated. The exceptions to this are the _Name_, _Blueprint_, and _SubscriptionId_. Only the
values provided are updated.

To understand what happens when updating a blueprint assignment, see [rules for updating assignments](./update-existing-assignments.md#rules-for-updating-assignments).

- **Name** [required]
  - Specifies the name of the blueprint assignment to update
  - Used to locate the assignment to update, not to change the assignment
- **Blueprint** [required]
  - Specifies the blueprint definition of the blueprint assignment
  - Use `Get-AzBlueprint` to get the reference object
  - Used to locate the assignment to update, not to change the assignment
- **Location** (optional)
  - Specifies the region for the system-assigned managed identity and subscription deployment object
    to be created in
- **Subscription** (optional)
  - Specifies the subscription the assignment is deployed to
  - If not provided, defaults to the current subscription context
  - Used to locate the assignment to update, not to change the assignment
- **Lock** (optional)
  - Defines the [blueprint resource locking](../concepts/resource-locking.md) to use for deployed
    resources
  - Supported options: _None_, _AllResourcesReadOnly_, _AllResourcesDoNotDelete_
- **SystemAssignedIdentity** (optional)
  - Select to create a system-assigned managed identity for the assignment and to deploy the
    resources
  - Default for the "identity" parameter set
  - Can't be used with **UserAssignedIdentity**
- **UserAssignedIdentity** (optional)
  - Specifies the user-assigned managed identity to use for the assignment and to deploy the
    resources
  - Part of the "identity" parameter set
  - Can't be used with **SystemAssignedIdentity**
- **Parameter** (optional)
  - A [hash table](/powershell/module/microsoft.powershell.core/about/about_hash_tables) of
    key/value pairs for setting [dynamic parameters](../concepts/parameters.md#dynamic-parameters)
    on the blueprint assignment
  - Default for a dynamic parameter is the **defaultValue** in the definition
  - If a parameter isn't provided and has no **defaultValue**, the parameter isn't optional

    > [!NOTE]
    > **Parameter** doesn't support secureStrings.

- **ResourceGroupParameter** (optional)
  - A [hash table](/powershell/module/microsoft.powershell.core/about/about_hash_tables) of resource
    group artifacts
  - Each resource group artifact placeholder will have a key/value pairs for dynamically setting
    **Name** and/or **Location** on that resource group artifact
  - If a resource group parameter isn't provided and has no **defaultValue**, the resource group
    parameter isn't optional

The following example updates the assignment of version '1.1' of the 'my-blueprint' blueprint
definition fetched with `Get-AzBlueprint` by changing the lock mode:

```azurepowershell-interactive
# Login first with Connect-AzAccount if not using Cloud Shell

# Get version '1.1' of the blueprint definition in the specified subscription
$bpDefinition = Get-AzBlueprint -SubscriptionId '{subId}' -Name 'my-blueprint' -Version '1.1'

# Update the existing blueprint assignment
$bpAssignment = Set-AzBlueprintAssignment -Name 'my-blueprint-assignment' -Blueprint $bpDefinition `
    -SubscriptionId '{subId}' -Lock AllResourcesDoNotDelete
```

The example output for creating a blueprint assignment looks like this:

```output
Name              : my-blueprint-assignment
Id                : /subscriptions/{subId}/providers/Microsoft.Blueprint/blueprintAssi
                    gnments/my-blueprint-assignment
Scope             : /subscriptions/{subId}
LastModified      : 2019-03-13
LockMode          : AllResourcesDoNotDelete
ProvisioningState : Updating
Parameters        : {storageAccount_storageAccountType}
ResourceGroups    : ResourceGroup
```

## Remove blueprint assignments

When it's time for a blueprint assignment to be removed, the `Remove-AzBlueprintAssignment` cmdlet
handles this action. The cmdlet takes either **Name** or **InputObject** to specify which blueprint
assignment to remove. **SubscriptionId** is _required_ and must be provided in all cases.

The following example fetches an existing blueprint assignment with `Get-AzBlueprintAssignment` and
then removes it from the specific subscription represented as `{subId}`:

```azurepowershell-interactive
# Login first with Connect-AzAccount if not using Cloud Shell

# Get the blueprint assignment in the specified subscription
$blueprintAssignment = Get-AzBlueprintAssignment -Name 'Assignment-lock-resource-groups'

# Remove the existing blueprint assignment
Remove-AzBlueprintAssignment -InputObject $blueprintAssignment -SubscriptionId '{subId}'
```

## End-to-end code example

Bringing all the steps together, the following example gets the blueprint definition, then creates,
updates, and removes a blueprint assignment in the specific subscription represented as `{subId}`:

```azurepowershell-interactive
# Login first with Connect-AzAccount if not using Cloud Shell

#region GetBlueprint
# Get version '1.1' of the blueprint definition in the specified subscription
$bpDefinition = Get-AzBlueprint -SubscriptionId '{subId}' -Name 'my-blueprint' -Version '1.1'
#endregion

#region CreateAssignment
# Create the hash table for Parameters
$bpParameters = @{storageAccount_storageAccountType='Standard_GRS'}

# Create the hash table for ResourceGroupParameters
# ResourceGroup is the resource group artifact placeholder name
$bpRGParameters = @{ResourceGroup=@{name='storage_rg';location='westus2'}}

# Create the new blueprint assignment
$bpAssignment = New-AzBlueprintAssignment -Name 'my-blueprint-assignment' -Blueprint $bpDefinition `
    -SubscriptionId '{subId}' -Location 'westus2' -Lock AllResourcesReadyOnly `
    -Parameter $bpParameters -ResourceGroupParameter $bpRGParameters
#endregion CreateAssignment

# Wait for the blueprint assignment to finish deployment prior to the next steps

#region UpdateAssignment
# Update the existing blueprint assignment
$bpAssignment = Set-AzBlueprintAssignment -Name 'my-blueprint-assignment' -Blueprint $bpDefinition `
    -SubscriptionId '{subId}' -Lock AllResourcesDoNotDelete
#endregion UpdateAssignment

# Wait for the blueprint assignment to finish deployment prior to the next steps

#region RemoveAssignment
# Remove the existing blueprint assignment
Remove-AzBlueprintAssignment -InputObject $bpAssignment -SubscriptionId '{subId}'
#endregion
```

## Next steps

- Learn about the [blueprint life-cycle](../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md).
- Resolve issues during the assignment of a blueprint with [general troubleshooting](../troubleshoot/general.md).