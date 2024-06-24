---
title: Collect data with Azure Monitor Agent
description: Describes how to collect events and performance counters from virtual machines, Virtual Machine Scale Sets, and Arc-enabled on-premises servers using Azure Monitor Agent.
ms.topic: conceptual
ms.date: 7/19/2023
author: guywild
ms.author: guywild
ms.reviewer: jeffwo

---

# Collect data with Azure Monitor Agent

[Azure Monitor agent (AMA)](azure-monitor-agent-overview.md) is used to collect data from Azure virtual machines, Virtual Machine scale sets, and Arc-enabled servers. [Data collection rules (DCR)](../essentials/data-collection-rule-overview.md) define the data to collect from the agent and where that data should be sent.  This article describes how to use the Azure portal to install AMA on virtual machines in your environment and configure data collection of the most common types of client data.

If you're new to Azure Monitor or have basic data collection requirements, then you may be able to meet all of your requirements using the Azure portal and the guidance in this article. If you want to take advantage of additional DCR features such as [transformations](../essentials/data-collection-transformations.md), then you may need to create or edit a DCR after creating it in the portal. You can also use different methods to manage DCRs and create associations if you want to deploy using CLI, PowerShell, ARM templates, or Azure Policy.

> [!NOTE]
> To send data across tenants, you must first enable [Azure Lighthouse](../../lighthouse/overview.md).


> [!WARNING]
> The following cases may collect duplicate data which may result in additional charges.
>  
> - Creating multiple DCRs with the same data source and associating them to the same agent. Ensure that you're filtering data in the DCRs such that each collects unique data. 
> - Creating a DCR that collects security logs and enabling Sentinel for the same agents. In this case, you may collect the same events in the Event table and the SecurityEvent table.
> - Using both the Azure Monitor agent and the legacy Log Analytics agent on the same machine. Limit duplicate events to only the time when you transition from one agent to the other. 

## Prerequisites

