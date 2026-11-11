---
title: Test Bicep changes with snapshots
description: Use Bicep snapshots to test refactoring, inspect evaluated resource definitions, and catch unintended infrastructure changes in pull requests without deploying to Azure.
ms.topic: how-to
ms.date: 11/06/2026
ms.custom: devx-track-bicep
---

# Test Bicep changes with snapshots

When you refactor Bicep code, you often want to change how the code is organized without changing the resources it deploys. But a large code diff can make it hard to spot an accidental change to a resource name or setting. How can you check that the refactor preserves your infrastructure without deploying it?

Bicep snapshots let you compare the resource definitions before and after a code change. Save a snapshot before refactoring, then check your updated code against it. The comparison focuses on the resources rather than how you organize the code into modules, and runs locally without deploying anything to Azure.

This article explains how to use snapshots in a development and review workflow. For command syntax and options, see the [snapshot command reference](./bicep-cli.md#snapshot).

## Why use snapshots?

Use snapshots to:

- **Check refactoring.** Verify that reorganizing code into modules, renaming symbolic identifiers, or extracting variables doesn't unintentionally change resource names or properties.
- **Inspect complex logic.** See the resource definitions produced by parameter values, loops, conditions, and expressions without deploying them.
- **Review intentional changes.** Compare resource definitions before and after a change, rather than reviewing only the Bicep source.
- **Catch regressions in CI.** Validate committed baselines during pull requests so unexpected infrastructure changes require review.

A snapshot isn't a backup of deployed resources. It describes what your code predicts, not what's currently running in Azure.

### Guardrails for AI-assisted refactoring

Snapshots provide a helpful guardrail when you use an AI agent to refactor Bicep code. For example, an agent might extract repeated resource declarations into a module or simplify complex expressions. Reviewing the source-code diff alone can make it difficult to confirm that these changes preserve the deployment's meaning. Comparing snapshots gives you a check of the resulting resource definitions that's independent of the agent's explanation.

For a refactoring-only task:

1. Create and review snapshot baselines before the agent changes the code.
1. Instruct the agent to preserve deployment behavior and validate against those baselines without overwriting them.
1. Require snapshot validation to pass in CI, and review any changes to parameters, deployment context, or baseline files separately.

A passing comparison demonstrates that the refactor doesn't change the snapshot representation for the tested inputs and deployment context. This result provides evidence of no semantic impact within that coverage, not a proof of equivalence for every possible deployment. Use multiple parameters files to cover important branches and configurations, and review diagnostics and unevaluated expressions before drawing conclusions. If validation fails, investigate the difference rather than allowing the agent to regenerate the baseline to make the check pass.

### Snapshots and what-if

Snapshots and [what-if](./deploy-what-if.md) answer different questions:

| Question | Tool |
|---|---|
| Does my code produce different resource definitions from the approved baseline? | Bicep snapshots |
| How would a deployment change resources that currently exist in Azure? | Azure Resource Manager what-if |

Snapshot evaluation runs locally and doesn't query live Azure resource state. It doesn't require an Azure sign-in for the local comparison. However, restoring external modules can require network access and registry authentication.

Use snapshots for fast feedback while developing and reviewing code. Use what-if before deployment to compare your intended deployment with live resources. A passing snapshot check doesn't prove a deployment will succeed, detect drift in Azure, or verify resource-provider behavior.

## Prerequisites

- Bicep CLI version **0.41.2 or later**, either [installed manually](./install.md#install-manually) or [installed by Azure CLI](./install.md#azure-cli). To run snapshots from Azure CLI, use Azure CLI version **2.90.0 or later**. Snapshots are generally available and don't require an experimental feature setting.
- A `.bicepparam` file that references the Bicep file you want to test.

Check your Bicep CLI version:

# [Bicep CLI](#tab/bicep-cli)

```bash
bicep --version
```

# [Azure CLI](#tab/azure-cli)

For Azure CLI usage, see the [az bicep snapshot reference](/cli/azure/bicep#az-bicep-snapshot).

# [PowerShell](#tab/azure-powershell)

Azure PowerShell doesn't have a snapshot cmdlet. [Install the standalone Bicep CLI](./install.md#install-manually) and run the `bicep snapshot` commands in this article from PowerShell. The examples use Bash line continuations, so end each continued line with a backtick (`` ` ``) instead of `\`. To check the version, run:

```powershell
bicep --version
```

---

## Create a baseline

Start with a small resource group deployment. Save the following code as *main.bicep*:

```bicep
param storageAccountName string
param storageSku string = 'Standard_LRS'

resource storageAccount 'Microsoft.Storage/storageAccounts@2025-01-01' = {
  name: storageAccountName
  location: resourceGroup().location
  sku: {
    name: storageSku
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
  }
}
```

Save the following parameters as *main.bicepparam* in the same directory:

```bicep
using './main.bicep'

param storageAccountName = 'stsnapshottest001'
```

The storage account name is sample test data. These steps don't create a storage account or require the name to be available in Azure.

Generate the baseline with a sample subscription ID, resource group name, and location so deployment context expressions can be evaluated locally. These context values don't need to refer to existing Azure resources:

```bash
bicep snapshot main.bicepparam \
  --mode overwrite \
  --subscription-id aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e \
  --resource-group snapshot-test-rg \
  --location eastus
```

The command writes *main.snapshot.json* alongside *main.bicepparam*. The snapshot includes predicted resource definitions and any snapshot-generation diagnostics. Inspect it to see the storage account name, location, SKU, and evaluated properties:

```json
{
  "predictedResources": [
    {
      "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/snapshot-test-rg/providers/Microsoft.Storage/storageAccounts/stsnapshottest001",
      "type": "Microsoft.Storage/storageAccounts",
      "name": "stsnapshottest001",
      "apiVersion": "2025-01-01",
      "location": "eastus",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2",
      "properties": {
        "supportsHttpsTrafficOnly": true
      }
    }
  ],
  "diagnostics": [],
  "outputs": {}
}
```

The resource `id` contains the supplied subscription ID and resource group name instead of an unevaluated expression. For more information, see [Supply consistent deployment context](#supply-consistent-deployment-context).

Keep the baseline in source control alongside the Bicep and parameters files. This file is the expected result for this particular set of inputs.

> [!CAUTION]
> Use nonsecret test inputs. Snapshot files can contain evaluated values from your templates and parameters. Review generated files for sensitive information before committing them.

## Validate a change

Validate the unchanged code against the saved baseline, using the same deployment context:

```bash
bicep snapshot main.bicepparam \
  --mode validate \
  --subscription-id aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e \
  --resource-group snapshot-test-rg \
  --location eastus
```

Validate mode generates a new snapshot in memory and compares it with *main.snapshot.json*. It doesn't overwrite the baseline. The command returns exit code `0` when the comparison finds no changes and `1` when it finds differences. The baseline must already exist.

Now change the `storageSku` default in *main.bicep*:

```bicep
param storageSku string = 'Standard_GRS'
```

Run the same validation command again. Validation fails and displays a what-if-style diff showing the SKU change from `Standard_LRS` to `Standard_GRS`:

```output
Snapshot validation failed. Expected no changes, but found the following:

Scope: /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/snapshot-test-rg

  ~ Microsoft.Storage/storageAccounts/stsnapshottest001
    ~ sku.name: "Standard_LRS" => "Standard_GRS"
```

This failure means the result differs from the baseline, not that the new configuration is necessarily invalid. Decide whether the difference is intentional before updating the snapshot.

### Check a refactor

To try a behavior-preserving refactor, restore the SKU default to `Standard_LRS`. Move the storage account declaration and its parameters into *storage.bicep*. Replace the contents of *main.bicep* with:

```bicep
param storageAccountName string
param storageSku string = 'Standard_LRS'

module storage './storage.bicep' = {
  params: {
    storageAccountName: storageAccountName
    storageSku: storageSku
  }
}
```

Keep *main.bicepparam* unchanged and validate again:

```bash
bicep snapshot main.bicepparam \
  --mode validate \
  --subscription-id aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e \
  --resource-group snapshot-test-rg \
  --location eastus
```

Although the module structure changed, the predicted storage account definition stays the same, so validation passes. If you accidentally change a resource name, API version, or property while moving the code, validation helps expose the difference.

## Accept an intentional change

When you expect a difference:

1. Run validate mode and review the reported changes.
1. Confirm that the new resource definitions match your intent.
1. Regenerate the baseline:

   ```bash
   bicep snapshot main.bicepparam \
     --mode overwrite \
     --subscription-id aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e \
     --resource-group snapshot-test-rg \
     --location eastus
   ```

1. Review the source-control diff for *main.snapshot.json* and commit it with the corresponding code change.
1. Run validate mode again to confirm that the code and baseline agree.

Don't automatically overwrite baselines when validation fails. Doing so removes the opportunity to catch unintended changes.

## Supply consistent deployment context

Expressions such as `resourceGroup().location` and `subscription().subscriptionId` depend on deployment context. Because snapshot evaluation doesn't query Azure, values that you don't supply can remain as unevaluated expressions.

You can provide context explicitly to evaluate more of these expressions:

```bash
bicep snapshot main.bicepparam \
  --mode overwrite \
  --subscription-id aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e \
  --resource-group snapshot-test-rg \
  --location eastus
```

Use exactly the same context when validating:

```bash
bicep snapshot main.bicepparam \
  --mode validate \
  --subscription-id aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e \
  --resource-group snapshot-test-rg \
  --location eastus
```

These values describe a simulated deployment context. The subscription and resource group don't need to exist for local evaluation. Context options don't override parameters in your `.bicepparam` file.

Choose options appropriate to your deployment scope. For example, `--resource-group` applies to resource-group deployments, and `--management-group-id` applies to management-group deployments. For the full set of options, see [Provide context](./bicep-cli.md#provide-context).

Keep context values stable between developer machines and CI. Otherwise, differences in context can produce snapshot changes even when the Bicep code hasn't changed.

## Use snapshots in pull requests

To add snapshot validation to your CI pipeline:

1. Create and review a baseline locally, then commit the `.snapshot.json` file.
1. Install the same standalone Bicep CLI version on developer machines and the CI runner.
1. Restore any external modules, with registry authentication if required.
1. Run `bicep snapshot` with `--mode validate` for each test parameters file. Configure the pipeline to fail when the command returns a nonzero exit code.

For example, after installing Bicep, a GitHub Actions workflow can include this step:

```yaml
- name: Validate Bicep snapshot
  shell: bash
  run: |
    bicep snapshot main.bicepparam \
      --mode validate \
      --subscription-id aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e \
      --resource-group snapshot-test-rg \
      --location eastus
```

The step assumes the repository is checked out and *main.bicepparam* is in the working directory. If you created the baseline with context options, include those same options in the pipeline command.

Use multiple parameters files to cover meaningful configurations, such as a conditionally enabled resource or different loop inputs. Each parameters file has its own baseline: *dev.bicepparam* produces *dev.snapshot.json*, and *prod.bicepparam* produces *prod.snapshot.json*. One passing snapshot doesn't test every possible parameter combination.

Pin the CLI version to keep comparisons consistent. When upgrading Bicep, review any generated snapshot changes separately from infrastructure changes where practical.

## Understand the limitations

- **No live resource data.** Expressions that depend on runtime state, such as `reference()` or `listKeys()`, can't be fully evaluated locally. Providing context doesn't supply those resource properties.
- **Partial evaluation.** Review snapshot-generation diagnostics and unevaluated expressions. A successful comparison isn't proof that every resource and property was fully evaluated.
- **Input coverage.** Snapshots test the supplied parameter values and context, not all possible deployments.
- **No deployment validation guarantee.** Snapshots don't check permissions, quotas, resource-name availability, or all service-specific constraints. Continue using linting, what-if, and deployment testing as appropriate.

## Next steps

- See the [snapshot command reference](./bicep-cli.md#snapshot).
- [Preview deployment changes with what-if](./deploy-what-if.md).
- Learn about [Bicep parameters files](./parameter-files.md).
