---
title: Use Azure Policy to implement governance and controls for Azure Cosmos DB resources
description: Learn how to use Azure Policy to implement governance and controls for Azure Cosmos DB resources.
author: plzm
ms.author: paelaz
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/20/2020

---

# Use Azure Policy to implement governance and controls for Azure Cosmos DB resources

[Azure Policy](../governance/policy/overview.md) helps to enforce organizational governance standards, assess resource compliance, and implement automatic remediation. Common use cases include security, cost management, and configuration consistency.

Azure Policy provides built-in policy definitions. You can create custom policy definitions for scenarios that are not addressed by the built-in policy definitions. See the [Azure Policy documentation](../governance/policy/overview.md) for more details.

## Assign a built-in policy definition

Policy definitions describe resource compliance conditions and the effect to take if a condition is met. Policy _assignments_ are created from policy _definitions_. You can use built-in or custom policy definitions for your Azure Cosmos DB resources. Policy assignments are scoped to an Azure management group, an Azure subscription, or a resource group and they are applied to the resources within the selected scope. Optionally, you can exclude specific resources from the scope.

You can create policy assignments with the [Azure portal](../governance/policy/assign-policy-portal.md), [Azure PowerShell](../governance/policy/assign-policy-powershell.md), [Azure CLI](../governance/policy/assign-policy-azurecli.md), or [ARM template](../governance/policy/assign-policy-template.md).

To create a policy assignment from a built-in policy definition for Azure Cosmos DB, use the steps in [create a policy assignment with the Azure portal](../governance/policy/assign-policy-portal.md) article.

At the step to select a policy definition, enter `Cosmos DB` in the Search field to filter the list of available built-in policy definitions. Select one of the available built-in policy definitions, and then choose **Select** to continue creating the policy assignment.

> [!TIP]
> You can also use the built-in policy definition names shown in the **Available Definitions** pane with Azure PowerShell, Azure CLI, or ARM templates to create policy assignments.

:::image type="content" source="./media/policy/available-definitions.png" alt-text="Search for Azure Cosmos DB built-in policy definitions":::

## Create a custom policy definition

For specific scenarios that are not addressed by built-in policies, you can create [a custom policy definition](../governance/policy/tutorials/create-custom-policy-definition.md). Later you create a Policy _assignment_ from your custom policy _definition_.

### Property types and property aliases in policy rules

Use the [custom policy definition steps](../governance/policy/tutorials/create-custom-policy-definition.md) to identify the resource properties and property aliases, which are required to create policy rules.

To identify Azure Cosmos DB specific property aliases, use the namespace `Microsoft.DocumentDB` with one of the methods shown in the custom policy definition steps article.

#### Use the Azure CLI:
```azurecli-interactive
# Login first with az login if not using Cloud Shell

# Get Azure Policy aliases for namespace Microsoft.DocumentDB
az provider show --namespace Microsoft.DocumentDB --expand "resourceTypes/aliases" --query "resourceTypes[].aliases[].name"
```

#### Use Azure PowerShell:
```azurepowershell-interactive
# Login first with Connect-AzAccount if not using Cloud Shell

# Use Get-AzPolicyAlias to list aliases for Microsoft.DocumentDB namespace
(Get-AzPolicyAlias -NamespaceMatch 'Microsoft.DocumentDB').Aliases
```

These commands output the list of property alias names for Azure Cosmos DB property. The following is an excerpt from the output:

```json
[
  "Microsoft.DocumentDB/databaseAccounts/sku.name",
  "Microsoft.DocumentDB/databaseAccounts/virtualNetworkRules[*]",
  "Microsoft.DocumentDB/databaseAccounts/virtualNetworkRules[*].id",
  "Microsoft.DocumentDB/databaseAccounts/isVirtualNetworkFilterEnabled",
  "Microsoft.DocumentDB/databaseAccounts/consistencyPolicy.defaultConsistencyLevel",
  "Microsoft.DocumentDB/databaseAccounts/enableAutomaticFailover",
  "Microsoft.DocumentDB/databaseAccounts/Locations",
  "Microsoft.DocumentDB/databaseAccounts/Locations[*]",
  "Microsoft.DocumentDB/databaseAccounts/Locations[*].locationName",
  "..."
]
```

You can use any of these property alias names in the [custom policy definition rules](../governance/policy/tutorials/create-custom-policy-definition.md#policy-rule).

The following is an example policy definition that checks if an Azure Cosmos DB account is configured for multiple write locations. The custom policy definition includes two rules: one to check for the specific type of property alias, and the second one for the specific property of the type, in this case the field that stores the multiple write location setting. Both rules use the alias names.

```json
"policyRule": {
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.DocumentDB/databaseAccounts"
      },
      {
        "field": "Microsoft.DocumentDB/databaseAccounts/enableMultipleWriteLocations",
        "notEquals": true
      }
    ]
  },
  "then": {
    "effect": "Audit"
  }
}
```

Custom policy definitions can be used to create policy assignments just like the built-in policy definitions are used.

## Policy compliance

After the policy assignments are created, Azure Policy evaluates the resources in the assignment's scope. Each resource's _compliance_ with the policy is assessed. The _effect_ specified in the policy is then applied to non-compliant resources.

You can review the compliance results and remediation details in the [Azure portal](../governance/policy/how-to/get-compliance-data.md#portal) or via the [Azure CLI](../governance/policy/how-to/get-compliance-data.md#command-line) or the [Azure Monitor logs](../governance/policy/how-to/get-compliance-data.md#azure-monitor-logs).

The following screenshot shows two example policy assignments.

One assignment is based on a built-in policy definition, which checks that the Azure Cosmos DB resources are deployed only to the allowed Azure regions. Resource compliance shows policy evaluation outcome (compliant or non-compliant) for in-scope resources.

The other assignment is based on a custom policy definition. This assignment checks that Cosmos DB accounts are configured for multiple write locations.

After the policy assignments are deployed, the compliance dashboard shows evaluation results. Note that this can take up to 30 minutes after deploying a policy assignment. Additionally, [policy evaluation scans can be started on-demand](../governance/policy/how-to/get-compliance-data.md#on-demand-evaluation-scan) immediately after creating policy assignments.

The screenshot shows the following compliance evaluation results for in-scope Azure Cosmos DB accounts:

- Zero of two accounts are compliant with a policy that Virtual Network (VNet) filtering must be configured.
- Zero of two accounts are compliant with a policy that requires the account to be configured for multiple write locations
- Zero of two accounts are compliant with a policy that resources were deployed to allowed Azure regions.

:::image type="content" source="./media/policy/compliance.png" alt-text="Compliance results for Azure Policy assignments listed":::

To remediate the non-compliant resources, see [how to remediate resources with Azure Policy](../governance/policy/how-to/remediate-resources.md).

## Next steps

- [Review sample custom policy definitions for Azure Cosmos DB](https://github.com/Azure/azure-policy/tree/master/samples/CosmosDB), including for the multiple write location and VNet filtering policies shown above.
- [Create a policy assignment in the Azure portal](../governance/policy/assign-policy-portal.md)
- [Review Azure Policy built-in policy definitions for Azure Cosmos DB](./policy-samples.md)
