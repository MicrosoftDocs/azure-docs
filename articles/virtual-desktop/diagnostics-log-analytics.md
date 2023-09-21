---
title: Azure Virtual Desktop diagnostics log analytics - Azure
description: How to use log analytics with the Azure Virtual Desktop diagnostics feature.
author: Heidilohr
ms.topic: how-to
ms.date: 05/27/2020
ms.author: helohr
manager: femila
---
# Use Log Analytics for the diagnostics feature

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/diagnostics-log-analytics-2019.md).

Azure Virtual Desktop uses [Azure Monitor](../azure-monitor/overview.md) for monitoring and alerts like many other Azure services. This lets admins identify issues through a single interface. The service creates activity logs for both user and administrative actions. Each activity log falls under the following categories:

- Management Activities:
    - Track whether attempts to change Azure Virtual Desktop objects using APIs or PowerShell are successful. For example, can someone successfully create a host pool using PowerShell?
- Feed:
    - Can users successfully subscribe to workspaces?
    - Do users see all resources published in the Remote Desktop client?
- Connections:
    - When users initiate and complete connections to the service.
- Host registration:
    - Was the session host successfully registered with the service upon connecting?
- Errors:
    - Are users encountering any issues with specific activities? This feature can generate a table that tracks activity data for you as long as the information is joined with the activities.
- Checkpoints:
    - Specific steps in the lifetime of an activity that were reached. For example, during a session, a user was load balanced to a particular host, then the user was signed on during a connection, and so on.
- Agent Health Status:
    - Monitor the health and status of the Azure Virtual Desktop agent installed on each session host. For example, verify that the agents are up to date, or whether the agent is in a healthy state and ready to accept new user sessions. 
- Connection Network Data:
    - Track the average network data for user sessions to monitor for details including the estimated round trip time and available bandwidth throughout their connection.

Connections that don't reach Azure Virtual Desktop won't show up in diagnostics results because the diagnostics role service itself is part of Azure Virtual Desktop. Azure Virtual Desktop connection issues can happen when the user is experiencing network connectivity issues.

Azure Monitor lets you analyze Azure Virtual Desktop data and review virtual machine (VM) performance counters, all within the same tool. This article will tell you more about how to enable diagnostics for your Azure Virtual Desktop environment.

>[!NOTE]
>To learn how to monitor your VMs in Azure, see [Monitoring Azure virtual machines with Azure Monitor](../azure-monitor/vm/monitor-vm-azure.md). Also, make sure to review the [Azure Virtual Desktop Insights glossary](./insights-glossary.md) for a better understanding of your user experience on the session host.

## Before you get started

Before you can use Log Analytics, you'll need to create a workspace. To do that, follow the instructions in one of the following two articles:

- If you prefer using Azure portal, see [Create a Log Analytics workspace in Azure portal](../azure-monitor/logs/quick-create-workspace.md).
- If you prefer PowerShell, see [Create a Log Analytics workspace with PowerShell](../azure-monitor/logs/powershell-workspace-configuration.md).

After you've created your workspace, follow the instructions in [Connect Windows computers to Azure Monitor](../azure-monitor/agents/agent-windows.md#workspace-id-and-key) to get the following information:

- The workspace ID
- The primary key of your workspace

You'll need this information later in the setup process.

Make sure to review permission management for Azure Monitor to enable data access for those who monitor and maintain your Azure Virtual Desktop environment. For more information, see [Get started with roles, permissions, and security with Azure Monitor](../azure-monitor/roles-permissions-security.md).

## Push diagnostics data to your workspace

You can push diagnostics data from your Azure Virtual Desktop objects into the Log Analytics for your workspace. You can set up this feature right away when you first create your objects.

To set up Log Analytics for a new object:

1. Sign in to the Azure portal and go to **Azure Virtual Desktop**.

2. Navigate to the object (such as a host pool, application group, or workspace) that you want to capture logs and events for.

3. Select **Diagnostic settings** in the menu on the left side of the screen.

4. Select **Add diagnostic setting** in the menu that appears on the right side of the screen.

    The options shown in the Diagnostic Settings page will vary depending on what kind of object you're editing.

    For example, when you're enabling diagnostics for an application group, you'll see options to configure checkpoints, errors, and management. For workspaces, these categories configure a feed to track when users subscribe to the list of apps. To learn more about diagnostic settings see [Create diagnostic setting to collect resource logs and metrics in Azure](../azure-monitor/essentials/diagnostic-settings.md).

     >[!IMPORTANT]
     >Remember to enable diagnostics for each Azure Resource Manager object that you want to monitor. Data will be available for activities after diagnostics has been enabled. It might take a few hours after first set-up.

5. Enter a name for your settings configuration, then select **Send to Log Analytics**. The name you use shouldn't have spaces and should conform to [Azure naming conventions](../azure-resource-manager/management/resource-name-rules.md). As part of the logs, you can select all the options that you want added to your Log Analytics, such as Checkpoint, Error, Management, and so on.

