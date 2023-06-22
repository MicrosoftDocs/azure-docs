---
title: 'Detect memory leak: Application Insights smart detection'
description: Monitor applications with Application Insights for potential memory leaks.
ms.topic: conceptual
ms.date: 12/12/2017
ms.reviewer: yagil
---
# Memory leak detection (preview)

>[!NOTE]
>You can migrate your Application Insight resources to alerts-based smart detection (preview). The migration creates alert rules for the different smart detection modules. After you create the rules, you can manage and configure them like any other Azure Monitor alert rules. You can also configure action groups for these rules to enable multiple methods of taking actions or triggering notification on new detections.
>
> For more information, see [Smart detection alerts migration](./alerts-smart-detections-migration.md).

Smart detection automatically analyzes the memory consumption of each process in your application. It can warn you about potential memory leaks or increased memory consumption.

This feature requires no special setup other than [configuring performance counters](../app/performance-counters.md) for your app. It's active when your app generates enough memory performance counters telemetry (for example, Private Bytes).

## When would I get this type of smart detection notification?
A typical notification follows a consistent increase:

- In memory consumption over a long period of time.
- In one or more processes or machines that are part of your application.

Machine learning algorithms are used to detect increased memory consumption that matches the pattern of a memory leak.

## Does my app really have a problem?
A notification doesn't mean that your app definitely has a problem. Although memory leak patterns might indicate an application issue, these patterns might be typical to your specific process. Memory leak patterns might also have a natural business justification. In such cases, you can ignore the notification.

## How do I fix it?
The notifications include diagnostic information to support in the diagnostic analysis process:
1. **Triage:** The notification shows you the amount of memory increase (in GB) and the time range in which the memory has increased. This information can help you assign a priority to the problem.
1. **Scope:** How many machines exhibited the memory leak pattern? How many exceptions were triggered during the potential memory leak? You can obtain this information from the notification.
1. **Diagnose:** The detection contains the memory leak pattern and shows memory consumption of the process over time. You can also use the related items and reports linking to supporting information to help you further diagnose the issue.
