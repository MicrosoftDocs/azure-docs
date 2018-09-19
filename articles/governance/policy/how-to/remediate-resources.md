---
title: Remediate non-compliant resources with Azure Policy
description: This how-to walks you through the remediation of resources that are non-compliant to policies in Azure Policy.
services: azure-policy
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: conceptual
ms.service: azure-policy
manager: carmonm
---
# Remediate non-compliant resources with Azure Policy

Resources that are non-compliant to a **deployIfNotExists** policy can be put into a compliant
state through **Remediation**. Remediation is accomplished by instructing Policy to run the
**deployIfNotExists** effect of the assigned policy on your existing resources. This how-to walks
through the steps needed to accomplished this.

## How remediation security works

When Policy runs the template in the **deployIfNotExists** policy definition, it does so using a
[managed identity](../../../active-directory/managed-identities-azure-resources/overview.md).
Policy creates a managed identity for each assignment for you, but must be provided details about
what roles to grant the managed identity. If the managed identity is missing roles, this is
displayed during the assignment of the policy or an initiative containing the policy. Policy will
automatically grant the managed identity the listed roles once assignment is initiated.

![Managed identity - missing role](../media/remediate-resources/missing-role.png)

> [!IMPORTANT]
> If a resource modified by **deployIfNotExists** is outside the scope of the policy assignment, the
> assignment's managed identity must be programmatically granted access or the remediation deployment
> will fail.

## Configure policy definition

The first step is to define the roles that **deployIfNotExists** needs in the policy definition to
successfully deploy the content of your included template. Under the **details** property, add a
**roleDefinitionIds** property. This is an array of strings that match roles in your environment.
For a full example, see the [deployIfNotExists example](../concepts/effects.md#deployifnotexists-example).

```json
"details": {
    ...
    "roleDefinitionIds": [
        "/subscription/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/{roleGUID}",
        "/subscription/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/{roleGUID}"
    ]
}
```

**roleDefinitionIds** uses the full resource identifier and doesn't take the short **roleName** of
the role. To get the ID for the 'Contributor' role in your environment, use the following code:

```azurecli-interactive
az role definition list --name 'Contributor'
```

```azurepowershell-interactive
Get-AzureRmRoleDefinition -Name 'Contributor'
```

## Create a remediation task

During evaluation, the policy assignment with **deployIfNotExists** effect determines if there are
non-compliant resources. When non-compliant resources are found, the details are provided on the
**Remediation** page. Along with the list of policies that have non-compliant resources is the
option to trigger a **remediation task**. This is what creates a deployment from the
**deployIfNotExists** template.

To create a **remediation task**, follow these steps:

1. Launch the Azure Policy service in the Azure portal by clicking **All services**, then searching for and selecting **Policy**.

   ![Search for policy](../media/remediate-resources/search-policy.png)

1. Select **Remediation** on the left side of the Azure Policy page.

   ![Select remediation](../media/remediate-resources/select-remediation.png)

1. All **deployIfNotExists** policy assignments with non-compliant resources are included on the **Policies to remediate** tab and data table. Click on a policy with resources that are non-compliant. The **New remediation task** page opens.

   > [!NOTE]
   > An alternate way to open the **remediation task** page is to find and click on the policy from the
   > **Compliance** page, then click the **Create Remediation Task** button.

1. On the **New remediation task** page, filter the resources to remediate by using the **Scope** ellipses to pick child resources from where the policy was assigned (including down to the resources objects). Additionally, use the **Locations** drop-down to further filter the resources. Only resources listed in the table will be remediated.

   ![Remediate - select resources](../media/remediate-resources/select-resources.png)

1. Initiate the remediation task once the resources have been filtered by clicking **Remediate**. The policy compliance page will open to the **Remediation tasks** tab to show the state of the tasks progress.

   ![Remediate - task progress](../media/remediate-resources/task-progress.png)

1. Click on the **remediation task** from the policy compliance page to get details about the progress. The filtering used for the task are shown along with a list of the resources being remediated.

1. From the **remedation task** page, right-click on a resource to either view the deployment or the resource. At the end of the row, click on **Related events** to see details such as an error message.

   ![Remediate - resource task context menu](../media/remediate-resources/resource-task-context-menu.png)

Resources deployed through a **remediation task** will also be added to the **Deployed Resources** tab on the policy compliance page.

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md)
- Review the [Policy definition structure](../concepts/definition-structure.md)
- Review [Understanding policy effects](../concepts/effects.md)
- Understand how to [programmatically create policies](programmatically-create.md)
- Learn how to [get compliance data](getting-compliance-data.md)
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md)