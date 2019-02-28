---
title: Limits, quotas, and thresholds in Azure Scheduler
description: Learn about limits, quotas, default values, and throttle thresholds for Azure Scheduler
services: scheduler
ms.service: scheduler
author: derek1ee
ms.author: deli
ms.reviewer: klam
ms.assetid: 88f4a3e9-6dbd-4943-8543-f0649d423061
ms.topic: article
ms.date: 08/18/2016
---

# Limits, quotas, and throttle thresholds in Azure Scheduler

> [!IMPORTANT]
> [Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
> is replacing Azure Scheduler, which is being retired. 
> To schedule jobs, [try Azure Logic Apps instead](../scheduler/migrate-from-scheduler-to-logic-apps.md). 

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

## See also

* [What is Azure Scheduler?](scheduler-intro.md)
* [Azure Scheduler concepts, terminology, and entity hierarchy](scheduler-concepts-terms.md)
