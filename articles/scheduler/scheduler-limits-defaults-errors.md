---
title: Limits, quotas, and thresholds in Azure Scheduler
description: Learn about limits, quotas, default values, and throttle thresholds for Azure Scheduler
services: scheduler
ms.service: scheduler
author: derek1ee
ms.author: deli
ms.reviewer: klam, estfan
ms.topic: article
ms.date: 08/18/2016
---

# Limits, quotas, and throttle thresholds in Azure Scheduler

> [!IMPORTANT]
> [Azure Logic Apps](../logic-apps/logic-apps-overview.md) is replacing Azure Scheduler, which is 
> [being retired](../scheduler/migrate-from-scheduler-to-logic-apps.md#retire-date). 
> To continue working with the jobs that you set up in Scheduler, please 
> [migrate to Azure Logic Apps](../scheduler/migrate-from-scheduler-to-logic-apps.md) as soon as possible. 
>
> Scheduler is no longer available in the Azure portal, but the [REST API](/rest/api/scheduler) 
> and [Azure Scheduler PowerShell cmdlets](scheduler-powershell-reference.md) remain available 
> at this time so that you can manage your jobs and job collections.

## Limits, quotas, and thresholds

[!INCLUDE [scheduler-limits-table](../../includes/scheduler-limits-table.md)]

## x-ms-request-id header

Every request made against the Scheduler service 
returns a response header named **x-ms-request-id**. 
This header contains an opaque value that uniquely 
identifies the request. So, if a request consistently fails, 
and you confirmed the request is properly formatted, 
you can report the error to Microsoft by providing the 
**x-ms-request-id** response header value and including these details: 

* The **x-ms-request-id** value
* The approximate time when the request was made 
* The identifiers for the Azure subscription, job collection, and job 
* The type of operation that the request attempted

## Next steps

* [Azure Scheduler concepts, terminology, and entity hierarchy](scheduler-concepts-terms.md)
* [Plans and billing for Azure Scheduler](scheduler-plans-billing.md)
* [Azure Scheduler REST API reference](/rest/api/scheduler)
* [Azure Scheduler PowerShell cmdlets reference](scheduler-powershell-reference.md)