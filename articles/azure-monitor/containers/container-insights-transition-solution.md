---
title: Transition from the Container Monitoring Solution to using Container Insights
ms.date: 8/29/2022
ms.topic: article
description: "Learn how to migrate from using the legacy OMS solution to monitoring your containers using Container Insights"
ms.reviewer: viviandiec
---

# Transition from the Container Monitoring Solution to using Container Insights

With both the underlying platform and agent deprecations, on March 31, 2025 the [Container Monitoring Solution](./containers.md) will be retired. If you use the Container Monitoring Solution to ingest data to your Log Analytics workspace, make sure to transition to using [Container Insights](./container-insights-overview.md) prior to that date.

## Steps to complete the transition

To transition to Container Insights, we recommend the following approach.

1. Learn about the feature differences between the Container Monitoring Solution and Container Insights to determine which option suits your needs.

2. To use Container Insights, you will need to migrate your workload to Kubernetes. You can find more information on the compatible Kubernetes platforms from [Azure Kubernetes Services (AKS)](../../aks/intro-kubernetes.md) or [Azure Arc enabled Kubernetes](../../azure-arc/kubernetes/overview.md). If using AKS, you can choose to [deploy Container Insights](./container-insights-enable-new-cluster.md) as a part of the process.

3. Disable the existing monitoring of the Container Monitoring Solution using one of the following options: [Azure portal](/previous-versions/azure/azure-monitor/insights/solutions?tabs=portal#remove-a-monitoring-solution), [PowerShell](/powershell/module/az.monitoringsolutions/remove-azmonitorloganalyticssolution), or [Azure CLI](/cli/azure/monitor/log-analytics/solution#az-monitor-log-analytics-solution-delete)
4. If you elected to not onboard to Container Insights earlier, you can then deploy Container Insights using Azure CLI, ARM, or Portal following the instructions for [AKS](./container-insights-enable-existing-clusters.md) or [Arc enabled Kubernetes](./container-insights-enable-arc-enabled-clusters.md)
5. Validate that the installation was successful for either your [AKS](./container-insights-enable-existing-clusters.md#verify-agent-and-solution-deployment) or [Arc](./container-insights-enable-arc-enabled-clusters.md#verify-extension-installation-status) cluster.


## Container Monitoring Solution vs Container Insights 

The following table highlights the key differences between monitoring using the Container Monitoring Solution versus Container Insights. Container Insights to that of the Container Monitoring Solution.

| Feature Differences  | Container Monitoring Solution | Container Insights |
| ------------------- | ----------------- | ------------------- |
| Onboarding | Multi-step installation using Azure Marketplace & configuring Log Analytics Agent | Single step onboarding via Azure portal, CLI, or ARM |
| Agent | Log Analytics Agent (deprecated in 2024) | [Azure Monitor Agent](../agents/azure-monitor-agent-overview.md)
| Alerting | Log based alerts tied to Log Analytics Workspace | Log based alerting and [recommended metric-based](./container-insights-metric-alerts.md) alerts |
| Metrics | Does not support Azure Monitor metrics | Supports Azure Monitor metrics |
| Consumption | Viewable only from Log Analytics Workspace | Accessible from both Azure Monitor and AKS/Arc resource pane |
| Agent | Manual agent upgrades | Automatic updates for monitoring agent with version control through Azure Arc cluster extensions |

## Next steps

- [Disable Container Monitoring Solution](./containers.md#removing-solution-from-your-workspace)
- [Deploy an Azure Kubernetes Service](./container-insights-enable-new-cluster.md)
- [Connect your cluster](../../azure-arc/kubernetes/quickstart-connect-cluster.md) to the Azure Arc enabled Kubernetes platform
- Configure Container Insights for [Azure Kubernetes Service](./container-insights-enable-existing-clusters.md) or [Arc enabled Kubernetes](./container-insights-enable-arc-enabled-clusters.md) 
