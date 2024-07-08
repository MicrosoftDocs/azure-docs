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

[Azure Monitor agent (AMA)](azure-monitor-agent-overview.md) is used to collect data from Azure virtual machines, Virtual Machine scale sets, and Arc-enabled servers. [Data collection rules (DCR)](../essentials/data-collection-rule-overview.md) define the data to collect from the agent and where that data should be sent.  This article describes how to use the Azure portal to create a DCR to collect different types of data and install the agent on any machines that require it.

If you're new to Azure Monitor or have basic data collection requirements, then you may be able to meet all of your requirements using the Azure portal and the guidance in this article. If you want to take advantage of additional DCR features such as [transformations](../essentials/data-collection-transformations.md), then you may need to create a DCR using other methods or edit it after creating it in the portal. You can also use different methods to manage DCRs and create associations if you want to deploy using CLI, PowerShell, ARM templates, or Azure Policy.

> [!NOTE]
> To send data across tenants, you must first enable [Azure Lighthouse](../../lighthouse/overview.md).


> [!WARNING]
> The following cases may collect duplicate data which may result in additional charges.
>  
> - Creating multiple DCRs with the same data source and associating them to the same agent. Ensure that you're filtering data in the DCRs such that each collects unique data. 
> - Creating a DCR that collects security logs and enabling Sentinel for the same agents. In this case, you may collect the same events in the Event table and the SecurityEvent table.
> - Using both the Azure Monitor agent and the legacy Log Analytics agent on the same machine. Limit duplicate events to only the time when you transition from one agent to the other. 

## Data sources

The table below lists the types of data you can currently collect with the Azure Monitor Agent and where you can send that data.

| Data source | Destinations | Description |
|:---|:---|:---|
| Performance | <ul><li>Azure Monitor Metrics (Public preview):<ul><li>For Windows - Virtual Machine Guest namespace</li><li>For Linux<sup>1</sup> - azure.vm.linux.guestmetrics namespace</li></ul></li><li>Log Analytics workspace - [Perf](/azure/azure-monitor/reference/tables/perf) table</li></ul> | Numerical values measuring performance of different aspects of operating system and workloads |
| Windows event logs (including sysmon events) | Log Analytics workspace - [Event](/azure/azure-monitor/reference/tables/Event) table | Information sent to the Windows event logging system |
| Syslog | Log Analytics workspace - [Syslog](/azure/azure-monitor/reference/tables/syslog)<sup>2</sup> table | Information sent to the Linux event logging system. [Collect syslog with Azure Monitor Agent](data-collection-syslog.md) |
|	Text and JSON logs	|	Log Analytics workspace - custom table(s) created manually |	[Collect text logs with Azure Monitor Agent](data-collection-text-log.md)	|
| Windows IIS logs |Internet Information Service (IIS) logs from to the local disk of Windows machines |[Collect IIS Logs with Azure Monitor Agent].(data-collection-iis.md) |
| Windows Firewall logs | Firewall logs from the local disk of a Windows Machine| |


<sup>1</sup> On Linux, using Azure Monitor Metrics as the only destination is supported in v1.10.9.0 or higher.<br>
<sup>2</sup> Azure Monitor Linux Agent versions 1.15.2 and higher support syslog RFC formats including Cisco Meraki, Cisco ASA, Cisco FTD, Sophos XG, Juniper Networks, Corelight Zeek, CipherTrust, NXLog, McAfee, and Common Event Format (CEF).

