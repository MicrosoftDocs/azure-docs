---
title: Monitor Azure Kubernetes Service (AKS) with Azure Monitor
description: Describes how to use Azure Monitor monitor the health and performance of  virtual machines and the workloads.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/02/2021

---

# Monitoring Azure Kubernetes Service (AKS) - Configuration

## Prerequisites

### Create Log Analytics workspace
The first step in any Azure Monitor implementation is creating one or more Log Analytics workspaces. The number that you create, their location, and their configuration will depend on your particular environment and business requirements. See [Create a Log Analytics workspace in the Azure portal](../logs/quick-create-workspace.md) for details on creating a workspace. See [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md) for criteria to consider when designing your workspace deployment. 

## Collect resource logs
The logs for AKS control plane components are implemented as [Azure resource logs](../essentials/resource-logs.md). See [Create diagnostic settings to send platform logs and metrics to different destinations](../essentials/diagnostic-settings.md) to create a diagnostic setting for your AKS cluster to send these logs to your Log Analytics workspace. 

When you create a diagnostic setting, you select one or categories that define which data is collected from the resource. 

Only specify log categories that you’ll use since you’ll incur ingestion and retention costs for any logs that you collect in the workspace. 

The following table provides a description of each of the logs that are available:

| Category | Description |
|:---|:---|
| cluster-autoscale | Understand why the AKS cluster is scaling up or down. In some cases it is expected, and in others it is not. It is also good to have this information to be able to correlate time intervals where something happened in the cluster. |
| guard | Managed Azure AD and Azure RBAC audits. For managed Azure AD: token in, user info out. For Azure RBAC: access reviews in and out. Use this information to understand 
kube-apiserver

kube-audit	Audit log data for every audit event, including get, list, create, update, delete, patch, and post.

kube-audit-admin	Subset of the kube-audit log category. Reduces the number of logs significantly by excluding the get and list audit events from the log.
kube-controller-manager
Gain deeper visibility of issues that may arise between Kubernetes and the Azure control plane. A typical example is the AKS cluster having a lack of permissions to interact with Azure in some manner
kube-scheduler

AllMetrics	Includes all platform metrics. Sends these values to Log Analytics workspace where it can be evaluated with other data using log queries.


## Next steps

* [Analyze monitoring data collected for virtual machines.](monitor-virtual-machine-analyze.md)
