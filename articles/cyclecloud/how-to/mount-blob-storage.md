---
title: Mount Azure Blob Storage on cluster nodes
description: Learn how to give Azure CycleCloud compute nodes high-throughput access to an Azure Blob Storage container by mounting it with BlobFuse2 through cloud-init.
author: padmalathas
ms.author: padmalathas
ms.date: 07/30/2026
ms.topic: how-to
ms.service: azure-cyclecloud
monikerRange: '>= cyclecloud-8'
# Customer intent: As an HPC or AI cluster administrator, I want to mount an Azure Blob Storage container on my CycleCloud compute nodes, so that jobs can read large datasets directly from Blob at high throughput without a separate parallel file system.
---

# Mount Azure Blob Storage on cluster nodes

Many AI and HPC workloads read large datasets - training data, simulation inputs, or genomic files - that already live in Azure Blob Storage. You can give your Azure CycleCloud compute nodes direct, high-throughput access to a Blob container by mounting it with [BlobFuse2](/azure/storage/blobs/blobfuse2-what-is), the Azure Storage FUSE driver. Each node mounts the container as a local directory, so jobs read blobs through standard file operations.

This article shows how to install and mount BlobFuse2 on cluster nodes by using [cloud-init](cloud-init.md), which runs before CycleCloud configures the node. For the full set of BlobFuse2 configuration and authentication options, see the [BlobFuse2 documentation](/azure/storage/blobs/blobfuse2-what-is).

> [!NOTE]
> This article covers mounting Blob as workload *data* storage on compute nodes. It's different from CycleCloud [blobs and lockers](storage-blobs.md), which CycleCloud uses internally to distribute project binaries and specs.

## Choose a data transfer mode

BlobFuse2 offers two modes. Choose based on your data:

- **Streaming (block cache)** streams data in blocks and is designed for **large files**, such as AI/ML training datasets, genomic sequencing, and HPC simulation data. Use streaming mode for most high-throughput cluster workloads.
- **Caching (file cache)** downloads each whole file to a local cache before use. Use it for workloads that repeatedly access files that fit on the node's local disk.

For a detailed comparison and configuration parameters, see [Streaming versus caching mode for BlobFuse mounts](/azure/storage/blobs/blobfuse2-streaming-versus-caching).

## Prerequisites

- An Azure CycleCloud 8 installation and permission to edit cluster templates.
- An Azure Storage account with a blob container that holds your data.
- A managed identity that's assigned to the cluster nodes and granted a role such as **Storage Blob Data Reader** (read-only) or **Storage Blob Data Contributor** (read/write) on the storage account or container. For more information, see [Managed identities in CycleCloud](managed-identities.md).

## Mount a container with cloud-init

Add a `CloudInit` script to the node or node array that mounts the container. Cloud-init runs on first boot, before CycleCloud installs the scheduler, so the mount is ready when jobs run.

The following cluster template snippet installs BlobFuse2, writes a configuration file that authenticates with the node's managed identity, and mounts the container in streaming mode:

```ini
[[node defaults]]
CloudInit = '''#!/bin/bash
set -euo pipefail

# 1. Install BlobFuse2 (Ubuntu 22.04). For other distributions, see the BlobFuse2 docs.
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb
dpkg -i packages-microsoft-prod.deb
apt-get update && apt-get install -y blobfuse2

# 2. Create the mount point and a local cache directory.
MOUNT_DIR=/mnt/blobdata
CACHE_DIR=/mnt/blobfuse2-cache
mkdir -p "$MOUNT_DIR" "$CACHE_DIR"

# 3. Write a BlobFuse2 configuration that uses the node managed identity (mode: msi)
#    and enables streaming (block cache). Replace the account and container names.
#    For the complete schema and auth options - including the client or object ID of
#    a user-assigned identity - see:
#    https://learn.microsoft.com/azure/storage/blobs/blobfuse2-mount-container
cat > /etc/blobfuse2.yaml <<'EOF'
allow_other: true
components:
  - libfuse
  - block_cache
  - attr_cache
  - azstorage
block_cache:
  block-size-mb: 16
azstorage:
  type: block
  account-name: <your-storage-account>
  container: <your-container>
  mode: msi
EOF

# 4. Mount the container in streaming (block cache) mode.
blobfuse2 mount "$MOUNT_DIR" --config-file=/etc/blobfuse2.yaml
'''
```

CycleCloud waits for cloud-init to finish before it configures the node. After the cluster starts, jobs on those nodes read the container's blobs under the mount point (for example, `/mnt/blobdata`) as local files.

> [!IMPORTANT]
> CycleCloud doesn't merge cloud-init scripts. A script in `[[node defaults]]` is overwritten by a script on a child node. Apply the mount script on the specific node array that needs it, or merge scripts manually. For more information, see [How to use cloud-init with CycleCloud](cloud-init.md).

> [!TIP]
> Mount the container read-only when jobs only consume input data: grant only the **Storage Blob Data Reader** role and add `read-only: true` to the config. This prevents accidental writes and matches the streaming read path.

## Considerations

- **Per-node mount.** BlobFuse2 mounts on each node independently; it isn't a shared parallel file system. If you need a POSIX-compliant shared file system with cross-node coordination, use [Azure Managed Lustre](/azure/azure-managed-lustre/) or [Azure NetApp Files](/azure/azure-netapp-files/). For help choosing, see [Plan and size HPC clusters](../concepts/plan-and-size-hpc-clusters.md#choose-a-cluster-data-path).
- **Consistency.** BlobFuse2 isn't fully POSIX-compliant; for example, renames aren't atomic. Review the [BlobFuse2 and Linux file system comparison](/azure/storage/blobs/blobfuse2-compare-linux-file-system) before you use it for read/write workloads.
- **Local cache sizing.** Streaming mode caches blocks in memory and on local disk. Size the cache directory to the node's local NVMe or SSD.

## Related content

- [Streaming versus caching mode for BlobFuse mounts](/azure/storage/blobs/blobfuse2-streaming-versus-caching)
- [Mount an Azure Blob Storage container on Linux with BlobFuse](/azure/storage/blobs/blobfuse2-mount-container)
- [Plan and size HPC clusters](../concepts/plan-and-size-hpc-clusters.md)
- [How to use cloud-init with CycleCloud](cloud-init.md)
