---
title: Apache Hive View times out from query result - Azure HDInsight
description: Apache Hive View times out when fetching a query result in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 07/30/2019
---

# Scenario: Apache Hive View times out when fetching a query result in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Interactive Query components in Azure HDInsight clusters.

## Issue

When running certain queries from the Apache Hive view, the following error may be encountered:

```
result fetch timed out
java.util.concurrent.TimeoutException: deadline passed
```

## Cause

The Hive View default timeout value may not be suitable for the query you are running. The specified time period is too short for the Hive View to fetch the query result.

## Resolution

1. Increase the Apache Ambari Hive View timeouts by setting the following properties in `/etc/ambari-server/conf/ambari.properties` for **both headnodes**.
  ```
  views.ambari.request.read.timeout.millis=300000
  views.request.read.timeout.millis=300000
  views.ambari.hive.<HIVE_VIEW_INSTANCE_NAME>.result.fetch.timeout=300000
  ```
  The value of `HIVE_VIEW_INSTANCE_NAME` is available at the end of the Hive View URL.

2. Restart the active Ambari server by running the following. If you get an error message saying it's not the active Ambari server, just ssh into the next headnode and repeat this step.
  ```
  sudo ambari-server restart
  ```

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
