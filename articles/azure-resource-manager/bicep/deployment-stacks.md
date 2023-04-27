---
title: Create & deploy deployment stacks in Bicep
description: Describes how to create deployment stacks in Bicep .
ms.topic: conceptual
ms.date: 04/27/2023
---

# Deployment stacks (Preview)

Many Azure administrators find it difficult to manage the lifecycle of their cloud infrastructure. For example, infrastructure deployed in Azure may span multiple management groups, subscriptions, and resource groups. Deployment stacks simplify lifecycle management for your Azure deployments, regardless of their complexity.

A _deployment stack_ is a native Azure resource type that enables you to perform operations on a resource collection as an atomic unit. Deployment stacks are defined in ARM as the type `Microsoft.Resources/deploymentStacks`.

jgao: publish the template reference for deploymentStacks.

Because the deployment stack is a native Azure resource, you can perform all typical Azure Resource Manager (ARM) operations on the resource, including:

- Azure role-based access control (RBAC) assignments
- Security recommendations surfaced by Microsoft Defender for Cloud
- Azure Policy assignments

Any Azure resource created using a deployment stack is managed by it, and subsequent updates to that deployment stack, combined with value of the newest iteration's `actionOnUnmanage` property, allows you to control the lifecycle of the resources managed by the deployment stack. When a deployment stack is updated, the new set of managed resources will be determined by the resources defined in the template.

To create your first deployment stack, work through our [quickstart tutorial](./TUTORIAL.md).

## Known issues

The `2022-08-01-preview` private preview API version has the following limitations:

- We don't recommended using deployment stacks in production environments because the service is still in preview. Therefore, you should expect breaking changes in future releases.
- Resource group delete currently bypasses deny assignments.
- Implicitly created resources aren't managed by the stack (therefore, no deny assignments or cleanup is possible)
- The `denyDelete` resource locking method is available in private preview. The `denyWriteAndDelete` method will be available in the future.
- `Whatif` isn't available in the private preview. `Whatif` allows you to evaluate changes before actually submitting the deployment to ARM.
- Deployment stacks are currently limited to the resource group and subscription management scopes for the private preview. At this time management group-scoped Azure PowerShell and Azure CLI commands exist; they just aren't usable yet.
- A deployment stack doesn't guarantee the protection of `secureString` and `secureObject` parameters; this release returns them in plain text when requested.

## Feature registration (This step might not be needed for the public release)

Use the following PowerShell command to enable the deployment stacks preview feature in your Azure subscription:

```powershell
Register-AzProviderFeature -ProviderNamespace Microsoft.Resources -FeatureName deploymentStacksPreview
```

jgao: is there an Azure CLI command for feature registration?
jgao: will feature registration still required with public preview?

## Installation

jgao: Azure PowerShell and Azure CLI installation shall install the deployment stack tools.  Otherwise add the information here.











## Create a deployment stack

The value of deploying a new Azure environment as a deployment stack is that the deployment can be managed centrally, including the ability to lock managed resources against modification or deletion.

Most customers want to scope their deployment stacks at the resource group scope. To create a deployment stack at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeploymentStack `
   -Name 'myRGStack' `
   -ResourceGroupName 'myRG' `
   -TemplateFile './main.bicep'
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name mySubStack \
  --resource-group 'myRG' \
  --template-file main.bicep
```

---

To create a deployment stack at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzManagmentGroupDeploymentStack `
  -Name 'myMGStack' `
  -Location 'eastus' `
  -TemplateFile './main.bicep'
  -ManagementGroupId 'myMGId'
  -DeploymentSubscriptionId 'mySubId'
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg create `
  --name myMGStack `
  --location eastus `
  --template-file main.bicep
  --management-group-id myMGId
  --deployment-subscription-id mySubId
```

---

To create a deployment stack at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzSubscriptionDeploymentStack `
   -Name 'mySubStack' `
   -Location 'eastus' `
   -TemplateFile './main.bicep' `
   -DeploymentResourceGroupName 'myRG'
```

The `DeploymentResourceGroupName` parameter specifies the resource group used to store the deployment stack resources. If you don't specify a resource group name, the deployment stack service will create a new resource group for you.

# [CLI](#tab/azure-cli)

```azurecli
az stack sub create \
  --name mySubStack \
  --location eastus \
  --template-file main.bicep \
  --deployment-resource-group-name myRG
```

