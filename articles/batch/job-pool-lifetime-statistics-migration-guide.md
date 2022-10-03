---
title: Migrate from job and pool lifetime statistics to logs in Azure Batch
description: Learn how to migrate your Batch monitoring approach from using job and pool lifetime statistics API to using logs and plan for feature end of support.
author: harperche
ms.author: harpercheng
ms.service: batch
ms.topic: how-to
ms.date: 08/15/2022
---

# Migrate from job and pool lifetime statistics API to logs in Batch

The Azure Batch lifetime statistics API for jobs and pools will be retired on *April 30, 2023*. Learn how to migrate your Batch monitoring approach from using the lifetime statistics API to using logs.

## About the feature

Currently, you can use API to retrieve lifetime statistics for jobs and pools in Batch. You can use the API to get lifetime statistics for all the jobs and pools in a Batch account or for a specific job or pool. The API collects statistical data from when the Batch account was created until the last time the account was updated or from when a job or pool was created. A customer might use the job and pool lifetime statistics API to help them analyze and evaluate their Batch usage.

To make statistical data available to customers, the Batch service allocates batch pools and schedule jobs with an in-house MapReduce implementation to do a periodic, background rollup of statistics. The aggregation is performed for all Batch accounts, pools, and jobs in each region, regardless of whether a customer needs or queries the stats for their account, pool, or job. The operating cost includes 11 VMs allocated in each region to execute MapReduce aggregation jobs. For busy regions, we had to increase the pool size further to accommodate the extra aggregation load.

The MapReduce aggregation logic was implemented by using legacy code, and no new features are being added or improvised due to technical challenges with legacy code. Still, the legacy code and its hosting repository need to be updated frequently to accommodate increased loads in production and to meet security and compliance requirements. Also, because the API is featured to provide lifetime statistics, the data is growing and demands more storage and performance issues, even though most customers don't use the API. The Batch service currently uses all the compute and storage usage charges that are associated with MapReduce pools and jobs.

## Feature end of support

The lifetime statistics API is designed and maintained to help you troubleshoot your Batch services. However, not many customers actually use the API. The customers who use the API are interested in extracting details for not more than a month. More advanced ways of getting data about logs, pools, and jobs can be collected and used on a need basis by using Azure portal logs, alerts, log export, and other methods.

When the job and pool lifetime statistics API is retired on April 30, 2023, the API will no longer work, and it will return an appropriate HTTP response error code to the client.

## Alternative: Set up logs in the Azure portal

The Azure portal has various options to enable the logs. System logs and diagnostic logs can provide statistical data. For more information, see [Monitor Batch solutions](./monitoring-overview.md).

## FAQs

- Is there an alternate way to view logs for pools and jobs?

   The Azure portal has various options to enable the logs. Specifically, you can view system logs and diagnostic logs. For more information, see [Monitor Batch solutions](./monitoring-overview.md).

- Can I extract logs to my system if the API doesn't exist?

   You can use the Azure portal log feature to extract output and error logs to your workspace. For more information, see [Monitor with Application Insights](./monitor-application-insights.md).

## Next steps

For more information, see [Azure Monitor Logs](../azure-monitor/logs/data-platform-logs.md).
