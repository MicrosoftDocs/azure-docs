---
title: Monitor Azure Kubernetes Service (AKS) with Azure Monitor
description: Describes how to use Azure Monitor monitor the health and performance of AKS clusters and their workloads.
ms.service:  azure-monitor
ms.custom: ignite-2022
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/08/2023
---

# Monitor Azure Kubernetes Service (AKS)


## Access Azure Monitor features

Access Azure Monitor features for all AKS clusters in your subscription from the **Monitoring** menu in the Azure portal, or for a single AKS cluster from the **Monitor** section of the **Kubernetes services** menu. The following image shows the **Monitoring** menu for your AKS cluster:

:::image type="content" source="media/monitor-aks/monitoring-menu.png" alt-text="AKS Monitoring menu" lightbox="media/monitor-aks/monitoring-menu.png":::

| Menu option | Description |
|:---|:---|
| Insights | Opens Container Insights for the current cluster. Select **Containers** from the **Monitor** menu to open Container Insights for all clusters.  |
| Alerts | Views alerts for the current cluster. |
| Metrics | Open metrics explorer with the scope set to the current cluster. |
| Diagnostic settings | Create diagnostic settings for the cluster to collect resource logs. |
| Advisor | Recommendations for the current cluster from Azure Advisor. |
| Logs | Open Log Analytics with the scope set to the current cluster to analyze log data and access prebuilt queries. |
| Workbooks | Open workbook gallery for Kubernetes service. |


## Next steps

- For more information about AKS metrics, logs, and other important values, see [Monitoring AKS data reference](monitor-aks-reference.md).
