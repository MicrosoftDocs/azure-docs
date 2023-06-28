---
title: Create & deploy deployment stacks in Bicep
description: Describes how to create deployment stacks in Bicep.
ms.topic: conceptual
ms.date: 06/27/2023
---

# Deployment stacks (Preview)

An Azure deployment stack is a type of Azure resource that enables the management of a group of Azure resources as a atomic unit. When a Bicep file or an ARM JSON template is submitted to a deployment stack, it defines the resources that are managed by the stack. If a resource that was previously included in the template is removed, it will either be detached or deleted based on the specified _actionOnUnmanage_ behavior of the deployment stack. Similar to other Azure resources, access to the deployment stack can be restricted using Azure role-based access control (Azure RBAC).

To create and update a deployment stack, you can utilize Azure CLI, Azure PowerShell, or the Azure Portal along with Bicep files. These Bicep files are transpiled into ARM JSON templates, which are then deployed as a deployment object by the stack. The deployment stack offers additional capabilities beyond the [familiar deployment resources](./deploy-cli.md), serving as a superset of those capabilities.

`Microsoft.Resources/deploymentStacks` is the resource type for deployment stacks. It consists of a main template that can perform 1-to-many updates across scopes to the resources it describes, as well as block any unwanted changes to those resources.

When planning your deployment and determining which resource groups should be part of the same stack, it's important to consider the management lifecycle of those resources, which includes creation, updating, and deletion. For instance, suppose you need to provision some test VMs for various application teams across different resource group scopes. In this case, a deployment stack can be utilized to easily create these test environments and update the test VM configurations through subsequent updates to the deployment stack. After completing the project, it may be necessary to remove or delete any resources that were created, such as the test VMs. With a deployment stack, these managed resources can be deleted by specifying the appropriate delete flag, which saves significant time when cleaning up environments since a single update to the stack resource is performed instead of individually updating or removing each test VM across different resource group scopes.

To create your first deployment stack, work through [Quickstart: create deployment stack](./quickstart-create-deployment-stacks.md).

## Why use deployment stacks?

Deployment stacks provide the following benefits:

