---
title: Windows Virtual Desktop Insights glossary - Azure
description: A glossary of Windows Virtual Desktop Insights terms and concepts.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 12/01/2020
ms.author: helohr
manager: lizross
---
# Windows Virtual Desktop Insights glossary

This article lists and briefly describes key terms and concepts related to Azure Monitor for Windows Virtual Desktop.

## Alerts

Azure Monitor alerts for activities within your environment show you all [severity 1 alerts](#severity-1-alerts) for the subscription in the Overview page. To learn more about how to configure alerts, see [Respond to events with Azure Monitor Alerts](../azure-monitor/learn/tutorial-response.md).

## Available sessions

Available sessions shows the number of available sessions in the host pool. The service calculates this number by multiplying the number of virtual machines (VMs) by the maximum number of sessions allowed per virtual machine, then subtracting the total sessions.

## Connection success

This item shows connection health. A successful connection means that a connection was able to reach a host as confirmed by the stack on that virtual machine. A failed connection means that the connection was unable to reach a host.

## Daily active users (DAU)

The total number of users that have started a session in the last 24 hours.

## Daily alerts

The total number of [severity 1 alerts](#severity-1-alerts) triggered in the last 24 hours.

## Daily sessions

The total number of sessions started in the last 24 hours.

## Daily connected hours

The total number of hours spent connected to a session across users in the last 24 hours.

## Diagnostics and errors

When an error or alert appears in Insights, it's categorized by three things:

- The activity type is how the error is ranked in the connection diagnostics and user report pages. Windows Virtual Desktop diagnostics categorizes activity types as management activities, feeds, connections, host registrations, errors, and checkpoints. Learn more about these categories at [Use Log Analytics for the diagnostics feature](diagnostics-log-analytics.md).

- The kind category shows where the error is located. 

      - Errors marked as "service" or `ServiceError = TRUE` are within the control of the Windows Virtual Desktop service. . 
      - Errors marked as "deployment" or tagged `ServiceError = FALSE` are outside the control of the WIndows Virtual Desktop service.
     
      To learn more about the ServiceError tag, see [Common error scenarios](diagnostics-role-service.md#common-error-scenarios).

- The source category gives a more specific description of where the error happened:

      - Diagnostics: the service role responsible for monitoring and reporting service activity to let users observe and diagnose deployment issues.

      - RDBroker: the service role responsible for orchestrating deployment activities, maintaining the state of objects, validating authentication, and more.

      - RDGateway: the service role responsible for handling network connectivity between end-users and virtual machines.

      - RDStack: a software component that's installed on your VMs to allow them to communicate with the Windows Virtual Desktop service.

      - Client: software running on the end-user machine that provides the interface to the Windows Virtual Desktop service. It displays the list of published resources as well as hosting the Remote Desktop connection once you've made a selection.

To learn more about troubleshooting errors, see [Identify and diagnose Windows Virtual Desktop issues](diagnostics-role-service.md).

## Input delay

"Input delay" in Windows Virtual Desktop Insights means the input delay per process performance counter for each session. In the host performance page at <aka.ms/azmonwvdi>, this performance counter is configured to send a report to the service once every 30 seconds. These 30 second intervals are called "samples," and the report the worst case in that window. The median and p95 values reflect the median and 95th percentile across all samples.

Under **Input delay by host**, you can select a session host row to filter all other visuals in the page to that host. You can also select a process name to filter the median input delay over time chart.

We put delays in the following categories:

- Good: below 150 milliseconds.
- Acceptable: 150-500 milliseconds.
- Poor: 500-2,000 milliseconds (below 2 seconds).
- Bad: over 2,000 milliseconds (2 seconds and up).

To learn more about how the input delay counter works, see [User Input Delay performance counters](/windows-server/remote/remote-desktop-services/rds-rdsh-performance-counters/).

##  Monthly active users (MAU)

The total number of users that have started a session in the last 28 days. If you store data for 30 days or less, you may see decreased MAU and Connection values during periods with fewer than 28 days of data available.

## Performance counters

<!---quick definition of a performance counter should go here--->

The following table lists the required performance counters and time intervals that Azure Monitor needs for Windows Virtual Desktop:

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
|Process(\*)\\% Processor Time|20 seconds|
|Process(\*)\\% User Time|30 seconds|
|Process(\*)\\Thread Count|30 seconds|
|Process(\*)\\ IO Write Operations/sec|30 seconds|
|Process(\*)\\ IO Read Operations/sec|30 seconds|
|Processor Information(_Total)\\% Processor Time|30 seconds|
|Terminal Services(\*)\\Active Sessions|60 seconds|
|Terminal Services(\*)\\Inactive Sessions|60 seconds|
|Terminal Services(\*)\\Total Sessions|60 seconds|
|\*User Input Delay per Process(\*)\\Max Input Dela|30 seconds|
|\*User Input Delay per Session(\*)\\Max Input Delay|30 seconds|
|RemoteFX Network(\*)\\Current TCP RTT|30 seconds|
|RemoteFX Network(\*)\\Current UDP Bandwidth|30 seconds|

To learn more about how to read performance counters, see [Configuring performance counters](../azure-monitor/platform/data-sources-performance-counters.md).

To learn more about input delay performance counters, see [User Input Delay performance counters](/windows-server/remote/remote-desktop-services/rds-rdsh-performance-counters/).

## Potential connectivity issues

This section of the diagnostics page shows the hosts, users, published resources, and clients that have shown a high failure rate in the selected time frame. Once you choose a "report by" filter, such as **by User**, you can evaluate the issue's severity by checking the values in the **Attempts** (number of connection attempts), **Resources** (number of published apps or desktops), **Hosts** (number of VMs), and **Clients** columns. Potential connection issues that span multiple hosts, users, resources, or clients are more likely to be an issue with the entire system as opposed to a smaller, individual issue.

Entries in this table can be selected to load additional information, such as which hosts, resources, and client versions were involved with the issue, as well as any errors reported during the connection attempts.

## Round-trip time (RTT)

Round-trip time (RTT) is an estimate of the connection's round-trip time between the end-user’s location and the Azure region of the deployed VM. To learn more about RTT or check the best location for optimal latency, see the [Windows Virtual Desktop Experience Estimator tool](https://azure.microsoft.com/services/virtual-desktop/assessment/).

## Session history

The **Sessions** item shows the status of all sessions, connected and disconnected. **Idle sessions** only shows the disconnected sessions.

## Severity 1 alerts

The most urgent items that you need to take care of right away. If you don't address these issues, they could cause your Windows Virtual Desktop deployment to stop working.

## Time to connect

Time to connect is the time between when a user starts their session and when they're counted as being signed in to the service. Establishing new connections tends to take longer than reestablishing existing connections.

## User report

The uer report page lets you view a specific user’s connection history and diagnostic info to help you understand their usage, view their feedback, and track any errors they've been experiencing. Most smaller issues can be resolved with user feedback, but if you need to dig deeper, you can also use this page filter information about a specific connection ID or timeframe.

## Users per core

This is the number of users allocated to each virtual machine core. Tracking the
maximum number of users per core over time can help you identify whether the
environment consistently runs at a high, low, or fluctuating number of users per
core. Knowing how many users are active will help you efficiently resource and scale the environment.

## Windows events

Windows events are... <!---Insert definition here--->

The following table lists the required Windows events for Azure Monitor for Windows Virtual Desktop:

|Event name|Event type|
|---|---|
|Application|Error and Warning|
|Microsoft-Windows-TerminalServices-RemoteConnectionManager/Admin|Error, Warning, and Information|
|Microsoft-Windows-TerminalServices-LocalSessionManager/Operational|Error, Warning, and Information|
|System|Error and Warning|
| Microsoft-FSLogix-Apps/Operational|Error, Warning, and Information|
|Microsoft-FSLogix-Apps/Admin|Error, Warning, and Information|

To learn more about Windows events, see [Windows event records properties](../azure-monitor/platform/data-sources-windows-events.md).

## Next steps

To get started monitoring Windows Virtual Desktop, see How to monitor with Azure Monitor for Windows Virtual Desktop. To troubleshoot common problems, see our troubleshooting guide.

Need help?

- Ask questions or make suggestions to the community at the [Windows Virtual Desktop TechCommunity](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop).
   
- To learn how to do this or to escalate to support, see [Troubleshooting overview, feedback, and support for Windows Virtual Desktop](troubleshoot-set-up-overview.md#report-issues).

- You can also leave feedback for Windows Virtual Desktop at the [Windows Virtual Desktop feedback hub](https://support.microsoft.com/help/4021566/windows-10-send-feedback-to-microsoft-with-feedback-hub-app).

## Feedback

Submit and view feedback for:

[This product](https://windowsvirtualdesktop.uservoice.com/forums/921118-general)
