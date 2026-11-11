---
title: Storage containers and storage assets in Microsoft Discovery
description: Understand how storage containers and storage assets organize data in Microsoft Discovery workspaces, including the relationship to Azure Blob Storage and how agents use them.
author: umamm
ms.author: umamm
ms.service: azure
ms.topic: concept-article
ms.date: 11/10/2026
---

# Storage containers and storage assets in Microsoft Discovery

Microsoft Discovery uses **storage containers** and **storage assets** to organize data used by workspaces and projects. A storage container references an Azure Blob Storage account or Azure NetApp Files volume. Storage assets reference paths within that storage backend. Together, they provide the data layer that agents, tools, and shared sessions use to read input and write output.


## Key concepts

| Concept | Description | Azure resource type |
|---------|-----------|-------------------|
| **Storage container** | A resource-group-level resource that references an Azure Blob Storage account or Azure NetApp Files volume. | `Microsoft.Discovery/storageContainers` |
| **Storage asset** | A child resource of a storage container that references a path in the backing storage. | `Microsoft.Discovery/storageContainers/storageAssets` |
| **Storage account** | The underlying Azure Blob Storage account that holds the actual data. | `Microsoft.Storage/storageAccounts` |

## Resource hierarchy

Storage containers are Azure Resource Manager (ARM) resources at resource group scope. Storage assets are their children. Projects reference these shared resources; neither a workspace nor a project is their ARM parent. Project access doesn't grant access to the referenced storage automatically. See [Projects and shared sessions](concept-projects-investigations.md#project-access-boundary).

:::image type="content" source="media/concept-storage-containers-assets/storage-hierarchy.jpg" alt-text="Diagram showing storage container and storage asset hierarchy within a resource group, with workspace and project references." lightbox="media/concept-storage-containers-assets/storage-hierarchy.jpg":::

Projects in a workspace can reference multiple storage containers, each pointing to a storage backend. A storage container can have multiple storage assets, each pointing to a different path within that backend.

## How storage containers work

### Registration, not data movement

Creating a storage container **registers** an existing storage backend with Microsoft Discovery. It doesn't move or copy data. A Discovery storage container isn't an Azure Blob Storage container. The actual data remains in your storage backend. Projects, agents, and tools use the Discovery reference with the required identity permissions and network access.

### Supported storage kinds

Discovery supports the following storage kinds:

| Kind | Value | Description |
|------|-------|-------------|
| Azure Blob Storage | `AzureStorageBlob` | Standard Azure Blob Storage account. Hierarchical namespace (Data Lake Storage Gen2) isn't required. |
| Azure NetApp Files | `AzureNetAppFiles` | Azure NetApp Files volume for high-performance file storage. Specify the `netAppVolumeId` instead of `storageAccountId`. |

Azure Blob Storage is the most common choice for general-purpose data ingestion and output. Azure NetApp Files is available for workloads that require high-throughput NFS-based file access.

### Authentication

A storage container is a reference, not an identity. Grant storage access to the identities used by its consumers: for example, the workspace's **user-assigned managed identity (UAMI)** for workspace file operations or the Bookshelf workload identity for indexing. For Azure Blob Storage, **Storage Blob Data Contributor** provides read/write data access on the backing storage account. For identity configuration and required roles, see [Managed identities in Microsoft Discovery](concept-managed-identities.md).

## How storage assets work

A storage asset represents a path within the backend referenced by its parent storage container. For Azure Blob Storage, the path includes the blob container name and an optional file or prefix, such as `datasets/experiment-001/`. Storage assets are the primary way data enters and exits Discovery shared sessions.

### Input data

When you create a storage asset with a `path` pointing to an existing blob or blob prefix, tools and agents running on the supercomputer can read that data. For example, you might create a storage asset pointing to a blob prefix containing CSV files for an experiment.

### Output data

When agents and tools produce output, the platform tracks the files in the conversation's resource context. Agent-generated files and shared tool outputs are represented by storage assets. Tool outputs can remain intermediate resources until shared. See [Files and storage assets](concept-files-storage-assets.md) and [Share storage assets with users](how-to-data-handling-with-tools-agents.md#share-storage-assets-with-users).

### Addressing

Agents use conversation resource URIs to address files within the platform:

```text
discovery://resources/{storageContainerName}/paths/{blobPath}
```

Agents use built-in tools like **GetResourceContext** and **PreviewResource** to discover and read files through these URIs. The platform translates `discovery://` URIs to the physical blob storage location at runtime.

These conversation URIs aren't the same as the `storageUri` values used for REST job mounts. For that API's storage asset URI format, see [DataMount object](how-to-run-jobs-supercomputer-rest-api.md#datamount-object). Don't substitute one URI format for the other.

## How Discovery resources use storage

| Resource | How it uses storage |
|----------|-------------------|
| **Project** | References one or more storage containers as its data sources. Tools and investigations within the project read from and write to these containers. |
| **Tool runs** | Mount storage containers as input and output data volumes. Input mounts provide read access; output mounts collect results. |
| **Agents** | Use built-in file tools (WriteResource, PreviewResource) to create and read storage assets during investigations. |
| **Investigations** | Accumulate storage assets as tasks complete. The root task collects all output file references through upward propagation. |
| **Bookshelf** | Uses storage to ingest documents for knowledge-base indexing. Source data for indexing comes from storage assets. |

## Storage container lifecycle

| Phase | What happens |
|-------|-------------|
| **Create** | You register a storage backend by creating a storage container (`PUT`). |
| **Use** | Projects, tools, and agents read from and write to the storage account through the registered container. |
| **Update** | In API version `2026-06-01`, the backing storage reference and kind are immutable after creation. To use a different backend, create a new storage container and reference it in new project configurations. |
| **Delete** | Deleting a storage container removes the Discovery reference. **The underlying Azure Blob Storage account and its data are not deleted.** Delete child storage assets before deleting the parent container. |

> [!IMPORTANT]
> Deleting a storage container doesn't delete your data. The actual blobs remain in your Azure Storage account. Only the Discovery resource reference is removed.

## Networking considerations

The storage account backing a storage container must be network-accessible to the Discovery platform:

- The storage account must allow access from the **virtual network subnets** used by the supercomputer, workspace, and agents.
- If you restrict public access on the storage account, configure **virtual network rules** or **private endpoints** so the platform can reach it.
- For CORS requirements (needed for Discovery Studio file browsing), see [Azure Blob Storage in Microsoft Discovery](how-to-configure-project-storage.md#cors-configuration).

## Limitations

- In API version `2026-06-01`, the storage backend reference and kind are **immutable** after creation. Check the [versioned storage container reference](/azure/templates/microsoft.discovery/2026-06-01/storagecontainers) when using other API versions.
- A storage container can reference only one storage backend (storage account or NetApp volume). To access multiple backends, create multiple storage containers.
- A storage asset path can reference a file or a prefix containing multiple blobs.
- The consuming workload identities need the appropriate storage permissions before accessing data.

## Related content

- [Manage storage containers and storage assets](how-to-manage-storage-containers.md) - Step-by-step guide for creating, listing, and deleting storage containers and assets.
- [Azure Blob Storage in Microsoft Discovery](how-to-configure-project-storage.md) - Storage account prerequisites including networking, CORS, and identity access.
- [Files and storage assets](concept-files-storage-assets.md) — How agents produce and consume files during investigations.
- [Managed identities in Microsoft Discovery](concept-managed-identities.md) - Identity requirements for storage access.
