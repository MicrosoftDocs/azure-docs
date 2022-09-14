---
author: Harper Cheng
ms.author: harperche
ms.date: 08/15/2022
---
### Executive Summary

The Azure Batch service currently supports API for Job/Pool to retrieve lifetime statistics. The API is used to get lifetime statistics for all the Pools/Jobs in the specified batch account or for a specified Pool/Job. The API collects the statistical data from when the Batch account was created until the last time updated or entire lifetime of the specified Job/Pool. Job/Pool lifetime statistics API is helpful for customers to analyze and evaluate their usage.

To make the statistical data available for customers, the Batch service allocates batch pools and schedule jobs with an in-house MapReduce implementation to perform background periodic roll-up of statistics. The aggregation is performed for all accounts/pools/jobs in each region, no matter if customer needs or queries the stats for their account/pool/job. The operating cost includes eleven VMs allocated in each region to execute MapReduce aggregation jobs. For busy regions, we had to increase the pool size further to accommodate the extra aggregation load.

The MapReduce aggregation logic was implemented with legacy code, and no new features are being added or improvised due to technical challenges with legacy code. Still, the legacy code and its hosting repo need to be updated frequently to accommodate ever growing load in production and to meet security/compliance requirements. In addition, since the API is featured to provide lifetime statistics, the data is growing and demands more storage and performance issues, even though most customers are not using the API. Batch service currently eats up all the compute and storage usage charges associated with MapReduce pools and jobs.

The purpose of the API is designed and maintained to serve the customer in case of any troubleshooting. However, not many customers use it in real life, and the customers are interested in extracting the details for not more than a month. Now more advanced ways of log/job/pool data can be collected and used on a need basis using Azure portal logs, Alerts, Log export, and other additional methods. Therefore, we will retire Job/Pool Lifetime.

We will retire the Job/Pool Lifetime Statistics API on **30 April 2023**. Once that is complete, we will stop supporting the API. The API will cease to work and will return an appropriate HTTP response error code back to the client.

### FAQ

1. Is there an alternate way to view logs of Pool/Jobs?

    Azure portal has various options to enable the logs, namely system logs, diagnostic logs. Refer [Monitor Batch Solutions](https://docs.microsoft.com/en-us/azure/batch/monitoring-overview) for more information.

2. Can customers extract logs to their system if the API doesn't exist? 

    Azure portal log feature allows every customer to extract the output and error logs to their workspace.Refer [Monitor with Application Insights](https://docs.microsoft.com/en-us/azure/batch/monitor-application-insights) for more information.

