---
title: Details of the policy assignment structure
description: Describes the policy assignment definition used by Azure Policy to relate policy definitions and parameters to resources for evaluation.
ms.date: 04/14/2021
ms.topic: conceptual
---
# Azure Policy assignment structure

Policy assignments are used by Azure Policy to define which resources are assigned which policies or
initiatives. The policy assignment can determine the values of parameters for that group of
resources at assignment time, making it possible to reuse policy definitions that address the same
resource properties with different needs for compliance.

You use JSON to create a policy assignment. The policy assignment contains elements for:

- display name
- description
- metadata
- enforcement mode
- excluded scopes
- policy definition
- non-compliance messages
- parameters

For example, the following JSON shows a policy assignment in _DoNotEnforce_ mode with dynamic
parameters:

```json
{
    "properties": {
        "displayName": "Enforce resource naming rules",
        "description": "Force resource names to begin with DeptA and end with -LC",
        "metadata": {
            "assignedBy": "Cloud Center of Excellence"
        },
        "enforcementMode": "DoNotEnforce",
        "notScopes": [],
        "policyDefinitionId": "/subscriptions/{mySubscriptionID}/providers/Microsoft.Authorization/policyDefinitions/ResourceNaming",
        "nonComplianceMessages": [
            {
                "message": "Resource names must start with 'DeptA' and end with '-LC'."
            }
        ],
        "parameters": {
            "prefix": {
                "value": "DeptA"
            },
            "suffix": {
                "value": "-LC"
            }
        }
    }
}
```

All Azure Policy samples are at [Azure Policy samples](../samples/index.md).

## Display name and description

You use **displayName** and **description** to identify the policy assignment and provide context
for its use with the specific set of resources. **displayName** has a maximum length of _128_
characters and **description** a maximum length of _512_ characters.

## Metadata

The optional `metadata` property stores information about the policy assignment. Customers can
define any properties and values useful to their organization in `metadata`. However, there are some
_common_ properties used by Azure Policy. Each `metadata` property has a limit of 1024 characters.

### Common metadata properties

- `assignedBy` (string): The friendly name of the security principal that created the assignment.
- `createdBy` (string): The GUID of the security principal that created the assignment.
- `createdOn` (string): The Universal ISO 8601 DateTime format of the assignment creation time.
- `parameterScopes` (object): A collection of key-value pairs where the key matches a
  [strongType](./definition-structure.md#strongtype) configured parameter name and the value defines
  the resource scope used in Portal to provide the list of available resources by matching
  _strongType_. Portal sets this value if the scope is different than the assignment scope. If set,
  an edit of the policy assignment in Portal automatically sets the scope for the parameter to this
  value. However, the scope isn't locked to the value and it can be changed to another scope.

  The following example of `parameterScopes` is for a _strongType_ parameter named
  **backupPolicyId** that sets a scope for resource selection when the assignment is edited in the
  Portal.

  ```json
  "metadata": {
      "parameterScopes": {
          "backupPolicyId": "/subscriptions/{SubscriptionID}/resourcegroups/{ResourceGroupName}"
      }
  }
  ```

- `updatedBy` (string): The friendly name of the security principal that updated the assignment, if
  any.
- `updatedOn` (string): The Universal ISO 8601 DateTime format of the assignment update time, if any.

## Enforcement Mode

The **enforcementMode** property provides customers the ability to test the outcome of a policy on
existing resources without initiating the policy effect or triggering entries in the
[Azure Activity log](../../../azure-monitor/essentials/platform-logs-overview.md). This scenario is
commonly referred to as "What If" and aligns to safe deployment practices. **enforcementMode** is
different from the [Disabled](./effects.md#disabled) effect, as that effect prevents resource
evaluation from happening at all.

This property has the following values:

|Mode |JSON Value |Type |Remediate manually |Activity log entry |Description |
|-|-|-|-|-|-|
|Enabled |Default |string |Yes |Yes |The policy effect is enforced during resource creation or update. |
|Disabled |DoNotEnforce |string |Yes |No | The policy effect isn't enforced during resource creation or update. |

If **enforcementMode** isn't specified in a policy or initiative definition, the value _Default_ is
used. [Remediation tasks](../how-to/remediate-resources.md) can be started for
[deployIfNotExists](./effects.md#deployifnotexists) policies, even when **enforcementMode** is set
to _DoNotEnforce_.

## Excluded scopes

The **scope** of the assignment includes all child resource containers and child resources. If a
child resource container or child resource shouldn't have the definition applied, each can be
_excluded_ from evaluation by setting **notScopes**. This property is an array to enable excluding
one or more resource containers or resources from evaluation. **notScopes** can be added or updated
after creation of the initial assignment.

> [!NOTE]
> An _excluded_ resource is different from an _exempted_ resource. For more information, see
> [Understand scope in Azure Policy](./scope.md).

## Policy definition ID

This field must be the full path name of either a policy definition or an initiative definition.
`policyDefinitionId` is a string and not an array. It's recommended that if multiple policies are
often assigned together, to use an [initiative](./initiative-definition-structure.md) instead.

## Non-compliance messages

To set a custom message that describes why a resource is non-compliant with the policy or initiative
definition, set `nonComplianceMessages` in the assignment definition. This node is an array of
`message` entries. This custom message is in addition to the default error message for
non-compliance and is optional.

> [!IMPORTANT]
> Custom messages for non-compliance are only supported on definitions or initiatives with
> [Resource Manager modes](./definition-structure.md#resource-manager-modes) definitions.

```json
"nonComplianceMessages": [
    {
        "message": "Default message"
    }
]
```

If the assignment is for an initiative, different messages can be configured for each policy
definition in the initiative. The messages use the `policyDefinitionReferenceId` value configured in
the initiative definition. For details, see
[policy definitions properties](./initiative-definition-structure.md#policy-definition-properties).

```json
"nonComplianceMessages": [
    {
        "message": "Default message"
    },
    {
        "message": "Message for just this policy definition by reference ID",
        "policyDefinitionReferenceId": "10420126870854049575"
    }
]
```

## Parameters

This segment of the policy assignment provides the values for the parameters defined in the
[policy definition or initiative definition](./definition-structure.md#parameters). This design
makes it possible to reuse a policy or initiative definition with different resources, but check for
different business values or outcomes.

```json
"parameters": {
    "prefix": {
        "value": "DeptA"
    },
    "suffix": {
        "value": "-LC"
    }
}
```

In this example, the parameters previously defined in the policy definition are `prefix` and
`suffix`. This particular policy assignment sets `prefix` to **DeptA** and `suffix` to **-LC**. The
same policy definition is reusable with a different set of parameters for a different department,
reducing the duplication and complexity of policy definitions while providing flexibility.

## Next steps

- Learn about the [policy definition structure](./definition-structure.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with
  [Organize your resources with Azure management groups](../../management-groups/overview.md).
