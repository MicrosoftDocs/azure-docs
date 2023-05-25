---
title: Create & deploy deployment stacks in Bicep
description: Describes how to create deployment stacks in Bicep .
ms.topic: conceptual
ms.date: 05/02/2023
---

# Deployment stacks (Preview)

A deployment stack is an Azure resource type that allows for the management of a group of Azure resources as an atomic unit. When deploying resources with a Bicep or ARM template, this resource type provides management capabilities. As with other Azure resources, access to the deployment stack resource can be limited using Azure role-based access control (Azure RBAC). To create and update a deployment stack, use Azure CLI, Azure PowerShell, or the Portal with Bicep files. These Bicep files are transpiled into ARM JSON templates, which are then deployed as a deployment object by the stack. The deployment stack provides additional capabilities to the familiar deployment resources, making it a superset of those capabilities.

`Microsoft.Resources/deploymentStacks` is the resource type for deployment stacks. It consists of a main template that can perform 1-to-many updates across scopes to the resources it describes, as well as block any unwanted changes to those resources.

When planning your deployment and determining which resource groups should be part of the same stack, it's important to consider the management lifecycle of those resources, which includes creation, updating, and deletion. For instance, suppose you need to provision some test VMs for various application teams across different resource group scopes. In this case, a deployment stack can be utilized to easily create these test environments and update the test VM configurations through subsequent updates to the deployment stack. After completing the project, it may be necessary to remove or delete any resources that were created, such as the test VMs. With a deployment stack, these managed resources can be deleted by specifying the appropriate delete flag, which saves significant time when cleaning up environments since a single update to the stack resource is performed instead of individually updating or removing each test VM across different resource group scopes.

To create your first deployment stack, work through [Quickstart: create deployment stack](./quickstart-create-deployment-stacks.md).

## Why use deployment stacks?

Deployment stacks provide the following benefits:

- The ease of provisioning and managing resources across various [scopes](./deploy-to-resource-group.md) as a single atomic unit.
- The option to prevent undesirable changes to managed resources using the `DenySettingsMode`.
- The ability to rapidly clean up environments by setting appropriate delete flags on a Deployment stack update.
- The ability to use standard templates, including [Bicep](./overview.md), [ARM templates](../templates/overview.md), or [Template specs](./template-specs.md) for your Deployment stacks.

### Known issues (remove this section)

jgao: not sure we need to list the known issues.

The `2022-08-01-preview` private preview API version has the following limitations:

- We don't recommended using deployment stacks in production environments because the service is still in preview. Therefore, you should expect breaking changes in future releases.
- Resource group delete currently bypasses deny assignments.
- Implicitly created resources aren't managed by the stack (therefore, no deny assignments or cleanup is possible)
- The `denyDelete` resource locking method is available in private preview. The `denyWriteAndDelete` method will be available in the future.
- `Whatif` isn't available in the private preview. `Whatif` allows you to evaluate changes before actually submitting the deployment to ARM.
- Deployment stacks are currently limited to the resource group and subscription management scopes for the private preview. At this time management group-scoped Azure PowerShell and Azure CLI commands exist; they just aren't usable yet.
- A deployment stack doesn't guarantee the protection of `secureString` and `secureObject` parameters; this release returns them in plain text when requested.

## Create deployment stacks

