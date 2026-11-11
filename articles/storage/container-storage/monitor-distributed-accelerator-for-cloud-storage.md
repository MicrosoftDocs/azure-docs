---
title: Monitor distributed accelerator for cloud storage (preview)
titleSuffix: Azure Storage
description: Scrape distributed accelerator for cloud storage Prometheus metrics into your metrics pipeline and monitor cache-server health, capacity, requests, and network pressure.
author: fhryo-msft
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 11/05/2026
ms.author: fryu
# Customer intent: "As an AKS administrator, I want to collect DACS metrics in my monitoring system so that I can monitor cache health, capacity, requests, and network pressure."
---

# Monitor distributed accelerator for cloud storage (preview)

Distributed accelerator for cloud storage (DACS) exposes Prometheus-format metrics from each cache server. Use these metrics to monitor connections, cache capacity, request latency and volume, request sizes, and operating-system network pressure.

> [!IMPORTANT]
> DACS doesn't currently integrate with Azure Monitor managed service for Prometheus. Azure Container Storage doesn't automatically configure a scrape target for DACS. You must configure your metrics pipeline to scrape each cache server's Prometheus endpoint.

## Metrics endpoint

Before you begin, install DACS and wait for the cache-server pods to be ready. Replace `<cache-namespace>` in the commands and configuration with the namespace that contains those pods.

Each cache-server pod exposes metrics on port `9096` at the `/metrics` path. Scrape every cache-server pod so that your monitoring system captures per-server state and counters.

List the cache-server pods and confirm the metrics port:

```bash
kubectl get pods \
  --namespace <cache-namespace> \
  --selector app=cacheserver \
  --output wide

kubectl get pods \
  --namespace <cache-namespace> \
  --selector app=cacheserver \
  -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{range .spec.containers[*].ports[*]}{.containerPort}{" "}{end}{"\n"}{end}'
```

Verify one endpoint locally:

```bash
CACHE_POD=$(kubectl get pods \
  --namespace <cache-namespace> \
  --selector app=cacheserver \
  -o jsonpath='{.items[0].metadata.name}')

kubectl port-forward \
  --namespace <cache-namespace> \
  pod/$CACHE_POD \
  9096:9096
```

In another terminal, retrieve the metrics:

```bash
curl --fail --silent --show-error http://localhost:9096/metrics
```

Stop the port-forward command when you finish checking the endpoint.

## Configure your metrics pipeline

Configure your Prometheus-compatible collector to discover cache server pods in the DACS namespace and scrape port `9096` at `/metrics`. The collector needs network access to the pod IP addresses on port `9096` and authenticated access to the Kubernetes API. Grant its identity `get`, `list`, and `watch` permissions for pods in the DACS namespace. For an in-cluster collector, bind a Role with these permissions to its service account.

The following Prometheus configuration is an example for an in-cluster collector. It limits Kubernetes discovery to the DACS namespace. Replace `<cache-namespace>` with your namespace.

```yaml
scrape_configs:
  - job_name: dacs-cache-server
    scrape_interval: 30s
    metrics_path: /metrics
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
            - <cache-namespace>
    relabel_configs:
      - source_labels: [__meta_kubernetes_namespace]
        action: keep
        regex: <cache-namespace>
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: cacheserver
      - source_labels: [__meta_kubernetes_pod_phase]
        action: keep
        regex: Running
      - source_labels: [__meta_kubernetes_pod_container_port_number]
        action: keep
        regex: "9096"
      - source_labels: [__meta_kubernetes_pod_name]
        target_label: pod
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace
```

If your pipeline uses a Prometheus Operator, create a `PodMonitor` or equivalent resource that selects `app=cacheserver`, the DACS namespace, and the metrics port. Use the labels and port names from your installed preview release.

After configuring scraping, verify that your metrics system has one active target for each cache server pod. Preserve the `pod`, `instance`, and `namespace` labels so you can identify a single unhealthy or saturated cache server.

## Metrics reference

A cache server exposes the following metric families:

| Metric family | Type | Meaning |
|---|---|---|
| `cache_server_active_connections` | Gauge | Number of active connections. For TCP, this metric tracks connections while handling requests, not all established idle sockets. |
| `cache_server_cache_size_bytes` | Gauge | Cached data size in bytes, not the configured cache capacity. |
| `cache_server_listen_backlog_max` | Gauge | Configured listen backlog passed to `listen()`. |
| `cache_server_accept_queue_overflows_total` | Counter | Total accept queue overflows from `TcpExt.ListenOverflows`. |
| `cache_server_listen_drops_total` | Counter | Total listen drops from `TcpExt.ListenDrops`. |
| `cache_server_syn_queue_full_drops_total` | Counter | Total SYN request queue drops from `TcpExt.TCPReqQFullDrop`. |
| `cache_server_syn_cookies_sent_total` | Counter | Total SYN cookies sent from `TcpExt.TCPReqQFullDoCookies`. |
| `cache_server_passive_opens_total` | Counter | Total `PassiveOpens` from `Tcp.PassiveOpens` through `nstat`. |
| `cache_server_open_fds` | Gauge | System-wide allocated file handles from `/proc/sys/fs/file-nr`; not per-process open file descriptors. |
| `cache_server_accept_errors_total` | Counter | Total `accept()` errors, labeled by `errno` value. A series is created when an error occurs; it can be absent on a healthy server. |
| `cache_server_successful_request_latency_ms` | Histogram | Latency of successful requests in milliseconds. |
| `cache_server_request_counter` | Counter | Number of requests. |
| `cache_server_download_request_size_bytes` | Histogram | Size of download requests. |
| `cache_server_upload_request_size_bytes` | Histogram | Size of upload requests. |

