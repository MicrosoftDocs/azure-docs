---
title: Overview of Azure Monitor for containers | Microsoft Docs
description: This article describes Azure Monitor for containers that monitors AKS Container Insights solution and the value it delivers by monitoring the health of your AKS clusters and Container Instances in Azure.
ms.service:  azure-monitor
ms.subservice: 
ms.topic: conceptual
author: mgoedtel
ms.author: magoedte
ms.date: 10/15/2019

---

# Azure Monitor for containers overview

Azure Monitor for containers is a feature designed to monitor the performance of container workloads deployed to either Azure Container Instances, managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS), or self-managed Kubernetes clusters hosted on Azure Stack. Monitoring your containers is critical, especially when you're running a production cluster, at scale, with multiple applications.

Azure Monitor for containers gives you performance visibility by collecting memory and processor metrics from controllers, nodes, and containers that are available in Kubernetes through the Metrics API. Container logs are also collected.  After you enable monitoring from Kubernetes clusters, metrics and logs are automatically collected for you through a containerized version of the Log Analytics agent for Linux. Metrics are written to the metrics store and log data is written to the logs store associated with your [Log Analytics](../log-query/log-query-overview.md) workspace. 

![Azure Monitor for containers architecture](./media/container-insights-overview/azmon-containers-architecture-01.png)
 
## What does Azure Monitor for containers provide?

Azure Monitor for containers delivers a comprehensive monitoring experience using different features of Azure Monitor enabling you to understand the performance and health of your Kubernetes cluster and the container workloads. With Azure Monitor for containers you can:

* Identify AKS containers that are running on the node and their average processor and memory utilization. This knowledge can help you identify resource bottlenecks.
* Identify processor and memory utilization of container groups and their containers hosted in Azure Container Instances.  
* Identify where the container resides in a controller or a pod. This knowledge can help you view the controller's or pod's overall performance. 
* Review the resource utilization of workloads running on the host that are unrelated to the standard processes that support the pod.
* Understand the behavior of the cluster under average and heaviest loads. This knowledge can help you identify capacity needs and determine the maximum load that the cluster can sustain. 
* Configure alerts to proactively notify you or record it when CPU and memory utilization on nodes or containers exceed your thresholds, or when a health state change occurs in the cluster at the infrastructure, nodes, or workload health rollup.
* Integrate with [Prometheus](https://prometheus.io/docs/introduction/overview/) to view application and workload metrics it collects from nodes and Kubernetes using [queries](container-insights-log-search.md) to create custom alerts, dashboards, and detailed perform detailed analysis.

    >[!NOTE]
    >Support for Prometheus is a feature in public preview at this time.
    >

* Monitor container workloads [deployed to AKS Engine](https://github.com/microsoft/OMS-docker/tree/aks-engine) on-premises and [AKS Engine on Azure Stack](https://docs.microsoft.com/azure-stack/user/azure-stack-kubernetes-aks-engine-overview?view=azs-1908).

Check out the following video providing an intermediate level deep dive to help you learn about monitoring your AKS cluster with Azure Monitor for containers.

> [!VIDEO https://www.youtube.com/embed/RjsNmapggPU]

## How do I access this feature?

You can access Azure Monitor for containers two ways, from Azure Monitor or directly from the selected AKS cluster. From Azure Monitor, you have a global perspective of all the containers deployed, which are monitored and which are not, allowing you to search and filter across your subscriptions and resource groups, and then drill into Azure Monitor for containers from the selected container.  Otherwise, you can access the feature directly from a selected AKS container from the AKS page.  

![Overview of methods to access Azure Monitor for containers](./media/container-insights-overview/azmon-containers-experience.png)

If you are interested in monitoring and managing your Docker and Windows container hosts running outside of AKS to view configuration, audit, and resource utilization, see the [Container Monitoring solution](../../azure-monitor/insights/containers.md).

## Next steps

- To begin monitoring your AKS cluster, review [How to enable the Azure Monitor for containers](container-insights-onboard.md) to understand the requirements and available methods to enable monitoring. 

- To begin monitoring AKS Engine on Azure Stack or Kubernetes deployed on-premises, review [Configure Hybrid Kubernetes clusters with Azure Monitor for containers](container-insights-hybrid-setup.md).  
