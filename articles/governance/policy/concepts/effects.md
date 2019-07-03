---
title: Understand how effects work
description: Azure Policy definition have various effects that determine how compliance is managed and reported.
author: DCtheGeek
ms.author: dacoulte
ms.date: 03/29/2019
ms.topic: conceptual
ms.service: azure-policy
manager: carmonm
ms.custom: seodec18
---
# Understand Azure Policy effects

Each policy definition in Azure Policy has a single effect. That effect determines what happens when
the policy rule is evaluated to match. The effects behave differently if they are for a new
resource, an updated resource, or an existing resource.

These effects are currently supported in a policy definition:

- [Append](#append)
- [Audit](#audit)
- [AuditIfNotExists](#auditifnotexists)
- [Deny](#deny)
- [DeployIfNotExists](#deployifnotexists)
- [Disabled](#disabled)
- [EnforceRegoPolicy](#enforceregopolicy) (preview)

## Order of evaluation

Requests to create or update a resource through Azure Resource Manager are evaluated by Azure Policy
first. Azure Policy creates a list of all assignments that apply to the resource and then evaluates
the resource against each definition. Azure Policy processes several of the effects before handing
the request to the appropriate Resource Provider. Doing so prevents unnecessary processing by a
Resource Provider when a resource doesn't meet the designed governance controls of Azure Policy.

- **Disabled** is checked first to determine if the policy rule should be evaluated.
- **Append** is then evaluated. Since append could alter the request, a change made by append may
  prevent an audit or deny effect from triggering.
- **Deny** is then evaluated. By evaluating deny before audit, double logging of an undesired
  resource is prevented.
- **Audit** is then evaluated before the request going to the Resource Provider.

After the Resource Provider returns a success code, **AuditIfNotExists** and **DeployIfNotExists**
evaluate to determine if additional compliance logging or action is required.

There currently isn't any order of evaluation for the **EnforceRegoPolicy** effect.

## Disabled

This effect is useful for testing situations or for when the policy definition has parameterized the
effect. This flexibility makes it possible to disable a single assignment instead of disabling all
of that policy's assignments.

## Append

Append is used to add additional fields to the requested resource during creation or update. A
common example is adding tags on resources such as costCenter or specifying allowed IPs for a
storage resource.

### Append evaluation

Append evaluates before the request gets processed by a Resource Provider during the creation or
updating of a resource. Append adds fields to the resource when the **if** condition of the policy
rule is met. If the append effect would override a value in the original request with a different
value, then it acts as a deny effect and rejects the request. To append a new value to an existing
array, use the **[\*]** version of the alias.

When a policy definition using the append effect is run as part of an evaluation cycle, it doesn't
make changes to resources that already exist. Instead, it marks any resource that meets the **if**
condition as non-compliant.

### Append properties

An append effect only has a **details** array, which is required. As **details** is an array, it can
take either a single **field/value** pair or multiples. Refer to [definition structure](definition-structure.md#fields)
for the list of acceptable fields.

### Append examples

Example 1: Single **field/value** pair to append a tag.

```json
"then": {
    "effect": "append",
    "details": [{
        "field": "tags.myTag",
        "value": "myTagValue"
    }]
}
```

Example 2: Two **field/value** pairs to append a set of tags.

```json
"then": {
    "effect": "append",
    "details": [{
            "field": "tags.myTag",
            "value": "myTagValue"
        },
        {
            "field": "tags.myOtherTag",
            "value": "myOtherTagValue"
        }
    ]
}
```

Example 3: Single **field/value** pair using a non-**[\*]** [alias](definition-structure.md#aliases)
with an array **value** to set IP rules on a storage account. When the non-**[\*]** alias is an
array, the effect appends the **value** as the entire array. If the array already exists, a deny
event occurs from the conflict.

```json
"then": {
    "effect": "append",
    "details": [{
        "field": "Microsoft.Storage/storageAccounts/networkAcls.ipRules",
        "value": [{
            "action": "Allow",
            "value": "134.5.0.0/21"
        }]
    }]
}
```

Example 4: Single **field/value** pair using an **[\*]** [alias](definition-structure.md#aliases)
with an array **value** to set IP rules on a storage account. By using the **[\*]** alias, the
effect appends the **value** to a potentially pre-existing array. If the array doesn't yet exists,
it will be created.

```json
"then": {
    "effect": "append",
    "details": [{
        "field": "Microsoft.Storage/storageAccounts/networkAcls.ipRules[*]",
        "value": {
            "value": "40.40.40.40",
            "action": "Allow"
        }
    }]
}
```

## Deny

Deny is used to prevent a resource request that doesn't match defined standards through a policy
definition and fails the request.

### Deny evaluation

When creating or updating a matched resource, deny prevents the request before being sent to the
Resource Provider. The request is returned as a `403 (Forbidden)`. In the portal, the Forbidden can
be viewed as a status on the deployment that was prevented by the policy assignment.

During evaluation of existing resources, resources that match a deny policy definition are marked as
non-compliant.

### Deny properties

The deny effect doesn't have any additional properties for use in the **then** condition of the
policy definition.

### Deny example

Example: Using the deny effect.

```json
"then": {
    "effect": "deny"
}
```

## Audit

Audit is used to create a warning event in the activity log when evaluating a non-compliant
resource, but it doesn't stop the request.

### Audit evaluation

Audit is the last effect checked by Azure Policy during the creation or update of a resource. Azure
Policy then sends the resource to the Resource Provider. Audit works the same for a resource request
and an evaluation cycle. Azure Policy adds a `Microsoft.Authorization/policies/audit/action`
operation to the activity log and marks the resource as non-compliant.

### Audit properties

The audit effect doesn't have any additional properties for use in the **then** condition of the
policy definition.

### Audit example

Example: Using the audit effect.

```json
"then": {
    "effect": "audit"
}
```

## AuditIfNotExists

AuditIfNotExists enables auditing on resources that match the **if** condition, but doesn't have
the components specified in the **details** of the **then** condition.

### AuditIfNotExists evaluation

AuditIfNotExists runs after a Resource Provider has handled a create or update resource request and
has returned a success status code. The audit occurs if there are no related resources or if the
resources defined by **ExistenceCondition** don't evaluate to true. Azure Policy adds a
`Microsoft.Authorization/policies/audit/action` operation to the activity log the same way as the
audit effect. When triggered, the resource that satisfied the **if** condition is the resource that
is marked as non-compliant.

### AuditIfNotExists properties

The **details** property of the AuditIfNotExists effects has all the subproperties that define the
related resources to match.

- **Type** [required]
  - Specifies the type of the related resource to match.
  - If **details.type** is a resource type underneath the **if** condition resource, the policy
    queries for resources of this **type** within the scope of the evaluated resource. Otherwise,
    policy queries within the same resource group as the evaluated resource.
- **Name** (optional)
  - Specifies the exact name of the resource to match and causes the policy to fetch one specific
    resource instead of all resources of the specified type.
  - When the condition values for **if.field.type** and **then.details.type** match, then **Name**
    becomes _required_ and must be `[field('name')]`. However, an [audit](#audit) effect should be
    considered instead.
- **ResourceGroupName** (optional)
  - Allows the matching of the related resource to come from a different resource group.
  - Doesn't apply if **type** is a resource that would be underneath the **if** condition resource.
  - Default is the **if** condition resource's resource group.
- **ExistenceScope** (optional)
  - Allowed values are _Subscription_ and _ResourceGroup_.
  - Sets the scope of where to fetch the related resource to match from.
  - Doesn't apply if **type** is a resource that would be underneath the **if** condition resource.
  - For _ResourceGroup_, would limit to the **if** condition resource's resource group or the
    resource group specified in **ResourceGroupName**.
  - For _Subscription_, queries the entire subscription for the related resource.
  - Default is _ResourceGroup_.
- **ExistenceCondition** (optional)
  - If not specified, any related resource of **type** satisfies the effect and doesn't trigger the
    audit.
  - Uses the same language as the policy rule for the **if** condition, but is evaluated against
    each related resource individually.
  - If any matching related resource evaluates to true, the effect is satisfied and doesn't trigger
    the audit.
  - Can use [field()] to check equivalence with values in the **if** condition.
  - For example, could be used to validate that the parent resource (in the **if** condition) is in
    the same resource location as the matching related resource.

### AuditIfNotExists example

Example: Evaluates Virtual Machines to determine if the Antimalware extension exists then audits
when missing.

```json
{
    "if": {
        "field": "type",
        "equals": "Microsoft.Compute/virtualMachines"
    },
    "then": {
        "effect": "auditIfNotExists",
        "details": {
            "type": "Microsoft.Compute/virtualMachines/extensions",
            "existenceCondition": {
                "allOf": [{
                        "field": "Microsoft.Compute/virtualMachines/extensions/publisher",
                        "equals": "Microsoft.Azure.Security"
                    },
                    {
                        "field": "Microsoft.Compute/virtualMachines/extensions/type",
                        "equals": "IaaSAntimalware"
                    }
                ]
            }
        }
    }
}
```

## DeployIfNotExists

Similar to AuditIfNotExists, DeployIfNotExists executes a template deployment when the condition
is met.

> [!NOTE]
> [Nested templates](../../../azure-resource-manager/resource-group-linked-templates.md#nested-template) are supported with **deployIfNotExists**, but
> [linked templates](../../../azure-resource-manager/resource-group-linked-templates.md) are currently not supported.

### DeployIfNotExists evaluation

DeployIfNotExists runs after a Resource Provider has handled a create or update resource request
and has returned a success status code. A template deployment occurs if there are no related
resources or if the resources defined by **ExistenceCondition** don't evaluate to true.

During an evaluation cycle, policy definitions with a DeployIfNotExists effect that match resources
are marked as non-compliant, but no action is taken on that resource.

### DeployIfNotExists properties

The **details** property of the DeployIfNotExists effects has all the subproperties that define the
related resources to match and the template deployment to execute.

- **Type** [required]
  - Specifies the type of the related resource to match.
  - Starts by trying to fetch a resource underneath the **if** condition resource, then queries
    within the same resource group as the **if** condition resource.
- **Name** (optional)
  - Specifies the exact name of the resource to match and causes the policy to fetch one specific
    resource instead of all resources of the specified type.
  - When the condition values for **if.field.type** and **then.details.type** match, then **Name**
    becomes _required_ and must be `[field('name')]`.
- **ResourceGroupName** (optional)
  - Allows the matching of the related resource to come from a different resource group.
  - Doesn't apply if **type** is a resource that would be underneath the **if** condition resource.
  - Default is the **if** condition resource's resource group.
  - If a template deployment is executed, it's deployed in the resource group of this value.
- **ExistenceScope** (optional)
  - Allowed values are _Subscription_ and _ResourceGroup_.
  - Sets the scope of where to fetch the related resource to match from.
  - Doesn't apply if **type** is a resource that would be underneath the **if** condition resource.
  - For _ResourceGroup_, would limit to the **if** condition resource's resource group or the
    resource group specified in **ResourceGroupName**.
  - For _Subscription_, queries the entire subscription for the related resource.
  - Default is _ResourceGroup_.
- **ExistenceCondition** (optional)
  - If not specified, any related resource of **type** satisfies the effect and doesn't trigger the
    deployment.
  - Uses the same language as the policy rule for the **if** condition, but is evaluated against
    each related resource individually.
  - If any matching related resource evaluates to true, the effect is satisfied and doesn't trigger
    the deployment.
  - Can use [field()] to check equivalence with values in the **if** condition.
  - For example, could be used to validate that the parent resource (in the **if** condition) is in
    the same resource location as the matching related resource.
- **roleDefinitionIds** [required]
  - This property must include an array of strings that match role-based access control role ID
    accessible by the subscription. For more information, see
    [remediation - configure policy definition](../how-to/remediate-resources.md#configure-policy-definition).
- **DeploymentScope** (optional)
  - Allowed values are _Subscription_ and _ResourceGroup_.
  - Sets the type of deployment to be triggered. _Subscription_ indicates a [deployment at subscription level](../../../azure-resource-manager/deploy-to-subscription.md),
    _ResourceGroup_ indicates a deployment to a resource group.
  - A _location_ property must be specified in the _Deployment_ when using subscription level
    deployments.
  - Default is _ResourceGroup_.
- **Deployment** [required]
  - This property should include the full template deployment as it would be passed to the
    `Microsoft.Resources/deployments` PUT API. For more information, see the [Deployments REST API](/rest/api/resources/deployments).

  > [!NOTE]
  > All functions inside the **Deployment** property are evaluated as components of the template,
  > not the policy. The exception is the **parameters** property that passes values from the policy
  > to the template. The **value** in this section under a template parameter name is used to
  > perform this value passing (see _fullDbName_ in the DeployIfNotExists example).

### DeployIfNotExists example

Example: Evaluates SQL Server databases to determine if transparentDataEncryption is enabled. If
not, then a deployment to enable is executed.

```json
"if": {
    "field": "type",
    "equals": "Microsoft.Sql/servers/databases"
},
"then": {
    "effect": "DeployIfNotExists",
    "details": {
        "type": "Microsoft.Sql/servers/databases/transparentDataEncryption",
        "name": "current",
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
                    "resources": [{
                        "name": "[concat(parameters('fullDbName'), '/current')]",
                        "type": "Microsoft.Sql/servers/databases/transparentDataEncryption",
                        "apiVersion": "2014-04-01",
                        "properties": {
                            "status": "Enabled"
                        }
                    }]
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

## EnforceRegoPolicy

This effect is used with a policy definition *mode* of `Microsoft.ContainerService.Data`. It's used
to pass admission control rules defined with [Rego](https://www.openpolicyagent.org/docs/how-do-i-write-policies.html#what-is-rego)
to [Open Policy Agent](https://www.openpolicyagent.org/) (OPA) on [Azure Kubernetes Service](../../../aks/intro-kubernetes.md).

> [!NOTE]
> [Azure Policy for Kubernetes](rego-for-aks.md) is in Public Preview and only supports built-in
> policy definitions.

### EnforceRegoPolicy evaluation

The Open Policy Agent admission controller evaluates any new request on the cluster in real-time.
Every 5 minutes, a full scan of the cluster is completed and the results reported to Azure Policy.

### EnforceRegoPolicy properties

The **details** property of the EnforceRegoPolicy effect has the subproperties that describe the
Rego admission control rule.

- **policyId** [required]
  - A unique name passed as a parameter to the Rego admission control rule.
- **policy** [required]
  - Specifies the URI of the Rego admission control rule.
- **policyParameters** [optional]
  - Defines any parameters and values to pass to the rego policy.

### EnforceRegoPolicy example

Example: Rego admission control rule to allow only the specified container images in AKS.

```json
"if": {
    "allOf": [
        {
            "field": "type",
            "equals": "Microsoft.ContainerService/managedClusters"
        },
        {
            "field": "location",
            "equals": "westus2"
        }
    ]
},
"then": {
    "effect": "EnforceRegoPolicy",
    "details": {
        "policyId": "ContainerAllowedImages",
        "policy": "https://raw.githubusercontent.com/Azure/azure-policy/master/built-in-references/KubernetesService/container-allowed-images/limited-preview/gatekeeperpolicy.rego",
        "policyParameters": {
            "allowedContainerImagesRegex": "[parameters('allowedContainerImagesRegex')]"
        }
    }
}
```

## Layering policies

A resource may be impacted by several assignments. These assignments may be at the same scope or at
different scopes. Each of these assignments is also likely to have a different effect defined. The
condition and effect for each policy is independently evaluated. For example:

- Policy 1
  - Restricts resource location to 'westus'
  - Assigned to subscription A
  - Deny effect
- Policy 2
  - Restricts resource location to 'eastus'
  - Assigned to resource group B in subscription A
  - Audit effect
  
This setup would result in the following outcome:

- Any resource already in resource group B in 'eastus' is compliant to policy 2 and non-compliant to
  policy 1
- Any resource already in resource group B not in 'eastus' is non-compliant to policy 2 and
  non-compliant to policy 1 if not in 'westus'
- Any new resource in subscription A not in 'westus' is denied by policy 1
- Any new resource in subscription A and resource group B in 'westus' is created and non-compliant
  on policy 2

If both policy 1 and policy 2 had effect of deny, the situation changes to:

- Any resource already in resource group B not in 'eastus' is non-compliant to policy 2
- Any resource already in resource group B not in 'westus' is non-compliant to policy 1
- Any new resource in subscription A not in 'westus' is denied by policy 1
- Any new resource in resource group B of subscription A is denied

Each assignment is individually evaluated. As such, there isn't an opportunity for a resource to
slip through a gap from differences in scope. The net result of layering policies or policy overlap
is considered to be **cumulative most restrictive**. As an example, if both policy 1 and 2 had a
deny effect, a resource would be blocked by the overlapping and conflicting policies. If you still
need the resource to be created in the target scope, review the exclusions on each assignment to
validate the right policies are affecting the right scopes.

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](definition-structure.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/getting-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).