---
title: Use distributed accelerator for cloud storage with the Python client (preview)
titleSuffix: Azure Storage
description: Install and configure the native Python client for distributed accelerator for cloud storage to read Azure Blob data.
author: fhryo-msft
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 11/05/2026
ms.author: fryu
# Customer intent: "As an AI application developer, I want to use distributed accelerator for cloud storage with the Python client so that repeated model reads are served from distributed NVMe."
---

# Use distributed accelerator for cloud storage with the Python client (preview)

Distributed accelerator for cloud storage (DACS) provides a native Python client for reading Azure Blob data through the distributed cache.

Complete [Get started with distributed accelerator for cloud storage on AKS](distributed-accelerator-for-cloud-storage-quickstart.md) before using this article.

## Install the native Python client

Install the package from PyPI in your workload image:

```bash
python3 -m pip install "dacs-client==0.1.0"
```

If you're updating an existing workload, update the package pin in its image build definition, rebuild and push the image, and redeploy the workload pods with the updated image. Installing the package locally doesn't update running containers. For image build and push commands, see [Add the client to a workload image](distributed-accelerator-for-cloud-storage-quickstart.md#add-the-client-to-a-workload-image).

The package requires Python 3.8 or newer and a Linux environment with glibc 2.35 or newer. It provides self-contained `manylinux_2_35` wheels for x86-64 and arm64, including the native library and its shared-library dependencies. The `azure-identity` dependency installs automatically.

The quickstart uses Python 3.12 on `python:3.12-slim-bookworm` with x86-64 nodes.

Verify the installation inside the workload container:

```bash
python3 -c "import importlib.metadata; import py_dacs_client; print(importlib.metadata.version('dacs-client'))"
```

The command must print `0.1.0`. The distribution name is `dacs-client`, but the Python import name is `py_dacs_client`.

## Configure the client

Set both cache-discovery variables on every pod that uses distributed accelerator for cloud storage:

```yaml
env:
  - name: CACHE_DISCOVERY_URL
    value: <discovery-service-hostname>
  - name: CACHE_SERVER_PORT
    value: "9065"
```

> [!IMPORTANT]
> Both variables are required. If either is missing, the client logs `Cache not configured. Working in Remote Blob mode only.` and accesses Azure Blob Storage directly. The operation can succeed without using the cache.

Use the discovery service hostname for your Cache resource and namespace, for example, `cache-sample-discovery.<namespace>.svc.cluster.local`, with port `9065`.

Configure Blob authentication before creating the client. The following example uses the AKS kubelet managed identity through the node's Instance Metadata Service (IMDS), not federated AKS workload identity. Set `AZURE_CLIENT_ID` to the kubelet identity's client ID:

```yaml
env:
  - name: AZURE_CLIENT_ID
    value: <kubelet-identity-client-id>
  - name: MSI_ENDPOINT
    value: "http://169.254.169.254/metadata/identity/oauth2/token"
  - name: MSI_SECRET
    value: "required-nonempty-value"
```

The Pod must be able to reach IMDS. For this native-client configuration, `MSI_SECRET` is a required nonempty compatibility marker, not a real secret or credential. Don't put a credential in that value. These settings are specific to this integration; don't copy them into the [Run:ai authentication configuration](use-distributed-accelerator-for-cloud-storage-model-streamer.md#configure-blob-authentication).

For read-only inference, grant the kubelet identity the **Storage Blob Data Reader** role scoped to the model container. See [Grant read access to model data](distributed-accelerator-for-cloud-storage-quickstart.md#grant-read-access-to-model-data). Use **Storage Blob Data Contributor** only when the application must write data. A separate uploader's write permission isn't needed for runtime reads.

Use this canonical path format:

```text
az://<account>.blob.core.windows.net/<container>/<path>
```

The native layer reads configuration when the first client is created in a process. Configure the environment and client settings before creating that client. Later clients don't change the native configuration already in effect.

## Understand cache misses and concurrent reads

When multiple clients request the same missing data at the same time, each client can independently retrieve the data from Azure Blob Storage. Coordinated cold-cache population isn't available in this preview.

Cache population is asynchronous. A read can finish before its data is available from the cache, so two immediate reads can both miss even when the returned bytes match.

Before large synchronized scale events, warm the selected model blobs through DACS before starting inference replicas. Follow [Prefetch model data before deployment](manage-distributed-accelerator-for-cloud-storage.md#prefetch-model-data-before-deployment) for a dedicated warm-up pod, read commands, and rollout verification.

A successful read can come from Azure Blob Storage fallback. To verify that reads use DACS:

1. Before reading, record `cache_server_request_counter{request_type="Download",status="Success"}`, summed across all cache-server pods for your Cache resource. Label values are case-sensitive.
1. Read the same blob range repeatedly with a delay between reads. The quickstart uses five reads spaced one second apart; this sequence doesn't guarantee that population has completed. Confirm that the successful server Download count increases and that the client reports cache hits. Check the returned byte counts and checksums for data integrity; faster timing alone isn't proof of caching.
1. Correlate client and server metrics with Azure Blob telemetry to distinguish cache traffic from origin reads and fallback.

For commands to collect client metrics and server counters, see [Verify the DACS request path](distributed-accelerator-for-cloud-storage-quickstart.md#verify-the-dacs-request-path).

## Use the native client

The native client provides asynchronous methods and synchronous counterparts. It reads into preallocated native buffers. Set `MODEL_PATH` to the canonical `az://` path of an existing model shard before running the following example, which reads up to the first 4 MiB:

```python
import asyncio
import os

from py_dacs_client.dacs_client import DACSCacheClient
from py_dacs_client.dacs_utils import BoundedBufferManager


async def main():
    path = os.environ["MODEL_PATH"]
    client = DACSCacheClient()
    buffers = BoundedBufferManager(max_memory_limit=64 * 1024 * 1024)

    try:
        size = min(await client.get_file_size(path), 4 * 1024 * 1024)
        if size == 0:
            print("read 0 bytes")
            return

        buffer = await buffers.acquire_buffer(size)
        try:
            bytes_read = await client.read_blob(path, buffer, size, 0)
            print(f"read {bytes_read} bytes")
        finally:
            await buffers.release_buffer(buffer)
    finally:
        await client.shutdown()


asyncio.run(main())
```

Common read methods include:

| Async method | Synchronous method | Description |
|---|---|---|
| `get_file_size(path)` | `get_file_size_sync(path)` | Get the blob size in bytes. |
| `get_file_stat(path)` | `get_file_stat_sync(path)` | Get model-file metadata. |
| `read_blob(path, buffer, size, offset)` | `read_blob_sync(...)` | Read a byte range into a preallocated buffer. |
| `list_dir(path)` | `list_dir_sync(path)` | List directory entries. |
| `get_file_handle(path, flags)` | `get_file_handle_sync(...)` | Open a reusable handle. |
| `release_file_handle(handle)` | `release_file_handle_sync(handle)` | Close a reusable handle. |
| `shutdown()` | `shutdown_sync()` | Release connections and emit final metrics. |

The asynchronous `list_dir(path)` method returns an iterator; use `async for` to consume directory entries.

Use range reads for model formats that don't need every byte. Distributed accelerator for cloud storage stores only the chunks that cover requested ranges.

## Optimize read performance

Tune application read concurrency and requested byte-range size together. The best settings depend on your access pattern, pod CPU and memory limits, client and cache-node network bandwidth, and whether reads hit the cache or fall back to Blob Storage.

Use the values in this section as starting points for workload benchmarks, not guaranteed performance recommendations. Measure their effect with your own workload before deploying changes.

### Adjust concurrency

Concurrency is the number of reads your application keeps in flight. A loop that awaits each `read_blob` call before starting the next is sequential, even when it uses the asynchronous API.

- Issue independent byte-range or blob reads concurrently. Bound the number of active reads with an `asyncio.Semaphore` or a fixed number of worker tasks. Don't create a task for every range of a large dataset at once.
- Start with a small limit, such as four concurrent reads, and compare it with eight and 16. Increase concurrency only while throughput improves without unacceptable latency, memory use, errors, or throttling.
- The native client accepts a `concurrent.futures.Executor` through its `executor` constructor parameter. To control the Python thread pool explicitly, pass a `ThreadPoolExecutor`, for example, `DACSCacheClient(executor=ThreadPoolExecutor(max_workers=8))`. Retain a reference to the executor, keep it alive until all reads finish, and shut it down after calling `await client.shutdown()`.
- A larger thread pool doesn't make sequential calls concurrent. Bound application tasks as well as executor workers, and use a separate buffer for each active read.

Account for concurrency across all worker processes and pods. Increasing each pod's concurrency during a scale-out can overload the same cache nodes or increase duplicate Blob downloads on cold-cache misses.

### Configure cache-chunk size

Set `SI_streamingChunkSize` in bytes on application pods to configure the cache-chunk size. For example, the following setting uses 3-MiB chunks:

```yaml
env:
  - name: SI_streamingChunkSize
    value: "3145728"
```

Set this variable before creating the first client in a process. Restart application pods after changing it.

The default cache-chunk size is 32 MiB. The `size` argument to `read_blob(path, buffer, size, offset)` specifies the application's requested byte range, not the cache-chunk size.

| Access pattern | Application read guidance |
|---|---|
| Large sequential model reads | Compare larger cache chunks, requested range sizes, and bounded concurrency. Change one setting at a time. |
| Small or random reads | Request only the bytes the application needs. Compare smaller cache chunks to reduce data fetched outside the requested range. |
| Capacity-constrained caches | Measure cache occupancy and eviction behavior rather than estimating cache use from application read-buffer sizes alone. |

Budget application read buffers separately from cache chunks. For example, eight concurrent 4-MiB `read_blob` requests require 32 MiB of application read-buffer capacity, regardless of the configured cache-chunk size. Reserve additional pod memory for native-client allocations, queued work, Python objects, and model processing. Acquire buffers only after entering the concurrency limit, and release each buffer in a `finally` block.

> [!WARNING]
> `BoundedBufferManager(max_memory_limit=...)` limits application read-buffer capacity, not total client memory or native upload buffering. In `0.1.0`, the native client's default asynchronous upload-buffer budget is 400 GiB. This budget isn't a preallocation or a safe Pod-memory limit. Large cold-cache reads can exhaust a smaller Pod. For memory-constrained workloads, test synchronous population (`SI_cacheEnableSyncUpload=true`) or a bounded asynchronous upload budget (`SI_cacheMaxUploadBufferSizePerProcessGB`). Set these values before creating the first client, and budget native buffers separately from application read buffers and model processing.

### Measure before increasing limits

1. Establish a baseline with a fixed dataset, pod count, and resource limits. Measure throughput, read latency, CPU, memory, and network use.
1. Benchmark cold-cache and warm-cache reads separately. Inspect `cache_server_request_counter` and Azure Blob telemetry to distinguish cache traffic from direct-Blob fallback.
1. Change one setting at a time: concurrency, application read size, or cache-chunk size. Keep the dataset and other settings consistent when comparing results.
1. Stop increasing a setting when throughput plateaus or latency, resource pressure, errors, or Blob throttling increase.

For cache-side observations, see [Monitor distributed accelerator for cloud storage](monitor-distributed-accelerator-for-cloud-storage.md).

## Handle errors

All DACS exceptions derive from `DACSError`:

```python
from py_dacs_client import DACSError, DACSNotFoundError

try:
    load_model_data()
except DACSNotFoundError:
    handle_missing_model()
except DACSError as error:
    handle_cache_or_storage_error(error)
```

| Exception | Meaning |
|---|---|
| `DACSNotFoundError` | The Blob path or directory doesn't exist. |
| `DACSExistsError` | An application tries to write to an existing blob without overwrite enabled. |
| `DACSAuthenticationError` | Credentials are missing or invalid. |
| `DACSPermissionError` | The identity lacks the required Blob role. |
| `DACSTimeoutError` | A cache or Blob operation timed out. |
| `DACSNetworkError` | The cache server or Blob endpoint is unreachable. |
| `DACSInvalidInputError` | A path or argument is malformed. |
| `OperationNotSupportedError` | The requested API isn't implemented yet. |

## Control logging

The client has separate logging controls for the Python and native layers. Set both variables to suppress verbose output from both layers:

```yaml
env:
  - name: DACS_DATA_LOG_LEVEL
    value: WARNING
  - name: STORAGE_LOG_LEVEL
    value: WARNING
```

`DACS_DATA_LOG_LEVEL` controls Python logging. `STORAGE_LOG_LEVEL` controls native client logging.

## Next steps

- [Manage distributed accelerator for cloud storage](manage-distributed-accelerator-for-cloud-storage.md).
- [Monitor distributed accelerator for cloud storage](monitor-distributed-accelerator-for-cloud-storage.md).
- [Troubleshoot distributed accelerator for cloud storage](troubleshoot-distributed-accelerator-for-cloud-storage.md).