---
title: Details of the policy exemption structure
description: Describes the policy exemption definition used by Azure Policy to exempt resources from evaluation of initiatives or definitions.
ms.date: 03/04/2025
ms.topic: conceptual
---

# Azure Policy exemption structure

The Azure Policy exemptions feature is used to _exempt_ a resource hierarchy or an individual resource from evaluation of initiatives or definitions. Resources that are _exempt_ count toward overall compliance, but can't be evaluated or have a temporary waiver. For more information, see [Understand applicability in Azure Policy](./policy-applicability.md). Azure Policy exemptions also work with the following [Resource Manager modes](./definition-structure-basics.md#resource-manager-modes): `Microsoft.Kubernetes.Data`, `Microsoft.KeyVault.Data`, and `Microsoft.Network.Data`.

You use JavaScript Object Notation (JSON) to create a policy exemption. The policy exemption contains elements for:

- [display name](#display-name-and-description)
- [description](#display-name-and-description)
- [metadata](#metadata)
- [policy assignment](#policy-assignment-id)
- [policy definitions within an initiative](#policy-definition-ids)
- [exemption category](#exemption-category)
- [expiration](#expiration)
- [resource selectors](#resource-selectors)
- [assignment scope validation](#assignment-scope-validation-preview)


A policy exemption is created as a child object on the resource hierarchy or the individual resource granted the exemption. Exemptions can't be created at the Resource Provider mode component level. If the parent resource to which the exemption applies is removed, then the exemption is removed as well.

For example, the following JSON shows a policy exemption in the **waiver** category of a resource to an initiative assignment named `resourceShouldBeCompliantInit`. The resource is _exempt_ from only two of the policy definitions in the initiative, the `customOrgPolicy` custom policy definition ( `policyDefinitionReferenceId`: `requiredTags`) and the **Allowed locations** built-in policy definition ( `policyDefinitionReferenceId` : `allowedLocations`):

```json
{
  "id": "/subscriptions/{subId}/resourceGroups/{rgName}/providers/Microsoft.Authorization/policyExemptions/resourceIsNotApplicable",
  "apiVersion": "2020-07-01-preview",
  "name": "resourceIsNotApplicable",
  "type": "Microsoft.Authorization/policyExemptions",
  "properties": {
    "displayName": "This resource is scheduled for deletion",
    "description": "This resources is planned to be deleted by end of quarter and has been granted a waiver to the policy.",
    "metadata": {
      "requestedBy": "Storage team",
      "approvedBy": "IA",
      "approvedOn": "2020-07-26T08:02:32.0000000Z",
      "ticketRef": "4baf214c-8d54-4646-be3f-eb6ec7b9bc4f"
    },
    "policyAssignmentId": "/subscriptions/{mySubscriptionID}/providers/Microsoft.Authorization/policyAssignments/resourceShouldBeCompliantInit",
    "policyDefinitionReferenceId": [
      "requiredTags",
      "allowedLocations"
    ],
    "exemptionCategory": "waiver",
    "expiresOn": "2020-12-31T23:59:00.0000000Z",
    "assignmentScopeValidation": "Default"
  }
}
```

## Display name and description

You use `displayName` and `description` to identify the policy exemption and provide context for its use with the specific resource. `displayName` has a maximum length of _128_ characters and `description` a maximum length of _512_ characters.

## Metadata

The `metadata` property allows creating any child property needed for storing relevant information. In the example, properties `requestedBy`, `approvedBy`, `approvedOn`, and `ticketRef` contains customer values to provide information on who requested the exemption, who approved it and when, and an internal tracking ticket for the request. These `metadata` properties are examples, but they aren't required and `metadata` isn't limited to these child properties.

## Policy assignment ID

This field must be the full path name of either a policy assignment or an initiative assignment. The `policyAssignmentId` is a string and not an array. This property defines which assignment the parent resource hierarchy or individual resource is _exempt_ from.

## Policy definition IDs

If the `policyAssignmentId` is for an initiative assignment, the `policyDefinitionReferenceId` property might be used to specify which policy definition in the initiative the subject resource has an exemption to. As the resource might be exempted from one or more included policy definitions, this property is an _array_. The values must match the values in the initiative definition in the `policyDefinitions.policyDefinitionReferenceId` fields.

## Exemption category

Two exemption categories exist and are used to group exemptions:

- Mitigated: The exemption is granted because the policy intent is met through another method.
- Waiver: The exemption is granted because the non-compliance state of the resource is temporarily accepted. Another reason to use this category is to exclude a resource or resource hierarchy from one or more definitions in an initiative, but shouldn't be excluded from the entire initiative.

## Expiration

To set when a resource hierarchy or an individual resource is no longer _exempt_ from an assignment, set the `expiresOn` property. This optional property must be in the Universal ISO 8601 DateTime format `yyyy-MM-ddTHH:mm:ss.fffffffZ`.

> [!NOTE]
> The policy exemptions isn't deleted when the `expiresOn` date is reached. The object is preserved for record-keeping, but the exemption is no longer honored.

## Resource selectors

Exemptions support an optional property `resourceSelectors` that works the same way in exemptions as it does in assignments. The property allows for gradual rollout or rollback of an _exemption_ to certain subsets of resources in a controlled manner based on resource type, resource location, or whether the resource has a location. More details about how to use resource selectors can be found in the [assignment structure](assignment-structure.md#resource-selectors). The following JSON is an example exemption that uses resource selectors. In this example, only resources in `westcentralus` are exempt from the policy assignment:

```json
{
  "properties": {
    "policyAssignmentId": "/subscriptions/{subId}/providers/Microsoft.Authorization/policyAssignments/CostManagement",
    "policyDefinitionReferenceId": [
      "limitSku",
      "limitType"
    ],
    "exemptionCategory": "Waiver",
    "resourceSelectors": [
      {
        "name": "TemporaryMitigation",
        "selectors": [
          {
            "kind": "resourceLocation",
            "in": [
              "westcentralus"
            ]
          }
        ]
      }
    ]
  },
  "systemData": { ...
  },
  "id": "/subscriptions/{subId}/resourceGroups/{rgName}/providers/Microsoft.Authorization/policyExemptions/DemoExpensiveVM",
  "type": "Microsoft.Authorization/policyExemptions",
  "name": "DemoExpensiveVM"
}
```

Regions can be added or removed from the `resourceLocation` list in the example. Resource selectors allow for greater flexibility of where and how exemptions can be created and managed.

## Assignment scope validation (preview)

In most scenarios, the exemption scope is validated to ensure it's at or under the policy assignment scope. The optional `assignmentScopeValidation` property can allow an exemption to bypass this validation and be created outside of the assignment scope. This validation is intended for situations where a subscription needs to be moved from one management group (MG) to another, but the move would be blocked by policy due to properties of resources within the subscription. In this scenario, an exemption could be created for the subscription in its current MG to exempt its resources from a policy assignment on the destination MG. That way, when the subscription is moved into the destination MG, the operation isn't blocked because resources are already exempt from the policy assignment in question. The use of this property is shown in the following example:

```json
{
  "properties": {
    "policyAssignmentId": "/providers/Microsoft.Management/managementGroups/{mgName}/providers/Microsoft.Authorization/policyAssignments/CostManagement",
    "policyDefinitionReferenceId": [
      "limitSku",
      "limitType"
    ],
    "exemptionCategory": "Waiver",
    "assignmentScopeValidation": "DoNotValidate",
  },
  "systemData": { ...
  },
  "id": "/subscriptions/{subId}/providers/Microsoft.Authorization/policyExemptions/DemoExpensiveVM",
  "type": "Microsoft.Authorization/policyExemptions",
  "name": "DemoExpensiveVM"
}
```

Allowed values for `assignmentScopeValidation` are `Default`and `DoNotValidate`. If not specified, the default validation process occurs.

## Required permissions

The Azure role-based access control (Azure RBAC) permissions needed to manage Policy exemption objects are in the `Microsoft.Authorization/policyExemptions` operation group. The built-in roles [Resource Policy Contributor](../../../role-based-access-control/built-in-roles.md#resource-policy-contributor) and [Security Admin](../../../role-based-access-control/built-in-roles.md#security-admin) both have the `read` and `write` permissions and [Policy Insights Data Writer (Preview)](../../../role-based-access-control/built-in-roles.md#policy-insights-data-writer-preview) has the `read` permission.

Exemptions have extra security measures because of the effect of granting an exemption. Beyond requiring the `Microsoft.Authorization/policyExemptions/write` operation on the resource hierarchy or individual resource, the creator of an exemption must have the `exempt/Action` verb on the target assignment.

## Exemption creation and management

Exemptions are recommended for time-bound or specific scenarios where a resource or resource hierarchy should still be tracked and would otherwise be evaluated, but there's a specific reason it shouldn't be assessed for compliance. For example, if an environment has the built-in definition `Storage accounts should disable public network access` (ID: `b2982f36-99f2-4db5-8eff-283140c09693`) assigned with _effect_ set to _audit_. Upon compliance assessment, resource `StorageAcc1` is non-compliant, but `StorageAcc1` must have public network access enable for business purposes. At that time, a request should be submitted to create an exemption resource that targets `StorageAcc1`. After the exemption is created, `StorageAcc1` is shown as _exempt_ in compliance review.

Regularly revisit your exemptions to ensure that all eligible items are appropriately exempted and promptly remove any that don't qualify for exemption. At that time, expired exemption resources can be deleted as well.


## Next steps

- Learn about [Azure Resource Graph queries on exemptions](../samples/resource-graph-samples.md#azure-policy-exemptions).
- Learn about [the difference between exclusions and exemptions](./scope.md#scope-comparison).
- Review the [Microsoft.Authorization policyExemptions resource type](/azure/templates/microsoft.authorization/policyexemptions?tabs=json).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
