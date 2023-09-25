---
title: Local HDFS stuck in safe mode on Azure HDInsight cluster
description: Troubleshoot local Apache HDFS stuck in safe mode on Apache cluster in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 07/20/2023
---

# Scenario: Local HDFS stuck in safe mode on Azure HDInsight cluster

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

The local Apache Hadoop Distributed File System (HDFS) is stuck in safe mode on the HDInsight cluster. You receive an error message similar as follows:

```output
hdiuser@spark2:~$ hdfs dfs -D "fs.default.name=hdfs://mycluster/" -mkdir /temp
17/04/05 16:20:52 WARN retry.RetryInvocationHandler: Exception while invoking ClientNamenodeProtocolTranslatorPB.mkdirs over spark2.2oyzcdm4sfjuzjmj5dnmvscjpg.dx.internal.cloudapp.net/10.0.0.22:8020. Not retrying because try once and fail.
org.apache.hadoop.ipc.RemoteException(org.apache.hadoop.hdfs.server.namenode.SafeModeException): Cannot create directory /temp. Name node is in safe mode.
It was turned on manually. Use "hdfs dfsadmin -safemode leave" to turn safe mode off.
        at org.apache.hadoop.hdfs.server.namenode.FSNamesystem.checkNameNodeSafeMode(FSNamesystem.java:1359)
...
mkdir: Cannot create directory /temp. Name node is in safe mode.
```

## Cause

The HDInsight cluster has been scaled down to very few nodes below, or number of nodes is close to the HDFS replication factor.

## Resolution

1. Report on the status of HDFS on the HDInsight cluster with the following command:

    ```bash
    hdfs dfsadmin -D "fs.default.name=hdfs://mycluster/" -report
    ```

1. Check on the integrity of HDFS on the HDInsight cluster with the following command:

    ```bash
    hdiuser@spark2:~$ hdfs fsck -D "fs.default.name=hdfs://mycluster/" /
    ```

1. If determined there are no missing, corrupt or under replicated blocks or those blocks can be ignored run the following command to take the name node out of safe mode:

    ```bash
    hdfs dfsadmin -D "fs.default.name=hdfs://mycluster/" -safemode leave
    ```

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
