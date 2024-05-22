---
title: "Quickstart: Create policy assignment using Azure PowerShell"
description: In this quickstart, you create an Azure Policy assignment to identify non-compliant resources using Azure PowerShell.
ms.date: 02/26/2024
ms.topic: quickstart
ms.custom: devx-track-azurepowershell
---

# Quickstart: Create a policy assignment to identify non-compliant resources using Azure PowerShell

The first step in understanding compliance in Azure is to identify the status of your resources. In this quickstart, you create a policy assignment to identify non-compliant resources using Azure PowerShell. The policy is assigned to a resource group and audits virtual machines that don't use managed disks. After you create the policy assignment, you identify non-compliant virtual machines.

The Azure PowerShell modules can be used to manage Azure resources from the command line or in scripts. This article explains how to use Azure PowerShell to create a policy assignment.

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Azure PowerShell](/powershell/azure/install-azure-powershell).
- [Visual Studio Code](https://code.visualstudio.com/).
- `Microsoft.PolicyInsights` must be [registered](../../azure-resource-manager/management/resource-providers-and-types.md) in your Azure subscription. To register a resource provider, you must have permission to register resource providers. That permission is included in the Contributor and Owner roles.
- A resource group with at least one virtual machine that doesn't use managed disks.

## Connect to Azure

From a Visual Studio Code terminal session, connect to Azure. If you have more than one subscription, run the commands to set context to your subscription. Replace `<subscriptionID>` with your Azure subscription ID.

```azurepowershell
Connect-AzAccount

# Run these commands if you have multiple subscriptions
Get-AzSubScription
Set-AzContext -Subscription <subscriptionID>
```

## Register resource provider

When a resource provider is registered, it's available to use in your Azure subscription.

To verify if `Microsoft.PolicyInsights` is registered, run `Get-AzResourceProvider`. The resource provider contains several resource types. If the result is `NotRegistered` run `Register-AzResourceProvider`:

```azurepowershell
 Get-AzResourceProvider -ProviderNamespace 'Microsoft.PolicyInsights' |
   Select-Object -Property ResourceTypes, RegistrationState

Register-AzResourceProvider -ProviderNamespace 'Microsoft.PolicyInsights'
```

For more information, go to [Get-AzResourceProvider](/powershell/module/az.resources/get-azresourceprovider) and [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider).

## Create policy assignment

Use the following commands to create a new policy assignment for your resource group. This example uses an existing resource group that contains a virtual machine _without_ managed disks. The resource group is the scope for the policy assignment. This example uses the built-in policy definition [Audit VMs that do not use managed disks](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMRequireManagedDisk_Audit.json).

Run the following commands and replace `<resourceGroupName>` with your resource group name:

```azurepowershell
$rg = Get-AzResourceGroup -Name '<resourceGroupName>'

$definition = Get-AzPolicyDefinition |
  Where-Object { $_.Properties.DisplayName -eq 'Audit VMs that do not use managed disks' }
```

The `$rg` variable stores properties for the resource group and the `$definition` variable stores the policy definition's properties. The properties are used in subsequent commands.

Run the following command to create the policy assignment:

```azurepowershell
$policyparms = @{
Name = 'audit-vm-managed-disks'
DisplayName = 'Audit VM managed disks'
Scope = $rg.ResourceId
PolicyDefinition = $definition
Description = 'Az PowerShell policy assignment to resource group'
}

New-AzPolicyAssignment @policyparms
```

The `$policyparms` variable uses [splatting](/powershell/module/microsoft.powershell.core/about/about_splatting) to create parameter values and improve readability. The `New-AzPolicyAssignment` command uses the parameter values defined in the `$policyparms` variable.

- `Name` creates the policy assignment name used in the assignment's `ResourceId`.
- `DisplayName` is the name for the policy assignment and is visible in Azure portal.
- `Scope` uses the `$rg.ResourceId` property to assign the policy to the resource group.
- `PolicyDefinition` assigns the policy definition stored in the `$definition` variable.
- `Description` can be used to add context about the policy assignment.

The results of the policy assignment resemble the following example:

```output
Name               : audit-vm-managed-disks
ResourceId         : /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/policyAssignments/audit-vm-managed-disks
ResourceName       : audit-vm-managed-disks
ResourceGroupName  : {resourceGroupName}
ResourceType       : Microsoft.Authorization/policyAssignments
SubscriptionId     : {subscriptionId}
PolicyAssignmentId : /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/policyAssignments/audit-vm-managed-disks
Properties         : Microsoft.Azure.Commands.ResourceManager.Cmdlets.Implementation.Policy.PsPolicyAssignmentProperties
```

For more information, go to [New-AzPolicyAssignment](/powershell/module/az.resources/new-azpolicyassignment).

If you want to redisplay the policy assignment information, run the following command:

```azurepowershell
Get-AzPolicyAssignment -Name 'audit-vm-managed-disks' -Scope $rg.ResourceId
```

## Identify non-compliant resources

The compliance state for a new policy assignment takes a few minutes to become active and provide results about the policy's state.

Use the following command to identify resources that aren't compliant with the policy assignment
you created:

```azurepowershell
$complianceparms = @{
ResourceGroupName = $rg.ResourceGroupName
PolicyAssignmentName = 'audit-vm-managed-disks'
Filter = 'IsCompliant eq false'
}

Get-AzPolicyState @complianceparms
```

The `$complianceparms` variable uses splatting to create parameter values used in the `Get-AzPolicyState` command.

- `ResourceGroupName` gets the resource group name from the `$rg.ResourceGroupName` property.
- `PolicyAssignmentName` specifies the name used when the policy assignment was created.
- `Filter` uses an expression to find resources that aren't compliant with the policy assignment.

Your results resemble the following example and `ComplianceState` shows `NonCompliant`:

```output
Timestamp                : 2/14/2024 18:25:37
ResourceId               : /subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.compute/virtualmachines/{vmId}
PolicyAssignmentId       : /subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.authorization/policyassignments/audit-vm-managed-disks
PolicyDefinitionId       : /providers/microsoft.authorization/policydefinitions/06a78e20-9358-41c9-923c-fb736d382a4d
IsCompliant              : False
SubscriptionId           : {subscriptionId}
ResourceType             : Microsoft.Compute/virtualMachines
ResourceLocation         : {location}
ResourceGroup            : {resourceGroupName}
ResourceTags             : tbd
PolicyAssignmentName     : audit-vm-managed-disks
PolicyAssignmentOwner    : tbd
PolicyAssignmentScope    : /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}
PolicyDefinitionName     : 06a78e20-9358-41c9-923c-fb736d382a4d
PolicyDefinitionAction   : audit
PolicyDefinitionCategory : tbd
ManagementGroupIds       : {managementGroupId}
ComplianceState          : NonCompliant
AdditionalProperties     : {[complianceReasonCode, ]}
```

For more information, go to [Get-AzPolicyState](/powershell/module/az.policyinsights/Get-AzPolicyState).

## Clean up resources

To remove the policy assignment, run the following command:

```azurepowershell
Remove-AzPolicyAssignment -Name 'audit-vm-managed-disks' -Scope $rg.ResourceId
```

To sign out of your Azure PowerShell session:

```azurepowershell
Disconnect-AzAccount
```


## Next steps

In this quickstart, you assigned a policy definition to identify non-compliant resources in your Azure environment.

To learn more about how to assign policies that validate resource compliance, continue to the tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Create and manage policies to enforce compliance](./tutorials/create-and-manage.md)
