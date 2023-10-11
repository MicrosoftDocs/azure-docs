---
title: Details of the policy exemption structure
description: Describes the policy exemption definition used by Azure Policy to exempt resources from evaluation of initiatives or definitions.
ms.date: 11/03/2022
ms.topic: conceptual
ms.author: davidsmatlak
author: davidsmatlak
---
# Azure Policy exemption structure

The Azure Policy exemptions feature is used to _exempt_ a resource hierarchy or an
individual resource from evaluation of initiatives or definitions. Resources that are _exempt_ count
toward overall compliance, but can't be evaluated or have a temporary waiver. For more information,
see [Understand applicability in Azure Policy](./policy-applicability.md). Azure Policy exemptions  work with
[Resource Manager modes](./definition-structure.md#resource-manager-modes), Microsoft.Kubneretes.Data, Microsoft.KeyVault.Data and Microsoft.Network.Data and don't work with the other 
[Resource Provider modes](./definition-structure.md#resource-provider-modes).

You use JavaScript Object Notation (JSON) to create a policy exemption. The policy exemption contains elements for:

- [display name](#display-name-and-description)
- [description](#display-name-and-description)
- [metadata](#metadata)
- [policy assignment](#policy-assignment-id)
- [policy definitions within an initiative](#policy-definition-ids)
- [exemption category](#exemption-category)
- [expiration](#expiration)
- [resource selectors](#resource-selectors-preview)
- [assignment scope validation](#assignment-scope-validation-preview)


A policy exemption is created as a child object on the resource hierarchy or the individual resource granted the exemption. Exemptions cannot be created at the Resource Provider mode component level. 
If the parent resource to which the exemption applies is removed, then the exemption is removed as well.

For example, the following JSON shows a policy exemption in the **waiver** category of a resource to
an initiative assignment named `resourceShouldBeCompliantInit`. The resource is _exempt_ from only
two of the policy definitions in the initiative, the `customOrgPolicy` custom policy definition
( `policyDefinitionReferenceId`: `requiredTags`) and the **Allowed locations** built-in policy definition ( `policyDefinitionReferenceId` : `allowedLocations`):

```json
{
    "id": "/subscriptions/{subId}/resourceGroups/ExemptRG/providers/Microsoft.Authorization/policyExemptions/resourceIsNotApplicable",
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
        "policyDefinitionReferenceIds": [
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

You use **displayName** and **description** to identify the policy exemption and provide context for
its use with the specific resource. **displayName** has a maximum length of _128_ characters and
**description** a maximum length of _512_ characters.

## Metadata

The **metadata** property allows creating any child property needed for storing relevant
information. In the example above, properties **requestedBy**, **approvedBy**, **approvedOn**, and
**ticketRef** contains customer values to provide information on who requested the exemption, who
approved it and when, and an internal tracking ticket for the request. These **metadata** properties
are examples, but they aren't required and **metadata** isn't limited to these child properties.

## Policy assignment ID

This field must be the full path name of either a policy assignment or an initiative assignment.
`policyAssignmentId` is a string and not an array. This property defines which assignment the parent
resource hierarchy or individual resource is _exempt_ from.

## Policy definition IDs

If the `policyAssignmentId` is for an initiative assignment, the **policyDefinitionReferenceIds** property may be used to specify which policy definition(s) in the initiative the subject resource
has an exemption to. As the resource may be exempted from one or more included policy definitions,
this property is an _array_. The values must match the values in the initiative definition in the
`policyDefinitions.policyDefinitionReferenceId` fields.

## Exemption category

Two exemption categories exist and are used to group exemptions:

- **Mitigated**: The exemption is granted because the policy intent is met through another method.
- **Waiver**: The exemption is granted because the non-compliance state of the resource is
  temporarily accepted. Another reason to use this category is for a resource or resource hierarchy
  that should be excluded from one or more definitions in an initiative, but shouldn't be excluded
  from the entire initiative.

## Expiration

To set when a resource hierarchy or an individual resource is no longer _exempt_ from an assignment,
set the **expiresOn** property. This optional property must be in the Universal ISO 8601 DateTime
format `yyyy-MM-ddTHH:mm:ss.fffffffZ`.

> [!NOTE]
> The policy exemptions isn't deleted when the `expiresOn` date is reached. The object is preserved
> for record-keeping, but the exemption is no longer honored.

## Resource selectors (preview)

Exemptions support an optional property `resourceSelectors`. This property works the same way in exemptions as it does in assignments, allowing for gradual rollout or rollback of an _exemption_ to certain subsets of resources in a controlled manner based on resource type, resource location, or whether the resource has a location. More details about how to use resource selectors can be found in the [assignment structure](assignment-structure.md#resource-selectors-preview). Below is an example exemption JSON which leverages resource selectors. In this example, only resources in `westcentralus` will be exempt from the policy assignment:

```json
{
    "properties": {
        "policyAssignmentId": "/subscriptions/{subId}/providers/Microsoft.Authorization/policyAssignments/CostManagement",
        "policyDefinitionReferenceIds": [
            "limitSku", "limitType"
        ],
        "exemptionCategory": "Waiver",
        "resourceSelectors": [
            {
                "name": "TemporaryMitigation",
                "selectors": [
                    {
                        "kind": "resourceLocation",
                        "in": [ "westcentralus" ]
                    }
                ]
            }
        ]
    },
    "systemData": { ... },
    "id": "/subscriptions/{subId}/resourceGroups/demoCluster/providers/Microsoft.Authorization/policyExemptions/DemoExpensiveVM",
    "type": "Microsoft.Authorization/policyExemptions",
    "name": "DemoExpensiveVM"
}
```

Regions can be added or removed from the `resourceLocation` list in the example above. Resource selectors allow for greater flexibility of where and how exemptions can be created and managed.

## Assignment scope validation (preview)

In most scenarios, the exemption scope is validated to ensure it is at or under the policy assignment scope. The optional `assignmentScopeValidation` property can allow an exemption to bypass this validation and be created outside of the assignment scope. This is intended for situations where a subscription needs to be moved from one management group (MG) to another, but the move would be blocked by policy due to properties of resources within the subscription. In this scenario, an exemption could be created for the subscription in its current MG to exempt its resources from a policy assignment on the destination MG. That way, when the subscription is moved into the destination MG, the operation is not blocked because resources are already exempt from the policy assignment in question. The use of this property is illustrated below:

```json
{
    "properties": {
        "policyAssignmentId": "/providers/Microsoft.Management/managementGroups/{mgB}/providers/Microsoft.Authorization/policyAssignments/CostManagement",
        "policyDefinitionReferenceIds": [
            "limitSku", "limitType"
        ],
        "exemptionCategory": "Waiver",
        "assignmentScopeValidation": "DoNotValidate",
    },
    "systemData": { ... },
    "id": "/subscriptions/{subIdA}/providers/Microsoft.Authorization/policyExemptions/DemoExpensiveVM",
    "type": "Microsoft.Authorization/policyExemptions",
    "name": "DemoExpensiveVM"
}
```

Allowed values for `assignmentScopeValidation` are `Default`and `DoNotValidate`. If not specified, the default validation process will occur.

## Required permissions

The Azure RBAC permissions needed to manage Policy exemption objects are in the
`Microsoft.Authorization/policyExemptions` operation group. The built-in roles
[Resource Policy Contributor](../../../role-based-access-control/built-in-roles.md#resource-policy-contributor)
and [Security Admin](../../../role-based-access-control/built-in-roles.md#security-admin) both have
the `read` and `write` permissions and
[Policy Insights Data Writer (Preview)](../../../role-based-access-control/built-in-roles.md#policy-insights-data-writer-preview)
has the `read` permission.

Exemptions have extra security measures because of the impact of granting an exemption. Beyond
requiring the `Microsoft.Authorization/policyExemptions/write` operation on the resource hierarchy
or individual resource, the creator of an exemption must have the `exempt/Action` verb on the target
assignment.

## Next steps

- Study the [Microsoft.Authorization policyExemptions resource type](/azure/templates/microsoft.authorization/policyexemptions?tabs=json).
- Learn about the [policy definition structure](./definition-structure.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with
  [Organize your resources with Azure management groups](../../management-groups/overview.md).
