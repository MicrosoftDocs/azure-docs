---
title: Create & deploy deployment stacks in Bicep
description: Describes how to create deployment stacks in Bicep.
ms.topic: conceptual
ms.date: 07/06/2023
---

# Deployment stacks (Preview)

An Azure deployment stack is a type of Azure resource that enables the management of a group of Azure resources as an atomic unit. When a Bicep file or an ARM JSON template is submitted to a deployment stack, it defines the resources that are managed by the stack. If a resource that was previously included in the template is removed, it will either be detached or deleted based on the specified _actionOnUnmanage_ behavior of the deployment stack. Similar to other Azure resources, access to the deployment stack can be restricted using Azure role-based access control (Azure RBAC).

To create and update a deployment stack, you can utilize Azure CLI, Azure PowerShell, or the Azure portal along with Bicep files. These Bicep files are transpiled into ARM JSON templates, which are then deployed as a deployment object by the stack. The deployment stack offers additional capabilities beyond the [familiar deployment resources](./deploy-cli.md), serving as a superset of those capabilities.

`Microsoft.Resources/deploymentStacks` is the resource type for deployment stacks. It consists of a main template that can perform 1-to-many updates across scopes to the resources it describes, and block any unwanted changes to those resources.

When planning your deployment and determining which resource groups should be part of the same stack, it's important to consider the management lifecycle of those resources, which includes creation, updating, and deletion. For instance, suppose you need to provision some test VMs for various application teams across different resource group scopes. In this case, a deployment stack can be utilized to easily create these test environments and update the test VM configurations through subsequent updates to the deployment stack. After completing the project, it may be necessary to remove or delete any resources that were created, such as the test VMs. With a deployment stack, these managed resources can be deleted by specifying the appropriate delete flag, which saves significant time when cleaning up environments since a single update to the stack resource is performed instead of individually updating or removing each test VM across different resource group scopes.

Deployment stacks requires Azure PowerShell [version 10.1.0 or later](/powershell/azure/install-az-ps) or Azure CLI [version 2.50.0 or later](/cli/azure/install-azure-cli).

To create your first deployment stack, work through [Quickstart: create deployment stack](./quickstart-create-deployment-stacks.md).

## Why use deployment stacks?

Deployment stacks provide the following benefits:

