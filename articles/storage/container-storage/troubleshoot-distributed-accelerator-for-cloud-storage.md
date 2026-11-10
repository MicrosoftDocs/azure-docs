---
title: Troubleshoot distributed accelerator for cloud storage (preview)
titleSuffix: Azure Storage
description: Resolve installation, cache readiness, Blob access, cache-use, and model-loading performance problems with distributed accelerator for cloud storage.
author: fhryo-msft
ms.service: azure-container-storage
ms.topic: troubleshooting
ms.date: 10/30/2026
ms.author: fryu
# Customer intent: "As an AKS administrator, I want to diagnose distributed accelerator for cloud storage problems so that inference workloads can read model data reliably."
---

# Troubleshoot distributed accelerator for cloud storage (preview)

Use this article to diagnose distributed accelerator for cloud storage (DACS), enabled through its managed extension. Start with the symptom that matches your problem:

| Symptom | Start here |
|---|---|
| Installation fails or controller doesn't become ready | [Installation fails](#installation-fails) |
| Cache creation fails or cache-server pods aren't ready | [Cache isn't Ready](#cache-isnt-ready) |
| Workload reports Blob authentication or read errors | [Workload can't read Blob data](#workload-cant-read-blob-data) |
| Reads succeed but no cache hits appear | [Reads succeed but don't use the cache](#reads-succeed-but-dont-use-the-cache) |
| Cold starts or repeated model reads take too long | [Model loading is slower than expected](#model-loading-is-slower-than-expected) |

Run the commands in a Bash shell with `kubectl` configured for your AKS cluster. Set the cache name and namespace. The managed extension installs both the controller and the NVMe prerequisite DaemonSet in `kube-system`. Cache resources and cache-server pods use the cache namespace.

```bash
CACHE_NAMESPACE=<cache-namespace>
CACHE_NAME=<cache-name>
```

## Installation fails

Check the extension's provisioning state, installed version, and error details:

```azurecli
az k8s-extension show \
  --cluster-type managedClusters \
  --cluster-name <cluster-name> \
  --resource-group <resource-group> \
  --name distributedaccelerator \
  --query '{extensionType:extensionType,currentVersion:currentVersion,releaseTrain:releaseTrain,state:provisioningState,statuses:statuses}'
```

The extension type should be `microsoft.distributedaccelerator` and its state should be `Succeeded`. Use `currentVersion` to identify the installed release; don't infer it from a public chart, image, or client package. Check that you meet the [Azure CLI prerequisites](distributed-accelerator-for-cloud-storage-quickstart.md#ensure-aks-preview-extension). Don't install a second controller or change the extension's underlying Helm release to work around an installation error.

The product's preview status doesn't require the installed extension's `releaseTrain` to be `preview`. Inspect the returned value. A location-catalog request that returns HTTP 404 or `InvalidResourceType` doesn't by itself establish that DACS is unavailable in that region. Check the cluster-specific extension status and the [DACS preview support guidance](distributed-accelerator-for-cloud-storage-overview.md).

Check controller readiness and events:

```bash
kubectl rollout status deployment/dacs-manager --namespace kube-system --timeout=5m
kubectl get events --namespace kube-system --sort-by='.lastTimestamp' | tail -50
```

- **Policy denial:** Inspect the reported policy. NVMe prerequisites need privileged access to discover, format, and mount local NVMe disks. Have your security team review any required policy exception.
- **AKS operation already in progress:** If `OperationNotAllowed` reports another AKS operation, wait for that operation to finish before retrying. Don't start overlapping updates or automatically abort an AKS-managed operation.
- **VM allocation failure:** An `AllocationFailed` error during AKS reconciliation can reflect node or surge-node capacity rather than a DACS image problem. Check the node-pool provisioning state and regional VM capacity. Review workload disruption before changing node-pool upgrade settings.
- **Controller restarts:** Check controller logs and probe-failure events. A startup restart followed by stable readiness differs from repeated restarts or failure to become Ready. Don't disable admission webhooks as a workaround.
- **Failure after an upgrade:** Check the target release's compatibility requirements and collect diagnostics before making further changes. Don't delete the Cache CRD as a recovery step: deleting it removes all Cache resources. See [Prepare for upgrades](manage-distributed-accelerator-for-cloud-storage.md#prepare-for-upgrades).

## Cache isn't ready

Installing the controller doesn't create cache servers. If no Cache resource exists, follow [Provision the cache](distributed-accelerator-for-cloud-storage-quickstart.md#provision-the-cache).

For an existing cache, inspect its conditions, server counts, pods, and events:

```bash
kubectl get cache "$CACHE_NAME" --namespace "$CACHE_NAMESPACE" -o yaml
kubectl get pods --namespace "$CACHE_NAMESPACE" --selector app=cacheserver -o wide
kubectl get events --namespace "$CACHE_NAMESPACE" --sort-by='.lastTimestamp' | tail -50
```

A healthy cache has `Ready=True`, a populated discovery URL, and matching current and desired server counts. Its server pods should be Ready, not just Running. The pod listing includes all cache servers in the namespace. Use owner references to identify your cache's pods if multiple caches share the namespace.

| Symptom | Check and corrective action |
|---|---|
| API rejects the Cache manifest | Read the field error and compare it with the [complete Cache example](distributed-accelerator-for-cloud-storage-quickstart.md#provision-the-cache) and the installed release's schema. Include `scaling`, `serverSizeInGB`, and `serverThreads`; `serverThreads` must be at least 4. |
| `PodsScheduled=False` or pods remain Pending | Describe an affected pod. Check eligible node count, node labels, taints, and available CPU and memory against the Cache specification. |
| NVMe prerequisite DaemonSet has zero desired replicas | Check that its node selector matches your NVMe nodes. The quickstart uses `dacs.azure.com/processing-unit=cpu`. Apply durable labels through the AKS node-pool configuration. |
| `ReplicasReady=False`, mount errors, or repeated server restarts | Check pod events and server/NVMe prerequisite logs for image-pull, resource, and disk-setup errors. Confirm that another component isn't using the same NVMe disks. |

For a pod-level error:

```bash
kubectl describe pod <cache-server-pod> --namespace "$CACHE_NAMESPACE"
kubectl get nodes --show-labels
```

If mount errors or unexpected disk usage occur, check the cache filesystem:

```bash
kubectl exec --namespace "$CACHE_NAMESPACE" <cache-server-pod> -- \
  df -h <cache-data-path>
```

The path must be backed by local NVMe, not the OS disk. Confirm that the mount point checked during [NVMe preparation verification](distributed-accelerator-for-cloud-storage-quickstart.md#verify-local-nvme-preparation) matches `spec.storage.hostPath.nodeCacheFolderPath`. Check the managed prerequisite DaemonSet and identify the pod on the affected node:

```bash
kubectl get daemonset dacs-prereq --namespace kube-system
kubectl rollout status daemonset/dacs-prereq --namespace kube-system --timeout=10m
kubectl get pods --namespace kube-system \
  --selector app.kubernetes.io/name=dacs-prereq --output wide
kubectl logs <prerequisite-pod> --namespace kube-system \
  --container nvme-raid-setup --tail=200
```

The disk-setup logs come from the `nvme-raid-setup` init container, not the pod's default container. Don't install a duplicate prerequisite chart if the managed DaemonSet isn't ready. For legacy prerequisites deployed through another method, use their actual namespace and container names. See [Check the cache storage configuration](manage-distributed-accelerator-for-cloud-storage.md#check-the-cache-storage-configuration).

## Workload can't read Blob data

Use the workload's read error to distinguish authentication, path, and connectivity problems:

| Error or symptom | Check and corrective action |
|---|---|
| Authentication or permission error | Confirm that the identity selected by the client has `Storage Blob Data Reader` at the required container scope. Allow several minutes for new role assignments to propagate. |
| Managed identity isn't selected or is ambiguous | For the quickstart's native Python client, set `AZURE_CLIENT_ID` to the kubelet identity's client ID, `MSI_ENDPOINT` to the node IMDS endpoint, and `MSI_SECRET` to a nonempty compatibility marker, not a credential. Setting only the client ID isn't sufficient for this configuration. Other integrations have different settings; follow their authentication guidance. |
| Blob isn't found | Check the account, container, and full Blob path, including the intended model version and all required shards. |
| DNS error or connection timeout | Check Blob endpoint resolution, network rules, and private-endpoint routing from the workload pod. |

For identity configuration, see [Grant read access to model data](distributed-accelerator-for-cloud-storage-quickstart.md#grant-read-access-to-model-data).

If a model update returns unexpected data, use a distinct, immutable Blob path for each version rather than overwriting a mutable `latest` path. See [Prefetch model data before deployment](manage-distributed-accelerator-for-cloud-storage.md#prefetch-model-data-before-deployment) for the model-version rollout workflow.

If the application fails before making a read because a Python package or native library can't be imported, check the package installation and runtime requirements in [Use distributed accelerator for cloud storage with the Python client](use-distributed-accelerator-for-cloud-storage-python.md).

## Reads succeed but don't use the cache

The client can fall back to Azure Blob Storage. Successful reads or a faster second read alone aren't proof of caching.

In a running workload pod, check that both cache connection values are set:

```bash
kubectl exec --namespace <workload-namespace> <workload-pod> -- \
  printenv CACHE_DISCOVERY_URL CACHE_SERVER_PORT
```

Compare them with the selected Cache resource:

```bash
kubectl get cache "$CACHE_NAME" --namespace "$CACHE_NAMESPACE" \
  -o jsonpath='{.status.discoveryURL}{"\n"}{.spec.port}{"\n"}'
```

If either variable is missing, the client logs `Cache not configured. Working in Remote Blob mode only.` Correct the workload configuration and redeploy it. If both are correct, check DNS resolution and connectivity to the cache endpoint from the workload.

Cache population is asynchronous: a read can finish before its data is available from the cache, so two immediate reads can both miss. Repeat the same range with a delay between reads, as in the quickstart's five reads spaced one second apart. This sequence isn't a guarantee of population. Confirm client cache hits and an increase in `cache_server_request_counter{request_type="Download",status="Success"}` across all server pods for the selected Cache resource. Label values are case-sensitive. For the procedure and metrics, see [Verify the DACS request path](distributed-accelerator-for-cloud-storage-quickstart.md#verify-the-dacs-request-path).

## Model loading is slower than expected

First confirm that reads use the cache as described in the preceding section. Then compare cold and repeated warm reads to identify the limiting stage:

| Observation | Likely area to investigate |
|---|---|
| Cold reads are slow or Blob traffic spikes during scale-out | Concurrent clients can independently fetch the same missing data. Stagger starts or use optional [prefetch before deployment](manage-distributed-accelerator-for-cloud-storage.md#prefetch-model-data-before-deployment). |
| Repeated reads continue to miss | First allow time for asynchronous population and check client upload errors and server activity. Then check whether the active working set exceeds capacity or nodes were replaced. Review [capacity planning](manage-distributed-accelerator-for-cloud-storage.md#plan-capacity) and eviction telemetry. |
| Cache hits occur but read throughput is low | Check the NVMe mount, client/server network bandwidth, CPU availability, and read concurrency. |
| Data reads finish quickly but model readiness is slow | Measure file reconstruction, model deserialization, host-to-GPU transfer, and model initialization separately. |

For client tuning, see [Optimize read performance](use-distributed-accelerator-for-cloud-storage-python.md#optimize-read-performance). Use [monitoring guidance](monitor-distributed-accelerator-for-cloud-storage.md) to correlate cache activity with Blob traffic.

If an optional warm-up fails, use the Blob-access and cache-readiness checks above, correct the affected paths, and retry those reads. Verify cache hits before a planned warm-cache rollout; prefetch doesn't pin data or guarantee cache residency.

## Collect diagnostics

If the checks don't resolve the problem, collect the following output and the extension status from the installation section before opening an Azure support request:

```bash
kubectl version
kubectl get nodes -o wide
kubectl get cache "$CACHE_NAME" --namespace "$CACHE_NAMESPACE" -o yaml
kubectl get pods --namespace "$CACHE_NAMESPACE" -o wide
kubectl get events --namespace "$CACHE_NAMESPACE" --sort-by='.lastTimestamp'
kubectl logs deployment/dacs-manager --namespace kube-system --tail=200
kubectl logs <cache-server-pod> --namespace "$CACHE_NAMESPACE" --tail=200
```

For container restarts, also collect previous logs with `kubectl logs --previous` for the affected pod. For disk-setup errors, include the `nvme-raid-setup` init-container logs shown earlier. For application read failures, include the workload logs. To collect metrics, see [Monitor distributed accelerator for cloud storage](monitor-distributed-accelerator-for-cloud-storage.md).

Include the time range, affected operation, AKS version, VM sizes, DACS extension version, client versions, and any recent configuration changes. Remove tokens, SAS values, sensitive Blob paths, and other confidential information from logs and resource output before sharing.

## Next steps

- [Manage distributed accelerator for cloud storage](manage-distributed-accelerator-for-cloud-storage.md).
- [Monitor distributed accelerator for cloud storage](monitor-distributed-accelerator-for-cloud-storage.md).
- [Azure support options](https://azure.microsoft.com/support/options/)
