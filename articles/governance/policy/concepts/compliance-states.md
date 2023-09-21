---
title: Azure Policy compliance states
description: This article describes the concept of compliance states in Azure Policy.
ms.date: 04/05/2023
ms.topic: conceptual
---

# Azure Policy compliance states

## How compliance works

When initiative or policy definitions are assigned, Azure Policy determines which resources are [applicable](./policy-applicability.md) then evaluates those which haven't been [excluded](./assignment-structure.md#excluded-scopes) or [exempted](./exemption-structure.md). Evaluation yields **compliance states** based on conditions in the policy rule and each resources' adherence to those requirements. 

## Available compliance states

### Non-compliant

Policy assignments with `audit`, `auditIfNotExists`, or `modify` effects are considered non-compliant for _new_, _updated_, or _existing_ resources when the conditions of the policy rule evaluate to **TRUE**. 

Policy assignments with `append`, `deny`, and `deployIfNotExists` effects are considered non-compliant for _existing_ resources when the conditions of the policy rule evaluate to **TRUE**. _New_ and _updated_ resources are automatically remediated or denied at request time to enforce compliance. When a previously existing non-compliant resource is updated, the compliance state remains non-compliant until the resource deployment and Policy evaluation complete.

> [!NOTE]
> The DeployIfNotExist and AuditIfNotExist effects require the IF statement to be TRUE and the
> existence condition to be FALSE to be non-compliant. When TRUE, the IF condition triggers
> evaluation of the existence condition for the related resources.

Policy assignments with `manual` effects are considered non-compliant under two circumstances:
1. The policy definition has a default compliance state of non-compliant and there is no active [attestation](./attestation-structure.md) for the applicable resource stating otherwise.
1. The resource has been attested as non-compliant. 

To determine
the reason a resource is non-compliant or to find the change responsible, see
[Determine non-compliance](../how-to/determine-non-compliance.md). To [remediate](./remediation-structure.md) non-compliant resources for `deployIfNotExists` and `modify` policies, see  [Remediate non-compliant resources with Azure Policy](../how-to/remediate-resources.md).

### Compliant

Policy assignments with `append`, `audit`, `auditIfNotExists`, `deny`, `deployIfNotExists`, or `modify` effects are considered compliant for _new_, _updated_, or _existing_ resources when the conditions of the policy rule evaluate to **FALSE**. 

Policy assignments with `manual` effects are considered compliant under two circumstances:
1. The policy definition has a default compliance state of compliant and there is no active [attestation](./attestation-structure.md) for the applicable resource stating otherwise.
1. The resource has been attested as compliant. 

### Error

The error compliance state is given to policy assignments that generate a system error, such as template or evaluation error.

### Conflicting

A policy assignment is considered conflicting when there are two or more policy assignments existing in the same scope with contradicting or conflicting rules. For example, two definitions that append the same tag with different values.

### Exempt

An applicable resource has a compliance state of exempt for a policy assignment when it is in the scope of an [exemption](./exemption-structure.md).

> [!NOTE]
> _Exempt_ is different than _excluded_. For more details, see [scope](./scope.md).

