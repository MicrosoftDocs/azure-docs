---
title: Details of the policy enrollment structure
description: Describes the policy enrollment resource used by Azure Policy to apply policy enforcement to selected resources or scopes for an Enroll mode policy assignment.
ms.date: 07/30/2026
ms.topic: reference
author: monaidu
ms.author: monaidu
ms.service: azure-policy
---

# Azure Policy enrollment structure (Preview)

Azure Policy enrollments add selected resource hierarchies or individual resources to the enforcement path for a policy assignment that's configured with [Enroll enforcement mode](./assignment-structure.md#enforcement-mode). Enrolled resources are evaluated by the assignment and have the policy effect enforced during resource creation or update. Resources that are in scope for the assignment but aren't enrolled still have compliance records generated, but the policy effect isn't enforced. This approach is useful when you want to start with a limited set of scopes, validate the effect of enforcement, and then gradually add more subscopes to the assignment.

You use JavaScript Object Notation (JSON) to create a policy enrollment. The policy enrollment contains elements for:

- [display name](#display-name-and-description)
- [description](#display-name-and-description)
- [policy assignment](#policy-assignment-id)
- [policy definitions within an initiative](#policy-definition-reference-ids)
- [resource selectors](#resource-selectors)
- [assignment scope validation](#assignment-scope-validation)

A policy enrollment is created as a child object on the resource hierarchy or the individual resource that's enrolled. An enrollment can be created at or above the scope of the resource that should be enrolled. If the assignment for the enrollment is for an initiative, the enrollment can also reference a subset of policy definitions in the initiative.

For example, the following JSON shows a policy enrollment for a subscription to an assignment named `resourceShouldBeCompliantInit`. The enrollment applies to two policy definitions in the initiative, the `requiredTags` and `allowedLocations` policy definition reference IDs:

```json
{
  "id": "/subscriptions/{subId}/providers/Microsoft.Authorization/policyEnrollments/resourceShouldBeCompliant",
  "apiVersion": "2025-02-01-preview",
  "name": "resourceShouldBeCompliant",
  "type": "Microsoft.Authorization/policyEnrollments",
  "properties": {
    "displayName": "Enroll subscription in resource compliance policy",
    "description": "Enrolls the subscription into the resource compliance initiative assignment.",
    "policyAssignmentId": "/subscriptions/{mySubscriptionID}/providers/Microsoft.Authorization/policyAssignments/resourceShouldBeCompliantInit",
    "policyDefinitionReferenceIds": [
      "requiredTags",
      "allowedLocations"
    ],
    "assignmentScopeValidation": "Default"
  }
}
```

## Create a policy enrollment

You can create and manage policy enrollments by using Azure CLI, ARM templates, Bicep, or Terraform with the AzAPI provider. The policy assignment that you reference must already exist and must be configured with [Enroll enforcement mode](./assignment-structure.md#enforcement-mode).

## Display name and description

You use `displayName` and `description` to identify the policy enrollment and provide context for its use with the specific resource or scope. `displayName` has a maximum length of _128_ characters and `description` a maximum length of _512_ characters.

## Policy assignment ID

This field must be the full path name of either a policy assignment or an initiative assignment. The referenced assignment must use `Enroll` enforcement mode to create or update the policy enrollment. The `policyAssignmentId` is a string and not an array. This property defines which assignment applies enforcement to the parent resource hierarchy or individual resource.

## Policy definition reference IDs

If the `policyAssignmentId` is for an initiative assignment, the `policyDefinitionReferenceIds` property might be used to specify which policy definitions in the initiative the enrollment applies to. As the resource might be enrolled into one or more included policy definitions, this property is an _array_. The values must match the values in the initiative definition in the `policyDefinitions.policyDefinitionReferenceId` fields.

## Resource selectors

Enrollments support an optional property `resourceSelectors`. The property allows for gradual rollout or rollback of an _enrollment_ to certain subsets of resources in a controlled manner based on resource type, resource location, or whether the resource has a location. More details about how to use resource selectors can be found in the [assignment structure](assignment-structure.md#resource-selectors). The following JSON is an example enrollment that uses resource selectors. In this example, only resources in `eastus` and `westus` are enrolled into the policy assignment:

```json
{
  "properties": {
    "policyAssignmentId": "/subscriptions/{subId}/providers/Microsoft.Authorization/policyAssignments/ResourceLimit",
    "resourceSelectors": [
      {
        "name": "SDPRegions",
        "selectors": [
          {
            "kind": "resourceLocation",
            "in": [
              "eastus",
              "westus"
            ]
          }
        ]
      }
    ]
  },
  "systemData": { ...
  },
  "id": "/subscriptions/{subId}/providers/Microsoft.Authorization/policyEnrollments/ResourceLimitEnrollment",
  "type": "Microsoft.Authorization/policyEnrollments",
  "name": "ResourceLimitEnrollment"
}
```

The following resource selector `kinds` are supported in the policy enrollments object:

- `resourceLocation`: This property is used to select resources based on location. Can't be used in the same resource selector as `resourceWithoutLocation`.
- `resourceType`: This property is used to select resources based on their type.
- `resourceWithoutLocation`: This property is used to select resources at the subscription level that don't have a location. Currently only supports `subscriptionLevelResources`. Can't be used in the same resource selector as `resourceLocation`.
- `in`: The list of allowed values for the specified `kind`. Can't be used with `notIn`. Can contain up to 50 values.
- `notIn`: The list of not-allowed values for the specified `kind`. Can't be used with `in`. Can contain up to 50 values.

A **resource selector** can contain multiple `selectors`. To be applicable to a resource selector, a resource must meet requirements specified by all its selectors. Further, up to 10 `resourceSelectors` can be specified in a single enrollment. In-scope resources are enrolled when they satisfy any one of these resource selectors.

## Assignment scope validation

Controls whether we allow the creation of an enrollment for an assignment at a different scope. The use of this property is shown in the following example:

```json
{
  "properties": {
    "policyAssignmentId": "/providers/Microsoft.Management/managementGroups/{mgName}/providers/Microsoft.Authorization/policyAssignments/CostManagement",
    "policyDefinitionReferenceIds": [
      "limitSku",
      "limitType"
    ],
    "assignmentScopeValidation": "DoNotValidate"
  },
  "systemData": { ...
  },
  "id": "/subscriptions/{subId}/providers/Microsoft.Authorization/policyEnrollments/DemoExpensiveVM",
  "type": "Microsoft.Authorization/policyEnrollments",
  "name": "DemoExpensiveVM"
}
```

Allowed values for `assignmentScopeValidation` are `Default` and `DoNotValidate`. If not specified, the default validation process occurs.

## Update an enrollment

Currently policy enrollments only support updating the `assignmentScopeValidation` and `resourceSelectors` properties when doing a `PATCH` operation.

```json
{
  "properties": {
    "assignmentScopeValidation": "Default",
    "resourceSelectors": [
      {
        "name": "SDPRegions",
        "selectors": [
          {
            "kind": "resourceLocation",
            "in": [
              "eastus",
              "westus"
            ]
          }
        ]
      }
    ]
  }
}
```

## Delete a policy enrollment

Deleting a policy enrollment removes that enrollment resource. Deleting the enrollment doesn't delete the underlying policy assignment that the enrollment references, and will continue to be assigned at the scope that it was enrolled in. 

## List policy enrollments

When you list policy enrollments at a scope, the default response includes enrollments that apply to any part of that scope. The response can include enrollments from parent scopes and enrollments from subscopes.

Use list filters to control whether the response includes inherited enrollments or only enrollments created at the requested scope.

Use `atScope()` when you want to understand the effective enrollments for a scope. This filter returns policy enrollments at the requested scope and parent scopes.

```azurecli
az policy enrollment list \
  --scope "/subscriptions/{subscriptionId}" \
  --filter "atScope()"
  ```

Use `atExactScope()` when you want to manage only the enrollment resources created directly at the requested scope.


```azurecli
az policy enrollment list \
  --scope "/subscriptions/{subscriptionId}" \
  --filter "atExactScope()"
```

For example, if a subscription has three enrollments created at subscription scope and four inherited from a parent management group, atScope() returns all seven enrollments. atExactScope() returns only the three enrollments created at the subscription scope.

| Filter | Description |
| --- | --- |
| `atScope()` | Returns policy enrollments at the requested scope and parent scopes. |
| `atExactScope()` | Returns policy enrollments at only the requested scope. |

## Next steps

- Learn about [the policy assignment structure](./assignment-structure.md).
- Learn about [safe deployment of Azure Policy assignments](../how-to/policy-safe-deployment-practices.md).
- Learn about [policy exemptions](./exemption-structure.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
