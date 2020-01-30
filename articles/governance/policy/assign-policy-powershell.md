---
title: "Quickstart: New policy assignment with PowerShell"
description: In this quickstart, you use Azure PowerShell to create an Azure Policy assignment to identify non-compliant resources.
ms.date: 11/25/2019
ms.topic: quickstart
---
# Quickstart: Create a policy assignment to identify non-compliant resources using Azure PowerShell

The first step in understanding compliance in Azure is to identify the status of your resources. In
this quickstart, you create a policy assignment to identify virtual machines that aren't using
managed disks. When complete, you'll identify virtual machines that are _non-compliant_.

The Azure PowerShell module is used to manage Azure resources from the command line or in scripts.
This guide explains how to use Az module to create a policy assignment.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/)
  account before you begin.

- Before you start, make sure that the latest version of Azure PowerShell is installed. See
  [Install Azure PowerShell module](/powershell/azure/install-az-ps) for detailed information.

- Register the Azure Policy Insights resource provider using Azure PowerShell. Registering the
  resource provider makes sure that your subscription works with it. To register a resource
  provider, you must have permission to the register resource provider operation. This operation is
  included in the Contributor and Owner roles. Run the following command to register the resource
  provider:

  ```azurepowershell-interactive
  # Register the resource provider if it's not already registered
  Register-AzResourceProvider -ProviderNamespace 'Microsoft.PolicyInsights'
  ```

  For more information about registering and viewing resource providers, see
  [Resource Providers and Types](../../azure-resource-manager/management/resource-providers-and-types.md).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create a policy assignment

In this quickstart, you create a policy assignment for the _Audit VMs without managed disks_
definition. This policy definition identifies virtual machines not using managed disks.

Run the following commands to create a new policy assignment:

```azurepowershell-interactive
# Get a reference to the resource group that will be the scope of the assignment
$rg = Get-AzResourceGroup -Name '<resourceGroupName>'

# Get a reference to the built-in policy definition that will be assigned
$definition = Get-AzPolicyDefinition | Where-Object { $_.Properties.DisplayName -eq 'Audit VMs that do not use managed disks' }

# Create the policy assignment with the built-in definition against your resource group
New-AzPolicyAssignment -Name 'audit-vm-manageddisks' -DisplayName 'Audit VMs without managed disks Assignment' -Scope $rg.ResourceId -PolicyDefinition $definition
```

The preceding commands use the following information:

- **Name** - The actual name of the assignment. For this example, _audit-vm-manageddisks_ was used.
- **DisplayName** - Display name for the policy assignment. In this case, you're using _Audit VMs
  without managed disks Assignment_.
- **Definition** – The policy definition, based on which you're using to create the assignment. In
  this case, it's the ID of policy definition _Audit VMs that do not use managed disks_.
- **Scope** - A scope determines what resources or grouping of resources the policy assignment gets
  enforced on. It could range from a subscription to resource groups. Be sure to replace
  &lt;scope&gt; with the name of your resource group.

You're now ready to identify non-compliant resources to understand the compliance state of your
environment.

## Identify non-compliant resources

Use the following information to identify resources that aren't compliant with the policy assignment
you created. Run the following commands:

```azurepowershell-interactive
# Get the resources in your resource group that are non-compliant to the policy assignment
Get-AzPolicyState -ResourceGroupName $rg.ResourceGroupName -PolicyAssignmentName 'audit-vm-manageddisks' -Filter 'IsCompliant eq false'
```

For more information about getting policy state, see
[Get-AzPolicyState](/powershell/module/az.policyinsights/Get-AzPolicyState).

Your results resemble the following example:

```output
Timestamp                   : 3/9/19 9:21:29 PM
ResourceId                  : /subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmId}
PolicyAssignmentId          : /subscriptions/{subscriptionId}/providers/microsoft.authorization/policyassignments/audit-vm-manageddisks
PolicyDefinitionId          : /providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d
IsCompliant                 : False
SubscriptionId              : {subscriptionId}
ResourceType                : /Microsoft.Compute/virtualMachines
ResourceTags                : tbd
PolicyAssignmentName        : audit-vm-manageddisks
PolicyAssignmentOwner       : tbd
PolicyAssignmentScope       : /subscriptions/{subscriptionId}
PolicyDefinitionName        : 06a78e20-9358-41c9-923c-fb736d382a4d
PolicyDefinitionAction      : audit
PolicyDefinitionCategory    : Compute
ManagementGroupIds          : {managementGroupId}
```

The results match what you see in the **Resource compliance** tab of a policy assignment in the
Azure portal view.

## Clean up resources

To remove the assignment created, use the following command:

```azurepowershell-interactive
# Removes the policy assignment
Remove-AzPolicyAssignment -Name 'audit-vm-manageddisks' -Scope '/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>'
```

## Next steps

In this quickstart, you assigned a policy definition to identify non-compliant resources in your
Azure environment.

To learn more about assigning policies to validate that new resources are compliant, continue to the
tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)