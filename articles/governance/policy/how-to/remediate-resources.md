---
title: Remediate non-compliant resources
description: This guide walks you through the remediation of resources that are non-compliant to policies in Azure Policy.
ms.date: 04/27/2022
ms.topic: how-to
ms.author: timwarner
author: timwarner-msft
---
# Remediate non-compliant resources with Azure Policy

Resources that are non-compliant to policies with **deployIfNotExists** or **modify** effects can be put into a
compliant state through **Remediation**. Remediation is accomplished through **remediation tasks** that deploy the **deployIfNotExists** template or the **modify** operations of the assigned policy on your existing resources and subscriptions, whether that assignment is on a management group,
subscription, resource group, or individual resource. This article shows the steps needed to
understand and accomplish remediation with Azure Policy.

## How remediation security works

When Azure Policy starts a template deployment when evaluating **deployIfNotExists** policies or modifies a resource  when evaluating **modify** policies, it does so using
a [managed identity](../../../active-directory/managed-identities-azure-resources/overview.md) that is associated with the policy assignment.
Policy assignments use [managed identities](../../../active-directory/managed-identities-azure-resources/overview.md) for Azure resource authorization. You can use either a system-assigned managed identity that is created by the policy service or a user-assigned identity provided by the user. The managed identity needs to be assigned the minimum role-based access control (RBAC) role(s) required to remediate resources.
If the managed identity is missing roles, an error is displayed
during the assignment of the policy or an initiative. When using the portal, Azure Policy
automatically grants the managed identity the listed roles once assignment starts. When using an Azure software development kit (SDK),
the roles must manually be granted to the managed identity. The _location_ of the managed identity
doesn't impact its operation with Azure Policy.

:::image type="content" source="../media/remediate-resources/remediation-tab.png" alt-text="Screenshot of a policy assignment creating a system-assigned managed identity in East US with Log Analytics Contributor permissions.":::