### Unknown

 Unknown is the default compliance state for definitions with `manual` effect, unless the default has been explicitly set to compliant or non-compliant. This state indicates that an [attestation](./attestation-structure.md) of compliance is warranted. This compliance state only occurs for policy assignments with `manual` effect.

 ### Protected

 Protected state signifies that the resource is covered under an assignment with a [denyAction](./effects.md#denyaction) effect.

### Not registered

This compliance state is visible in portal when the Azure Policy Resource Provider hasn't been registered, or when the account logged in doesn't have permission to read compliance data.

> [!NOTE]
> If compliance state is being reported as **Not registered**, verify that the
> **Microsoft.PolicyInsights** Resource Provider is registered and that the user has the appropriate Azure role-based access control (Azure RBAC) permissions as described in
> [Azure RBAC permissions in Azure Policy](../overview.md#azure-rbac-permissions-in-azure-policy).
> To register Microsoft.PolicyInsights, [follow these steps](../../../azure-resource-manager/management/resource-providers-and-types.md).

### Not started

This compliance state indicates that the evaluation cycle hasn't started for the policy or resource.

## Example

Now that you have an understanding of what compliance states exist and what each one means, let's look at an example using compliant and non-compliant states. 

Suppose you have a resource group - ContosoRG, with some storage accounts
(highlighted in red) that are exposed to public networks.

:::image type="complex" source="../media/getting-compliance-data/resource-group01.png" alt-text="Diagram of storage accounts exposed to public networks in the Contoso R G resource group." border="false":::
   Diagram showing images for five storage accounts in the Contoso R G resource group. Storage accounts one and three are blue, while storage accounts two, four, and five are red.
:::image-end:::

In this example, you need to be wary of security risks. Assume you assign a policy definition that audits for storage accounts that are exposed to public networks, and that no exemptions are created for this assignment. The policy checks for applicable resources (which includes all storage accounts in the ContosoRG resource group), then evaluates those resources that aren't excluded from evaluation. It audits the three storage accounts exposed to public networks, changing their compliance states to **Non-compliant.** The remainder are marked **compliant**.

:::image type="complex" source="../media/getting-compliance-data/resource-group03.png" alt-text="Diagram of storage account compliance in the Contoso R G resource group." border="false":::
   Diagram showing images for five storage accounts in the Contoso R G resource group. Storage accounts one and three now have green checkmarks beneath them, while storage accounts two, four, and five now have red warning signs beneath them.
:::image-end:::

## Compliance rollup

Compliance state is determined per-resource, per-policy assignment. However, we often need a big-picture view of the state of the environment, which is where aggregate compliance comes into play.

There are several ways to view aggregated compliance results in the portal:

| Aggregate compliance view | Factors determining compliance state |
| --- | --- |
| Scope | All policies within the selected scope |
| Initiative | All policies within the initiative |
| Initiative group or control | All policies within the group or control |
| Policy  | All applicable resources |
| Resource | All applicable policies |

### Comparing different compliance states

So how is the aggregate compliance state determined if multiple resources or policies have different compliance states themselves? Azure Policy ranks each compliance state so that one "wins" over another in this situation. The rank order is:
1. Non-compliant
1. Compliant
1. Error
1. Conflicting
1. Protected (preview)
1. Exempted
1. Unknown (preview)

> [!NOTE]
> [Not started](#not-started) and [not registered](#not-registered) aren't considered in compliance rollup calculations.

With this ranking, if there are both non-compliant and compliant states, then the rolled up aggregate would be non-compliant, and so on. Let's look at an example:

Assume an initiative contains 10 policies, and a resource is exempt from one policy but compliant to the remaining nine. Because a compliant state has a higher rank than an exempted state, the resource would register as compliant in the rolled-up summary of the initiative. So, a resource only shows as exempt for the entire initiative if it's exempt from, or has unknown compliance to, every other single applicable policy in that initiative. On the other extreme, a resource that is non-compliant to at least one applicable policy in the initiative has an overall compliance state of non-compliant, regardless of the remaining applicable policies.

### Compliance percentage 

The compliance percentage is determined by dividing **Compliant**, **Exempt**, and **Unknown** resources by _total resources_. _Total resources_ include resources with **Compliant**, **Non-compliant**, **Unknown**, 
**Exempt**, **Conflicting**, and **Error** states. 

```text
overall compliance % = (compliant + exempt + unknown)  / (compliant + exempt + unknown + non-compliant + conflicting + error)
```

In the image shown, there are 20 distinct resources that are applicable and only one is **Non-compliant**.
The overall resource compliance is 95% (19 out of 20).

:::image type="content" source="../media/getting-compliance-data/simple-compliance.png" alt-text="Screenshot of policy compliance details from Compliance page." border="false":::

## Next steps

- Learn how to [get compliance data](../how-to/get-compliance-data.md)
- Learn how to [determine causes of non-compliance](../how-to/determine-non-compliance.md)
- Get compliance data through [ARG query samples](../samples/resource-graph-samples.md)
