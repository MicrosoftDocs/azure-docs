---
title: How do I configure the amount of memory and number of cores that a Spark application can use when using Jupyter notebook on HDInsight clusters? | Microsoft Docs
description: Use the Spark troubleshooting guide for solving common Spark problems on Azure HDInsight platform.
keywords: Azure HDInsight, Spark, troubleshooting guide, common problems, application configuration, jupyter notebook
services: Azure HDInsight
documentationcenter: na
author: arijitt
manager: ''
editor: ''

ms.assetid: 38909596-BE85-40E5-AC5A-B9DEE34F5E8B
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/30/2017
ms.author: arijitt
---

### How do I configure the amount of memory and number of cores that a Spark application can use when using Jupyter notebook on HDInsight clusters?

#### Issue:

Need to configure the amount of memory and number of cores that a Spark application can use when using Jupyter notebook on HDInsight clusters. 

1. Refer to the topic [Why did my Spark application fail with OutOfMemoryError?](spark-application-failure-with-outofmemoryerror.md) to determine which Spark configurations need to be set and to what values.

2.  Specify the Spark configurations in valid JSON format in the first cell of the Jupyter notebook after the %%configure directive (change the actual values as applicable): 

![Alt text](../media/spark/spark-application-configuration-through-jupyter/add-configuration-cell.png)

#### Further Reading:

[Spark job submission on HDInsight clusters](https://blogs.msdn.microsoft.com/azuredatalake/2017/01/06/spark-job-submission-on-hdinsight-101/)
