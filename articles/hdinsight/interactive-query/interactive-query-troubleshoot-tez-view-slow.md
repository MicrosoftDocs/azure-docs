---
title: Apache Ambari Tez View loads slowly in Azure HDInsight
description: Apache Ambari Tez View may load slowly or may not load at all in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 06/07/2023
---

# Scenario: Apache Ambari Tez View loads slowly in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Interactive Query components in Azure HDInsight clusters.

## Issue

Apache Ambari Tez View may load slowly or may not load at all. When loading Ambari Tez View, you may see processes on Headnodes becoming unresponsive.

## Cause

Accessing Yarn ATS APIs may sometimes have poor performance on clusters created before Oct 2017 when the cluster has large number of Hive jobs run on it.

## Resolution

This is an issue that has been fixed in Oct 2017. Recreating your cluster will make it not run into this problem again.

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