The `deployment-resource-group-name` parameter specifies the resource group used to store the deployment stack resources. If you don't specify a resource group name, the deployment stack service will create a new resource group for you.

---

## List deployment stacks

List deployment stack resources at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResourceGroupDeploymentStack -ResourceGroupName myRG
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group list --resource-group myRG
```

---

List deployment stack resources at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzManagementGroupDeploymentStack -ManagementGroupId myMGId
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg list --management-group-id myMGId
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

## Update a deployment stack

To update a deployment stack, modify the underlying Bicep or ARM deployment templates and re-run the create deployment stack commands. For more information about the commands, see [Create a deployment stack](#create-a-deployment-stack).

You will get a warning similar to the following:

```warning
The deployment stack 'mySubStack' you're trying to create already already exists in the current subscription. Do you want to overwrite it? Detaching: resources, resourceGroups (Y/N)
```

jgao: verify the warning message.

## Delete the deployment stack

If you run the delete commands without the delete parameters, the managed resources will be detached but not deleted.

Delete deployment stack resources at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroupDeploymentStack -name myStack -ResourceGroupName myRG [-DeleteAll/-DeleteResourceGroups/-DeleteResources]
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group delete --resource-group myRG [--delete-all/--delete-resource-groups/--delete-resources]
```

---

List deployment stack resources at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzManagementGroupDeploymentStack -Name myStack -ManagementGroupId myMGId [-DeleteAll/-DeleteResourceGroups/-DeleteResources]
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg delete --management-group-id myMGId [--delete-all/--delete-resource-groups/--delete-resources]
```

---

List deployment stack resources at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzSubscriptionDeploymentStack -Name myStack [-DeleteAll/-DeleteResourceGroups/-DeleteResources]
```

# [CLI](#tab/azure-cli)

```azurecli
az stack sub delete  --name [--delete-all/--delete-resource-groups/--delete-resources]
```

---

## View the managed resources in a deployment stack

During public preview, the deployment stack service doesn't yet have an Azure portal graphical user interface (GUI). To view the managed resources inside a deployment stack, use the following Azure PowerShell command:

List deployment stack resources at the resource group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzResourceGroupDeploymentStack -Name myStack -ResourceGroupName myRG).Resources
```

# [CLI](#tab/azure-cli)

```azurecli
az stack group list --name myStack --resource-group myRG --output json
```

---

List deployment stack resources at the management group scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzManagementGroupDeploymentStack -Name myStack -ManagementGroupId myMGId).Resources
```

# [CLI](#tab/azure-cli)

```azurecli
az stack mg show --name myStack --management-group-id myMGId --output json
```

---

List deployment stack resources at the subscription scope:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzSubscriptionDeploymentStack -Name myStack).Resources
```

# [CLI](#tab/azure-cli)

```azurecli
az stack sub show --name myStack --output json
```

---

## Add a managed resource to a deployment stack

To add a managed resource to a deployment stack, modify the original Bicep file by adding a resource, and then run the create deployment stack command. For more information, see [Create a deployment stack](#create-a-deployment-stack). This step highlights the modularity and centralized "command and control" offered by Azure deployment stacks. You control your list of managed resources entirely through the infrastructure as code (IaC) design pattern.

## Delete a managed resource from a deployment stack *********************************

To instruct Azure to delete detached resources, update the stack with the create stack command with one of the following parameters. For more information, see [Create a deployment stack](#create-a-deployment-stack).

- `--delete-all`: Flag to indicate delete rather than detach for managed resources and resource groups.
- `--delete-resources`: Flag to indicate delete rather than attach for managed resources only.
- `--delete-resource-groups`: Flag to indicate delete rather than detach for managed resource groups only.

> [!WARNING]
> When you delete resource groups using the previously listed parameters, the resource groups are deleted regardless of whether they're empty.

## Protect managed resources against deletion

The `--deny-delete` CLI parameter places a special type of lock on managed resources that prevents them from deletion by unauthorized security principals (be default, everyone).

Following are the relevant `az stack sub create` parameters:

- `deny-settings-mode`: Defines which operations are denied on resources managed by the stack: `denyWrite` or `denyWriteAndDelete`.
- `deny-settings-excluded-principals`: Comma-separated list of Azure Active Directory (Azure AD) principal IDs excluded from the lock. Up to five principals are allowed
- `deny-settings-apply-to-child-scopes`: Deny settings will be applied to child Azure management scopes
- `deny-settings-excluded-actions`: List of role-based access control (RBAC) management operations excluded from the deny settings. Up to 200 actions are allowed

jgao: the last parameter is not found in the help file.  Please verify.

To apply a `denyDelete` lock to your deployment stack, update your deployment stack definition,
specifying the appropriate parameter(s):

```azurecli
az stack sub create `
  --name mySubStack `
  --location eastus `
  --template-file main.bicep `
  --deny-settings-mode "denyDelete"
