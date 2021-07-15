---
title: Monitor Azure Kubernetes Service (AKS) with Azure Monitor - Configure
description: Describes how to configure AKS clusters for monitoring in Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/02/2021

---

# Monitoring Azure Kubernetes Service (AKS) - Configuration
This article is part of the Monitoring AKS in Azure Monitor scenario. It describes how to configure monitoring for your AKS cluster.
## Create Log Analytics workspace
The first step in any Azure Monitor implementation is creating one or more Log Analytics workspaces. The number that you create, their location, and their configuration will depend on your particular environment and business requirements. 

See [Create a Log Analytics workspace in the Azure portal](../logs/quick-create-workspace.md) for details on creating a workspace. See [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md) for criteria to consider when designing your workspace deployment. 


## Enable container insights
[Container insights](container-insights-overview.md) is a feature of Azure Monitor that monitors the performance of managed Kubernetes clusters hosted on AKS in addition to other cluster configurations. Enabling Container insights for your cluster deploys a containerized version of the Log Analytics agent that sends data to Logs and Metrics.

See [New AKS cluster](container-insights-enable-new-cluster.md) to enable container insights when a cluster is created. See [Existing AKS cluster](container-insights-enable-existing-clusters.md) to enable container insights for an existing cluster.


## Configure collection from Prometheus
Container insights allows you to collect Prometheus metrics into your Log Analytics workspace without requiring a Prometheus server. See [Configure scraping of Prometheus metrics with Container insights](container-insights-prometheus-integration.md#view-prometheus-metrics-in-grafana) for details on performing this configuration.


## Collect resource logs
The logs for AKS control plane components are implemented in Azure as [Azure resource logs](../essentials/resource-logs.md). See [Create diagnostic settings to send platform logs and metrics to different destinations](../essentials/diagnostic-settings.md) to create a diagnostic setting for your AKS cluster to send these logs to your Log Analytics workspace. 

When you create a diagnostic setting, you select one or categories that define which data is collected from the resource. The following table lists the categories for AKS clusters and which Kubernetes logs they represent. Only specify log categories that you’ll use since you’ll incur ingestion and retention costs for any logs that you collect in the workspace. 


| Category                | Description |
|:---|:---|
| cluster-autoscale       | Understand why the AKS cluster is scaling up or down, which may not be expected. This information is also useful to correlate time intervals where something interesting may have happened in the cluster. |
| guard                   | Managed Azure Active Directory and Azure RBAC audits. For managed Azure AD, this includes token in and user info out. For Azure RBAC, this includes access reviews in and out. |
| kube-apiserver          | |
| kube-audit              | Audit log data for every audit event including get, list, create, update, delete, patch, and post. |
| kube-audit-admin        | Subset of the kube-audit log category. Significanly reduces the number of logs by excluding the get and list audit events from the log. |
| kube-controller-manager | Gain deeper visibility of issues that may arise between Kubernetes and the Azure control plane. A typical example is the AKS cluster having a lack of permissions to interact with Azure. |
| kube-scheduler          | |
| AllMetrics              | Includes all platform metrics. Sends these values to Log Analytics workspace where it can be evaluated with other data using log queries.


## Next steps

* [Analyze monitoring data collected for AKS clusters.](monitor-aks-analyze.md)
