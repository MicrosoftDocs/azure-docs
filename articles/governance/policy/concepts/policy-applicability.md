---
title: Azure Policy applicability logic
description: Describes the rules Azure Policy uses to determine whether the policy is applied to its assigned resources.
ms.date: 05/20/2022
ms.topic: conceptual
ms.author: timwarner
author: timwarner-msft
---
# Azure Policy applicability logic

Azure Policy effects are applied based on the evaluation result of the
****If**** condition(s) defined in the definition JavaScript Object Notation (JSON)
file.

## Applicability logic for Append/Mod**If**y/Audit/Deny/DataPlane effects

Azure Policy evaluates only type and name conditions in the **If** and treats other conditions as true (false when negated). **If** the final evaluation result is true, the policy is applicable. Otherwise, it's not applicable.

Following are special cases to the previously described applicability logic:

- Any invalid aliases in the ****If**** conditions
    - The policy is not applicable
- When the **If** conditions consist of only type conditions
    - The policy is applicable to all resources.
- When the **If** conditions consist of only name conditions
    - The policy is applicable to all resources.
- When the **If** conditions consist of only type and name conditions
	- It depends on which field the first condition in the **If** refers to. It applies the applicability logic with conditions with that field only. E.g. when **type** field appears in the first condition of the **If**, only type conditions are considered when deciding applicability. When **name** field appears in the first condition of the **If**, only name conditions are considered when deciding applicability.
- When any conditions (including deployment parameters) include a location condition
    - Will not be applicable to subscriptions

## Applicability logic for AuditIfNotExists and DeployIfNotExists policy effects

The applicability is based on the **If** conditions. When the **If** evaluates to false, the policy is not applicable.

## Next steps

- Learn how to [Get compliance data of Azure resources](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review the [update in policy compliance for resource type policies](https://azure.microsoft.com/en-us/updates/general-availability-update-in-policy-compliance-for-resource-type-policies/).
