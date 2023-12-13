---
title: Error message not shown in Apache Hive View - Azure HDInsight
description: Query fails in Apache Hive View without any details on Azure HDInsight cluster.
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 07/25/2023
---

# Scenario: Query error message not displayed in Apache Hive View in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Interactive Query components in Azure HDInsight clusters.

## Issue

The Apache Hive View query error message will look something like this, without further information:

```
"Failed to execute query. <a href="#/messages/1">(details)</a>"
```

## Cause

Sometimes the error message of a query failure may be too large to display on the Hive View main page.

## Resolution

Check the Notifications tab on the Top-right corner of the Hive_view to see the complete Stacktrace and Error Message.

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
