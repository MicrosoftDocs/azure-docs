---
title: Azure Policy definitions denyAction effect
description: Azure Policy definitions denyAction effect determines how compliance is managed and reported.
ms.date: 04/17/2024
ms.topic: conceptual
---

# Azure Policy definitions denyAction effect

The `denyAction` effect is used to block requests based on intended action to resources at scale. The only supported action today is `DELETE`. This effect and action name helps prevent any accidental deletion of critical resources.

## DenyAction evaluation

When a request call with an applicable action name and targeted scope is submitted, `denyAction` prevents the request from succeeding. The request is returned as a `403 (Forbidden)`. In the portal, the `Forbidden` can be viewed as a deployment status that was prevented by the policy assignment.

`Microsoft.Authorization/policyAssignments`, `Microsoft.Authorization/denyAssignments`, `Microsoft.Blueprint/blueprintAssignments`, `Microsoft.Resources/deploymentStacks`, `Microsoft.Resources/subscriptions`, and `Microsoft.Authorization/locks` are all exempt from `denyAction` enforcement to prevent lockout scenarios.

### Subscription deletion

Policy doesn't block removal of resources that happens during a subscription deletion.

### Resource group deletion

Policy evaluates resources that support location and tags against `denyAction` policies during a resource group deletion. Only policies that have the `cascadeBehaviors` set to `deny` in the policy rule block a resource group deletion. Policy doesn't block removal of resources that don't support location and tags nor any policy with `mode:all`.

### Cascade deletion

Cascade deletion occurs when deleting of a parent resource is implicitly deletes all its child and extension resources. Policy doesn't block removal of child and extension resources when a delete action targets the parent resources. For example, `Microsoft.Insights/diagnosticSettings` is an extension resource of `Microsoft.Storage/storageaccounts`. If a `denyAction` policy targets `Microsoft.Insights/diagnosticSettings`, a delete call to the diagnostic setting (child) fails, but a delete to the storage account (parent) implicitly deletes the diagnostic setting (extension).

[!INCLUDE [azure-policy-deny-action](../../includes/policy/azure-policy-deny-action.md)]

## DenyAction properties

The `details` property of the `denyAction` effect has all the subproperties that define the action and behaviors.

- `actionNames` (required)
  - An _array_  that specifies what actions to prevent from being executed.
  - Supported action names are: `delete`.
- `cascadeBehaviors` (optional)
  - An _object_ that defines which behavior is followed when a resource is implicitly deleted when a resource group is removed.
  - Only supported in policy definitions with [mode](./definition-structure.md#resource-manager-modes) set to `indexed`.
  - Allowed values are `allow` or `deny`.
  - Default value is `deny`.

## DenyAction example

Example: Deny any delete calls targeting database accounts that have a tag environment that equals prod. Since cascade behavior is set to deny, block any `DELETE` call that targets a resource group with an applicable database account.

```json
{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.DocumentDb/accounts"
      },
      {
        "field": "tags.environment",
        "equals": "prod"
      }
    ]
  },
  "then": {
    "effect": "denyAction",
    "details": {
      "actionNames": [
        "delete"
      ],
      "cascadeBehaviors": {
        "resourceGroup": "deny"
      }
    }
  }
}
```

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](definition-structure-basics.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review [Azure management groups](../../management-groups/overview.md).
