---
title: Apache Ambari UI 502 error in Azure HDInsight
description: Apache Ambari UI 502 error when you try to access your Azure HDInsight cluster
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 05/10/2023
---

# Scenario: Apache Ambari UI 502 error in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

When you try to access the Apache Ambari UI for your HDInsight cluster, you get a message similar to: "502 - Web server received an invalid response while acting as a gateway or proxy server."

## Cause

In general, the HTTP 502 status code means that Ambari server is not running correctly on the active headnode. There are a few possible root causes.

## Resolution

In most of the cases, to mitigate the problem, you can restart the active headnode. Or choose a larger VM size for your headnode.

### Ambari server failed to start

You can check ambari-server logs to find out why Ambari server failed to start. One common reason is the database consistency check error. You can find this out in this log file: `/var/log/ambari-server/ambari-server-check-database.log`.

If you made any modifications to the cluster node, please undo them. Always use Ambari UI to modify any Hadoop/Spark related configurations.

### Ambari server taking 100% CPU utilization

In rare situations, we’ve seen ambari-server process has close to 100% CPU utilization constantly. As a mitigation, you can ssh to the active headnode, and kill the Ambari server process and start it again.

```bash
ps -ef | grep AmbariServer
top -p <ambari-server-pid>
kill -9 <ambari-server-pid>
service ambari-server start
```

### Ambari server killed by oom-killer

In some scenarios, your headnode runs out of memory, and the Linux oom-killer starts to pick processes to kill. You can verify this situation by searching the AmbariServer process ID, which should not be found. Then look at your `/var/log/syslog`, and look for something like this:

```
Jul 27 15:29:30 xxx-xxxxxx kernel: [874192.703153] java invoked oom-killer: gfp_mask=0x23201ca, order=0, oom_score_adj=0
```

Then identify which processes are taking memories and try to further root cause.

### Other issues with Ambari server

Rarely the Ambari server cannot handle the incoming request, you can find more info by looking at the ambari-server logs for any error. One such case is an error like this:

```
Error Processing URI: /api/v1/clusters/xxxxxx/host_components - (java.lang.OutOfMemoryError) Java heap space
```

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
