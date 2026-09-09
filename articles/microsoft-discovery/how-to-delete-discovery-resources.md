---
title: Delete Microsoft Discovery resources
description: Learn how to delete Microsoft Discovery resources in the correct order so that parent-child dependencies don't block resource group deletion.
author: leijgao
ms.author: leijiagao
ms.service: azure
ms.topic: how-to
ms.date: 09/04/2026

#CustomerIntent: As a Discovery administrator, I want to delete Microsoft Discovery resources in the right order so that I can fully clean up a deployment.
---

# Delete Microsoft Discovery resources

> **Applies to:** Microsoft Discovery (Public Preview)

When you no longer need a Microsoft Discovery deployment, delete its resources in a specific order. Discovery resources form a parent-child hierarchy. A parent resource refuses deletion while any child still exists.

Discovery resources fall into two planes. Each plane has its own deletion experience:

| Plane | Resources | Where to delete |
| --- | --- | --- |
| Data plane | Agents, workflow agents, knowledge bases | Microsoft Discovery Studio |
| Control plane | Workspaces, projects, chat model deployments, supercomputers, node pools, storage containers, storage assets, bookshelves, tools | Azure portal or Azure CLI |

> [!IMPORTANT]
> Delete data plane resources first. Control plane deletion fails while agents still reference a project, bookshelf, or tool.

## Review the deletion order

1. **Agents** and **workflow agents** (data plane, per project)
1. **Knowledge bases** (data plane, per bookshelf)
1. **Storage assets**, **chat model deployments**, **node pools**, **bookshelves**, **tools**
1. **Projects** and **storage containers**
1. **Workspaces**
1. **Supercomputers**
1. Supporting Azure resources: virtual network, user-assigned managed identity, container registry, storage account, Event Grid system topic

Step 3 resources don't depend on each other, so you can delete them in any order or in parallel. Steps 4 through 6 are strictly sequential.

## Delete data plane resources in Discovery Studio

Agents, workflow agents, and knowledge bases aren't Azure Resource Manager resources, so they don't appear in the Azure portal. Delete them in Microsoft Discovery Studio:

1. Open your workspace in Discovery Studio.
1. Select the project, then delete every agent and workflow agent it contains.
1. Open each bookshelf and delete its knowledge bases.

If you skip this step, control plane deletion fails with one of these errors:

- `ResourceHasDependentResources` — *Cannot delete the project while agents are present.*
- `ValidationError` — *Knowledge base `<name>` (version `<version>`) is linked to N agent(s).*

## Delete control plane resources

Use either the Azure portal or the Azure CLI. The portal deletes resources one at a time from each resource blade. The following Azure CLI examples are easier to script.

### Before you begin

Sign in and select the subscription that contains the resources. This approach ensures Azure issues the token for the subscription's tenant:

```azurecli
az login
az account set --subscription <subscription-id>
```

Set variables that the following commands reuse:

```bash
SUB=<subscription-id>
RG=<resource-group>
API=2026-06-01
```

All Microsoft Discovery commands require the `--api-version` parameter. Without it, the Azure CLI can't resolve the resource type and reports a generic failure.

### Delete child resources

Delete storage assets, chat model deployments, and node pools before their parents:

```azurecli
# Storage assets
az resource delete --subscription $SUB --api-version $API \
  --ids "/subscriptions/$SUB/resourceGroups/$RG/providers/Microsoft.Discovery/storagecontainers/<storage-container>/storageassets/<asset>"

# Chat model deployments
az resource delete --subscription $SUB --api-version $API \
  --ids "/subscriptions/$SUB/resourceGroups/$RG/providers/Microsoft.Discovery/workspaces/<workspace>/chatmodeldeployments/<deployment>"

# Node pools
az resource delete --subscription $SUB --api-version $API \
  --ids "/subscriptions/$SUB/resourceGroups/$RG/providers/Microsoft.Discovery/supercomputers/<supercomputer>/nodepools/<nodepool>"
```