- [Permissions to create Data Collection Rule objects](../essentials/data-collection-rule-create-edit.md#permissions) in the workspace.
- See the prerequisites for each data source type added to the DCR.

## Create data collection rule

You can use any method to create a DCR for the Azure Monitor agent, but you must also create DCRAs for each of the agents. You can also create the DCR using the Azure portal which keeps you from the complexity of editing the DCR itself. 


On the **Monitor** menu, select **Data Collection Rules** > **Create** to open the create a new data collection rule management wizard.

:::image type="content" source="media/azure-monitor-agent-data-collection/create-data-collection-rule.png" lightbox="media/azure-monitor-agent-data-collection/create-data-collection-rule.png" alt-text="Screenshot that shows Create button for a new data collection rule.":::

The **Basic** page includes basic information about the DCR.

:::image type="content" source="media/azure-monitor-agent-data-collection/basics-tab.png" lightbox="media/azure-monitor-agent-data-collection/basics-tab.png" alt-text="Screenshot that shows the Basic tab for a new data collection rule.":::

| Setting | Description |
|:---|:---|
| Rule Name | Name for the DCR. This should be something descriptive that helps you identify the rule. |
| Subscription | Subscription to store the DCR. This does not need to be the same subscription as the virtual machines. |
| Resource group | Resource group to store the DCR. This does not need to be the same resource group as the virtual machines. |
| Region | Region to store the DCR. The virtual machines and their associations must be in the same region. |
| Platform Type | Specifies the type of data sources that will be available for the DCR, either **Windows** or **Linux**. **None** allows for both. <sup>1</sup> |
| Data Collection Endpoint | Specifies the data collection endpoint (DCE) used to collect data. This is only required if you're using Azure Monitor Private Links. This DCE must be in the same region as the Log Analytics workspace. For more information, see [How to set up data collection endpoints based on your deployment](data-collection-endpoints.md). |

<sup>1</sup> This option sets the `kind` attribute in the DCR. There are other values that can be set for this attribute, but they are not available in the portal.


## Add resources
The **Resources** page allows you to add resources that will be associated with the DCR. Click **+ Add resources** to select resources. The Azure Monitor agent will automatically be installed on any resources that don't already have it.

> [!IMPORTANT] 
> The portal enables system-assigned managed identity on the target resources, along with existing user-assigned identities, if there are any. For existing applications, unless you specify the user-assigned identity in the request, the machine defaults to using system-assigned identity instead.


:::image type="content" source="media/azure-monitor-agent-data-collection/resources-tab.png" lightbox="media/azure-monitor-agent-data-collection/basics-tab.png" alt-text="Screenshot that shows the Resources tab for a new data collection rule.":::

 If the machine you're monitoring is not in the same region as your destination Log Analytics workspace and you're collecting data types that require a DCE, select **Enable Data Collection Endpoints** and select an endpoint in the region of each monitored machine. If the monitored machine is in the same region as your destination Log Analytics workspace, or if you don't require a DCE, don't select a data collection endpoint on the **Resources** tab.
 
 The data collection endpoint on the **Resources** tab is the configuration access endpoint, as described in [Components of a data collection endpoint](../essentials/data-collection-endpoint-overview.md#components-of-a-data-collection-endpoint). If you need network isolation using private links, select existing endpoints from the same region for the respective resources or [create a new endpoint](../essentials/data-collection-endpoint-overview.md).


## Add data sources
The **Collect and deliver** allows you to add and configure data sources and destinations for the DCR and a destination for each.

| Screen element | Description |
|:---|:---|
| **Data source** | Select a **Data source type** and define related fields based on the data source type you select. For more information about collecting data from the different data source types, see the articles in [Data type](#types-of-data).|
| **Destination** | Add one or more destinations for each data source. You can select multiple destinations of the same or different types. For instance, you can select multiple Log Analytics workspaces, which is also known as multihoming. See the details for each data type for the different destinations they support. |

The following table lists the types of data that you can collect using the Azure portal. The same process can be used to create DCRs for each data type, and multiple types may be used in the same DCR, although the configuration details of each data type will vary. A separate article is available to describe the particular details of each type. 

| Data | Client operating system |
|:---|:---|
| [Windows events](./data-collection-windows-event.md) | Windows |
| [Syslog events](./data-collection-syslog.md) | Linux |
| [Performance counters](./data-collection-performance.md) | Windows and Linux |
| [Text and JSON logs](./data-collection-text-log.md) | Windows and Linux |
| [IIS logs](./data-collection-iis.md) | Windows |

A DCR can contain multiple different data sources up to a limit of 10 data sources in a single DCR. You can combine different data sources in the same DCR, but you will typically want to create different DCRs for different data collection scenarios. See [Best practices for data collection rule creation and management in Azure Monitor](../essentials/data-collection-rule-best-practices.md) for recommendations on how to organize your DCRs.

## Verify operation

### Verify agent operation
If you installed the agent on new machines, then you can verify that the agent is operational and communicating properly by running the following query in Log Analytics to check if there are any records in the [Heartbeat]() table. A record should be sent to this table from each agent every minute.

``` kusto
Heartbeat
| where TimeGenerated > ago(24h)
| where Computer has "<computer name>"
| project TimeGenerated, Category, Version
| order by TimeGenerated desc
```

### Verify that records are being received
A few minutes after saving the DCR, you can verify that records are being received from each of your data sources by checking the table that each writes to in the Log Analytics workspace. For example, the following query checks for Windows events in the [Event]() table.

``` kusto
Event
| where TimeGenerated > ago(48h)
| order by TimeGenerated desc
```




## Next steps

- [Collect text logs by using Azure Monitor Agent](data-collection-text-log.md).
- Learn more about [Azure Monitor Agent](azure-monitor-agent-overview.md).
- Learn more about [data collection rules](../essentials/data-collection-rule-overview.md).
