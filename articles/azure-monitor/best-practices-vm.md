---
title: Best practices for monitoring virtual machines in Azure Monitor
description: Best practices organized by the pillars of the Well-Architected Framework (WAF) for monitoring virtual machines in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/08/2023
ms.reviewer: bwren
---

# Best practices for monitoring virtual machines in Azure Monitor
This article provides architectural best practices for monitoring virtual machines and their client workloads using Azure Monitor. The guidance is based on the five pillars of architecture excellence described in [Azure Well-Architected Framework](/azure/architecture/framework/).



## Reliability
In the cloud, we acknowledge that failures happen. Instead of trying to prevent failures altogether, the goal is to minimize the effects of a single failing component. Use the following information to monitor your virtual machines and their client workloads for failure.

[!INCLUDE [waf-vm-reliability](includes/waf-vm-reliability.md)]


## Security
Security is one of the most important aspects of any architecture. Azure Monitor provides features to employ both the principle of least privilege and defense-in-depth. Use the following information to monitor the security of your virtual machines.

[!INCLUDE [waf-vm-security](includes/waf-vm-security.md)]


## Cost optimization
Cost optimization refers to ways to reduce unnecessary expenses and improve operational efficiencies. You can significantly reduce your cost for Azure Monitor by understanding your different configuration options and opportunities to reduce the amount of data that it collects. See [Azure Monitor cost and usage](cost-usage.md) to understand the different ways that Azure Monitor charges and how to view your monthly bill.

> [!NOTE]
> See [Optimize costs in Azure Monitor](best-practices-cost.md) for cost optimization recommendations across all features of Azure Monitor.

[!INCLUDE [waf-vm-cost](includes/waf-vm-cost.md)]


## Operational excellence
Operational excellence refers to operations processes required keep a service running reliably in production. Use the following information to minimize the operational requirements for monitoring of your virtual machines.

[!INCLUDE [waf-vm-operation](includes/waf-vm-operation.md)]


## Performance efficiency
Performance efficiency is the ability of your workload to scale to meet the demands placed on it by users in an efficient manner. Use the following information to monitor the performance of your virtual machines.

[!INCLUDE [waf-vm-performance](includes/waf-vm-performance.md)]

## Next step

- [Get complete guidance on configuring monitoring for virtual machines](vm/monitor-virtual-machine.md).