- The ease of provisioning and managing resources across various [scopes](./deploy-to-resource-group.md) as a single atomic unit.
- The option to prevent undesirable changes to managed resources using [deny settings](#protect-managed-resources-against-deletion).
- The ability to rapidly clean up environments by setting appropriate delete flags on a Deployment stack update.
- The ability to use standard templates, including [Bicep](./overview.md), [ARM templates](../templates/overview.md), or [Template specs](./template-specs.md) for your Deployment stacks.

### Known issues

- Deleting resource groups currently bypasses deny assignments.
- Implicitly created resources aren't managed by the stack. Therefore, no deny assignments or cleanup is possible.
- What-if isn't available in the preview. What-if allows you to evaluate changes before actually submitting the deployment to Azure Resource Manager.
- Management group scoped deployment stacks can only deploy the template to subscription.
- When using the Azure CLI create command to modify an existing stack, the deployment process continues regardless of whether you choose _n_ for a prompt. To halt the procedure, use _[CTRL] + C_.

## Create deployment stacks

A deployment stack resource can be created at resource group, subscription, or management group scope. The template passed into a deployment stack defines the resources to be created or updated at the target scope specified for the template deployment.

- A stack at resource group scope can deploy the template passed-in to the same resource group scope where the deployment stack exists.
- A stack at subscription scope can deploy the template passed-in to a resource group scope (if specified) or the same subscription scope where the deployment stack exists.
- A stack at management group scope can deploy the template passed-in to the subscription scope specified.

It's important to note that where a deployment stack exists, so is the deny assignment created with the deny settings capability. For example, by creating a deployment stack at subscription scope that deploys the template to resource group scope and with deny settings mode 'DenyDelete', you can easily provision managed resources to the specified resource group and block delete attempts to those resources. With this approach you also add an extra layer of security to the deployment stack by separating it into the subscription level rather that resource group level which is visible and writable by developer teams working with the provisioned resources. This minimizes the number of users that can edit a deployment stack and make changes to its deny assignment. For more information, see [Protect managed resource against deletion](#protect-managed-resources-against-deletion).

The create-stack commands can also be used to [update deployment stacks](#update-deployment-stacks).

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

The `DeploymentResourceGroupName` parameter specifies the resource group used to store the managed resources. If the parameter isn't specified, the managed resources are stored in the subscription scope.

# [CLI](#tab/azure-cli)

```azurecli
az stack sub create \
  --name <deployment-stack-name> \
  --location <location> \
  --template-file <bicep-file-name> \
  --deployment-resource-group-name <resource-group-name> \
  --deny-settings-mode none
```

The `deployment-resource-group-name` parameter specifies the resource group used to store the managed resources. If the parameter isn't specified, the managed resources are stored in the subscription scope.

---

To create a deployment stack at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzManagmentGroupDeploymentStack `
  -Name '<deployment-stack-name>' `
  -Location '<location>' `
  -TemplateFile '<bicep-file-name>' `
  -DeploymentSubscriptionId '<subscription-id>' `
  -DenySettingsMode none
```

The `deploymentSubscriptionId` parameter specifies the subscription used to store the managed resources. If the parameter isn't specified, the managed resources are stored in the management group scope.

# [CLI](#tab/azure-cli)

```azurecli
az stack mg create \
  --name <deployment-stack-name> \
  --location <location> \
  --template-file <bicep-file-name> \
  --deployment-subscription-id <subscription-id> \
  --deny-settings-mode none
```

The `deployment-subscription` parameter specifies the subscription used to store the managed resources. If the parameter isn't specified, the managed resources are stored in the management group scope.

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

To update a deployment stack, which may involve adding or deleting a managed resource, you need to make changes to the underlying Bicep files. Once the modifications are made, you have two options to update the deployment stack: run the update command or rerun the create command.

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
  -DeploymentSubscriptionId '<subscription-id>' `
  -DenySettingsMode none
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg create \
  --name <deployment-stack-name> \
  --location <location> \
  --template-file <bicep-file-name> \
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

A detached resource (or unmanaged resource) refers to a resource that isn't tracked or managed by the deployment stack but still exists within Azure.

To instruct Azure to delete unmanaged resources, update the stack with the create stack command with one of the following parameters. For more information, see [Create deployment stack](#create-deployment-stacks).

# [PowerShell](#tab/azure-powershell)

- `DeleteAll`: use delete rather than detach for managed resources and resource groups.
- `DeleteResources`: use delete rather than detach for managed resources only.
- `DeleteResourceGroups`: use delete rather than detach for managed resource groups only. It's invalid to use `DeleteResourceGroups` by itself. `DeleteResourceGroups` must be used together with `DeleteResources`.

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

- `delete-all`: use delete rather than detach for managed resources and resource groups.
- `delete-resources`: use delete rather than detach for managed resources only.
- `delete-resource-groups`: use delete rather than detach for managed resource groups only. It's invalid to use `delete-resource-groups` by itself. `delete-resource-groups` must be used together with `delete-resources`.

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

Even if you specify the delete all switch, if there are unmanaged resources within the resource group where the deployment stack is located, both the unmanaged resource and the resource group itself won't not be deleted.

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

When creating a deployment stack, it's possible to assign a specific type of permissions to the managed resources, which prevents their deletion by unauthorized security principals. These settings are refereed as deny settings. You want to store the stack at a parent scope.

# [PowerShell](#tab/azure-powershell)

The Azure PowerShell includes these parameters to customize the deny assignment:

- `DenySettingsMode`: Defines the operations that are prohibited on the managed resources to safeguard against unauthorized security principals attempting to delete or update them. This restriction applies to everyone unless explicitly granted access. The values include: `None`, `DenyDelete`, and `DenyWriteAndDelete`.
- `DenySettingsApplyToChildScopes`: Deny settings are applied to nested resources under managed resources.
- `DenySettingsExcludedActions`: List of role-based management operations that are excluded from the deny settings. Up to 200 actions are permitted.
- `DenySettingsExcludedPrincipals`: List of Azure Active Directory (Azure AD) principal IDs excluded from the lock. Up to five principals are permitted.

# [CLI](#tab/azure-cli)

The Azure CLI includes these parameters to customize the deny assignment:

- `deny-settings-mode`: Defines the operations that are prohibited on the managed resources to safeguard against unauthorized security principals attempting to delete or update them. This restriction applies to everyone unless explicitly granted access. The values include: `none`, `denyDelete`, and `denyWriteAndDelete`.
- `deny-settings-apply-to-child-scopes`: Deny settings are applied to nested resources under managed resources.
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

Use the `DeploymentResourceGroupName` parameter to specify the resource group name at which the deployment stack is created. If a scope isn't specified, it uses the scope of the deployment stack.

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

Use the `deployment-resource-group` parameter to specify the resource group at which the deployment stack is created. If a scope isn't specified, it uses the scope of the deployment stack.

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

Use the `DeploymentSubscriptionId ` parameter to specify the subscription ID at which the deployment stack is created. If a scope isn't specified, it uses the scope of the deployment stack.

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

Use the `deployment-subscription ` parameter to specify the subscription ID at which the deployment stack is created. If a scope isn't specified, it uses the scope of the deployment stack.

---

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
az stack group export \
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
az stack sub export \
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
az stack mg export \
  --name <deployment-stack-name> \
  --management-group-id <management-group-id>
```

---

## Next steps

To go through a quickstart, see [Quickstart: create a deployment stack](./quickstart-create-deployment-stacks.md).