```

jgao: denyDelete is not listed in the help.  Please verify.

Verify the `denyDelete` lock works as expected by signing into the Azure portal and attempting to
delete a locked resource. The request should fail.

To manage deployment stack deny assignments with Azure PowerShell, include one of the following `-DenySettingsMode` parameters of the `New-AzSubscriptionDeploymentStack` command:

- `None`: Do not apply a lock to managed resources
- `DenyDelete`: Prevent delete operations
- `DenyWriteAndDelete`: Prevent deletion or modification

For example:

```powershell
New-AzSubscriptionDeploymentStack -Name 'mySubStack' `
  -TemplateFile './main.bicep' `
  -DenySettingsMode 'DenyDelete'
```

The Azure PowerShell interface also includes these parameters to customize the deny assignment:

- `-DenySettingsExcludedPrincipals`: List of AAD principal IDs excluded from the lock. Up to 5 principals are permitted.
- `-DenySettingsApplyToChildScopes`: Apply to child scopes.
- `-DenySettingsExcludedActions`: List of role-based management operations that are excluded from the denySettings. Up to 200 actions are permitted.
- `-DenySettingsExcludedDataActions`
- `-DenySettingsMode`: Mode for DenySettings. Possible values include: 'denyDelete', 'denyWriteAndDelete', and 'none'.

jgao: DenySettingsExcludedDataActions is not found in the help.  add DenySettingsMode from the help.

## Detach a managed resource

By default, deployment stacks detach and don't delete resources when they're no longer contained within the stack's management scope.

To test the default detach capability, remove one of the public IP address definitions in
your `main.bicep` deployment template.

Next, run `az stack sub create` or `New-AzSubscriptionDeploymentStack` again to update the stack.

After the deployment succeeds, you should still see the detached storage account in your
subscription. When you list the stack's managed resources, you should _not_ see the public IP
address you detached.

With Azure PowerShell, you specify what you want to happen after detaching a managed
resource by using one of the following switch parameters of the `New-AzSubscriptionDeploymentStack` command:

- `-DeleteAll`
- `-DeleteResources`
- `-DeleteResourceGroups`

For example:

```powershell
New-AzSubscriptionDeploymentStack -Name 'mySubStack' `
  -TemplateFile './main.bicep' `
  -DeleteAll
```

In Azure CLI, unmanaged resources are detached by default. If you'd like to delete rather than detach, you can specify by using one of the following parameters of the `az stack sub create` command:

- --delete-all
- --delete-resources
- --delete-resource-groups

Here's another example:

```azurecli
az stack sub create `
  --name mySubStack `
  --location eastus `
  --template-file main.bicep `
  --delete-resources
```

## Export resources from a deployment stack

You can export the resources from a deployment stack to a Bicep template file.

jgao: what does this mean?

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Export-AzSubscriptionDeploymentStack -name mySubStack
```

# [CLI](#tab/azure-cli)

```azurecli
az stack sub export --name mySubStack --file mySubStack.bicep
```

jgao: the file parameter is now list in the help. Is it a mistake.
---

## Troubleshooting

Deployment stacks contain some diagnostic information that isn't displayed by
default. When troubleshooting problems with an update, save the objects to analyze them further:

```azurepowershell
$stack =  Get-AzSubscriptionDeploymentStack -Name 'mySubStack'
```

There may be more than one level for the error messages, to easily see them all at once:

```powershell
$stack.Error | ConvertTo-Json -Depth 50
```

If a deployment was created and the failure occurred during deployment, you can retrieve details of
the deployment using the deployment commands.  For example if your template was deployed
to a resource group:

```azurepowershell
Get-AzResourceGroupDeployment -Id $stack.DeploymentId
```

You can get more information from the [deployment operations](https://docs.microsoft.com/azure/azure-resource-manager/templates/deployment-history?tabs=azure-portal#get-deployment-operations-and-error-message) as needed.

## Next steps

To learn more about template specs, and for hands-on guidance, see [Publish libraries of reusable infrastructure code by using template specs](/training/modules/arm-template-specs).
