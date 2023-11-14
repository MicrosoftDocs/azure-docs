---
title: Agent Health solution in Azure Monitor | Microsoft Docs
description: Learn how to use this solution to monitor the health of your agents reporting directly to Log Analytics or System Center Operations Manager.
ms.topic: conceptual
ms.date: 08/09/2023
ms.reviewer: shijain

---

# Agent Health solution in Azure Monitor
The Agent Health solution in Azure helps you understand which monitoring agents are unresponsive and submitting operational data. That includes all the agents that report directly to the Log Analytics workspace in Azure Monitor or to a System Center Operations Manager management group connected to Azure Monitor.

You can also use the Agent Health solution to:

* Keep track of how many agents are deployed and where they're distributed geographically.
* Perform other queries to maintain awareness of the distribution of agents deployed in Azure, in other cloud environments, or on-premises.

> [!IMPORTANT]
> The Agent Health solution only monitors the health of the [Log Analytics agent](log-analytics-agent.md) which is on a deprecation path. This solution doesn't monitor the health of the [Azure Monitor agent](agents-overview.md).

## Prerequisites
Before you deploy this solution, confirm that you have supported [Windows agents](../agents/agent-windows.md) reporting to the Log Analytics workspace or reporting to an [Operations Manager management group](agents-overview.md) integrated with your workspace.

## Management packs
If your Operations Manager management group is connected to a Log Analytics workspace, the following management packs are installed in Operations Manager. These management packs are also installed on directly connected Windows computers after you add this solution:

* Microsoft System Center Advisor HealthAssessment Direct Channel Intelligence Pack (Microsoft.IntelligencePacks.HealthAssessmentDirect)
* Microsoft System Center Advisor HealthAssessment Server Channel Intelligence Pack (Microsoft.IntelligencePacks.HealthAssessmentViaServer)

There's nothing to configure or manage with these management packs. For more information on how solution management packs are updated, see [Connect Operations Manager to Log Analytics](../agents/om-agents.md).

## Configuration
Add the Agent Health solution to your Log Analytics workspace by using the process described in [Add solutions](../insights/solutions.md). No further configuration is required.

## Supported agents
The following table describes the connected sources that this solution supports.

| Connected source | Supported | Description |
| --- | --- | --- |
| Windows agents | Yes | Heartbeat events are collected from direct Windows agents.|
| System Center Operations Manager management group | Yes | Heartbeat events are collected from agents that report to the management group every 60 seconds and are then forwarded to Azure Monitor. A direct connection from Operations Manager agents to Azure Monitor isn't required. Heartbeat event data is forwarded from the management group to the Log Analytics workspace.|

## Use the solution
When you add the solution to your Log Analytics workspace, the **Agent Health** tile is added to your dashboard. This tile shows the total number of agents and the number of unresponsive agents in the last 24 hours.

:::image type="content" source="media/solution-agenthealth/agenthealth-solution-tile-homepage.png" alt-text="Screenshot that shows the Agent Health tile on the dashboard." lightbox="media/solution-agenthealth/agenthealth-solution-tile-homepage.png":::

Select the **Agent Health** tile to open the **Agent Health** dashboard. The dashboard includes the columns in the following table. Each column lists the top 10 events by count that match that column's criteria for the specified time range. You can run a log search that provides the entire list. Select **See all** beneath each column or select the column heading.

| Column | Description |
|--------|-------------|
| Agent count over time | A trend of your agent count over a period of seven days for both Linux and Windows agents|
| Count of unresponsive agents | A list of agents that haven't sent a heartbeat in the past 24 hours|
| Distribution by OS type | A partition of how many Windows and Linux agents you have in your environment|
| Distribution by agent version | A partition of the agent versions installed in your environment and a count of each one|
| Distribution by agent category | A partition of the categories of agents that are sending up heartbeat events: direct agents, Operations Manager agents, or the Operations Manager management server|
| Distribution by management group | A partition of the Operations Manager management groups in your environment|
| Geo-location of agents | A partition of the countries/regions where you have agents, and a total count of the number of agents that have been installed in each country/region|
| Count of gateways installed | The number of servers that have the Log Analytics gateway installed, and a list of these servers|

