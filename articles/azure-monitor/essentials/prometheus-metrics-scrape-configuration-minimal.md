---
title: Minimal Prometheus ingestion profile in Azure Monitor (preview)
description: Describes how the setting for minimal ingestion profile for Prometheus metrics in Azure Monitor is configured and how you can modify it to collect additional data.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 09/28/2022
ms.reviewer: aul
---



# Minimal ingestion profile for Prometheus metrics in Azure Monitor (preview)
Azure monitor metrics addon collects minimal amount of Prometheus metrics by default. This helps reduce ingestion volume of series/metrics , so only metrics used by default dashboards, default recording rules & default alerts are collected. This article describes how this setting is configured, what metrics are collected by default due to this, and how you can modify collection to enable collecting additional metrics, as needed.

Following targets are **enabled/ON** by default - meaning you don't have to provide any scrape job configuration for scraping these targets, as metrics addon will scrape these targets automatically by default

- `cadvisor` (`job=cadvisor`)
- `nodeexporter` (`job=node`)
- `kubelet` (`job=kubelet`)
- `kube-state-metrics` (`job=kube-state-metrics`)

Following targets are available to scrape, but scraping is not enabled (**disabled/OFF**) by default - meaning you don't have to provide any scrape job configuration for scraping these targets but they are disabled/OFF by default and you need to tuen ON/enable scraping for these targets using [ama-metrics-settings-configmap](https://aka.ms/azureprometheus-addon-settings-configmap) under `default-scrape-settings-enabled` section

- `core-dns` (`job=kube-dns`)
- `kube-proxy` (`job=kube-proxy`)
- `api-server` (`job=kube-apiserver`)

