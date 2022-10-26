---
title: Configure GPU monitoring with Container insights
description: This article describes how you can configure monitoring Kubernetes clusters with NVIDIA and AMD GPU enabled nodes with Container insights.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 05/24/2022
ms.reviewer: aul
---

# Configure GPU monitoring with Container insights

Starting with agent version *ciprod03022019*, Container insights integrated agent now supports monitoring GPU (graphical processing units) usage on GPU-aware Kubernetes cluster nodes, and monitor pods/containers requesting and using GPU resources.

>[!NOTE]
> As per the Kubernetes [upstream announcement](https://kubernetes.io/blog/2020/12/16/third-party-device-metrics-reaches-ga/#nvidia-gpu-metrics-deprecated), Kubernetes is deprecating GPU metrics that are being reported by the kubelet, for Kubernetes ver. 1.20+. This means Container Insights will no longer be able to collect the following metrics out of the box:
> * containerGpuDutyCycle
> * containerGpumemoryTotalBytes
> * containerGpumemoryUsedBytes
> 
> To continue collecting GPU metrics through Container Insights, please migrate by December 31, 2022 to your GPU vendor specific metrics exporter and configure [Prometheus scraping](./container-insights-prometheus.md) to scrape metrics from the deployed vendor specific exporter.

## Supported GPU vendors

Container insights supports monitoring GPU clusters from following GPU vendors:

- [NVIDIA](https://developer.nvidia.com/kubernetes-gpu)

- [AMD](https://github.com/RadeonOpenCompute/k8s-device-plugin)

Container insights automatically starts monitoring GPU usage on nodes, and GPU requesting pods and workloads by collecting the following metrics at 60sec intervals and storing them in the **InsightMetrics** table.

>[!NOTE]
>After provisioning cluster with GPU nodes, ensure that [GPU driver](../../aks/gpu-cluster.md) is installed as required by AKS to run GPU workloads. Container insights collect GPU metrics through GPU driver pods running in the node. 

|Metric name |Metric dimension (tags) |Description |
|------------|------------------------|------------|
|containerGpuDutyCycle* |container.azm.ms/clusterId, container.azm.ms/clusterName, containerName, gpuId, gpuModel, gpuVendor|Percentage of time over the past sample period (60 seconds) during which GPU was busy/actively processing for a container. Duty cycle is a number between 1 and 100. |
|containerGpuLimits |container.azm.ms/clusterId, container.azm.ms/clusterName, containerName |Each container can specify limits as one or more GPUs. It is not possible to request or limit a fraction of a GPU. |
|containerGpuRequests |container.azm.ms/clusterId, container.azm.ms/clusterName, containerName |Each container can request one or more GPUs. It is not possible to request or limit a fraction of a GPU.|
|containerGpumemoryTotalBytes* |container.azm.ms/clusterId, container.azm.ms/clusterName, containerName, gpuId, gpuModel, gpuVendor |Amount of GPU Memory in bytes available to use for a specific container. |
|containerGpumemoryUsedBytes* |container.azm.ms/clusterId, container.azm.ms/clusterName, containerName, gpuId, gpuModel, gpuVendor |Amount of GPU Memory in bytes used by a specific container. |
|nodeGpuAllocatable |container.azm.ms/clusterId, container.azm.ms/clusterName, gpuVendor |Number of GPUs in a node that can be used by Kubernetes. |
|nodeGpuCapacity |container.azm.ms/clusterId, container.azm.ms/clusterName, gpuVendor |Total Number of GPUs in a node. |

\* Based on Kubernetes upstream changes, these metrics are no longer collected out of the box, as a temporary hotfix, for AKS, upgrade your GPU Node pool to the latest version or \*-2022.06.08 or higher. For Arc enabled Kubernetes, enable feature gate DisableAcceleratorUsageMetrics=false in Kubelet configuration of the node and restart the Kubelet. Once the upstream changes reach GA, this fix will not longer work, make plans to migrate to using your GPU vendor specific metrics exporter by December 31, 2022.

## GPU performance charts 

Container insights includes pre-configured charts for the metrics listed earlier in the table as a GPU workbook for every cluster. See [Workbooks in Container insights](container-insights-reports.md) for a description of the workbooks available for Container insights.

## Next steps

- See [Use GPUs for compute-intensive workloads on Azure Kubernetes Service](../../aks/gpu-cluster.md) (AKS) to learn how to deploy an AKS cluster that includes GPU-enabled nodes.

- Learn more about [GPU Optimized VM SKUs in Microsoft Azure](../../virtual-machines/sizes-gpu.md).

- Review [GPU support in Kubernetes](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/) to learn more about Kubernetes experimental support for managing GPUs across one or more nodes in a cluster.
