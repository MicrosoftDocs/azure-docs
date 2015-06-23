<properties
 pageTitle="What is Scheduler?"
 description=""
 services="scheduler"
 documentationCenter=".NET"
 authors="krisragh"
 manager="dwrede"
 editor=""/>
<tags
 ms.service="scheduler"
 ms.workload="infrastructure-services"
 ms.tgt_pltfrm="na"
 ms.devlang="dotnet"
 ms.topic="get-started-article" 
 ms.date="05/12/2015"
 ms.author="krisragh"/>

# What is Scheduler?

Azure Scheduler allows you to declaratively describe actions to run in the cloud. It then schedules and runs those actions automatically. Azure Scheduler does this using [the Azure portal](scheduler-get-started-portal.md), code, [REST API](https://msdn.microsoft.com/library/dn528946), or PowerShell.

Azure Scheduler maintains, manages, schedules, and invokes scheduled work. Azure Scheduler does not host any workloads or run any code. It only _invokes_ code hosted elsewhere; this code may be hosted in Azure, on-premises, or with another provider. It invokes via HTTP, HTTPS, or a storage queue.

Azure Scheduler schedules jobs, keeps a history of job execution results that one can interrogate, and deterministically and reliability schedules workloads to be run. Azure Mobile Services Scheduled Scripts, Azure Web Apps WebJobs, and other Azure scheduling capabilities use Azure Scheduler behind the scenes. The [Scheduler REST API](https://msdn.microsoft.com/library/dn528946) helps manage the communication for these actions. As such, Scheduler supports [complex schedules and advanced recurrence easily](scheduler-advanced-complexity.md).

There are several scenarios that lend themselves to the usage of Azure Scheduler. For example:

+ _Recurring application actions_: Periodically gathering data from Twitter and gather the data into  feed.
+ _Daily maintenance_: Daily pruning of logs, performing backups, and other maintenance tasks.For example, an administrator may choose to backup her database at 1AM every day for the next 9 months.

Scheduler allows you to create, update, delete, view, and manage [“job collections” and “jobs”](scheduler-concepts-terms.md) programmatically, using scripts, and in the portal.

## See Also

 [Scheduler Concepts, Terminology, and Entity Hierarchy](scheduler-concepts-terms.md)

 [Get Started Using Scheduler in the Management Portal](scheduler-get-started-portal.md)

 [Plans and Billing in Azure Scheduler](scheduler-plans-billing.md)

 [How to Build Complex Schedules and Advanced Recurrence with Azure Scheduler](scheduler-advanced-complexity.md)

 [Scheduler REST API Reference](https://msdn.microsoft.com/library/dn528946)

 [Scheduler PowerShell Cmdlets Reference](scheduler-powershell-reference.md)

 [Scheduler High-Availability and Reliability](scheduler-high-availability-reliability.md)

 [Scheduler Limits, Defaults, and Error Codes](scheduler-limits-defaults-errors.md)

 [Scheduler Outbound Authentication](scheduler-outbound-authentication.md)
 