To delete every child of a given type at once, list the resources first:

```azurecli
IDS=$(az resource list --subscription $SUB --resource-group $RG \
  --query "[?type=='Microsoft.Discovery/storagecontainers/storageassets'].id" -o tsv)
az resource delete --subscription $SUB --api-version $API --ids $IDS
```

### Delete bookshelves and tools

```azurecli
az resource delete --subscription $SUB --resource-group $RG --api-version $API \
  --name <bookshelf> --resource-type Microsoft.Discovery/bookshelves

az resource delete --subscription $SUB --resource-group $RG --api-version $API \
  --name <tool> --resource-type Microsoft.Discovery/tools
```

### Delete projects and storage containers

```azurecli
az resource delete --subscription $SUB --api-version $API \
  --ids "/subscriptions/$SUB/resourceGroups/$RG/providers/Microsoft.Discovery/workspaces/<workspace>/projects/<project>"

az resource delete --subscription $SUB --resource-group $RG --api-version $API \
  --name <storage-container> --resource-type Microsoft.Discovery/storagecontainers
```

### Delete the workspace

```azurecli
az resource delete --subscription $SUB --resource-group $RG --api-version $API \
  --name <workspace> --resource-type Microsoft.Discovery/workspaces
```

### Delete the supercomputer

Delete the supercomputer only after the workspace is gone. A workspace references every attached supercomputer through its `supercomputerIds` property:

```azurecli
az resource show --subscription $SUB --resource-group $RG --api-version $API \
  --name <workspace> --resource-type Microsoft.Discovery/workspaces \
  --query properties.supercomputerIds
```

```azurecli
az resource delete --subscription $SUB --resource-group $RG --api-version $API \
  --name <supercomputer> --resource-type Microsoft.Discovery/supercomputers
```

When you delete a supercomputer, Azure also removes its managed resource group (`mrg-dscmp-<supercomputer>-<suffix>`) and the underlying Azure Kubernetes Service (AKS) cluster.

### Delete supporting resources

After you delete all Microsoft Discovery resources, delete the virtual network, user-assigned managed identity, container registry, storage account, and Event Grid system topic that the deployment used. Delete these resources last, because Discovery and AKS resources reference them.

Azure automatically removes managed on behalf of (MOBO) broker resources named `mobr-*` with their parent resource. Don't delete them directly.

## Timing expectations

Workspace, bookshelf, and supercomputer deletions are long-running operations that can take 30 minutes or more. Add `--no-wait` to submit the request and poll separately.

```azurecli
az resource delete --subscription $SUB --resource-group $RG --api-version $API \
  --name <workspace> --resource-type Microsoft.Discovery/workspaces --no-wait
```

Azure Resource Manager caches resource listings, so a deleted child resource can still appear in `az resource list` for a few minutes. Confirm the actual state with `az resource show`, which returns `ResourceNotFound` after deletion completes.

## Troubleshoot a node pool that fails to delete

If node pool deletion returns `InternalServerError` with the target `internalMetadata`, the backing AKS cluster is likely unhealthy. The cluster that backs the supercomputer shows a `Failed` or `Deallocated` state.

1. Check the cluster in the supercomputer's managed resource group:

   ```azurecli
   az aks show --resource-group mrg-dscmp-<supercomputer>-<suffix> --name aks-dscmp-<suffix> \
     --query "{provisioningState:provisioningState, powerState:powerState.code}"
   ```

1. Reconcile the cluster:

   ```azurecli
   az aks update --resource-group mrg-dscmp-<supercomputer>-<suffix> --name aks-dscmp-<suffix> --yes
   ```

1. When `provisioningState` returns `Succeeded`, retry the node pool deletion.

A direct node pool reprovision doesn't clear this state. Repair the AKS cluster first.

## Related content

- [Manage workspaces in Microsoft Discovery](how-to-manage-workspaces.md)
- [Manage Supercomputer and Nodepools in Microsoft Discovery](how-to-manage-supercomputers.md)
