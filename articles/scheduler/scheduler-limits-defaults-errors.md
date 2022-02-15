---
title: Limits, quotas, and thresholds in Azure Scheduler
description: Learn about limits, quotas, default values, and throttle thresholds for Azure Scheduler.
services: scheduler
ms.service: scheduler
author: derek1ee
ms.author: deli
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 02/15/2022
---

# Limits, quotas, and throttle thresholds in Azure Scheduler

> [!IMPORTANT]
> [Azure Logic Apps](../logic-apps/logic-apps-overview.md) has replaced Azure Scheduler, which is fully deprecated 
> since January 31, 2022. Please migrate your Azure Scheduler jobs by recreating them as workflows in Azure Logic Apps 
> following the steps in [Migrate Azure Scheduler jobs to Azure Logic Apps](migrate-from-scheduler-to-logic-apps.md). 
> Azure Scheduler is longer available in the Azure portal. The [Azure Scheduler REST API](/rest/api/scheduler) and 
> [Azure Scheduler PowerShell cmdlets](scheduler-powershell-reference.md) no longer work.

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