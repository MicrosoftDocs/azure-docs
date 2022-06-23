---
title: Enable Azure Monitor for single virtual machine or virtual machine scale set in the Azure portal
description: Learn how to enable VM insights on a single Azure virtual machine or virtual machine scale set using the Azure portal.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/08/2022

---

# Enable VM insights on virtual machine or virtual machine scale set in the Azure portal
This article describes how to enable VM insights for the following using the Azure portal:

- Azure virtual machine
- Azure virtual machine scale set
- Hybrid virtual machine connected with Azure Arc

## Prerequisites

- [Create a Log Analytics workspace](./vminsights-configure-workspace.md). You can create a new workspace during this process, but you should use an existing workspace if you already have one.
- See [Supported operating systems](./vminsights-enable-overview.md#supported-operating-systems) to ensure that the operating system of the virtual machine or virtual machine scale set you're enabling is supported. 


> [!NOTE]
> This process describes enabling VM insights from the **Monitor** menu in the Azure portal. You can perform the same process from the **Insights** menu for a particular virtual machine or virtual machine scale set.
 
## Enable VM insights for unmonitored machines
Use this process to enable VM insights are machines that are not currently being monitored. The following example shows an Azure virtual machine, but the menu is similar for Azure virtual machine scale set or Azure Arc.

From the Azure portal, select the **Monitor** menu and then **Virtual Machines**. Select the **Overview** page and then **Not Monitered**. Click the **Enable** button next to any machine that you want to enable. If a machine is currently running, then you must start it to enable it.

:::image type="content" source="media/vminsights-enable-portal/enable-unmonitored.png" lightbox="media/vminsights-enable-portal/enable-unmonitored.png" alt-text="Screenshot with unmonitored machines in V M insights":::
 
Click **Enable** on the introduction page to view the configuration. The **Monitoring configuration** page allows you to select whether you will use the **Azure Monitor agent** or the **Log Analytics agent**. Azure Monitor agent is strongly recommended because of its considerable advantages. The Log Analytics agent is on a deprection path as described in [Log Analytics agent overview](../agents/log-analytics-agent).

### Azure Monitor agent
If you select Azure Monitor agent, you need to specify a data collection rule to use. The data collection rule specifies the data to collect and the Log Analytics workspace the agent will use.

VM insights will create a default data collection rule if one doesn't already exist. This DCR will collect **Guest performance** and **Process and dependencies** You can't modify this DCR from this screen. See [Configure data collection for the Azure Monitor agent](../agents/data-collection-rule-azure-monitor-agent.md) for details on modifying a DC

:::image type="content" source="media/vminsights-enable-portal/enable-unmonitored-configure-azure-monitor-agent.png" lightbox="media/vminsights-enable-portal/enable-unmonitored-configure-azure-monitor-agent.png" alt-text="Screenshot with unmonitored machines in V M insights":::

Click **Configure** to save the configuration. You will receive status messages as the configuration is performed.

### Log Analytics agent
If you select Log Analytics agent, you only need to specify the Log Analytics workspace that the agent will use. VM insights will configure the data to collect.

If the virtual machine isn't already connected to a Log Analytics workspace, then you'll be prompted to select one. If you haven't previously [created a workspace](../logs/quick-create-workspace.md), then you can select a default for the location where the virtual machine or virtual machine scale set is deployed in the subscription. This workspace will be created and configured if it doesn't already exist. If you select an existing workspace, it will be configured for VM insights if it wasn't already.

> [!NOTE]
> If you select a workspace that wasn't previously configured for VM insights, the *VMInsights* management pack will be added to this workspace. This will be applied to any agent already connected to the workspace, whether or not it's enabled for VM insights. Performance data will be collected from these virtual machines and stored in the *InsightsMetrics* table.

:::image type="content" source="media/vminsights-enable-portal/enable-unmonitored-configure-log-analytics-agent.png" lightbox="media/vminsights-enable-portal/enable-unmonitored-configure-log-analytics-agent.png" alt-text="Screenshot with unmonitored machines in V M insights":::

Click **Configure** to save the configuration. You will receive status messages as the configuration is performed.


>[!NOTE]
>If you use a manual upgrade model for your virtual machine scale set, upgrade the instances to complete the setup. You can start the upgrades from the **Instances** page, in the **Settings** section.




## Next steps

* See [Use VM insights Map](vminsights-maps.md) to view discovered application dependencies. 
* See [View Azure VM performance](vminsights-performance.md) to identify bottlenecks, overall utilization, and your VM's performance.
