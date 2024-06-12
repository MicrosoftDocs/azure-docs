---
title: Collect events and performance counters from virtual machines with Azure Monitor Agent
description: Describes how to collect events and performance counters from virtual machines, Virtual Machine Scale Sets, and Arc-enabled on-premises servers using Azure Monitor Agent.
ms.topic: conceptual
ms.date: 7/19/2023
author: guywild
ms.author: guywild
ms.reviewer: jeffwo

---

# Collect logs and performance data with Azure Monitor Agent

[Azure Monitor agent (AMA)](azure-monitor-agent-overview.md) is used to collect data from Azure virtual machines, Virtual Machine scale sets, and Arc-enabled servers. [Data collection rules (DCR)](../essentials/data-collection-rule-overview.md) define the data to collect from the agent and where that data should be sent.  This article describes how to use the Azure portal to install AMA on virtual machines in your environment and configure data collection of the most common types of client data.

If you're new to Azure Monitor or have basic data collection requirements, then you may be able to meet all of your requirements using the Azure portal and the guidance in this article. If you want to take advantage of additional DCR features such as [transformations](../essentials/data-collection-transformations.md), then you may need to create or edit a DCR after creating it in the portal. You can also use different methods to manage DCRs and create associations if you want to deploy using CLI, PowerShell, ARM templates, or Azure Policy.

> [!NOTE]
> To send data across tenants, you must first enable [Azure Lighthouse](../../lighthouse/overview.md).

## Types of data
The following table lists the types of data that you can collect using the Azure portal. There may be additional data types or additional features that may require you to create your own DCR or edit one after creating it in the portal.

| Data | Client operating system |
|:---|:---|
| Windows events | Windows |
| Syslog events | Linux |
| Performance counters | Windows and Linux |
| Text logs | Windows and Linux |
| JSON logs | Windows and Linux |
| IIS logs | Windows |

A DCR can contain multiple different data sources up to a limit of 10 data sources in a single DCR. You can combine different data sources in the same DCR, but you will typically want to create different DCRs for different data collection scenarios. See [Best practices for data collection rule creation and management in Azure Monitor](../essentials/data-collection-rule-best-practices.md) for recommendations on how to organize your DCRs.


## Prerequisites

- Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- [Permissions to create Data Collection Rule objects](../essentials/data-collection-rule-create-edit.md#permissions) in the workspace.

## Create data collection rule

Select **Data Collection Rules** in the **Monitor** menu ion the Azure portal and then click **Create**.

:::image type="content" source="media/data-collection-portal/create-data-collection-rule.png" lightbox="media/data-collection-portal/create-data-collection-rule.png" alt-text="Screenshot that shows Create button for a new data collection rule.":::

The **Basic** page includes basic information about the DCR.

:::image type="content" source="media/data-collection-portal/basics-tab.png" lightbox="media/data-collection-portal/basics-tab.png" alt-text="Screenshot that shows the Basic tab for a new data collection rule.":::

| Setting | Description |
|:---|:---|
| Rule Name | Name for the DCR. This should be something descriptive that helps you identify the rule. |
| Subscription | Subscription to store the DCR. This does not need to be the same subscription as the virtual machines. |
| Resource group | Resource group to store the DCR. This does not need to be the same resource group as the virtual machines. |
| Region | Region to store the DCR. The virtual machines and their associations must be in the same region. |
| Platform Type | Specifies the type of data sources that will be available for the DCR. The Custom option allows for both Windows and Linux types. |
| Data Collection Endpoint | Specifies the data collection endpoint used to collect data if one is required for any of the data sources in this DCR. This data collection endpoint must be in the same region as the Log Analytics workspace. For more information, see [How to set up data collection endpoints based on your deployment](data-collection-endpoints.md). |


## Add resources
The **Resources** page allows you to add resources that will be associated with the DCR. Click **+ Add resources** to select resources. The Azure Monitor agent will automatically be installed on any resources that don't already have it. You can include different types of resources in the same DCR, but you will typically want to create different DCRs for different data collection scenarios.

[!IMPORTANT] The portal enables system-assigned managed identity on the target resources, along with existing user-assigned identities, if there are any. For existing applications, unless you specify the user-assigned identity in the request, the machine defaults to using system-assigned identity instead.

:::image type="content" source="media/data-collection-portal/resources-tab.png" lightbox="media/data-collection-portal/basics-tab.png" alt-text="Screenshot that shows the Resources tab for a new data collection rule.":::

Select **Enable Data Collection Endpoints** to display a dropdown for selected resource. This data collection endpoint sends configuration files to the resource and must be in the same region as the resource. The DCE on the **Basics** page is the one that is used to receive data for all agents associated with the DCR. See How to set up data collection endpoints based on your deployment.


## Add data sources
The **Collect and deliver** allows you to 

1. In the **Collect and deliver** step, select **Performance Counters** or **Windows Event Logs** from the **Data source type** dropdown. 
1. For performance counters, select from a predefined set of objects and their sampling rate. For events, you can select from a set of logs and severity levels.
    
    :::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-basic-updated.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-basic-updated.png" alt-text="Screenshot that shows the Azure portal form to select basic performance counters in a data collection rule." border="false":::

1. Select **Custom** to collect logs and performance counters that aren't [currently supported data sources](azure-monitor-agent-overview.md#data-sources-and-destinations) or to [filter events by using XPath queries](#filter-events-using-xpath-queries). You can then specify an [XPath](https://www.w3schools.com/xml/xpath_syntax.asp) to collect any specific values.

    To collect a performance counter that's not available by default, use the format `\PerfObject(ParentInstance/ObjectInstance#InstanceIndex)\Counter`. If the counter name contains an ampersand (&), replace it with `&amp;`. For example, `\Memory\Free &amp; Zero Page List Bytes`.
   
    For examples of DCRs, see [Sample data collection rules (DCRs) in Azure Monitor](data-collection-rule-sample-agent.md).
   
    :::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-custom-updated.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-custom-updated.png" alt-text="Screenshot that shows the Azure portal form to select custom performance counters in a data collection rule." border="false":::

> [!NOTE] 
> At this time, Microsoft.HybridCompute ([Azure Arc-enabled servers](../../azure-arc/servers/overview.md)) resources can't be viewed in [Metrics Explorer](../essentials/metrics-getting-started.md) (the Azure portal UX), but they can be acquired via the Metrics REST API (Metric Namespaces - List, Metric Definitions - List, and Metrics - List).

## Filter events using XPath queries

You're charged for any data you collect in a Log Analytics workspace. Therefore, you should only collect the event data you need. The basic configuration in the Azure portal provides you with a limited ability to filter out events.

[!INCLUDE [azure-monitor-cost-optimization](../../../includes/azure-monitor-cost-optimization.md)]

To specify more filters, use custom configuration and specify an XPath that filters out the events you don't need. XPath entries are written in the form `LogName!XPathQuery`. For example, you might want to return only events from the Application event log with an event ID of 1035. The `XPathQuery` for these events would be `*[System[EventID=1035]]`. Because you want to retrieve the events from the Application event log, the XPath is `Application!*[System[EventID=1035]]`

### Extract XPath queries from Windows Event Viewer

In Windows, you can use Event Viewer to extract XPath queries as shown in the screenshots.

When you paste the XPath query into the field on the **Add data source** screen, as shown in step 5, you must append the log type category followed by an exclamation point (!).

:::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-extract-xpath.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-extract-xpath.png" alt-text="Screenshot that shows the steps to create an XPath query in the Windows Event Viewer.":::


> [!TIP]
> You can use the PowerShell cmdlet `Get-WinEvent` with the `FilterXPath` parameter to test the validity of an XPath query locally on your machine first. For more information, see the tip provided in the [Windows agent-based connections](../../sentinel/connect-services-windows-based.md) instructions. The [`Get-WinEvent`](/powershell/module/microsoft.powershell.diagnostics/get-winevent) PowerShell cmdlet supports up to 23 expressions. Azure Monitor data collection rules support up to 20. The following script shows an example:
>
> ```powershell
> $XPath = '*[System[EventID=1035]]'
> Get-WinEvent -LogName 'Application' -FilterXPath $XPath
> ```
>
> - In the preceding cmdlet, the value of the `-LogName` parameter is the initial part of the XPath query until the exclamation point (!). The rest of the XPath query goes into the `$XPath` parameter.
> - If the script returns events, the query is valid.
> - If you receive the message "No events were found that match the specified selection criteria," the query might be valid but there are no matching events on the local machine.
> - If you receive the message "The specified query is invalid," the query syntax is invalid.

Examples of using a custom XPath to filter events:

| Description |  XPath |
|:---|:---|
| Collect only System events with Event ID = 4648 |  `System!*[System[EventID=4648]]`
| Collect Security Log events with Event ID = 4648 and a process name of consent.exe | `Security!*[System[(EventID=4648)]] and *[EventData[Data[@Name='ProcessName']='C:\Windows\System32\consent.exe']]` |
| Collect all Critical, Error, Warning, and Information events from the System event log except for Event ID = 6 (Driver loaded) |  `System!*[System[(Level=1 or Level=2 or Level=3) and (EventID != 6)]]` |
| Collect all success and failure Security events except for Event ID 4624 (Successful logon) |  `Security!*[System[(band(Keywords,13510798882111488)) and (EventID != 4624)]]` |

> [!NOTE]
> For a list of limitations in the XPath supported by Windows event log, see [XPath 1.0 limitations](/windows/win32/wes/consuming-events#xpath-10-limitations).  
> For instance, you can use the "position", "Band", and "timediff" functions within the query but other functions like "starts-with" and "contains" are not currently supported.


## Frequently asked questions

This section provides answers to common questions.

#### How can I collect Windows security events by using Azure Monitor Agent?

There are two ways you can collect Security events using the new agent, when sending to a Log Analytics workspace:
- You can use Azure Monitor Agent to natively collect Security Events, same as other Windows Events. These flow to the [Event](/azure/azure-monitor/reference/tables/Event) table in your Log Analytics workspace. 
- If you have Microsoft Sentinel enabled on the workspace, the security events flow via Azure Monitor Agent into the [SecurityEvent](/azure/azure-monitor/reference/tables/SecurityEvent) table instead (the same as using the Log Analytics agent). This scenario always requires the solution to be enabled first.

### Will I duplicate events if I use Azure Monitor Agent and the Log Analytics agent on the same machine? 

If you're collecting the same events with both agents, duplication occurs. This duplication could be the legacy agent collecting redundant data from the [workspace configuration](./agent-data-sources.md) data, which is collected by the data collection rule. Or you might be collecting security events with the legacy agent and enable Windows security events with Azure Monitor Agent connectors in Microsoft Sentinel.
          
Limit duplication events to only the time when you transition from one agent to the other. After you've fully tested the data collection rule and verified its data collection, disable collection for the workspace and disconnect any Microsoft Monitoring Agent data connectors.

### Does Azure Monitor Agent offer more granular event filtering options other than Xpath queries and specifying performance counters?

For Syslog events on Linux, you can select facilities and the log level for each facility.

### If I create data collection rules that contain the same event ID and associate them to the same VM, will events be duplicated?

Yes. To avoid duplication, make sure the event selection you make in your data collection rules doesn't contain duplicate events.

## Next steps

- [Collect text logs by using Azure Monitor Agent](data-collection-text-log.md).
- Learn more about [Azure Monitor Agent](azure-monitor-agent-overview.md).
- Learn more about [data collection rules](../essentials/data-collection-rule-overview.md).
