---
title: Details of the policy enrollment structure
description: Describes the policy enrollment resource used by Azure Policy to enroll resources or scopes into an Enroll mode policy assignment.
ms.date: 06/22/2026
ms.topic: reference
---

# Azure Policy enrollment structure

The Azure Policy enrollments feature is used to _enroll_ a resource hierarchy or an individual resource into a policy assignment that's configured with [Enroll enforcement mode](./assignment-structure.md#enforcement-mode). Resources that are enrolled are evaluated by the assignment and have the policy effect enforced during resource creation or update. Resources that are in scope for the assignment but aren't enrolled still have compliance records generated, but the policy effect isn't enforced.

You use JavaScript Object Notation (JSON) to create a policy enrollment. The policy enrollment contains elements for:

- [display name](#display-name-and-description)
- [description](#display-name-and-description)
- [policy assignment](#policy-assignment-id)
- [policy definitions within an initiative](#policy-definition-ids)
- [resource selectors](#resource-selectors)
- [assignment scope validation](#assignment-scope-validation-preview)

A policy enrollment is created as a child object on the resource hierarchy or the individual resource that's enrolled. An enrollment can be created at or above the scope of the resource that should be enrolled. Conceptually, an enrollment is the opposite of an exemption: an exemption removes a scope from enforcement, while an enrollment adds a scope to an Enroll mode assignment.

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

## Display name and description

You use `displayName` and `description` to identify the policy enrollment and provide context for its use with the specific resource or scope. `displayName` has a maximum length of _128_ characters and `description` a maximum length of _512_ characters.

## Policy assignment ID

This field must be the full path name of either a policy assignment or an initiative assignment. The `policyAssignmentId` is a string and not an array. This property defines which assignment the parent resource hierarchy or individual resource is _enrolled_ in.

## Policy definition IDs

If the `policyAssignmentId` is for an initiative assignment, the `policyDefinitionReferenceIds` property might be used to specify which policy definitions in the initiative the enrollment applies to. As the resource might be enrolled into one or more included policy definitions, this property is an _array_. The values must match the values in the initiative definition in the `policyDefinitions.policyDefinitionReferenceId` fields.

## Resource selectors

Enrollments support an optional property `resourceSelectors` that works the same way in enrollments as it does in assignments. The property allows for gradual rollout or rollback of an _enrollment_ to certain subsets of resources in a controlled manner based on resource type, resource location, or whether the resource has a location. More details about how to use resource selectors can be found in the [assignment structure](assignment-structure.md#resource-selectors). The following JSON is an example enrollment that uses resource selectors. In this example, only resources in `eastus` and `westus` are enrolled into the policy assignment:

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

## Assignment scope validation (preview)

In most scenarios, the enrollment scope is validated to ensure it's at or under the policy assignment scope. The optional `assignmentScopeValidation` property can allow an enrollment to bypass this validation and be created outside of the assignment scope. The use of this property is shown in the following example:

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

The `PATCH` operation for policy enrollments supports only the `assignmentScopeValidation` and `resourceSelectors` properties.

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

## Enrollment creation and management

Enrollments are recommended for scenarios where a policy assignment should be visible across its full scope, but the policy effect should be enforced only for selected resources or scopes. For example, you can create an assignment with `enforcementMode` set to `Enroll`, validate compliance results for the full assignment scope, and then create enrollment resources for the regions, resource groups, subscriptions, or management groups that are ready for enforcement.

An assignment can switch between enforcement modes. Existing enrollments are honored when the assignment is in Enroll mode. If the assignment switches out of Enroll mode and later switches back to Enroll mode, existing enrollments are honored again. If an assignment is deleted and recreated with the same ID, previous enrollments aren't honored by the new assignment.

## Next steps

- Learn about [the policy assignment structure](./assignment-structure.md).
- Learn about [safe deployment of Azure Policy assignments](../how-to/policy-safe-deployment-practices.md).
- Learn about [policy exemptions](./exemption-structure.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
