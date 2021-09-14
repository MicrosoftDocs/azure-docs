---
title: Tutorial - Collect guest metrics and logs from Azure virtual machine
description: Start here to learn how to monitor Azure virtual machines
ms.service: container-service
ms.topic: article
ms.custom: subject-monitoring
ms.date: 06/21/2021
---

# Tutorial: Collect guest metrics and logs from Azure virtual machine
Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. Log query alert rules create an alert when a log query returns a particular result. For example, receive an alert when a particular event is created on a virtual machine, or send a warning when excessive anonymous requests are made to a storage account.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Access prebuilt log queries designed to suppoer alert rules for different kinds of resources
> * Create a log query alert rule
> * Create an action group to define notification details


## Collect guest metrics
Azure Monitor starts collecting metric data for your virtual machine host automatically. To collect metrics from the guest operating system of the virtual machine though, you must install an agent that can send this data to Azure Monitor. Install the [Azure Monitor agent](../azure-monitor/agents/azure-monitor-agent-overview.md) on your virtual machine to provide this functionality. 

> [!NOTE]
> Prior to the Azure Monitor agent, guest metrics for Azure virtual machines were collected with the [Azure diagnostic extension](../azure-monitor/agents/diagnostics-extension-overview.md) for Windows (WAD) and Linux (LAD). These agents are still available and can be configured with the **Diagnostic settings** menu item for the virtual machine, but they are in the process of being replaced with Azure Monitor agent.

You must currently install the Azure Monitor agent from **Monitor** menu in the Azure portal. This functionality is not yet available from the virtual machine's menu. You create a [data collection rule]() that defines the data you want to collect, and the agent is automatically installed on any virtual machines you select.

From the **Monitor** menu in the Azure portal, select **Data Collection Rules** and then **Create** to create a new data collection rule.

:::image type="content" source="media/tutorial-data-collection-rule-vm/data-collection-rule-create.png" lightbox="media/tutorial-data-collection-rule-vm/data-collection-rule-create.png" alt-text="Create data collection rule":::


On the **Basics** tab, provide the following values:

- **Rule Name:** The name of the rule displayed in the Azure portal.
- **Subscription**: Select the subscription to store the data collection rule. This does not need to be the same subscription same as the resource being monitored.
- **Resource Group**: Select an existing resource group or click **Create new** to create a new one. This does not need to be the same resource group same as the resource being monitored.
- **Region**: Select an Azure region or create a new one. This does not need to be the same location same as the resource being monitored.
- **Platform:** Select with *Windows* or *Linux* depending on the type of virtual machine you're monitoring.

:::image type="content" source="media/tutorial-data-collection-rule-vm/data-collection-rule-basics.png" lightbox="media/tutorial-data-collection-rule-vm/data-collection-rule-basics.png" alt-text="Data collection rule basics":::

On the **Resources** tab, click **Add resources**. Select either your virtual machine or the resource group or subscription where your virtual machine is located. The data collection rule will apply to all virtual machines in the selected scope.

:::image type="content" source="media/tutorial-data-collection-rule-vm/data-collection-rule-resources.png" lightbox="media/tutorial-data-collection-rule-vm/data-collection-rule-resources.png" alt-text="Data collection rule resources":::


On the **Collect and deliver** tab, click **Add data source**. For the **Data source type**, select **Performance counters**. Leave the **Basic** setting and select the events that you want to collect. **Custom** allows you to select individual metric values.

:::image type="content" source="media/tutorial-data-collection-rule-vm/data-collection-rule-data-source.png" lightbox="media/tutorial-data-collection-rule-vm/data-collection-rule-data-source.png" alt-text="Data collection rule data source":::

Click **Review + create** to create the data collection rule and install the Azure Monitor agent on the selected virtual machines.


## Collect guest logs
You can collect logs from the guest operating of a virtual machine for analysis and alerting. This includes the Windows event log for Windows machines and Syslog for Linux machines. This is done with the same Azure Monitor agent and data collection rule used to collect metrics. 

From the **Monitor** menu in the Azure portal, select **Data Collection Rules** and locate the data collection you created for metrics.

Select **Data sources** and then click **Add data source** to add the data source to the data collection rule.

On the **Collect and deliver** tab, click **Add data source**. For the **Data source type**, select **Windows event logs** or **Linux syslog**. Leave the **Basic** setting which allows you to select groups of metric values to collect. **Custom** allows you to select individual metric values.

Click **Review + create** to create the data collection rule and install the Azure Monitor agent on the selected virtual machines.

## Analyzing logs

Data in Azure Monitor Logs is stored in tables in a Log Analytics workspace. Retrieve log data with a log query in Log Analytics. You can interactively work with the data, pin results to an Azure dashboard, or create an alert based on log query results.

For a list of the types of logs collected for virtual machines, see [Monitoring Azure virtual machines data reference](monitor-vm-reference.md#resource-logs).

If you're not familiar with using Log Analytics, see [Analyze logs from an Azure resource](../azure-monitor/logs/tutorial-logs.md)



## Next steps

- See [Monitoring AKS data reference](monitor-aks-reference.md) for a reference of the metrics, logs, and other important values created by AKS.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resource) for details on monitoring Azure resources.
