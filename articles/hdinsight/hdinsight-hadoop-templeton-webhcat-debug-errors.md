---
title: Understand and resolve WebHCat errors on HDInsight - Azure 
description: Learn how to about common errors returned by WebHCat on HDInsight and how to resolve them.
ms.service: hdinsight
ms.topic: troubleshooting
ms.custom: hdinsightactive
ms.date: 12/07/2022
---

# Understand and resolve errors received from WebHCat on HDInsight

Learn about errors received when using WebHCat with HDInsight, and how to resolve them. WebHCat is used internally by client-side tools such as Azure PowerShell and the Data Lake Tools for Visual Studio.

## What is WebHCat

[WebHCat](https://cwiki.apache.org/confluence/display/Hive/WebHCat) is a REST API for [HCatalog](https://cwiki.apache.org/confluence/display/Hive/HCatalog), a table, and storage management layer for Apache Hadoop. WebHCat is enabled by default on HDInsight clusters, and is used by various tools to submit jobs, get job status, and so on, without logging in to the cluster.

## Modifying configuration

Several of the errors listed in this document occur because a configured maximum has been exceeded. When the resolution step mentions that you can change a value, use Apache Ambari (web or REST API) to modify the value. For more information, see [Manage HDInsight using Apache Ambari](hdinsight-hadoop-manage-ambari.md)

### Default configuration

If the following default values are exceeded, it can degrade WebHCat performance or cause errors:

| Setting | What it does | Default value |
| --- | --- | --- |
| [yarn.scheduler.capacity.maximum-applications][maximum-applications] |The maximum number of jobs that can be active concurrently (pending or running) |10,000 |
| [templeton.exec.max-procs][max-procs] |The maximum number of requests that can be served concurrently |20 |
| [mapreduce.jobhistory.max-age-ms][max-age-ms] |The number of days that job history are retained |seven days |

## Too many requests

**HTTP Status code**: 429

| Cause | Resolution |
| --- | --- |
| You've exceeded the maximum concurrent requests served by WebHCat per minute (default 20) |Reduce your workload to ensure that you don't submit more than the maximum number of concurrent requests or increase the concurrent request limit by modifying `templeton.exec.max-procs`. For more information, see [Modifying configuration](#modifying-configuration) |

## Server unavailable

**HTTP Status code**: 503

| Cause | Resolution |
| --- | --- |
| This status code usually occurs during failover between the primary and secondary HeadNode for the cluster |Wait two minutes, then retry the operation |

## Bad request Content: Couldn't find job

**HTTP Status code**: 400

| Cause | Resolution |
| --- | --- |
| Job details have been cleaned up by the job history cleaner |The default retention period for job history is seven days. The default retention period can be changed by modifying `mapreduce.jobhistory.max-age-ms`. For more information, see [Modifying configuration](#modifying-configuration) |
| Job has been killed because of a failover |Retry job submission for up to two minutes |
| An Invalid job ID was used |Check if the job ID is correct |

## Bad gateway

**HTTP Status code**: 502

| Cause | Resolution |
| --- | --- |
| Internal garbage collection is occurring within the WebHCat process |Wait for garbage collection to finish or restart the WebHCat service |
| Time out waiting on a response from the Resource Manager service. This error can occur when the number of active applications goes the configured maximum (default 10,000) |Wait for currently running jobs to complete or increase the concurrent job limit by modifying `yarn.scheduler.capacity.maximum-applications`. For more information, see the [Modifying configuration](#modifying-configuration) section. |
| Attempting to retrieve all jobs through the [GET /jobs](https://cwiki.apache.org/confluence/display/Hive/WebHCat+Reference+Jobs) call while `Fields` is set to `*` |Don't retrieve *all* job details. Instead use `jobid` to retrieve details for jobs only greater than certain job ID. Or, don't use `Fields` |
| The WebHCat service is down during HeadNode failover |Wait for two minutes and retry the operation |
| There are more than 500 pending jobs submitted through WebHCat |Wait until currently pending jobs have completed before submitting more jobs |

## Next steps

[!INCLUDE [troubleshooting next steps](includes/hdinsight-troubleshooting-next-steps.md)]

[max-procs]: https://cwiki.apache.org/confluence/display/Hive/WebHCat+Configure#WebHCatConfigure-WebHCatConfiguration
