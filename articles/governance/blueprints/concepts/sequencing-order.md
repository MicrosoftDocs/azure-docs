---
title: Understand the deployment sequence order
description: Learn about the default order that blueprint artifacts are deployed in during a blueprint assignment and how to customize the deployment order.
ms.date: 05/06/2020
ms.topic: conceptual
---
# Understand the deployment sequence in Azure Blueprints

Azure Blueprints uses a **sequencing order** to determine the order of resource creation when
processing the assignment of a blueprint definition. This article explains the following concepts:

- The default sequencing order that is used
- How to customize the order
- How the customized order is processed

There are variables in the JSON examples that you need to replace with your own values:

- `{YourMG}` - Replace with the name of your management group

## Default sequencing order

If the blueprint definition contains no directive for the order to deploy artifacts or the directive
is null, then the following order is used:

- Subscription level **role assignment** artifacts sorted by artifact name
- Subscription level **policy assignment** artifacts sorted by artifact name
- Subscription level **Azure Resource Manager template** artifacts sorted by artifact name
- **Resource group** artifacts (including child artifacts) sorted by placeholder name

Within each **resource group** artifact, the following sequence order is used for artifacts to be
created within that resource group:

- Resource group child **role assignment** artifacts sorted by artifact name
- Resource group child **policy assignment** artifacts sorted by artifact name
- Resource group child **Azure Resource Manager template** artifacts sorted by artifact name

> [!NOTE]
> Use of [artifacts()](../reference/blueprint-functions.md#artifacts) creates an implicit dependency
> on the artifact being referred to.

## Customizing the sequencing order

When composing large blueprint definitions, it may be necessary for resources to be created in a
specific order. The most common use pattern of this scenario is when a blueprint definition includes
several Azure Resource Manager templates. Azure Blueprints handles this pattern by allowing the
sequencing order to be defined.

The ordering is accomplished by defining a `dependsOn` property in the JSON. The blueprint
definition, for resource groups, and artifact objects support this property. `dependsOn` is a string
array of artifact names that the particular artifact needs to be created before it's created.

> [!NOTE]
> When creating blueprint objects, each artifact resource gets its name from the filename, if using
> [PowerShell](/powershell/module/az.blueprint/new-azblueprintartifact), or the URL endpoint, if
> using [REST API](/rest/api/blueprints/artifacts/createorupdate). _resourceGroup_ references in
> artifacts must match those defined in the blueprint definition.

### Example - ordered resource group

This example blueprint definition has a resource group that has defined a custom sequencing order by
declaring a value for `dependsOn`, along with a standard resource group. In this case, the artifact
named **assignPolicyTags** will be processed before the **ordered-rg** resource group.
**standard-rg** will be processed per the default sequencing order.

```json
{
    "properties": {
        "description": "Example blueprint with custom sequencing order",
        "resourceGroups": {
            "ordered-rg": {
                "dependsOn": [
                    "assignPolicyTags"
                ],
                "metadata": {
                    "description": "Resource Group that waits for 'assignPolicyTags' creation"
                }
            },
            "standard-rg": {
                "metadata": {
                    "description": "Resource Group that follows the standard sequence ordering"
                }
            }
        },
        "targetScope": "subscription"
    },
    "type": "Microsoft.Blueprint/blueprints"
}
```

### Example - artifact with custom order

This example is a policy artifact that depends on an Azure Resource Manager template. By default
ordering, a policy artifact would be created before the Azure Resource Manager template. This
ordering allows the policy artifact to wait for the Azure Resource Manager template to be created.

```json
{
    "properties": {
        "displayName": "Assigns an identifying tag",
        "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/2a0e14a6-b0a6-4fab-991a-187a4f81c498",
        "resourceGroup": "standard-rg",
        "dependsOn": [
            "customTemplate"
        ]
    },
    "kind": "policyAssignment",
    "type": "Microsoft.Blueprint/artifacts"
}
```

### Example - subscription level template artifact depending on a resource group

This example is for a Resource Manager template deployed at the subscription level to depend on a
resource group. In default ordering, the subscription level artifacts would be created before any
resource groups and child artifacts in those resource groups. The resource group is defined in the
blueprint definition like this:

```json
"resourceGroups": {
    "wait-for-me": {
        "metadata": {
            "description": "Resource Group that is deployed prior to the subscription level template artifact"
        }
    }
}
```

The subscription level template artifact depending on the **wait-for-me** resource group is defined
like this:

```json
{
    "properties": {
        "template": {
            ...
        },
        "parameters": {
            ...
        },
        "dependsOn": ["wait-for-me"],
        "displayName": "SubLevelTemplate",
        "description": ""
    },
    "kind": "template",
    "type": "Microsoft.Blueprint/blueprints/artifacts"
}
```

## Processing the customized sequence

During the creation process, a topological sort is used to create the dependency graph of the
blueprints artifacts. The check makes sure each level of dependency between resource groups and
artifacts is supported.

If an artifact dependency is declared that wouldn't alter the default order, then no change is made.
An example is a resource group that depends on a subscription level policy. Another example is a
resource group 'standard-rg' child policy assignment that depends on resource group 'standard-rg'
child role assignment. In both cases, the `dependsOn` wouldn't have altered the default sequencing
order and no changes would be made.

## Next steps

- Learn about the [blueprint lifecycle](lifecycle.md).
- Understand how to use [static and dynamic parameters](parameters.md).
- Find out how to make use of [blueprint resource locking](resource-locking.md).
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md).
- Resolve issues during the assignment of a blueprint with [general troubleshooting](../troubleshoot/general.md).