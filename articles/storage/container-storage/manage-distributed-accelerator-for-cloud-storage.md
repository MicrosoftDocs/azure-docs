---
title: Manage distributed accelerator for cloud storage (preview)
titleSuffix: Azure Storage
description: Check cache health, plan capacity, prefetch model data, scale cache servers, and prepare for maintenance with distributed accelerator for cloud storage.
author: fhryo-msft
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 11/05/2026
ms.author: fryu
# Customer intent: "As an AKS administrator, I want to operate distributed accelerator for cloud storage so that inference and training workloads can reuse cached model files and datasets."
---

# Manage distributed accelerator for cloud storage (preview)

Use this article to check distributed accelerator for cloud storage (DACS) health, plan capacity, prefetch model data, scale cache servers, and prepare for maintenance. DACS primarily accelerates model loading for inference and can also accelerate repeated dataset reads for training.

## Before you begin

Set up DACS and a Cache resource by following [Get started with distributed accelerator for cloud storage on AKS](distributed-accelerator-for-cloud-storage-quickstart.md). Run the following commands in a Bash shell with `kubectl` configured for your AKS cluster.

Set the namespace and name of the cache you want to manage:

```bash
CACHE_NAMESPACE=<cache-namespace>
CACHE_NAME=<cache-name>
```

## Check DACS health

List Cache resources and their status:

```bash
kubectl get cache -A -o wide
```

A healthy Cache resource has these characteristics:

- The `Ready` condition is `True`.
- The current server count matches the desired server count.
- The discovery URL is populated.
- Every cache-server pod is Ready and scheduled on an eligible NVMe node.

Inspect a Cache resource and related events:

```bash
kubectl get cache "$CACHE_NAME" \
  --namespace "$CACHE_NAMESPACE" \
  -o yaml

kubectl get pods \
  --namespace "$CACHE_NAMESPACE" \
  --selector app=cacheserver \
  -o wide

kubectl get events \
  --namespace "$CACHE_NAMESPACE" \
  --sort-by='.lastTimestamp'
```

## Plan capacity

Size the cache for the active working set, not the total size of every model or dataset in Azure Blob Storage. For inference, account for models loaded during startup and scale-out. For training, account for dataset portions that workers repeatedly read across epochs or jobs. Include headroom for new model versions, dataset changes, and eviction.

Consider these inputs:

- Active model or dataset bytes and expected version overlap.
- Number and size of local NVMe disks per cache node.
- Number of cache nodes and their network egress bandwidth.
- Number of concurrent inference readers or training workers.
- Expected warm-hit ratio and Blob-fallback rate.
- Failure tolerance when a cache node is replaced.

Distributed accelerator for cloud storage supports up to 100 nodes. More cache servers increase aggregate capacity and can increase fan-in bandwidth to a reader. The client and cluster network can become the limiting factors before NVMe throughput is exhausted.

> [!NOTE]
> Cached data is ephemeral and isn't replicated for durability. Keep authoritative model files and datasets in Azure Blob Storage. DACS doesn't provide persistent storage for training outputs or checkpoints.

## Plan for cold-cache reads

New cache servers start without cached data. Node replacement, eviction, and maintenance can also cause previously cached data to be read from Azure Blob Storage again. Plan deployments and scale events so that concurrent cold reads don't overload the storage account or network.

After starting workloads, use client cache-hit metrics and successful cache-server request counter increases to check that reads use DACS. Successful or faster reads alone aren't proof of caching because the client can fall back to Azure Blob Storage. For verification steps, see [Verify the DACS request path](distributed-accelerator-for-cloud-storage-quickstart.md#verify-the-dacs-request-path). For ongoing telemetry, see [Monitor distributed accelerator for cloud storage](monitor-distributed-accelerator-for-cloud-storage.md).

## Prefetch model data before deployment

Prefetch is an optional optimization for cold starts and model upgrades. Read the model data through DACS before starting inference replicas so that their first reads can use the shared cache. Applications can still read from Azure Blob Storage when the cache is cold; prefetch isn't required for correctness.

The following example uses client-driven warm-up: a Python process reads each model blob through the DACS client. It doesn't require a separate prefetch CLI command.

### Prepare the warm-up workload

1. Confirm that the Cache resource is ready and has enough capacity for the selected model files. For a model upgrade, ensure there's capacity for both the current and new versions during the rollout.
1. Upload the new model to a distinct, versioned Blob path, such as `models/my-model/v2/`. Keep the current version available until the rollout and rollback window are complete.
1. Build and push the client image and grant the kubelet identity Blob read access as described in the [quickstart](distributed-accelerator-for-cloud-storage-quickstart.md). The dedicated pod in the following section uses that image and identity; it doesn't use the quickstart's completed test pod.
1. Use the same cache-chunk configuration in the warm-up client and inference readers, including `SI_streamingChunkSize` if you override it. Different chunk sizes produce different cache entries, so warming one layout doesn't warm another. See [Configure cache-chunk size](use-distributed-accelerator-for-cloud-storage-python.md#configure-cache-chunk-size).
1. Select every blob needed to load the model, including all weight shards. Use a small number of warm-up workers initially to limit Blob traffic.