- The ease of provisioning and managing resources across various [scopes](./deploy-to-resource-group.md) as a single atomic unit.
- The option to prevent undesirable changes to managed resources using [deny settings](#protect-managed-resources-against-deletion).
- The ability to rapidly cleanup environments by setting appropriate delete flags on a Deployment stack update.
- The ability to use standard templates, including [Bicep](./overview.md), [ARM templates](../templates/overview.md), or [Template specs](./template-specs.md) for your Deployment stacks.

### Known issues (remove this section)

jgao: Angel will update this list.

The `2022-08-01-preview` private preview API version has the following limitations:

- We don't recommended using deployment stacks in production environments because the service is still in preview. Therefore, you should expect breaking changes in future releases.
- Resource group delete currently bypasses deny assignments.
- Implicitly created resources aren't managed by the stack (therefore, no deny assignments or cleanup is possible)
- The `denyDelete` resource locking method is available in private preview. The `denyWriteAndDelete` method will be available in the future.
- `Whatif` isn't available in the private preview. `Whatif` allows you to evaluate changes before actually submitting the deployment to ARM.
- Deployment stacks are currently limited to the resource group and subscription management scopes for the private preview. At this time management group-scoped Azure PowerShell and Azure CLI commands exist; they just aren't usable yet.
- A deployment stack doesn't guarantee the protection of `secureString` and `secureObject` parameters; this release returns them in plain text when requested.

## Create deployment stacks

jgao: proof-read the following paragraph.

You have the flexibility to create deployment stacks at various scopes, such as resource group, subscription, and management group. The template utilized for creating a deployment stack can be deployed at any of these scopes. By employing the deny settings mode, undesired modifications to the managed resources can be prevented. The application of deny settings mode is determined by the scope in which the stack exists. Typically, deny settings are stored at the scope level rather than the resource level. To ensure the protection of deny settings, it is advisable to store the stack at the parent scope relative to the deployment scope. For further details, please refer to [Protect managed resources against deletion](#protect-managed-resources-against-deletion).

The create-stack commands can also be used to [update deployment stacks](#update-deployment-stacks).

jgao: do I cover the scenarios to deploy template to different resoruce group/subscription/mg? See Angel's PPT.

To create a deployment stack at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeploymentStack `
  -Name '<deployment-stack-name>' `
  -ResourceGroupName '<resource-group-name>' `
  -TemplateFile '<bicep-file-name>' `
  -DenySettingsMode none
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name <deployment-stack-name> \
  --resource-group <resource-group-name> \
  --template-file <bicep-file-name> \
  --deny-settings-mode none
```

---

To create a deployment stack at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzSubscriptionDeploymentStack `
  -Name '<deployment-stack-name>' `
  -Location '<location>' `
  -TemplateFile '<bicep-file-name>' `
  -DeploymentResourceGroupName '<resource-group-name>' `
  -DenySettingsMode none
```

jgao; proof-read the following sentence.

The `DeploymentResourceGroupName` parameter specifies the resource group used to store the managed resources. If the parameter is not specified, the managed resources are stored in the subscription scope.

# [CLI](#tab/azure-cli)

```azurecli
az stack sub create \
  --name <deployment-stack-name> \
  --location <location> \
  --template-file <bicep-file-name> \
  --deployment-resource-group-name <resource-group-name> \
  --deny-settings-mode none
```

jgao; proof-read the following sentence.

The `deployment-resource-group-name` parameter specifies the resource group used to store the managed resources. If the parameter is not specified, the managed resources are stored in the subscription scope.

---

To create a deployment stack at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzManagmentGroupDeploymentStack `
  -Name '<deployment-stack-name>' `
  -Location '<location>' `
  -TemplateFile '<bicep-file-name>' `
  -ManagementGroupId '<management-group-id>' `
  -DeploymentSubscriptionId '<subscription-id>' `
  -DenySettingsMode none
```

The `deploymentSubscriptionId` parameter specifies the subscription used to store the managed resources. If the parameter is not specified, the managed resources are stored in the management group scope.

# [CLI](#tab/azure-cli)

```azurecli
az stack mg create \
  --name <deployment-stack-name> \
  --location <location> \
  --template-file <bicep-file-name> \
  --management-group-id <management-group-id> \
  --deployment-subscription-id <subscription-id> \
  --deny-settings-mode none
```

jgao: --deployment-subscription or --deployment-subscription-id?

The `deployment-subscription` parameter specifies the subscription used to store the managed resources. If the parameter is not specified, the managed resources are stored in the management group scope.

---

## List deployment stacks

To list deployment stack resources at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResourceGroupDeploymentStack `
  -ResourceGroupName '<resource-group-name>'
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group list \
  --resource-group <resource-group-name>
```

---

To list deployment stack resources at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzSubscriptionDeploymentStack
```

# [CLI](#tab/azure-cli)

```azurecli
az stack sub list
```

---

jgao: specify the subscription parameter?

To list deployment stack resources at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzManagementGroupDeploymentStack `
  -ManagementGroupId '<management-group-id>'
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg list \
  --management-group-id <management-group-id>
```

---

## Update deployment stacks

To update a deployment stack, which may involve adding or deleting a managed resource, you need to make changes to the underlying Bicep files. Once the modifications are made, you have two options to update the deployment stack: run the update command or re-run the create command.

The list of managed resources can be fully controlled through the infrastructure as code (IaC) design pattern.

### Use the Set command

To update a deployment stack at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzResourceGroupDeploymentStack `
  -Name '<deployment-stack-name>' `
  -ResourceGroupName '<resource-group-name>' `
  -TemplateFile '<bicep-file-name>' `
  -DenySettingsMode none
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name <deployment-stack-name> \
  --resource-group <resource-group-name> \
  --template-file <bicep-file-name> \
  --deny-settings-mode none
```

> [!NOTE]
> Azure CLI doesn't have a deployment stack set command.  Use the new command instead.

---

To update a deployment stack at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzSubscriptionDeploymentStack `
   -Name '<deployment-stack-name>' `
   -Location '<location>' `
   -TemplateFile '<bicep-file-name>' `
   -DeploymentResourceGroupName '<resource-group-name>' `
  -DenySettingsMode none
```

The `DeploymentResourceGroupName` parameter specifies the resource group used to store the deployment stack resources. If you don't specify a resource group name, the deployment stack service will create a new resource group for you.

# [CLI](#tab/azure-cli)

```azurecli
az stack sub create \
  --name <deployment-stack-name> \
  --location <location> \
  --template-file <bicep-file-name> \
  --deployment-resource-group-name <resource-group-name> \
  --deny-settings-mode none
```

---

To update a deployment stack at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzManagmentGroupDeploymentStack `
  -Name '<deployment-stack-name>' `
  -Location '<location>' `
  -TemplateFile '<bicep-file-name>' `
  -ManagementGroupId '<management-group-id>' `
  -DeploymentSubscriptionId '<subscription-id>' `
  -DenySettingsMode none
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg create \
  --name <deployment-stack-name> \
  --location <location> \
  --template-file <bicep-file-name> \
  --management-group-id <management-group-id> \
  --deployment-subscription-id <subscription-id> \
  --deny-settings-mode none
```

---

### Use the new command

You get a warning similar to the following:

```warning
The deployment stack 'myStack' you're trying to create already already exists in the current subscription/management group/resource group. Do you want to overwrite it? Detaching: resources, resourceGroups (Y/N)
```

For more information, see [Create deployment stacks](#create-deployment-stacks).

### Control detachment and deletion

A detached resource (or unmanaged resource) refers to a resource that is not tracked or managed by the deployment stack but still exists within Azure.

To instruct Azure to delete unmanaged resources, update the stack with the create stack command with one of the following parameters. For more information, see [Create deployment stack](#create-deployment-stacks).

# [PowerShell](#tab/azure-powershell)

- `DeleteAll`: Flag to indicate delete rather than detach for managed resources and resource groups.
- `DeleteResources`: Flag to indicate delete rather than detach for managed resources only.
- `DeleteResourceGroups`: Flag to indicate delete rather than detach for managed resource groups only.

`DeleteResourceGroups` must be used together with `DeleteResources`. It is invalid to use `DeleteResourceGroups` by itself.

For example:

```azurepowershell
New-AzSubscriptionDeploymentStack `
  -Name '<deployment-stack-name' `
  -TemplateFile '<bicep-file-name>' `
  -DenySettingsMode none`
  -DeleteResourceGroups `
  -DeleteResources
```

# [CLI](#tab/azure-cli)

- `delete-all`: Flag to indicate delete rather than detach for managed resources and resource groups.
- `delete-resources`: Flag to indicate delete rather than detach for managed resources only.
- `delete-resource-groups`: Flag to indicate delete rather than detach for managed resource groups only.

`delete-resource-groups` must be used together with `delete-resources`. It is invalid to use `delete-resource-groups` by itself.

For example:

```azurecli
az stack sub create `
  --name <deployment-stack-name> `
  --location <location> `
  --template-file <bicep-file-name> `
  --deny-settings-mode none `
  --delete-resource-groups `
  --delete-resources
```

---

> [!WARNING]
> When deleting resource groups with either the `DeleteAll` or `DeleteResourceGroups` properties, the managed resource groups and all the resources contained within them will also be deleted.

## Delete deployment stacks

If you run the delete commands without the delete parameters, the unmanaged resources will be detached but not deleted. To delete the unmanaged resources, use the following switches:

# [PowerShell](#tab/azure-powershell)

- `DeleteAll`: Delete both the resources and the resource groups.
- `DeleteResources`: Delete the resources only.
- `DeleteResourceGroups`: Delete the resource groups only.

# [CLI](#tab/azure-cli)

- `delete-all`: Delete both the resources and the resource groups.
- `delete-resources`: Delete the resources only.
- `delete-resource-groups`: Delete the resource groups only.

---

Even if you specify the delete all switch, if there are unmanaged resources within the resource group where the deployment stack is located, both the unmanaged resource and the resource group itself will not be deleted.

To delete deployment stack resources at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroupDeploymentStack `
  -name '<deployment-stack-name>' `
  -ResourceGroupName '<resource-group-name>' `
  [-DeleteAll/-DeleteResourceGroups/-DeleteResources]
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group delete \
  --name <deployment-stack-name> \
  --resource-group <resource-group-name> \
  [--delete-all/--delete-resource-groups/--delete-resources]
```

---

To delete deployment stack resources at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzSubscriptionDeploymentStack `
  -Name '<deployment-stack-name>' `
  [-DeleteAll/-DeleteResourceGroups/-DeleteResources]
```

# [CLI](#tab/azure-cli)

```azurecli
az stack sub delete \
  --name <deployment-stack-name> \
  [--delete-all/--delete-resource-groups/--delete-resources]
```

---

To delete deployment stack resources at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzManagementGroupDeploymentStack `
  -Name '<deployment-stack-name>' `
  -ManagementGroupId '<management-group-id>' `
  [-DeleteAll/-DeleteResourceGroups/-DeleteResources]
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg delete \
  --name <deployment-stack-name> \
  --management-group-id <management-group-id> \
  [--delete-all/--delete-resource-groups/--delete-resources]
```

---

## View managed resources in deployment stack

During public preview, the deployment stack service doesn't yet have an Azure portal graphical user interface (GUI). To view the managed resources inside a deployment stack, use the following Azure Powershell/Azure CLI commands:

To view managed resources at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzResourceGroupDeploymentStack -Name '<deployment-stack-name>' -ResourceGroupName '<resource-group-name>').Resources
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group list \
  --name <deployment-stack-name> \
  --resource-group <resource-group-name> \
  --output json
```

---

To view managed resources at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzSubscriptionDeploymentStack -Name '<deployment-stack-name>').Resources
```

# [CLI](#tab/azure-cli)

```azurecli
az stack sub show \
  --name <deployment-stack-name> \
  --output json
```

---

To view managed resources at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzManagementGroupDeploymentStack -Name '<deployment-stack-name>' -ManagementGroupId '<management-group-id>').Resources
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg show \
  --name <deployment-stack-name> \
  --management-group-id <management-group-id> \
  --output json
```

---

## Add resources to deployment stack

See [Update deployment stacks](#update-deployment-stacks).

## Delete managed resources from deployment stack

See [Update deployment stacks](#update-deployment-stacks).

## Protect managed resources against deletion

When creating a deployment stack, it is possible to assign a specific type of permissions to the managed resources, which prevents their deletion by unauthorized security principals. These settings are refereed as deny settings. You want to store the stack at a parent scope.

# [PowerShell](#tab/azure-powershell)

The Azure PowerShell includes these parameters to customize the deny assignment:

- `DenySettingsMode`: Defines the operations that are prohibited on the managed resources to safeguard against unauthorized security principals attempting to delete or update them. This restriction applies to everyone unless explicitly granted access. The values include: `None`, `DenyDelete`, and `DenyWriteAndDelete`.
- `DenySettingsApplyToChildScopes`: Deny settings are applied to child Azure management scopes.
- `DenySettingsExcludedActions`: List of role-based management operations that are excluded from the deny settings. Up to 200 actions are permitted.
- `DenySettingsExcludedPrincipals`: List of Azure Active Directory (Azure AD) principal IDs excluded from the lock. Up to five principals are permitted.

# [CLI](#tab/azure-cli)

The Azure CLI includes these parameters to customize the deny assignment:

- `deny-settings-mode`: Defines the operations that are prohibited on the managed resources to safeguard against unauthorized security principals attempting to delete or update them. This restriction applies to everyone unless explicitly granted access. The values include: `none`, `denyDelete`, and `denyWriteAndDelete`.
- `deny-settings-apply-to-child-scopes`: Deny settings are applied to child Azure management scopes.
- `deny-settings-excluded-actions`: List of role-based access control (RBAC) management operations excluded from the deny settings. Up to 200 actions are allowed.
- `deny-settings-excluded-principals`: List of Azure Active Directory (Azure AD) principal IDs excluded from the lock. Up to five principals are allowed.

---

To apply deny settings at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeploymentStack `
  -Name '<deployment-stack-name>' `
  -ResourceGroupName '<resource-group-name>' `
  -TemplateFile '<bicep-file-name>' `
  -DenySettingsMode DenyDelete `
  -DenySettingsExcludedActions Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete `
  -DenySettingsExcludedPrincipals <object-id> <object-id>
```

The following sample applies deny settings to the child scopes at the resource group scope:

```azurepowershell
New-AzResourceGroupDeploymentStack `
  -Name '<deployment-stack-name>' `
  -ResourceGroupName '<resource-group-name>' `
  -TemplateFile '<bicep-file-name>' `
  -DenySettingsMode DenyDelete `
  -DenySettingsExcludedActions Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete `
  -DenySettingsApplyToChildScopes
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name <deployment-stack-name> \
  --resource-group <resource-group-name> \
  --template-file <bicep-file-name> \
  --deny-settings-mode denyDelete \
  --deny-settings-excluded-actions Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete \
  --deny-settings-excluded-principals <object-id> <object-id>
```

The following sample applies deny settings to the child scopes at the resource group scope:

```azurecli
az stack group create \
  --name <deployment-stack-name> \
  --resource-group <resource-group-name> \
  --template-file <bicep-file-name> \
  --deny-settings-mode denyDelete \
  --deny-settings-excluded-actions Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete \
  --deny-settings-apply-to-child-scopes
```

---

To apply deny settings at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzSubscriptionDeploymentStack `
  -Name '<deployment-stack-name>' `
  -Location '<location>' `
  -TemplateFile '<bicep-file-name>' `
  -DenySettingsMode DenyDelete `
  -DenySettingsExcludedActions Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete `
  -DenySettingsExcludedPrincipals <object-id> <object-id>
```

The following sample applies deny settings to the child scopes at the subscription scope:

```azurepowershell
New-AzSubscriptionDeploymentStack `
  -Name '<deployment-stack-name>' `
  -Location '<location>' `
  -TemplateFile '<bicep-file-name>' `
  -DenySettingsMode DenyDelete `
  -DenySettingsExcludedActions Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete `
  -DenySettingsApplyToChildScopes
```

Use the `DeploymentResourceGroupName` parameter to specify the resource group name at which the deployment stack is created. If a scope is not specified, it will default to the scope of the deployment stack.

# [CLI](#tab/azure-cli)

```azurecli
az stack sub create \
  --name <deployment-stack-name> \
  --location <location> \
  --template-file <bicep-file-name> \
  --deny-settings-mode denyDelete \
  --deny-settings-excluded-actions Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete \
  --deny-settings-excluded-principals <object-id> <object-id>
```

The following sample applies deny settings to the child scopes at the management group scope:

```azurecli
az stack mg create \
  --name <deployment-stack-name> \
  --location <location> \
  --template-file <bicep-file-name> \
  --deny-settings-mode denyDelete \
  --deny-settings-excluded-actions Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete \
  --deny-settings-apply-to-child-scopes
```

Use the `deployment-resource-group` parameter to specify the resource group at which the deployment stack is created. If a scope is not specified, it will default to the scope of the deployment stack.

---

To apply deny settings at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzManagmentGroupDeploymentStack `
  -Name '<deployment-stack-name>' `
  -Location '<location>' `
  -TemplateFile '<bicep-file-name>' `
  -DenySettingsMode DenyDelete `
  -DenySettingsExcludedActions Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete `
  -DenySettingsExcludedPrincipals <object-id> <object-id>
```

The following sample applies deny settings to the child scopes at the management group scope:

```azurepowershell
New-AzManagmentGroupDeploymentStack `
  -Name '<deployment-stack-name>' `
  -Location '<location>' `
  -TemplateFile '<bicep-file-name>' `
  -DenySettingsMode DenyDelete `
  -DenySettingsExcludedActions Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete `
  -DenySettingsApplyToChildScopes
```

Use the `DeploymentSubscriptionId ` parameter to specify the subscription ID at which the deployment stack is created. If a scope is not specified, it will default to the scope of the deployment stack.
Use the `ManagementGroupId` parameter to specify the management group ID at which the deployment stack is created. If a scope is not specified, it will default to the scope of the deployment stack.

# [CLI](#tab/azure-cli)

```azurecli
az stack mg create \
  --name <deployment-stack-name> \
  --location <location> \
  --template-file <bicep-file-name> \
  --deny-settings-mode denyDelete \
  --deny-settings-excluded-actions Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete \
  --deny-settings-excluded-principals <object-id> <object-id>
```

The following sample applies deny settings to the child scopes at the management group scope:

```azurecli
az stack mg create \
  --name <deployment-stack-name> \
  --location <location> \
  --template-file <bicep-file-name> \
  --deny-settings-mode denyDelete \
  --deny-settings-excluded-actions Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete \
  --deny-settings-apply-to-child-scopes
```

Use the `deployment-subscription ` parameter to specify the subscription ID at which the deployment stack is created. If a scope is not specified, it will default to the scope of the deployment stack.
Use the `management-group-id` parameter to specify the management group ID at which the deployment stack is created. If a scope is not specified, it will default to the scope of the deployment stack.

---

jgao: is the value of deployment-subscription subscription name or subscription ID?

## Detach managed resources from deployment stack

By default, deployment stacks detach and don't delete unmanaged resources when they're no longer contained within the stack's management scope. For more information, see [Update deployment stacks](#update-deployment-stacks).

## Export templates from deployment stacks

You can export the resources from a deployment stack to a JSON output. You can pipe the output to a file.

To export a deployment stack at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Save-AzResourceGroupDeploymentStack `
   -Name '<deployment-stack-name>' `
   -ResourceGroupName '<resource-group-name>' `
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group save \
  --name <deployment-stack-name> \
  --resource-group <resource-group-name>
```

---

To export a deployment stack at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Save-AzSubscriptionDeploymentStack `
  -name '<deployment-stack-name>'
```

# [CLI](#tab/azure-cli)

```azurecli
az stack sub save \
  --name <deployment-stack-name>
```

---

To export a deployment stack at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Save-AzManagmentGroupDeploymentStack `
  -Name '<deployment-stack-name>' `
  -ManagementGroupId '<management-group-id>'
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg save \
  --name <deployment-stack-name> \
  --management-group-id <management-group-id>
```

---

## Next steps

To go through a quickstart, see [Quickstart: create a deployment stack](./quickstart-create-deployment-stacks.md).
