---
title: Azure Policy definitions deployIfNotExists effect
description: Azure Policy definitions deployIfNotExists effect determines how compliance is managed and reported.
ms.date: 04/08/2024
ms.topic: conceptual
---

# Azure Policy definitions deployIfNotExists effect

Similar to `auditIfNotExists`, a `deployIfNotExists` policy definition executes a template deployment when the condition is met. Policy assignments with effect set as DeployIfNotExists require a [managed identity](../how-to/remediate-resources.md) to do remediation.

> [!NOTE]
> [Nested templates](../../../azure-resource-manager/templates/linked-templates.md#nested-template) are supported with `deployIfNotExists`, but [linked templates](../../../azure-resource-manager/templates/linked-templates.md#linked-template) are currently not supported.

## DeployIfNotExists evaluation

`deployIfNotExists` runs after a configurable delay when a Resource Provider handles a create or update subscription or resource request and returned a success status code. A template deployment occurs if there are no related resources or if the resources defined by `existenceCondition` don't evaluate to true. The duration of the deployment depends on the complexity of resources included in the template.

During an evaluation cycle, policy definitions with a DeployIfNotExists effect that match resources are marked as non-compliant, but no action is taken on that resource. Existing non-compliant resources can be remediated with a [remediation task](../how-to/remediate-resources.md).

## DeployIfNotExists properties

The `details` property of the DeployIfNotExists effect has all the subproperties that define the related resources to match and the template deployment to execute.

- `type` (required)
  - Specifies the type of the related resource to match.
  - If `type` is a resource type underneath the `if` condition resource, the policy queries for resources of this `type` within the scope of the evaluated resource. Otherwise, policy queries within the same resource group or subscription as the evaluated resource depending on the `existenceScope`.
- `name` (optional)
  - Specifies the exact name of the resource to match and causes the policy to fetch one specific resource instead of all resources of the specified type.
  - When the condition values for `if.field.type` and `then.details.type` match, then `name` becomes _required_ and must be `[field('name')]`, or `[field('fullName')]` for a child resource.

> [!NOTE]
>
> `type` and `name` segments can be combined to generically retrieve nested resources.
>
> To retrieve a specific resource, you can use `"type": "Microsoft.ExampleProvider/exampleParentType/exampleNestedType"` and `"name": "parentResourceName/nestedResourceName"`.
>
> To retrieve a collection of nested resources, a wildcard character `?` can be provided in place of the last name segment. For example, `"type": "Microsoft.ExampleProvider/exampleParentType/exampleNestedType"` and `"name": "parentResourceName/?"`. This can be combined with field functions to access resources related to the evaluated resource, such as `"name": "[concat(field('name'), '/?')]"`."

- `resourceGroupName` (optional)
  - Allows the matching of the related resource to come from a different resource group.
  - Doesn't apply if `type` is a resource that would be underneath the `if` condition resource.
  - Default is the `if` condition resource's resource group.
  - If a template deployment is executed, it's deployed in the resource group of this value.
- `existenceScope` (optional)
  - Allowed values are _Subscription_ and _ResourceGroup_.
  - Sets the scope of where to fetch the related resource to match from.
  - Doesn't apply if `type` is a resource that would be underneath the `if` condition resource.
  - For _ResourceGroup_, would limit to the resource group in `resourceGroupName` if specified. If `resourceGroupName` isn't specified, would limit to the `if` condition resource's resource group, which is the default behavior.
  - For _Subscription_, queries the entire subscription for the related resource. Assignment scope should be set at subscription or higher for proper evaluation.
  - Default is _ResourceGroup_.
- `evaluationDelay` (optional)
  - Specifies when the existence of the related resources should be evaluated. The delay is only
    used for evaluations that are a result of a create or update resource request.
  - Allowed values are `AfterProvisioning`, `AfterProvisioningSuccess`, `AfterProvisioningFailure`, or an ISO 8601 duration between 0 and 360 minutes.
  - The _AfterProvisioning_ values inspect the provisioning result of the resource that was evaluated in the policy rule's `if` condition. `AfterProvisioning` runs after provisioning is complete, regardless of outcome. Provisioning that takes more than six hours, is treated as a
    failure when determining _AfterProvisioning_ evaluation delays.
  - Default is `PT10M` (10 minutes).
  - Specifying a long evaluation delay might cause the recorded compliance state of the resource to not update until the next [evaluation trigger](../how-to/get-compliance-data.md#evaluation-triggers).
- `existenceCondition` (optional)
  - If not specified, any related resource of `type` satisfies the effect and doesn't trigger the deployment.
  - Uses the same language as the policy rule for the `if` condition, but is evaluated against each related resource individually.
  - If any matching related resource evaluates to true, the effect is satisfied and doesn't trigger the deployment.
  - Can use [field()] to check equivalence with values in the `if` condition.
  - For example, could be used to validate that the parent resource (in the `if` condition) is in the same resource location as the matching related resource.
- `roleDefinitionIds` (required)
  - This property must include an array of strings that match role-based access control role ID accessible by the subscription. For more information, see [remediation - configure the policy definition](../how-to/remediate-resources.md#configure-the-policy-definition).
- `deploymentScope` (optional)
  - Allowed values are _Subscription_ and _ResourceGroup_.
  - Sets the type of deployment to be triggered. _Subscription_ indicates a [deployment at subscription level](../../../azure-resource-manager/templates/deploy-to-subscription.md) and
    _ResourceGroup_ indicates a deployment to a resource group.
  - A _location_ property must be specified in the _Deployment_ when using subscription level deployments.
  - Default is _ResourceGroup_.
- `deployment` (required)
  - This property should include the full template deployment as it would be passed to the `Microsoft.Resources/deployments` PUT API. For more information, see the [Deployments REST API](/rest/api/resources/deployments).
  - Nested `Microsoft.Resources/deployments` within the template should use unique names to avoid contention between multiple policy evaluations. The parent deployment's name can be used as part of the nested deployment name via `[concat('NestedDeploymentName-', uniqueString(deployment().name))]`.

  > [!NOTE]
  > All functions inside the `deployment` property are evaluated as components of the template,
  > not the policy. The exception is the `parameters` property that passes values from the policy
  > to the template. The `value` in this section under a template parameter name is used to
  > perform this value passing (see _fullDbName_ in the DeployIfNotExists example).

## DeployIfNotExists example

Example: Evaluates SQL Server databases to determine whether `transparentDataEncryption` is enabled. If not, then a deployment to enable is executed.

```json
"if": {
  "field": "type",
  "equals": "Microsoft.Sql/servers/databases"
},
"then": {
  "effect": "deployIfNotExists",
  "details": {
    "type": "Microsoft.Sql/servers/databases/transparentDataEncryption",
    "name": "current",
    "evaluationDelay": "AfterProvisioning",
    "roleDefinitionIds": [
      "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/{roleGUID}",
      "/providers/Microsoft.Authorization/roleDefinitions/{builtinroleGUID}"
    ],
    "existenceCondition": {
      "field": "Microsoft.Sql/transparentDataEncryption.status",
      "equals": "Enabled"
    },
    "deployment": {
      "properties": {
        "mode": "incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "fullDbName": {
              "type": "string"
            }
          },
          "resources": [
            {
              "name": "[concat(parameters('fullDbName'), '/current')]",
              "type": "Microsoft.Sql/servers/databases/transparentDataEncryption",
              "apiVersion": "2014-04-01",
              "properties": {
                "status": "Enabled"
              }
            }
          ]
        },
        "parameters": {
          "fullDbName": {
            "value": "[field('fullName')]"
          }
        }
      }
    }
  }
}
```


## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](definition-structure-basics.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review [Azure management groups](../../management-groups/overview.md).
