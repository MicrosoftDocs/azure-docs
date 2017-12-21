---
title: Near Real-Time Metric Alerts in Azure Monitor | Microsoft Docs
description: Near real-time metric alerts enable you to monitor Azure resource metrics as frequently as 1 min.
author: snehithm
manager: kmadnani1
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: 
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/06/2017
ms.author: snmuvva
ms.custom: 

---

# Near Real-Time Metric Alerts (Preview)
Azure Monitor now supports a new type of metric alerts called Near Real-Time Metric Alerts (Preview). This feature is currently in public preview.
These alerts differ from regular metric alerts in few ways

- **Improved Latency** - Near real-time metric alerts can monitor changes in metric values as soon as 1 min.
- **More control over metric conditions** - Near real-time metric alerts allow users to define richer alert rules. The alerts now support monitoring the maximum, minimum, average, and total values of the metrics.
- **Combined monitoring of multiple metrics** - Near real-time metric alerts can monitor multiple metrics(currently two) with a single rule. Alert gets triggered if both the metrics breach their respective thresholds for the specified time period.
- **Modular notification system** - Near real-time metric alerts use [action groups](monitoring-action-groups.md). This functionality allows users to create actions in a modular fashion and reuse them for many alert rules.

> [!NOTE]
> Near real-time metric alerts feature is currently in public preview. The functionality and user experience is subject to change.
>

## What resources can I create near real-time metric alerts for?
Full list of resource types that are supported by near real-time metric alerts:

* Microsoft.ApiManagement/service
* Microsoft.Automation/automationAccounts
* Microsoft.Batch/batchAccounts
* Microsoft.Cache/Redis
* Microsoft.Compute/virtualMachines
* Microsoft.Compute/virtualMachineScaleSets
* Microsoft.DataFactory/factories
* Microsoft.DBforMySQL/servers
* Microsoft.DBforPostgreSQL/servers
* Microsoft.EventHub/namespaces
* Microsoft.Logic/workflows
* Microsoft.Network/applicationGateways
* Microsoft.Network/publicipaddresses
* Microsoft.Search/searchServices
* Microsoft.ServiceBus/namespaces
* Microsoft.Storage/storageAccounts
* Microsoft.Storage/storageAccounts/services
* Microsoft.StreamAnalytics/streamingjobs
* Microsoft.CognitiveServices/accounts

## Near Real-Time Metric Alerts on metrics with dimensions
Near Real-Time Metric Alerts supports alerting on metrics with dimensions. Dimensions are a way to filter your metric to the right level. Near real-time metric alerts on metrics with dimensions are supported for the following resource types

* Microsoft.ApiManagement/service
* Microsoft.Storage/storageAccounts (only supported for storage accounts in US regions)
* Microsoft.Storage/storageAccounts/services (only supported for storage accounts in US regions)


## Create a Near Real-Time Metric Alert
Currently, near real-time metric alerts can only be created through the Azure portal. Support for configuring near real-time metric alerts through PowerShell, command-line interface (CLI), and Azure Monitor REST API is coming soon.

The create alert experience for Near Real-Time Metric Alert has moved to the new **Alerts(Preview)** experience. Even though, the current Alerts page shows **Add Near Real-Time Metric alert**, you are redirected to the new experience.

You can create a near real-time metric alert using the steps described [here](monitor-alerts-unified-usage.md#create-an-alert-rule-with-the-azure-portal).

## Managing near real-time metric alerts
Once you have created a **Near Real-Time Metric alert**, it can be managed using the steps described [here](monitor-alerts-unified-usage.md#managing-your-alerts-in-azure-portal).

## Next steps

* [Learn more about the new Alerts (preview) experience](monitoring-overview-unified-alerts.md)
* [Learn about Log Alerts in Azure Alerts (preview)](monitor-alerts-unified-log.md)
* [Learn about Alerts in Azure](monitoring-overview-alerts.md)