> [!NOTE]
> The default scrape frequency for all default targets and scrapes is `30 seconds`. You can override it per target using the [ama-metrics-settings-configmap](https://aka.ms/azureprometheus-addon-settings-configmap) under `default-targets-scrape-interval-settings` section.
> You can read more about 3 different configmaps used by metrics addon [here](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/prometheus-metrics-scrape-configuration)

## Configuration setting
The setting `default-targets-metrics-keep-list.minimalIngestionProfile="true"` is enabled by default on the metrics addon. You can specify this setting in [ama-metrics-settings-configmap](https://aka.ms/azureprometheus-addon-settings-configmap) under `default-targets-metrics-keep-list` section. 

## Scenarios

There are four scenarios where you may want to customize this behavior:

**Ingest only minimal metrics per default target.**<br>
This is the default behavior  with the setting `default-targets-metrics-keep-list.minimalIngestionProfile="true"`. Only series and metrics listed below will be ingested for each of the default targets.

**Ingest a few additional metrics for one or more default targets in addition to minimal metrics.**<br>
Keep ` minimalIngestionProfile="true"` and specify the appropriate `keeplistRegexes.*` specific to the target, for example `keeplistRegexes.coreDns="X``Y"`. X,Y will be merged with default metric list for the target and then ingested. ``


**Ingest only a specific set of metrics for a target, and nothing else.**<br>
Set `minimalIngestionProfile="false"` and specify the appropriate `default-targets-metrics-keep-list.="X``Y"` specific to the target in the `ama-metrics-settings-configmap`.


**Ingest all metrics scraped for the default target.**<br>
Set `minimalIngestionProfile="false"` and don't specify any `default-targets-metrics-keep-list.<targetname>` for that target. This can increase metric ingestion volume by a factor per target.


> [!NOTE]
> `up` metric is not part of the allow/keep list because it will be ingested per scrape, per target, regardless of `keepLists` specified. This metric is not actually scraped but produced as result of scrape operation by the metrics addon. For histograms and summaries, each series has to be included explicitly in the list (`*bucket`, `*sum`, `*count` series).

### Minimal ingestion for default ON targets
The following metrics are allow-listed with `minimalingestionprofile=true` for default ON targets. The below metrics will be collected by default as these targets are scraped by default.

**kubelet**<br>
- `kubelet_volume_stats_used_bytes`
- `kubelet_node_name`
- `kubelet_running_pods`
- `kubelet_running_pod_count`
- `kubelet_running_containers`
- `kubelet_running_container_count`
- `volume_manager_total_volumes`
- `kubelet_node_config_error`
- `kubelet_runtime_operations_total`
- `kubelet_runtime_operations_errors_total`
- `kubelet_runtime_operations_duration_seconds` `kubelet_runtime_operations_duration_seconds_bucket` `kubelet_runtime_operations_duration_seconds_sum` `kubelet_runtime_operations_duration_seconds_count`
- `kubelet_pod_start_duration_seconds` `kubelet_pod_start_duration_seconds_bucket` `kubelet_pod_start_duration_seconds_sum` `kubelet_pod_start_duration_seconds_count`
- `kubelet_pod_worker_duration_seconds` `kubelet_pod_worker_duration_seconds_bucket` `kubelet_pod_worker_duration_seconds_sum` `kubelet_pod_worker_duration_seconds_count`
- `storage_operation_duration_seconds` `storage_operation_duration_seconds_bucket` `storage_operation_duration_seconds_sum` `storage_operation_duration_seconds_count`
- `storage_operation_errors_total`
- `kubelet_cgroup_manager_duration_seconds` `kubelet_cgroup_manager_duration_seconds_bucket` `kubelet_cgroup_manager_duration_seconds_sum` `kubelet_cgroup_manager_duration_seconds_count`
- `kubelet_pleg_relist_duration_seconds` `kubelet_pleg_relist_duration_seconds_bucket` `kubelet_pleg_relist_duration_sum` `kubelet_pleg_relist_duration_seconds_count`
- `kubelet_pleg_relist_interval_seconds` `kubelet_pleg_relist_interval_seconds_bucket` `kubelet_pleg_relist_interval_seconds_sum` `kubelet_pleg_relist_interval_seconds_count`
- `rest_client_requests_total`
- `rest_client_request_duration_seconds` `rest_client_request_duration_seconds_bucket` `rest_client_request_duration_seconds_sum` `rest_client_request_duration_seconds_count`
- `process_resident_memory_bytes`
- `process_cpu_seconds_total`
- `go_goroutines`
- `kubelet_volume_stats_capacity_bytes`
- `kubelet_volume_stats_available_bytes`
- `kubelet_volume_stats_inodes_used`
- `kubelet_volume_stats_inodes`
- `kubernetes_build_info"`

**cadvisor**<br>
- `container_spec_cpu_period`
- `container_spec_cpu_quota`
- `container_cpu_usage_seconds_total`
- `container_memory_rss`
- `container_network_receive_bytes_total`
- `container_network_transmit_bytes_total`
- `container_network_receive_packets_total`
- `container_network_transmit_packets_total`
- `container_network_receive_packets_dropped_total`
- `container_network_transmit_packets_dropped_total`
- `container_fs_reads_total`
- `container_fs_writes_total`
- `container_fs_reads_bytes_total`
- `container_fs_writes_bytes_total`
- `container_memory_working_set_bytes`
- `container_memory_cache`
- `container_memory_swap`
- `container_cpu_cfs_throttled_periods_total`
- `container_cpu_cfs_periods_total`
- `container_memory_usage_bytes`
- `kubernetes_build_info"`

**kube-state-metrics**<br>
- `kube_node_status_capacity`
- `kube_job_status_succeeded`
- `kube_job_spec_completions`
- `kube_daemonset_status_desired_number_scheduled`
- `kube_daemonset_status_number_ready`
- `kube_deployment_spec_replicas`
- `kube_deployment_status_replicas_ready`
- `kube_pod_container_status_last_terminated_reason`
- `kube_node_status_condition`
- `kube_pod_container_status_restarts_total`
- `kube_pod_container_resource_requests`
- `kube_pod_status_phase`
- `kube_pod_container_resource_limits`
- `kube_node_status_allocatable`
- `kube_pod_info`
- `kube_pod_owner`
- `kube_resourcequota`
- `kube_statefulset_replicas`
- `kube_statefulset_status_replicas`
- `kube_statefulset_status_replicas_ready`
- `kube_statefulset_status_replicas_current`
- `kube_statefulset_status_replicas_updated`
- `kube_namespace_status_phase`
- `kube_node_info`
- `kube_statefulset_metadata_generation`
- `kube_pod_labels`
- `kube_pod_annotations`
- `kube_horizontalpodautoscaler_status_current_replicas`
- `kube_horizontalpodautoscaler_spec_max_replicas`
- `kube_node_status_condition``kube_node_spec_taint`
- `kube_pod_container_status_waiting_reason`
- `kube_job_failed`
- `kube_job_status_start_time`
- `kube_deployment_spec_replicas`
- `kube_deployment_status_replicas_available`
- `kube_deployment_status_replicas_updated`
- `kube_replicaset_owner`
- `kubernetes_build_info"`

**node-exporter (linux)**<br>
- `node_cpu_seconds_total`
- `node_memory_MemAvailable_bytes`
- `node_memory_Buffers_bytes`
- `node_memory_Cached_bytes`
- `node_memory_MemFree_bytes`
- `node_memory_Slab_bytes`
- `node_memory_MemTotal_bytes`
- `node_netstat_Tcp_RetransSegs`
- `node_netstat_Tcp_OutSegs`
- `node_netstat_TcpExt_TCPSynRetrans`
- `node_load1``node_load5`
- `node_load15`
- `node_disk_read_bytes_total`
- `node_disk_written_bytes_total`
- `node_disk_io_time_seconds_total`
- `node_filesystem_size_bytes`
- `node_filesystem_avail_bytes`
- `node_network_receive_bytes_total`
- `node_network_transmit_bytes_total`
- `node_vmstat_pgmajfault`
- `node_network_receive_drop_total`
- `node_network_transmit_drop_total`
- `node_disk_io_time_weighted_seconds_total`
- `node_exporter_build_info`
- `node_time_seconds`
- `node_uname_info"`

### Minimal ingestion for default OFF targets
The following metrics that are allow-listed with `minimalingestionprofile=true` for default OFF targets. But these metrics won't be collected by default as these targets aren't scraped by default. You turn ON scraping for these targets using `default-scrape-settings-enabled.<target-name>=true`' using [ama-metrics-settings-configmap](https://aka.ms/azureprometheus-addon-settings-configmap) under `default-scrape-settings-enabled` section.

**core-dns**
- `coredns_build_info`
- `coredns_panics_total`
- `coredns_dns_responses_total`
- `coredns_forward_responses_total`
- `coredns_dns_request_duration_seconds`  `coredns_dns_request_duration_seconds_bucket`  `coredns_dns_request_duration_seconds_sum`  `coredns_dns_request_duration_seconds_count`
- `coredns_forward_request_duration_seconds`  `coredns_forward_request_duration_seconds_bucket`  `coredns_forward_request_duration_seconds_sum`  `coredns_forward_request_duration_seconds_count`
- `coredns_dns_requests_total`
- `coredns_forward_requests_total`
- `coredns_cache_hits_total`
- `coredns_cache_misses_total`
- `coredns_cache_entries`
- `coredns_plugin_enabled`
- `coredns_dns_request_size_bytes` `coredns_dns_request_size_bytes_bucket` `coredns_dns_request_size_bytes_sum` `coredns_dns_request_size_bytes_count` 
- `coredns_dns_response_size_bytes`  `coredns_dns_response_size_bytes_bucket`  `coredns_dns_response_size_bytes_sum`  `coredns_dns_response_size_bytes_count`
- `coredns_dns_response_size_bytes`  `coredns_dns_response_size_bytes_bucket`  `coredns_dns_response_size_bytes_sum`  `coredns_dns_response_size_bytes_count` 
- `process_resident_memory_bytes`
- `process_cpu_seconds_total`
- `go_goroutines`
- `kubernetes_build_info"`

**kube-proxy** 
- `kubeproxy_sync_proxy_rules_duration_seconds` `kubeproxy_sync_proxy_rules_duration_seconds_bucket` `kubeproxy_sync_proxy_rules_duration_seconds_sum` `kubeproxy_sync_proxy_rules_duration_seconds_count` `kubeproxy_network_programming_duration_seconds`
- `kubeproxy_network_programming_duration_seconds` `kubeproxy_network_programming_duration_seconds_bucket` `kubeproxy_network_programming_duration_seconds_sum` `kubeproxy_network_programming_duration_seconds_count` `rest_client_requests_total`
- `rest_client_request_duration_seconds` `rest_client_request_duration_seconds_bucket` `rest_client_request_duration_seconds_sum` `rest_client_request_duration_seconds_count`
- `process_resident_memory_bytes`
- `process_cpu_seconds_total`
- `go_goroutines`
- `kubernetes_build_info"`

**api-server**
-  `apiserver_request_duration_seconds` `apiserver_request_duration_seconds_bucket` `apiserver_request_duration_seconds_sum` `apiserver_request_duration_seconds_count` 
-  `apiserver_request_total` 
-  `workqueue_adds_total``workqueue_depth`
-  `workqueue_queue_duration_seconds` `workqueue_queue_duration_seconds_bucket` `workqueue_queue_duration_seconds_sum` `workqueue_queue_duration_seconds_count` 
-  `process_resident_memory_bytes`
-  `process_cpu_seconds_total`
-  `go_goroutines`
-  `kubernetes_build_info"`

**windows-exporter (job=windows-exporter)**<br>
- `windows_system_system_up_time`
- `windows_cpu_time_total`
- `windows_memory_available_bytes`
- `windows_os_visible_memory_bytes`
- `windows_memory_cache_bytes`
- `windows_memory_modified_page_list_bytes`
- `windows_memory_standby_cache_core_bytes`
- `windows_memory_standby_cache_normal_priority_bytes`
- `windows_memory_standby_cache_reserve_bytes`
- `windows_memory_swap_page_operations_total`
- `windows_logical_disk_read_seconds_total`
- `windows_logical_disk_write_seconds_total`
- `windows_logical_disk_size_bytes`
- `windows_logical_disk_free_bytes`
- `windows_net_bytes_total`
- `windows_net_packets_received_discarded_total`
- `windows_net_packets_outbound_discarded_total`
- `windows_container_available`
- `windows_container_cpu_usage_seconds_total`
- `windows_container_memory_usage_commit_bytes`
- `windows_container_memory_usage_private_working_set_bytes`
- `windows_container_network_receive_bytes_total`
- `windows_container_network_transmit_bytes_total`

**kube-proxy-windows (job=kube-proxy-windows)**<br>
- `kubeproxy_sync_proxy_rules_duration_seconds`
- `kubeproxy_sync_proxy_rules_duration_seconds_bucket`
- `kubeproxy_sync_proxy_rules_duration_seconds_sum`
- `kubeproxy_sync_proxy_rules_duration_seconds_count`
- `rest_client_requests_total`
- `rest_client_request_duration_seconds`
- `rest_client_request_duration_seconds_bucket`
- `rest_client_request_duration_seconds_sum`
- `rest_client_request_duration_seconds_count`
- `process_resident_memory_bytes`
- `process_cpu_seconds_total`
- `go_goroutines`

## Next steps

- [Learn more about customizing Prometheus metric scraping in Container insights](prometheus-metrics-scrape-configuration.md).