Histogram metric families expose the standard `_bucket`, `_sum`, and `_count` time series. Counter values reset when a cache-server process restarts. Use `rate()` or `increase()` rather than comparing raw counter values across restarts.

Use the metric names exposed by your installed preview build, including `cache_server_request_counter` and the `_ms` latency unit. Prometheus naming-convention lint tools can warn about these names even though Prometheus can scrape and query them.

## Example PromQL queries

The following examples assume that your metrics pipeline preserves the `namespace` and `pod` labels. For a shared metrics workspace, also attach a unique `cluster` label to every cluster's samples. The aggregations retain all three labels so that identically named pods aren't combined across namespaces or clusters. If your collector uses a different cluster label, substitute that name. Without a cluster label, use a data source limited to one cluster.

Allow at least two scrapes before evaluating `rate()` or `increase()`. On an idle server, the latency quantile and average request size can return `NaN` because no requests were observed in the query window. This condition doesn't by itself indicate a scrape failure. Check the target's `up` metric separately.

### Active connections by cache server

```promql
cache_server_active_connections
```

### Request rate by cache server

```promql
sum by (cluster, namespace, pod) (rate(cache_server_request_counter[5m]))
```

In release `0.1.0`, `cache_server_request_counter` includes `request_type` and `status` labels. Include those labels in the aggregation to split uploads, downloads, and failures. Check the labels exposed by your installed release.

### Successful downloads across a cache

To check cache-server download activity during repeated reads, filter successful Download requests and aggregate across all server pods owned by the selected Cache resource:

```promql
sum by (cluster, namespace) (
  increase(cache_server_request_counter{
    cluster="<cluster>",
    namespace="<cache-namespace>",
    pod=~"<cache-server-pod-regex>",
    request_type="Download",
    status="Success"
  }[5m])
)
```

Replace the cluster, namespace, and pod-regex placeholders. Match only the server pods owned by your Cache resource, not other caches in a shared namespace. For a single-cluster data source without a `cluster` label, omit that selector. The `Download` and `Success` label values are case-sensitive.

Record a baseline before the reads and allow at least two scrapes. `increase()` estimates activity over the window and accounts for counter resets; it isn't an exact raw-counter difference. An absent series isn't proof of zero activity. Check scrape health and the exposed labels before interpreting the result.

Correlate the increase with client cache-hit metrics and isolate unrelated traffic during validation. This counter isn't a cache-hit ratio, and a successful or faster application read alone doesn't prove cache use. Population is asynchronous, so immediate repeated reads can still miss. See [Verify the DACS request path](distributed-accelerator-for-cloud-storage-quickstart.md#verify-the-dacs-request-path).

### P95 successful-request latency (milliseconds)

```promql
histogram_quantile(
  0.95,
  sum by (le, cluster, namespace, pod) (
    rate(cache_server_successful_request_latency_ms_bucket[5m])
  )
)
```

### Average download request size

```promql
sum by (cluster, namespace, pod) (rate(cache_server_download_request_size_bytes_sum[5m]))
/
sum by (cluster, namespace, pod) (rate(cache_server_download_request_size_bytes_count[5m]))
```

### Accept queue overflows

```promql
sum by (cluster, namespace, pod) (increase(cache_server_accept_queue_overflows_total[5m]))
```

### Listen and SYN queue drops

```promql
sum by (cluster, namespace, pod) (
  increase(cache_server_listen_drops_total[5m])
  + increase(cache_server_syn_queue_full_drops_total[5m])
)
```

## Recommended alerts

Create alerts that reflect your workload baseline and cache-server VM size. At minimum, consider alerts for:

- A DACS scrape target that's down or missing.
- Sustained nonzero increases in `cache_server_accept_queue_overflows_total`.
- Sustained nonzero increases in `cache_server_listen_drops_total` or `cache_server_syn_queue_full_drops_total`.
- Increases in `cache_server_accept_errors_total`, grouped by `errno`.
- P95 or P99 successful-request latency above the workload objective.
- Active connections approaching the tested capacity of the cache-server VM size.
- Unexpected cache-size changes or imbalance across cache-server pods.
- Abnormally high system-wide allocated file handles. Remember that `cache_server_open_fds` isn't a per-process file-descriptor count.

Establish a baseline under expected concurrency before setting fixed thresholds. Correlate network-pressure metrics with request rate, request size, latency, node CPU, node memory, and Azure Blob request and byte metrics.

## Next steps

- [Manage distributed accelerator for cloud storage](manage-distributed-accelerator-for-cloud-storage.md).
- [Troubleshoot distributed accelerator for cloud storage](troubleshoot-distributed-accelerator-for-cloud-storage.md).