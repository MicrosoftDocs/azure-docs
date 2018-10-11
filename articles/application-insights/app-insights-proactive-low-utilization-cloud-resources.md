---
title: Smart Detection - Low utilization of cloud resources detected by Azure Application Insights | Microsoft Docs
description: Monitor applications with Azure Application Insights for low utilization of cloud resources.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.assetid: ea2a28ed-4cd9-4006-bd5a-d4c76f4ec20b
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: conceptual
ms.date: 12/12/2017
ms.author: mbullwin

---

# Low CPU utilization in cloud resources (preview)

Application Insight automatically analyzes the CPU consumption of each role instance in your application and detects instances with low CPU utilization. This detection enables you to decrease your Azure resources and reduce costs, by decreasing the number of role instances each role utilizes, or by decreasing the number of roles.

This feature requires no special setup, other than [configuring performance counters](https://docs.microsoft.com/azure/application-insights/app-insights-performance-counters) for your app. It's active when your app generates enough CPU performance counter telemetry (% Processor Time).

## When would I get this type of smart detection notification?
A typical notification occurs when many of your Web/Worker Role instances exhibit low CPU utilization.

## Does my app definitely consume too many resources?
No, a notification doesn't mean that your app definitely consumes too many resources. Although such patterns of low CPU utilization usually indicate that resource consumption could be decreased, this behavior could be typical to your specific role, or could have a natural business justification, and can be ignored. For example, it could be that multiple instances are needed for other resources, such as memory/network, and not CPU.

## How do I fix it?
The notifications include diagnostic information to support in the diagnostics process:
1. **Triage.** The notification shows you the roles in your app that exhibit low CPU utilization. This can help you assign a priority to the problem.
2. **Scope.** How many roles exhibited low CPU utilization, and how many instances in each role utilize low CPU? This information can be obtained from the notification.
3. **Diagnose.** The detection contains the percentage of CPU utilized, showing CPU utilization of each instance over time. You can also use the related items and reports linking to supporting information, such as percentiles of CPU utilization, to help you further diagnose the issue.
