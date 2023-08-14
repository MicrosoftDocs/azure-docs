---
title: Use cases for Azure Virtual Desktop Insights - Azure Virtual Desktop
description: Learn about how using Azure Virtual Desktop Insights can help you understand your deployments of Azure Virtual Desktop, including some use cases and example scenarios.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 08/14/2023
---

# Use cases for Azure Virtual Desktop Insights

Using Azure Virtual Desktop Insights can help you understand your deployments of Azure Virtual Desktop. It can help with checks such as which client versions are connecting, opportunities for cost saving, or knowing if you have resource limitations or connectivity issues. If you make changes, you can continually validate that the changes have had the intended effect, and iterate if needed. This article provides some use cases for Azure Virtual Desktop Insights and example scenarios using the Azure portal.

## Prerequisites

- An existing host pool with session hosts, and a workspace [configured to use Azure Virtual Desktop Insights](insights.md). You will need to have had active sessions for a period of time before you can make informed decisions.

## Connectivity

TODO: 

## Session host performance

TODO: 

## Client usage

TODO: 

## Cost saving opportunities

Understanding the utilization of session hosts can help illustrate where there is potential to reduce spend through the use of a scaling plan, resize virtual machines, or reduce the number of session hosts in the pool. Azure Virtual Desktop Insights can provide visibility into usage patterns to help you make the most informed decisions about how best to manage your resources based on real user usage.

### Session host utilization

Knowing when your session hosts are in peak demand, or when there are few or no sessions can help you make decisions about how to manage your session hosts. You can use [autoscale](autoscale-scenarios.md) to scale session hosts based on usage patterns. Azure Virtual Desktop Insights can help you identify broad patterns of user activity across multiple host pools. If you find opportunities to scale session hosts, you can use this information to [create a scaling plan](autoscale-scaling-plan.md).

To view session host utilization:

1. Sign in to Azure Virtual Desktop Insights in the Azure portal by browsing to [https://aka.ms/avdi](https://aka.ms/avdi).

1. From the drop-down lists, select one or more **subscriptions**, **resource groups**, **host pools**, and specify a **time range**, then select the **Utilization** tab

1. Review the **Session history** chart, which displays the number of active and idle (disconnected) sessions over time. Identify any periods of high activity, and periods of low activity from the peak user session count and the time period in which the peaks occur. If you find a regular, repeated pattern of activity, this usually implies there's a good opportunity to implement a scaling plan.

   In this example, the graph shows the number of users sessions over the course of a week. Peaks occur at around midday on weekdays, and there's a noticeable lack of activity over the weekend. This suggests that there's an opportunity to scale session hosts to meet demand during the week, and reduce the number of session hosts over the weekend.        

   :::image type="content" source="media/insights-use-cases/insights-session-count-over-time.png" alt-text="A graph showing the number of users sessions over the course of a week.":::

1. Use the **Session host count** chart to note the average number of active session hosts over time, and particularly the average number of session hosts that are idle (no sessions). Ideally session hosts should be actively supporting connected sessions and active workloads, and powered off when not in use by using a scaling plan. You will likely need to keep a minimum number of session hosts powered on to ensure availability for users at irregular times, so understanding usage over time can help find an appropriate number of session hosts to keep powered on as a buffer.

   Even if a scaling plan is ultimately not a good fit for your usage patterns, there is still an opportunity to balance the total number of session hosts available as a buffer by analyzing the session demand and potentially reducing the number of idle devices.

   In this example, the graph shows there are long periods over the course of a week where idle session hosts are powered on and therefore increasing costs.

   :::image type="content" source="media/insights-use-cases/insights-session-host-idle-count-over-time.png" alt-text="A graph showing the number of active and idle session hosts over the course of a week.":::

1. Use the drop-down lists to reduce the scope to a single host pool and repeat the analysis for **session history** and **session host count**. At this scope you can identify patterns that are specific to the session hosts in a particular host pool to help develop a scaling plan for that host pool.

   In these examples, the first graph shows the pattern of user activity throughout a week between 6AM and 10PM. On the weekend there is minimal activity. The second graph shows the number of active and idle session hosts throughout the same week. There are long periods of time where idle session hosts are powered on. Use this information to help determine optimal ramp-up and ramp-down times for a scaling plan.

   :::image type="content" source="media/insights-use-cases/insights-session-count-over-time-single-host-pool.png" alt-text="A graph showing the number of users sessions over the course of a week for a single host pool.":::

   :::image type="content" source="media/insights-use-cases/insights-session-host-idle-count-over-time-single-host-pool.png" alt-text="A graph showing the number of active and idle session hosts over the course of a week for a single host pool.":::

1. [Create a scaling plan](autoscale-scaling-plan.md) based on the usage patterns you've identified, then [assign the scaling plan to your host pool](autoscale-new-existing-host-pool.md).

1. After a period of time, you should repeat this process to validate that your session hosts are being utilized effectively. You can make changes to the scaling plan if needed, and continue to iterate until you find the optimal scaling plan for your usage patterns.

### Session host sizing

TODO: 

## Next steps

- [Create a scaling plan](autoscale-scaling-plan.md)