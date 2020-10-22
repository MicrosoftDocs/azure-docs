---
title: Tutorial - Monitor a hybrid machine with Azure Monitor for VMs
description: Learn how to collect and analyze data from a hybrid machine in Azure Monitor.
ms.topic: tutorial
ms.date: 09/23/2020
---

# Tutorial: Monitor a hybrid machine with Azure Monitor for VMs

[Azure Monitor](../overview.md) can collect data directly from your hybrid virtual machines into a Log Analytics workspace for detailed analysis and correlation. Typically this would entail installing the [Log Analytics agent](../../../azure-monitor/platform/agents-overview.md#log-analytics-agent) on the machine using a script, manually, or automated method following your configuration management standards. Arc enabled servers recently introduced support to install the Log Analytics and Dependency agent [VM extensions](../manage-vm-extensions.md) for Windows and Linux, enabling Azure Monitor to collect data from your non-Azure VMs.

This tutorial shows you how to configure and collect data from your Linux or Windows VMs by enabling Azure Monitor for VMs following a simplified set of steps, which streamlines the experience and takes a shorter amount of time.  

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* VM extension functionality is available only in the list of [supported regions](../overview.md#supported-regions).

* See [Supported operating systems](../../../azure-monitor/insights/vminsights-enable-overview.md#supported-operating-systems) to ensure that the VMs operating system you're enabling is supported by Azure Monitor for VMs.

* Review firewall requirements for the Log Analytics agent provided in the [Log Analytics agent overview](../../../azure-monitor/platform/log-analytics-agent.md#network-requirements). The Azure Monitor for VMs Map Dependency agent doesn't transmit any data itself, and it doesn't require any changes to firewalls or ports.

## Sign in to Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Enable Azure Monitor for VMs

1. Launch the Azure Arc service in the Azure portal by clicking **All services**, then searching for and selecting **Machines - Azure Arc**.

    :::image type="content" source="./media/quick-enable-hybrid-vm/search-machines.png" alt-text="Search for Arc enabled servers in All Services" border="false":::

1. On the **Machines - Azure Arc** page, select the connected machine you created in the [quickstart](quick-enable-hybrid-vm.md) article.

1. From the left-pane under the **Monitoring** section, select **Insights** and then **Enable**.

    :::image type="content" source="./media/tutorial-enable-vm-insights/insights-option.png" alt-text="Select Insights option from left-hand menu" border="false":::

1. On the Azure Monitor **Insights Onboarding** page, you are prompted to create a workspace. For this tutorial, we don't recommend you select an existing Log Analytics workspace if you have one already. Select the default, which is a workspace with a unique name in the same region as your registered connected machine. This workspace is created and configured for you.

    :::image type="content" source="./media/tutorial-enable-vm-insights/enable-vm-insights.png" alt-text="Enable Azure Monitor for VMs page" border="false":::

1. You receive status messages while the configuration is performed. This process takes a few minutes as extensions are installed on your connected machine.

    :::image type="content" source="./media/tutorial-enable-vm-insights/onboard-vminsights-vm-portal-status.png" alt-text="Enable Azure Monitor for VMs progress status message" border="false":::

    When it's complete, you get a message that the machine has been successfully onboarded and the insight has been successfully deployed.

## View data collected

After the deployment and configuration is completed, select **Insights**, and then select the **Performance** tab. On the Performance tab, it shows a select group of performance counters collected from the guest operating system of your VM. Scroll down to view more counters, and move the mouse over a graph to view average and percentiles taken starting from the time when the Log Analytics VM extension was installed on the machine.

:::image type="content" source="./media/tutorial-enable-vm-insights/insights-performance-charts.png" alt-text="Azure Monitor for VMs Performance charts for selected machine" border="false":::

Select **Map** to open the maps feature, which shows the processes running on the virtual machine and their dependencies. Select **Properties** to open the property pane if it isn't already open.

:::image type="content" source="./media/tutorial-enable-vm-insights/insights-map.png" alt-text="Azure Monitor for VMs Map for selected machine" border="false":::

Expand the processes for your virtual machine. Select one of the processes to view its details and to highlight its dependencies.

Select your virtual machine again and then select **Log Events**. You see a list of tables that are stored in the Log Analytics workspace for the virtual machine. This list will be different depending whether you're using a Windows or Linux virtual machine. Select the **Event** table. The **Event** table includes all events from the Windows event log. Log Analytics opens with a simple query to retrieve collected event log entries.

## Next steps

To learn more about Azure Monitor, look at the following article:

> [!div class="nextstepaction"]
> [Azure Monitor overview](../../../azure-monitor/overview.md)