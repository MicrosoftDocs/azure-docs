---
title: Determine causes of non-compliance
description: When a resource is non-compliant, there are many possible reasons. Discover what caused the non-compliance with the policy.
ms.date: 03/04/2025
ms.topic: how-to
---

# Determine causes of non-compliance

When an Azure resource is determined to be non-compliant to a policy rule, it's helpful to
understand which portion of the rule the resource isn't compliant with. It's also useful to
understand which change altered a previously compliant resource to make it non-compliant. There are
two ways to find this information:

- [Compliance details](#compliance-details)
- [Change history (Preview)](#change-history-preview)

## Compliance details

When a resource is non-compliant, the compliance details for that resource are available from the
**Policy compliance** page. The compliance details pane includes the following information:

- Resource details such as name, type, location, and resource ID.
- Compliance state and timestamp of the last evaluation for the current policy assignment.
- A list of reasons for the resource non-compliance.

> [!IMPORTANT]
> As the compliance details for a _Non-compliant_ resource shows the current value of properties on
> that resource, the user must have **read** operation to the **type** of resource. For example, if
> the _Non-compliant_ resource is `Microsoft.Compute/virtualMachines` then the user must have the
> `Microsoft.Compute/virtualMachines/read` operation. If the user doesn't have the needed
> operation, an access error is displayed.

To view the compliance details, follow these steps:

1. Launch the Azure Policy service in the Azure portal by selecting **All services**, then searching
   for and selecting **Policy**.

1. On the **Overview** or **Compliance** page, select a policy in a **compliance state** that is
   _Non-compliant_.

1. From the **Resource compliance** tab of the **Policy compliance** page, select and hold (or
   right-click) or select the ellipsis of a resource in a **compliance state** that's
   _Non-compliant_. Then select **View compliance details**.

   :::image type="content" source="../media/determine-non-compliance/view-compliance-details.png" alt-text="Screenshot of the View compliance details link on the Resource compliance tab." :::

1. The **Compliance details** pane displays information from the latest evaluation of the resource
   to the current policy assignment. In this example, the field `Microsoft.Sql/servers/version` is
   found to be _12.0_ while the policy definition expected _14.0_. If the resource is non-compliant
   for multiple reasons, each is listed on this pane.

   :::image type="content" source="../media/determine-non-compliance/compliance-details-pane.png" alt-text="Screenshot of the Compliance details pane and reasons for non-compliance that current value is 12 and target value is 14." :::

   For an `auditIfNotExists` or `deployIfNotExists` policy definition, the details include the
   **details.type** property and any optional properties. For a list, see [auditIfNotExists
   properties](../concepts/effect-audit-if-not-exists.md#auditifnotexists-properties) and [deployIfNotExists
   properties](../concepts/effect-deploy-if-not-exists.md#deployifnotexists-properties). **Last evaluated resource** is
   a related resource from the **details** section of the definition.

   Example partial `deployIfNotExists` definition:

   ```json
   {
     "if": {
       "field": "type",
       "equals": "[parameters('resourceType')]"
     },
     "then": {
       "effect": "deployIfNotExists",
       "details": {
         "type": "Microsoft.Insights/metricAlerts",
         "existenceCondition": {
           "field": "name",
           "equals": "[concat(parameters('alertNamePrefix'), '-', resourcegroup().name, '-', field('name'))]"
         },
         "existenceScope": "subscription",
         "deployment": {
           ...
         }
       }
     }
   }
   ```

   :::image type="content" source="../media/determine-non-compliance/compliance-details-pane-existence.png" alt-text="Screenshot of Compliance details pane for ifNotExists including evaluated resource count." :::

> [!NOTE]
> To protect data, when a property value is a _secret_ the current value displays asterisks.

These details explain why a resource is currently non-compliant, but don't show when the change was
made to the resource that caused it to become non-compliant. For that information, see [Change
history (Preview)](#change-history-preview).

### Compliance reasons

[Resource Manager modes](../concepts/definition-structure-basics.md#resource-manager-modes) and
[Resource Provider modes](../concepts/definition-structure-basics.md#resource-provider-modes) each have
different _reasons_ for non-compliance.

#### General Resource Manager mode compliance reasons

The following table maps each
[Resource Manager mode](../concepts/definition-structure-basics.md#resource-manager-modes) _reason_ to the
responsible [condition](../concepts/definition-structure-policy-rule.md#conditions) in the policy definition:

| Reason                                                                  | Condition                                                                                                                                           |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current value must contain the target value as a key.                   | containsKey or **not** notContainsKey                                                                                                               |
| Current value must contain the target value.                            | contains or **not** notContains                                                                                                                     |
| Current value must be equal to the target value.                        | equals or **not** notEquals                                                                                                                         |
| Current value must be less than the target value.                       | less or **not** greaterOrEquals                                                                                                                     |
| Current value must be greater than or equal to the target value.        | greaterOrEquals or **not** less                                                                                                                     |
| Current value must be greater than the target value.                    | greater or **not** lessOrEquals                                                                                                                     |
| Current value must be less than or equal to the target value.           | lessOrEquals or **not** greater                                                                                                                     |
| Current value must exist.                                               | exists                                                                                                                                              |
| Current value must be in the target value.                              | in or **not** notIn                                                                                                                                 |
| Current value must be like the target value.                            | like or **not** notLike                                                                                                                             |
| Current value must be case-sensitive match the target value.            | match or **not** notMatch                                                                                                                           |
| Current value must be case-insensitive match the target value.          | matchInsensitively or **not** notMatchInsensitively                                                                                                 |
| Current value must not contain the target value as a key.               | notContainsKey or **not** containsKey                                                                                                               |
| Current value must not contain the target value.                        | notContains or **not** contains                                                                                                                     |
| Current value must not be equal to the target value.                    | notEquals or **not** equals                                                                                                                         |
| Current value must not exist.                                           | **not** exists                                                                                                                                      |
| Current value must not be in the target value.                          | notIn or **not** in                                                                                                                                 |
| Current value must not be like the target value.                        | notLike or **not** like                                                                                                                             |
| Current value must not be case-sensitive match the target value.        | notMatch or **not** match                                                                                                                           |
| Current value must not be case-insensitive match the target value.      | notMatchInsensitively or **not** matchInsensitively                                                                                                 |
| No related resources match the effect details in the policy definition. | A resource of the type defined in `then.details.type` and related to the resource defined in the **if** portion of the policy rule doesn't exist. |

#### Azure Policy Resource Provider mode compliance reasons

The following table maps each `Microsoft.PolicyInsights`
[Resource Provider mode](../concepts/definition-structure-basics.md#resource-provider-modes) reason code to
its corresponding explanation:

| Compliance reason code              | Error message and explanation                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NonModifiablePolicyAlias            | NonModifiableAliasConflict: The alias '{alias}' isn't modifiable in requests using API version '{apiVersion}'. This error happens when a request using an API version where the alias doesn't support the 'modify' effect or only supports the 'modify' effect with a different token type.                                                                                                                   |
| AppendPoliciesNotApplicable         | AppendPoliciesUnableToAppend: The aliases: '{ aliases }' aren't modifiable in requests using API version: '{ apiVersion }'. This can happen in requests using API versions for which the aliases don't support the 'modify' effect, or support the 'modify' effect with a different token type.                                                                                                               |
| ConflictingAppendPolicies           | ConflictingAppendPolicies: Found conflicting policy assignments that modify the '{notApplicableFields}' field. Policy identifiers: '{policy}'.  Contact the subscription administrator to update the policy assignments.                                                                                                                                                                                 |
| AppendPoliciesFieldsExist           | AppendPoliciesFieldsExistWithDifferentValues: Policy assignments attempted to append fields which already exist in the request with different values. Fields: '{existingFields}'. Policy identifiers: '{policy}'. Contact the subscription administrator to update the policies.                                                                                                                         |
| AppendPoliciesUndefinedFields       | AppendPoliciesUndefinedFields: Found policy definition that refers to an undefined field property for API version '{apiVersion}'. Fields: '{nonExistingFields}'. Policy identifiers: '{policy}'. Contact the subscription administrator to update the policies.                                                                                                                                          |
| MissingRegistrationForType          | MissingRegistrationForResourceType: The subscription isn't registered for the resource type '{ResourceType}'. Check that the resource type exists and that the resource type is registered.                                                                                                                                                                                                             |
| AmbiguousPolicyEvaluationPaths      | The request content has one or more ambiguous paths: '{0}' required by policies: '{1}'.                                                                                                                                                                                                                                                                                                                         |
| InvalidResourceNameWildcardPosition | The policy assignment '{0}' associated with the policy definition '{1}' couldn't be evaluated. The resource name '{2}' within an ifNotExists condition contains the wildcard '?' character in an invalid position. Wildcards can only be located at the end of the name in a segment by themselves (ex. TopLevelResourceName/?). Either fix the policy or remove the policy assignment to unblock. |
| TooManyResourceNameSegments         | The policy assignment '{0}' associated with the policy definition '{1}' couldn't be evaluated. The resource name '{2}' within an ifNotExists condition contains too many name segments. The number of name segments must be equal to or less than the number of type segments (excluding the resource provider namespace). Either fix the policy definition or remove the policy assignment to unblock. |
| InvalidPolicyFieldPath | The field path '{0}' within the policy definition is invalid. Field paths must contain no empty segments. They might contain only alphanumeric characters with the exception of the '.' character for splitting segments and the '[*]' character sequence to access array properties.                                                                                                                             |

#### AKS Resource Provider mode compliance reasons

The following table maps each `Microsoft.Kubernetes.Data`
[Resource Provider mode](../concepts/definition-structure-basics.md#resource-provider-modes) _reason_ to
the responsible state of the
[constraint template](https://open-policy-agent.github.io/gatekeeper/website/docs/howto/#constraint-templates)
in the policy definition:

| Reason                           | Constraint template reason description                                                                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Constraint/TemplateCreateFailed  | The resource failed to create for a policy definition with a Constraint/Template that doesn't match an existing Constraint/Template on cluster by resource metadata name.      |
| Constraint/TemplateUpdateFailed  | The Constraint/Template failed to update for a policy definition with a Constraint/Template that matches an existing Constraint/Template on cluster by resource metadata name. |
| Constraint/TemplateInstallFailed | The Constraint/Template failed to build and was unable to be installed on cluster for either create or update operation.                                                       |
| ConstraintTemplateConflicts      | The Template has a conflict with one or more policy definitions using the same Template name with different source.                                                            |
| ConstraintStatusStale            | There's an existing 'Audit' status, but Gatekeeper hasn't performed an audit within the last hour.                                                                           |
| ConstraintNotProcessed           | There's no status and Gatekeeper hasn't performed an audit within the last hour.                                                                                             |
| InvalidConstraint/Template       | The resource was rejected because of one of the following reasons: invalid constraint template Rego content, invalid YAML, or a parameter type mismatch between constraint and constraint template (providing a string value when an integer was expected).                  |

> [!NOTE]
> For existing policy assignments and constraint templates already on the cluster, if that
> Constraint/Template fails, the cluster is protected by maintaining the existing
> Constraint/Template. The cluster reports as non-compliant until the failure is resolved on the
> policy assignment or the add-on self-heals. For more information about handling conflict, see
> [Constraint template conflicts](../concepts/policy-for-kubernetes.md#constraint-template-conflicts).

## Component details for Resource Provider modes

For assignments with a Resource Provider mode, select the _Non-compliant_ resource to view its component compliance records. The **Component Compliance** tab shows more information specific to the [Resource Provider mode](../concepts/definition-structure-basics.md#resource-provider-modes) like **Component Name**, **Component ID**, and **Type**.

:::image type="content" source="../media/determine-non-compliance/component-compliance-dashboard.png" alt-text="Screenshot of Component Compliance dashboard and compliance details for assignments with a Resource Provider mode.":::

## Compliance details for guest configuration

For policy definitions in the _Guest Configuration_ category, there could be multiple
settings evaluated inside the virtual machine and you need to view per-setting details. For
example, if you're auditing for a list of security settings and only one of them has status
_Non-compliant_, you need to know which specific settings are out of compliance and why.

You also might not have access to sign in to the virtual machine directly but you need to report on
why the virtual machine is _Non-compliant_.

### Azure portal

Begin by following the same steps in the [Compliance details](#compliance-details) section to view policy compliance details.

In the Compliance details pane view, select the link **Last evaluated resource**.

:::image type="content" source="../media/determine-non-compliance/guestconfig-auditifnotexists-compliance.png" alt-text="Screenshot of viewing the auditIfNotExists definition compliance details." lightbox="../media/determine-non-compliance/guestconfig-auditifnotexists-compliance.png":::

The **Guest Assignment** page displays all available compliance details. Each row in the view
represents an evaluation that was performed inside the machine. In the **Reason** column, a phrase
is shown describing why the Guest Assignment is _Non-compliant_. For example, if you're auditing
password policies, the **Reason** column would display text including the current value for each
setting.

:::image type="content" source="../media/determine-non-compliance/guestconfig-compliance-details.png" alt-text="Screenshot of the Guest Assignment compliance details." lightbox="../media/determine-non-compliance/guestconfig-compliance-details.png":::

### View configuration assignment details at scale

The guest configuration feature can be used outside of Azure Policy assignments.
For example,
[Azure Automanage](../../../automanage/index.yml)
creates guest configuration assignments, or you might
[assign configurations when you deploy machines](../../machine-configuration/how-to-create-assignment.md).

To view all guest configuration assignments across your tenant, from the Azure
portal open the **Guest Assignments** page. To view detailed compliance
information, select each assignment using the link in the column **Name**.

:::image type="content" source="../media/determine-non-compliance/guest-config-assignment-view.png" alt-text="Screenshot of the Guest Assignment page." :::

## Change history (Preview)

As part of a new **public preview**, the last 14 days of change history are available for all Azure
resources that support [complete mode
deletion](../../../azure-resource-manager/templates/deployment-complete-mode-deletion.md). Change history
provides details about when a change was detected and a _visual diff_ for each change. A change
detection is triggered when the Azure Resource Manager properties are added, removed, or altered.

1. Launch the Azure Policy service in the Azure portal by selecting **All services**, then searching
   for and selecting **Policy**.

1. On the **Overview** or **Compliance** page, select a policy in any **compliance state**.

1. From the **Resource compliance** tab of the **Policy compliance** page, select a resource.

1. Select the **Change History (preview)** tab on the **Resource Compliance** page. A list of
   detected changes, if any exist, are displayed.

   :::image type="content" source="../media/determine-non-compliance/change-history-tab.png" alt-text="Screenshot of the Change History tab and detected change times on Resource Compliance page." :::

1. Select one of the detected changes. The _visual diff_ for the resource is presented on the
   **Change history** page.

   :::image type="content" source="../media/determine-non-compliance/change-history-visual-diff.png" alt-text="Screenshot of the Change History Visual Diff of the before and after state of properties on the Change history page." :::

   The _visual diff_ aides in identifying changes to a resource. The changes detected might not be
related to the current compliance state of the resource.

Change history data is provided by [Azure Resource Graph](../../resource-graph/overview.md). To
query this information outside of the Azure portal, see [Get resource changes](../../resource-graph/how-to/get-resource-changes.md).

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure-basics.md).
- Review [Understanding policy effects](../concepts/effect-basics.md).
- Understand how to [programmatically create policies](programmatically-create.md).
- Learn how to [get compliance data](get-compliance-data.md).
- Learn how to [remediate non-compliant resources](remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
