---
title: Degradation in trace severity ratio - Azure Application Insights
description: Monitor application traces with Azure Application Insights for unusual patterns in trace telemetry with smart detection.
ms.topic: conceptual
ms.date: 11/27/2017
ms.reviewer: yagil
---
# Degradation in trace severity ratio (preview)

>[!NOTE]
>You can migrate your Application Insight resources to alerts-bases smart detection (preview). The migration creates alert rules for the different smart detection modules. Once created, you can manage and configure these rules just like any other Azure Monitor alert rules. You can also configure action groups for these rules, thus enabling multiple methods of taking actions or triggering notification on new detections.
>
> For more information, see [Smart Detection Alerts migration](./alerts-smart-detections-migration.md).
> 

Traces are widely used in applications, and they help tell the story of what happens behind the scenes. When things go wrong, traces provide crucial visibility into the sequence of events leading to the undesired state. While traces are mostly unstructured, their severity level can still provide valuable information. In an application’s steady state, we would expect the ratio between “good” traces (*Info* and *Verbose*) and “bad” traces (*Warning*, *Error*, and *Critical*) to remain stable. 

It's normal to expect some level of “Bad” traces because of any number of reasons, such as transient network issues. But when a real problem begins growing, it usually manifests as an increase in the relative proportion of “bad” traces vs “good” traces. Smart detection automatically analyzes the trace telemetry that your application logs, and can warn you about unusual patterns in their severity.

This feature requires no special setup, other than configuring trace logging for your app. See how to configure a trace log listener for [.NET](../app/asp-net-trace-logs.md) or [Java](../app/opentelemetry-enable.md?tabs=java). It's active when your app generates enough trace telemetry.

## When would I get this type of smart detection notification?
You get this type of notification if the ratio between “good” traces (traces logged with a level of *Info* or *Verbose*) and “bad” traces (traces logged with a level of *Warning*, *Error*, or *Fatal*) is degrading in a specific day, compared to a baseline calculated over the previous seven days.

## Does my app definitely have a problem?
A notification doesn't mean that your app definitely has a problem. Although a degradation in the ratio between “good” and “bad” traces might indicate an application issue, it can also be benign. For example, the increase can be because of a new flow in the application emitting more “bad” traces than existing flows).

## How do I fix it?
The notifications include diagnostic information to support in the diagnostics process:
1. **Triage.** The notification shows you how many operations are affected. This information can help you assign a priority to the problem.
2. **Scope.** Is the problem affecting all traffic, or just some operation? This information can be obtained from the notification.
3. **Diagnose.** You can use the related items and reports linking to supporting information, to help you further diagnose the issue.