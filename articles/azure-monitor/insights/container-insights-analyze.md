---
title: Monitor AKS cluster performance with Azure Monitor for containers | Microsoft Docs
description: This article describes how you can view and analyze the performance and log data with Azure Monitor for containers.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 
ms.assetid: 
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/12/2019
ms.author: magoedte
---

# Understand AKS cluster performance with Azure Monitor for containers 
With Azure Monitor for containers, you can use the performance charts and health status to monitor the workload of your Azure Kubernetes Service (AKS) clusters from two perspectives, directly from an AKS cluster or all AKS clusters in a subscription from Azure Monitor. Viewing Azure Container Instances (ACI) is also possible when you monitor a specific AKS cluster.

This article will help you understand the experience between the two perspectives, and how it helps you quickly assess, investigate, and resolve issues detected.

For information about enabling Azure Monitor for containers, see [Onboard Azure Monitor for containers](container-insights-onboard.md).

Azure Monitor provides a multi-cluster view showing the health status of all monitored AKS clusters running Linux and Windows Server 2019 deployed across resource groups in your subscriptions.  It shows AKS clusters discovered that are not monitored by the solution. Immediately you can understand cluster health, and from here you can drill down to the node and controller performance page, or navigate to see performance charts for the cluster.  For AKS clusters discovered and identified as unmonitored, you can enable monitoring for that cluster at any time.  

The main differences monitoring a Windows Server cluster with Azure Monitor for containers compared to a Linux cluster are the following:

- Memory RSS metric is not available for Windows node and containers.
- Disk storage capacity information is not available for Windows nodes.
- Live logs support is available with the exception of Windows container logs.
- Only pod environments are monitored, not Docker environments.
- With the preview release, a maximum of 30 Windows Server containers are supported. This limitation does not apply to Linux containers.  

