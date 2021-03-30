---
title: Configure PV monitoring with Container insights | Microsoft Docs
description: This article describes how you can configure monitoring Kubernetes clusters with persistent volumes with Container insights.
ms.topic: conceptual
ms.date: 03/03/2021
---

# Configure PV monitoring with Container insights

Starting with agent version *ciprod10052020*, Azure Monitor for containers integrated agent now supports monitoring PV (persistent volume) usage. With agent version *ciprod01112021*, the agent supports monitoring PV inventory, including information about the status, storage class, type, access modes, and other details.
## PV metrics

Container insights automatically starts monitoring PV usage by collecting the following metrics at 60 -sec intervals and storing them in the **InsightMetrics** table.

|Metric name |Metric Dimension (tags) | Metric Description |
| `pvUsedBytes`|podUID, podName, pvcName, pvcNamespace, capacityBytes, clusterId, clusterName|Used space in bytes for a specific persistent volume with a claim used by a specific pod. `capacityBytes` is folded in as a dimension in the Tags field to reduce data ingestion cost and to simplify queries.|

Learn more about configuring collected PV metrics [here](./container-insights-agent-config.md).

## PV inventory

Azure Monitor for containers automatically starts monitoring PVs by collecting the following information at 60-sec intervals and storing them in the **KubePVInventory** table.

|Data |Data Source| Data Type| Fields|
|-----|-----------|----------|-------|
|Inventory of persistent volumes in a Kubernetes cluster |Kube API |`KubePVInventory` |	PVName, PVCapacityBytes, PVCName, PVCNamespace, PVStatus, PVAccessModes, PVType, PVTypeInfo, PVStorageClassName, PVCreationTimestamp, TimeGenerated, ClusterId, ClusterName, _ResourceId |

## Monitor Persistent Volumes

Azure Monitor for containers includes pre-configured charts for this usage metric and inventory information in workbook templates for every cluster. You can also enable a recommended alert for PV usage, and query these metrics in Log Analytics.  

### Workload Details Workbook

You can find usage charts for specific workloads in the Persistent Volume tab of the **Workload Details** workbook directly from an AKS cluster by selecting Workbooks from the left-hand pane, from the **View Workbooks** drop-down list in the Insights pane, or from the **Reports (preview) tab** in the Insights pane.


:::image type="content" source="./media/container-insights-persistent-volumes/pv-workload-example.PNG" alt-text="Azure Monitor PV workload workbook example":::

### Persistent Volume Details Workbook

You can find an overview of persistent volume inventory in the **Persistent Volume Details** workbook directly from an AKS cluster by selecting Workbooks from the left-hand pane, from the **View Workbooks** drop-down list in the Insights pane, or from the **Reports (preview)** tab in the Insights pane.


:::image type="content" source="./media/container-insights-persistent-volumes/pv-details-workbook-example.PNG" alt-text="Azure Monitor PV details workbook example":::

### Persistent Volume Usage Recommended Alert
You can enable a recommended alert to alert you when average PV usage for a pod is above 80%. Learn more about alerting [here](./container-insights-metric-alerts.md) and how to override the default threshold [here](./container-insights-metric-alerts.md#configure-alertable-metrics-in-configmaps).
## Next steps

- Learn more about collected PV metrics [here](./container-insights-agent-config.md).