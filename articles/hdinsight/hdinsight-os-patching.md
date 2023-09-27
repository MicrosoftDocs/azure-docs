---
title: Configure OS patching schedule for Azure HDInsight clusters
description: Learn how to configure OS patching schedule for Linux-based HDInsight clusters.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 02/01/2023
---

# Configure the OS patching schedule for Linux-based HDInsight clusters

> [!IMPORTANT]
> Ubuntu images become available for new Azure HDInsight cluster creation within three months of being published. Running clusters aren't auto-patched. Customers must use script actions or other mechanisms to patch a running cluster. As a best practice, you can run these script actions and apply security updates right after the cluster creation.

HDInsight provides support for you to perform common tasks on your cluster such as installing OS patches, OS security updates, and rebooting nodes. These tasks are accomplished using the following two scripts that can be run as [script actions](hdinsight-hadoop-customize-cluster-linux.md), and configured with parameters:

- `schedule-reboots.sh` - Do an immediate restart, or schedule a restart on the cluster nodes.
- `install-updates-schedule-reboots.sh` - Install all updates, only kernel + security updates, or only kernel updates.

> [!NOTE]  
> Script actions won't automatically apply updates for all future update cycles. Run the scripts each time new updates must be applied to install the updates, and then restart the VM.
> 
> If you are using a firewall for network restriction, the below URL needs to be in allow list. 
> * http://security.ubuntu.com/ubuntu

## Preparation

Patch on a representative non-production environment prior to  deploying to production. Develop a plan to adequately test your system prior to your actual patching.

From time-to-time, from an ssh session with your cluster, you may receive a message that security updates are available. The message may looks something like:

```
89 packages can be updated.
82 updates are security updates.

*** System restart required ***

Welcome to Spark on HDInsight.

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
| Type of updates to install | 0,  1, or 2 | A value of 0 installs only kernel updates. A value of 1 installs kernel + security updates and 2 installs all updates. If no parameter is provided, the default is 0. |
| Type of restart to perform | 0, 1, or 2 | A value of 0 disables restart. A value of 1 enables schedule restart, and 2 enables immediate restart. If no parameter is provided, the default is 0. The user must change input parameter 1 to input parameter 2. |

> [!NOTE]
> You must mark a script as persisted after you apply it to an existing cluster. Otherwise, any new nodes created through scaling operations will use the default patching schedule. If you apply the script as part of the cluster creation process, it's persisted automatically.

> [!NOTE]
> The Scheduled Restart option does an automated rolling restart of the patched cluster nodes over a period of 12 to 24 hours and takes into account high availability, update domain, and fault domain considerations. Scheduled Restart does not terminate running workloads but may take away cluster capacity in the interim when nodes are unavailable, leading to longer processing times. 

## Next steps

For specific steps on using script actions, see the following sections in [Customize Linux-based HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md):

- [Use a script action during cluster creation](hdinsight-hadoop-customize-cluster-linux.md#script-action-during-cluster-creation)
- [Apply a script action to a running cluster](hdinsight-hadoop-customize-cluster-linux.md#script-action-to-a-running-cluster)
