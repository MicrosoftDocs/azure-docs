---
title: 'Tutorial: Collect guest logs and metrics from an Azure virtual machine'
description: Create a data collection rule to collect guest logs and metrics from Azure virtual machine.
ms.service: azure-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 09/28/2023
ms.reviewer: Xema Pathak
---

# Tutorial: Collect guest logs and metrics from an Azure virtual machine
To monitor the guest operating system and workloads on an Azure virtual machine, install [Azure Monitor Agent](../agents/azure-monitor-agent-overview.md) and create a [data collection rule (DCR)](../essentials/data-collection-rule-overview.md) that specifies which data to collect. VM insights installs the agent and collection performance data, but you need to create more DCRs to collect log data such as Windows event logs and Syslog. VM insights also doesn't send guest performance data to Azure Monitor Metrics where it can be analyzed with metrics explorer and used with metrics alerts.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a DCR that sends guest performance data to Azure Monitor Metrics and log events to Azure Monitor Logs.
> * View guest logs in Log Analytics.
> * View guest metrics in metrics explorer.

## Prerequisites
To complete this tutorial, you need an Azure virtual machine to monitor.

> [!IMPORTANT]
> This tutorial doesn't require VM insights to be enabled for the virtual machine. Azure Monitor Agent is installed on the VM if it isn't already installed.

## Create a data collection rule
[Data collection rules](../essentials/data-collection-rule-overview.md) in Azure Monitor define data to collect and where it should be sent. When you define the DCR by using the Azure portal, you specify the virtual machines it should be applied to. Azure Monitor Agent is automatically installed on any virtual machines that don't already have it.

> [!NOTE]
> You must currently install Azure Monitor Agent from the **Monitor** menu in the Azure portal. This functionality isn't yet available from the virtual machine's menu.

On the **Monitor** menu in the Azure portal, select **Data Collection Rules**. Then select **Create** to create a new DCR.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-create.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-create.png" alt-text="Screenshot that shows creating a data collection rule.":::

On the **Basics** tab, enter a **Rule Name**, which is the name of the rule displayed in the Azure portal. Select a **Subscription**, **Resource Group**, and **Region** where the DCR and its associations are stored. These resources don't need to be the same as the resources being monitored. The **Platform Type** defines the options that are available as you define the rest of the DCR. Select **Windows** or **Linux** if the rule is associated only with those resources or select **Custom** if it's associated with both types.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-basics.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-basics.png" alt-text="Screenshot that shows data collection rule basics.":::

## Select resources
On the **Resources** tab, identify one or more virtual machines to which the DCR applies. Azure Monitor Agent is installed on any VMs that don't already have it. Select **Add resources** and select either your virtual machines or the resource group or subscription where your virtual machine is located. The DCR applies to all virtual machines in the selected scope.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-resources.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-resources.png" alt-text="Screenshot that shows data collection rule resources.":::

## Select data sources
A single DCR can have multiple data sources. For this tutorial, we use the same rule to collect both guest metrics and guest logs. We send metrics to Azure Monitor Metrics and to Azure Monitor Logs so that they can both be analyzed with metrics explorer and Log Analytics.

On the **Collect and deliver** tab, select **Add data source**. For the **Data source type**, select **Performance counters**. Leave the **Basic** setting and select the counters that you want to collect. Use **Custom** to select individual metric values.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-data-source-metric.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-data-source-metric.png" alt-text="Screenshot that shows the data collection rule metric data source.":::

Select the **Destination** tab. **Azure Monitor Metrics** should already be listed. Select **Add destination** to add another. Select **Azure Monitor Logs** for **Destination type**. Select your Log Analytics workspace for **Account or namespace**. Select **Add data source** to save the data source.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-destination-metric.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-destination-metric.png" alt-text="Screenshot that shows the data collection rule destination.":::

Select **Add data source** again to add logs to the DCR. For the **Data source type**, select **Windows event logs** or **Linux syslog**. Select the types of log data that you want to collect.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-data-source-logs-windows.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-data-source-logs-windows.png" alt-text="Screenshot that shows the data collection rule Windows log data source.":::

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-data-source-logs-linux.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-data-source-logs-linux.png" alt-text="Screenshot that shows the data collection rule Linux log data source.":::

