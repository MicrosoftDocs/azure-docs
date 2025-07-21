---
title: Create and deploy Azure deployment stacks in Bicep
description: Understand how to create deployment stacks in Bicep.
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-bicep
ms.date: 06/09/2025
---

# Create and deploy Azure deployment stacks in Bicep

An Azure deployment stack is a resource that enables you to manage a group of Azure resources as a single, cohesive unit. When you submit a Bicep file or an Azure Resource Manager JSON template (ARM JSON template) to a deployment stack, you define the resources that the stack manages. If you remove a resource from the template, it can be detached or deleted based on the specified _actionOnUnmanage_ behavior of the deployment stack. You can restrict access to the deployment stack using Azure role-based access control (Azure RBAC), similar to other Azure resources.

To create and update a deployment stack, use the Azure CLI, Azure PowerShell, or the Azure portal with Bicep files. The stack transpiles these Bicep files into ARM JSON templates and deploys them as a deployment object. The deployment stack offers additional capabilities beyond the [familiar deployment resources](./deploy-cli.md) and is a superset of those capabilities.

`Microsoft.Resources/deploymentStacks` is the resource type for deployment stacks. It consists of a main template that can perform one-to-many updates across scopes to the resources it describes and block any unwanted changes to those resources.

When planning your deployment and determining which resource groups should be part of the same stack, consider the management lifecycle of those resources, which includes creation, updating, and deletion. For example, you might need to provision some test virtual machines for various application teams across different resource group scopes. You can use a deployment stack to create these test environments and update the test virtual machine configurations through subsequent updates to the deployment stack. After completing the project, you might need to remove or delete any resources that you created, such as the test virtual machines. Use a deployment stack and specify the appropriate delete flag to remove managed resources. This streamlined approach saves time during environment cleanup, as it involves a single update to the stack resource rather than individually modifying or removing each test virtual machine across various resource group scopes.

Deployment stacks require Azure PowerShell [version 12.0.0 or later](/powershell/azure/install-az-ps) or Azure CLI [version 2.61.0 or later](/cli/azure/install-azure-cli).

To create your first deployment stack, work through [Quickstart: create deployment stack](./quickstart-create-deployment-stacks.md).

## Why use deployment stacks?

Deployment stacks provide the following benefits:

