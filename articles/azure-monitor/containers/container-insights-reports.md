---
title: Reports in Container insights
description: Describes reports available to analyze data collected by Container insights.
ms.topic: conceptual
ms.date: 03/02/2021
---

# Reports in Container insights
Reports in Container insights are recommended out-of-the-box [Azure workbooks](../visualize/workbooks-overview.md). This article describes the different reports that are available and how to access them.

## Viewing reports
From the **Azure Monitor** menu in the Azure portal, select **Containers**. Select **Insights** in the **Monitoring** section, choose a particular cluster, and then select the **Reports** page. 

[![Reports page](media/container-insights-reports/reports-page.png)](media/container-insights-reports/reports-page.png#lightbox)

## Create a custom workbook
To create a custom workbook based on any of these workbooks, select the **View Workbooks** dropdown and then **Go to AKS Gallery** at the bottom of the dropdown. See [Azure Monitor Workbooks](../visualize/workbooks-overview.md) for more information about workbooks and using workbook templates.

[![AKS gallery](media/container-insights-reports/aks-gallery.png)](media/container-insights-reports/aks-gallery.png#lightbox)

## Node workbooks

- **Disk capacity**: Interactive disk usage charts for each disk presented to the node within a container by the following perspectives:

    - Disk percent usage for all disks.
    - Free disk space for all disks.
    - A grid that shows each node's disk, its percentage of used space, trend of percentage of used space, free disk space (GiB), and trend of free disk space (GiB). When a row is selected in the table, the percentage of used space and free disk space (GiB) is shown underneath the row.

- **Disk IO**: Interactive disk utilization charts for each disk presented to the node within a container by the following perspectives:

    - Disk I/O summarized across all disks by read bytes/sec, writes bytes/sec, and read and write bytes/sec trends.
    - Eight performance charts show key performance indicators to help measure and identify disk I/O bottlenecks.

- **GPU**: Interactive GPU usage charts for each GPU-aware Kubernetes cluster node.

## Resource Monitoring workbooks

- **Deployments**: Status of your deployments & Horizontal Pod Autoscaler(HPA) including custom HPA. 
  
- **Workload Details**: Interactive charts showing performance statistics of workloads for a namespace. Includes multiple tabs:

  - Overview of CPU and Memory usage by POD.
  - POD/Container Status showing POD restart trend, container restart trend, and container status for PODs.
  - Kubernetes Events showing summary of events for the controller.

- **Kubelet**: Includes two grids that show key node operating statistics:

    - Overview by node grid summarizes total operation, total errors, and successful operations by percent and trend for each node.
    - Overview by operation type summarizes for each operation the total operation, total errors, and successful operations by percent and trend.
## Billing workbooks

- **Data Usage**: Helps you to visualize the source of your data without having to build your own library of queries from what we share in our documentation. In this workbook, there are charts with which you can view billable data from such perspectives as:

  - Total billable data ingested in GB by solution
  - Billable data ingested by Container logs(application logs)
  - Billable container logs data ingested per by Kubernetes namespace
  - Billable container logs data ingested segregated by Cluster name
  - Billable container log data ingested by log source entry
  - Billable diagnostic data ingested by diagnostic master node logs

## Networking workbooks

- **NPM Configuration**:  Monitoring of your Network configurations which are configured through Network policy manager (NPM).

  - Summary information about overall configuration complexity.
  - Policy, rule, and set counts over time, allowing insight into the relationship between the three and adding a dimension of time to debugging a configuration.
  - Number of entries in all IPSets and each IPSet.
  - Worst and average case performance per node for adding components to your Network Configuration.

- **Network**: Interactive network utilization charts for each node's network adapter, and a grid presents the key performance indicators to help measure the performance of your network adapters.



## Next steps

- See [Azure Monitor Workbooks](../visualize/workbooks-overview.md) for details about workbooks in Azure Monitor.
