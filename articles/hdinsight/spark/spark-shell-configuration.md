---
title: How do I configure the amount of memory and number of cores that spark-shell can use at launch time on HDInsight Spark clusters? | Microsoft Docs
description: Use the Spark troubleshooting guide for solving common Spark problems on Azure HDInsight platform.
keywords: Azure HDInsight, Spark, troubleshooting guide, common problems, application configuration, spark-shell
services: Azure HDInsight
documentationcenter: na
author: arijitt
manager: ''
editor: ''

ms.assetid: 0DBF3DBF-FD6C-4F87-A8AE-7F1D74B094A2
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/30/2017
ms.author: arijitt
---

### How do I configure the amount of memory and number of cores that spark-shell can use at launch time on HDInsight Spark clusters?

#### Issue: Need to configure the amount of memory and number of cores that spark-shell can use. 

#### Resolution Steps:  

1. Refer to the topic [Why did my Spark application fail with OutOfMemoryError?](spark-application-failure-with-outofmemoryerror.md) to determine which Spark configurations need to be set and to what values. 

2. Launch spark-shell with a command similar to below (change the actual value of the configurations as applicable): 

~~~~
spark-shell --num-executors 4 --executor-memory 4g --executor-cores 2 --driver-memory 8g --driver-cores 4
~~~~

#### Further Reading:

[Spark job submission on HDInsight clusters](https://blogs.msdn.microsoft.com/azuredatalake/2017/01/06/spark-job-submission-on-hdinsight-101/)