- Streamlined provisioning and management of resources across different scopes as a unified entity.
- Prevention of undesired modifications to managed resources via [deny settings](#protect-managed-resources).
- Efficient environment cleanup using delete flags during deployment stack updates.
- Use of standard templates such as Bicep, ARM templates, or template specs for your deployment stacks.

### Known limitations

- There is a limit of 800 deployment stacks that can be created within a single scope.
- A maximum of 2,000 Deny Assignments can exist at any given scope.
- The deployment stack doesn't manage implicitly created resources. Therefore, you can't use [deny-assignments](../../role-based-access-control/deny-assignments.md) or cleanup for these resources.
- Deny-assignments don't support tags.
- Deny-assignments aren't supported at the management group scope. However, they're supported in a management group stack if the deployment is pointed at the subscription scope.
- Deployment stacks can't delete Key vault secrets. If you're removing key vault secrets from a template, make sure to also execute the deployment stack update/delete command with detach mode.

### Known issues

- Deleting resource groups currently bypasses deny-assignments. When you create a deployment stack in the resource group scope, the Bicep file doesn't contain the definition for the resource group. Despite the deny-assignment setting, you can delete the resource group and its contained stack. However, if a [lock](../management/lock-resources.md) is active on any resource within the group, the delete operation fails.
- The [What-if](./deploy-what-if.md) support isn't yet available.
- A management group-scoped stack can't deploy to another management group. It can only deploy to the management group of the stack itself or to a child subscription.
- The Azure PowerShell command help lists a `DeleteResourcesAndResourcesGroups` value for the `ActionOnUnmanage` switch. When you use this value, the command detaches the managed resources and the resource groups. This value is removed in the next update. Don't use this value.
- In some cases, the New and Set Azure PowerShell cmdlets might return a generic template validation error that isn't clearly actionable. This bug will be fixed in the next release. If the error isn't clear, run the cmdlet in debug mode to see a more detailed error in the raw response.
- [Microsoft Graph provider](https://aka.ms/graphbicep) doesn't support deploy stacks.

## Built-in roles

> [!WARNING]
> Enforcement of the RBAC permission [Microsoft.Resources/deploymentStacks/manageDenySetting/action](/azure/role-based-access-control/permissions/management-and-governance) is rolling out across regions, including Government Clouds.

There are two built-in roles for deployment stack:

- **Azure Deployment Stack Contributor**: Users can manage deployment stacks, but can't create or delete deny-assignments within the deployment stacks.
- **Azure Deployment Stack Owner**: Users can manage deployment stacks, including those users with deny-assignments.

## Create deployment stacks

You can create a deployment stack resource at resource group, subscription, or management group scope. The template you provide with a deployment stack defines the resources to create or update at the target scope.

- A stack at resource group scope can deploy the template to the same resource group where the deployment stack exists.
- A stack at subscription scope can deploy the template to a resource group or to the same subscription where the deployment stack exists.
- A stack at management group scope can deploy the template to the subscription.

It's important to note that where a deployment stack exists, so is the deny-assignment created with the deny settings capability. For example, by creating a deployment stack at subscription scope that deploys the template to resource group scope and with deny settings mode `DenyDelete`, you can easily provision managed resources to the specified resource group and block delete attempts to those resources. This approach helps you enhance the security of the deployment stack by separating it at the subscription level instead of at the resource-group level. This separation ensures that the developer teams working with the provisioned resources only have visibility and write access to the resource groups. The deployment stack remains isolated at a higher level. This configuration minimizes the number of users that can edit a deployment stack and make changes to its deny-assignment. For more information, see [Protect managed resource against deletion](#protect-managed-resources).

You can also use the create-stack commands to [update deployment stacks](#update-deployment-stacks).

To create a deployment stack at the resource group scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -ResourceGroupName "<resource-group-name>" `
  -TemplateFile "<bicep-file-name>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "none"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name '<deployment-stack-name>' \
  --resource-group '<resource-group-name>' \
  --template-file '<bicep-file-name>' \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'none'
```

# [Azure portal](#tab/azure-portal)

This feature isn't implemented at this time.

---

To create a deployment stack at the subscription scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzSubscriptionDeploymentStack `
  -Name "<deployment-stack-name>" `
  -Location "<location>" `
  -TemplateFile "<bicep-file-name>" `
  -DeploymentResourceGroupName "<resource-group-name>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "none"
```

The `DeploymentResourceGroupName` parameter specifies the resource group used to store the managed resources. If you don't specify the parameter, the managed resources are stored in the subscription scope.

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack sub create \
  --name '<deployment-stack-name>' \
  --location '<location>' \
  --template-file '<bicep-file-name>' \
  --deployment-resource-group' <resource-group-name>' \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'none'
```

The `deployment-resource-group` parameter specifies the resource group used to store the managed resources. If you don't specify the parameter, the managed resources are stored in the subscription scope.

# [Azure portal](#tab/azure-portal)

This feature isn't implemented at this time.

---

To create a deployment stack at the management group scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzManagementGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -Location "<location>" `
  -TemplateFile "<bicep-file-name>" `
  -DeploymentSubscriptionId "<subscription-id>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "none"
```

The `deploymentSubscriptionId` parameter specifies the subscription used to store the managed resources. If you don't specify the parameter, the managed resources are stored in the management group scope.

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack mg create \
  --name '<deployment-stack-name>' \
  --location '<location>' \
  --template-file '<bicep-file-name>' \
  --deployment-subscription '<subscription-id>' \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'none'
```

The `deployment-subscription` parameter specifies the subscription used to store the managed resources. If you don't specify the parameter, the managed resources are stored in the management group scope.

# [Portal](#tab/azure-portal)

This feature isn't implemented at this time.

---

## List deployment stacks

To list deployment stack resources at the resource group scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResourceGroupDeploymentStack `
  -ResourceGroupName "<resource-group-name>"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack group list \
  --resource-group '<resource-group-name>'
```

# [Azure portal](#tab/azure-portal)

1. From the Azure portal, open the resource group that contains the deployment stacks.
1. From the left menu, select `Deployment stacks` to list the deployment stacks deployed to the resource group.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-group-list-stacks.png" alt-text="Screenshot of listing deployment stacks at the resource group scope.":::

---

To list deployment stack resources at the subscription scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzSubscriptionDeploymentStack
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack sub list
```

# [Azure portal](#tab/azure-portal)

1. From the Azure portal, open the subscription that contains the deployment stacks.
1. From the left menu, select `Deployment stacks` to list the deployment stacks deployed to the subscription.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-sub-list-stacks.png" alt-text="Screenshot of listing deployment stacks at the subscription scope.":::

---

To list deployment stack resources at the management group scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzManagementGroupDeploymentStack `
  -ManagementGroupId "<management-group-id>"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack mg list \
  --management-group-id '<management-group-id>'
```

# [Azure portal](#tab/azure-portal)

This feature isn't implemented at this time.

---

## Update deployment stacks

To update a deployment stack, which might involve adding or deleting a managed resource, you need to make changes to the underlying Bicep files. Once you make the modifications, you can update the deployment stack by either running the update command or rerunning the create command.

The infrastructure-as-code design pattern gives you full control over the list of managed resources.

### Use the Set command

To update a deployment stack at the resource group scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzResourceGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -ResourceGroupName "<resource-group-name>" `
  -TemplateFile "<bicep-file-name>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "none"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name '<deployment-stack-name>' \
  --resource-group '<resource-group-name>' \
  --template-file '<bicep-file-name>' \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'none'
```

> [!NOTE]
> The Azure CLI doesn't have a deployment stack set command. Use the New command instead.

# [Azure portal](#tab/azure-portal)

This feature isn't implemented at this time.

---

To update a deployment stack at the subscription scope:

# [Azure PowerShell](#tab/azure-powershell)

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

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack sub create \
  --name '<deployment-stack-name>' \
  --location '<location>' \
  --template-file '<bicep-file-name>' \
  --deployment-resource-group '<resource-group-name>' \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'none'
```

# [Azure portal](#tab/azure-portal)

This feature isn't implemented at this time.

---

To update a deployment stack at the management group scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzManagementGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -Location "<location>" `
  -TemplateFile "<bicep-file-name>" `
  -DeploymentSubscriptionId "<subscription-id>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "none"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack mg create \
  --name '<deployment-stack-name>' \
  --location '<location>' \
  --template-file '<bicep-file-name>' \
  --deployment-subscription '<subscription-id>' \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'none'
```

# [Azure portal](#tab/azure-portal)

This feature isn't implemented at this time.

---

### Use the New command

You get a warning similar to the following one:

```warning
The deployment stack 'myStack' you're trying to create already exists in the current subscription/management group/resource group. Do you want to overwrite it? Detaching: resources, resourceGroups (Y/N)
```

For more information, see [Create deployment stacks](#create-deployment-stacks).

### Control detachment and deletion

A detached resource (or unmanaged resource) refers to a resource that the deployment stack doesn't track or manage but still exists within Azure.

To instruct Azure to delete unmanaged resources, update the stack with the create stack command and include the `ActionOnUnmanage` switch. For more information, see [Create deployment stack](#create-deployment-stacks).

# [Azure PowerShell](#tab/azure-powershell)

Use the `ActionOnUnmanage` switch to define what happens to resources that are no longer managed after a stack is updated or deleted. Allowed values are:

- `deleteAll`: Use delete rather than detach for managed resources and resource groups.
- `deleteResources`: Use delete rather than detach for managed resources only.
- `detachAll`: Detach the managed resources and resource groups.

For example:

```azurepowershell
New-AzSubscriptionDeploymentStack `
  -Name "<deployment-stack-name" `
  -TemplateFile "<bicep-file-name>" `
  -DenySettingsMode "none" `
  -ActionOnUnmanage "deleteAll" 
```

# [Azure CLI](#tab/azure-cli)

Use the `action-on-unmanage` switch to define what happens to resources that are no longer managed after a stack is updated or deleted. Allowed values are:

- `deleteAll`: Use delete rather than detach for managed resources and resource groups.
- `deleteResources`: Use delete rather than detach for managed resources only.
- `detachAll`: Detach the managed resources and resource groups.

For example:

```azurecli
az stack sub create `
  --name '<deployment-stack-name>' `
  --location '<location>' `
  --template-file '<bicep-file-name>' `
  --action-on-unmanage 'deleteAll' `
  --deny-settings-mode 'none' 
```

# [Azure portal](#tab/azure-portal)

This feature isn't implemented.

---

> [!WARNING]
> When deleting resource groups with the `action-on-unmanage` switch set to `deleteAll`, you delete the managed resource groups and all the resources contained within them.

### Handle the stack-out-of-sync error

When updating or deleting a deployment stack, you might encounter the following stack-out-of-sync error, indicating the stack resource list isn't correctly synchronized.

```error
The deployment stack '{0}' might not have an accurate list of managed resources. To prevent resources from being accidentally deleted, check that the managed resource list doesn't have any additional values. If there is any uncertainty, it's recommended to redeploy the stack with the same template and parameters as the current iteration. To bypass this warning, specify the 'BypassStackOutOfSyncError' flag.
```

You can obtain a list of the resources from the Azure portal or redeploy the currently deployed Bicep file with the same parameters. The output shows the managed resources.

# [Azure PowerShell](#tab/azure-powershell)

```output
...
Resources: /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/demoRg/providers/Microsoft.Network/virtualNetworks/vnetthmimleef5fwk
           /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/demoRg/providers/Microsoft.Storage/storageAccounts/storethmimleef5fwk
```

# [Azure CLI](#tab/azure-cli)

```output
"resources": [
  {
    "denyStatus": "none",
    "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/demoRg/providers/Microsoft.Network/virtualNetworks/vnetthmimleef5fwk",
    "resourceGroup": "demoRg",
    "status": "managed"
  },
  {
    "denyStatus": "none",
    "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/demoRg/providers/Microsoft.Storage/storageAccounts/storethmimleef5fwk",
    "resourceGroup": "demoRg",
    "status": "managed"
  }
]
```

# [Azure portal](#tab/azure-portal)

1. Open the Azure portal.
1. Open the resource group that contains the stack.
1. From the left menu, expand **Settings**, and then select **Deployment stacks**.
1. Select the stack name to open the stack.

---

After you review and verify the list of resources in the stack, rerun the command with the `BypassStackOutOfSyncError` switch in Azure PowerShell (or `bypass-stack-out-of-sync-error` in Azure CLI). Use this switch only after thoroughly reviewing the list of resources in the stack. Don't use this switch by default.

## Delete deployment stacks

# [Azure PowerShell](#tab/azure-powershell)

The `ActionOnUnmanage` switch defines the action to the resources that are no longer managed. The switch has the following values:

- `DeleteAll`: Delete both the resources and the resource groups.
- `DeleteResources`: Delete only the resources.
- `DetachAll`: Detach the resources.

# [Azure CLI](#tab/azure-cli)

The `action-on-unmanage` switch defines the action to the resources that are no longer managed. The switch has the following values:

- `delete-all`: Delete both the resources and the resource groups.
- `delete-resources`: Delete only the resources.
- `detach-all`: Detach the resources.

# [Azure portal](#tab/azure-portal)

Select one of the delete flags when you delete a deployment stack.

:::image type="content" source="./media/deployment-stacks/deployment-stack-portal-update-behavior.png" alt-text="Screenshot of portal update behavior (delete flags).":::

---

Even if you specify the delete-all switch, unmanaged resources within the resource group where the deployment stack is located prevent both the unmanaged resources and the resource group itself from being deleted.

To delete deployment stack resources at the resource group scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroupDeploymentStack `
  -name "<deployment-stack-name>" `
  -ResourceGroupName "<resource-group-name>" `
  -ActionOnUnmanage "<deleteAll/deleteResources/detachAll>"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack group delete \
  --name '<deployment-stack-name>' \
  --resource-group '<resource-group-name>' \
  --action-on-unmanage '<deleteAll/deleteResources/detachAll>'
```

# [Azure portal](#tab/azure-portal)

1. From the Azure portal, open the resource group that contains the deployment stacks.
1. From the left menu, select `Deployment stacks`, select the deployment stack to delete, and then select `Delete stack`.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-group-delete-stacks.png" alt-text="Screenshot of deleting deployment stacks at the resource group scope.":::

1. Select an `Update behavior`, and then select `Next`.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-group-delete-stack-update-behavior.png" alt-text="Screenshot of update behavior (delete flags) for deleting resource group scope deployment stacks.":::

---

To delete deployment stack resources at the subscription scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzSubscriptionDeploymentStack `
  -Name "<deployment-stack-name>" `
  -ActionOnUnmanage "<deleteAll/deleteResources/detachAll>"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack sub delete \
  --name '<deployment-stack-name>' \
  --action-on-unmanage '<deleteAll/deleteResources/detachAll>'
```

# [Azure portal](#tab/azure-portal)

1. From the Azure portal, open the subscription that contains the deployment stacks.
1. From the left menu, select `Deployment stacks`, select the deployment stack to delete, and then select `Delete stack`.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-sub-delete-stacks.png" alt-text="Screenshot of deleting deployment stacks at the subscription scope.":::

1. Select an `Update behavior` (delete flag), and then select `Next`.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-sub-delete-stack-update-behavior.png" alt-text="Screenshot of update behavior (delete flags) for deleting subscription scope deployment stacks.":::
---

To delete deployment stack resources at the management group scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzManagementGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -ManagementGroupId "<management-group-id>" `
  -ActionOnUnmanage "<deleteAll/deleteResources/detachAll>"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack mg delete \
  --name '<deployment-stack-name>' \
  --management-group-id '<management-group-id>' \
  --action-on-unmanage '<deleteAll/deleteResources/detachAll>'
```

# [Azure portal](#tab/azure-portal)

This feature isn't implemented at this time.

---

## View managed resources in deployment stack

The deployment stack service doesn't yet have an Azure portal graphical user interface (GUI). To view the managed resources inside a deployment stack, use the following Azure PowerShell/Azure CLI commands:

To view managed resources at the resource group scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzResourceGroupDeploymentStack -Name "<deployment-stack-name>" -ResourceGroupName "<resource-group-name>").Resources
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack group list \
  --name '<deployment-stack-name>' \
  --resource-group '<resource-group-name>' \
  --output 'json'
```

# [Azure portal](#tab/azure-portal)

1. From the Azure portal, open the resource group that contains the deployment stacks.
1. From the left menu, select `Deployment stacks`.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-group-list-stacks.png" alt-text="Screenshot of listing managed resources at the resource group scope.":::

1. Select one of the deployment stacks to view the managed resources of the deployment stack.

---

To view managed resources at the subscription scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzSubscriptionDeploymentStack -Name "<deployment-stack-name>").Resources
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack sub show \
  --name '<deployment-stack-name>' \
  --output 'json'
```

# [Azure portal](#tab/azure-portal)

1. From the Azure portal, open the subscription that contains the deployment stacks.
1. From the left menu, select `Deployment stacks` to list the deployment stacks deployed to the subscription.

    :::image type="content" source="./media/deployment-stacks/deployment-stack-portal-sub-list-stacks.png" alt-text="Screenshot of listing managed resources at the subscription scope.":::

1. Select the deployment stack to list the managed resources.

---

To view managed resources at the management group scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzManagementGroupDeploymentStack -Name "<deployment-stack-name>" -ManagementGroupId "<management-group-id>").Resources
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack mg show \
  --name '<deployment-stack-name>' \
  --management-group-id '<management-group-id>' \
  --output 'json'
```

# [Azure portal](#tab/azure-portal)

This feature isn't implemented at this time.

---

## Add resources to deployment stack

To add a managed resource, add the resource definition to the underlying Bicep files, and then run the update command or rerun the create command. For more information, see [Update deployment stacks](#update-deployment-stacks).

## Delete managed resources from deployment stack

To delete a managed resource, remove the resource definition from the underlying Bicep files, and then run the update command or rerun the create command. For more information, see [Update deployment stacks](#update-deployment-stacks).

## Protect managed resources

You can assign specific permissions to the managed resources of a deployment stack to prevent unauthorized security principals from deleting or updating them. These permissions are referred to as deny settings. Store stacks at parent scope. For example, to protect resources in a subscription, place the stack at the parent scope, which is the immediate parent management group.

The deny setting only applies to the [control plane operations](../management/control-plane-and-data-plane.md#control-plane) and not the [data plane operations](../management/control-plane-and-data-plane.md#data-plane). For example, you create storage accounts and key vaults through the control plane, which means the deployment stack manages them. However, you create child resources like secrets or blob containers through the data plane, which means deployment stack can't manage them.

The deny setting only applies to explicitly created resources, not implicitly created ones. For example, a managed AKS cluster creates multiple other services to support it, such as a virtual machine. In this case, since the virtual machine isn't defined in the Bicep file and is an implicitly created resource, it isn't subject to the deployment stack deny settings.

> [!NOTE]
> The latest release requires specific permissions at the stack scope to:
>
> - Create or update a deployment stack, and configure deny setting to a value other than `None`.
> - Update or delete a deployment stack with an existing deny setting of a value other than `None`.
>
> Use the deployment stack [built-in roles](#built-in-roles) to grant permissions.

# [PowerShell](#tab/azure-powershell)

The Azure PowerShell includes these parameters to customize the deny-assignment:

- `DenySettingsMode`: Defines the operations that are prohibited on the managed resources to safeguard against unauthorized security principals attempting to delete or update them. This restriction applies to everyone unless you explicitly grant access. The values include: `None`, `DenyDelete`, and `DenyWriteAndDelete`.
- `DenySettingsApplyToChildScopes`: When specified, the deny setting mode configuration also applies to the child scope of the managed resources. For example, a
Bicep file defines a _Microsoft.Sql/servers_ resource (parent) and a _Microsoft.Sql/servers/databases_ resource (child). If you create a deployment stack using the Bicep file with the `DenySettingsApplyToChildScopes` setting enabled and the `DenySettingsMode` set to `DenyWriteAndDelete`, you can't add any additional child resources to either the _Microsoft.Sql/servers_ resource or the _Microsoft.Sql/servers/databases_ resource.
- `DenySettingsExcludedAction`: List of role-based management operations that are excluded from the deny settings. Up to 200 actions are permitted.
- `DenySettingsExcludedPrincipal`: List of Microsoft Entra principal IDs excluded from the lock. Up to five principals are permitted.

# [CLI](#tab/azure-cli)

The Azure CLI includes these parameters to customize the deny-assignment:

- `deny-settings-mode`: Defines the operations that are prohibited on the managed resources to safeguard against unauthorized security principals attempting to delete or update them. This restriction applies to everyone unless they're explicitly granted access. The values include: `none`, `denyDelete`, and `denyWriteAndDelete`.
- `deny-settings-apply-to-child-scopes`: When specified, the deny setting mode configuration also applies to the child scope of the managed resources. For example, a Bicep file defines a _Microsoft.Sql/servers_ resource (parent) and a _Microsoft.Sql/servers/databases_ resource (child). If you create a deployment stack using the Bicep file with the `deny-settings-apply-to-child-scopes` setting enabled and the `deny-settings-mode` set to `denyWriteAndDelete`, you can't add any extra child resources to either the _Microsoft.Sql/servers_ resource or the _Microsoft.Sql/servers/databases_ resource.
- `deny-settings-excluded-actions`: List of RBAC management operations excluded from the deny settings. Up to 200 actions are allowed.
- `deny-settings-excluded-principals`: List of Microsoft Entra principal IDs excluded from the lock. Up to five principals are allowed.

# [Portal](#tab/azure-portal)

This feature isn't implemented at this time.

---

To apply deny settings at the resource group scope:

# [Azure PowerShell](#tab/azure-powershell)

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

# [Azure CLI](#tab/azure-cli)

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

# [Azure portal](#tab/azure-portal)

This feature isn't implemented at this time.

---

To apply deny settings at the subscription scope:

# [Azure PowerShell](#tab/azure-powershell)

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

# [Azure CLI](#tab/azure-cli)

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

# [Azure portal](#tab/azure-portal)

This feature isn't implemented.

---

To apply deny settings at the management group scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzManagementGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -Location "<location>" `
  -TemplateFile "<bicep-file-name>" `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "denyDelete" `
  -DenySettingsExcludedActions "Microsoft.Compute/virtualMachines/write Microsoft.StorageAccounts/delete" `
  -DenySettingsExcludedPrincipal "<object-id>,<object-id>"
```

Use the `DeploymentSubscriptionId ` parameter to specify the subscription ID at which the deployment stack is created. If a scope isn't specified, it uses the scope of the deployment stack.

# [Azure CLI](#tab/azure-cli)

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

# [Azure portal](#tab/azure-portal)

This feature isn't implemented.

---

## Detach managed resources from deployment stack

By default, deployment stacks detach and don't delete unmanaged resources when they're no longer contained within the stack's management scope. For more information, see [Update deployment stacks](#update-deployment-stacks).

## Export templates from deployment stacks

You can export the resources from a deployment stack to a JSON output. You can pipe the output to a file.

To export a deployment stack at the resource group scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Save-AzResourceGroupDeploymentStack `
   -Name "<deployment-stack-name>" `
   -ResourceGroupName "<resource-group-name>" `
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack group export \
  --name '<deployment-stack-name>' \
  --resource-group '<resource-group-name>'
```

# [Portal](#tab/azure-portal)

This feature isn't implemented at this time.

---

To export a deployment stack at the subscription scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Save-AzSubscriptionDeploymentStack `
  -name "<deployment-stack-name>"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack sub export \
  --name '<deployment-stack-name>'
```

# [Azure portal](#tab/azure-portal)

This feature isn't implemented at this time.

---

To export a deployment stack at the management group scope:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Save-AzManagementGroupDeploymentStack `
  -Name "<deployment-stack-name>" `
  -ManagementGroupId "<management-group-id>"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack mg export \
  --name '<deployment-stack-name>' \
  --management-group-id '<management-group-id>'
```

# [Azure portal](#tab/azure-portal)

This feature isn't implemented at this time.

---

## Next steps

To go through a Bicep deployment quickstart, see [Quickstart: Create and deploy a deployment stack with Bicep](./quickstart-create-deployment-stacks.md).
