---
title: Manage storage containers in Microsoft Discovery
description: Learn how to create, list, and manage storage containers and storage assets in a Microsoft Discovery workspace for data ingestion and output.
ms.service: azure
ms.topic: how-to
ms.date: 11/10/2026
ms.author: umamm
author: umamm
---

# Manage storage containers in Microsoft Discovery

A storage container is a Discovery resource that creates a reference to an Azure Blob Storage account or Azure NetApp Files volume. Storage containers enable data ingestion, tool output, and agent data access across your Discovery workspace. Each storage container can hold multiple storage assets that point to specific blob paths within the account.

Create storage containers at the resource group scope, not beneath a workspace or project. A project's `storageContainerIds` references these shared resources; it doesn't transfer ownership or grant Blob data permissions. Creating the Discovery reference doesn't create a blob container or copy data. Discovery storage metadata permissions and Blob data permissions are separate. See [Storage container resource hierarchy](concept-storage-containers-assets.md#resource-hierarchy).

The REST examples in this article use API version `2026-06-01` and Azure Blob Storage.

## Prerequisites

Before creating a storage container, ensure:


- You have an **Azure Storage account** with blob storage enabled in the same or an accessible subscription.
- The workspace's **customer-provided user-assigned managed identity (UAMI)** (`workspaceIdentity.id`) has the **Storage Blob Data Contributor** role on the target storage account. For tool runs, verify that the configured supercomputer workload identity also has the required Blob data access.
- You have **Contributor** or **Owner** role on the resource group where you create the Discovery storage container.
- To assign the storage data role, you have role-assignment permissions at the storage account scope, such as **Role Based Access Control Administrator**, **User Access Administrator**, or **Owner**. Contributor alone doesn't grant this permission.
- The storage endpoint is reachable from the Discovery workloads. See [Storage account configuration](how-to-configure-project-storage.md).

The onboarding scripts use the same customer-provided UAMI for the workspace and supercomputer. This identity is separate from your own user permissions and from service-managed identities. Use the configured principal ID when granting storage access.

### Assign Storage Blob Data Contributor to the workspace identity

```azurecli
az role assignment create \
  --assignee-object-id "{uamiPrincipalId}" \
  --assignee-principal-type ServicePrincipal \
  --role "Storage Blob Data Contributor" \
  --scope "/subscriptions/{subscriptionId}/resourceGroups/{storageResourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}"
```

## Create a storage container

A storage container points to a storage backend and specifies the storage kind. Discovery supports `AzureStorageBlob` (Azure Blob Storage) and `AzureNetAppFiles` (Azure NetApp Files volumes).

```azurecli
az rest --method PUT \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}?api-version=2026-06-01" \
  --body '{
    "location": "{location}",
    "properties": {
      "storageStore": {
        "kind": "AzureStorageBlob",
        "storageAccountId": "/subscriptions/{subscriptionId}/resourceGroups/{storageResourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}"
      }
    }
  }'
```

Replace the following placeholders:

| Placeholder | Description |
|-------------|-------------|
| `{subscriptionId}` | Your Azure subscription ID |
| `{resourceGroupName}` | The resource group for the storage container |
| `{containerName}` | A name for the storage container (alphanumeric and hyphens) |
| `{location}` | The Azure region (for example, `swedencentral`) |
| `{storageResourceGroupName}` | The resource group containing the storage account |
| `{storageAccountName}` | The name of the target Azure Storage account |

## List storage containers

Retrieve all storage containers in a resource group.

```azurecli
az rest --method GET \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers?api-version=2026-06-01" \
  --query "value[].{name:name, kind:properties.storageStore.kind, storageAccount:properties.storageStore.storageAccountId, state:properties.provisioningState}" \
  -o table
```

## Get a storage container

Retrieve details for a specific storage container.

```azurecli
az rest --method GET \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}?api-version=2026-06-01"
```

## Manage storage assets

Storage assets are child resources of a storage container. Each asset points to a specific blob path (folder or file prefix) within the storage account, enabling fine-grained data organization.

### Create a storage asset

```azurecli
az rest --method PUT \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}/storageAssets/{assetName}?api-version=2026-06-01" \
  --body '{
    "location": "{location}",
    "properties": {
      "description": "Dataset files for experiment 001",
      "path": "datasets/experiment-001/"
    }
  }'
```

Replace `{assetName}` with a descriptive name for the asset and `{location}` with the parent's Azure region. Set `path` relative to the storage account root, including the blob container name. In this example, `datasets` is the blob container and `experiment-001/` is the prefix within it.

### List storage assets

```azurecli
az rest --method GET \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}/storageAssets?api-version=2026-06-01" \
  --query "value[].{name:name, path:properties.path, state:properties.provisioningState}" \
  -o table
```

### Get a storage asset

```azurecli
az rest --method GET \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}/storageAssets/{assetName}?api-version=2026-06-01"
```

### Delete a storage asset

```azurecli
az rest --method DELETE \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}/storageAssets/{assetName}?api-version=2026-06-01"
```

> [!IMPORTANT]
> Deleting a storage asset removes the Discovery reference only. The underlying blob data in your Azure Storage account isn't affected.

## Delete a storage container

Before deleting a storage container, delete all storage assets within it first.

```azurecli
# Step 1: Delete all storage assets in the container
az rest --method DELETE \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}/storageAssets/{assetName}?api-version=2026-06-01"

# Step 2: Delete the storage container
az rest --method DELETE \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}?api-version=2026-06-01"
```

> [!IMPORTANT]
> Deleting a storage container removes the Discovery reference only. The underlying Azure Storage account and its data aren't affected.

## Resource hierarchy

Storage containers are top-level resources in a resource group, referenced by workspaces through projects:

- A resource group can have multiple storage containers, each pointing to a different storage backend.
- A storage container can have multiple storage assets, each pointing to a different blob path.
- Storage assets are consumed by projects, agents, and tools within the workspace.

## Troubleshooting

### Storage account not found

**Error**: `The resource '.../storageAccounts/{name}' was not found.`

**Fix**: Verify the `storageAccountId` in your request body is a valid ARM resource ID for an existing storage account. The storage account must exist before creating the storage container.

### Permission denied on blob operations

**Error**: `AuthorizationPermissionMismatch` or `This request is not authorized to perform this operation.`

**Fix**: Ensure the workspace's UAMI has the **Storage Blob Data Contributor** role on the target storage account. See [Prerequisites](#assign-storage-blob-data-contributor-to-the-workspace-identity).

### Storage container stuck in provisioning

**Fix**: Inspect the failed storage container operation and its correlation ID. Verify that the referenced backend exists and that the workload identity and network path have access. After correcting the cause, retry with the same request body. A storage container is a resource-group-level resource, so a workspace's provisioning state alone doesn't explain a storage container provisioning failure.

## Next steps

- [Manage workspaces](how-to-manage-workspaces.md) - Set up a workspace and related resources.
- [Configure network security](how-to-configure-network-security.md) - Secure your workspace with network hardening and private endpoints.
- [Bookshelf and knowledge bases](concept-bookshelf-knowledge-bases.md) - Knowledge management and document indexing.
- [Microsoft Discovery REST API reference](/rest/api/discovery) - Full API reference for all resource types.
