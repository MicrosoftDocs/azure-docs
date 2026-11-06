---
title: Get started with distributed accelerator for cloud storage on AKS (preview)
titleSuffix: Azure Storage
description: Enable distributed accelerator for cloud storage through the AKS extension, authorize Azure Blob access, and verify that workload reads use DACS.
author: fhryo-msft
ms.service: azure-container-storage
ms.topic: quickstart
ms.date: 11/05/2026
ms.author: fryu
ms.custom: devx-track-azurecli
# Customer intent: "As an AKS administrator, I want to enable distributed accelerator for cloud storage and verify that my inference workload reads Azure Blob model data through the cache."
---

# Get started with distributed accelerator for cloud storage on AKS (preview)

This quickstart enables distributed accelerator for cloud storage (DACS) through its managed extension on an existing Azure Kubernetes Service (AKS) cluster, grants read access to an Azure Blob container, and verifies that repeated reads use the cache. The workload example uses the public `dacs-client==0.1.0` package.

> [!IMPORTANT]
> Distributed accelerator for cloud storage is in preview. Preview features are provided without a service-level agreement and aren't recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

Before you begin, you need:

- An Azure subscription.
- An existing AKS cluster that meets the [DACS preview support requirements](#dacs-preview-support-requirements).
- A Linux cache node pool with local NVMe data disks, such as the `Standard_L*s_v3` VM family.
- An Azure Storage account and Blob container containing representative model data.
- A Bash shell with Azure CLI, `kubectl`, and Docker or another container-image build tool. Run the commands in this quickstart in the same shell session so that the variables remain available.
- Permission to install AKS extensions, administer Kubernetes resources, update node-pool labels, and assign the storage data-access role used in this quickstart.
- A workload image with Python 3.8 or later and glibc 2.35 or later. This quickstart uses `python:3.12-slim-bookworm` and PyPI package `dacs-client==0.1.0` on x64 nodes.

Distributed accelerator for cloud storage doesn't use the cache node pool as persistent storage. Azure Blob Storage remains the source of truth.

### DACS preview support requirements

| Requirement | DACS preview support |
|---|---|
| Azure regions | All Azure public cloud regions. |
| AKS Kubernetes versions | 1.35 or later. |

## Set variables

Replace the placeholder values, and then run the following commands:

```azurecli
SUBSCRIPTION_ID=<subscription-id>
RESOURCE_GROUP=<resource-group>
CLUSTER_NAME=<aks-cluster-name>
CACHE_NODE_POOL=<nvme-node-pool>
STORAGE_ACCOUNT=<storage-account-name>
STORAGE_CONTAINER=<blob-container-name>
CACHE_NAMESPACE=dacs-cache-system
CACHE_NAME=cache-sample

az account set --subscription $SUBSCRIPTION_ID
az aks get-credentials \
  --resource-group $RESOURCE_GROUP \
  --name $CLUSTER_NAME
```

## Ensure AKS preview extension

DACS preview requires `aks-preview` version `22.0.0b9` or later. Install or upgrade the extension and the extensions used to manage and inspect DACS:

```azurecli
az extension add --name aks-preview --upgrade --yes
az extension show --name aks-preview --query version --output tsv
az extension add --name connectedk8s --upgrade --yes
az extension add --name k8s-extension --upgrade --yes
```

You don't need to connect the AKS cluster to Azure Arc. If you already installed a DACS controller manually, follow [Prepare for upgrades](manage-distributed-accelerator-for-cloud-storage.md#prepare-for-upgrades) before switching to the managed extension. Don't run two DACS controllers on the same cluster.

## Verify the cache node pool

Confirm that the selected node pool uses Linux and a VM size with local NVMe data disks:

```azurecli
az aks nodepool show \
  --resource-group $RESOURCE_GROUP \
  --cluster-name $CLUSTER_NAME \
  --name $CACHE_NODE_POOL \
  --query '{osType:osType,vmSize:vmSize,count:count,powerState:powerState.code}' \
  --output table
```

For distributed accelerator for cloud storage, use a dedicated cache node pool or confirm that other software doesn't claim or format the same local NVMe disks.

Label the cache node pool at the node-pool level so the label survives node replacement. If the pool already has custom labels, include them in the update to preserve them:

```azurecli
az aks nodepool update \
  --resource-group $RESOURCE_GROUP \
  --cluster-name $CLUSTER_NAME \
  --name $CACHE_NODE_POOL \
  --labels dacs.azure.com/processing-unit=cpu
```

> [!CAUTION]
> Enabling DACS installs a prerequisite DaemonSet that discovers, formats, and mounts local NVMe disks on labeled cache nodes. Label only nodes with disks dedicated to the cache.

## Enable distributed accelerator for cloud storage

Enable DACS by passing `distributedAccelerator` on its own. The uppercase `A` is required:

```azurecli
az aks update \
  --resource-group $RESOURCE_GROUP \
  --name $CLUSTER_NAME \
  --enable-azure-container-storage distributedAccelerator
```

The command installs the `distributedaccelerator` managed extension, the DACS controller and NVMe prerequisite DaemonSet in `kube-system`, and the `caches.storage.azure.com` custom resource definition (CRD). You don't install a separate prerequisite chart or manage the extension's Helm release yourself. Create a Cache resource separately as shown later.

## Verify the extension

```azurecli
az k8s-extension show \
  --cluster-type managedClusters \
  --cluster-name $CLUSTER_NAME \
  --resource-group $RESOURCE_GROUP \
  --name distributedaccelerator \
  --query '{extensionType:extensionType,provisioningState:provisioningState,currentVersion:currentVersion,releaseTrain:releaseTrain}' \
  --output table
```

Confirm that the extension type is `microsoft.distributedaccelerator` and the provisioning state is `Succeeded`. The installed server version is reported by `currentVersion`; don't infer it from the client package version or a public image tag.

Record that version for troubleshooting, then verify the controller and CRD:

```azurecli
DACS_VERSION=$(az k8s-extension show \
  --cluster-type managedClusters \
  --cluster-name $CLUSTER_NAME \
  --resource-group $RESOURCE_GROUP \
  --name distributedaccelerator \
  --query currentVersion --output tsv)

echo "$DACS_VERSION"
kubectl rollout status deployment/dacs-manager --namespace kube-system --timeout=5m
kubectl get crd caches.storage.azure.com
```

Continue only after the extension is in the `Succeeded` state and the controller is ready. If installation or readiness checks fail, see [Troubleshoot distributed accelerator for cloud storage](troubleshoot-distributed-accelerator-for-cloud-storage.md).

## Provision the cache

### Verify local NVMe preparation

The managed extension prepares local NVMe disks through its prerequisite DaemonSet. Don't deploy a duplicate disk-setup workload or install another prerequisite chart.

```bash
kubectl rollout status daemonset/dacs-prereq \
  --namespace kube-system --timeout=10m

kubectl get daemonset dacs-prereq --namespace kube-system
kubectl get pods --namespace kube-system --selector app.kubernetes.io/name=dacs-prereq --output wide
```

Confirm that the DaemonSet has a Ready pod on every labeled cache node. The mount point is `/var/lib/ssd/cacheserver` and must match the Cache resource's `spec.storage.hostPath.nodeCacheFolderPath`. If the DaemonSet is missing or isn't ready, stop and check the extension version and prerequisite pod events instead of installing a separate chart.

Create a dedicated namespace for the Cache and test workload:

```bash
kubectl create namespace "$CACHE_NAMESPACE"
```

### Create the Cache resource

Create the Cache resource. The example configures three cache servers, with one server per labeled NVMe node, and requires at least three eligible nodes. Adjust the server count, cache size, CPU, and memory to fit your node pool.

```bash
cat <<EOF | kubectl apply -f -
apiVersion: storage.azure.com/v1
kind: Cache
metadata:
  name: $CACHE_NAME
  namespace: $CACHE_NAMESPACE
spec:
  scaling:
    static:
      numServers: 3
  serverSizeInGB: 1000
  serverThreads: 80
  cpuLimit: 4
  memoryLimitMB: 32000
  port: 9065
  metricsPort: 9096
  nodeSelectorKey: dacs.azure.com/processing-unit
  nodeSelectorValue: cpu
  storage:
    hostPath:
      nodeCacheFolderPath: /var/lib/ssd/cacheserver
EOF
```

## Verify cache readiness

Wait for the named Cache resource rather than selecting the first cache in the cluster:

```bash
kubectl wait \
  --namespace $CACHE_NAMESPACE \
  --for=condition=Ready \
  cache/$CACHE_NAME \
  --timeout=10m

kubectl get cache,pods \
  --namespace $CACHE_NAMESPACE \
  --output wide
```

Verify that the current and desired cache-server counts match and that each cache-server pod is running on an NVMe node.

Get the discovery hostname used by workload clients:

```bash
CACHE_DISCOVERY_URL=$(kubectl get cache $CACHE_NAME \
  --namespace $CACHE_NAMESPACE \
  -o jsonpath='{.status.discoveryURL}')

echo $CACHE_DISCOVERY_URL
```

## Grant read access to model data

This quickstart uses the AKS kubelet managed identity. Get its object ID and the storage account resource ID:

```azurecli
KUBELET_OBJECT_ID=$(az aks show \
  --resource-group $RESOURCE_GROUP \
  --name $CLUSTER_NAME \
  --query identityProfile.kubeletidentity.objectId \
  --output tsv)

KUBELET_CLIENT_ID=$(az aks show \
  --resource-group $RESOURCE_GROUP \
  --name $CLUSTER_NAME \
  --query identityProfile.kubeletidentity.clientId \
  --output tsv)

STORAGE_ID=$(az storage account show \
  --resource-group $RESOURCE_GROUP \
  --name $STORAGE_ACCOUNT \
  --query id \
  --output tsv)
```

Assign the least-privilege read role at the container scope:

```azurecli
az role assignment create \
  --assignee-object-id $KUBELET_OBJECT_ID \
  --assignee-principal-type ServicePrincipal \
  --role "Storage Blob Data Reader" \
  --scope "$STORAGE_ID/blobServices/default/containers/$STORAGE_CONTAINER"
```

Role assignments can take several minutes to propagate. To use the kubelet identity, set all three managed-identity variables shown in the pod specification: `AZURE_CLIENT_ID`, `MSI_ENDPOINT`, and a nonempty `MSI_SECRET`. Setting only `AZURE_CLIENT_ID` isn't sufficient for this client configuration.

## Add the client to a workload image

Create a file named `Dockerfile` in your build directory with the following content. The distribution name is `dacs-client`, and the Python import namespace is `py_dacs_client`:

```dockerfile
FROM python:3.12-slim-bookworm
RUN python3 -m pip install --no-cache-dir "dacs-client==0.1.0"
```

Build and push the image to a registry that your AKS cluster can pull from. For Azure Container Registry (ACR), sign in before pushing and ensure that the kubelet identity has image-pull access. For a registry using **RBAC Registry Permissions**, grant `AcrPull` at the registry scope. For an ABAC-enabled registry, use the appropriate repository-reader role instead. For details, see [Authenticate with Azure Container Registry from Azure Kubernetes Service](/azure/aks/cluster-container-registry-integration).

```bash
WORKLOAD_IMAGE=<registry-name>.azurecr.io/dacs-test:0.1.0

docker build \
  --tag $WORKLOAD_IMAGE .
docker push $WORKLOAD_IMAGE
```

## Deploy a read-only test

Choose an existing model blob and set its path:

```bash
MODEL_BLOB=<path-to-model-blob>
```

Create a test pod. The pod reads up to 4 MiB from the blob five times, with a one-second interval between reads, and verifies that all reads return the same SHA-256 checksum. Cache population is asynchronous, so an immediate second read can miss the cache. The intervals give background uploads time to complete; use the client metrics and server counters to confirm cache hits rather than assuming a particular read is a hit. To compare server counters, capture a baseline before creating the pod by following [Verify the DACS request path](#verify-the-dacs-request-path).

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: dacs-test
  namespace: $CACHE_NAMESPACE
spec:
  restartPolicy: Never
  containers:
    - name: test
      image: $WORKLOAD_IMAGE
      env:
        - name: CACHE_DISCOVERY_URL
          value: "$CACHE_DISCOVERY_URL"
        - name: CACHE_SERVER_PORT
          value: "9065"
        - name: DACS_CPU_CORES
          value: "2"
        - name: DACS_MEMORY_MB
          value: "512"
        - name: AZURE_CLIENT_ID
          value: "$KUBELET_CLIENT_ID"
        - name: MSI_ENDPOINT
          value: "http://169.254.169.254/metadata/identity/oauth2/token"
        - name: MSI_SECRET
          value: "required-nonempty-value"
        - name: MODEL_PATH
          value: "az://$STORAGE_ACCOUNT.blob.core.windows.net/$STORAGE_CONTAINER/$MODEL_BLOB"
      command: ["python3", "-c"]
      resources:
        requests:
          cpu: "1"
          memory: 512Mi
        limits:
          cpu: "2"
          memory: 1Gi
      args:
        - |
          import asyncio
          import ctypes
          import hashlib
          import os
          import time

          from py_dacs_client.dacs_client import DACSCacheClient
          from py_dacs_client.dacs_utils import BoundedBufferManager

          async def main():
              path = os.environ["MODEL_PATH"]
              client = DACSCacheClient()
              buffers = BoundedBufferManager(max_memory_limit=64 * 1024 * 1024)
              try:
                  size = min(await client.get_file_size(path), 4 * 1024 * 1024)
                  if size == 0:
                      raise ValueError("Choose a nonempty model blob")
                  first_digest = None
                  for attempt in range(1, 6):
                      start = time.perf_counter()
                      buffer = await buffers.acquire_buffer(size)
                      try:
                          count = await client.read_blob(path, buffer, size, 0)
                          if count != size:
                              raise RuntimeError(f"Expected {size} bytes, received {count}")
                          digest = hashlib.sha256(ctypes.string_at(buffer, count)).hexdigest()
                          if first_digest is not None and digest != first_digest:
                              raise RuntimeError("Repeated reads returned different data")
                          first_digest = digest
                      finally:
                          await buffers.release_buffer(buffer)
                      elapsed = time.perf_counter() - start
                      print(f"read {attempt}: {count} bytes in {elapsed:.3f}s; sha256={digest}")
                      if attempt < 5:
                          await asyncio.sleep(1)
              finally:
                  await client.shutdown()

          asyncio.run(main())
EOF

kubectl wait \
  --namespace "$CACHE_NAMESPACE" \
  --for=jsonpath='{.status.phase}'=Succeeded \
  pod/dacs-test \
  --timeout=5m

kubectl logs dacs-test --namespace "$CACHE_NAMESPACE"
```

## Verify the DACS request path

A successful read or a faster second read alone isn't proof that the request reached DACS because the client can fall back to Azure Blob Storage. Set both `CACHE_DISCOVERY_URL` and `CACHE_SERVER_PORT`. If either is missing, the client logs `Cache not configured. Working in Remote Blob mode only.`

Inspect the pod logs for the client shutdown metrics `cache_client_download_cache_hits` and `cache_client_download_cache_misses`. A nonzero cache-hit count indicates that a request was served from cache. Client counters can include internal requests and don't necessarily equal the number of application reads.

Also compare cache-server request counters before and after running the test. Check every cache-server pod because the request might be served by any server, not necessarily the first pod. To inspect one server:

```bash
CACHE_POD=$(kubectl get pods \
  --namespace $CACHE_NAMESPACE \
  --selector app=cacheserver \
  -o jsonpath='{.items[0].metadata.name}')

kubectl port-forward \
  --namespace $CACHE_NAMESPACE \
  pod/$CACHE_POD 9096:9096
```

In another terminal, retrieve the metrics and inspect the request counter:

```bash
curl --fail --silent --show-error http://localhost:9096/metrics > dacs-metrics.txt
grep '^cache_server_request_counter' dacs-metrics.txt
```

Confirm an increase in download requests with `request_type="Download"` and `status="Success"`, not merely the presence of a counter series, which can exist at zero. Label values are case-sensitive. Stop the port-forward and repeat for other cache-server pods as needed. Correlate client cache-hit metrics with server counters and Azure Blob telemetry to distinguish cache hits, origin traffic, and fallback behavior.

For the complete metric reference and scrape configuration, see [Monitor distributed accelerator for cloud storage](monitor-distributed-accelerator-for-cloud-storage.md).

## Clean up the test

```bash
kubectl delete pod dacs-test --namespace "$CACHE_NAMESPACE"
```

If you no longer need the cache, delete the Cache resource while the controller is running:

```bash
kubectl delete cache "$CACHE_NAME" --namespace "$CACHE_NAMESPACE" --wait=true
kubectl get cache -A
```

Delete the namespace only if it was dedicated to this quickstart and contains no resources you need to keep:

```bash
kubectl delete namespace "$CACHE_NAMESPACE"
```

After removing all Cache resources and dependent workloads, disable the managed extension:

```azurecli
az aks update \
  --resource-group $RESOURCE_GROUP \
  --name $CLUSTER_NAME \
  --disable-azure-container-storage distributedAccelerator
```

Disabling DACS removes its managed extension, controller, and prerequisite DaemonSet but retains the Cache CRD. Don't delete the managed prerequisites separately, uninstall the extension's Helm release directly, or delete the CRD manually. Remove any role assignment or node-pool label added solely for this quickstart only after confirming that no other workload needs it.

For more information, see [Remove distributed accelerator for cloud storage](remove-container-storage.md#remove-distributed-accelerator-for-cloud-storage).

## Next steps

- [Use distributed accelerator for cloud storage with BlobFuse2](use-distributed-accelerator-for-cloud-storage-blobfuse2.md).
- [Use distributed accelerator for cloud storage with the Python client](use-distributed-accelerator-for-cloud-storage-python.md).
- [Manage distributed accelerator for cloud storage](manage-distributed-accelerator-for-cloud-storage.md).
- [Monitor distributed accelerator for cloud storage](monitor-distributed-accelerator-for-cloud-storage.md).
- [Troubleshoot distributed accelerator for cloud storage](troubleshoot-distributed-accelerator-for-cloud-storage.md).