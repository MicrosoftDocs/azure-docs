---
title: High Scale and metric volume
description: 
ms.topic: conceptual
ms.date: 08/29/2022
ms.reviewer: viviandiec
---

# Prometheus scraping targets in Container insights


## Default targets
The following table has a list of all the default targets that the Container insights metrics addon can scrape by default and whether it's initially enabled. Default targets are scraped every 30 seconds.

| Key | Type | Enabled | Description |
|-----|------|----------|-------------|
| kubelet | bool | `true` | Scrape kubelet in every node in the k8s cluster without any additional scrape config. |
| cadvisor | bool | `true` | Scrape cAdvisor in every node in the k8s cluster without any additional scrape config.<br>Linux only. |
| kubestate | bool | `true` | Scrape kube-state-metrics in the k8s cluster (installed as a part of the addon) without any additional scrape config. |
| nodeexporter | bool | `true` | Scrape node metrics without any additional scrape config.<br>Linux only. |
| coredns | bool | `false` | Scrape coredns service in the k8s cluster without any additional scrape config. |
| kubeproxy | bool | `false` | Scrape kube-proxy in every linux node discovered in the k8s cluster without any additional scrape config.<br>Linux only. |
| apiserver | bool | `false` | Scrape the kubernetes api server in the k8s cluster without any additional scrape config. |
| prometheuscollectorhealth | bool | `false` | Scrape info about the prometheus-collector container such as the amount and size of timeseries scraped. |

If you want to turn on the scraping of the default targets that aren't enabled by default, create this [configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-settings-configmap.yaml) or edit an existing one, and update the targets listed under `default-scrape-settings-enabled` to `true`.

