---
title: What is Azure Scheduler? | Microsoft Docs
description: Azure Scheduler allows you to declaratively describe actions to run in the cloud. It then schedules and runs those actions automatically.
services: scheduler
documentationcenter: .NET
author: derek1ee
manager: kevinlam1
editor: ''

ms.assetid: 52aa6ae1-4c3d-43fb-81b0-6792c84bcfae
ms.service: scheduler
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 08/18/2016
ms.author: deli

---
# What is Azure Scheduler?
Azure Scheduler allows you to declaratively describe actions to run in the cloud. It then schedules and runs those actions automatically.  Scheduler does this by using [the Azure portal](scheduler-get-started-portal.md), code, [REST API](https://msdn.microsoft.com/library/mt629143.aspx), or Azure PowerShell.

Scheduler creates, maintains, and invokes scheduled work.  Scheduler does not host any workloads or run any code. It only *invokes* code hosted elsewhere—in Azure, on-premises, or with another provider. It invokes via HTTP, HTTPS, a storage queue, a service bus queue, or a service bus topic.

Scheduler schedules [jobs](scheduler-concepts-terms.md), keeps a history of job execution results that one can review, and deterministically and reliably schedules workloads to be run. Azure WebJobs (part of the Web Apps feature in Azure App Service) and other Azure scheduling capabilities use Scheduler in the background. The [Scheduler REST API](https://msdn.microsoft.com/library/mt629143.aspx) helps manage the communication for these actions. As such, Scheduler supports [complex schedules and advanced recurrence](scheduler-advanced-complexity.md) easily.

There are several scenarios that lend themselves to the usage of Scheduler. For example:

* *Recurring application actions:* Periodically gathering data from Twitter into a feed.
* *Daily maintenance:* Daily pruning of logs, performing backups, and other maintenance tasks. For example, an administrator may choose to back up the database at 1:00 A.M. every day for the next nine months.

Scheduler allows you to create, update, delete, view, and manage jobs and [job collections](scheduler-concepts-terms.md) programmatically, by using scripts, and in the portal.

## See also
 [Azure Scheduler concepts, terminology, and entity hierarchy](scheduler-concepts-terms.md)

 [Get started using Scheduler in the Azure portal](scheduler-get-started-portal.md)

 [Plans and billing in Azure Scheduler](scheduler-plans-billing.md)

 [How to build complex schedules and advanced recurrence with Azure Scheduler](scheduler-advanced-complexity.md)

 [Azure Scheduler REST API reference](https://msdn.microsoft.com/library/mt629143)

 [Azure Scheduler PowerShell cmdlets reference](scheduler-powershell-reference.md)

 [Azure Scheduler high-availability and reliability](scheduler-high-availability-reliability.md)

 [Azure Scheduler limits, defaults, and error codes](scheduler-limits-defaults-errors.md)

 [Azure Scheduler outbound authentication](scheduler-outbound-authentication.md)

