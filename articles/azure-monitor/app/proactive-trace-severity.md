---
title: Degradation in trace severity ratio - Azure Application Insights
description: Monitor application traces with Azure Application Insights for unusual patterns in trace telemetry with Smart Detection .
ms.topic: conceptual
ms.date: 11/27/2017

---

# Degradation in trace severity ratio (preview)

Traces are widely used in applications, as they help tell the story of what happens behind the scenes. When things go wrong, traces provide crucial visibility into the sequence of events leading to the undesired state. While traces are generally unstructured, there is one thing that can concretely be learned from them – their severity level. In an application’s steady state, we would expect the ratio between “good” traces (*Info* and *Verbose*) and “bad” traces (*Warning*, *Error*, and *Critical*) to remain stable. The assumption is that “bad” traces may happen on a regular basis to a certain extent due to any number of reasons (transient network issues for instance). But when a real problem begins growing, it usually manifests as an increase in the relative proportion of “bad” traces vs “good” traces. Application Insights Smart Detection automatically analyzes the traces logged by your application, and can warn you about unusual patterns in the severity of your trace telemetry.

This feature requires no special setup, other than configuring trace logging for your app (see how to configure a trace log listener for [.NET](https://docs.microsoft.com/azure/application-insights/app-insights-asp-net-trace-logs) or [Java](https://docs.microsoft.com/azure/application-insights/app-insights-java-trace-logs)). It is active when your app generates enough exception telemetry.

## When would I get this type of smart detection notification?
You might get this type of notification if the ratio between “good” traces (traces logged with a level of *Info* or *Verbose*) and “bad” traces (traces logged with a level of *Warning*, *Error*, or *Fatal*) is degrading in a specific day, compared to a baseline calculated over the previous seven days.

## Does my app definitely have a problem?
No, a notification doesn't mean that your app definitely has a problem. Although a degradation in the ratio between “good” and “bad” traces might indicate an application issue, this change in ratio might be benign. For example, the increase might be due to a new flow in the application emitting more “bad” traces than existing flows).

## How do I fix it?
The notifications include diagnostic information to support in the diagnostics process:
1. **Triage.** The notification shows you how many operations are affected. This can help you assign a priority to the problem.
2. **Scope.** Is the problem affecting all traffic, or just some operation? This information can be obtained from the notification.
3. **Diagnose.** You can use the related items and reports linking to supporting information, to help you further diagnose the issue.


