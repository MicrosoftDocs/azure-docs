---
title: Details of the policy remediation task structure
description: Describes the policy remediation task definition used by Azure Policy to bring resources into compliance.
ms.date: 09/30/2024
ms.topic: conceptual
ms.author: kenieva
author: kenieva
---

# Azure Policy remediation task structure

The Azure Policy remediation task feature is used to bring resources into compliance established from a definition and assignment. Resources that are non-compliant to a [modify](./effect-modify.md) or [deployIfNotExists](./effect-deploy-if-not-exists.md) definition assignment, can be brought into compliance using a remediation task. A remediation task deploys the `deployIfNotExists` template or the `modify` operations to the selected non-compliant resources using the identity specified in the assignment. For more information, see [policy assignment structure](./assignment-structure.md#identity) to understand how the identity is defined and [remediate non-compliant resources tutorial](../how-to/remediate-resources.md#configure-the-managed-identity) to configure the identity.

Remediation tasks remediate existing resources that aren't compliant. Resources that are newly created or updated that are applicable to a `deployIfNotExists` or `modify` definition assignment are automatically remediated.

> [!NOTE]
> The Azure Policy service deletes remediation task resources 60 days after their last modification.

You use JavaScript Object Notation (JSON) to create a policy remediation task. The policy remediation task contains elements for:

- [policy assignment](#policy-assignment-id)
- [policy definitions within an initiative](#policy-definition-id)
- [resource count and parallel deployments](#resource-count-and-parallel-deployments)
- [failure threshold](#failure-threshold)
- [remediation filters](#remediation-filters)
- [resource discovery mode](#resource-discovery-mode)
- [provisioning state and deployment summary](#provisioning-state-and-deployment-summary)

For example, the following JSON shows a policy remediation task for policy definition named `requiredTags` a part of an initiative assignment named `resourceShouldBeCompliantInit` with all default settings.

```json
{
  "id": "/subscriptions/{subId}/resourceGroups/{resourceGroupName}/providers/Microsoft.PolicyInsights/remediations/remediateNotCompliant",
  "apiVersion": "2021-10-01",
  "name": "remediateNotCompliant",
  "type": "Microsoft.PolicyInsights/remediations",
  "properties": {
    "policyAssignmentId": "/subscriptions/{subID}/providers/Microsoft.Authorization/policyAssignments/resourceShouldBeCompliantInit",
    "policyDefinitionReferenceId": "requiredTags",
    "resourceCount": 42,
    "parallelDeployments": 6,
    "failureThreshold": {
      "percentage": 0.1
    }
  }
}
```

Steps on how to trigger a remediation task at [how to remediate non-compliant resources guide](../how-to/remediate-resources.md). These settings can't be changed after the remediation task begins.

## Policy assignment ID

This field must be the full path name of either a policy assignment or an initiative assignment. `policyAssignmentId` is a string and not an array. This property defines which assignment the parent resource hierarchy or individual resource to remediate.

## Policy definition ID

If the `policyAssignmentId` is for an initiative assignment, the `policyDefinitionReferenceId` property must be used to specify which policy definition in the initiative the subject resources are to be remediated. As a remediation can only remediate in a scope of one definition, this property is a _string_ and not an array. The value must match the value in the initiative definition in the `policyDefinitions.policyDefinitionReferenceId` field instead of the global identifier for policy definition `Id`.

## Resource count and parallel deployments

Use `resourceCount` to  determine how many non-compliant resources to remediate in a given remediation task. The default value is 500, with the maximum number being 50,000. `parallelDeployments` determines how many of those resources to remediate at the same time. The allowed range is between 1 to 30 with the default value being 10.

Parallel deployments are the number of deployments within a singular remediation task with a maximum of 30. There can be a maximum of 100 remediation tasks running in parallel for a single policy definition or policy reference within an initiative.

## Failure threshold

An optional property used to specify whether the remediation task should fail if the percentage of failures exceeds the given threshold. The `failureThreshold` is represented as a percentage number from 0 to 100. By default, the failure threshold is 100%, meaning that the remediation task continues to remediate other resources even if resources fail to remediate.

## Remediation filters

An optional property refines what resources are applicable to the remediation task. The allowed filter is resource location. Unless specified, resources from any region can be remediated.

## Resource discovery mode

This property decides how to discover resources that are eligible for remediation. For a resource to be eligible, it must be non-compliant. By default, this property is set to `ExistingNonCompliant`. It could also be set to `ReEvaluateCompliance`, which triggers a new compliance scan for that assignment and remediate any resources that are found non-compliant.

## Provisioning state and deployment summary

Once a remediation task is created, `ProvisioningState` and `DeploymentSummary` properties are populated. The `ProvisioningState` indicates the status of the remediation task. Allow values are `Running`, `Canceled`, `Cancelling`, `Failed`, `Complete`, or `Succeeded`. The `DeploymentSummary` is an array property indicating the number of deployments along with number of successful and failed deployments.

Sample of remediation task that completed successfully:

```json
{
  "id": "/subscriptions/{subId}/resourceGroups/ExemptRG/providers/Microsoft.PolicyInsights/remediations/remediateNotCompliant",
  "Type": "Microsoft.PolicyInsights/remediations",
  "Name": "remediateNotCompliant",
  "PolicyAssignmentId": "/subscriptions/{mySubscriptionID}/providers/Microsoft.Authorization/policyAssignments/resourceShouldBeCompliantInit",
  "policyDefinitionReferenceId": "requiredTags",
  "resourceCount": 42,
  "parallelDeployments": 6,
  "failureThreshold": {
    "percentage": 0.1
  },
  "ProvisioningState": "Succeeded",
  "DeploymentSummary": {
    "TotalDeployments": 42,
    "SuccessfulDeployments": 42,
    "FailedDeployments": 0
  },
}
```

## Next steps

- Understand how to [determine causes of non-compliance](../how-to/determine-non-compliance.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Understand how to [react to Azure Policy state change events](./event-overview.md).
- Learn about the [policy definition structure](./definition-structure-basics.md).
- Learn about the [policy assignment structure](./assignment-structure.md).
