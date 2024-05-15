---
title: Azure Policy definitions append effect
description: Azure Policy definitions append effect determines how compliance is managed and reported.
ms.date: 04/08/2024
ms.topic: conceptual
---

# Azure Policy definitions append effect

The `append` effect is used to add more fields to the requested resource during creation or update. A common example is specifying allowed IPs for a storage resource.

> [!IMPORTANT]
> `append` is intended for use with non-tag properties. While `append` can add tags to a resource during a create or update request, it's recommended to use the [modify](./effect-modify.md) effect for tags instead.

## Append evaluation

The `append` effect evaluates before the request gets processed by a Resource Provider during the creation or updating of a resource. Append adds fields to the resource when the `if` condition of the policy rule is met. If the append effect would override a value in the original request with a different value, then it acts as a deny effect and rejects the request. To append a new value to an existing array, use the `[*]` version of the alias.

When a policy definition using the append effect is run as part of an evaluation cycle, it doesn't make changes to resources that already exist. Instead, it marks any resource that meets the `if` condition as non-compliant.

## Append properties

An append effect only has a `details` array, which is required. Because `details` is an array, it can take either a single `field/value` pair or multiples. Refer to [definition structure](./definition-structure-policy-rule.md#fields) for the list of acceptable fields.

## Append examples

Example 1: Single `field/value` pair using a non-`[*]` [alias](./definition-structure-alias.md) with an array `value` to set IP rules on a storage account. When the non-`[*]` alias is an array, the effect appends the `value` as the entire array. If the array already exists, a `deny` event occurs from the conflict.

```json
"then": {
  "effect": "append",
  "details": [
    {
      "field": "Microsoft.Storage/storageAccounts/networkAcls.ipRules",
      "value": [
        {
          "action": "Allow",
          "value": "134.5.0.0/21"
        }
      ]
    }
  ]
}
```

Example 2: Single `field/value` pair using an `[*]` [alias](./definition-structure-alias.md) with an array `value` to set IP rules on a storage account. When you use the `[*]` alias, the effect appends the `value` to a potentially pre-existing array. Arrays that don't exist are created.

```json
"then": {
  "effect": "append",
  "details": [
    {
      "field": "Microsoft.Storage/storageAccounts/networkAcls.ipRules[*]",
      "value": {
        "value": "40.40.40.40",
        "action": "Allow"
      }
    }
  ]
}
```

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](definition-structure-basics.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review [Azure management groups](../../management-groups/overview.md).