## Sign in to the Azure portal
Sign in to the [Azure portal](https://portal.azure.com). 

## Multi-cluster view from Azure Monitor 
To view the health status of all AKS clusters deployed, select **Monitor** from the left-hand pane in the Azure portal.  Under the **Insights** section, select **Containers**.  

![Azure Monitor multi-cluster dashboard example](./media/container-insights-analyze/azmon-containers-multiview.png)

On the **Monitored clusters** tab, you are able to learn the following:

1. How many clusters are in a critical or unhealthy state, versus how many are healthy or not reporting (referred to as an unknown state)?
2. Are all of my [Azure Kubernetes Engine (AKS-engine)](https://github.com/Azure/aks-engine) deployments healthy?
3. How many nodes, user and system pods are deployed per cluster?
4. How much disk space is available and is there a capacity issue?

The health statuses included are: 

* **Healthy** – no issues detected for the VM and it is functioning as required. 
* **Critical** – one or more critical issues are detected, which need to be addressed in order to restore normal operational state as expected.
* **Warning** -  one or more issues are detected, which need to be addressed or the health condition could become critical.
* **Unknown** – if the service was not able to make a connection with the node or pod, the status changes to an unknown state.
* **Not found** - Either the workspace, the resource group, or subscription containing the workspace for this solution has been deleted.
* **Unauthorized** - User doesn’t have required permissions to read the data in the workspace.
* **Error** - Error occurred while attempting to read data from the workspace.
* **Misconfigured** - Azure Monitor for containers was not configured correctly in the specified workspace.
* **No data** - Data has not reported to the workspace in the last 30 minutes.

Health state calculates overall cluster status as *worst of* the three states with one exception – if any of the three states is *unknown*, overall cluster state will show **Unknown**.  

The following table provides a breakdown of the calculation controlling the health states for a monitored cluster on the multi-cluster view.

| |Status |Availability |  
|-------|-------|-----------------|  
|**User Pod**| | |  
| |Healthy |100% |  
| |Warning |90 - 99% |  
| |Critical |<90% |  
| |Unknown |If not reported in last 30 minutes |  
|**System Pod**| | |  
| |Healthy |100% |
| |Warning |N/A |
| |Critical |<100% |
| |Unknown |If not reported in last 30 minutes |
|**Node** | | |
| |Healthy |>85% |
| |Warning |60 - 84% |
| |Critical |<60% |
| |Unknown |If not reported in last 30 minutes |

From the list of clusters, you can drill down to the **Cluster** page by clicking on the name of the cluster, to the **Nodes** performance page by clicking on the rollup of nodes in the **Nodes** column for that specific cluster, or drill down to the **Controllers** performance page by clicking on the rollup of **User pods** or **System pods** column.   ​

## View performance directly from an AKS cluster
Access to Azure Monitor for containers is available directly from an AKS cluster by selecting **Insights** from the left-hand pane. Viewing information about your AKS cluster is organized into four perspectives:

- Cluster
- Nodes 
- Controllers  
- Containers

The default page opened when you click on **Insights** is **Cluster**, and it includes four line performance charts displaying key performance metrics of your cluster. 

![Example performance charts on the Cluster tab](./media/container-insights-analyze/containers-cluster-perfview.png)

The performance chart displays four performance metrics:

- **Node CPU Utilization&nbsp;%**: An aggregated perspective of CPU utilization for the entire cluster. You can filter the results for the time range by selecting **Avg**, **Min**, **Max**, **50th**, **90th**, and **95th** in the percentiles selector above the chart, either individually or combined. 
- **Node memory utilization&nbsp;%**: An aggregated perspective of memory utilization for the entire cluster. You can filter the results for the time range by selecting **Avg**, **Min**, **Max**, **50th**, **90th**, and **95th** in the percentiles selector above the chart, either individually or combined. 
- **Node count**: A node count and status from Kubernetes. Statuses of the cluster nodes represented are *All*, *Ready*, and *Not Ready* and can be filtered individually or combined in the selector above the chart. 
- **Activity pod count**: A pod count and status from Kubernetes. Statuses of the pods represented are *All*, *Pending*, *Running*, and *Unknown* and can be filtered individually or combined in the selector above the chart. 

You can use the left/right arrow keys to cycle through each data point on the chart and the up/down arrow keys to cycle through the percentile lines. Clicking on the pin icon at the upper right-hand corner of any one of the charts will pin the selected chart to the last Azure dashboard you last viewed. From the dashboard, you can resize and reposition the chart. Selecting the chart from the dashboard will redirect you to Azure Monitor for containers and load the correct scope and view.

Azure Monitor for containers also supports Azure Monitor [metrics explorer](../platform/metrics-getting-started.md), where you can create your own plot charts, correlate and investigate trends, and pin to dashboards. From metrics explorer, you can also use the criteria you have set to visualize your metrics as the basis of a [metric based alert rule](../platform/alerts-metric.md).  

## View container metrics in metrics explorer
In metrics explorer, you can view aggregated node and pod utilization metrics from Azure Monitor for containers. The following table summarizes the details to help you understand how to use the metric charts to visualize container metrics.

|Namespace | Metric |
|----------|--------|
| insights.container/nodes | |
| | cpuUsageMillicores |
| | cpuUsagePercentage |
| | memoryRssBytes |
| | memoryRssPercentage |
| | memoryWorkingSetBytes |
| | memoryWorkingSetPercentage |
| | nodesCount |
| insights.container/pods | |
| | PodCount |

You can apply [splitting](../platform/metrics-charts.md#apply-splitting-to-a-chart) of a metric to view it by dimension and visualize how different segments of it compare to each other. For a node, you can segment the chart by the *host* dimension, and from a pod you can segment it by the following dimensions:

* Controller
* Kubernetes namespace
* Node
* Phase

## Analyze nodes, controllers, and container health

When you switch to **Nodes**, **Controllers**, and **Containers** tab, automatically displayed on the right-side of the page is the property pane. It shows the properties of the item-selected, including labels you define to organize Kubernetes objects. When a Linux node is selected, it also shows under the section **Local Disk Capacity** available disk space and percent used for each disk presented to the node. Click on the **>>** link in the pane to view\hide the pane. 

![Example Kubernetes perspectives properties pane](./media/container-insights-analyze/perspectives-preview-pane-01.png)

As you expand the objects in the hierarchy, the properties pane updates based on the object selected. From the pane, you can also view Kubernetes events with pre-defined log searches by clicking on the **View Kubernetes event logs** link at the top of the pane. For more information about viewing Kubernetes log data, see [Search logs to analyze data](container-insights-log-search.md). While you are reviewing cluster resources, you can see container logs and events in real time. For more information about this feature and the configuration required to grant and control access, see [How to view logs real time with Azure Monitor for containers](container-insights-live-logs.md). 

Use the **+ Add Filter** option from the top of the page to filter the results for the view by **Service**, **Node**, **Namespace**, or **Node Pool** and after selecting the filter scope, you then select from one of the values shown in the **Select value(s)** field.  After the filter is configured, it is applied globally while viewing any perspective of the AKS cluster.  The formula only supports the equal sign.  You can add additional filters on top of the first one to further narrow your results.  For example, if you specified a filter by **Node**, your second filter would only allow you to select **Service** or **Namespace**.  

![Example using the filter to narrow down results](./media/container-insights-analyze/add-filter-option-01.png)

Specifying a filter in one tab continues to be applied when you select another and it is deleted after you click the **x** symbol next to the specified filter.   

Switch to the **Nodes** tab and the row hierarchy follows the Kubernetes object model, starting with a node in your cluster. Expand the node and you can view one or more pods running on the node. If more than one container is grouped to a pod, they are displayed as the last row in the hierarchy. You can also view how many non-pod related workloads are running on the host if the host has processor or memory pressure.

![Example Kubernetes Node hierarchy in the performance view](./media/container-insights-analyze/containers-nodes-view.png)

Windows Server containers running the Windows Server 2019 OS are shown after all of the Linux-based nodes in the list. When you expand a Windows Server node, you can view one or more pods and containers running on the node. When a node is selected, the properties pane shows version information, excluding agent information since Windows Server nodes do not have an agent installed.  

![Example Node hierarchy with Windows Server nodes listed](./media/container-insights-analyze/nodes-view-windows.png) 

Azure Container Instances Virtual Nodes running the Linux OS are shown after the last AKS cluster node in the list.  When you expand an ACI Virtual Node, you can view one or more ACI pods and containers running on the node.  Metrics are not collected and reported for nodes, only pods.

![Example Node hierarchy with Container Instances listed](./media/container-insights-analyze/nodes-view-aci.png)

From an expanded node, you can drill down from the pod or container running on the node to the controller to view performance data filtered for that controller. Click on the value under the **Controller** column for the specific node.   
![Example drill-down from node to controller in the performance view](./media/container-insights-analyze/drill-down-node-controller.png)

You can select controllers or containers at the top of the page and review the status and resource utilization for those objects.  If instead you want to review memory utilization, in the **Metric** drop-down list, select **Memory RSS** or **Memory working set**. **Memory RSS** is supported only for Kubernetes version 1.8 and later. Otherwise, you view values for **Min&nbsp;%** as *NaN&nbsp;%*, which is a numeric data type value that represents an undefined or unrepresentable value.

Memory working set shows both the resident memory and virtual memory (cache) included, and is a total of what the application is using. Memory RSS shows only main memory, which is the resident memory. This metric is showing the actual capacity of available memory.

![Container nodes performance view](./media/container-insights-analyze/containers-node-metric-dropdown.png)

By default, Performance data is based on the last six hours, but you can change the window by using the **TimeRange** option at the upper left. You can also filter the results within the time range by selecting **Avg**, **Min**, **Max**, **50th**, **90th**, and **95th** in the percentile selector. 

![Percentile selection for data filtering](./media/container-insights-analyze/containers-metric-percentile-filter.png)

When you mouse over the bar graph under the **Trend** column, each bar shows either CPU or memory usage, depending on which metric is selected, within a sample period of 15 minutes. After you select the trend chart through a keyboard, you can use the Alt+PageUp or Alt+PageDown keys to cycle through each bar individually and get the same details as you would on mouseover.

![Trend bar chart hover over example](./media/container-insights-analyze/containers-metric-trend-bar-01.png)    

In the next example, note for the first in the list - node *aks-nodepool1-*, the value for **Containers** is 9, which is a rollup of the total number of containers deployed.

![Rollup of containers per node example](./media/container-insights-analyze/containers-nodes-containerstotal.png)

It can help you quickly identify whether you have a proper balance of containers between nodes in your cluster. 

The information that's presented when you view Nodes is described in the following table:

| Column | Description | 
|--------|-------------|
| Name | The name of the host. |
| Status | Kubernetes view of the node status. |
| Avg&nbsp;%, Min&nbsp;%, Max&nbsp;%, 50th&nbsp;%, 90th&nbsp;% | Average node percentage based on percentile during the selected duration. |
| Avg, Min, Max, 50th, 90th | Average nodes actual value based on percentile during that time duration selected. The average value is measured from the CPU/Memory limit set for a node; for pods and containers it is the avg value reported by the host. |
| Containers | Number of containers. |
| Uptime | Represents the time since a node started or was rebooted. |
| Controllers | Only for containers and pods. It shows which controller it is residing in. Not all pods are in a controller, so some might display **N/A**. | 
| Trend Avg&nbsp;%, Min&nbsp;%, Max&nbsp;%, 50th&nbsp;%, 90th&nbsp;% | Bar graph trend represents the average percentile metric percentage of the controller. |

In the selector, select **Controllers**.

![Select controllers view](./media/container-insights-analyze/containers-controllers-tab.png)

Here you can view the performance health of your controllers and ACI Virtual Node controllers or Virtual Node pods not connected to a controller.

![<Name> controllers performance view](./media/container-insights-analyze/containers-controllers-view.png)

The row hierarchy starts with a controller and when you expand a controller, you view one or more pods.  Expand pod, and the last row displays the container grouped to the pod. From an expanded controller, you can drill down to the node it is running on to view performance data filtered for that node. ACI pods not connected to a controller are listed last in the list.

![Example Controllers hierarchy with Container Instances pods listed](./media/container-insights-analyze/controllers-view-aci.png)

Click on the value under the **Node** column for the specific controller.   

![Example drill down from node to controller in the performance view](./media/container-insights-analyze/drill-down-controller-node.png)

The information that's displayed when you view controllers is described in the following table:

| Column | Description | 
|--------|-------------|
| Name | The name of the controller.|
| Status | The rollup status of the containers when it has completed running with status, such as *OK*, *Terminated*, *Failed* *Stopped*, or *Paused*. If the container is running, but the status was either not properly displayed or was not picked up by the agent and has not responded more than 30 minutes, the status is *Unknown*. Additional details of the status icon are provided in the table below.|
| Avg&nbsp;%, Min&nbsp;%, Max&nbsp;%, 50th&nbsp;%, 90th&nbsp;% | Roll up average of the average percentage of each entity for the selected metric and percentile. |
| Avg, Min, Max, 50th, 90th  | Roll up of the average CPU millicore or memory performance of the container for the selected percentile. The average value is measured from the CPU/Memory limit set for a pod. |
| Containers | Total number of containers for the controller or pod. |
| Restarts | Roll up of the restart count from containers. |
| Uptime | Represents the time since a container started. |
| Node | Only for containers and pods. It shows which controller it is residing. | 
| Trend Avg&nbsp;%, Min&nbsp;%, Max&nbsp;%, 50th&nbsp;%, 90th&nbsp;%| Bar graph trend represents the average percentile metric of the controller. |

The icons in the status field indicate the online status of the containers:
 
| Icon | Status | 
|--------|-------------|
| ![Ready running status icon](./media/container-insights-analyze/containers-ready-icon.png) | Running (Ready)|
| ![Waiting or paused status icon](./media/container-insights-analyze/containers-waiting-icon.png) | Waiting or Paused|
| ![Last reported running status icon](./media/container-insights-analyze/containers-grey-icon.png) | Last reported running but hasn't responded more than 30 minutes|
| ![Successful status icon](./media/container-insights-analyze/containers-green-icon.png) | Successfully stopped or failed to stop|

The status icon displays a count based on what the pod provides. It shows the worst two states, and when you hover over the status, it displays a rollup status from all pods in the container. If there isn't a ready state, the status value displays **(0)**. 

In the selector, select **Containers**.

![Select containers view](./media/container-insights-analyze/containers-containers-tab.png)

Here you can view the performance health of your Azure Kubernetes and Azure Container Instances containers.  

![<Name> controllers performance view](./media/container-insights-analyze/containers-containers-view.png)

From a container, you can drill down to a pod or node to view performance data filtered for that object. Click on the value under the **Pod** or **Node** column for the specific container.   

![Example drill down from node to controller in the performance view](./media/container-insights-analyze/drill-down-controller-node.png)

The information that's displayed when you view containers is described in the following table:

| Column | Description | 
|--------|-------------|
| Name | The name of the controller.|
| Status | Status of the containers, if any. Additional details of the status icon are provided in the next table.|
| Avg&nbsp;%, Min&nbsp;%, Max&nbsp;%, 50th&nbsp;%, 90th&nbsp;% | The rollup of the average percentage of each entity for the selected metric and percentile. |
| Avg, Min, Max, 50th, 90th  | The rollup of the average CPU millicore or memory performance of the container for the selected percentile. The average value is measured from the CPU/Memory limit set for a pod. |
| Pod | Container where the pod resides.| 
| Node |  Node where the container resides. | 
| Restarts | Represents the time since a container started. |
| Uptime | Represents the time since a container was started or rebooted. |
| Trend Avg&nbsp;%, Min&nbsp;%, Max&nbsp;%, 50th&nbsp;%, 90th&nbsp;% | Bar graph trend represents the average percentile metric percentage of the container. |

The icons in the status field indicate the online statuses of pods, as described in the following table:
 
| Icon | Status |  
|--------|-------------|  
| ![Ready running status icon](./media/container-insights-analyze/containers-ready-icon.png) | Running (Ready)|  
| ![Waiting or paused status icon](./media/container-insights-analyze/containers-waiting-icon.png) | Waiting or Paused|  
| ![Last reported running status icon](./media/container-insights-analyze/containers-grey-icon.png) | Last reported running but hasn't responded in more than 30 minutes|  
| ![Terminated status icon](./media/container-insights-analyze/containers-terminated-icon.png) | Successfully stopped or failed to stop|  
| ![Failed status icon](./media/container-insights-analyze/containers-failed-icon.png) | Failed state |  

## Disk capacity workbook
Workbooks combine text, [log queries](../log-query/query-language.md), [metrics](../platform/data-platform-metrics.md), and parameters into rich interactive reports. Workbooks are editable by any other team members who have access to the same Azure resources.

Azure Monitor for containers includes a workbook to get you started, **Disk capacity**.  This workbook presents interactive disk usage charts for each disk presented to the node within a container by the following perspectives:

- Disk % usage for all disks
- Free disk space for all disks
- A table showing for each nodes disk, its % used space, trend of % used space, free disk space (GiB), and trend of free disk space (GiB). When a row is selected in the table, % used space and free disk space (GiB) is shown below 

You access this workbook by selecting **Disk capacity** from the **View Workbooks** drop-down list.  

![View Workbooks drop-down list](./media/container-insights-analyze/view-workbooks-dropdown-list.png)


## Next steps
- Review the [Create performance alerts with Azure Monitor for containers](container-insights-alerts.md) to learn how to create alerts for high CPU and memory utilization to support your DevOps or operational processes and procedures. 
- View [log query examples](container-insights-log-search.md#search-logs-to-analyze-data) to see pre-defined queries and examples to evaluate or customize for alerting, visualizing, or analyzing your clusters.
