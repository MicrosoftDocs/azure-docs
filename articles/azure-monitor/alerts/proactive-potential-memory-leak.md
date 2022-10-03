---
title: Detect memory leak - Azure Application Insights smart detection
description: Monitor applications with Azure Application Insights for potential memory leaks.
ms.topic: conceptual
ms.date: 12/12/2017
ms.reviewer: yagil
---
# Memory leak detection (preview)

>[!NOTE]
>You can migrate your Application Insight resources to alerts-bases smart detection (preview). The migration creates alert rules for the different smart detection modules. Once created, you can manage and configure these rules just like any other Azure Monitor alert rules. You can also configure action groups for these rules, thus enabling multiple methods of taking actions or triggering notification on new detections.
>
> For more information, see [Smart Detection Alerts migration](./alerts-smart-detections-migration.md).

Smart detection automatically analyzes the memory consumption of each process in your application, and can warn you about potential memory leaks or increased memory consumption.

This feature requires no special setup, other than [configuring performance counters](../app/performance-counters.md) for your app. It's active when your app generates enough memory performance counters telemetry (for example, Private Bytes).

## When would I get this type of smart detection notification?
A typical notification will follow a consistent increase in memory consumption, over a long period of time, in one or more processes or machines, which are part of your application. Machine learning algorithms are used for detecting increased memory consumption that matches the pattern of a memory leak.

## Does my app really have a problem?
A notification doesn't mean that your app definitely has a problem. Although memory leak patterns many times indicate an application issue, these patterns could be typical to your specific process, or could have a natural business justification. In such case the notification can be ignored.

## How do I fix it?
The notifications include diagnostic information to support in the diagnostic analysis process:
1. **Triage.** The notification shows you the amount of memory increase (in GB), and the time range in which the memory has increased. This information can help you assign a priority to the problem.
2. **Scope.** How many machines exhibited the memory leak pattern? How many exceptions were triggered during the potential memory leak? This information can be obtained from the notification.
3. **Diagnose.** The detection contains the memory leak pattern, showing memory consumption of the process over time. You can also use the related items and reports linking to supporting information, to help you further diagnose the issue.
