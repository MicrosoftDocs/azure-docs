---
title: Agent Health solution in OMS | Microsoft Docs
description: This article is intended to help you understand how to use this solution to monitor the health of your agents reporting directly to OMS or System Center Operations Manager.
services: operations-management-suite
documentationcenter: ''
author: MGoedtel
manager: carmonm
editor: ''

ms.assetid: 
ms.service: operations-management-suite
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 06/13/2017
ms.author: magoedte

---
#  Agent Health solution in OMS
The Agent Health solution in OMS helps you understand, for all of the agents reporting directly to the OMS workspace or a System Center Operations Manager management group  connected to OMS, which are unresponsive and submitting operational data.  You can also keep track of how many agents are deployed, where they are distributed geographically, and perform other queries to maintain awareness of the distribution of agents deployed in Azure, other cloud environments, or on-premises.    

## Prerequisites
Before you deploy this solution, confirm you have currently supported [Windows agents](log-analytics-windows-agents.md) reporting to the OMS workspace or reporting to an [Operations Manager management group](log-analytics/log-analytics-om-agents.md) integrated with your OMS workspace.    

## Solution components
This solution consists of the following resources that are added to your workspace and directly connected agents or Operations Manager connected management group. 

### Management packs
If your System Center Operations Manager management group is connected to an OMS workspace,  the following management packs are installed in Operations Manager.  These management packs are also installed on directly connected Windows computers after adding this solution. There is nothing to configure or manage with these management packs. 

* Microsoft System Center Advisor HealthAssessment Direct Channel Intelligence Pack  (Microsoft.IntelligencePacks.HealthAssessmentDirect)
* Microsoft System Center Advisor HealthAssessment Server Channel Intelligence Pack (Microsoft.IntelligencePacks.HealthAssessmentViaServer).  

For more information on how solution management packs are updated, see [Connect Operations Manager to Log Analytics](../log-analytics/log-analytics-om-agents.md).

## Configuration
Add the Agent Health solution to your OMS workspace using the process described in [Add solutions](log-analytics-add-solutions.md). There is no further configuration required.


## Data collection
### Supported agents
The following table describes the connected sources that are supported by this solution.

| Connected Source | Supported | Description |
| --- | --- | --- |
| Windows agents | Yes | Heartbeat events are collected from direct Windows agents.|
| System Center Operations Manager management group | Yes | Heartbeat events are collected from  agents reporting to the management group every 60 seconds and then forwarded to Log Analytics. A direct connection from Operations Manager agents to Log Analytics is not required. Heartbeat event data is forwarded from the management group to the Log Analytics repository.|

## Using the solution
When you add the solution to your OMS workspace, the **Agent Health** tile will be added to your OMS dashboard. This tile shows the total number of agents and the number of unresponsive agents in the last 24 hours.<br><br> ![Agent Health Solution tile on dashboard](./media/oms-solution-agenthealth/agenthealth-solution-tile-homepage.png)

Click on the **Agent Health** tile to open the **"Agent Health** dashboard.  The dashboard includes the columns in the following table. Each column lists the top ten events by count that match that column’s criteria for the specified time range. You can run a log search that provides the entire list by selecting **See all** at the right bottom of each column, or by clicking the column header.

| Column | Description | 
|--------|-------------|
| Agent count over time | A trend of your agent count over a period of seven days for both Linux and Windows agents.| 
| Count of unresponsive agents | A list of agents that haven’t sent a heartbeat in the past 24 hours.| 
| Distribution by OS Type | A partition of how many Windows and Linux agents you have in your environment.| 
| Distribution by Agent Version | 
A partition of the different agent versions installed in your environment and a count of each one.| 
| Distribution by Agent Category | A partition of the different categories of agents that are sending up heartbeat events: direct agents, OpsMgr agents, or the OpsMgr Management Server.| 
| Distribution by Management Group | A partition of the different SCOM Management groups in your environment.| 
| Geo-location of Agents | 
A partition of the different countries where you have agents and a total count of the number of agents that have been installed in each country.| 
| Count of Gateways Installed | The number of servers that have the OMS Gateway installed, and a list of these servers.|

![Agent Health Solution dashboard example](./media/oms-solution-agenthealth/agenthealth-solution-dashboard.png)  

## Log Analytics records
The solution creates one type of record in the OMS repository.

### Heartbeat records
A record with a type of **Heartbeat** is created.  These records have the properties in the following table.  

| Property | Description |
| --- | --- |
| Type | *Heartbeat*|
| Category | Direct agent, OpsMgr agent, or OpsMgr management server.| 
| Computer | Computer name.| 
| OSType | Windows or Linux operating system.| 
| OSMajorVersion | Operating system major version.| 
| OSMinorVersion | Operating system minor version.| 
| Version | OMS Agent or Operations Manager Agent version.| 
| SCAgentChannel | Direct agent or Operations Manager management server.| 
| IsGatewayInstalled | If OMS Gateway is installed, value is *true*, otherwise value is *false*.| 
| ComputerIP | IP address of the computer.| 
| RemoteIPCountry | Geographic location where computer is deployed.| 
| ManagementGroupName | Name of Operations Manager management group.| 
| SourceComputerId | Unique ID of computer.| 
| RemoteIPLongitude | Longitude of computer's geographic location.| 
| RemoteIPLatitude | Latitude of computer's geographic location.| 

## Sample log searches
The following table provides sample log searches for records collected by this solution. 

| Query | Description |
| --- | --- |
| `Type=Heartbeat | distinct Computer`|Total number of agents | 
| `Type=Heartbeat | measure max(TimeGenerated) as LastCall by Computer | where LastCall < NOW-24HOURS`|Count of unresponsive agents in the last 24 hours | 
| `Type=Heartbeat TimeGenerated>NOW-24HOURS Computer IN {Type=Heartbeat TimeGenerated>NOW-24HOURS  | distinct Computer} | measure max(TimeGenerated) as LastCall by Computer`|Computers online (in the last 24 hours) | 
| `Type=Heartbeat TimeGenerated>NOW-24HOURS Computer NOT IN {Type=Heartbeat TimeGenerated>NOW-30MINUTES  | distinct Computer} | measure max(TimeGenerated) as LastCall by Computer`|Total Agents Offline in Last 30 minutes (for the last 24 hours) | 
| `Type=Heartbeat | measure countdistinct(Computer) by OSType`|Get a trend of number of agents over time by OSType| 
| Line chart: `Type=Heartbeat | measure countdistinct(Computer) by OSType`<br> List: `Type=Heartbeat | Distinct Computer`|Agent count over time | 
| Donut and List: `Type=Heartbeat|measure countdistinct(Computer) by OSType`|Distribution by OS Type | 
| Donut and List: `Type=Heartbeat|measure countdistinct(Computer) by Version`|Distribution by Agent Version | 
| Donut and List: `Type=Heartbeat|measure count() by Category`|Distribution by Agent Category | 
| Donut and List: `Type=Heartbeat|measure countdistinct(Computer) by ManagementGroupName`|Distribution by Management Group | 
| Donut and List: `Type=Heartbeat|measure countdistinct(Computer) by RemoteIPCountry`|Geo-location of Agents |
| Number and List: `Type=Heartbeat IsGatewayInstalled=true|Distinct Computer`|Number of OMS Gateways Installed | 

## Troubleshooting 

This section provides information to help troubleshoot issues with the solution.  

  
## Next steps

* Learn about [Alerts in Log Analytics](../log-analytics/log-analytics-alerts.md) for details on generating alerts from Log Analytics.