---
title: Understand and resolve WebHCat errors on HDInsight - Azure 
description: Learn how to about common errors returned by WebHCat on HDInsight and how to resolve them.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/16/2018
ms.author: jasonh

---
# Understand and resolve errors received from WebHCat on HDInsight

Learn about errors received when using WebHCat with HDInsight, and how to resolve them. WebHCat is used internally by client-side tools such as Azure PowerShell and the Data Lake Tools for Visual Studio.

## What is WebHCat

[WebHCat](https://cwiki.apache.org/confluence/display/Hive/WebHCat) is a REST API for [HCatalog](https://cwiki.apache.org/confluence/display/Hive/HCatalog), a table, and storage management layer for Hadoop. WebHCat is enabled by default on HDInsight clusters, and is used by various tools to submit jobs, get job status, etc. without logging in to the cluster.

## Modifying configuration

> [!IMPORTANT]
> Several of the errors listed in this document occur because a configured maximum has been exceeded. When the resolution step mentions that you can change a value, you must use one of the following to perform the change:

* For **Windows** clusters: Use a script action to configure the value during cluster creation. For more information, see [Develop script actions](hdinsight-hadoop-script-actions.md).

* For **Linux** clusters: Use Ambari (web or REST API) to modify the value. For more information, see [Manage HDInsight using Ambari](hdinsight-hadoop-manage-ambari.md)

> [!IMPORTANT]
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdinsight-windows-retirement).

### Default configuration

If the following default values are exceeded, it can degrade WebHCat performance or cause errors:

| Setting | What it does | Default value |
| --- | --- | --- |
| [yarn.scheduler.capacity.maximum-applications][maximum-applications] |The maximum number of jobs that can be active concurrently (pending or running) |10,000 |
| [templeton.exec.max-procs][max-procs] |The maximum number of requests that can be served concurrently |20 |
| [mapreduce.jobhistory.max-age-ms][max-age-ms] |The number of days that job history are retained |7 days |

## Too many requests

**HTTP Status code**: 429

| Cause | Resolution |
| --- | --- |
| You have exceeded the maximum concurrent requests served by WebHCat per minute (default 20) |Reduce your workload to ensure that you do not submit more than the maximum number of concurrent requests or increase the concurrent request limit by modifying `templeton.exec.max-procs`. For more information, see [Modifying configuration](#modifying-configuration) |

## Server unavailable

**HTTP Status code**: 503

| Cause | Resolution |
| --- | --- |
| This status code usually occurs during failover between the primary and secondary HeadNode for the cluster |Wait two minutes, then retry the operation |

## Bad request Content: Could not find job

**HTTP Status code**: 400

| Cause | Resolution |
| --- | --- |
| Job details have been cleaned up by the job history cleaner |The default retention period for job history is 7 days. The default retention period can be changed by modifying `mapreduce.jobhistory.max-age-ms`. For more information, see [Modifying configuration](#modifying-configuration) |
| Job has been killed due to a failover |Retry job submission for up to two minutes |
| An Invalid job id was used |Check if the job id is correct |

## Bad gateway

**HTTP Status code**: 502

| Cause | Resolution |
| --- | --- |
| Internal garbage collection is occurring within the WebHCat process |Wait for garbage collection to finish or restart the WebHCat service |
| Time out waiting on a response from the ResourceManager service. This error can occur when the number of active applications goes the configured maximum (default 10,000) |Wait for currently running jobs to complete or increase the concurrent job limit by modifying `yarn.scheduler.capacity.maximum-applications`. For more information, see the [Modifying configuration](#modifying-configuration) section. |
| Attempting to retrieve all jobs through the [GET /jobs](https://cwiki.apache.org/confluence/display/Hive/WebHCat+Reference+Jobs) call while `Fields` is set to `*` |Do not retrieve *all* job details. Instead use `jobid` to retrieve details for jobs only greater than certain job id. Or, do not use `Fields` |
| The WebHCat service is down during HeadNode failover |Wait for two minutes and retry the operation |
| There are more than 500 pending jobs submitted through WebHCat |Wait until currently pending jobs have completed before submitting more jobs |

[maximum-applications]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.3/bk_system-admin-guide/content/setting_application_limits.html
[max-procs]: https://cwiki.apache.org/confluence/display/Hive/WebHCat+Configure#WebHCatConfigure-WebHCatConfiguration
[max-age-ms]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.0.6.0/ds_Hadoop/hadoop-mapreduce-client/hadoop-mapreduce-client-core/mapred-default.xml
