---
title: Understand the deployment sequence in Azure Blueprints
description: Learn about the life-cycle that a blueprint goes through and details about each stage.
services: blueprints
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: conceptual
ms.service: blueprints
manager: carmonm
---
# Understand the deployment sequence in Azure Blueprints

Azure Blueprints uses a **sequencing order** to determine the order of resource creation when
processing the assignment of a blueprint. This article explains the default sequencing order that
is used, how to customize the order, and how the customized order is processed.

There are variables in the JSON examples that you need to replace with your own values:

- `{YourMG}` - Replace with the name of your management group

## Default sequencing order

If the blueprint contains no directive for the order to deploy artifacts or the directive is null,
then the following order is used:

- Subscription level **role assignment** artifacts sorted by artifact name
- Subscription level **policy assignment** artifacts sorted by artifact name
- Subscription level **Azure Resource Manager template** artifacts sorted by artifact name
- **Resource group** artifacts (including child artifacts) sorted by placeholder name

Within each **resource group** artifact that is processed, the following sequence order is used for
artifacts to be created within that resource group:

- Resource group child **role assignment** artifacts sorted by artifact name
- Resource group child **policy assignment** artifacts sorted by artifact name
- Resource group child **Azure Resource Manager template** artifacts sorted by artifact name

## Customizing the sequencing order

When composing large blueprints, it may be necessary for a resource to be created in a specific
order in relationship to another resource. The most common use pattern of this is when a blueprint
includes multiple Azure Resource Manager templates. Blueprints handles this by allowing the
sequencing order to be defined.

This is accomplished by defining a `dependsOn` property in the JSON. Only the blueprint (for
resource groups) and artifact objects support this property. `dependsOn` is a string array of
artifact names that the particular artifact needs to be created before it's created.

### Example - blueprint with ordered resource group

This is an example blueprint with a resource group that has defined a custom sequencing order by
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
    "id": "/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/mySequencedBlueprint",
    "type": "Microsoft.Blueprint/blueprints",
    "name": "mySequencedBlueprint"
}
```

### Example - artifact with custom order

This is an example policy artifact that depends on an Azure Resource Manager template. By default
ordering, a policy artifact would be created before the Azure Resource Manager template. This
allows the policy artifact to wait for the Azure Resource Manager template to be created.

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
    "id": "/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/mySequencedBlueprint/artifacts/assignPolicyTags",
    "type": "Microsoft.Blueprint/artifacts",
    "name": "assignPolicyTags"
}
```

## Processing the customized sequence

During the creation process, a topological sort is used to create the dependency graph of the
blueprint and its artifacts. This ensures that multiple levels of dependency between resource
groups and artifacts can be supported.

If a dependency is declared on the blueprint or an artifact that wouldn't alter the default order,
then no change is made to the sequencing order. Examples of this are a resource group that depends
on a subscription level policy or resource group 'standard-rg' child policy assignment that depends
on resource group 'standard-rg' child role assignment. In both cases, the `dependsOn` wouldn't have
altered the default sequencing order and no changes would be made.

## Next steps

- Learn about the [blueprint life-cycle](lifecycle.md)
- Understand how to use [static and dynamic parameters](parameters.md)
- Find out how to make use of [blueprint resource locking](resource-locking.md)
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md)
- Resolve issues during the assignment of a blueprint with [general troubleshooting](../troubleshoot/general.md)