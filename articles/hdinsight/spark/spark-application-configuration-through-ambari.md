---
title: How do I configure through Ambari the amount of memory and number of cores that a Spark application can use on HDInsight Spark clusters? | Microsoft Docs
description: Use the Spark troubleshooting guide for solving common Spark problems on Azure HDInsight platform.
keywords: Azure HDInsight, Spark, troubleshooting guide, common problems, application configuration, Ambari
services: Azure HDInsight
documentationcenter: na
author: arijitt
manager: ''
editor: ''

ms.assetid: 25D89586-DE5B-4268-B5D5-CC2CE12207ED
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/30/2017
ms.author: arijitt

---

### How do I configure through Ambari the amount of memory and number of cores that a Spark application can use on HDInsight Spark clusters?

#### Issue:

Need to configure in Ambari the amount of memory and number of cores that a Spark application can use.  

#### Resolution Steps: 

1. Refer to the topic [Why did my Spark application fail with OutOfMemoryError?](spark-application-failure-with-outofmemoryerror.md) to determine which Spark configurations need to be set and to what values.

2. Update configurations whose values are already set in the HDInsight Spark clusters by following the steps below: 

![Alt text](../media/spark/spark-application-configuration-through-ambari/update-configuration-step-1.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/update-configuration-step-2.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/update-configuration-step-3.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/update-configuration-step-4.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/update-configuration-step-5.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/update-configuration-step-6.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/update-configuration-step-7.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/update-configuration-step-8.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/update-configuration-step-9.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/update-configuration-step-10.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/update-configuration-step-11.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/update-configuration-step-12.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/update-configuration-step-13.png)

3. Add configurations whose values are not set in the HDInsight Spark clusters by following the steps below: 

![Alt text](../media/spark/spark-application-configuration-through-ambari/add-configuration-step-1.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/add-configuration-step-2.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/add-configuration-step-3.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/add-configuration-step-4.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/add-configuration-step-5.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/add-configuration-step-6.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/add-configuration-step-7.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/add-configuration-step-8.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/add-configuration-step-9.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/add-configuration-step-10.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/add-configuration-step-11.png)
![Alt text](../media/spark/spark-application-configuration-through-ambari/add-configuration-step-12.png)

Note: These changes are cluster wide but can be overridden at actual Spark job submission time.

#### Further Reading:

[Spark job submission on HDInsight clusters](https://blogs.msdn.microsoft.com/azuredatalake/2017/01/06/spark-job-submission-on-hdinsight-101/)