6. Select **Save**.

>[!NOTE]
>Log Analytics gives you the option to stream data to [Event Hubs](../event-hubs/event-hubs-about.md) or archive it in a storage account. To learn more about this feature, see [Stream Azure monitoring data to an event hub](../azure-monitor/essentials/stream-monitoring-data-event-hubs.md) and [Archive Azure resource logs to storage account](../azure-monitor/essentials/resource-logs.md#send-to-azure-storage).

## How to access Log Analytics

You can access Log Analytics workspaces on the Azure portal or Azure Monitor.

### Access Log Analytics on a Log Analytics workspace

1. Sign in to the Azure portal.

2. Search for **Log Analytics workspace**.

3. Under Services, select **Log Analytics workspaces**.

4. From the list, select the workspace you configured for your Azure Virtual Desktop object.

5. Once in your workspace, select **Logs**. You can filter out your menu list with the **Search** function.

### Access Log Analytics on Azure Monitor

1. Sign in to the Azure portal.

2. Search for and select **Monitor**.

3. Select **Logs**.

4. Follow the instructions in the logging page to set the scope of your query.

5. You are ready to query diagnostics. All diagnostics tables have a "WVD" prefix.

>[!NOTE]
>For more detailed information about the tables stored in Azure Monitor Logs, see the [Azure Monitor data reference](/azure/azure-monitor/reference/tables/tables-category#azure-virtual-desktop). All tables related to Azure Virtual Desktop are prefixed with "WVD."

## Cadence for sending diagnostic events

Diagnostic events are sent to Log Analytics when completed.

Log Analytics only reports in these intermediate states for connection activities:

- Started: when a user selects and connects to an app or desktop in the Remote Desktop client.
- Connected: when the user successfully connects to the VM where the app or desktop is hosted.
- Completed: when the user or server disconnects the session the activity took place in.

## Example queries

Access example queries through the Azure Monitor Log Analytics UI:
1. Go to your Log Analytics workspace, and then select **Logs**. The example query UI is shown automatically.
1. Change the filter to **Category**.
1. Select **Azure Virtual Desktop** to review available queries.
1. Select **Run** to run the selected query.

Learn more about the sample query interface in [Saved queries in Azure Monitor Log Analytics](../azure-monitor/logs/queries.md).

The following query list lets you review connection information or issues for a single user. You can run these queries in the [Log Analytics query editor](../azure-monitor/logs/log-analytics-tutorial.md#write-a-query). For each query, replace `userupn` with the UPN of the user you want to look up.


To find all connections for a single user:

```kusto
WVDConnections
|where UserName == "userupn"
|take 100
|sort by TimeGenerated asc, CorrelationId
```


To find the number of times a user connected per day:

```kusto
WVDConnections
|where UserName == "userupn"
|take 100
|sort by TimeGenerated asc, CorrelationId
|summarize dcount(CorrelationId) by bin(TimeGenerated, 1d)
```

To find session duration by user:

```kusto
let Events = WVDConnections | where UserName == "userupn" ;
Events
| where State == "Connected"
| project CorrelationId , UserName, ResourceAlias , StartTime=TimeGenerated
| join (Events
| where State == "Completed"
| project EndTime=TimeGenerated, CorrelationId)
on CorrelationId
| project Duration = EndTime - StartTime, ResourceAlias
| sort by Duration asc
```

To find errors for a specific user:

```kusto
WVDErrors
| where UserName == "userupn"
|take 100
```

To find out whether a specific error occurred for other users:

```kusto
WVDErrors
| where CodeSymbolic =="ErrorSymbolicCode"
| summarize count(UserName) by CodeSymbolic
```


>[!NOTE]
>- When a user launches a full desktop session, their app usage in the session isn't tracked as checkpoints in the `WVDCheckpoints` table.
>- The `ResourcesAlias` column in the `WVDConnections` table shows whether a user has connected to a full desktop or a published app. The column only shows the first app they open during the connection. Any published apps the user opens are tracked in `WVDCheckpoints`.
>- The `WVDErrors` table shows you management errors, host registration issues, and other issues that happen while the user subscribes to a list of apps or desktops.
>- The `WVDErrors` table also helps you to identify issues that can be resolved by admin tasks. The value on `ServiceError` should always equal `false` for these types of issues. If `ServiceError` equals `true`, you'll need to escalate the issue to Microsoft. Ensure you provide the *CorrelationID* for errors you escalate.
>- When debugging connectivity issues, in some cases client information might be missing even if the connection events completes. This applies to the `WVDConnections` and `WVDCheckpoints` tables.

## Next steps

To review common error scenarios that the diagnostics feature can identify for you, see [Identify and diagnose issues](./troubleshoot-set-up-overview.md).
