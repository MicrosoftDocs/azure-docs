---
title: Tutorial - Collect guest metrics and logs from Azure virtual machine
description: Create data collection rule to collect guest logs and metrics from Azure virtual machine.
ms.service: azure-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 09/19/2021
---

# Tutorial: Collect guest metrics and logs from Azure virtual machine
Logs and metrics from the guest operating system of an Azure virtual machine can be be valuable to determine the health of the workflows running on it. To collect guest metrics and logs from an Azure virtual machine, you must install the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) and create a [data collection rule](../agents/data-collection-rule-overview.md) (DCR) that defines the data to collect and where to send it. 

> [!NOTE]
> Prior to the Azure Monitor agent, guest metrics for Azure virtual machines were collected with the [Azure diagnostic extension](../agents/diagnostics-extension-overview.md) for Windows (WAD) and Linux (LAD). These agents are still available and can be configured with the **Diagnostic settings** menu item for the virtual machine, but they are in the process of being replaced with Azure Monitor agent.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a data collection rule to define collection details and install Azure Monitor agent
> * Verify that metrics and logs are being collected

## Prerequisites

To complete this tutorial you need the following: 

- An Azure virtual machine to monitor.


## Create a Log Analytics workspace
[!INCLUDE [Create workspace](../../../includes/azure-monitor-tutorial-workspace.md)]

## Create data collection rule
[Data collection rules](../agents/data-collection-rule-overview.md) in Azure Monitor define data to collect and where it should be sent. When you define the data collection rule using the Azure portal, you specify the virtual machines it should be applied to. The Azure Monitor agent will automatically be installed on any virtual machines that don't already have it.

> [!NOTE]
> You must currently install the Azure Monitor agent from **Monitor** menu in the Azure portal. This functionality is not yet available from the virtual machine's menu. 

From the **Monitor** menu in the Azure portal, select **Data Collection Rules** and then **Create** to create a new data collection rule.

:::image type="content" source="media/tutorial-data-collection-rule-vm/data-collection-rule-create.png" lightbox="media/tutorial-data-collection-rule-vm/data-collection-rule-create.png" alt-text="Create data collection rule":::

On the **Basics** tab, provide a **Rule Name** which is the name of the rule displayed in the Azure portal. Select a **Subscription**, **Resource Group**, and **Region** where the DCR and its associations will be stored. These do not need to be the same as the resources being monitored. The **Platform Type** defines the options that are available as you define the rest of the DCR. Select *Windows* or *Linux* if it will be associated only those resources or *Custom* if it will be associated with both types.

:::image type="content" source="media/tutorial-data-collection-rule-vm/data-collection-rule-basics.png" lightbox="media/tutorial-data-collection-rule-vm/data-collection-rule-basics.png" alt-text="Data collection rule basics":::

## Select resources
On the **Resources** tab, identify one or more virtual machines that the data collection rule will apply to. The Azure Monitor agent will be installed on any that don't already have it. Click **Add resources** and select either your virtual machines or the resource group or subscription where your virtual machine is located. The data collection rule will apply to all virtual machines in the selected scope.

:::image type="content" source="media/tutorial-data-collection-rule-vm/data-collection-rule-resources.png" lightbox="media/tutorial-data-collection-rule-vm/data-collection-rule-resources.png" alt-text="Data collection rule resources":::

## Select data sources
A single data collection rule can have multiple data sources. For this tutorial, we'll use the same rule to collect both guest metrics and guest logs. We'll also send metrics to both to Azure Monitor Metrics and to Azure Monitor Logs so that they can be analyzed both with metrics explorer and Log Analytics.

On the **Collect and deliver** tab, click **Add data source**. For the **Data source type**, select **Performance counters**. Leave the **Basic** setting and select the events that you want to collect. **Custom** allows you to select individual metric values. 

:::image type="content" source="media/tutorial-data-collection-rule-vm/data-collection-rule-data-source.png" lightbox="media/tutorial-data-collection-rule-vm/data-collection-rule-data-source.png" alt-text="Data collection rule data source":::

Select the **Destination** tab. **Azure Monitor Metrics** should already be listed. Click **Add destination** to add another. Select **Azure Monitor Logs** for the **Destination type**. Select your Log Analytics workspace for the **Account or namespace**. Click **Add data source** to save the data source.



Click **Add data source** again to add logs to the data collection rule. For the **Data source type**, select **Windows event logs** or **Linux syslog**. Leave the **Basic** setting which allows you to select groups of metric values to collect. **Custom** allows you to select individual metric values. Select the types of log data that you want to collect. 

Select the **Destination** tab. *Azure Monitor Logs* should already be selected for the **Destination type**. Select you Log Analytics workspace for the **Account or namespace**. Click **Add data source** to save the data source.

Click **Review + create** to create the data collection rule and install the Azure Monitor agent on the selected virtual machines.

## Analyzing logs

Data is retrieved from a Log Analytics workspace using a log query written in Kusto Query Language (KQL). A set of precreated queries are available for may Azure resource so that you don't require knowledge of KQL to get started.

Select **Logs** from your resource's menu. Log Analytics opens with an empty query window with the scope set to your resource. Any queries will include only records from that resource.


Click **Queries** to view prebuilt queries for **Virtual machines**. 



Browse through the available queries. Identify one to run and click **Run**. 


The query is added to the query window and the results returned.


## Next steps


