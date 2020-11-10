---
title: Windows Virtual Desktop Insights glossary - Azure
description: A glossary of Windows Virtual Desktop Insights terms and concepts.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 11/30/2020
ms.author: helohr
manager: lizross
---
# Windows Virtual Desktop Insights glossary

This article is a list of definitions for key terms and concepts related to Windows Virtual Desktop Insights.

## The Overview page

The Overview page shows general items in your monitoring environment. On this page, you'll see the following items.

### Alerts

If you have Azure Alerts enabled, you will see Severity 1 alerts surfaced here. Notice the summary tile on the left side of the screen and the alerts fired log on the right. Select **Alert** to see the full message with alert details.

### Severity 1 alert

A Severity 1 alert is the most severe category of alert that you need to address immediately.

### Host pool details

Host pool details shows you all session hosts in the selected host pool and an overview of your deployment landscape, including status, session availability, session state, and number of users over the last 24 hours. Select the session host name to view more details on that session host (region, VM type, etc.), or select a row to see more information about that particular session. You can also find host pool type, load balancer type (depth or breadth), and max number of sessions per session host in this section.

### Connection diagnostics summary

This section indicates connection health by tracking connection success rate over time. It counts multiple attempts to reconnect a session resulting in an eventual connection as a successful connection. The summary tiles capture the number of hosts, users, published resources, and clients that have shown a high failure rate in the selected time frame.

If you want more detailed information, see the Connection Diagnostics page.

### Connection performance summary

This section summarizes your time to connect for new sessions over time. Time to connect is the time from launching a session to when the user is logged on. The summary tiles capture Minimum, Median, Average, and p95 connection times for new sessions. 
*You are likely to see a higher time to connect for new sessions than you are for existing sessions. 
Get more detailed information in the Connection Performance page.

>[!NOTE]
>By default, the page shows information for the selected host pool. To filter the data to a particular session host, select a session host row under Host Pool Details.

### Host diagnostics summary

This section indicates host health by providing a summary of how many event log errors have fired over time. The summary tiles detail error counts (unique and total) per session host. 
Get more detailed information in the Host Diagnostics page.

>[!NOTE]
>By default, the page shows information for the selected host pool. To filter the data to a particular session host, select a session host row under Host Pool Details.

### Host performance summary

This section indicates host performance with a summary of your input latency per session host. The summary tiles indicate Input latency median and p95 values per session host.
 See more detailed information in the Host Performance page.

 >[!NOTE]
>By default, the page shows information for the selected host pool. To filter the data to a particular session host, select a session host row under Host Pool Details.

### Utilization summary

This section highlights several utilization trends:
- Monthly users (MAU): number of active users in the last 28 days.
- Daily users (DAU): number of active users in the last 24 hours.
- Daily sessions: number of sessions in the last 24 hours.
- Daily connected hours: number of hours spent in Windows Virtual Desktop in the last 24 hours.
- Daily Alerts: number of Severity 1 alerts in the last 24 hours.

>[!NOTE]
>By default, the page shows information for the selected host pool. To filter the data to a particular session host, select a session host row under Host Pool Details.

## The Connection Diagnostics page

The Connection Diagnostics page tracks items related to the strength and stability of your connection. It includes the following sections.

### Focus on failures

By default, the success rate charts will capture connections that successfully reach a VM as well as the ones that don't (No on the toggle). In a healthy and active environment, the amount of successes may make it difficult to get an accurate sense of scale for the failures, so Yes on the toggle can be used when looking to dive deeper and investigate the reasons why connections may be failing.

### Success rate of (re)establishing a connection (% of connections)

This section indicates connection health by tracking successful and failed connections. It counts multiple attempts to reconnect a session resulting in an eventual connection as a successful connection.
 
Volume of connections by connection result: connection attempts over time. Put your cursor over the bar graph to see a snapshot of connection successes and failures. Spikes in failures may indicate a problem to investigate.

- Green: A connection started at this time (or any of its reconnection attempts) was able to reach a host VM as confirmed by the stack on that VM.
- Red: A connection started at this time (and any reconnection attempts) was unable to reach a host VM. 
Connection success rate: Percentage of successful connections over time. Put your cursor over the line chart to see a snapshot of connection success. 
 
Log of connection attempts: Each row represents one connection and any associated reconnections (the count is captured in the 'attempts' column).

### Success rate of establishing a connection (% of users able to connect)

This section indicates connection health by tracking successful and failed connections by user. This helps identify customer impact of connection issues. It counts multiple attempts by the same user in that same time bucket to reconnect a session resulting in an eventual connection as a successful connection.
 
Volume of users by connection result: User connection attempts over time. Scroll over the bar graph to see a snapshot of the connection status of each user. Spikes in failures may indicate a problem you should investigate. 

- Green: the user successfully reached a host.
- Red: the user couldn’t reach the host.
 
User-based success rate: percentage of users able to connect over time. Put your cursor over the line chart to see a snapshot of user connection success rates. 
 
Log of connection attempts: Each row represents one user and one of their connection attempts

### Potential connectivity issues

This section captures the hosts, users, published resources, and clients that have shown a high failure rate in the selected time frame. Once a "report by" pivot has been chosen, for example by User, the magnitude of the issue can be evaluated by inspecting the values in the Attempts (number of connections), Resources (number of published apps or desktops), Hosts (number of VMs) and Clients columns. Potential connection issues that appear to span multiple hosts, users, resources, and/or clients are more likely to be a systemic issue vs. a transient one.
 
Entries in this table can be selected to load additional information: what hosts, resources, and client versions where involved, as well as any errors that may have been reported in association with the connection attempts

### Connection activity browser

Search connection activity by user or by host or view raw log of connection attempts and errors per user and host. After drilling down to a specific connection, highlighting a row will load the individual checkpoints and errors for each of the reconnection attempts in the session.

### Ranking of errors impacting connection activities

In this table, you can use the Activities/users/hosts columns to track the magnitude of the impact of each of the errors, and you may want to more closely monitor the errors that show a higher impact.
 
Diagnostics classifies Windows Virtual Desktop activities under one of four categories:
- Connections: when users initiate and complete connections to the service.
Feed: when users subscribe to workspaces and see resources published on the Remote Desktop client. 
- Management: when administrators initiate activity of setting or changing a deployment configuration using APIs or PowerShell. For example, can someone successfully create a host pool using PowerShell?
- Host Registrations: when the session host registers with the service upon connecting.
You will only see these categories in the table if errors exist.
 
Error type: 
- Deployment: captures all issues outside of the control of the Windows Virtual Desktop service. These errors are on the customer side. 
- Service: captures all issues within the control of the Windows Virtual Desktop service. Contact the service team for support.
 
Error source: 
- Diagnostics: service role responsible for monitoring and reporting service activity to provide observability and the ability to diagnose deployment issues.
- RDBroker: service role responsible for orchestrating deployment activities, maintaining the state of objects, validating authentication, and more. 
- RDGateway: service role responsible for handling network connectivity between end-users and virtual machines.
- RDStack: Software component that is installed on your VMs to allow them to communicate with the WVD service.
- Client: software running on the end-user machine that provides the interface to the WVD service. It displays the list of published resources as well as hosting the RD connection once a selection has been made.
 
To learn more about troubleshooting errors, see [Identify and diagnose Windows Virtual Desktop issues](diagnostics-role-service.md). 