> [!NOTE]
> On rsyslog-based systems, Azure Monitor Linux Agent adds forwarding rules to the default ruleset defined in the rsyslog configuration. If multiple rulesets are used, inputs bound to non-default ruleset(s) are **not** forwarded to Azure Monitor Agent. For more information about multiple rulesets in rsyslog, see the [official documentation](https://www.rsyslog.com/doc/master/concepts/multi_ruleset.html).

> [!NOTE]
> Azure Monitor Agent also supports Azure service [SQL Best Practices Assessment](/sql/sql-server/azure-arc/assess/) which is currently Generally available. For more information, refer [Configure best practices assessment using Azure Monitor Agent](/sql/sql-server/azure-arc/assess#enable-best-practices-assessment).

## Prerequisites

- [Permissions to create Data Collection Rule objects](../essentials/data-collection-rule-create-edit.md#permissions) in the workspace.
- See the article describing each data source for any additional prerequisites.

## Overview 
 The DCR wizard will have you provide details for the information in the following table.

| Section | Description |
|:---|:---|
| Resources | Machines that will use the DCR. When you add a machine to the DCR, it creates a [data collection rule association (DCRA)](../essentials/data-collection-rule-overview.md#data-collection-rule-associations-dcra) between the machine and the DCR. You can edit the DCR to add or remove machines after it's created. |
| Data source | The type of data to collect from the machine. The list of available data sources are listed above in [Data sources](#data-sources). Each data source has its own configuration settings and potentially prerequisites, so see the individual article for each for details. |
| Destination | Destination where the data collected from the data source should be sent. If you have multiple data sources in the DCR, they can be sent to separate destinations, and data from a single data source may be sent to multiple destinations. |


## Create data collection rule

On the **Monitor** menu, select **Data Collection Rules** > **Create** to open the DCR creation wizard management wizard.

:::image type="content" source="media/azure-monitor-agent-data-collection/create-data-collection-rule.png" lightbox="media/azure-monitor-agent-data-collection/create-data-collection-rule.png" alt-text="Screenshot that shows Create button for a new data collection rule.":::

The **Basic** page includes basic information about the DCR.

:::image type="content" source="media/azure-monitor-agent-data-collection/basics-tab.png" lightbox="media/azure-monitor-agent-data-collection/basics-tab.png" alt-text="Screenshot that shows the Basic tab for a new data collection rule.":::

| Setting | Description |
|:---|:---|
| Rule Name | Name for the DCR. This should be something descriptive that helps you identify the rule. |
| Subscription | Subscription to store the DCR. This does not need to be the same subscription as the virtual machines. |
| Resource group | Resource group to store the DCR. This does not need to be the same resource group as the virtual machines. |
| Region | Region to store the DCR. This must be the same region and any Log Analytics workspace or Azure Monitor workspace used in a destination of the DCR. If you have workspaces in different regions, then create multiple DCRs associate with the same set of machines. |
| Platform Type | Specifies the type of data sources that will be available for the DCR, either **Windows** or **Linux**. **None** allows for both. <sup>1</sup> |
| Data Collection Endpoint | Specifies the data collection endpoint (DCE) used to collect data. This is only required if you're using Azure Monitor Private Links. This DCE must be in the same region as the DCR. For more information, see [How to set up data collection endpoints based on your deployment](data-collection-endpoints.md). |

<sup>1</sup> This option sets the `kind` attribute in the DCR. There are other values that can be set for this attribute, but they are not available in the portal.


## Add resources
The **Resources** page allows you to add resources that will be associated with the DCR. Click **+ Add resources** to select resources. The Azure Monitor agent will automatically be installed on any resources that don't already have it.

> [!IMPORTANT] 
> The portal enables system-assigned managed identity on the target resources, along with existing user-assigned identities, if there are any. For existing applications, unless you specify the user-assigned identity in the request, the machine defaults to using system-assigned identity instead.


:::image type="content" source="media/azure-monitor-agent-data-collection/resources-tab.png" lightbox="media/azure-monitor-agent-data-collection/v-tab.png" alt-text="Screenshot that shows the Resources tab for a new data collection rule.":::

 If the machine you're monitoring is not in the same region as your destination Log Analytics workspace and you're collecting data types that require a DCE, select **Enable Data Collection Endpoints** and select an endpoint in the region of each monitored machine. If the monitored machine is in the same region as your destination Log Analytics workspace, or if you don't require a DCE, don't select a data collection endpoint on the **Resources** tab.
 

## Add data sources
The **Collect and deliver** page allows you to add and configure data sources for the DCR and a destination for each.

| Screen element | Description |
|:---|:---|
| **Data source** | Select a **Data source type** and define related fields based on the data source type you select. See the articles linked in the table below for details on configuring each type of data source. |
| **Destination** | Add one or more destinations for each data source. You can select multiple destinations of the same or different types. For instance, you can select multiple Log Analytics workspaces, which is also known as multihoming. See the details for each data type for the different destinations they support. |


| Data | Client operating system |
|:---|:---|
| [Windows events](./data-collection-windows-event.md) | Windows |
| [Syslog events](./data-collection-syslog.md) | Linux |
| [Performance counters](./data-collection-performance.md) | Windows and Linux |
| [Text and JSON logs](./data-collection-text-log.md) | Windows and Linux |
| [IIS logs](./data-collection-iis.md) | Windows |

A DCR can contain multiple different data sources up to a limit of 10 data sources in a single DCR. You can combine different data sources in the same DCR, but you will typically want to create different DCRs for different data collection scenarios. See [Best practices for data collection rule creation and management in Azure Monitor](../essentials/data-collection-rule-best-practices.md) for recommendations on how to organize your DCRs.

## Verify operation
Once you've created a DCR and associated it with a machine, you can verify that the agent is operational and that data is being collected by running queries in the Log Analytics workspace.

### Verify agent operation
Verify that the agent is operational and communicating properly by running the following query in Log Analytics to check if there are any records in the [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat) table. A record should be sent to this table from each agent every minute.

``` kusto
Heartbeat
| where TimeGenerated > ago(24h)
| where Computer has "<computer name>"
| project TimeGenerated, Category, Version
| order by TimeGenerated desc
```

### Verify that records are being received
It will take a few minutes for the agent to be installed and start running any new or modified DCRs. You can then verify that records are being received from each of your data sources by checking the table that each writes to in the Log Analytics workspace. For example, the following query checks for Windows events in the [Event](/azure/azure-monitor/reference/tables/event) table.

``` kusto
Event
| where TimeGenerated > ago(48h)
| order by TimeGenerated desc
```

## Troubleshooting
Go through the following steps if you aren't collecting data that you're expecting.

- Verify that the agent is installed and running on the machine.
- See the **Troubleshooting** section of the article for the data source you're having trouble with.
- See [Monitor and troubleshoot DCR data collection in Azure Monitor](../essentials/data-collection-rule-monitor.md) to enable monitoring for the DCR.
  - View metrics to determine if data is being collected and whether any rows are being dropped. 
  - View logs to identify errors in the data collection.

## Next steps

- [Collect text logs by using Azure Monitor Agent](data-collection-text-log.md).
- Learn more about [Azure Monitor Agent](azure-monitor-agent-overview.md).
- Learn more about [data collection rules](../essentials/data-collection-rule-overview.md).