You can create deployment stacks at different scopes.  The create deployment stack commands can also be used to [update deployment stacks](#update-deployment-stacks).

To create a deployment stack at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeploymentStack `
  -Name '<deployment-stack-name>' `
  -ResourceGroupName '<resource-group-name>' `
  -TemplateFile '<bicep-file-name>' `
  -DenySettingsMode none
```

For more information about `DenySettingsMode`, see [Protect managed resources against deletion](#protect-managed-resources-against-deletion).

# [CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name <deployment-stack-name> \
  --resource-group <resource-group-name> \
  --template-file <bicep-file-name> \
  --deny-settings-mode none
```

For more information about `deny-settings-mode`, see [Protect managed resources against deletion](#protect-managed-resources-against-deletion)/

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

For more information about `DenySettingsMode`, see [Protect managed resources against deletion](#protect-managed-resources-against-deletion)/

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

For more information about `deny-settings-mode`, see [Protect managed resources against deletion](#protect-managed-resources-against-deletion)/

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

The `DeploymentResourceGroupName` parameter specifies the resource group used to store the deployment stack resources. If you don't specify a resource group name, the deployment stack service will create a new resource group for you. For more information about `DenySettingsMode`, see [Protect managed resources against deletion](#protect-managed-resources-against-deletion)/

# [CLI](#tab/azure-cli)

```azurecli
az stack sub create \
  --name <deployment-stack-name> \
  --location <location> \
  --template-file <bicep-file-name> \
  --deployment-resource-group-name <resource-group-name> \
  --deny-settings-mode none
```

The `deployment-resource-group-name` parameter specifies the resource group used to store the deployment stack resources. If you don't specify a resource group name, the deployment stack service will create a new resource group for you. For more information about `deny-settings-mode`, see [Protect managed resources against deletion](#protect-managed-resources-against-deletion)/

---

## List deployment stacks

List deployment stack resources at the resource group scope:

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

List deployment stack resources at the management group scope:

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

List deployment stack resources at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzSubscriptionDeploymentStack
```

# [CLI](#tab/azure-cli)

```azurecli
az stack sub list
```

---

## Update deployment stacks

To update a deployment stack, modify the underlying Bicep files, and then

- run the update deployment stack command
- re-run the create deployment stack command

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

- `-DeleteAll`: Flag to indicate delete rather than detach for managed resources and resource groups.
- `-DeleteResources`: Flag to indicate delete rather than detach for managed resources only.
- `-DeleteResourceGroups`: Flag to indicate delete rather than detach for managed resource groups only.

For example:

```azurepowershell
New-AzSubscriptionDeploymentStack `
  -Name '<deployment-stack-name' `
  -TemplateFile '<bicep-file-name>' `
  -DeleteAll
```

jgao: include  -DenySettingsMode none here?

# [CLI](#tab/azure-cli)

- `--delete-all`: Flag to indicate delete rather than detach for managed resources and resource groups.
- `--delete-resources`: Flag to indicate delete rather than detach for managed resources only.
- `--delete-resource-groups`: Flag to indicate delete rather than detach for managed resource groups only.

For example:

```azurecli
az stack sub create `
  --name <deployment-stack-name> `
  --location <location> `
  --template-file <bicep-file-name> `
  --delete-resources
```

---

> [!WARNING]
> When deleting resource groups with either the `DeleteAll` or `DeleteResourceGroups` properties, the managed resource groups and all the resources contained within them will also be deleted.

## Delete deployment stacks

If you run the delete commands without the delete parameters, the unmanaged resources will be detached but not deleted. To delete the unmanaged resources, use the following switches:

# [PowerShell](#tab/azure-powershell)

- `-DeleteAll`: Delete both the resources and the resource groups.
- `-DeleteResources`: Delete the resources only.
- `-DeleteResourceGroups`: Delete the resource groups only.

# [CLI](#tab/azure-cli)

- `--delete-all`: Delete both the resources and the resource groups.
- `--delete-resources`: Delete the resources only.
- `--delete-resource-groups`: Delete the resource groups only.

---

Delete deployment stack resources at the resource group scope:

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

Delete deployment stack resources at the management group scope:

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

Delete deployment stack resources at the subscription scope:

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

## View managed resources in deployment stack

During public preview, the deployment stack service doesn't yet have an Azure portal graphical user interface (GUI). To view the managed resources inside a deployment stack, use the following Azure Powershell/Azure CLI commands:

View managed resources at the resource group scope:

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

View managed resources at the management group scope:

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

View managed resources at the subscription scope:

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

## Add resources to deployment stack

See [Update deployment stacks](#update-deployment-stacks).

## Delete managed resources from deployment stack

See [Update deployment stacks](#update-deployment-stacks).

## Protect managed resources against deletion

When creating a deployment stack, it is possible to assign a specific type of permissions to the managed resources, which prevents their deletion by unauthorized security principals.

# [PowerShell](#tab/azure-powershell)

To manage deployment stack deny assignments with Azure PowerShell, include one of the following `-DenySettingsMode` parameters of the `New-AzSubscriptionDeploymentStack` command or the `Set-AzSubscriptionDeploymentStack` command:

- `None`: Do not apply a lock to managed resources
- `DenyDelete`: Prevent delete operations
- `DenyWriteAndDelete`: Prevent deletion or modification

For example:

```azurepowershell
New-AzSubscriptionDeploymentStack `
  -Name '<deployment-stack-name>' `
  -TemplateFile '<bicep-file-name>' `
  -DenySettingsMode 'DenyDelete'
```

The Azure PowerShell interface also includes these parameters to customize the deny assignment:

- `-DenySettingsExcludedPrincipals`: List of AAD principal IDs excluded from the lock. Up to 5 principals are permitted.
- `-DenySettingsApplyToChildScopes`: Apply to child scopes.
- `-DenySettingsExcludedActions`: List of role-based management operations that are excluded from the denySettings. Up to 200 actions are permitted.
- `-DenySettingsMode`: Mode for DenySettings. Possible values include: 'denyDelete', 'denyWriteAndDelete', and 'none'.

# [CLI](#tab/azure-cli)

The `--deny-delete` CLI parameter places a special type of lock on managed resources that prevents them from deletion by unauthorized security principals (be default, everyone).

Following are the relevant `az stack sub create` parameters:

- `deny-settings-mode`: Defines which operations are denied on resources managed by the stack: `denyWrite`, `denyWriteAndDelete`, or `none`.
- `deny-settings-excluded-principals`: Comma-separated list of Azure Active Directory (Azure AD) principal IDs excluded from the lock. Up to five principals are allowed
- `deny-settings-apply-to-child-scopes`: Deny settings will be applied to child Azure management scopes
- `deny-settings-excluded-actions`: List of role-based access control (RBAC) management operations excluded from the deny settings. Up to 200 actions are allowed

jgao: the last parameter is not found in the help file.  Please verify.

To apply a `denyDelete` lock to your deployment stack, update your deployment stack definition, specifying the appropriate parameter(s):

```azurecli
az stack sub create \
  --name <deployment-stack-name> \
  --location <location> \
  --template-file <bicep-file-name> \
  --deny-settings-mode denyDelete
```

jgao: use which value for deny-settings-mode?  none or denyDelete?

---

## Detach managed resources from deployment stack

By default, deployment stacks detach and don't delete unmanaged resources when they're no longer contained within the stack's management scope. For more information, see [Update deployment stacks](#update-deployment-stacks).

## Export managed resources from deployment stack

You can export the resources from a deployment stack to a Bicep template file.

To export a deployment stack at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Export-AzResourceGroupDeploymentStack `
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

To export a deployment stack at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Export-AzManagmentGroupDeploymentStack `
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

To export a deployment stack at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Export-AzSubscriptionDeploymentStack `
  -name '<deployment-stack-name>'
```

# [CLI](#tab/azure-cli)

```azurecli
az stack sub export \
  --name <deployment-stack-name>
```

---

## Troubleshooting (Discuss with the dev team about this secion)

jgao: please provide the cli commands for this section.

Deployment stacks contain some diagnostic information that isn't displayed by default. When troubleshooting problems with an update, save the objects to analyze them further:

```azurepowershell
$stack =  Get-AzSubscriptionDeploymentStack `
            -Name '<deployment-stack-name>'
```

There may be more than one level for the error messages, to easily see them all at once:

```powershell
$stack.Error | ConvertTo-Json -Depth 50
```

If a deployment was created and the failure occurred during deployment, you can retrieve details of the deployment using the deployment commands.  For example if your template was deployed to a resource group:

```azurepowershell
Get-AzResourceGroupDeployment -Id $stack.DeploymentId
```

You can get more information from the [deployment operations](../templates/deployment-history.md#deployment-operations-and-error-message) as needed.

## Next steps

To go through a quickstart, see [Quickstart: create a deployment stack](./quickstart-create-deployment-stacks.md).
