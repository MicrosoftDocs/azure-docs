---
title: Collect Windows event log data sources with Log Analytics agent in Azure Monitor
description: The article describes how to configure the collection of Windows event logs by Azure Monitor and details of the records they create.
ms.topic: conceptual
ms.date: 07/06/2023
ms.reviewer: luki

---

# Collect Windows event log data sources with Log Analytics agent

Windows event logs are one of the most common [data sources](../agents/agent-data-sources.md) for Log Analytics agents on Windows virtual machines because many applications write to the Windows event log. You can collect events from standard logs, such as System and Application, and any custom logs created by applications you need to monitor.

:::image type="content" source="media/data-sources-windows-events/overview.png" lightbox="media/data-sources-windows-events/overview.png" alt-text="Diagram that shows the Log Analytics agent sending Windows events to the Event table in Azure Monitor.":::

[!INCLUDE [Log Analytics agent deprecation](../../../includes/log-analytics-agent-deprecation.md)]

## Configure Windows event logs

Configure Windows event logs from the [Legacy agents management menu](../agents/agent-data-sources.md#configure-data-sources) for the Log Analytics workspace.

Azure Monitor only collects events from Windows event logs that are specified in the settings. You can add an event log by entering the name of the log and selecting **+**. For each log, only the events with the selected severities are collected. Check the severities for the particular log that you want to collect. You can't provide any other criteria to filter events.

As you enter the name of an event log, Azure Monitor provides suggestions of common event log names. If the log you want to add doesn't appear in the list, you can still add it by entering the full name of the log. You can find the full name of the log by using event viewer. In event viewer, open the **Properties** page for the log and copy the string from the **Full Name** field.

:::image type="content" source="media/data-sources-windows-events/configure.png" lightbox="media/data-sources-windows-events/configure.png" alt-text="Screenshot that shows the Windows event logs tab on the Legacy agents management screen.":::

> [!IMPORTANT]
> You can't configure collection of security events from the workspace by using the Log Analytics agent. You must use [Microsoft Defender for Cloud](../../security-center/security-center-enable-data-collection.md) or [Microsoft Sentinel](../../sentinel/connect-windows-security-events.md) to collect security events. The [Azure Monitor agent](azure-monitor-agent-overview.md) can also be used to collect security events.

Critical events from the Windows event log will have a severity of "Error" in Azure Monitor Logs.

## Data collection

Azure Monitor collects each event that matches a selected severity from a monitored event log as the event is created. The agent records its place in each event log that it collects from. If the agent goes offline for a while, it collects events from where it last left off, even if those events were created while the agent was offline. There's a potential for these events to not be collected if the event log wraps with uncollected events being overwritten while the agent is offline.

>[!NOTE]
>Azure Monitor doesn't collect audit events created by SQL Server from source *MSSQLSERVER* with event ID 18453 that contains keywords *Classic* or *Audit Success* and keyword *0xa0000000000000*.
>

## Windows event records properties

Windows event records have a type of event and have the properties in the following table:

| Property | Description |
|:--- |:--- |
| Computer |Name of the computer that the event was collected from. |
| EventCategory |Category of the event. |
| EventData |All event data in raw format. |
| EventID |Number of the event. |
| EventLevel |Severity of the event in numeric form. |
| EventLevelName |Severity of the event in text form. |
| EventLog |Name of the event log that the event was collected from. |
| ParameterXml |Event parameter values in XML format. |
| ManagementGroupName |Name of the management group for System Center Operations Manager agents. For other agents, this value is `AOI-<workspace ID>`. |
| RenderedDescription |Event description with parameter values. |
| Source |Source of the event. |
| SourceSystem |Type of agent the event was collected from. <br> OpsManager – Windows agent, either direct connect or Operations Manager managed. <br> Linux – All Linux agents.  <br> AzureStorage – Azure Diagnostics. |
| TimeGenerated |Date and time the event was created in Windows. |
| UserName |User name of the account that logged the event. |

## Log queries with Windows events

The following table provides different examples of log queries that retrieve Windows event records.

| Query | Description |
|:---|:---|
| Event |All Windows events. |
| Event &#124; where EventLevelName == "Error" |All Windows events with severity of error. |
| Event &#124; summarize count() by Source |Count of Windows events by source. |
| Event &#124; where EventLevelName == "Error" &#124; summarize count() by Source |Count of Windows error events by source. |

## Next steps

* Configure Log Analytics to collect other [data sources](../agents/agent-data-sources.md) for analysis.
* Learn about [log queries](../logs/log-query-overview.md) to analyze the data collected from data sources and solutions.
* Configure [collection of performance counters](data-sources-performance-counters.md) from your Windows agents.
