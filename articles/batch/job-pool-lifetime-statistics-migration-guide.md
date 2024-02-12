---
title: Migrate from job and pool lifetime statistics to logs in Azure Batch
description: Learn how to migrate your Batch monitoring approach from using job and pool lifetime statistics API to using logs and plan for feature end of support.
author: harperche
ms.author: harpercheng
ms.service: batch
ms.topic: how-to
ms.date: 10/06/2022
---

# Migrate from job and pool lifetime statistics API to logs in Batch

The Azure Batch lifetime statistics API for jobs and pools will be retired on *April 30, 2023*. Learn how to migrate your Batch monitoring approach from using the lifetime statistics API to using logs.

## About the feature

Currently, you can use API to retrieve lifetime statistics for jobs and pools in Batch. The API collects statistical data from when the Batch account was created for all jobs and pools created for the lifetime of the Batch account.

To make statistical data available to customers, the Batch service performs aggregation and roll-ups on a periodic basis. Due to these lifetime stats APIs being rarely exercised by Batch customers, these APIs are being retired as alternatives exist.

## Feature end of support

The lifetime statistics API is designed and maintained to help you gather information about usage of your Batch pools and jobs across the lifetime of your Batch account. Alternatives exist to gather data at a fine-grained level on a [per job](/rest/api/batchservice/job/get#jobstatistics) or [per pool](/rest/api/batchservice/pool/get#poolstatistics) basis. Only the lifetime statistics APIs are being retired.

When the job and pool lifetime statistics API is retired on April 30, 2023, the API will no longer work, and it will return an appropriate HTTP response error code to the client.

## Alternatives

### Aggregate with per job or per pool statistics

You can get statistics for any active job or pool in a Batch account. For jobs, you can issue a [Get Job](/rest/api/batchservice/job/get) request and view the [JobStatistics object](/rest/api/batchservice/job/get#jobstatistics). For pools, you can issue a [Get Pool](/rest/api/batchservice/pool/get) request and view the [PoolStatistics object](/rest/api/batchservice/pool/get#poolstatistics). You'll then be able to use these results and aggregate as needed across jobs and pools that are relevant for your analysis workflow.

### Set up logs in the Azure portal

The Azure portal has various options to enable monitoring and logs. System logs and diagnostic logs can provide statistical data with custom solutions. For more information, see [Monitor Batch solutions](./monitoring-overview.md).

## FAQs

- Is there an alternate way to view logs for pools and jobs?

   The Azure portal has various options to enable the logs. Specifically, you can view system logs and diagnostic logs. For more information, see [Monitor Batch solutions](./monitoring-overview.md).

- Can I extract logs to my system if the API doesn't exist?

   You can use the Azure portal log feature to extract output and error logs to your workspace. For more information, see [Monitor with Application Insights](./monitor-application-insights.md).

## Next steps

For more information, see the Batch [Job](/rest/api/batchservice/job) or [Pool](/rest/api/batchservice/pool) API. For Azure Monitor logs, see [this article](../azure-monitor/logs/data-platform-logs.md).
