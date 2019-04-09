---
title: Smart Detection - Abnormal rise in exception volume, in Azure Application Insights | Microsoft Docs
description: Monitor application exceptions with Azure Application Insights for unusual patterns in exception volume.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.assetid: ea2a28ed-4cd9-4006-bd5a-d4c76f4ec20b
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 12/08/2017
ms.author: mbullwin
---

# Abnormal rise in exception volume (preview)

Application Insights automatically analyzes the exceptions thrown in your application, and can warn you about unusual patterns in your exception telemetry.

This feature requires no special setup, other than [configuring exception reporting](https://docs.microsoft.com/azure/application-insights/app-insights-asp-net-exceptions#set-up-exception-reporting) for your app. It is active when your app generates enough exception telemetry.

## When would I get this type of smart detection notification?
You might get this type of notification if your app is exhibiting an abnormal rise in the number of exceptions of a specific type during a day, compared to a baseline calculated over the previous seven days.
Machine learning algorithms are being used for detecting the rise in exception count, while taking into account a natural growth in your application usage.

## Does my app definitely have a problem?
No, a notification doesn't mean that your app definitely has a problem. Although an excessive number of exceptions usually indicates an application issue, these exceptions might be benign and handled correctly by your application.

## How do I fix it?
The notifications include diagnostic information to support in the diagnostics process:
1. **Triage.** The notification shows you how many users or how many requests are affected. This can help you assign a priority to the problem.
2. **Scope.** Is the problem affecting all traffic, or just some operation? This information can be obtained from the notification.
3. **Diagnose.** The detection contains information about the method from which the exception was thrown, as well as the exception type. You can also use the related items and reports linking to supporting information, to help you further diagnose the issue.