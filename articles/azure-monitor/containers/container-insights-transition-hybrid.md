---
title: "Transition to using Container Insights on Azure Arc-enabled Kubernetes clusters"
ms.date: 04/05/2021
ms.topic: article
author: austonli
ms.author: aul
description: "Learn how to migrate from using script-based hybrid monitoring solutions to Container Insights on Azure Arc-enabled Kubernetes clusters"
ms.reviewer: aul
---

# Transition to using Container Insights on Azure Arc-enabled Kubernetes

On May 31, 2022 Container Insights support for Azure Red Hat OpenShift v4.x will be retired. If you use the script-based model of Container Insights for Azure Red Hat OpenShift v4.x, make sure to transition to Container Insights on [Azure Arc enabled Kubernetes](./container-insights-enable-arc-enabled-clusters.md) prior to that date.

## Steps to complete the transition

To transition to Container Insights on Azure Arc enabled Kubernetes, we recommend the following approach.

1. Learn about the feature differences between Container Insights with Azure Red Hat OpenShift v4.x and Azure Arc enabled Kubernetes
2. [Disable your existing monitoring](./container-insights-optout-openshift-v4.md) for your Azure Red Hat OpenShift cluster
3. Read documentation on the [Azure Arc enabled Kubernetes cluster extensions](../../azure-arc/kubernetes/extensions.md) and the [Container Insights onboarding prerequisites](./container-insights-enable-arc-enabled-clusters.md#prerequisites) to understand the requirements
4. [Connect your cluster](../../azure-arc/kubernetes/quickstart-connect-cluster.md) to Azure Arc enabled Kubernetes platform
5. [Turn on Container Insights](./container-insights-enable-arc-enabled-clusters.md) for Azure Arc enabled Kubernetes using Azure portal, CLI, or ARM.
6. [Validate](./container-insights-enable-arc-enabled-clusters.md#verify-extension-installation-status) the current configuration is working

## Container Insights on Azure Red Hat OpenShift v4.x vs Azure Arc enabled Kubernetes

The following table highlights the key differences between monitoring using the Azure Red Hat OpenShift v4.x script versus through Azure Arc enabled Kubernetes cluster extensions. Container Insights on Azure Arc enabled Kubernetes offers a substantial upgrade to that on Azure Red Hat OpenShift v4.x.

| Feature Differences  | Azure Red Hat OpenShift v.4x monitoring | Azure Arc enabled Kubernetes monitoring |
| ------------------- | ----------------- | ------------------- |
| Onboarding | Manual script-based installation only | Single click onboarding using Azure Arc cluster extensions via Azure portal, CLI, or ARM |
| Alerting | Log based alerts only | Log based alerting and [recommended metric-based](./container-insights-metric-alerts.md) alerts |
| Metrics | Does not support Azure Monitor metrics | Supports Azure Monitor metrics |
| Consumption | Viewable only from Azure Monitor blade | Accessible from both Azure Monitor and Azure Arc enabled Kubernetes resource blade |
| Agent | Manual agent upgrades | Automatic updates for monitoring agent with version control through Azure Arc cluster extensions |
| Feature parity | No additional updates beyond May 2022 | First class parity and updates inline with Container Insights on AKS |

## Next steps

- [Disable existing monitoring](./container-insights-optout-openshift-v4.md) for your Azure Red Hat OpenShift v4.x cluster 
- [Connect your cluster](../../azure-arc/kubernetes/quickstart-connect-cluster.md)  to the Azure Arc enabled Kubernetes platform
- [Configure Container Insights](./container-insights-enable-arc-enabled-clusters.md) on Azure Arc enabled Kubernetes
