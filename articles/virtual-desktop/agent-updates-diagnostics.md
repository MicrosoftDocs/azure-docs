---
title: Set up diagnostics for monitoring agent updates
description: How to set up diagnostic reports to monitor agent updates.
author: Sefriend
ms.topic: how-to
ms.date: 03/20/2023
ms.author: sefriend
manager: rkiran
---
# Set up diagnostics to monitor agent updates

Diagnostic logs can tell you which agent version is installed for an update, when it was installed, and if the update was successful. If an update is unsuccessful, it might be because the session host was turned off during the update. If that happened, you should turn the session host back on.

This article describes how to use diagnostic logs in a Log Analytics workspace to monitor agent updates.

## Enable sending diagnostic logs to your Log Analytics workspace

To enable sending diagnostic logs to your Log Analytics workspace:

1. Create a Log Analytics workspace, if you haven't already. Next, get the workspace ID and primary key by following the instructions in [Use Log Analytics for the diagnostics feature](diagnostics-log-analytics.md#prerequisites).

2. Send diagnostics to the Log Analytics workspace you created by following the instructions in [Push diagnostics data to your workspace](diagnostics-log-analytics.md#push-diagnostics-data-to-your-workspace). 

3. Follow the directions in [How to access Log Analytics](diagnostics-log-analytics.md#how-to-access-log-analytics) to access the logs in your workspace.

> [!NOTE]
> The log query results only cover the last 30 days of data in your deployment.

## Use diagnostics to see when an update becomes available

To see when agent component updates are available: 

1. Access the logs in your Log Analytics workspace.

2. Select the **+** button to create a new query.

3. Copy and paste the following Kusto query to see if agent component updates are available for the specified session host. Make sure to change the **sessionHostName** parameter to the name of your session host.

    > [!NOTE]
    > If you haven't enabled the Scheduled Agent Updates feature, you won't see anything in the NewPackagesAvailable field.

    ```kusto
    WVDAgentHealthStatus 
    | where TimeGenerated >= ago(30d) 
    | where SessionHostName == "sessionHostName" 
    | project TimeGenerated, AgentVersion, SessionHostName, LastUpgradeTimeStamp, UpgradeState, UpgradeErrorMsg
    | sort by TimeGenerated desc
    | take 1
    ```

## Use diagnostics to see when agent updates are happening

To see when agent updates are happening or to make sure that the Scheduled Agent Updates feature is working: 

1. Access the logs in your Log Analytics workspace.

2. Select the **+** button to create a new query. 

3. Copy and paste the following Kusto query to see when the agent has updated for the specified session host. Make sure to change the **sessionHostName** parameter to the name of your session host.

    ```kusto
    WVDAgentHealthStatus 
    | where TimeGenerated >= ago(30d) 
    | where SessionHostName == "sessionHostName" 
    | project TimeGenerated, AgentVersion, SessionHostName, LastUpgradeTimeStamp, UpgradeState, UpgradeErrorMsg 
    | summarize arg_min(TimeGenerated, *) by AgentVersion 
    | sort by TimeGenerated asc 
    ```

## Next steps

For more information about Scheduled Agent Updates and the agent components, check out the following articles:

- To learn how to schedule agent updates, see [Scheduled Agent Updates](scheduled-agent-updates.md).
- For more information about the Azure Virtual Desktop agent, side-by-side stack, and Geneva Monitoring agent, see [Getting Started with the Azure Virtual Desktop Agent](agent-overview.md).
- Learn more about the latest and previous agent versions at [What's new in the Azure Virtual Desktop agent](whats-new-agent.md).
- If you're experiencing agent or connectivity-related issues, see the [Azure Virtual Desktop Agent issues troubleshooting guide](troubleshoot-agent.md).