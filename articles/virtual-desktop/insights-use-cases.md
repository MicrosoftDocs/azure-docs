---
title: Use cases for Azure Virtual Desktop Insights - Azure Virtual Desktop
description: Learn about how using Azure Virtual Desktop Insights can help you understand your deployments of Azure Virtual Desktop, including some use cases and example scenarios.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 08/24/2023
---

# Use cases for Azure Virtual Desktop Insights

Using Azure Virtual Desktop Insights can help you understand your deployments of Azure Virtual Desktop. It can help with checks such as which client versions are connecting, opportunities for cost saving, or knowing if you have resource limitations or connectivity issues. If you make changes, you can continually validate that the changes have had the intended effect, and iterate if needed. This article provides some use cases for Azure Virtual Desktop Insights and example scenarios using the Azure portal.

## Prerequisites

- An existing host pool with session hosts, and a workspace [configured to use Azure Virtual Desktop Insights](insights.md).

- You need to have had active sessions for a period of time before you can make informed decisions.

## Connectivity

Connectivity issues can have a severe impact on the quality and reliability of the end-user experience with Azure Virtual Desktop. Azure Virtual Desktop Insights can help you identify connectivity issues and understand where improvements can be made.

### High latency

High latency can cause poor quality and slowness of a remote session. Maintaining ideal interaction times requires latency to generally be below 100 milliseconds, with a session broadly becoming of low quality over 200 ms. Azure Virtual Desktop Insights can help pinpoint gateway regions and users impacted by latency by looking at the *round-trip time*, so that you can more easily find cases of user impact that are related to connectivity. 

To view round-trip time:

