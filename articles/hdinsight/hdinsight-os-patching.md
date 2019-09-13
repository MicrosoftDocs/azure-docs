---
title: Configure the OS patching schedule for Linux-based HDInsight clusters - Azure
description: Learn how to configure OS patching schedule for Linux-based HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 07/01/2019
---
# Configure the OS patching schedule for Linux-based HDInsight clusters 

> [!IMPORTANT]
> Ubuntu images become available for new Azure HDInsight cluster creation within three months of being published. As of January 2019, running clusters aren't auto-patched. Customers must use script actions or other mechanisms to patch a running cluster. Newly created clusters will always have the latest available updates, including the most recent security patches.

Occasionally, you must restart virtual machines (VMs) in an HDInsight cluster to install important security patches.

By using the script actions described in this article, you can modify the OS patching schedule as follows:

1. Install all updates, or install only kernel + security updates or kernel updates.
2. Do an immediate restart, or schedule a restart on the VM.

> [!NOTE]  
> The script actions described in this article will work only with Linux-based HDInsight clusters created after August 1, 2016. Patches are effective only after restarting VMs.
> Script actions won't automatically apply updates for all future update cycles. Run the scripts each time new updates must be applied to install the updates, and then restart the VM.

## Add information to the script

Using a script requires the following information:

- The install-updates-schedule-reboots script location: https://hdiconfigactions.blob.core.windows.net/linuxospatchingrebootconfigv02/install-updates-schedule-reboots.sh.
 	
   HDInsight uses this URI to find and run the script on all the VMs in the cluster. This script provides options to install updates and restart the VM.
  
- The schedule-reboots script location: https://hdiconfigactions.blob.core.windows.net/linuxospatchingrebootconfigv02/schedule-reboots.sh.
 	
   HDInsight uses this URI to find and run the script on all the VMs in the cluster. This script restarts the VM.
  
- The cluster node types that the script is applied to are headnode, workernode, and zookeeper. Apply the script to all node types in the cluster. If the script isn't applied to a node type, the VMs for that node type won't be updated or restarted.

- The install-updates-schedule-reboots script accepts two numeric parameters:

    | Parameter | Definition |
    | --- | --- |
    | Install kernel updates only/Install all updates/Install kernel + security updates only|0,  1, or 2. A value of 0 installs only kernel updates. A value of 1 installs all updates, and 2 installs only kernel + security updates. If no parameter is provided, the default is 0. |
    | No reboot/Enable schedule reboot/Enable immediate reboot |0, 1, or 2. A value of 0 disables restart. A value of 1 enables schedule restart, and 2 enables immediate restart. If no parameter is provided, the default is 0. The user must change input parameter 1 to input parameter 2. |
   
 - The schedule-reboots script accepts one numeric parameter:

    | Parameter | Definition |
    | --- | --- |
    | Enable schedule reboot/Enable immediate reboot |1 or 2. A value of 1 enables schedule restart (scheduled in 12-24 hours). A value of 2 enables immediate restart (in 5 minutes). If no parameter is given, the default is 1. |  

> [!NOTE]
> You must mark a script as persisted after you apply it to an existing cluster. Otherwise, any new nodes created through scaling operations will use the default patching schedule. If you apply the script as part of the cluster creation process, it's persisted automatically.


## Next steps

For specific steps on using script actions, see the following sections in [Customize Linux-based HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md):

* [Use a script action during cluster creation](hdinsight-hadoop-customize-cluster-linux.md#use-a-script-action-during-cluster-creation)
* [Apply a script action to a running cluster](hdinsight-hadoop-customize-cluster-linux.md#apply-a-script-action-to-a-running-cluster)
