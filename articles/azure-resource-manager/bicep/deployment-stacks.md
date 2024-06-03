---
title: Create & deploy deployment stacks in Bicep
description: Describes how to create deployment stacks in Bicep.
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-bicep
ms.date: 05/31/2024
---

# Deployment stacks

An Azure deployment stack is a resource that enables you to manage a group of Azure resources as a single, cohesive unit. When you submit a Bicep file or an ARM JSON template to a deployment stack, it defines the resources that the stack manage. If a resource previously included in the template is removed, it will either be detached or deleted based on the specified _actionOnUnmanage_ behavior of the deployment stack. Access to the deployment stack can be restricted using Azure role-based access control (Azure RBAC), similar to other Azure resources.

To create and update a deployment stack, you can utilize Azure CLI, Azure PowerShell, or the Azure portal along with Bicep files. These Bicep files are transpiled into ARM JSON templates, which are then deployed as a deployment object by the stack. The deployment stack offers additional capabilities beyond the [familiar deployment resources](./deploy-cli.md), serving as a superset of those capabilities.

`Microsoft.Resources/deploymentStacks` is the resource type for deployment stacks. It consists of a main template that can perform 1-to-many updates across scopes to the resources it describes, and block any unwanted changes to those resources.

When planning your deployment and determining which resource groups should be part of the same stack, it's important to consider the management lifecycle of those resources, which includes creation, updating, and deletion. For instance, suppose you need to provision some test virtual machines(VM) for various application teams across different resource group scopes. In this case, a deployment stack can be utilized to  create these test environments and update the test VM configurations through subsequent updates to the deployment stack. After completing the project, it may be necessary to remove or delete any resources that were created, such as the test VMs. By utilizing a deployment stack, the managed resources can be easily removed by specifying the appropriate delete flag. This streamlined approach saves time during environment cleanup, as it involves a single update to the stack resource rather than individually modifying or removing each test VM across various resource group scopes.

Deployment stacks requires Azure PowerShell [version 12.0.0 or later](/powershell/azure/install-az-ps) or Azure CLI [version 2.61.0 or later](/cli/azure/install-azure-cli).

To create your first deployment stack, work through [Quickstart: create deployment stack](./quickstart-create-deployment-stacks.md).

## Why use deployment stacks?

Deployment stacks provide the following benefits:

