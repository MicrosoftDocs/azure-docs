---
title: Understand Azure Policy effects
description: Azure Policy definition have various effects that determine how compliance is managed and reported.
services: azure-policy
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: conceptual
ms.service: azure-policy
manager: carmonm
ms.custom: mvc
---
# Understand Policy effects

Each policy definition in Azure Policy has a single effect that determines what happens during
scanning when the **if** segment of the policy rule is evaluated to match the resource being
scanned. The effects can also behave differently if they are for a new resource, an updated
resource, or an existing resource.

There are currently five effects that are supported in a policy definition:

- Append
- Audit
- AuditIfNotExists
- Deny
- DeployIfNotExists

## Order of evaluation

When a request to create or update a resource through Azure Resource Manager is made, Policy
processes several of the effects prior to handing the request to the appropriate Resource Provider.
Doing so prevents unnecessary processing by a Resource Provider when a resource does not meet the
designed governance controls of Policy. Policy creates a list of all policy definitions assigned,
by a policy or initiative assignment, that apply by scope (minus exclusions) to the resource and
prepares to evaluate the resource against each definition.

- **Append** is evaluated first. Since append could alter the request, a change made by append may prevent an audit or deny effect from triggering.
- **Deny** is then evaluated. By evaluating deny before audit, double logging of an undesired resource is prevented.
- **Audit** is then evaluated prior to the request going to the Resource Provider.

Once the request is provided to the Resource Provider and the Resource Provider returns a success
status code, **AuditIfNotExists** and **DeployIfNotExists** are evaluated to determine if follow-up
compliance logging or action is required.

## Append

Append is used to add additional fields to the requested resource during creation or update. It can
be useful for adding tags on resources such as costCenter or specifying allowed IPs for a storage
resource.

### Append evaluation

As mentioned, append evaluates prior to the request getting processed by a Resource Provider during
the creation or updating of a resource. Append adds field(s) to the resource when the **if**
condition of the policy rule is met. If the append effect would override a value in the original
request with a different value, then it acts as a deny effect and reject the request.

When a policy definition using the append effect is run as part of an evaluation cycle, it does not
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

Example 2: Multiple **field/value** pairs to append a set of tags.

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

