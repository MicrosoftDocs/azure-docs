---
title: Pegged CPU in Apache HBase cluster - Azure HDInsight
description: Troubleshoot pegged CPU on region server in Apache HBase cluster in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 12/26/2022
---

# Scenario: Pegged CPU on region server in Apache HBase cluster in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

Apache HBase region server process starts occupying close to 200% CPU, causing alerts to fire on HBase Master process and cluster to not function at full capacity.

## Cause

If you are running HBase cluster v3.4, you might have been hit by a potential bug caused by upgrade of jdk to version 1.7.0_151. The symptom we see is region server process starts occupying close to 200% CPU. To verify this, run the `top` command; if there is a process occupying close to 200% CPU get its pid and confirm it is region server process by running `ps -aux | grep`.

## Resolution

1. Install jdk 1.8 on ALL nodes of the cluster as below:

    * Run the script action `https://raw.githubusercontent.com/Azure/hbase-utils/master/scripts/upgradetojdk18allnodes.sh`. Be sure to select the option to run on all nodes.

    * Alternatively, you can sign in to every individual node and run the command `sudo add-apt-repository ppa:openjdk-r/ppa -y && sudo apt-get -y update && sudo apt-get install -y openjdk-8-jdk`.

1. Go to Ambari UI - `https://<clusterdnsname>.azurehdinsight.net`.

1. Navigate  to **HBase->Configs->Advanced->Advanced** `hbase-env configs` and change the variable `JAVA_HOME` to `export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64`. Save the config change.

1. [Optional but recommended] [Flush all tables on cluster](/archive/blogs/azuredatalake/hdinsight-hbase-how-to-improve-hbase-cluster-restart-time-by-flushing-tables).

1. From Ambari UI again, restart all HBase services that need restart.

1. Depending on the data on cluster, it might take a few minutes to up to an hour for the cluster to reach stable state. The way you confirm the cluster reaches stable state is by either checking HMaster UI (all region servers should be active) from Ambari (refresh) or from headnode run HBase shell and then run status command.

To verify that your upgrade was successful, check that the relevant HBase processes are started using the appropriate Java version - for instance for region server check as:

```
ps -aux | grep regionserver, and verify the version like '''/usr/lib/jvm/java-8-openjdk-amd64/bin/java
```

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
