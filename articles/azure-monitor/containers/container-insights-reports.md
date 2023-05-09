---
title: Reports in Container insights
description: This article describes reports that are available to analyze data collected by Container insights.
ms.topic: conceptual
ms.date: 05/24/2022
ms.reviewer: aul
---

# Reports in Container insights
Reports in Container insights are recommended out-of-the-box for [Azure workbooks](../visualize/workbooks-overview.md). This article describes the different reports that are available and how to access them.

## View reports
On the **Azure Monitor** menu in the Azure portal, select **Containers**. In the **Monitoring** section, select **Insights**, choose a particular cluster, and then select the **Reports** tab.

[![Screenshot that shows the Reports page.](media/container-insights-reports/reports-page.png)](media/container-insights-reports/reports-page.png#lightbox)

## Create a custom workbook
To create a custom workbook based on any of these workbooks, select the **View Workbooks** dropdown list and then select **Go to AKS Gallery** at the bottom of the list. For more information about workbooks and using workbook templates, see [Azure Monitor workbooks](../visualize/workbooks-overview.md).

[![Screenshot that shows the AKS gallery.](media/container-insights-reports/aks-gallery.png)](media/container-insights-reports/aks-gallery.png#lightbox)

## Node Monitoring workbooks

- **Disk Capacity**: Interactive disk usage charts for each disk presented to the node within a container by the following perspectives:

    - Disk percent usage for all disks.
    - Free disk space for all disks.
    - A grid that shows each node's disk, its percentage of used space, trend of percentage of used space, free disk space (GiB), and trend of free disk space (GiB). When a row is selected in the table, the percentage of used space and free disk space (GiB) is shown underneath the row.

- **Disk IO**: Interactive disk utilization charts for each disk presented to the node within a container by the following perspectives:

    - Disk I/O is summarized across all disks by read bytes/sec, writes bytes/sec, and read and write bytes/sec trends.
    - Eight performance charts show key performance indicators to help measure and identify disk I/O bottlenecks.

- **GPU**: Interactive GPU usage charts for each GPU-aware Kubernetes cluster node.

>[!NOTE]
> In accordance with the Kubernetes [upstream announcement](https://kubernetes.io/blog/2020/12/16/third-party-device-metrics-reaches-ga/#nvidia-gpu-metrics-deprecated), GPU metrics collection will be disabled out of the box. For instructions on how to continue collecting your GPU metrics, see [Configure GPU monitoring with Container insights](./container-insights-gpu-monitoring.md).

- **Subnet IP Usage**: Interactive IP usage charts for each node within a cluster by the following perspectives:
 
    - IPs allocated from subnet.
    - IPs assigned to a pod.

>[!NOTE]
> By default 16 IP's are allocated from subnet to each node. This cannot be modified to be less than 16. For instructions on how to enable subnet IP usage metrics, see [Monitor IP Subnet Usage](../../aks/configure-azure-cni-dynamic-ip-allocation.md#monitor-ip-subnet-usage).

## Resource Monitoring workbooks

- **Deployments**: Status of your deployments and horizontal pod autoscaler (HPA) including custom HPAs.
- **Workload Details**: Interactive charts that show performance statistics of workloads for a namespace. Includes the following multiple tabs:

  - **Overview** of CPU and memory usage by pod.
  - **POD/Container Status** showing pod restart trend, container restart trend, and container status for pods.
  - **Kubernetes Events** showing a summary of events for the controller.

- **Kubelet**: Includes two grids that show key node operating statistics:

    - Overview by node grid summarizes total operation, total errors, and successful operations by percent and trend for each node.
    - Overview by operation type summarizes for each operation the total operation, total errors, and successful operations by percent and trend.

## Billing workbook

- **Data Usage**: Helps you to visualize the source of your data without having to build your own library of queries from what we share in our documentation. In this workbook, you can view charts that present billable data such as:

  - Total billable data ingested in GB by solution.
  - Billable data ingested by Container logs (application logs).
  - Billable container logs data ingested per by Kubernetes namespace.
  - Billable container logs data ingested segregated by Cluster name.
  - Billable container log data ingested by log source entry.
  - Billable diagnostic data ingested by diagnostic main node logs.

## Networking workbooks

- **NPM Configuration**: Monitoring of your network configurations, which are configured through the network policy manager (npm) for the:

  - Summary information about overall configuration complexity.
  - Policy, rule, and set counts over time, allowing insight into the relationship between the three and adding a dimension of time to debugging a configuration.
  - Number of entries in all IPSets and each IPSet.
  - Worst and average case performance per node for adding components to your Network Configuration.

- **Network**: Interactive network utilization charts for each node's network adapter. A grid presents the key performance indicators to help measure the performance of your network adapters.

## Next steps

For more information about workbooks in Azure Monitor, see [Azure Monitor workbooks](../visualize/workbooks-overview.md).