### Create a dedicated prefetch pod

In the same shell session, set the image built in the quickstart and the kubelet managed identity's client ID. The cluster must be able to pull the image. The pod stays available for one hour so that you can run and verify warm-up reads; delete it sooner when finished.

```bash
WORKLOAD_IMAGE=<registry-name>.azurecr.io/dacs-test:0.1.0
KUBELET_CLIENT_ID=<kubelet-managed-identity-client-id>
CLIENT_POD=dacs-prefetch
CACHE_DISCOVERY_URL=$(kubectl get cache "$CACHE_NAME" \
  --namespace "$CACHE_NAMESPACE" -o jsonpath='{.status.discoveryURL}')
CACHE_SERVER_PORT=$(kubectl get cache "$CACHE_NAME" \
  --namespace "$CACHE_NAMESPACE" -o jsonpath='{.spec.port}')

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: $CLIENT_POD
  namespace: $CACHE_NAMESPACE
spec:
  restartPolicy: Never
  activeDeadlineSeconds: 3600
  containers:
    - name: prefetch
      image: $WORKLOAD_IMAGE
      command: ["sleep", "3600"]
      env:
        - name: CACHE_DISCOVERY_URL
          value: "$CACHE_DISCOVERY_URL"
        - name: CACHE_SERVER_PORT
          value: "$CACHE_SERVER_PORT"
        - name: AZURE_CLIENT_ID
          value: "$KUBELET_CLIENT_ID"
        - name: MSI_ENDPOINT
          value: "http://169.254.169.254/metadata/identity/oauth2/token"
        - name: MSI_SECRET
          value: "required-nonempty-value"
        - name: DACS_CPU_CORES
          value: "2"
        - name: DACS_MEMORY_MB
          value: "512"
      resources:
        requests:
          cpu: "1"
          memory: 512Mi
        limits:
          cpu: "2"
          memory: 1Gi
EOF

kubectl wait --namespace "$CACHE_NAMESPACE" \
  --for=condition=Ready "pod/$CLIENT_POD" --timeout=5m
```

If inference readers override the cache-chunk size, add the same setting to this pod before creating it. For models that take longer than an hour to warm and verify, increase both the sleep duration and `activeDeadlineSeconds` before deployment.

### Read the selected model blobs

Set the full paths of the blobs to warm. Replace the example paths with your model files:

```bash
MODEL_BLOBS=(
  "az://<storage-account>.blob.core.windows.net/<container>/models/my-model/v2/model-00001.safetensors"
  "az://<storage-account>.blob.core.windows.net/<container>/models/my-model/v2/model-00002.safetensors"
)

kubectl exec --namespace "$CACHE_NAMESPACE" -i "$CLIENT_POD" -- \
  python3 - "${MODEL_BLOBS[@]}" <<'PY'
import asyncio
import os
import sys

from py_dacs_client.dacs_client import DACSCacheClient
from py_dacs_client.dacs_utils import BoundedBufferManager


async def main():
    for name in ("CACHE_DISCOVERY_URL", "CACHE_SERVER_PORT"):
        if not os.environ.get(name):
            raise RuntimeError(f"Set {name} in the client pod before warming data")
    client = DACSCacheClient()
    buffers = BoundedBufferManager(max_memory_limit=64 * 1024 * 1024)
    try:
        for path in sys.argv[1:]:
            size = await client.get_file_size(path)
            offset = 0
            while offset < size:
                length = min(4 * 1024 * 1024, size - offset)
                buffer = await buffers.acquire_buffer(length)
                try:
                    count = await client.read_blob(path, buffer, length, offset)
                    if count != length:
                        raise RuntimeError(
                            f"{path}: expected {length} bytes at {offset}, got {count}"
                        )
                finally:
                    await buffers.release_buffer(buffer)
                offset += count
            print(f"Read complete: {path} ({size} bytes)", flush=True)
    finally:
        await client.shutdown()


asyncio.run(main())
PY
```

This process reads each listed blob in full with bounded buffers. Unlike the quickstart's sample, it doesn't stop after the first 4 MiB. Repeat the command for additional groups of files as needed.

### Verify warming and roll out the model

