---
title: include file
description: include file
services: storage
author: normesta
ms.service: azure-storage
ms.topic: include
ms.date: 06/01/2026
ms.author: normesta
ms.custom: include file
---

This reference details scalability and performance targets for Azure Storage. The scalability and performance targets listed here are high-end targets, but they're achievable. In all cases, the request rate and bandwidth that your storage account achieves depend on the size of objects stored, the access patterns used, and the type of workload your application performs.

Test your service to determine whether its performance meets your requirements. If possible, avoid sudden spikes in the rate of traffic and ensure that traffic is well-distributed across partitions.

When your application reaches the limit of what a partition can handle for your workload, Azure Storage begins to return error code 503 (Server Busy) or error code 500 (Operation Timeout) responses. If 503 errors occur, consider modifying your application to use an exponential backoff policy for retries. The exponential backoff decreases the load on the partition and eases spikes in traffic to that partition.
