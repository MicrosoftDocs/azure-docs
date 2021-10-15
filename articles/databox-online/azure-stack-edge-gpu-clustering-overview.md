---
title: Overview of clustering on your Azure Stack Edge device
description: Describes clustering on your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 10/15/2021
ms.author: alkohli
---

# Clustering on your Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article provides a brief overview of clustering on your Azure Stack Edge device. 

## About clustering

Azure Stack Edge can be set up as a single standalone device or a two-node cluster. A two-node cluster consists of two independent Azure Stack Edge devices that are connected by physical cables and by software. These nodes when clustered work together as in a Windows failover cluster, provide high availability for applications and services that are running on the cluster. 

If one of the clustered node fails, the other node begins to provide service (the process is known as failover). The clustered roles are also proactively monitored to make sure that they are working properly. If they are not working, they are restarted or moved to the second node.

Azure Stack Edge uses Windows Server Failover Clustering for its two-node cluster. For more information, see [Failover clustering in Windows Server](/windows-server/failover-clustering/failover-clustering-overview).

## Cluster quorum and witness

A quorum is always maintained on your Azure Stack Edge cluster to remain online in the event of a failure. If one of the nodes fails, then the majority of the surviving nodes must verify that the cluster remains online. The concept of majority only exists for clusters with an odd number of nodes. 

For an Azure Stack Edge cluster with two nodes, if a node fails, then a cluster witness provides the third vote so that the cluster stays online (since the cluster is left with 2/3 votes - a majority). For more information on cluster quorum, see [](/windows-server/storage/storage-spaces/understand-quorum).

A cluster witness is required on your Azure Stack Edge cluster. You can set up the witness in the cloud or in a local fileshare using the local UI of your device. 

For more information on cluster witness, see [Cluster witness on Azure Stack Edge](azure-stack-edge-gpu-cluster-witness-overview.md).


## Infrastructure cluster

![Infrastructure cluster of Azure Stack Edge](media/azure-stack-edge-gpu-clustering-overview/azure-stack-edge-infrastructure-cluster.png)

1. The infrastructure cluster consists of the two independent nodes running Windows Server operating system with a Hyper-V layer. The nodes contain physical disks for storage and network interfaces that are connected back-to-back or with switches.
1. The disks across the two nodes are used to create a logical storage pool. The storage spaces direct on this pool provides mirroring and parity for the cluster. 
1. You can deploy your application workloads on top of the infrastructure cluster. 
    1. Non-containerized workloads such as VMs can be directly deployed on top of the Storage Spaces Direct layer.
    1. Containerized workloads use Kubernetes for workload deployment and management. A Kubernetes cluster that consists of a master VM and two worker VMs (one for each node) is deployed on top of the infrastructure cluster. 
    
        The Kubernetes cluster allows for application orchestration whereas the infrastructure cluster provides persistent storage.


## Supported networking topologies

On your Azure Stack Edge device node: 

- Port 2 is used for management traffic.
- Port 3 and Port 4 are used for storage and cluster traffic. This traffic includes that needed for storage mirroring and Azure Stack Edge cluster heartbeat traffic that is required for the cluster to be online.  

Based on the use-case and workloads, you can select how the two Azure Stack Edge nodes will be connected. The following networking toplogies are available: 

![Available network topologies](media/azure-stack-edge-gpu-clustering-overview/azure-stack-edge-network-topologies.png)

1. **Switchless** - Use this option when you don't have high speed switches available in the environment for storage and cluster traffic. 

    In this option, Port 3 and Port 4 are connected back-to-back without a switch. These ports are dedicated to storage and Azure Stack Edge cluster traffic and aren't available for workload traffic. <!--For example, these ports can't be enabled for compute--> Optionally you can also provide IP addresses for these ports.


1. **Using switches and NIC teaming** - Use this option when you have high speed switches available for use with your device nodes for storage and cluster traffic. 

    Each of ports 3 and 4 of the two nodes of you device are connected via an external switch. The Port 3 and Port 4 are teamed on each node and a virtual switch and two virtual NICs are created that allow for port-level redundancy for storage and cluster traffic. These ports can be used for workload traffic as well.

 
1. **Using switches and without NIC teaming** - Use this option when you need an extra dedicated port for workload traffic and port-level redundancy is not required for storage and cluster traffic. 

    Port 3 on each node is connected via an external switch. If Port 3 fails, the cluster may go offline. Separate virtual switches are created on Port 3 and Port 4. 

For more information, see [Choosing network topology when configuring the network on the device nodes]().


## Cluster deployment  

Before you configure clustering, make sure the devices are cabled as per the network topolgoy that you intend to configure. To deploy a two-node infrastructure cluster on your Azure Stack Edge devices, follow these steps:

<!-- insert a high level diagram indicating the deployment steps-->

1. Order two independent Azure Stack Edge devices. 
1. Cable each node independently as you would for a single node device. Based on the workloads that you intend to deploy, connect the network interfaces on these devices via cables, and with or without switches. 
1. Start cluster creation on the first node. Choose the network topology that conforms to the cabling across the two nodes. The chosen topology would dictate the storage and clustering traffic between the nodes.
1. Prepare the second node. Configure the network on the second node the same way you configured it on the first node. Get the authentication token on this node.
1. Use the authentication token from the prepared node and join this node to the first node to form a cluster.
1. Set up a cloud witness using an Azure Storage account or a local witness on an SMB fileshare.
1. Assign a virtual IP to provide an endpoint for Azure Consistent Services or when using NFS. 

For more information, see the 2-node device deployment tutorials starting with [Get deployment configuration checklist](azure-stack-edge-gpu-deploy-checklist.md).



## Cluster management

You can manage the Azure Stack Edge cluster via the PowerShell interface of the device, or through the local UI. Some typical management tasks are:

- [Add a node]()
- [Unprepare a node]()
- [Configure cloud witness]().
- [Set up a local witness]().
- [Remove the cluster]().
- [Update the cluster]().
- [Configure virtual IP settings for the cluster]()

 
## Next steps

- Learn about [VM sizes and types for Azure Stack Edge Pro GPU](azure-stack-edge-gpu-virtual-machine-sizes.md).


