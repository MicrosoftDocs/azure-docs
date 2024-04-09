---
title: List of control plane metrics in Azure Monitor managed service for Prometheus (preview)
description: This article describes the minimal ingestion profile metrics for Azure Kubernetes Service (AKS) control plane metrics.
ms.topic: conceptual
ms.subservice: aks-monitoring
ms.date: 01/31/2024
author: nickomang
ms.author: nickoman

ms.reviewer: aritraghosh
---

# Minimal ingestion profile for control plane Metrics in Managed Prometheus

Azure Monitor metrics addon collects many Prometheus metrics by default. `Minimal ingestion profile` is a setting that helps reduce ingestion volume of metrics, as only metrics used by default dashboards, default recording rules and default alerts are collected. This article describes how this setting is configured specifically for control plane metrics. This article also lists metrics collected by default when `minimal ingestion profile` is enabled.

> [!NOTE]
> For addon based collection, `Minimal ingestion profile` setting is enabled by default. The discussion here is focused on control plane metrics. The current set of default targets and metrics is listed [here][azure-monitor-prometheus-metrics-scrape-config-minimal].

Following targets are **enabled/ON** by default - meaning you don't have to provide any scrape job configuration for scraping these targets, as metrics addon scrapes these targets automatically by default:

- `controlplane-apiserver` (job=`controlplane-apiserver`)
- `controlplane-etcd` (job=`controlplane-etcd`)

Following targets are available to scrape, but scraping isn't enabled (**disabled/OFF**) by default. Meaning you don't have to provide any scrape job configuration for scraping these targets, and you need to turn **ON/enable** scraping for these targets using the [ama-metrics-settings-configmap][ama-metrics-settings-configmap-github] under the `default-scrape-settings-enabled` section.

- `controlplane-cluster-autoscaler`
- `controlplane-kube-scheduler`
- `controlplane-kube-controller-manager`

> [!NOTE]
> The default scrape frequency for all default targets and scrapes is `30 seconds`. You can override it for each target using the [ama-metrics-settings-configmap][ama-metrics-settings-configmap-github] under `default-targets-scrape-interval-settings` section.

### Minimal ingestion for default ON targets

The following metrics are allow-listed with `minimalingestionprofile=true` for default **ON** targets. The below metrics are collected by default, as these targets are scraped by default.

**controlplane-apiserver**

- `apiserver_request_total`
- `apiserver_cache_list_fetched_objects_total`
- `apiserver_cache_list_returned_objects_total`
- `apiserver_flowcontrol_demand_seats_average`
- `apiserver_flowcontrol_current_limit_seats`
- `apiserver_request_sli_duration_seconds_bucket`
- `apiserver_request_sli_duration_seconds_sum`
- `apiserver_request_sli_duration_seconds_count`
- `process_start_time_seconds`
- `apiserver_request_duration_seconds_bucket`
- `apiserver_request_duration_seconds_sum`
- `apiserver_request_duration_seconds_count`
- `apiserver_storage_list_fetched_objects_total`
- `apiserver_storage_list_returned_objects_total`
- `apiserver_current_inflight_requests`

**controlplane-etcd**

- `etcd_server_has_leader`
- `rest_client_requests_total`
- `etcd_mvcc_db_total_size_in_bytes`
- `etcd_mvcc_db_total_size_in_use_in_bytes`
- `etcd_server_slow_read_indexes_total`
- `etcd_server_slow_apply_total`
- `etcd_network_client_grpc_sent_bytes_total`
- `etcd_server_heartbeat_send_failures_total`

### Minimal ingestion for default OFF targets

The following are metrics that are allow-listed with `minimalingestionprofile=true` for default **OFF** targets. These metrics aren't collected by default. You can turn **ON** scraping for these targets using `default-scrape-settings-enabled.<target-name>=true` using the [ama-metrics-settings-configmap][ama-metrics-settings-configmap-github] under the `default-scrape-settings-enabled` section.

**controlplane-kube-controller-manager**

- `workqueue_depth `
- `rest_client_requests_total`
- `rest_client_request_duration_seconds `

**controlplane-kube-scheduler**

- `scheduler_pending_pods`
- `scheduler_unschedulable_pods`
- `scheduler_queue_incoming_pods_total`
- `scheduler_schedule_attempts_total`
- `scheduler_preemption_attempts_total`

**controlplane-cluster-autoscaler**

- `rest_client_requests_total`
- `cluster_autoscaler_last_activity`
- `cluster_autoscaler_cluster_safe_to_autoscale`
- `cluster_autoscaler_failed_scale_ups_total`
- `cluster_autoscaler_scale_down_in_cooldown`
- `cluster_autoscaler_scaled_up_nodes_total`
- `cluster_autoscaler_unneeded_nodes_count`
- `cluster_autoscaler_unschedulable_pods_count`
- `cluster_autoscaler_nodes_count`
- `cloudprovider_azure_api_request_errors`
- `cloudprovider_azure_api_request_duration_seconds_bucket`
- `cloudprovider_azure_api_request_duration_seconds_count`

> [!NOTE]
> The CPU and memory usage metrics for all control-plane targets are not exposed irrespective of the profile.

## References

- [Kubernetes Upstream metrics list][kubernetes-metrics-instrumentation-reference]

- [Cluster autoscaler metrics list][kubernetes-metrics-autoscaler-reference]

## Next steps

- [Learn more about control plane metrics in Managed Prometheus](monitor-control-plane-metrics.md)

<!-- EXTERNAL LINKS -->
[ama-metrics-settings-configmap-github]: https://github.com/Azure/prometheus-collector/blob/89e865a73601c0798410016e9beb323f1ecba335/otelcollector/configmaps/ama-metrics-settings-configmap.yaml
[kubernetes-metrics-instrumentation-reference]: https://kubernetes.io/docs/reference/instrumentation/metrics/
(https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/proposals/metrics.md)
[kubernetes-metrics-autoscaler-reference]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/proposals/metrics.md

<!-- INTERNAL LINKS -->
[azure-monitor-prometheus-metrics-scrape-config-minimal]: ../azure-monitor/containers/prometheus-metrics-scrape-configuration-minimal.md

