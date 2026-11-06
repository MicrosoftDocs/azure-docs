---
title: What is distributed accelerator for cloud storage? (preview)
titleSuffix: Azure Storage
description: Learn how distributed accelerator for cloud storage caches Azure Blob data on AKS to accelerate model loading for inference and dataset reads for training.
author: fhryo-msft
ms.service: azure-container-storage
ms.topic: overview
ms.date: 10/31/2026
ms.author: fryu
# Customer intent: "As an AI platform operator, I want to understand whether distributed accelerator for cloud storage can reduce model-loading delays for my AKS inference workloads."
---

# What is distributed accelerator for cloud storage? (preview)

Distributed accelerator for cloud storage (DACS) is a distributed, read-through cache that accelerates model loading from Azure Blob Storage for AI inference on Azure Kubernetes Service (AKS). It uses local NVMe disks across cache nodes to keep frequently read data close to GPU compute. DACS can also accelerate dataset loading for training workloads that repeatedly read the same data. Azure Blob Storage remains the durable and authoritative source for model files and datasets.

You enable and manage DACS through Azure Container Storage, which installs the DACS managed extension and handles its lifecycle on AKS. DACS isn't a persistent volume, a StorageClass, or a replacement for Azure Blob Storage. To create Kubernetes persistent volumes, see [What is Azure Container Storage?](container-storage-introduction.md)

> [!IMPORTANT]
> DACS is in preview. Preview features are provided without a service-level agreement and aren't recommended for production workloads. Some features might be limited or unsupported. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## When to use distributed accelerator for cloud storage

DACS is designed for read-intensive AI inference workloads that repeatedly load the same model data from Azure Blob Storage. Consider DACS when your workload has one or more of these characteristics:

- Inference pods wait for large model files before they can serve requests.
- Adding GPU nodes causes repeated downloads of model data.
- Pod restarts, node replacement, or rolling upgrades repeatedly retrieve the same model data.
- Multiple inference workloads reuse a working set of model files stored in Azure Blob Storage.
- The AKS cluster has a Linux node pool with local NVMe disks that you can dedicate to cache servers.

For training, consider DACS when workers reuse dataset portions across epochs or jobs. Cache benefits depend on data reuse, working-set size, and whether reads encounter a cold or warm cache.

DACS supports clusters with up to 100 nodes. It doesn't provide persistent storage for training outputs or checkpoints. KV cache, container image cache, general-purpose shared-file access, and non-Azure Blob origins aren't part of this preview.

## How distributed accelerator for cloud storage works

DACS adds a cluster-local NVMe cache tier that workloads access through a supported client integration. The client can read Azure Blob Storage directly on cache misses or when falling back.

:::image type="content" source="media/distributed-accelerator-for-cloud-storage/distributed-accelerator-for-cloud-storage-architecture.svg" alt-text="Architecture diagram showing an AKS workload client reading cache hits from distributed NVMe servers, reading Blob Storage on misses or fallback, and populating the cache. A separate managed controller reconciles Cache resources.":::

### Read path

1. An application requests a model-data range through a supported DACS integration.
1. The client discovers the cache servers and determines which server owns the requested chunk.
1. On a cache hit, the client reads the chunk from the owning cache server's NVMe.
1. On a cache miss, the client reads the chunk from Azure Blob Storage and populates the cache asynchronously. The read can finish before population completes, so an immediate repeated read can also miss.
1. If the cache is unavailable, the client falls back to Azure Blob Storage.

Model data is divided into chunks and distributed across cache servers. A consistent-hash ring maps chunks to servers without a centralized data-path dependency. Cache servers can transfer data over Ethernet or InfiniBand, depending on the selected Azure virtual machine (VM) size and cluster topology.

### Managed deployment

Enable DACS through Azure Container Storage by using Azure CLI with the `distributedAccelerator` value. This step installs the separate `distributedaccelerator` managed extension. The extension deploys the DACS controller and NVMe prerequisite DaemonSet in `kube-system` and registers the Cache custom resource definition. The prerequisites discover, format, and mount local NVMe disks on labeled cache nodes. Use disks dedicated to the cache; don't install a separate prerequisite chart. The extension doesn't create cache-server pods automatically.

After verifying that the managed NVMe prerequisites are ready on every labeled cache node, create a Cache resource to define server count, capacity, resource limits, and eligible nodes. The controller reconciles the cache-server pods and publishes discovery information for clients. The controller manages resources; it isn't a proxy for application data reads. See the [quickstart](distributed-accelerator-for-cloud-storage-quickstart.md) for installation and cache provisioning.

> [!NOTE]
> Concurrent clients can independently retrieve the same missing data when the cache is cold. Coordinated cold-cache population isn't available in this preview. Use prefetch to populate selected model data before inference pods start.

## Key benefits

- **Faster warm-model loading:** Serve frequently read model chunks from local or peer NVMe instead of repeatedly retrieving them from Azure Blob Storage.
- **Faster scale-out and recovery:** Let new or replacement nodes reuse model data already cached in the cluster.
- **Reduced repeated Blob reads:** Keep the active model working set in the cache and use prefetch before planned scale events.
- **Range-based caching:** Cache only the chunks that cover requested byte ranges instead of materializing every model file in full.
- **Flexible application integration:** Use BlobFuse2, the native Python client, or Run:ai Model Streamer to connect the workload to the cache.
- **Safe fallback:** Keep Azure Blob Storage as the durable source of truth when data isn't cached or the cache is unavailable.

