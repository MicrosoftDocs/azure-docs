---
title: Configure OS patching schedule for Linux-based HDInsight clusters - Azure
description: Learn how to configure OS patching schedule for Linux-based HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 07/01/2019
---
# OS patching for HDInsight 

> [!IMPORTANT]
> Ubuntu images become available for new HDInsight cluster creation within three months of being published. As of January 2019, running clusters are **not** auto-patched. Customers must use script actions or other mechanisms to patch a running cluster. Newly created clusters will always have the latest available updates, including the most recent security patches.

## How to configure the OS patching schedule for Linux-based HDInsight clusters
The virtual machines in an HDInsight cluster need to be rebooted occasionally so that important security patches can be installed. 

Using the script actions described in this article, you can modify the OS patching schedule as follows:
1. Install all updates or install kernel+security updates only or install kernel updates only.
2. Immediate reboot or schedule a reboot on the VM.

> [!NOTE]  
> These script actions will only work with Linux-based HDInsight clusters created after August 1st, 2016. Patches will be effective only when VMs are rebooted. 
> These scripts will not automatically apply updates for all future update cycles. Run the scripts each time new updates need to be applied in order to install the updates and reboot the VM.

## How to use the script 

Using this script requires the following information:
1. The install-updates-schedule-reboots script location: https://hdiconfigactions.blob.core.windows.net/linuxospatchingrebootconfigv02/install-updates-schedule-reboots.sh.
 	
   HDInsight uses this URI to find and run the script on all the virtual machines in the cluster. This script provides options to install updates and reboot the VM.
  
2. The schedule-reboots script location: https://hdiconfigactions.blob.core.windows.net/linuxospatchingrebootconfigv02/schedule-reboots.sh.
 	
   HDInsight uses this URI to find and run the script on all the virtual machines in the cluster. This script reboots the VM.
  
3. The cluster node types that the script is applied to: headnode, workernode, zookeeper. This script must be applied to all node types in the cluster. If it is not applied to a node type, then the virtual machines for that node type will not be updated or rebooted.

4. Parameter: The install-updates-schedule-reboots script accepts two numeric parameters:

    | Parameter | Definition |
    | --- | --- |
    | Install kernel updates only/Install all updates/Install kernel+security updates only |0 or 1 or 2. A value of 0 installs kernel updates only, while 1 installs all updates, and 2 installs kernel+security updates only. If no parameter is provided, the default is 0. |
    | No reboot/Enable schedule reboot/Enable immediate reboot |0 or 1 or 2. A value of 0 disables reboot, while 1 enables schedule reboot and 2 enables immediate reboot. If no parameter is provided, the default is 0. User must input parameter 1 to input parameter 2. |
   
 5. Parameter: The schedule-reboots script accepts one numeric parameter:

    | Parameter | Definition |
    | --- | --- |
    | Enable schedule reboot/Enable immediate reboot |1 or 2. A value of 1 enables schedule reboot (reboot is scheduled in the next 12-24 hours) while 2 enables immediate reboot (in 5 minutes). If no parameter is provided, the default is 1. |  

> [!NOTE] 
> You must mark the script as persisted when applying to an existing cluster. Otherwise, any new nodes created through scaling operations will use the default patching schedule.  If you apply the script as part of the cluster creation process, it is persisted automatically.


## Next steps

For specific steps on using the script action, see the following sections in [Customize Linux-based HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md):

* [Use a script action during cluster creation](hdinsight-hadoop-customize-cluster-linux.md#use-a-script-action-during-cluster-creation)
* [Apply a script action to a running cluster](hdinsight-hadoop-customize-cluster-linux.md#apply-a-script-action-to-a-running-cluster)
