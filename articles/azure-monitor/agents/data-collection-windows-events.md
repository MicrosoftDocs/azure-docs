---
title: Collect Windows events from virtual machines with Azure Monitor Agent
description: Describes how to collect Windows events counters from virtual machines, Virtual Machine Scale Sets, and Arc-enabled on-premises servers using Azure Monitor Agent.
ms.topic: conceptual
ms.date: 07/12/2024
author: guywild
ms.author: guywild
ms.reviewer: jeffwo

---

# Collect Windows events with Azure Monitor Agent
**Windows events** is one of the data sources used in a [data collection rule (DCR)](../essentials/data-collection-rule-create-edit.md). Details for the creation of the DCR are provided in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md). This article provides additional details for the Windows events data source type.

Windows event logs are one of the most common data sources for Windows machines with [Azure Monitor Agent](azure-monitor-agent-overview.md) since it's a common source of health and information for the Windows operating system and applications running on it. You can collect events from standard logs, such as System and Application, and any custom logs created by applications you need to monitor.

## Prerequisites

- [Log Analytics workspace](../logs/log-analytics-workspace-overview.md) where you have at least [contributor rights](../logs/manage-access.md#azure-rbac). Windows events are sent to the [Event](/azure/azure-monitor/reference/tables/event) table.
- Either a new or existing DCR described in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md).

## Configure Windows event data source 

In the **Collect and deliver** step of the DCR, select **Windows Event Logs** from the **Data source type** dropdown. Select from a set of logs and severity levels to collect.

:::image type="content" source="media/data-collection-windows-event/data-source-windows-event.png" lightbox="media/data-collection-windows-event/data-source-windows-event.png" alt-text="Screenshot that shows configuration of a Windows event data source in a data collection rule." :::

Select **Custom** to [filter events by using XPath queries](#filter-events-using-xpath-queries). You can then specify an [XPath](https://www.w3schools.com/xml/xpath_syntax.asp) to collect any specific values.

:::image type="content" source="media/data-collection-windows-event/data-source-windows-event-custom.png" lightbox="media/data-collection-windows-event/data-source-windows-event-custom.png" alt-text="Screenshot that shows custom configuration of a Windows event data source in a data collection rule." :::

## Security events
There are two methods you can use to collect security events with Azure Monitor agent:

- Select the security event log in your DCR just like the System and Application logs. These events are sent to the [Event](/azure/azure-monitor/reference/tables/Event) table in your Log Analytics workspace with other events. 
- Enable Microsoft Sentinel on the workspace which also uses Azure Monitor agent to collect events. Security events are sent to the [SecurityEvent](/azure/azure-monitor/reference/tables/SecurityEvent).

## Filter events using XPath queries

You're charged for any data you collect in a Log Analytics workspace. Therefore, you should only collect the event data you need. The basic configuration in the Azure portal provides you with a limited ability to filter out events. To specify more filters, use custom configuration and specify an XPath that filters out the events you don't need. 

XPath entries are written in the form `LogName!XPathQuery`. For example, you might want to return only events from the Application event log with an event ID of 1035. The `XPathQuery` for these events would be `*[System[EventID=1035]]`. Because you want to retrieve the events from the Application event log, the XPath is `Application!*[System[EventID=1035]]`

[!INCLUDE [azure-monitor-cost-optimization](../../../includes/azure-monitor-cost-optimization.md)]

### Extract XPath queries from Windows Event Viewer

In Windows, you can use Event Viewer to extract XPath queries as shown in the following screenshots.

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
> For a list of limitations in the XPath supported by Windows event log, see [XPath 1.0 limitations](/windows/win32/wes/consuming-events#xpath-10-limitations).  For example, you can use the "position", "Band", and "timediff" functions within the query but other functions like "starts-with" and "contains" are not currently supported.


## Destinations
Windows event data can be sent to the following locations.

| Destination | Table / Namespace |
|:---|:---|
| Log Analytics workspace | [Event](/azure/azure-monitor/reference/tables/event) |
    

:::image type="content" source="media/data-collection-windows-event/destination-workspace.png" lightbox="media/data-collection-windows-event/destination-workspace.png" alt-text="Screenshot that shows configuration of an Azure Monitor Logs destination in a data collection rule." :::


## Next steps

- [Collect text logs by using Azure Monitor Agent](data-collection-text-log.md).
- Learn more about [Azure Monitor Agent](azure-monitor-agent-overview.md).
- Learn more about [data collection rules](../essentials/data-collection-rule-overview.md).
