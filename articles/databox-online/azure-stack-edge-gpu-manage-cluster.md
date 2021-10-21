---
title: Cluster management on your tow-node Azure Stack Edge device
description: Describes how to manage your Azure Stack Edge two-node device cluster.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 10/21/2021
ms.author: alkohli
---

# Manage your Azure Stack Edge cluster

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article provides a brief overview of clustering-related management tasks on your Azure Stack Edge device. Some of these tasks include adding a node, configuring or modifying a cluster witness or removing the cluster. The cluster can be managed via the local UI or by connecting to the PowerShell interface of your device. 

## About cluster management

Azure Stack Edge can be set up as a single standalone device or a two-node cluster. A two-node cluster consists of two independent Azure Stack Edge devices that are connected by physical cables and by software. These nodes when clustered work together as in a Windows failover cluster, provide high availability for applications and services that are running on the cluster. 

If one of the clustered node fails, the other node begins to provide service (the process is known as failover). The clustered roles are also proactively monitored to make sure that they are working properly. If they are not working, they are restarted or moved to the second node.

Azure Stack Edge uses Windows Server Failover Clustering for its two-node cluster. For more information, see [Failover clustering in Windows Server](/windows-server/failover-clustering/failover-clustering-overview).


## Add a node

## Unprepare a node

## Configure cluster witness

### Set up cloud witness



### Set up local witness

## Configure virtual IPs

## Remove the cluster

In this release, the only way to remove or destroy the cluster is to reset the device. Follow these steps to reset the device:

1. In the local web UI of your first device node, go to **Maintenance > Device reset**.
1. Select **Reset device**.
1. On the **Confirm  reset** dialog, enter **Yes** and select **Yes** to continue with the device reset. Resetting the device will delete all the local data on the device.

The reset process will take approximately 35-40 minutes. Repeat the process for both device nodes.


## Update the cluster







- [Add a node]()
- [Unprepare a node]()
- [Configure cloud witness]().
- [Set up a local witness]().
- [Remove the cluster]().
- [Update the cluster]().
- [Configure virtual IP settings for the cluster]()




## Next steps

- Learn about [VM sizes and types for Azure Stack Edge Pro GPU](azure-stack-edge-gpu-virtual-machine-sizes.md).


