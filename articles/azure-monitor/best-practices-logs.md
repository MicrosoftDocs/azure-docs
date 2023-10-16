---
title: Best practices for Azure Monitor Logs
description: Provides a template for a Well-Architected Framework (WAF) article specific to Log Analytics workspaces in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/29/2023
ms.reviewer: bwren
---

# Best practices for Azure Monitor Logs
This article provides architectural best practices for Azure Monitor Logs. The guidance is based on the five pillars of architecture excellence described in [Azure Well-Architected Framework](/azure/architecture/framework/).



## Reliability
In the cloud, we acknowledge that failures happen. Instead of trying to prevent failures altogether, the goal is to minimize the effects of a single failing component. Use the following information to minimize failure of your Log Analytics workspaces and to protect the data they collect.

[!INCLUDE [waf-logs-reliability](includes/waf-logs-reliability.md)]


## Security
Security is one of the most important aspects of any architecture. Azure Monitor provides features to employ both the principle of least privilege and defense-in-depth. Use the following information to maximize the security of your Log Analytics workspaces and ensure that only authorized users access collected data.

[!INCLUDE [waf-logs-security](includes/waf-logs-security.md)]


## Cost optimization
Cost optimization refers to ways to reduce unnecessary expenses and improve operational efficiencies. You can significantly reduce your cost for Azure Monitor by understanding your different configuration options and opportunities to reduce the amount of data that it collects. See [Azure Monitor cost and usage](usage-estimated-costs.md) to understand the different ways that Azure Monitor charges and how to view your monthly bill.

> [!NOTE]
> See [Optimize costs in Azure Monitor](best-practices-cost.md) for cost optimization recommendations across all features of Azure Monitor.

[!INCLUDE [waf-logs-cost](includes/waf-logs-cost.md)]


## Operational excellence
Operational excellence refers to operations processes required keep a service running reliably in production. Use the following information to minimize the operational requirements for supporting Log Analytics workspaces.

[!INCLUDE [waf-logs-operation](includes/waf-logs-operation.md)]


## Performance efficiency
Performance efficiency is the ability of your workload to scale to meet the demands placed on it by users in an efficient manner. Use the following information to ensure that your Log Analytics workspaces and log queries are configured for maximum performance.

[!INCLUDE [waf-logs-performance](includes/waf-logs-performance.md)]

## Next step

- [Get best practices for a complete deployment of Azure Monitor](best-practices.md).
