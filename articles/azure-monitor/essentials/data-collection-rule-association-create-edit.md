---
title: Create and edit data collection rules associations (DCRAs) in Azure Monitor
description: Details on creating and editing data collection rule associations (DCRAs) in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 11/15/2023
ms.reviewer: nikeist
ms.custom: references_regions
---

# Create and edit data collection rule associations (DCRAs) in Azure Monitor
[Data collection rule associations (DCRAs)](./data-collection-rule-overview.md#data-collection-rule-associations-dcra) connect [data collection rules (DCRs)](./data-collection-rule-overview.md) to resources with monitoring data to collect. This article describes how to create and edit DCRAs in Azure Monitor.


## Automatic creation
There are several scenarios where DCRAs are automatically created for you when you create and configure a DCR. In these cases 

| Scenario | Description |
|:---|:---|
| [Enable VM insights on a VM or VMSS](../vm/vminsights-enable-overview.md) | When you enable VM insights on a VM, a DCR is created along with a DCRA associating that DCR with the VM. |
| [Enable Container insights on a Kubernetes cluster](../containers/kubernetes-monitoring-enable.md) | When you enable Container insights on a cluster, a DCR is created along with a DCRA associating that DCR with the cluster. |
| [Create a DCR for a VM in the Azure portal](../agents/azure-monitor-agent-data-collection.md) | When you create a DCR in the Azure portal, a DCRA is created for each machine that you add to **Resources**. |

## View and create DCRAs

### [Portal](#tab/portal)
You can use the preview DCR experience in the Azure portal to view DCRAs by DCR or by resource.

From the **Monitor** menu in the Azure portal, select **Data Collection Rules**. Click the banner at the top of the screen to use the preview experience.

### By DCR

In the **Data collection rules** view, the **Resource Count** shows the number of resources associated with the DCR. Click this number to open the **Resources** page for the DCR. This lists the resources associated with the DCR. Click **Add** to add additional resources. Select 

### By Resource

Using the **Resources** view, you can create new associations to one or more DCRs for a particular resource. Select the resource and then click **Associate to existing data collection rules**.

:::image type="content" source="media/data-collection-rule-view/resources-view-associate.png" alt-text="Screenshot of the create association button in the resources view in  the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/resources-view-associate.png":::

This opens a list of DCRs that can be associated with the current resource. This list only includes DCRs that are valid for the particular resource. For example, if the resource is a VM with the Azure Monitor agent (AMA) installed, only DCRs that process AMA data are listed. 

:::image type="content" source="media/data-collection-rule-view/resources-view-create-associations.png" alt-text="Screenshot of the create associations view in the resources view in the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/resources-view-create-associations.png":::

Click **Review & Associate** to create the association.


## CLI

## Azure policy


## Next steps

- [Read about the detailed structure of a data collection rule](data-collection-rule-structure.md)
- [Get details on transformations in a data collection rule](data-collection-transformations.md)
