---
title: An overview on how to move virtual machines from Automation Update Management to Azure Update Manager
description: A guidance overview on migration from Automation Update Management to Azure Update Manager
author: snehasudhirG
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 08/01/2024
ms.author: sudhirsneha
---

# Overview of migration from Automation Update Management to Azure Update Manager

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers

This article provides guidance to move virtual machines from Automation Update Management to Azure Update Manager.

Azure Update Manager provides a SaaS solution to manage and govern software updates to Windows and Linux machines across Azure, on-premises, and multicloud environments. It's an evolution of [Azure Automation Update management solution](../automation/update-management/overview.md) with new features and functionality, for assessment and deployment of software updates on a single machine or on multiple machines at scale.

> [!Note]
> - On 31 August 2024, both Azure Automation Update Management and the Log Analytics agent it uses [will be retired](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). Therefore, if you are using the Azure Automation Update Management solution, we recommend that you move to Azure Update Manager for your software update needs. Follow guidance in this document to move your machines and schedules from Automation Update Management to Azure Update Manager. For more information, see the [FAQs on retirement](https://aka.ms/aum-migration-faqs) You can [sign up](https://aka.ms/AUMLive) for monthly live sessions on migration including Q&A sessions.
> - If you are using Azure Automation Update Management Solution, we recommend that you don't remove MMA agents from the machines without completing the migration to Azure Update Manager for the machine's patch management needs. If you remove the MMA agent from the machine without moving to Azure Update Manager, it will break the patching workflows for that machine. 

For the Azure Update Manager, both AMA and MMA aren't a requirement to manage software update workflows as it relies on the Microsoft Azure VM Agent for Azure VMs and Azure connected machine agent for Arc-enabled servers. When you perform an update operation for the first time on a machine, an extension is pushed to the machine, and it interacts with the agents to assess missing updates and install updates.

We provide three methods to move from Automation Update Management to Azure Update Manager which are explained in detail:
- [Portal migration tool](migration-using-portal.md)
- [Migration runbook scripts](migration-using-runbook-scripts.md)
- [Manual migration](migration-manual.md)


## Next steps

- [Migration using Azure portal](migration-using-portal.md)
- [Migration using runbook scripts](migration-using-runbook-scripts.md)
- [Manual migration guidance](migration-manual.md)
- [Key points during migration](migration-key-points.md)