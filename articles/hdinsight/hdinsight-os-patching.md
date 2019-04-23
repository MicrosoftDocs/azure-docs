---
title: Configure OS patching schedule for Linux-based HDInsight clusters - Azure
description: Learn how to configure OS patching schedule for Linux-based HDInsight clusters.
author: omidm1
ms.author: omidm
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 01/24/2019
---
# OS patching for HDInsight 

> [!IMPORTANT]
> Ubuntu images become available for new HDInsight cluster creation within 3 months of being published. As of January 2019, running clusters are **not** auto-patched. Customers must use script actions or other mechanisms to patch a running cluster. Newly created clusters will always have the latest available updates, including the most recent security patches.

## How to configure the OS patching schedule for Linux-based HDInsight clusters
The virtual machines in an HDInsight cluster need to be rebooted occasionally so that important security patches can be installed. 

Using the script action described in this article, you can modify the OS patching schedule as follows:
1. Enable or disable automatic reboots
2. Set the frequency of reboots (days between reboots)
3. Set the day of the week when a reboot occurs

> [!NOTE]  
> This script action will only work with Linux-based HDInsight clusters created after August 1st, 2016. Patches will be effective only when VMs are rebooted. 

## How to use the script 

When using this script requires the following information:
1. The script location: https://hdiconfigactions.blob.core.windows.net/linuxospatchingrebootconfigv01/os-patching-reboot-config.sh.
 	HDInsight uses this URI to find and run the script on all the virtual machines in the cluster.
  
2. The cluster node types that the script is applied to: headnode, workernode, zookeeper. This script must be applied to all node types in the cluster. If it is not applied to a node type, then the virtual machines for that node type will continue to use the previous patching schedule.


3.  Parameter: This script accepts three numeric parameters:

    | Parameter | Definition |
    | --- | --- |
    | Enable/disable automatic reboots |0 or 1. A value of 0 disables automatic reboots while 1 enables automatic reboots. |
    | Frequency |7 to 90 (inclusive). The number of days to wait before rebooting the virtual machines for patches that require a reboot. |
    | Day of week |1 to 7 (inclusive). A value of 1 indicates the reboot should occur on a Monday, and 7 indicates a Sunday.For example, using parameters of 1 60 2 results in automatic reboots every 60 days (at most) on Tuesday. |
    | Persistence |When applying a script action to an existing cluster, you can mark the script as persisted. Persisted scripts are applied when new workernodes are added to the cluster through scaling operations. |

> [!NOTE]  
> You must mark this script as persisted when applying to an existing cluster. Otherwise, any new nodes created through scaling operations will use the default patching schedule.  If you apply the script as part of the cluster creation process, it is persisted automatically.

## Next steps

For specific steps on using the script action, see the following sections in the [Customize Linux-based HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md):

* [Use a script action during cluster creation](hdinsight-hadoop-customize-cluster-linux.md#use-a-script-action-during-cluster-creation)
* [Apply a script action to a running cluster](hdinsight-hadoop-customize-cluster-linux.md#apply-a-script-action-to-a-running-cluster)
