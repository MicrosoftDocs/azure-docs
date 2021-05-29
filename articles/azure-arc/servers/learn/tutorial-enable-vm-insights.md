---
title: Tutorial - Monitor a hybrid machine with Azure Monitor VM insights
description: Learn how to collect and analyze data from a hybrid machine in Azure Monitor.
ms.topic: tutorial
ms.date: 04/21/2021
---

# Tutorial: Monitor a hybrid machine with VM insights

[Azure Monitor](../../../azure-monitor/overview.md) can collect data directly from your hybrid machines into a Log Analytics workspace for detailed analysis and correlation. Typically this would entail installing the [Log Analytics agent](../../../azure-monitor/agents/agents-overview.md#log-analytics-agent) on the machine using a script, manually, or automated method following your configuration management standards. Arc enabled servers recently introduced support to install the Log Analytics and Dependency agent [VM extensions](../manage-vm-extensions.md) for Windows and Linux, enabling [VM insights](../../../azure-monitor/vm/vminsights-overview.md) to collect data from your non-Azure VMs.

This tutorial shows you how to configure and collect data from your Linux or Windows machines by enabling VM insights following a simplified set of steps, which streamlines the experience and takes a shorter amount of time.  

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* VM extension functionality is available only in the list of [supported regions](../overview.md#supported-regions).

* See [Supported operating systems](../../../azure-monitor/vm/vminsights-enable-overview.md#supported-operating-systems) to ensure that the servers operating system you're enabling is supported by VM insights.

* Review firewall requirements for the Log Analytics agent provided in the [Log Analytics agent overview](../../../azure-monitor/agents/log-analytics-agent.md#network-requirements). The VM insights Map Dependency agent doesn't transmit any data itself, and it doesn't require any changes to firewalls or ports.

## Sign in to Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Enable VM insights

1. Launch the Azure Arc service in the Azure portal by clicking **All services**, then searching for and selecting **Machines - Azure Arc**.

    :::image type="content" source="./media/quick-enable-hybrid-vm/search-machines.png" alt-text="Search for Arc enabled servers in All Services" border="false":::

1. On the **Machines - Azure Arc** page, select the connected machine you created in the [quickstart](quick-enable-hybrid-vm.md) article.

1. From the left-pane under the **Monitoring** section, select **Insights** and then **Enable**.

    :::image type="content" source="./media/tutorial-enable-vm-insights/insights-option.png" alt-text="Select Insights option from left-hand menu" border="false":::

1. On the Azure Monitor **Insights Onboarding** page, you are prompted to create a workspace. For this tutorial, we don't recommend you select an existing Log Analytics workspace if you have one already. Select the default, which is a workspace with a unique name in the same region as your registered connected machine. This workspace is created and configured for you.

    :::image type="content" source="./media/tutorial-enable-vm-insights/enable-vm-insights.png" alt-text="Enable VM insights page" border="false":::

1. You receive status messages while the configuration is performed. This process takes a few minutes as extensions are installed on your connected machine.

    :::image type="content" source="./media/tutorial-enable-vm-insights/onboard-vminsights-vm-portal-status.png" alt-text="Enable VM insights progress status message" border="false":::

    When it's complete, you get a message that the machine has been successfully onboarded and the insight has been successfully deployed.

## View data collected

After the deployment and configuration is completed, select **Insights**, and then select the **Performance** tab. On the Performance tab, it shows a select group of performance counters collected from the guest operating system of your machine. Scroll down to view more counters, and move the mouse over a graph to view average and percentiles taken starting from the time when the Log Analytics VM extension was installed on the machine.

:::image type="content" source="./media/tutorial-enable-vm-insights/insights-performance-charts.png" alt-text="VM insights Performance charts for selected machine" border="false":::

Select **Map** to open the maps feature, which shows the processes running on the machine and their dependencies. Select **Properties** to open the property pane if it isn't already open.

:::image type="content" source="./media/tutorial-enable-vm-insights/insights-map.png" alt-text="VM insights Map for selected machine" border="false":::

Expand the processes for your machine. Select one of the processes to view its details and to highlight its dependencies.

Select your machine again and then select **Log Events**. You see a list of tables that are stored in the Log Analytics workspace for the machine. This list will be different depending whether you're using a Windows or Linux machine. Select the **Event** table. The **Event** table includes all events from the Windows event log. Log Analytics opens with a simple query to retrieve collected event log entries.

## Next steps

To learn more about Azure Monitor, look at the following article:

> [!div class="nextstepaction"]
> [Azure Monitor overview](../../../azure-monitor/overview.md)