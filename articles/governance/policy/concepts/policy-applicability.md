---
title: Azure Policy applicability logic
description: Describes the rules Azure Policy uses to determine whether the policy is applied to its assigned resources.
ms.date: 09/22/2022
ms.topic: conceptual
ms.author: davidsmatlak
author: davidsmatlak
---
# What is applicability in Azure Policy?

When a policy definition is assigned to a scope, Azure Policy determines which resources in that scope should be considered for compliance evaluation. A resource will only be assessed for compliance if it's considered **applicable** to the given policy assignment. 

Applicability is determined by several factors:
- **Conditions** in the `if` block of the [policy rule](../concepts/definition-structure.md#policy-rule).
- **Mode** of the policy definition.
- **Excluded scopes** specified in the assignment. 
- **Resource selectors** specified in the assignment. 
- **Exemptions** of resources or resource hierarchies.

Condition(s) in the `if` block of the policy rule are evaluated for applicability in slightly different ways based on the effect.

> [!NOTE]
> Applicability is different from compliance, and the logic used to determine each is different. If a resource is **applicable** that means it is relevant to the policy. If a resource is **compliant** that means it adheres to the policy. Sometimes only certain conditions from the policy rule impact applicability, while all conditions of the policy rule impact compliance state.

## Resource manager modes

### -IfNotExists policy effects

The applicability of `AuditIfNotExists` and `DeployIfNotExists` policies is based off the entire `if` condition of the policy rule. When the `if` evaluates to false, the policy isn't applicable.

### All other policy effects

Azure Policy evaluates only `type`, `name`, and `kind` conditions in the policy rule `if` expression and treats other conditions as true (or false when negated). If the final evaluation result is true, the policy is applicable. Otherwise, it's not applicable.

Following are special cases to the previously described applicability logic:

|Scenario  |Result  |
|---------|---------|
|Any invalid aliases in the `if` conditions     |The policy isn't applicable |
|When the `if` conditions consist of only `kind` conditions     |The policy is applicable to all resources |
|When the `if` conditions consist of only `name` conditions     |The policy is applicable to all resources |
|When the `if` conditions consist of only `type` and `kind` conditions     |Only `type` conditions are considered when deciding applicability |
|When the `if` conditions consist of only `type` and `name` conditions     |Only `type` conditions are considered when deciding applicability |
|When the `if` conditions consist of `type`, `kind`, and other conditions |Both `type` and `kind` conditions are considered when deciding applicability |
|When the `if` conditions consist of `type`, `name`, and other conditions |Both `type` and `name` conditions are considered when deciding applicability |
|When any conditions (including deployment parameters) include a `location` condition     |Won't be applicable to subscriptions |


## Rsource provider modes

### Microsoft.Kubernetes.Data

The applicability of `Microsoft.Kubernetes.Data` policies is based off the entire `if` condition of the policy rule. When the `if` evaluates to false, the policy isn't applicable.

### Microsoft.KeyVault.Data, Microsoft.ManagedHSM.Data,and  Microsoft.DataFactory.Data

Policies with mode `Microsoft.KeyVault.Data` are applicable if the `type` condition of the policy rule evaluates to true. The `type` refers to component type.

Key Vault component types:
- Microsoft.KeyVault.Data/vaults/certificates
- Microsoft.KeyVault.Data/vaults/keys
- Microsoft.KeyVault.Data/vaults/secrets

Managed HSM component type:
- Microsoft.ManagedHSM.Data/managedHsms/keys

Azure Data Factory component type:
- Microsoft.DataFactory.Data/factories/outboundTraffic

### Microsoft.Network.Data

Policies with mode `Microsoft.Network.Data` are applicable if the `type` and `name` conditions of the policy rule evaluate to true. The `type` refers to  component type:
- Microsoft.Network/virtualNetworks

## Not Applicable Resources 

There could be situations in which resources are applicable to an assignment based on the policy conditions or scope of the resource, but they should not be applicable due to business reasons. At that time, it would be best to leverage [exclusions](./assignment-structure.md#excluded-scopes) or [exemptions](./exemption-structure.md). To learn more on when to use either, review [scope comparison](./scope.md#scope-comparison)

> [!NOTE]
> By design, Azure Policy does not evaluate resources under the `Microsoft.Resources` resource provider (RP) from
policy evaluation, except for subscriptions and resource groups. 

## Next steps

- Learn how to [Get compliance data of Azure resources](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review the [update in policy compliance for resource type policies](https://azure.microsoft.com/updates/general-availability-update-in-policy-compliance-for-resource-type-policies/).