1. Check that the command exits successfully for every selected blob. A read failure stops the example; resolve authentication, connectivity, or Blob path errors before retrying.
1. Repeat the reads and confirm cache hits by using [Verify the DACS request path](distributed-accelerator-for-cloud-storage-quickstart.md#verify-the-dacs-request-path). Successful reads alone don't prove the data is cached, and cache population might still be in progress when a read finishes.
1. Start a small number of inference replicas by using the same versioned Blob paths. Confirm that model loading succeeds and reads use the cache before scaling out.
1. For an upgrade, shift traffic to the new model only after application health checks pass. Keep the old model available for rollback.

Prefetch doesn't pin data or guarantee that it remains cached. Eviction, node replacement, or changes to the cache topology can require another warm-up. Monitor cache capacity and Blob traffic during the rollout.

After verification, delete the dedicated pod. This action doesn't remove the data cached on DACS servers.

```bash
kubectl delete pod "$CLIENT_POD" --namespace "$CACHE_NAMESPACE"
```

The Python example runs through `kubectl exec`, so capture its terminal output for read errors and shutdown metrics. The pod's main `sleep` process doesn't emit those messages.

## Check the cache storage configuration

The Cache resource specifies the cache server count, per-server capacity, resource limits, node selector, and cache data path. Inspect the current configuration before changing capacity:

```bash
kubectl get cache "$CACHE_NAME" \
  --namespace "$CACHE_NAMESPACE" \
  -o yaml
```

For the host-path configuration used in the quickstart, `spec.storage.hostPath.nodeCacheFolderPath` must match the mount point checked during [NVMe preparation verification](distributed-accelerator-for-cloud-storage-quickstart.md#verify-local-nvme-preparation). The path must resolve to dedicated local NVMe storage, not the OS disk. For the configuration example, see [Provision the cache](distributed-accelerator-for-cloud-storage-quickstart.md#provision-the-cache).

## Scale the cache

For the static scaling configuration used in the quickstart, change `spec.scaling.static.numServers` on the Cache resource, not on the extension.

Before increasing the count, add enough eligible NVMe nodes to the cache node pool. Ensure that new nodes have the required node-pool label and that their available CPU, memory, and disk capacity meet the Cache specification. The managed `dacs-prereq` DaemonSet prepares NVMe on matching nodes automatically. Don't install another prerequisite chart.

Verify that the DaemonSet has a Ready pod on every new cache node before increasing the server count:

```bash
kubectl rollout status daemonset/dacs-prereq --namespace kube-system --timeout=10m
kubectl get pods --namespace kube-system \
  --selector app.kubernetes.io/name=dacs-prereq --output wide
```

Only label nodes whose local NVMe disks are dedicated to DACS: prerequisite setup can format those disks. Keep the labels in the node-pool configuration so they survive node replacement.

Set the desired server count and update the Cache resource. Use a positive integer that fits the eligible node pool:

```bash
DESIRED_SERVERS=3

kubectl patch cache "$CACHE_NAME" \
  --namespace "$CACHE_NAMESPACE" \
  --type merge \
  --patch "{\"spec\":{\"scaling\":{\"static\":{\"numServers\":$DESIRED_SERVERS}}}}"
```

Check the desired and current server counts until they match, then verify readiness and pod placement:

```bash
kubectl get cache "$CACHE_NAME" --namespace "$CACHE_NAMESPACE" -o wide

kubectl wait \
  --namespace "$CACHE_NAMESPACE" \
  --for=condition=Ready \
  "cache/$CACHE_NAME" \
  --timeout=10m

kubectl get pods \
  --namespace "$CACHE_NAMESPACE" \
  --selector app=cacheserver \
  -o wide
```

The pod listing includes all cache servers in the namespace. If the namespace contains multiple Cache resources, use pod owner references to identify the servers for the cache you're changing. Confirm that its server count matches the requested count and that all its servers are Ready on eligible NVMe nodes before continuing.

To scale down, reduce the Cache server count and wait for reconciliation before removing eligible nodes. Plan for cache misses and extra Blob traffic when cached chunks are lost.

## Prepare for upgrades

Before changing versions:

1. Check the target release's compatibility requirements and supported upgrade path. Don't assume that arbitrary preview versions support in-place upgrades.
1. Record cache status, server count, capacity, the managed extension's `currentVersion`, and workload client versions. Retrieve extension details by following [Verify the extension](distributed-accelerator-for-cloud-storage-quickstart.md#verify-the-extension).
1. Check compatibility between the installed extension release, NVMe prerequisites, Cache configuration, and clients. A newer public chart or client package doesn't mean the managed extension has been updated.
1. Confirm that authoritative model files and datasets are available in Azure Blob Storage.
1. Schedule the upgrade during a period when cache repopulation won't overload the Blob account.

Manage the controller lifecycle through the DACS extension and follow its supported upgrade procedure for the target release. Don't upgrade the extension's underlying Helm release directly, install another controller alongside it, or apply persistent-volume driver upgrade instructions to DACS. Plan any migration from an existing manual installation separately.

After maintenance, confirm extension and controller readiness by following [Verify the extension](distributed-accelerator-for-cloud-storage-quickstart.md#verify-the-extension), then repeat the cache health checks in this article.

Don't rely on cached data surviving an upgrade. Allow for repopulation from Azure Blob Storage on subsequent reads.

## Remove DACS

Removing the cache doesn't delete source model files or datasets in Azure Blob Storage. Stop or reconfigure workloads that depend on the cache before removing it.

For the cleanup order and commands, see [Remove distributed accelerator for cloud storage](remove-container-storage.md#remove-distributed-accelerator-for-cloud-storage).

## Next steps

- [Monitor distributed accelerator for cloud storage](monitor-distributed-accelerator-for-cloud-storage.md).
- [Troubleshoot distributed accelerator for cloud storage](troubleshoot-distributed-accelerator-for-cloud-storage.md).
- [Use distributed accelerator for cloud storage with the Python client](use-distributed-accelerator-for-cloud-storage-python.md).