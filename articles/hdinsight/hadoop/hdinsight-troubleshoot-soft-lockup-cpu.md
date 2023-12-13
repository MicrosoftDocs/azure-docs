---
title: Watchdog BUG soft lockup CPU error from Azure HDInsight cluster
description: Watchdog BUG soft lockup CPU appears in kernel syslogs from Azure HDInsight cluster
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 04/28/2023
---

# Scenario: "watchdog: BUG: soft lockup - CPU" error from an Azure HDInsight cluster

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

The kernel syslogs contain the error message: `watchdog: BUG: soft lockup - CPU`.

## Cause

A [bug](https://bugzilla.kernel.org/show_bug.cgi?id=199437) in Linux Kernel is causing CPU soft lockups.

## Resolution

Apply kernel patch. The script below upgrades the linux kernel and reboots the machines at different times over 24 hours. Execute the script action in two batches. The first batch is on all nodes except head node. The second batch is on head node. Do not run on head node and other nodes at the same time.

1. Navigate to your HDInsight cluster from Azure portal.

1. Go to script actions.

1. Select **Submit New** and enter the input as follows

    | Property | Value |
    | --- | --- |
    | Script type | -Custom |
    | Name |Fix for kernel soft lock issue |
    | Bash script URI |`https://raw.githubusercontent.com/hdinsight/hdinsight.github.io/master/ClusterCRUD/KernelSoftLockFix/scripts/KernelSoftLockIssue_FixAndReboot.sh` |
    | Node type(s) |Worker, Zookeeper |
    | Parameters |N/A |

    Select **Persist this script action...** if you want the execute the script when new nodes are added.

1. Select **Create**.

1. Wait for the execution to succeed.

1. Execute the script action on Head node by following the same steps as step 3, but this time with Node types: Head.

1. Wait for the execution to succeed.

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
