---
title: Set up diagnostics for monitoring agent updates
description: How to set up diagnostic reports to monitor agent updates.
author: Sefriend
ms.topic: how-to
ms.date: 01/04/2022
ms.author: sefriend
manager: rkiran
---
# Set up diagnostics to monitor agent updates

Diagnostic logs provide insight into what agent version are being installed, when they are being installed, and whether the updates are successful. In the event that an update is unsuccessful, it may be attributed to the session host being turned off. In that case, you'd need to turn the session host back on.

This article describes how to use diagnostic logs in a Log Analytics workspace to monitor agent updates.

## Enable diagnostics to be sent to a Log Analytics workspace

1. Create a Log Analytics workspace, if you have not done so already, and get the workspace ID and primary key using the instructions [here](diagnostics-log-analytics.md#before-you-get-started).

2. Enable diagnostics to be sent to the Log Analytics workspace you just created using the instructions [here](diagnostics-log-analytics.md#push-diagnostics-data-to-your-workspace). 

3. Access the logs in your Log Analytics workspace using the instructions [here](diagnostics-log-analytics.md#how-to-access-log-analytics). 

> [!NOTE]
Only the past 30 days of data is accessible when running any of the queries below.

## Use diagnostics to see when an update becomes available

To see when agent component updates are available, you need to: 

1. Access the logs in your Log Analytics workspace.

2. Select the **+** to create a new query.

3. Copy and paste the following query to see if agent component updates are available for the specified session host. Make sure to change sessionHostName to the name of your session host.

> [!NOTE]
If you have not enabled the Scheduled Agent Updates feature, you will not see anything in the NewPackagesAvailable field.

```kusto
WVDAgentHealthStatus 
| where TimeGenerated >= ago(30d) 
| where SessionHostName == "sessionHostName" 
| project TimeGenerated, AgentVersion, SessionHostName, LastUpgradeTimeStamp, UpgradeState, UpgradeErrorMsg, NewPackagesAvailable
| sort by TimeGenerated desc
| take 1
```

## Use diagnostics to see when agent updates are happening

To see when agent updates are happening or to verify that the Scheduled Agent Updates feature is working as configured, you need to: 

1. Access the logs in your Log Analytics workspace.

2. Select the **+** to create a new query. 

3. Copy and paste the following query to see when the agent has updated for the specified session host. Make sure to change sessionHostName to the name of your session host.

```kusto
WVDAgentHealthStatus 
| where TimeGenerated >= ago(30d) 
| where SessionHostName == "sessionHostName" 
| project TimeGenerated, AgentVersion, SessionHostName, LastUpgradeTimeStamp, UpgradeState, UpgradeErrorMsg 
| summarize arg_min(TimeGenerated, *) by AgentVersion 
| sort by TimeGenerated asc 
``` 

## Use diagnostics to see when agent updates have failed

To see when agent component updates have failed, you need to: 

1. Access the logs in your Log Analytics workspace.

2. Select the **+** to create a new query.

3. Copy and paste the following query to see if an agent component update has failed for the specified session host. Make sure to change sessionHostName to the name of your session host.

```kusto
WVDAgentHealthStatus 
| where TimeGenerated >= ago(30d) 
| where SessionHostName == "sessionHostName"
| where MaintenanceWindowMissed == true
| project TimeGenerated, AgentVersion, SessionHostName, LastUpgradeTimeStamp, UpgradeState, UpgradeErrorMsg, MaintenanceWindowMissed
| sort by TimeGenerated asc 
``` 

## Next steps

For more Scheduled Agent Updates and agent component related information check out the following resources:

- To schedule agent updates, see the [Scheduled Agent Updates (preview) document](scheduled-agent-updates.md).
- To find more information about the Azure Virtual Desktop agent, side-by-side stack, and Geneva Monitoring agent, see [Getting Started with the Azure Virtual Desktop Agent](agent-overview.md).
- To find information about the latest and previous agent versions, see the [Agent Updates Version Notes](whats-new.md#azure-virtual-desktop-agent-updates).
- If you're experiencing agent or connectivity-related issues, see the [Azure Virtual Desktop Agent issues troubleshooting guide](troubleshoot-agent.md).