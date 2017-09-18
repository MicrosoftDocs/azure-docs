---
title: Configure OS patching schedule for Linux-based HDInsight clusters - Azure | Microsoft Docs
description: Learn how to configure OS patching schedule for Linux-based HDInsight clusters.
services: hdinsight
documentationcenter: ''
author: bprakash
manager: asadk
editor: bprakash

ms.assetid: 
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 03/21/2017
ms.author: bhanupr

---

# OS patching for HDInsight 
As a managed Hadoop service, HDInsight takes care of patching the OS of the underlying VMs used by HDInsight clusters. As of August 1, 2016, we have changed the guest OS patching policy for Linux-based HDInsight clusters (version 3.4 or greater). The goal of the new policy is to significantly reduce the number of reboots due to patching. The new policy will continue to patch virtual machines (VMs) on Linux clusters every Monday or Thursday starting at 12AM UTC in a staggered fashion across nodes in any given cluster. However, any given VM will only reboot at most once every 30 days due to guest OS patching. In addition, the first reboot for a newly created cluster will not happen sooner than 30 days from the cluster creation date. Patches will be effective once the VMs are rebooted.

## How to configure the OS patching schedule for Linux-based HDInsight clusters
The virtual machines in an HDInsight cluster need to be rebooted occasionally so that important security patches can be installed. As of August 1, 2016, new Linux-based HDInsight clusters (version 3.4 or greater,) are rebooted using the following schedule:

1. A virtual machine in the cluster can only reboot for patches at most, once within a 30-day period.
2. The reboot occurs starting at 12AM UTC.
3. The reboot process is staggered across virtual machines in the cluster, so the cluster is still available during the reboot process.
4. The first reboot for a newly created cluster will not happen sooner than 30 days after the cluster creation date.

Using the script action described in this article, you can modify the OS patching schedule as follows:
1. Enable or disable automatic reboots
2. Set the frequency of reboots (days between reboots)
3. Set the day of the week when a reboot occurs

> [!NOTE]
> This script action will only work with Linux-based HDInsight clusters created after August 1st, 2016. Patches will be effective only when VMs are rebooted. 
>

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
> You must mark this script as persisted when applying to an existing cluster. Otherwise, any new nodes created through scaling      operations will use the default patching schedule.
 	If you apply the script as part of the cluster creation process, it is persisted automatically.
>

## Next steps

For specific steps on using the script action, see the following sections in the [Customize Linuz-based HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md):

* [Use a script action during cluster creation](hdinsight-hadoop-customize-cluster-linux.md#use-a-script-action-during-cluster-creation)
* [Apply a script action to a running cluster](hdinsight-hadoop-customize-cluster-linux.md#apply-a-script-action-to-a-running-cluster)