1. Sign in to Azure Virtual Desktop Insights in the Azure portal by browsing to [https://aka.ms/avdi](https://aka.ms/avdi).

1. From the drop-down lists, select one or more **subscriptions**, **resource groups**, **host pools**, and specify a **time range**, then select the **Connection Performance** tab.

1. Review the section for **Round-trip time** and focus on the table for **RTT by gateway region** and the graph **RTT median and 95th percentile for all regions**. In the example below, most median latencies are under the ideal threshold of 100 ms, but several are higher. In many cases, the 95th percentile (p95) is substantially higher than the median, meaning that there are some users experiencing periods of higher latency.
   
   :::image type="content" source="media/insights-use-cases/insights-connection-performance-latency-1.png" alt-text="A screenshot of a table and graph showing the round-trip time." lightbox="media/insights-use-cases/insights-connection-performance-latency-1.png":::
   
1. For the table **RTT by gateway region**, select **Median**, until the arrow next to it points down, to sort by the median latency in descending order. This order highlights gateways your users are reaching with the highest latency that could be having the most impact. Select a gateway to view the graph of its RTT median and 95th percentile, and filter the list of 20 top users by RTT median to the specific region.
   
   In this example, the **SAN** gateway region has the highest median latency, and the graph indicates that over time users are substantially over the threshold for poor connection quality.
   
   :::image type="content" source="media/insights-use-cases/insights-connection-performance-latency-2.png" alt-text="A screenshot of a table and graph showing the round-trip time for a selected gateway." lightbox="media/insights-use-cases/insights-connection-performance-latency-2.png":::
   
   The list of users can be used to identify who is being impacted by these issues. You can select the magnifying glass icon in the **Details** column to drill down further into the data.
   
   :::image type="content" source="media/insights-use-cases/insights-connection-performance-latency-3.png" alt-text="A screenshot of a table showing the round-trip time per user." lightbox="media/insights-use-cases/insights-connection-performance-latency-3.png":::

There are several possibilities for why latency may be higher than anticipated for some users, such as a poor Wi-Fi connection, or issues with their Internet Service Provider (ISP). However, with a list of impacted users, you have the ability to proactively contact and attempt to resolve end-user experience problems by understanding their network connectivity.

You should periodically review the round-trip time in your environment and the overall trend to identify potential performance concerns.

## Session host performance

Issues with session hosts, such as where session hosts have too many sessions to cope with the workload end-users are running, can be a major cause of poor end-user experience. Azure Virtual Desktop Insights can provide detailed information about resource utilization and [user input delay](/windows-server/remote/remote-desktop-services/rds-rdsh-performance-counters?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json) to allow you to more easily and quickly find if users are impacted by limitations for resources like CPU or memory.

To view session host performance:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry to go to the Azure Virtual Desktop overview.

1. Select **Host pools**, then select the name of the host pool for which you want to view session host performance.

1. Select **Insights**, specify a **time range**, then select the **Host Performance** tab.

1. Review the table for **Input delay by host** and the graph **Median input delay over time** to find a summary of the median and 95th percentile user input delay values for each session host in the host pool. Ideally the user input delay for each host should be below 100 milliseconds, and a lower value is better.

   In the following example, the session hosts have a reasonable median user input delay, but occasionally values peak above the threshold of 100 ms, implying potential for impacting end-users.

   :::image type="content" source="media/insights-use-cases/insights-session-host-performance-1.png" alt-text="A screenshot of a table and graph showing the input delay of session hosts." lightbox="media/insights-use-cases/insights-session-host-performance-1.png":::
   
1. If you find higher than expected user input delay (>100 ms), it can be useful to then look at the aggregated statistics for CPU, memory, and disk activity for the session hosts to see if there are periods of higher-than-expected utilization. The graphs for **Host CPU and memory metrics**, **Host disk timing metrics**, and **Host disk queue length**  show either the aggregate across session hosts, or a selected session host's resource metrics.
   
   In this example there are some periods of higher disk read times that correlate with the higher user input delay above.
   
   :::image type="content" source="media/insights-use-cases/insights-session-host-performance-2.png" alt-text="A screenshot of graphs showing session host metrics." lightbox="media/insights-use-cases/insights-session-host-performance-2.png":::
   
1. For more information about a specific session host, select the **Host Diagnostics** tab.

1. Review the section for **Performance counters** to see a quick summary of any devices that have crossed the specified thresholds for:
   - Available MBytes (available memory)
   - Page Faults/sec
   - CPU Utilization
   - Disk Space
   - Input Delay per Session
   
   Selecting a parameter allows you to drill down and see the trend for a selected session host. In the following example, one session host had higher CPU usage (> 60%) for the selected duration (1 minute).

   :::image type="content" source="media/insights-use-cases/insights-session-host-performance-3.png" alt-text="A screenshot showing values from the performance counters of session hosts." lightbox="media/insights-use-cases/insights-session-host-performance-3.png":::

In cases where a session host has extended periods of high resource utilization, it’s worth considering increasing the [Azure VM size](../virtual-machines/sizes.md) of the session host to better accommodate user workloads.

## Client version usage

A common source of issues for end-users of Azure Virtual Desktop is using older clients that may either be missing new or updated features, or have known issues that have been resolved with more recent versions. Azure Virtual Desktop Insights contains a list of the different clients in use, as well as identifying clients that may be out of date.

To view a list of users with outdated clients:

1. Sign in to Azure Virtual Desktop Insights in the Azure portal by browsing to [https://aka.ms/avdi](https://aka.ms/avdi).

1. From the drop-down lists, select one or more **subscriptions**, **resource groups**, **host pools**, and specify a **time range**, then select the **Clients** tab.

1. Review the section for **Users with potentially outdated clients (all activity types)**. A summary table shows the highest version level of each client found connecting to your environment (marked as **Newest**) in the selected time range, and the count of users using outdated versions (in parentheses).

   In the below example, the newest version of the Microsoft Remote Desktop Client for Windows (MSRDC) is 1.2.4487.0, and 993 users are currently using a version older than that. It also shows a count of connections and the number of days behind the latest version the older clients are.

   :::image type="content" source="media/insights-use-cases/insights-client-version-usage-1.png" alt-text="A screenshot showing a table of outdated clients." lightbox="media/insights-use-cases/insights-client-version-usage-1.png":::

1. To find more information, expand a client for a list of users using an outdated version of that client, their versions, and the date last seen connecting with that version. You can export the data using the button in the top right-hand corner of the table for communication with the users or monitor the propagation of updates.

   :::image type="content" source="media/insights-use-cases/insights-client-version-usage-2.png" alt-text="A screenshot showing a table of users with outdated clients." lightbox="media/insights-use-cases/insights-client-version-usage-2.png":::

You should periodically review the versions of clients in use to ensure your users are getting the best experience.

## Cost saving opportunities

Understanding the utilization of session hosts can help illustrate where there's potential to reduce spend by using a scaling plan, resize virtual machines, or reduce the number of session hosts in the pool. Azure Virtual Desktop Insights can provide visibility into usage patterns to help you make the most informed decisions about how best to manage your resources based on real user usage.

### Session host utilization

Knowing when your session hosts are in peak demand, or when there are few or no sessions can help you make decisions about how to manage your session hosts. You can use [autoscale](autoscale-scenarios.md) to scale session hosts based on usage patterns. Azure Virtual Desktop Insights can help you identify broad patterns of user activity across multiple host pools. If you find opportunities to scale session hosts, you can use this information to [create a scaling plan](autoscale-scaling-plan.md).

To view session host utilization:

1. Sign in to Azure Virtual Desktop Insights in the Azure portal by browsing to [https://aka.ms/avdi](https://aka.ms/avdi).

1. From the drop-down lists, select one or more **subscriptions**, **resource groups**, **host pools**, and specify a **time range**, then select the **Utilization** tab.

1. Review the **Session history** chart, which displays the number of active and idle (disconnected) sessions over time. Identify any periods of high activity, and periods of low activity from the peak user session count and the time period in which the peaks occur. If you find a regular, repeated pattern of activity, this usually implies there's a good opportunity to implement a scaling plan.
   
   In this example, the graph shows the number of users sessions over the course of a week. Peaks occur at around midday on weekdays, and there's a noticeable lack of activity over the weekend. This suggests that there's an opportunity to scale session hosts to meet demand during the week, and reduce the number of session hosts over the weekend.        
   
   :::image type="content" source="media/insights-use-cases/insights-session-count-over-time.png" alt-text="A screenshot of a graph showing the number of users sessions over the course of a week." lightbox="media/insights-use-cases/insights-session-count-over-time.png":::
   
1. Use the **Session host count** chart to note the average number of active session hosts over time, and particularly the average number of session hosts that are idle (no sessions). Ideally session hosts should be actively supporting connected sessions and active workloads, and powered off when not in use by using a scaling plan. You'll likely need to keep a minimum number of session hosts powered on to ensure availability for users at irregular times, so understanding usage over time can help find an appropriate number of session hosts to keep powered on as a buffer.

   Even if a scaling plan is ultimately not a good fit for your usage patterns, there's still an opportunity to balance the total number of session hosts available as a buffer by analyzing the session demand and potentially reducing the number of idle devices.

   In this example, the graph shows there are long periods over the course of a week where idle session hosts are powered on and therefore increasing costs.

   :::image type="content" source="media/insights-use-cases/insights-session-host-idle-count-over-time.png" alt-text="A screenshot of a graph showing the number of active and idle session hosts over the course of a week." lightbox="media/insights-use-cases/insights-session-host-idle-count-over-time.png":::

1. Use the drop-down lists to reduce the scope to a single host pool and repeat the analysis for **session history** and **session host count**. At this scope you can identify patterns that are specific to the session hosts in a particular host pool to help develop a scaling plan for that host pool.

   In this example, the first graph shows the pattern of user activity throughout a week between 6AM and 10PM. On the weekend, there's minimal activity. The second graph shows the number of active and idle session hosts throughout the same week. There are long periods of time where idle session hosts are powered on. Use this information to help determine optimal ramp-up and ramp-down times for a scaling plan.

   :::image type="content" source="media/insights-use-cases/insights-session-count-over-time-single-host-pool.png" alt-text="A graph showing the number of users sessions over the course of a week for a single host pool." lightbox="media/insights-use-cases/insights-session-count-over-time-single-host-pool.png":::

   :::image type="content" source="media/insights-use-cases/insights-session-host-idle-count-over-time-single-host-pool.png" alt-text="A graph showing the number of active and idle session hosts over the course of a week for a single host pool." lightbox="media/insights-use-cases/insights-session-host-idle-count-over-time-single-host-pool.png":::

1. [Create a scaling plan](autoscale-scaling-plan.md) based on the usage patterns you've identified, then [assign the scaling plan to your host pool](autoscale-new-existing-host-pool.md).

After a period of time, you should repeat this process to validate that your session hosts are being utilized effectively. You can make changes to the scaling plan if needed, and continue to iterate until you find the optimal scaling plan for your usage patterns.

## Next steps

- [Create a scaling plan](autoscale-scaling-plan.md)