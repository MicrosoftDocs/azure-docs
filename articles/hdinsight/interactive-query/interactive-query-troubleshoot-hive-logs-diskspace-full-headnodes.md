---
title: "Troubleshoot: Apache Hive logs fill up disk space - Azure HDInsight"
description: This article provides troubleshooting steps to follow when Apache Hive logs are filling up the disk space on the head nodes in Azure HDInsight.
ms.service: hdinsight
ms.topic: troubleshooting
author: nisgoel
ms.author: nisgoel
ms.reviewer: jasonh
ms.date: 10/05/2020
---

# Scenario: Apache Hive logs are filling up the disk space on the head nodes in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for problems related to insufficient disk space on the head nodes in Azure HDInsight clusters.

## Issue

On an Apache Hive/LLAP cluster, unwanted logs are taking up the entire disk space on the head nodes. This condition could cause the following problems:

- SSH access fails because no space is left on the head node.
- Ambari throws *HTTP ERROR: 503 Service Unavailable*.
- HiveServer2 Interactive fails to restart.

The `ambari-agent` logs will include the following entries when the problem happens:
```
ambari_agent - Controller.py - [54697] - Controller - ERROR - Error:[Errno 28] No space left on device
```
```
ambari_agent - HostCheckReportFileHandler.py - [54697] - ambari_agent.HostCheckReportFileHandler - ERROR - Can't write host check file at /var/lib/ambari-agent/data/hostcheck.result
```

## Cause

In advanced Hive log4j configurations, the current default deletion schedule is to delete files older than 30 days, based on the last-modified date.

## Resolution

1. Go to the Hive component summary on the Ambari portal and select the **Configs** tab.

2. Go to the `Advanced hive-log4j` section in **Advanced settings**.

3. Set the `appender.RFA.strategy.action.condition.age` parameter to an age of your choice. This example will set the age to 14 days: `appender.RFA.strategy.action.condition.age = 14D`

4. If you don't see any related settings, append these settings:
    ```
    # automatically delete hive log
    appender.RFA.strategy.action.type = Delete
    appender.RFA.strategy.action.basePath = ${sys:hive.log.dir}
    appender.RFA.strategy.action.condition.type = IfLastModified
    appender.RFA.strategy.action.condition.age = 30D
    appender.RFA.strategy.action.PathConditions.type = IfFileName
    appender.RFA.strategy.action.PathConditions.regex = hive*.*log.*
    ```

5. Set `hive.root.logger` to `INFO,RFA`, as shown in the following example. The default setting is `DEBUG`, which makes the logs large.

    ```
    # Define some default values that can be overridden by system properties
    hive.log.threshold=ALL
    hive.root.logger=INFO,RFA
    hive.log.dir=${java.io.tmpdir}/${user.name}
    hive.log.file=hive.log
    ```

6. Save the configurations and restart the required components.

## Next steps

[!INCLUDE [troubleshooting next steps](../../includes/hdinsight-troubleshooting-next-steps.md)]
