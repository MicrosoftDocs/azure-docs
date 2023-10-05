---
title: Apache Ambari UI shows down hosts and services in Azure HDInsight
description: Troubleshooting an Apache Ambari UI issue when it shows down hosts and services in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 05/10/2023
---

# Scenario: Apache Ambari UI shows down hosts and services in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

Apache Ambari UI is accessible, but the UI shows almost all services are down, all hosts showing heartbeat lost.

## Cause

In most scenarios, this is an issue with Ambari server not running on the active headnode. Check which headnode is the active headnode and make sure your ambari-server runs on the right one. Don't manually start ambari-server, let failover controller service be responsible for starting ambari-server on the right headnode. Reboot the active headnode to force a failover.

Networking issues can also cause this problem. From each cluster node, see if you can ping `headnodehost`. There is a rare situation where no cluster node can connect to `headnodehost`:

```
$>telnet headnodehost 8440
... No route to host
```

## Resolution

Usually rebooting the active headnode will mitigate this issue. If not please contact HDInsight support team.

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
