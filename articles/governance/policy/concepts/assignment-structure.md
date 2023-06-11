---
title: Details of the policy assignment structure
description: Describes the policy assignment definition used by Azure Policy to relate policy definitions and parameters to resources for evaluation.
ms.date: 10/03/2022
ms.topic: conceptual
ms.author: davidsmatlak
author: davidsmatlak
---
# Azure Policy assignment structure

Policy assignments are used by Azure Policy to define which resources are assigned which policies or
initiatives. The policy assignment can determine the values of parameters for that group of
resources at assignment time, making it possible to reuse policy definitions that address the same
resource properties with different needs for compliance.

> [!NOTE]
> For more information on Azure Policy scope, see
> [Understand scope in Azure Policy](./scope.md).

You use JavaScript Object Notation (JSON) to create a policy assignment. The policy assignment contains elements for:

- [display name](#display-name-and-description)
- [description](#display-name-and-description)
- [metadata](#metadata)
- [resource selectors (preview)](#resource-selectors-preview)
- [overrides (preview)](#overrides-preview)
- [enforcement mode](#enforcement-mode)
- [excluded scopes](#excluded-scopes)
- [policy definition](#policy-definition-id)
- [non-compliance messages](#non-compliance-messages)
- [parameters](#parameters)
- [identity](#identity)

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
        },
        "identity": {
            "type": "SystemAssigned"
        },
        "resourceSelectors": [],
        "overrides": []
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
  `backupPolicyId` that sets a scope for resource selection when the assignment is edited in the
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
- `updatedOn` (string): The Universal ISO 8601 DateTime format of the assignment update time, if
  any.
- `evidenceStorages` (object): The recommended default storage account that should be used to hold evidence for attestations to policy assignments with a `manual` effect. The `displayName` property is the name of the storage account. The `evidenceStorageAccountID` property is the resource ID of the storage account. The  `evidenceBlobContainer` property is the blob container name in which you plan to store the evidence.

    ```json
    {
      "properties": {
        "displayName": "A contingency plan should be in place to ensure operational continuity for each Azure subscription.",
        "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/{definitionId}",
        "metadata": {
          "evidenceStorages": [
            {
              "displayName": "Default evidence storage",
              "evidenceStorageAccountId": "/subscriptions/{subscriptionId}/resourceGroups/{rg-name}/providers/Microsoft.Storage/storageAccounts/{storage-account-name}",
              "evidenceBlobContainer": "evidence-container"
            }
          ]
        }
      }
    }
    ```


## Resource selectors (preview)

The optional **resourceSelectors** property facilitates safe deployment practices (SDP) by enabling you to gradually roll
out policy assignments based on factors like resource location, resource type, or whether a resource has a location. When resource selectors are used, Azure Policy will only evaluate resources that are applicable to the specifications made in the resource selectors. Resource selectors can also be leveraged to narrow down the scope of [exemptions](exemption-structure.md) in the same way.

In the following example scenario, the new policy assignment will be evaluated only if the resource's location is
either **East US** or **West US**.

```json
{
    "properties": {
        "policyDefinitionId": "/subscriptions/{subId}/providers/Microsoft.Authorization/policyDefinitions/ResourceLimit",
        "definitionVersion": "1.1",
        "resourceSelectors": [
            {
                "name": "SDPRegions",
                "selectors": [
                    {
                        "kind": "resourceLocation",
                        "in": [ "eastus", "westus" ]
                    }
                ]
            }
        ]
    },
    "systemData": { ... },
    "id": "/subscriptions/{subId}/providers/Microsoft.Authorization/policyAssignments/ResourceLimit",
    "type": "Microsoft.Authorization/policyAssignments",
    "name": "ResourceLimit"
}
```

When you're ready to expand the evaluation scope for your policy, you just have to modify the assignment. The following example
shows our policy assignment with two additional Azure regions added to the **SDPRegions** selector. Note, in this example, _SDP_ means to _Safe Deployment Practice_:

```json
{
    "properties": {
        "policyDefinitionId": "/subscriptions/{subId}/providers/Microsoft.Authorization/policyDefinitions/ResourceLimit",
        "definitionVersion": "1.1",
        "resourceSelectors": [
            {
                "name": "SDPRegions",
                "selectors": [
                    {
                        "kind": "resourceLocation",
                        "in": [ "eastus", "westus", "centralus", "southcentralus" ]
                    }
                ]
            }
        ]
    },
    "systemData": { ... },
    "id": "/subscriptions/{subId}/providers/Microsoft.Authorization/policyAssignments/ResourceLimit",
    "type": "Microsoft.Authorization/policyAssignments",
    "name": "ResourceLimit"
}
```

Resource selectors have the following properties:
- `name`: The name of the resource selector.

- `selectors`: (Optional) The property used to determine which subset of resources applicable to the policy assignment should be evaluated for compliance.

  - `kind`: The property of a selector that describes what characteristic will narrow down the set of evaluated resources. Each kind can only be used once in a single resource selector. Allowed values are:

    - `resourceLocation`: This is used to select resources based on their type. Cannot be used in the same resource selector as `resourceWithoutLocation`.

    - `resourceType`: This is used to select resources based on their type.

    - `resourceWithoutLocation`: This is used to select resources at the subscription level which do not have a location. Currently only supports `subscriptionLevelResources`. Cannot be used in the same resource selector as `resourceLocation`.

  - `in`: The list of allowed values for the specified `kind`. Cannot be used with `notIn`. Can contain up to 50 values.

  - `notIn`: The list of not-allowed values for the specified `kind`. Cannot be used with `in`. Can contain up to 50 values.
  
A **resource selector** can contain multiple **selectors**. To be applicable to a resource selector, a resource must meet requirements specified by all its selectors. Further, up to 10 **resource selectors** can be specified in a single assignment. In-scope resources are evaluated when they satisfy any one of these resource selectors.

## Overrides (preview)

The optional **overrides** property allows you to change the effect of a policy definition without modifying
the underlying policy definition or using a parameterized effect in the policy definition.

The most common use case for overrides is policy initiatives with a large number of associated policy definitions. In this situation, managing multiple policy effects can consume significant administrative effort, especially when the effect needs to be updated from time to time. Overrides can be used to simultaneously update the effects of multiple policy definitions within an initiative.

Let's take a look at an example. Imagine you have a policy initiative named _CostManagement_ that includes a custom policy definition with `policyDefinitionReferenceId` _corpVMSizePolicy_ and a single effect of `audit`. Suppose you want to assign the _CostManagement_ initiative, but do not yet want to see compliance reported for this policy. This policy's 'audit' effect can be replaced by 'disabled' through an override on the initiative assignment, as shown below:

```json
{
    "properties": {
        "policyDefinitionId": "/subscriptions/{subId}/providers/Microsoft.Authorization/policySetDefinitions/CostManagement",
        "overrides": [
            {
                "kind": "policyEffect",
                "value": "disabled",
                "selectors": [
                    {
                        "kind": "policyDefinitionReferenceId",
                        "in": [ "corpVMSizePolicy" ]
                    }
                ]
            }
        ]
    },
    "systemData": { ... },
    "id": "/subscriptions/{subId}/providers/Microsoft.Authorization/policyAssignments/CostManagement",
    "type": "Microsoft.Authorization/policyAssignments",
    "name": "CostManagement"
}
```

Overrides have the following properties:
- `kind`: The property the assignment will override. The supported kind is `policyEffect`.

- `value`: The new value which will override the existing value. The supported values are [effects](effects.md).

- `selectors`: (Optional) The property used to determine what scope of the policy assignment should take on the override.

  - `kind`: The property of a selector that describes what characteristic will narrow down the scope of the override. Allowed value for `kind: policyEffect` is:

    - `policyDefinitionReferenceId`: This specifies which policy definitions within an initiative assignment should take on the effect override.

  - `in`: The list of allowed values for the specified `kind`. Cannot be used with `notIn`. Can contain up to 50 values.

  - `notIn`: The list of not-allowed values for the specified `kind`. Cannot be used with `in`. Can contain up to 50 values.

Note that one override can be used to replace the effect of many policies by specifying multiple values in the policyDefinitionReferenceId array. A single override can be used for up to 50 policyDefinitionReferenceIds, and a single policy assignment can contain up to 10 overrides, evaluated in the order in which they are specified. Before the assignment is created, the effect chosen in the override is validated against the policy rule and parameter allowed value list (in cases where the effect is [parameterized](definition-structure.md#parameters)). 

## Enforcement mode

The **enforcementMode** property provides customers the ability to test the outcome of a policy on
existing resources without initiating the policy effect or triggering entries in the
[Azure Activity log](../../../azure-monitor/essentials/platform-logs-overview.md).

This scenario is
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
`policyDefinitionId` is a string and not an array. The latest content of the assigned policy
definition or initiative will be retrieved each time the policy assignment is evaluated. It's
recommended that if multiple policies are often assigned together, to use an
[initiative](./initiative-definition-structure.md) instead.

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

## Identity

For policy assignments with effect set to **deployIfNotExist** or **modify**, it is required to have an identity property to do remediation on non-compliant resources. When using identity, the user must also specify a location for the assignment.

> [!NOTE]
> A single policy assignment can be associated with only one system- or user-assigned managed identity. However, that identity can be assigned more than one role if necessary.

```json
# System-assigned identity
 "identity": {
    "type": "SystemAssigned"
  }
# User-assigned identity
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/SubscriptionID/resourceGroups/testResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/test-identity": {}
    }
  },
```

## Next steps

- Learn about the [policy definition structure](./definition-structure.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with
  [Organize your resources with Azure management groups](../../management-groups/overview.md).
