---
title: Configure OS patching schedule for Azure HDInsight clusters
description: Learn how to configure OS patching schedule for Linux-based HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 01/21/2020
---

# Configure the OS patching schedule for Linux-based HDInsight clusters

> [!IMPORTANT]
> Ubuntu images become available for new Azure HDInsight cluster creation within three months of being published. As of January 2019, running clusters aren't auto-patched. Customers must use script actions or other mechanisms to patch a running cluster. Newly created clusters will always have the latest available updates, including the most recent security patches.

HDInsight provides support for you to perform common tasks on your cluster such as installing OS patches, security updates, and rebooting nodes. These tasks are accomplished using the following two scripts that can be run as [script actions](hdinsight-hadoop-customize-cluster-linux.md), and configured with parameters:

- `schedule-reboots.sh` - Do an immediate restart, or schedule a restart on the cluster nodes.
- `install-updates-schedule-reboots.sh` - Install all updates, only kernel + security updates, or only kernel updates.

> [!NOTE]  
> Script actions won't automatically apply updates for all future update cycles. Run the scripts each time new updates must be applied to install the updates, and then restart the VM.

## Preparation

Patch on a representative non-production environment prior to  deploying to production. Develop a plan to adequately test your system prior to your actual patching.

From time-to-time, from an ssh session with your cluster, you may receive a message that an upgrade is available. The message may looks something like:

```
New release '18.04.3 LTS' available.
Run 'do-release-upgrade' to upgrade it
```

Patching is optional and at your discretion.

## Restart nodes
  
The script [schedule-reboots](https://hdiconfigactions.blob.core.windows.net/linuxospatchingrebootconfigv02/schedule-reboots.sh), sets the type of reboot that will be performed on the machines in the cluster. When submitting the script action, set it to apply on all three node types: head node, worker node, and zookeeper. If the script isn't applied to a node type, the VMs for that node type won't be updated or restarted.

The `schedule-reboots script` accepts one numeric parameter:

| Parameter | Accepted values | Definition |
| --- | --- | --- |
| Type of restart to perform | 1 or 2 | A value of 1 enables schedule restart (scheduled in 12-24 hours). A value of 2 enables immediate restart (in 5 minutes). If no parameter is given, the default is 1. |  

## Install updates and restart nodes

The script [install-updates-schedule-reboots.sh](https://hdiconfigactions.blob.core.windows.net/linuxospatchingrebootconfigv02/install-updates-schedule-reboots.sh) provides options to install different types of updates and restart the VM.

The `install-updates-schedule-reboots` script accepts two numeric parameters, as described in the following table:

| Parameter | Accepted values | Definition |
| --- | --- | --- |
| Type of updates to install | 0,  1, or 2 | A value of 0 installs only kernel updates. A value of 1 installs all updates, and 2 installs only kernel + security updates. If no parameter is provided, the default is 0. |
| Type of restart to perform | 0, 1, or 2 | A value of 0 disables restart. A value of 1 enables schedule restart, and 2 enables immediate restart. If no parameter is provided, the default is 0. The user must change input parameter 1 to input parameter 2. |

> [!NOTE]
> You must mark a script as persisted after you apply it to an existing cluster. Otherwise, any new nodes created through scaling operations will use the default patching schedule. If you apply the script as part of the cluster creation process, it's persisted automatically.

## Next steps

For specific steps on using script actions, see the following sections in [Customize Linux-based HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md):

- [Use a script action during cluster creation](hdinsight-hadoop-customize-cluster-linux.md#script-action-during-cluster-creation)
- [Apply a script action to a running cluster](hdinsight-hadoop-customize-cluster-linux.md#script-action-to-a-running-cluster)