## Customizing default targets
By default, only minimal metrics are ingested as described in [Minimal ingestion profile](#minimal-ingestion-profile). To filter out metrics for any default targets, edit the settings under `default-targets-metrics-keep-list` in this [configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-settings-configmap.yaml) or edit an existing one. This setting is per job. 

For example, `kubelet` is the metric filtering setting for the default target kubelet. Use the following to filter IN metrics collected for the default targets using regex based filtering. 

```
kubelet = "metricX|metricY"
apiserver = "mymetric.*"
```

> [!NOTE]
> If you use quotes or backslashes in the regex, you will need to escape them using a backslash. For example `"test\'smetric\"s\""` and `testbackslash\\*`.

To further customize the default jobs to change properties such as collection frequency or labels, disable the corresponding default target by setting the configmap value for the target to `false`  and then apply the job using custom configmap. For details on custom configuration, see [Customize scraping of Prometheus metrics in Container insights](container-insights-prometheus-scrape-configuration.md).


## Cluster alias
The cluster label appended to every time series scraped will use the last part of the full ARM resourceID. For example, if the resource ID is `/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/rg-name/providers/Microsoft.ContainerService/managedClusters/clustername`, the cluster label is `clustername`. 

To override the cluster label in the time series scraped, update the setting `cluster_alias` to any string under `prometheus-collector-settings` in this [configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-settings-configmap.yaml). You can either create this configmap or edit an exsiting one.

The new label will also show up in the grafana instance in the cluster dropdown instead of the default one.

> [!NOTE]
> Only alphanumeric characters are allowed. Any other characters else will be replaced with `_`. This is to ensure that different components that consume this label will adhere to the basic alphanumeric convention.

## Debug mode 
The metrics addon agent can be configured to run in debug mode by updating the setting `enabled` to `true` under the `debug-mode` setting in this [configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-settings-configmap.yaml). You can either create this configmap or edit an existing one. See [Troubleshoot collection of Prometheus metrics](container-insights-prometheus-metrics-troubleshoot.md#debug-mode) for more details.







## Configure custom scrape jobs

To configure the metrics addon to scrape targets other than the default, create this [configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-prometheus-config-configmap.yaml) and update the `prometheus-config` section with your custom configuration. The format specified in the configmap will be the same as a prometheus.yml following the [configuration format](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#configuration-file). The following sections are currently supported:

```yaml
global:
  scrape_interval: <duration>
  scrape_timeout: <duration>
scrape_configs:
  - <scrape_config>
  ...
```

Before applying the configuration as a configmap, validate it using the [promconfigvalidator tool](container-insights-prometheus-scrape-configuration.md#custom-scrape-configuration), which is the same tool that is run at the container startup to perform validation of custom configuration. If the config is not valid, then the custom configuration given will not be used by the agent.

Any other unsupported sections need to be removed from the config before applying as a configmap. If not, the promconfigvalidator tool validation will fail, and the custom scrape configuration will not be applied

The `scrape_config` setting `honor_labels` is `false` by default. It should be `true` for scrape configs where labels that are normally added by Prometheus, such as `job` and `instance`, are already labels of the scraped metrics and should not be overridden. This is only applicable for cases like [federation](https://prometheus.io/docs/prometheus/latest/federation/) or scraping the [Pushgateway](https://github.com/prometheus/pushgateway), where the scraped metrics already have `job` and `instance` labels. See the [Prometheus documentation](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) for more details.



## Scraping metrics at high scale

## Advanced Mode: Scraping custom targets with the Daemonset pods

When you scrape custom targets, the scraping is done by the ama-metrics replicaset pod. For a cluster with a large number of nodes and pods running on it, custom scrape targets can be off-loaded to the daemonset. A [configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-prometheus-config-node-configmap.yaml) similar to the regular configmap can be created to have static scrape configs on each node. The scrape config should only target a single node and not try to use service discovery; otherwise each node will try to scrape all targets. The node-exporter config is a good example of using the `$NODE_IP` environment variable (already set for every prometheus-collector container) to target a specific endpoint on the node:

  ```yaml
  - job_name: node
    scrape_interval: 30s
    scheme: http
    metrics_path: /metrics
    relabel_configs:
    - source_labels: [__metrics_path__]
      regex: (.*)
      target_label: metrics_path
    - source_labels: [__address__]
      replacement: '$NODE_NAME'
      target_label: instance
    static_configs:
    - targets: ['$NODE_IP:9100']
  ```

Custom scrape targets can follow the same format using `static_configs` with targets using the `$NODE_IP` environment variable and specifying the port to scrape. Each pod of the daemonset will take the config and scrape and send the metrics for that node.



## Minimal ingestion profile
When Prometheus metric scraping is enabled for a cluster in Container insights, it collects a minimal amount of data by default. This helps reduce ingestion volume of series/metrics used by default dashboards, default recording rules & default alerts. The following sections describe how this setting is configured and how you can modify it to collect additional data.

### Configuration setting
The setting `default-targets-metrics-keep-list.minimalIngestionProfile="true"` is enabled by default on the metrics addon. You can specify this setting in [ama-metrics-settings-configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-settings-configmap.yaml) under default-targets-metrics-keep-list section. 

### Scenarios

There are four scenarios where you may want to customize this behavior:

**Ingest only minimal metrics per default target.**<br>
This is the default behavior  with the setting `default-targets-metrics-keep-list.minimalIngestionProfile="true"`. Only series and metrics listed below will be ingested for each of the default targets.

**Ingest a few additional metrics for one or more default targets in addition to minimal metrics.**<br>
Keep ` minimalIngestionProfile="true"` and specify the appropriate `keeplistRegexes.*` specific to the target, for example `keeplistRegexes.coreDns="X|Y"`. X,Y will be merged with default metric list for the target and then ingested. |


**Ingest only a specific set of metrics for a target, and nothing else.**<br>
Set `minimalIngestionProfile="false"` and specify the appropriate `default-targets-metrics-keep-list.="X|Y"` specific to the target in the `ama-metrics-settings-configmap`.


**Ingest all metrics scraped for the default target.**<br>
Set `minimalIngestionProfile="false"` and don't specify any `default-targets-metrics-keep-list.<targetname>` for that target. This can increase metric ingestion volume by a factor per target.


> [!NOTE]
> `up` metric is not part of the allow/keep list because it will be ingested per scrape, per target, regardless of `keepLists` specified. This metric is not actually scraped but produced as result of scrape by the metrics addon. For histograms and summaries, each series has to be included explicitly in the list (`*bucket`, `*sum`, `*count`).

### Minimal ingestion for ON targets
The following metrics are allow-listed with `minimalingestionprofile=true` for default ON targets. These metrics will be collected by default as these targets are scraped by default.

`default-targets-metrics-keep-list.kubelet` = `"kubelet_volume_stats_used_bytes|kubelet_node_name|kubelet_running_pods|kubelet_running_pod_count|kubelet_running_containers|kubelet_running_container_count|volume_manager_total_volumes|kubelet_node_config_error|kubelet_runtime_operations_total|kubelet_runtime_operations_errors_total|kubelet_runtime_operations_duration_seconds|kubelet_runtime_operations_duration_seconds_bucket|kubelet_runtime_operations_duration_seconds_sum|kubelet_runtime_operations_duration_seconds_count|kubelet_pod_start_duration_seconds|kubelet_pod_start_duration_seconds_bucket|kubelet_pod_start_duration_seconds_sum|kubelet_pod_start_duration_seconds_count|kubelet_pod_worker_duration_seconds|kubelet_pod_worker_duration_seconds_bucket|kubelet_pod_worker_duration_seconds_sum|kubelet_pod_worker_duration_seconds_count|storage_operation_duration_seconds|storage_operation_duration_seconds_bucket|storage_operation_duration_seconds_sum|storage_operation_duration_seconds_count|storage_operation_errors_total|kubelet_cgroup_manager_duration_seconds|kubelet_cgroup_manager_duration_seconds_bucket|kubelet_cgroup_manager_duration_seconds_sum|kubelet_cgroup_manager_duration_seconds_count|kubelet_pleg_relist_duration_seconds|kubelet_pleg_relist_duration_seconds_bucket|kubelet_pleg_relist_duration_sum|kubelet_pleg_relist_duration_seconds_count|kubelet_pleg_relist_interval_seconds|kubelet_pleg_relist_interval_seconds_bucket|kubelet_pleg_relist_interval_seconds_sum|kubelet_pleg_relist_interval_seconds_count|rest_client_requests_total|rest_client_request_duration_seconds|rest_client_request_duration_seconds_bucket|rest_client_request_duration_seconds_sum|rest_client_request_duration_seconds_count|process_resident_memory_bytes|process_cpu_seconds_total|go_goroutines|kubelet_volume_stats_capacity_bytes|kubelet_volume_stats_available_bytes|kubelet_volume_stats_inodes_used|kubelet_volume_stats_inodes|kubernetes_build_info"`

`default-targets-metrics-keep-list.cadvisor` = `"container_spec_cpu_period|container_spec_cpu_quota|container_cpu_usage_seconds_total|container_memory_rss|container_network_receive_bytes_total|container_network_transmit_bytes_total|container_network_receive_packets_total|container_network_transmit_packets_total|container_network_receive_packets_dropped_total|container_network_transmit_packets_dropped_total|container_fs_reads_total|container_fs_writes_total|container_fs_reads_bytes_total|container_fs_writes_bytes_total|container_memory_working_set_bytes|container_memory_cache|container_memory_swap|container_cpu_cfs_throttled_periods_total|container_cpu_cfs_periods_total|container_memory_usage_bytes|kubernetes_build_info"`

`default-targets-metrics-keep-list.kubestate` = `"kube_node_status_capacity|kube_job_status_succeeded|kube_job_spec_completions|kube_daemonset_status_desired_number_scheduled|kube_daemonset_status_number_ready|kube_deployment_spec_replicas|kube_deployment_status_replicas_ready|kube_pod_container_status_last_terminated_reason|kube_node_status_condition|kube_pod_container_status_restarts_total|kube_pod_container_resource_requests|kube_pod_status_phase|kube_pod_container_resource_limits|kube_node_status_allocatable|kube_pod_info|kube_pod_owner|kube_resourcequota|kube_statefulset_replicas|kube_statefulset_status_replicas|kube_statefulset_status_replicas_ready|kube_statefulset_status_replicas_current|kube_statefulset_status_replicas_updated|kube_namespace_status_phase|kube_node_info|kube_statefulset_metadata_generation|kube_pod_labels|kube_pod_annotations|kube_horizontalpodautoscaler_status_current_replicas|kube_horizontalpodautoscaler_spec_max_replicas|kube_node_status_condition|kube_node_spec_taint|kube_pod_container_status_waiting_reason|kube_job_failed|kube_job_status_start_time|kube_deployment_spec_replicas|kube_deployment_status_replicas_available|kube_deployment_status_replicas_updated|kube_replicaset_owner|kubernetes_build_info"`

`default-targets-metrics-keep-list.nodeexporter` = `"node_cpu_seconds_total|node_memory_MemAvailable_bytes|node_memory_Buffers_bytes|node_memory_Cached_bytes|node_memory_MemFree_bytes|node_memory_Slab_bytes|node_memory_MemTotal_bytes|node_netstat_Tcp_RetransSegs|node_netstat_Tcp_OutSegs|node_netstat_TcpExt_TCPSynRetrans|node_load1|node_load5|node_load15|node_disk_read_bytes_total|node_disk_written_bytes_total|node_disk_io_time_seconds_total|node_filesystem_size_bytes|node_filesystem_avail_bytes|node_network_receive_bytes_total|node_network_transmit_bytes_total|node_vmstat_pgmajfault|node_network_receive_drop_total|node_network_transmit_drop_total|node_disk_io_time_weighted_seconds_total|node_exporter_build_info|node_time_seconds|node_uname_info"`

### Minimal ingestion for OFF targets
The following metrics that are allow-listed with `minimalingestionprofile=true` for default OFF targets. These metrics will not be collected by default as these targets are not scraped by default. You turn them on using `default-targets-metrics-keep-list.<target-name>=true`'.

`default-targets-metrics-keep-list.coredns` = `"coredns_build_info|coredns_panics_total|coredns_dns_responses_total|coredns_forward_responses_total|coredns_dns_request_duration_seconds|coredns_dns_request_duration_seconds_bucket|coredns_dns_request_duration_seconds_sum|coredns_dns_request_duration_seconds_count|coredns_forward_request_duration_seconds|coredns_forward_request_duration_seconds_bucket|coredns_forward_request_duration_seconds_sum|coredns_forward_request_duration_seconds_count|coredns_dns_requests_total|coredns_forward_requests_total|coredns_cache_hits_total|coredns_cache_misses_total|coredns_cache_entries|coredns_plugin_enabled|coredns_dns_request_size_bytes|coredns_dns_request_size_bytes_bucket|coredns_dns_request_size_bytes_sum|coredns_dns_request_size_bytes_count|coredns_dns_response_size_bytes|coredns_dns_response_size_bytes_bucket|coredns_dns_response_size_bytes_sum|coredns_dns_response_size_bytes_count|coredns_dns_response_size_bytes_bucket|coredns_dns_response_size_bytes_sum|coredns_dns_response_size_bytes_count|process_resident_memory_bytes|process_cpu_seconds_total|go_goroutines|kubernetes_build_info"`

`default-targets-metrics-keep-list.kubeproxy` = `"kubeproxy_sync_proxy_rules_duration_seconds|kubeproxy_sync_proxy_rules_duration_seconds_bucket|kubeproxy_sync_proxy_rules_duration_seconds_sum|kubeproxy_sync_proxy_rules_duration_seconds_count|kubeproxy_network_programming_duration_seconds|kubeproxy_network_programming_duration_seconds_bucket|kubeproxy_network_programming_duration_seconds_sum|kubeproxy_network_programming_duration_seconds_count|rest_client_requests_total|rest_client_request_duration_seconds|rest_client_request_duration_seconds_bucket|rest_client_request_duration_seconds_sum|rest_client_request_duration_seconds_count|process_resident_memory_bytes|process_cpu_seconds_total|go_goroutines|kubernetes_build_info"`

`default-targets-metrics-keep-list.apiserver` = `"apiserver_request_duration_seconds|apiserver_request_duration_seconds_bucket|apiserver_request_duration_seconds_sum|apiserver_request_duration_seconds_count|apiserver_request_total|workqueue_adds_total|workqueue_depth|workqueue_queue_duration_seconds|workqueue_queue_duration_seconds_bucket|workqueue_queue_duration_seconds_sum|workqueue_queue_duration_seconds_count|process_resident_memory_bytes|process_cpu_seconds_total|go_goroutines|kubernetes_build_info"`

## Next steps

- [Learn more about customizing Prometheus metric scraping in Container insights](container-insights-prometheus-scrape-configuration.md).





## Next steps
