---
title: Troubleshoot Hive logs fill up disk space Azure HDInsight
description: This article provides troubleshooting steps to follow when Apache Hive logs are filling up the disk space on the head nodes in Azure HDInsight.
ms.service: hdinsight
ms.topic: troubleshooting
author: reachnijel
ms.author: nijelsf
ms.date: 09/18/2023
---

# Scenario: Apache Hive logs are filling up the disk space on the head nodes in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for problems related to insufficient disk space on the head nodes in Azure HDInsight clusters.

## Issue

In an HDI 4.0 Apache Hive/LLAP cluster, unwanted logs are taking up the entire disk space on the head nodes. This condition could cause the following problems:

- SSH access fails because no space is left on the head node.
- HiveServer2 Interactive fails to restart.

## Cause

Automatic hive log deletion is not configured in the advanced hive-log4j2 configurations. The default size limit of 60-GB takes too much space for the customer's usage pattern. By default, the number of logs kept is defined by this equation `MB logs/day = appender.RFA.strategy.max * 10MB`.

## Resolution

1. Go to the Hive component summary on the Ambari portal and select the **Configs** tab.

2. Go to the `Advanced hive-log4j2` section in **Advanced settings**.
    - Optionally, you can lower the value of `appender.RFA.strategy.max` to decrease the total megabytes of logs kept in a day.
3. Make sure you have these settings. If you don't see any related settings, append these settings:
    ```
    # automatically delete hive log
    appender.RFA.strategy.action.type = Delete
    appender.RFA.strategy.action.basePath = ${sys:hive.log.dir}
    appender.RFA.strategy.action.condition.type = IfFileName
    appender.RFA.strategy.action.condition.regex = hive*.*log.*
    appender.RFA.strategy.action.condition.nested_condition.type = IfAny
    # Deletes logs based on total accumulated size, keeping the most recent
    appender.RFA.strategy.action.condition.nested_condition.fileSize.type = IfAccumulatedFileSize
    appender.RFA.strategy.action.condition.nested_condition.fileSize.exceeds = 60GB
    # Deletes logs IfLastModified date is greater than number of days
    #appender.RFA.strategy.action.condition.nested_condition.lastMod.type = IfLastModified
    #appender.RFA.strategy.action.condition.nested_condition.lastMod.age = 30D
    ```

4. Go through three basic options with deletion based on:
- **Total Size**
    - Change `appender.RFA.strategy.action.condition.nested_condition.fileSize.exceeds` to a size limit of your choice.

- **Date**
    - You also can uncomment and switch the conditions. Then change `appender.RFA.strategy.action.condition.nested_condition.lastMod.age` to an age of your choice.

    ```
    # Deletes logs based on total accumulated size, keeping the most recent 
    #appender.RFA.strategy.action.condition.nested_condition.fileSize.type = IfAccumulatedFileSize 
    #appender.RFA.strategy.action.condition.nested_condition.fileSize.exceeds = 60GB
    # Deletes logs IfLastModified date is greater than number of days 
    appender.RFA.strategy.action.condition.nested_condition.lastMod.type = IfLastModified 
    appender.RFA.strategy.action.condition.nested_condition.lastMod.age = 30D
    ```

- **Combination of Total Size and Date**
    - You can combine both options by uncommenting. The log4j2 will then behave as so: Start deleting logs when either condition is met.
    
    ```
    # Deletes logs based on total accumulated size, keeping the most recent 
    appender.RFA.strategy.action.condition.nested_condition.fileSize.type = IfAccumulatedFileSize 
    appender.RFA.strategy.action.condition.nested_condition.fileSize.exceeds = 60GB
    # Deletes logs IfLastModified date is greater than number of days 
    appender.RFA.strategy.action.condition.nested_condition.lastMod.type = IfLastModified 
    appender.RFA.strategy.action.condition.nested_condition.lastMod.age = 30D
    ```
5. Save the configurations and restart the required components.

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
