---
title: Azure Policy definitions auditIfNotExists effect
description: Azure Policy definitions auditIfNotExists effect determines how compliance is managed and reported.
ms.date: 04/08/2024
ms.topic: conceptual
---

# Azure Policy definitions auditIfNotExists effect

The `auditIfNotExists` effect enables auditing of resources _related_ to the resource that matches the `if` condition, but don't have the properties specified in the `details` of the `then` condition.

## AuditIfNotExists evaluation

`auditIfNotExists` runs after a Resource Provider processed a create or update resource request and returned a success status code. The audit occurs if there are no related resources or if the resources defined by `ExistenceCondition` don't evaluate to true. For new and updated resources, Azure Policy adds a `Microsoft.Authorization/policies/audit/action` operation to the activity log and marks the resource as non-compliant. When triggered, the resource that satisfied the `if` condition is the resource that is marked as non-compliant.

## AuditIfNotExists properties

The `details` property of the AuditIfNotExists effects has all the subproperties that define the related resources to match.

- `type` (required)
  - Specifies the type of the related resource to match.
  - If `type` is a resource type underneath the `if` condition resource, the policy queries for resources of this `type` within the scope of the evaluated resource. Otherwise, policy queries within the same resource group or subscription as the evaluated resource depending on the `existenceScope`.
- `name` (optional)
  - Specifies the exact name of the resource to match and causes the policy to fetch one specific resource instead of all resources of the specified type.
  - When the condition values for `if.field.type` and `then.details.type` match, then `name` becomes _required_ and must be `[field('name')]`, or `[field('fullName')]` for a child resource. However, an [audit](./effect-audit.md) effect should be considered instead.

> [!NOTE]
>
> `type` and `name` segments can be combined to generically retrieve nested resources.
>
> To retrieve a specific resource, you can use `"type": "Microsoft.ExampleProvider/exampleParentType/exampleNestedType"` and `"name": "parentResourceName/nestedResourceName"`.
>
> To retrieve a collection of nested resources, a wildcard character `?` can be provided in place of the last name segment. For example, `"type": "Microsoft.ExampleProvider/exampleParentType/exampleNestedType"` and `"name": "parentResourceName/?"`. This can be combined with field functions to access resources related to the evaluated resource, such as `"name": "[concat(field('name'), '/?')]"`."

- `resourceGroupName` (optional)
  - Allows the matching of the related resource to come from a different resource group.
  - Doesn't apply if `type` is a resource that would be underneath the `if` condition resource.
  - Default is the `if` condition resource's resource group.
- `existenceScope` (optional)
  - Allowed values are _Subscription_ and _ResourceGroup_.
  - Sets the scope of where to fetch the related resource to match from.
  - Doesn't apply if `type` is a resource that would be underneath the `if` condition resource.
  - For _ResourceGroup_, would limit to the resource group in `resourceGroupName` if specified. If `resourceGroupName` isn't specified, would limit to the `if` condition resource's resource group, which is the default behavior.
  - For _Subscription_, queries the entire subscription for the related resource. Assignment scope should be set at subscription or higher for proper evaluation.
  - Default is _ResourceGroup_.
- `evaluationDelay` (optional)
  - Specifies when the existence of the related resources should be evaluated. The delay is only
    used for evaluations that are a result of a create or update resource request.
  - Allowed values are `AfterProvisioning`, `AfterProvisioningSuccess`, `AfterProvisioningFailure`,
    or an ISO 8601 duration between 0 and 360 minutes.
  - The _AfterProvisioning_ values inspect the provisioning result of the resource that was
    evaluated in the policy rule's `if` condition. `AfterProvisioning` runs after provisioning is
    complete, regardless of outcome. Provisioning that takes more than six hours, is treated as a
    failure when determining _AfterProvisioning_ evaluation delays.
  - Default is `PT10M` (10 minutes).
  - Specifying a long evaluation delay might cause the recorded compliance state of the resource to
    not update until the next
    [evaluation trigger](../how-to/get-compliance-data.md#evaluation-triggers).
- `existenceCondition` (optional)
  - If not specified, any related resource of `type` satisfies the effect and doesn't trigger the
    audit.
  - Uses the same language as the policy rule for the `if` condition, but is evaluated against
    each related resource individually.
  - If any matching related resource evaluates to true, the effect is satisfied and doesn't trigger
    the audit.
  - Can use [field()] to check equivalence with values in the `if` condition.
  - For example, could be used to validate that the parent resource (in the `if` condition) is in
    the same resource location as the matching related resource.

## AuditIfNotExists example

Example: Evaluates Virtual Machines to determine whether the Antimalware extension exists then audits when missing.

```json
{
  "if": {
    "field": "type",
    "equals": "Microsoft.Compute/virtualMachines"
  },
  "then": {
    "effect": "auditIfNotExists",
    "details": {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "existenceCondition": {
        "allOf": [
          {
            "field": "Microsoft.Compute/virtualMachines/extensions/publisher",
            "equals": "Microsoft.Azure.Security"
          },
          {
            "field": "Microsoft.Compute/virtualMachines/extensions/type",
            "equals": "IaaSAntimalware"
          }
        ]
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
