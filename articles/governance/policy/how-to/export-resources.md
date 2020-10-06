---
title: Export Azure Policy resources
description: Learn to export Azure Policy resources to GitHub, such as policy definitions and policy assignments.
ms.date: 09/30/2020
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---
# Export Azure Policy resources

This article provides information on how to export your existing Azure Policy resources. Exporting
your resources is useful and recommended for backup, but is also an important step in your journey
with Cloud Governance and treating your [policy-as-code](../concepts/policy-as-code.md). Azure
Policy resources can be exported through [Azure portal](#export-with-azure-portal),
[Azure CLI](#export-with-azure-cli), [Azure PowerShell](#export-with-azure-powershell), and each of
the supported SDKs.

## Export with Azure portal

To export a policy definition from Azure portal, follow these steps:

1. Launch the Azure Policy service in the Azure portal by clicking **All services**, then searching
   for and selecting **Policy**.

1. Select **Definitions** on the left side of the Azure Policy page.

1. Use the **Export definitions** button or select the ellipsis on the row of a policy definition
   and then select **Export definition**.

1. Select the **Sign in with GitHub** button. If you haven't yet authenticated with GitHub to
   authorize Azure Policy to export the resource, review the access the
   [GitHub Action](https://github.com/features/actions) needs in the new window that opens and
   select **Authorize AzureGitHubActions** to continue with the export process. Once complete, the
   new window self-closes.

1. On the **Basics** tab, set the following options, then select the **Policies** tab or **Next :
   Policies** button at the bottom of the page.

   - **Repository filter**: Set to _My repositories_ to see only repositories you own or _All
     repositories_ to see all you granted the GitHub Action access to.
   - **Repository**: Set to the repository that you want to export the Azure Policy resources to.
   - **Branch**: Set the branch in the repository. Using a branch other than the default is a good
     way to validate your updates before merging further into your source code.
   - **Directory**: The _root level folder_ to export the Azure Policy resources to. Subfolders
     under this directory are created based on what resources are exported.

1. On the **Policies** tab, set the scope to search by selecting the ellipsis and picking a
   combination of management groups, subscriptions, or resource groups.
   
1. Use the **Add policy definition(s)** button to search the scope for which objects to export. In
   the side window that opens, select each object to export. Filter the selection by the search box
   or the type. Once you've selected all objects to export, use the **Add** button at the bottom of
   the page.

1. For each selected object, select the desired export options such as _Only Definition_ or
   _Definition and Assignment(s)_ for a policy definition. Then select the **Review + Export** tab
   or **Next : Review + Export** button at the bottom of the page.

   > [!NOTE]
   > If option _Definition and Assignment(s)_ is chosen, only policy assignments within the scope
   > set by the filter when the policy definition is added are exported.

1. On the **Review + Export** tab, check the details match and then use the **Export** button at the
   bottom of the page.

1. Check your GitHub repo, branch, and _root level folder_ to see that the selected resources are
   now exported to your source control.

The Azure Policy resources are exported into the following structure within the selected GitHub
repository and _root level folder_:

```text
|
|- <root level folder>/  ________________ # Root level folder set by Directory property
|  |- policies/  ________________________ # Subfolder for policy objects
|     |- <displayName>_<name>____________ # Subfolder based on policy displayName and name properties
|        |- policy.json _________________ # Policy definition
|        |- assign.<displayName>_<name>__ # Each assignment (if selected) based on displayName and name properties
|
```

## Export with Azure CLI

Azure Policy definitions, initiatives, and assignments can each be exported as JSON with
[Azure CLI](/cli/azure/install-azure-cli). Each of these commands uses a **name** parameter to
specify which object to get the JSON for. The **name** property is often a _GUID_ and isn't the
**displayName** of the object.

- Definition - [az policy definition show](/cli/azure/policy/definition#az-policy-definition-show)
- Initiative - [az policy set-definition show](/cli/azure/policy/set-definition#az-policy-set-definition-show)
- Assignment - [az policy assignment show](/cli/azure/policy/assignment#az-policy-assignment-show)

Here is an example of getting the JSON for a policy definition with **name** of
_VirtualMachineStorage_:

```azurecli-interactive
az policy definition show --name 'VirtualMachineStorage'
```

## Export with Azure PowerShell

Azure Policy definitions, initiatives, and assignments can each be exported as JSON with [Azure
PowerShell](/powershell/azure/). Each of these cmdlets uses a **Name** parameter to specify which
object to get the JSON for. The **Name** property is often a _GUID_ and isn't the **displayName** of
the object.

- Definition - [Get-AzPolicyDefinition](/powershell/module/az.resources/get-azpolicydefinition)
- Initiative - [Get-AzPolicySetDefinition](/powershell/module/az.resources/get-azpolicysetdefinition)
- Assignment - [Get-AzPolicyAssignment](/powershell/module/az.resources/get-azpolicyassignment)

Here is an example of getting the JSON for a policy definition with **Name** of
_VirtualMachineStorage_:

```azurepowershell-interactive
Get-AzPolicyDefinition -Name 'VirtualMachineStorage'
```

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Understand how to [programmatically create policies](programmatically-create.md).
- Learn how to [remediate non-compliant resources](remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
