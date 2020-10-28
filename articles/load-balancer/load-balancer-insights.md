---
title: Insights for Azure Load Balancer
description: Use the load balancer insights to achieve rapid fault localization and informed design decisions
services: load-balancer
documentationcenter: na
author: erichrt
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/27/2020
ms.author: errobin
---

# Using Insights to monitor and configure your Azure Load Balancer

Through [Azure Monitor for Networks](https://docs.microsoft.com/azure/azure-monitor/insights/insights-overview#azure-monitor-for-networks-preview) you are provided functional dependency visualizations and pre-configured metrics dashboard for your Load Balancers. This enables you to make informed design decisions and rapidly localize, diagnose, and resolve any faults.

>[!NOTE] 
>Please note this feature is in Preview and the functional dependency view and preconfigured dashboard may change to improve this experience

>[!IMPORTANT]
>The Standard Load Balancer is required to see metrics from the Load Balancer namespace in the pre-configured metrics dashboard. You will still be able to see metrics from the VM, VMSS, and Connection Monitor namespaces however, we recommend [upgrading to Standard](https://docs.microsoft.com/azure/load-balancer/upgrade-basic-standard) for any production workloads to take advantage of the robust set of Load Balancer metrics.

## Functional dependency view

The functional dependency view will enable you to picture even the most complex load balancer setups. With visual feedback on Load Balancing rules, Inbound NAT rules, and backend pool resources, you can make updates while keeping a complete picture of your configuration in mind.

You can access this view by visiting the Insights sub-blade of your Load Balancer.

:::image type="content" source="./media/load-balancer-insights/load-balancer-functional-dependency-visual.png" alt-text="Depecition of the functional dependency view. The frontend of the load balancer can be seen connecting to the backend pool members via the rules configured. For Standard the lines from load-balancing rules to the backend pool instances are color-coded based on health probe status." border="true":::

For Standard Load Balancers, your backend pool resources are color-coded with Health Probe status empowering you to visualize the current availability of your network to serve traffic. Alongside the above topology you are presented with a time-wise graph of health status, giving a snapshot view of the health of your application.

## Metrics dashboard

From the Insights sub-blade of your Load Balancer you can select More Detailed Metrics to view a pre-configured [Azure Monitor Workbook](https://docs.microsoft.com/azure/azure-monitor/platform/workbooks-overview) containing metrics visuals  relevant to specific aspects of your Load Balancer. This dashboard will show the Load Balancer status and links to relevant documentation at the top of the page.

By default, you will be presented with the Overview tab. You can navigate through the available tabs each of which contain visuals relevant to a specific aspect of your Load Balancer. 

The dashboard tabs currently available are Overview, Frontend and Backend Availability, Data Throughput, Flow Distribution, Connection Monitors, and Metric Definitions. Explicit guidance for each is available at the bottom of the tab.

### Overview tab
The Overview tab contains a searchable grid you can use to check the overall Data Path Availability and Health Probe Status for each of the Frontend IPs attached to your Load Balancer. These metrics indicate whether the Frontend IP is responsive and the compute instances in your Backend Pool are individually responsive to inbound connections.

You can also view the overall data throughput for each Frontend IP on this page to get a sense of whether you are producing and receive expected traffic levels. The guidance at the bottom of the page will direct you to the appropriate tab should you see any irregular values.

### Frontend and Backend Availability tab
The Frontend and Backend Availability tabs show the Data Path Throughput and Health Probe Status metrics presented in a few useful views. The first graph shows the aggregate value so you can determine whether there is an issue, the rest of the graphs show these metrics split by various dimensions so that you can troubleshoot and identify the sources of any inbound availability issues.

A workflow for viewing these graphs is provided at the bottom of the page with common causes for various symptoms. 

### Data Throughput tab
The Data Throughput tab allows you to review your total inbound and outbound Data Throughput to identify if your traffic patterns are as expected. It will show the total inbound and outbound data throughput split by Frontend IP and Frontend Port so that you can identify if how the services you have running are performing individually.

### Flow Distribution
The Flow Distribution Tab will help you visualize and manage the number of flows your backend resources instances are receiving and producing. It shows the Flow Creation Rate and Flow Count for inbound and outbound traffic as well as the Network Traffic each VM and VMSS instance is receiving. 

This can give you feedback on whether your Load Balancer configuration or traffic patterns are leading to imbalanced traffic, for example, if you have session affinity configured and a single client is making a disproportionate number of requests. It will also let you know if you are approach the [per VM flow limit](https://docs.microsoft.com/azure/virtual-network/virtual-machine-network-throughput#flow-limits-and-recommendations) for your machine size.

### Connection Monitors
The Connection Monitors tab will show you the round-trip latency on a global map for all of the [Connection Monitors](https://docs.microsoft.com/azure/network-watcher/connection-monitor)  you have configured. This is useful information for services with strict latency requirements and can inform whether you need to add additional region deployments or  move to a [cross-regional load balancing](https://docs.microsoft.com/azure/load-balancer/cross-region-overview) model

### Metric Definitions
The Metric Definitions tab contains all the information shown in the [Multi-dimensional Metrics article](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-diagnostics#multi-dimensional-metrics).

## Next Steps
* Review the dashboard and provide feedback using the below link if there is anything that can be improved
* [Review the metrics documentation to ensure you understand how each metric is calculated](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-diagnostics#multi-dimensional-metrics)
* [Create Connection Monitors for your Load Balancer](https://docs.microsoft.com/azure/network-watcher/connection-monitor)
* [Create your own workbooks](https://docs.microsoft.com/azure/azure-monitor/platform/workbooks-overview), you can take inspiration by clicking on the edit button in your detailed metrics dashboard
