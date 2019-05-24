---
title: What is Azure Scheduler? | Microsoft Docs
description: Learn how to create, schedule, and run automated jobs that call services inside or outside Azure
services: scheduler
ms.service: scheduler
ms.suite: infrastructure-services
author: derek1ee
ms.author: deli
ms.reviewer: klam
ms.assetid: 52aa6ae1-4c3d-43fb-81b0-6792c84bcfae
ms.topic: conceptual
ms.date: 09/17/2018
---

# What is Azure Scheduler?

> [!IMPORTANT]
> [Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
> is replacing Azure Scheduler, which is being retired. 
> To schedule jobs, [try Azure Logic Apps instead](../scheduler/migrate-from-scheduler-to-logic-apps.md). 

[Azure Scheduler](https://azure.microsoft.com/services/scheduler/) 
helps you create [jobs](../scheduler/scheduler-concepts-terms.md) 
that run in the cloud by declaratively describing actions. 
The service then automatically schedules and runs those actions. 
For example, you can call services inside and outside Azure, 
such as calling HTTP or HTTPS endpoints, and also post messages 
to Azure Storage queues and Azure Service Bus queues or topics. 
You can run jobs immediately or at a later time. Scheduler easily 
supports [complex schedules and advanced recurrence](../scheduler/scheduler-advanced-complexity.md). 
Scheduler specifies when to run jobs, keeps a history of job 
results that you can review, and then predictably and 
reliably schedules workloads to run.

Although you can use Scheduler to create, maintain, 
and run scheduled workloads, Scheduler doesn't host 
the workloads or run code. The service only *invokes* 
the services or code hosted elsewhere, for example, 
in Azure, on-premises, or with another provider. 
Scheduler can invoke through HTTP, HTTPS, a Storage 
queue, a Service Bus queue, or a Service Bus topic. 
To create, manage, and schedule jobs, you can use the 
[Azure portal](../scheduler/scheduler-get-started-portal.md), 
code, [Scheduler REST API](https://docs.microsoft.com/rest/api/scheduler/), 
or [Azure Scheduler PowerShell cmdlets reference](scheduler-powershell-reference.md). 
For example, you can programmatically 
create, view, update, manage, or delete jobs and 
[job collections](../scheduler/scheduler-concepts-terms.md) 
by using scripts and in the Azure portal.

Other Azure scheduling capabilities also use Scheduler in the background, 
for example, [Azure WebJobs](../app-service/webjobs-create.md), 
which is a [Web Apps](https://azure.microsoft.com/services/app-service/web/) 
feature in Azure App Service. You can manage communication for these actions 
by using the [Scheduler REST API](https://docs.microsoft.com/rest/api/scheduler/). 
helps manage the communication for these actions.

Here are some scenarios where Scheduler can help you:

* **Run recurring app actions**: For example, periodically 
collect data from Twitter into a feed.

* **Perform daily maintenance**: Such as pruning logs daily, 
performing backups, and other maintenance tasks. 

  For example, as an administrator, you might want 
  to back up your database at 1:00 AM every day for 
  the next nine months.

## Next steps

* [Get started with Scheduler in the Azure portal](scheduler-get-started-portal.md)
* Learn about [plans and billing for Azure Scheduler](scheduler-plans-billing.md)
* Learn [how to build complex schedules and advanced recurrence with Azure Scheduler](scheduler-advanced-complexity.md)