:::image type="content" source="media/solution-agenthealth/agenthealth-solution-dashboard.png" alt-text="Screenshot that shows an example of the Agent Health solution dashboard." lightbox="media/solution-agenthealth/agenthealth-solution-dashboard.png":::

## Azure Monitor log records
The solution creates one type of record in the Log Analytics workspace: heartbeat. Heartbeat records have the properties listed in the following table.

| Property | Description |
| --- | --- |
| `Type` | `Heartbeat`|
| `Category` | `Direct Agent`, `SCOM Agent`, or `SCOM Management Server`|
| `Computer` | Computer name|
| `OSType` | Windows or Linux operating system|
| `OSMajorVersion` | Operating system major version|
| `OSMinorVersion` | Operating system minor version|
| `Version` | Log Analytics agent or Operations Manager agent version|
| `SCAgentChannel` | `Direct` and/or `SCManagementServer`|
| `IsGatewayInstalled` | `true` if the Log Analytics gateway is installed; otherwise `false`|
| `ComputerIP` | Public IP address for an Azure virtual machine, if one is available; Azure SNAT address (not the private IP address) for a virtual machine that uses a private IP |
| `ComputerPrivateIPs` | List of private IPs of the computer |
| `RemoteIPCountry` | Geographic location where the computer is deployed|
| `ManagementGroupName` | Name of the Operations Manager management group|
| `SourceComputerId` | Unique ID of the computer|
| `RemoteIPLongitude` | Longitude of the computer's geographic location|
| `RemoteIPLatitude` | Latitude of the computer's geographic location|

Each agent that reports to an Operations Manager management server will send two heartbeats. The `SCAgentChannel` property's value will include both `Direct` and `SCManagementServer`, depending on what data sources and monitoring solutions you've enabled in your subscription.

If you recall, data from solutions is sent either:

* Directly from an Operations Manager management server to Azure Monitor.
* Directly from the agent to Azure Monitor, because of the volume of data collected on the agent.

For heartbeat events that have the value `SCManagementServer`, the `ComputerIP` value is the IP address of the management server because it actually uploads the data. For heartbeats where `SCAgentChannel` is set to `Direct`, it's the public IP address of the agent.

## Sample log searches
The following table provides sample log searches for records that the solution collects.

| Query | Description |
|:---|:---|
| Heartbeat &#124; distinct Computer |Total number of agents |
| Heartbeat &#124; summarize LastCall = max(TimeGenerated) by Computer &#124; where LastCall < ago(24h) |Count of unresponsive agents in the last 24 hours |
| Heartbeat &#124; summarize LastCall = max(TimeGenerated) by Computer &#124; where LastCall < ago(15m) |Count of unresponsive agents in the last 15 minutes |
| Heartbeat &#124; where TimeGenerated > ago(24h) and Computer in ((Heartbeat &#124; where TimeGenerated > ago(24h) &#124; distinct Computer)) &#124; summarize LastCall = max(TimeGenerated) by Computer |Computers online in the last 24 hours |
| Heartbeat &#124; where TimeGenerated > ago(24h) and Computer !in ((Heartbeat &#124; where TimeGenerated > ago(30m) &#124; distinct Computer)) &#124; summarize LastCall = max(TimeGenerated) by Computer |Total agents offline in the last 30 minutes (for the last 24 hours) |
| Heartbeat &#124; summarize AggregatedValue = dcount(Computer) by OSType |Trend of the number of agents over time by OS type|
| Heartbeat &#124; summarize AggregatedValue = dcount(Computer) by OSType |Distribution by OS type |
| Heartbeat &#124; summarize AggregatedValue = dcount(Computer) by Version |Distribution by agent version |
| Heartbeat &#124; summarize AggregatedValue = count() by Category |Distribution by agent category |
| Heartbeat &#124; summarize AggregatedValue = dcount(Computer) by ManagementGroupName | Distribution by management group |
| Heartbeat &#124; summarize AggregatedValue = dcount(Computer) by RemoteIPCountry |Geo-location of agents |
| Heartbeat &#124; where iff(isnotnull(toint(IsGatewayInstalled)), IsGatewayInstalled == true, IsGatewayInstalled == "true") == true &#124; distinct Computer |Number of Log Analytics gateways installed |

## Next steps

Learn about [generating alerts from log queries in Azure Monitor](../alerts/alerts-overview.md).