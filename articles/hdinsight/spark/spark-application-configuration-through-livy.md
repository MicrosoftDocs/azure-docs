---
title: 
How do I configure at submit time through LIVY the amount of memory and number of cores that a Spark application can use on HDInsight clusters? | Microsoft Docs
description: Use the Spark troubleshooting guide for solving common Spark problems on Azure HDInsight platform.
keywords: Azure HDInsight, Spark, troubleshooting guide, common problems, application configuration, livy submission, remote submission
services: Azure HDInsight
documentationcenter: na
author: arijitt
manager: ''
editor: ''

ms.assetid: D7D9AE44-2C92-484F-8032-3F4CA8A223A3
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/30/2017
ms.author: arijitt
---

### How do I configure at submit time through LIVY the amount of memory and number of cores that a Spark application can use on HDInsight clusters?

#### Issue:

Need to configure at submit time through LIVY, the amount of memory and number of cores that a Spark application can use on HDInsight clusters. 

1. Refer to the topic [Why did my Spark application fail with OutOfMemoryError?](spark-application-failure-with-outofmemoryerror.md) to determine which Spark configurations need to be set and to what values.

2. Submit the Spark application to LIVY using a REST client like CURL with a command similar to below (change the actual values as applicable):

~~~~
curl -k --user 'username:password' -v -H 'Content-Type: application/json' -X POST -d '{ "file":"wasb://container@storageaccountname.blob.core.windows.net/example/jars/sparkapplication.jar", "className":"com.microsoft.spark.application", "numExecutors":4, "executorMemory":"4g", "executorCores":2, "driverMemory":"8g", "driverCores":4}'  
~~~~

#### Further Reading:

[Spark job submission on HDInsight clusters](https://blogs.msdn.microsoft.com/azuredatalake/2017/01/06/spark-job-submission-on-hdinsight-101/)
