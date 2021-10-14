---
title: Overview of clustering on your Azure Stack Edge device
description: Describes clustering on your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 10/13/2021
ms.author: alkohli
---

# Clustering on your Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article provides a brief overview of clustering on your Azure Stack Edge device. 

## About clustering

Azure Stack Edge can be set up as a single standalone device or a two-node cluster. A two-node cluster consists of two independent Azure Stack Edge devices that are connected by physical cables and by software. These nodes when clustered work together as in a Windows failover cluster, provide high availability for applications and services that are running on the cluster. 

If one of the clustered node fails, the other node begins to provide service (the process is known as failover). The clustered roles are also proactively monitored to make sure that they are working properly. If they are not working, they are restarted or moved to the second node.

For more information on Windows failover clustering, see [Failover clustering in Windows Server]().

## Cluster quorum and witness

A quorum is always maintained on your Azure Stack Edge cluster to remain online in the event of a failure. If one of the nodes fails, then the majority of the surviving nodes must verify that the cluster remains online. The concept of majority only exists for clusters with an odd number of nodes. 

For an Azure Stack Edge cluster with two nodes, if a node fails, then a cluster witness provides the third vote so that the cluster stays online (since the cluster is left with 2/3 votes - a majority). 

A cluster witness is required on your Azure Stack Edge. You can set up the witness in the cloud or in a local fileshare. 

- Cloud witness - Use the cloud witness when both the nodes on your Azure Stack Edge cluster are connected to Azure. To set up a cloud witness, you use an Azure Storage account in the cloud and configure the witness via the local UI of the device. We recommend that you deploy the cloud witness with redundant connections so that the witness is highly available.

    For more information, see [Set up cloud witness via the local UI]().

- Local witness - Use the local witness when both the nodes are not connected to Azure or have a sporadic connectivity. To set up a local witness, you can use an SMB fileshare on a local server in the network where the device is deployed and configure the fileshare path to the server via the local UI. We recommend that you deploy the witness in way that it is highly available. For example, a switch running a file server could be used to host a file share. 

    For more information, see [Set up local witness via the local UI]().

For more information on cluster witness, see [Cluster witness on Azure Stack Edge]().


## Infrastructure cluster

<!--Show the layers of the infrastructure cluster-->

1. The infrastructure consists of the two independent nodes running Windows Server operating system and a hypervisor layer. The nodes contain physical disks for storage and network interfaces that are connected back-to-back or with switches.
1. The disks across the two nodes are used to create a logical storage pool. The storage spaces direct on top of this pool provide mirroring and parity for the cluster. 
1. A Kubernetes cluster consisting of a master and two worker virtual machines (one for each node) is deployed on top of the infrastructure cluster. The Kubernetes cluster allows for application orchestration whereas the infrastructure cluster provides persistent storage.


## Networking topologies

For more information, see [Choosing network topology when configuring the network on the device nodes]().

## Clustering requirements


## Cluster deployment  

To deploy a two-node infrastructure cluster on your Azure Stack Edge devices, follow these steps:

<!-- insert a high level diagram indicating the deployment steps-->

1. Order two independent Azure Stack Edge devices. 
1. Cable each node independently as you would for a single node device. Based on the workloads that you intend to deploy, connect the network interfaces on these devices via cables, and with or without switches. 
1. Start cluster creation on the first node. Choose the network topology that conforms to the cabling across the two nodes. The chosen topology would dictate the storage and clustering traffic between the nodes.
1. Prepare the second node. Configure the network on the second node the same way you configured it on the first node. Get the authentication token on this node.
1. Use the authentication token from the prepared node and join this node to the first node to form a cluster.
1. Set up a cloud witness using an Azure Storage account or a local witness on an SMB fileshare.
1. Assign a virtual IP to provide an endpoint for Azure Consistent Services or when using NFS. 


For detailed step-by-step instructions, see the following tutorials:

<!--insert a 2-column table of tutorials with links--> 


## Cluster management

You can manage the VMs on your device via the Azure portal, via the PowerShell interface of the device, or directly through the APIs. Some typical management tasks are:

- Get information about a VM.
- Connect to a VM, start, stop, delete VMs.
- Manage disks, VM sizes, network interfaces, virtual switches
- Back up VM disks.


## Next steps

- Learn about [VM sizes and types for Azure Stack Edge Pro GPU](azure-stack-edge-gpu-virtual-machine-sizes.md).


