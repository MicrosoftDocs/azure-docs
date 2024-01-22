---
title: Best practices for Azure Monitor alerts
description: Provides a template for a Well-Architected Framework (WAF) article specific to Azure Monitor alerts.
ms.topic: conceptual
author: AbbyMSFT
ms.author: abbyweisberg
ms.date: 09/04/2023
ms.reviewer: abbyweisberg
---

# Best practices for Azure Monitor alerts
This article provides architectural best practices for Azure Monitor alerts, alert processing rules, and action groups. The guidance is based on the five pillars of architecture excellence described in [Azure Well-Architected Framework](/azure/architecture/framework/).



## Reliability
In the cloud, we acknowledge that failures happen. Instead of trying to prevent failures altogether, the goal is to minimize the effects of a single failing component. Use the following information to minimize failure of your Azure Monitor alert rule components.

[!INCLUDE [waf-alerts-reliability](includes/waf-alerts-reliability.md)]


## Security
Security is one of the most important aspects of any architecture. Azure Monitor provides features to employ both the principle of least privilege and defense-in-depth. Use the following information to maximize the security of Azure Monitor alerts.

[!INCLUDE [waf-alerts-security](includes/waf-alerts-security.md)]


## Cost optimization
Cost optimization refers to ways to reduce unnecessary expenses and improve operational efficiencies. You can significantly reduce your cost for Azure Monitor by understanding your different configuration options and opportunities to reduce the amount of data that it collects. See [Azure Monitor cost and usage](cost-usage.md) to understand the different ways that Azure Monitor charges and how to view your monthly bill.

> [!NOTE]
> See [Optimize costs in Azure Monitor](best-practices-cost.md) for cost optimization recommendations across all features of Azure Monitor.

[!INCLUDE [waf-alerts-cost](includes/waf-alerts-cost.md)]


## Operational excellence
Operational excellence refers to operations processes required keep a service running reliably in production. Use the following information to minimize the operational requirements for supporting Azure Monitor alerts.

[!INCLUDE [waf-alerts-operation](includes/waf-alerts-operation.md)]


## Performance efficiency
Performance efficiency is the ability of your workload to scale to meet the demands placed on it by users in an efficient manner. 
Alerts offer a high degree of performance efficiency without any design decisions.

## Next step

- [Get best practices for a complete deployment of Azure Monitor](best-practices.md).