Select the **Destination** tab. **Azure Monitor Logs** should already be selected for **Destination type**. Select your Log Analytics workspace for **Account or namespace**. If you don't already have a workspace, you can select the default workspace for your subscription, which is automatically created. Select **Add data source** to save the data source.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-destination-logs.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-destination-logs.png" alt-text="Screenshot that shows the data collection rule Logs destination.":::

Select **Review + create** to create the DCR and install the Azure Monitor agent on the selected virtual machines.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-save.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-save.png" alt-text="Screenshot that shows saving the data collection rule.":::

## View logs
Data is retrieved from a Log Analytics workspace by using a log query written in Kusto Query Language. Although a set of precreated queries are available for virtual machines, we use a simple query to have a look at the events that we're collecting.

Select **Logs** from your virtual machine's menu. Log Analytics opens with an empty query window with the scope set to that machine. Any queries include only records collected from that machine.

> [!NOTE]
> The **Queries** window might open when you open Log Analytics. It includes precreated queries that you can use. For now, close this window because we're going to manually create a simple query.

:::image type="content" source="media/tutorial-monitor-vm/log-analytics.png" lightbox="media/tutorial-monitor-vm/log-analytics.png" alt-text="Screenshot that shows Log Analytics.":::

In the empty query window, enter either **Event** or **Syslog** depending on whether your machine is running Windows or Linux. Then select **Run**. The events collected within the **Time range** are displayed.

> [!NOTE]
> If the query doesn't return any data, you might need to wait a few minutes until events are created on the virtual machine to be collected. You might also need to modify the data source in the DCR to include other categories of events.

:::image type="content" source="media/tutorial-monitor-vm/log-analytics-query.png" lightbox="media/tutorial-monitor-vm/log-analytics-query.png" alt-text="Screenshot that shows Log Analytics with query results.":::

For a tutorial on using Log Analytics to analyze log data, see [Log Analytics tutorial](../logs/log-analytics-tutorial.md). For a tutorial on creating alert rules from log data, see [Tutorial: Create a log query alert for an Azure resource](../alerts/tutorial-log-alert.md).

## View guest metrics
You can view metrics for your host virtual machine with metrics explorer without a DCR like [any other Azure resource](../essentials/tutorial-metrics.md). With the DCR, you can use metrics explorer to view guest metrics and host metrics.

Select **Metrics** from your virtual machine's menu. Metrics explorer opens with the scope set to your virtual machine. Select **Metric Namespace** > **Virtual Machine Guest**.

> [!NOTE]
> If you don't see **Virtual Machine Guest**, you might need to wait a few minutes for the agent to deploy and data to begin collecting.

:::image type="content" source="media/tutorial-monitor-vm/metrics-explorer.png" lightbox="media/tutorial-monitor-vm/metrics-explorer.png" alt-text="Screenshot that shows metrics explorer.":::

The available guest metrics are displayed. Select a metric to add to the chart.

:::image type="content" source="media/tutorial-monitor-vm/metrics-explorer-guest-metrics.png" lightbox="media/tutorial-monitor-vm/metrics-explorer-guest-metrics.png" alt-text="Screenshot that shows metrics explorer with guest metrics.":::

For a tutorial on how to view and analyze metric data by using metrics explorer, see [Tutorial: Analyze metrics for an Azure resource](../essentials/tutorial-metrics.md). For a tutorial on how to create metrics alerts, see [Tutorial: Create a metric alert for an Azure resource](../alerts/tutorial-metric-alert.md).

## Next steps
[Recommended alerts](tutorial-monitor-vm-alert-recommended.md) and the [VM Availability metric](tutorial-monitor-vm-alert-availability.md) alert from the virtual machine host but don't have any visibility into the guest operating system and its workloads. Now that you're collecting guest metrics for the virtual machine, you can create metric alerts based on guest metrics such as logical disk space.

> [!div class="nextstepaction"]
> [Create a metric alert in Azure Monitor](../alerts/tutorial-metric-alert.md)
