---
title: Migrate from job pool lifetime statistics to logs in Azure Batch
description: Learn how to migrate from job pool lifetime statistics to logs in Azure Batch and prepare for feature end of support.
author: harperche
ms.author: harpercheng
ms.service: batch
ms.topic: how-to
ms.date: 08/15/2022
---

# Migrate from job pool lifetime statistics to logs in Batch (feature retirement)

Job/Pool Lifetime Statistics API will be retired on **30 April 2023**. Once complete, the API will no longer work and will return an appropriate HTTP response error code back to the client.

The Azure Batch service currently supports API for Job/Pool to retrieve lifetime statistics. The API is used to get lifetime statistics for all the Pools/Jobs in the specified batch account or for a specified Pool/Job. The API collects the statistical data from when the Batch account was created until the last time updated or entire lifetime of the specified Job/Pool. Job/Pool lifetime statistics API is helpful for customers to analyze and evaluate their usage.

To make the statistical data available for customers, the Batch service allocates batch pools and schedule jobs with an in-house MapReduce implementation to perform background periodic roll-up of statistics. The aggregation is performed for all accounts/pools/jobs in each region, no matter if customer needs or queries the stats for their account/pool/job. The operating cost includes 11 VMs allocated in each region to execute MapReduce aggregation jobs. For busy regions, we had to increase the pool size further to accommodate the extra aggregation load.

The MapReduce aggregation logic was implemented with legacy code, and no new features are being added or improvised due to technical challenges with legacy code. Still, the legacy code and its hosting repo need to be updated frequently to accommodate ever growing load in production and to meet security/compliance requirements. In addition, since the API is featured to provide lifetime statistics, the data is growing and demands more storage and performance issues, even though most customers aren't using the API. The Batch service currently uses all the compute and storage usage charges associated with MapReduce pools and jobs.

## End of support for job pool lifetime statistics

The purpose of the API is designed and maintained to serve the customer in troubleshooting. However, not many customers use it in real life, and the customers are interested in extracting the details for not more than a month. Now more advanced ways of log/job/pool data can be collected and used on a need basis using Azure portal logs, Alerts, Log export, and other methods. Therefore, we're retiring the Job/Pool Lifetime.

Job/Pool Lifetime Statistics API will be retired on **30 April 2023**. Once complete, the API will no longer work and will return an appropriate HTTP response error code back to the client.

## Set up logs in the Azure portal

The Azure portal has various options to enable the logs. Specifically, you can view system logs and diagnostic logs. For more information, see [Monitor Batch solutions](./monitoring-overview.md).

## FAQs

- Is there an alternate way to view logs of pools and jobs?

   The Azure portal has various options to enable the logs. Specifically, you can view system logs and diagnostic logs. For more information, see [Monitor Batch solutions](./monitoring-overview.md).

- Can I extract logs to my system if the API doesn't exist?

   The Azure portal log feature allows every customer to extract the output and error logs to their workspace. For more information, see [Monitor with Application Insights](./monitor-application-insights.md).

## Next steps

For more information, see [Azure Monitor Logs](../azure-monitor/logs/data-platform-logs.md).
