---
title: Understand scope in Azure Policy
description: Describes the concept of scope in Azure Resource Manager and how it applies to Azure Policy to control which resources Azure Policy evaluates.
ms.date: 06/15/2023
ms.topic: conceptual
ms.custom: devx-track-arm-template
---

# Understand scope in Azure Policy

There are many settings that determine which resources are capable of being evaluated and which
resources are evaluated by Azure Policy. The primary concept for these controls is _scope_. Scope in
Azure Policy is based on how scope works in Azure Resource Manager. For a high-level overview, see
[Scope in Azure Resource Manager](../../../azure-resource-manager/management/overview.md#understand-scope).

This article explains the importance of _scope_ in Azure Policy and it's related objects and
properties.

## Definition location

The first instance scope used by Azure Policy is when a policy definition is created. The definition
may be saved in either a management group or a subscription. The location determines the scope to
which the initiative or policy can be assigned. Resources must be within the resource hierarchy of
the definition location to target for assignment. The [resources covered by Azure Policy](../overview.md#resources-covered-by-azure-policy) describes how policies are evaluated.

If the definition location is a:

- **Subscription** - Only resources within that subscription can be assigned the policy definition.
- **Management group** - Only resources within child management groups and child subscriptions can
  be assigned the policy definition. If you plan to apply the policy definition to several
  subscriptions, the location must be a management group that contains each subscription.

The location should be the resource container shared by all resources you want to use the policy
definition on exist. This resource container is typically a management group near the root
management group.

## Assignment scopes

An assignment has several properties that set a scope. The use of these properties determines which
resource for Azure Policy to evaluate and which resources count toward compliance. These properties
map to the following concepts:

- Inclusion - A resource hierarchy or individual resource should be evaluated for compliance by the
  definition. The `properties.scope` property on an assignment object determines what to include and
  evaluate for compliance. For more information, see
  [Assignment definition](./assignment-structure.md).

- Exclusion - A resource hierarchy or individual resource shouldn't be evaluated for compliance by
  the definition. The `properties.notScopes` _array_ property on an assignment object determines
  what to exclude. Resources within these scopes aren't evaluated or included in the compliance
  count. For more information, see
  [Assignment definition - excluded scopes](./assignment-structure.md#excluded-scopes).

In addition to the properties on the policy assignment, is the
[policy exemption](./exemption-structure.md) object. Exemptions enhance the scope story by providing
a method to identify a portion of an assignment to not be evaluated.

- Exemption - A resource hierarchy or individual resource should be
  evaluated for compliance by the definition, but won't be evaluated for a reason such as having a
  waiver or being mitigated through another method. Resources in this state show as **Exempted** in
  compliance reports so that they can be tracked. The exemption object is created on the resource
  hierarchy or individual resource as a child object, which determines the scope of the exemption. A
  resource hierarchy or individual resource can be exempt from multiple assignments. The exemption
  may be configured to expire on a schedule by using the `expiresOn` property. For more information,
  see [Exemption definition](./exemption-structure.md).

  > [!NOTE]
  > Due to the impact of granting an exemption for a resource hierarchy or individual resource,
  > exemptions have additional security measures. In addition to requiring the
  > `Microsoft.Authorization/policyExemptions/write` operation on the resource hierarchy or
  > individual resource, the creator of an exemption must have the `exempt/Action` verb on the
  > target assignment.

## Scope comparison

The following table is a comparison of the scope options:

| | Inclusion | Exclusion (notScopes) | Exemption |
|---|:---:|:---:|:---:|
|**Resources are evaluated** | &#10004; | - | - |
|**Resource Manager object** | - | - | &#10004; |
|**Requires modifying policy assignment object** | &#10004; | &#10004; | - |

So how do you choose whether to use an exclusion or exemption? Typically exclusions are recommended to permanently bypass evaluation for a broad scope like a test environment that doesn't require the same level of governance. Exemptions are recommended for time-bound or more specific scenarios where a resource or resource hierarchy should still be tracked and would otherwise be evaluated, but there's a specific reason it shouldn't be assessed for compliance.

## Next steps

- Learn about the [policy definition structure](./definition-structure.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with
  [Organize your resources with Azure management groups](../../management-groups/overview.md).
