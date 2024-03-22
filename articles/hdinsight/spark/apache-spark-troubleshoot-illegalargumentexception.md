---
title: IllegalArgumentException error for Apache Spark - Azure HDInsight
description: IllegalArgumentException for Apache Spark activity in Azure HDInsight for Azure Data Factory 
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 09/19/2023
---

# Scenario: IllegalArgumentException for Apache Spark activity in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Apache Spark components in Azure HDInsight clusters.

## Issue

You receive the following exception when trying to execute a Spark activity in an Azure Data Factory pipeline:

```error
Exception in thread "main" java.lang.IllegalArgumentException:
Wrong FS: wasbs://additional@xxx.blob.core.windows.net/spark-examples_2.11-2.1.0.jar, expected: wasbs://wasbsrepro-2017-11-07t00-59-42-722z@xxx.blob.core.windows.net
```

## Cause

A Spark job fails if the application jar file is not located in the Spark cluster’s default/primary storage.

This is a known issue with the Spark open-source framework tracked in this bug: [Spark job fails if fs.defaultFS and application jar are different url](https://issues.apache.org/jira/browse/SPARK-22587).

This issue has been resolved in Spark 2.3.0.

## Resolution

Make sure the application jar is stored on the default/primary storage for the HDInsight cluster. In Azure Data Factory, make sure the ADF linked service is pointed to the HDInsight default container rather than a secondary container.

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
