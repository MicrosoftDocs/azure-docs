---
title: Create and test Azure Policy definitions with Azure Copilot (preview)
description: Learn how to generate an Azure Policy definition with Azure Copilot, review the policy rule, and simulate its behavior before assigning it.
ms.date: 11/10/2026
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
---

# Create and test Azure Policy definitions with Azure Copilot (preview)

Azure Copilot in Azure Policy helps you turn a plain-language requirement into a custom policy definition. You can review and refine the generated policy rule, then use policy simulation to check its behavior against specific resources before you assign it.

This article walks through generating an audit policy and testing it in the Azure portal.

> [!NOTE]
> Policy authoring with Azure Copilot and policy simulation are preview features. You need access to the preview to follow these steps.

## Prerequisites

- An Azure account with an active subscription.
- Access to Azure Copilot. For more information, see [Manage access to Azure Copilot](/azure/copilot/manage-access).
- Permission to create policy definitions at the selected subscription or management group. For example, the [Resource Policy Contributor](/azure/role-based-access-control/built-in-roles/management-and-governance#resource-policy-contributor) role provides this permission.
- Read access to the scope and resources you use for simulation.

Before creating a custom definition, check the [built-in policy samples](/azure/governance/policy/samples/built-in-policies) for a policy that already meets your needs.

## Generate a policy definition

1. Sign in to the [Azure portal](https://portal.azure.com). Search for and select **Policy**.

1. Under **Authoring**, select **Definitions**, and then select **+ Policy definition**.

1. Select **Generate with Copilot**. In **Policy target description**, describe the resource type and the condition you want to check. For example:

   > Audit storage accounts that allow HTTP traffic instead of requiring secure transfer.

1. Select **Generate**.

1. Review the generated JSON in **Policy rule**. Check the resource type, aliases, conditions, parameters, and effect against your requirement.

> [!IMPORTANT]
> AI-generated policy rules can be incorrect or incomplete. Review and test the rule before assigning it, especially when you use an effect that blocks or changes resources.

## Simulate the policy

1. In the policy-definition creation experience, open the **Simulate policy** tab.

1. Select up to five representative resources from the scope you chose for the definition. For the storage-account example, select a storage account whose secure-transfer setting you know.

1. Run the simulation. Review the compliance result, effect details, and evaluated expressions to understand why the resource matches or doesn't match the policy.

1. Repeat with resources that should pass and resources that should fail. Update the policy rule and rerun the simulation if the results don't match your intent.

1. Save the definition when you're satisfied with the results. Creating a definition doesn't enforce it. When you're ready to roll it out, [create a policy assignment](../assign-policy-portal.md) and follow [safe deployment practices](policy-safe-deployment-practices.md).

Simulation tests the resources you select, not every resource in the scope. It doesn't create an assignment or change the resources. You can also simulate an existing policy rule without generating it with Copilot.

## Next steps

- [Evaluate the impact of a new Azure Policy definition](../concepts/evaluate-impact.md).
- [Understand Azure Policy definition structure](../concepts/definition-structure-basics.md).
- [Create a custom policy definition](../tutorials/create-custom-policy-definition.md).
- [Get policy compliance data](get-compliance-data.md).
