---
title: Azure Policy and Cosmos DB
description: This article describes how to use Azure Policy to implement governance and controls for Cosmos DB resources.
author: plzm
ms.author: paelaz
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/20/2020

---

# Azure Policy Overview

[Azure Policy](../governance/policy/overview.md) helps to enforce organizational governance standards, assess resource compliance, and implement automatic remediation. Common use cases include security, cost management, and configuration consistency.

Azure Policy provides built-in policy definitions. Custom policy definitions can be created for scenarios not addressed by built-in policy definitions. Consult [Azure Policy documentation](../governance/policy/overview.md) for specifics.

## Assigning a Built-in Policy Definition

Policy _assignments_ are created from built-in policy _definitions_. Assignments are scoped to an Azure management group, an Azure subscription, or a resource group and will apply to resources within the scope. Optionally, specific resources can be excluded from the scope.

Policy assignments can be created with the [Azure portal](../governance/policy/assign-policy-portal.md), [Azure PowerShell](../governance/policy/assign-policy-powershell.md), [Azure CLI](../governance/policy/assign-policy-azurecli.md), or [ARM template](../governance/policy/assign-policy-template.md).

To create a policy assignment from a built-in policy definition for Cosmos DB, follow the steps to [create a policy assignment with the Azure portal](../governance/policy/assign-policy-portal.md).

At the step to select a policy definition, and enter `Cosmos DB` in the Search field to filter the list of available built-in policy definitions. Select one of the available built-in policy definitions, then the **Select** button to continue with policy assignment creation.

> [!TIP]
> The built-in policy definition names shown on **Available Definitions** can also be used with Azure PowerShell, Azure CLI, or ARM templates to create policy assignments.

:::image type="content" source="./media/policy/available-definitions.png" alt-text="Search for Cosmos DB built-in policy definitions":::

## Creating a Custom Policy Definition

For specific scenarios not addressed by built-in policies, [a custom policy definition can be created](../governance/policy/tutorials/create-custom-policy-definition). Policy _assignments_ can be created from either built-in or custom policy _definitions_.

### Property Types and Property Aliases in Policy Rules

The [custom policy definition steps](../governance/policy/tutorials/create-custom-policy-definition) include identifying resource properties and property aliases, which are needed to create policy rules.

To identify Cosmos DB property aliases, use the namespace `Microsoft.DocumentDB` with one of the methods shown in the custom policy definition steps.

#### Using the Azure CLI:
```azurecli-interactive
# Login first with az login if not using Cloud Shell

# Get Azure Policy aliases for namespace Microsoft.DocumentDB
az provider show --namespace Microsoft.DocumentDB --expand "resourceTypes/aliases" --query "resourceTypes[].aliases[].name"
```

#### Using Azure PowerShell:
```azurepowershell-interactive
# Login first with Connect-AzAccount if not using Cloud Shell

# Use Get-AzPolicyAlias to list aliases for Microsoft.DocumentDB namespace
(Get-AzPolicyAlias -NamespaceMatch 'Microsoft.DocumentDB').Aliases
```

The output of listing Cosmos DB property aliases using one of the methods described above is a list of property alias names. Partial sample Cosmos DB output:

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

Any of these property alias names can be used in [custom policy definition rules](../governance/policy/tutorials/create-custom-policy-definition#policy-rule).

An example policy can check if a Cosmos DB SQL database's provisioned throughput is greater than a maximum allowable limit of 400 RU/s. A custom policy definition would include two rules: one to check for the specific type to check, and one for the specific property of the type. Both rules would use alias names.

```json
"policyRule": {
  "if": {
    "allOf": [
      {
      "field": "type",
      "equals": "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/throughputSettings"
      },
      {
      "field": "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/throughputSettings/default.resource.throughput",
      "greater": 400
      }
    ]
  }
}
```

Built-in and custom policy definitions can be used similarly to create policy assignments.

## Policy Compliance

After policy assignments are created, Azure Policy evaluates the resources in the assignment's scope. Each resource's _compliance_ with the policy is assessed. The _effect_ specified in the policy is then applied to non-compliant resources.

Compliance results and remediation details can be reviewed in the [Azure portal](../governance/policy/how-to/get-compliance-data#portal) or via the [Azure CLI](../governance/policy/how-to/get-compliance-data#command-line) or [Azure Monitor logs](../governance/policy/how-to/get-compliance-data#azure-monitor-logs).

Two example policy assignments are shown. One assignment, based on a built-in policy definition, checks that Azure Cosmos DB resources are deployed only to allowed Azure regions. The other assignment is based on a custom policy definition. This assignment checks that provisioned throughput on Azure Cosmos DB resources does not exceed a specified maximum.

After the policy assignments were deployed, the compliance dashboard shows evaluation results. Note that this can take up to 30 minutes after policy assignment deployment.

The screenshot shows the following compliance evaluation results:

- Zero of one Azure Cosmos DB accounts in scope are compliant with the policy assignment to check that resources were deployed to allowed regions
- One of two Azure Cosmos DB database or collection resources in scope are compliant with the policy assignment to check for provisioned throughput exceeding the specified maximum

:::image type="content" source="./media/policy/compliance.png" alt-text="Search for Cosmos DB built-in policy definitions":::

Non-compliant resources can be [remediated with Azure Policy](../governance/policy/how-to/remediate-resources).

## Next Steps

- [Review sample custom policy definitions for Azure Cosmos DB](https://github.com/Azure/azure-policy/tree/master/samples/CosmosDB)
- [Create a policy assignment in the Azure portal](../governance/policy/assign-policy-portal)
- [Review Azure Policy built-in policy definitions for Azure Cosmos DB](./policy-samples.md)
