---
title: Configure the OS patching schedule for Linux-based HDInsight clusters
description: Learn how to configure OS patching schedule for Linux-based HDInsight clusters.
author: omidm1
ms.author: omidm
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 01/24/2019
---
# Configure the OS patching schedule for Linux-based HDInsight clusters 

> [!IMPORTANT]
> Ubuntu images become available for new HDInsight cluster creation within three months of being published. As of January 2019, running clusters aren't auto-patched. Customers must use script actions or other mechanisms to patch a running cluster. Newly created clusters will always include the latest available updates, including the most recent security patches.

## Modify the OS patching schedule
You must occasionally restart virtual machines (VMs) in an HDInsight cluster to install important security patches.

By using the script actions described in this article, you can modify the OS patching schedule by following these steps:

1. Install all updates, kernel + security updates, or kernel updates only.
2. Do an immediate restart, or schedule a restart on the VM.

> [!NOTE]  
> The script actions described in this article will work only with Linux-based HDInsight clusters created after August 1, 2016. Patches are effective only after restarting VMs.
> Script actions won't automatically apply updates for all future update cycles. Run the scripts each time new updates must be applied to install the updates, and then restart the VM.

## How to use script actions

Using script actions requires the following information:

1. The install-updates-schedule-restarts script location: https://hdiconfigactions.blob.core.windows.net/linuxospatchingrestartconfigv02/install-updates-schedule-restarts.sh.
 	
   HDInsight uses the previous Uniform Resource Identifier (URI) to find and run the script on all the VMs in the cluster. This script provides options to install updates and restart the VM.
  
2. The schedule-restarts script location: https://hdiconfigactions.blob.core.windows.net/linuxospatchingrestartconfigv02/schedule-restarts.sh.
 	
   HDInsight uses the previous URI to find and run the script on all the VMs in the cluster. This script restarts the VM.
  
3. The cluster node types that the script is applied to are headnode, workernode, and zookeeper. You must apply the script to all node types in the cluster. If the script isn't applied to a node type, then the VMs for that node type won't be updated or restarted.

4. The install-updates-schedule-restarts script accepts two numeric parameters:

    | Parameter | Definition |
    | --- | --- |
    | Install only kernel updates/Install all updates/Install only kernel + security updates |0,  1, or 2. A value of 0 installs only kernel updates, while 1 installs all updates, and 2 installs only kernel + security updates. If no parameter is provided, the default is 0. |
    | No restart/Enable schedule restart/Enables immediate restart |0, 1, or 2. A value of 0 disables restart, while 1 enables schedule restart and 2 enables immediate restart. If no parameter is provided, the default is 0. The user must input parameter 1 to input parameter 2. |
   
 5. The schedule-restarts script accepts one numeric parameter:

    | Parameter | Definition |
    | --- | --- |
    | Enable schedule restart/Enable immediate restart |1 or 2. A value of 1 enables schedule restart (this restart is scheduled in 12-24 hours) while 2 enables immediate restart (in 5 minutes). If no parameter is given, the default is 1. |  

> [!NOTE]
> You must mark a script as persisted after you apply it to an existing cluster. Otherwise, any new nodes created through scaling operations will use the default patching schedule.  If you apply the script as part of the cluster creation process, it's persisted automatically.


## Next steps

For specific steps about using script actions, see the following sections in [Customize Linux-based HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md):

* [Use a script action during cluster creation](hdinsight-hadoop-customize-cluster-linux.md#use-a-script-action-during-cluster-creation)
* [Apply a script action to a running cluster](hdinsight-hadoop-customize-cluster-linux.md#apply-a-script-action-to-a-running-cluster)