Example 3: Single **field/value** pair using an [alias](definition-structure.md#aliases) with an
array **value** to set IP rules on a storage account.

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

## Deny

Deny is used to prevent a resource request that doesn't match desired standards through a policy
definition and fails the request.

### Deny evaluation

When creating or updating a resource, deny prevents the request prior to being sent to the Resource
Provider. The request is returned as a 403 (Forbidden). In the portal, the Forbidden can be viewed
as a status on the deployment that was prevented due to the policy assignment.

During an evaluation cycle, policy definitions with a deny effect that match resources are marked
as non-compliant, but no action is performed on that resource.

### Deny properties

The deny effect does not have any additional properties for use in the **then** condition of the
policy definition.

### Deny example

Example: Using the deny effect.

```json
"then": {
    "effect": "deny"
}
```

## Audit

Audit effect is used to create a warning event in the activity log when a non-compliant resource is
evaluated, but it does not stop the request.

### Audit evaluation

The audit effect is the last to run during the creation or update of a resource prior to the
resource is sent to the Resource Provider. Audit works the same for a resource request and an
evaluation cycle, and executes a `Microsoft.Authorization/policies/audit/action` operation to the
activity log. In both cases, the resource is marked as non-compliant.

### Audit properties

The audit effect does not have any additional properties for use in the **then** condition of the
policy definition.

### Audit example

Example: Using the audit effect.

```json
"then": {
    "effect": "audit"
}
```

## AuditIfNotExists

AuditIfNotExists enables auditing on a resource that matches the **if** condition, but does not
have the components specified in the **details** of the **then** condition.

### AuditIfNotExists evaluation

AuditIfNotExists runs after a Resource Provider has handled a create or update request to a
resource and has returned a success status code. The effect is triggered if there are no related
resources or if the resources defined by **ExistenceCondition** do not evaluate to true. When the
effect is triggered, a `Microsoft.Authorization/policies/audit/action` operation to the activity
log is executed in the same way as the audit effect. When triggered, the resource that satisfied
the **if** condition is the resource that is marked as non-compliant.

### AuditIfNotExists properties

The **details** property of the AuditIfNotExists effects has all the subproperties that define the
related resources to match.

- **Type** [required]
  - Specifies the type of the related resource to match.
  - Starts by trying to fetch a resource underneath the **if** condition resource, then queries within the same resource group as the **if** condition resource.
- **Name** (optional)
  - Specifies the exact name of the resource to match and causes the policy to fetch one specific resource instead of all resources of the specified type.
- **ResourceGroupName** (optional)
  - Allows the matching of the related resource to come from a different resource group.
  - Does not apply if **type** is a resource that would be underneath the **if** condition resource.
  - Default is the **if** condition resource's resource group.
- **ExistenceScope** (optional)
  - Allowed values are _Subscription_ and _ResourceGroup_.
  - Sets the scope of where to fetch the related resource to match from.
  - Does not apply if **type** is a resource that would be underneath the **if** condition resource.
  - For _ResourceGroup_, would limit to the **if** condition resource's resource group or the resource group specified in **ResourceGroupName**.
  - For _Subscription_, queries the entire subscription for the related resource.
  - Default is _ResourceGroup_.
- **ExistenceCondition** (optional)
  - If not specified, any related resource of **type** satisfies the effect and does not trigger the audit.
  - Uses the same language as the policy rule for the **if** condition, but is evaluated against each related resource individually.
  - If any matching related resource evaluates to true, the effect is satisfied and does not trigger the audit.
  - Can use [field()] to check equivalence with values in the **if** condition.
  - For example, could be used to validate that the parent resource (in the **if** condition) is in the same resource location as the matching related resource.

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

DeployIfNotExists also runs after a Resource Provider has handled a create or update request to a
resource and has returned a success status code. The effect is triggered if there are no related
resources or if the resources defined by **ExistenceCondition** do not evaluate to true. When the
effect is triggered, a template deployment is executed.

During an evaluation cycle, policy definitions with a DeployIfNotExists effect that match resources
are marked as non-compliant, but no action is performed on that resource.

### DeployIfNotExists properties

The **details** property of the DeployIfNotExists effects has all the subproperties that define the
related resources to match and the template deployment to execute.

- **Type** [required]
  - Specifies the type of the related resource to match.
  - Starts by trying to fetch a resource underneath the **if** condition resource, then queries within the same resource group as the **if** condition resource.
- **Name** (optional)
  - Specifies the exact name of the resource to match and causes the policy to fetch one specific resource instead of all resources of the specified type.
- **ResourceGroupName** (optional)
  - Allows the matching of the related resource to come from a different resource group.
  - Does not apply if **type** is a resource that would be underneath the **if** condition resource.
  - Default is the **if** condition resource's resource group.
  - If a template deployment is executed, it is deployed in the resource group of this value.
- **ExistenceScope** (optional)
  - Allowed values are _Subscription_ and _ResourceGroup_.
  - Sets the scope of where to fetch the related resource to match from.
  - Does not apply if **type** is a resource that would be underneath the **if** condition resource.
  - For _ResourceGroup_, would limit to the **if** condition resource's resource group or the resource group specified in **ResourceGroupName**.
  - For _Subscription_, queries the entire subscription for the related resource.
  - Default is _ResourceGroup_.
- **ExistenceCondition** (optional)
  - If not specified, any related resource of **type** satisfies the effect and does not trigger the deployment.
  - Uses the same language as the policy rule for the **if** condition, but is evaluated against each related resource individually.
  - If any matching related resource evaluates to true, the effect is satisfied and does not trigger the deployment.
  - Can use [field()] to check equivalence with values in the **if** condition.
  - For example, could be used to validate that the parent resource (in the **if** condition) is in the same resource location as the matching related resource.
- **roleDefinitionIds** [required]
  - This property must contain an array of strings that match role-based access control role ID accessible by the subscription. For more information, see [remediation - configure policy definition](../how-to/remediate-resources.md#configure-policy-definition).
- **Deployment** [required]
  - This property should contain the full template deployment as it would be passed to the `Microsoft.Resources/deployments` PUT API. For more information, see the [Deployments REST API](/rest/api/resources/deployments).

  > [!NOTE]
  > All functions inside the **Deployment** property are evaluated as components of the
  > template, not the policy. The exception is the **parameters** property that passes values from
  > the policy to the template. The **value** in this section under a template parameter name is used
  > to perform this value passing (see _fullDbName_ in the DeployIfNotExists example).

### DeployIfNotExists example

Example: Evaluates SQL Server databases to determine if transparentDataEncryption is enabled. If
not, then a deployment to enable it is executed.

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
            "/subscription/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/{roleGUID}",
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
                    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
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

## Layering policies

A resource may be impacted by multiple assignments. These assignments may be at the same scope
(specific resource, resource group, subscription, or management group) or at different scopes. Each
of these assignments is also likely to have a different effect defined. Regardless, the condition
and effect for each policy (assigned directly or as part of an initiative) is independently
evaluated. For example, if policy 1 has a condition that restricts resource location for
subscription A to only be created in ‘westus’ with the deny effect and policy 2 has a condition
that restricts resource location for resource group B (which is in subscription A) to only be
created in ‘eastus’ with the audit effect are both assigned, the resulting outcome would be::

- Any resource already in resource group B in 'eastus' is compliant to policy 2, but marked as non-compliant to policy 1.
- Any resource already in resource group B not in 'eastus' will be marked as non-compliant to policy 2, and would also be marked not-compliant to policy 1 if not 'westus'.
- Any new resource in subscription A not in 'westus' would be denied by policy 1.
- Any new resource in subscription A / resource group B in 'westus' would be marked as non-compliant on policy 2, but would be created (compliant to policy 1 and policy 2 is audit and not deny).

If both policy 1 and policy 2 had effect of deny, the situation would change to:

- Any resource already in resource group B not in 'eastus' will be marked as non-compliant to policy 2.
- Any resource already in resource group B not in 'westus' will be marked as non-compliant to policy 1.
- Any new resource in subscription A not in 'westus' would be denied by policy 1.
- Any new resource in subscription A / resource group B would be denied (since its location could never satisfy both policy 1 and policy 2).

As each assignment is individually evaluated, there isn't an opportunity for a resource to slip
through a gap due to differences in scope. Therefore, the net result of layering policies or policy
overlap is considered to be **cumulative most restrictive**. In other words, a resource you want
created could be blocked due to overlapping and conflicting policies such as the example above if
both policy 1 and policy 2 had a deny effect. If you still need the resource to be created in the
target scope, review the exclusions on each assignment to ensure the right policies are affecting
the right scopes.

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md)
- Review the [Policy definition structure](definition-structure.md)
- Understand how to [programmatically create policies](../how-to/programmatically-create.md)
- Learn how to [get compliance data](../how-to/getting-compliance-data.md)
- Discover how to [remediate non-compliant resources](../how-to/remediate-resources.md)
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md)