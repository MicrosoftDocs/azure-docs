---
title: View cluster metrics for Azure Kubernetes Service (AKS)
description: View cluster metrics for Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 03/30/2021
---

# View cluster metrics for Azure Kubernetes Service (AKS)

AKS provides a set of metrics for the control plane, including the API Server and cluster autoscaler, and cluster nodes. These metrics allow you to monitor the health of your cluster and troubleshoot issues. You can view the metrics for your cluster using the Azure portal.

> [!NOTE]
> These AKS cluster metrics overlap with a subset of the [metrics provided by Kubernetes][kubernetes-metrics].

## View metrics for your AKS cluster using the Azure portal

To view the metrics for your AKS cluster:

1. Sign in to the [Azure portal][azure-portal] and navigate to your AKS cluster.
1. On the left side under *Monitoring*, select *Metrics*.
1. Create a chart for the metrics you want to view. For example, create a chart:
    1. For *Scope*, choose your cluster.
    1. For *Metric Namespace*, choose *Container service (managed) standard metrics*.
    1. For *Metric*, under *Pods* choose *Number of Pods by phase*.
    1. For *Aggregation* choose *Avg*.

:::image type="content" source="media/metrics/metrics-chart.png" alt-text="{alt-text}":::

The above example shows the metrics for the average number of pods for the *myAKSCluster*.

## Available metrics

The following cluster metrics are available:

| Name | Group | ID | Description |
| --- | --- | --- | ---- |
| Inflight Requests | API Server (preview) |apiserver_current_inflight_requests | Maximum number of currently active inflight requests on the API Server per request kind. |
| Cluster Health | Cluster Autoscaler (preview) | cluster_autoscaler_cluster_safe_to_autoscale | Determines whether or not cluster autoscaler will take action on the cluster. |
| Scale Down Cooldown | Cluster Autoscaler (preview) | cluster_autoscaler_scale_down_in_cooldown | Determines if the scale down is in cooldown - No nodes will be removed during this timeframe. |
| Unneeded Nodes | Cluster Autoscaler (preview) | cluster_autoscaler_unneeded_nodes_count | Cluster auotscaler marks those nodes as candidates for deletion and are eventually deleted. |
| Unschedulable Pods | Cluster Autoscaler (preview) | cluster_autoscaler_unschedulable_pods_count | Number of pods that are currently unschedulable in the cluster. |
| Total number of available cpu cores in a managed cluster | Nodes | kube_node_status_allocatable_cpu_cores | Total number of available CPU cores in a managed cluster. |
| Total amount of available memory in a managed cluster | Nodes | kube_node_status_allocatable_memory_bytes | Total amount of available memory in a managed cluster. |
| Statuses for various node conditions | Nodes | kube_node_status_condition | Statuses for various node conditions |
| CPU Usage Millicores | Nodes (preview) | node_cpu_usage_millicores | Aggregated measurement of CPU utilization in millicores across the cluster. |
| CPU Usage Percentage | Nodes (preview) | node_cpu_usage_percentage | Aggregated average CPU utilization measured in percentage across the cluster. |
| Memory RSS Bytes | Nodes (preview) | node_memory_rss_bytes | Container RSS memory used in bytes. |
| Memory RSS Percentage | Nodes (preview) | node_memory_rss_percentage | Container RSS memory used in percent. |
| Memory Working Set Bytes | Nodes (preview) | node_memory_working_set_bytes | Container working set memory used in bytes. |
| Memory Working Set Percentage | Nodes (preview) | node_memory_working_set_percentage | Container working set memory used in percent. |
| Disk Used Bytes | Nodes (preview) | node_disk_usage_bytes | Disk space used in bytes by device. |
| Disk Used Percentage | Nodes (preview) | node_disk_usage_percentage | Disk space used in percent by device. |
| Network In Bytes | Nodes (preview) | node_network_in_bytes | Network received bytes. |
| Network Out Bytes | Nodes (preview) | node_network_out_bytes | Network transmitted bytes. |
| Number of pods in Ready state | Pods | kube_pod_status_ready | Number of pods in *Ready* state. |
| Number of pods by phase | Pods | kube_pod_status_phase | Number of pods by phase. |

> [!IMPORTANT]
> Metrics in preview can be updated or changed, including their names and descriptions, while in preview.

## Next steps

In addition to the cluster metrics for AKS, you can also use Azure Monitor with your AKS cluster. For more information on using Azure Monitor with AKS, see [Azure Monitor for containers][aks-azure-monitory].

[aks-azure-monitory]: ../azure-monitor/containers/container-insights-overview.md
[azure-portal]: https://portal.azure.com/
[kubernetes-metrics]: https://kubernetes.io/docs/concepts/cluster-administration/system-metrics/