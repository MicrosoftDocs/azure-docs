---
title: Monitor Windows Virtual Desktop preview glossary - Azure
description: A glossary of terms and concepts related to Azure Monitor for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 3/25/2020
ms.author: helohr
manager: lizross
---
# Azure Monitor for Windows Virtual Desktop (preview) glossary

>[!IMPORTANT]
>Azure Monitor for Windows Virtual Desktop is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article lists and briefly describes key terms and concepts related to Azure Monitor for Windows Virtual Desktop (preview).

## Alerts

Any active Azure Monitor alerts that you've configured on the subscription and classified as [severity 1](#severity-1-alerts) will appear in the Overview page. To learn how to set up alerts, see [Respond to events with Azure Monitor Alerts](../azure-monitor/alerts/tutorial-response.md).

## Available sessions

Available sessions shows the number of available sessions in the host pool. The service calculates this number by multiplying the number of virtual machines (VMs) by the maximum number of sessions allowed per virtual machine, then subtracting the total sessions.

## Connection success

This item shows connection health. "Connection success" means that the connection could reach the host, as confirmed by the stack on that virtual machine. A failed connection means that the connection couldn't reach the host.

## Daily active users (DAU)

The total number of users that have started a session in the last 24 hours.

## Daily alerts

The total number of [severity 1 alerts](#severity-1-alerts) triggered in the last 24 hours.

## Daily connections and reconnections

The total number of connections and reconnections started or completed within the last 24 hours.

## Daily connected hours

The total number of hours spent connected to a session across users in the last 24 hours.

## Diagnostics and errors

When an error or alert appears in Azure Monitor for Windows Virtual Desktop, it's categorized by three things:

- Activity type: this category is how the error is categorized by Windows Virtual Desktop diagnostics. The categories are management activities, feeds, connections, host registrations, errors, and checkpoints. Learn more about these categories at [Use Log Analytics for the diagnostics feature](diagnostics-log-analytics.md).

- Kind: this category shows the error's location. 

     - Errors marked as "service" or "ServiceError = TRUE" happened in the Windows Virtual Desktop service.
     - Errors marked as "deployment" or tagged "ServiceError = FALSE" happened outside of the Windows Virtual Desktop service.
     - To learn more about the ServiceError tag, see [Common error scenarios](diagnostics-role-service.md#common-error-scenarios).

- Source: this category gives a more specific description of where the error happened.

     - Diagnostics: the service role responsible for monitoring and reporting service activity to let users observe and diagnose deployment issues.

     - RDBroker: the service role responsible for orchestrating deployment activities, maintaining the state of objects, validating authentication, and more.

     - RDGateway: the service role responsible for handling network connectivity between end-users and virtual machines.

     - RDStack: a software component that's installed on your VMs to allow them to communicate with the Windows Virtual Desktop service.

     - Client: software running on the end-user machine that provides the interface to the Windows Virtual Desktop service. It displays the list of published resources and hosts the Remote Desktop connection once you've made a selection.

Each diagnostics issue or error includes a message that explains what went wrong. To learn more about troubleshooting errors, see [Identify and diagnose Windows Virtual Desktop issues](diagnostics-role-service.md).

## Input delay

"Input delay" in Azure Monitor for Windows Virtual Desktop means the input delay per process performance counter for each session. In the host performance page at <aka.ms/azmonwvdi>, this performance counter is configured to send a report to the service once every 30 seconds. These 30-second intervals are called "samples," and the report the worst case in that window. The median and p95 values reflect the median and 95th percentile across all samples.

Under **Input delay by host**, you can select a session host row to filter all other visuals in the page to that host. You can also select a process name to filter the median input delay over time chart.

We put delays in the following categories:

- Good: below 150 milliseconds.
- Acceptable: 150-500 milliseconds.
- Poor: 500-2,000 milliseconds (below 2 seconds).
- Bad: over 2,000 milliseconds (2 seconds and up).

To learn more about how the input delay counter works, see [User Input Delay performance counters](/windows-server/remote/remote-desktop-services/rds-rdsh-performance-counters/).

##  Monthly active users (MAU)

The total number of users that have started a session in the last 28 days. If you store data for 30 days or less, you may see lower-than-expected MAU and Connection values during periods where you have fewer than 28 days of data available.

## Performance counters

Performance counters show the performance of hardware components, operating systems, and applications.

The following table lists the recommended performance counters and time intervals that Azure Monitor uses for Windows Virtual Desktop:

|Performance counter name|Time interval|
|---|---|
|Logical Disk(C:)\\Avg. Disk Queue Length|30 seconds|
|Logical Disk(C:)\\Avg. Disk sec/Transfer|60 seconds|
|Logical Disk(C:)\\Current Disk Queue Length|30 seconds|
|Memory(\*)\\Available Mbytes|30 seconds|
|Memory(\*)\\Page Faults/sec|30 seconds|
|Memory(\*)\\Pages/sec|30 seconds|
|Memory(\*)\\% Committed Bytes in Use|30 seconds|
|PhysicalDisk(\*)\\Avg. Disk Queue Length|30 seconds|
|PhysicalDisk(\*)\\Avg. Disk sec/Read|30 seconds|
|PhysicalDisk(\*)\\Avg. Disk sec/Transfer|30 seconds|
|PhysicalDisk(\*)\\Avg. Disk sec/Write|30 seconds|
|Processor Information(_Total)\\% Processor Time|30 seconds|
|Terminal Services(\*)\\Active Sessions|60 seconds|
|Terminal Services(\*)\\Inactive Sessions|60 seconds|
|Terminal Services(\*)\\Total Sessions|60 seconds|
|\*User Input Delay per Process(\*)\\Max Input Delay|30 seconds|
|\*User Input Delay per Session(\*)\\Max Input Delay|30 seconds|
|RemoteFX Network(\*)\\Current TCP RTT|30 seconds|
|RemoteFX Network(\*)\\Current UDP Bandwidth|30 seconds|

To learn more about how to read performance counters, see [Configuring performance counters](../azure-monitor/agents/data-sources-performance-counters.md).

To learn more about input delay performance counters, see [User Input Delay performance counters](/windows-server/remote/remote-desktop-services/rds-rdsh-performance-counters/).

## Potential connectivity issues

Potential connectivity issues shows the hosts, users, published resources, and clients with a high connection failure rate. Once you choose a "report by" filter, you can evaluate the issue's severity by checking the values in these columns:

- Attempts (number of connection attempts)
- Resources (number of published apps or desktops)
- Hosts (number of VMs)
- Clients

For example, if you select the **By user** filter, you can check to see each user's connection attempts in the **Attempts** column.

If you notice that a connection issue spans multiple hosts, users, resources, or clients, it's likely that the issue affects the whole system. If it doesn't, it's a smaller issue that lower priority.

You can also select entries to view additional information. You can view which hosts, resources, and client versions were involved with the issue. The display will also show any errors reported during the connection attempts.

## Round-trip time (RTT)

Round-trip time (RTT) is an estimate of the connection's round-trip time between the end-user’s location and the session host's Azure region. To see which locations have the best latency, look up your desired location in the [Windows Virtual Desktop Experience Estimator tool](https://azure.microsoft.com/services/virtual-desktop/assessment/).

## Session history

The **Sessions** item shows the status of all sessions, connected and disconnected. **Idle sessions** only shows the disconnected sessions.

## Severity 1 alerts

The most urgent items that you need to take care of right away. If you don't address these issues, they could cause your Windows Virtual Desktop deployment to stop working.

## Time to connect

Time to connect is the time between when a user starts their session and when they're counted as being signed in to the service. Establishing new connections tends to take longer than reestablishing existing connections.

## User report

The user report page lets you view a specific user’s connection history and diagnostic information. Each user report shows usage patterns, user feedback, and any errors users have encountered during their sessions. Most smaller issues can be resolved with user feedback. If you need to dig deeper, you can also filter information about a specific connection ID or period of time.

## Users per core

This is the number of users in each virtual machine core. Tracking the
maximum number of users per core over time can help you identify whether the
environment consistently runs at a high, low, or fluctuating number of users per
core. Knowing how many users are active will help you efficiently resource and scale the environment.

## Windows Event Logs

Windows Event Logs are data sources collected by Log Analytics agents on Windows virtual machines. You can collect events from standard logs like System and Application as well as custom logs created by applications you need to monitor.

The following table lists the required Windows Event Logs for Azure Monitor for Windows Virtual Desktop:

|Event name|Event type|
|---|---|
|Application|Error and Warning|
|Microsoft-Windows-TerminalServices-RemoteConnectionManager/Admin|Error, Warning, and Information|
|Microsoft-Windows-TerminalServices-LocalSessionManager/Operational|Error, Warning, and Information|
|System|Error and Warning|
| Microsoft-FSLogix-Apps/Operational|Error, Warning, and Information|
|Microsoft-FSLogix-Apps/Admin|Error, Warning, and Information|

To learn more about Windows Event Logs, see [Windows Event records properties](../azure-monitor/agents/data-sources-windows-events.md#configuring-windows-event-logs).

## Next steps

To get started with Azure Monitor for Windows Virtual Desktop, check out these articles:

- [Use Azure Monitor for Windows Virtual Desktop to monitor your deployment](azure-monitor.md)
- [Azure Monitor for Windows Virtual Desktop troubleshooting](troubleshoot-azure-monitor.md)

You can also set up Azure Advisor to help you figure out how to resolve or prevent common issues. Learn more at [Use Azure Advisor with Windows Virtual Desktop](azure-advisor.md).

If you need help or have any questions, check out our community resources:

- Ask questions or make suggestions to the community at the [Windows Virtual Desktop TechCommunity](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop).
   
- To learn how to leave feedback, see [Troubleshooting overview, feedback, and support for Windows Virtual Desktop](troubleshoot-set-up-overview.md#report-issues).

- You can also leave feedback for Windows Virtual Desktop at the [Windows Virtual Desktop feedback hub](https://support.microsoft.com/help/4021566/windows-10-send-feedback-to-microsoft-with-feedback-hub-app)
