---
title: Default Prometheus metrics configuration in Azure Monitor
description: This article lists the default targets, dashboards, and recording rules for Prometheus metrics in Azure Monitor.
ms.topic: conceptual
ms.date: 05/15/2024
ms.reviewer: aul
---

# Default Prometheus metrics configuration in Azure Monitor

This article lists the default targets, dashboards, and recording rules when you [configure Prometheus metrics to be scraped from an Azure Kubernetes Service (AKS) cluster](kubernetes-monitoring-enable.md#enable-prometheus-and-grafana) for any AKS cluster.

## Minimal ingestion profile
`Minimal ingestion profile` is a setting that helps reduce ingestion volume of metrics, as only metrics used by default dashboards, default recording rules & default alerts are collected. For addon based collection, `Minimal ingestion profile` setting is enabled by default. You can modify collection to enable collecting more metrics, as specified below.

## Scrape frequency

 The default scrape frequency for all default targets and scrapes is 30 seconds.

## Targets scraped by default
Following targets are **enabled/ON** by default - meaning you don't have to provide any scrape job configuration for scraping these targets, as metrics addon will scrape these targets automatically by default.

- `cadvisor` (`job=cadvisor`)
- `nodeexporter` (`job=node`)
- `kubelet` (`job=kubelet`)
- `kube-state-metrics` (`job=kube-state-metrics`)
- `controlplane-apiserver` (`job=controlplane-apiserver`)
- `controlplane-etcd` (`job=controlplane-etcd`)

## Metrics collected from default targets

The following metrics are collected by default from each default target. All other metrics are dropped through relabeling rules.

   **cadvisor (job=cadvisor)**<br>
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
   -  `container_fs_writes_bytes_total`
   - `container_memory_working_set_bytes`
   - `container_memory_cache`
   - `container_memory_swap`
   - `container_cpu_cfs_throttled_periods_total`
   - `container_cpu_cfs_periods_total`
   - `container_memory_usage_bytes`
   - `kubernetes_build_info"`

   **kubelet (job=kubelet)**<br>
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

   **nodexporter (job=node)**<br>
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
   - `node_filesystem_readonly`
   - `node_network_receive_bytes_total`
   - `node_network_transmit_bytes_total`
   - `node_vmstat_pgmajfault`
   - `node_network_receive_drop_total`
   - `node_network_transmit_drop_total`
   - `node_disk_io_time_weighted_seconds_total`
   - `node_exporter_build_info`
   - `node_time_seconds`
   - `node_uname_info"`

   **kube-state-metrics (job=kube-state-metrics)**<br>
   - `kube_job_status_succeeded`
   - `kube_job_spec_completions`
   - `kube_daemonset_status_desired_number_scheduled`
   - `kube_daemonset_status_number_ready`
   - `kube_deployment_status_replicas_ready`
   - `kube_pod_container_status_last_terminated_reason`
   - `kube_pod_container_status_waiting_reason`
   - `kube_pod_container_status_restarts_total`
   - `kube_node_status_allocatable`
   - `kube_pod_owner`
   - `kube_pod_container_resource_requests`
   - `kube_pod_status_phase`
   - `kube_pod_container_resource_limits`
   - `kube_replicaset_owner`
   - `kube_resourcequota`
   - `kube_namespace_status_phase`
   - `kube_node_status_capacity`
   - `kube_node_info`
   - `kube_pod_info`
   - `kube_deployment_spec_replicas`
   - `kube_deployment_status_replicas_available`
   - `kube_deployment_status_replicas_updated`
   - `kube_statefulset_status_replicas_ready`
   - `kube_statefulset_status_replicas`
   - `kube_statefulset_status_replicas_updated`
   - `kube_job_status_start_time`
   - `kube_job_status_active`
   - `kube_job_failed`
   - `kube_horizontalpodautoscaler_status_desired_replicas`
   - `kube_horizontalpodautoscaler_status_current_replicas`
   - `kube_horizontalpodautoscaler_spec_min_replicas`
   - `kube_horizontalpodautoscaler_spec_max_replicas`
   - `kubernetes_build_info`
   - `kube_node_status_condition`
   - `kube_node_spec_taint`
   - `kube_pod_container_info`
   - `kube_resource_labels` (ex - kube_pod_labels, kube_deployment_labels)
   - `kube_resource_annotations` (ex - kube_pod_annotations, kube_deployment_annotations)

   **controlplane-apiserver (job=controlplane-apiserver)**<br>
   - `apiserver_request_total`
   - `apiserver_cache_list_fetched_objects_total`
   - `apiserver_cache_list_returned_objects_total`
   - `apiserver_flowcontrol_demand_seats_average`
   - `apiserver_flowcontrol_current_limit_seats`
   - `apiserver_request_sli_duration_seconds_bucket`
   - `apiserver_request_sli_duration_seconds_count`
   - `apiserver_request_sli_duration_seconds_sum`
   - `process_start_time_seconds`
   - `apiserver_request_duration_seconds_bucket`
   - `apiserver_request_duration_seconds_count`
   - `apiserver_request_duration_seconds_sum`
   - `apiserver_storage_list_fetched_objects_total`
   - `apiserver_storage_list_returned_objects_total`
   - `apiserver_current_inflight_requests`

   **controlplane-etcd (job=controlplane-etcd)**<br>
   - `etcd_server_has_leader`
   - `rest_client_requests_total`
   - `etcd_mvcc_db_total_size_in_bytes`
   - `etcd_mvcc_db_total_size_in_use_in_bytes`
   - `etcd_server_slow_read_indexes_total`
   - `etcd_server_slow_apply_total`
   - `etcd_network_client_grpc_sent_bytes_total`
   - `etcd_server_heartbeat_send_failures_total`

## Default targets scraped for Windows
Following Windows targets are configured to scrape, but scraping isn't enabled (**disabled/OFF**) by default - meaning you don't have to provide any scrape job configuration for scraping these targets but they are disabled/OFF by default and you need to turn ON/enable scraping for these targets using [ama-metrics-settings-configmap](https://aka.ms/azureprometheus-addon-settings-configmap) under `default-scrape-settings-enabled` section.

Two default jobs can be run for Windows that scrape metrics required for the dashboards specific to Windows.
- `windows-exporter` (`job=windows-exporter`)
- `kube-proxy-windows` (`job=kube-proxy-windows`)

> [!NOTE]
> This requires applying or updating the `ama-metrics-settings-configmap` configmap and installing `windows-exporter` on all Windows nodes. For more information, see the [enablement document](kubernetes-monitoring-enable.md#enable-windows-metrics-collection-preview).

## Metrics scraped for Windows

The following metrics are collected when windows-exporter and kube-proxy-windows are enabled.

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

## Dashboards

The following default dashboards are automatically provisioned and configured by Azure Monitor managed service for Prometheus when you [link your Azure Monitor workspace to an Azure Managed Grafana instance](../essentials/azure-monitor-workspace-manage.md#link-a-grafana-workspace). Source code for these dashboards can be found in [this GitHub repository](https://aka.ms/azureprometheus-mixins). The below dashboards will be provisioned in the specified Azure Grafana instance under `Managed Prometheus` folder in Grafana. These are the standard open source community dashboards for monitoring Kubernetes clusters with Prometheus and Grafana. 

- `Kubernetes / Compute Resources / Cluster`
- `Kubernetes / Compute Resources / Namespace (Pods)`
- `Kubernetes / Compute Resources / Node (Pods)`
- `Kubernetes / Compute Resources / Pod`
- `Kubernetes / Compute Resources / Namespace (Workloads)`
- `Kubernetes / Compute Resources / Workload`
- `Kubernetes / Kubelet`
- `Node Exporter / USE Method / Node`
- `Node Exporter / Nodes`
- `Kubernetes / Compute Resources / Cluster (Windows)`
- `Kubernetes / Compute Resources / Namespace (Windows)`
- `Kubernetes / Compute Resources / Pod (Windows)`
- `Kubernetes / USE Method / Cluster (Windows)`
- `Kubernetes / USE Method / Node (Windows)`

## Recording rules

The following default recording rules are automatically configured by Azure Monitor managed service for Prometheus when you [configure Prometheus metrics to be scraped from an Azure Kubernetes Service (AKS) cluster](kubernetes-monitoring-enable.md#enable-prometheus-and-grafana). Source code for these recording rules can be found in [this GitHub repository](https://aka.ms/azureprometheus-mixins). These are the standard open source recording rules used in the dashboards above.

- `cluster:node_cpu:ratio_rate5m`
- `namespace_cpu:kube_pod_container_resource_requests:sum`
- `namespace_cpu:kube_pod_container_resource_limits:sum`
- `:node_memory_MemAvailable_bytes:sum`
- `namespace_memory:kube_pod_container_resource_requests:sum`
- `namespace_memory:kube_pod_container_resource_limits:sum`
- `namespace_workload_pod:kube_pod_owner:relabel`
- `node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate`
- `cluster:namespace:pod_cpu:active:kube_pod_container_resource_requests`
- `cluster:namespace:pod_cpu:active:kube_pod_container_resource_limits`
- `cluster:namespace:pod_memory:active:kube_pod_container_resource_requests`
- `cluster:namespace:pod_memory:active:kube_pod_container_resource_limits`
- `node_namespace_pod_container:container_memory_working_set_bytes`
- `node_namespace_pod_container:container_memory_rss`
- `node_namespace_pod_container:container_memory_cache`
- `node_namespace_pod_container:container_memory_swap`
- `instance:node_cpu_utilisation:rate5m`
- `instance:node_load1_per_cpu:ratio`
- `instance:node_memory_utilisation:ratio`
- `instance:node_vmstat_pgmajfault:rate5m`
- `instance:node_network_receive_bytes_excluding_lo:rate5m`
- `instance:node_network_transmit_bytes_excluding_lo:rate5m`
- `instance:node_network_receive_drop_excluding_lo:rate5m`
- `instance:node_network_transmit_drop_excluding_lo:rate5m`
- `instance_device:node_disk_io_time_seconds:rate5m`
- `instance_device:node_disk_io_time_weighted_seconds:rate5m`
- `instance:node_num_cpu:sum`
- `node:windows_node:sum`
- `node:windows_node_num_cpu:sum`
- `:windows_node_cpu_utilisation:avg5m`
- `node:windows_node_cpu_utilisation:avg5m`
- `:windows_node_memory_utilisation:`
- `:windows_node_memory_MemFreeCached_bytes:sum`
- `node:windows_node_memory_totalCached_bytes:sum`
- `:windows_node_memory_MemTotal_bytes:sum`
- `node:windows_node_memory_bytes_available:sum`
- `node:windows_node_memory_bytes_total:sum`
- `node:windows_node_memory_utilisation:ratio`
- `node:windows_node_memory_utilisation:`
- `node:windows_node_memory_swap_io_pages:irate`
- `:windows_node_disk_utilisation:avg_irate`
- `node:windows_node_disk_utilisation:avg_irate`
- `node:windows_node_filesystem_usage:`
- `node:windows_node_filesystem_avail:`
- `:windows_node_net_utilisation:sum_irate`
- `node:windows_node_net_utilisation:sum_irate`
- `:windows_node_net_saturation:sum_irate`
- `node:windows_node_net_saturation:sum_irate`
- `windows_pod_container_available`
- `windows_container_total_runtime`
- `windows_container_memory_usage`
- `windows_container_private_working_set_usage`
- `windows_container_network_received_bytes_total`
- `windows_container_network_transmitted_bytes_total`
- `kube_pod_windows_container_resource_memory_request`
- `kube_pod_windows_container_resource_memory_limit`
- `kube_pod_windows_container_resource_cpu_cores_request`
- `kube_pod_windows_container_resource_cpu_cores_limit`
- `namespace_pod_container:windows_container_cpu_usage_seconds_total:sum_rate`

## Prometheus visualization recording rules

When you use [Prometheus based Container Insights](./container-insights-experience-v2.md), more recording rules will be deployed to support the Prometheus visualizations.

- `ux:cluster_pod_phase_count:sum`
- `ux:node_cpu_usage:sum_irate`
- `ux:node_memory_usage:sum`
- `ux:controller_pod_phase_count:sum`
- `ux:controller_container_count:sum`
- `ux:controller_workingset_memory:sum`
- `ux:controller_cpu_usage:sum_irate`
- `ux:controller_rss_memory:sum`
- `ux:controller_resource_limit:sum`
- `ux:controller_container_restarts:max`
- `ux:pod_container_count:sum`
- `ux:pod_cpu_usage:sum_irate`
- `ux:pod_workingset_memory:sum`
- `ux:pod_rss_memory:sum`
- `ux:pod_resource_limit:sum`
- `ux:pod_container_restarts:max`
- `ux:node_network_receive_drop_total:sum_irate`
- `ux:node_network_transmit_drop_total:sum_irate`

The following recording rules are required for Windows support. These rules are deployed along with the above rules, however, they aren't enabled by default. Follow the instructions for [enabling and disabling rule groups](../essentials/prometheus-rule-groups.md#disable-and-enable-rule-groups) in your Azure Monitor workspace. 

- `ux:node_cpu_usage_windows:sum_irate`
- `ux:node_memory_usage_windows:sum`
- `ux:controller_cpu_usage_windows:sum_irate`
- `ux:controller_workingset_memory_windows:sum`
- `ux:pod_cpu_usage_windows:sum_irate`
- `ux:pod_workingset_memory_windows:sum`

## Next steps

[Customize scraping of Prometheus metrics.](prometheus-metrics-scrape-configuration.md)
