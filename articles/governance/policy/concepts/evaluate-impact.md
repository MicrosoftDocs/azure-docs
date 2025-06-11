---
title: Evaluate the impact of a new Azure Policy definition
description: Understand the process to follow when introducing a new policy definition into your Azure environment.
ms.date: 03/04/2025
ms.topic: conceptual
---

# Evaluate the impact of a new Azure Policy definition

Azure Policy is a powerful tool for managing your Azure resources to meet business standards compliance needs. When people, processes, or pipelines create or update resources, Azure Policy reviews the request. When the policy definition effect is [modify](./effect-modify.md), [append](./effect-append.md), or [deployIfNotExists](./effect-deploy-if-not-exists.md), Policy alters the request or adds to it. When the policy definition effect is [audit](./effect-audit.md) or [auditIfNotExists](./effect-audit-if-not-exists.md), Policy causes an Activity log entry to be created for new and updated resources. And when the policy definition effect is [deny](./effect-deny.md) or [denyAction](./effect-deny-action.md), Policy stops the creation or alteration of the request.

These outcomes are exactly as desired when you know the policy is defined correctly. However, it's important to validate a new policy works as intended before allowing it to change or block work. The validation must ensure only the intended resources are determined to be non-compliant and no compliant resources are incorrectly included (known as a _false positive_) in the results.

The recommended approach to validating a new policy definition is by following these steps:

- Tightly define your policy.
- Test your policy's effectiveness.
- Audit new or updated resource requests.
- Deploy your policy to resources.
- Continuous monitoring.

## Tightly define your policy

It's important to understand how the business policy is implemented as a policy definition and the relationship of Azure resources with other Azure services. This step is accomplished by [identifying the requirements](../tutorials/create-custom-policy-definition.md#identify-requirements) and [determining the resource properties](../tutorials/create-custom-policy-definition.md#determine-resource-properties). But it's also important to see beyond the narrow definition of your business policy. For examples, does your policy state that _All Virtual Machines must..._? What about other Azure services that make use of VMs, such as HDInsight or Azure Kubernetes Service (AKS)? When defining a policy, we must consider how this policy impacts resources that are used by other services.

For this reason, your policy definitions should be as tightly defined and focused on the resources and the properties you need to evaluate for compliance as possible.


## Test your policy's effectiveness

Before looking to manage new or updated resources with your new policy definition, it's best to see how it evaluates a limited subset of existing resources, such as a test resource group. The [Azure Policy VS Code extension](../how-to/extension-for-vscode.md#on-demand-evaluation-scan) allows for isolated testing of definitions against existing Azure resources using the on demand evaluation scan. You might also assign the definition in a _Dev_ environment using the [enforcement mode](./assignment-structure.md#enforcement-mode) _Disabled_ (doNotEnforce) on your policy assignment to prevent the [effect](./effect-basics.md) from triggering or activity log entries from being created.

This step gives you a chance to evaluate the compliance results of the new policy on existing resources without impacting work flow. Check that no compliant resources show as non-compliant (_false positive_) and that all the resources you expect to be non-compliant are marked correctly. After the initial subset of resources validates as expected, slowly expand the evaluation to more existing resources and more scopes.

Evaluating existing resources in this way also provides an opportunity to remediate non-compliant resources before full implementation of the new policy. This cleanup can be done manually or through a [remediation task](../how-to/remediate-resources.md) if the policy definition effect is `deployIfNotExists` or `modify`.

Policy definitions with a `deployIfNotExists` should use the [Azure Resource Manager template what if](../../../azure-resource-manager/templates/deploy-what-if.md) to validate and test the changes that happen when deploying the ARM template.

## Audit new or updated resources

After you validate your new policy definition is reporting correctly on existing resources, it's time to look at the effect of the policy when resources are created or updated. If the policy definition supports effect parameterization, use [audit](./effect-audit.md) or [auditIfNotExist](./effect-audit-if-not-exists.md). This configuration allows you to monitor the creation and updating of resources to see whether the new policy definition triggers an entry in Azure Activity log for a resource that's non-compliant without affecting existing work or requests.

The recommendation is to update and create new resources that match your policy definition to see that the `audit` or `auditIfNotExists` effect is correctly being triggered when expected. Be on the lookout for resource requests that shouldn't be affected by the new policy definition that trigger the `audit` or `auditIfNotExists` effect. These affected resources are another example of _false positives_ and must be fixed in the policy definition before full implementation.

In the event the policy definition is changed at this stage of testing, the recommendation is to begin the validation process over with the auditing of existing resources. A change to the policy definition for a _false positive_ on new or updated resources is likely to also have an effect on existing resources.

## Deploy your policy to resources

After completing validation of your new policy definition with both existing resources and new or updated resource requests, you begin the process of implementing the policy. The recommendation is to create the policy assignment for the new policy definition to a subset of all resources first, such as a resource group. You can further filter by resource type or location using the [resourceSelectors](./assignment-structure.md#resource-selectors) property within the policy assignment. After validating initial deployment, extend the scope of the policy to broader as a resource group. After validating initial deployment, expand the policy's effect by adjusting the `resourceSelector` filters to target more locations or resource types. Or by removing the assignment and replacing it with a new one at broader scopes like subscriptions and management groups. Continue this gradual rollout until it's assigned to the full scope of resources intended to be covered by your new policy definition.

During rollout, if resources are located that should be exempt from your new policy definition, address them in one of the following ways:

- Update the policy definition to be more explicit to reduce unintended effects.
- Change the scope of the policy assignment (by removing and creating a new assignment).
- Add the group of resources to the exclusion list for the policy assignment.

Any changes to the scope (level or exclusions) should be fully validated and communicated with your security and compliance organizations to ensure there are no gaps in coverage.

## Monitor your policy and compliance

Implementing and assigning your policy definition isn't the final step. Continuously monitor the [compliance](../how-to/get-compliance-data.md) level of resources to your new policy definition and setup appropriate [Azure Monitor alerts and notifications](/azure/azure-monitor/alerts/alerts-overview) for when non-compliant devices are identified. The recommendation is to evaluate the policy definition and related assignments on a scheduled basis to validate the policy definition is meeting business policy and compliance needs. Policies should be removed if no longer needed. Policies also need to update from time to time as the underlying Azure resources evolve and add new properties and capabilities.

## Next steps

- Learn about the [policy definition structure](./definition-structure-basics.md).
- Learn about the [policy assignment structure](./assignment-structure.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
