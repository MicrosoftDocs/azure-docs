<properties 
   pageTitle="Alert Management solution in Log Analytics | Microsoft Azure"
   description="The Alert Management solution in Log Analytics helps you analyze all of the alerts in your environment.  In addition to consolidating alerts generated within OMS, it imports alerts from connected System Center Operations Manager (SCOM) management groups into Log Analytics."
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
   ms.date="06/07/2016"
   ms.author="bwren" />

# Alert Management solution in Log Analytics

![Alert Management icon](media/log-analytics-solution-alert-management/icon.png) The Alert Management solution helps you analyze all of the alerts in your environment.  In addition to consolidating alerts generated within OMS, it imports alerts from connected System Center Operations Manager (SCOM) management groups into Log Analytics.  In environments with multiple management groups, the Alert Management solution will provide a consolidated view of alerts across all management groups.

## Prerequisites

- To import alerts from SCOM, this solution requires a connection between your OMS workspace and a SCOM management group using the process described in [Connect Operations Manager to Log Analytics](log-analytics-om-agents.md).  


## Configuration

Add the Alert Management solution to your OMS workspace using the process described in [Add solutions](log-analytics-add-solutions.md).  There is no further configuration required.

## Management packs

If your SCOM management group is connected to your OMS workspace,  then the following management packs will be installed in SCOM when you add this solution.  There is no configuration or maintenance of these management packs required.  

- Microsoft System Center Advisor Alert Management (Microsoft.IntelligencePacks.AlertManagement)

For more information on how solution management packs are updated, see [Connect Operations Manager to Log Analytics](log-analytics-om-agents.md).

## Data collection

### Agents

The following table describes the connected sources that are supported by this solution.

| Connected Source | Support | Description |
|:--|:--|:--|
| [Windows agents](log-analytics-windows-agents.md) | No | Direct Windows agents do not generate SCOM alerts. |
| [Linux agents](log-analytics-limux-agents.md) | No | Direct Linux agents do not generate SCOM alerts. |
| [SCOM management group](log-analytics-om-agents.md) | Yes | Alerts that are generated on SCOM agents are delivered to the management group and then forwarded to Log Analytics.<br><br>A direct connection from the SCOM agent to Log Analytics is not required. Alert data is forwarded from the management group to the OMS repository. |
| [Azure storage account](log-analytics-azure-storage.md) | No | SCOM alerts are not stored in Azure storage accounts. |

### Collection frequency

Alerts generated within OMS are available to the solution immediately.  Alert data is sent from the SCOM management group to Log Analytics every 3 minutes.  

## Using the solution

When you add the Alert Management solution to your OMS workspace, the **Alert Management** tile will be added to your OMS dashboard.  This tile displays a count and graphical representation of the number of currently active alerts that were generated within the last 24 hours.  You cannot change this time range.

![Alert Management tile](media/log-analytics-solution-alert-management/tile.png)

Click on the **Alert Management** tile to open the **Alert Management** dashboard.  The dashboard includes the columns in the following table.  Each column lists the top ten alerts by count matching that column's criteria for the specified scope and time range.  You can run a log search that provides the entire list by clicking **See all** at the bottom of the column or by clicking the column header.

| Column| Description |
|:--|:--|
| Critical Alerts | All alerts with a severity of Critical grouped by alert name.  Click on an alert name to run a log search returning all records for that alert. |
| Warning Alerts | All alerts with a severity of Warning grouped by alert name.  Click on an alert name to run a log search returning all records for that alert. |
| Active SCOM Alerts | All SCOM alerts with any state other than *Closed* grouped by source that generated the alert. |
| All Active Alerts | All alerts with any severity grouped by alert name. Only includes SCOM alerts with any state other than *Closed*.|

If you scroll to the right, the dashboard will list several common queries that you can click on to perform a [log search](log-analytics-log-searches.md) for alert data. 

![Alert Management dashboard](media/log-analytics-solution-alert-management/dashboard.png)

## Scope and time range

By default, the scope of the alerts analyzed in the Alert Management solution is from all connected management groups generated within the last 7 days.  

![Alert Management scope](media/log-analytics-solution-alert-management/scope.png)

- To change the management groups included in the analysis, click **Scope** at the top of the dashboard.  You can either select **Global** for all connected management groups or **By Management Group** to select a single management group.

- To change the time range of alerts, select **Data based on** at the top of the dashboard.  You can select alerts generated within the last 7 days, 1 day, or 6 hours.  Or you can select **Custom** and specify a custom date range.

## Log Analytics records

The Alert Management solution analyzes any record with a type of **Alert**.  It will also import alerts from SCOM and create a corresponding record for each with a type of **Alert** and a SourceSystem of **OpsManager**.  These records have the properties in the following table.  

| Property | Description |
|:--|:--|
| Type | *Alert* |
| SourceSystem | *OpsManager* |
| AlertContext | Details of the data item that caused the alert to be generated in XML format. |
| AlertDescription | Detailed description of the alert. |
| AlertId | GUID of the alert. |
| AlertName | Name of the alert. |
| AlertPriority | Priority level of the alert. |
| AlertSeverity | Severity level of the alert. |
| AlertState | Latest resolution state of the alert. |
| LastModifiedBy | Name of the user who last modified the alert. |
| ManagementGroupName | Name of the management group where the alert was generated. |
| RepeatCount | Number of time the same alert was generated for the same monitored object since being resolved. |
| ResolvedBy | Name of the user who resolved the alert. Empty if the alert has not yet been resolved. |
| SourceDisplayName | Display name of the monitoring object that generated the alert. |
| SourceFullName | Full name of the monitoring object that generated the alert. |
| TicketId | Ticket ID for the alert if the SCOM environment is integrated with a process for assigning tickets for alerts.  Empty of no ticket ID is assigned. |
| TimeGenerated | Date and time that the alert was created. |
| TimeLastModified | Date and time that the alert was last changed. |
| TimeRaised | Date and time that the alert was generated. |
| TimeResolved | Date and time that the alert was resolved. Empty if the alert has not yet been resolved. |

## Sample log searches

The following table provides sample log searches for alert records collected by this solution.  

| Query | Description |
|:--|:--|
| Type=Alert SourceSystem=OpsManager AlertSeverity=error TimeRaised>NOW-24HOUR | Critical alerts raised during the past 24 hours |
| Type=Alert AlertSeverity=warning TimeRaised>NOW-24HOUR | Warning alerts raised during the past 24 hours  |
| Type=Alert SourceSystem=OpsManager AlertState!=Closed TimeRaised>NOW-24HOUR &#124; measure count() as Count by SourceDisplayName | Sources with active alerts raised during the past 24 hours |
| Type=Alert SourceSystem=OpsManager AlertSeverity=error TimeRaised>NOW-24HOUR AlertState!=Closed | Critical alerts raised during the past 24 hours which are still active |
| Type=Alert SourceSystem=OpsManager TimeRaised>NOW-24HOUR AlertState=Closed | Alerts raised during the past 24 hours which are now closed |
| Type=Alert SourceSystem=OpsManager TimeRaised>NOW-1DAY &#124; measure count() as Count by AlertSeverity | Alerts raised during the past 1 day grouped by their severity |
| Type=Alert SourceSystem=OpsManager TimeRaised>NOW-1DAY &#124; sort RepeatCount desc | Alerts raised during the past 1 day sorted by their repeat count value |

## Next steps

- Learn about [Alerts in Log Analytics](log-analytics-alerts.md) for details on generating alerts from Log Analytics. 