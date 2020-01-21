---
title: Exception when running queries from Apache Ambari Hive View in Azure HDInsight
description: Troubleshooting steps when running Apache Hive queries through Apache Ambari Hive View in Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 12/23/2019
---

# Exception when running queries from Apache Ambari Hive View in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

When running an Apache Hive query from Apache Ambari Hive View, you receive the following error message intermittently:

```error
Cannot create property 'errors' on string '<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<title>IIS 8.5 Detailed Error - 502.3 - Bad Gateway</title>
```

## Cause

A Gateway timeout.

The Gateway timeout value is 2 minutes. Queries from Ambari Hive View are submitted to the `/hive2` endpoint through the gateway. Once the query is successfully compiled and accepted, the HiveServer returns a `queryid`. Clients then keep polling for the status of the query. During this process, if the HiveServer doesn't return an HTTP response within 2 minutes, the HDI Gateway throws a 502.3 Gateway timeout error to the caller. The errors could happen when the query is submitted for processing (more likely) and also in the get status call (less likely). Users could see either of them.

The http handler thread is supposed to be quick: prepare the job and return a `queryid`. However, due to several reasons, all the handler threads could be busy resulting in timeouts for new queries and the get status calls.

### Responsibilities of the HTTP handler thread

When the client submits a query to HiveServer, it does the following in the foreground thread:

* Parse the request, do semantic verification
* Acquire lock
* Metastore lookup if necessary
* Compile the query (DDL or DML)
* Prepare a query plan
* Perform authorization (Run all applicable ranger policies in secure clusters)

## Resolution

Some general recommendations to you to improve the situation:

* If using an external hive metastore, check the DB metrics and make sure that the database isn't overloaded. Consider scaling the metastore database layer.

* Ensure that parallel ops is turned on (this enables the HTTP handler threads to run in parallel). To verify the value, launch [Apache Ambari](../hdinsight-hadoop-manage-ambari.md) and navigate to **Hive** > **Configs** > **Advanced** > **Custom hive-site**. The value for `hive.server2.parallel.ops.in.session` should be `true`.

* Ensure that the cluster's VM SKU isn't too small for the load. Consider to splitting the work among multiple clusters. For more information, see [Choose a cluster type](../hdinsight-capacity-planning.md#choose-a-cluster-type).

* If Ranger is installed on the cluster, please check if there are too many Ranger policies that need to be evaluated for each query. Look for duplicate or unneeded policies.

* Check the **HiveServer2 Heap Size** value from Ambari. Navigate to **Hive** > **Configs** > **Settings** > **Optimization**. Make sure the value is larger than 10 GB. Adjust as needed to optimize performance.

* Ensure the Hive query is well tuned. For more information, see [Optimize Apache Hive queries in Azure HDInsight](../hdinsight-hadoop-optimize-hive-query.md).

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
