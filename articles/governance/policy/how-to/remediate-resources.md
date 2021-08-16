---
title: Remediate non-compliant resources
description: This guide walks you through the remediation of resources that are non-compliant to policies in Azure Policy.
ms.date: 05/01/2021
ms.topic: how-to
---
# Remediate non-compliant resources with Azure Policy

Resources that are non-compliant to a **deployIfNotExists** or **modify** policy can be put into a
compliant state through **Remediation**. Remediation is accomplished by instructing Azure Policy to
run the **deployIfNotExists** effect or the **modify operations** of the assigned policy on your
existing resources and subscriptions, whether that assignment is to a management group, a
subscription, a resource group, or an individual resource. This article shows the steps needed to
understand and accomplish remediation with Azure Policy.

## How remediation security works

When Azure Policy runs the template in the **deployIfNotExists** policy definition, it does so using
a [managed identity](../../../active-directory/managed-identities-azure-resources/overview.md).
Azure Policy creates a managed identity for each assignment, but must have details about what roles
to grant the managed identity. If the managed identity is missing roles, an error is displayed
during the assignment of the policy or an initiative. When using the portal, Azure Policy
automatically grants the managed identity the listed roles once assignment starts. When using SDK,
the roles must manually be granted to the managed identity. The _location_ of the managed identity
doesn't impact its operation with Azure Policy.

:::image type="content" source="../media/remediate-resources/missing-role.png" alt-text="Screenshot of a deployIfNotExists policy that is missing a defined permission on the managed identity." border="false":::