## Client integrations

The amount of application change depends on the integration:

| Integration | Use when | Application change |
|---|---|---|
| BlobFuse2 through the Azure Blob CSI driver | Your application reads Blob data through Linux file-system paths. | Configure a read-only BlobFuse2 volume; keep existing file-reading code. |
| Native Python client | You want explicit synchronous or asynchronous cache operations. | Import and call the DACS client. |
| Run:ai Model Streamer | Your application uses Run:ai Model Streamer to load model data. | Configure the DACS integration for the model-loading workflow. |

For file-system setup and measured Standard storage results, see [Use distributed accelerator for cloud storage with BlobFuse2](use-distributed-accelerator-for-cloud-storage-blobfuse2.md). For Python client setup and examples, see [Use distributed accelerator for cloud storage with the Python client](use-distributed-accelerator-for-cloud-storage-python.md).

Direct Hugging Face origin access isn't supported. Place the model data in Azure Blob Storage before using distributed accelerator for cloud storage.

## Cache semantics

Understand these behaviors before you deploy distributed accelerator for cloud storage:

- **Durability:** Cached data is ephemeral and isn't replicated for durability. Losing a cache node can remove the chunks stored on that node; missing data is retrieved again from Azure Blob Storage.
- **Source of truth:** Azure Blob Storage remains authoritative. Don't use DACS as the only copy of model files or datasets. Prefer immutable, versioned Blob paths for model upgrades.
- **Eviction:** The cache evicts data when capacity thresholds are reached. Evicted data is retrieved again on demand.
- **Fallback:** Missing discovery configuration or an unavailable cache can cause the client to read directly from Azure Blob Storage. Verify client cache hits and successful server request counter increases rather than treating a successful Blob read as proof of caching. See [Verify the DACS request path](distributed-accelerator-for-cloud-storage-quickstart.md#verify-the-dacs-request-path).
- **Identity:** Workloads use Microsoft Entra identities or a shared access signature (SAS) to access Azure Blob Storage. Use the least-privilege role required by the workload.
- **Networking:** Cache traffic remains within the AKS network. Access to the Azure Blob endpoint must be allowed for cache misses and fallback.
- **Trust boundary:** Use DACS within a trusted cluster. The cache doesn't isolate mutually untrusted tenants.

## Open-source project

DACS is an open-source project developed through collaboration between Azure AI Platform and Azure Storage. The project makes its cache implementation available for inspection, experimentation, and community contributions to reduce repeated data reads without replacing durable storage.

The [Azure DACS repository](https://github.com/Azure/dacs) includes the cache server, a native C/C++ client, Python adapters, a Rust wrapper, Kubernetes charts and controller, and deployment examples. Consult the repository README for open-source compatibility and configuration guidance, and use its contribution guidance to share reproducible issues, workload measurements, and improvements.

The open-source project and the Azure-managed preview have different deployment and support scopes. For the managed AKS experience, follow the [Azure quickstart](distributed-accelerator-for-cloud-storage-quickstart.md); repository deployment options aren't automatically supported features of the managed release.

## Preview support and limitations

The following table summarizes the initial preview scope.

| Area | Preview scope |
|---|---|
| Orchestrator | AKS |
| Workload | Primarily inference model loading; repeated dataset reads for training |
| Origin | Azure Blob Storage |
| Cache media | Local NVMe on Linux cache nodes |
| Scale | Up to 100 nodes |
| CPU architecture | x64 and Arm64 |
| Network | Ethernet; InfiniBand on supported VM sizes |
| Warm-up | On-demand population and prefetch |
| Cold-read coordination | Concurrent cold reads aren't coordinated |
| Installation | Separate DACS managed extension enabled through Azure CLI |
| Upgrade | Release-specific compatibility and upgrade guidance apply |
| Price | No DACS software charge; Azure VM, Blob Storage, and networking charges still apply |

## When to use another storage option

Use another Azure storage option when your workload needs capabilities outside the DACS scope:

- For Kubernetes persistent volumes on local NVMe, see [Use Azure Container Storage with local NVMe](use-container-storage-with-local-disk.md).
- For durable block volumes, see [Use Azure Container Storage with Elastic SAN](use-container-storage-with-elastic-san.md).
- For a managed parallel file system, see [What is Azure Managed Lustre?](/azure/azure-managed-lustre/amlfs-overview).
- For direct object access without a distributed cache, use an [Azure Blob Storage client library](../blobs/storage-blobs-introduction.md#move-data-to-blob-storage).

## Next steps

- [Get started with distributed accelerator for cloud storage on AKS](distributed-accelerator-for-cloud-storage-quickstart.md).
- [Use distributed accelerator for cloud storage with BlobFuse2](use-distributed-accelerator-for-cloud-storage-blobfuse2.md).
- [Use distributed accelerator for cloud storage with the Python client](use-distributed-accelerator-for-cloud-storage-python.md).
- [Manage distributed accelerator for cloud storage](manage-distributed-accelerator-for-cloud-storage.md).
- [Monitor distributed accelerator for cloud storage](monitor-distributed-accelerator-for-cloud-storage.md).
- [Troubleshoot distributed accelerator for cloud storage](troubleshoot-distributed-accelerator-for-cloud-storage.md).