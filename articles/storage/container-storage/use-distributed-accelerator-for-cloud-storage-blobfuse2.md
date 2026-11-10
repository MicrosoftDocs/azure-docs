---
title: Use distributed accelerator for cloud storage with BlobFuse2 (preview)
titleSuffix: Azure Storage
description: Configure BlobFuse2 with distributed accelerator for cloud storage on AKS and review sequential and random-read performance on Standard_LRS storage.
author: wolfgang-desalvador
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 11/09/2026
ms.author: wdesalvador
ms.custom: devx-track-azurecli
# Customer intent: "As an AKS administrator, I want applications that read files to use BlobFuse2 with DACS so that repeated Blob reads reuse the distributed cache."
---

# Use distributed accelerator for cloud storage with BlobFuse2 (preview)

Use BlobFuse2 with distributed accelerator for cloud storage (DACS) to read Azure Blob data through Linux file-system paths. Applications keep their existing file-reading code, while BlobFuse2 serves cached data through DACS and retrieves missing data from Blob Storage.

The Azure Blob Container Storage Interface (CSI) driver mounts the container through a persistent volume (PV) and persistent volume claim (PVC). Azure Blob Storage remains the durable source of truth.

This article covers configuration, read-path verification, and [Standard storage benchmark results](#standard-storage-benchmark-results).

## Prerequisites

- An AKS cluster that meets the Azure region and Kubernetes version requirements in the [DACS quickstart](distributed-accelerator-for-cloud-storage-quickstart.md#dacs-preview-support-requirements).
- Linux cache nodes with local NVMe disks dedicated to DACS.
- Ubuntu Linux workload nodes for application pods that mount BlobFuse2.
- An Azure Blob container containing your application data.
- An existing user-assigned managed identity for Blob authentication.
- Azure CLI and `kubectl`.
- Permission to enable DACS and the managed Azure Blob CSI driver, create Kubernetes resources, manage the identity's federated credentials, and assign the required Blob data-access role.
- BlobFuse2 **2.5.6 or later** installed on every eligible Linux workload node. For distributed-cache support and limitations, see the [BlobFuse2 2.5.6 release notes](https://github.com/Azure/azure-storage-fuse/releases/tag/blobfuse2-2.5.6).
- AKS-managed Azure Blob CSI driver [`v1.27.11`](https://github.com/kubernetes-sigs/blob-csi-driver/releases/tag/v1.27.11) or later, with the AKS OIDC issuer and Microsoft Entra Workload ID enabled for token-only authentication.

> [!IMPORTANT]
> Use a read-only mount for each container. Verify DACS activity through cache-server metrics and BlobFuse2 logs.
> DACS treats the Kubernetes cluster as a single trust domain and doesn't provide tenant isolation. Don't use it in a multitenant cluster. Workload identity authorizes Blob Storage access; it doesn't isolate cached data. For more information, see the [DACS security model](https://github.com/Azure/dacs/blob/main/docs/security-model.md).

## Set variables

Run the commands in the same Bash session. Replace the placeholders with your cluster, storage container, and existing user-assigned managed identity:

```azurecli
SUBSCRIPTION_ID="<subscription-id>"
RESOURCE_GROUP="<aks-resource-group>"
CLUSTER_NAME="<aks-cluster-name>"
WORKLOAD_NODE_POOL="<blobfuse-ready-node-pool>"
STORAGE_RESOURCE_GROUP="<storage-resource-group>"
STORAGE_ACCOUNT="<storage-account-name>"
STORAGE_CONTAINER="<existing-container-name>"
IDENTITY_RESOURCE_GROUP="<managed-identity-resource-group>"
IDENTITY_NAME="<managed-identity-name>"
CACHE_NAMESPACE=dacs-cache-system
CACHE_NAME=cache-sample
WORKLOAD_NAMESPACE=blobfuse-dacs
SERVICE_ACCOUNT=blobfuse-reader

az account set --subscription "$SUBSCRIPTION_ID"
az aks get-credentials --resource-group "$RESOURCE_GROUP" --name "$CLUSTER_NAME"

BLOBFUSE_CLIENT_ID=$(az identity show \
  --resource-group "$IDENTITY_RESOURCE_GROUP" \
  --name "$IDENTITY_NAME" \
  --query clientId --output tsv)
```

## Install distributed accelerator for cloud storage

To install DACS, prepare dedicated cache disks, create a Cache resource, and verify readiness, see [Get started with distributed accelerator for cloud storage on AKS](distributed-accelerator-for-cloud-storage-quickstart.md).

Retrieve the discovery hostname for your ready Cache:

```bash
CACHE_DISCOVERY_HOST=$(kubectl get cache "$CACHE_NAME" \
  --namespace "$CACHE_NAMESPACE" \
  -o jsonpath='{.status.discoveryURL}')

test -n "$CACHE_DISCOVERY_HOST"
```

Use the hostname published by your Cache resource and its configured port. The quickstart uses port `9065`.

## Enable the Azure Blob CSI driver and verify BlobFuse2

Use the AKS-managed driver. Follow [Enable the Azure Blob CSI driver on AKS](/azure/aks/csi-storage-drivers#enable-azure-blob-storage-csi-storage-driver-on-an-existing-aks-cluster).

Use AKS to manage CSI driver upgrades. Ensure every eligible workload node runs BlobFuse2 **2.5.6 or later**, and coordinate package updates with volume unmounts.

### Verify the installed mount process

Check CSI readiness through the node DaemonSet.

```bash
kubectl get csidriver blob.csi.azure.com
kubectl rollout status daemonset/csi-blob-node \
  --namespace kube-system --timeout=10m
kubectl get pods --namespace kube-system \
  --selector app=csi-blob-node --output wide
kubectl get daemonset csi-blob-node --namespace kube-system \
  --output jsonpath='{range .spec.template.spec.containers[*]}{.name}{": "}{.image}{"\n"}{end}'
```

Confirm that the `blob` container image is version `v1.27.11` or later.

The CSI driver image version doesn't identify the BlobFuse2 version installed on the host. For each eligible Ubuntu node, select its `csi-blob-node` pod from the preceding output and verify the host binary used by the CSI proxy:

```bash
BLOB_CSI_POD="<csi-blob-node-pod-name>"

kubectl exec --namespace kube-system "$BLOB_CSI_POD" --container blob -- \
  nsenter --mount=/proc/1/ns/mnt -- /usr/bin/blobfuse2 --version

kubectl exec --namespace kube-system "$BLOB_CSI_POD" --container blob -- \
  nsenter --mount=/proc/1/ns/mnt -- /usr/bin/blobfuse2 mount --help
```

Confirm version **2.5.6 or later** and the `--distributed-cache-*` options used in the volume configuration in the following section.

### Update BlobFuse2 when the node image has an older version

If the host binary is missing or earlier than **2.5.6**, configure the managed CSI driver's `install-blobfuse-proxy` init container to install the required BlobFuse2 package. Skip this step when all eligible nodes already have version **2.5.6 or later**.

This update uses the package installer on Ubuntu nodes, which need access to the configured Ubuntu and Microsoft package repositories. It doesn't replace the managed CSI driver image or install a separate driver.

> [!IMPORTANT]
> The patch rolls out the `csi-blob-node` DaemonSet across the cluster, not only the workload node pool. Check the host versions on all affected Ubuntu nodes and coordinate the update with volume unmounts before proceeding. If a node already runs a version newer than 2.5.6, set `BLOBFUSE2_VERSION` below to that version or a later available package. Package downgrades are disabled.

Save the current DaemonSet and create the patch:

```bash
kubectl get daemonset csi-blob-node --namespace kube-system \
  --output yaml > csi-blob-node-before.yaml

BLOBFUSE2_VERSION=2.5.6

cat <<EOF > csi-blob-proxy-patch.yaml
spec:
  template:
    spec:
      initContainers:
        - name: install-blobfuse-proxy
          env:
            - name: INSTALL_BLOBFUSE
              value: "false"
            - name: INSTALL_BLOBFUSE2
              value: "true"
            - name: BLOBFUSE2_VERSION
              value: "$BLOBFUSE2_VERSION"
            - name: INSTALL_BLOBFUSE_PROXY
              value: "true"
            - name: ALLOW_PACKAGE_INSTALL_DOWNGRADE
              value: "false"
EOF

kubectl patch daemonset csi-blob-node --namespace kube-system \
  --type strategic --patch-file csi-blob-proxy-patch.yaml

kubectl rollout status daemonset/csi-blob-node \
  --namespace kube-system --timeout=15m
```

The merge patch updates the named init container and environment entries while preserving its image and other settings. For the package-selection controls, see the [Blob CSI proxy installer](https://github.com/kubernetes-sigs/blob-csi-driver/blob/v1.27.11/pkg/blobfuse-proxy/install-proxy.sh).

After the rollout, list the CSI pods again and repeat the [host binary verification](#verify-the-installed-mount-process) on every eligible workload node. Verify **2.5.6 or later** and the distributed-cache options before mounting the volume. Existing BlobFuse2 mount processes don't switch versions when the package changes; recreate their mounts to use the updated binary.

If the rollout fails, inspect the installer logs for the affected pod:

```bash
kubectl logs --namespace kube-system "<csi-blob-node-pod-name>" \
  --container install-blobfuse-proxy
```

AKS updates can reconcile the managed DaemonSet. Recheck the host binary and installer settings after CSI driver or node-image upgrades. Once the node image supplies the required BlobFuse2 version, remove the temporary package-version override as part of that upgrade.

## Configure Blob authentication

Use federated AKS workload identity with token-only Blob authentication. The volume configuration enables this mode with `mountWithWorkloadIdentityToken: "true"`.

Follow [Enable OIDC and Microsoft Entra Workload ID](/azure/aks/workload-identity-deploy-cluster#enable-oidc-issuer-and-microsoft-entra-workload-id-on-an-aks-cluster), then create the workload ServiceAccount:

```bash
kubectl create namespace "$WORKLOAD_NAMESPACE"

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: $SERVICE_ACCOUNT
  namespace: $WORKLOAD_NAMESPACE
  annotations:
    azure.workload.identity/client-id: "$BLOBFUSE_CLIENT_ID"
EOF
```

Link the ServiceAccount to your managed identity and grant container-scoped access:

```azurecli
OIDC_ISSUER=$(az aks show \
  --resource-group "$RESOURCE_GROUP" \
  --name "$CLUSTER_NAME" \
  --query oidcIssuerProfile.issuerUrl --output tsv)

az identity federated-credential create \
  --name blobfuse-dacs-reader \
  --identity-name "$IDENTITY_NAME" \
  --resource-group "$IDENTITY_RESOURCE_GROUP" \
  --issuer "$OIDC_ISSUER" \
  --subject "system:serviceaccount:$WORKLOAD_NAMESPACE:$SERVICE_ACCOUNT" \
  --audiences api://AzureADTokenExchange

IDENTITY_PRINCIPAL_ID=$(az identity show \
  --resource-group "$IDENTITY_RESOURCE_GROUP" \
  --name "$IDENTITY_NAME" \
  --query principalId --output tsv)

STORAGE_ID=$(az storage account show \
  --resource-group "$STORAGE_RESOURCE_GROUP" \
  --name "$STORAGE_ACCOUNT" \
  --query id --output tsv)

az role assignment create \
  --assignee-object-id "$IDENTITY_PRINCIPAL_ID" \
  --assignee-principal-type ServicePrincipal \
  --role "Storage Blob Data Contributor" \
  --scope "$STORAGE_ID/blobServices/default/containers/$STORAGE_CONTAINER"
```

The role assignment follows the [CSI token-only mount guidance](https://github.com/kubernetes-sigs/blob-csi-driver/blob/master/docs/workload-identity-static-pv-mount.md). Allow it to propagate before testing. The workload accesses Blob Storage through the federated identity and a read-only mount.

## Configure a read-only BlobFuse2 volume

Retrieve the cluster DNS service IP for the Cache's cluster-local hostname:

```azurecli
CLUSTER_DNS_IP=$(az aks show \
  --resource-group "$RESOURCE_GROUP" \
  --name "$CLUSTER_NAME" \
  --query networkProfile.dnsServiceIp --output tsv)

test -n "$CLUSTER_DNS_IP"
```

Allow workload nodes to reach cluster DNS, the DACS endpoints, and Azure Blob Storage for cache misses and fallback.

Create a static PV and PVC for your existing container. The `Retain` policy preserves the data when the claim is removed:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: blobfuse-dacs-pv
spec:
  capacity:
    storage: 1Ti
  accessModes:
    - ReadOnlyMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: ""
  mountOptions:
    - --read-only=true
    - --allow-other=true
    - --disable-kernel-cache=true
    - --block-cache=false
    - --streaming=false
    - --preload=false
    - --distributed-cache-discovery-endpoint=$CACHE_DISCOVERY_HOST:9065
    - --distributed-cache-dns-server=$CLUSTER_DNS_IP
    - --distributed-cache-block-size=16
    - --distributed-cache-node-memory=1024
    - --distributed-cache-prefetch=16
    - --distributed-cache-parallelism=16
  csi:
    driver: blob.csi.azure.com
    readOnly: true
    volumeHandle: "$STORAGE_RESOURCE_GROUP#$STORAGE_ACCOUNT#$STORAGE_CONTAINER#blobfuse-dacs"
    volumeAttributes:
      protocol: fuse2
      resourceGroup: "$STORAGE_RESOURCE_GROUP"
      storageAccount: "$STORAGE_ACCOUNT"
      containerName: "$STORAGE_CONTAINER"
      clientID: "$BLOBFUSE_CLIENT_ID"
      mountWithWorkloadIdentityToken: "true"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: blobfuse-dacs-pvc
  namespace: $WORKLOAD_NAMESPACE
spec:
  accessModes:
    - ReadOnlyMany
  storageClassName: ""
  volumeName: blobfuse-dacs-pv
  resources:
    requests:
      storage: 1Ti
EOF
```

Use a unique PV name and `volumeHandle` for each volume. The `1Ti` declaration provides the capacity value for PV/PVC binding.

Configure caching through the `--distributed-cache-*` options. The distributed-cache component manages its local block-cache layer.

The example allocates 1,024 MiB to the local cache and prefetches 16 blocks. Budget memory separately for application pods, host-side BlobFuse2 mounts, and colocated DACS servers.

## Mount the volume in a workload

Set `DATA_FILE` to a file path relative to the container root. This Python workload reads the first 4 MiB twice and compares checksums:

```bash
DATA_FILE="<existing-file-path>"
WORKLOAD_IMAGE="python:3.12-slim-bookworm"

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: blobfuse-dacs-reader
  namespace: $WORKLOAD_NAMESPACE
  labels:
    azure.workload.identity/use: "true"
spec:
  serviceAccountName: $SERVICE_ACCOUNT
  restartPolicy: Never
  nodeSelector:
    kubernetes.io/os: linux
    agentpool: "$WORKLOAD_NODE_POOL"
  containers:
    - name: reader
      image: $WORKLOAD_IMAGE
      command:
        - python3
        - -c
        - |
          import hashlib
          import os
          import time
          from pathlib import Path

          path = Path("/mnt/blob") / os.environ["DATA_FILE"]
          previous = None
          for attempt in range(2):
              with path.open("rb") as stream:
                  data = stream.read(4 * 1024 * 1024)
              if not data:
                  raise RuntimeError("The selected file returned no data")
              digest = hashlib.sha256(data).hexdigest()
              if previous is not None and digest != previous:
                  raise RuntimeError("Repeated reads returned different bytes")
              print(f"read={attempt + 1} bytes={len(data)} sha256={digest}", flush=True)
              previous = digest
              time.sleep(5)
      env:
        - name: DATA_FILE
          value: "$DATA_FILE"
      resources:
        requests:
          cpu: "1"
          memory: 128Mi
        limits:
          cpu: "1"
          memory: 256Mi
      volumeMounts:
        - name: blob
          mountPath: /mnt/blob
          readOnly: true
  volumes:
    - name: blob
      persistentVolumeClaim:
        claimName: blobfuse-dacs-pvc
        readOnly: true
EOF

kubectl get pvc blobfuse-dacs-pvc --namespace "$WORKLOAD_NAMESPACE"
kubectl logs --namespace "$WORKLOAD_NAMESPACE" \
  blobfuse-dacs-reader --follow --pod-running-timeout=5m
```

The application reads `/mnt/blob/<path>`. The node selector schedules it on the pool with the verified BlobFuse2 installation.

## Verify the DACS read path

Configure scraping for each cache-server pod by following [Monitor distributed accelerator for cloud storage](monitor-distributed-accelerator-for-cloud-storage.md).

1. Confirm that the PVC is bound to the PV and that the mount uses the expected discovery, DNS, and read-only options.
1. Check the CSI and BlobFuse2 logs for the installed version and connections to the expected cache servers.
1. Record a baseline for `cache_server_request_counter{request_type="Download",status="Success"}`, summed only across the server pods owned by your Cache.
1. Allow background population to complete, then repeat reads across workload nodes. Correlate successful server Download activity with BlobFuse2 logs and Blob telemetry to confirm distributed reuse.

Use checksums to verify data integrity and request counters to verify the cache path. For detailed commands, see [Verify the DACS request path](distributed-accelerator-for-cloud-storage-quickstart.md#verify-the-dacs-request-path).

### Verify reuse across two nodes

The introductory workload reads twice from one node, which can reuse its local cache. To verify distributed reuse, use two ready nodes from the verified workload pool and a test file that you didn't read through this Cache. Choose a file small enough to fit in the cache and get its expected SHA-256 from the original source or a trusted manifest.

Use a Cache dedicated to this test so unrelated workloads don't affect its request counters.

List eligible nodes, and then set the hostname labels, the file path relative to the container root, and its expected checksum:

```bash
kubectl get nodes --selector "agentpool=$WORKLOAD_NODE_POOL" \
  --output wide --label-columns kubernetes.io/hostname

COLD_NODE="<first-node-hostname-label>"
WARM_NODE="<different-node-hostname-label>"
VALIDATION_FILE="<existing-uncached-file-path>"
EXPECTED_SHA256="<expected-full-file-sha256>"
```

Create two readers that keep their mounts active while you run the checks and wait for background population:

```bash
create_validation_reader() {
  local name="$1" node="$2"
  if [ -z "$COLD_NODE" ] || [ -z "$WARM_NODE" ] || [ "$COLD_NODE" = "$WARM_NODE" ]; then
    echo "ERROR: choose two different workload nodes." >&2
    return 1
  fi

  cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: $name
  namespace: $WORKLOAD_NAMESPACE
  labels:
    azure.workload.identity/use: "true"
spec:
  serviceAccountName: $SERVICE_ACCOUNT
  restartPolicy: Never
  nodeSelector:
    kubernetes.io/os: linux
    agentpool: "$WORKLOAD_NODE_POOL"
    kubernetes.io/hostname: "$node"
  containers:
    - name: reader
      image: $WORKLOAD_IMAGE
      command: ["sleep", "86400"]
      resources:
        requests:
          cpu: "1"
          memory: 128Mi
        limits:
          cpu: "1"
          memory: 256Mi
      volumeMounts:
        - name: blob
          mountPath: /mnt/blob
          readOnly: true
  volumes:
    - name: blob
      persistentVolumeClaim:
        claimName: blobfuse-dacs-pvc
        readOnly: true
EOF
}

create_validation_reader blobfuse-dacs-cold "$COLD_NODE" &&
create_validation_reader blobfuse-dacs-warm "$WARM_NODE" &&
kubectl wait pod/blobfuse-dacs-cold pod/blobfuse-dacs-warm \
  --namespace "$WORKLOAD_NAMESPACE" --for=condition=Ready --timeout=5m &&
kubectl get pods blobfuse-dacs-cold blobfuse-dacs-warm \
  --namespace "$WORKLOAD_NAMESPACE" --output wide
```

Confirm that both readers are ready on different nodes. Don't read the file from the warm node yet.

Read and verify the entire file from the cold node:

```bash
kubectl exec --namespace "$WORKLOAD_NAMESPACE" blobfuse-dacs-cold -- \
  sh -c 'set -eu; cd /mnt/blob; printf "%s  %s\n" "$1" "$2" | sha256sum --check' \
  sh "$EXPECTED_SHA256" "$VALIDATION_FILE"
```

Stop if the checksum check fails. Keep the cold reader running and use the cache-server metrics to confirm that background population is complete. Immediately before the warm read, record the successful Download counter baseline across the servers owned by your Cache.

Read and verify the same file from the second node:

```bash
kubectl exec --namespace "$WORKLOAD_NAMESPACE" blobfuse-dacs-warm -- \
  sh -c 'set -eu; cd /mnt/blob; printf "%s  %s\n" "$1" "$2" | sha256sum --check' \
  sh "$EXPECTED_SHA256" "$VALIDATION_FILE"
```

Both checksum checks must report `OK`, and the Cache's successful Download counter must increase during the second read. Matching checksums alone don't prove distributed reuse. If the counter doesn't increase, follow the fallback diagnostics in [Troubleshoot the integration](#troubleshoot-the-integration) rather than declaring success.

## Optimize read performance

Tune application I/O separately from BlobFuse2 cache settings:

| Setting | Description |
|---|---|
| Application I/O size and thread count | The byte ranges and concurrency requested by the application. |
| `--distributed-cache-block-size` | Local and distributed cache block size in MiB. |
| `--distributed-cache-node-memory` | Local block-cache memory setting in MiB for the mount. |
| `--distributed-cache-prefetch` | Number of blocks to prefetch. |
| `--distributed-cache-parallelism` | Concurrent block downloads, including prefetch work. |
| Cache resource sizing | DACS server count, local-NVMe capacity, CPU, memory, and server threads. |

Measure sequential and random access separately. Tune block size, prefetch, and concurrency together while monitoring throughput, memory, and origin traffic.

For colocated deployments, reserve CPU, memory, network bandwidth, and local disk capacity for both application workers and cache servers.

Apply changed mount options through a coordinated unmount and remount for all pods sharing the volume. Verify the new options in CSI logs.

## Standard storage benchmark results

The benchmarks compare BlobFuse2 alone with dedicated and colocated DACS on a Standard_LRS, Hot-tier StorageV2 account. Each profile covers five thread counts across the three configurations.

### Deployment scenarios

- **Dedicated DACS:** Application workers and DACS cache servers run on separate node pools.
- **Colocated DACS:** Application workers and DACS cache servers share the same nodes.

BlobFuse2 alone provides the baseline for both scenarios.

### Test configuration

| Setting | Measured configuration |
|---|---|
| VMs | 10 `Standard_E96ds_v6` worker nodes. Dedicated DACS adds 10 cache nodes of the same size; colocated DACS uses the worker nodes. |
| DACS server resource limits | 32 CPUs and 128 GiB of memory per server. |
| Native chart server resource requests | `250m` CPU and `100Mi` memory per server. |
| Benchmark | [Elbencho](https://github.com/breuner/elbencho) `3.0-38`; I/O depth 1. |
| Dataset | 800 existing 10-GiB files, totaling 8,000 GiB; five files per I/O thread. |
| BlobFuse2 | Read-only mounts; kernel cache disabled. |
| Client cache | 16-MiB blocks; prefetch 128 blocks; parallelism 128; native memory sizing. |

Each case used fresh worker and cache resources. Results are aggregate measurements, with thread counts reported per worker.

### Sequential reads

Sequential tests use 16-MiB I/O and five read iterations per case. Cold throughput is the first iteration. Warm throughput and the BlobFuse-only baseline are the averages of iterations 2 through 5. Values are aggregate **GB/s**.

| Threads per worker | BlobFuse-only | Dedicated cold | Dedicated warm | Colocated cold | Colocated warm |
|---|---:|---:|---:|---:|---:|
| 1 | 19.0 | 16.5 | 20.9 | 16.3 | 21.4 |
| 2 | 19.7 | 19.8 | 38.6 | 20.3 | 38.6 |
| 4 | 22.5 | 23.1 | 43.2 | 24.9 | 46.9 |
| 8 | 26.8 | 27.2 | 44.5 | 25.7 | 49.4 |
| 16 | 27.2 | 22.3 | 45.2 | 24.0 | 50.1 |

At 16 threads per worker, colocated warm throughput was **84% higher** than BlobFuse-only and **10.9% higher** than dedicated warm throughput.

#### Estimated origin bandwidth savings

Retained telemetry indicates approximately **70% lower average Blob-origin bandwidth** for dedicated and colocated DACS compared with BlobFuse-only across the matched sequential tests, including initial cold-cache population.

### Random 4-KiB reads

Random tests use 4-KiB I/O with `-i 1 --rand --infloop` and a 300-second runtime. Each case reports one aggregate IOPS measurement, including cache population.

| Threads per worker | BlobFuse-only IOPS | Dedicated IOPS | Colocated IOPS |
|---|---:|---:|---:|
| 1 | 59 | 503 | 530 |
| 2 | 117 | 952 | 882 |
| 4 | 236 | 1,586 | 1,446 |
| 8 | 448 | 2,004 | 2,046 |
| 16 | 540 | 1,804 | 1,809 |

Both DACS scenarios peak at eight threads per worker. Colocated DACS reaches **2,046 IOPS**, or **4.57 times** the BlobFuse-only result at the same thread count.

## Troubleshoot the integration

| Area | Action |
|---|---|
| Version and mount options | Verify the host-side BlobFuse2 version and its `--distributed-cache-*` options. |
| Cache activity | Correlate cache-server Download counters with BlobFuse2 logs and Blob telemetry. |
| Discovery and DNS | Verify `--distributed-cache-dns-server`, node access to cluster DNS, and the Cache's discovery service. |
| Authentication | Verify the federated ServiceAccount, identity role, CSI version, and `mountWithWorkloadIdentityToken: "true"`. |
| Node memory | Budget memory for mount caches, background population, application pods, and colocated DACS servers. |
| Configuration updates | Remount the volume and confirm the new options in CSI logs. |

For storage-mount troubleshooting, see [Troubleshoot BlobFuse2](../blobs/blobfuse2-troubleshooting.md) and the [Blob CSI driver debugging guide](https://github.com/kubernetes-sigs/blob-csi-driver/blob/master/docs/csi-debug.md).

### Identify local-cache or origin fallback

A successful mount or read doesn't prove that DACS is serving data:

- If CSI logs report `BlobFuse2 distributed-cache support could not be verified`, the driver removes the distributed-cache options and selects local block cache. Verify the host BlobFuse2 version and mount capabilities, then coordinate an unmount and remount.
- If BlobFuse2 discovers no cache servers, the mount can still succeed and reads go directly to Blob Storage. Check the discovery service, DNS address, endpoints, and node-to-cache connectivity.

Find the CSI pod running on the affected reader node and inspect its `blob` container:

```bash
kubectl get pods --namespace "$WORKLOAD_NAMESPACE" --output wide
kubectl get pods --namespace kube-system \
  --selector app=csi-blob-node --output wide

CSI_POD="<csi-blob-node-pod-on-affected-reader-node>"
kubectl logs "$CSI_POD" --namespace kube-system --container blob --since=15m
```

CSI container logs aren't host BlobFuse2 logs. On the affected workload node, use your approved node-access method to inspect BlobFuse2's journal:

```bash
journalctl --identifier=blobfuse2 --since "15 minutes ago" --no-pager
```

If BlobFuse2 is configured to write to a file instead, inspect its configured log path. After correcting the problem, coordinate an unmount and remount for all pods sharing the volume, then repeat the cache-path verification.

## Clean up the test workload

Delete only resources created for this article. Stop the reader pods before deleting the claim and PV:

```bash
kubectl delete pod blobfuse-dacs-reader blobfuse-dacs-cold blobfuse-dacs-warm \
  --namespace "$WORKLOAD_NAMESPACE" --ignore-not-found
kubectl delete pvc blobfuse-dacs-pvc \
  --namespace "$WORKLOAD_NAMESPACE" --ignore-not-found
kubectl delete pv blobfuse-dacs-pv --ignore-not-found
```

The `Retain` policy preserves your container and blobs. Don't delete existing application data or the managed identity. Remove the federated credential, role assignment, or workload namespace only if you created it solely for this test and no other workload needs it.

Leave the managed Blob CSI driver and shared DACS resources enabled. If DACS was enabled only for this evaluation and no other workload needs it, follow [Remove distributed accelerator for cloud storage](remove-container-storage.md#remove-distributed-accelerator-for-cloud-storage).

## Next steps

- [Manage distributed accelerator for cloud storage](manage-distributed-accelerator-for-cloud-storage.md).
- [Monitor distributed accelerator for cloud storage](monitor-distributed-accelerator-for-cloud-storage.md).
- [Troubleshoot distributed accelerator for cloud storage](troubleshoot-distributed-accelerator-for-cloud-storage.md).