> [!IMPORTANT]
> In the following scenarios, the assignment's managed identity must be
> [manually granted access](#manually-configure-the-managed-identity) or the remediation deployment
> fails:
>
> - If the assignment is created through SDK
> - If a resource modified by **deployIfNotExists** or **modify** is outside the scope of the policy
>   assignment
> - If the template accesses properties on resources outside the scope of the policy assignment

## Configure policy definition

The first step is to define the roles that **deployIfNotExists** and **modify** needs in the policy
definition to successfully deploy the content of your included template. Under the **details**
property, add a **roleDefinitionIds** property. This property is an array of strings that match
roles in your environment. For a full example, see the [deployIfNotExists
example](../concepts/effects.md#deployifnotexists-example) or the
[modify examples](../concepts/effects.md#modify-examples).

```json
"details": {
    ...
    "roleDefinitionIds": [
        "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/{roleGUID}",
        "/providers/Microsoft.Authorization/roleDefinitions/{builtinroleGUID}"
    ]
}
```

The **roleDefinitionIds** property uses the full resource identifier and doesn't take the short
**roleName** of the role. To get the ID for the 'Contributor' role in your environment, use the
following code:

```azurecli-interactive
az role definition list --name 'Contributor'
```

## Manually configure the managed identity

When creating an assignment using the portal, Azure Policy both generates the managed identity and
grants it the roles defined in **roleDefinitionIds**. In the following conditions, steps to create
the managed identity and assign it permissions must be done manually:

- While using the SDK (such as Azure PowerShell)
- When a resource outside the assignment scope is modified by the template
- When a resource outside the assignment scope is read by the template

### Create managed identity with PowerShell

To create a managed identity during the assignment of the policy, **Location** must be defined and
**AssignIdentity** used. The following example gets the definition of the built-in policy **Deploy
SQL DB transparent data encryption**, sets the target resource group, and then creates the
assignment.

```azurepowershell-interactive
# Login first with Connect-AzAccount if not using Cloud Shell

# Get the built-in "Deploy SQL DB transparent data encryption" policy definition
$policyDef = Get-AzPolicyDefinition -Id '/providers/Microsoft.Authorization/policyDefinitions/86a912f6-9a06-4e26-b447-11b16ba8659f'

# Get the reference to the resource group
$resourceGroup = Get-AzResourceGroup -Name 'MyResourceGroup'

# Create the assignment using the -Location and -AssignIdentity properties
$assignment = New-AzPolicyAssignment -Name 'sqlDbTDE' -DisplayName 'Deploy SQL DB transparent data encryption' -Scope $resourceGroup.ResourceId -PolicyDefinition $policyDef -Location 'westus' -AssignIdentity
```

The `$assignment` variable now contains the principal ID of the managed identity along with the
standard values returned when creating a policy assignment. It can be accessed through
`$assignment.Identity.PrincipalId`.

### Grant defined roles with PowerShell

The new managed identity must complete replication through Azure Active Directory before it can be
granted the needed roles. Once replication is complete, the following example iterates the policy
definition in `$policyDef` for the **roleDefinitionIds** and uses
[New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) to
grant the new managed identity the roles.

```azurepowershell-interactive
# Use the $policyDef to get to the roleDefinitionIds array
$roleDefinitionIds = $policyDef.Properties.policyRule.then.details.roleDefinitionIds

if ($roleDefinitionIds.Count -gt 0)
{
    $roleDefinitionIds | ForEach-Object {
        $roleDefId = $_.Split("/") | Select-Object -Last 1
        New-AzRoleAssignment -Scope $resourceGroup.ResourceId -ObjectId $assignment.Identity.PrincipalId -RoleDefinitionId $roleDefId
    }
}
```

### Grant defined roles through portal

There are two ways to grant an assignment's managed identity the defined roles using the portal, by
using **Access control (IAM)** or by editing the policy or initiative assignment and selecting
**Save**.

To add a role to the assignment's managed identity, follow these steps:

1. Launch the Azure Policy service in the Azure portal by selecting **All services**, then searching
   for and selecting **Policy**.

1. Select **Assignments** on the left side of the Azure Policy page.

1. Locate the assignment that has a managed identity and select the name.

1. Find the **Assignment ID** property on the edit page. The assignment ID will be something like:

   ```output
   /subscriptions/{subscriptionId}/resourceGroups/PolicyTarget/providers/Microsoft.Authorization/policyAssignments/2802056bfc094dfb95d4d7a5
   ```

   The name of the managed identity is the last portion of the assignment resource ID, which is
   `2802056bfc094dfb95d4d7a5` in this example. Copy this portion of the assignment resource ID.

1. Navigate to the resource or the resources parent container (resource group, subscription,
   management group) that needs the role definition manually added.

1. Select the **Access control (IAM)** link in the resources page and then select **+ Add role
   assignment** at the top of the access control page.

1. Select the appropriate role that matches a **roleDefinitionIds** from the policy definition.
   Leave **Assign access to** set to the default of 'Azure AD user, group, or application'. In the
   **Select** box, paste or type the portion of the assignment resource ID located earlier. Once the
   search completes, select the object with the same name to select ID and select **Save**.

## Create a remediation task

### Create a remediation task through portal

During evaluation, the policy assignment with **deployIfNotExists** or **modify** effects determines
if there are non-compliant resources or subscriptions. When non-compliant resources or subscriptions
are found, the details are provided on the **Remediation** page. Along with the list of policies
that have non-compliant resources or subscriptions is the option to trigger a **remediation task**.
This option is what creates a deployment from the **deployIfNotExists** template or the **modify**
operations.

To create a **remediation task**, follow these steps:

1. Launch the Azure Policy service in the Azure portal by selecting **All services**, then searching
   for and selecting **Policy**.

   :::image type="content" source="../media/remediate-resources/search-policy.png" alt-text="Screenshot of searching for Policy in All Services." border="false":::

1. Select **Remediation** on the left side of the Azure Policy page.

   :::image type="content" source="../media/remediate-resources/select-remediation.png" alt-text="Screenshot of the Remediation node on the Policy page." border="false":::

1. All **deployIfNotExists** and **modify** policy assignments with non-compliant resources are
   included on the **Policies to remediate** tab and data table. Select on a policy with resources
   that are non-compliant. The **New remediation task** page opens.

   > [!NOTE]
   > An alternate way to open the **remediation task** page is to find and select the policy from
   > the **Compliance** page, then select the **Create Remediation Task** button.

1. On the **New remediation task** page, filter the resources to remediate by using the **Scope**
   ellipses to pick child resources from where the policy is assigned (including down to the
   individual resource objects). Additionally, use the **Locations** dropdown list to further filter
   the resources. Only resources listed in the table will be remediated.

   :::image type="content" source="../media/remediate-resources/select-resources.png" alt-text="Screenshot of the Remediate node and the grid of resources to remediate." border="false":::

1. Begin the remediation task once the resources have been filtered by selecting **Remediate**. The
   policy compliance page opens to the **Remediation tasks** tab to show the state of the tasks
   progress. Deployments created by the remediation task begin right away.

   :::image type="content" source="../media/remediate-resources/task-progress.png" alt-text="Screenshot of the Remediation tasks tab and progress of existing remediation tasks." border="false":::

1. Select on the **remediation task** from the policy compliance page to get details about the
   progress. The filtering used for the task is shown along with a list of the resources being
   remediated.

1. From the **Remediation task** page, select and hold (or right-click) on a resource to view either the remediation
   task's deployment or the resource. At the end of the row, select on **Related events** to see
   details such as an error message.

   :::image type="content" source="../media/remediate-resources/resource-task-context-menu.png" alt-text="Screenshot of the context menu for a resource on the Remediate task tab." border="false":::

Resources deployed through a **remediation task** are added to the **Deployed Resources** tab on the
policy compliance page.

### Create a remediation task through Azure CLI

To create a **remediation task** with Azure CLI, use the `az policy remediation` commands. Replace
`{subscriptionId}` with your subscription ID and `{myAssignmentId}` with your **deployIfNotExists**
or **modify** policy assignment ID.

```azurecli-interactive
# Login first with az login if not using Cloud Shell

# Create a remediation for a specific assignment
az policy remediation create --name myRemediation --policy-assignment '/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyAssignments/{myAssignmentId}'
```

For other remediation commands and examples, see the [az policy
remediation](/cli/azure/policy/remediation) commands.

### Create a remediation task through Azure PowerShell

To create a **remediation task** with Azure PowerShell, use the `Start-AzPolicyRemediation`
commands. Replace `{subscriptionId}` with your subscription ID and `{myAssignmentId}` with your
**deployIfNotExists** or **modify** policy assignment ID.

```azurepowershell-interactive
# Login first with Connect-AzAccount if not using Cloud Shell

# Create a remediation for a specific assignment
Start-AzPolicyRemediation -Name 'myRemedation' -PolicyAssignmentId '/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyAssignments/{myAssignmentId}'
```

For other remediation cmdlets and examples, see the [Az.PolicyInsights](/powershell/module/az.policyinsights/#policy_insights)
module.

### Create a remediation task during policy assignment in the Azure portal

A streamlined way of creating a remediation task is to do so from the Azure portal during policy
assignment. If the policy definition to assign is a **deployIfNotExists** or a **Modify** effect,
the wizard on the **Remediation** tab offers a _Create a remediation task_ option. If this option is
selected, a remediation task is created at the same time as the policy assignment.

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Understand how to [programmatically create policies](programmatically-create.md).
- Learn how to [get compliance data](get-compliance-data.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
