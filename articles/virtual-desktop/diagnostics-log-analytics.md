---
title: Azure Virtual Desktop diagnostics log analytics - Azure
description: How to use log analytics with the Azure Virtual Desktop diagnostics feature.
author: dknappettmsft
ms.topic: how-to
ms.date: 05/27/2020
ms.author: daknappe
ms.custom: docs_inherited
---

# Send diagnostic data to Log Analytics for Azure Virtual Desktop

Azure Virtual Desktop uses [Azure Monitor](/azure/azure-monitor/overview) for monitoring and alerts like many other Azure services. This lets admins identify issues through a single interface. The service creates activity logs for both user and administrative actions. Each activity log falls under the following categories:

| Category | Description |
|--|--|
| Management Activities | Whether attempts to change Azure Virtual Desktop objects using APIs or PowerShell are successful. |
| Feed | Whether users can successfully subscribe to workspaces. |
| Connections | When users initiate and complete connections to the service. |
| Host registration | Whether a session host successfully registered with the service upon connecting. |
| Errors | Where users encounter issues with specific activities. |
| Checkpoints | Specific steps in the lifetime of an activity that were reached. |
| Agent Health Status | Monitor the health and status of the Azure Virtual Desktop agent installed on each session host. |
| Network | The average network data for user sessions to monitor for details including the estimated round trip time. |
| Connection Graphics | Performance data from the Azure Virtual Desktop graphics stream. |
| Session Host Management Activity | Management activity of session hosts. |
| Autoscale | Scaling operations. |

Connections that don't reach Azure Virtual Desktop won't show up in diagnostics results because the diagnostics role service itself is part of Azure Virtual Desktop. Azure Virtual Desktop connection issues can happen when the user is experiencing network connectivity issues.

Azure Monitor lets you analyze Azure Virtual Desktop data and review virtual machine (VM) performance counters, all within the same tool. This article will tell you more about how to enable diagnostics for your Azure Virtual Desktop environment.

>[!NOTE]
>To learn how to monitor your VMs in Azure, see [Monitoring Azure virtual machines with Azure Monitor](/azure/azure-monitor/vm/monitor-vm-azure). Also, make sure to review the [Azure Virtual Desktop Insights glossary](./insights-glossary.md) for a better understanding of your user experience on the session host.

## Prerequisites

Before you can use Azure Virtual Desktop with Log Analytics, you need:

- A Log Analytics workspace. For more information, see [Create a Log Analytics workspace in Azure portal](/azure/azure-monitor/logs/quick-create-workspace) or [Create a Log Analytics workspace with PowerShell](/azure/azure-monitor/logs/powershell-workspace-configuration). After you've created your workspace, follow the instructions in [Connect Windows computers to Azure Monitor](/azure/azure-monitor/agents/agent-windows#workspace-id-and-key) to get the following information:
   - The workspace ID
   - The primary key of your workspace

   You'll need this information later in the setup process.

- Access to specific URLs from your session hosts for diagnostics to work. For more information, see [Required URLs for Azure Virtual Desktop](safe-url-list.md) where you'll see entries for **Diagnostic output**.

- Make sure to review permission management for Azure Monitor to enable data access for those who monitor and maintain your Azure Virtual Desktop environment. For more information, see [Get started with roles, permissions, and security with Azure Monitor](/azure/azure-monitor/roles-permissions-security).

## Push diagnostics data to your workspace

You can push diagnostics data from your Azure Virtual Desktop objects into the Log Analytics for your workspace. You can set up this feature right away when you first create your objects.

To set up Log Analytics for a new object:

1. Sign in to the Azure portal and go to **Azure Virtual Desktop**.

2. Navigate to the object (such as a host pool, application group, or workspace) that you want to capture logs and events for.

3. Select **Diagnostic settings** in the menu on the left side of the screen.

4. Select **Add diagnostic setting** in the menu that appears on the right side of the screen.

    The options shown in the Diagnostic Settings page will vary depending on what kind of object you're editing.

    For example, when you're enabling diagnostics for an application group, you'll see options to configure checkpoints, errors, and management. For workspaces, these categories configure a feed to track when users subscribe to the list of apps. To learn more about diagnostic settings see [Create diagnostic setting to collect resource logs and metrics in Azure](/azure/azure-monitor/essentials/diagnostic-settings).

     >[!IMPORTANT]
     >Remember to enable diagnostics for each Azure Resource Manager object that you want to monitor. Data will be available for activities after diagnostics has been enabled. It might take a few hours after first set-up.

5. Enter a name for your settings configuration, then select **Send to Log Analytics**. The name you use shouldn't have spaces and should conform to [Azure naming conventions](../azure-resource-manager/management/resource-name-rules.md). As part of the logs, you can select all the options that you want added to your Log Analytics, such as Checkpoint, Error, Management, and so on.

6. Select **Save**.

>[!NOTE]
>Log Analytics gives you the option to stream data to [Event Hubs](../event-hubs/event-hubs-about.md) or archive it in a storage account. To learn more about this feature, see [Stream Azure monitoring data to an event hub](/azure/azure-monitor/essentials/stream-monitoring-data-event-hubs) and [Archive Azure resource logs to storage account](/azure/azure-monitor/essentials/resource-logs#send-to-azure-storage).

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

Learn more about the sample query interface in [Saved queries in Azure Monitor Log Analytics](/azure/azure-monitor/logs/queries).

The following query list lets you review connection information or issues for a single user. You can run these queries in the [Log Analytics query editor](/azure/azure-monitor/logs/log-analytics-tutorial#write-a-query). For each query, replace `userupn` with the UPN of the user you want to look up.


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

- [Enable Insights to monitor Azure Virtual Desktop](insights.md).
- To review common error scenarios that the diagnostics feature can identify for you, see [Identify and diagnose issues](/troubleshoot/azure/virtual-desktop/troubleshoot-set-up-overview).
