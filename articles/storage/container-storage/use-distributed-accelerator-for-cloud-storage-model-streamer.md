---
title: Use distributed accelerator for cloud storage with Run:ai Model Streamer (preview)
titleSuffix: Azure Storage
description: Install and configure Run:ai Model Streamer and DACS client libraries in a vLLM workload image to load Azure Blob model weights through the distributed cache.
author: fhryo-msft
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 11/05/2026
ms.author: fryu
# Customer intent: "As an AI application developer, I want to load model weights through distributed accelerator for cloud storage so that repeated model loads reuse cached Blob data."
---

# Use distributed accelerator for cloud storage with Run:ai Model Streamer (preview)

[Run:ai Model Streamer](https://github.com/dsx-ai-factory/model-streamer/blob/master/docs/README.md) reads model tensors concurrently and streams them to GPU memory, overlapping storage reads with CPU-to-GPU transfers. This capability can shorten model-loading time and reduce GPU idle time during inference-server startup and scale-out. Use it to load SafeTensors models from Azure Blob Storage into [vLLM](https://docs.vllm.ai/en/stable/) because it supports direct object-storage loading and integrates with vLLM's model loader. For the upstream integration, see [Loading models with Run:ai Model Streamer](https://docs.vllm.ai/en/stable/models/extensions/runai_model_streamer/).

By using distributed accelerator for cloud storage (DACS), this loading path can also reuse model data cached across workloads. vLLM uses Run:ai's Azure backend to load the DACS native client library. Reads retrieve cached data or fetch missing data from Blob Storage.

This article uses Run:ai Model Streamer `0.17.0`, the public `dacs-client==0.1.0` package, and the `v0.1.0` server build. The main procedure installs the dependencies in your workload image. It doesn't require a separate DACS client image or Kubernetes ImageVolume support.

Complete [Get started with distributed accelerator for cloud storage on AKS](distributed-accelerator-for-cloud-storage-quickstart.md) before using this article. To supply the DACS client libraries without rebuilding your workload image, see [Mount DACS client libraries with ImageVolume](#mount-dacs-client-libraries-with-imagevolume).

## Prerequisites

- An existing DACS deployment and its discovery-service hostname.
- An AKS GPU node pool with compatible NVIDIA drivers, a device plugin, and enough GPU memory for your model. The following example uses `bfloat16`, which requires a compatible GPU.
- For workload-identity authentication, an AKS cluster with the OIDC issuer and Microsoft Entra Workload ID enabled. See [Enable OIDC issuer and Microsoft Entra Workload ID on an AKS cluster](/azure/aks/workload-identity-deploy-cluster#enable-oidc-issuer-and-microsoft-entra-workload-id-on-an-aks-cluster).
- A compatible GPU vLLM image and a Linux environment with glibc 2.35 or newer. Use the same Python environment as your application.
- A private Blob container for model files.
- A separate uploader user or managed identity with **Storage Blob Data Contributor** on the model container.
- An inference identity with **Storage Blob Data Reader** on the model container. Configure one method in [Configure Blob authentication](#configure-blob-authentication).
- Permission to build and push your workload image, and permission for AKS to pull it.
- Azure CLI, AzCopy v10, and the Hugging Face CLI on your preparation machine if you need to upload a model.

Model preparation doesn't require a GPU. You can also check package installation, native-library loading, and Blob authentication on CPU nodes with a compatible application image. Those checks don't validate GPU scheduling, memory sizing, or inference.

## Upload model files to Blob Storage

Skip this section if the complete model is already in your private container. For a cold-cache test, use a model prefix that you didn't read through DACS.

Use the uploader identity for this procedure, not the inference identity. For container-scoped role assignments, see [Assign an Azure role for access to blob data](../blobs/assign-azure-role-data-access.md). Azure control-plane `Owner` or `Contributor` alone doesn't grant Blob data access through Microsoft Entra ID.

### Download the model

The following example downloads the inference files for [SmolLM2-135M-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct) at a fixed revision. Its model card identifies the license as Apache-2.0. Install the [Hugging Face CLI](https://huggingface.co/docs/huggingface_hub/guides/cli), then run:

```bash
MODEL_ID="HuggingFaceTB/SmolLM2-135M-Instruct"
MODEL_REVISION="12fd25f77366fa6b3b4b768ec3050bf629380bac"
MODEL_DIR="$PWD/models/SmolLM2-135M-Instruct-$MODEL_REVISION"

hf download "$MODEL_ID" \
  config.json generation_config.json model.safetensors \
  tokenizer.json tokenizer_config.json special_tokens_map.json \
  vocab.json merges.txt README.md \
  --revision "$MODEL_REVISION" \
  --local-dir "$MODEL_DIR"
```

Optionally, use a current CLI's [`hf cache verify`](https://huggingface.co/docs/huggingface_hub/guides/manage-cache#verify-your-cache) command to verify the downloaded files against Hub checksums:

```bash
hf cache verify "$MODEL_ID" \
  --revision "$MODEL_REVISION" \
  --local-dir "$MODEL_DIR"
```

Because this download selects only inference files, verification can report missing repository files such as unused model variants. It can also report extra local Hugging Face download metadata. These messages aren't checksum failures. Investigate unexpected files or checksum mismatches before uploading.

For another model, include all SafeTensors shards and any weight index, model and generation configuration, tokenizer files, and applicable license and attribution files. Preserve the required directory structure. Don't stage unrelated ONNX variants, training checkpoints, optimizer files, or credentials.

### Upload with AzCopy

Install [AzCopy v10](../common/storage-use-azcopy-v10.md). Sign in through Azure CLI as the uploader user, then copy the local directory's contents into a new Blob prefix:

```bash
TENANT_ID="<tenant-id>"
STORAGE_ACCOUNT="<storage-account>"
CONTAINER="<container>"
RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)"
MODEL_PREFIX="models/SmolLM2-135M-Instruct-${MODEL_REVISION}-${RUN_ID}"
MODEL_URL="https://${STORAGE_ACCOUNT}.blob.core.windows.net/${CONTAINER}/${MODEL_PREFIX}"

az login --tenant "$TENANT_ID"
export AZCOPY_AUTO_LOGIN_TYPE=AZCLI
export AZCOPY_TENANT_ID="$TENANT_ID"

azcopy copy "$MODEL_DIR/*" "$MODEL_URL" \
  --recursive=true \
  --overwrite=false \
  --exclude-path ".cache;.git"

azcopy list "$MODEL_URL"
```

The quoted wildcard copies the directory's contents directly into the prefix without adding a local-directory level. The exclusions omit download and Git metadata. Continue only after AzCopy reports no failed transfers and the destination contains all required files. For more information, see [Upload directory contents with AzCopy](../common/storage-use-azcopy-blobs-upload.md#upload-directory-contents) and [Authorize AzCopy using Azure CLI](../common/storage-use-azcopy-authorize-user-identity.md#authorize-by-using-azure-cli).

For an uploader running on an Azure VM, you can instead [authorize AzCopy with a managed identity](../common/storage-use-azcopy-authorize-managed-identity.md). Keep the container private and remove temporary uploader role assignments after preparation. Allow time for new role assignments to propagate; don't work around authorization errors by adding storage keys or client secrets.

Record the model revision and Blob versions or ETags. The Run:ai model location is `az://<container>/<model-prefix>`. Keep these files unchanged between cold and warm loads. For another cold test, use another new prefix rather than evicting data from a shared cache.

## Prepare the workload image without ImageVolume

Install dependencies during your image build, not at pod startup. Keep your existing application, base image, and entrypoint. Use the application's package manager and requirements or constraints workflow to preserve compatible dependencies, including Torch, CUDA, and NumPy.

Use a GPU-enabled vLLM image with Torch and CUDA versions compatible with your GPU nodes and NVIDIA drivers. Check the image's installed Run:ai core and Azure backend packages before adding dependencies; not every vLLM image includes the Azure backend.

Resolve dependency conflicts in your workload image before deploying. The `pip check` step in the following section must complete successfully. Use your application's dependency constraints to preserve compatibility with other installed packages.

1. If your image doesn't already contain compatible Run:ai core and Azure backend packages, add the following instruction to your Dockerfile:

   ```dockerfile
   RUN python3 -m pip install --no-cache-dir "runai-model-streamer[azure]==0.17.0"
   ```

1. Install the public DACS client package, which supplies the native client libraries, in that same Python environment:

   ```dockerfile
   RUN python3 -m pip install --no-cache-dir "dacs-client==0.1.0" && \
       python3 -m pip check
   ```

   Run:ai's Azure extra doesn't install the DACS client libraries. If your application already has compatible Run:ai packages, only the DACS client package installation is needed.

1. Build and push using your existing Dockerfile and build context. Run the following commands in Bash on your preparation machine. This example builds for x86-64 nodes:

   ```bash
   REGISTRY_NAME="<registry-name>"
   REGISTRY_SERVER="$(az acr show --name "$REGISTRY_NAME" --query loginServer --output tsv)"
   WORKLOAD_IMAGE="$REGISTRY_SERVER/workload-runai-dacs:0.17.0-0.1.0"

   az acr login --name "$REGISTRY_NAME"
   docker build --platform linux/amd64 -t "$WORKLOAD_IMAGE" .
   docker push "$WORKLOAD_IMAGE"
   ```

1. In the same Bash session, resolve the native-library path from the built image:

   ```bash
   docker run --rm --entrypoint python3 "$WORKLOAD_IMAGE" \
     -c 'from importlib.metadata import distribution; from pathlib import Path; p=Path(distribution("dacs-client").locate_file("py_dacs_client/libStorageDirect.so")).resolve(); assert p.is_file(), p; print(p)'
   ```

   Use the printed absolute path when configuring the workload. Keep the complete client installation, including sibling native libraries.

Prefer an immutable image digest when deploying. Updating the baked-in client requires rebuilding and redeploying the workload image.

## Configure Blob authentication

Use AKS workload identity for Blob authentication. The deployment example uses this method with **Storage Blob Data Reader** scoped to the model container. The uploader's write permission isn't needed for inference. For other authentication methods, see [Azure authentication in the Run:ai Model Streamer documentation](https://github.com/dsx-ai-factory/model-streamer/blob/master/docs/src/usage.md#azure-authentication).

### Use AKS workload identity

The deployment example uses the `runai-reader` ServiceAccount in the `runai-dacs` namespace. Complete the following steps before deploying the workload:

1. [Enable the OIDC issuer and Microsoft Entra Workload ID on your existing AKS cluster](/azure/aks/workload-identity-deploy-cluster#enable-oidc-issuer-and-microsoft-entra-workload-id-on-an-aks-cluster), if they aren't already enabled.
1. [Retrieve the OIDC issuer URL](/azure/aks/workload-identity-deploy-cluster#retrieve-the-oidc-issuer-url).
1. [Create a managed identity](/azure/aks/workload-identity-deploy-cluster#create-a-managed-identity), or select an existing identity.
1. If the `runai-dacs` namespace doesn't already exist, create it.

   ```bash
   kubectl create namespace runai-dacs
   ```

1. [Create a Kubernetes ServiceAccount](/azure/aks/workload-identity-deploy-cluster#create-a-kubernetes-service-account) annotated with that identity's client ID.
1. [Create the federated identity credential](/azure/aks/workload-identity-deploy-cluster#create-the-federated-identity-credential) for the exact namespace and ServiceAccount. You don't need to complete the subsequent Key Vault steps.

Assign the Blob reader role to the **managed identity federated to your application ServiceAccount**. For a container-scoped assignment example, see [Grant read access to model data](distributed-accelerator-for-cloud-storage-quickstart.md#grant-read-access-to-model-data), substituting this identity for the quickstart's kubelet identity.

The Pod must select the ServiceAccount and have the `azure.workload.identity/use: "true"` label. AKS injects the identity settings and projected token. Don't manually add client secrets or storage account keys.

### Configure image-pull access separately

For private ACR images, configure the **kubelet identity's** pull permissions as described in [Add the client to a workload image](distributed-accelerator-for-cloud-storage-quickstart.md#add-the-client-to-a-workload-image). Use `AcrPull` for classic RBAC. For an ABAC-enabled registry, use `Container Registry Repository Reader` with appropriate repository access. Don't use `--attach-acr` for that registry.

Blob-read access for the application's identity doesn't grant image-pull access to the kubelet. For ImageVolume, pull access must cover both the workload and client images, including separate registries or repositories when applicable.

## Configure and deploy the workload

Set these four application variables before starting vLLM. They are separate from the identity settings supplied by your authentication method:

| Environment variable | Purpose |
|---|---|
| `AZURE_STORAGE_ACCOUNT_NAME` | Storage account containing the model. |
| `CACHE_DISCOVERY_URL` | DACS discovery hostname, such as `cache-sample-discovery.<namespace>.svc.cluster.local`. |
| `CACHE_SERVER_PORT` | Cache port, typically `9065`. |
| `RUNAI_STREAMER_EXPERIMENTAL_AZURE_CACHE_LIB` | Absolute native-library path resolved from your workload image. |

> [!IMPORTANT]
> Cache discovery isn't optional. A model load can succeed by reading Blob Storage directly when the cache isn't configured. With the Run:ai Azure backend `0.17.0`, also specify the native-library path explicitly instead of relying on automatic discovery.

Use Run:ai's model URI format, `az://<container>/<model-prefix>`, with the account supplied through `AZURE_STORAGE_ACCOUNT_NAME`. This URI format differs from the native Python client's canonical URI, which includes the account hostname.

Replace the placeholders in the following example and save it as `runai-dacs-pod.yaml`. Use the model prefix from your upload and the native-library path printed by the built image. The example uses workload identity and contains **no ImageVolume or init container**:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: runai-dacs-vllm
  namespace: runai-dacs
  labels:
    azure.workload.identity/use: "true"
spec:
  serviceAccountName: runai-reader
  restartPolicy: Never
  nodeSelector:
    agentpool: "<gpu-nodepool-name>"
  tolerations:
    - key: nvidia.com/gpu
      operator: Exists
      effect: NoSchedule
  containers:
    - name: vllm
      image: "<workload-image>"
      command: ["vllm", "serve"]
      args:
        - "az://<container>/<model-prefix>"
        - "--load-format"
        - "runai_streamer"
        - "--served-model-name"
        - "cached-model"
        - "--dtype"
        - "bfloat16"
        - "--max-model-len"
        - "1024"
      env:
        - name: AZURE_STORAGE_ACCOUNT_NAME
          value: "<storage-account>"
        - name: CACHE_DISCOVERY_URL
          value: "<cache-discovery-hostname>"
        - name: CACHE_SERVER_PORT
          value: "9065"
        - name: RUNAI_STREAMER_EXPERIMENTAL_AZURE_CACHE_LIB
          value: "<dacs-native-library-path>"
        - name: RUNAI_STREAMER_CHUNK_BYTESIZE
          value: "8388608"
        - name: SI_streamingChunkSize
          value: "8388608"
      resources:
        requests:
          cpu: "4"
          memory: 16Gi
        limits:
          cpu: "4"
          memory: 16Gi
          nvidia.com/gpu: 1
      ports:
        - containerPort: 8000
      readinessProbe:
        httpGet:
          path: /health
          port: 8000
        periodSeconds: 10
        timeoutSeconds: 5
      volumeMounts:
        - name: shm
          mountPath: /dev/shm
  volumes:
    - name: shm
      emptyDir:
        medium: Memory
        sizeLimit: 2Gi
```

These resources illustrate a small model, not a 30B model. Preserve your workload's required scheduling, resources, probes, shared memory, and other vLLM arguments. Adjust GPU count, tensor parallelism, model length, and memory sizing for your model. For a Deployment or StatefulSet, apply Pod labels under `spec.template.metadata` and Pod settings under `spec.template.spec`.

The first deployment starts vLLM and loads the model before the Pod becomes ready. For a cold-cache comparison, complete these steps in order:

1. Select model data that the cache hasn't read, such as the fresh prefix from the upload procedure. Don't evict data from a shared cache.
1. Before deploying the application Pod, capture a baseline metrics snapshot from every cache-server Pod as described in [Monitor distributed accelerator for cloud storage](monitor-distributed-accelerator-for-cloud-storage.md). Record the timestamp and each server's `cache_server_upload_request_size_bytes_sum`, `cache_server_download_request_size_bytes_sum`, and `cache_server_cache_size_bytes`.
1. Deploy and inspect the accepted Pod:

   ```bash
   kubectl apply --dry-run=server -f runai-dacs-pod.yaml
   kubectl apply -f runai-dacs-pod.yaml
   kubectl -n runai-dacs get pod runai-dacs-vllm -o yaml
   kubectl -n runai-dacs wait --for=condition=Ready pod/runai-dacs-vllm --timeout=30m
   ```

## Check the workload runtime

Run this check inside the **vLLM application container**, using the application's Python executable. It verifies package consistency and native-library loading, not Blob authentication or cache usage:

```bash
kubectl -n runai-dacs exec -i runai-dacs-vllm -c vllm -- python3 - <<'PY'
import ctypes
import os
import subprocess
import sys
from importlib.metadata import version

for package in (
    "vllm",
    "torch",
    "runai-model-streamer",
    "runai-model-streamer-azure",
):
    print(f"{package}: {version(package)}", flush=True)

subprocess.run([sys.executable, "-m", "pip", "check"], check=True)

path = os.environ["RUNAI_STREAMER_EXPERIMENTAL_AZURE_CACHE_LIB"]
print(f"Checking DACS native library: {path}", flush=True)
library = ctypes.CDLL(path)
print(f"DACS native library loaded: {path}")
PY
```

Resolve errors before continuing. For the GPU deployment, also check GPU visibility and vLLM's engine logs to confirm CUDA execution and the intended model dtype. Readiness or a successful library load alone doesn't prove GPU execution or DACS cache use.

## Verify cold and warm cache behavior

Use the predeployment metrics baseline collected in [Configure and deploy the workload](#configure-and-deploy-the-workload). The model load performed during deployment is the cold load.

### Verify the cold load

Inspect the application log:

```bash
kubectl -n runai-dacs logs runai-dacs-vllm -c vllm
```

Look for native `ReadChunk stats`. `RemoteClient` counts backing-store weight reads; `RemoteCache` counts remote-cache reads. Some cache hits during the first load are normal because earlier reads can populate data. `GetProperties` cache hits describe metadata, not model-weight hits.

Send an inference request:

```bash
kubectl -n runai-dacs exec -i runai-dacs-vllm -c vllm -- python3 - <<'PY'
import json
import urllib.request

body = json.dumps({
    "model": "cached-model",
    "prompt": "Once upon a time",
    "max_tokens": 16,
    "temperature": 0,
}).encode()
request = urllib.request.Request(
    "http://127.0.0.1:8000/v1/completions", data=body,
    headers={"Content-Type": "application/json"},
)
with urllib.request.urlopen(request, timeout=600) as response:
    result = json.load(response)
print(json.dumps(result, indent=2))
assert result["choices"][0]["text"].strip()
assert result["usage"]["completion_tokens"] > 0
PY
```

Confirm nonzero cold backing-store reads. Keep the application Pod running while you check asynchronous cache population:

1. Sample `cache_server_upload_request_size_bytes_sum` and `cache_server_cache_size_bytes` from every cache-server Pod for the selected Cache resource every 10 seconds, for up to five minutes. Use the [metrics endpoint procedure](monitor-distributed-accelerator-for-cloud-storage.md#metrics-endpoint). Use fresh samples, not repeated copies of a stored scrape.
1. Compare the samples with the predeployment baseline. Require an increase in total uploaded bytes and total cached bytes across those servers. Don't require every server to receive data.
1. Wait until each server's upload-byte counter remains unchanged for three consecutive sampling intervals after the total upload increase. Confirm that no server restarted and no counter reset during the comparison.
1. Save that final sample as the post-cold snapshot, including `cache_server_download_request_size_bytes_sum` from every server as the baseline for the warm load.

If these conditions aren't met within five minutes, stop the comparison rather than treating the cache as warm. Check client upload errors, cache-server health, and ongoing traffic before retrying. Larger models can need a longer observation window. A missing metric or failed scrape isn't a zero value or evidence that uploads have finished.

Stable counters are a readiness signal, not proof that every model chunk is cached. Shared-cache traffic can also prevent stabilization or account for increases. Use a quiet validation window where possible, and require the fresh-Pod warm-read checks below to confirm distributed-cache reuse.

### Verify a warm load in a fresh pod

Save the cold log and pod UID. Recreate only the application pod by using the same model files, cache endpoint, library, and chunk size:

```bash
kubectl -n runai-dacs logs runai-dacs-vllm -c vllm > runai-cold.log
kubectl -n runai-dacs get pod runai-dacs-vllm -o jsonpath='{.metadata.uid}' > runai-cold.uid
kubectl -n runai-dacs delete pod runai-dacs-vllm --wait=true
kubectl apply -f runai-dacs-pod.yaml
kubectl -n runai-dacs wait --for=condition=Ready pod/runai-dacs-vllm --timeout=30m
kubectl -n runai-dacs get pod runai-dacs-vllm -o jsonpath='{.metadata.uid}' > runai-warm.uid
kubectl -n runai-dacs logs runai-dacs-vllm -c vllm > runai-warm.log
```

Repeat the runtime check and inference request. Then, capture a post-warm metrics snapshot from every cache server. Confirm different pod UIDs, an increased remote-source cache hit rate, and fewer backing-store reads. Compare `cache_server_download_request_size_bytes_sum` with the post-cold snapshot to corroborate warm cache reads. A fresh process avoids mistaking local in-memory prefetch for a distributed-cache hit.

The remote-source hit rate is `RemoteCache / (RemoteCache + RemoteClient)`, excluding local prefetch. Use the latest cumulative snapshot for each native process, mount, and chunk size; don't sum periodic samples. Exclude measurements affected by cache-server restarts or counter resets. Shared server counters corroborate application logs but don't attribute all traffic to one workload.

Metadata can still contact Blob Storage even when warm weight-read counters show zero backing-store reads.

## Mount DACS client libraries with ImageVolume

Use this alternative only when the node runtime supports ImageVolume and you have a pullable client image built from the public DACS wheel. Don't assume that a proposed MCR image or tag is published. If no suitable client image is available, use the workload-image procedure in the previous section.

Your GPU vLLM image must already contain compatible Run:ai core and Azure packages. You don't need to install the DACS client package in its Python environment because the image volume supplies the native client libraries.

Adapt the pod example as follows:

1. Keep your existing compatible vLLM image instead of rebuilding it to install the DACS client libraries.
1. Add a read-only client image volume and mount:

   ```yaml
   # Add to spec.volumes.
   - name: dacs-client
     image:
       reference: "<accessible-client-image>"
       pullPolicy: IfNotPresent

   # Add to the vLLM container's volumeMounts.
   - name: dacs-client
     mountPath: /opt/cache-client
     readOnly: true
   ```

1. Set `RUNAI_STREAMER_EXPERIMENTAL_AZURE_CACHE_LIB` to the absolute path of `libStorageDirect.so` under `/opt/cache-client`, based on that image's actual layout. Preserve sibling native dependencies.
1. Deploy and confirm that the image volume and read-only mount remain in the **live** pod specification. Verify the file exists, then run the same application-container runtime and cold/warm checks.

Some older clusters can remove unsupported image-volume fields and mounts from the accepted pod. Kubernetes version and server dry-run alone aren't sufficient. Don't install or preload a conflicting version of the DACS client libraries alongside the mounted client; an absolute library path doesn't isolate its native dependency namespace.

## Optimize read performance

**Why tune chunk size?** Models have different tensor sizes and read patterns, so one chunk size might not deliver the best model-loading performance for every model. Oversized chunks fetch more data than a read needs and increase buffering. Undersized chunks increase request counts and per-request overhead. Choosing a size suited to the model's commonly occurring tensors balances these costs, improves effective weight-read throughput, and reduces model-loading time, including warm loads from DACS. Treat the following recommendations as starting points and measure cold and warm loading times separately. Gains depend on the model, loader concurrency, and storage and network performance.

Choose a chunk size by using the following model-specific recommendations. For other models, inspect the tensor metadata as described in the next section, or use **32 MiB** if metadata inspection isn't available.

| Model | Recommended chunk size | Value in bytes |
|---|---|---|
| `qwen3-coder-30b-a3b-instruct` | 3 MiB | `3145728` |
| `gpt-oss-20b` | 2 MiB | `2097152` |
| `deepseek-r1-0528` | 14 MiB | `14680064` |
| `deepseek-v3-0324` | 14 MiB | `14680064` |
| `phi-2` | 2 MiB | `2097152` |
| `mistral-small-4-119b-2603-nvfp4` | 2 MiB | `2097152` |
| `ministral-3-3b-instruct-2512` | 2 MiB | `2097152` |
| `ministral-3-3b-instruct` (alias) | 2 MiB | `2097152` |
| `ministral-3-8b-instruct-2512` | 2 MiB | `2097152` |
| `ministral-3-8b-instruct` (alias) | 2 MiB | `2097152` |
| `ministral-3-14b-instruct-2512` | 2 MiB | `2097152` |
| `ministral-3-14b-instruct` (alias) | 2 MiB | `2097152` |
| Fallback when metadata inspection isn't available | 32 MiB | `33554432` |

### Choose a chunk size for another model

Use a Safetensors metadata viewer or header-inspection tool to inspect **all model shards**, without loading tensor contents:

1. Find each tensor's stored size in bytes: its ending data offset minus its starting offset. Exclude the `__metadata__` entry.
1. Treat every size above **32 MiB** as **32 MiB** before counting occurrences.
1. Select the most frequently occurring size across all shards. If multiple sizes occur equally often, choose the larger one.
1. If the selected size is below **2 MiB**, use **2 MiB**.

For example, if 3-MiB tensors occur most frequently after capping, use **3 MiB (`3145728` bytes)**. If metadata inspection is unavailable, use **32 MiB (`33554432` bytes)**.

### Configure the application

Set both `RUNAI_STREAMER_CHUNK_BYTESIZE` and `SI_streamingChunkSize` to the resulting byte value in the application container's environment. For example, for a 3-MiB recommendation:

```yaml
env:
  - name: RUNAI_STREAMER_CHUNK_BYTESIZE
    value: "3145728"
  - name: SI_streamingChunkSize
    value: "3145728"
```

Set these values explicitly; the table describes recommendations, not automatic model detection or built-in defaults. Recreate the application Pod after changing them; cache servers don't need restarting. Readers and population jobs sharing cached data should use the same chunk size.

Run:ai's read size and the native cache-chunk size are separate controls, configured together above. Benchmark the recommendation with your workload, and tune loader concurrency separately. Compare cold and warm loads independently. Changing the cache-chunk size creates different cache keys and can temporarily increase cache occupancy. Change one setting at a time and measure load time, native counters, cache metrics, CPU, GPU and host memory, and network use. Tensor alignment alone doesn't guarantee better performance.

> [!WARNING]
> The public native client's default asynchronous upload-buffer budget is 400 GiB in `0.1.0`. It isn't a preallocation or a safe Pod-memory limit. Large-model cold population can exhaust a smaller Pod. For memory-constrained workloads, test synchronous population (`SI_cacheEnableSyncUpload=true`) or a bounded asynchronous upload budget (`SI_cacheMaxUploadBufferSizePerProcessGB`). Budget model staging, native upload/prefetch buffers, GPU memory, and `/dev/shm` separately. These safeguards are optional workload-specific settings, not additional requirements for the small-model example.

## Troubleshoot

| Symptom | Check |
|---|---|
| Image pull fails | Kubelet pull permissions, registry permission mode, image digest, and network access. |
| Native library doesn't load | Application Python environment, explicit path, glibc compatibility, and sibling native libraries. |
| Blob authorization fails | Selected identity, reader role, role propagation, federation, and Pod label. For other authentication methods, follow the upstream Azure authentication guidance linked earlier. |
| Model loads without cache traffic | Both discovery settings, provider loading, DNS/network reachability, and native data-read counters. |
| Warm loads still read Blob data | Population completion, Blob versions, matching chunk sizes, evictions, and partial reads. |
| ImageVolume is missing | Live Pod fields and node/runtime support; use the baked-in method if unavailable. |
| Pod is OOM-killed | Model and staging memory, native buffers, GPU/KV-cache sizing, and `/dev/shm`. |

For a separate direct-Blob comparison, set `RUNAI_STREAMER_EXPERIMENTAL_AZURE_CACHE_ENABLED=0` and recreate a test Pod. Setting it to `1` instead makes provider-loading failures fail startup rather than silently fall back. Neither setting proves cache hits; inspect the data-read counters.

## Clean up the example

If you created the standalone example Pod, delete it when finished:

```bash
kubectl -n runai-dacs delete pod runai-dacs-vllm --wait=true
```

Remove only model prefixes, images, identities, federation, namespaces, and role assignments that you created for this example and no longer need. Don't delete an existing shared cache or identity. Retained model data is now warm; use a fresh prefix for another cold-cache validation.

## Next steps

- [Use the DACS Python client](use-distributed-accelerator-for-cloud-storage-python.md).
- [Monitor distributed accelerator for cloud storage](monitor-distributed-accelerator-for-cloud-storage.md).
- [Manage distributed accelerator for cloud storage](manage-distributed-accelerator-for-cloud-storage.md).
- [Troubleshoot distributed accelerator for cloud storage](troubleshoot-distributed-accelerator-for-cloud-storage.md).