- Streamlined provisioning and management of resources across different scopes as a unified entity.
- Prevention of undesired modifications to managed resources via [deny settings](#protect-managed-resources-against-deletion).
- Efficient environment cleanup using delete flags during deployment stack updates.
- Use of standard templates such as Bicep, ARM templates, or Template specs for your deployment stacks.

### Known limitations

- Implicitly created resources aren't managed by the stack. Therefore, no deny-assignments or cleanup is possible.
- Deny-assignments don't support tags.
- Deny-assignments aren't supported at the management group scope. However, they're supported in a management group stack if the deployment is pointed at the subscription scope.
- Deployment stacks can't delete Key vault secrets. If you're removing key vault secrets from a template, make sure to also execute the deployment stack update/delete command with detach mode.

### Known issues

- Deleting resource groups currently bypasses deny-assignments. When creating a deployment stack in the resource group scope, the Bicep file doesn't contain the definition for the resource group. Despite the deny-assignment setting, it's possible to delete the resource group and its contained stack. However, if a [lock](../management/lock-resources.md) is active on any resource within the group, the delete operation fails.
- The [What-if](./deploy-what-if.md) support isn't yet available.
- A management group-scoped stack is restricted from deploying to another management group. It can only deploy to the management group of the stack itself or to a child subscription.
- The PowerShell command help lists a `DeleteResourcesAndResourcesGroups` value for the `ActionOnUnmanage` switch. When this value is used, the command detaches the managed resources and the resource groups. This value will be removed in the next update. Don't use this value.
- In some cases, the New and Set cmdlets of Azure PowerShell may return a generic template validation error that is not clearly actionable. This bug will be fixed in the next release, but for now, if the error is unclear, you can run the cmdlet in debug mode to see a more detailed error in the raw response.

## Built-in roles

> [!WARNING]
> Enforcement of the RBAC permission [Microsoft.Resources/deploymentStacks/manageDenySetting/action](/azure/role-based-access-control/permissions/management-and-governance) is rolling out across regions, including Government Clouds. 

There are two built-in roles for deployment stack:

- **Azure Deployment Stack Contributor**: Allows users to manage deployment stacks, but can't create or delete deny-assignments within the deployment stacks.
- **Azure Deployment Stack Owner**: Allows users to manage deployment stacks, including those with deny-assignments.

## Create deployment stacks

A deployment stack resource can be created at resource group, subscription, or management group scope. The template passed into a deployment stack defines the resources to be created or updated at the target scope specified for the template deployment.

- A stack at resource group scope can deploy the template passed-in to the same resource group scope where the deployment stack exists.
- A stack at subscription scope can deploy the template passed-in to a resource group scope (if specified) or the same subscription scope where the deployment stack exists.
- A stack at management group scope can deploy the template passed-in to the subscription scope specified.

It's important to note that where a deployment stack exists, so is the deny-assignment created with the deny settings capability. For example, by creating a deployment stack at subscription scope that deploys the template to resource group scope and with deny settings mode `DenyDelete`, you can easily provision managed resources to the specified resource group and block delete attempts to those resources. By using this approach, you also enhance the security of the deployment stack by separating it at the subscription level, as opposed to the resource group level. This separation ensures that the developer teams working with the provisioned resources only have visibility and write access to the resource groups, while the deployment stack remains isolated at a higher level. This minimizes the number of users that can edit a deployment stack and make changes to its deny-assignment. For more information, see [Protect managed resource against deletion](#protect-managed-resources-against-deletion).

The create-stack commands can also be used to [update deployment stacks](#update-deployment-stacks).

To create a deployment stack at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -ResourceGroupName "<resource-group-name>" `
  -TemplateFile "<bicep-file-name>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "none"
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name '<deployment-stack-name>' \
  --resource-group '<resource-group-name>' \
  --template-file '<bicep-file-name>' \
  --action-on-unmanage 'detachAll'
  --deny-settings-mode 'none'
```

# [Portal](#tab/azure-portal)

Currently not implemented.

---

To create a deployment stack at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzSubscriptionDeploymentStack `
  -Name "<deployment-stack-name>" `
  -Location "<location>" `
  -TemplateFile "<bicep-file-name>" `
  -DeploymentResourceGroupName "<resource-group-name>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "none"
```

The `DeploymentResourceGroupName` parameter specifies the resource group used to store the managed resources. If the parameter isn't specified, the managed resources are stored in the subscription scope.

# [CLI](#tab/azure-cli)

```azurecli
az stack sub create \
  --name '<deployment-stack-name>' \
  --location '<location>' \
  --template-file '<bicep-file-name>' \
  --deployment-resource-group' <resource-group-name>' \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'none'
```

The `deployment-resource-group` parameter specifies the resource group used to store the managed resources. If the parameter isn't specified, the managed resources are stored in the subscription scope.

# [Portal](#tab/azure-portal)

Currently not implemented.

---

To create a deployment stack at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzManagmentGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -Location "<location>" `
  -TemplateFile "<bicep-file-name>" `
  -DeploymentSubscriptionId "<subscription-id>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "none"
```

The `deploymentSubscriptionId` parameter specifies the subscription used to store the managed resources. If the parameter isn't specified, the managed resources are stored in the management group scope.

# [CLI](#tab/azure-cli)

```azurecli
az stack mg create \
  --name '<deployment-stack-name>' \
  --location '<location>' \
  --template-file '<bicep-file-name>' \
  --deployment-subscription '<subscription-id>' \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'none'
```

The `deployment-subscription` parameter specifies the subscription used to store the managed resources. If the parameter isn't specified, the managed resources are stored in the management group scope.

# [Portal](#tab/azure-portal)

Currently not implemented.

---

## List deployment stacks

To list deployment stack resources at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResourceGroupDeploymentStack `
  -ResourceGroupName "<resource-group-name>"
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group list \
  --resource-group '<resource-group-name>'
```

# [Portal](#tab/azure-portal)

1. From the Azure portal, open the resource group that contains the deployment stacks.
1. From the left menu, select `Deployment stacks` to list the deployment stacks deployed to the resource group.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-group-list-stacks.png" alt-text="Screenshot of listing deployment stacks at the resource group scope.":::

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

# [Portal](#tab/azure-portal)

1. From the Azure portal, open the subscription that contains the deployment stacks.
1. From the left menu, select `Deployment stacks` to list the deployment stacks deployed to the subscription.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-sub-list-stacks.png" alt-text="Screenshot of listing deployment stacks at the subscription scope.":::

---

To list deployment stack resources at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzManagementGroupDeploymentStack `
  -ManagementGroupId "<management-group-id>"
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg list \
  --management-group-id '<management-group-id>'
```

# [Portal](#tab/azure-portal)

Currently not implemented.

---

## Update deployment stacks

To update a deployment stack, which may involve adding or deleting a managed resource, you need to make changes to the underlying Bicep files. Once the modifications are made, you have two options to update the deployment stack: run the update command or rerun the create command.

The list of managed resources can be fully controlled through the infrastructure as code (IaC) design pattern.

### Use the Set command

To update a deployment stack at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzResourceGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -ResourceGroupName "<resource-group-name>" `
  -TemplateFile "<bicep-file-name>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "none"
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name '<deployment-stack-name>' \
  --resource-group '<resource-group-name>' \
  --template-file '<bicep-file-name>' \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'none'
```

> [!NOTE]
> Azure CLI doesn't have a deployment stack set command.  Use the New command instead.

# [Portal](#tab/azure-portal)

Currently not implemented.

---

To update a deployment stack at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzSubscriptionDeploymentStack `
  -Name "<deployment-stack-name>" `
  -Location "<location>" `
  -TemplateFile "<bicep-file-name>" `
  -DeploymentResourceGroupName "<resource-group-name>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "none"
```

The `DeploymentResourceGroupName` parameter specifies the resource group used to store the deployment stack resources. If you don't specify a resource group name, the deployment stack service creates a new resource group for you.

# [CLI](#tab/azure-cli)

```azurecli
az stack sub create \
  --name '<deployment-stack-name>' \
  --location '<location>' \
  --template-file '<bicep-file-name>' \
  --deployment-resource-group '<resource-group-name>' \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'none'
```

# [Portal](#tab/azure-portal)

Currently not implemented.

---

To update a deployment stack at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzManagmentGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -Location "<location>" `
  -TemplateFile "<bicep-file-name>" `
  -DeploymentSubscriptionId "<subscription-id>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "none"
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg create \
  --name '<deployment-stack-name>' \
  --location '<location>' \
  --template-file '<bicep-file-name>' \
  --deployment-subscription '<subscription-id>' \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'none'
```

# [Portal](#tab/azure-portal)

Currently not implemented.

---

### Use the New command

You get a warning similar to the following one:

```warning
The deployment stack 'myStack' you're trying to create already exists in the current subscription/management group/resource group. Do you want to overwrite it? Detaching: resources, resourceGroups (Y/N)
```

For more information, see [Create deployment stacks](#create-deployment-stacks).

### Control detachment and deletion

A detached resource (or unmanaged resource) refers to a resource that isn't tracked or managed by the deployment stack but still exists within Azure.

To instruct Azure to delete unmanaged resources, update the stack with the create stack command with the following switch. For more information, see [Create deployment stack](#create-deployment-stacks).

# [PowerShell](#tab/azure-powershell)

Use the `ActionOnUnmanage` switch to define what happens to resources that are no longer managed after a stack is updated or deleted. Allowed values are:

- `deleteAll`: use delete rather than detach for managed resources and resource groups.
- `deleteResources`: use delete rather than detach for managed resources only.
- `detachAll`: detach the managed resources and resource groups.

For example:

```azurepowershell
New-AzSubscriptionDeploymentStack `
  -Name "<deployment-stack-name" `
  -TemplateFile "<bicep-file-name>" `
  -DenySettingsMode "none" `
  -ActionOnUnmanage "deleteAll" 
```

# [CLI](#tab/azure-cli)

Use the `action-on-unmanage` switch to define what happens to resources that are no longer managed after a stack is updated or deleted. Allowed values are: 

- `deleteAll`: use delete rather than detach for managed resources and resource groups.
- `deleteResources`: use delete rather than detach for managed resources only.
- `detachAll`: detach the managed resources and resource groups.

For example:

```azurecli
az stack sub create `
  --name '<deployment-stack-name>' `
  --location '<location>' `
  --template-file '<bicep-file-name>' `
  --action-on-unmanage 'deleteAll' `
  --deny-settings-mode 'none' 
```

# [Portal](#tab/azure-portal)

Currently not implemented.

---

> [!WARNING]
> When deleting resource groups with the action-on-unmanage switch set to `DeleteAll`, the managed resource groups and all the resources contained within them will also be deleted.

### Handle the stack-out-of-sync error

When updating or deleting a deployment stack, you might encounter the following stack-out-of-sync error, indicating the stack resource list isn't correctly synchronized. 

```error
The deployment stack '{0}' may not have an accurate list of managed resources. To ensure no resources are accidentally deleted, please check that the managed resource list does not have any additional values. If there is any uncertainty, we recommend redeploying the stack with the same template and parameters as the current iteration. To bypass this warning, please specify the 'BypassStackOutOfSyncError' flag.
```

You can obtain a list of the resources from the Azure portal or redeploy the currently deployed Bicep file with the same parameters. The output shows the managed resources

# [PowerShell](#tab/azure-powershell)

```output
...
Resources: /subscriptions/9e8db52a-71bc-4871-9007-1117bf304622/resourceGroups/demoRg/providers/Microsoft.Network/virtualNetworks/vnetthmimleef5fwk
           /subscriptions/9e8db52a-71bc-4871-9007-1117bf304622/resourceGroups/demoRg/providers/Microsoft.Storage/storageAccounts/storethmimleef5fwk
```

# [CLI](#tab/azure-cli)

```output
"resources": [
  {
    "denyStatus": "none",
    "id": "/subscriptions/9e8db52a-71bc-4871-9007-1117bf304622/resourceGroups/demoRg/providers/Microsoft.Network/virtualNetworks/vnetthmimleef5fwk",
    "resourceGroup": "demoRg",
    "status": "managed"
  },
  {
    "denyStatus": "none",
    "id": "/subscriptions/9e8db52a-71bc-4871-9007-1117bf304622/resourceGroups/demoRg/providers/Microsoft.Storage/storageAccounts/storethmimleef5fwk",
    "resourceGroup": "demoRg",
    "status": "managed"
  }
]
```

# [Portal](#tab/azure-portal)

1. Open the Azure portal.
1. Open the Resource group that contains the stack.
1. From the left menu, expand **Settings**, and then select **Deployment stacks**.
1. Select the stack name to open the stack.

---

After you have reviewed and verified the list of resources in the stack, you can rerun the command with the `BypassStackOutOfSyncError` switch in Azure PowerShell (or `bypass-stack-out-of-sync-error` in Azure CLI). This switch should only be used after thoroughly review the list of resources in the stack before rerunning the command. This switch should never be used by default.

## Delete deployment stacks

# [PowerShell](#tab/azure-powershell)

The `ActionOnUnmanage` switch defines the action to the resources that are no longer managed. The switch has the following values: 

- `DeleteAll`: Delete both the resources and the resource groups.
- `DeleteResources`: Delete the resources only.
- `DetachAll`: Detach the resources.

# [CLI](#tab/azure-cli)

The `action-on-unmanage` switch defines the action to the resources that are no longer managed. The switch has the following values: 

- `delete-all`: Delete both the resources and the resource groups.
- `delete-resources`: Delete the resources only.
- `detach-all`: Detach the resources.

# [Portal](#tab/azure-portal)

Select one of the delete flags when you delete a deployment stack.

:::image type="content" source="./media/deployment-stacks/deployment-stack-portal-update-behavior.png" alt-text="Screenshot of portal update behavior (delete flags).":::

---

Even if you specify the delete-all switch, unmanaged resources within the resource group where the deployment stack is located prevents both the unmanaged resources and the resource group itself from being deleted.

To delete deployment stack resources at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroupDeploymentStack `
  -name "<deployment-stack-name>" `
  -ResourceGroupName "<resource-group-name>" `
  -ActionOnUnmanage "<deleteAll/deleteResources/detachAll>"
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group delete \
  --name '<deployment-stack-name>' \
  --resource-group '<resource-group-name>' \
  --action-on-unmanage '<deleteAll/deleteResources/detachAll>'
```

# [Portal](#tab/azure-portal)

1. From the Azure portal, open the resource group that contains the deployment stacks.
1. From the left menu, select `Deployment stacks`, select the deployment stack to be deleted, and then select `Delete stack`.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-group-delete-stacks.png" alt-text="Screenshot of deleting deployment stacks at the resource group scope.":::

1. Select an `Update behavior`, and then select `Next`.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-group-delete-stack-update-behavior.png" alt-text="Screenshot of update behavior (delete flags) for deleting resource group scope deployment stacks.":::

---

To delete deployment stack resources at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzSubscriptionDeploymentStack `
  -Name "<deployment-stack-name>" `
  -ActionOnUnmanage "<deleteAll/deleteResources/detachAll>"
```

# [CLI](#tab/azure-cli)

```azurecli
az stack sub delete \
  --name '<deployment-stack-name>' \
  --action-on-unmanage '<deleteAll/deleteResources/detachAll>'
```

# [Portal](#tab/azure-portal)

1. From the Azure portal, open the subscription that contains the deployment stacks.
1. From the left menu, select `Deployment stacks`, select the deployment stack to be deleted, and then select `Delete stack`.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-sub-delete-stacks.png" alt-text="Screenshot of deleting deployment stacks at the subscription scope.":::

1. Select an `Update behavior` (delete flag), and then select `Next`.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-sub-delete-stack-update-behavior.png" alt-text="Screenshot of update behavior (delete flags) for deleting subscription scope deployment stacks.":::
---

To delete deployment stack resources at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzManagementGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -ManagementGroupId "<management-group-id>" `
  -ActionOnUnmanage "<deleteAll/deleteResources/detachAll>"
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg delete \
  --name '<deployment-stack-name>' \
  --management-group-id '<management-group-id>' \
  --action-on-unmanage '<deleteAll/deleteResources/detachAll>'
```

# [Portal](#tab/azure-portal)

Currently not implemented.

---

## View managed resources in deployment stack

The deployment stack service doesn't yet have an Azure portal graphical user interface (GUI). To view the managed resources inside a deployment stack, use the following Azure Powershell/Azure CLI commands:

To view managed resources at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzResourceGroupDeploymentStack -Name "<deployment-stack-name>" -ResourceGroupName "<resource-group-name>").Resources
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group list \
  --name '<deployment-stack-name>' \
  --resource-group '<resource-group-name>' \
  --output 'json'
```

# [Portal](#tab/azure-portal)

1. From the Azure portal, open the resource group that contains the deployment stacks.
1. From the left menu, select `Deployment stacks`.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-group-list-stacks.png" alt-text="Screenshot of listing managed resources at the resource group scope.":::

1. Select one of the deployment stacks to view the managed resources of the deployment stack.

---

To view managed resources at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzSubscriptionDeploymentStack -Name "<deployment-stack-name>").Resources
```

# [CLI](#tab/azure-cli)

```azurecli
az stack sub show \
  --name '<deployment-stack-name>' \
  --output 'json'
```

# [Portal](#tab/azure-portal)

1. From the Azure portal, open the subscription that contains the deployment stacks.
1. From the left menu, select `Deployment stacks` to list the deployment stacks deployed to the subscription.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-sub-list-stacks.png" alt-text="Screenshot of listing managed resources at the subscription scope.":::

1. Select the deployment stack to list the managed resources.

---

To view managed resources at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzManagementGroupDeploymentStack -Name "<deployment-stack-name>" -ManagementGroupId "<management-group-id>").Resources
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg show \
  --name '<deployment-stack-name>' \
  --management-group-id '<management-group-id>' \
  --output 'json'
```

# [Portal](#tab/azure-portal)

Currently not implemented.

---

## Add resources to deployment stack

To add a managed resource, add the resource definition to the underlying Bicep files, and then run the update command or rerun the create command. For more information, see [Update deployment stacks](#update-deployment-stacks).

## Delete managed resources from deployment stack

To delete a managed resource, remove the resource definition from the underlying Bicep files, and then run the update command or rerun the create command. For more information, see [Update deployment stacks](#update-deployment-stacks).

## Protect managed resources against deletion

When creating a deployment stack, it's possible to assign a specific type of permissions to the managed resources, which prevents their deletion by unauthorized security principals. These settings are referred to as deny settings. You want to store the stack at a parent scope.

> [!NOTE]
> The latest release requires specific permissions at the stack scope in order to:
>
> - Create or update a deployment stack and set the deny setting to a value other than "None".
> - Update or delete a deployment stack with an existing deny setting of something other than "None"
>
> Use the [built-in roles](#built-in-roles) to grant the permissions.

# [PowerShell](#tab/azure-powershell)

The Azure PowerShell includes these parameters to customize the deny-assignment:

- `DenySettingsMode`: Defines the operations that are prohibited on the managed resources to safeguard against unauthorized security principals attempting to delete or update them. This restriction applies to everyone unless explicitly granted access. The values include: `None`, `DenyDelete`, and `DenyWriteAndDelete`.
- `DenySettingsApplyToChildScopes`: Deny settings are applied to nested resources under managed resources.
- `DenySettingsExcludedAction`: List of role-based management operations that are excluded from the deny settings. Up to 200 actions are permitted.
- `DenySettingsExcludedPrincipal`: List of Microsoft Entra principal IDs excluded from the lock. Up to five principals are permitted.

# [CLI](#tab/azure-cli)

The Azure CLI includes these parameters to customize the deny-assignment:

- `deny-settings-mode`: Defines the operations that are prohibited on the managed resources to safeguard against unauthorized security principals attempting to delete or update them. This restriction applies to everyone unless explicitly granted access. The values include: `none`, `denyDelete`, and `denyWriteAndDelete`.
- `deny-settings-apply-to-child-scopes`: Deny settings are applied to nested resources under managed resources.
- `deny-settings-excluded-actions`: List of role-based access control (RBAC) management operations excluded from the deny settings. Up to 200 actions are allowed.
- `deny-settings-excluded-principals`: List of Microsoft Entra principal IDs excluded from the lock. Up to five principals are allowed.

# [Portal](#tab/azure-portal)

Currently not implemented.

---

To apply deny settings at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -ResourceGroupName "<resource-group-name>" `
  -TemplateFile "<bicep-file-name>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "denyDelete" `
  -DenySettingsExcludedAction "Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete" `
  -DenySettingsExcludedPrincipal "<object-id>,<object-id>"
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name '<deployment-stack-name>' \
  --resource-group '<resource-group-name>' \
  --template-file '<bicep-file-name>' \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'denyDelete' \
  --deny-settings-excluded-actions 'Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete' \
  --deny-settings-excluded-principals '<object-id> <object-id>'
```

# [Portal](#tab/azure-portal)

Currently not implemented.

---

To apply deny settings at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzSubscriptionDeploymentStack `
  -Name "<deployment-stack-name>" `
  -Location "<location>" `
  -TemplateFile "<bicep-file-name>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "denyDelete" `
  -DenySettingsExcludedAction "Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete" `
  -DenySettingsExcludedPrincipal "<object-id>,<object-id>"
```

Use the `DeploymentResourceGroupName` parameter to specify the resource group name at which the deployment stack is created. If a scope isn't specified, it uses the scope of the deployment stack.

# [CLI](#tab/azure-cli)

```azurecli
az stack sub create \
  --name '<deployment-stack-name>' \
  --location '<location>' \
  --template-file '<bicep-file-name>' \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'denyDelete' \
  --deny-settings-excluded-actions 'Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete' \
  --deny-settings-excluded-principals '<object-id> <object-id>'
```

Use the `deployment-resource-group` parameter to specify the resource group at which the deployment stack is created. If a scope isn't specified, it uses the scope of the deployment stack.

# [Portal](#tab/azure-portal)

Currently not implemented.

---

To apply deny settings at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzManagmentGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -Location "<location>" `
  -TemplateFile "<bicep-file-name>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "denyDelete" `
  -DenySettingsExcludedActions "Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete" `
  -DenySettingsExcludedPrincipal "<object-id>,<object-id>"
```

Use the `DeploymentSubscriptionId ` parameter to specify the subscription ID at which the deployment stack is created. If a scope isn't specified, it uses the scope of the deployment stack.

# [CLI](#tab/azure-cli)

```azurecli
az stack mg create \
  --name '<deployment-stack-name>' \
  --location '<location>' \
  --template-file '<bicep-file-name>' \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'denyDelete' \
  --deny-settings-excluded-actions 'Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete' \
  --deny-settings-excluded-principals '<object-id> <object-id>'
```

Use the `deployment-subscription ` parameter to specify the subscription ID at which the deployment stack is created. If a scope isn't specified, it uses the scope of the deployment stack.

# [Portal](#tab/azure-portal)

Currently not implemented.

---

## Detach managed resources from deployment stack

By default, deployment stacks detach and don't delete unmanaged resources when they're no longer contained within the stack's management scope. For more information, see [Update deployment stacks](#update-deployment-stacks).

## Export templates from deployment stacks

You can export the resources from a deployment stack to a JSON output. You can pipe the output to a file.

To export a deployment stack at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Save-AzResourceGroupDeploymentStack `
   -Name "<deployment-stack-name>" `
   -ResourceGroupName "<resource-group-name>" `
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group export \
  --name '<deployment-stack-name>' \
  --resource-group '<resource-group-name>'
```

# [Portal](#tab/azure-portal)

Currently not implemented.

---

To export a deployment stack at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Save-AzSubscriptionDeploymentStack `
  -name "<deployment-stack-name>"
```

# [CLI](#tab/azure-cli)

```azurecli
az stack sub export \
  --name '<deployment-stack-name>'
```

# [Portal](#tab/azure-portal)

Currently not implemented.

---

To export a deployment stack at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Save-AzManagmentGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -ManagementGroupId "<management-group-id>"
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg export \
  --name '<deployment-stack-name>' \
  --management-group-id '<management-group-id>'
```

# [Portal](#tab/azure-portal)

Currently not implemented.

---

## Next steps

To go through a quickstart, see [Quickstart: create a deployment stack](./quickstart-create-deployment-stacks.md).
