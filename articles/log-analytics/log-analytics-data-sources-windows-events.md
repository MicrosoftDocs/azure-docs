<properties 
   pageTitle="Windows Event logs in Log Analytics"
   description="Windows Event logs are one of the most common data sources used by Log Analytics.  This article describes how to configure collection of Windows Event logs and details of the events they create in the OMS repository."
   services="log-analytics"
   documentationCenter=""
   authors="bwren"
   manager="jwhit"
   editor="tysonn" />
<tags 
   ms.service="log-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/08/2016"
   ms.author="bwren" />

# Windows event log in Log Analytics

Windows Event logs are one of the most common data sources used for Windows agents since this is the method used by many applications to log information and errors.  You can collect events from standard logs such as System and Application in addition to specifying any custom logs created by applications you need to monitor.

![Windows Events](./media/log-analytics-data-sources-windows-events/overview.png)     

# Configuring Windows Event logs

Events will only be collected from the Windows event logs that are specified.  You can add a new log by typing in the name of the log and clicking **+**.  For each log, only events with the selected severities will be collected.  Check the severities for the particular log that you want to collect.

![Configure Windows events](./media/log-analytics-data-sources-windows-events/configure.png)


# Data collection

Log Analytics will collect each event that matches a selected severity from a monitored event log as the event is created.  The agent will record its place in each event log that it collects from.  If the agent goes offline for a period of time, then Log Analytics will collect events from where it last left off, even if those events were created while the agent was offline.


# Windows records properties

Windows event records have a type of **Event** and have the [standard properties of all Log Analytics recrods](log-analytics-data-sources.md#log-analytics-records) in addition to the properties in the following table.

| Property | Description |
|:--|:--|
| Computer            | Computer that the event was collected from. |
| EventCategory       | Category of the event. |
| EventData           | All event data in raw format. |
| EventID             | Number of the event. |
| EventLevel          | Severity of the event in numeric form. |
| EventLevelName      | Severity of the event in text form. |
| EventLog            | Name of the event log that the event was collected from. |
| ParameterXml        | Event parameter values in XML format. |
| ManagementGroupName | Name of the management group for SCOM agents.  For other agents, this is AOI-<workspace ID> |
| RenderedDescription | Event description with parameter values |
| Source              | Source of the event. |
| UserName            | User name of the account that logged the event. |



# Log queries with Windows Events

The record type for a Windows Event is **Event**.  The following table provides different examples of log queries that retrieve Windows Event records.

| Query | Description |
|:--|:--|
| Type=Event | All Windows events. |
| Type=Event EventLevelName=error | All Windows events with severity of error. |
| Type=Event &#124; Measure count() by Source | Count of Windows events by source. |
| Type=Event EventLevelName=error &#124; Measure count() by Source | Count of Windows error events with by source. |