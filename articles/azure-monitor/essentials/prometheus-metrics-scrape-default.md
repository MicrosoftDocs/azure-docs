---
title: Default Prometheus metrics configuration in Azure Monitor (preview)
description: Lists the default targets, dashboards, and recording rules for Prometheus metrics in Azure Monitor.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 09/28/2022
ms.reviewer: aul
---

# Default Prometheus metrics configuration in Azure Monitor (preview)

This article lists the default targets, dashboards, and recording rules when you [configure Prometheus metrics to be scraped from an AKS cluster](prometheus-metrics-enable.md) for any AKS cluster.

## Scrape frequency

 The default scrape frequency for all default targets and scrapes is **30 seconds**.

## Targets scraped 

- `cadvisor` (`job=cadvisor`)
- `nodeexporter` (`job=node`)
- `kubelet` (`job=kubelet`)
- `kube-state-metrics` (`job=kube-state-metrics`)
   
## Metrics collected from default targets

The following metrics are collected by default from each default target. All other metrics are dropped through relabeling rules. 

   **cadvisor (job=cadvisor)**<br>
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
   - `container_fs_writes_bytes_total|container_cpu_usage_seconds_total`
  
   **kubelet (job=kubelet)**<br>
   - `kubelet_node_name`
   - `kubelet_running_pods`
   - `kubelet_running_pod_count`
   - `kubelet_running_sum_containers`
   - `kubelet_running_container_count`
   - `volume_manager_total_volumes`
   - `kubelet_node_config_error`
   - `kubelet_runtime_operations_total`
   - `kubelet_runtime_operations_errors_total`
   - `kubelet_runtime_operations_duration_seconds_bucket`
   - `kubelet_runtime_operations_duration_seconds_sum`
   - `kubelet_runtime_operations_duration_seconds_count`
   - `kubelet_pod_start_duration_seconds_bucket`
   - `kubelet_pod_start_duration_seconds_sum`
   - `kubelet_pod_start_duration_seconds_count`
   - `kubelet_pod_worker_duration_seconds_bucket`
   - `kubelet_pod_worker_duration_seconds_sum`
   - `kubelet_pod_worker_duration_seconds_count`
   - `storage_operation_duration_seconds_bucket`
   - `storage_operation_duration_seconds_sum`
   - `storage_operation_duration_seconds_count`
   - `storage_operation_errors_total`
   - `kubelet_cgroup_manager_duration_seconds_bucket`
   - `kubelet_cgroup_manager_duration_seconds_sum`
   - `kubelet_cgroup_manager_duration_seconds_count`
   - `kubelet_pleg_relist_interval_seconds_bucket`
   - `kubelet_pleg_relist_interval_seconds_count`
   - `kubelet_pleg_relist_interval_seconds_sum`
   - `kubelet_pleg_relist_duration_seconds_bucket`
   - `kubelet_pleg_relist_duration_seconds_count`
   - `kubelet_pleg_relist_duration_seconds_sum`
   - `rest_client_requests_total`
   - `rest_client_request_duration_seconds_bucket`
   - `rest_client_request_duration_seconds_sum`
   - `rest_client_request_duration_seconds_count`
   - `process_resident_memory_bytes`
   - `process_cpu_seconds_total`
   - `go_goroutines`
   - `kubernetes_build_info`
  
   **nodexporter (job=node)**<br>
   - `node_memory_MemTotal_bytes`
   - `node_cpu_seconds_total`
   - `node_memory_MemAvailable_bytes`
   - `node_memory_Buffers_bytes`
   - `node_memory_Cached_bytes`
   - `node_memory_MemFree_bytes`
   - `node_memory_Slab_bytes`
   - `node_filesystem_avail_bytes`
   - `node_filesystem_size_bytes`
   - `node_time_seconds`
   - `node_exporter_build_info`
   - `node_load1`
   - `node_vmstat_pgmajfault`
   - `node_network_receive_bytes_total`
   - `node_network_transmit_bytes_total`
   - `node_network_receive_drop_total`
   - `node_network_transmit_drop_total`
   - `node_disk_io_time_seconds_total`
   - `node_disk_io_time_weighted_seconds_total`
   - `node_load5`
   - `node_load15`
   - `node_disk_read_bytes_total`
   - `node_disk_written_bytes_total`
   - `node_uname_info`
  
   **kube-state-metrics (job=kube-state-metrics)**<br>
   - `kube_node_status_allocatable`
   - `kube_pod_owner`
   - `kube_pod_container_resource_requests`
   - `kube_pod_status_phase`
   - `kube_pod_container_resource_limits`
   - `kube_pod_info|kube_replicaset_owner`
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

## Dashboards

Following are the default dashboards that are automatically provisioned and configured by Azure Monitor managed service for Prometheus when you [link your Azure Monitor workspace to an Azure Managed Grafana instance](../essentials/azure-monitor-workspace-overview.md#link-a-grafana-workspace). Source code for these dashboards can be found in [GitHub](https://aka.ms/azureprometheus-mixins)

- Kubernetes / Compute Resources / Cluster
- Kubernetes / Compute Resources / Namespace (Pods)
- Kubernetes / Compute Resources / Node (Pods)
- Kubernetes / Compute Resources / Pod
- Kubernetes / Compute Resources / Namespace (Workloads)
- Kubernetes / Compute Resources / Workload
- Kubernetes / Kubelet
- Node Exporter / USE Method / Node
- Node Exporter / Nodes

## Recording rules

Following are the default recording rules that are automatically configured by Azure Monitor managed service for Prometheus when you [link your Azure Monitor workspace to an Azure Managed Grafana instance](../essentials/azure-monitor-workspace-overview.md#link-a-grafana-workspace). Source code for these recording rules can be found in [GitHub](https://aka.ms/azureprometheus-mixins)


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

## Next steps

- [Customize scraping of Prometheus metrics](prometheus-metrics-scrape-configuration.md).
