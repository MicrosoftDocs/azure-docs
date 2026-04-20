---
title: Manage storage containers in Microsoft Discovery
description: Learn how to create, list, and manage storage containers and storage assets in a Microsoft Discovery workspace for data ingestion and output.
ms.service: azure
ms.topic: how-to
ms.date: 04/17/2026
ms.author: umamm
author: umamm
---

# Manage storage containers in Microsoft Discovery

A storage container is a Discovery resource that creates a reference to an Azure Blob Storage account or Azure NetApp Files volume. Storage containers enable data ingestion, tool output, and agent data access across your Discovery workspace. Each storage container can hold multiple storage assets that point to specific blob paths within the account.

## Prerequisites

Before creating a storage container, ensure:


- You have an **Azure Storage account** with blob storage enabled in the same or an accessible subscription.
- The workspace's **user-assigned managed identity (UAMI)** has the **Storage Blob Data Contributor** role on the target storage account. This allows the workspace to read and write blobs on behalf of your workloads.
- You have **Contributor** or **Owner** role on the resource group containing the workspace.

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
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}?api-version=2026-02-01-preview" \
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
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers?api-version=2026-02-01-preview" \
  --query "value[].{name:name, kind:properties.storageStore.kind, storageAccount:properties.storageStore.storageAccountId, state:properties.provisioningState}" \
  -o table
```

## Get a storage container

Retrieve details for a specific storage container.

```azurecli
az rest --method GET \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}?api-version=2026-02-01-preview"
```

## Manage storage assets

Storage assets are child resources of a storage container. Each asset points to a specific blob path (folder or file prefix) within the storage account, enabling fine-grained data organization.

### Create a storage asset

```azurecli
az rest --method PUT \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}/storageAssets/{assetName}?api-version=2026-02-01-preview" \
  --body '{
    "location": "{location}",
    "properties": {
      "path": "datasets/experiment-001/"
    }
  }'
```

Replace `{assetName}` with a descriptive name for the asset, `{location}` with the Azure region (must match the parent container), and set `path` to the blob path within the storage account.

### List storage assets

```azurecli
az rest --method GET \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}/storageAssets?api-version=2026-02-01-preview" \
  --query "value[].{name:name, path:properties.path, state:properties.provisioningState}" \
  -o table
```

### Get a storage asset

```azurecli
az rest --method GET \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}/storageAssets/{assetName}?api-version=2026-02-01-preview"
```

### Delete a storage asset

```azurecli
az rest --method DELETE \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}/storageAssets/{assetName}?api-version=2026-02-01-preview"
```

> [!IMPORTANT]
> Deleting a storage asset removes the Discovery reference only. The underlying blob data in your Azure Storage account isn't affected.

## Delete a storage container

Before deleting a storage container, delete all storage assets within it first.

```azurecli
# Step 1: Delete all storage assets in the container
az rest --method DELETE \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}/storageAssets/{assetName}?api-version=2026-02-01-preview"

# Step 2: Delete the storage container
az rest --method DELETE \
  --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/storageContainers/{containerName}?api-version=2026-02-01-preview"
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

**Fix**: Check the workspace's provisioning state first. If the workspace isn't in `Succeeded` state, resolve workspace issues before creating storage containers. You can also re-PUT the storage container with the same body to retry provisioning.

## Next steps

- [Manage workspaces](how-to-manage-workspaces.md) - Set up a workspace and related resources.
- [Configure network security](how-to-configure-network-security.md) - Secure your workspace with network hardening and private endpoints.
- [Bookshelf and knowledge bases](concept-bookshelf-knowledge-bases.md) - Knowledge management and document indexing.
- [Microsoft Discovery REST API reference](/rest/api/discovery) - Full API reference for all resource types.
