---
title: Metric alerts from Azure Monitor for containers | Microsoft Docs
description: This article reviews the pre-defined metric alerts available from Azure Monitor for containers in public preview.
ms.topic: conceptual
ms.date: 05/05/2020

---

# Pre-defined metric alerts from Azure Monitor for containers

To alert on performance issues with Azure Monitor for containers, you would create a log alert based on performance data stored in Azure Monitor Logs. Azure Monitor for containers now includes pre-configured metric alert rules for your AKS clusters. This article reviews the experience and provides guidance on configuring and managing these alert rules.

## Alert rules included

To alert on what matters, Azure Monitor for containers includes the following metric alerts for your AKS clusters:

|Name| Description |
| Average CPU % | Calculates average CPU used per node.<br> Default trigger threshold: When average CPU usage per node is greater than 80%.| 
| Average Working set memory % | Calculates average working set memory used per node.<br> Default trigger threshold: When average working set memory usage per node is greater than 80%. |
| Failed Pod Counts | Calculates if any pod in failed state.<br> Default trigger threshold: When a number of pods in failed state are greater than 0. |
| Node NotReady status | Calculates if any node is in NotReady state.<br> Default trigger threshold: When a number of nodes in NotReady state are greater than 0. |
| Metric heartbeat | Alerts when all nodes are down and are not sending any metric data.<br> Default trigger threshold: When a number of nodes not sending metric data are less than or equal to 0.|

There are common properties across all of these alert rules:

* All alert rules are metric based.

* All alert rules are evaluated once per minute and they look back at last 5 minutes of data.

* Alerts rules do not have an action group assigned to them by default. You can add an [action group](../platform/action-groups.md) to the alert either by selecting an existing action group or creating a new action group while editing the alert rule.

* You can modify the threshold for alert rules by directly editing them. However, refer to the guidance provided in each alert rule before modifying the threshold
