---
title: Apache Hive Zeppelin Interpreter error - Azure HDInsight
description: The Apache Zeppelin Hive JDBC Interpreter is pointing to the wrong URL in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 05/11/2023
---

# Scenario: Apache Hive Zeppelin Interpreter gives a Zookeeper error in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Interactive Query components in Azure HDInsight clusters.

## Issue

On an Apache Hive LLAP cluster, the Zeppelin interpreter gives the following error message when attempting to execute a query:

```
java.sql.SQLException: org.apache.hive.jdbc.ZooKeeperHiveClientException: Unable to read HiveServer2 configs from ZooKeeper
```

## Cause

The Zeppelin Hive JDBC Interpreter is pointing to the wrong URL.

## Resolution

1. Navigate to the Hive component summary and copy the "Hive JDBC Url" to the clipboard.

1. Navigate to `https://clustername.azurehdinsight.net/zeppelin/#/interpreter`

1. Edit the JDBC settings: update the hive.url value to the Hive JDBC URL copied in step 1

1. Save, then retry the query

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
