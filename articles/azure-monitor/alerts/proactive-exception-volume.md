---
title: Abnormal rise in exception volume - Azure Application Insights
description: Monitor application exceptions with smart detection in Azure Application Insights for unusual patterns in exception volume.
ms.topic: conceptual
ms.date: 12/08/2017
ms.reviewer: yagil
---
# Abnormal rise in exception volume (preview)

>[!NOTE]
>You can migrate your Application Insight resources to alerts-bases smart detection (preview). The migration creates alert rules for the different smart detection modules. Once created, you can manage and configure these rules just like any other Azure Monitor alert rules. You can also configure action groups for these rules, thus enabling multiple methods of taking actions or triggering notification on new detections.
>
> For more information, see [Smart Detection Alerts migration](./alerts-smart-detections-migration.md).

Smart detection automatically analyze the exceptions thrown in your application, and can warn you about unusual patterns in your exception telemetry.

This feature requires no special setup, other than [configuring exception reporting](../app/asp-net-exceptions.md#set-up-exception-reporting) for your app. It's active when your app generates enough exception telemetry.

## When would I get this type of smart detection notification?
You get this type of notification if your app is showing an abnormal rise in the number of exceptions of a specific type, during a day. This number is compared to a baseline calculated over the previous seven days.
Machine learning algorithms are used for detecting the rise in exception count, while taking into account a natural growth in your application usage.

## Does my app definitely have a problem?
No, a notification doesn't mean that your app definitely has a problem. Although an excessive number of exceptions usually indicates an application issue, these exceptions might be benign and handled correctly by your application.

## How do I fix it?
The notifications include diagnostic information to support in the diagnostics process:
1. **Triage.** The notification shows you how many users or how many requests are affected. This information can help you assign a priority to the problem.
2. **Scope.** Is the problem affecting all traffic, or just some operation? This information can be obtained from the notification.
3. **Diagnose.** The detection contains information about the method from which the exception was thrown, and the exception type. You can also use the related items and reports linking to supporting information, to help you further diagnose the issue.
