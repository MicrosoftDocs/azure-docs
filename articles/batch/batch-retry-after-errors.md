---
title: Retrying tasks after an error
description: Check for errors and retry them.
services: batch
documentationcenter: .net
author: LauraBrenner
manager: evansma
editor: ''
tags: azure-batch

ms.assetid: 16279b23-60ff-4b16-b308-5de000e4c028
ms.service: batch
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-compute
ms.date: 02/15/2020
ms.author: labrenne
ms.custom: seodec18
---

# Detecting and handling Batch service errors

It is important to remember to check for errors when working with a REST service API. It isn't uncommon for errors to occur when running batch jobs.

## Common errors 

- Networking failures - these are requests that never reached Batch or the Batch response didn't reach the client in time.
- Internal server errors - these are standard 5xx status code HTTP response.
- Throttling can cause errors such as 429 or 503 status code HTTP responses with the Retry-after header.
- 4xx errors that include such errors as AlreadyExists and InvalidOperation. This means that the resource is not in the correct state for the state transition.

For detailed information about the various types of error codes and specific error codes, see [Batch Status and Error Codes](https://docs.microsoft.com/rest/api/batchservice/batch-status-and-error-codes).

## When to retry

The Batch APIs will notify you if there is a failure. They can all be retried, and they all include a global retry handler for that purpose. It is best to use this built-in mechanism.

After a failure, you should wait a bit (several seconds between retries) before retrying. If you retry too frequently or too quickly, the retry handler will throttle.

### For more information  

[Batch APIs and tools](batch-apis-tools.md) links to API reference information. The .NET API, for example, has a [RetryPolicyProvider class]( https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.retrypolicyprovider?view=azure-dotnet) where the required retry policy should be specified. 

For detailed information about each API and their default retry policies, read [Batch Status and Error Codes](https://docs.microsoft.com/rest/api/batchservice/batch-status-and-error-codes).