> [!IMPORTANT]
> In the following scenarios, the assignment's managed identity must be
> [manually granted access](#manually-configure-the-managed-identity) or the remediation deployment
> fails:
>
> - If the assignment is created through SDK
> - If a resource modified by **deployIfNotExists** or **modify** is outside the scope of the policy
>   assignment
> - If the template accesses properties on resources outside the scope of the policy assignment
>
> Also, changing a a policy definition does not update the assignment or the associated managed identity.

## Configure policy definition

The first step is to define the roles that **deployIfNotExists** and **modify** needs in the policy
definition to successfully deploy the content of your included template. Under the **details**
property in the policy definition, add a **roleDefinitionIds** property. This property is an array of strings that match
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
following Azure CLI code:

```azurecli-interactive
az role definition list --name "Contributor"
```

> [!IMPORTANT]
> Permissions should be restricted to the smallest possible set when defining **roleDefinitionIds**
> within a policy definition or assigning permissions to a managed identity manually. See
> [managed identity best practice recommendations](../../../active-directory/managed-identities-azure-resources/managed-identity-best-practice-recommendations.md)
> for more best practices.

## Manually configure the managed identity

When creating an assignment using the portal, Azure Policy can generate a system-assigned managed identity and
grant it the roles defined in **roleDefinitionIds**. Alternatively, you can specify a user-assigned managed identity that receives the same role assignment.

   > [!NOTE]
   > Each Azure Policy assignment can be associated with only one managed identity. However, the managed identity can be assigned multiple roles.

In the following conditions, steps to create
the managed identity and assign it permissions must be done manually:

- While using the SDK (such as Azure PowerShell)
- When a resource outside the assignment scope is modified by the template
- When a resource outside the assignment scope is read by the template

## Configure a managed identity through the Azure portal

When creating an assignment using the portal, you can select either a system-assigned managed identity or a user-assigned managed identity. 

To set a system-assigned managed identity in the portal: 

1. On the **Remediation** tab of the create/edit assignment view, under **Types of Managed Identity**, ensure that **System assigned managed identity** 
is selected. 

1. Specify the location at which the managed identity is to be located. 

To set a user-assigned managed identity in the portal: 

1. On the **Remediation** tab of the create/edit assignment view, under **Types of Managed Identity**, ensure that **User assigned managed identity** 
is selected. 

1. Specify the scope where the managed identity is hosted. The scope of the managed identity does not have to equate to the scope of the assignment, but it must be in the same tenant. 

1. Under **Existing user assigned identities**, select the managed identity. 

   > [!NOTE]
   > If the managed identity does not have the permissions needed to execute the required remediation task, it will be granted permissions *automatically* only through the portal. For all other methods, permissions must be configured manually.
   >

### Create managed identity with PowerShell

To create an identity during the assignment of the policy, **Location** must be defined and **Identity** used. The following example gets the definition of the built-in policy **Deploy SQL DB transparent data encryption** sets the target resource group, and then creates the assignment using a **system assigned** managed identity.

```azurepowershell-interactive
# Login first with Connect-AzAccount if not using Cloud Shell

# Get the built-in "Deploy SQL DB transparent data encryption" policy definition
$policyDef = Get-AzPolicyDefinition -Id '/providers/Microsoft.Authorization/policyDefinitions/86a912f6-9a06-4e26-b447-11b16ba8659f'

# Get the reference to the resource group
$resourceGroup = Get-AzResourceGroup -Name 'MyResourceGroup'

# Create the assignment using the -Location and -Identity properties
$assignment = New-AzPolicyAssignment -Name 'sqlDbTDE' -DisplayName 'Deploy SQL DB transparent data encryption' -Scope $resourceGroup.ResourceId -PolicyDefinition $policyDef -Location 'westus' -IdentityType "SystemAssigned"
```

The following example gets the definition of the built-in policy **Deploy
SQL DB transparent data encryption**, sets the target resource group, and then creates the
assignment using an **user assigned** managed identity.

```azurepowershell-interactive
# Login first with Connect-AzAccount if not using Cloud Shell

# Get the built-in "Deploy SQL DB transparent data encryption" policy definition
$policyDef = Get-AzPolicyDefinition -Id '/providers/Microsoft.Authorization/policyDefinitions/86a912f6-9a06-4e26-b447-11b16ba8659f'

# Get the reference to the resource group
$resourceGroup = Get-AzResourceGroup -Name 'MyResourceGroup'

# Get the existing user assigned managed identity ID
$userassignedidentity = Get-AzUserAssignedIdentity -ResourceGroupName $rgname -Name $userassignedidentityname 
$userassignedidentityid = $userassignedidentity.Id

# Create the assignment using the -Location and -Identity properties
$assignment = New-AzPolicyAssignment -Name 'sqlDbTDE' -DisplayName 'Deploy SQL DB transparent data encryption' -Scope $resourceGroup.ResourceId -PolicyDefinition $policyDef -Location 'westus' -IdentityType "UserAssigned" -IdentityId $userassignedidentityid
```

The `$assignment` variable now contains the principal ID of the managed identity along with the standard values returned when creating a policy assignment. It can be accessed through
`$assignment.Identity.PrincipalId` for system-assigned managed identities and `$assignment.Identity.UserAssignedIdentities[$userassignedidentityid].PrincipalId` for user-assigned managed identities.  

### Grant a managed identity defined roles with PowerShell

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

### Grant a managed identity defined roles through the portal

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

# [Portal](#tab/azure-portal)

Launch the Azure Policy service in the Azure portal by selecting **All services**, then searching for and selecting **Policy**.

   :::image type="content" source="../media/remediate-resources/search-policy.png" alt-text="Screenshot of searching for Policy in All Services." border="false":::

### Step 1: Initiate remediation task creation
There are three ways to create a remediation task through the portal.

#### Option 1: Create a remediation task from the Remediation page

1. Select **Remediation** on the left side of the Azure Policy page.

   :::image type="content" source="../media/remediate-resources/select-remediation.png" alt-text="Screenshot of the Remediation node on the Policy page." border="false":::

1. All **deployIfNotExists** and **modify** policy assignments are
   shown on the **Policies to remediate** tab. Select one with resources
   that are non-compliant to open the **New remediation task** page.
   
1. Follow steps to [specify remediation task details](#specify-remediation-task-details).

#### Option 2. Create a remediation task from a non-compliant policy assignment

1. Select **Compliance** on the left side of the Azure Policy page.

1. Select a non-compliant policy or initiative assignment containing **deployIfNotExists** or **modify** effects.

1. Select the **Create Remediation Task** button at the top of the page to open the **New remediation task** page.

1. Follow steps to [specify remediation task details](#specify-remediation-task-details).

#### Option 3. Create a remediation task during policy assignment

If the policy or initiative definition to assign has a **deployIfNotExists** or a **Modify** effect,
the **Remediation** tab of the wizard offers a _Create a remediation task_ option, which creates a remediation task at the same time as the policy assignment.

   > [!NOTE]
   > This is the most streamlined approach for creating a remediation task and is supported for policies assigned on a _subscription_. For policies assigned on a _management group_, remediation tasks should be created using [Option 1](#option-1-create-a-remediation-task-from-the-remediation-page) or [Option 2](#option-2-create-a-remediation-task-from-a-non-compliant-policy-assignment) after evaluation has determined resource compliance.

1. From the assignment wizard in the portal, navigate to the **Remediation** tab. Select the check box for **Create a remediation task**. 

1. If the remediation task is initiated from an initiative assignment, select the policy to remediate from the drop down.

1. Configure the [managed identity](#configure-a-managed-identity-through-the-azure-portal) and fill out the rest of the wizard. The remediation task will be created when the assignment is created.

### Step 2: Specify remediation task details

   > [!NOTE]
   > This step is only applicable when using [Option 1](#option-1-create-a-remediation-task-from-the-remediation-page) or [Option 2](#option-2-create-a-remediation-task-from-a-non-compliant-policy-assignment).

1. If the remediation task is initiated from an initiative assignment, select the policy to remediate from the drop down.

   > [!NOTE]
   > Remediation tasks can be created for one policy assignment at a time. 

1. Optionally modify remediation settings on the **New remediation task** page: 

    - **Failure Threshold percentage** - Used to specify whether the remediation task should fail if the percentage of failures exceeds the given threshold. Provided as a number between 0 to 100. By default, the failure threshold is 100%. 
    - **Resource Count** - Determines how many non-compliant resources to remediate in a given remediation task. The default value is 500 (the previous limit). The maximum number of is 50,000 resources.
    - **Parallel Deployments** - Determines how many resources to remediate at the same time. The allowed values are 1 to 30 resources at a time. The default value is 10.

   > [!NOTE]
   > These settings cannot be changed once the remediation task has started.
 
1. On the same page, filter the resources to remediate by using the **Scope**
   ellipses to pick child resources from where the policy is assigned (including down to the
   individual resource objects). Additionally, use the **Locations** dropdown list to further filter
   the resources. 

   :::image type="content" source="../media/remediate-resources/select-resources.png" alt-text="Screenshot of the Remediate node and the grid of resources to remediate." border="false":::

1. Begin the remediation task once the resources have been filtered by selecting **Remediate**. The
   policy compliance page opens to the **Remediation tasks** tab to show the state of the tasks
   progress. Deployments created by the remediation task begin right away.

   :::image type="content" source="../media/remediate-resources/task-progress.png" alt-text="Screenshot of the Remediation tasks tab and progress of existing remediation tasks." border="false":::

### Step 3: Track remediation task progress

1. Navigate to the **Remediation tasks** tab on the **Remediation** page. Click on a remediation task to view details about the filtering used, the current status, and a list of resources being remediated.

1. From the **Remediation task** details page, right-click on a resource to view either the remediation
   task's deployment or the resource. At the end of the row, select **Related events** to see
   details such as an error message.

   :::image type="content" source="../media/remediate-resources/resource-task-context-menu.png" alt-text="Screenshot of the context menu for a resource on the Remediate task tab." border="false":::

Resources deployed through a **remediation task** are added to the **Deployed Resources** tab on the policy assignment details page.

# [Azure CLI](#tab/azure-cli)

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

# [PowerShell](#tab/azure-powershell)

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

---

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Understand how to [programmatically create policies](programmatically-create.md).
- Learn how to [get compliance data](get-compliance-data.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
